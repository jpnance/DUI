$(document).ready(loadDynastyData);

var showColors = true;

function saveColorSetting() {
	// TODO: Learn how to do this.
}

function loadDynastyData() {
	chrome.extension.sendRequest({'action' : 'fetchDynastyData'}, onDynastyData);
}
