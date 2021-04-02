export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen7',
	init() {
		const learnsets = {...this.data.Learnsets};
		const dex = [];
		for (const id in Dex.data.Pokedex) { // NOT this! Keys are in wrong order
			if (this.data.Pokedex[id].num <= 0 || this.data.Pokedex[id].num >= 810) continue;
			if (this.data.Pokedex[id].evos) continue;
			if (['Totem', 'Gmax', 'Galar', 'Galar-Zen'].includes(this.data.Pokedex[id].forme!)) continue;
			if (!learnsets[id] || !learnsets[id].learnset) continue;
			if (this.data.FormatsData[id].isNonstandard) continue;
			if (this.data.FormatsData[id].tier === 'Illegal') continue;
			dex.push(id);
		}
		dex.push(dex[0], dex[1]);
		for (let i = 2; i < dex.length; i++) {
			for (let target = dex[i - 1]; target; target = this.toID(this.data.Pokedex[target].prevo)) {
				const learnset = this.modData('Learnsets', target).learnset;
				for (let j = i - 2; j <= i; j++) {
					for (let source = dex[j]; source; source = this.toID(this.data.Pokedex[source].prevo)) {
						for (const move in learnsets[source].learnset) {
							if (move === 'shellsmash') continue;
							if (move !== 'sketch') learnset[move] = [this.gen + 'T'];
							else if (!learnset[move]) learnset[move] = ['5E'];
						}
					}
				}
			}
		}
	},
};
