---
layout: page
title: About
---

## Alternative userland

Chimera comes with a novel userland setup based on FreeBSD core tools
(replacing `coreutils` and related projects like `findutils`, `diffutils`,
`sed` or `grep`; read our [FAQ](/docs/faq) for details about why).

The FreeBSD tools were chosen for their high quality code and solid feature
set. Some source code is also taken from NetBSD and OpenBSD. While we are
not philosophically opposed to GNU/GPL and licensing is not really a factor,
there are real benefits to using them, and they are overall a better fit for
the project.

The LLVM/Clang suite provides the system toolchain (`clang`, `lld`) as well
as runtime parts (`compiler-rt`, `libunwind`, `libc++`). The C library is
provided by `musl`, patched to use LLVM's (also used e.g. in Android and
Fuchsia) Scudo allocator for performance as well as security.

This means Chimera is not a GNU/Linux system, as it utilizes neither GNU
utilities, nor GNU libc, nor GNU toolchain. The system is bootstrappable
almost entirely without any GNU components (other than `make`) and is
capable of booting without them (however, most people will have some).

Chimera's package collection is hardened, utilizing multiple techniques as
needed/allowed, including common software ones (such as stack canaries), less
common software ones (Clang Control Flow Integrity, SafeStack, as well as a
subset of UBSan) and hardware-assisted (such as Intel CET and ARM PAC/BTI).

This is partially enabled by Chimera's system-wide deployment of LTO, or
Link-Time Optimization, which additionally has other benefits when it comes
to performance and binary size. Clang's ThinLTO is utilized to mitigate the
build-time cost of LTO.

The `dinit` project provides the service manager and init system for the
OS. It's a lightweight, dependency-based (unlike e.g. `runit`), supervising
(unlike e.g. `sysvinit`) and portable (unlike `systemd`) system with a good
balance of features to simplicity and ease of use/deployment (unlike e.g.
`s6`) and Chimera uses it extensively for both system and user services.

Here is an example table of some major system components and their providers:

| Software                   | Source                   |
|----------------------------|--------------------------|
| Compiler and runtime stack | LLVM                     |
| C standard library         | Musl with Scudo          |
| `binutils`, `elfutils`     | ELF Toolchain            |
| Core userland              | FreeBSD, NetBSD, OpenBSD |
| Init and logging           | Dinit, syslog-ng         |
| Audio stack                | PipeWire                 |
| Desktop environment        | GNOME                    |
| Web browser                | GNOME Web                |

Typically there is more than one option available for each component,
but the defaults tend to be well tested and recommended.

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
* Software is in general enabled for `elogind` or similar solution instead
  of suid bits and root privileges.

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
and to help catch bugs. It is already possible to use the system with
binary repositories on architectures such as AArch64, little endian
POWER, 64-bit RISC-V and obviously the common x86_64.

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

Repositories will be expanded as needed over time with support for new
CPU architectures. Current plans include big-endian POWER.
