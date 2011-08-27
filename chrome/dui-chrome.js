$(document).ready(function() {
	loadDynastyData();
});

function loadDynastyData() {
	chrome.extension.sendRequest({'action' : 'fetchDynastyData'}, onDynastyData);
}
