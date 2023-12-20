/* exported loadQuestsBonus loadQuestsMalus */

function loadQuestsBonus() {

	const
		QUEST_RARE=40,
		SHOPITEMS=[
			{cost:"{ifPayGold:3}",answer:"{randomShopKeeper}",effect:"{gainHp:1}"},
			{cost:"{ifPayGold:7}",answer:"{randomShopKeeper}",effect:"{gainHp:2}"},
			{cost:"{ifPayGold:4}",answer:"{randomShopKeeper}",effect:"{gainXp:1}"},
			{cost:"{ifPayXp:1}",answer:"{randomDarkShopKeeper}",effect:"{gainHp:1}"},
			{cost:"{ifPayXp:2}",answer:"{randomDarkShopKeeper}",effect:"{gainHp:2}"},
			{cost:"{ifPayXp:2}",answer:"{randomDarkShopKeeper}",effect:"{gainGold:5}"},
		];

	const SHOP=[];

	SHOPITEMS.forEach(item=>{
		SHOP.push([ "{ifMoveOn:item}{and}"+item.cost+"{then}"+item.answer+", "+item.effect+", {markItem:item}"]);
	})

	return [

		{
			id:"[CODEX-Events] Bonus - The Random Item: A random bonus item.",
			minRooms:2,
			steps:[[{id:"spawn",labels:["Item"],atPercentage:99,roomDescriptions:[
				[ "{ifMoveOn:item}{then}{hide}Hallado {randomGoodLoot}, {markItem:item}" ]
			],items:[{genericItem:"item"}]}]]
		},

		{
			id:"[CODEX-Events] Bonus - The NPC: Learn about the Stampadia lore by Stampadians.",
			minRooms:2,			
			steps:[[{id:"spawn",labels:["Tipo","Hablando","Charla","Charlando"],atPercentage:99,roomDescriptions:[

				// The Travellers, who has interesting unanswered questions about Stampadia...
				[ "{ifMoveOn:item}{then}Viajero: \"¿Se están moviendo las paredes?\"" ],
				[ "{ifMoveOn:item}{then}Viajero: \"¿Es este mundo... solo un sueño?\"" ],
				[ "{ifMoveOn:item}{then}Viajero: \"¿Es ese Monje siempre el mismo?\"" ],
				[ "{ifMoveOn:item}{then}Viajero: \"¿Es mi primera vez aquí?\"" ],

				// The Ghosts, who gives cryptic tips on gameplay...
				[ "{ifMoveOn:item}{then}Fantasma: \"No necesitas usar ambos.\"" ],
				[ "{ifMoveOn:item}{then}Fantasma: \"Lo que ves no es siempre lo que obtienes.\"" ],
				[ "{ifMoveOn:item}{then}Fantasma: \"Mirar atrás no siempre es perder el tiempo.\"" ],
				[ "{ifMoveOn:item}{then}Fantasma: \"La segunda vez es más fácil.\"" ],
				[ "{ifMoveOn:item}{then}Fantasma: \"El tiempo es oro. Úsalo bien.\"" ],

				// The Monks, who are mapping all the dungeons...
				[ "{ifMoveOn:item}{then}Monje: \"Disculpe, ¿dónde está la salida?\", {markItem:item}" ],
				[ "{ifMoveOn:item}{then}Monje: \"Disculpe, ¿cuál es su nombre?\", {markItem:item}" ],
				[ "{ifMoveOn:item}{then}Monje: \"Disculpe, ¿La sala anterior era cuadrada?\", {markItem:item}" ],
				[ "{ifMoveOn:item}{then}Monje: \"Disculpe, ¿conoce al {goodGuyName}?\", {markItem:item}" ],
				[ "{ifMoveOn:item}{then}Monje: \"Disculpe, ¿eres un {heroClass}?\", {markItem:item}" ],
				[ "{ifMoveOn:item}{then}Monje: \"Disculpe, ¿está el {villainName} aquí?\", {markItem:item}" ],
				[ "{ifMoveOn:item}{then}Monje: \"Disculpe, ¿estamos en el {placeName}?\", {markItem:item}" ],

				// The Carpenters, who are looking for a strange machine to fix...
				[ "{ifMoveOn:item}{then}Carpintero: \"Alguien pidió mi ayuda...\"" ],
				[ "{ifMoveOn:item}{then}Carpintero: \"¿Dónde está la máquina a reparar?\"" ],
				[ "{ifMoveOn:item}{then}Carpintero: \"¿Has visto algún repuesto por ahí?\"" ],
				[ "{ifMoveOn:item}{then}Carpintero: \"Mierda... ¿ya se ha acabado la tinta?\"" ],
				[ "{ifMoveOn:item}{then}Carpintero: \"¡Espero que paguen bien por este trabajo!\"" ],

				// Sergio, the mysterious wandering philosopher...
				[ "{ifMoveOn:item}{then}Sergio: \"Aquí estoy, un filósofo en un mundo de monstruos.\""],
				[ "{ifMoveOn:item}{then}Sergio: \"¿Realmente vivimos en el mejor mundo posible?\""],
				[ "{ifMoveOn:item}{then}Sergio: \"He dedicado mi vida a inventar un mundo tan extraño...\""],
				[ "{ifMoveOn:item}{then}Sergio: \"Quizás necesitemos un mundo nuevo, con más humor.\""],
				[ "{ifMoveOn:item}{then}Sergio: \"¿Es este el mejor mundo posible?\""],
				[ "{ifMoveOn:item}{then}Sergio: \"Dignidad, por supuesto, pero con un buen humor.\""],

			],items:[{genericItem:"item"}]}]]
		},

		{
			id:"[CODEX-Events] Bonus - The Teleports: Teleport from a room to another.",
			minRooms:4,
			steps:[[
				// isExclusive reason: Enemies behind one of the two teleports may lock the player.
				{id:"roomA",isExclusive:true,labels:["TP cerca","Primer TP"],atPercentage:1,roomDescriptions:[
					[ "{ifMoveOn:item1}{then}{randomTeleportation}{hide}{teleportToRoom:roomB}" ]
				],items:[{genericItem:"item1"}]},
				{id:"roomB",isExclusive:true,labels:["TP lejos","Último TP"],atPercentage:99,roomDescriptions:[
					[ "{ifMoveOn:item2}{then}{randomTeleportation}{hide}{teleportToRoom:roomA}" ]
				],items:[{genericItem:"item2"}]}
			]]
		},

		{
			id:"[CODEX-Events] Bonus - The Shop: Pay gold or other valuables for useful items.",
			minRooms:2,
			steps:[[
				{id:"spawn",labels:["Tienda","Compra","Venta"],atPercentage:99,roomDescriptions:SHOP
				,items:[{genericItem:"item"}]}
			]]
		},

		{
			id:"[CODEX-Events] Bonus - The Saint: They will help you when you're in danger.",
			minRooms:4,
			steps:[[
				{id:"roomA",labels:["Sagrada"],atPercentage:{from:50,to:99},roomDescriptions:[
					[ "{ifMoveOn:saint}{and}{ifHpLeft=:0}{then}Santo: {randomSaint}, {gainHp:2}, {markItem:saint}" ]
				],items:[{genericItem:"saint"}]}
			]]
		},

		{
			id:"[CODEX-Events] Bonus - The Magic Tree: It grows a healing fruit after some time.",
			minRooms:2,
			steps:[
				[
					{id:"roomA",labels:["Podrido","Árbol"],atPercentage:{from:1,to:99},roomDescriptions:[
						[
							"{randomMagicTree}",
							"{ifMoveOn:tree}{and}{ifGoldLeft<half}{then}Coges una fruta, {randomGoodReward}, {markItem:tree}"
						]
					],items:[{genericItem:"tree"}]}
				],
				[
					{id:"roomA",labels:["Florecido","Árbol"],atPercentage:{from:1,to:99},roomDescriptions:[
						[
							"{randomMagicTree}",
							"{ifMoveOn:tree}{and}{ifGoldLeft>half}{then}Coges una fruta, {randomGoodReward}, {markItem:tree}"
						]
					],items:[{genericItem:"tree"}]}
				],
			]
		},

		{
			id:"[CODEX-Events] Bonus - The Mirror: Go back to this room using an item.",
			minRooms:2,
			steps:[
				[
					{id:"equip-mirror-room",labels:["Reflejo","Gemelo"],atPercentage:99,equipment:[{id:"mirror"}],roomDescriptions:[
						[
							"{ifMoveOn:mirror}{then}Ves tu reflejo en un gran espejo, {markItem:mirror}, {getEquip:equip-mirror}"
						]
					],items:[{genericItem:"mirror"}]}
				]
			]
		},

		{
			probability:QUEST_RARE,
			id:"[CODEX-Events] Bonus - The Clover: It may bring good luck in your future adventures...",
			minRooms:2,
			steps:[
				[
					{id:"roomA",labels:["Afortunado"],atPercentage:99,roomDescriptions:[
						[
							"{ifMoveOn:item}{and}{ifLoseKeyword:luck}{then}Encuentras{hide}{randomGoodLoot}, {markItem:item}",
							"{ifMoveOn:item}{and}{ifNotKeyword:luck}{then}Encuentras un trébol, {getKeyword:luck}, {markItem:item}"
						]
					],items:[{genericItem:"item"}]}
				]
			]
		},

		{
			id:"[CODEX-Events] Bonus - The Clown: Pay him/her to learn cool stunts!",
			minRooms:1,
			steps:[
				[
					{id:"clownRoom",labels:["Saltando","Circo"],atPercentage:99,equipment:[{id:"backflip"}],roomDescriptions:[
						[
							"{ifMoveOn:clown}{and}{ifPayGold:5}{then}Payaso: \"¡Buen salto, {heroClass}!\", {getEquip:equip-backflip}, {markItem:clown}"
						]
					],items:[{genericItem:"clown"}]}
				],
				[
					{id:"clownRoom",labels:["Bailando","Música","Circo"],atPercentage:99,equipment:[{id:"spin"}],roomDescriptions:[
						[
							"{ifMoveOn:clown}{and}{ifPayGold:5}{then}Payaso: \"¡Buen baile, {heroClass}!\", {getEquip:equip-spin}, {markItem:clown}"
						]
					],items:[{genericItem:"clown"}]}
				],
				[
					{id:"clownRoom",labels:["Stretching","Circus"],atPercentage:99,equipment:[{id:"lunge"}],roomDescriptions:[
						[
							"{ifMoveOn:clown}{and}{ifPayGold:5}{then}Payaso: \"¡Buen estiramiento, {heroClass}!\", {getEquip:equip-lunge}, {markItem:clown}"
						]
					],items:[{genericItem:"clown"}]}
				],
				[
					{id:"clownRoom",labels:["Sweeping","Circus"],atPercentage:99,equipment:[{id:"sweep"}],roomDescriptions:[
						[
							"{ifMoveOn:clown}{and}{ifPayGold:5}{then}Payaso: \"Buen barrido, {heroClass}!\", {getEquip:equip-sweep}, {markItem:clown}"
						]
					],items:[{genericItem:"clown"}]}
				]
			]
		},

		{
			id:"[CODEX-Events] Bonus - The Wildness (good): Earn a buff after fighting an enemy.",
			minRooms:1,
			steps:[
				// [CODEX-Stuff] Beast - The Bear: Makes you braver.
				{ labels:["Bear","Hungry"], intro:"Un oso gigante y rugiente te mira, hambriento.", action:"Ha sido intenso", effect:"{applyModifierOnRoomMarked:scared.enemy,biteRoom}" },
				// [CODEX-Stuff] Beast - The Porcupine: Gives you thorns to cripple your enemies.
				{ labels:["Porcupine","Spikes"], intro:"Un puercoespín gigante te mira con interés.", action:"Se clavan algunas espinas", effect:"{applyModifierOnRoomMarked:crippled.enemy,biteRoom}" },
				// [CODEX-Stuff] Beast - The Moth: His spores can blind your enemies.
				{ labels:["Fly","Spores"], intro:"Una gran polilla esparce esporas por toda la habitación.", action:"Quedas impregnado de esporas", effect:"{applyModifierOnRoomMarked:blind.enemy,biteRoom}" },
				// [CODEX-Stuff] Beast - The Whirlwind: His colors can stun your enemies.
				{ labels:["Colors","Whirlwind"], intro:"Un torbellino de luz se traga los colores de la habitación.", action:"Estalla en tu cara", effect:"{applyModifierOnRoomMarked:stunned.enemy,biteRoom}" },
			].map(enemy=>
				[
					{
						id:"biteRoom",
						labels:enemy.labels,
						atPercentage:99,
						globalModifier:enemy.effect,
						roomDescriptions:[
						[
							enemy.intro,
							"{ifKilledLastFoe}{then}"+enemy.action+", {markRoom:biteRoom}"
						]
					],items:[{id:"enemy",level:2}]}
				]
			)
		},

		{
			id:"[CODEX-Events] Bonus - The Powder Magazine: Choose between 2 room-size based weapons.",
			minRooms:2,
			steps:[
				[
					{
						id:"magazineRoom",
						labels:["Magazine","Powder","Grenade","Smoke"],
						atPercentage:{from:1,to:99},
						equipment:[{id:"grenade"},{id:"smoke"}],roomDescriptions:[
							[
								"{ifMoveOn:item1}{and}{ifPayGold:4}{then}{getEquip:equip-grenade}, {markItem:item1}, {markItem:item2}",
								"{ifMoveOn:item2}{and}{ifPayGold:2}{then}{getEquip:equip-smoke}, {markItem:item1}, {markItem:item2}",
							]
						],items:[{genericItem:"item1"},{genericItem:"item2"}]
					}
				],
				[
					{
						id:"magazineRoom",
						labels:["Magazine","Powder","Grenade","Sonic"],
						atPercentage:{from:1,to:99},
						equipment:[{id:"grenade"},{id:"sonic"}],roomDescriptions:[
							[
								"{ifMoveOn:item1}{and}{ifPayGold:4}{then}{getEquip:equip-grenade}, {markItem:item1}, {markItem:item2}",
								"{ifMoveOn:item2}{and}{ifPayGold:2}{then}{getEquip:equip-sonic}, {markItem:item1}, {markItem:item2}",
							]
						],items:[{genericItem:"item1"},{genericItem:"item2"}]
					}
				]
			]
		},

	];
}

function loadQuestsMalus() {
	const QUEST_RARE=40;

	return [

		{
			id:"[CODEX-Events] Malus - The Switch Trap: Step on a trap to get injured.",
			steps:[[{id:"trap",labels:["Trap"],atPercentage:99,items:[{genericItem:"switch"}],roomDescriptions:[
				[ "{ifMoveOn:switch}{then}{hide}{randomTrap}, {loseHp:1}, {markItem:switch}" ]
			]}]]
		},

		{
			id:"[CODEX-Events] Malus - The Loop Rooms: It will teleport you to the starting room.",
			steps:[[{id:"trap",labels:["Shrimp","Way Back"],atPercentage:{from:50,to:99},roomDescriptions:[
				[ "{ifEnterRoom}{and}{ifRoomIsNotMarked:trap}{then}{markRoom:trap}, {teleportToStartingRoom}" ]
			]}]]
		},

		{
			id:"[CODEX-Events] Malus - The Teleport Trap: It will teleport you to a room with an enemy.",
			minRooms:4,
			steps:[[
				{id:"switch",labels:["Bad Teleport"],atPercentage:51,roomDescriptions:[
					[ "{ifMoveOn:item1}{then}{randomTeleportation}{hide}{markItem:item1}, {teleportToRoom:trap}" ]
				],items:[{genericItem:"item1"}]},
				{id:"trap",labels:["Surprise Attack"],atPercentage:99,roomDescriptions:[
					[ "\"Caíste en mi trampa\"" ],
					[ "\"¡¿Qué haces aquí?!\"" ],
					[ "\"¡Oye... TÚ!\"" ],
					[ "\"Vaya, vaya, ¿qué tenemos aquí?\"" ],
				],items:[{id:"enemy",level:2}]}
			]]
		},
		
		{
			id:"[CODEX-Events] Malus - The Random Trap: Dodge a trap rolling a die.",
			steps:[[{id:"trap",labels:["Rolling Trap","Random Trap","Killing Fate"],atPercentage:99,roomDescriptions:[
				[ "{ifEnterRoom}{and}{ifRoomIsNotMarked:trap}{then}{markRoom:trap}, {rollDie}{range:1-4} {loseHp:1}, {range:5-6} {nothing}" ],
				[ "{ifEnterRoom}{and}{ifRoomIsNotMarked:trap}{then}{markRoom:trap}, {rollDie}{range:1-2} {loseHp:2}, {range:3-6} {nothing}" ]
			]}]]
		},

		{
			id:"[CODEX-Events] Malus - The Last Fight (1): An enemy will challenge you on your way back.",
			ignoreForHeroTags:["weak"],
			steps:[[{id:"enemy",labels:["Avenging","Last Fight"],atPercentage:50,items:[{id:"enemy",level:2}],roomDescriptions:[
				[
					"{ifRoomIsNotMarked:startingRoom}{then}{roomIsEmpty}, {stopReading}",
					"{randomEnemyChallenge}"
				]
			]}]]
		},

		{
			// Weak characters can max up XPs before the last fight.
			id:"[CODEX-Events] Malus - The Last Fight (2): An enemy will challenge you on your way back.",
			onlyForHeroTags:["weak"],
			steps:[[{id:"enemy",labels:["Avenging","Last Fight"],atPercentage:50,items:[{id:"enemy",level:2,ignoreXp:true}],roomDescriptions:[
				[
					"{ifRoomIsNotMarked:startingRoom}{then}{roomIsEmpty}, {stopReading}",
					"{randomEnemyChallenge}"
				]
			]}]]
		},

		{
			id:"[CODEX-Events] Malus - The Timed Traps: Defuse it with the right timing or it will trigger!",
			minRooms:2,
			steps:[
				[
					{id:"roomA",labels:["Bomb","Clicking"],atPercentage:99,roomDescriptions:[
						[
							"{ifEnterRoom}{and}{ifRoomIsNotMarked:roomA}{and}{ifGoldLeft<half}{then}Activaste una trampa, {randomBadReward}, {markRoom:roomA}",
							"{ifEnterRoom}{and}{ifRoomIsNotMarked:roomA}{and}{ifGoldLeft>half}{then}Desactivaste una trampa, {markRoom:roomA}"
						]
					]}
				],
				[
					{id:"roomA",labels:["Bomb","Clicking"],atPercentage:99,roomDescriptions:[
						[
							"{ifEnterRoom}{and}{ifRoomIsNotMarked:roomA}{and}{ifGoldLeft>half}{then}Activaste una trampa, {randomBadReward}, {markRoom:roomA}",
							"{ifEnterRoom}{and}{ifRoomIsNotMarked:roomA}{and}{ifGoldLeft<half}{then}Alguien activó la trampa, {markRoom:roomA}"
						]
					]}
				]
			]
		},

		{
			id:"[CODEX-Events] Malus - The Witch: Pay her or she will curse you!",
			minRooms:2,
			steps:[
				[
					{id:"witchRoom",labels:["Witch"],items:[{genericItem:"witch"}],atPercentage:{from:10,to:40},roomDescriptions:[
						[
							"{ifMoveOn:witch}{and}{ifPayGold:3}{then}Bruja: \"Gracias, {heroClass}! Je je...\", {markRoom:witchRoom}, {markItem:witch}"
						]
					]},
					{id:"cursedRoom",labels:["Witched"],atPercentage:99,roomDescriptions:[
						[
							"{ifEnterRoom}{and}{ifRoomIsNotMarked:cursedRoom}{and}{ifRoomIsNotMarked:witchRoom}{then}{randomBadFeeling}, {randomBadReward}, {markRoom:cursedRoom}"
						]
					]}
				]
			]
		},

		{
			id:"[CODEX-Events] Malus - The Mercenary: Eliminate an enemy or pay The Mercenary to do that.",
			minRooms:3,
			steps:[
				[
					{id:"mercenaryRoom",labels:["Assassin","Killer"],items:[{genericItem:"mercenary"}],atPercentage:10,roomDescriptions:[
						[
							"{ifMoveOn:mercenary}{and}{ifPayGold:5}{then}Sicario: {randomOk}, {markRoom:mercenaryRoom}, {markItem:mercenary}"
						]
					]},
					{id:"enemyRoom",labels:["Target","Murdered"],atPercentage:99,roomDescriptions:[
						[
							"{ifEnterRoom}{and}{ifRoomIsMarked:mercenaryRoom}{then}{randomCorpse}, {roomIsEmpty}, {stopReading}",
							"{randomEnemyChallenge}"
						]
					],items:[{id:"enemy",level:2}]}
				]
			]
		},

		{
			probability:QUEST_RARE,
			id:"[CODEX-Events] Malus - The Small Horn: It may bring bad luck in your future adventures...",
			minRooms:2,
			steps:[
				[
					{id:"roomA",labels:["Unlucky"],atPercentage:99,roomDescriptions:[
						[
							"{ifEnterRoom}{and}{ifRoomIsNotMarked:roomA}{and}{ifKeyword:unluck}{then}{randomBadReward}, {loseKeyword:unluck}, {markRoom:roomA}",
							"{ifEnterRoom}{and}{ifRoomIsNotMarked:roomA}{then}Encuentras un cuernito, {getKeyword:unluck}, {markRoom:roomA}"
						]
					]}
				]
			]
		},

		{
			id:"[CODEX-Events] Bonus - The Wildness (bad): Earn a debuff after fighting an enemy.",
			minRooms:1,
			steps:[
				// [CODEX-Stuff] Beast - The Scorpion: It can stun you permanently.
				{ labels:["Scorpion","Tail"], intro:"Un gran escorpión balancea su cola, distraído.", action:"Con un último golpe, la cola te pica.", effect:"{applyModifierOnRoomMarked:stunned.hero,biteRoom}" },
				// [CODEX-Stuff] Beast - The Light Ball: It can blind you permanently.
				{ labels:["Light","Floater"], intro:"Un orbe de luz flota en medio de la habitación, iluminándolo todo.", action:"Explota con luz cegadora", effect:"{applyModifierOnRoomMarked:blind.hero,biteRoom}" },
				// [CODEX-Stuff] Beast - The Bat: It can scare you permanently.
				{ labels:["Bat","Hanging"], intro:"Murciélago gigante envuelto en sus alas cuelga del techo en silencio.", action:"Ha sido horripilante", effect:"{applyModifierOnRoomMarked:scared.hero,biteRoom}" },
				// [CODEX-Stuff] Beast - The Snake: It can poison you permanently.
				{ labels:["Coil","Snake"], intro:"Una serpiente gigante te mira, siseando.", action:"Te acaba mordiendo", effect:"{applyModifierOnRoomMarked:crippled.hero,biteRoom}" },
			].map(enemy=>
				[
					{
						id:"biteRoom",
						labels:enemy.labels,
						atPercentage:99,
						globalModifier:enemy.effect,
						roomDescriptions:[
						[
							enemy.intro,
							"{ifKilledLastFoe}{then}"+enemy.action+", {markRoom:biteRoom}"
						]
					],items:[{id:"enemy",level:1,ignoreXp:true}]}
				]
			)
		},
	];

}
