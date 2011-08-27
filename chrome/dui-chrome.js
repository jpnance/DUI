$(document).ready(function() {
	setColors();
	loadDynastyData();
});

function loadDynastyData() {
	chrome.extension.sendRequest({'action' : 'fetchDynastyData'}, onDynastyData);
}
