## Chimera Linux

Chimera aims to be a modern, general purpose Linux distribution.

[![Screenshot](/assets/chimera-sshot-thumb.png)](/assets/chimera-sshot.png)

A major goal of the system is to break free from the common conventions
of most Linux distributions and do its own thing. To achieve that, it
seeks alternative solutions to various aspects of the stack.

In addition to new ways of doing things in the system itself, this should
result in increased diversity of software choices in the ecosystem and
indirectly benefit other projects as well.

For specific questions, read our [FAQ](./faq.html).

**The distribution is in heavy development.** Right now, it is a relatively
complete graphical system with a multimedia stack and a web browser, capable
of running Wayland and X11 environments, such as GNOME and Enlightenment.
However, it is still source-based (meaning you have to compile everything
yourself) and undergoes frequent refactoring, so it is not yet safe to use.

**Initial bootable ISO images for x86_64 and ppc64le are now available.**
Check the [Downloads](./downloads.html) page for links and instructions.
Note that these are pre-alpha quality and are provided solely for testing
purposes.

It is currently planned that the distribution will stabilize once `apk-tools`
has released a stable 3.x version and the distribution has transitioned to it.
This is in order to avoid pains with switching to a new package format.

### Alternative userland

Chimera comes with a userland that is quite different from most distributions,
even lightweight busybox-based ones such as Alpine. The core userland (what
would normally be `coreutils` and various related packages) is ported from
FreeBSD.

The entire system is additionally compiled with the LLVM/Clang suite. This
includes the runtime components (`compiler-rt`, `libunwind`, `libc++`) as
well as the linker (`lld`); the `libc` is provided by `musl`. The GCC
compiler is currently not present in the system at all.

ThinLTO (link-time optimization) is used system-wide for nearly all packages
to gain extra size and performance benefits and further ahead prepare for
enablement of more things such as CFI.

The `dinit` project provides the init system/service manager combo. It's
a lightweight, dependency-based, supervising system with a good balance of
features to simplicity. Chimera uses it to also provide out of box support
for user services, which are used to manage session daemons such as the
D-Bus session bus and the PipeWire multimedia server. It is intended that
most long-running processes should be managed as services so that they are
easy to track and reliable.

The system is bootstrappable without GNU components (except their `make`)
and you can have an entirely GNU-free bootable system. Therefore, Chimera
should not be considered a GNU/Linux system. This is in line with the
alternatives-seeking policy; the project does not actually reject GNU
or the GPL (though permissively-licensed software is preferred when
there are two otherwise equivalent options).

Here is an example table of some major system components and their providers:

| Software                   | Source                  |
|----------------------------|-------------------------|
| Compiler and runtime stack | LLVM                    |
| C standard library         | Musl                    |
| `binutils`, `elfutils`     | ELF Toolchain           |
| Core userland              | FreeBSD, NetBSD         |
| Init and logging           | Dinit, syslog-ng        |
| Audio stack                | PipeWire                |
| Desktop environment        | GNOME                   |
| Web browser                | GNOME Web               |

There is, of course, a lot more software in the repository, and some
of the above have other alternatives available that you can choose from.

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

The system follows the rule of "there should be one obvious way to do it".
That does not mean pointlessly restricting user choice, but there should
be well supported defaults for most things, and the system should be
easy to grok and not take roundabout technical choices.

Chimera is explicitly not a minimalist or "suckless" system, and likewise
rejects all sorts of reactionary tendencies or pointless traditionalism.
It's not a goal to work like something else or hold onto something for
the sake of it; it should be its own system and have its own ways, when
necessary.

### Easy bootstrapping and building

All the source packaging is made from scratch, and uses a custom build
system written in Python. The source package templates are also simply
Python scripts. The collection is designed to be fast and strict by
default, to prevent technical debt and enable introspection. Best
practices are strictly enforced through a combination of a sandbox
and well designed API.

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

### Portability

Chimera considers portability very important, to avoid monoculture as well
as to help catch bugs, so it supports a variety of CPU architectures,
including `aarch64`, `ppc64le` and `x86_64` for the highest support tier,
`riscv64` for second tier and big-endian `ppc64` for third tier.

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
