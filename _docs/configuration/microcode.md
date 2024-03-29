---
layout: book
title: CPU microcode
section: 4.10
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

For Intel CPUs:

```
# apk add ucode-intel-full
```

For AMD CPUs:

```
# apk add ucode-amd-full
```

You can then tweak your bootloader configuration accordingly. Make sure not
to forget to disable the initramfs hooks if you are using one. Alternatively,
you can remove the regular ucode packages, as the `-full` packages do not
depend on them.
