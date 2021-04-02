export const Items: {[k: string]: ModdedItemData} = {
	brightpowder: {
		inherit: true,
		onAccuracy() {},
		onModifyDefPriority: 2,
		onModifyDef(def, pokemon) {
			return this.chainModify(1.1);
		},
		onModifySpDPriority: 2,
		onModifySpD(spd, pokemon) {
			return this.chainModify(1.1);
		},
	},
	laxincense: {
		inherit: true,
		onAccuracy() {},
		onModifyDefPriority: 2,
		onModifyDef(def, pokemon) {
			return this.chainModify(1.1);
		},
		onModifySpDPriority: 2,
		onModifySpD(spd, pokemon) {
			return this.chainModify(1.1);
		},
	},
	luckypunch: {
		inherit: true,
		onModifyAtkPriority: 2,
		onModifyAtk(atk, pokemon) {
			if (pokemon.species.name === 'Chansey') return this.chainModify(1.25);
		},
		onModifySpAPriority: 2,
		onModifySpA(spa, pokemon) {
			if (pokemon.species.name === 'Chansey') return this.chainModify(1.25);
		},
	},
	micleberry: {
		inherit: true,
		condition: {
			duration: 2,
			onModifyAtkPriority: 2,
			onModifyAtk(atk, pokemon) {
				return this.chainModify(1.2);
			},
			onModifySpAPriority: 2,
			onModifySpA(spa, pokemon) {
				return this.chainModify(1.2);
			},
		},
	},
	quickclaw: {
		inherit: true,
		onModifyPriority() {},
		onModifyMove(move) {
			if (!move.secondaries) move.secondaries = [];
			for (const secondary of move.secondaries) {
				if (secondary.boosts && secondary.boosts.spe) return;
			}
			move.secondaries.push({
				chance: 20,
				boosts: {spe: 1},
			});
		},
	},
	razorclaw: {
		inherit: true,
		onModifyAtkPriority: 2,
		onModifyAtk(atk, pokemon) {
			return this.chainModify(1.125);
		},
		onModifySpAPriority: 2,
		onModifySpA(spa, pokemon) {
			return this.chainModify(1.125);
		},
	},
	scopelens: {
		inherit: true,
		onModifyAtkPriority: 2,
		onModifyAtk(atk, pokemon) {
			return this.chainModify(1.125);
		},
		onModifySpAPriority: 2,
		onModifySpA(spa, pokemon) {
			return this.chainModify(1.125);
		},
	},
	starfberry: {
		inherit: true,
		onEat(pokemon) {
			let toBoost: BoostID = 'atk';
			let previousMax = pokemon.baseStoredStats.atk;
			let i: StatIDExceptHP;
			for (i in pokemon.storedStats) {
				if (pokemon.baseStoredStats[i] > previousMax && pokemon.boosts[i] < 6) {
					toBoost = i;
					previousMax = pokemon.baseStoredStats[i];
				}
			}
			const boost: SparseBoostsTable = {};
			boost[toBoost] = 2;
			this.boost(boost);
		},
	},
	stick: {
		inherit: true,
		onModifyAtkPriority: 2,
		onModifyAtk(atk, pokemon) {
			if (pokemon.species.name === "Farfetch'd") return this.chainModify(1.25);
		},
		onModifySpAPriority: 2,
		onModifySpA(spa, pokemon) {
			if (pokemon.species.name === "Farfetch'd") return this.chainModify(1.25);
		},
	},
	widelens: {
		inherit: true,
		onModifyAtkPriority: 2,
		onModifyAtk(atk, pokemon) {
			return this.chainModify(1.1);
		},
		onModifySpAPriority: 2,
		onModifySpA(spa, pokemon) {
			return this.chainModify(1.1);
		},
	},
	zoomlens: {
		inherit: true,
		onModifyMove(move, user, target) {
			if (typeof move.basePower === 'number' && target && !this.queue.willMove(target)) {
				this.debug('Zoom Lens boosting power');
				move.basePower *= 1.2;
			}
		},
	},
};
