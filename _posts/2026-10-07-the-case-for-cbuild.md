---
title: The case for cbuild and building a distro for a small community
layout: post
excerpt_separator: <!--more-->
---

A lot of people have been commenting on this over time so I figured I would
put together a little post summarizing my thoughts on the matter and everything
else.

The post is going to be quite large. Every section can be read more or less
separately, but they are all connected to each other.

<!--more-->

## Catering to the community

Chimera is a small project. It exists primarily to serve its community and not
any external entity.

Making sure the maintenance cost is as low as possible is crucial. Chimera
and its tooling are designed to automate away most of the boring stuff and
make sure the packager's job is pleasant and not bothersome. In a way, we
aim to empower every user to be a packager. The barrier of entry is meant
to be very low.

Some things that implies (I will try really hard to make this reasonable to
follow, unfortunately the years have left their mark and I might be taking
some assumptions for granted, so please bear with me; this also applies in
the later sections):

1) Everyone uses the same tools. Inefficient UX patterns are identified,
   and either fixed, or `cbuild` is extended to mitigate them. Feedback is
   taken into account.
2) Everything is `cbuild`. One tool does everything, in a streamlined way.
   Managing the repository, the build environment, the repo generation
   and signing, even parts of the VCS handling and common maintenance tasks.
   No external helper stuff.
3) The remote build infrastructure just runs `cbuild` and not much else.
4) The tooling does much of the bulk of making sure your packaging is
   correct and clean, most issues are hard errors. Heavy sandboxing,
   build environment consistency, unit tests by default, etc.
5) You can run it on any Linux. If you run it on Chimera, you can immediately
   test your work. You can take the repo and bring it somewhere else. That
   also means the builder machines in the remote infra can run anything.
6) Chimera is a collective effort. You can expected to share the stuff you
   make, and get it upstreamed to us. The tooling is not intended for local
   things that won't get shared, and it provides no guarantees or obligations
   for such usage; `cbuild` is a developer tool, not a user tool. But every
   user can be a developer.
7) The tooling should easy and straightforward to use, and fun. It should not
   make things hard for you. Every user can be a maintainer. It shouldn't
   be unnceessarily intimidating. We don't gatekeep here when possible.
   You should also be having fun using the system and being here.
8) You can replicate the entire remote infrastructure of the project on your
   machine in an hour or something. You can replicate the heavy bulk of things
   in like 5 minutes.
9) The way things work is supposed to steer you towards implicitly doing the
   right thing, and punish incorrect patterns by making them harder than the
   correct ones. E.g. it's really difficult or impossible to manually patch
   files with regex, or to do internet-reaching stuff during the build, or to
   touch the build environment filesystem. It's really easy to manage patches
   though, there are build styles for common build systems, there are fine
   grained utility modules for doing all sorts of common annoying things,
   etc.; the tooling also automatically checks your stuff for correct
   formatting and other lint issues, validates your dependencies, validates
   your metadata including minor things like whether your build dependencies
   are sorted correctly and whether the SPDX license expression is correct
   and lost of other nits, and so on.
10) Extensive documentation for the build system and packaging.

A common workflow setting up everything from scratch would look like so:

```
$ # set up environment with your cports fork
$ git clone https://github.com/my-user/cports
$ cd cports
$ # prepare a signing key
$ ./cbuild keygen
$ # prepare a build environment
$ ./cbuild bootstrap
$ # write your template here; then build it
$ ./cbuild pkg user/my-cool-program
$ # make a branch for submission
$ git checkout -b my-cool-program
$ # automatically makes a commit with the correct message and all files included
$ ./cbuild commit user/my-cool-program
$ # push and publish PR with the link
$ git push origin my-cool-program
```

An update would be done like this:

```
$ ./cbuild bump-pkgver user/my-program 4.20.69
$ ./cbuild prepare-upgrade user/my-program
$ ./cbuild pkg user/my-program
$ ./cbuild commit user/my-program
$ git push
```

The tooling provides common utilities for keeping your local repository clean,
e.g. pruning packages and so on; it provides maintenance tools for bumping
versions and revisions, checking dependency graphs, checking for new versions
via update-check (which for most things distributed e.g. via common git forges
requires no extra effort or specialized code), checking if your local repository
can be unstaged against the remote one (verifying if you really rebuilt
everything that needs it), updating sha256 checksums in templates. It even
supports custom template-specific actions, such as building bootstrap tarballs
for compilers. It supports aliases for less typing.

Checking for if a package has an update:

```
$ ./cbuild update-check main/firefox
main/firefox: 157.0 -> 157.0.1
```

It supports fun things when it comes to packaging bulk batches. For instance,
it integrates git:

```
$ # build everything changed in your local commits
$ ./cbuild pkg git:origin/master..HEAD
$ # build a specific commit
$ ./cbuild pkg git:commithash
$ # build a range of commits but skipping stuff that has "test" in commit message
$ ./cbuild pkg git:from..to+!test
```

It supports common stuff, like

```
$ # build everything you have in your local repo that has a newer cports version
$ ./cbuild pkg status:outdated
```

There is a lot more that I could mention. I also wanted to talk about how
we got here, how we started, and how our infra works.

## Personal history

I started using Linux in 2006/7 and soon ended up on Debian as my long-term
operating system. Around the same time I started to seriously get into
programming and the intersection of that ended up being packaging for Debian.
Debian has a large bunch of tooling to deal with packaging and particularly the
community-driven approach really appealed to me so I maintained a bunch of
packages for a while. That lasted for some time until I drifted away towards
other things and eventually settled on FreeBSD.

During that time I didn't do any work for the FreeBSD project itself but
I did experiment with various things that were adjacent, none of them going
anywhere in the end, but I did gain a lot of helpful experience on the way.

In 2016 I started messing around with Void Linux (particularly as I had to use
Linux on work computers) and around 2018 I ended up using the ppc64le (POWER)
platform for my workstation, which FreeBSD did not support at all at the time.
I was already familiar with Void and decided to start a ppc64le port, which
I maintained downstream until 2023 and gradually it expanded to support the
big endian ppc64 as well as the classic PowerPC. Doing the downstream work
led to me becoming an upstream Void maintainer as well and I took care of
the compiler toolchains among other things for several years and became
interested in improving the build tooling.

In 2021 I started the Chimera Linux project, which gradually got better and
more usable, and that led to me shifting entirely to that, deprecating the
POWER port of Void and resigning from the Void team in 2023.

## Void Linux

When I started using Void in 2016, it mainly caught my attention as a system
with a fairly low barrier of entry that did not get in my way, while still
being "normal" enough to act as a regular Linux system. Initially I found the
way e.g. runit worked in there interesting and in many ways fresh over classic
distros particularly in the pre-systemd era, while I found the post-systemd
era rather unfun and daunting in general.

This was also why I ended up picking Void for the ppc64le port, as it felt small
scope and approachable enough to give me a chance to reasonably maintain it by
myself, while also having a compact and easily reachable community that wasn't
aligned with any particular commercial entity.

When I started the ppc64le port, I was already marginally familiar with the
build tooling of Void but only really properly picked it up for the port.

## Getting started with xbps-src

For someone coming from most other Unix-like systems, xbps-src is really nice.
In Void, all the packaging of the distro, along with the build tools, exists
in a singular Git repository (`void-packages`). In a way, this mirrors the
ports systems as they exist on the BSDs. However, the ports systems are based
around Makefiles and you interact with ports individually using `make` (with
various external ports management tools existing to simplify that, working
on top of that).

In Void, software is packaged using "templates". Every piece of software
consists of a template containing metadata fields (you know, package name,
version, dependencies, source URLs, etc.) plus (optionally) functions that
define the logic of how a template is built, along with extra files that are
necessary for the build (not always) and patches (not always). The tooling
for building templates (`xbps-src` itself) also exists in this tree.

Unlike most other systems, when you build a package, the build process does
not run in the system you are running the build on. Instead, `xbps-src`
constructs a small container (using Linux namespaces) that represents a
minimized Void system, puts stuff in it according to the template metadata
(build dependencies and whatnot) and then runs the build. At the end, you
get a local repository of `xbps` packages that you can install from.

The general workflow looks like this:

```
$ git clone https://github.com/void-linux/void-packages
$ cd void-packages
$ # create the build container
$ ./xbps-src binary-bootstrap
...
$ # build the thing you want
$ ./xbps-src pkg some-program
...
```

The templates are similar to e.g. `PKGBUILD` format of Arch Linux or
`APKBUILD` format of Alpine, but those do not use the containerized
approach (at least not always).

The `xbps-src` system is a collection of Bash scripts, and technically
the templates are also just Bash scripts, but with a set of expectations
so they in general do not utilize the full extent of the syntax and features.

When working as a packager, you basically just create a new directory in the
`srcpkgs`, put your template in it along with other stuff, build it, and
then you have a repo you can install it from. If you wish to submit it
upstream, you create a branch, commit it, and create a pull request.
Someone will take a look at it, and if it gets merged, the central build
infrastructure picks it up and shortly it becomes available in the central
repository.

The system neatly decouples build dependencies and runtime dependencies, with
runtime dependencies typically scanned automatically from ELF files and their
metadata as well as other file types, so the template specifies whatever it
needs in the build environment but the runtime dependency list is largely
automatic.

The system supports "build styles" so you can e.g. declare that a template
uses the GNU Autotools, or Meson, or Cargo, or whatever, and it takes care
of most of the groundwork, allowing for templates that are often declarative
without any build logic, lowering that barrier of entry.

It also supports cross-compiling really well, letting you cross-build most
of the repository to any other architecture. That's neat, but often sloppy,
and cross-built packages end up with subtle brokenness that native packages
would not have, due to build systems subtly not passing certain checks and
so on. You also can't run unit tests for projects when cross compiling them,
in most cases.

The system also has a really handy `update-check` mechanism which will scrape
upstream URLs and find version infos in them, then present you with any updates
that may have happened since the last template version update. The project has
a nightly job which generates a summary once per day, letting packagers stay
on top of things.

## Upstream build infrastructure of Void

The build infrastructure of Void consists of several computers (each handling
a different architecture port) that are plugged as workers into the central
orchestrator, using the [Buildbot](https://buildbot.net/) software. It will
receive updates from the Git repository (`void-packages`), collect a batch
from the changes, figure out the correct order, and use `xbps-src` to build
the packages.

It will also sign the packages with the right keys. This is a separate step
that `xbps-src` does not handle (the output is unsigned). Eventually, things
make it in the upstream repository and get mirrored.

The way the Buildbot is managed I can't tell you much because I never saw
much into it. The admins have an infrastructure that is based on Ansible,
Terraform, and a bunch of other pieces that are put together in ways unfamiliar
to me. Additionally, `xbps-src` does not do the batch sorting for you, so
other pieces of the process have to do it. Things outside the `void-packages`
repository itself are relatively opaque.

When I maintained the POWER port, I had my own set of scripts to keep things
going and did not reuse any of the Void infrastructure at all. This was likewise
opaque and purpose-built for my port.

## Starting Chimera

In early summer of 2021, I started Chimera. The initial push for me was that
I wanted to experiment with a different userland setup, as well as have a more
personal project to work on without having to deal with others' efforts and
pre-existing work, but also I wanted to try out my own take on the build system.

There were some initial points I was unhappy with in `xbps-src` while
maintaining the POWER port.

1) The shell-based system was way too slow. Parsing the complete collection
   of templates in the repository would take potentially as much as half an
   hour, and there weren't other ways to introspect the templates. Therefore,
   my tooling would call into `xbps-src` and employ various caching tricks
   to make things manageable.
2) The shell-based system was very often fairly sloppy, letting various wrong
   behaviors through. For instance, network access is permitted through the
   whole build, there is nothing ensuring consistency of the build container
   after the build is done (the entire thing is read-write and the template
   can do whatever it wants), the correctness lints for the resulting packages
   are fairly slim, the ELF scan step and other things would take an eternity
   due to slow shell code, and limited opportunities for doing more due to
   shell being excessively slow.
3) A lot of useful tooling is separate from the main system and maintained
   in the `xtools` repository, including extra lints and so on. This is not
   mandatory or anyhow verified however.
4) Lots of sloppy templates resulting from the prior points. E.g. the templates
   are often littered from manual in-place `sed` calls and similar rather than
   using proper patches (which leaves in calls that eventually no longer do
   anything due to upstreams changing), patches are applied very fuzzily which
   occasionally results in subtly mispatched things, and so on.
5) The Void project does not run per-template unit tests (typically the test
   suite of the software being packaged) on builders, which would catch a lot
   of errors, particularly on `musl` targets and so on. It does run them in
   pull request CI, but I do not see this as enough. Often the check runs of
   templates are poorly maintained and broken.
6) The Void project cross-compiles all architectures other than `x86_64` and
   `i686`, resulting in the other-arch ports being notably lower quality.
7) Void has a wonky staging system. When large batch changes are being done,
   the repos may end up in a strange state for a while and users are advised
   to avoid upgrading until everything is finished. It has a rudimentary
   staging system which prevents the repos from being changed while a big
   batch is being rebuilt for changes shared library SONAMEs, this works only
   for shared libraries however, which means packagers will often forcibly
   stage the repo for a batch rebuild, then do stuff in several commits,
   wait for everything to clear, then unstage the repos. Various parts of
   the related infrastructure are also lacking, such as clearing obsolete
   and removed packages from the repos, which is/was done manually.

There are others but these were my main gripes.

Chimera started with its build system. Many experiments were done. Initially,
`cbuild` was a ground-up rewrite of `xbps-src`, using Python. In `cbuild`,
the templates are also Python scripts, but through low-level bits that Python
allows, don't always look as such. It came with a very minimal set of initial
packages that was basically a basic Void-like `chroot`, using `xbps` as its
package manager. Thus `cports` was born.

There were two initial goals:

1) Make it fast. I should be able to parse several thousands of build templates
   and dump all their metadata in under a second, rather than many minutes.
   Chimera currently achieves this.
2) Make it strict. No network starting with configure step. Read-write access
   only in the build directory (and destination directory for install step)
   and full consistency of the build container guaranteed at all times.
   Heavy linting and straight up denying various misbehaviors at all times.
   Sandboxing done with namespaces only, using Bubblewrap (`bwrap`). The
   `cbuild` system runs outside the sandbox (in your host environment) while
   any calls to the build system of the project being built are sandboxed.
3) Make it highly portable, with Python (no external modules), Bubblewrap,
   and Git, along with the package manager binary, being the only dependencies.
   You can use `cports` on any Linux system with the basic dependencies.
4) Make it able to do everything `xbps-src` can do, but better.

Chimera started with the `ppc64le` target only, being developed on a POWER
workstation. Over time, as things cleared up more, more targets were added,
along with additional goals and other changes.

Over the next months, the core packaging started to become more defined,
settling on the userland tooling and other things, as well as transitioning
from `xbps` to `apk`. The original idea was to use `pkg` from FreeBSD, but
this proved to not be ready for our style of use at the time, and upstream
suggested that we're best off using something else.

Fundamentally, using `cbuild` in the basic sense feels similar to `xbps-src`.
The big difference is that `cbuild` signs everything, not needing a separate
step, and no unsigned packages are allowed. Therefore, initial setup looks
more like

```
$ # generate your signing key
$ ./cbuild keygen
$ # bring up the container
$ ./cbuild bootstrap
$ # package whatever you want
$ ./cbuild pkg main/firefox
```

## Settling on apk

We didn't stay on `xbps` for very long. Soon, the switch happened to `apk`.

Using `apk` brought over various benefits.

1) Unlike `xbps` which is driven by ad-hoc logic, `apk` has a real dependency
   solver. This means way fewer surprising behaviors and way fewer workarounds
   and less effort needed from packagers to make sure that users' systems do
   not break in surprising ways.
2) Handling of stuff like shared libraries is way nicer in `apk`. In `xbps`,
   dependencies are driven purely by name, and shared library providers and
   requires have separate metadata fields. These will get checked and `xbps`
   will not permit things to proceed if unmatched, but dependencies are done
   by name. When a package is being built, the system will consult this massive
   central file (`common/shlibs`) matching SONAMEs to package names to generate
   dependencies on top of the shlib metadata. This results in poor UX (you
   cannot match the shlib providers etc. in the same way as names when e.g.
   installing) and is inflexible as it's limited to shared libraries. In `apk`,
   virtual packages are used instead, so you e.g. provide `so:libfoo.so.1=1`
   as a virtual package name. You can then search by this name, install by
   this name, etc. and it can be used for other types as well, e.g. `cmd:foo`
   (`apk add cmd:i-know-command-name-but-not-package-name`) and others.
   That also means more things can participate in the staging system on the
   build system side. And no central mappings, as the build system can easily
   query things from the repository.
3) Unlike `xbps`, `apk` has real support for triggers. Triggers in `xbps-src`
   are emulated with package scripts. As an example, consider e.g. updating
   fonts cache. The `fontconfig` package has a trigger (which is a script) and
   metadata to run the cache update when `/usr/share/fonts` is modified in any
   way. Then when something modifies the directory, the trigger will run at the
   end of the transaction, after all filesystem changes are done. In `xbps`,
   you can only have scripts that run before or after a package changes and
   are owned by the package; `xbps-src` emulates triggers by checking if the
   package contains a directory that would drive the trigger and if it does,
   insert a call in its package script; that means if several packages change
   the fonts, each of them contains a cache update script, which will run
   several times (and not at the end). This means things become quite slow
   for large triggers and the transaction breaks atomicity (because the shell
   script run in the middle of the transaction, rather than at the end, needs
   all prior things committed to the final filesystem location).

There were others, but these are notable.

## Building an infrastructure and a new core tenet

Building the infrastructure was interesting. We ended up using Buildbot again,
after some deliberation and original intent to build a new orchestrator from
scratch. There is an important distinction in our buildbot, however.

I wasn't happy with the opaqueness of Void's infrastructure, and with the way
it does so much work beyond `xbps-src`. I declared an entire new rule that goes:

**What the packager runs exactly matches what the remote build machine runs.**

The build steps of Chimera's infrastructure go approximately like this:

1) Central orchestrator is poked by a webhook that a change in `cports` has
   happened. It does not matter what change.
2) Central orchestrator tells worker machines in the fleet (one per arch)
   that `cports` has changed. It does not tell them what.
3) Worker machines pull their copy of `cports`. It does not matter what
   has changed.
4) Worker machines update the build container (`./cbuild bootstrap-update`).
   This updates the core packages of the container to match the repository.
5) Worker machines run `./cbuild bulk-print-ver status:unbuilt`. This generates
   a list of all packages along with their versions that are present in `cports`,
   can be built, and are not already built in the repository. This step is
   separate only for the purpose of presenting it to packagers in the Buildbot
   UI, so that you can have a separate view for each package being built and
   so on. This list is correctly sorted. Each entry is saved in a Buildbot
   variable, again for the purpose of presentation mainly.
6) Each entry in the list from the prior step is built. The result is already
   signed and ready to be used, but for now remains in stage area.
7) An unstage step is attempted. If any provider is removed in the new
   packages (e.g. something rebuilds and stage provides `so:libfoo.so.2`
   while the original provider was `so:libfoo.so.1`) and there is still any
   package depending on the old name, the unstage will fail. That ensures that
   all reverse dependencies are always rebuilt as necessary before publishing.
   On successful unstage, the staging area is merged into the repository.
7) Repository is pruned for outdated stuff.
8) Repository syncs to the final primary mirror. First, changed packages get
   uploaded in one step, then indexes are replaced, and only then old packages
   are deleted. This is to ensure that users don't end up with any index that
   contains packages not present yet.

Steps 4, 5, 6 can be condensed together into a single `cbuild` command:

```
$ ./cbuild bulk-pkg status:unbuilt
```

The main tricky part with batch builds like that is correct sorting. Imagine
having packages A and B in the bulk that you want to build. There is a package
C, which A depends on, and which depends on B. Since that makes B in the
dependency tree of A (through A->C->B), B needs to be built first. You do not
know this by knowing only A and B, since C is not in the batch.

Since `cbuild` is very fast and can parse the entire collection very quickly
without caching, it can consider all the intermediates and do a proper sorted
graph trivially. It can also simply parse every template to consider whether
it's buildable, and match it against the repo state. Therefore, on every build,
it can always do that from scratch and the orchestrator has to do nothing,
with each step being largely independent of the other.

The build fleet doesn't do anything else. There is other auxiliary infra, such
as our IRC commit bot (which announces changes driven by a webhook) and our
nightly update-check equivalent to Void, letting packagers stay on top of
things.

In general, **everything** that any piece of our infrastructure does can be
easily done locally.

Our fleet is self-hosted. The orchestrator and most builders run on Chimera
host systems, but they don't have to. Currently these are:

1) The `x86_64` machine, which is a 16-core EPYC root server at Netcup,
   running Chimera.
2) The `aarch64` machine, which is an 80-core Ampere Altra, running Chimera,
   owned by me.
3) The `ppc64le` machine, which is an 18-core/72-thread POWER9, running Chimera,
   owned by me.
4) The `loongarch64` machine, which is a Loongson 3A6000 4-core/8-thread,
   likewise running Chimera, owned by me.
5) The `riscv64` machine, which is a Milk-V Pioneer 64-core machine kindly
   provided to us by Zach van Rijn of Adélie Linux, running Fedora.

The builders do not publicly face the Internet, the orchestrator does, on
its own machine. The primary repository is also on its own separate machine.
Each architecture has its own signing key.

## Final words

All of this may possibly even be a bit too long and too much to take in.
Therefore, I will end it here and hope that I have not forgotten anything.
I hope this was interesting to read and I didn't bore you to death, and
that it wasn't unnecessarily difficult to follow.

As always, you can ask anything on our IRC.
