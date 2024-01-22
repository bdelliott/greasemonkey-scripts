// ==UserScript==
// @name     ProtonMail purge
// @version  1
// @grant    none
// ==/UserScript==

var pagesInterval;
var selectAllCheckboxInterval;
var moveToTrashInterval;



function getPageCount(doAfterFn) {
	// get the page count of total number of pages of messages
  pagesInterval = setInterval(function() {
    
    const pagesButton = document.querySelector("button[data-testid='toolbar:page-number-dropdown']");
    if (pagesButton != null) {
      clearInterval(pagesInterval);

      // the inner html is a range of page counts like: "1<span>/</span>239" - 239 pages
    	const tok = pagesButton.innerHTML.split(">");
      const last = tok[tok.length - 1];
      const pageCount = parseInt(last);
      log(pageCount + " pages left to delete...");
      
      if (pageCount > 0) {
	      doAfterFn(pageCount);
      } else {
        log("no more pages");
      }
    }
  }, 2000);
}
  

function log(msg) {
	console.log("purge: " + msg);  
}


function moveAllMessagesToTrash(pageCount) {
  // move to trash button appears when the select all checkbox is clicked, but there may be a slight delay in making the
  // button accessible
	moveToTrashInterval = setInterval(function() {
  	const moveToTrashButton = document.querySelector("button[data-testid='toolbar:movetotrash']");
		if (moveToTrashButton != null) {
      log("clicking trash button");
    	moveToTrashButton.click(); // move selected page of messages to the trash
      clearInterval(moveToTrashInterval);
      waitForPageCountToDrop(pageCount);
      
    } else {
      log("no button");
    }
  }, 1000);
  
}


function toggleSelectAllCheckbox(pageCount) {
  // click the checkbox to select all messages:
  
  // <input id="idSelectAll" type="checkbox" class="checkbox-input" data-testid="toolbar:select-all-checkbox">
  selectAllCheckboxInterval = setInterval(function() {
		const checkbox = document.getElementById("idSelectAll");

  	if (checkbox != null) {
      log("selecting all");
      checkbox.click();
      clearInterval(selectAllCheckboxInterval);
      moveAllMessagesToTrash(pageCount);
    } 
  }, 1000);
  
}


function waitForPageCountToDrop(pageCount) {
  // wait for total pages to decrement
  getPageCount(function(newPageCount) {
  	if (newPageCount < pageCount) {
      log("new page count: " + newPageCount);
      toggleSelectAllCheckbox(newPageCount);
    } else {
    	log("page count still: " + newPageCount);  
    }
  });

  
}

   

function purge() {
  getPageCount(toggleSelectAllCheckbox);
}

purge();

