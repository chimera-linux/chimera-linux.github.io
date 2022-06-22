---
layout: book
title: Installation
section: 2
---

Currently, you can install Chimera using the images that are available on
the [Downloads](/downloads) page.

Keep in mind that those images are provided for preview purposes and
installation is currently officially unsupported.

Following is an example for an x86_64 EFI machine (for EFI machines of other
architectures, it should be largely equivalent, besides some minor things).
Other architectures and firmwares may need various alterations to the process.

First, log in as root. Then, locate the drive you will be installing on. Let's
use `/dev/sda` as an example.

```
# wipefs -a /dev/sda
# cfdisk /dev/sda
```

Create a partition table (GPT for EFI) and on it two partitions (~200MB first
partition of type `EFI System`, and a regular Linux partition on the rest).

Now format them:

```
# mkfs.vfat /dev/sda1
# mkfs.ext4 /dev/sda2
```

Mount the root partition:

```
# mkdir /media/root
# mount /dev/sda2 /media/root
```

Install Chimera:

```
# chimera-live-install /media/root
```

Bind pseudo-filesystems:

```
# mount --rbind /dev /media/root/dev
# mount --rbind /proc /media/root/proc
# mount --rbind /sys /media/root/sys
# mount --rbind /tmp /media/root/tmp
```

Change into the target system:

```
# chroot /media/root
```

Then from within, install the bootloader:

```
# mkdir /boot/efi
# mount /dev/sda1 /boot/efi
# grub-install --efi-directory=/boot/efi
# update-grub
```

Add a user, set a password for it and root, add it to groups you want:

```
# useradd myuser
# passwd myuser
# passwd root
# usermod -a -G other,groups,you,want myuser
```

Pre-enable some services; you can also do this from a booted system with
the `dinitctl` command, but it's good to do this ahead of time. Following
is an example that enables `udevd` for early target, `dhcpcd` for network
target, `syslog-ng`, `elogind` and `dbus` for `login` target and `gdm`
for `boot` target. An equivalent with `dinitctl` would be something like
`dinitctl enable --from login dbus` (without `--from`, `boot` is assumed).

```
# cd /etc/dinit.d/init.d
# ln -s ../udevd .
# cd ../network.d
# ln -s ../dhcpcd .
# cd ../login.d
# ln -s ../elogind .
# ln -s ../dbus .
# cd ../boot.d
# ln -s ../gdm .
```

Set a hostname:

```
# echo chimera > /etc/hostname
```

Also add it to `/etc/hosts`; this prevents `syslog-ng` from doing a blocking
DNS lookup, which may take some time:

```
# echo 127.0.0.1 chimera >> /etc/hosts
# echo ::1 chimera >> /etc/hosts
```

Certain EFI firmwares require a bootable file at a known location before they
show any NVRAM entries. In this case, the system may not boot. This does not
affect most systems, but for some you may want to put GRUB at the fallback
boot path:

```
# mv /boot/efi/EFI/chimera /boot/efi/EFI/BOOT
# mv /boot/efi/EFI/BOOT/grubx64.efi /boot/efi/EFI/BOOT/BOOTX64.EFI
```

You can then perform whatever other post-installation tasks you want before
rebooting. When you are done, simply reboot into the new system and log in.
