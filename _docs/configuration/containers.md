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

You can use it as both root and your user, provided `subuid`/`subgid` is
set up correctly. It comes with a native frontend.

### Services

There is a `podman` service in two variants (system and user). Neither is
needed to use `podman` on its own as `podman` is daemonless, but they
expose the socket for use by other applications, e.g. `podman-tui`.

Therefore, the system service is for privileged `podman`, while the user
service is for rootless `podman`.

To enable the system service:

```
# dinitctl enable podman
```

To enable the user service:

```
$ dinitctl enable podman
```

### Docker frontend

The socket that `podman` creates is compatible with the Docker client.
However, it by default resides in a different path than `docker` expects.

For both privileged and unprivileged/rootless operation, you can get around
it by using the `DOCKER_HOST` environment variable like so:

```
$ DOCKER_HOST=unix://$XDG_RUNTIME_DIR/podman/podman.sock docker images
# DOCKER_HOST=unix:///run/podman/podman.sock docker images
```

For privileged operation we also provide a convenience `podman-docker` service
that lets you run `docker` as root without exporting any additional variable.
The service works by creating a symlink to the socket where `docker` normally
expects it.

You can enable it as such:

```
# dinitctl enable podman-docker
```

This also implicitly enables `podman` through a service dependency.

Note that no such service exists for unprivileged `docker`, as `docker` by
default always tries to open `/var/run/docker.sock` no matter what user it
is invoked as.

If you wish to have `docker` working as user without exporting anything, it
is suggested that you add `DOCKER_HOST` with the right value in your shell
environment or similar.

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
