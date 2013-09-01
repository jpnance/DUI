var showColors = getColorSetting();
var upgradeLink = "http://thedynastyleague.com/dui/dui-stable.crx";

function getColorSetting() {
	chrome.runtime.sendMessage({ "action": "retrieveColorSetting" }, syncColorSetting);
}

function saveColorSetting() {
	chrome.runtime.sendMessage({ "action": "storeColorSetting", "value": showColors });
}

function syncColorSetting(response) {
	showColors = (response.showColors == "true");
}

function loadDynastyData() {
	chrome.runtime.sendMessage({ "action": "fetchDynastyData" }, onDynastyData);
}
