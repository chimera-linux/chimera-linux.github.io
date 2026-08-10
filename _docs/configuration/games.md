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

Video game console emulators such as Dolphin and Snes9x are
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

Additionally, go to Settings and Tweaks, enable `Native Libraries`.

Make sure system OpenAL is enabled with `/usr/lib/libopenal.so.1` in the path.

Make sure system Jemalloc is enabled with `/usr/lib/libjemalloc.so.2` in the path.

### Versions prior to 26.1

System GLFW can be enabled (`/usr/lib/libglfw.so.3`) but the game works
either way.

No other action should be necessary.

### Versions 26.1 onwards

System GLFW must **not** be enabled (the game will crash with an unknown window
hint).

Versions 26.x added new dependencies in internal libraries due to Vulkan,
e.g. the memory allocator library. There are various new natives, such
as Freetype, Shaderc, and SPIRV-Cross. While some of the new natives can
be overridden (Settings and then Java, check `Java Arguments`), other
internal things (particularly the Vulkan Memory Allocator library) depend
on GCC `libstdc++.so.6` and this cannot change.

Currently, the only way to address this is to obtain a copy of the library.
It is not safe to use it for binaries in Chimera in general as it clashes
with the exception handling by our native C++ libraries, but it works for
this specific case; note that **this is not supported by us in any way**.

You will need a `musl`-linked copy of the library, a good source is e.g.
Alpine Linux. You can obtain it any way you like but below is one possible
way using OCI containers (in this case Podman, any frontend can be used):

```
$ mkdir -p ~/.local/share/PrismLauncher/libstdcpp
$ podman run -it --mount type=bind,source=$HOME/.local/share/PrismLauncher/libstdcpp,target=/mnt alpine:latest
# apk update
# apk add libstdc++
# cp -a /usr/lib/libstdc++.so.6* /mnt
# exit
```

Another way is to obtain the `apk` file from Alpine CDN mirror and extract it.

Then append `LD_LIBRARY_PATH=$HOME/.local/share/PrismLauncher/libstdcpp` to
the wrapper command where you added the `LD_PRELOAD` previously.

You will also need the `libgcc_s.so.1` compatibility library which you can
install in Chimera:

```
# apk add libgcc-chimera
```

The game should run now.

If you wish to override the natives (not necessary to play the game, may
become necessary if we come up with a bettter solution for the above), you
can use the following arguments:

```
-Dorg.lwjgl.shaderc.libname=/usr/lib/libshaderc_shared.so.1
-Dorg.lwjgl.freetype.libname=/usr/lib/libfreetype.so.6
```

SPIRV-Cross is also overridable (`org.lwjgl.spvc.libname`) but not packaged
as of the time of writing.
