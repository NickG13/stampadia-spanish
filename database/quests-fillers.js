/* exported loadQuestsEasyFillers loadQuestsMediumFillers loadQuestsHardFillers */

function loadQuestsEasyFillers() {
	return [

		{
			id:"[CODEX-Events] Filler (easy) - The Weak: One level 0 enemy.",
			steps:[[{id:"spawn",atPercentage:1,roomDescriptions:[
				[ "\"¡El {heroClass} está aquí! ¡Ayuda!\""],
				[ "\"¡Oh... no!\""],
				[ "\"¡A... apartaos!\""],
				[ "\"¡Argh!\""],
			],items:[{id:"enemy",level:0}]}]]
		},

		{
			id:"[CODEX-Events] Filler (easy) - The Pair: Two level 0 enemies.",
			steps:[[{id:"spawn",atPercentage:1,roomDescriptions:[
				[ "\"¡N... no pasarás!\"" ],
				[ "\"¡Te superamos en número, ríndete!\"" ],
				[ "\"¡Matadlo! ¡El jefe nos ascenderá!\""],
				[ "\"¡Por fin un poco de entrenamiento!\"" ]		
			],items:[{id:"enemy",level:0},{id:"enemy",level:0}]}]]
		},

		{
			id:"[CODEX-Events] Filler (easy) - The One (1): One level 1 enemy.",
			ignoreForHeroTags:["weak"],
			steps:[[{id:"spawn",atPercentage:1,roomDescriptions:[
				[ "\"¡Eh tú! ¡Quieto!\"" ],
				[ "\"¡Vengaré a mis hermanos!\"" ],
				[ "\"¡Dame todo tu dinero!\"" ],
				[ "\"¡Ostras!\""],
			],items:[{id:"enemy",level:1}]}]]
		},
		{
			id:"[CODEX-Events] Filler (easy) - The One (2): One level 1 enemy.",
			ignoreForHeroTags:["weak"],
			steps:[[{id:"spawn",atPercentage:1,roomDescriptions:[
				[ "\"¡No te muevas, {heroClass}!\"" ],
				[ "\"¡{heroClass}, tú mataste a mi hermana!\"" ],
				[ "\"¡{heroClass}, eres tú!\"" ],
				[ "\"¡Manos arriba, {heroClass}!\""],
			],items:[{id:"enemy",level:1}]}]]
		}
	];
}

function loadQuestsMediumFillers() {
	return [

		{
			id:"[CODEX-Events] Filler (medium) - The Swarm: Three level 0 enemy.",
			steps:[[{id:"spawn",atPercentage:50,roomDescriptions:[
				[ "\"¡Queremos tus objetos y tu vida!\""],
				[ "\"¿Qué quieres?\""],
				[ "\"¡Jeje! ¡Te vamos a matar!\""],
			],items:[{id:"enemy",level:0},{id:"enemy",level:0},{id:"enemy",level:0}]}]]
		},

		{
			id:"[CODEX-Events] Filler (medium) - The Pair: Two level 1 enemies.",
			steps:[[{id:"spawn",atPercentage:50,roomDescriptions:[
				[ "\"¿Últimas palabras?\"" ],
				[ "\"¡Es hora de morir!\"" ],
				[ "\"¡Esto sí que es un desafío, hagámoslo, chicos!\""],
			],items:[{id:"enemy",level:1},{id:"enemy",level:1}]}]]
		},

		{
			id:"[CODEX-Events] Filler (medium) - The One (1): One level 2 enemy.",
			ignoreForHeroTags:["weak"],
			steps:[[{id:"spawn",atPercentage:50,roomDescriptions:[
				[ "\"Se acabó tu aventura\""],
				[ "\"Raaawwwrrr!\"" ],
				[ "\"¡Ven aquí, cobarde!\"" ]
			],items:[{id:"enemy",level:2}]}]]
		},
		{
			id:"[CODEX-Events] Filler (medium) - The One (2): One level 2 enemy.",
			ignoreForHeroTags:["weak"],
			steps:[[{id:"spawn",atPercentage:50,roomDescriptions:[
				[ "\"Lo siento por ti, {heroClass}\""],
				[ "\"¡Te destrozaré, {heroClass}!\"" ],
				[ "\"¡Di adiós, {heroClass}!\"" ]
			],items:[{id:"enemy",level:2}]}]]
		}
	];
}

function loadQuestsHardFillers() {
	return [
		{
			id:"[CODEX-Events] Filler (medium) - The One: One level 2 enemy.",
			onlyForHeroTags:["weak"],
			steps:[[{id:"spawn",atPercentage:99,roomDescriptions:[
				[ "\"Lo siento por ti, {heroClass}\""],
				[ "\"¡Te destrozaré, {heroClass}!\"" ],
				[ "\"¡Di adiós, {heroClass}!\"" ]
			],items:[{id:"enemy",level:2}]}]]
		},
		{
			id:"[CODEX-Events] Filler (hard) - The Weak Pair: Two level 1 enemies.",
			steps:[[{id:"spawn",atPercentage:99,roomDescriptions:[
				[ "\"¡Hasta nunca, {heroClass}!\"" ],
				[ "\"¡Adiós, {heroClass}!\"" ],
				[ "\"¡Fin del camino, {heroClass}!\"" ],
			],items:[{id:"enemy",level:1},{id:"enemy",level:1}]}]]
		},
		{
			id:"[CODEX-Events] Filler (hard) - The Strong Pair: Two level 2 enemies.",
			steps:[[{id:"spawn",atPercentage:99,roomDescriptions:[
				[ "\"¡A luchar, chicos!\"" ],
				[ "\"¡A destruirlo!\"" ],
				[ "\"¡Su cabeza en una pica!\"" ]
			],items:[{id:"enemy",level:2},{id:"enemy",level:2}]}]]
		}

	];
}

