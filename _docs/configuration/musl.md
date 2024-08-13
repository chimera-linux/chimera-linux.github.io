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

Chimera by default uses the [mimalloc](https://github.com/microsoft/mimalloc)
allocator. This is unlike default musl, which uses its own custom allocator
called `mallocng`.

As the stock allocator is the primary reason for nearly all performance
issues people generally have with musl (fewer CPU-optimized algorithms
and so on typically make a negligible impact, while the allocator impact
can be very significant), Chimera has chosen to patch in `mimalloc`.

There are, however, scenarios, where one may want to use the stock allocator:

1. Those who are particularly security-paranoid and are willing to sacrifice
   possibly a large chunk of their performance for the peace of mind
2. Those for whom memory usage is extremely important, as `mimalloc` is
   somewhat heavier.

For most people, the default is going to be fine (i.e. if you are not
absolutely sure, you should leave things as they are).

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

### Reverting to mimalloc

You can pretty much perform the reverse process:

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
