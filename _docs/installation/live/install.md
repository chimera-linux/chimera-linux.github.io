---
layout: book
title: Installing
section: 2.1.4
---

This assumes you have partitioned your target drive.

## Filesystems

The next step is to format the partitions so that there is a file
system on them.

On EFI systems, the ESP needs to be FAT32 formatted. Assuming that
your ESP is `/dev/sda1`, do the following:

```
# mkfs.vfat /dev/sda1
```

On POWER systems that need a PReP boot partition, this partition
should be left raw and not formatted with anything.

On all systems, you will need to format your root. A typical choice
is Ext4. Assuming your root is `/dev/sda2`, do something like this:

```
# mkfs.ext4 /dev/sda2
```

You can use any file system you like, such as XFS, ZFS or Btrfs.
The ISO images come with ZFS prebuilt kernel modules as well as
userspace utilities to simplify such setups.

If you have a swap partition, create your swap space, e.g. like:

```
# mkswap /dev/sda3
```

## Mounting

Create a mount point for the root partition.

```
# mkdir /media/root
```

Then mount it:

```
# mount /dev/sda2 /media/root
```

## Install the system

The `chimera-live-install` script allows you to install the
system as it is on the live image, minus live-specific setup,
onto the target drive.

```
# chimera-live-install /media/root
```

Once done, mount pseudo-filesystems in there:

```
# mount --rbind /dev /media/root/dev
# mount --rbind /proc /media/root/proc
# mount --rbind /sys /media/root/sys
# mount --rbind /tmp /media/root/tmp
```

Ensure that you can access the network in there:

```
# cp /etc/resolv.conf /media/root/etc
```

And change into the target system:

```
# chroot /media/root
```

### Using apk to install

Instead of using `chimera-live-install`, you can also use `apk`
to install the system from the network. At the moment, this is a
little bit complicated. This is a simple, rough example.

Install base files package:

```
# apk --root /media/root --keys-dir /etc/apk/keys --repositories-file /etc/apk/repositories --initdb add base-files
```

This is not aware of proper permissions yet, so fix them:

```
# chown -R root:root /media/root
```

Add the minimal metapackage:

```
# apk --root /media/root --keys-dir /etc/apk/keys --repositories-file /etc/apk/repositories add base-minimal
```

After that, mount the pseudo-filesystems there as well as copy
`resolv.conf` like above, and change root into the target system.

When inside, install the rest of the system:

```
# apk update
# apk add base-full linux
```

You will also want to install the right bootloader package. For
`x86_64` EFI systems, it is `grub-x86_64-efi` (`grub-i386-efi`
for machines with 32-bit EFI), for BIOS systems it is `grub-i386-pc`,
for AArch64 it's `grub-arm64-efi`, for RISC-V it's `grub-riscv64-efi`,
for PowerVM and POWER virtual machines it's `grub-powerpc-ieee1275`.
OpenPOWER systems do not need any bootloader per se, but you will
still want to generate the GRUB config file for bootloader entries,
so install just `grub`.

Of course, you should also install anything else you need for your
specific setup.

## Updating the system

First thing you do after changing root is updating the system so you
are using latest packages. This is especially important in Chimera
because of how fast it currently changes, so you want to make sure
you have the very latest version of e.g. service management files.

```
# apk update
# apk upgrade --available
```

If you run into any errors, such as conflicting packages overwriting
each other's files, don't worry; just fix it:

```
# apk fix
```

After that, try again and there should be no more errors:

```
# apk upgrade --available
```

## Bootloader setup

This will differ depending on the kind of hardware/firmware you have.

Example for BIOS systems:

```
# grub-install /dev/sda
```

If installing for BIOS while being booted in UEFI mode, you will also
want to pass `--target=i386-pc`.

Example for UEFI systems of any architecture:

```
# mkdir -p /boot/efi
# mount /dev/sda1 /boot/efi
# grub-install --efi-directory=/boot/efi
```

You will want `--target=x86_64-efi` as well if installing while booted
in BIOS mode.

If you do not want GRUB to alter firmware boot entries, `--no-nvram` can be
passed. Additionally, certain EFI firmwares are buggy and require a bootable
file at a known location before they show any NVRAM entries. In this case
the system may not boot. This does not affect most systems, but if you have
a board with such buggy firmware, you can pass the `--removable` flag to
work around it.

Without using `--removable`, a similar workaround will also work:

```
# mv /boot/efi/EFI/chimera /boot/efi/EFI/BOOT
# mv /boot/efi/EFI/BOOT/grubx64.efi /boot/efi/EFI/BOOT/BOOTX64.EFI
```

For POWER systems with a PReP partition, you will want something like this:

```
# grub-install /dev/sda1
```

In any case, once you are done, refresh your GRUB configuration file:

```
# update-grub
```

## Creating a user

You will want to create a user for yourself, as well as change the root
password. Otherwise, you would not be able to log in.

```
# useradd myuser
# passwd myuser
# passwd root
# usermod -a -G any,groups,you,want myuser
```

## Other post-installation tasks

Set a hostname:

```
# echo chimera > /etc/hostname
```

Also add it to `/etc/hosts` to prevent `syslog-ng` from doing a blocking
DNS lookup on boot:

```
# echo 127.0.0.1 chimera >> /etc/hosts
# echo ::1 chimera >> /etc/hosts
```

## Booting

At this point you should be able to reboot and do any other post-installation
tasks in the final system, such as enabling more services.
