---
layout: page
title: Archive
---

## News archive

{% for post in site.posts reversed %}
{% if post.index != false %}
* {{ post.date | date: "%d.%m.%Y" }} - [{{ post.title }}]({{ post.url }})
{% endif %}
{% endfor %}
