---
layout: book
title: Filesystems
section: 2.5
---

This part assumes you have partitioned your drive in a way that
is satisfactory for both you and your computer.

If you are using root on [Root on ZFS](/docs/installation/partitioning/zfs),
chances are you have already formatted your partitions.

Likewise, if you are using [Disk encryption](/docs/installation/partitioning/encrypted),
that will influence what you do here.

## Root filesystem

The filesystem you choose for the root partition is usually up to
you. The typical most common choice of root filesystem is Ext4 or
XFS. Chimera does not mandate anything specific.

An example, assuming `/dev/sda2` is your root partition:

```
# mkfs.ext4 /dev/sda2
```

When installing on SD cards, you might want to disable the journal.
You can do it by passing the option `-O ^has_journal` after `mkfs.ext4`.

## Boot filesystem

A common case for this is if your root filesystem is not supported
by your bootloader, assuming it needs to be. Ext4 is a frequent
choice as well, some people use Ext2 and others.

## EFI System Partition

The ESP always uses the FAT32 filesystem. Assuming it is `/dev/sda1`,
you can format it like this:

```
# mkfs.vfat /dev/sda1
```

## PowerPC PReP Boot

POWER systems using this partition do not put any filesystem on it.
It is, however, very important for bootloader installation that it
is empty.

Assuming it's `/dev/sda1`, you should erase it:

```
# dd if=/dev/zero of=/dev/sda1
```

## Swap

Let's assume you have a swap partition at `/dev/sda3`. You will
want to create your swap space on it like this:

```
# mkswap /dev/sda3
```

## Other partitions

This is usually up to you.
