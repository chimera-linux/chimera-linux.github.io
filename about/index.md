---
layout: page
title: About
---

## Alternative userland

Chimera comes with a novel userland setup based on FreeBSD core tools
(replacing `coreutils` and related projects like `findutils`, `diffutils`,
`sed` or `grep`).

The FreeBSD tools were chosen for their high quality code and solid feature
set. Some source code is also taken from NetBSD and OpenBSD.

The LLVM/Clang suite provides the system toolchain (`clang`, `lld`) as well
as runtime parts (`compiler-rt`, `libunwind`, `libc++`). The `musl` project
serves as the C library, as it's standards-compliant and widely compatible.
Chimera does not currently ship GCC in any part of its package collection.

This means Chimera is not a GNU/Linux system. While this is debatable for
certain other distributions as well (e.g. Alpine), they typically still
tend to use the GNU compiler and other things.

The system is bootstrappable almost entirely without GNU components (`make`
is still needed) and you can have an entirely GNU-free bootable system if
you want (however, common setups will still contain GNU parts).

The project is not philosophically opposed to the GNU or the GPL, and various
GPL components are shipped in the system. However, BSD utilities are a better
fit for the OS technically, simplifying the system, its build and bootstrap
path, and being less crufty.

The use of the LLVM toolchain enables use of LTO (Link-Time Optimization)
across the system (thanks to ThinLTO) for smaller size, better performance
and future use of additional e.g. hardening features such as CFI. It also
allows for much cleaner cross-compiling (one toolchain for everything).

The `dinit` project provides the service manager and init system for the
OS. It's a lightweight, dependency-based, supervising system with a good
balance of features to simplicity and Chimera uses it extensively across
the system; besides system services, it also manages user services, and
most long-running processes should be managed through it.

Various other options were evaluated, but were found to be generally
insufficient. These include `sysvinit` and BSD-style init (no supervision
with `rc` scripts), OpenRC (no supervision by default), `runit` and other
`daemontools`-style systems (no dependencies, oneshots and other features),
`s6` (too complex and frameworky) and `systemd` (excess complexity and
reliance on `glibc` API extensions).

Here is an example table of some major system components and their providers:

| Software                   | Source                   |
|----------------------------|--------------------------|
| Compiler and runtime stack | LLVM                     |
| C standard library         | Musl                     |
| `binutils`, `elfutils`     | ELF Toolchain            |
| Core userland              | FreeBSD, NetBSD, OpenBSD |
| Init and logging           | Dinit, syslog-ng         |
| Audio stack                | PipeWire                 |
| Desktop environment        | GNOME                    |
| Web browser                | GNOME Web                |

There is, of course, a lot more software in the repository, and some
of the above have other alternatives available that you can choose from.

## Clean and consistent

Since Chimera is a new distribution, it aims to use this to get rid of
some legacy compatibility that is holding things back.

Examples of this are:

* The preferred display server is Wayland.
* Audio shall be handled through a sound server. The ALSA library will
  only serve as a backend for sound servers, and be significantly stripped
  down. The recommended sound server will be PipeWire.
* Scalable fonts shall be distributed in the OpenType/CFF format. It is
  a goal to do so when possible for higher quality font rendering. Some
  fonts may ship both OpenType and TrueType, with OpenType being the
  default, and users being given a choice.
* Only Python 3 is shipped.
* Software is in general enabled for `elogind` by default and SUID bits
  are frowned upon.

The system aims to have one default, recommended way to do most things.
That means endorsing specific software (through inclusion in the `main`
repository and core metapackages) and specific configurations. However,
it also tries to balance that with giving users a choice by being
modular and flexible.

Chimera is explicitly not a minimalist or "suckless" system (but it does
want to suck less). While being simple and grokkable is important, this
should not be done at the expense of feature set. It also rejects any sort
of reactionary tendencies or pointless traditionalism. It's not a goal to
work like something else or hold onto something for the sake of it; it
should be its own system and have its own ways, when necessary.

## Buildable from source

Chimera relies on binary packaging (`apk` version 3) to manage software,
but to build the binary packages it uses a custom build system written in
Python with its own collection of source package templates. This is designed
to be fast and strict by default in order to prevent technical debt and
enable easy introspection. Best practices are enforced through the
combination of well designed API and a strict sandbox.

All builds done with `cbuild` are done in a minimal, reproducible container
implemented with Linux namespaces. These are used e.g. restrict network
access in the container and make its root file system read-only in addition
to the container functionality itself. The system also does not require or
allow running with root privileges.

Unit tests are run for all builds by default to help catch issues and
keep track of what's broken.

The bootstrap process is multi-stage (with 4 total rebuilds). The first
stage is built entirely using host tools and toolchain, with subsequent
rebuilds gradually eliminating host environment influence as well as
enable full feature set.

You can bootstrap the system from source code on various `musl`-based
distributions. On incompatible hosts, special tooling is provided to
enable easy bootstrapping as well. Once bootstrapped, `cbuild` can be
run directly regardless of host environment.

## Portable

Various CPU architectures are supported by Chimera to avoid monoculture
and to help catch bugs. The architecture support is tiered, with tier 1
supporting `aarch64`, `ppc64le` and `x86_64`. Subsequent tiers provide
`riscv64` and big endian `ppc64` at this point.

Adding support for a new architecture is extremely easy, as long as the
LLVM stack properly supports it. One simply needs to create a `cbuild`
profile, bootstrap the system, and possibly modify build templates that
have architecture-specific parts in them (which is kept to a minimum).

The build system supports transparent cross-compiling, and the same
profile configuration can be used for both native and cross builds.
Cross-compiling can be used to bootstrap for previously unsupported
architectures as well as compile regular packages for them (however,
native builds are encouraged, as cross-builds do not provide the
same guarantees and not everything cross-compiles cleanly).
