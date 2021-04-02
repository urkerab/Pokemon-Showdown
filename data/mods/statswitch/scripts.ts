export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen7',
	init() {
		// We can do the base species without calling getSpecies (which
		// would otherwise put the base template into the cache).
		for (const i in this.data.Pokedex) {
			if (this.data.Pokedex[i].baseSpecies) continue;
			const baseStats = this.modData('Pokedex', i).baseStats as StatsTable;
			const lowest = Math.min(...Object.values(baseStats));
			const highest = Math.max(...Object.values(baseStats));
			let s: StatName;
			for (s in baseStats) {
				if (baseStats[s] === lowest) {
					baseStats[s] = highest;
				} else if (baseStats[s] === highest) {
					baseStats[s] = lowest;
				}
			}
		}
		for (const i in this.data.Pokedex) {
			if (!this.data.Pokedex[i].baseSpecies) continue;
			const stats = [];
			const baseStats = this.modData('Pokedex', i).baseStats;
			for (const s in baseStats) {
				switch (this.data.Pokedex[i].forme) {
				case 'Primal':
				case 'Mega':
				case 'Mega-X':
				case 'Mega-Y':
					if (s === 'hp') continue;
				}
				stats.push(baseStats[s]);
			}
			const lowest = Math.min(...stats);
			const highest = Math.max(...stats);
			for (const s in baseStats) {
				switch (this.data.Pokedex[i].forme) {
				case 'Primal':
				case 'Mega':
				case 'Mega-X':
				case 'Mega-Y':
					if (s === 'hp') {
						baseStats.hp = this.getSpecies(this.data.Pokedex[i].baseSpecies).baseStats.hp;
						continue;
					}
				}
				if (baseStats[s] === lowest) {
					baseStats[s] = highest;
				} else if (baseStats[s] === highest) {
					baseStats[s] = lowest;
				}
			}
		}
	},
};
