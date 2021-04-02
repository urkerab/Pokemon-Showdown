export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen7',
	init() {
		this.modData('Abilities', 'noability').isNonstandard = null;
		for (const i in this.data.Pokedex) {
			const dataTemplate = this.modData('Pokedex', i);
			dataTemplate.abilities = {0: 'No Ability'};
			if (dataTemplate.requiredItem && this.items.get(dataTemplate.requiredItem).megaStone) {
				dataTemplate.requiredItem = '';
			}
		}
		for (const i in this.data.Moves) {
			if (this.data.Moves[i].num! < 1 || this.data.Moves[i].num! > 164 && !['protect', 'sludgebomb', 'outrage', 'megahorn', 'encore', 'irontail', 'crunch', 'mirrorcoat', 'shadowball', 'fakeout', 'heatwave', 'willowisp', 'facade', 'taunt', 'helpinghand', 'superpower', 'brickbreak', 'yawn', 'bulkup', 'calmmind', 'roost', 'feint', 'uturn', 'suckerpunch', 'flareblitz', 'poisonjab', 'darkpulse', 'airslash', 'xscissor', 'bugbuzz', 'dragonpulse', 'nastyplot', 'iceshard', 'flashcannon', 'powerwhip', 'stealthrock', 'aquajet', 'quiverdance', 'foulplay', 'clearsmog', 'scald', 'shellsmash', 'dragontail', 'drillrun', 'playrough', 'moonblast', 'dazzlinggleam', 'zippyzap', 'splishysplash', 'floatyfall', 'bouncybubble', 'buzzybuzz', 'sizzlyslide', 'glitzyglow', 'baddybad', 'sappyseed', 'freezyfrost', 'sparklyswirl', 'doubleironbash'].includes(i)) {
				this.modData('Moves', i).isNonstandard = true;
			}
		}
	},
	/**
	 * Given a table of base stats and a pokemon set, return the actual stats.
	 */
	spreadModify(baseStats, set) {
		const modStats: StatsTable = {hp: 10, atk: 10, def: 10, spa: 10, spd: 10, spe: 10};
		let statName: StatID;
		for (statName in modStats) {
			const stat = baseStats[statName];
			modStats[statName] = Math.floor((Math.floor(2 * stat + set.ivs[statName]) * set.level / 100 + 5));
		}
		if ('hp' in baseStats) {
			const stat = baseStats['hp'];
			modStats['hp'] = Math.floor(Math.floor(2 * stat + set.ivs['hp'] + 100) * set.level / 100 + 10);
		}
		return this.natureModify(modStats, set);
	},

	/**
	 * @param {StatsTable} stats
	 * @param {PokemonSet} set
	 * @return {StatsTable}
	 */
	natureModify(stats, set) {
		const nature = this.dex.natures.get(set.nature);
		if (nature.plus) stats[nature.plus] = Math.floor(stats[nature.plus] * 1.1);
		if (nature.minus) stats[nature.minus] = Math.floor(stats[nature.minus] * 0.9);
		set.happiness = 70;
		const friendshipValue = Math.floor((set.happiness / 255 / 10 + 1) * 100);
		let stat: StatID;
		for (stat in stats) {
			if (stat !== 'hp') {
				stats[stat] = Math.floor(stats[stat] * friendshipValue / 100);
			}
			stats[stat] += set.evs[stat];
		}
		return stats;
	},
};
