---
layout: book
title: Image types
section: 2.2
---

## Live ISO images

Every ISO image comes in two flavors. You have the base image, and the
desktop images.

### Base images

Base images are fully bootable. However, they only come with a small
set of packages and therefore only provide a console environment. You
should use base images if you want complete control over what your
final system will be like, but such setups also require more knowledge.

### Desktop images

Desktop images come with a full graphical environment. The official
desktop for Chimera is GNOME. There are also images with KDE Plasma.
Other graphical environments are available in the repositories.

Note that any image can be used to install any desktop. The images
merely boot into that desktop for the live environment and a local
(non-network) installation will by default install it.

Desktop images boot into a Wayland environment.

## Device images

Some devices cannot be supported with the live images.
They are typically single-board computers that use the `U-Boot` or a similar
bootloader.

Chimera has the compressed `.img` files for download, which can be flashed
onto an SD card or similar. It also comes with rootfs tarballs from which
the `.img` files can be generated using Chimera's tooling.
