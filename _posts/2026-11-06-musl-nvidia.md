---
title: Making musl and proprietary NVIDIA drivers work together
layout: post
excerpt_separator: <!--more-->
---

As you may be aware, one of the limitations of musl-based distributions is that
they will not function to their proper extent when used in computers with
various NVIDIA graphics cards.

This is due to the proprietary nature of the driver, being built for glibc.
I have been experimenting with trying to make this work, and this post is
the summary of that effort.

<!--more-->

## Context

The NVIDIA graphics cards are tricky on Linux. While most other GPU vendors by
default use free software graphics drivers (with kernel drivers in-tree in
Linux, and userspace supplied by the Mesa project), NVIDIA in general does
not, relying on an out of tree kernel driver and proprietary userland libraries
that are supplied by the vendor.

A free software driver does exist, called Nouveau (kernel and OpenGL Mesa
driver) and NVK (Vulkan driver). This allows the cards to work, but usually
with significantly reduced performance, due to various reasons.

Currently the state depends significantly on what generation of NVIDIA card
you have.

In short:

* Anything older than Maxwell (GTX 700 series) is unsupported by the proprietary
  driver on modern systems, and supported to some extent by Nouveau, but may
  have issues due to poor maintenance nowadays; performance should be okay
  when it works.
* Maxwell (GTX 700 and 900 series) and Pascal (GTX 1000 series) is supported
  fully by the legacy 580 branch of the proprietary driver, which also supports
  newer hardware. It works with Nouveau, but with very poor performance, as the
  cards can never reclock from their very low boot clocks (which would require
  firwmare that NVIDIA never released).
* Turing (GTX 1600 series and RTX 2000 series) and anything newer is supported
  by the current main proprietary driver branch (at the time of writing, 620)
  as well as the legacy (580) branch, and by Nouveau, as these cards use the
  GSP firmware that is included in `linux-firmware`. However, using the FOSS
  driver means only getting 40-80% of the proprietary driver's performance.
  Other than that, the experience is often okay, particularly with NVK.

In even shorter, if you have RTX 2000 and above you are mostly okay with
FOSS but lose performance, if you have newer than GTX 600 but older than
GTX 1600 you are screwed and need the proprietary driver, if your card is
really old it may or may not work well and you may not be able to use it at all.

## Proprietary drivers and musl

We now have a [pull request](https://github.com/chimera-linux/cports/pull/6531)
open for both the 580 and 620 branch. It is not yet entirely ready but works,
and is available for `x86_64` and `aarch64` architectures as NVIDIA supplies
it.

To get there, there were multiple things to take care of. Particularly, using
stock musl is out of the question and will likely never work. I will elaborate
on each thing.

## GLVND

The GLVND library was created by NVIDIA to allow for vendor-neutral OpenGL
dispatch. It provides the libraries that applications link and exposes the
OpenGL (and other) API. It then dispatches the calls to the implementations,
which may be e.g. Mesa or the proprietary driver.

Most distributions nowadays use GLVND. Mesa comes with its own builtin dispatch
code and does not necessarily require GLVND if you don't build it with it.
Musl distributions in general use this. Chimera at this point does not, and
Void Linux on musl does not as it shares packaging with the glibc branch.

Chimera switched to GLVND on [November 5 2026](https://github.com/chimera-linux/cports/commit/61a25fb28f3d70f0226e730c76a65983b791c660).
Switching is rather straightforward and does not need much documentation.
One just has to package GLVND, rebuild Mesa with it (to avoid using its
builtin dispatch libraries) and take care of packages that have dependencies
on `mesa-devel`.

GLVND is not only useful for NVIDIA drivers, but in general it is the primary
thing users will find useful. There are also some vendor drivers on ARM and
elsewhere but those are niche. The proprietary drivers mandate GLVND since
many years back (this is also very useful on laptops with hybrid graphics,
because then you may still want to keep Mesa for the iGPU).

## Gcompat

The [gcompat](https://git.adelielinux.org/adelie/gcompat) project provides
a compatibility shim to allow for limited usage of programs linked with `glibc`.

It consists of two components:

* the loader, which acts as the dynamic linker (`ldso`) for the programs.
  For example, on `x86_64`, `glibc` programs expect `ld-linux-x86_64.so.2`
  as their dynamic linker. The loader does not do much, as it only sets up
  a library preload for the below, and execs into the real `musl` one.
* the shim library, `libgcompat.so.0`, which implements various symbols that
  are in `glibc` and used by programs, but not in `musl`. It does not implement
  everything. It is what provides the bulk of the functionality, and is useed
  by the means of `LD_PRELOAD`, automatically by the loader.

Unfortunately for us, the latest tagged release of `gcompat` does not provide
all the symbols the proprietary drivers require to resolve. Fortunately for us,
the latest Git branch does. The development nowadays is very slow so we just
bumped it up to the latest revision.

## Patchelf and initial packaging

You can see how the packaging works in the pull request, and that part is
rather unimportant for now, and does not require elaboration. It works in
a similar way to other distros, downloading the `.run` archive from NVIDIA
and installing everything to the correct places.

Of course, in our case, we cannot install it directly, because it depends
on `glibc` and other stuff. We also can't just pull in `gcompat` as is, because
most of the driver is libraries that have no interpreter.

Let's see what happens if we run `ldd` on `libnvidia-glcore.so.580.196.07`,
which is the core OpenGL library.

```
$ ldd libnvidia-glcore.so.580.196.07
	ldd (0x739c4a8b1000)
	libm.so.6 => ldd (0x739c4a8b1000)
	libc.so.6 => ldd (0x739c4a8b1000)
	libdl.so.2 => ldd (0x739c4a8b1000)
	libnvidia-tls.so.580.196.07 => /lib/libnvidia-tls.so.580.196.07 (0x739c4a8a3000)
	libnvidia-gpucomp.so.580.196.07 => /lib/libnvidia-gpucomp.so.580.196.07 (0x739c3fa00000)
	libpthread.so.0 => ldd (0x739c4a8b1000)
	librt.so.1 => ldd (0x739c4a8b1000)
Error loading shared library ld-linux-x86-64.so.2: No such file or directory (needed by /lib/libnvidia-gpucomp.so.580.196.07)
Error relocating /lib/libnvidia-gpucomp.so.580.196.07: mallinfo: symbol not found
Error relocating /lib/libnvidia-gpucomp.so.580.196.07: __strftime_l: symbol not found
Error relocating libnvidia-glcore.so.580.196.07: dladdr1: symbol not found
Error relocating libnvidia-glcore.so.580.196.07: gnu_get_libc_version: symbol not found
Error relocating libnvidia-glcore.so.580.196.07: dlvsym: symbol not found
Error relocating libnvidia-glcore.so.580.196.07: backtrace: symbol not found
Error relocating libnvidia-glcore.so.580.196.07: unsupported relocation type 37
```

There is a bunch of stuff here. So the `libm.so.6`, `libc.so.6`, `libdl.so.2`
etc resolve to `ldd` as they are reserved in the `musl` `ldso`:

```
static const char reserved[] = "c.pthread.rt.m.dl.util.xnet.";
```

The dynamic linker will ignore the suffixes.

For some reason, some of the libraries also have `DT_NEEDED` on `ld-linux-x86-64.so.2`
which is the `glibc` dynamic linker. There are also some relocation failures
that we'll get to later, for now we take out `patchelf`.

So, `patchelf` is a tool that lets you dynamically patch ELF files for things
like library dependencies (`DT_NEEDED`), dynamic linker (`DT_INTERP`), RPATH,
and even some funky dynamic symbol remapping.

We use this to sanitize every library and executable being installed. Let's
begin with something like the following:

```
$ patchelf --remove-needed ld-linux-x86-64.so.2 --remove-needed libdl.so.2 --remove-needed libm.so.6 --remove-needed libpthread.so.0 --remove-needed librt.so.1 --replace-needed libc.so.6 libc.so --add-needed libgcompat.so.0 libnvidia-glcore.so.580.196.07
```

What this does is drop all the dependencies we don't need (this is optional
as `musl` ignores them, but why not? And even on `glibc` since recent versions
they are just compatibility symlinks that point to the libc itself) as well
as add a new dependency on `libgcompat.so.0` to supply the symbols.

This clears up the list a lot, and now only one error remains:

```
Error relocating libnvidia-glcore.so.580.196.07: unsupported relocation type 37
```

We will get to this below. You now have a rough idea about `patchelf`.

## So, about that relocation 37

What is this? Let's check `elf.h`.

```
$ grep R_X86_64 /usr/include/elf.h|grep 37
#define R_X86_64_IRELATIVE	37
```

Googling for this tells us that it's a relocation type for GNU indirect
function (`ifunc`). Ifunc is a mechanism for dispatching to different versions
of a function based on a runtime condition. It is done by having a resolver
function which does the decision logic, and returns the implementation, which
is then called. A good writeup is [here](https://maskray.me/blog/gnu-indirect-function).

This is intentionally not implemented in `musl`. In `glibc` it is used to
pick different implementations of functions like `memcpy` based on CPU
microarchitecture levels for performance reasons. However, indirect functions
are also a major [attack vector](https://github.com/robertdfrench/ifuncd-up),
bypassing RELRO among other things, and in general there are other ways to
do runtime dispatch anyway.

I remembered that there was a project called Alpaquita Linux which is basically
Alpine with performance patches. It has the `musl-perf` package which provides
a patched `musl` with string functions (and other things) from `glibc` and for
this it also has patches for `ifunc`. We don't need all of them, particularly
the one for static linking is useless for us, so we take [the one we need](https://github.com/bell-sw/alpaquita-aports/blob/stream/core/musl-perf/0100-ldso-dynlink-add-ifunc-support.patch)
and its [aarch64 counterpart](https://github.com/bell-sw/alpaquita-aports/blob/stream/core/musl-perf/0105-ifunc-aarch64-support.patch)
for a good measure.

This just adds handling of the relocation. We then package the patched libc
as `musl-nvidia` and poof, unsupported relocation is gone.

There are now no errors in `ldd`. That means we're done, right? Nope :)

## Thread-local storage

Oh boy.

```
$ readelf -a libnvidia-glcore.so.580.196.07|grep TLS
  L (link order), O (extra OS processing required), G (group), T (TLS),
  0x000000000000001e (FLAGS)      SYMBOLIC STATIC_TLS 
   113: 0000000000000000     0 TLS     GLOBAL DEFAULT   UND _nv005tls
   123: 0000000000000000     0 TLS     GLOBAL DEFAULT   UND _nv000tls
   205: 0000000000000000     0 TLS     GLOBAL DEFAULT   UND _nv002tls
   224: 0000000000000000     0 TLS     GLOBAL DEFAULT   UND _nv001tls
$ readelf -a libnvidia-tls.so.580.196.07|grep TLS
  L (link order), O (extra OS processing required), G (group), T (TLS),
  TLS            0x003d40 0x0000000000004d40 0x0000000000004d40 0x000000 0x000038 R   0x8
  0x000000000000001e (FLAGS)      SYMBOLIC STATIC_TLS 
     9: 0000000000000010     8 TLS     GLOBAL DEFAULT    19 _nv008tls
    11: 0000000000000008     8 TLS     GLOBAL DEFAULT    19 _nv007tls
    14: 0000000000000000     8 TLS     GLOBAL DEFAULT    19 _nv006tls
    17: 0000000000000020     8 TLS     GLOBAL DEFAULT    19 _nv005tls
    25: 0000000000000018     8 TLS     GLOBAL DEFAULT    19 _nv002tls
    28: 0000000000000030     8 TLS     GLOBAL DEFAULT    19 _nv001tls
    31: 0000000000000028     8 TLS     GLOBAL DEFAULT    19 _nv000tls
$ readelf -a libnvidia-glcore.so.580.196.07|grep TPOFF
00000000022f5f98  0000007100000012 R_X86_64_TPOFF64       0000000000000000 _nv005tls + 0
00000000022f5fa8  0000007b00000012 R_X86_64_TPOFF64       0000000000000000 _nv000tls + 0
00000000022f5fd0  000000cd00000012 R_X86_64_TPOFF64       0000000000000000 _nv002tls + 0
00000000022f5fe8  000000e000000012 R_X86_64_TPOFF64       0000000000000000 _nv001tls + 0
$ readelf -a libnvidia-tls.so.580.196.07|grep TPOFF
0000000000004fc8  0000001100000012 R_X86_64_TPOFF64       0000000000000020 _nv005tls + 0
0000000000004fd0  0000000900000012 R_X86_64_TPOFF64       0000000000000010 _nv008tls + 0
0000000000004fd8  0000000b00000012 R_X86_64_TPOFF64       0000000000000008 _nv007tls + 0
0000000000004fe0  0000000e00000012 R_X86_64_TPOFF64       0000000000000000 _nv006tls + 0
```

So, about TLS. Normally, when you use OpenGL in an application, the implementation
is dynamically loaded at runtime, not linked to the application. The OpenGL
functions you use are then dynamically requested, usually through a portable
wrapper (e.g. `SDL_GL_GetProcAddress`).

There are various TLS models. You can read up on them [here](https://maskray.me/blog/all-about-thread-local-storage).
Look at the `DT_FLAGS` for the `glcore` and `tls` libraries. See the `STATIC_TLS`?

We have `initial-exec`, and our TLS needs to exist at a fixed offset from the
thread pointer. This in general precludes dynamic allocation of the TLS memory.
A quick test:

```
q66@asusbook: /home/q66$ cat dynlib.c
#include <stdio.h>

__thread void *init_ptr __attribute__((tls_model("initial-exec")));

void upd(void) {
    init_ptr = (void *)0xDEADBEEF;
}
q66@asusbook: /home/q66$ cc dynlib.c -o dynlib.so -shared -fPIC
q66@asusbook: /home/q66$ cat test.c
#include <stdio.h>
#include <dlfcn.h>

typedef void (*func_t)(void);

int main(void) {
    void *p = dlopen("/home/q66/dynlib.so", RTLD_LAZY);
    printf("SO %p %s\n", p, dlerror() ?: "");
    func_t upd = (func_t)dlsym(p, "upd");
    upd();
}
q66@asusbook: /home/q66$ cc test.c -o test
q66@asusbook: /home/q66$ ./test
SO 0 Error relocating /home/q66/dynlib.so: init_ptr: initial-exec TLS resolves to dynamic definition in /home/q66/dynlib.so
zsh: segmentation fault  ./test
q66@asusbook: /home/q66$ LD_PRELOAD=/home/q66/dynlib.so ./test
SO 0x700c30811080 
```

When trying to use the driver, we would get the exact same error when trying
to open the GL implementation. On `glibc` it works because it reserves some
extra space in its static TLS at the beginning and gives them out for as long
as there is space. It is limited, but enough for the driver.

The correct thing here would be to use TLSDESC (`-mtls-dialect=gnu2`) which
is efficient enough and allows for dynamic TLS allocation, but NVIDIA apparently
uses some rather old toolchains.

Since we don't want to globally preload `libnvidia-glcore` into each process,
I ended up patching the dynamic linker to handle this scenario with the same
approach. I will not elaborate on the details of the patch as you can see it
in the linked pull request and it is commented. It boils down to checking if
the library has `DF_STATIC_TLS` in `DT_FLAGS` during `dlopen` and if so,
checking if we have enough space for its whole TLS image in the spare memory,
and if yes, avoiding allocating dynamic TLS for it.

That allows the above example to work without `LD_PRELOAD`.

(Another approach could be placing the TLS symbol definitions in something
that is not runtime-loaded, e.g. placed into libGL or something else, and
interposing the definitions; this could theoretically avoid patching the
libc for this specific thing, but we have the `ifunc` thing too).

## Procuring some hardware

I do not have any NVIDIA hardware. Before I could test, I would need to put
a computer together.

Fortunately, my girlfriend still had her old computer's GTX 980 Ti laying
around. It is only supported by the legacy driver, but good enough for now.
I then obtained some random old computer hardware (i3-7100, some RAM and a
board, etc.)

It resulted in [this monstrosity](https://gts.q66.moe/@q66/statuses/01M6H26YQJ7VJ3GB336PSMBD6Q).

I could finally try if this thing works.

## Initial testing and static mutex initializers

After this, the packaging was seemingly complete and I went to do some testing
on the hardware above.

Well, it turns out trying to start anything graphical would just hang.
I ran `ls` with `libnvidia-glcore` preloaded and saw:

```
(lldb) bt
* thread #1, name = 'ls', stop reason = signal SIGSTOP
    frame #0: 0x00007b0f72259376 ld-musl-x86_64.so.1`__syscall_cp_c(nr=202, u=<unavailable>, v=<unavailable>, w=<unavailable>, x=<unavailable>, y=<unavailable>, z=0) at pthre
ad_cancel.c:38:1
    frame #1: 0x00007b0f7225843f ld-musl-x86_64.so.1`__futex4_cp(addr=0x00007b0f6b6c7b44, op=<unavailable>, val=<unavailable>, to=0x0000000000000000) at __timedwait.c:24:6 [i
nlined]
    frame #2: 0x00007b0f7225841b ld-musl-x86_64.so.1`__timedwait_cp(addr=0x00007b0f6b6c7b44, val=-2147483632, clk=0, at=0x0000000000000000, priv=<unavailable>) at __timedwait
.c:52:7
    frame #3: 0x00007b0f72258526 ld-musl-x86_64.so.1`__timedwait(addr=0x00007b0f6b6c7b44, val=-2147483632, clk=0, at=0x0000000000000000, priv=128) at __timedwait.c:68:6
    frame #4: 0x00007b0f7225b6d3 ld-musl-x86_64.so.1`__pthread_mutex_timedlock(m=0x00007b0f6b6c7b40, at=0x0000000000000000) at pthread_mutex_timedlock.c:85:7
  * frame #5: 0x00007b0f67c033db libnvidia-gpucomp.so.580.196.07`___lldb_unnamed_symbol_a033b0 + 43
    frame #6: 0x00007b0f67bd8036 libnvidia-gpucomp.so.580.196.07`___lldb_unnamed_symbol_9d8000 + 54
    frame #7: 0x00007b0f67bd980d libnvidia-gpucomp.so.580.196.07`___lldb_unnamed_symbol_9d9710 + 253
    frame #8: 0x00007b0f67c0340a libnvidia-gpucomp.so.580.196.07`___lldb_unnamed_symbol_a033b0 + 90
    frame #9: 0x00007b0f67bd7fe2 libnvidia-gpucomp.so.580.196.07`___lldb_unnamed_symbol_9d7f60 + 130
    frame #10: 0x00007b0f67bdcd5e libnvidia-gpucomp.so.580.196.07`___lldb_unnamed_symbol_9dcce0 + 126
    frame #11: 0x00007b0f675df237 libnvidia-gpucomp.so.580.196.07`___lldb_unnamed_symbol_3df160 + 215
    frame #12: 0x00007b0f6a598132 libnvidia-gpucomp.so.580.196.07`___lldb_unnamed_symbol_3397eb0 + 642
```

Hm, `pthread_mutex_timedlock` in `libnvidia-gpucomp`?

Inspecting the assembly revealed that it's re-entering a lock. That suggested
that this mutex should be recursive, and for some reason it is not. Then a
friend remembered that `glibc` has static initializers for these, particularly
`PTHREAD_RECURSIVE_MUTEX_INITIALIZER_NP`, while `musl` does not support static
initialization, only via `pthread_mutex_init`, for this case.

How to deal with this? On `glibc`, the mutex structure is publicly visible,
and has roughly this layout:

```
struct mutex {
    int lock;
    unsigned count;
    int owner;
    unsigned nusers;
    int kind;
    ...
};
```

Then the initializer looks like this:

```
enum
{
  PTHREAD_MUTEX_TIMED_NP,
  PTHREAD_MUTEX_RECURSIVE_NP,
  PTHREAD_MUTEX_ERRORCHECK_NP,
  PTHREAD_MUTEX_ADAPTIVE_NP
}

# define __PTHREAD_MUTEX_INITIALIZER(__kind) \
  0, 0, 0, 0, __kind, 0, 0, { 0, 0 }

# define PTHREAD_RECURSIVE_MUTEX_INITIALIZER_NP \
 { {  __PTHREAD_MUTEX_INITIALIZER (PTHREAD_MUTEX_RECURSIVE_NP) } }
```

That means it's initializing the structure with the `kind` field.

Meanwhile, `musl` mutex type is opaque:

```
typedef struct { union { int __i[sizeof(long)==8?10:6]; volatile int __vi[sizeof(long)==8?10:6]; volatile void *volatile __p[sizeof(long)==8?5:6]; } __u; } pthread_mutex_t;
```

The mutex type is encoded in the first integer:

```
#define _m_type __u.__i[0]
```

In this layout, the `kind` would look like this, mirroring the `glibc` structure:

```
#define _m_kind __u.__i[4]
```

I found that `musl` does not use this in any way, however.

We can use this. The strategy I took was creating a new shim library containing
the following:

```
int __nvcompat_mutex_lock(pthread_mutex_t *m) {
    patch_mutex_kind(m);
    return pthread_mutex_lock(m);
}

int __nvcompat_mutex_timedlock(pthread_mutex_t *restrict m, const struct timespec *restrict at) {
    patch_mutex_kind(m);
    return pthread_mutex_timedlock(m, at);
}

int __nvcompat_mutex_trylock(pthread_mutex_t *m) {
    patch_mutex_kind(m);
    return pthread_mutex_trylock(m);
}
```

The `patch_mutex_kind` fetches the (on `musl`, unused) kind field and writes
it into the `type` field`, atomically, if it's unset. On statically initialized
mutexes, it is always unset, as it's only written once, and the static initializer
for the default mutex just zeroes everything.

The actual encoding of the type is the same between both libcs (with the caveat
that `glibc` also supports adaptive mutexes, which we map to regular ones), so
there is not much remapping to be done. You can see the code in the pull request.

How do we use these symbols? Via `patchelf` again. It supports `--rename-dynamic-symbols`,
which takes a mapping file where each line looks like `oldsym newsym`. We just
provide ours like this:

```
pthread_mutex_lock __nvcompat_mutex_lock
pthread_mutex_timedlock __nvcompat_mutex_timedlock
pthread_mutex_trylock __nvcompat_mutex_trylock
```

Then we patch our `libnvcompat` into `NEEDED` of all the libraries.

And that's mostly all.

## Open-source components

There are various bits and pieces NVIDIA has released over time as actual
FOSS code. This includes `nvidia-xconfig`, `nvidia-settings`, `nvidia-modprobe`,
`nvidia-persistenced`, and the `egl-gbm` and `egl-wayland` external platform
libraries.

These come bundled in the driver archive. Since they can be built from source,
we package them separately, to minimize the amount of stuff that needs to be
shimmed, and then depend on the from the driver package.

## Testing for real

Yes, [it works](https://gts.q66.moe/@q66/statuses/01M6HR4J8343BVSYZK62X4VRBH).

For the 620 driver, we also had to replace `libstdc++.so.6` in a couple places,
where it was being used for the `new` operator. This is provided in an way that
is ABI-compatible by `libc++abi.so.1` so we just replace it.

The packaging will need some more refinement, and more testing will be needed.
It was reported to me that the 620 driver works with RTX 3070 Ti. It was also
reported to me that it works at least partially on AArch64.

But anyway, that's it for this writeup.
