---
layout: book
title: Root on ZFS
section: 2.4
---

It is possible to set up Chimera with root filesystem on ZFS. For
most part, the process is identical to regular installation, with
disk preparation and some post-installation steps differing.

In order to understand this part of the handbook, you should first
understand how regular Chimera installations work.

## Preparation

The live ISO images already come with ZFS support by default. Therefore,
you do not have to do anything as far as preparation goes.

For device-specific images, you will want to create a removable media
with Chimera (typically an SD card), boot it and install ZFS in there.

If you are using an LTS kernel, Chimera typically comes with binary
ZFS modules for installation.

For the generic kernel:

```
# apk add linux-lts-zfs-bin
```

For Raspberry Pi:

```
# apk add linux-rpi-zfs-bin
```

Note that the `linux-stable` kernel that tracks the latest stable branch
is not guaranteed to work with ZFS, so it does not come with installable
binary modules.

If you have your own kernel, or a kernel without ZFS binary modules, you
can try managing the ZFS modules via CKMS:

```
# apk add zfs-ckms
```

Keep in mind that ZFS managed through CKMS wil need to build its kernel
modules from source, which may take time, especially on slow devices.
It may also not be compatible with every kernel at source level.

CKMS and prebuilt modules do not conflict. If you have prebuilt modules
installed for a kernel, CKMS will not attempt to build it for that
kernel.

You may have to `modprobe` the `zfs` module afterwards to be able to
use the filesystem.

## Partitioning

The main problem is that most bootloaders do not undestand ZFS. GRUB
does understand it, but only a fairly old version with a limited feature
set.

There are multiple ways around this:

1. Using a separate limited pool for `/boot`
2. Using a separate `/boot` partition with `ext4` or another FS
3. On EFI systems, combining your `/boot` with the ESP

For this example, we will be assuming an EFI system and we will put `/boot`
in its own partition. In this arrangement, you will create 3 partitions:

1. The ESP (`vfat`)
2. The `/boot` (`ext4` or some other)
3. The pool

On a BIOS or OpenPOWER system, you would not need the ESP. The exact layout
is dependent on the target system.

In any case, an example pool setup would look like this, assuming a hard drive
at `/dev/sda` and the above layout:

```
# mkdir /media/root
# zpool create -o ashift=12 -O acltype=posix -O canmount=off -O dnodesize=auto -O normalization=formD -O relatime=on -O xattr=sa -O mountpoint=/ -R /media/root rpool /dev/sda3
# zfs create -o canmount=off -o mountpoint=none rpool/ROOT
# zfs create -o canmount=noauto -o mountpoint=/ rpool/ROOT/chimera
# zfs mount rpool/ROOT/chimera
```

And the other partitions:

```
# mkfs.vfat /dev/sda1
# mkfs.ext4 /dev/sda2
# mkdir /media/root/boot
# mount /dev/sda2 /media/root/boot
# mkdir /media/root/boot/efi
# mount /dev/sda1 /media/root/boot/efi
```

After that, install Chimera like normal, as everything else is identical.

## ZFS and LUKS

You can freely combine ZFS and LUKS. Just keep in mind that when setting up
`root=`, you do not have to care about any of the `/dev/mapper` stuff, and
simply specify the same `root=` as you would with an unencrypted system.

This is because ZFS is pool-based and the pool will be identified on the
mapper devices automatically, just like for any other block device.
