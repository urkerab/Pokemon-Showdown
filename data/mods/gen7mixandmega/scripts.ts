export const Scripts: ModdedBattleScriptsData = {
	init() {
		for (const id in this.data.Items) {
			if (!this.data.Items[id].megaStone) continue;
			this.modData('Items', id).onTakeItem = false;
			/// this.modData('Items', id).isUnreleased = false;
		}
	},
	canMegaEvo(pokemon) {
		if (pokemon.baseSpecies.isMega || pokemon.baseSpecies.isPrimal || pokemon.baseSpecies.forme === 'Ultra') return null;

		const item = pokemon.getItem();
		if (item.megaStone) {
			if (item.megaStone === pokemon.baseSpecies.name) return null;
			return item.megaStone;
		} else if (pokemon.baseMoves.includes('dragonascent' as ID)) {
			return 'Rayquaza-Mega';
		} else {
			return null;
		}
	},
	runMegaEvo(pokemon) {
		if (pokemon.baseSpecies.isMega || pokemon.baseSpecies.isPrimal) return false;

		const isUltraBurst = !pokemon.canMegaEvo;
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
		if (this.dex.getSpecies(pokemon.canMegaEvo).baseSpecies !== pokemon.m.originalSpecies && !isUltraBurst) {
			const oTemplate = this.dex.getSpecies(pokemon.m.originalSpecies);
			this.add('-start', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			if (oTemplate.types.length !== pokemon.species.types.length || oTemplate.types[1] !== pokemon.species.types[1]) {
				this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
			}
		}

		pokemon.canMegaEvo = null;
		if (isUltraBurst) pokemon.canUltraBurst = null;
		return true;
	},
	getMixedSpecies(originalForme, megaForme) {
		const originalSpecies = this.dex.getSpecies(originalForme);
		const megaSpecies = this.dex.getSpecies(megaForme);
		if (originalSpecies.baseSpecies === megaSpecies.baseSpecies) return megaSpecies;
		const deltas = this.getMegaDeltas(megaSpecies);
		const species = this.doGetMixedSpecies(originalSpecies, deltas);
		return species;
	},
	getMegaDeltas(megaSpecies) {
		const baseSpecies = this.dex.getSpecies(megaSpecies.baseSpecies);
		const deltas: MegaDeltas = {
			abilities: megaSpecies.abilities,
			baseStats: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
			weighthg: megaSpecies.weighthg - baseSpecies.weighthg,
			originalMega: megaSpecies.name,
			requiredItem: megaSpecies.requiredItem,
		};
		let statId: StatName;
		for (statId in megaSpecies.baseStats) {
			deltas.baseStats[statId] = megaSpecies.baseStats[statId] - baseSpecies.baseStats[statId];
		}
		if (megaSpecies.types.length > baseSpecies.types.length) {
			deltas.type = megaSpecies.types[1];
		} else if (megaSpecies.types.length < baseSpecies.types.length) {
			deltas.type = baseSpecies.types[0];
		} else if (megaSpecies.types[1] !== baseSpecies.types[1]) {
			deltas.type = megaSpecies.types[1];
		}
		if (megaSpecies.isMega) deltas.isMega = megaSpecies.forme;
		if (megaSpecies.isPrimal) deltas.isPrimal = true;
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
	side: {
		chooseMove(moveText, targetLoc, megaOrZ) {
			this.choice.mega = false;
			return this.constructor.prototype.chooseMove.call(this, moveText, targetLoc, megaOrZ);
		},
	},
};
