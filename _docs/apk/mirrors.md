---
layout: book
title: Mirrors
section: 3.2
---

The system comes preconfigured with a repository. If this repository
is too slow for you, you might want to switch to a different mirror.

Currently, there is no finalized way to cleanly switch to a different
mirror. This will change in the future when `apk` gains a way to
expand variables in the `repositories` file.

For the time being, you can modify the files in `/etc/apk/repositories.d`.
A recommended approach is to remove all the `repo` packages other than
`chimera-repo-main` (which is mandatory as it contains the signing keys)
and putting your desired repositories in `/etc/apk/repositories.d/00-repo-main.list`.

The repositories take the the form `URL/current/CATEGORY` where `URL`
is the mirror base URL, and `category` is one of `main`, `main/debug`,
`user`, `user/debug`.

The following mirrors are available:

* https://repo.chimera-linux.org (default repository, Czechia)
* https://chimera.sakamoto.pl (Poland)
* https://au.mirror.7bit.org/chimera (Australia)
