export const Moves: {[k: string]: ModdedMoveData} = {
	"gastroacid": {
		inherit: true,
		condition: {
			// Ability suppression implemented in Pokemon.ignoringAbility() within sim/pokemon.js
			onStart(pokemon) {
				this.add('-endability', pokemon);
				this.singleEvent('End', pokemon.getAbility(), pokemon.abilityData, pokemon, pokemon, 'gastroacid');
				if (pokemon.m.innates) (pokemon.m.innates as string[]).forEach(innate => pokemon.removeVolatile("ability" + innate));
			},
		},
	},
};
