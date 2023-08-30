---
layout: book
title: Post-installation
section: 4.01
---

After installation, there are several things you may want to do.
You can do those either while still in the `chroot` (when installing
from live media) or after your first boot.

## Create a user

Immediately after installation, you will typically only have the `root`
user. You should not be using `root` as your regular user. Creating one
is easy:

```
# useradd myuser
```

Set a password, so you can log in:

```
# passwd myuser
```

While at it, you might want to add your user to some groups. This is
not strictly necessary. Some groups that might be useful:

* `wheel` is the local administrator group
* `kvm` will let your user handle virtual machines
* `plugdev` will let you access removable devices where there is no
  other (e.g. policy-based) mechanism
* `audio` and `video` might be necessary to access audio/video devices,
  but on most systems this is not necessary thanks to `elogind` and
  similar

To add your user to a group or groups:

```
# usermod -a -G wheel,kvm myuser
```

You should avoid adding your user to groups you do not strictly need.

## Set a hostname

The system hostname is set by writing it into `/etc/hostname`. Therefore,
simply do the following:

```
# echo chimera > /etc/hostname
```

## Set your time zone

The time zones are in `/usr/share/zoneinfo`. Setting the default time
zone is done by symlinking it to `/etc/localtime`. For example, if
your time zone is `Europe/Prague`, you can do the following:

```
# ln -sf /usr/share/zoneinfo/Europe/Prague /etc/localtime
```

## Hardware clock

By default, the hardware clock in Chimera is stored as UTC. Typically
this does not matter, but if you are e.g. dual booting with Windows,
which does not use UTC, this will result in a conflict. You can mitigate
this by making Chimera use `localtime` (or you can make Windows use UTC).

If you want to adjust Chimera, you can do something like this:

```
# echo localtime > /etc/hwclock
```

You can explicitly set `utc` in a similar manner if you wish.

## Time syncing with NTP

You might want to make sure your date/time remains synchronized from
NTP servers. The recommended option is `chrony`, which you can easily
add and enable like this:

```
# apk add chrony
# dinitctl enable chrony
```

## Console setup

Chimera uses the same `console-setup` system as Debian. Most users
should not have any reason to change things, but if you want to tweak
things such as console keymap and font, you can tweak them in the same
manner.

There are two files that should be of interest:

* `/etc/default/console-setup` configures the console (e.g. font)
* `/etc/default/keyboard` configures the keyboard (e.g. keymap)

Both files have detailed man pages, see `man 5 console-setup` as well
as `man 5 keyboard`.

## Additional software

If you need software beyond what the `main` repository provides, you
might want to enable the `contrib` repo. The `contrib` repository has
a variety of additional, especially GUI, software that is not a good
fit for `main`.

The [Package management](/docs/apk) will tell you how, as well as be
an overall good starting point for other things.
