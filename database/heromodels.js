/* exported loadHeroModels */

function loadHeroModels() {
	
	// Notes: add "isBetaTesting:true," to beta-tested heroes.

	return [
		// [CODEX-Heroes] Class - The Warrior: A balanced fighter who prefers melee attacks. It's equipped with a short sword, warrior boots, a small flask of cure, a throwing knife, and a Resurrection item.
		{
			id:"warrior",
			heroClass:"Guerrero",
			goldNotes:"Oro(G) ({ifCrossDoor}{then}{ifPayGold:1})",
			tags:["importantStartingItem"],
			skills:[
				[ {skill:"ATK -1\nRNG 1"}, {skill:"MOV-3"} ],
				[ {skill:"DEF -3"}, {skill:"MOV-2", tags:["losable"]} ],
				[ {skill:"+ HP-5", cost:"-1G", tags:["losable"] }, {skill:"ATK -3\nRNG 1", tags:["losable"] } ],
				[ {skill:"ATK\nRNG 2", tags:["losable"]}, {skill:"MOV"} ]
			],
			placeholders:{
				familiarName:[
					"Perro",
					"Lobo",
					"Oso"
				]
			},
			defense:[1,1,1,1],
			xpRamp:[
				{
					value:0
				},{
					xpGroup:"low",
					round:"floor",
					percentage:1
				},{
					xpGroup:"high",
					round:"floor",
					percentage:0.35
				},{
					xpGroup:"high",
					round:"floor",
					percentage:0.65
				}
			],
			
			//Original XP ramp:
			/*
			xpRamp:[
				{
					value:0
				},{
					xpGroup:"all",
					round:"ceil",
					percentage:0.15
				},{
					xpGroup:"all",
					round:"ceil",
					percentage:0.35
				},{
					xpGroup:"all",
					round:"ceil",
					percentage:0.5
				}
			],
			*/
			
			hpRamp:[0.5,0.15,0.25,0.1],
			damageRatio:0.7,
			equipment:[
				{
					placeholder:"heroItem",
					id:"resurrection",
					isAvailable:true
				}
			],
			enemyModels:[
				// Level 0
				{ skills:[] },
				// Level 1
				{ skills:[] },
				// Level 2
				{
					skills:[
						["DEF -3","ATK -3\nRNG 2"]
					]
				},
				// Level 3
				{ skills:[] },
				// Level 4 - Zombies
				{ skills:[] }
			]
		},

		// [CODEX-Heroes] Class - The Wizard: A powerful mage that fights from the distance. It's equipped with lightning spells, a teleport spell, a magic shield, a healing spell, and a Fireball item.
		{
			id:"wizard",
			heroClass:"Mago",
			goldNotes:"Oro(G) ({ifCrossDoor}{then}{ifPayGold:1})",
			tags:["weak"],
			skills:[
				[ {skill:"ATK -2\nRNG 2"}, {skill:"MOV-3"} ],
				[ {skill:"MOV\n-1"}, {skill:"MOV-3", tags:["losable"]} ],
				[ {skill:"DEF\n-2", tags:["losable"]}, {skill:"ATK -1\nRNG 3"} ],
				[ {skill:"+ HP-5", cost:"-1G"}, {skill:"ATK\nRNG 1", tags:["losable"]} ]
			],
			placeholders:{
				familiarName:[
					"Búho",
					"Gato",
					"Lagarto"
				]
			},
			defense:[1,1,1,1],
			xpRamp:[
				{
					value:0
				},{
					xpGroup:"low",
					round:"floor",
					percentage:1
				},{
					xpGroup:"high",
					round:"floor",
					percentage:0.35
				},{
					xpGroup:"high",
					round:"floor",
					percentage:0.65
				}
			],

			hpRamp:[0.6,0.15,0.15,0.1],
			damageRatio:0.7,
			equipment:[
				{
					placeholder:"heroItem",
					id:"fireball",
					isAvailable:true
				}
			],

			enemyModels:[
				// Level 0
				{
					skills:[
						["ATK -1\nRNG 2","MOV-3"]
					]
				},
				// Level 1
				{ skills:[] },
				// Level 2
				{ skills:[] },
				// Level 3
				{ skills:[] },
				// Level 4 - Zombies
				{ skills:[] }
			]
		},

		// [CODEX-Heroes] Class - The Dwarf: A strong fighter trained on swinging a huge war hammer. It's equipped with a war hammer, leather armor, and a Mead item.
		{
			id:"dwarf",
			heroClass:"Enano",
			goldNotes:"Oro(G) ({ifCrossDoor}{then}{ifPayGold:1})",
			skills:[
				[ {skill:"ATK -1\nRNG 1"}, {skill:"MOV-4"} ],
				[ {skill:"DEF -2"}, {skill:"MOV-3", tags:["losable"]} ],
				[ {skill:"ATK -2\nALL 2", cost:"-1G", tags:["losable"]}, {skill:"DEF -3"} ],
				[ {skill:"ATK -1\nRNG 2", cost:"-2G", tags:["losable"] }, {skill:"ATK\nRNG 1", cost:"-2G", tags:["losable"]} ]
			],
			placeholders:{
				familiarName:[
					"Castor",
					"Topo",
					"Herizo"
				]
			},
			defense:[1,1,1,1],
			xpRamp:[
				{
					value:0
				},{
					xpGroup:"low",
					round:"floor",
					percentage:1
				},{
					xpGroup:"high",
					round:"floor",
					percentage:0.35
				},{
					xpGroup:"high",
					round:"floor",
					percentage:0.65
				}
			],
			
			hpRamp:[0.35,0.30,0.25,0.1],
			damageRatio:0.7,
			equipment:[
				{
					placeholder:"heroItem",
					id:"mead",
					isAvailable:true
				}
			],
			enemyModels:[
				// Level 0
				{ skills:[] },
				// Level 1
				{ skills:[] },
				// Level 2
				{skills: [] },
				// Level 3
				{ skills:[] },
				// Level 4 - Zombies
				{ skills:[] }
			]
		},

		// [CODEX-Heroes] Class - The Ranger: An archer that learns from the beasts. It's equipped with a bow and a Focus item.
		{
			id:"ranger",
			heroClass:"Guardabosques",
			goldNotes:"Oro(G) ({ifCrossDoor}{then}{ifPayGold:1})",
			skills:[
				[ {skill:"ATK -1\nRNG 1"}, {skill:"MOV-3"} ],
				[ {skill:"ATK -1\nRNG =2", tags:["losable"]}, {skill:"Copiar\n-1", tags:["losable"]} ],
				[ {skill:"Copiar\n-1", tags:["losable"]}, {skill:"DEF -2"} ],
				[ {skill:"ATK\nRNG 3", tags:["losable"]}, {skill:"MOV", tags:["losable"]} ]
			],
			placeholders:{
				familiarName:[
					"Halcón",
					"Paloma",
					"Serpiente"
				]
			},
			defense:[1,1,1,1],
			xpRamp:[
				{
					value:0
				},{
					xpGroup:"low",
					round:"floor",
					percentage:1
				},{
					xpGroup:"high",
					round:"floor",
					percentage:0.35
				},{
					xpGroup:"high",
					round:"floor",
					percentage:0.65
				}
			],
			hpRamp:[0.5,0.15,0.25,0.1],
			damageRatio:0.7,
			equipment:[
				{
					placeholder:"heroItem",
					id:"focus",
					isAvailable:true
				}
			],
			enemyModels:[
				// Level 0
				{ skills:[] },
				// Level 1
				{ skills:[] },
				// Level 2
				{
					skills:[
						["DEF -3","ATK -3\nRNG 2"]
					]
				},
				// Level 3
				{ skills:[] },
				// Level 4 - Zombies
				{ skills:[] }
			]
		},

		// [CODEX-Heroes] Class - The Rogue: An agile thief that tricks enemies. It's equipped with a lasso, a throwing knife, and a Frag bomb item.
		{
			id:"rogue",
			heroClass:"Ladrón",
			goldNotes:"Oro(G) ({ifCrossDoor}{then}{ifPayGold:1})",
			skills:[
				[ {skill:"ATK -1\nRNG 1"}, {skill:"MOV-2"} ],
				[ {skill:"DEF -3"}, {skill:"Lock\n-3", tags:["losable"]} ],
				[ {skill:"DEF -2", tags:["losable"] }, {skill:"MOV", tags:["losable"] } ],
				[ {skill:"Lock\n-2", tags:["losable"]}, {skill:"ATK\nRNG 2", tags:["losable"]} ]
			],
			placeholders:{
				familiarName:[
					"Ratón",
					"Cuervo",
					"Mapache"
				]
			},
			defense:[1,1,1,1],
			xpRamp:[
				{
					value:0
				},{
					xpGroup:"low",
					round:"floor",
					percentage:1
				},{
					xpGroup:"high",
					round:"floor",
					percentage:0.35
				},{
					xpGroup:"high",
					round:"floor",
					percentage:0.65
				}
			],
			
			hpRamp:[0.5,0.15,0.25,0.1],
			damageRatio:0.7,
			equipment:[
				{
					placeholder:"heroItem",
					id:"frag",
					isAvailable:true
				}
			],
			enemyModels:[
				// Level 0
				{ skills:[] },
				// Level 1
				{ skills:[] },
				// Level 2
				{
					skills:[
						["DEF -3","ATK -3\nRNG 2"]
					]
				},
				// Level 3
				{ skills:[] },
				// Level 4 - Zombies
				{ skills:[] }
			]
		},
	];
}
