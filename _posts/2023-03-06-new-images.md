---
title: New images
layout: post
excerpt_separator: <!--more-->
---

As of today, a new set of images has been released. This is following
the complete world rebuild that has been going on the last few days.

The new images are therefore generated from these new packages, and
are the last images that are released before the alpha release.

<!--more-->

## World rebuild

The world rebuild has been successful and mostly uneventful on all
architectures. There aren't any or many updated versions, as that
will happen after this.

However, it is very important that the rebuild has happened for the
alpha release that will come soon after this.

## Updates since last post

A lot of the work since the last update has been on cleanups and
overall quality. Overall, a summary:

1. The hardening overhaul fallout has been mostly addressed. There
   may be some crashes left, which will be dealt with over the next
   few weeks.
2. The login stack has been switched from `util-linux` to `shadow`.
3. Various service management fixes and cleanups.
4. Overhaul of `console-setup` to uses non-XKB keymaps by default,
   removing base system dependency on Perl.
5. Chimerautils has been tagged, and various new tools have been
   ported (e.g. `locate`, `whereis`, `script`, `logger`, `cal`,
   and others) and many others have been written from scratch.
6. Util-linux has been split up, and much less of it is now
   installed by default. Several new `chimerautils` tools
   replace its various functionality.
7. Base metapackages have been cleaned up.
8. The system has been switched from `eudev` to `systemd-udev`.
9. Support for kernel `efibootmgr` hook for automatic EFISTUB
   boot entries.
10. Automatic ZFS root detection has been fixed for GRUB, and
    there is now a new tool to detect root for U-Boot menu and
    other places.
11. Overhaul of `agetty` handling, with support for config files
    to specify various parameters such as baud rate.
12. Our system toolchain now defaults to `-fno-semantic-interposition`.
13. The `apk` package manager will not mess up early permissions anymore,
    simplifying binary bootstrapping.

This is not an exhaustive list.

## New images

The new images are mostly an incremental refresh, to allow for cleaner
installations that do not update thousands of packages. There have
been some notable improvements too, however:

1. The new tools `chimera-live-bootstrap` and `chimera-live-chroot`
   to simplify installations.
2. Much improved detection of serial terminals, which means in a lot
   of cases it is not even necessary to specify a `console=` anymore.
   If the kernel is configured to output to serial in any way, the
   respective `agetty` service will be configured, if it exists.
3. The graphical images now use `networkmanager` by default.

## Upcoming alpha

Up next is updating our packages to their latest versions, as a lot of
stuff in the repository is by now fairly out of date. Various minor
improvements will be done while doing this, and issues reported with
the new images will be addressed.

The alpha release should then come a few weeks from now, definitely
during March.

The release will mark the next stage of the project, where adventurous
people will be able to pick it up as their daily driver, and expansion
of the package set can begin.
