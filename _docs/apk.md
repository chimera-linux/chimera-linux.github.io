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
# apk upgrade --available
```

**This is currently very important.** The `upgrade` sub-command has
the flags `--latest` (default) and `--available`. The `--latest`
flag will prefer packages by latest version, which is what you'd
usually want.

However, since Chimera is in development, it does not yet increment
revision numbers when doing package updates. That means packages
may get silently rebuilt without bumping the version. That is why
you should **currently always use the --available flag when updating**.

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

## Repositories

By default, you will get packages from the `main` repository. However,
Chimera also has packages in the `contrib` repository, which contains
extra software unsuitable for `main`. This includes a large amount of
non-default GUI software, for instance (e.g. additional web browsers).

You do not need to manually change any config files to enable it.
The simplest way to get it is the following:

```
# apk add chimera-repo-contrib
```

Afterwards simply refresh your indexes.

### Debug packages

For most packages, there are debug symbols in a separate repository.
When debugging something packaged by Chimera, installing debug symbols
may help get better information.

You can enable them as follows:

```
# apk add chimera-repo-main-debug
# apk add chimera-repo-contrib-debug
```

After that, refresh your indexes. The debug packages are suffixed with `-dbg`.
