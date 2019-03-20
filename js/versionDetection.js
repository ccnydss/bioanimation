// Check for updates if electron
if (typeof require === "function") {
  const bioapp = require("electron").remote.app;
  console.log("bioapp ", bioapp);
  fetch("https://api.github.com/repos/ccnydss/bioanimation/releases/latest").then (
    function(raw) {
      return raw.json();
    }).then(
      function(res) {
        var currentNum = bioapp.getVersion();
        var latestNum = res.name;

        var userOS = getOS();
        var releaseLink;

        switch(userOS) {
          case "Mac OS":
          releaseLink = res.assets[0].browser_download_url;
          break;
          case "Linux":
          releaseLink = res.assets[1].browser_download_url;
          break;
          case "Windows":
          releaseLink = res.assets[2].browser_download_url;
          break;
        }

        var message = "Fully updated";

        console.log("current vers, latest vers: ", currentNum, latestNum);
        console.log("OS version and link", userOS, releaseLink);

        if (ltVersion(currentNum, latestNum)) {
          message = "<a href='" + releaseLink + "'>New version (v" + latestNum + ") available</a>";
          document.getElementById("updateNotifier").innerHTML = message;
        }

        document.getElementById("currentVersion").innerHTML = "| v" + currentNum + " | " + message;
      }
    )
  } else {
    fetch("https://api.github.com/repos/ccnydss/bioanimation/releases/latest").then(function(raw) {
      return raw.json();
    }).then(function(res) {
      var userOS = getOS();
      var releaseLink;

      switch(userOS) {
        case "Mac OS":
        releaseLink = res.assets[0].browser_download_url;
        break;
        case "Linux":
        releaseLink = res.assets[1].browser_download_url;
        break;
        case "Windows":
        releaseLink = res.assets[2].browser_download_url;
        break;
      }

      console.log("hmmmmm", releaseLink);

      document.getElementById("downloadLink").innerHTML = "<a href='" + releaseLink + "'>v" + latestNum + "</a>"
    })
  }
