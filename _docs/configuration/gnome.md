---
layout: book
title: GNOME
section: 4.08
---

GNOME is the default desktop of Chimera.

## Installation

The easiest way is to use the `base-desktop` metapackage.

```
# apk add base-desktop
```

This adds `gnome` as well as several things a desktop session
will typically want, including graphics drivers.

It is possible to install those things individually for more
fine-grained control. Those users may also be interested in the
`gnome-core` package which only installs a relatively bare desktop
without auxiliary apps.

## Starting

Keep in mind that GNOME requires `elogind`. In a typical setup, this
is enabled by default, i.e. requires explicit masking to avoid. You
do not need to manually enable `elogind` if you have not removed
its service link. Likewise, it requires `dbus`, both system and
session bus, see [D-Bus](/docs/configuration/dbus).

You can start GNOME either manually, or from a display manager,
typically GDM.

### GDM

The recommended way to start GNOME is through GDM. This makes sure
all the necessary variables are set up as well as enables the lock
screen to work (which depends on communication with GDM).

GDM can also be used to start other desktops.

Typically, all you need to do is enable the service:

```
# dinitctl enable gdm
```

That will make it start on every boot. If you want to run it just
once, you can also do:

```
# dinitctl start gdm
```

After that, you only need to log in.

#### GDM with Xorg

Normally, GDM will default to Wayland. There are some specific cases
where Wayland is disabled, most of them not relevant to Chimera, but
e.g. when missing modesetting.

Other people may want to disable Wayland manually for other reasons.

To force-disable Wayland in GDM, edit the `/etc/gdm/custom.conf` file
and uncomment the `WaylandEnable=false` line.

Note that this will not make GDM with Xorg work right away, as Chimera's
Xorg setup is unprivileged and the X server started by GDM will not be
allowed to switch VTs, see [Xorg](/docs/configuration/xorg).

### Manual startup

**This is not recommended as some functionality will not work**, such
as the lock screen, but it can still be useful for debugging and specific
setups. However, do keep in mind that this will also interfere with
management of graphical user services and so on at a later point (and
these instructions will change).

For Wayland (recommended), you need to log in on the desired tty
and run something like:

```
$ gnome-shell --wayland
```

This will give you a shell, but for example the settings app will
not work. You can fix that by exporting the following variable first:

```
$ export XDG_CURRENT_DESKTOP=GNOME
```

For X11, you can create an `.xinitrc` script, and put the following
inside:

```
gnome-session
```

Then you need to give it appropriate permissions (must be executable
by your user). Then you can simply use `startx`.
