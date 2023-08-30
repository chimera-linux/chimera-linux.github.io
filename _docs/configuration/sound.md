---
layout: book
title: Sound
section: 4.5
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

The primary supported way to get the daemon running is through
a user service. The user services are enabled by default
unless masked in `apk`.

You can either restart your user session or start them manually:

```
$ dinitctl start wireplumber
```

Typically you will also want PulseAudio compatibility:

```
$ dinitctl start pipewire-pulse
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

If you wish to mask the default links (and therefore prevent
the services from coming up without being explicitly enabled),
you can do something like:

```
# apk add '!pipewire-dinit-links' '!wireplumber-dinit-links'
```
