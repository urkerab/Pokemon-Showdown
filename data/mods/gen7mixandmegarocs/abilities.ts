export const Abilities: {[k: string]: ModdedAbilityData} = {
	acidify: {
		name: "Acidify",
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Poison';
				move.acidifyBoosted = true;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.acidifyBoosted) return this.chainModify([4915, 4096]);
		},
		desc: "This Pokemon's Normal-type moves become Poison-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Poison type and have 1.2x power.",
	},
	artistsblock: {
		name: "Artist's Block",
		onAnyDisableMove(pokemon) {
			if (pokemon !== this.effectState.target) {
				for (const moveSlot of this.effectState.target.moveSlots) {
					if (moveSlot.id === 'struggle') continue;
					pokemon.disableMove(moveSlot.id, 'hidden');
					if (this.effectState.target.maybeDisabled) {
						this.effectState.target.disableMove(moveSlot.id, 'hidden');
					} else {
						if (!this.effectState.blocked) this.effectState.blocked = [];
						this.effectState.blocked.push(moveSlot.id);
					}
				}
			} else if (this.effectState.blocked) {
				for (const move of this.effectState.blocked) pokemon.disableMove(move);
				delete this.effectState.blocked;
			}
			pokemon.maybeDisabled = true;
		},
		desc: "The user prevents all other Pokemon from using any moves that the user also knows as long as the user remains active and vice versa. Z-Powered moves can still be selected and executed during this effect.",
		shortDesc: "No other Pokémon can use any move known by the user and vice versa.",
	},
	bullcharge: {
		name: "Bull Charge",
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') source.removeVolatile('mustrecharge');
		},
		desc: "This Pokemon's moves that require recharge skip their recharge turn if they get a kill that turn.",
	},
	corruption: {
		name: "Corruption",
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Dark';
				move.corruptionBoosted = true;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.corruptionBoosted) return this.chainModify([4915, 4096]);
		},
		desc: "This Pokemon's Normal-type moves become Dark-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Dark type and have 1.2x power.",
	},
	deltastream: {
		inherit: true,
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'dusttempest', 'primordialsea', 'deltastream'];
			if (this.field.getWeather().id === 'deltastream' && !strongWeathers.includes(weather.id)) return false;
		},
		desc: "On switch-in, the weather becomes strong winds that remove the weaknesses of the Flying type from Flying-type Pokemon. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Desolate Land, Priaml Sand or Primordial Sea.",
	},
	desolateland: {
		inherit: true,
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'dusttempest', 'primordialsea', 'deltastream'];
			if (this.field.getWeather().id === 'desolateland' && !strongWeathers.includes(weather.id)) return false;
		},
		desc: "On switch-in, the weather becomes extremely harsh sunlight that prevents damaging Water-type moves from executing, in addition to all the effects of Sunny Day. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Delta Stream, Primal Sand or Primordial Sea.",
	},
	dizzyingsight: {
		name: "Dizzying Sight",
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Dizzying Sight', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({spa: -1}, target, pokemon, null, true);
				}
			}
		},
		desc: "On switch-in, this Pokemon lowers the Sp. Atk of adjacent opponents by 1 stage. Pokemon behind a substitute are immune.",
		shortDesc: "On switch-in, this Pokemon lowers the Sp. Atk of adjacent opponents by 1 stage.",
	},
	draconize: {
		name: "Draconize",
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Dragon';
				move.draconizeBoosted = true;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.draconizeBoosted) return this.chainModify([4915, 4096]);
		},
		desc: "This Pokemon's Normal-type moves become Dragon-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Dragon type and have 1.2x power.",
	},
	dusttempest: {
		name: "Dust Tempest",
		onStart(source) {
			this.field.setWeather('dusttempest');
		},
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'dusttempest', 'primordialsea', 'deltastream'];
			if (this.field.getWeather().id === 'dusttempest' && !strongWeathers.includes(weather.id)) return false;
		},
		onEnd(pokemon) {
			if (this.field.weatherState.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('dusttempest')) {
					this.field.weatherState.source = target;
					return;
				}
			}
			this.field.clearWeather();
		},
		desc: "On switch-in, the weather becomes sandstorm. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Delta Stream, Desolate Land or Primordial Sea.",
		shortDesc: "On switch-in, sandstorm begins until this Ability is not active in battle.",
	},
	explosivevoice: {
		name: "Explosive Voice",
		onBasePowerPriority: 7,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['sound']) {
				this.debug('Explosive Voice boost');
				return this.chainModify([5325, 4096]);
			}
		},
		desc: "This Pokemon's sound-based moves have their power multiplied by 1.3.",
	},
	incendiary: {
		name: "Incendiary",
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Fire';
				move.incendiaryBoosted = true;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.incendiaryBoosted) return this.chainModify([4915, 4096]);
		},
		desc: "This Pokemon's Normal-type moves become Fire-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Fire type and have 1.2x power.",
	},
	liquidize: {
		name: "Liquidize",
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Water';
				move.liquidizeBoosted = true;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.liquidizeBoosted) return this.chainModify([4915, 4096]);
		},
		desc: "This Pokemon's Normal-type moves become Water-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Water type and have 1.2x power.",
	},
	luchalibre: {
		name: "Lucha Libre",
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.type === 'Fighting' && pokemon.hp * 5 >= pokemon.maxhp * 3) return priority + 1;
		},
		shortDesc: "If this Pokemon has at least 60% HP, its Fighting-type moves have their priority increased by 1.",
	},
	overcoat: {
		inherit: true,
		onImmunity(type, pokemon) {
			if (type === 'dusttempest' || type === 'sandstorm' || type === 'hail' || type === 'powder') return false;
		},
	},
	predatorseye: {
		name: "Predator's Eye",
		onBasePower(basePower, pokemon, target, move) {
			if (target.runEffectiveness(move) > 0) return this.chainModify([5325, 4096]);
		},
		onSourceAccuracyPriority: -1,
		onSourceAccuracy(accuracy, target, source, move) {
			if (target.runEffectiveness(move) > 0) return true;
			return accuracy;
		},
		desc: "This Pokemon's super-effective moves do not check accuracy and have 1.3x power.",
	},
	primordialsea: {
		inherit: true,
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'dusttempest', 'primordialsea', 'deltastream'];
			if (this.field.getWeather().id === 'primordialsea' && !strongWeathers.includes(weather.id)) return false;
		},
		desc: "On switch-in, the weather becomes heavy rain that prevents damaging Fire-type moves from executing, in addition to all the effects of Rain Dance. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Delta Stream, Desolate Land or Primal Sand.",
	},
	rocketlaunch: {
		name: "Rocket Launch",
		onBasePowerPriority: 20,
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.volatiles['twoturnmove']) return this.chainModify(2);
		},
		desc: "This Pokémon's charging moves have double power.",
	},
	sandforce: {
		inherit: true,
		onBasePower(basePower, attacker, defender, move) {
			if (this.field.isWeather(['dusttempest', 'sandstorm'])) {
				if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel') {
					this.debug('Sand Force boost');
					return this.chainModify([5325, 4096]);
				}
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'dusttempest' || type === 'sandstorm') return false;
		},
	},
	sandrush: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather(['dusttempest', 'sandstorm'])) {
				return this.chainModify(2);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'dusttempest' || type === 'sandstorm') return false;
		},
	},
	sandveil: {
		inherit: true,
		onImmunity(type, pokemon) {
			if (type === 'dusttempest' || type === 'sandstorm') return false;
		},
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.field.isWeather(['dusttempest', 'sandstorm'])) {
				this.debug('Sand Veil - decreasing accuracy');
				return this.chainModify([3277, 4096]);
			}
		},
	},
	savvy: {
		name: "Savvy",
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({spa: length}, source);
			}
		},
		desc: "This Pokemon's Special Attack is raised by 1 stage if it attacks and knocks out another Pokemon.",
	},
	sixthsense: {
		name: "Sixth Sense",
		onStart(pokemon) {
			let totalatk = 0;
			let totalspa = 0;
			for (const target of pokemon.foes()) {
				totalatk += target.getStat('atk', false, true);
				totalspa += target.getStat('spa', false, true);
			}
			if (totalspa && totalspa >= totalatk) {
				this.boost({spd: 1});
			} else if (totalatk) {
				this.boost({def: 1});
			}
		},
		desc: "On switch-in, this Pokemon's Defense or Special Defense is raised by 1 stage based on the stronger combined attacking stat of all opposing Pokemon. Defense is raised if their Attack is higher, and Special Defense is raised if their Special Attack is the same or higher.",
	},
	speciality: {
		name: "Speciality",
		onStart(pokemon) {
			pokemon.abilityState.choiceLock = "";
		},
		onBeforeMove(pokemon, target, move) {
			if (move.isZOrMaxPowered || move.id === 'struggle') return;
			if (pokemon.abilityState.choiceLock && pokemon.abilityState.choiceLock !== move.id) {
				// Fails unless ability is being ignored (these events will not run), no PP lost.
				this.addMove('move', pokemon, move.name);
				this.attrLastMove('[still]');
				this.debug("Disabled by Speciality");
				this.add('-fail', pokemon);
				return false;
			}
		},
		onModifyMove(move, pokemon) {
			if (pokemon.abilityState.choiceLock || move.isZOrMaxPowered || move.id === 'struggle') return;
			pokemon.abilityState.choiceLock = move.id;
		},
		onModifySpAPriority: 1,
		onModifySpA(atk, pokemon) {
			if (pokemon.volatiles['dynamax']) return;
			// PLACEHOLDER
			this.debug('Speciality SpA Boost');
			return this.chainModify(1.5);
		},
		onDisableMove(pokemon) {
			if (!pokemon.abilityState.choiceLock) return;
			if (pokemon.volatiles['dynamax']) return;
			for (const moveSlot of pokemon.moveSlots) {
				if (moveSlot.id !== pokemon.abilityState.choiceLock) {
					pokemon.disableMove(moveSlot.id, false, this.effectState.sourceEffect);
				}
			}
		},
		onEnd(pokemon) {
			pokemon.abilityState.choiceLock = "";
		},
		desc: "This Pokemon's Special Attack is 1.5x, but it can only select the first move it executes.",
	},
	strikemaster: {
		name: "Strike Master",
		onModifyMove(move) {
			if (move.type === "Fighting") move.accuracy = true;
		},
		onModifyCritRatio(critRatio, source, target, move) {
			if (move.type === "Fighting") return critRatio + 1;
		},
		desc: "This Pokemon's Fighting-type moves have their critical hit rate boosted by one stage and do not check accuracy.",
	},
	suppressingspores: {
		name: "Suppressing Spores",
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Intimidate', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({spa: -1}, target, pokemon, null, true);
				}
			}
		},
		desc: "On switch-in, this Pokemon lowers the Special Attack of adjacent opposing Pokemon by 1 stage. Pokemon behind a substitute are immune.",
		shortDesc: "On switch-in, this Pokemon lowers the Sp. Atk of adjacent opponents by 1 stage.",
	},
};
