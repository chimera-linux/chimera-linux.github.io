---
layout: book
title: Firewall
section: 4.09.01
---

## Uncomplicated Firewall (ufw)

The easiest way to get firewall in Chimera is through `ufw`, which
is also used on Ubuntu by default and is available on many distributions.

UFW is a frontend to `nftables` or `iptables`, designed to be easy
to use.

Install it:

```
# apk add ufw
```

Enable it:

```
# dinitctl enable ufw
# ufw enable
```

Verify it is enabled:

```
# ufw status
```

A simple configuration that allows SSH and webservers is something like:

```
# ufw default deny incoming
# ufw default allow outgoing
# ufw allow ssh http https
# ufw limit ssh
```

This will also limit SSH connections against brute-force.

## nftables

If you wish to manage your firewall in a more low-level way, the
recommended method is through `nftables`.

Install it:

```
# apk add nftables
```

It comes with a service that loads rules from `/etc/nftables.conf`.
You can enable it with:

```
# dinitctl enable nftables
```

If you change the rules, just `dinitctl restart` it. Stopping the
service will flush the rules.

## iptables

The `iptables` package provides the legacy firewall. You can install
it like:

```
# apk add iptables
```

In `/etc/iptables`, the `simple_firewall.rules` and `empty.rules`
rulesets serve as an example.

There are two services, `iptables` and `ip6tables`, which load rules
from `/etc/iptables/iptables.rules` and `/etc/iptables/ip6tables.rules`
respectively. You can configure your firewall and generate the files
with `iptables-save` and `ip6tables-save`.

In any case, enabling the services is as usual:

```
# dinitctl enable iptables
# dinitctl enable ip6tables
```

Restart the services when you change your rules. Stop the services to
flush the rules.
