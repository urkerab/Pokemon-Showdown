import RandomGen7Teams from '../gen7/random-teams';
import {toID} from '../../../sim/dex';

export class RandomMixAndMegaGen7Teams extends RandomGen7Teams {
	randomTeam() {
		const megaStones = ['Red Orb', 'Blue Orb'];
		for (const id in this.dex.data.Items) {
			if (/** id !== 'gengarite' && */this.dex.data.Items[id].megaStone && !this.dex.data.Items[id].isNonstandard) megaStones.push(this.dex.data.Items[id].name);
		}
		let pokemonLeft = 0;
		const pokemon = [];

		const availableFormes: {[k: string]: string[]} = {};
		for (const id in this.dex.data.FormatsData) {
			const template = this.dex.species.get(id);
			if (template.gen <= this.gen && !template.evos.length && !template.isMega && !template.isPrimal && !template.isNonstandard && template.randomBattleMoves) {
				if (!availableFormes[template.baseSpecies]) {
					availableFormes[template.baseSpecies] = [id];
				} else {
					availableFormes[template.baseSpecies].push(id);
				}
			}
		}
		const pokemonPool = Object.values(availableFormes);

		// PotD stuff
		let potd;
		if (global.Config && Config.potd && this.dex.formats.getRuleTable(this.format).has('potd')) {
			potd = this.dex.species.get(Config.potd);
		}

		const typeCount: {[k: string]: number} = {};
		const typeComboCount: {[k: string]: number} = {};
		const baseFormes: {[k: string]: number} = {};
		let uberCount = 0;
		let puCount = 0;
		const teamDetails: RandomTeamsTypes.TeamDetails = {};

		while (pokemonPool.length && pokemonLeft < 6) {
			let template = this.dex.species.get(this.sample(this.sampleNoReplace(pokemonPool)));
			if (!template.exists) continue;

			// Useless in Random Battle without greatly lowering the levels of everything else
			if (template.name === 'Unown') continue;

			const tier = template.tier;
			switch (tier) {
			case 'Uber':
				// Ubers are limited to 2 but have a 20% chance of being added anyway.
				if (uberCount > 1 && this.random(5) >= 1) continue;
				break;
			case 'PU':
				// PUs are limited to 2 but have a 20% chance of being added anyway.
				if (puCount > 1 && this.random(5) >= 1) continue;
				break;
			case 'Unreleased':
				// Unreleased Pokémon have 20% the normal rate
				if (this.random(5) >= 1) continue;
				break;
			case 'CAP':
				// CAPs have 20% the normal rate
				if (this.random(5) >= 1) continue;
			}

			// Limit 2 of any type
			const types = template.types;
			let skip = false;
			for (const type of types) {
				if (typeCount[type] > 1 && this.random(5) >= 1) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			if (potd?.exists) {
				// The Pokemon of the Day belongs in slot 2
				if (pokemon.length === 1) {
					template = potd;
					if (template.name === 'Magikarp') {
						template = {...potd, randomBattleMoves: ['bounce', 'flail', 'splash', 'magikarpsrevenge'] as ID[]};
					} else if (template.name === 'Delibird') {
						template = {...potd, randomBattleMoves: ['present', 'bestow'] as ID[]};
					}
				} else if (template.name === potd.name) {
					continue; // No, thanks, I've already got one
				}
			}

			// Remove switcheroo, trick.
			if (template.randomBattleMoves) {
				let index = template.randomBattleMoves.indexOf('switcheroo' as ID);
				if (index < 0) index = template.randomBattleMoves.indexOf('trick' as ID);
				if (index >= 0) {
					const newTemplate = this.dex.deepClone(template);
					newTemplate.randomBattleMoves.splice(index, 1);
					template = newTemplate;
				}
			} else {
				if (this.dex.species.getLearnset(template.id)!.switcheroo || this.dex.species.getLearnset(template.id)!.trick) {
					const newTemplate = this.dex.deepClone(template);
					delete newTemplate.learnset.switcheroo;
					delete newTemplate.learnset.trick;
					template = newTemplate;
				}
			}
			const set = this.randomSet(template, teamDetails, !pokemon.length);
			if (!template.requiredItem && template.tier !== 'Uber' && !template.evos.length && set.item !== 'Thick Club' && set.item !== 'Stick') {
				let stone = this.sampleNoReplace(megaStones);
				/** if (template.species === "Shuckle" && ['Aggronite', 'Audinite', 'Charizarditex', 'Charizarditey', 'Galladeite', 'Gyaradosite', 'Houndoominite', 'Latiasite', 'Salamencite', 'Scizorite', 'Sharpedonite', 'Tyranitarite', 'Venusaurite'].indexOf(stone) >= 0) {
					stone = '';
				} else */switch (stone) {
				case 'Beedrillite':
					if (template.name !== 'Beedrill') stone = '';
					break;
				case 'Gengarite':
					if (template.name !== 'Gengar') stone = '';
					break;
				case 'Kangaskhanite':
					if (template.name !== 'Kangaskhan') stone = '';
					break;
				/// case 'Blazikenite':
					/// if (set.ability != 'Speed Boost') stone = '';
					/// break;
				case 'Mawilite': case 'Medichamite':
					if (set.ability !== 'Huge Power' && set.ability !== 'Pure Power') stone = '';
					break;
				/// case 'Slowbronite':
					/// if (template.baseStats.def > 185) stone = '';
					/// break;
				/// case 'Mewtwonitey':
					/// if (template.baseStats.def <= 20) stone = '';
					/// break;
				/// case 'Diancite':
					/// if (template.baseStats.def <= 40 || template.baseStats.spd <= 40) stone = '';
					/// break;
				/// case 'Ampharosite': case 'Garchompite': case 'Heracronite':
					/// if (template.baseStats.spe <= 10) stone = '';
					/// break;
				/// case 'Cameruptite':
					/// if (template.baseStats.spe <= 20) stone = '';
					/// break;
				/// case 'Abomasite': case 'Sablenite':
					/// if (template.baseStats.spe <= 30) stone = '';
					/// break;
				}
				if (stone) {
					set.item = stone;

					let index = set.moves.indexOf('facade');
					if (index >= 0) set.moves[index] = 'return';

					const mega = stone === 'Blue Orb' ? 'kyogreprimal' : stone === 'Red Orb' ? 'groudonprimal' : toID(this.dex.items.get(stone).megaStone);
					index = pokemonPool.indexOf(availableFormes[mega]);
					if (index >= 0) {
						pokemonPool[index] = pokemonPool[pokemonPool.length - 1];
						pokemonPool.pop();
					}
				}
			} else {
				const index = megaStones.indexOf(set.item);
				if (index >= 0) {
					megaStones[index] = megaStones[megaStones.length - 1];
					megaStones.pop();
				}
			}

			// Illusion shouldn't be the last Pokemon of the team
			if (set.ability === 'Illusion' && pokemonLeft > 4) continue;

			// Limit 1 of any type combination
			let typeCombo = types.join();
			if (set.ability === 'Drought' || set.ability === 'Drizzle' || set.ability === 'Sand Stream') {
				// Drought, Drizzle and Sand Stream don't count towards the type combo limit
				typeCombo = set.ability;
			}
			if (typeCombo in typeComboCount) continue;

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[template.baseSpecies] = 1;
			pokemonLeft++;

			// Increment type counters
			for (const type of types) {
				if (type in typeCount) {
					typeCount[type]++;
				} else {
					typeCount[type] = 1;
				}
			}
			typeComboCount[typeCombo] = 1;

			// Increment Uber/NU counters
			if (tier === 'Uber') {
				uberCount++;
			} else if (tier === 'PU') {
				puCount++;
			}

			// Team has weather/hazards
			if (set.ability === 'Snow Warning') teamDetails['hail'] = 1;
			if (set.ability === 'Drizzle' || set.moves.includes('raindance')) teamDetails['rain'] = 1;
			if (set.ability === 'Sand Stream') teamDetails['sand'] = 1;
			if (set.moves.includes('stealthrock')) teamDetails['stealthRock'] = 1;
			if (set.moves.includes('toxicspikes')) teamDetails['toxicSpikes'] = 1;
			if (set.moves.includes('defog')) teamDetails['defog'] = 1;
			if (set.moves.includes('rapidspin')) teamDetails['rapidSpin'] = 1;
		}
		return pokemon;
	}
}

export default RandomMixAndMegaGen7Teams;
