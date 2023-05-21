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

Make sure that the root file system's mount has 755 permissions.
If it for some reason does not and instead it's for example 700,
it will result in strange issues when logging in as non-root.
The fix for that is easy:

```
# chmod 755 /media/root
```

Then you can move on to the other partitions.

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

If `apk update` fails, make sure your system date/time is set to a
correct value. Incorrectly configured date/time can result in HTTPS
certificate errors. If the date/time is indeed wrong, you can set it
with the `date` comamnd:

```
# date YYYYMMDDHHmm
```

Replace the value with the current date/time, typically in UTC, as you
do not have a timezone set yet.

If you run into any other errors, such as conflicting packages
overwriting each other's files, don't worry; just fix it:

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

This typically refers to the latest Long Term Support version of the Linux
kernel. If you'd like to use the latest stable version of the kernel
instead, for example if LTS is missing some functionality or driver
that is important to you, you can install `linux-stable` instead:

```
# apk add linux-stable
```

Note that the stable kernel branch is not guaranteed to work with ZFS due
to the way it releases. For that reason, there are also no prebuilt ZFS
modules for it.

### Fstab

Strictly speaking, a Chimera system does not need `/etc/fstab` to boot.
Having an entry for the root filesystem is optional and you might not
have any other filesystems. However, it is recommended that you have
a proper `fstab`, with which you can control mount flags as well as
`fsck` behavior or e.g. whether the root filesystem is mounted read-only.

The default `fstab` that comes with the system does not contain any entries.

An example `/etc/fstab` for a root partition and ESP may look like this:

```
UUID=... / ext4 defaults 0 1
UUID=... /boot/efi vfat defaults 0 2
```

It is not necessary to add entries for pseudo-filesystems such as the
`/proc` or `/sys` mounts. If you want to have read-only `/` partition
you will also have to add a `tmpfs` entry for `/tmp`, as the directory
needs to be globally writable. On other systems, you do not need such
entry and `/tmp` does not need to be a mount (it will be peridocally
cleaned).

In general the order of the rows should be root filesystem first and
other filesystems after that, as they are mounted in that order and
parent mounts need to be mounted first.

The first column identifies the device. It is recommended that you always
use unique paths such as `UUID=...` or `PARTUUID=...` (using alias paths
such as `/dev/disk/by-partuuid` or `/dev/disk/by-uuid` will work as well),
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

### Initramfs refresh

A bootable system will typically need an initramfs image. You need to
create one near the end, but before generating your bootloader config,
as the bootloader needs to be aware of it.

Therefore, best do that now:

```
# update-initramfs -c -k all
```

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

On OpenPOWER systems (which use Petitboot), you will not install the
bootloader but instead you need to create the directory for the config:

```
# mkdir /boot/grub
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

## Other post-installation tasks

At this point, the system should be capable of booting on its own.

If you wish, you can perform other post-installation tasks here, or you can
do so after you have booted into the system.

Either way, proceed to [Post-installation](/docs/configuration/post-installation).
