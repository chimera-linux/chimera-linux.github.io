---
layout: book
title: Installing
section: 2.1.5
---

This assumes you have partitioned your target drive and formatted
your partitions with the necessary filesystems.

## Mounting

The first thing before you install the OS is to mount the partitions
with the desired layout matching the final system.

First, you need to mount the root partition. Create a mount point
for it first:

```
# mkdir /media/root
```

Then mount it (assuming `/dev/sda2` for root partition):

```
# mount /dev/sda2 /media/root
```

### UEFI

You will want to mount the EFI System Partition as well. There
are several locations, based on your layout. First, let's assume
that the ESP is `/dev/sda1`.

If you have a dedicated `/boot` partition (let's say `sda3`),
mount it first:

```
# mkdir /media/root/boot
# mount /dev/sda3 /media/root/boot
```

Regardless, mount the ESP:

```
# mkdir -p /media/root/boot/efi
# mount /dev/sda1 /media/root/boot/efi
```

If your ESP and `/boot` are merged, do this instead:

```
# mkdir /media/root/boot
# mount /dev/sda1 /media/root/boot
```

### Other partitions

You will also want to mount other physical partitions you are
using in the locations where they are going to be. Do keep in mind
that for nested mountpoints, always mount parent partitions first.

## Installation

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

### Kernel installation

If you performed a local installation from the live image, it already
comes with a kernel.

Otherwise you might have to add it:

```
# apk add linux-lts
```

If you wish to use ZFS, add that too:

```
# apk add linux-lts-zfs-bin
```

### Fstab

Chimera comes with a default example `/etc/fstab`. It only contains
a definition for the `tmpfs` at `/tmp`.

Strictly speaking, this is technically enough, as having an entry
for the root filesystem is optional and you might not have any other
filesystems. However, it is recommended that you have a proper `fstab`,
with which you can control mount flags as well as `fsck` behavior or
e.g. whether the root filesystem is mounted read-only.

An example `/etc/fstab` for a root partition, ESP and `/tmp` may look
for exmaple like this:

```
/dev/disk/by-partuuid/... / ext4 defaults 0 1
/dev/disk/by-partuuid/... /boot/efi vfat defaults 0 2
tmpfs /tmp tmpfs defaults,nosuid,nodev 0 0
```

It is not necessary to add entries for pseudo-filesystems such as the
`/proc` or `/sys` mounts, but there is also no harm in adding them.

The first column identifies the device. It is recommended that you always
use unique paths such as `/dev/disk/by-partuuid` or `/dev/disk/by-uuid`,
as names such as `/dev/sda` may change. For encrypted devices, you will
want to use the `/dev/mapper` paths, e.g. `/dev/mapper/crypt-root`.

The second column is the mount point. The entries should be specified
in an order so that parent mounts come first.

The third column specifies the file system, and the fourth column contains
the mount options for it.

The fifth column should usually be `0` and relates to `dump(8)`. The sixth
column specifies the order for `fsck(8)`. Normally the root filesystem
should specify `1` and other filesystems should specify `2`.

If the root filesystem is not specified in `fstab`, Chimera will mount it
as if it was specified with `defaults`, and will `fsck` it as if the sixth
column was `1`.

For more information, see `fstab(5)`.

### Other packages

You can install whichever other packages you like.

### Root password

Set your root password here, or you will not be able to log in:

```
# passwd root
```

### Serial login prompt (getty)

While the live image autodetects this and lets you log in over serial
terminal, the final system does not, and will only by default enable
graphical `getty`.

So for example you might want to do something like:

```
# ln -s ../agetty-ttyS0 /etc/dinit.d/boot.d/agetty-ttyS0
```

If the baud rate or other parameters need tweaking, you can copy them
from the live system (e.g. `/etc/default/agetty-ttyS0`), as the live
autodetection generates a configuration file if necessary.

### GRUB

GRUB is a common bootloader that works on more or less every platform
that Chimera supports. If you wish to use a different way to boot your
system, skip this section.

First you will need to add it.

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
functional persistent NVRAM, and is considered highly experimental.**

On many EFI systems, it is possible to boot Linux kernels directly thanks to
EFISTUB. You do not necessarily need a bootloader for this, as Chimera can
automatically manage EFI boot entries for all kernels.

Skip this section if this does not apply to you, e.g. if using GRUB.

Uncomment the `EFIBOOTMGR_ENABLE_HOOK` variable in `/etc/default/efibootmgr-hook`
and set it to some value, e.g. `1`.

Then generate the initial entries:

```
# /etc/kernel.d/99-efibootmgr-hook.sh
```

You do not need to manually regenerate this on kernel updates.

### Initramfs refresh

After you have done everything else, create or refresh the initramfs:

```
# update-initramfs -c -k all
```

## Other post-installation tasks

At this point, the system should be capable of booting on its own.

If you wish, you can perform other post-installation tasks here, or you can
do so after you have booted into the system.

Either way, proceed to [Post-installation](/docs/configuration/post-installation).
