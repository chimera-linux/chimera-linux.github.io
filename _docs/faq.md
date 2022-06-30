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
