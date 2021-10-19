## Chimera Linux

**The project is currently heavily WIP.** It is not capable of booting
yet, but is getting there. Currently it is still missing its own kernel,
and the service manager is not fully set up.

For specific questions, read our [FAQ](./faq.html).

Chimera is a Linux distribution with the following goals:

- Built entirely with LLVM
- FreeBSD-based userland
- Binary packaging and a well designed source build system
- Bootstrappable
- Portable

### Built with LLVM

Chimera uses LLVM and Clang as its system toolchain. This is used to
build all core components of the system.

There is currently no GCC in the source repository. The `compiler-rt`
component is used as the core runtime, and `libc++` is used as the
standard C++ library.

### FreeBSD userland

The userland is based around FreeBSD components rather than GNU coreutils
and related. There are few GNU components in `main`, and the only one that
is strictly required for bootstrap and the build environment is GNU Make.

The `musl` libc is used as the standard C library in place of `glibc`.

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
needed for the system build. It is also possible to bootstrap from a
completely foreign system using our scripts.

After that, Chimera uses a 3-stage bootstrap path, with stage 0 building
all components needed to assemble the build container, stage 1 rebuilding
itself using components from stage 0, and stage 2 rebuilding itself using
components from stage 1. This is done to ensure that the final system is
not influenced by the initial host system.

### Portable

Chimera can target a variety of CPU architectures, including `ppc64le`,
`aarch64`, `x86_64`, `riscv64` and `ppc64`. It is very easy to bring up
a new architecture if necessary, as long as the required LLVM components
support it - one simply needs to create a profile describing some basics
of the target architecture. The build system has full support for
cross-compiling (not only for bootstrap - all of it is cross-aware).
