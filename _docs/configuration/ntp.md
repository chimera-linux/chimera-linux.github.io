---
layout: book
title: NTP synchronization
section: 4.11
---

In a normal Chimera system, your date/time is synchronized with
the `chrony` daemon, which is installed by default with the `full`
base package.

If you have a smaller system without it installed and want it, you
can install it like this:

```
# apk add chrony
```

This will also automatically install the service links to enable
it. If you don't want it enabled by default (for example you are
using another solution, or just don't want any NTP at all and instead
only rely on your hardware RTC), mask them:

```
# apk add '!chrony-dinit-links'
```

To enable the service after that:

```
# dinitctl enable chrony
```
