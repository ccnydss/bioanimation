// https://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
// https://github.com/processing/p5.js/blob/master/developer_docs/supported_browsers.md
browserVersion= (function(){
    var ua= navigator.userAgent, tem,
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'Internet Explorer '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M;
})();

if(browserVersion.indexOf(',') >= 0)
browserVersion = browserVersion.split(',');
if(browserVersion.indexOf(' ') >= 0)
browserVersion = browserVersion.split(' ');
if(browserVersion.indexOf('IE') >= 0) {
browserVersion[0] = 'Internet';
browserVersion[1] = 'Explorer';

}

document.getElementById('browserDetectionText').innerHTML =
'<i class="fas fa-exclamation-circle"></i>'+browserVersion[0]+' '+browserVersion[1]

var browser = document.getElementsByClassName('fab');
for (let i = 0;i<browser.length;i++) {
  if (browser[i].innerHTML.indexOf(browserVersion[0]) >= 0) {
    browser[i].parentElement.parentElement.id = 'curBrowser'
    browser[i].parentElement.parentElement.getElementsByTagName('a')[0].style.color = 'white'
  }
}
