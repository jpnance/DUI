$(document).ready(loadDynastyData);

var showColors = getColorSetting();
var upgradeLink = "http://thedynastyleague.com/dui/dui-stable.crx";

function getColorSetting() {
	chrome.extension.sendRequest({ "action": "retrieveColorSetting" }, syncColorSetting);
}

function saveColorSetting() {
	chrome.extension.sendRequest({ "action": "storeColorSetting", "value": showColors });
}

function syncColorSetting(response) {
	showColors = (response.showColors == "true");
}

function loadDynastyData() {
	chrome.extension.sendRequest({ "action": "fetchDynastyData" }, onDynastyData);
}
