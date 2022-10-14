---
layout: page
title: Downloads
---

[![Desktop screenshot thumbnail](/assets/thumb.png)](/assets/screenshot.png)

There are some pre-alpha quality installation media available, alongside
experimental binary package repositories.

These include:

* Live ISO images
* Device images
* Root filesystem tarballs

All images are available [here](https://repo.chimera-linux.org/live).

Live ISO media and root filesystem tarballs are available for the following
architectures:

* `aarch64`
* `ppc64le`
* `riscv64`
* `x86_64`

The `aarch64` and `riscv64` ISO media require UEFI. The `x86_64` media can
use either UEFI or BIOS. The `ppc64le` media work on OpenPOWER (petitboot)
as well as SLOF (PowerVM, qemu) systems.

All live ISO media are available in bare console variant and GNOME desktop
variant (which can also boot to console). They are also hybrid (for both
optical media and USB removable media).

Root file system tarballs are available at least in `minimal` and `core`
variants. They represent the `base-minimal` and `base-core` packages
respectively.

Device images are available for the following devices:

* Raspbery Pi 3/4/400
* Pinebook Pro
* MNT Reform 2 (i.MX8MQ)

Device images also have corresponding root file system tarballs
available. These are like the generic tarballs, but using `base-full`
alongside a device-specific base package.

Device images can be flashed onto storage media, which is device-specific.
Typically that is an SD card (for the initial boot).

At least **1GB of RAM** is recommended for graphical desktop. You may need
more than that if you choose to boot with the ramdisk option, as the whole
system is copied into RAM in those cases. Console images should be able to
boot with much less (likely as little as 128MB).

The GNOME images **by default boot into Wayland**, unless that is not
possible for some reason. If you want to force X11, there is a special
bootloader option for that.

It is possible to use all images with serial console, in addition to regular
display. For ISO images, the right `console=` parameter must be added to
enable it (which will also result in the corresponding `agetty` service
getting enabled). Device images typically come with everything already
set up out of box.

The `console=` parameters include `ttyS0` for `x86_64` machines, `hvc0` or
`hvsi0` for POWER machines, `ttySIF0` for RISC-V machines and `ttyAMA0`,
`ttyS2` or `ttymxc0` for AArch64 machines. It may vary device by device.

**Log in as either `anon` or `root` with the password `chimera`**. Graphical
boot will log in automatically straight into desktop.

There are also [installation instructions](/docs/installation).
