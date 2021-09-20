/* exported loadQuestsHelpers */

function loadQuestsHelpers() {

	return [

		// [CODEX-Events] Helper - The Insurance: Pay Gold/XP for HP.
		{
			steps:[[{id:"spawn",atPercentage:1,roomDescriptions:[
				[
						"Agent: \"Stampadia {placeName} Insurance Service. Welcome, {heroClass}!\"",
						"{ifMoveOn:npc}{and}{ifPayGold:4}{then}\"Thank you!\", {gainHp:1}"
				]
			],items:[{genericItem:"npc"}]}]]
		},
		// [CODEX-Events] Helper - The Tallyshop: Trade your class item for full health.
		{
			ignoreForHeroClasses:["warrior"],
			steps:[[{id:"spawn",atPercentage:1,roomDescriptions:[
				[
						"Tallyman: \"Do you have anything interesting to trade, {heroClass}?\"",
						"{ifMoveOn:npc}{and}{payEquip:equip-heroItem}{then}\"Just what I needed!\", {gainFullHp}, {markItem:npc}"
				]
			],items:[{genericItem:"npc"}]}]]
		},
		// [CODEX-Events] Helper - Nobody: You're on your own, as in classic Stampadia. Good luck!
		{
			ignoreForHeroClasses:["wizard"],
			steps:[[]]
		}
	]

}