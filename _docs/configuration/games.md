---
layout: book
title: Video games
section: 4.14
---

It is possible to play video games on Chimera.

Several open source titles are packaged in the regular repositories in
the `contrib` section. These include:

* OpenMW
* Xonotic
* Sauerbraten
* Crispy DOOM/Heretic/...
* The PCSX2 emulator
* with the list growing

## Gamescope

Valve's Gamescope compositor is available in the `contrib` repository.
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
`contrib` repository, which will allow various input devices (e.g.
the DualShock controllers and VR systems) to function out of the box.

## Flatpak

Games present on Flathub and other repositories should function out of
the box.

## Minecraft

You can play Minecraft natively on Chimera on the `x86_64` architecture
(and possibly others with custom JARs).

First, you will need Java. Install OpenJDK 17:

```
# apk add openjdk17
```

You will then need a launcher; there is PrismLauncher in the `contrib`
repository:

```
# apk add prismlauncher
```

As Minecraft comes with native binaries built for Glibc in its packaging,
the `gcompat` system is required, as well as some native libraries to
replace them.

```
# apk add gcompat openal-soft
```

Chances are you already had `openal-soft` installed previously, so you may
only need `gcompat`.

Afterwards, you can open PrismLauncher, log in to your account, and install
a version of the game.

The game will not launch out of the box. Therefore, right-click the version
you installed, edit it, go to Settings, the "Custom commands" tab, check the
"Custom Commands" checkbox, and add the following to "Wrapper command":

```
env LD_PRELOAD=/usr/lib/libgcompat.so.0
```

This will allow some of the bundled libraries to work. However, the bundled
OpenAL still will not work because of C++ standard library mismatch; thus
go to the "Workarounds" tab, check "Use system installation of OpenAL" and
add the following:

```
/usr/lib/libopenal.so.1
```

Close the settings window, and the game should run.
