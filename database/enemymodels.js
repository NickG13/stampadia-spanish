/* exported loadEnemyModels */

function loadEnemyModels() {
	return [
		// Level 0
		{
			skills:[
				["ATK -1\nRNG 1","MOV\n-2"]
			]
		},
		// Level 1
		{
			skills:[
				["DEF -4","MOV\n-1"],
				["DEF -3","MOV\n-2"]
			]
		},
		// Level 2
		{
			skills:[
				["DEF -4","ATK -2\nRNG 1"],
				["DEF -4","ATK -3\nRNG 2"]
			]
		},
		// Level 3
		{
			skills:[
				["ATK\nRNG 1","ATK -2\nRNG 1"],
				["ATK\nRNG 1","ATK -2\nRNG 2"]
			]
		},
		// Level 4 (Zombies) - They act like level 0 enemies but with higher health.
		{ isVirtual:true, skills:[[]] }
	];
}
