---
title: New images
layout: post
excerpt_separator: <!--more-->
---

As of 21 April 2024 new images have been published.

These are mainly an incremental refresh. They bring a variety of
package updates and minor quality of life improvements, and
most importantly updated `apk-tools`.

<!--more-->

## Changes

The graphical images are based on GNOME 46 and Linux kernel 6.6,
alongside a variety of up to date software, such as the LLVM 18
toolchain.

The `apk` package manager in this set fully supports the `zstd`
compression. The distribution will start rolling out packages
compressed with `zstd` in the coming days (no world rebuild will
happen yet but newly built packages will be compressed with it).

The installer scripts had minor changes done in them, some of them
user-visible. Notably, `chimera-chroot` will now alter the prompt
to be less confusing, and it makes bind-mounted pseudo-filesystems
properly unmountable.

The ISOs are newly based on GRUB 2.12. If this causes any regressions,
please report them. All the ISO images were tested on their respective
architectures without any issues found.

The MNT Reform images have been dropped. The packaging of the bootloader
was unsatisfactory (done from binary builds) and there haven't been any
opportunities to figure out a proper source build. Additionally, the
vendor now seems to be favoring newer SOMs by default. If you are
interested in maintaining support for this or any other hardware,
please reach out to us on one of the official channels.

## Upcoming changes

There will be at least one more refresh before beta. Beta will likely
come with a world rebuild, which means `zstd` for all packages.
