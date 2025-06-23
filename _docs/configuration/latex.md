---
layout: book
title: TeX/LaTeX
section: 4.15
---

Chimera Linux does not currently package the `texlive` suite.
Instead, you may use the [Tectonic](https://tectonic-typesetting.github.io)
typesetting system. To install it, make sure the
`user` repository is available and run:
```
# apk add tectonic
```

You may then invoke it as such:
```
$ tectonic document.tex
```

This will produce `document.pdf`. Tectonic will download all
necessary support files on demand, so there is no need to install
additional TeX packages.
