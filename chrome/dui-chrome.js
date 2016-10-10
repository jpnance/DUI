var showColors = getColorSetting();
var showContracts = getContractSetting();

function getColorSetting() {
	chrome.runtime.sendMessage({ "action": "retrieveColorSetting" }, syncColorSetting);
}

function saveColorSetting() {
	chrome.runtime.sendMessage({ "action": "storeColorSetting", "value": showColors });
}

function syncColorSetting(response) {
	showColors = (response.showColors == "true");
}

function getContractSetting() {
	chrome.runtime.sendMessage({ "action": "retrieveContractSetting" }, syncContractSetting);
}

function saveContractSetting() {
	chrome.runtime.sendMessage({ "action": "storeContractSetting", "value": showContracts });
}

function syncContractSetting(response) {
	showContracts = (response.showContracts == "true");
}

function loadDynastyData() {
	chrome.runtime.sendMessage({ "action": "fetchDynastyData" }, onDynastyData);
}
