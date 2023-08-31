---
layout: book
title: Xorg
section: 4.07
---

On top of Wayland, Chimera supports Xorg. Note that Wayland is recommended
by the distribution for most users.

Xorg is in the `contrib` repo. Therefore, enable the repository first if
it is not already.

Then you can add the necessary package:

```
# apk add xserver-xorg
```

This will install a setup that is enough for most users. Other components
of the X11 stack are available through other packages, however. This full
metapackage installs most apps.

You can also install a way smaller, but functional installation and add
the apps you need yourself. To do that, use:

```
# apk add xserver-xorg-minimal
```

## Starting a WM/DE

Most people will want to use a display manager, such as GDM. You can find
instructions for GDM on the [GNOME](/docs/configuration/gnome) page.

Other people will prefer to use the `startx` tool. To use that, you need
to create the `.xinitrc` file in either `${XDG_CONFIG_HOME}/.xinitrc`
(this will typically be `${HOME}/.config/.xinitrc`) or in `${HOME}/.xinitrc`.

Put your startup commands in there, and run `startx`.

## Privileged Xorg

By default, Chimera Xorg is unprivileged, and uses `libseat` to be able to
negotiate permissions for the display device (which means you need something
like `elogind` or `seatd` set up for it to work). There are cases when you
may want to use the legacy method using a `setuid` wrapper, e.g. when using
GDM without Wayland and the rootless path causes VT switches to fail.

To set that up, you can do the following:

```
# echo needs_root_rights = yes > /etc/X11/Xwrapper.config
```

Once done, Xorg will no longer use `libseat` at all and will have greater
privileges through `setuid`. Note that doing this is not recommended.
