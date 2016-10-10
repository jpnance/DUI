// ==UserScript==
// @name           Dynasty User Interface
// @namespace      http://coinflipper.org/
// @description    Primetime Soap Operas user interface
// @include        http://games.espn.com/ffl/*?*leagueId=122885*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @version        DuiDictionary.UNQUOTED_VERSION
// ==/UserScript==

var showColors = (GM_getValue("dui_showColors") == null) || GM_getValue("dui_showColors");
var showContracts = (GM_getValue("dui_showContracts") == null) || GM_getValue("dui_showContracts");

function saveColorSetting() {
	GM_setValue("dui_showColors", showColors);
}

function saveContractSetting() {
	GM_setValue("dui_showContracts", showContracts);
}

function loadDynastyData() {
	GM_xmlhttpRequest({
		method: "GET",
		url: "http://thedynastyleague.com/dynastyData.xml?_=" + Math.random(),
		onload: function(xhr) {
			onDynastyData(xhr.responseText);
		}
	});
}
