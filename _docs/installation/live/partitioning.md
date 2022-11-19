---
layout: book
title: Partitioning
section: 2.1.3
---

This part assumes that you have decided to install Chimera on a disk
and that you have managed to successfully boot the live media and log
in to it.

The first part of any installation is to partition your target drive.
This will differ depending on your architecture and system firmware,
but some parts will always be the same.

Let's assume that the target disk drive is `/dev/sda`. Let's start
with wiping everything on it:

```
# wipefs -a /dev/sda
```

Then, the easiest way to initialize a partition table and create
partitions is with the `cfdisk` TUI program:

```
# cfdisk /dev/sda
```

## BIOS x86 systems

Keep in mind that using a BIOS system will make you unable to boot
from an NVMe SSD if you have one. Linux will still see the SSD, but
the system firmware will not be able to locate it. Therefore, if you
have one, use UEFI.

In general BIOS systems should use the MBR partition table. This is
somewhat limiting (only 4 partitions) but also the most compatible.

It is possible to use GPT if you create a special partition sized
1MB with the type `BIOS boot` (`21686148-6449-6E6F-744E-656564454649`)
and no filesystem at the beginning, which will allow the bootloader
to install, but unless you have a special reason to do that, you
should use MBR.

If you end up using MBR, pick the `dos` option if using `cfdisk`.

You technically only need one partition, the root partition. If you
want more (e.g. separate `/boot` or `/home`, or swap) that is up to you.

Ensure to toggle the Bootable flag on the partition containing `/boot`.

## POWER systems

If using an OpenPOWER system, only one partition is necessary (the root
partition) and the partition table does not matter.

PowerVM systems as well as Qemu virtual machines with the `pseries`
machine types can use both MBR and GPT, but MBR is recommended for
best compatibility. You will need at very least two partitions, the
first partition (with bootable flag on) should have around 1 megabyte
and type `PPC PReP Boot` and the second partition will be your root.

## UEFI systems

You will need a GPT partition table. You will need a partition of type
`EFI System` that is around 200MB (smaller will generally work, but
some firmwares may have problems) and then any other partitions you
want.

## Swap

It is not required to have a swap partition, but especially on low RAM
systems it is recommended (and even if you have plenty, it is still
recommended to have at least some swap).

A good amount is at least 4 gigabytes. Swap is mandatory for hibernation,
if you are going to hibernate you may need a lot more than that to
be safe.

The partition type should be `Linux swap`.

## Boot partition

On most systems, you will not need a separate `/boot` partition, but
if you make one, make sure it will fit at least 4 kernels and their
initramfs images, a good minimum is around 250 megabytes.

On UEFI systems, it is also possible to make your ESP and `/boot`
a single partition. If it is not, then the ESP will be mounted under
`/boot/efi` in most cases.
