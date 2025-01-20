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

* [https://repo.chimera-linux.org](https://repo.chimera-linux.org) (hosted by the project, Czechia)
* [https://chimera.sakamoto.pl](https://chimera.sakamoto.pl) (hosted by sdomi, Poland)
* [https://au.mirror.7bit.org/chimera](https://au.mirror.7bit.org/chimera) (hosted by wezm, Australia)
* [https://chimera.netig.net](https://chimera.netig.net) (hosted by netig, Sweden)

Third party mirrors may follow their own schedule when it comes to syncing
and are not guaranteed to always be up to date. It is recommended that all
mirrors sync on at least hourly basis.

To set up a new mirror, `rsync://repo.chimera-linux.org/chimera` may be used.
If you set up a new mirror, please let us know.
