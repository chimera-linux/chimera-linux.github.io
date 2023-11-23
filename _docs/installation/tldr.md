---
layout: book
title: TL;DR
section: 2.1
---

You should really read the proper installation documentation. While the
extent of it may seem somewhat intimidating, that's only because Chimera
covers a lot of platforms and potential layouts/setups.

The actual installation should be very easy, even if it's manual. In any
case, here are a few TL;DR basic setups, in the form of a command sequence.
The setups are intentionally variable and should often not be used as-is,
as every computer is a little different and may have different disk names,
swap sizes, and so on.

Multi-boot is not covered here.

## Any UEFI, NVMe, local install, GNOME image, whole disk, unencrypted

This will install Chimera from the GNOME image with the GNOME desktop,
using a whole NVMe disk, on an ordinary (usually x86_64) UEFI computer.
An 8GB swap partition will be used.

The same instructions will work on any UEFI machine, but `grub-x86_64-efi`
will need to be changed to `grub-arm64-efi` or whichever the user needs.

```
# wipefs -a /dev/nvme0n1
# sfdisk /dev/nvme0n1 <<EOF
label: gpt
name=esp, size=100M, type="EFI System"
name=swap, size=8G, type="Linux swap"
name=root
EOF
# mkfs.vfat /dev/nvme0n1p1
# mkswap /dev/nvme0n1p2
# mkfs.ext4 /dev/nvme0n1p3
# mkdir /media/root
# mount /dev/nvme0n1p3 /media/root
# mkdir -p /media/root/boot/efi
# mount /dev/nvme0n1p1 /media/root/boot/efi
# chmod 755 /media/root
# chimera-bootstrap -l /media/root
# chimera-chroot /media/root
## apk update
## apk upgrade --available
## apk fix
## apk add linux-lts grub-x86_64-efi
## swapon /dev/nvme0n1p2
## genfstab -t PARTLABEL / > /etc/fstab
## passwd root
## useradd myuser
## passwd myuser
## usermod -a -G wheel myuser
## echo mycomputer > /etc/hostname
## ln -sf ../usr/share/zoneinfo/Europe/Prague /etc/localtime
## dinitctl -o enable gdm
## dinitctl- o enable chrony
## dinitctl -o enable networkmanager
## update-initramfs -c -k all
## grub-install --efi-directory=/boot/efi
## update-grub
## exit
# reboot
```

## OpenPOWER POWER9, sda1, network install, base image, desktop, LVM on LUKS

This will install Chimera with GNOME desktop from the console image using
the network and will use LUKS encryption with LVM on top, on a POWER9 computer
such as the Talos 2. It is assumed that the live session is on the network.
A SATA drive will be used (`sda1`). The 8GB swap is added in the LVM.

```
# wipefs -a /dev/sda
# sfdisk /dev/sda <<EOF
label: gpt
name=boot, size=2G, type="Linux extended boot"
name=luks
EOF
# mkfs.ext4 /dev/sda1
# cryptsetup luksFormat /dev/sda2
# cryptsetup luksOpen /dev/sda2 crypt
# vgcreate volg /dev/mapper/crypt
# lvcreate --name swap -L 8G volg
# lvcreate --name root -l 100%free volg
# mkswap /dev/volg/swap
# mkfs.ext4 /dev/volg/root
# mkdir /media/root
# mount /dev/volg/root /media/root
# mkdir /media/root/boot
# mount /dev/sda1 /media/root/boot
# chmod 755 /media/root
# chimera-bootstrap /media/root base-desktop
# chimera-chroot /media/root
## apk update
## apk add linux-lts grub cryptsetup-scripts lvm2
## swapon /dev/volg/swap
## genfstab -t PARTLABEL / > /etc/fstab
## echo crypt /dev/sda2 none luks,discard > /etc/crypttab
## passwd root
## useradd myuser
## passwd myuser
## usermod -a -G wheel myuser
## echo mycomputer > /etc/hostname
## ln -sf ../usr/share/zoneinfo/Europe/Prague /etc/localtime
## dinitctl -o enable gdm
## dinitctl- o enable chrony
## dinitctl -o enable networkmanager
## update-initramfs -c -k all
## mkdir /boot/grub
## update-grub
## exit
# reboot
```

## x86_64 legacy BIOS, sda1, root on ZFS, network install, console

This will install Chimera with pure console environment using the network,
and will put root filesystem on ZFS. The `/boot` filesystem will be separate.
No swap will be used.

```
# wipefs -a /dev/sda
# sfdisk /dev/sda <<EOF
label: dos
name=boot, size=2G, bootable, type=b
name=root
EOF
# mkfs.ext4 /dev/sda1
# mkdir /media/root
# zpool create -o ashift=12 -O acltype=posix -O canmount=off -O dnodesize=auto -O normalization=formD -O relatime=on -O xattr=sa -O mountpoint=/ -R /media/root rpool /dev/sda2
# zfs create -o canmount=off -o mountpoint=none rpool/ROOT
# zfs create -o canmount=noauto -o mountpoint=/ rpool/ROOT/chimera
# zfs mount rpool/ROOT/chimera
# mkdir /media/root/boot
# mount /dev/sda1 /media/root/boot
# chmod 755 /media/root
# chimera-bootstrap /media/root
# chimera-chroot /media/root
## apk update
## apk add zfs linux-lts linux-lts-zfs-bin grub-i386-pc
## passwd root
## echo mycomputer > /etc/hostname
## ln -sf ../usr/share/zoneinfo/Europe/Prague /etc/localtime
## dinitctl -o enable dhcpcd
## update-initramfs -c -k all
## grub-install /dev/sda
## update-grub
## exit
# reboot
```
