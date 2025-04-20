---
title: New images
layout: post
excerpt_separator: <!--more-->
---

The 20250420 set of images is now published.

This is an incremental refresh with some major changes.

<!--more-->

## Changes

There are some major changes in how the images are set up.

One is that EFI/BIOS images now use the Limine bootloader for the
image itself, instead of GRUB. This does not affect what bootloader
is used for the installed system (that is the user's choice) but
it's the first step towards moving GRUB to the `user` repository
eventually.

The PowerPC/POWER images still use GRUB. For installed systems,
the recommended choice is `systemd-boot` on EFI and GRUB elsewhere,
Limine does not yet have distro integration.

The x86 images newly use MBR for best compatibility with all hardware.

Architecture support has been expanded. On top of the existing archs
from before (AArch64, PowerPC, POWER LE/BE, RISC-V, x86_64) we now
ship images for the LoongArch64 architecture.

The AArch64 image list has been expanded, with Rock64 and QuartzPro64
being added.

Various fixes have been made; notably, issues with cross-device links
and local installs with separate `/boot` should be gone, and `apk`
will no longer segfault when network connection is unavailable.

Everything has been updated and the images come with kernel 6.14,
GNOME 48, Plasma 6.3.4, and a variety of updated software.

## Planned changes

For the next image set we plan to provide images for mobile phones
and generally more mobile packaging.

Additionally, the ARMv7 architecture will be introduced to the builders
and then to release images.

Device SD images will automatically grow their root partition and
filesystem on first boot from next time but this has not yet been
deployed.

Additionally, Limine will get distro integration and will become a
convenient option for installation.
