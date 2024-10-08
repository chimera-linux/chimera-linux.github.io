---
layout: book
title: Package management
section: 3
---

Chimera uses `apk-tools` (Alpine Package Keeper) as its system package
manager. Since Chimera uses the next-generation version 3 of the package
manager which Alpine is not yet using, there are some differences.

Additionally, there are some things to currently keep in mind because of
Chimera being in an early state.

## Basic usage

There is only one command, `apk`. Everything you might want to do is
a subcommand of it. There is in general a `--help` for every command.

To cover the basics, this is how you refresh the index:

```
# apk update
```

This is how you install something:

```
# apk add linux
```

This is how you remove something:

```
# apk del bash
```

This is how you upgrade your system:

```
# apk upgrade
```

There is also the `--available` flag for `apk upgrade`, which was
formerly recommended. It is no longer necessary to use this flag
in most cases, with the default `--latest` flag being the correct
one.

This is because Chimera now increments revision numbers, which
means it is not necessary to force the versions from repository
anymore. It may still be a good idea to run it every once in a
while, e.g. when a package gets downgraded, but be careful with
it, as it may result in some unintended consequences (e.g. packages
that installed themselves through `install_if` will get removed if
they are not found in any repository).

If updates introduce some file conflicts, which may happen this early
in the development cycle (but will not happen once more stable, at
least not intentionally), this will usually solve it:

```
# apk fix
```

You can also use `apk fix` to reinstall packages.

To search for a package in the repositories:

```
# apk search firefox
```

## Virtual packages

You can also install packages by virtual names instead of by their real
names. Several things follow a standard convention for virtual provider
names: commands, shared libraries and `pkg-config` files. This convention
consists of a prefix (`cmd:`, `so:`, `pc:`) plus the name.

That means if you want to add the package that provides a command `foo`,
you can simply add it as it is:

```
# apk add cmd:foo
```

## Base packages

Chimera has flexible base package splitting. There are the following main base
packages:

* `base-bootstrap`
* `base-full`

The `base-bootstrap` is an extremely minimal package set for bootstrapping
containers (e.g. the OCI containers are made up of this one). The `base-full`
is a flexible "full system" metapackage.

The base packages never install a kernel, as that is separate. There are also
various device-specific base packages, such as `base-rpi` for Raspberry Pi
or `base-steamdeck` for the Steam Deck.

The `base-full` package has very few dependencies by itself. Instead, it is
modular. There are many subpackages defining individual parts, for example
`base-full-fs`, `base-full-net`, `base-full-kernel`, and so on.

For the full list, read the templates in `cports` or you can use `apk search`:

```
$ apk search -r -e base-full
```

The reason for this is so that portions of the base system can be easily
masked in case some dependencies are not needed. For instance:

```
# apk add base-full '!base-full-net'
```

There is also the `base-minimal` package, which acts as a mask for several
of the modules, for systems that are intentionally small, as a convenience
feature. Do not use this unless you are absolutely sure what you are doing.

Read about [the world](/docs/apk/world) for details of how masking works.

## Repositories

By default, you will get packages from the `main` repository. However,
Chimera also has packages in the `user` repository, which contains
extra software unsuitable for `main`.

The `user` repository has software that does not meet the general
criteria regarding stable versioning, dependency vendoring, and so on.
That means software in `user` may not be of the same quality level as
software in `main`. Software in `user` may additionally not be available
on all tier 1 architectures.

You do not need to manually change any config files to enable these.
The simplest way to get it is the following:

```
# apk add chimera-repo-user
```

Afterwards simply refresh your indexes.

### Debug packages

For most packages, there are debug symbols in a separate repository.
When debugging something packaged by Chimera, installing debug symbols
may help get better information.

You can enable them as follows:

```
# apk add chimera-repo-main-debug
# apk add chimera-repo-user-debug
```

After that, refresh your indexes. The debug packages are suffixed with `-dbg`.

## Cache and interactive mode

By default, there is cache set up, with `/var/cache/apk` being where the
cached packages are stored.

If you wish to change this path, first mask the cache provider:

```
# apk add '!apk-tools-cache'
```

Then you can symlink `/etc/apk/cache` to a path of your choice.

The package manager is also interactive by default, i.e. it will ask you
to confirm before installing or removing any packages. It is recommended
not to turn this off, as it can prevent unintended changes into your
system (and it can always be overridden with `--no-interactive` on the
command line).

If you still wish to make the package manager non-interactive, mask the
provider:

```
# apk add '!apk-tools-interactive'
```

Read about [the world](/docs/apk/world) for details of how masking works.
