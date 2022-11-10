---
layout: book
title: Device images
section: 2.3
---

Some devices cannot be supported with the [live images](/docs/installation/live).
If you are reading this, chances are you have one of those devices.

## Picking the right image

Device-specific support comes in two forms. One is the compressed `.img` file,
which is the actual device image, and the other is the matching rootfs tarball.

If available, you should get the device image, but there is also a way to use
the tarball instead.

## Preparing your media

The device images are typically meant to be used with an SD card. This
is not always the case though, and you can use any storage media your
board supports.

First, unpack your device image:

```
# gzip -d chimera-linux-*.img.gz
```

Then, assuming you have an SD card at `/dev/mmcblk0`, you can write it:

```
# dd if=chimera-linux-*.img of=/dev/mmcblk0 bs=1M
# sync
```

Always make sure the SD card is not mounted first.

Once done, remove the SD card, insert it into your device, and the system
should come up.

## Using the media

All the images come in console variants, and do not have a user created.
You can log in as `root`, with the password `chimera`.

If the device supports serial console, it is usually set up to use it
by default, as well as graphical output, if supported.
