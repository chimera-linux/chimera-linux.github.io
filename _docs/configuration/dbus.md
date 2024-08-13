---
layout: book
title: D-Bus
section: 4.03
---

The D-Bus setup in Chimera is different from a typical non-systemd
distribution, so it is documented here separately.

## System and session bus

A typical system, regardless of service manager, will have two buses.
The system bus runs as `root` and is shared, while the session bus
runs as user and is specific to some vague session.

D-Bus services can utilize the system bus or session bus depending
on what they are handling. A lot of desktop things utilize the
session bus.

Regardless of system or session, a bus has a Unix domain socket somewhere.
Things using the bus connect to this socket internally. The path to the
session bus socket is in the user's environment, under the variable
called `DBUS_SESSION_BUS_ADDRESS`.

## Typical non-systemd distribution

In a usual non-systemd distro, the D-Bus session bus is launched either
explicitly (using `dbus-launch` or `dbus-run-session` depending on context),
or by the desktop environment. That means things using the session bus for
example within an X11 instance will see the bus, but if you switch tty and
log in, nothing in that tty will be able to. The variable may look like this:

```
DBUS_SESSION_BUS_ADDRESS=unix:abstract=/tmp/dbus-BlaBlaBla,guid=66699aba75555bbbc31444d363666581
```

## Systemd

When using Systemd, the situation is quite different. You have the
`logind` daemon tracking the session and the session is shared for
all logins regardless of virtual terminal. And Systemd also manages the
session bus for you, thanks to user services, so regardless of the virtual
console or X11 or Wayland desktop or whatever you go to, you will always
get the same session bus socket, and it will look like this:

```
DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus
```

This is very practical, and solves many gotchas.

## Chimera

In Chimera, things work quite similarly to Systemd. Since Chimera comes
with implicit support for user services, it can also afford to handle
this.

When you install the `dbus` package in Chimera, you will typically get
the `-dinit` subpackage with the service files, as well as `-dinit-links`
which contains default service links for both the system and session bus,
in form of system and user service links respectively.

That means D-Bus handling in Chimera is completely out of box by default.
You simply install it, and Dinit will activate it, both for system bus
and for user logins, and there is absolutely nothing to do from the
user's side.

Of course, if that for some reason does not work for you, you can mask
the `dbus-dinit-links` package, and manage things however you want.

Additionally, you should never run anything with `dbus-run-session` or
similar. Doing so results in a nested session bus being launched which will
result in things running in it not being seen by things running in the
global session bus. It's also completely unnecessary.
