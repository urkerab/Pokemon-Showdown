export const Moves: {[k: string]: ModdedMoveData} = {
	"accupressure": {
		inherit: true,
		type: "Psychic",
	},
	"afteryou": {
		inherit: true,
		type: "Fairy",
	},
	"assist": {
		inherit: true,
		type: "Fairy",
	},
	"attract": {
		inherit: true,
		type: "Fairy",
	},
	"barrage": {
		inherit: true,
		type: "Grass",
	},
	"batonpass": {
		inherit: true,
		type: "Psychic",
	},
	"bellydrum": {
		inherit: true,
		type: "Dragon",
	},
	"bestow": {
		inherit: true,
		type: "Ice",
	},
	"bide": {
		inherit: true,
		type: "Rock",
	},
	"bind": {
		inherit: true,
		type: "Poison",
	},
	"block": {
		inherit: true,
		type: "Rock",
	},
	"bodyslam": {
		inherit: true,
		type: "Ground",
	},
	"boomburst": {
		inherit: true,
		type: "Flying",
	},
	"camouflage": {
		inherit: true,
		type: "Ghost",
		onHit(target) {
			let newType = 'Ground';
			if (this.field.isTerrain('electricterrain')) newType = 'Electric';
			else if (this.field.isTerrain('grassyterrain')) newType = 'Grass';
			else if (this.field.isTerrain('mistyterrain')) newType = 'Fairy';

			if (!target.setType(newType)) return false;
			this.add('-start', target, 'typechange', newType);
		},
	},
	"captivate": {
		inherit: true,
		type: "Fairy",
	},
	"celebrate": {
		inherit: true,
		type: "Fairy",
	},
	"chipaway": {
		inherit: true,
		type: "Fighting",
	},
	"cometpunch": {
		inherit: true,
		type: "Fighting",
	},
	"confide": {
		inherit: true,
		type: "Dark",
	},
	"constrict": {
		inherit: true,
		type: "Water",
	},
	"conversion": {
		inherit: true,
		type: "Electric",
	},
	"conversion2": {
		inherit: true,
		type: "Electric",
	},
	"copycat": {
		inherit: true,
		type: "Fairy",
	},
	"covet": {
		inherit: true,
		type: "Fairy",
	},
	"crushclaw": {
		inherit: true,
		type: "Dark",
	},
	"crushgrip": {
		inherit: true,
		type: "Ground",
	},
	"cut": {
		inherit: true,
		type: "Steel",
	},
	"defensecurl": {
		inherit: true,
		type: "Rock",
	},
	"disable": {
		inherit: true,
		type: "Psychic",
	},
	"dizzypunch": {
		inherit: true,
		type: "Psychic",
	},
	"doubleedge": {
		inherit: true,
		type: "Steel",
	},
	"doublehit": {
		inherit: true,
		type: "Dark",
	},
	"doubleslap": {
		inherit: true,
		type: "Fairy",
	},
	"doubleteam": {
		inherit: true,
		type: "Ghost",
	},
	"echoedvoice": {
		inherit: true,
		type: "Flying",
	},
	"eggbomb": {
		inherit: true,
		type: "Fire",
	},
	"encore": {
		inherit: true,
		type: "Fairy",
	},
	"endeavor": {
		inherit: true,
		type: "Fighting",
	},
	"endure": {
		inherit: true,
		type: "Fighting",
	},
	"entrainment": {
		inherit: true,
		type: "Fairy",
	},
	"explosion": {
		inherit: true,
		type: "Fire",
	},
	"extremespeed": {
		inherit: true,
		type: "Fire",
	},
	"facade": {
		inherit: true,
		type: "Fighting",
	},
	"fakeout": {
		inherit: true,
		type: "Fighting",
	},
	"falseswipe": {
		inherit: true,
		type: "Steel",
	},
	"feint": {
		inherit: true,
		type: "Fighting",
	},
	"flail": {
		inherit: true,
		type: "Dark",
	},
	"flash": {
		inherit: true,
		type: "Electric",
	},
	"focusenergy": {
		inherit: true,
		type: "Fighting",
	},
	"followme": {
		inherit: true,
		type: "Fairy",
	},
	"foresight": {
		inherit: true,
		type: "Psychic",
	},
	"frustration": {
		inherit: true,
		type: "Dark",
	},
	"furyattack": {
		inherit: true,
		type: "Flying",
	},
	"furyswipes": {
		inherit: true,
		type: "Steel",
	},
	"gigaimpact": {
		inherit: true,
		type: "Dark",
	},
	"glare": {
		inherit: true,
		type: "Poison",
	},
	"growl": {
		inherit: true,
		type: "Fairy",
	},
	"growth": {
		inherit: true,
		type: "Grass",
	},
	"guillotine": {
		inherit: true,
		type: "Steel",
	},
	"happyhour": {
		inherit: true,
		type: "Dark",
	},
	"harden": {
		inherit: true,
		type: "Rock",
	},
	"headbutt": {
		inherit: true,
		type: "Rock",
	},
	"headcharge": {
		inherit: true,
		type: "Ground",
	},
	"healbell": {
		inherit: true,
		type: "Steel",
	},
	"helpinghand": {
		inherit: true,
		type: "Fairy",
	},
	"hiddenpower": {
		inherit: true,
		type: "Fairy",
	},
	"holdback": {
		inherit: true,
		type: "Fighting",
	},
	"holdhands": {
		inherit: true,
		type: "Fairy",
	},
	"hornattack": {
		inherit: true,
		type: "Bug",
	},
	"horndrill": {
		inherit: true,
		type: "Steel",
	},
	"howl": {
		inherit: true,
		type: "Fire",
	},
	"hyperbeam": {
		inherit: true,
		type: "Dark",
	},
	"hyperfang": {
		inherit: true,
		type: "Dark",
	},
	"hypervoice": {
		inherit: true,
		type: "Dragon",
	},
	"judgement": {
		inherit: true,
		type: "Fairy",
	},
	"lastresort": {
		inherit: true,
		type: "Dark",
	},
	"leer": {
		inherit: true,
		type: "Dark",
	},
	"lockon": {
		inherit: true,
		type: "Steel",
	},
	"lovelykiss": {
		inherit: true,
		type: "Dark",
	},
	"luckychant": {
		inherit: true,
		type: "Fairy",
	},
	"meanlook": {
		inherit: true,
		type: "Ghost",
	},
	"megakick": {
		inherit: true,
		type: "Fighting",
	},
	"megapunch": {
		inherit: true,
		type: "Fighting",
	},
	"metronome": {
		inherit: true,
		type: "Psychic",
	},
	"milkdrink": {
		inherit: true,
		type: "Fairy",
	},
	"mimic": {
		inherit: true,
		type: "Psychic",
	},
	"mindreader": {
		inherit: true,
		type: "Fighting",
	},
	"minimize": {
		inherit: true,
		type: "Psychic",
	},
	"morningsun": {
		inherit: true,
		type: "Fire",
	},
	"naturalgift": {
		inherit: true,
		type: "Grass",
	},
	"naturepower": {
		inherit: true,
		type: "Grass",
	},
	"nobleroar": {
		inherit: true,
		type: "Fire",
	},
	"odorsleuth": {
		inherit: true,
		type: "Bug",
	},
	"painsplit": {
		inherit: true,
		type: "Ghost",
	},
	"payday": {
		inherit: true,
		type: "Dark",
	},
	"perishsong": {
		inherit: true,
		type: "Ghost",
	},
	"playnice": {
		inherit: true,
		type: "Fairy",
	},
	"pound": {
		inherit: true,
		type: "Fighting",
	},
	"present": {
		inherit: true,
		type: "Ice",
	},
	"protect": {
		inherit: true,
		type: "Psychic",
	},
	"psychup": {
		inherit: true,
		type: "Psychic",
	},
	"quickattack": {
		inherit: true,
		type: "Electric",
	},
	"rage": {
		inherit: true,
		type: "Dark",
	},
	"rapidspin": {
		inherit: true,
		type: "Fighting",
	},
	"razorwind": {
		inherit: true,
		type: "Steel",
	},
	"recover": {
		inherit: true,
		type: "Psychic",
	},
	"recycle": {
		inherit: true,
		type: "Psychic",
	},
	"reflectype": {
		inherit: true,
		type: "Psychic",
	},
	"refresh": {
		inherit: true,
		type: "Psychic",
	},
	"relicsong": {
		inherit: true,
		type: "Fairy",
	},
	"retaliate": {
		inherit: true,
		type: "Dark",
	},
	"return": {
		inherit: true,
		type: "Fairy",
	},
	"roar": {
		inherit: true,
		type: "Dragon",
	},
	"rockclimb": {
		inherit: true,
		type: "Bug",
	},
	"round": {
		inherit: true,
		type: "Flying",
	},
	"safeguard": {
		inherit: true,
		type: "Psychic",
	},
	"scaryface": {
		inherit: true,
		type: "Ghost",
	},
	"scratch": {
		inherit: true,
		type: "Bug",
	},
	"screech": {
		inherit: true,
		type: "Ghost",
	},
	"secretpower": {
		inherit: true,
		type: "Psychic",
	},
	"selfdestruct": {
		inherit: true,
		type: "Fire",
	},
	"sharpen": {
		inherit: true,
		type: "Steel",
	},
	"shellsmash": {
		inherit: true,
		type: "Rock",
	},
	"simplebeam": {
		inherit: true,
		type: "Psychic",
	},
	"sing": {
		inherit: true,
		type: "Fairy",
	},
	"sketch": {
		inherit: true,
		type: "Psychic",
	},
	"skullbash": {
		inherit: true,
		type: "Rock",
	},
	"slackoff": {
		inherit: true,
		type: "Ground",
	},
	"slam": {
		inherit: true,
		type: "Grass",
	},
	"slash": {
		inherit: true,
		type: "Steel",
	},
	"sleeptalk": {
		inherit: true,
		type: "Psychic",
	},
	"smellingsalts": {
		inherit: true,
		type: "Fighting",
	},
	"smokescreen": {
		inherit: true,
		type: "Poison",
	},
	"snore": {
		inherit: true,
		type: "Psychic",
	},
	"softboiled": {
		inherit: true,
		type: "Fairy",
	},
	"sonicboom": {
		inherit: true,
		type: "Steel",
	},
	"spikecannon": {
		inherit: true,
		type: "Ground",
	},
	"spitup": {
		inherit: true,
		type: "Poison",
	},
	"splash": {
		inherit: true,
		type: "Water",
	},
	"stockpile": {
		inherit: true,
		type: "Grass",
	},
	"stomp": {
		inherit: true,
		type: "Ground",
	},
	"strength": {
		inherit: true,
		type: "Rock",
	},
	"struggle": {
		inherit: true,
		type: "Fairy",
	},
	"substitute": {
		inherit: true,
		type: "Poison",
	},
	"superfang": {
		inherit: true,
		type: "Dark",
	},
	"supersonic": {
		inherit: true,
		type: "Electric",
	},
	"swagger": {
		inherit: true,
		type: "Dark",
	},
	"swallow": {
		inherit: true,
		type: "Poison",
	},
	"sweetscent": {
		inherit: true,
		type: "Grass",
	},
	"swordsdance": {
		inherit: true,
		type: "Steel",
	},
	"tackle": {
		inherit: true,
		type: "Ground",
	},
	"tailslap": {
		inherit: true,
		type: "Fairy",
	},
	"tailwhip": {
		inherit: true,
		type: "Fairy",
	},
	"takedown": {
		inherit: true,
		type: "Rock",
	},
	"technoblast": {
		inherit: true,
		type: "Steel",
	},
	"teeterdance": {
		inherit: true,
		type: "Psychic",
	},
	"thrash": {
		inherit: true,
		type: "Dark",
	},
	"tickle": {
		inherit: true,
		type: "Fairy",
	},
	"transform": {
		inherit: true,
		type: "Psychic",
	},
	"triattack": {
		inherit: true,
		type: "Electric",
	},
	"uproar": {
		inherit: true,
		type: "Dragon",
	},
	"vicegrip": {
		inherit: true,
		type: "Bug",
	},
	"weatherball": {
		inherit: true,
		type: "Flying",
	},
	"whirlwind": {
		inherit: true,
		type: "Flying",
	},
	"wish": {
		inherit: true,
		type: "Fairy",
	},
	"workup": {
		inherit: true,
		type: "Fairy",
	},
	"wrap": {
		inherit: true,
		type: "Poison",
	},
	"wringout": {
		inherit: true,
		type: "Grass",
	},
	"yawn": {
		inherit: true,
		type: "Fairy",
	},
};
