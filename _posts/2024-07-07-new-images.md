---
title: New images
layout: post
excerpt_separator: <!--more-->
---

As of 07 July 2024 new images have been published.

These are an incremental refresh with new software.
They bring various minor changes.

<!--more-->

## Changes

The biggest visible change is that `core` and `minimal`
rootfs tarballs are no longer distributed; you are expected
to use either the `full` or `bootstrap` tarballs. Any regular
installation is expected to use the `base-full` metapackage
at very least (unwanted components can be removed by masking
them in the `apk` world file).

The images are still based on GNOME 46 and kernel 6.6, but with
all latest updates pulled in.

Otherwise, the images represent 3 months of software updates
in `cports`, which are reflected here.

## Upcoming changes

Before the beta release, there will be at least one more image
refresh. The beta release is expected most likely during the
fall this year.
