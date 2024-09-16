---
layout: book
title: Video games
section: 4.14
---

It is possible to play video games on Chimera.

Several open source titles are packaged in the regular repositories in
the `main` and `user` sections. These include:

* OpenMW
* Xonotic
* Sauerbraten
* Crispy DOOM/Heretic/...
* The Ur-Quan Masters
* with the list growing

Video game console emulators such as Dolphin, Snes9x and PCSX2 are
also available.

## Gamescope

Valve's Gamescope compositor is available in the `user` repository.
You can install it like:

```
# apk add gamescope
```

This is handy for various things like scaling, limiting framerate, and so
on. It is especially useful when running Chimera on handheld gaming consoles
such as the Steam Deck.

## Steam

Steam may be acquired from Flatpak.

You may want to also install the `steam-devices-udev` package from the
`user` repository, which will allow various input devices (e.g.
the DualShock controllers and VR systems) to function out of the box.

## Flatpak

Games present on Flathub and other repositories should function out of
the box.

## Minecraft

You can play Minecraft natively on Chimera on the `x86_64` architecture
(and possibly others with custom JARs).

First, you will need Java. Install OpenJDK:

```
# apk add java-jdk
```

You will then need a launcher; there is PrismLauncher available:

```
# apk add prismlauncher
```

As Minecraft comes with native binaries built for Glibc in its packaging,
the `gcompat` system is required, as well as some native libraries to
replace them.

```
# apk add gcompat
```

Since the PrismLauncher package defaults to using the natives, you only
need to add `gcompat`.

Afterwards, you can open PrismLauncher, log in to your account, and install
a version of the game.

The game will not launch out of the box. Therefore, right-click the version
you installed, edit it, go to Settings, the "Custom commands" tab, check the
"Custom Commands" checkbox, and add the following to "Wrapper command":

```
env LD_PRELOAD=/usr/lib/libgcompat.so.0
```

Close the settings window, and the game should run.
