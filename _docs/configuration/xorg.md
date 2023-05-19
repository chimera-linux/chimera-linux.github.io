---
layout: book
title: Xorg
section: 4.6
---

On top of Wayland, Chimera supports Xorg. Note that Wayland is recommended
by the distribution for most users.

To install Xorg, simply add the necessary package:

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

By default, Chimera Xorg is unprivileged, and uses `elogind` to negotiate
permissions for the display device. There are cases when you may want to
use the legacy method using a `setuid` wrapper:

* Xorg needs to be able to switch VTs, e.g. when using GDM without Wayland.
* Systems that don't use `elogind` (for now).

To set that up, you can do the following:

```
# echo needs_root_rights = yes > /etc/X11/Xwrapper.config
```

Once done, Xorg will no longer require `elogind` and it will have greater
privileges. Note that doing this is not recommended.
