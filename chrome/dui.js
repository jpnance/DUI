$(document).ready(function() {
	getVersion();
	setColors();
	loadDynastyData();
});

function getVersion() {
	chrome.extension.sendRequest({'action' : 'getVersion'}, useVersion);
}

function useVersion(fetchedVersion) {
	version = fetchedVersion;
	console.log(version);
}

function loadDynastyData() {
	chrome.extension.sendRequest({'action' : 'fetchDynastyData'}, onDynastyData);
}