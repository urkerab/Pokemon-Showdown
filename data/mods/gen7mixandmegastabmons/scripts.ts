export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen7mixandmega',
	actions: {
		inherit: true,
		canMegaEvo(pokemon) {
			if (pokemon.baseSpecies.isMega || pokemon.baseSpecies.isPrimal || pokemon.baseSpecies.forme === 'Ultra') return null;

			const item = pokemon.getItem();
			if (item.megaStone) {
				if (item.megaStone === pokemon.species.name) return null;
				return item.megaStone;
			} else if (pokemon.baseMoves.includes('dragonascent' as ID) && pokemon.baseSpecies.tier !== 'Uber') {
				return 'Rayquaza-Mega';
			} else {
				return null;
			}
		},
	},
};
