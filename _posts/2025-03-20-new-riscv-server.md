---
title: Not dropping RISC-V support after all (maybe)
layout: post
excerpt_separator: <!--more-->
---

As circumstances have changed, we are not dropping RISC-V repos
for the time being. Instead, newly rebuilt repositories are introduced,
built on hardware, with tests.

This support is provisional for now, with the new builder still being
evaluated to see how it holds up in the long term.

<!--more-->

## The situation now

Shortly after announcing the drop, we were offered remote access to
a Milk-V Pioneer machine by [Zach van Rijn](https://zv.io) of Adélie
Linux. This machine was originally intended for another purpose which
never ended up materializing.

I proceeded to do a full world rebuild on this machine, after some
environment setup to allow our infra bits to run. This world rebuild
is now finished, and makes up the new repository.

For most part, it was relatively stable during the build (we had to
build our own kernel to prevent the draft RVV 0.7 in the CPU from
interfering, and there were two crashes but it was also under total
continuous load the whole time).

The performance is fairly acceptable, though nowhere near my original
idea of being similar to Cortex-A72; the cores are more comparable
to Cortex-A55 in practical performance, especially since we have to
disable vectors. As there is still 64 of them, most of the large
projects build fairly fast (anything written in Rust builds very
slowly, however).

By now, the original repositories have been replaced, and the new
machine is plugged into the infrastructure. Do keep this in mind when
upgrading existing installations, and use the `--available` flag with
`apk` (every package in your system will be reinstalled).

Either way, we will continue to monitor the builds and see how the
new machine holds up. If it works well, it will stay; if significant
issues arise, we might end up dropping the architecture after all,
at least until something significantly better is available.

The current repository is in the same tier as the LoongArch64 repo.
The specifics are very similar - i.e. no LTO, tests on and enforced.
The overall coverage is also fairly equivalent.
