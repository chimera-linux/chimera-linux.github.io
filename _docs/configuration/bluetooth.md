---
layout: book
title: Bluetooth
section: 4.06
---

The BlueZ project provides the infrastructure, similarly to
other distributions.

To install it (if it isn't already):

```
# apk add bluez
```

Enable the daemon:

```
# dinitctl enable bluetoothd
```

For Bluetooth audio devices, PipeWire support is provided by
the `pipewire-bluetooth` package. This package will automatically
install if you have both `bluez` and `pipewire`. The sound server
needs to be restarted after this package is installed, so that
the plugin can be registered.

If your graphical session has Bluetooth integration (e.g. GNOME
with its panel widget), it likewise needs to be restarted.

Therefore, it is recommended that you log out and back in to
get all user processes reloaded. If you have your session set up
to linger user services (which is not the default), restart the
user services manually before logging out, or simply reboot.
