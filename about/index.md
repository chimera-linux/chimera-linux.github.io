---
layout: page
title: About
---

Chimera Linux was started in 2021 after many years of deliberation.

Traditional large distributions are complex and carry a large amount of
baggage. It is easy to do things with them, but it is difficult to understand
what is under the hood. That means that as soon as the user strays beyond the
path set or expected by the developer, the system becomes impenetrable.

Simple, smaller distributions try to provide an answer to that problem. However,
that often results in a system that requires a lot of manual configuration as
well as cases where the system deliberately does not address various use cases
with the excuse of those cases going against the principles of the project.

Chimera was born from the idea that this doesn't have to be the case, that you
can have your cake and eat it too. A large part of this is breaking up existing
status quos; the tooling is fresh, the packaging is brand new, and it's not
built using any existing distro as a base, which gains it flexibility. Good
software design helps reduce needless complexity, without having to concede
practicality.

A core tenet of Chimera is that being simple is better than being complex,
but being complex is better than being complicated. The whole system is
transparent to the user, aiming to avoid gotchas. This makes debugging
potential issues (which may always come up, since we are still humans)
easier, while also ensuring the user is in control. However, a lot of care
is put into ensuring that everything has reasonable defaults (which does
not mean magical automatic behaviors) and requires a minimal amount of effort
to get working (ideally zero, while retaining a methodical approach).

On top of this, the system offers a huge amount of flexibility in terms of
hardware configurations the user may run the system on, from old hardware
to current, with multiple CPU architectures supported.

That's the general overview. Below are some of the technical specifics of
the system. A lot of these are not significant selling points by themselves;
however, they are important means to an end.

## Comparison with other distributions

A lot of people seem to ask "why this over Alpine" or "why this over Void"
or similar questions, so we will cover this first.

Firstly, Chimera is built on the idea of providing strong guarantees for the
end user device. This means for example the following:

1) Well-integrated, advanced service management with support for things like
   user services out of the box with no additional configuration, and the system
   making full use of it by default, including service-driven activation where
   possible.
2) Session tracking is built-in, always enabled, and various software makes use
   of it. We are maintaining our own framework for it.
3) D-Bus session bus IPC likewise makes use of it, which means a shared session
   bus that persists for the login (started upon first login, stopped upon last
   logout) which means no ad-hoc "start with desktop" workarounds (which make
   the bus local to the specific virtual terminal and so on).

While systemd-based distributions provide those, there are no other non-systemd
distributions that do that as of the time this was written. We fully approve of
the concepts systemd brings to service management, though not necessarily of
their implementation.

Secondly, Chimera streamlines its packaging. That means making use of the full
potential of its package manager and ensuring the packaging definitions are of
sufficient quality to for example:

1) Chimera does not need additional tooling for setup; for example, enabling
   a desktop environment generally means just installing its package and then
   starting it or enabling a display manager service or similar, and likewise
   things like alternatives tracking are fully done with apk rather than ad-hoc
   scripts.
2) We aim for stateless configuration (packages only installing in `/usr` which
   is never changed by the user, and all other data being potentially removable)
3) Packages drive coarse system configuration, which means the apk world file
   and resulting package graph results in a complete, working system on its own,
   and this system can always be reproduced from the world file alone.
4) Packages don't utilize intermediate pre/post install/upgrade/remove scripts,
   making every apk transaction semi-atomic (files do not need to be committed
   to their final location until the very end, and any setup is done with
   idempotent package triggers which react to filesystem changes).

Having a high quality packaging base ensures that the system is flexible for
many different use cases. Many of these concepts have been driven by for example
immutable distributions, NixOS, and the likes; meanwhile, Chimera is still a
"traditional" distribution in this regard, it tries to integrate these concepts
to ensure robustness and flexibility.

Relatedly, Chimera comes with a state of the art packaging tooling; in other
"regular" distributions, packaging tooling is usually a set of shell scripts,
Makefiles, or similar, with purpose-built tools for gluing those to the build
infrastructure. Chimera's tooling is written from scratch, does not involve
any shell, is very high-performance, high-strictness, and unified; it provides
everything a package maintainer would need in a single minimal-dependencies
repository (and it can be used on any distribution, as it assembles its own
container), tries to be helpful, reduce the maintenance effort to a minimum,
and allow us to function with a small team and minimal infrastructure aligned
with the concept of "achieve 90% with 10%", while still being able to provide
a very complete repository. We also believe that the local tooling should be
the same as what runs on the build server; this makes e.g. switching to a new
orchestration backend or adding a builder for a new architecture remarkably
simple.

Thirdly, Chimera has a security-hardened toolchain, more so than any other
traditional distribution. This is largely enabled by our userland and compiler
choice, and uses techniques not seen in desktop Linux outside of niche efforts
or non-general-purpose systems like Android. This reduces the overall attack
surface.

Below is a description of the system that goes more into detail and does not
compare to any other project.

## Alternative userland

Chimera comes with a novel userland setup based on FreeBSD core tools
(replacing `coreutils` and related projects like `findutils`, `diffutils`,
`sed` or `grep`; read our [FAQ](/docs/faq) for details about why).

The FreeBSD tools were chosen for their high quality code and solid feature
set. However, Chimera does not aim to replicate the FreeBSD experience on
Linux in general, instead having its own choices and workflows.

The LLVM/Clang suite provides the system toolchain (`clang`, `lld`) as well
as runtime parts (`compiler-rt`, `libunwind`, `libc++`). The C library is
provided by `musl`, patched to use the `mimalloc` allocator.

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
| C standard library         | Musl with mimalloc       |
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
systemd in terms of practicality but with a less problematic implementation.
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
small number of maintainers. Best practices are enforced via aggressive
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
