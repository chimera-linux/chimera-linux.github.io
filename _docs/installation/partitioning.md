---
layout: book
title: Partitioning
section: 2.4
---

This part assumes that you have decided to install Chimera on a disk
and that you have managed to successfully boot the media and log
in to it.

When installing onto devices that use device images instead of live ISOs,
an alternative to partitioning and installing the system manually is to
get the image again and flash it to the target media the same way as you
flashed it onto the SD card. To do that, follow the
[Preparing media](/docs/installation/prepare) page again. Do note that
this comes with reduced flexibility regarding e.g. choosing your
filesystems.

If you are installing manually, you will need to partition your target
drive. This will differ depending on your architecture and system firmware,
but some parts will always be the same.

If you wish to use [Disk encryption](/docs/installation/partitioning/encrypted),
that will influence the way you partition your drive.

Let's assume that the target disk drive is `/dev/sda`. Let's start
with wiping everything on it:

```
# wipefs -a /dev/sda
```

If there was LVM on the drive before, this might fail with an error
such as `Device or resource busy`. This is because the volume group
might have gotten set up on boot. In such cases, you will want to
bring it down, e.g. with:

```
# vgchange -an
```

After that, `wipefs -a` should work. You might have to perform
similar things for `dmraid`/`mdadm` and so on.

In any case, once you have wiped the drive, the easiest way to
initialize a partition table and create partitions is with the
`cfdisk` TUI program:

```
# cfdisk /dev/sda
```

If you wish to have your root file system on ZFS, please read this
page and then go to [Root on ZFS](/docs/installation/partitioning/zfs).

## Legacy BIOS x86 systems

**Required partitions:**

1. Root filesystem partition

**Partition table: MBR (DOS)**

Legacy BIOS setups only strictly need one partition. Do keep in mind
that if you have an NVMe SSD, you will be unable to boot from it.
Linux will see the SSD, but the BIOS will not. Use UEFI for NVMe.
In fact, use UEFI unless you really can't.

MBR is limited to 4 partitions and 2 terabytes. When using BIOS,
you should nearly always use MBR.

Use the `dos` option in `cfdisk`. Mark the partition containing `/boot`
with the **bootable flag**.

### GPT with legacy BIOS

It is possible to use GPT if you create a special partition sized
1MB with the type `BIOS boot` (`21686148-6449-6E6F-744E-656564454649`)
and no filesystem at the beginning, which will allow the bootloader
to install. This may or may not work.

## UEFI

**Required partitions:**

1. EFI System
2. Root filesystem

**Partition table: GPT**

UEFI is the system of choice on most modern x86_64 systems, as well
as a variety of systems of other architectures such as AArch64 and
RISC-V.

Create a partition of type `EFI System` that is at least 200 megabytes.
Smaller partitions will usually work, but some firmware may have issues.

Outside of that, the partition layout is up to you.

## OpenPOWER

**Required partitions:**

1. Root filesystem

**Partition table: any (usually GPT)**

OpenPOWER systems have an onboard bootloader that is a part of the
system firmware, and run Linux as their system firmware. Therefore,
they can use many different partition tables.

You will usually want GPT though.

## PowerVM and other OpenFirmware POWER

**Required partitions:**

1. PowerPC PReP Boot
2. Root filesystem

**Partition table: MBR or GPT**

Non-OpenPOWER systems of the POWER archictecture are usually this.
Virtual machines (qemu) are usually also this. These systems use
variants of OpenFirmware (IEEE1275).

The first partition should be of `PowerPC PReP Boot` type and it should
have around a megabyte. Virtual machines and newer physical systems
will happily use either MBR or GPT, but you might want to stick with
MBR for compatibility.

## Raspberry Pi

**Required partitions:**

1. The `/boot` partition
2. Root filesystem

**Partition table: MBR**

For Raspberry Pi, you will need a MBR partition table witha dedicated
partition for `/boot`. On Raspberry Pi 4 and newer, GPT may technically
work, but MBR is recommended for best compatibility.

## U-Boot

**Required partitions:**

1. Typically an SPL partition
2. Typically a U-Boot partition
3. The `/boot` partition
4. Root filesystem

**Partition table: typically GPT**

The specifics of U-Boot partitioning vary wildly, but in a typical case
the arrangement will be two small partitions for SPL and U-Boot, followed
by a `/boot` partition and a root filesystem.

Technically SPL and U-Boot usually do not need dedicated partitions, but
it is better to create them for clarity. The alternative is to have only two
partitions, making sure the first one starts at a sufficient offset not to
conflict with the firmware, and then manually write the firmware into the
empty space before at the right offsets.

Some devices do require actual partitions for U-Boot and SPL though, and
some even need them to be special partition types. For devices where they
are not needed, a good partition type to use is `Linux reserved` which has
the GUID `8DA63339-0007-60C0-C436-083AC8230908`. For the `/boot` partition
you might want to use the type `Linux extended boot` which has the GUID
`BC13C2FF-59E6-4262-A352-B275FD6F7172`.

In any case, the specifics of your device partitioning should come with
your device's documentation. For devices that Chimera supports, known
partition layouts can be found [here](https://github.com/chimera-linux/chimera-live/tree/master/sfdisk).

## Other partitions

### Swap

This is not required, but you might want one, depending on your system
RAM and other requirements (e.g. hibernation). The partition type should
be `Linux swap`.

A good amount is at least 4 gigabytes. The old guidelines for swap size
based on your physical RAM no longer apply these days.

Note that if you are planning to use disk encryption with LVM, you will
most likely want to make swap a part of your LVM, as swap can expose
secrets.

### Separate `/boot`

You can also have a separate `/boot` partition if you like and not already
mandatory. On EFI systems it is also possible to combine your `/boot` with
the ESP. That allows for the following layouts:

1. Root, `/boot` and ESP separate (3 partitions)
2. Root, combined `/boot` and ESP (2 partitions)
3. Root with `/boot`, separate ESP (2 partitions)

It mostly comes down to your preference and special circumstances such as
Secure Boot systems and the bootloader of choice.

Sometimes, you may need a separate `/boot` because of your bootloader,
if the bootloader does not support your root filesystem of choice.

It may be a good idea to make the `/boot` partition of type `Linux extended boot`,
or `bc13c2ff-59e6-4262-a352-b275fd6f7172`, when using GPT. This is for better
compatibility with some UEFI bootloaders.

### Separate `/usr`

This configuration is not supported in Chimera, as it's a fully usrmerged
system. Please do not attempt this.

### Separate `/home`

This is up to you and can be used with all layouts.
