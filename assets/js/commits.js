(function() {
    "use strict";

    var list = document.getElementById("cports_list");
    var more = document.getElementById("cports_more");
    if (!list) return;

    fetch("https://api.github.com/repos/chimera-linux/cports/commits?per_page=10")
        .then(function(response) { return response.json(); })
        .then(function(data) {
            var html = "";
            var i, commit, msg, url, date, ago, diff;

            for (i = 0; i < data.length; i++) {
                commit = data[i];
                msg = commit.commit.message.split("\n")[0];
                url = commit.html_url;

                date = new Date(commit.commit.committer.date);
                diff = Math.floor((new Date() - date) / 1000);

                if (diff < 60) ago = "just now";
                else if (diff < 3600) ago = Math.floor(diff / 60) + "m ago";
                else if (diff < 86400) ago = Math.floor(diff / 3600) + "h ago";
                else ago = Math.floor(diff / 86400) + "d ago";

                if (msg.length > 50) msg = msg.slice(0, 49) + "…";

                html += '<li>' +
                        '<a href="' + url + '" title="' + commit.commit.message + '">' +
                        '<span class="commit_msg">' + msg + '</span>' +
                        '<span class="commit_date">' + ago + '</span>' +
                        '</a></li>';
            }
            list.innerHTML = html;
            if (more) more.style.display = "block";
        });
})();
