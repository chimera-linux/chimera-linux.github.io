---
title: 2024 image refresh
layout: post
excerpt_separator: <!--more-->
---

The images have been refreshed yet again.

Most importantly these bring the 6.6 LTS kernel, an upgrade from
the 6.1 series (except Raspberry Pi images, which have their own
kernel) alongside minor user experience improvements.

<!--more-->

## Changes

We have upgraded the LTS kernel series from 6.1 to 6.6. Meanwhile,
the installable "stable" kernel is now at 6.7.x.

Raspberry Pi images had their firmware updated, so wireless networking
and Bluetooth should work equally well on 3, 4, and 5.

The apk package manager got a fix which likely resolves the issue when
some directories were very rarely created with 000 permissions. This
is not yet verified however, as the issue was not reproducible and
therefore it is not possible to verify it.

Minor user experience improvements include support for `fstab` `LABEL=`
and the likes for swap devices, support for timedated/localed/hostnamed
D-Bus services (mainly benefits GNOME) thanks to the openrc-settingsd
project from Gentoo/postmarketOS, various package updates, more atomic
apk transactions thanks to deployment of sysusers.d and tmpfiles.d,
chimerautils fixes (e.g. `stdbuf` command now works properly), the
`lsinitramfs` and `unmkinitramfs` commands have been fixed, the `cryptsetup`
initramfs scripts have their module copying fixed, Python 3.12, and a
ton of other things.

## Upcoming changes

We will likely introduce an installer in one of the future images,
likely before beta release.
