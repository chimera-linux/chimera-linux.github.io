---
layout: book
title: FAQ
section: 99
---

## Is Chimera a fork?

No, it's an independent project not directly derived from anything else.

## What is the distro's relation to Void Linux?

If Chimera build templates and process seem suspciously similar to Void
Linux's `xbps-src`, `cbuild` originally started as a rewrite of `xbps-src`
to attempt to eliminate its various issues, and the main developer/founder
of Chimera also worked on Void Linux. However, no actual code is shared
with `xbps-src`.

## Is Chimera an Alpine derivative?

Besides using the same user-side package manager (`apk-tools`), Chimera is
unrelated to Alpine. The version of `apk-tools` it uses is also different,
and the source packaging system as well as all actual packaging are written
from scratch.

## What about ChimeraOS?

The system also has no relation to ChimeraOS, besides the unfortunate name
similarity. ChimeraOS used to be called GamerOS and renamed itself to
ChimeraOS later; however, at this point Chimera Linux was already in
public development with its name in place.

## Why Python for the source packaging?

Python was chosen as it's more or less the standard scripting language on
Unix-like systems nowadays and is robust and portable. The `cbuild` system
does not rely on any modules outside of Python's standard library. The
Python syntax is also flexible and adjustable enough to make for a nice
syntax for templates without having to invent yet another DSL that would
introduce its own bugs and need its own parsing.

## What is the project's take on systemd?

The short answer is "it depends".

The long answer is that as an init system and service manager, it has been
a net functional improvement for Linux, as while it might not have come up
with anything particularly new, it did bring various things such as service
supervision by default and user services to Linux in one package that distros
could adopt. Until systemd, there wasn't anything else that would really do
the trick (djbware and stuff derived from djbware does not count, as it's
lacking too much stuff that even various hacked together rc implementations
on top of sysvinit added eventually). Other solutions such as dinit/s6 did
not exist at the time. Most distros were using various shell-script-based
rc systems, which did not supervise their services, which both added extra
complexity to the daemons (because they need to be able to daemonize themselves,
typically with the double-fork and `setsid` approach) and made the system less
resilient (because it is impossible to robustly track daemonized processes,
so the service manager could not e.g. properly restart them, and in case of
a daemon crash, they were prone to scenarios such as another process taking
over the original daemon's PID, with the service manager still "tracking"
the old PID via pidfile). Additionally, the shell infrastructure around init
scripts can hardly be called simple.

However, as a whole, the implementation of systemd is rather messy, and now
comes with a lot of unrelated components which are nevertheless all tied
together with the same libraries and build system and impossible to isolate.
Those unrelated components tend to be a hit and miss, with some of them
being potentially interesting, and others outright poorly thought out.

Additionally, systemd is written to deliberately (ab)use every single
non-portable extension under the sun, making it poorly portable not only
to non-Linux systems, but also to various Linux distributions, unless said
distribution is based on the mainstream software stack. That would make it
a hard sell for Chimera. This is deliberate and as far as one can tell, will
not change upstream. And since upstream does not want us to use it, there is
no reason for us to use it, considering the amount of patches and work that
would have to be kept and maintained downstream.

That's why one of the goals in Chimera is to implement the actual useful
systemd functionality, but independently and in our own way, without the
shortcomings.

Another side of the coin is the so-called "systemd-free community", which
tends to spread a lot of misconceptions and frankly deranged opinions that
end up hurting any sort of positive effort. Chimera as a project denounces
such people, and is explicitly **not** a part of this community. Such people
should also not view Chimera as some sort of haven, because it is not. The
project is explicitly anti-elitist and aims to find constructive solutions.

## What's the deal with elogind (and systemd-logind)?

To properly explain elogind, logind (a systemd component) needs explaining
first. There are two main things logind does (alongside some not completely
related stuff that will not be covered here).

The first thing is session/login tracking. That means logind is aware of
which virtual terminals and so on have active sessions, and it can group
those sessions under logins that represent a single user. This information
can then be exposed to other software, and upstream logind also uses this
to spawn special user instances of systemd, which are then used to handle
user services. The user service instances can be properly supervised under
the logged in user and terminated/restarted as users log in and out. This
would not be possible without a session tracker. Desktop environments also
access various information about the session. Another thing a session tracker
can also be used for is proper handling of the D-Bus session bus. The session
bus in D-Bus is identified by a Unix domain socket, and when you are logged
in, you need to know where said socket is located from the login, otherwise
you will not have access to services on the session bus in that terminal.
The socket is identified by an environment variable (`DBUS_SESSION_BUS_ADDRESS`).
When you have a session tracker, you can have the session bus started on the
first login, and then the PAM module associated with logind can export the
socket path to the login environment. That means now every session associated
with a login can share the session bus. This was traditionally not possible,
as the session bus was started by your desktop session scripts, e.g. by
wrapping your window manager process with `dbus-launch` and the likes, so
you only had some abstract temporary socket that was only available within
your desktop instance and you could not access it from other virtual terminals.

The second thing is seat management. Seat management is not only useful for
multi-seat type setups, as in fact most setups are not multi-seat. It can
also be used (and that is typically its primary purpose) to provide secure
access to devices. This enables things such as Wayland compositors and even
X11 to run unprivileged. You could argue that all you have to do is assign
the devices to a group and then your user to the group, and that would allow
you to run your compositor or Xorg unprivileged. While this is true, this
approach has various shortcomings. In particular, it means giving every
process that runs as your user access to the devices. This is wrong, because
only the compositor/X11 process should have access to the devices. With a
seat daemon, the only thing that has access is the seat daemon itself, and
then it can choose which other processes to hand the device file descriptors.
That means the compositor can request access to the device, and once that
has happened (i.e. you have a running compositor instance) nothing else can
request access anymore. That means only the compositor can then manipulate it.
The seat management daemon can then also properly deal with scenarios such
as VT switching and so on.

The logind daemon conflates these two things somewhat, mainly because they
share some code paths. Logins/sessions are a part of a seat, and you can
have multiple seats, each with its own devices, consoles and logins.

As for elogind, it's pretty much a stripped down version of logind from
systemd, made standalone. That means it still tracks logins and seats,
and it manages the runtime directory for the user (but not in Chimera,
about that in a bit) but it cannot manage user services (because it does
not know about any service manager) nor the session bus or anything else.

That makes it a fine shim for compatibility in environments that use
traditional service managers (as they do not have any user services and
so on) but as a whole elogind is also just a huge compatibility hack,
with lots of now technically dead code and stubs everywhere. That means
it is nothing but a stopgap measure.

In Chimera, which implements systemd-like functionality wrt user services
and so on, elogind is already starting to be not good enough. That is why
the project is developing Turnstile, which is a new session tracker that
aims to implement a fresh, vendor-independent API that software upstreams
can rely on. This can then interact with either logind (on systemd distros)
or our own homegrown session tracking daemon. Eventually, this will completely
take over elogind's functionality. This new session tracker does not aim
to implement seat management, as a solution already exists for that (seatd
and its associated library libseat) and ideally should be used in tandem,
nor auxiliary functionality such as power management which can be handled
in a separate project.

However, for now we still rely on elogind, as the custom solution is not
yet complete and there isn't anything else to provide the functionality.
The alternative would be to e.g. run X11 under root, which is not going to
happen, and our primary desktop environment would not function.

In short, the overall take is that logind implements important functionality,
but is not an ideal solution, and elogind itself is even worse because of
its hacky, stubbed out nature. For now it does the job though.

For additional context, read the FAQ item about systemd.

## So, why use a BSD-based userland anyway?

While coreutils may seem lightweight enough to not cause any issues already,
there are some specific reasons the system uses a BSD-derived userland.
The primary one is probably that the code of the BSD versions is overall
much cleaner and easier to read. There are no cursed components such as
gnulib, the codebase is leaner, and more aligned with the project's goals.

Other reasons include helping the goal of improving software portability,
as using a different userland tends to expose a lot of assumptions in
various codebases, as well as improving bootstrappability and additional
convenience; the core userland tools are not just coreutils, but also a
lot of tools around that (findutils, grep, sed, and so on) and some of
those actually already introduce undesired dependencies into the bootstrap
path. In Chimera, all those tools are neatly wrapped in a single package
that depends on very little, while providing pretty much all functionality
one needs to get things done. This means we are not only replacing the GNU
utilities, but we also have a replacement for things such as Busybox at the
same time, re-using the same environment to power our initramfs and other
components.

Relatedly, it also helps cbuild/cports a lot. The way cbuild works, you are
building everything in a little container that dependencies are installed
into. Our BSD-ported utilities also replace some core portions of `util-linux`,
which need to be present in the build containers. The `util-linux` package
normally depends on things such as PAM and udev. That means if we were to
use GNU utilities, we'd need a separate, stripped-down build of `util-linux`
just for the containers, because everything that's in the build container as
well as every dependency of it is a part of the bootstrap process. That would
mean either having to make this stripped-down version coexist with the full
version installed in target systems, or make them conflict. For example Void
Linux does the latter, and it creates trouble for instance whenever something
wants to run a test suite and the test suite has a dependency on some missing
`util-linux` tool. In Chimera, there is no need for `util-linux` anywhere in
the base container or its bootstrap path, and such templates can simply add
`util-linux` to their `checkdepends`.

Some people may also say that the BSD licensing is its own benefit. We do
not say that, because as far as core userland goes, the licensing is more
or less meaningless for us and we could easily live with the GPL. Therefore,
this is largely a technical decision for us. While the benefits may seem
small to some, they are there, and they matter to the project.

However, using an alternative userland is not and never was the project's
primary selling point. The userland tools are a means to an end, and the
end is creating a well-rounded, general-purpose, practical operating system
that addresses various real issues that Linux distributions tend to have.
The tools simply exist to help us get there eventually.

## Speaking of which, why not busybox or toybox?

Because Busybox is functionally more limited than what we have, while also
not providing any other real benefit. A lot of parts of its codebase are
also rather sketchy, and it can be configured in a countless ways with
different sets of tools, because in the end it's a single multi-call
executable.

When your goal is a tiny embedded system, using such thing may seem like
a good idea. This is not the case in Chimera, so there is no point.

As far as Toybox goes, it's pretty much the same story, except it's even
more limited, with a lot of the tools being extremely bare. The code seems
to be somewhat higher quality than Busybox's, but the other aspects make it
even less of a good fit.

## Why choose GNOME as the default desktop?

There are two major desktops that provide a properly functional Wayland
implementation, and that is GNOME and KDE. Compared to KDE, GNOME is much
smaller and simpler to build (and less time/resource-consuming), and its
Wayland support feels more stable. Additionally, it has consistent and
well-defined UX. GNOME is also more portable than KDE, primarily due to
relying on WebKit rather than a Chromium derivative as its web browser
engine of choice. The founder of Chimera also uses GNOME as their daily
driver.

Other desktops usually do not meet the Wayland requirement, and tend to
have UI/UX that is way more all over the place. Simpler WMs and compositors
also tend to be much more of a "do it yourself" thing, and tend to target
niches that only suit a relatively small number of people (e.g. tiling).
The default desktop in Chimera should be comprehensive and unassuming.

Of course, users are free to choose any desktop they desire. If one is
not available in the package collection, patches are welcome.
