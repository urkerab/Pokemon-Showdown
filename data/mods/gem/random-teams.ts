import RandomGen7Teams from '../gen7/random-teams';
import {toID} from '../../../sim/dex';

export class RandomTypeGemsGen7Teams extends RandomGen7Teams {
	randomTeam() {
		const pokemon = [];

		const excludedTiers = ['LC', 'LC Uber', 'NFE'];
		const allowedNFE = ['Chansey', 'Doublade', 'Gligar', 'Porygon2', 'Scyther'];
		const typePool = Object.keys(this.dex.data.TypeChart);

		const availableFormes: {[k: string]: string[]} = {};
		for (const id in this.dex.data.FormatsData) {
			const template = this.dex.species.get(id);
			if (!excludedTiers.includes(template.tier) && !template.isMega && !template.isPrimal && !template.isNonstandard && template.randomBattleMoves) {
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

		while (pokemonPool.length && pokemon.length < 6) {
			let template = this.dex.species.get(this.sample(this.sampleNoReplace(pokemonPool)));
			if (!template.exists) continue;

			// Useless in Random Battle without greatly lowering the levels of everything else
			if (template.name === 'Unown') continue;

			// Only certain NFE Pokemon are allowed
			if (template.evos.length && !allowedNFE.includes(template.name)) continue;

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
			let types = template.types;
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

			const set = this.randomSet(template, teamDetails, !pokemon.length);

			// Illusion shouldn't be the last Pokemon of the team
			if (set.ability === 'Illusion' && pokemon.length > 4) continue;

			if (!template.requiredItem && set.item !== 'Thick Club' && set.item !== 'Stick') {
				types = [types[0], this.sample(typePool)];
				let typeCombo = types.slice().sort().join();
				while (typeCombo in typeComboCount) {
					types[1] = this.sample(typePool);
					typeCombo = types.slice().sort().join();
				}
				set.item = types[1] + ' Gem';
			}
			// Limit 1 of any type combination
			let typeCombo = types.slice().sort().join();
			if (set.ability === 'Drought' || set.ability === 'Drizzle' || set.ability === 'Sand Stream') {
				// Drought, Drizzle and Sand Stream don't count towards the type combo limit
				typeCombo = set.ability;
			}
			if (typeCombo in typeComboCount) continue;

			const typedMoves: (Move | null)[] = [null, null, null];
			for (const moveid of set.moves) {
				const move = this.dex.moves.get(moveid);
				if (move.type === types[0]) {
					if (!typedMoves[0] || move.basePower > typedMoves[0].basePower) typedMoves[0] = move;
				} else if (move.type === types[1]) {
					if (!typedMoves[1] || move.basePower > typedMoves[1].basePower) typedMoves[1] = move;
				} else {
					if (!typedMoves[2] || move.basePower > typedMoves[2].basePower) typedMoves[2] = move;
				}
			}
			const bestMove = typedMoves[1] || typedMoves[2] || typedMoves[0];
			if (bestMove) {
				set.moves.splice(set.moves.indexOf(toID(bestMove.name)), 1);
				set.moves.unshift(toID(bestMove.name));
			}

			if (template.cosmeticFormes) set.species = template.cosmeticFormes[this.random(template.cosmeticFormes.length)];

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[template.baseSpecies] = 1;

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

export default RandomTypeGemsGen7Teams;
