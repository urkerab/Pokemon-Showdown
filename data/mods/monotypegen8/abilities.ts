export const Abilities: {[k: string]: ModdedAbilityData} = {
	"datamining": {
		desc: "On switch-in, this Pokemon reveals the opposing Pokemon's moveset.",
		shortDesc: "On switch-in, this Pokemon reveals the opposing Pokemon's moveset.",
		onStart(pokemon) {
			for (const target of pokemon.side.foe.active) {
				this.add('-ability', pokemon, 'Datamining');
				if (target.fainted) continue;
				this.add('-message', target.name + "'s moveset was revealed!");
				for (const moveSlot of target.moveSlots) {
					const thisMove = this.dex.getMove(moveSlot.move);
					this.add('-message', thisMove.name);
				}
			}
		},
		name: "Datamining",
		rating: 1,
		num: 3.5,
	},
	"calloused": {
		shortDesc: "This pokemon is immune to Stealth Rock and Spikes.",
		onDamage(damage, target, source, effect) {
			if (effect && ['stealthrock', 'spikes'].includes(effect.id)) {
				return false;
			}
		},
		name: "Calloused",
		rating: 3.5,
		num: 2.5,
	},
	"crystalcore": {
		shortDesc: "This Pokemon's attacks become Physical or Special, depending on which attacking stat is highest.",
		onModifyMove(move, attacker, defender) {
			if (move.category !== "Status") {
				move.category = attacker.getStat('atk', false, true) > attacker.getStat('spa', false, true) ? 'Physical' : 'Special';
			}
		},
		name: "Crystal Core",
		num: 1.5,
	},
	"frozenfire": {
		desc: "This Pokemon is immune to Fire-type moves. The first time it is hit by a Fire-type move, its attacking stat is multiplied by 1.5 while using an Ice-type attack as long as it remains active and has this Ability.",
		shortDesc: "This Pokemon's Ice attacks do 1.5x damage if hit by one Fire move; Fire immunity.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				move.accuracy = true;
				if (!target.addVolatile('frozenfire')) {
					this.add('-immune', target, '[msg]', '[from] ability: Frozen Fire');
				}
				return null;
			}
		},
		onEnd(pokemon) {
			pokemon.removeVolatile('frozenfire');
		},
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(target) {
				this.add('-start', target, 'ability: Frozen Fire');
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, attacker, defender, move) {
				if (move.type === 'Ice') {
					this.debug('Frozen Fire boost');
					return this.chainModify(1.5);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA(atk, attacker, defender, move) {
				if (move.type === 'Ice') {
					this.debug('Frozen Fire boost');
					return this.chainModify(1.5);
				}
			},
			onEnd(target) {
				if (target.isActive) this.add('-end', target, 'ability: Frozen Fire', '[silent]');
			},
		},
		name: "Frozen Fire",
		rating: 3,
		num: 18.5,
	},
	"majestic": {
		desc: "On switch-in, this Pokemon lowers the Special Attack of adjacent opposing Pokemon by 1 stage. Pokemon behind a substitute are immune.",
		shortDesc: "On switch-in, this Pokemon lowers the Special Attack of adjacent opponents by 1 stage.",
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.side.foe.active) {
				if (!target || !this.isAdjacent(target, pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Majestic', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target, '[msg]');
				} else {
					this.boost({spa: -1}, target, pokemon);
				}
			}
		},
		name: "Majestic",
		rating: 3.5,
		num: 22.5,
	},
	"disguise": {
		desc: "If this Pokemon is a Mimikyu or Spirisheet, the first hit it takes in battle deals 0 neutral damage. Its disguise is then broken and it changes to Busted Form. Confusion damage also breaks the disguise.",
		shortDesc: "If this Pokemon is a Mimikyu, the first hit it takes in battle deals 0 neutral damage.",
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (effect && effect.effectType === 'Move' &&
				['spirisheet', 'mimikyu', 'mimikyutotem'].includes(target.species.id) &&
				!target.transformed) {
				this.add('-activate', target, 'ability: Disguise');
				this.effectData.busted = true;
				return 0;
			}
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target) return;
			if (!['spirisheet', 'mimikyu', 'mimikyutotem'].includes(target.species.id) ||
				target.transformed ||
				(target.volatiles['substitute'] && !(move.flags['authentic'] || move.infiltrates))) {
				return;
			}
			if (!target.runImmunity(move.type)) return;
			return 0;
		},
		onUpdate(pokemon) {
			if (['mimikyu', 'mimikyutotem'].includes(pokemon.species.id) && this.effectData.busted) {
				const templateid = pokemon.species.id === 'mimikyutotem' ? 'Mimikyu-Busted-Totem' : 'Mimikyu-Busted';
				pokemon.formeChange(templateid, this.effect, true);
			}
			if (pokemon.species.id === 'spirisheet' && this.effectData.busted) {
				pokemon.formeChange('spirisheet-busted', this.effect, true);
			}
		},
		name: "Disguise",
		rating: 4,
		num: 209,
	},
	"bravado": {
		desc: "This Pokemon's SpA is raised by 1 stage if it attacks and knocks out another Pokemon.",
		shortDesc: "This Pokemon's SpA is raised by 1 stage if it attacks and KOes another Pokemon.",
		onSourceFaint(target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({spa: 1}, source);
			}
		},
		name: "Bravado",
		rating: 3.5,
		num: 153,
	},
	"antifreeze": {
		desc: "This pokemon is immune to Ice-type moves.",
		shortDesc: "This pokemon is immune to Ice-type moves.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Ice') {
				return null;
			}
		},
		name: "Antifreeze",
		rating: 3.5,
		num: 153,
	},
	"oceanic": {
		desc: "This pokemon is immune to Water-type moves and does 30% more damage with them.",
		shortDesc: "This pokemon is immune to Water-type moves and does 30% more damage with them.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				return null;
			}
		},
		onBasePower(basePower, pokemon, target, move) {
			if (move.type === 'Water') {
				return this.chainModify([0x14CD, 0x1000]);
			}
		},
		name: "Oceanic",
		rating: 3.5,
		num: 153,
	},
	"doublebarrel": {
		desc: "This pokemon's ballistic moves deal 50% more damage.",
		shortDesc: "This pokemon's ballistic moves deal 50% more damage.",
		onBasePower(basePower, pokemon, target, move) {
			if (move.flags['bullet']) {
				return this.chainModify(1.5);
			}
		},
		name: "Double Barrel",
		rating: 3.5,
		num: 153,
	},
};
