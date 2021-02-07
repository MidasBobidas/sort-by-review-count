var currentTab;

function updateIcon() {
    browser.browserAction.setIcon({
        path: isSorted ? {
            19: "icons/star-filled-19.png", // 19x19 px
            38: "icons/star-filled-38.png"  // 38x38 px
        } : {
            19: "icons/star-empty-19.png",  // 19x19 px
            38: "icons/star-empty-38.png"   // 38x38 px
        },
        tabId: currentTab.id
    });

    browser.browserAction.setTitle({
        title: isSorted ? 'Sorted' : 'Unsorted',
        tabId: currentTab.id
    });
}

/*
    Sort or unsort current page 
*/
function toggleSearch() {
    if(alreadySorted) {
        //TODO
    } else {
        currURL=document.getElementById("url").textContent;
        newURL=[currUrl,'&sort=review-count-rank'].join('');
        window.location.replace(newURL)
    };
}
browser.browserAction.onClicked.addListener(toggleSearch);

/*
    Update currentTab with active tab
*/
function updateActiveTab(tabs) {

    function isSupportedProtocol(urlString) {
        var supportedProtocols = ["https:", "http:"];
        var url = document.createElement('a');
        url.href = urlString;
        return supportedProtocols.indexOf(url.protocol) != -1;
    }

    function updateTab(tabs) {
        if(tabs[0]) {
            currentTab = tabs[0];
            if (isSupportedProtocol(currentTab.url)) {
                if(window.location.href.indexOf('&sort=review-count-rank') != -1){
                    var isSorted = true;
                    updateIcon();
                } else {
                    var isSorted = false;
                }
            }
        } else {
            console.log(`'${currentTab.url}' is not a supported url.`)
        }
    }

    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then(updateTab);
}

// listen to tab URL changes
browser.tabs.onUpdated.addListener(updateActiveTab);

// listen to tab switching
browser.tabs.onActivated.addListener(updateActiveTab);

// listen for window switching
browser.windows.onFocusChanged.addListener(updateActiveTab);

// update when the extension loads initially
updateActiveTab();