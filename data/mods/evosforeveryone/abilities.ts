export const Abilities: {[k: string]: ModdedAbilityData} = {
	"shieldsdown": {
		inherit: true,
		onStart(pokemon) {
			if ((pokemon.baseSpecies.baseSpecies !== 'Minior' &&
				 pokemon.baseSpecies.baseSpecies !== 'Chelyor') ||
				 pokemon.transformed) {
				return;
			}
			if (pokemon.hp > pokemon.maxhp / 2) {
				if (pokemon.species.id === 'minior') {
					pokemon.formeChange('Minior-Meteor');
				}
				if (pokemon.species.id === 'chelyor') {
					pokemon.formeChange('Chelyor-Meteor');
				}
			} else {
				if (pokemon.species.id !== 'minior') {
					pokemon.formeChange(pokemon.set.species);
				}
				if (pokemon.species.id !== 'chelyor') {
					pokemon.formeChange(pokemon.set.species);
				}
			}
		},
		onResidualOrder: 27,
		onResidual(pokemon) {
			if ((pokemon.baseSpecies.baseSpecies !== 'Minior' &&
				 pokemon.baseSpecies.baseSpecies !== 'Chelyor') ||
				pokemon.transformed ||
				!pokemon.hp) {
				return;
			}
			if (pokemon.hp > pokemon.maxhp / 2) {
				if (pokemon.species.id === 'minior') {
					pokemon.formeChange('Minior-Meteor');
				}
				if (pokemon.species.id === 'chelyor') {
					pokemon.formeChange('Chelyor-Meteor');
				}
			} else {
				if (pokemon.species.id !== 'minior') {
					pokemon.formeChange(pokemon.set.species);
				}
				if (pokemon.species.id !== 'chelyor') {
					pokemon.formeChange(pokemon.set.species);
				}
			}
		},
		onSetStatus(status, target, source, effect) {
			if ((target.species.id !== 'miniormeteor' &&
				 target.species.id !== 'chelyormeteor') ||
				target.transformed) {
				return;
			}
			if (!(effect as Move)?.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Shields Down');
			return false;
		},
		onTryAddVolatile(status, target) {
			if ((target.species.id !== 'miniormeteor' &&
				 target.species.id !== 'chelyormeteor') ||
				target.transformed) {
				return;
			}
			if (status.id !== 'yawn') return;
			this.add('-immune', target, '[msg]', '[from] ability: Shields Down');
			return null;
		},
	},
	"toxicglands": {
		shortDesc: "This Pokemon's bite moves have a 100% chance of badly poisoning.",
		// upokecenter says this is implemented as an added secondary effect
		onModifyMove(move) {
			if (!move || !move.flags['bite']) return;
			if (!move.secondaries) {
				move.secondaries = [];
			}
			move.secondaries.push({
				chance: 100,
				status: 'tox',
				ability: this.dex.getAbility('toxicglands'),
			});
		},
		name: "Toxic Glands",
		rating: 4,
		num: 10000,
	},
	"pixieshield": {
		shortDesc: "This Pokemon's Attack is raised 1 stage if hit by a Fairy move; Fairy immunity.",
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fairy') {
				if (!this.boost({atk: 1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Pixie Shield');
				}
				return null;
			}
		},
		onAllyTryHitSide(target, source, move) {
			if (target === this.effectData.target || target.side !== source.side) return;
			if (move.type === 'Fairy') {
				this.boost({atk: 1}, this.effectData.target);
			}
		},
		name: "Pixie Shield",
		rating: 3.5,
		num: 10001,
	},
	"psychicsurfer": {
		shortDesc: "If Psychic Terrain is active, this Pokemon's Speed is doubled.",
		onModifySpe(spe) {
			if (this.field.isTerrain('psychicterrain')) {
				return this.chainModify(2);
			}
		},
		name: "Psychic Surfer",
		rating: 2,
		num: 10002,
	},
	"sapdrain": {
		shortDesc: "This Pokemon's Special Attack is raised 1 stage if hit by a Grass move; Grass immunity.",
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Grass') {
				if (!this.boost({spa: 1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Sap Drain');
				}
				return null;
			}
		},
		onAllyTryHitSide(target, source, move) {
			if (target === this.effectData.target || target.side !== source.side) return;
			if (move.type === 'Grass') {
				this.boost({spa: 1}, this.effectData.target);
			}
		},
		name: "Sap Drain",
		rating: 3.5,
		num: 10003,
	},
	"castiron": {
		shortDesc: "This Pokemon receives 3/4 damage from supereffective attacks.",
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				this.debug('Cast Iron neutralize');
				return this.chainModify(0.75);
			}
		},
		name: "Cast Iron",
		rating: 3,
		num: 10004,
	},
	"mentaldrain": {
		shortDesc: "This Pokemon's Special Attack is raised 1 stage if hit by a Psychic move; Psychic immunity.",
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Psychic') {
				if (!this.boost({spa: 1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Mental Drain');
				}
				return null;
			}
		},
		onAllyTryHitSide(target, source, move) {
			if (target === this.effectData.target || target.side !== source.side) return;
			if (move.type === 'Psychic') {
				this.boost({spa: 1}, this.effectData.target);
			}
		},
		name: "Mental Drain",
		rating: 3.5,
		num: 10005,
	},
	"toxicbuildup": {
		shortDesc: "This Pokemon's Poison attacks do 1.5x damage if hit by one Poison move; Poison immunity.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Poison') {
				move.accuracy = true;
				if (!target.addVolatile('toxicbuildup')) {
					this.add('-immune', target, '[msg]', '[from] ability: Toxic Buildup');
				}
				return null;
			}
		},
		onEnd(pokemon) {
			pokemon.removeVolatile('toxicbuildup');
		},
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(target) {
				this.add('-start', target, 'ability: Toxic Buildup');
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, attacker, defender, move) {
				if (move.type === 'Poison') {
					this.debug('Toxic Buildup boost');
					return this.chainModify(1.5);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA(atk, attacker, defender, move) {
				if (move.type === 'Poison') {
					this.debug('Toxic Buildup boost');
					return this.chainModify(1.5);
				}
			},
			onEnd(target) {
				this.add('-end', target, 'ability: Toxic Buildup', '[silent]');
			},
		},
		name: "Toxic Buildup",
		rating: 3,
		num: 10006,
	},
	"combobreaker": {
		shortDesc: "This pokemon takes 3/4 damage from contact moves and lowers the opponent's Speed 1 stage when hit by one.",
		onSourceModifyDamage(damage, source, target, move) {
			let mod = 1;
			if (move.flags['contact']) mod *= 0.75;
			return this.chainModify(mod);
		},
		onDamagingHit(damage, target, source, effect) {
			if (effect?.flags['contact']) {
				this.add('-ability', target, 'Combo Breaker');
				this.boost({spe: -1}, source, target, null, true);
			}
		},
		name: "Combo Breaker",
		rating: 3.5,
		num: 10007,
	},
	"angeredcharge": {
		shortDesc: "This pokemon's Speed and Attack are raised by 10%, but it can't switch moves.",
		onDisableMove(pokemon) {
			for (const moveSlot of pokemon.moveSlots) {
				if (pokemon.lastMove && pokemon.lastMove.id !== moveSlot.id) {
					pokemon.disableMove(moveSlot.id);
				}
			}
		},
		onModifyAtkPriority: 1,
		onModifyAtk(atk) {
			return this.chainModify(1.1);
		},
		onModifySpePriority: 1,
		onModifySpe(spe) {
			return this.chainModify(1.1);
		},
		name: "Angered Charge",
		rating: 3.5,
		num: 10008,
	},
	"volatile": {
		shortDesc: "Raises Special Attack and lowers Special Defense by 1 stage after it is damaged by a move.",
		onDamagingHit(damage, target, source, effect) {
			if (effect && effect.effectType === 'Move' && effect.id !== 'confused') {
				this.boost({spa: 1});
				this.boost({spd: -1});
			}
		},
		name: "Volatile",
		rating: 3,
		num: 10009,
	},
	"lowcentreofgravity": {
		desc: "If a Pokemon uses a Figthing- or Ground-type attack against this Pokemon, that Pokemon's attacking stat is halved when calculating the damage to this Pokemon.",
		shortDesc: "Figthing/Ground-type moves against this Pokemon deal damage with a halved attacking stat.",
		onModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Figthing' || move.type === 'Ground') {
				this.debug('Low Centre of Gravity weaken');
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Figthing' || move.type === 'Ground') {
				this.debug('Low Centre of Gravity weaken');
				return this.chainModify(0.5);
			}
		},
		name: "Low Centre of Gravity",
		rating: 3.5,
		num: 10010,
	},
	"cheeron": {
		shortDesc: "This Pokemon's Special Defense is raised by 1 stage after it is damaged by a move.",
		onDamagingHit(damage, target, source, effect) {
			if (effect && effect.effectType === 'Move' && effect.id !== 'confused') {
				this.boost({spd: 1});
			}
		},
		name: "Cheer On",
		rating: 3,
		num: 10011,
	},
	"fighton": {
		shortDesc: "This Pokemon's Special Attack is raised by 1 stage after it is damaged by a move.",
		onDamagingHit(damage, target, source, effect) {
			if (effect && effect.effectType === 'Move' && effect.id !== 'confused') {
				this.boost({spa: 1});
			}
		},
		name: "Fight On",
		rating: 3,
		num: 10012,
	},
	"enfeeble": {
		desc: "On switch-in, this Pokemon lowers the Special Attack of adjacent opposing Pokemon by 1 stage. Pokemon behind a substitute are immune.",
		shortDesc: "On switch-in, this Pokemon lowers the Special Attack of adjacent opponents by 1 stage.",
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.side.foe.active) {
				if (!target || !this.isAdjacent(target, pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Enfeeble', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target, '[msg]');
				} else {
					this.boost({spa: -1}, target, pokemon);
				}
			}
		},
		name: "Enfeeble",
		rating: 3.5,
		num: 22,
	},
	"wintersgift": {
		desc: "Raises the Special Attack and Defense of this pokemon and any allies on the field, if Hail is in effect.",
		shortDesc: "Raises SpA and Def of self and allies in Hail.",
		onStart(pokemon) {
			delete this.effectData.forme;
		},
		onModifySpAPriority: 3,
		onAllyModifySpA(spa) {
			if (this.field.isWeather('hail')) {
				return this.chainModify(1.5);
			}
		},
		onModifyDefPriority: 4,
		onAllyModifyDef(def) {
			if (this.field.isWeather('hail')) {
				return this.chainModify(1.5);
			}
		},
		name: "Winter's Gift",
		rating: 2.5,
		num: 122,
	},
	"blueice": {
		desc: "This Pokemon is immune to Fighting-type moves.",
		shortDesc: "Fighting immunity.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fighting') {
				this.add('-immune', target, '[msg]', '[from] ability: Blue Ice');
				return null;
			}
		},
		name: "Blue Ice",
		rating: 3.5,
		num: 10,
	},
	"battlespirit": {
		shortDesc: "This Pokemon's attacking stat is multiplied by 1.5 while using a Steel-type attack.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fighting') {
				this.debug('Battle Spirit boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fighting') {
				this.debug('Battle Spirit boost');
				return this.chainModify(1.5);
			}
		},
		name: "Battle Spirit",
		rating: 3,
		num: 200,
	},
	"ramifications": {
		desc: "If a Pokemon uses a Dragon- or Rock-type attack against this Pokemon, that Pokemon's attacking stat is halved when calculating the damage to this Pokemon.",
		shortDesc: "Dragon/Rock-type moves against this Pokemon deal damage with a halved attacking stat.",
		onModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Dragon' || move.type === 'Rock') {
				this.debug('Ramifications weaken');
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Dragon' || move.type === 'Rock') {
				this.debug('Ramifications weaken');
				return this.chainModify(0.5);
			}
		},
		name: "Ramifications",
		rating: 3.5,
		num: 47,
	},
	"cloudysurge": {
		shortDesc: "On switch-in, this Pokemon summons Cloudy Terrain.",
		onStart(source) {
			this.field.setTerrain('cloudyterrain');
		},
		name: "Cloudy Surge",
		rating: 4,
		num: 228,
	},
	"incendiary": {
		shortDesc: "This Pokemon's attacks are critical hits if the target is poisoned.",
		onModifyCritRatio(critRatio, source, target) {
			if (target && ['brn'].includes(target.status)) return 5;
		},
		name: "Incendiary",
		rating: 2,
		num: 196,
	},
	"atmospear": {
		desc: "This Pokemon's changes its secondary type to match the move if it uses a Water-, Ice- or Fire-type move, and also summons Rain, Hail, or Sun at the same time.",
		shortDesc: "This Pokemon's changes its secondary type and summons weather if it uses a Water-, Ice-, or Fire-type attack.",
		onPrepareHit(source, target, move) {
			if (move.hasBounced) return;
			const type = move.type;
			if (type && (type === 'Fire' || type === 'Ice' || type === 'Water')) {
				if (!source.getTypes().includes(type)) {
					source.setType("Flying");
					source.addType(type);
					let newType = "Flying/";
					newType += type;
					this.add('-start', source, 'typechange', newType, '[from] Atmospear');
				}
				if (move.type === 'Fire' && !this.field.isWeather('sunnyday')) this.field.setWeather('sunnyday');
				if (move.type === 'Water' && !this.field.isWeather('raindance')) this.field.setWeather('raindance');
				if (move.type === 'Ice' && !this.field.isWeather('hail')) this.field.setWeather('hail');
				if (move.id === "blizzard") move.accuracy = true;
			}
		},
		name: "Atmospear",
		rating: 4.5,
		num: 168,
	},
	"defibrillator": {
		shortDesc: "No competitive use.",
		name: "Defibrillator",
		rating: 0,
		num: 118,
	},
	"survivor": {
		desc: "If this Pokemon is poisoned, its Defense and Special Defense are multiplied by 1.2.",
		shortDesc: "If this Pokemon is poisoned, its Def and SpD are boosted by 20%.",
		onModifyDefPriority: 5,
		onModifyDef(atk, pokemon) {
			if (pokemon.status === 'psn' || pokemon.status === 'tox') {
				return this.chainModify(1.2);
			}
		},
		onModifySpDPriority: 5,
		onModifySpD(atk, pokemon) {
			if (pokemon.status === 'psn' || pokemon.status === 'tox') {
				return this.chainModify(1.2);
			}
		},
		onDamage(damage, target, source, effect) {
			if (effect.id === 'psn' || effect.id === 'tox') {
				return false;
			}
		},
		name: "Survivor",
		rating: 3,
		num: 62,
	},
	"vengeful": {
		shortDesc: "This pokemon gains +1 attack when it lands a resisted attack. Resisted attacks deal 25% less damage.",
		onModifyDamage(damage, source, target, move) {
			if (move && target.getMoveHitData(move).typeMod < 0) {
				this.boost({atk: 1});
				return this.chainModify(0.75);
			}
		},
		name: "Vengeful",
		rating: 3,
		num: 233,
	},
	"stinger": {
		desc: "This Pokemon's tail-based attacks have perfect accuracy and a 30% chance to badly poison their target.",
		shortDesc: "This Pokemon's tail-based attacks have 1.2x power. Sucker Punch is not boosted.",
		onModifyMovePriority: -1,
		onModifyMove(move) {
			if (!move || !move.flags['tail']) return;
			move.accuracy = 100;
			if (!move.secondaries) {
				move.secondaries = [];
			}
			move.secondaries.push({
				chance: 30,
				status: 'tox',
				ability: this.dex.getAbility('stinger'),
			});
		},
		name: "Stinger",
		rating: 3,
		num: 89,
	},
	"cornered": {
		desc: "Boosts the Base Power of attacks by adding up to 33 BP, depending on how low the user's HP is.",
		shortDesc: "Boosts the Base Power of attacks by adding up to 33 BP, depending on how low the user's HP is.",
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) {
			const hpPercent = 1 - ((attacker.hp - 1) / (attacker.maxhp - 1));
			const bpBoost = hpPercent * 33;
			const finalPower = basePower + bpBoost;
			return finalPower;
		},
		name: "Cornered",
		rating: 2.5,
		num: 138,
	},
	"anchored": {
		shortDesc: "No competitive use.",
		name: "Anchored",
		rating: 0,
		num: 118,
	},
	"waterwheel": {
		shortDesc: "This Pokemon's attacking stat is multiplied by 1.5 while using a Water-type attack.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				this.debug('Waterwheel boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				this.debug('Waterwheel boost');
				return this.chainModify(1.5);
			}
		},
		name: "Waterwheel",
		rating: 3,
		num: 200,
	},
	"mindbend": {
		shortDesc: "Inverts this pokemon's defensive type matchups.",
		name: "Mind Bend",
		onStart(source) {
			this.field.addPseudoWeather('mindbend');
		},
		onSwitchOut(source) {
			this.field.removePseudoWeather('mindbend');
		},
		rating: 0,
		num: 118,
	},
	"psychophant": {
		desc: "Upon landing an attack, this pokemon passes its stat drops and staus conditions to the target.",
		shortDesc: "This pokemon's attacks pass its stat drops and staus conditions to the target.",
		onSourceHit(target, source, move) {
			if (!move || !target) return;
			if (target !== source && move.category !== 'Status') {
				const targetBoosts: SparseBoostsTable = {};
				const sourceBoosts: SparseBoostsTable = {};

				let i: BoostName;
				for (i in target.boosts) {
					if (target.boosts[i] < 0) targetBoosts[i] = target.boosts[i];
					if (source.boosts[i] < 0) sourceBoosts[i] = source.boosts[i];
				}

				target.setBoost(sourceBoosts);
				source.setBoost(targetBoosts);

				this.add('-swapboost', source, target, '[from] ability: Psychophant');

				if (source.status) {
					if (target.trySetStatus(source.status, target.side.foe.active[0])) source.cureStatus();
				}
			}
		},
		name: "Psychophant",
		rating: 1.5,
		num: 170,
	},
	"burrowing": {
		shortDesc: "On switch-in, this Pokemon summons Rain Dance.",
		onStart(source) {
			source.addVolatile('burrow');
		},
		name: "Burrowing",
		rating: 4.5,
		num: 2,
	},
	"parrotvoice": {
		desc: "This Pokemon's sound-based moves become Flying-type moves. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's sound-based moves become Flying type.",
		onModifyMovePriority: -1,
		onModifyMove(move) {
			if (move.flags['sound']) {
				move.type = 'Flying';
			}
		},
		name: "Parrot Voice",
		rating: 2.5,
		num: 204,
	},
	"unfazed": {
		desc: "If a Pokemon uses a Bug- or Dark-type attack against this Pokemon, that Pokemon's attacking stat is halved when calculating the damage to this Pokemon.",
		shortDesc: "Bug/Dark-type moves against this Pokemon deal damage with a halved attacking stat.",
		onModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Bug' || move.type === 'Dark') {
				this.debug('Unfazed weaken');
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Bug' || move.type === 'Dark') {
				this.debug('Unfazed weaken');
				return this.chainModify(0.5);
			}
		},
		name: "Unfazed",
		rating: 3.5,
		num: 47,
	},
	"paintstroke": {
		desc: "When this pokemon uses a move, the opponents type changes to match that move.",
		shortDesc: "This pokemon's attacks pass its stat drops and staus conditions to the target.",
		onSourceHit(target, source, move) {
			if (!target.setType(move.type) || target === source) return false;
			this.add('-start', target, 'typechange', move.type);
		},
		name: "Paint Stroke",
		rating: 1.5,
		num: 170,
	},
	"zerogravity": {
		desc: "Upon landing an attack, this pokemon passes its stat drops and staus conditions to the target.",
		shortDesc: "This pokemon's attacks pass its stat drops and staus conditions to the target.",
		onStart(source) {
			this.field.addPseudoWeather('antigravity');
		},
		name: "Zero Gravity",
		rating: 1.5,
		num: 170,
	},
	"fortresswall": {
		shortDesc: "This pokemon's Speed and Attack are raised by 10%, but it can't switch moves.",
		onDisableMove(pokemon) {
			for (const moveSlot of pokemon.moveSlots) {
				const move = this.dex.getMove(moveSlot.move);
				if (move.category === "Status") pokemon.disableMove(moveSlot.id);
			}
		},
		onModifyAtkPriority: 1,
		onModifyAtk(atk) {
			return this.chainModify(1.1);
		},
		onModifyDefPriority: 1,
		onModifyDef(spe) {
			return this.chainModify(1.1);
		},
		name: "Fortress Wall",
		rating: 3.5,
		num: 10008,
	},
};
