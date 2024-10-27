---
title: New images
layout: post
excerpt_separator: <!--more-->
---

As of 27 October 2024 new images have been published.

These are an incremental refresh with new software,
as well as new image types. They bring various minor changes.

<!--more-->

## Changes

The most notable change is a major update of `apk-tools`. From
now on, we will start requiring changes that were made to it,
so using older images to install is no longer supported.

Experimentally, KDE Plasma ISO images are now available alongside
the GNOME images. The GNOME images are based on GNOME 47, while
the KDE images use Plasma 6.2.

Additionally, the ISO images now use EROFS for its root file system
instead of SquashFS. This brings increased compatibility and increased
performance while in the live environment, in exchange for a minor
increase in image size.

Last but not least, the "force console" GRUB options are now gone
in the graphical ISOs, but the functionality is not. Adding `nogui`
to kernel command line in GRUB's editor will achieve the same.

## Upcoming changes

This is likely the last update before entering the beta phase.
