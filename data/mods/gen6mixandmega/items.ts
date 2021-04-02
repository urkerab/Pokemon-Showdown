export const Items: {[k: string]: ModdedItemData} = {
	blueorb: {
		inherit: true,
		onSwitchIn(pokemon) {
			if (pokemon.isActive && !pokemon.species.isPrimal) {
				this.queue.insertChoice({pokemon: pokemon, choice: 'runPrimal'});
			}
		},
		onPrimal(pokemon) {
			const template = pokemon.species.baseSpecies === 'Kyogre' ? 'Kyogre-Primal' : pokemon.species;
			pokemon.formeChange(template, this.effect, true);
			if (pokemon.m.originalSpecies !== 'Kyogre') {
				pokemon.baseSpecies = pokemon.species;
				pokemon.baseAbility = pokemon.ability;
				this.add('-start', pokemon, 'Blue Orb', '[silent]');
			}
		},
		onTakeItem: false,
	},
	redorb: {
		inherit: true,
		onSwitchIn(pokemon) {
			if (pokemon.isActive && !pokemon.species.isPrimal) {
				this.queue.insertChoice({pokemon: pokemon, choice: 'runPrimal'});
			}
		},
		onPrimal(pokemon) {
			const template = pokemon.species.baseSpecies === 'Groudon' ? 'Groudon-Primal' : pokemon.species;
			pokemon.formeChange(template, this.effect, true);
			if (pokemon.m.originalSpecies !== 'Groudon') {
				pokemon.baseSpecies = pokemon.species;
				pokemon.baseAbility = pokemon.ability;
				this.add('-start', pokemon, 'Red Orb', '[silent]');
				const oTemplate = this.dex.getSpecies(pokemon.illusion ? pokemon.illusion.m.originalSpecies : pokemon.m.originalSpecies);
				if (pokemon.illusion) {
					pokemon.ability = '';
					const types = oTemplate.types;
					if (types.length > 1 || types[types.length - 1] !== 'Fire') {
						this.add('-start', pokemon, 'typechange', (types[0] !== 'Fire' ? types[0] + '/' : '') + 'Fire', '[silent]');
					}
				} else if (oTemplate.types.length !== pokemon.species.types.length || oTemplate.types[1] !== pokemon.species.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onTakeItem: false,
	},
};
