---
layout: book
title: Preparing media
section: 2.2.1
---

This page describes media preparation using the live ISO method.
That assumes that your computer is supported by this method.

## Supported media types

All Chimera ISO images for all architectures are hybrid. That means
you can use either a USB stick (or equivalent) or burn the image
onto an optical disc.

## Using a USB stick

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

## Using an optical disc

Simply burn the ISO image onto a CD or DVD using some application
that is available in your system. Keep in mind that using a USB stick
is recommended over an optical disc as USB sticks are reusable as well
as much faster (i.e. the system will respond better as well as boot
quicker).
