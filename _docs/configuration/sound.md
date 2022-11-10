---
layout: book
title: Sound
section: 4.4
---

The officially supported way to get sound on Chimera is through
the PipeWire project. Plain ALSA is not supported. PulseAudio
is also not supported (but PipeWire provides compatibility).

In longer term, other sound servers may become options, but
PipeWire will remain a well supported default.

## PipeWire

To install PipeWire:

```
# apk add pipewire
```

This will also automatically install WirePlumber, the default
session manager.

In order for PipeWire to function, you will need `XDG_RUNTIME_DIR`
to be handled. In a typical setup, this is done with `elogind`,
but other options are possible. See [Seat management](/docs/configuration/seat).

The primary supported way to get the daemon running is through
a user service. Simply enable WirePlumber as your user:

```
$ dinitctl enable wireplumber
```

Doing so also implicitly enables `pipewire` itself. Typically
you will also want PulseAudio compatibility:

```
$ dinitctl enable pipewire-pulse
```

You can check whether it's running:

```
$ dinitctl list
[[+]     ] boot
[{+}     ] system
[{+}     ] dbus (pid: 1040)
[{+}     ] pipewire-pulse (pid: 1046)
[{+}     ] pipewire (pid: 1044)
[{+}     ] wireplumber (pid: 1045)
```
