---
layout: book
title: Seat management
section: 4.4
---

This is usually necessary for a graphical session. In most cases,
in Chimera `elogind` performs the task.

## XDG_RUNTIME_DIR

This is an environment variable and path that many services and
applications rely on, particularly those that use `logind` but
also others.

The `XDG_RUNTIME_DIR` environment variable's value is a path. The
path is created when the user logs in, and is deleted when last
login logs out, unless there are lingering services for the user.

The typical value is `/run/user/UID` where `UID` is the user ID
of the user.

In most distributions that use systemd, the env var is set by the
`pam_systemd` module, with `logind` creating it as it keeps track
of the login. In many non-systemd distributions, the same task is
done by `elogind`.

In Chimera, `elogind` has this functionality disabled. Instead, it
is created and tracked by the `dinit-userservd` user service system.
That means whichever solution you use for seat management, you will
always have your runtime directory managed by `dinit-userservd`.

The main reason for this is that when using the "linger" option with
user services, the directory needs to remain there as long as the
services are running, which is not possible to reliably ensure with
`elogind` unless you set the linger bit separately in `elogind` too
(and even that does not cover all cases).

The other main reason is convenience, as it means a single solution
for all seat management daemons.

## elogind

The `elogind` daemon manages user logins as well as auxiliary tasks
such as system power handling. Big desktops will require `elogind`;
GNOME requires it, and Xorg in Chimera also requires it, as Chimera's
Xorg is fully unprivileged.

If installed, it comes with default service links. That means most
users will get it out of box. It is also a dependency of `base-full`.

It is the recommended solution; avoiding it is at your own risk.

## seatd

Some setups can use an alternative to `elogind` in form of `seatd`,
particularly some specific Wayland compositors such as Weston and
those based on the `wlroots` library.

Keep in mind that `seatd` very much conflicts with `elogind`, so
ensure that only one is running. You will need to manually enable
the `seatd` service. The daemon also does much less than `elogind`
does, so e.g. system power management is not handled by it.
