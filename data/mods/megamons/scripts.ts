export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen6',
	init() {
		for (const id in this.data.Pokedex) {
			const species = this.data.Pokedex[id];
			switch (species.name) {
			case 'Gengar-Mega':
			case 'Mewtwo-Mega-X':
			case 'Mewtwo-Mega-Y':
			case 'Rayquaza-Mega':
				break;
			default:
				switch (species.forme) {
				case 'Mega':
				case 'Mega-X':
				case 'Mega-Y':
					this.modData('Pokedex', id).gen = 6;
					/// this.modData('Pokedex', id).isMega = true;
					/// this.modData('Pokedex', id).battleOnly = false;
					delete this.modData('Pokedex', id).requiredItem;
				}
			}
		}
	},
};
