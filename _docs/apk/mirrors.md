---
layout: book
title: Mirrors
section: 3.2
---

The system comes preconfigured with a repository. If this repository
is too slow for you, you might want to switch to a different mirror.

To switch your system repositories to a different mirror, create the
directory `/etc/apk/repositories.d` if it does not exist yet and then
a file with the name format `00-your-custom-name.list`. The `00-` prefix
is important, as is the `.list` extension; inbetween can be anything
you want.

Put the following in the file:

```
set CHIMERA_REPO_URL=https://repo.chimera-linux.org
```

Replace the actual URL with the base URL of the mirror you want.

It is not recommended to directly specify repositories or mess with the
`chimera-repo-` packages. You should leave these alone (only install the
ones for the repos you want, `main` is always mandatory) and set the
URL via the custom file above.

The following mirrors are available:

* [https://repo.chimera-linux.org](https://repo.chimera-linux.org) (hosted by the project, Prague, Czech Republic)
* [https://chimera.sakamoto.pl](https://chimera.sakamoto.pl) (hosted by sdomi, Warsaw, Poland)
* [https://au.mirror.7bit.org/chimera](https://au.mirror.7bit.org/chimera) (hosted by wezm, Australia)
* [https://mirror.accum.se/mirror/chimera-linux.org](https://mirror.accum.se/mirror/chimera-linux.org) (hosted by ACC, Umeå, Sweden)
* [https://chimera.netig.net](https://chimera.netig.net) (hosted by netig, Stockholm, Sweden)

This information is also available in a pure text form [here](https://repo.chimera-linux.org/mirrors.txt).

Third party mirrors may follow their own schedule when it comes to syncing
and are not guaranteed to always be up to date. It is recommended that all
mirrors sync on at least hourly basis.

To set up a new mirror, `rsync://repo.chimera-linux.org/chimera` may be used.
If you set up a new mirror, please let us know.
