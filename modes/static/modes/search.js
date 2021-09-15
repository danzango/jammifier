const resultSelector = document.getElementById('result');
const loadingSelector = document.getElementById('loading');
const searchBoxSelector = document.getElementById('q');

function debounce(func, wait, immediate) {
  var timeout;

  return function executedFunction() {
    var context = this;
    var args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

var returnedFunction = debounce(function(val) {
    baseURL = window.location;
    res = document.getElementById("result");
    res.innerHTML = '';
    if (val == '') {
    return;
    }
    let list = '';
    fetch('/suggest/' + val).then(
    function (response) {
     return response.json();
    }).then(function (data) {
     for (i=0; i<data.length; i++) {
         if (data[i]["mode"] == 'minor') {
            list += `<li>` + `<a onclick="saveTrack('${data[i]["urn"]}')" href="${baseURL}is_minor/${data[i]["key"]}">` + '<b>' + data[i]["name"] + '</b>' + ' by ' + data[i]["artist"] + '</li>' + `</a>`
         } else {
            list += `<li>` + `<a onclick="saveTrack('${data[i]["urn"]}')" href="${baseURL}scales/${data[i]["key"]}">` + '<b>' + data[i]["name"] + '</b>' + ' by ' + data[i]["artist"] + '</li>' + `</a>`
         }
     }
     res.innerHTML = '<ul>' + list + '</ul>';
     loadingSelector.classList.add('display-none');
     resultSelector.classList.remove('display-none');
     return true;
    }).catch(function (err) {
     console.warn('Something went wrong.', err);
     return false;
    });
}, 225);

function saveTrack(urn) {
    var trackUrn = {'urn': urn};

    // Put the object into storage
    localStorage.setItem('trackUrn', JSON.stringify(trackUrn));
    console.log('TrackURN: ', trackUrn);
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector('.search-box').addEventListener('keyup', function(){
        resultSelector.classList.add('display-none');
        loadingSelector.classList.remove('display-none');
        if (searchBoxSelector.value.length === 0){
            loadingSelector.classList.add('display-none');
        };
    });
});