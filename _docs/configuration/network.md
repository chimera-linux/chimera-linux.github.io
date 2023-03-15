---
layout: book
title: Network
section: 4.7
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

## Old-style interface names

To get traditional interface names like `eth0` and `eth1`, you will
need to add `net.ifnames=0` to kernel command line. The default in
Chimera is the newer `udev` default.

## Wireless networks

The recommended tool for bare wireless networking configuration is
`iwd`. While `wpa_supplicant` comes packaged, it currently has no
service in place.
