/* exported loadTerrains */

function loadModifiers() {
	return {
		crippled:{
			enemy:{
				id:"[CODEX-Modifiers] Enemy - Crippled: Enemies moves -1.",
				type:"good",
				roomDescription:"{ifEnemyPerformAction:MOVE}{then}Se arrastra, paralizado, {actionEffect:-1}"
			},
			hero:{
				id:"[CODEX-Modifiers] Hero - Paralysis: Hero moves -1.",
				type:"bad",
				roomDescription:"{ifHeroPerformAction:MOVE}{then}Piernas paralizadas, {actionEffect:-1}"
			},
		},
		scared:{
			enemy:{
				id:"[CODEX-Modifiers] Enemy - Fear: Enemies -1 a die of choice.",
				type:"good",
				roomDescription:"{ifAfterEnemyRollInFight}{then}Tiembla de miedo, {modifyDice:1,-1}"
			},
			hero:{
				id:"[CODEX-Modifiers] Hero - Fear: Hero -1 a die of choice.",
				type:"bad",
				roomDescription:"{ifAfterHeroRollInFight}{then}Retrocedes con miedo, {modifyDice:1,-1}"
			}
		},
		blind:{
			enemy:{
				id:"[CODEX-Modifiers] Enemy - Blind: Enemies plays just 1 die.",
				type:"good",
				roomDescription:"{ifAfterEnemyRollInFight}{then}No te puede ver, {activateOnly:1}"
			},
			hero:{
				id:"[CODEX-Modifiers] Hero - Blind: Hero plays just 1 die.",
				type:"bad",
				roomDescription:"{ifAfterHeroRollInFight}{then}No ves nada, {activateOnly:1}"
			},
		},
		stunned:{
			enemy:{
				id:"[CODEX-Modifiers] Enemy - Stunned: Hero rerolls his 1s.",
				type:"good",
				roomDescription:"{ifHeroRolls:1}{then}Enemigo aturdido, {reroll:1}"
			},
			hero:{
				id:"[CODEX-Modifiers] Enemy - Haste: Enemies rerolls his 1s.",
				type:"bad",
				roomDescription:"{ifEnemyRolls:1}{then}Se mueve muy rápido, {reroll:1}"
			},
		},

		// Rooms
		muddy:{
			room:{
				id:"[CODEX-Modifiers] Terrain - Mud: Everybody moves -1.",
				type:"balanced",
				roomDescription:"{ifPerformAction:MOVE}{then}El suelo lodoso te frena, {actionEffect:-1}"
			}
		},
		tallGrass:{
			room:{
				id:"[CODEX-Modifiers] Terrain - Tall grass: Everybody -1 a die of choice.",
				type:"balanced",
				roomDescription:"{ifAfterRollInFight}{then}La maleza te entorpece, {modifyDice:1,-1}"
			}
		},
		darkness:{
			room:{
				id:"[CODEX-Modifiers] Terrain - Darkness: Everybody plays just 1 die.",
				type:"balanced",
				roomDescription:"{ifAfterRollInFight}{then}Está muy oscuro, {activateOnly:1}"
			}
		},
		arena:{
			room:{
				id:"[CODEX-Modifiers] Terrain - Arena: Everybody rerolls his 1s.",
				type:"balanced",
				roomDescription:"{ifRolls:1}{then}Es una lucha a muerte, {reroll:1}"
			}
		}
	};
}
