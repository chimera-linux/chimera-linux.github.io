---
layout: page
title: Development
---

Chimera Linux is a free software project with its own infrastructure.
This page describes the various pieces of it.

## Getting involved

First you should read the [Community](/community) page, as it contains
important information, such as where to find our communication channels
and the conduct guidelines. Other links are available below.

We do not and will not ask you to sign any kind of CLA (Contributor License
Agreement).

If you are unsure whether your work is of sufficient quality, please submit
it anyway. There is a good chance you will be able to receive helpful feedback
as a part of the review process.

## Code hosting

Our code repositories are hosted on GitHub. The official organization
of the project is [here](https://github.com/chimera-linux).

Most development happens in the `cports` repository, which provides all
packaging data of the system. Its repository is located [here](https://github.com/chimera-linux/cports).

Other repository links:

* [Website](https://github.com/chimera-linux/chimera-linux.github.io)
* [Buildbot master](https://github.com/chimera-linux/buildbot-master)
* [Buildbot worker](https://github.com/chimera-linux/buildbot-worker)
* [APK browser](https://github.com/chimera-linux/apkbrowser)

On top of that, the project develops various standalone tools that can
be used elsewhere, which have their own repositories, such as:

* [Chimerautils](https://github.com/chimera-linux/chimerautils)
* [Dinit-chimera](https://github.com/chimera-linux/dinit-chimera)
* [Turnstile](https://github.com/chimera-linux/turnstile)
* [CKMS](https://github.com/chimera-linux/ckms)
* and so on.

## Package builds

We use [Buildbot](https://buildbot.net) as a central buildsystem that
picks up changes from `cports` and builds them for all official architectures.
The web interface is available [here](https://build.chimera-linux.org).

## Package database

The package database is searchable [here](https://pkgs.chimera-linux.org).

## Central repository

The repository is available [here](https://repo.chimera-linux.org). It has
all of our packages, as well as live images, tarballs and static binaries
of `apk` for all supported architectures.

## Update checking

The `cbuild` system is capable of automated update checking. Automated update
checks are yet to be set up.
