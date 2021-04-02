import RandomGen7Teams from '../gen7/random-teams';

export class RandomArceusGen7Teams extends RandomGen7Teams {
	randomTeam() {
		const natures = Object.keys(this.dex.data.Natures);
		const arceus = ['arceus'].concat(this.dex.getSpecies('Arceus').otherFormes!);
		const team = [];
		for (let i = 0; i < 6; i++) {
			const template = this.dex.getSpecies(this.sampleNoReplace(arceus));

			const item = template.requiredItem!;

			// Random EVs
			const evs: StatsTable = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
			const s: StatName[] = ["hp", "atk", "def", "spa", "spd", "spe"];
			let evpool = 510;
			do {
				const x = s[this.random(s.length)];
				const y = this.random(Math.min(256 - evs[x], evpool + 1));
				evs[x] += y;
				evpool -= y;
			} while (evpool > 0);

			// Random IVs
			const ivs = {hp: this.random(32), atk: this.random(32), def: this.random(32), spa: this.random(32), spd: this.random(32), spe: this.random(32)};

			// Random nature
			const nature = natures[this.random(natures.length)];

			// Random gender--already handled by PS

			// Random happiness
			const happiness = this.random(256);

			// Random shininess
			const shiny = !this.random(1024);

			team.push({
				name: template.baseSpecies,
				species: template.name,
				gender: template.gender,
				item: item,
				ability: 'Multitype',
				moves: ['Metronome'],
				evs: evs,
				ivs: ivs,
				nature: nature,
				level: 100,
				happiness: happiness,
				shiny: shiny,
			});
		}
		return team;
	}
}

export default RandomArceusGen7Teams;
