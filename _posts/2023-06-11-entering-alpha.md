---
title: Entering alpha stage
layout: post
excerpt_separator: <!--more-->
---

Today marks the day when the project enters the alpha phase. This
has some implications, though it is not a release per se, considering
Chimera is a rolling distribution; let's take a look at what it means
for potential users and contributors.

<!--more-->

## So, what does it mean?

Simply put, having entered the alpha phase means that the project is
somewhat more ready to deal with users and potential repository
expansion. A great deal of work has been done in all areas since
the last update, and the distribution is now a lot more stable,
with better infrastructure, and so on.

Of course, since it's a mere alpha, it does not mean the system is
considered stable per se. There may still be large-scale changes
eventually (hopefully for the better) but early adopters may now
consider actually daily-driving the system, and we are ready for
the repositories to grow.

This phase is expected to last about a year. Obviously, it is not
possible to create a distribution from scratch and immediately mark
it stable. The current biggest things in the way are:

1. There isn't enough software in general
2. Major improvements are still planned for service management
3. Documentation needs work in all areas
4. And obviously a lot of testing

During the next year, it is planned that those things (and others)
will be addressed and the project will move towards beta.

In summary, the current state of the project means it's daily-driveable
and can be gradually updated without significant manual fixups, but
there may still be bugs, missing documentation, and some things may
still change at conceptual level.

## Infrastructure

The distribution finally has proper infrastructure now. This means:

1. Central build system (using Buildbot), taking care of automatically
   building and publishing packages for all supported architectures,
   and native builders for each.
2. Continuous integration for pull requests.
3. Package repository browser with advanced filtering and search.
4. Nightly global update-check for packagers.

Thanks to all this, there is now streamlined workflow for adding new
packages and updating existing ones, making it a significantly lesser
effort.

## Cports updates since last post

There has been a huge amount of changes since. A summary of these
includes:

1. Userland based on FreeBSD 13.2.
2. All existing packages have been updated to their latest versions.
3. LLVM 16 is now the system toolchain.
4. GNOME 44 is the primary desktop environment.
5. Qt6 toolkit is now present in the repositories.
6. OpenJDK 17 Java is now in the repositories.
7. Flatpak support.
8. Several large pieces of software such as Thunderbird, GIMP, Inkscape,
   LibreOffice, QEMU, OpenMW, Xonotic, Sauerbraten, etc. are now present.
9. Smaller useful software such as Chrony, htop, Deluge, Weechat, Neovim,
   Dino, Rsync, and others.
10. The option of latest stable Linux kernel branch in addition to latest
    LTS branch.
11. The cports repository now features more than 1000 templates in `main`
    and `contrib`, with more than 22000 total packages.

This list is not exhaustive.

## New images

This update comes with a new set of images. The main improvement is
streamlined installation thanks to new `chimera-install-scripts` package.
