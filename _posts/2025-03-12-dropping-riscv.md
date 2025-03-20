---
title: Dropping RISC-V support
layout: post
excerpt_separator: <!--more-->
---

**UPDATE March 20 2025:** The architecture is not being dropped
for now after all. See the newer article for details.

The next set of images will drop RISC-V support. The builder is
currently still going but within the next few days it will stop,
and the repositories will stay in place but frozen.

Nothing will change in packaging (the build profile will remain,
template support where present will remain, cross-toolchains will
remain) but there will be no more updates to the repo for the
foreseeable future.

<!--more-->

## The situation

The initial plumbing for RISC-V was added in the distro in July 2021
and repos later in the year, i.e. it has been there almost from the
start. During all this time, the builds have been supported by doing
so on an x86_64 machine with `qemu-user` binfmt emulation coupled with
transparent `cbuild` support for this.

The reason for doing it this way was that there wasn't any hardware
we could use for performance reasons; I had obtained a SiFive HiFive
Unmatched board in October 2021 and this proved to be useless for
builds as the performance of this board is similar to Raspberry Pi 3.
Other boards came later, but none of them improved on that front
significantly enough.

This was expected to be a temporary state that would resolve itself
within 2-3 year time; it is Q1 2025, and the options are the following:

* HiFive P550 that was released recently has performance similar to
  Raspberry Pi 4 and is unsuitable for the task; this board was originally
  supposed to be released several years ago as part of the SiFive and Intel
  collaboration (Horse Creek) but now got released with a Chinese SoC instead
* Milk-V Pioneer is a board with 64 out-of-order cores; it is the only of
  its kind, with the cores being supposedly similar to something like ARM
  Cortex-A72. This would be enough in theory, however these boards are hard
  to get here (especially with Sophgon having some trouble, new US sanctions,
  and Mouser pulling all the Milk-V products) and from the information that
  is available to me, it is rather unstable, receives very little support,
  and is ridden with various hardware problems.
* Things based on Spacemit K1 (e.g. Milk-V Jupiter) have an 8-core SoC that
  is technically an out-of-order design, but in practice the per-core
  performance is reportedly even worse than the JH7110, so it is unsuitable.
* Boards based on JH7110 (e.g. VisionFive 2, the new Framework board etc.)
  utilitze 4 U74 cores (same configuration as my HiFive unmatched) that are
  simple in-order designs and therefore are unsuitable (similar to RPi3).
* My HiFive Unmatched, which is the same situation as above.
* Other available cores are usually much worse than any of the above.

The promising option (Milk-V Oasis with 16 SiFive P670 cores) that was
first announced in 2023 ultimately ended up being canned due to issues
the SoC vendor has, and nobody has ever seen a single production chip,
let alone a board. As far as I can tell, no other options are coming up.

It is unsustainable to stick with the current situation with the emulator.
Doing so has numerous problems:

* We could never actually run tests on the packages being built, because
  the emulator is unreliable and will result in false positive failures.
  Disabling stuff conditionally for RISC-V is not a viable option because
  they are not RISC-V issues and will always happen with emulation, so
  all the RISC-V packages were being built without tests.
* It is very slow, being by far the slowest builder in our fleet. It is
  still several times faster than e.g. the JH7110 would build things. The
  performance is actually rather variable; things that can parallelize
  really well run at a fairly reasonable speed due to being able to spawn
  many emulators, while things like configure scripts that are single
  thread and fork a lot run very slowly. Either way, overall, it is much
  slower than any of the other builders, despite RISC-V being until the
  introduction of LoongArch64 builds the only architecture with no LTO.
* Most importantly, it is unreliable. The `qemu` emulator likes to hang
  during various workloads, with the emulator going into sleep state and
  remaining there forever. When that happens, the builds have to be
  manually canceled and restarted (it is not deterministic). This used
  to be worse before before some fixes, but even with latest version of
  the emulator it still happens, particularly during Go builds (since
  we rebuild every Go program upon toolchain updates for secfixes,
  any such rebuild can require many manual cancelations and restarts).
* It burns a ton of power for how slow it is, because it fully loads
  a beefy x86 machine, and I'm not happy at all about that.

At this point, to have a relatively sustainable base, we'd need a board
that is at least as powerful as Raspberry Pi 5. This would still make
the slowest builder in the fleet, but it would likely be faster than
the current emulation arrangement while also being more reliable.

However, the industry does not seem to be interested in producing such
machines and for most part focuses on embedded (low-end) as well as
things entirely irrelevant to a distro (AI/NPU etc.) that do not help
at all; at this point I don't think we can wait any longer, especially
as no remedy has been announced.

We have no such problem with the other architectures; obviously x86 and
ARM are at this point mainstream and this does not surprise anyone, but
even the likes of LoongArch have perfectly acceptable hardware (not the
fastest, but also not a bottleneck) that performs reliably.

## Will RISC-V support be reintroduced?

If acceptable build hardware is released and is reasonably available to
us, the architecture will be reintroduced.

If that happens, the repositories will be rebuilt from scratch, as if
a new architecture, with a process similar to how it was recently done
with LoongArch64. It will be a tier-2 architecture with enforced tests
and without LTO just like LoongArch64.

However, whether or when that will happen is currently a big unknown
due to such hardware not existing and nothing being even announced.

Nothing will change in the other architecture support. The new tier
list will be:

* Tier 1 for `aarch64`, `ppc64le`, and `x86_64`
* Tier 2 for `loongarch64`
* Tier 3 for `ppc64` and `ppc`

There is also some chance of ARMv7 and ARMv6 32-bit repositories being
introduced in the next few months' timeframe, as we may be moving to
an oversized Ampere Altra machine for all ARM builds (right now AArch64
is served by a Hetzner Cloud VM and can't take any more load). This is
yet not set in stone, however.
