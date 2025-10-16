---
layout: book
title: Partitioning
section: 2.5
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

Create a partition of type `EFI System`. It can be any size; if you
plan to use it for `/boot`, recommended size is 1 gigabyte to accomodate
multiple kernels and initramfs.

If you only plan to use it for bootloader, you can make it as small as
a few megabytes (`systemd-boot` fits under 1M, GRUB is bigger),
though in rare cases some UEFI implementations may take issue if it's
smaller than ~200 megabytes.

Create a partition of type `EFI System` that is at least 200 megabytes.
Smaller partitions will usually work, but some firmware may have issues.

Outside of that, the partition layout is up to you.

Notably, if you wish to use `systemd-boot` as your bootloader, you will
have to either make `/boot` and EFI the same, or create a separate
physical partition for `/boot` with the type `Linux extended boot` and
typically the FAT32 file system.

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

Non-OpenPOWER systems of the POWER architecture are usually this.
Virtual machines (qemu) are usually also this. These systems use
variants of OpenFirmware (IEEE1275).

The first partition should be of `PowerPC PReP Boot` type and it should
have around a megabyte. Virtual machines and newer physical systems
will happily use either MBR or GPT, but you might want to stick with
MBR for compatibility.

## Power Macs

**Required partitions:**

1. `Apple_Bootstrap`
2. Root filesystem

**Partition table: APM (Apple Partition Map)**

Power Macs have a special partition table called APM, which needs a special
tool to manipulate. Depending on the image or system you have booted,
you may already have it. If not, you can install it, on Chimera using
the following:

```
# apk add mac-fdisk
```

In any case, the bootloader must be on APM, in a bootstrap partition. The
root filesystem partition can be on any partition table GRUB can handle, but
if you are installing on a Mac disk, it will typically be the same APM.

The `mac-fdisk` tool is used to manipulate the partitions. A typical partition
table may look like this:

| Device      | Type                  | Name      | Size | System             |
|-------------|-----------------------|-----------|------|--------------------|
| `/dev/sdX1` | `Apple_partition_map` | Apple     | -    | Partition map      |
| `/dev/sdX2` | `Apple_Bootstrap`     | bootstrap | 800k | NewWorld bootblock |
| `/dev/sdX3` | `Apple_UNIX_SVR2`     | rootfs    | any  | Linux native       |
| `/dev/sdX4` | `Apple_UNIX_SVR2`     | swap      | any  | Linux swap         |

In an APM, there is always an implicit first partition representing the APM
itself.

You can create that layout like this:

```
# mac-fdisk /dev/sdX
i                            # initialize partition table, wipes all data
b 2p                         # bootstrap partition
c 3p 120G rootfs             # root filesystem
c 4p 4p swap                 # swap partition, all unused space
w                            # write
q                            # quit
```

The `b` command is equivalent to `C <x> 800k bootstrap Apple_Bootstrap`.

**This will wipe everything on the disk.** That means it is suitable for
clean installations, but if you wish to dual boot, you have to do a bit
more work.

### Multiboot

In this case, you will not be reinitializing your partition layout. Depending
on how your disk is partitioned you may or may not be able to do this.

You can use the `p` command to print the existing layout. You will need to
have free space, which should be marked `Apple_Free`. If you have some free
space, you can create the bootstrap partition inside of it. If you do not,
you will have to delete a partition or shrink one to get some free space.

On installations with OS X, it seems to be common that you have `Apple_Free`
around 128MB scattered around. These gaps are a good place to create your
bootstrap partition. OS X does not need anything but its own HFS+ partition,
which acts as its own bootstrap.

Generally the layout of the disk does not matter as long as you have your
bootstrap partition somewhere and then another partition (or more) for the
root filesystem or others.

To make an example, given a layout like this:

| Device      | Type                  | Name      | Size | System             |
|-------------|-----------------------|-----------|------|--------------------|
| `/dev/sdX1` | `Apple_partition_map` | Apple     | -    | Partition map      |
| `/dev/sdX2` | `Apple_Free`          |           | 128M | Free space         |
| `/dev/sdX3` | `Apple_HFS`           | OS X      | 100G | HFS                |
| `/dev/sdX4` | `Apple_Free`          |           | 128M | Free space         |
| `/dev/sdX5` | `Apple_HFS`           | empty     | 50G  | HFS                |
| `/dev/sdX6` | `Apple_Free`          |           | 8k   | Free space         |

In this context, `sdX3` is OS X, `sdX5` is an empty HFS+ formatted partition
you want to install the system in. The `sdX2` and `sdX4` are just gaps, as is
`sdX6`.

You could do something like this:

```
# mac-fdisk /dev/sdX
b 2p                         # bootstrap partition in first gap
d 5p                         # delete the 50G Apple_HFS
c 4p 46G rootfs              # create root filesystem partition
c 5p 5p swap                 # create swap partition
w
q
```

The `rootfs` is `4p` here as deleting the `Apple_HFS` will merge the resulting
three gaps together, forming a single 4th partition.

Other configurations may need adjustments.

## Raspberry Pi

**Required partitions:**

1. The `/boot` partition
2. Root filesystem

**Partition table: MBR/GPT**

For Raspberry Pi 3 you will need a MBR partition table, as the built-in
firmware cannot deal with GPT (protective MBR hacks aside).

For Raspberry Pi 4, you can use GPT, while MBR will also work.

In both cases, you will need to have a partition for `/boot` as the
first partition. On MBR, this needs to be marked bootable. On GPT,
it needs to be of type `Microsoft basic data` or `EFI System`, or
it will not be found.

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

In general, the root partition should be labeled `root` for the default
cmdlines on most devices to work. If you don't label it, you will have
to remove the pre-defined `root=` parameter from `/etc/default/u-boot-cmdline`
and let `update-u-boot` auto-generate a correct `root=` instead (the
defaults include a static `root=` to ease generation of generic SD card
images).

If your device is in the above list, then you can save yourself some time
manually partitioning the disk, and do something like the following:

```
# fetch https://raw.githubusercontent.com/chimera-linux/chimera-live/master/sfdisk/pbp
# sed -i '' 's/@BOOT_SIZE@/512MiB/' pbp
# sfdisk /dev/mmcblk2 < pbp
```

Doing this will take care of the labeling if necessary.

Of course, you will need to substitute the filename for your platform, the
boot partition size for whatever you like, and the `mmcblk2` for your target
device. You can also further edit the file for other adjustments. The default
arrangement should however be usable for most scenarios; when encrypting,
create your LUKS where the root partition would have been, and then either
create an LVM or a filesystem on that.

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
