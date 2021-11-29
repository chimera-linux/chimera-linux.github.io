## Chimera Linux

Chimera aims to be a modern, general purpose Linux distribution.

For that, it aims to break free from the usual conventions of most
other other Linux distros and do its own thing.

While at it, we aim to increase the diversity of software choices in
the Linux ecosystem through a combination of new software ports and
fixing existing stuff to work better with alternative userland.

For specific questions, read our [FAQ](./faq.html).

The distribution is currently in heavy development. It can boot as well
as build itself, and the software collection is growing rapidly, but
version numbers are not stable right now.

Current plan is to wait for `apk-tools` 3.x before releasing any repos,
in order to avoid transition pains to the new package format. Once that
is out, the distro will stabilize.

### Non-GNU, non-systemd userland

Chimera comes with an alternative userland that is quite different from
even the unconventional distributions such as Alpine.

Its "coreutils" as well as other associated basic tools come from FreeBSD.
Many have been ported specifically for this purpose.

The whole system is compiled with LLVM/Clang. This includes the runtime
components (`compiler-rt`, `libunwind` and `libc++`) as well as the linker
(`lld`). The robust `musl` library provides the libc. The whole system is
built with link-time optimziation (Thin LTO) to enable further opportunities
regarding e.g. CFI.

Here is an example table of some tools and their providers:

| Software             | Source                 |
|----------------------|------------------------|
| C/C++ compiler       | LLVM                   |
| C runtime            | LLVM                   |
| C++ standard library | LLVM                   |
| Linker               | LLVM                   |
| Unwinder             | LLVM                   |
| C standard library   | `musl`                 |
| `binutils`           | Elf Toolchain          |
| `elfutils`           | Elf Toolchain          |
| `coreutils`          | FreeBSD                |
| `findutils`          | FreeBSD                |
| `diffutils`          | FreeBSD                |
| `sed`, `ed`          | FreeBSD                |
| `grep`, `m4`         | FreeBSD                |
| `make`               | NetBSD                 |
| `awk`                | One True Awk           |
| Shell                | `dash`, `mksh`         |
| `yacc`               | `byacc`                |
| `tar`, `cpio`        | `libarchive`           |
| Readline             | NetBSD `libedit`       |
| Init system          | `dinit`                |

This does not mean the other tools are banned from being packaged. Just
like FreeBSD packages them in their ports, Chimera does too; it is not
here to make your software choices for you. The defaults were chosen
in general for technical merits (for instance, the default text editor
in the `full` metapackage is GNU `nano`, as it was determined to be
the highest quality choice).

However, there is a goal of being fully bootstrappable without GNU
components, and it is possible to have a bootable system without them.
The only GNU component required for bootstrapping right now is GNU
Make, and this is a build-time-only dependency.

### Consistency and clean design

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

The "There should be one obvious way to do it" motto is always considered
and emphasis is put on the system being simple and easy to grok. However,
user choice is also important. We are explicitly not a minimalist or
"suckless" distro, eschewing any kind of software fundamentalism.

### Easy bootstrapping and building

The source packages system was written from scratch in Python. Likewise,
the source package templates themselves are Python scripts. The goal here
is to make the build system fast (unlike shell-based solutions that are
very common) and introspectable.

It strictly follows the idea that good things should be easy and concise,
while bad things should be verbose and obvious.

All builds are containerized using Linux namespaces (thanks to Bubblewrap).
This includes things such as the build having no network access after all
declared sources have been fetched, and the root file system used during
building being strictly read-only, and the whole build not requiring and
outright rejecting root privileges.

Unit tests are run for all builds by default to help catch issues and
keep track of what's broken.

The result are binary packages in the `apk` format. We use `apk-tools`
originally from Alpine Linux as the binary packaging system.

You can bootstrap the system from source on any `musl`-based distribution
that has sufficient dependencies available. If you have a `glibc` system,
there is tooling to help you bootstrap (again without root privileges)
using a binary snapshot of another Linux distro.

The bootstrap process has 3 stages, i.e. it rebuilds the whole build
container 3 times. During stage 0, all the components necessary to assemble
the container are built inside your host system. Then the container is
created and used to rebuild all these components once again (stage 1).
This is repeated once more (stage 2) to get a clean environment that
can be used for any further builds.

Once bootstrapped, you can build packages for Chimera on a completely
foreign system without any further problems thanks to the container.

The build system has support for transparent cross-compiling for both
bootstrap and non-bootstrap packages. This can be used to bring Chimera
to new architectures as well as say, cross-compile custom packages for
slow hardware of another architecture.

### Portability

Chimera currently targets a variety of CPU architectures, including
`aarch64`, `ppc64le` and `x86_64` for the highest support tier, `riscv64`
for second tier and big-endian `ppc64` for third tier.

As long as LLVM fully supports the target, it is very easy to add support
for new architectures - one simply needs to create a profile, which is
a small configuration file.

Portability is an important goal of the distro - it is not here to make
your hardware choices for you.
