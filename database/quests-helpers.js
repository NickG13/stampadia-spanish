/* exported loadQuestsHelpers */

function loadQuestsHelpers() {

	return [

		{
			id:"[CODEX-Events] Helper - The Insurance: Pay Gold/XP for HP.",
			steps:[[{id:"spawn",labels:["Insurance"],atPercentage:1,roomDescriptions:[
				[
						"Agente: \"Seguros Stampadia del {placeName}. Hola, {heroClass}\"",
						"{ifMoveOn:npc}{and}{ifPayGold:4}{then}\"Gracias\", {gainHp:1}"
				]
			],items:[{genericItem:"npc"}]}]]
		},
		{
			id:"[CODEX-Events] Helper - The Junk Shop: Trade your class item for full health.",
			ignoreForHeroTags:["importantStartingItem"],
			steps:[[{id:"spawn",labels:["Junk"],atPercentage:1,roomDescriptions:[
				[
						"Chatarrero: \"¿Me cambias algo {heroClass}?\"",
						"{ifMoveOn:npc}{and}{payEquip:equip-heroItem}{then}\"¡Es perfecto!\", {gainFullHp}, {markItem:npc}"
				]
			],items:[{genericItem:"npc"}]}]]
		}
	]

}
