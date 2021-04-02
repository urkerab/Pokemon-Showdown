export const Scripts: ModdedBattleScriptsData = {
	init() {
		for (const id in this.data.Items) {
			if (!this.data.Items[id].megaStone) continue;
			this.modData('Items', id).onTakeItem = false;
			/// this.modData('Items', id).isUnreleased = false;
		}
		/*
		for (let id in this.data.Pokedex) {
			let pokemon = this.data.Pokedex[id];
			switch (pokemon.forme) {
			case 'Mega':
			case 'Mega-X':
			case 'Mega-Y':
				this.modData('Pokedex', id).gen = 6;
				this.modData('Pokedex', id).isMega = true;
				this.modData('Pokedex', id).battleOnly = false;
				delete this.modData('Pokedex', id).requiredItem;
				break;
			case 'Primal':
				this.modData('Pokedex', id).gen = 6;
				this.modData('Pokedex', id).isPrimal = true;
				this.modData('Pokedex', id).battleOnly = false;
				delete this.modData('Pokedex', id).requiredItem;
				break;
			}
		}
		*/
	},
	actions: {
		canMegaEvo(pokemon) {
			/// if (pokemon.baseSpecies.isPrimal) return false;

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
			/// if (pokemon.baseSpecies.isPrimal) return false;

			const isUltraBurst = !pokemon.canMegaEvo;
			const oMegaTemplate = this.dex.species.get(pokemon.canMegaEvo || pokemon.canUltraBurst);
			const effect = this.dex.items.get(oMegaTemplate.requiredItem || oMegaTemplate.requiredMove);
			const template = oMegaTemplate.baseSpecies === pokemon.species.baseSpecies ? oMegaTemplate : pokemon.species;

			pokemon.formeChange(template, effect, true);
			pokemon.baseSpecies = pokemon.species; // Mega Evolution is permanent
			pokemon.baseAbility = pokemon.ability;

			// Do we have a proper sprite for it?
			if (this.dex.species.get(pokemon.canMegaEvo).baseSpecies !== pokemon.m.originalSpecies && !isUltraBurst) {
				const oTemplate = this.dex.species.get(pokemon.m.originalSpecies);
				this.battle.add('-start', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
				if (oTemplate.types.length !== pokemon.species.types.length || oTemplate.types[1] !== pokemon.species.types[1]) {
					this.battle.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}

			pokemon.canMegaEvo = null;
			if (isUltraBurst) pokemon.canUltraBurst = null;
			this.battle.runEvent('AfterMega', pokemon);
			return true;
		},
	},
	getMixedSpecies(originalSpecies, megaSpecies) {
		const originalTemplate = this.dex.species.get(originalSpecies);
		const megaTemplate = this.dex.species.get(megaSpecies);
		if (originalTemplate.baseSpecies === megaTemplate.baseSpecies) return megaTemplate;
		const deltas = this.getMegaDeltas(megaTemplate);
		return this.doGetMixedSpecies(originalTemplate, deltas);
	},
	getMegaDeltas(megaTemplate) {
		const baseTemplate = this.dex.species.get(megaTemplate.baseSpecies);
		const deltas: MegaDeltas = {
			abilities: megaTemplate.abilities,
			baseStats: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
			weighthg: megaTemplate.weighthg - baseTemplate.weighthg,
			originalMega: megaTemplate.name,
			requiredItem: megaTemplate.requiredItem,
		};
		let stat: StatID;
		for (stat in megaTemplate.baseStats) {
			deltas.baseStats[stat] = megaTemplate.baseStats[stat] - baseTemplate.baseStats[stat];
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
		if (!template || typeof template === 'string') template = this.dex.species.get(template);
		const newTemplate = this.dex.deepClone(template);
		newTemplate.abilities = deltas.abilities;
		if (template.types[0] === deltas.type) {
			newTemplate.types = [deltas.type];
		} else if (deltas.type) {
			newTemplate.types[1] = deltas.type;
		}
		const baseStats = template.baseStats;
		let stat: StatID;
		for (stat in baseStats) {
			newTemplate.baseStats[stat] = this.clampIntRange(baseStats[stat] + deltas.baseStats[stat], 1, 255);
		}
		newTemplate.weighthg = Math.max(1, template.weighthg + deltas.weighthg);
		newTemplate.originalMega = deltas.originalMega;
		newTemplate.requiredItem = deltas.requiredItem;
		if (deltas.isMega) {
			newTemplate.isMega = true;
			newTemplate.name += '-' + deltas.isMega;
		} else if (deltas.isPrimal) {
			newTemplate.isPrimal = true;
			newTemplate.name += '-Primal';
		}
		delete newTemplate.onType;
		return newTemplate;
	},
};
