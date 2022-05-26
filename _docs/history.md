---
layout: book
title: History
section: 1.1
---

Chimera Linux started in the middle of 2021 with the goal of creating
a modern non-GNU distribution. The first component of Chimera was `cbuild`,
first imported at the beginning of June 2021 after about a month of
development.

Initially, `cbuild` was a from-scratch rewrite of `xbps-src` from Void Linux.
It came with a minimal set of build templates, then still based around the
GCC compiler and GNU `coreutils`, as well as the `xbps` package manager,
on the `ppc64le` CPU architecture (self-bootstrap was possible from the start).

Milestones followed:

* June 21 2021: `xbps` dropped in favor of `apk-tools`
* June 24 2021: `gcc` and `binutils` removed in favor of `clang` and `elftoolchain`
* June 30 2021: `coreutils` removed in favor of `bsdutils`
* July 4 2021: `aarch64` and `x86_64` support added
* July 16 2021: cross-compiling support, `riscv64` support
* October 2021: universal unit-test and lint coverage
* October 2021: added `dinit`, `initramfs-tools`, Linux kernel
* October 2021: bootable system
* November 2021: GUI support (Weston)
* November 2021: system-wide LTO
* December 2021: DOOM runs
* December 2021: audio support (PipeWire)
* December 2021: GRUB support (complete boot coverage)
* December 2021: system-wide user services support
* December 2021: X11 support (`pekwm`, Enlightenment)
* December 2021: `syslog-ng` support
* December 2021: video playback (`ffmpeg`, `mpv`)
* January 2022: OpenSSL 3.x
* January 2022: WebKit + Epiphany web browser
* January 2022: GNOME desktop (Wayland, X11)
* January 2022: Firefox web browser
* February 2022: CKMS (Chimera Kernel Module System)
* February 2022: ZFS support
* February 2022: Initial live ISOs available
* March 2022: Transition to `apk-tools` 3.x

Since then, development has been mostly stable and continuous.
