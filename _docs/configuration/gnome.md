---
layout: book
title: GNOME
section: 4.6
---

GNOME is the default desktop of Chimera.

## Installation

The easiest way is to use the `base-desktop` metapackage.

```
# apk add base-desktop
```

This adds `gnome` as well as several things a desktop session
will typically want, including graphics drivers.

It is possible to install those things individually for more
fine-grained control. Those users may also be interested in the
`gnome-core` package which only installs a relatively bare desktop
without auxiliary apps.

## Starting

Keep in mind that GNOME requires `elogind`. In a typical setup, this
is enabled by default, i.e. requires explicit masking to avoid. You
do not need to manually enable `elogind` if you have not removed
its service link. Likewise, it requires `dbus`, both system and
session bus, see [D-Bus](/docs/configuration/dbus).

Otherwise, you only have to start the `gdm` service. You can
enable it:

```
# dinitctl enable gdm
```

That will make it start on every boot. If you want to run it just
once, you can also do:

```
# dinitctl start gdm
```

After that, you only need to log in and a desktop should come up.
