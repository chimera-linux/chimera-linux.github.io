---
layout: book
title: The world
section: 3.1
---

The `apk` system is non-traditional in this way, so this deserves
an explanation in order to fully understand how things work.

There is the file `/etc/apk/world`. If you try to print its contents,
you will see it contains a list of packages. This list of packages
may be very small.

```
# cat /etc/apk/world
base-desktop
base-full
chimera-repo-contrib
ckms
clang-devel
firefox-esr
linux
linux-modules-zfs
strace
weston
xserver-xorg
zfs
```

This file is pretty much the central point the `apk` solver works
with. Whenever you `apk add` or `apk del`, it does not actually
install or delete any packages directly. It merely adds or removes
them from the `world` file. This will result in `apk` re-computing
the whole package graph, and if it differs compared to the current
state, packages will be added or removed to match the new state.

Doing this is fully transactional in order to ensure integrity.
Additionally, this has a lot of handy consequences. The list of
packages in the world is not actually a list of packages per se.
It's a list of constraints. Want to ensure that a package never
makes it into your system? That's easy:

```
# apk add !firefox
```

You can also bundle several packages under one virtual package.
For example:

```
# apk add --virtual extra-shells zsh bash fish-shell
```

Then you can delete the virtual package and it will delete the
whole bundle. If something in the bundle is depended upon by
something else, only those packages that had no reverse deps
will be deleted.

## Install if

A handy feature that Chimera's packaging heavily utilizes is
the `install_if` metadata. This can be a little confusing, but
it is worth it.

Some package managers have the "recommends" feature. This usually
works like if a package recommends another package, that package
will be installed unless you somehow indicate you do not want it.

But what if we reversed that? This is `install_if`. It basically
lets a package say "install me if these other constraints are
met".

How does this work in practice? Consider for instance completions
for the Bash shell. If you don't use Bash, there is a good chance
that you do not want the completions on your computer, because
they will do nothing but waste space. Various packages may come
with completions. If you do use Bash, you probably want them.

Chimera solves this by utilizing `install_if`. Every package
that comes with Bash completions splits them into separate
packages, suffixed `-bashcomp`. These packages have metadata
like this (this is `foo-bashcomp` for `foo=1.0-r0`):

```
install_if = foo=1.0-r0 bash-completion
```

This means `foo-bashcomp` will get automatically installed
but only if an identically-versioned `foo` package is also
installed and if `bash-completion` is also installed.

There are various other things that Chimera splits in the same way.
This includes documentation, service files, udev rules, locale data,
Python cached bytecode and so on. These are all installed automatically
but only if they can be actually used on the system. For instance, if
something comes with service files or udev rules, these only get
installed if you have the service manager or udev daemon. Individual
packages also rely on this sometimes. Examples include:

* Mesa Vulkan drivers are installed only if the ICD loader also is
* CUPS print backend for Gtk is installed only if CUPS also is
* Glib networking backends are installed if the matching TLS library is
* and so on

This feature can be combined together with the constraints feature
of the world file, while providing good default UX. An example of
this would be default service links.

To elaborate, there are services that most people will want activated
and running when installed. There are two usual ways to approach this:

1. Do not activate anything by default, and let users do it (e.g. Void)
2. Activate everything by default as it gets installed (e.g. Ubuntu)

Chimera takes approach 1 for most services, as the idea of auto-activating
daemons does not sound quite right. However, it is not user-friendly and
in most cases goes against what users actually want. But what if we could
have the cake and eat it too?

For select daemons (and some special cases such as default gettys for
default virtual terminals), Chimera's packaging installs packages that
contain default service links. Those packages are linked to the respective
daemon's package via `install_if`. That means you get them by default. But
if you for some reason want to disable that daemon and ensure it does not
get auto-enabled, you can constraint it away, for example like:

```
# apk add '!eudev-dinit-links'
```

This ensures that the package is never automatically installed, and if it
is already installed, it gets purged.
