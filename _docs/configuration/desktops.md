---
layout: book
title: Desktops
section: 4.08
---

Chimera offers a variety of desktop environments.

The primary/official desktop is GNOME, but others are available:

* KDE
* Xfce
* Various smaller window managers/compositors

In general every comprehensive desktop has a metapackage you can install:

* For GNOME, it's `gnome`
* For KDE, it's `plasma-desktop`
* For Xfce, it's `xfce4`

Other available packages include:

* `enlightenment`
* `sway`
* `wayfire`
* `labwc`
* `pekwm`
* `icewm`

and a variety of others.

For Xorg-based environments, you will also need to install an appropriate
version of X11, see [Xorg](/docs/configuration/xorg).

## Display manager

Every desktop session can be started with a display manager, or it can be
started manually. Using a display manager is recommended, especially with
something like GNOME where it facilitates lock screen integration.

### GDM

When using GNOME, it is pulled in by default. Otherwise, you can install it:

```
# apk add gdm
```

Typically, all you need to do after that is enable the service:

```
# dinitctl enable gdm
```

That will make it start on every boot. If you want to run it just
once, you can also do:

```
# dinitctl start gdm
```

After that, you only need to log in.

#### GDM with Xorg

Normally, GDM will default to Wayland. There are some specific cases
where Wayland is disabled, most of them not relevant to Chimera, but
e.g. when missing modesetting.

Other people may want to disable Wayland manually for other reasons.

To force-disable Wayland in GDM, edit the `/etc/gdm/custom.conf` file
and uncomment the `WaylandEnable=false` line.

Note that this will not make GDM with Xorg work right away, as Chimera's
Xorg setup is unprivileged and the X server started by GDM will not be
allowed to switch VTs, see [Xorg](/docs/configuration/xorg).

## GNOME

The easiest way is by using the `gnome` metapackage:

```
# apk add gnome
```

This is a complete session by default, which includes auxiliary
apps. If you wish to use only the core desktop and have better
control over what apps are included, the `gnome-apps` package
is an optional dependency that you can mask:

```
# apk add '!gnome-apps'
```

This leaves just the core desktop with mandatory applications.
You can install other applications manually as needed.

### Starting

Keep in mind that GNOME requires `elogind`. In a typical setup, this
is enabled by default, i.e. requires explicit masking to avoid. You
do not need to manually enable `elogind` if you have not removed
its service link. Likewise, it requires `dbus`, both system and
session bus, see [D-Bus](/docs/configuration/dbus).

You can start GNOME either manually, or from a display manager,
typically GDM.

#### Manual startup

**This is not recommended as some functionality will not work**, such
as the lock screen, but it can still be useful for debugging and specific
setups. However, do keep in mind that this will also interfere with
management of graphical user services and so on at a later point (and
these instructions will change).

For Wayland (recommended), you need to log in on the desired tty
and run something like:

```
$ gnome-shell --wayland
```

This will give you a shell, but for example the settings app will
not work. You can fix that by exporting the following variable first:

```
$ export XDG_CURRENT_DESKTOP=GNOME
```

For X11, you can create an `.xinitrc` script, and put the following
inside:

```
gnome-session
```

Then you need to give it appropriate permissions (must be executable
by your user). Then you can simply use `startx`.
