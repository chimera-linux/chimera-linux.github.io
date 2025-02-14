---
title: New images
layout: post
excerpt_separator: <!--more-->
---

The 20250214 set of images is now published.

This took longer than originally expected but there have been
major changes that warranted waiting a bit longer for it.

<!--more-->

## Changes

The images come with a fresh version of `apk-tools`. This version
finally supports several features that we began using, particularly
variable expansion and being able to migrate most of its files into
a system-wide `/usr` location.

That means you finally have a way to properly change your mirror
of choice without having to mess with the repository definitions.
The process of doing that is in the relevant documentation section.

The repository definitions have been updated to use the new v3-style
index naming, though backwards compatibility is also provided.

Kernel 6.13 is used in the new images. That means updated hardware
support and other things.

Both the GNOME and Plasma images (the latter is still experimental)
come with the latest versions of their respective desktop environments.

Various fixes have been made to allow the live system to work better
and more seamlessly on more machines.

Additionally, 32-bit PowerPC images are now a standard release architecture
and included in the batch. We have some plans to also introduce support
for the LoongArch64 ISA, which may join them next time.

Due to all of these changes as well as updates in the infrastructure,
this new set is the recommended baseline for installation. Older images
have an out of date package manager and installation scripts, which may
be problematic with the current layout.
