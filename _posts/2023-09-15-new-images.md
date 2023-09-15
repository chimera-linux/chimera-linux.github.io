---
title: New images
layout: post
excerpt_separator: <!--more-->
---

A new set of images has been released once again.

This is mostly a refresh. The previous images still work fine for
installation. These new images bring updated software, and a few
other functional changes.

<!--more-->

## Major updates

1. The `dinit-chimera` core service set has been overhauled.
2. NTP is active by default in the live images, so you will get
   correct date/time even without RTC as long as connected to the
   network.
3. To avoid having files with timestamps in the future on hardware
   without an RTC, the new `swclock` service will synchronize time
   to at least a specific timestamp.
4. PipeWire is now always implicitly active if present.
5. The GNOME images no longer come with an X11 server (outside of
   XWayland). It can still be installed from the contrib repo.
6. HDMI audio should now work universally, as well as sound on
   some laptops and devices such as the Steam Deck.
7. And various minor changes.
