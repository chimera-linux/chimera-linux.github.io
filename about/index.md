---
layout: page
title: About
---

## Alternative userland

Chimera comes with a novel userland setup based on FreeBSD core tools
(replacing `coreutils` and related projects like `findutils`, `diffutils`,
`sed` or `grep`; read our [FAQ](/docs/faq) for details about why).

The FreeBSD tools were chosen for their high quality code and solid feature
set. However, Chimera does not aim to replicate the FreeBSD experience on
Linux in general, instead having its own choices and workflows.

The LLVM/Clang suite provides the system toolchain (`clang`, `lld`) as well
as runtime parts (`compiler-rt`, `libunwind`, `libc++`). The C library is
provided by `musl`, patched to use LLVM's (also used e.g. in Android and
Fuchsia) Scudo allocator for performance as well as security.

This means Chimera is not a GNU/Linux system, as it utilizes neither GNU
utilities, nor GNU libc, nor GNU toolchain. However, the project is not
anti-GNU/GPL, and its userland choice is [primarily technical](https://chimera-linux.org/docs/faq#so-why-use-a-bsd-based-userland-anyway).
Users are generally free to use whichever software they like.

Chimera's package collection is more strongly hardened than usual, utilizing
multiple techniques as needed/allowed, including common ones such as stack
canaries and PIE as well as less common ones such as a subset of UBSan and CFI.

This is also enabled by our different tooling choices; the BSD userland is
easier to harden, the LLVM toolchain provides the methods, and the rest is
a matter of how it's put together. Relatedly, Chimera is entirely compiled
with Link-Time Optimization thanks for Clang ThinLTO (which mitigates the
burden on our infrastructure), which reduces binary size, improves performance,
and allows certain security hardening methods to be effective.

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

The system does not insist on legacy cruft and since it's a new system,
it can afford to start over. That is also reflected in its software
choices, preferring modern solutions such as Wayland and PipeWire.

The system aims to have one default, recommended way to do most things.
That means endorsing specific software (through inclusion in the `main`
repository and core metapackages) and specific configurations. However,
it also tries to balance that with giving users a choice by being
modular and flexible.

We are also putting a lot of effort into writing fresh low-level plumbing.
For example, Chimera comes with first-class and built-in support for user
services and other things dependent on session tracking (such as a shared
session bus), implemented from scratch thanks to our Turnstile project,
finally bringing functionality previously only available on distributions
using systemd. This is being implemented in a vendor-independent manner
so that other distributions can adopt it.

Proper service management infrastructure is a major overall goal. For all
intents and purposes we aim to provide infrastructure that can rival
systemd in terms of practicality but with a less problematic implemntation.
Most non-systemd distributions have been largely ignoring this aspect to
say the least, which is now finally getting fixed.

Chimera is not a "minimalist" system. It wants to be simple and grokkable,
but also practical and unassuming. It can be made pretty small or pretty
large, it does not try to emulate anything or hold onto old ways for no
reason, rejects reactionary tendencies, and tends to be opinionated in
various ways.

## Buildable from source

Chimera uses binary packaging. The choice of package manager is `apk-tools`,
known from Alpine Linux. Chimera is not a fork of Alpine, and uses the
next-generation version of `apk-tools`, known as APKv3, being the first
distribution to practically deploy it at this scale.

To build the binary packages, it uses a custom, written-from-scratch
infrastructure called `cports`, with a build system called `cbuild`,
written in Python. It is designed to be strict and correct, while
minimizing the maintenance cost and allowing it to be managed with a
small number of maintainers. Best practices are enforced via agressive
linting and a strict sandbox. The system is also very fast, improving
build speeds (by not spending time in `cbuild` pointlessly) and reducing
reliance on caching.

All `cbuild` builds are done in a minimal, reproducible container. This
is implemented with Linux namespaces and is a part of the sandbox strategy.
They enable e.g. the build-time root filesystem to be read-only, network
access to be disabled and so on. It also runs entirely unprivileged, not
requiring `root` access at any point. All combined, it means `cbuild` can
be run on almost any host distribution.

Perhaps most importantly, this lets power users easily package the software
they need. If they like, they can then contribute their changes back to
the distribution itself, using a standard pull requests workflow.

## Portable

Various CPU architectures are supported by Chimera to avoid monoculture
and to help catch bugs. It is already possible to use the system with
binary repositories on architectures such as AArch64, little endian
and big endian POWER, 64-bit RISC-V and obviously the common x86_64.

There is a central infrastructure that automatically builds all incoming
changes on every architecture, so all repos are always up to date.

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
