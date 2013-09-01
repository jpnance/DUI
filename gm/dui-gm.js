// ==UserScript==
// @name           Dynasty User Interface
// @namespace      http://coinflipper.org/
// @description    Dynasty league stuff
// @include        http://games.espn.go.com/ffl/boxscore?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/boxscorefull?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/boxscorequick?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/boxscorescoring?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/clubhouse?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/dropplayers?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/freeagency?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/leaders?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/leaguerosters?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/rosterfix?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/tools/keeperselect?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/tools/lmtradereview?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/tools/waiverorder?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/trade?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/tradereview?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/watchlist?*leagueId=122885*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @version        DuiDictionary.UNQUOTED_VERSION
// @updateURL      https://userscripts.org/scripts/source/177045.meta.js
// @downloadURL    https://userscripts.org/scripts/source/177045.user.js
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
