---
title: Chimera at FOSDEM 2023 and the path towards alpha
layout: post
excerpt_separator: <!--more-->
---

It has been a while without an update post, so perhaps it's time to
refresh things a little.

No news does not mean progress hasn't been happening; there has been
a continuous stream of commits in `cports` as well as other parts of
the project, so I will do my best to summarize it as well as provide
an updated overview of what's going to happen.

<!--more-->

## FOSDEM 2023

[FOSDEM 2023](https://fosdem.org) is happening once again with an
in-person format, as usual in Brussels, on the first weekend of
February, which is the 4th and 5th this time. I will be giving a
[talk](https://fosdem.org/2023/schedule/event/chimera_linux) about
Chimera, this time in the BSD devroom (huge thanks to the organizers
for letting me have a slot, despite this project being a Linux system).

I will give a general overview of the project, our progress since last
FOSDEM, as well as what's planned for the future, and perhaps more,
in the form of a full length talk (we have a 50 minute slot). The
devroom changes into the LLVM devroom right afterwards, which is
fitting considering we are also using the LLVM toolchain.

## Cports progress since last post

The previous post was at the beginning of November, which is two and
a half months ago. Since then, there has been a lot of updates in
the project. Here are the main highlights, in chronological order.

1. A general refresh of packaging templates, with everything being
   updated to its most recent version.
2. Our suite of Dinit services, `dinit-chimera` has received a complete
   overhaul. Besides being more fine-grained, it also provides a cleaned
   up targets system, better thought-out configuration, and better
   integration.
3. Full-disk encryption is now supported, besides a variety of other
   initramfs improvements, which includes better support for LVM,
   root on ZFS and others.
4. CKMS, our kernel module source build system that replaces DKMS,
   got an initial release, and no longer conflicts with binary
   modules (so you can have binary ZFS for some kernels while
   letting CKMS manage it for others without interfering).
5. We now use a custom version of the musl libc, which uses Scudo
   (a part of LLVM and default in Android/Fuchsia) as the system
   allocator (malloc implementation). This brings significantly
   better performance in multithreaded scenarios.
6. A big overhaul of kernel packaging, alongside Linux 6.1, which
   is the new baseline version. The new packaging brings support
   for kernel backups on upgrades besides other things.
7. Cbuild hardening overhaul, with significantly expanded list of
   hardening types, and new defaults. Now, templates are built with
   UBSan integer overflow checks by default, as well as hidden
   visibility and CFI (Control Flow Integrity) by default. Enabling
   templates to properly use it is still a work in progress. There
   is also initial infrastructure for other hardening including
   Intel CET and ARM BTI (which will both need support in musl
   to be useful) as well as Clang SafeStack. All ELF files are
   now also checked for executable stack in the build system.
8. Cbuild now supports locking, preventing race conditions when
   building multiple things in parallel. The sources are properly
   locked, as are the repositories when generating packages.
9. Cbuild no longer requires `fakeroot` in the host system.
10. New policy packages `base-devel` and `base-devel-static`. These
    provide a way for users to declare that they want development
    packages to be automatically installed alongside runtime packages.
    This allows users to choose whether they wish to save space not
    installing development files (default) or whether they want the
    convenience of having development files for everything (similarly
    to e.g. Arch Linux).

This list is not exhaustive, but includes most major things.

## The Chimera handbook

The documentation for the project has undergone significant expansion,
now containing detailed installation instructions including how to
deal with things like disk encryption and root oN ZFS, and various
configuration tasks.

The FAQ is now a part of the handbook and has been expanded as well.

## Preparing for alpha

We still have plans to release an alpha as soon as possible. This will
be the point where the distro is ready for early adopters. The following
needs finishing:

1. The hardening overhaul fallout. Since we have enabled the UBSan
   checks as well as CFI by default, this exposes all sorts of bugs
   in libraries and applications, turning them into crashes. Therefore
   we are rebuilding and testing things as necessary, trying to iron
   out most issues to have a stable experience before the alpha launches.
2. Packages will need updating to their latest version at the time of the
   alpha.
3. Automated build system for packages still needs launching. This is
   experiencing delays, but we plan to have that up as soon as possible.
4. There will be a world rebuild before the alpha happens, on all 4
   architectures that are currently supported in repositories. This is
   needed in order to accommodate the various cbuild updates that have
   happened in the meantime.

Since these are still pretty significant tasks, it will take some time
to get them done. Therefore, the alpha will not come out before the
FOSDEM talk. Right now, the idea is to make it coincide with one of
the beta releases of FreeBSD 13.2, to get a chance to rebase the
userland. That means mid February to early March most likely.

There will be a new set of ISO images before the alpha comes out, to
give people a chance to test and expose various issues. Another set
will then be made for the alpha release.

## After the alpha

The alpha cycle is planned for 6 months to 1 year. Once it is over and
the project is ready to be declared beta quality, another world rebuild
will be done.

## Summary

I am hoping there will be no more significant delays. Right now, it is
very near, with only a small number of tasks remaining to do. Those tasks
however cover a lot of ground, so they take time.
