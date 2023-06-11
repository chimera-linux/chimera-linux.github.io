---
layout: book
title: Image types
section: 2.1
---

## Live ISO images

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

## Device images

Some devices cannot be supported with the live images.
They are typically single-board computers that use the `U-Boot` or a similar
bootloader.

Chimera has the compressed `.img` files for download, which can be flashed
onto an SD card or similar. It also comes with rootfs tarballs from which
the `.img` files can be generated using Chimera's tooling.
