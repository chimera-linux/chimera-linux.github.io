---
title: Binary repositories and future plans
layout: post
excerpt_separator: <!--more-->
---

As of today, Chimera now has binary package repositories for the
`ppc64le` and `x86_64` architectures, as well as fresh ISO images.

Every package has been updated to latest version. That means the
system comes with Linux kernel 5.19, latest version of GNOME 42,
WebKitGTK 2.36.x, Firefox ESR 102, and other software.

This does not mean that the distribution is ready to be daily driven.
These are still experimental, and subject to arbitrary changes and
rebuilds. The repositories are currently managed manually. In the
coming months, automated infrastructure as well as CI will be launched.

Within the next couple weeks you can also expect the `aarch64` architecture
to be added to the repositories (alongside generic UEFI ISOs and Raspberry
Pi 3/4 images).

<!--more-->

The `main` repository is automatically installed in any Chimera system.
To add the `contrib` repository, add `chimera-repo-contrib`. To get debug
packages, you can add `chimera-repo-main-debug` or `chimera-repo-contrib-debug`.

Packages outside of `main` and `contrib` are not built.

This also means that the new ISOs do not contain any tooling necessary to
bootstrap the system, as you can easily install that yourself.

Additionally, repos, images as well as auxiliary files such as bootstrap
tarballs for language toolchains can now be found on a stable URL, which
is [https://repo.chimera-linux.org](https://repo.chimera-linux.org).

## Future plans

The immediate goal is to launch the `aarch64` repos and images.

The primary near-term goal is to reach the alpha milestone. That is
available on [GitHub Issues](https://github.com/chimera-linux/cports/milestone/1).

The milestone is subject to expansion, with current completion ETA being
somewhere around November. Once the project has reached alpha phase, it
will be ready for some careful daily driving and additional packaging.

From there, it is expected that things will stabilize more, so that they can
eventually be declared safe for general use.

Alongside that, there are also plans to launch packages and images for the
RISC-V architecture, once the build hardware issue is solved.

