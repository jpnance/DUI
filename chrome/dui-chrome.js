$(document).ready(loadDynastyData);

var showColors = true;
var upgradeLink = "http://thedynastyleague.com/dui/dui-stable.crx";

function saveColorSetting() {
	// TODO: Learn how to do this.
}

function loadDynastyData() {
	chrome.extension.sendRequest({'action' : 'fetchDynastyData'}, onDynastyData);
}
