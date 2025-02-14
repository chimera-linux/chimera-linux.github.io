---
title: New images and welcoming new committers
layout: post
excerpt_separator: <!--more-->
---

As of 04 December 2024 new images have been published.

While there weren't originally supposed to be any more images
before reaching the beta phase, a new apk feature proved to
be necessary.

Other than that, it's an incremental refresh with software
updates.

<!--more-->

## New committers

We have two new committers, Jami Kettunen (deathmist) and
Isaac Freund (ifreund). Both have been a part of our community
for a long time and are active contributors; congratulations :)

Unfortunately, another of our contributors, nekopsykose, has
left the project recently. We thank her for being a part of
the community and all of the work over the years and wish her
the best.

## Changes

The `apk-tools` package manager has been updated again, ahead
of implementing a new kernel backup system. New static binaries,
new OCI images, and other things have also been updated to use
this new version of `apk`.

That means this image set is now the minimum that can be used
to perform new installations, unless you update `apk-tools`
in the live environment beforehand.

Various software has been updated. Linux kernel 6.12 is now the
default, most notably.

The ISOs now have a bootable partition in the protective MBR.
That means compatibility with certain x86 BIOS machines should
be better.

## Upcoming changes

This is likely the last update before entering the beta phase,
for real this time.
