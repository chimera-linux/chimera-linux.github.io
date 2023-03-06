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
userspace utilities to simplify such setups. Please follow the
[Root on ZFS](/docs/installation/zfs) page if you wish to have
your root filesystem on ZFS.

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

There are two ways you can install the system onto a partitioned,
mounted drive. One is a local installation, which copies the live
system onto the drive (but without live-related bits), the other
is a remote installation from the repositories.

### Local installation

The `chimera-live-install` utility exists for that. The usage is
simple:

```
# chimera-live-install /media/root
```

### Network installation

The `chimera-live-bootstrap` utility lets you do that. Like the
local installation tool, it takes the target root, but additionally
it also needs a list of packages to install.

Typically you would run something like this:

```
# chimera-live-bootstrap /media/root base-full
```

## Prepare the system

Regardless of the installation method you choose, you will need to
open a shell in the target system to install updates, possibly other
packages you need to boot, and the bootloader.

The `chimera-live-chroot` tool exists to simplify that task for you.
It will mount the pseudo-filesystems for the session as well as
ensure you have network access inside.

```
# chimera-live-chroot /media/root
```

First, update the system. If installing from the network, this might
not do anything.

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

If you've installed from the network, you might need to add more
packages.

For example the kernel:

```
# apk add linux-lts
```

Or ZFS:

```
# apk add linux-lts-zfs-bin
```

While inside the shell, you may also want to install any other initial
package you want.

At this point, also add your filesystems to `/etc/fstab` as needed, in
order to make sure e.g. your `/boot` gets mounted accordingly, or to
make sure your root file system is mounted with the flags you want or
follows the `fsck` behavior you want.

It is recommended to use `PARTUUID` or `UUID` values for devices in
`fstab` to make sure they will not change.

At the end, create or refresh the initramfs:

```
# update-initramfs -c -k all
```

## Bootloader

You have a few choices as far as bootloader goes.

### GRUB

GRUB is a universal choice that will work on more or less every platform
that Chimera supports.

If your installation does not come with it, add it.

Example for x86 BIOS:

```
# apk add grub-i386-pc
```

Example for x86_64 EFI:

```
# apk add grub-x86_64-efi
```

Example for a POWER virtual machine or PowerVM hardware:

```
# apk add grub-powerpc-ieee1275
```

On a PowerNV machine with Petitboot, you do not need any low level bootloader
as the machine comes with one, so just add `grub`. On other platforms, there
are more choices, e.g. `grub-arm64-efi`, `grub-i386-coreboot`, `grub-i386-efi`,
`grub-riscv64-efi`, `grub-x86_64-xen`.

The installation will differ slightly depending on the platform. For exmaple
for BIOS systems:

```
# grub-install /dev/sda
```

On POWER systems with a PReP partition:

```
# grub-install /dev/sda1
```

On EFI systems with separate ESP:

```
# mkdir -p /boot/efi
# mount /dev/sda1 /boot/efi
# grub-install --efi-directory=/boot/efi
```

And so on. You will want `--target=x86_64-efi` as well if installing EFI on
x86_64 while booted in BIOS mode.

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

In any case, you will want to generate a GRUB configuration file on all
platforms:

```
# update-grub
```

### EFISTUB

**Note that this may not work on every EFI implementation, and it also requires
functional persistent NVRAM, and is considered experimental.**

On many EFI systems, it is possible to boot Linux kernels directly thanks to
EFISTUB. You do not necessarily need a bootloader for this, as Chimera can
automatically manage EFI boot entries for all kernels.

Uncomment the `EFIBOOTMGR_ENABLE_HOOK` variable in `/etc/default/efibootmgr-hook`
and set it to some value, e.g. `1`.

Then generate the initial entries:

```
# /etc/kernel.d/99-efibootmgr-hook.sh
```

You do not need to manually regenerate this on kernel updates.

## Set a root password

If you do not set a root password, you will not be able to log in, as you
do not have any other user yet. Therefore, do it now:

```
# passwd root
```

## Other post-installation tasks

At this point, the system should be capable of booting on its own.

If you wish, you can perform other post-installation tasks here, or you can
do so after you have booted into the system.

Either way, proceed to [Post-installation](/docs/configuration/post-installation).
