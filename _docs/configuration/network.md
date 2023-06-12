---
layout: book
title: Network
section: 4.8
---

There are several ways to configure the network in Chimera.

## dhcpcd

You can configure wired networks statically or dynamically with
`dhcpcd`.

Most setups will have it installed by default, as it's a part of
the default `full` metapackage. If not, install it:

```
# apk add dhcpcd
```

Enable the service:

```
# dinitctl enable dhcpcd
```

The default behavior is for it to configure all interfaces with
DHCP. Changes are made in `/etc/dhcpcd.conf`. If you need to know
more, read `dhcpcd.conf(5)`.

A simple static example:

```
interface enP4p1s0f0
static ip_address=192.168.1.144/24
static routers=192.168.1.1
static domain_name_servers=8.8.8.8 4.4.4.4
```

## NetworkManager

NetworkManager is an all-in-one frontend for wired, wireless and
other interfaces and a lot more.

Install it:

```
# apk add networkmanager
```

Enable it:

```
# dinitctl enable networkmanager
```

Configuration can be done with `nmcli` or `nmtui` for command-line
and TUI interfaces. In GNOME, there is a native integration, so
it will show up in your top panel.

An example of connecting to a wireless network from command-line:

```
$ nmcli d wifi list
$ nmcli d wifi connect <ssid name> password <passphrase>
```

## Old-style interface names

To get traditional interface names like `eth0` and `eth1`, you will
need to add `net.ifnames=0` to kernel command line. The default in
Chimera is the newer `udev` default.

## Wireless networks with iwd

The recommended tool for bare wireless networking configuration is
`iwd`. While `wpa_supplicant` comes packaged, it currently has no
service in place. If you are already using NetworkManager, do not
enable the `iwd` service.

Enable the `iwd` service:

```
# dinitctl enable iwd
```

As `iwd` is only a supplicant by default, you will also need to enable
`dhcpcd`. An alternative to that is enabling the general network configuration
in `/etc/iwd/main.conf`, like

```
[General]
EnableNetworkConfiguration=true
```

However, using `dhcpcd` is recommended in most cases.

AFter that, you can run `iwctl` as `root`. If you wish to run it as your user,
you will need to add yourself to the `network` group and re-login.

After that, you will be able to connect to your wireless network from the
`iwctl` prompt. List your wireless devices:

```
[iwd]# device list
```

You will find something like `wlan0`. If the output shows it's powered off,
power it on:

```
[iwd]# device <wlan name> set-property Powered on
[iwd]# adapter <adapter name> set-property Powered on
```

Then you can scan for SSIDs:

```
[iwd]# station <wlan name> scan
```

Connect to one:

```
[iwd]# station <wlan name> connect <ssid name>
```

You will be prompted for a passphrase if there is one. After that, you will
be able to use the network.
