---
layout: book
title: CPU microcode
section: 4.9
---

On specific CPUs, you have CPU microcode, which can be updated through
regular packages.

For Intel CPUs:

```
# apk add ucode-intel
```

For AMD CPUs:

```
# apk add ucode-amd
```

In most cases, you want early microcode loading via initramfs, which
Chimera can do by default. You just have to refresh them:

```
# update-initramfs -c -k all
```

This will result in microcode being included in the initramfs. On Intel
CPUs, only the microcode necessary for the current machine is included
by default. You can tweak the configuration of both via their respective
files in `/etc/default`. You can also disable initramfs inclusion if you
wish to do something else.

For subsequent kernel updates, you will no longer have to manually refresh
your initramfs, it will be done automatically.

## Microcode loading via bootloader

If you'd like to instead load your microcode through the bootloader without
using initramfs (e.g. if you have no initramfs or if you have some other
reason), you can use full `cpio` images.

For AMD, this is installed with `ucode-amd`, under `/boot/amd-ucode.img`.

On Intel, the package is significantly chunkier, so you will have to install
the `ucode-intel-full` package first (or generate it with `iucode_tool`).
After that, you will also have `/boot/intel-ucode.img`.

You can then tweak your bootloader configuration accordingly. Make sure not
to forget to disable the initramfs hooks if you are using one.
