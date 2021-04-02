export const Abilities: {[k: string]: ModdedAbilityData} = {
	"aerilate": {
		inherit: true,
		onModifyMove(move, pokemon) {
			if (move.flags['contact'] || move.flags['sound']) {
				move.type = "Flying";
				if (move.category !== 'Status') pokemon.addVolatile('aerilate');
			}
		},
	},
	"normalize": {
		inherit: true,
		onModifyMove(move, pokemon) {
			if (move.id !== 'struggle') {
				move.type = pokemon.types[0];
			}
		},
	},
	"pixilate": {
		inherit: true,
		onModifyMove(move, pokemon) {
			if (move.flags['contact'] || move.flags['sound']) {
				move.type = "Fairy";
				if (move.category !== 'Status') pokemon.addVolatile('pixilate');
			}
		},
	},
	"refrigerate": {
		inherit: true,
		onModifyMove(move, pokemon) {
			if (move.flags['contact'] || move.flags['sound']) {
				move.type = "Ice";
				if (move.category !== 'Status') pokemon.addVolatile('refrigerate');
			}
		},
	},
	"scrappy": {
		inherit: true,
		onModifyMove(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Fighting'] = true;
			}
		},
	},
};
