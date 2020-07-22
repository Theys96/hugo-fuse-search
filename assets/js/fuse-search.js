/*
 * Part of the hugo-fuse-search project
 * https://github.com/theys96/hugo-fuse-search/
 * License: https://github.com/Theys96/hugo-fuse-search/blob/master/LICENSE
 * 
 * Note: contains parts of code still remaining from the original code this
 * program is based on. Author: Craig Mod.
 * https://gist.github.com/cmod/5410eae147e4318164258742dd053993
*/

// ==========================================
// BASICS
//

function setupSearch() { return globalThis.fusesearch = new FuseSearch(); }
function setupTopSearchbar() {
    if ('fusesearch' in globalThis) {
        return new TopSearchbar(globalThis.fusesearch);
    }
    return {};
}
function setupFullscreenSearchbar() {
    if ('fusesearch' in globalThis) {
        return new FullscreenSearchbar(globalThis.fusesearch);
    }
    return {};
}
function setupInlineSearchbar() {
    if ('fusesearch' in globalThis) {
        return new InlineSearchbar(globalThis.fusesearch);
    }
    return {};
}
function setupKeyboardHandler(searchComponent) {
    return new FuseSearchKeyboardHandler(searchComponent);
}


// ==========================================
// CLASSES
//


/* Core search class containing logic for the search engine */
class FuseSearch {
    isInit     = false;
    index      = "/index.json";
    fuse       = false;
    fuseConfig = { 
        shouldSort: true,
        location: 0,
        distance: 100,
        threshold: 0.4,
        minMatchCharLength: 2,
        keys: ['title', 'permalink', 'contents']
    };

    constructor() {
        console.log("hugo-fuse-search: fuse-search created.");
    }

    // Init search if it wasn't already.
    // Initialization is only executed once a user
    // starts searching.
    init() {
        if (!this.isInit) {
            this.loadSearch();
            this.isInit = true;
            console.log("hugo-fuse-search: fuse-search initiated.");
        }
    }

    // Loads the JSON site index and creates the Fuse.io engine object for search
    loadSearch() {
        let fs = this;
        fetchJSONFile(fs.index, function(data) {
            data = data.filter(function(page) {
                return page.lang == document.documentElement.lang;
            })
            fs.fuse = new Fuse(data, fs.fuseConfig);
            console.log("hugo-fuse-search: Fuse.js was succesfuly instatiated.");
        }, function(status, statusText) {
            console.log("hugo-fuse-search: retrieval of index file was unsuccesful (\"" + fs.index + "\": " + status + " - " + statusText + ")")
        });
    }

    toString() { return "FuseSearch"; }
}


/* Gives one search component keyboard functionality
 */
class FuseSearchKeyboardHandler {

    constructor(component) {
        this.searchComponent = component;
        if (this.validateComponent() == false) {
            console.log("hugo-fuse-search: KeyboardHandler not initialized correctly: Invalid search component " + this.searchComponent.toString() + ".");
            console.log(component);
            return;
        } else {
            // Listen for keyboard commands
            document.addEventListener('keydown', (e) => this.keyboardHandler(e, this.searchComponent));

            console.log("hugo-fuse-search: KeyboardHandler initiated with search component " + this.searchComponent.toString() + ".");
        }
    }

    // This component is controlled with the keyboard:
    keyboardHandler(e, component) {
        if (event.metaKey && event.which === 191) { // Cmd + /
            component.initSearch();
        } else {
            switch(e.keyCode) {
                case 27: // ESC
                    component.closeSearch();
                    break;

                case 40: // DOWN
                    component.navigateDown(e);
                    break;

                case 38: // UP
                    component.navigateUp(e);
                    break;
            }
        }
    }

    // Quick live check on the compatibility of the search component
    // with this keyboard handler
    // It must have the 5 controlled functions:
    //  - initSearch, openSearch, closeSearch, navigateUp, navigateDown
    validateComponent() {
        let requiredFunctions = ['initSearch', 'openSearch', 'closeSearch', 'navigateUp', 'navigateDown'];
        for (var f in requiredFunctions) {
            if (typeof(this.searchComponent[requiredFunctions[f]]) != "function") {
            return false; }
        }
        return true;
    }

    toString() { return "FuseSearchKeyboardHandler"; }
}


/* Base code for multiple searchbar implementations
 */
class AbstractSearchbar {
    constructor() {
        this.closable = true;
    }

    init() {
        this.top_result       = this.element_results.firstChild;
        this.bottom_result    = this.element_results.lastChild;
        this.visible          = false;
        this.resultsAvailable = false;

        // Renew search whenever the user types
        this.element_input.addEventListener('keyup', (e) => { this.executeSearch(this.element_input.value); });

        // Close the searchbar when the user clicks outside it
        document.addEventListener('click', (e) => {
            if (!e.target.classList.contains("fuse-search-element") && !this.element_main.contains(e.target) && this.visible) {
                this.closeSearch()
            }
        });

        console.log("hugo-fuse-search: " + this.toString() + " initiated.");
    }

    // Open the search component, check if fuse-search is
    // already initiated, do so if necessary
    initSearch() {
        this.search.init();

        if (this.visible) {
            this.closeSearch();
        } else {
            this.openSearch();
        }
    }

    // Make the component visible
    openSearch() {
        this.element_main.style.visibility = "visible"; // show search box
        this.element_input.focus();                     // put focus in input box so you can just start typing
        this.visible = true;                            // search visible
    }

    // Make the component invisible
    closeSearch() {
        if (this.closable) {
            this.element_main.style.visibility = "hidden";  // hide search box
            document.activeElement.blur();                  // remove focus from search box 
            this.visible = false;                           // search not visible
        }
    }

    // Move the focus down between results and the searchbar
    navigateDown(event) {
        if (this.visible && this.resultsAvailable) {
            event.preventDefault(); // stop window from scrolling
            if ( document.activeElement == this.element_input) { this.top_result.firstElementChild.focus(); } // if the currently focused element is the main input --> focus the first <li>
            else if ( document.activeElement.parentElement == this.bottom_result ) { this.bottom_result.firstElementChild.focus(); } // if we're at the bottom, stay there
            else { document.activeElement.parentElement.nextSibling.firstElementChild.focus(); } // otherwise select the next search result
        }
    }

    // Move the focus up between results and the searchbar
    navigateUp(event) {
        if (this.visible && this.resultsAvailable) {
            event.preventDefault(); // stop window from scrolling
            if ( document.activeElement == this.element_input) { this.element_input.focus(); } // If we're in the input box, do nothing
            else if ( document.activeElement.parentElement == this.top_result) { this.element_input.focus(); } // If we're at the first item, go to input box
            else { document.activeElement.parentElement.previousSibling.firstElementChild.focus(); } // Otherwise, select the search result above the current active one
        }
    }

    // Run the search (which happens whenever the user types)
    executeSearch(term) {
        var results;
        try {
            results = this.search.fuse.search(term);  // the actual query being run using fuse.js
        } catch (err) {
            if (err instanceof TypeError) {
                console.log("hugo-fuse-search: search failed because Fuse.js was not instantiated properly.")
            } else {
                console.log("hugo-fuse-search: search failed: " + err)
            }
            return;
        }
        let searchitems = '';

        if (results.length === 0) {  // no results based on what was typed into the input box
            this.resultsAvailable = false;
            searchitems = '';
        } else {  // we got results, show 5
            for (let item in results.slice(0,5)) {
                let result = results[item];
                if ('item' in result) {
                    let item = result.item;
                    searchitems += this.itemHtml(item);
                }
            }
            this.resultsAvailable = true;
        }

        this.element_results.innerHTML = searchitems;
        if (results.length > 0) {
            this.top_result    = this.element_results.firstChild;
            this.bottom_result = this.element_results.lastChild;
        }
    }
}


/* Class for the top searchbar component 
 * (absolutely positioned in the page and controlled with the keyboard) 
 */
class TopSearchbar extends AbstractSearchbar {

    constructor(fusesearch) {
        super();
        this.search           = fusesearch;
        this.element_main     = document.getElementById("fuse-search-top-searchbar");
        this.element_input    = document.getElementById('fuse-search-top-searchbar-input');
        this.element_results  = document.getElementById('fuse-search-top-searchbar-results');
        super.init();
    }

    itemHtml(item) {
        return '<li><a href="' + item.permalink + '" tabindex="0">' + 
                '<span class="title">' + item.title + '</span>' + 
                '<span class="text">' + item.permalink + '</span>' + 
                '</a></li>';
    }

    toString() { return "TopSearchbar"; }
}


/* Class for the top searchbar component 
 * (absolutely positioned in the page and controlled with the keyboard) 
 */
class FullscreenSearchbar extends AbstractSearchbar {

    constructor(fusesearch) {
        super();
        this.search           = fusesearch;
        this.element_main     = document.getElementById("fuse-search-fullscreen-searchbar");
        this.element_input    = document.getElementById('fuse-search-fullscreen-searchbar-input');
        this.element_results  = document.getElementById('fuse-search-fullscreen-searchbar-results');
        this.element_close    = document.getElementById('fuse-search-fullscreen-searchbar-close');
        super.init();

        // Close the searchbar when the user clicks the close button
        this.element_close.addEventListener('click', (e) => {
            if (this.visible) {
                this.closeSearch()
            }
        });
    }

    itemHtml(item) {
        return '<li><a href="' + item.permalink + '" tabindex="0">' + 
                '<span class="title">' + item.title + '</span>' + 
                '<span class="text">' + item.permalink + '</span>' + 
                '</a></li>';
    }

    toString() { return "FullscreenSearchbar"; }
}

/* Class for the inline searchbar component 
 */
class InlineSearchbar extends AbstractSearchbar {

    constructor(fusesearch) {
        super();
        this.search           = fusesearch;
        this.element_main     = document.getElementById("fuse-search-inline-searchbar");
        this.element_input    = document.getElementById('fuse-search-inline-searchbar-input');
        this.element_results  = document.getElementById('fuse-search-inline-searchbar-results');
        this.closable         = false;
        super.init();
        this.initSearch();
    }

    itemHtml(item) {
        return '<li><a href="' + item.permalink + '" tabindex="0">' + 
                '<span class="title">' + item.title + '</span>' + 
                '<span class="text">' + item.permalink + '</span>' + 
                '</a></li>';
    }

    toString() { return "InlineSearchbar"; }
}


// ==========================================
// HELPER FUNCTIONS
//

/* Fetches JSON file and returns the parsed contents in the callback */
function fetchJSONFile(path, callback, errorCallback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                if (callback) { callback(data); }
            } else {
                if (errorCallback) { errorCallback(httpRequest.status, httpRequest.statusText) }
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send(); 
}


// EXPORTS
if (module) {
    module.exports = { setupSearch }
}

