---
layout: book
title: Flatpak
section: 4.12
---

As Chimera is a Musl-based distribution with a small repository, you may
want to use Flatpak to supplement the existing software sources, e.g. when
using proprietary software.

Full GNOME setups have it installed by default. Smaller setups may need to
install it manually:

```
# apk add flatpak
```

For proper functionality, you may need to install an appropriate XDG desktop
portal implementation.

For GTK there is `xdg-desktop-portal-gtk`, with `xdg-desktop-portal-gnome`
for additional GNOME infrastructure integration. For Wlroots-based Wayland
compositors, `xdg-desktop-portal-wlr` should be used.

## Repositories

By default out of the box, Flatpak is not very useful. You may want to add
the Flathub repository at very least. You can do so like this:

```
$ flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
```

Afterwards, you can use the `flatpak` command to install, remove and upgrade
software. For instance, to list available stuff:

```
$ flatpak remote-ls
```

At this point you may also use frontends such as GNOME Software to manage it
(do note that it may require a restart and may take a while to come up as it
needs to refresh its metadata).
