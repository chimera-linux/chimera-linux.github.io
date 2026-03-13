---
title: Plans to possibly retire the big-endian PowerPC/POWER platforms
layout: post
excerpt_separator: <!--more-->
---

Unless circumstances change, we are planning to retire support for the
big-endian 32-bit PowerPC and 64-bit POWER platforms. Read below for
when and why and how you can potentially change this.

<!--more-->

## Reasons

We've been supporting these platforms in Chimera since a while back,
with ppc64 being suppported in repos since the middle of 2023 and 32-bit
ppc a while later.

We brought up the platform support to give people interested in the platform
a base to bring the platform towards greater usability and fix the long-standing
bugs that plague it. This has not happened, and so far things have been getting
very slowly worse instead.

Occasionally users come in looking to test it and often expect a fully working
platform but generally quickly lose interest when faced with various issues
and in the end nothing gets fixed.

For instance, it has not been possible to run a working GPU either platform
for several years, due to unfixed regressions in Mesa, requiring use of the
old Amber branch to get these working (which most people opt for and which
also ends up counter-productive for fixing things upstream).

Likewise, there has not been an up to date web browser, and things are looking
to regress further e.g. with WebKit having adopted Skia for rendering (WebKit
was the sole web engine left where rendering didn't have broken colors).

We don't have a dedicated maintainer for the platform and so far I (q66) have
been working on keeping things at least building but I don't have the resources
or motivation or real interest in keeping this going.

Our build infrastructure for this is also lacking, with both platforms being
built on a single virtual machine hosted at OSUOSL. The performance is for most
part acceptable but e.g. we're frequently running out of disk space as the
repos grow as the machine is barely capable of hosting two sets of repos.

I have some POWER9 hardware that could be set up as a build machine to fix
this but I'm not sure if this is worth running if I'm going to be the only
person giving this attention, so for now this is not going to happen.

## Timeframe

Therefore, in order to lighten my workload I plan to retire the repositories
and builders by July 2026.

In the meantime, if someone steps up and is willing to dedicate time and
resources to maintaining things well, actually using it, and fixing the
issues that make it unusable for most people, I am willing to retract this
decision and set up a better builder, but only if it actually seems like there
is a future for the platform in the distro.

If not, the repositories will be removed after the middle of the year, along
with packaging only relevant for these platforms (such as mesa-amber).
