---
layout: book
title: Seat management
section: 4.3
---

This is usually necessary for a graphical session. In most cases,
in Chimera `elogind` performs the task.

## elogind

The `elogind` daemon manages user logins as well as auxiliary tasks
such as system power handling. Big desktops will require `elogind`;
GNOME requires it, and Xorg in Chimera also requires it, as Chimera's
Xorg is fully unprivileged.

The daemon also manages the `XDG_RUNTIME_DIR` path and environment
variable, and even smaller graphical desktops rely on that.

If installed, it comes with default service links. That means most
users will get it out of box. It is also a dependency of `base-full`.

It is the recommended solution; avoiding it is at your own risk.

## seatd

Some setups can use an alternative to `elogind` in form of `seatd`,
particularly `wlroots`-based Wayland compositors.

Keep in mind that `seatd` very much conflicts with `elogind`, so
ensure that only one is running. You will need to manually enable
the `seatd` service. The daemon also does much less than `elogind`
does, so e.g. system power management is not handled by it.

Most importantly, `XDG_RUNTIME_DIR` is not managed by `seatd`.
In such cases, `dinit-userservd` of the service management suite
can fill in and manage it. To make it do that, enable the respective
option in `/etc/dinit-userservd.conf`.

You can also create this directory manually, as long as you ensure
that it has the right permissions. The environment variable is
exported into the user session by `dinit-userservd`, so if you
do not let `dinit-userservd` manage it and end up changing the
path, you will need to tweak the configuration file regardless.
