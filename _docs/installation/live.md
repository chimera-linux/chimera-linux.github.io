---
layout: book
title: Live images
section: 2.2
---

This page describes installation using live images. If you are reading
this, you are expected to have a computer supported by the live images,
and to have acknowledged that **Chimera is not production-ready yet**.

## Picking the right image

Every ISO image comes in two flavors. You have the base image, and the
desktop image.

### Base images

Base images are fully bootable. However, they only come with a small
set of packages and therefore only provide a console environment. You
should use base images if you want complete control over what your
final system will be like, but such setups also require more knowledge.

### Desktop images

Desktop images come with a full graphical environment. The official
desktop for Chimera is GNOME. There are other graphical environments
available in the repositories.

If you want a GNOME setup, you will want to use a desktop image. It
comes with a more complete environment including a web browser and
other basic software.

Desktop images by default boot into a Wayland environment. There is
a separate bootloader option if that does not work for you for some
reason.
