---
layout: book
title: Musl libc
section: 4.99
---

Chimera uses the musl libc. This has a variety of implications:

1. Application compatibility may not be as big as with glibc
2. Most proprietary applications will not work without flatpak or another
   container solution
3. Proprietary drivers with userland parts will not work at all
   (most notably the NVIDIA graphics driver)
4. Minor performance impact is expected

On the other hand, it has some good aspects:

1. A cleaner, leaner codebase with lower resource footprint
2. Perfect compatibility with our toolchain, including compiler-rt
3. Better security and easier hardening
4. It helps expose application bugs and fix them, leading to better
   code across the software stack

## The allocator

Chimera by default uses the [Scudo](https://llvm.org/docs/ScudoHardenedAllocator.html)
allocator (notably also used by default by Android). This is unlike default
musl, which uses its own custom allocator called `mallocng`.

As the stock allocator is the primary reason for nearly all performance
issues people generally have with musl (fewer CPU-optimized algorithms
and so on typically make a negligible impact, while the allocator impact
can be very significant), Chimera has chosen to patch in Scudo.

Both the stock allocator and Scudo are hardened allocators focused on security.
Musl's stock allocator is even more so, as it goes as far as keeping a global
lock in order to ensure consistency, which in turn leads to poor performance
in multithreaded programs, often things that are user-facing/interactive
or where performance is otherwise important.

There are, however, scenarios, where one may want to use the stock allocator:

1. Those who are particularly security-paranoid and are willing to sacrifice
   possibly a large chunk of their performance for the peace of mind
2. Those for whom memory usage is important to the point of caring about
   virtual memory; particularly on devices where RAM is very constrained,
   such as old computers and embedded devices

For most people, the default is going to be fine (i.e. if you are not
absolutely sure, you should leave things as they are), however, it does
currently use around 120 megabytes of virtual memory per process (keep in
mind that this is really virtual memory, not real memory, the real memory
usage is very low regardless of the allocator, and Linux default configuration
is set up in a way that this will usually not pose a problem; we also
intend to further tune the allocator settings in near future).

In any case, there is a way to install the libc with the stock allocator.
The package is called `musl-mallocng`.

If you wish to proceed, create a virtual override first:

```
# apk add --virtual musl-safety-override
```

After that, you will be permitted to install the replacement libc:

```
# apk add musl-mallocng
```

It is recommended that you do this from a console environment. The machine
should be rebooted afterwards.

### Reverting to Scudo

If you wish to switch back, this has to be done from an external system
or with a static `apk`. This is because the libc is a core component as
`musl-mallocng` replaces the `musl` package, trying to force the stock one
back in will result in `libc.so` missing.

With a static `apk`:

```
# apk del musl-mallocng musl-safety-override
# apk add musl
```

The first `del` is harmless by itself. It will merely remove `musl-mallocng`
and `musl-safety-override` from world, but will not perform any changes.
The second run will replace `musl-mallocng` with regular `musl`.

Now you can also remove `musl` from world:

```
# apk del musl
```

This step is optional.

It is recommended that you have a system with external `apk` available for
recovery, or at least a static build of `apk` accessible from your current
shell, in case something goes wrong.
