---
title: New images again
layout: post
excerpt_separator: <!--more-->
---

A new set of images has been released once again.

This is once again a refresh without any major functionality
changes outside of new software; but it does bring important changes
to apk-tools as well as out of the box support for Raspberry Pi 5. It
comes with GNOME 45 and kernel 6.1.

<!--more-->

## Changes

As far as live-specific changes go, the strange GRUB message about
"booting in blind mode" should now be gone. This was always harmless
but was causing confusion in some users.

Additionally, the version of apk-tools available in these images comes
with full support for xattr metadata. That means we will stop using
post-install scripts for this in repo packages and instead migrate to
this. That means you should always install from at least this version
of the images from now on - older images may not work correctly for
installations.

Raspberry Pi 5 is now supported in the Raspberry Pi images. The support
has been present in cports since October and you could always generate
your own image with chimera-live, but now there is no need to as the
available images will work.

Outside of that, a lot of software has been updated, which affects the
live image as well. Most notably, this means using GNOME 45 now.

## Upcoming changes

This is a transitional set. The next set of images will probably come
in relatively near future; this will bring some more major changes,
for instance the Linux 6.6 kernel (which will become the new LTS) as
well as quite possibly an installer and support for zstd in packages
instead of zlib/deflate.
