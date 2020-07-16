/*
Copyright 2020 Craig Mod

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


var fuse; // holds our search engine
var searchVisible = false; 
var firstRun = true; // allow us to delay loading json data unless search activated
var list = document.getElementById('searchResults'); // targets the <ul>
var first = list.firstChild; // first child of search list
var last = list.lastChild; // last child of search list
var maininput = document.getElementById('searchInput'); // input box for search
var resultsAvailable = false; // Did we get any search results?

// ==========================================
// The main keyboard event listener running the show
//
function closeSearchBox() {
  document.getElementById("fastSearch").style.visibility = "hidden"; // hide search box
  document.activeElement.blur(); // remove focus from search box 
  searchVisible = false; // search not visible
}

function openSearchBox() {
  document.getElementById("fastSearch").style.visibility = "visible"; // show search box
  document.getElementById("searchInput").focus(); // put focus in input box so you can just start typing
  searchVisible = true; // search visible
}

document.addEventListener('keydown', function(event) {

  // CMD-/ to show / hide Search
  if (event.metaKey && event.which === 191) {
      // Load json search index if first time invoking search
      // Means we don't load json unless searches are going to happen; keep user payload small unless needed
      if(firstRun) {
        loadSearch(); // loads our json data and builds fuse.js search index
        firstRun = false; // let's never do this again
      }

      // Toggle visibility of search box
      if (!searchVisible) {
        openSearchBox();
      }
      else {
        closeSearchBox();
      }
  }

  // Allow ESC (27) to close search box
  if (event.keyCode == 27) {
    if (searchVisible) {
      closeSearchBox();
    }
  }

  // DOWN (40) arrow
  if (event.keyCode == 40) {
    if (searchVisible && resultsAvailable) {
      event.preventDefault(); // stop window from scrolling
      if ( document.activeElement == maininput) { first.firstElementChild.focus(); } // if the currently focused element is the main input --> focus the first <li>
      else if ( document.activeElement.parentElement == last ) { last.firstElementChild.focus(); } // if we're at the bottom, stay there
      else { document.activeElement.parentElement.nextSibling.firstElementChild.focus(); } // otherwise select the next search result
    }
  }

  // UP (38) arrow
  if (event.keyCode == 38) {
    if (searchVisible && resultsAvailable) {
      event.preventDefault(); // stop window from scrolling
      if ( document.activeElement == maininput) { maininput.focus(); } // If we're in the input box, do nothing
      else if ( document.activeElement.parentElement == first) { maininput.focus(); } // If we're at the first item, go to input box
      else { document.activeElement.parentElement.previousSibling.firstElementChild.focus(); } // Otherwise, select the search result above the current active one
    }
  }
});

// ==========================================
// close when focus is lost
//
document.addEventListener('click', function(e) {
  if (!document.getElementById("fastSearch").contains(e.target) && searchVisible) {
    closeSearchBox()
  }
});

// ==========================================
// execute search as each character is typed
//
document.getElementById("searchInput").onkeyup = function(e) { 
  executeSearch(this.value);
}


// ==========================================
// fetch some json without jquery
//
function fetchJSONFile(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(httpRequest.responseText);
          if (callback) callback(data);
      }
    }
  };
  httpRequest.open('GET', path);
  httpRequest.send(); 
}


// ==========================================
// load our search index, only executed once
// on first call of search box (CMD-/)
//
function loadSearch() { 
  fetchJSONFile('/index.json', function(data){

    var options = { // fuse.js options; check fuse.js website for details
      shouldSort: true,
      location: 0,
      distance: 100,
      threshold: 0.4,
      minMatchCharLength: 2,
      keys: [
        'title',
        'permalink',
        'summary'
        ]
    };
    fuse = new Fuse(data, options); // build the index from the json file
  });
}


// ==========================================
// using the index we loaded on CMD-/, run 
// a search query (for "term") every time a letter is typed
// in the search box
//
function executeSearch(term) {
  let results = fuse.search(term); // the actual query being run using fuse.js
  let searchitems = ''; // our results bucket

  if (results.length === 0) { // no results based on what was typed into the input box
    resultsAvailable = false;
    searchitems = '';
  } else { // build our html 
    for (let item in results.slice(0,5)) { // only show first 5 results
      result = results[item];
      if ('item' in result) {
        searchitems = searchitems + 
          '<li><a href="' + result.item.permalink + '" tabindex="0">' + 
          '<span class="title">' + result.item.title + '</span>' + 
          '<span class="text">' + result.item.permalink + '</span>' + 
          '</a></li>';
      }
    }
    resultsAvailable = true;
  }

  document.getElementById("searchResults").innerHTML = searchitems;
  if (results.length > 0) {
    first = list.firstChild; // first result container — used for checking against keyboard up/down location
    last = list.lastChild; // last result container — used for checking against keyboard up/down location
  }
}
