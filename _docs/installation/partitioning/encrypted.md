---
layout: book
title: Disk encryption
section: 2.5.1
---

This largely applies to installation from any source. You should be
aware of how Chimera installation with unencrypted root works for
your device, so that you can understand the differences.

## Partitioning

The first part that is different from regular installation is partitioning.

There are multiple ways you can arrange your drive when using encryption:

1. Unencrypted `/boot`, other partitions in LVM on LUKS
2. Unencrypted `/boot` with ZFS pool on LUKS
3. Full disk encryption with LVM/ZFS on LUKS
4. LUKS without LVM
5. Native ZFS encryption
6. and other combos

Each way has some advantages and some disadvantages. We will not cover all
of them here.

### LVM on LUKS with unencrypted `/boot`

The main advantage of this method is that it's simple and works on any device
with any bootloader.

In this case, the kernel and initramfs resides in a dedicated `/boot` partition
that is unencrypted. This is often already the case with e.g. device images
that use U-Boot. It could also be the case with EFI systems that combine the
ESP and `/boot` into one, which is a valid configuration.

Other partitions are in an LVM. LVM stands for Logical Volume Manager and
allows for flexible "partitioning" of space within a single physical partition.
The `lvm2` package in Chimera contains tooling to deal with LVM.

LUKS stands for Linux Unified Key Setup. It is independent of LVM. It deals
purely with encrypting a block device and the `cryptsetup` package in Chimera
provides the tooling.

Assuming a target device `/dev/sda` and an EFI system with dedicated `/boot`
partition separate from ESP, we will create a GPT on the disk, along with
3 partitions:

1. The EFI system partition
2. The `/boot` Linux partition of a desired size and filesystem (e.g. `ext4`)
3. A Linux partition that covers the rest of the space

Adjust this to whatever your computer uses. For example a BIOS or OpenPOWER
system would have only two partitions here and so on.

Format the unencrypted partitions:

```
# mkfs.vfat /dev/sda1
# mkfs.ext4 /dev/sda2
```

The next step is to create LUKS on the remaining (third) partition. Use any
name you want, we will use `crypt`:

```
# cryptsetup luksFormat /dev/sda3
# cryptsetup luksOpen /dev/sda3 crypt
```

You will be asked for a passphrase in both steps. The passphrase is for you
to choose.

Once this is done, a new block device will appear in `/dev/mapper/crypt`.
You can use this block device as if it was a partition, i.e. you could create
a filesystem or a ZFS pool or whatever you want on it, but in this case we
will create a volume group. Name it whatever you want, in this case `volg`:

```
# vgcreate volg /dev/mapper/crypt
```

After that, create logical volumes in the volume group. Logical volumes are
"partitions" here. We will want at least one for root, but you can create
as many as you want. If you use swap, you will want to keep it in the LVM
as well, as it's convenient and does not require a separate LUKS. **Do not
use unencrypted swap, as it can leak secrets.**

In this example, we will use 40 gigabytes for `/`, 8 gigabytes for swap,
and the rest for `/home`.

```
# lvcreate --name root -L 40G volg
# lvcreate --name swap -L 8G volg
# lvcreate --name home -l 100%free volg
```

Note the `-L` vs `-l` for exact and non-exact sizes.

In any case, whatever layout you choose, you will see new block devices
in `/dev/volg`, with the names you have given them. The next step is to
create filesystems on them and mount them in the desired layout, for
example like:

```
# mkfs.ext4 /dev/volg/root
# mkfs.ext4 /dev/volg/home
# mkswap /dev/volg/swap
# mkdir /media/root
# mount /dev/volg/root /media/root
# mkdir /media/root/boot
# mkdir /media/root/home
# mount /dev/volg/home /media/root/home
# mount /dev/sda2 /media/root/boot
# mkdir /media/root/boot/efi
# mount /dev/sda1 /media/root/boot/efi
```

After that, follow the regular Chimera installation for your device type,
e.g. using `chimera-bootstrap` and so on.

### Full disk encryption with LVM on LUKS

In this arrangement you will not have a separate `/boot` partition.
Otherwise, the partitioning is similar, for EFI systems you will still
need a dedicated ESP, and the rest of the drive will be a single partition
with a LUKS on it. You do not need a separate `/boot`, but if you wish you
can create one as a logical volume in your LVM.

The main disadvantage of this method is a more complicated setup, plus that
it requires support from the bootloader. It will only work if you use GRUB.

With just passphrases, you will also have to unlock the drive twice. The first
time will be by GRUB (which understands LUKS) in order to access the kernel,
and the second time will be by the `initramfs`, in order to mount the root
file system. You can work around this by using a keyfile (stored in your
initramfs) to unlock the volume the second time.

Additionally, there is yet another caveat, and that is limited support for
LUKS2 in GRUB. Starting with version 2.06, LUKS2 is partially supported,
but only with the PBKDF2 key derivation function. The default for LUKS2
is Argon2i, so it will not work.

Therefore, you are best off forcing LUKS1. You can do that with a parameter
passed to `luksFormat`:

```
# cryptsetup luksFormat --type luks1 /dev/...
```

With these precautions, this is also an arrangement you can use. Set up your
drive and install the system as usual.

### Other layouts

You should be able to derive information for most of the other layouts from
the previous two sections, given an understanding of how this works.

For instance for ZFS on LUKS, you would create your LUKS partition as normal,
then create a ZFS pool in it instead of LVM. Chimera's version of ZFS comes
with full `initramfs-tools` support, and the early oneshots likewise support
it.
