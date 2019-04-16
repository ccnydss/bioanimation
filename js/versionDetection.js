// Check for updates if electron
if (typeof require === "function") {
  const bioapp = require("electron").remote.app;

  document.getElementById('thirdLine').parentNode.removeChild(document.getElementById('thirdLine'));
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
          message = "<a href='" + releaseLink + "'>New version (v" + latestNum + ")</a>";
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

      var user_platfrom;

      switch(userOS) {
        case "Mac OS":;
        document.getElementById('mac-tag').style.color = '#f39c12';
        break;
        case "Linux":
        document.getElementById('linux-tag').style.color = '#f39c12';
        break;
        case "Windows":
        document.getElementById('windows-tag').style.color = '#f39c12';
        break;
      }

      var releaseLink_mac = res.assets[0].browser_download_url;
      var releaseLink_linux = res.assets[1].browser_download_url;
      var releaseLink_win = res.assets[2].browser_download_url;

      var latestNum = res.name

      document.getElementById("downloadLink-win").innerHTML = "<a href='" + releaseLink_win + "'>v" + latestNum + "<i class='fas fa-download'></i></a>"
      document.getElementById("downloadLink-mac").innerHTML = "<a href='" + releaseLink_mac + "'>v" + latestNum + "<i class='fas fa-download'></i></a>"
      document.getElementById("downloadLink-linux").innerHTML = "<a href='" + releaseLink_linux + "'>v" + latestNum + "<i class='fas fa-download'></i></a>"


      //Date
      var d = new Date(res.published_at);
      var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

      var day = days[d.getDay()];
      var hr = d.getHours();
      var min = d.getMinutes();
      if (min < 10) {
          min = "0" + min;
      }
      var ampm = "am";
      if( hr > 12 ) {
          hr -= 12;
          ampm = "pm";
      }
      var date = d.getDate();
      var month = months[d.getMonth()];
      var year = d.getFullYear();
      document.getElementById("publishDate").innerHTML = month + " " + date + ", " + year;

    })
  }
