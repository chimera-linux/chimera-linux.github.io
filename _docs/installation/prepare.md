---
layout: book
title: Preparing media
section: 2.2
---

Once you have downloaded the right image, you will need to prepare
your installation media.

## ISO images

All Chimera ISO images for all architectures are hybrid. That means
you can use either a USB stick (or equivalent) or burn the image
onto an optical disc.

### Using a USB stick

Insert the USB stick in a computer where you have downloaded the ISO
image.

After that, identify the device. This will typically be something like
`/dev/sdX` on Linux, where X is some letter. Be extra careful so that
you do not mistake the USB stick for another storage medium in your
computer, as that could result in data loss.

Additionally, ensure that the USB stick is not currently mounted.

Then you can proceed to write the ISO image to it.

```
# dd if=/path/to/chimera.iso of=/dev/sdX bs=1M
```

This may take a while. Before unplugging the device, ensure that all
data is really written:

```
$ sync
```

This may also take a while, if there was unwritten data.

### Using an optical disc

Simply burn the ISO image onto a CD or DVD using some application
that is available in your system. Keep in mind that using a USB stick
is recommended over an optical disc as USB sticks are reusable as well
as much faster (i.e. the system will respond better as well as boot
quicker).

## Device images

Device images are essentially pre-made Chimera installations, containing
a partition table and filesystems.

In this case we will be using an SD card at `/dev/mmcblk0`.

First, unpack your device image:

```
# gzip -d chimera-linux-*.img.gz
```

Then write it:

```
# dd if=chimera-linux-*.img of=/dev/mmcblk0 bs=1M
# sync
```

This will result in a bootable system on the media. If you plan to use
it only to install the final system to another media, you can leave it
alone and boot it directly. Otherwise, you might want to expand the
root filesystem partition to fill the rest of the media.

To do that, open the device with your favorite partition editor, in
this case we will use `cfdisk`:

```
# cfdisk /dev/mmcblk0
```

Then, resize the last partition to fill the remaining empty space.
Some partition editors have a direct option for resizing, while in
others you will need to delete the partition and create a new one,
ensuring it starts at the same offset.

Once you are done and your partition is large enough, you will need
to resize the filesystem. The Chimera device images come with `ext4`
by default. If your root filesystem partition is `/dev/mmcblk0p4`,
you will want to do the following:

```
# resize2fs /dev/mmcblk0p4
```

Device images for SBCs that can boot off SD cards have their images
made for this purpose. On many of these devices, you can also boot
from other media, such as eMMC. When using an SD card image and
flashing it somewhere that is not an SD card, you might want to
enable root filesystem journaling, as that is disabled by default
to reduce SD card wear. You can do it with the following command:

```
# tne2fs -O +has_journal /dev/mmcblk0p4
```

And that should be it.
