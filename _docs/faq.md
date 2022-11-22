---
layout: book
title: FAQ
section: 99
---

## Is Chimera a fork?

No, it's an independent project not directly derived from anything else.

## What is the distro's relation to Void Linux?

If Chimera build templates and process seem suspciously similar to Void
Linux's `xbps-src`, `cbuild` originally started as a rewrite of `xbps-src`
to attempt to eliminate its various issues, and the main developer/founder
of Chimera also worked on Void Linux. However, no actual code is shared
with `xbps-src`.

## Is Chimera an Alpine derivative?

Besides using the same user-side package manager (`apk-tools`), Chimera is
unrelated to Alpine. The version of `apk-tools` it uses is also different,
and the source packaging system as well as all actual packaging are written
from scratch.

## What about ChimeraOS?

The system also has no relation to ChimeraOS, besides the unfortunate name
similarity. ChimeraOS used to be called GamerOS and renamed itself to
ChimeraOS later; however, at this point Chimera Linux was already in
public development with its name in place.

## Why Python for the source packaging?

Python was chosen as it's more or less the standard scripting language on
Unix-like systems nowadays and is robust and portable. The `cbuild` system
does not rely on any modules outside of Python's standard library. The
Python syntax is also flexible and adjustable enough to make for a nice
syntax for templates without having to invent yet another DSL that would
introduce its own bugs and need its own parsing.

## So, why use a BSD-based userland anyway?

While coreutils may seem lightweight enough to not cause any issues already,
there are some specific reasons the system uses a BSD-derived userland.
The primary one is probably that the code of the BSD versions is overall
much cleaner and easier to read. There are no cursed components such as
gnulib, the codebase is leaner, and more aligned with the project's goals.

Other reasons include helping the goal of improving software portability,
as using a different userland tends to expose a lot of assumptions in
various codebases, as well as improving bootstrappability and additional
convenience; the core userland tools are not just coreutils, but also a
a lot of tools around that (findutils, grep, sed, and so on) and some of
those actually already introduce undesired dependencies into the bootstrap
path. In Chimera, all those tools are neatly wrapped in a single package
that depends on very little, while providing pretty much all functionality
one needs to get things done. This means we are not only replacing the GNU
utilities, but we also have a replacement for things such as Busybox at the
same time, re-using the same environment to power our initramfs and other
components.

Relatedly, it also helps cbuild/cports a lot. The way cbuild works, you are
building everything in a little container that dependencies are installed
into. Our BSD-ported utilities also replace some core portions of `util-linux`,
which need to be present in the build containers. The `util-linux` package
normally depends on things such as PAM and udev. That means if we were to
use GNU utilities, we'd need a separate, stripped-down build of `util-linux`
just for the containers, because everything that's in the build container as
well as every dependency of it is a part of the bootstrap process. That would
mean either having to make this stripped-down version coexist with the full
version installed in target systems, or make them conflict. For example Void
Linux does the latter, and it creates trouble for instance whenever something
wants to run a test suite and the test suite has a dependency on some missing
`util-linux` tool. In Chimera, there is no need for `util-linux` anywhere in
the base container or its bootstrap path, and such templates can simply add
`util-linux` to their `checkdepends`.

Some people may also say that the BSD licensing is its own benefit. We do
not say that, because as far as core userland goes, the licensing is more
or less meaningless for us and we could easily live with the GPL. Therefore,
this is largely a technical decision for us. While the benefits may seem
small to some, they are there, and they matter to the project.

However, using an alternative userland is not and never was the project's
primary selling point. The userland tools are a means to an end, and the
end is creating a well-rounded, general-purpose, practical operating system
that addresses various real issues that Linux distributions tend to have.
The tools simply exist to help us get there eventually.
