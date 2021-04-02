export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen6',
	actions: {
		canMegaEvo(pokemon) {
			if (pokemon.species.isMega || pokemon.species.isPrimal) return null;

			const item = pokemon.getItem();
			if (item.id === 'eviolite' && !pokemon.species.evos.length) {
				const newTemplate = this.dex.deepClone(pokemon.species);
				newTemplate.isMega = true;
				newTemplate.requiredItem = 'eviolite';
				let ability = pokemon.name;
				if (!this.dex.abilities.get(ability).exists) ability = pokemon.ability;
				newTemplate.abilities = {0: ability};
				if (pokemon.set.shiny) {
					newTemplate.baseStats.atk += 10;
					newTemplate.baseStats.spa += 30;
				} else {
					newTemplate.baseStats.atk += 30;
					newTemplate.baseStats.spa += 10;
				}
				newTemplate.baseStats.def += 20;
				newTemplate.baseStats.spd += 20;
				newTemplate.baseStats.spe += 20;
				return newTemplate;
			}

			if (item.megaEvolves !== pokemon.species.baseSpecies || item.megaStone === pokemon.species.name) return null;
			return item.megaStone;
		},
	},
};
