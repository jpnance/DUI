// ==UserScript==
// @name           Dynasty User Interface
// @namespace      http://coinflipper.org/
// @description    Dynasty league stuff
// @include        http://games.espn.go.com/ffl/*?*leagueId=122885*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @version        DuiDictionary.UNQUOTED_VERSION
// ==/UserScript==

var showColors = (GM_getValue("dui_showColors") == null) || GM_getValue("dui_showColors");

function saveColorSetting() {
	GM_setValue("dui_showColors", showColors);
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
