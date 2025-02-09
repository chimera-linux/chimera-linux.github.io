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

Once in a while, running `apk upgrade --available` may be a good idea,
especially if there were significant changes in the packaging earlier.
This is to properly account for any renames, downgrades, and so on.
Be careful with using `--available` and always run it in interactive
mode (which is the default for `apk` in Chimera) to be able to check
what is being removed or upraded.

Without `--available`, the default is `--latest` which is safer but may
miss things occasionally. With `--available`, for instance, packages that
installed themselves through `install_if` will get removed if they are
not found in any repository index at the time of upgrade.

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

The default configuration is set to be interactive (i.e. when run from the
console, it will ask you about changes) and to cache packages by default.

The default location for cache is `/var/cache/apk`.

If you wish to disable interactive mode or caching, create the file
`/etc/apk/config`. Look at `/usr/lib/apk/config` for the default options.
Put only the ones you want in your config file, it overrides the system one.

If you wish to change the cache location, create a symlink `/etc/apk/cache`
that points to your desired location.
