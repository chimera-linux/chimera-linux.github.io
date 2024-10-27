---
layout: book
title: Booting
section: 2.4
---

Once you have prepared your media, you can boot from it. The boot
will vary depending on the image type you have used. Live images
use the GRUB bootloader. Device-specific images may use their own
bootloaders, but typically it is U-Boot.

## ISO images

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

### Power Mac systems

Power Macs use their flavor of OpenFirmware. You can boot either from
optical media or from USB.

For optical media, you can use the standard chooser which you can
bring up by holding the Option (Alt) key, and ignore the rest of this
section. USB media are somewhat more complicated.

To boot from USB, insert the USB stick in your Mac, power it on and
as soon as the chime sounds, hold the **Command + Option + O + F**
combo (Win + Alt + O + F on standard PC keyboards). Keep holding the
keys until the OpenFirmware console appears:

```
Release keys to continue!
```

After you release the keys, a prompt should appear:

```
 ok
0 >
```

IF you are lucky, the `ud` alias should be present already. You can list
the aliases with the `devalias` command. If the alias is already in place,
you can boot like this:

```
0 > boot ud:,\\:tbxi
```

If this does not work, you can try booting the GRUB image directly, like so:

```
0 > boot ud:,\boot\grub\powerpc.elf
```

The GRUB screen should come up, where you can choose the boot option.

Note that booting from USB or optical media may take a while, both to
show the bootloader screen and to load the kernel.

#### Defining a device alias for USB boot

If the `devalias` command did not print a `ud`, you will have to define one
before you can boot.

List the device tree:

```
0 > dev / ls
```

The listing may be long and you may have to press Space to scroll further.
A portion of the listing may look like this:

```
ffXXXXXX: ...
ffXXXXXX: ...
ffXXXXXX:  /pci@f2000000
ffXXXXXX:    /...
ffXXXXXX:      /...
ffXXXXXX:      /...
ffXXXXXX:    /usb@1a
ffXXXXXX:      /device@1
ffXXXXXX:        /keyboard@0
ffXXXXXX:        /mouse@1
ffXXXXXX:      /device@2
ffXXXXXX:        /keyboard@0
ffXXXXXX:        /mouse@1
ffXXXXXX:        /interface@2
ffXXXXXX:    /usb@1b
ffXXXXXX:      /disk@1
ffXXXXXX:    /...
ffXXXXXX:    /...
```

The part you are looking for is the `/disk@1` under `/usb@1b`. On your machine
this may look different, but in any case it should be a disk under USB.

Once you have located the right part, add the alias. With the above example
listing it would look like this:

```
0 > devalias ud /pci@f2000000/usb@1b/disk@1
```

Once you have made the alias, you can boot from `ud` as described above.

### Qemu virtual machines

When using virtual machines, you can pass the image like this:

```
-cdrom /path/to/chimera.iso -boot d
```

### Serial console

If you wish to use a serial terminal, you might have to do some
additional setup, depending on the configuration.

In a lot of cases, the kernel will output to serial console
automatically, without doing anything. This is especially the
case if you don't have a graphical output. However, if you do
not get kernel output on your serial terminal (i.e. if the
bootloader does appear but the kernel messages do not) you
will have to enable it manually, with the `console=` parameter.

On most `x86_64` setups, this will be `console=ttyS0`.

On most POWER setups, `console=hvc0` is what you want. On some
other POWER systems this might be `console=hvsi0`.

AArch64 and RISC-V systems vary. Refer to the documentation for your
system. Examples include `ttyAMA0`, `ttyS2`, `ttymxc0`, `ttySIF0`
and others.

The Chimera live images are set up to automatically enable a
login prompt (`getty`) for all consoles the kernel outputs to.

### Picking the boot option

Images come with two boot options, regular boot and RAM
boot. The latter results in the whole system being copied to system
RAM, while the former will create a writable overlay over a read-only
mount.

The RAM option requires a large amount of memory. Unless you are sure,
you should be using the regular option. The benefit of the RAM option
is that the system will run faster, and especially for optical media,
will not result in accesses to the media.

Desktop images will by default automatically boot into a desktop.
If you wish to boot into a console environment, edit the boot option
and add `nogui` to the kernel command line.

### Logging in

Once this is set up properly, you will be presented with a login
prompt on console images. Graphical boots bring you directly to
desktop without having to log in.

You will want to use `anon` or `root` as the user name (depending
on if you want a superuser) with the password `chimera`. If you
log in with `anon`, use the `doas` utility to gain superuser
privileges.

## Device images

Device images are pre-made so that they boot out of box on whichever
device they made for.

There is no regular user. Log in with `root`, password `chimera`. If
your device supports serial console, it should be set up and working
by default, so there is nothing to configure.

Device images never come with a graphical desktop environment, but
you can install one if you need one.

If the media you have flashed the image to is your final boot media
and you will not be installing anywhere else, you can skip directly
to [Configuration](/docs/configuration) as there is nothing else to
do.
