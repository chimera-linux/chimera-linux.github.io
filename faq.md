## Chimera Linux FAQ

This page should answer some of the common questions.

### Not GNU/Linux?

Nope.

### When will there be binary packages and stable versioning?

The plan is currently to wait for `apk-tools` 3.x to go stable. Since
the new version is bringing a completely new package format, we will use
this opportunity to avoid having to transition the potential repos, and
publish things after we have transitioned the build system.

### Why FreeBSD and not Net/Open/...BSD?

The FreeBSD tools are generally more featureful and I don't see much
of a benefit in the others. Additionally, I am a long-time FreeBSD user
and familiar with them.

Lastly, there is the `bsdutils` project which we rely on, so it was not
actually necessary to do the entire porting from scratch.

### Why not GNU?

A goal of the project is to provide alternatives to common tools. The
FreeBSD components are a better fit for the system, since they are lighter
weight, smaller and less crufty. Licensing also plays a minor role.

There are some GNU components in `main`, but for most part they are avoided
when there is a viable BSD alternative.

### Why not use ports or pkgsrc?

I consider these pretty much the worst thing about the BSD systems from
technical standpoint. They are slow, painful to maintain alongside binary
packages, and contain decades of technical debt.

Since this is a new project created from scratch, the goal is to be
legacy-free where it makes sense, and none of the existing systems did
exactly what I wanted.

### Why Python for cbuild?

Python is more or less omnipresent and over time has become the standard
scripting language on Linux. Also, its implementation is robust, portable
and allows us to write the entire build system without utilizing anything
outside the standard library. The syntax is also nice and flexible enough
so that it can be reused for the templates themselves, which reduces work.

### What init system does Chimera use?

It uses [dinit](https://github.com/davmac314/dinit) as it provides a neat,
complete package with a good feature set.

### Why not s6?

While s6 is a good project, it's more of a framework than something that
is ready to use - setting it up is needlessly complicated.

### Why not BSD init?

It's an explicit goal of the distro to abandon legacy cruft where it
makes sense, and BSD-style init is lacking in various aspects, such
as missing process supervision and parallelism.

### Any plans to make use of LLVM's hardening features (e.g. CFI)?

Yes.

### Why apk-tools?

There is no special reason - the original plan was to use FreeBSD's `pkg`,
but that ended up not happening as it's simply not ready for this type
of use on Linux and would need a ton of work, and common Linux package
managers are typically lacking in various ways, and `apk-tools` just
happened to be the thing that was easiest to integrate and matched the
intended featureset well.

### Why musl?

It's currently the most complete/usable alternative Linux `libc`.

### Is Chimera a suckless/minimal distribution?

Chimera does aim to suck less, but not in the way "suckless" usually
means. Being lightweight is important, but being "minimal" is a rather
vague term and typically leads to pointless dogmatism. Chimera aims
to be practical and easy to grok, recognizing the danger of complexity,
but not avoiding useful things for the sake of that.

### What is Chimera's relation to Void Linux?

The `cbuild` system started as a rewrite of `xbps-src`, but has since
diverged a lot. Additionally, I am also a Void Linux developer, so it has
influenced the distro in some ways. However, it is also an explicit goal
not to repeat Void's mistakes.

### What is your relation to ChimeraOS?

There is none. ChimeraOS renamed from GamerOS about a month after public
development was started. This is simply an unfortunate coincidence.

### Something is missing here.

Feel free to ask in the IRC or Matrix channels, and it may get added here.
