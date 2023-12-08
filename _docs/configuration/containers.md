---
layout: book
title: Containers
section: 4.13
---

There are several ways one can manage containers on Chimera.

High level ones include:

* containerd
* podman

Of course, lower-level approaches are also available:

* bubblewrap
* chroot
* unshare/nsenter/etc

## containerd

Containerd is an OCI-compliant container runtime. It can be paired with
a Docker-compatible frontend called `nerdctl`.

To get it running, you have to install it:

```
# apk add nerdctl
```

Then enable the service:

```
# dinitctl enable containerd
```

This will let you use it as the superuser, e.g. like this:

```
# nerdctl run -it alpine:latest
```

To use it rootless, install the support package:

```
# apk add containerd-rootless
```

Ensure your `/etc/subuid` and `/etc/subgid` is correctly set up for your
user. Usually this is done automatically. The files should contain entries
like

```
youruser:100000:65536
```

Enable the user service:

```
$ dinitctl enable containerd
```

Then you can use it as your user too.

## podman

To use podman, install it:

```
# apk add podman
```

And enable the service:

```
# dinitctl enable podman
```

You can use it as both root and your user, provided `subuid`/`subgid` is
set up correctly. It comes with a native frontend.

### Docker frontend

The socket the backend exposes is compatible with Docker. For privileged
use, you can use the Docker CLI with podman. Install it:

```
# apk add docker-cli
```

Enable the compatibility service:

```
# dinitctl enable podman-docker
```

It should work then, as root:

```
# docker images
```

## Using Chimera as a container

Conversely, Chimera is also available as a container using the same
above solutions, on any distro supporting them.

Visit [DockerHub](https://hub.docker.com/r/chimeralinux/chimera)
for further details.

You could do something like the following:

```
$ podman run -it chimeralinux/chimera:latest
```

Or from a Dockerfile:

```
FROM chimeralinux/chimera:latest
...
```
