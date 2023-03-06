---
layout: book
title: Booting
section: 2.1.2
---

Once you have prepared your removable media, you can boot from
it. All our live images use GRUB as the bootloader.

## Hardware specifics

### UEFI systems

This may vary with hardware, but in general a properly created
USB stick or CD/DVD disc should appear in the list of boot entries.

On the `x86_64` architecture, you will typically get a selection
between UEFI and BIOS mode, assuming CSM is not disabled. Pick
whichever you prefer, but keep in mind that this affects things
such as bootloader setup when installing.

### OpenPOWER systems

OpenPOWER systems use Petitboot. Simply boot your computer with
the removable media inserted and the respective boot entries should
appear.

### Qemu virtual machines

When using virtual machines, you can pass the image like this:

```
-cdrom /path/to/chimera.iso -boot d
```

## Serial console

In general, the images are set up to boot graphically. A lot of
systems do not have any kind of display connected, and a serial
console has to be used instead.

The live media initramfs is set up to automatically configure
a `getty` for your serial console, as long as the console is
enabled. This may be implicit (e.g. on some setups where there
is no graphical display; your login prompt may come up completely
automatically without doing anything) but in other cases you may
have to set it on the kernel command line. This is particularly
when you get the bootloader on your serial terminal, but no
output after kernel selection.

On most `x86_64` setups, this will be `console=ttyS0`.

On most POWER setups, `console=hvc0` is what you want. On some
other POWER systems this might be `console=hvsi0`.

AArch64 and RISC-V systems vary. Refer to the documentation for your
system. Examples include `ttyAMA0`, `ttyS2`, `ttymxc0`, `ttySIF0`
and others.

## Picking the boot option

Console images come with two boot options, regular boot and RAM
boot. The latter results in the whole system being copied to system
RAM, while the former will create a writable overlay over a read-only
mount.

The RAM option requires a large amount of memory. Unless you are sure,
you should be using the regular option. The benefit of the RAM option
is that the system will run faster, and especially for optical media,
will not result in accesses to the media.

Desktop images additionally let you pick between Wayland and X11. The
default option is Wayland. If that is causing problems for you, you
can try the X11 option, but in most cases Wayland is recommended.

## Logging in

Once this is set up properly, you will be presented with a login
prompt on console images. Graphical boots bring you directly to
desktop without having to log in.

You will want to use `anon` or `root` as the user name (depending
on if you want a superuser) with the password `chimera`. If you
log in with `anon`, use the `doas` utility to gain superuser
privileges.
