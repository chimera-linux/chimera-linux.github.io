---
layout: book
title: Service management
section: 4.2
---

Chimera relies on [Dinit](https://davmac.org/projects/dinit) as
its service manager and init system. On top of Dinit itself, it
comes with its own suite of core services as well as extra tooling
for additional functionality.

Dinit is a supervising service manager, which means it tracks
the daemons it manages and is fully aware of their current state.
This is in contrast to the traditional `rc` systems, but similar
to projects like Systemd, S6 and Runit.

It is dependency-based, which means services can specify which
other services they depend on to control startup and shutdown
ordering. In addition to that, it also allows for explicit startup
ordering without dependency links, and provides various other
functionality, such as oneshots, scripted services, readiness
notification, rudimentary socket activation and so on.

## Basic usage

Dinit is controlled with the `dinitctl` command. For exmaple to
enable or disable a service:

```
# dinitctl enable sshd
# dinitctl disable sshd
```

What this does is simply create a symlink in `/etc/dinit.d/boot.d`.
The `dinitctl` command only works when the service manager is running.

To get a status of a service:

```
# dinitctl status sshd
```

To list activated services and their status:

```
# dinitctl list
```

## Service files

Dinit relies on service files to describe the services. A service
file can look for example like this:

```
# foo service
type = process
command = /usr/bin/foo --run-on-foreground
depends-on = bar
waits-for = baz
before = login.target
```

This is a `process` service, which means Dinit will supervise it.
It could also be a `bgprocess` service which cannot reliably be
supervised, or a `scripted` service that is just a oneshot.

It depends on `bar`, which means `bar` will start first. On
shutdown, `foo` will stop first. It will also wait for `baz`
to come up before starting, but will not form a dependency
link. And lastly, it will try to start before `login.target`.

## Default service directories

Chimera's Dinit configuration will scan several directories for
service files:

* `/etc/dinit.d`
* `/usr/local/lib/dinit.d`
* `/usr/lib/dinit.d`

Links to services enabled by the admin are in `/etc/dinit.d/boot.d`.

The system can install some default-enabled Dinit links which will
be in `/usr/lib/dinit.d/boot.d`. Those are installed by special packages
suffixed with `-dinit-links` and can be masked by the admin.

## Targets

Chimera's services suite comes with support for targets. Targets are
services which do not track any daemons (they are Dinit's `internal`
service type) and act as ordering sentinels.

Outside of their name, they are ordinary services; the name has the `.target`
suffix. There is a variety of targets that comes with Chimera's core service
suite.

Notable targets that are used by regular daemon services include `login.target`
as well as `init-done.target` and `init-local.target`. There are also
targets that define a concrete event, for example `time-sync.target` for
when date/time has been synchronized, and `network.target`.

The documentation is currently lacking but you can read up on all the targets
[here](https://github.com/chimera-linux/dinit-chimera/blob/master/README.md).

## User services

Chimera comes with support for user services by default. While Dinit
itself has satisfactory baseline support for user services, it has no
infrastructure to manage the user instances. That's why Chimera has its
own system, [turnstile](https://github.com/chimera-linux/turnstile).

This is implicitly activated and works out of box, so the user does not
have to do anything. The daemon is configured via `/etc/turnstile/turnstiled.conf`.

By default, the following paths are scanned for user services:

* `~/.config/dinit.d`
* `/etc/init.d/user`
* `/usr/local/lib/dinit.d/user`
* `/usr/lib/dinit.d/user`

Links to services enabled by user are in `~/.config/dinit.d/boot.d`. The
system can also enable some user services for all users implicitly, by
placing links in `/usr/lib/dinit.d/user/boot.d`.

There are more things `turnstile` also does, such as managing the
`XDG_RUNTIME_DIR` environment variable and directory as well as track
the D-Bus session bus address in the user's environment. See the
[Seat management](/docs/configuration/seat) page for more information.

### User service lingering

By default, upon first login of the user, the user's activated services come
up, while upon last logout of the user, they are shut down. This is not
always the desired behavior.

In order to fix that, `turnstile` provides the "linger" functionality.
When this is on, user services come up with the first login as usual, but
they do not shut down with the last logout.

By default, this is configured per user. To enable lingering for user `myuser`:

```
# touch /var/lib/turnstiled/linger/myuser
```

To disable it, simply remove the file.

Lingering is checked on last logout. That means if you log in, create the
linger file and then log out, your services will stay up. If you log in
again, remove the file and log out again, the services will shut down.

## rc.local

The system administrator can create the script `/etc/rc.local`, which is run
after early init is done, and either before or in parallel with regular
service startup.

This can be used to run things that are unfit for regular service handling.
