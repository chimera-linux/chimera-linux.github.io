## Chimera Linux

Chimera is a Linux distribution with the following goals:

- Built entirely with LLVM
- No GNU components in base system
- FreeBSD-based userland
- Binary packaging based, with a fast source build system
- Bootstrappable
- Portable

### Built with LLVM

Chimera uses LLVM and Clang as its system toolchain. This is used to
build all core components of the system.

There is currently no GCC in the source repository. The `compiler-rt`
component is used as the core runtime, and `libc++` is used as the
standard C++ library.

### No GNU

There are no GNU components in the base system, except currently GNU
Make (used to build a few components) and `ncurses`. The rest of the
userland comes mostly from FreeBSD (no `busybox`).

The `musl` libc is used as the standard C library.

### Fast source package build system

Chimera has a completely new source packaging system that is not written
in shell as is conventional, but rather in the Python scripting language.
This reduces the build system overhead to a minimum, as well as making
it introspectable and so on.

The builds are always containerized, with a minimal Chimera system being
used as the build environment for every package. This system is sandboxed
using `bubblewrap` and run completely unprivileged.

The binary packaging system used is `apk-tools`, originally from Alpine
Linux. It was chosen because of its speed and ease of integration.

### Bootstrappable

The system can build itself. You can use any `musl` based distribution
as the initial system, as long as it has the few required components
needed for the system build.

After that, Chimera uses a 3-stage bootstrap path, with stage 0 building
all components needed to assemble the build container, stage 1 rebuilding
itself using components from stage 0, and stage 2 rebuilding itself using
components from stage 1. This is done to ensure that the final system is
not influenced by the initial host system.

### Portable

Chimera currently targets the `ppc64le`, `aarch64` and `x86_64` architectures.
It should, however, be easily portable to any architecture supported by
LLVM/Clang (and its related components like `compiler-rt` and `libunwind`)
and `musl`.
