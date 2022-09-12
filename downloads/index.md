---
layout: page
title: Downloads
---

[![Desktop screenshot thumbnail](/assets/thumb.png)](/assets/screenshot.png)

There are some initial live ISO images available for testing, alongside
experimental binary package repositories. Keep in mind that these
may have various issues and are pre-alpha quality.

You can download images for the following targets:

* `x86_64` - graphical (GNOME)
* `x86_64` - console only
* `ppc64le` - graphical (GNOME)
* `ppc64le` - console only

All images are available [here](https://repo.chimera-linux.org/live).

There are also `aarch64` platform images for Raspberry Pi (3 and 4, all
variants including 400 and compute modules) and Pinebook Pro. There
are no ISO images for aarch64 yet (GRUB is not ready). The device images
are console-only, but a desktop environment can be installed into them.

In addition to ISOs and device images, there are also rootfs tarballs
(in `base-minimal` and `base-core` variants for all architectures as
well as platform tarballs for the same devices as the device images).

The graphical images are universal (you can boot them either into GUI
or into console depending on the bootloader menu entry).

The `x86_64` images can boot on either BIOS or UEFI machines. The `ppc64le`
images require a SLOF-based or OpenPOWER machine with at least POWER8
processor or equivalent (VSX support is required).

The images are hybrid (you can boot them off either USB stick or optical
media).

The AArch64 device images can be flashed directly onto storage media,
typically an SD card (or eMMC storage).

At least **1GB of RAM** is recommended for graphical desktop. You may need
more than that if you choose to boot with the ramdisk option, as the whole
system is copied into RAM in those cases. Console images should be able to
boot with much less (likely as little as 128MB).

The GNOME images **by default boot into Wayland**, unless that is not
possible for some reason. If you want to force X11, there is a special
bootloader option for that.

It is also possible to boot the images via **serial console**. You can do
that by editing the right bootloader entry and adding a `console=` parameter,
e.g. `console=ttyS0` for x86_64 machines and `console=hvc0` or `console=hvsi0`
for POWER machines. The image will detect this and enable the respective
`agetty` services.

**Log in as either `anon` or `root` with the password `chimera`**. Graphical
boot will log in automatically straight into desktop.

For the time being, the ISO images contain the complete toolchain to bootstrap
the `cports` tree from source code without using `bootstrap.sh`. This will not
be the case with production images with binary repositories available.

There are also [installation instructions](/docs/installation).
