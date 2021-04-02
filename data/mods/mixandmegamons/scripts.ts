export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen6',
	init() {
		for (const id in this.data.Items) {
			if (!this.data.Items[id].megaStone) continue;
			this.modData('Items', id).onTakeItem = false;
		}
		for (const i in this.data.Pokedex) {
			const pokemon = this.data.Pokedex[i];
			switch (pokemon.name) {
			case 'Gengar-Mega':
			case 'Mewtwo-Mega-X':
			case 'Mewtwo-Mega-Y':
			case 'Rayquaza-Mega':
				break;
			default:
				switch (pokemon.forme) {
				case 'Mega':
				case 'Mega-X':
				case 'Mega-Y':
					this.modData('Pokedex', i).gen = 6;
					/// this.modData('Pokedex', i).isMega = true;
					/// this.modData('Pokedex', i).battleOnly = false;
					this.modData('FormatsData', i).tier = 'Uber';
					delete this.modData('FormatsData', i).requiredItem;
				}
			}
		}
	},
	canMegaEvo(pokemon) {
		if (pokemon.baseSpecies.isMega || pokemon.baseSpecies.isPrimal) return null;

		const item = pokemon.getItem();
		if (item.megaStone) {
			if (item.megaStone === pokemon.species.name) return null;
			return item.megaStone;
		} else if (pokemon.baseMoves.includes('dragonascent' as ID)) {
			return 'Rayquaza-Mega';
		} else {
			return null;
		}
	},
	runMegaEvo(pokemon) {
		if (pokemon.baseSpecies.isMega || pokemon.baseSpecies.isPrimal) return false;

		const oMegaTemplate = this.dex.getSpecies(pokemon.canMegaEvo || pokemon.canUltraBurst);
		const effect = this.dex.getItem(oMegaTemplate.requiredItem || oMegaTemplate.requiredMove);
		const template = oMegaTemplate.baseSpecies === pokemon.species.baseSpecies ? oMegaTemplate : pokemon.baseSpecies;

		const side = pokemon.side;

		// Pokémon affected by Sky Drop cannot Mega Evolve. Enforce it here for now.
		for (const foeActive of side.foe.active) {
			if (foeActive.volatiles['skydrop'] && foeActive.volatiles['skydrop'].source === pokemon) {
				return false;
			}
		}

		pokemon.formeChange(template, effect, true);
		pokemon.baseSpecies = pokemon.species; // Mega Evolution is permanent
		pokemon.baseAbility = pokemon.ability;

		// Do we have a proper sprite for it?
		if (this.dex.getSpecies(pokemon.canMegaEvo).baseSpecies !== pokemon.m.originalSpecies) {
			const oTemplate = this.dex.getSpecies(pokemon.m.originalSpecies);
			this.add('-start', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			if (oTemplate.types.length !== pokemon.species.types.length || oTemplate.types[1] !== pokemon.species.types[1]) {
				this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
			}
		}

		pokemon.canMegaEvo = null;
		return true;
	},
	getMixedSpecies(originalSpecies, megaSpecies) {
		const originalTemplate = this.dex.getSpecies(originalSpecies);
		const megaTemplate = this.dex.getSpecies(megaSpecies);
		if (originalTemplate.baseSpecies === megaTemplate.baseSpecies) return megaTemplate;
		const deltas = this.getMegaDeltas(megaTemplate);
		const template = this.doGetMixedSpecies(originalTemplate, deltas);
		return template;
	},
	getMegaDeltas(megaTemplate) {
		const baseTemplate = this.dex.getSpecies(megaTemplate.baseSpecies);
		const deltas: MegaDeltas = {
			abilities: megaTemplate.abilities,
			baseStats: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
			weighthg: megaTemplate.weighthg - baseTemplate.weighthg,
			originalMega: megaTemplate.name,
			requiredItem: megaTemplate.requiredItem,
		};
		let statId: StatName;
		for (statId in megaTemplate.baseStats) {
			deltas.baseStats[statId] = megaTemplate.baseStats[statId] - baseTemplate.baseStats[statId];
		}
		if (megaTemplate.types.length > baseTemplate.types.length) {
			deltas.type = megaTemplate.types[1];
		} else if (megaTemplate.types.length < baseTemplate.types.length) {
			deltas.type = baseTemplate.types[0];
		} else if (megaTemplate.types[1] !== baseTemplate.types[1]) {
			deltas.type = megaTemplate.types[1];
		}
		if (megaTemplate.isMega) deltas.isMega = megaTemplate.forme;
		if (megaTemplate.isPrimal) deltas.isPrimal = true;
		return deltas;
	},
	doGetMixedSpecies(template, deltas) {
		if (!deltas) throw new TypeError("Must specify deltas!");
		if (!template || typeof template === 'string') template = this.dex.getSpecies(template);
		const newTemplate = this.dex.deepClone(template);
		newTemplate.abilities = deltas.abilities;
		if (template.types[0] === deltas.type) {
			newTemplate.types = [deltas.type];
		} else if (deltas.type) {
			newTemplate.types[1] = deltas.type;
		}
		const baseStats = template.baseStats;
		let statName: StatName;
		for (statName in baseStats) {
			newTemplate.baseStats[statName] = this.clampIntRange(baseStats[statName] + deltas.baseStats[statName], 1, 255);
		}
		newTemplate.weighthg = Math.max(1, template.weighthg + deltas.weighthg);
		newTemplate.originalMega = deltas.originalMega;
		newTemplate.requiredItem = deltas.requiredItem;
		if (deltas.isMega) {
			newTemplate.isMega = true;
			newTemplate.species += '-' + deltas.isMega;
		} else if (deltas.isPrimal) {
			newTemplate.isPrimal = true;
			newTemplate.species += '-Primal';
		}
		delete newTemplate.onType;
		return newTemplate;
	},
};
