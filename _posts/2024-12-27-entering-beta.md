---
title: Entering beta
layout: post
excerpt_separator: <!--more-->
---

Today we have updated `apk-tools` to an `rc` tag. With this,
the project is now entering beta phase, after around a year
and a half.

<!--more-->

## What actually changes?

In general, this does not actually mean much, as the project
is rolling release and updates will simply keep coming. It is
more of an acknowledgement of current status, though new images
will be released in the coming days.

## Changes since alpha

At the point of entering alpha, the `cports` tree had roughly
1000 templates, most of them in `main`. There was a single
large desktop (GNOME) and a single major web browser (Firefox)
and an assortment of other software.

At this point, the tree contains ~2800 templates, i.e. almost 3x
more. We have all major desktop environments, all major browsers,
and overall much larger collection of both small and large programs.

The repo was also at ~6000 commits at the time, by 11 authors; now
it's almost 20000 commits, by over 100 authors.

Significant under-the-hood improvements have been made in service
management, our build infrastructure, the `cbuild` build system
which is now significantly more powerful and has much better UX,
global switch to the `mimalloc` allocator, stateless `/var` and
progress towards stateless `/etc`, improvements in core userland,
introduction of `libdinitctl`, introduction of `sd-tools`,
and a lot more.

## Infrastructure situation and sponsorship

Currently, we support 5 architectures (`aarch64`, `ppc64le`, `ppc64`,
`riscv64`, `x86_64`), 3 being tier-1 (`aarch64`, `ppc64le`, `x86_64`).

This list will likely remain stable in 2025. The infrastructure is
self-funded and we control all of it. Besides the unsatisfactory
RISC-V situation, all of the machines are sufficient.

It would be nice to introduce CI for more architectures during next
year, particularly AArch64.

Chimera is a FOSS project and therefore does not and will not take
donations, and is driven by its community. However, for the past half
a year, I (q66) have been working on the project through my employment
at Igalia, thanks to a contract with Rubicon Communications, LLC
(aka Netgate). This collaboration will continue during 2025 and
is a significant help and a boost for the project's progress, as it lets
me dedicate much more time.

Therefore, huge thanks to Netgate for giving me this opportunity.

## Plans for 2025

During 2025, some notable things will be coming too:

* Complete system logging overhaul
* Support for mount units in service management
* Support for network mounts in service management
* Better cgroups support and progress towards removal of elogind
* Support for service-based timers
* Overhaul of service configuration files
* Switch to dbus-broker as the system and session bus provider

And likely much more than that. On the infrastructure side, we
plan to automate more things, and introduce better build hardware
for the RISC-V architecture if possible, as right now it is a
major bottleneck.

## Upcoming images

A new image set will be released before end of the year to match
this announcement. They will come with various fixes and a new
version of `apk-tools`.
