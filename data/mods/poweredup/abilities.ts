export const Abilities: {[k: string]: ModdedAbilityData} = {
	"adaptability": {
		inherit: true,
		desc: "This Pokemon's moves that match one of its types have a same-type attack bonus (STAB) of 2.5 instead of 1.5.",
		shortDesc: "This Pokemon's same-type attack bonus (STAB) is 2.5 instead of 1.5.",
		onModifyMove(move) {
			move.stab = 2.5;
		},
	},
	"aftermath": {
		inherit: true,
		desc: "If this Pokemon is knocked out with a contact move, that move's user loses 1/3 of its maximum HP, rounded down. If any active Pokemon has the Ability Damp, this effect is prevented.",
		shortDesc: "If this Pokemon is KOed with a contact move, that move's user loses 1/3 its max HP.",
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact'] && !target.hp) {
				this.damage(source.maxhp / 3, source, target, null, true);
			}
		},
	},
	"aerilate": {
		inherit: true,
		desc: "This Pokemon's Normal-type moves become Flying-type moves and have their power multiplied by 1.6. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Flying type and have 1.6x power.",
		onModifyMovePriority: -1,
		onModifyMove(move, pokemon) {
			if (move.type === 'Normal' && move.id !== 'naturalgift') {
				move.type = 'Flying';
				if (move.category !== 'Status') pokemon.addVolatile('aerilate');
			}
		},
		condition: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower(basePower, pokemon, target, move) {
				return this.chainModify([0x199A, 0x1000]);
			},
		},
	},
	"analytic": {
		inherit: true,
		desc: "The power of this Pokemon's move is multiplied by 1.6 if it is the last to move in a turn. Does not affect Doom Desire and Future Sight.",
		shortDesc: "This Pokemon's attacks have 1.6x power if it is the last to move in a turn.",
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) {
			if (!this.queue.willMove(defender)) {
				this.debug('Analytic boost');
				return this.chainModify([0x199A, 0x1000]);
			}
		},
	},
	"aurabreak": {
		inherit: true,
		desc: "While this Pokemon is active, the effects of the Abilities Dark Aura and Fairy Aura are reversed, multiplying the power of Dark- and Fairy-type moves, respectively, by 3/5 instead of 1.33.",
		shortDesc: "While this Pokemon is active, the Dark Aura and Fairy Aura power modifier is 0.6x.",
	},
	"baddreams": {
		inherit: true,
		desc: "Causes adjacent opposing Pokemon to lose 1/6 of their maximum HP, rounded down, at the end of each turn if they are asleep.",
		shortDesc: "Causes sleeping adjacent foes to lose 1/6 of their max HP at the end of each turn.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			if (!pokemon.hp) return;
			for (const target of pokemon.side.foe.active) {
				if (!target || !target.hp) continue;
				if (target.status === 'slp') {
					this.damage(target.maxhp / 6, target, pokemon);
				}
			}
		},
	},
	"blaze": {
		inherit: true,
		desc: "When this Pokemon has 1/2 or less of its maximum HP, rounded down, its attacking stat is multiplied by 2 while using a Fire-type attack.",
		shortDesc: "When this Pokemon has 1/2 or less of its max HP, its Fire attacks do 2x damage.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 2) {
				this.debug('Blaze boost');
				return this.chainModify(2);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 2) {
				this.debug('Blaze boost');
				return this.chainModify(1.5);
			}
		},
	},
	"cheekpouch": {
		inherit: true,
		desc: "If this Pokemon eats a Berry, it restores 1/2 of its maximum HP, rounded down, in addition to the Berry's effect.",
		shortDesc: "If this Pokemon eats a Berry, it restores 1/2 of its max HP after the Berry's effect.",
		onEatItem(item, pokemon) {
			this.heal(pokemon.maxhp / 2);
		},
	},
	"chlorophyll": {
		inherit: true,
		shortDesc: "If Sunny Day is active, this Pokemon's Speed is trebled.",
		onModifySpe(spe) {
			if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(3);
			}
		},
	},
	"competitive": {
		inherit: true,
		desc: "This Pokemon's Special Attack is raised by 3 stages for each of its stat stages that is lowered by an opposing Pokemon.",
		shortDesc: "This Pokemon's Sp. Atk is raised by 3 for each of its stats that is lowered by a foe.",
		onAfterEachBoost(boost, target, source) {
			if (!source || target.side === source.side) {
				return;
			}
			let statsLowered = false;
			let i: BoostName;
			for (i in boost) {
				if (boost[i]! < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.add('-ability', target, 'Competitive');
				this.boost({spa: 3}, target, target, null, true);
			}
		},
	},
	"compoundeyes": {
		inherit: true,
		shortDesc: "This Pokemon's moves have their accuracy multiplied by 1.6.",
		onSourceModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('compoundeyes - enhancing accuracy');
			return accuracy * 1.6;
		},
	},
	"cursedbody": {
		inherit: true,
		desc: "If this Pokemon is hit by an attack, there is a 60% chance that move gets disabled unless one of the attacker's moves is already disabled.",
		shortDesc: "If this Pokemon is hit by an attack, there is a 60% chance that move gets disabled.",
		onDamagingHit(damage, target, source, move) {
			if (!source || source.volatiles['disable']) return;
			if (source !== target && move && move.effectType === 'Move') {
				if (this.random(10) < 6) {
					source.addVolatile('disable');
				}
			}
		},
	},
	"cutecharm": {
		inherit: true,
		desc: "There is a 60% chance a Pokemon making contact with this Pokemon will become infatuated if it is of the opposite gender.",
		shortDesc: "60% chance of infatuating Pokemon of the opposite gender if they make contact.",
		onDamagingHit(damage, target, source, move) {
			if (move?.flags['contact']) {
				if (this.random(10) < 6) {
					source.addVolatile('attract', target);
				}
			}
		},
	},
	"darkaura": {
		inherit: true,
		desc: "While this Pokemon is active, the power of Dark-type moves used by active Pokemon is multiplied by 1.66.",
		shortDesc: "While this Pokemon is active, a Dark move used by any Pokemon has 1.66x power.",
	},
	"defeatist": {
		inherit: true,
		desc: "While this Pokemon has 1/3 or less of its maximum HP, its Attack and Special Attack are one third.",
		shortDesc: "While this Pokemon has 1/3 or less of its max HP, its Attack and Sp. Atk are one third.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 3) {
				return this.chainModify([1, 3]);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 3) {
				return this.chainModify([1, 3]);
			}
		},
	},
	"defiant": {
		inherit: true,
		desc: "This Pokemon's Attack is raised by 3 stages for each of its stat stages that is lowered by an opposing Pokemon.",
		shortDesc: "This Pokemon's Attack is raised by 3 for each of its stats that is lowered by a foe.",
		onAfterEachBoost(boost, target, source) {
			if (!source || target.side === source.side) {
				return;
			}
			let statsLowered = false;
			let i: BoostName;
			for (i in boost) {
				if (boost[i]! < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.add('-ability', target, 'Defiant');
				this.boost({atk: 3}, target, target, null, true);
			}
		},
	},
	"download": {
		inherit: true,
		desc: "On switch-in, this Pokemon's Attack or Special Attack is raised by 2 stages based on the weaker combined defensive stat of all opposing Pokemon. Attack is raised if their Defense is lower, and Special Attack is raised if their Special Defense is the same or lower.",
		shortDesc: "On switch-in, Attack or Sp. Atk is raised 2 stages based on the foes' weaker Defense.",
		onStart(pokemon) {
			let totaldef = 0;
			let totalspd = 0;
			for (const foe of pokemon.side.foe.active) {
				totaldef += foe.getStat('def', false, true);
				totalspd += foe.getStat('spd', false, true);
			}
			if (totaldef && totaldef >= totalspd) {
				this.boost({spa: 2});
			} else if (totalspd) {
				this.boost({atk: 2});
			}
		},
	},
	"dryskin": {
		inherit: true,
		desc: "This Pokemon is immune to Water-type moves and restores 1/3 of its maximum HP, rounded down, when hit by a Water-type move. The power of Fire-type moves is multiplied by 1.5 when used on this Pokemon. At the end of each turn, this Pokemon restores 1/6 of its maximum HP, rounded down, if the weather is Rain Dance, and loses 1/6 of its maximum HP, rounded down, if the weather is Sunny Day.",
		shortDesc: "This Pokemon is healed 1/3 by Water, 1/6 by Rain; is hurt 1.5x by Fire, 1/6 by Sun.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.maxhp / 3)) {
					this.add('-immune', target, '[msg]', '[from] ability: Dry Skin');
				}
				return null;
			}
		},
		onBasePowerPriority: 7,
		onFoeBasePower(basePower, attacker, defender, move) {
			if (this.effectData.target !== defender) return;
			if (move.type === 'Fire') {
				return this.chainModify(1.5);
			}
		},
		onWeather(target, source, effect) {
			if (effect.id === 'raindance' || effect.id === 'primordialsea') {
				this.heal(target.maxhp / 6);
			} else if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
				this.damage(target.maxhp / 6, target, target);
			}
		},
	},
	"effectspore": {
		inherit: true,
		desc: "60% chance a Pokemon making contact with this Pokemon will be poisoned, paralyzed, or fall asleep.",
		shortDesc: "60% chance of poison/paralysis/sleep on others making contact with this Pokemon.",
		onDamagingHit(damage, target, source, move) {
			if (move?.flags['contact'] && !source.status && source.runStatusImmunity('powder')) {
				const r = this.random(100);
				if (r < 22) {
					source.setStatus('slp', target);
				} else if (r < 42) {
					source.setStatus('par', target);
				} else if (r < 60) {
					source.setStatus('psn', target);
				}
			}
		},
	},
	"fairyaura": {
		inherit: true,
		desc: "While this Pokemon is active, the power of Fairy-type moves used by active Pokemon is multiplied by 1.66.",
		shortDesc: "While this Pokemon is active, a Fairy move used by any Pokemon has 1.66x power.",
	},
	"filter": {
		inherit: true,
		shortDesc: "This Pokemon receives 1/2 damage from supereffective attacks.",
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				this.debug('Filter neutralize');
				return this.chainModify(0.5);
			}
		},
	},
	"flamebody": {
		inherit: true,
		shortDesc: "60% chance a Pokemon making contact with this Pokemon will be burned.",
		onDamagingHit(damage, target, source, move) {
			if (move?.flags['contact']) {
				if (this.random(10) < 6) {
					source.trySetStatus('brn', target);
				}
			}
		},
	},
	"flareboost": {
		inherit: true,
		desc: "While this Pokemon is burned, the power of its special attacks is multiplied by 2.",
		shortDesc: "While this Pokemon is burned, its special attacks have 2x power.",
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.status === 'brn' && move.category === 'Special') {
				return this.chainModify(2);
			}
		},
	},
	"flashfire": {
		inherit: true,
		desc: "This Pokemon is immune to Fire-type moves. The first time it is hit by a Fire-type move, its attacking stat is multiplied by 2 while using a Fire-type attack as long as it remains active and has this Ability. If this Pokemon is frozen, it cannot be defrosted by Fire-type attacks.",
		shortDesc: "This Pokemon's Fire attacks do 2x damage if hit by one Fire move; Fire immunity.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				move.accuracy = true;
				if (!target.addVolatile('flashfire')) {
					this.add('-immune', target, '[msg]', '[from] ability: Flash Fire');
				}
				return null;
			}
		},
		onEnd(pokemon) {
			pokemon.removeVolatile('flashfire');
		},
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(target) {
				this.add('-start', target, 'ability: Flash Fire');
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, attacker, defender, move) {
				if (move.type === 'Fire') {
					this.debug('Flash Fire boost');
					return this.chainModify(2);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA(atk, attacker, defender, move) {
				if (move.type === 'Fire') {
					this.debug('Flash Fire boost');
					return this.chainModify(2);
				}
			},
			onEnd(target) {
				this.add('-end', target, 'ability: Flash Fire', '[silent]');
			},
		},
	},
	"flowergift": {
		inherit: true,
		desc: "If this Pokemon is a Cherrim and Sunny Day is active, it changes to Sunshine Form and the Attack and Special Defense of it and its allies are multiplied by 2.",
		shortDesc: "If user is Cherrim and Sunny Day is active, it and allies' Attack and Sp. Def are 2x.",
		onStart(pokemon) {
			delete this.effectData.forme;
		},
		onUpdate(pokemon) {
			if (!pokemon.isActive || pokemon.baseSpecies.id !== 'cherrim') return;
			if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				if (pokemon.species.id !== 'cherrimsunshine') {
					pokemon.formeChange('Cherrim-Sunshine', this.effect, false, '[msg]');
				}
			} else {
				if (pokemon.species.id === 'cherrimsunshine') {
					pokemon.formeChange('Cherrim', this.effect, false, '[msg]');
				}
			}
		},
		onModifyAtkPriority: 3,
		onAllyModifyAtk(atk) {
			if (this.effectData.target.baseTemplate.speciesid !== 'cherrim') return;
			if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(2);
			}
		},
		onModifySpDPriority: 4,
		onAllyModifySpD(spd) {
			if (this.effectData.target.baseTemplate.speciesid !== 'cherrim') return;
			if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(2);
			}
		},
	},
	"friendguard": {
		inherit: true,
		shortDesc: "This Pokemon's allies receive 3/5 damage from other Pokemon's attacks.",
		onAnyModifyDamage(damage, source, target, move) {
			if (target !== this.effectData.target && target.side === this.effectData.target.side) {
				this.debug('Friend Guard weaken');
				return this.chainModify(0.6);
			}
		},
	},
	"furcoat": {
		inherit: true,
		shortDesc: "This Pokemon's Defense is trebled.",
		onModifyDefPriority: 6,
		onModifyDef(def) {
			return this.chainModify(3);
		},
	},
	"galewings": {
		inherit: true,
		shortDesc: "This Pokemon's Flying-type moves have their priority increased by 2.",
		onModifyPriority(priority, pokemon, target, move) {
			if (move && move.type === 'Flying') return priority + 2;
		},
	},
	"gluttony": {
		inherit: true,
		shortDesc: "When this Pokemon has 1/2 or less of its maximum HP, it uses certain Berries early.",
		// XXX TODO
	},
	"gooey": {
		inherit: true,
		shortDesc: "Pokemon making contact with this Pokemon have their Speed lowered by 2 stages.",
		onDamagingHit(damage, target, source, effect) {
			if (effect?.flags['contact']) {
				this.add('-ability', target, 'Gooey');
				this.boost({spe: -2}, source, target);
			}
		},
	},
	"grasspelt": {
		inherit: true,
		shortDesc: "If Grassy Terrain is active, this Pokemon's Defense is multiplied by 2.",
		onModifyDefPriority: 6,
		onModifyDef(pokemon) {
			if (this.field.isTerrain('grassyterrain')) return this.chainModify(2);
		},
	},
	"guts": {
		inherit: true,
		desc: "If this Pokemon has a major status condition, its Attack is multiplied by 2; burn's physical damage halving is ignored.",
		shortDesc: "If this Pokemon is statused, its Attack is 2x; ignores burn halving physical damage.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (pokemon.status) {
				return this.chainModify(2);
			}
		},
	},
	"harvest": {
		inherit: true,
		desc: "If the last item this Pokemon used is a Berry, there is a 75% chance it gets restored at the end of each turn. If Sunny Day is active, this chance is 100%.",
		shortDesc: "If last item used is a Berry, 75% chance to restore it each end of turn. 100% in Sun.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			if (this.field.isWeather(['sunnyday', 'desolateland']) || this.random(4) !== 0) {
				if (pokemon.hp && !pokemon.item && this.dex.getItem(pokemon.lastItem).isBerry) {
					pokemon.setItem(pokemon.lastItem);
					this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Harvest');
				}
			}
		},
	},
	"healer": {
		inherit: true,
		desc: "There is a 60% chance of curing an adjacent ally's major status condition at the end of each turn.",
		shortDesc: "60% chance of curing an adjacent ally's status at the end of each turn.",
		onResidualOrder: 5,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			if (pokemon.side.active.length === 1) {
				return;
			}
			for (const ally of pokemon.side.active) {
				if (ally && this.isAdjacent(pokemon, ally) && ally.status && this.random(10) < 6) {
					ally.cureStatus();
				}
			}
		},
	},
	"heatproof": {
		inherit: true,
		desc: "The power of Fire-type attacks against this Pokemon is one third, and any burn damage taken is 1/24 of its maximum HP, rounded down.",
		shortDesc: "The power of Fire-type attacks against this Pokemon is one third; burn damage one third.",
		onBasePowerPriority: 7,
		onSourceBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify([1, 3]);
			}
		},
		onDamage(damage, target, source, effect) {
			if (effect && effect.id === 'brn') {
				return damage / 3;
			}
		},
	},
	"heavymetal": {
		inherit: true,
		shortDesc: "This Pokemon's weight is trebled.",
		onModifyWeight(weight) {
			return weight * 3;
		},
	},
	"hugepower": {
		inherit: true,
		shortDesc: "This Pokemon's Attack is trebled.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk) {
			return this.chainModify(3);
		},
	},
	"hustle": {
		inherit: true,
		desc: "This Pokemon's Attack is multiplied by 2 and the accuracy of its physical attacks is multiplied by 0.6.",
		shortDesc: "This Pokemon's Attack is 2x and accuracy of its physical attacks is 0.6x.",
		// This should be applied directly to the stat as opposed to chaining witht he others
		onModifyAtkPriority: 5,
		onModifyAtk(atk) {
			return this.modify(atk, 2);
		},
		onModifyMove(move) {
			if (move.category === 'Physical' && typeof move.accuracy === 'number') {
				move.accuracy *= 0.6;
			}
		},
	},
	"icebody": {
		inherit: true,
		desc: "If Hail is active, this Pokemon restores 1/12 of its maximum HP, rounded down, at the end of each turn. This Pokemon takes no damage from Hail.",
		shortDesc: "If Hail is active, this Pokemon heals 1/12 of its max HP each turn; immunity to Hail.",
		onWeather(target, source, effect) {
			if (effect.id === 'hail') {
				this.heal(target.maxhp / 12);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'hail') return false;
		},
	},
	"intimidate": {
		inherit: true,
		desc: "On switch-in, this Pokemon lowers the Attack of adjacent opposing Pokemon by 2 stages. Pokemon behind a substitute are immune.",
		shortDesc: "On switch-in, this Pokemon lowers the Attack of adjacent opponents by 2 stages.",
		onStart(pokemon) {
			let activated = false;
			for (const foe of pokemon.side.foe.active) {
				if (!foe || !this.isAdjacent(foe, pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Intimidate', 'boost');
					activated = true;
				}
				if (foe.volatiles['substitute']) {
					this.add('-immune', foe, '[msg]');
				} else {
					this.boost({atk: -2}, foe, pokemon);
				}
			}
		},
	},
	"ironbarbs": {
		inherit: true,
		desc: "Pokemon making contact with this Pokemon lose 1/6 of their maximum HP, rounded down.",
		shortDesc: "Pokemon making contact with this Pokemon lose 1/6 of their max HP.",
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				this.damage(source.maxhp / 6, source, target, null, true);
			}
		},
	},
	"ironfist": {
		inherit: true,
		desc: "This Pokemon's punch-based attacks have their power multiplied by 1.4.",
		shortDesc: "This Pokemon's punch-based attacks have 1.4x power. Sucker Punch is not boosted.",
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Iron Fist boost');
				return this.chainModify([0x1666, 0x1000]);
			}
		},
	},
	"justified": {
		inherit: true,
		shortDesc: "This Pokemon's Attack is raised by 2 stages after it is damaged by a Dark-type move.",
		onDamagingHit(damage, target, source, effect) {
			if (effect && effect.type === 'Dark') {
				this.boost({atk: 2});
			}
		},
	},
	"lightmetal": {
		inherit: true,
		shortDesc: "This Pokemon's weight is one third.",
		onModifyWeight(weight) {
			return weight / 3;
		},
	},
	"lightningrod": {
		inherit: true,
		desc: "This Pokemon is immune to Electric-type moves and raises its Special Attack by 2 stages when hit by an Electric-type move. If this Pokemon is not the target of a single-target Electric-type move used by another Pokemon, this Pokemon redirects that move to itself if it is within the range of that move.",
		shortDesc: "This Pokemon draws Electric moves to itself to raise Sp. Atk by 2; Electric immunity.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.boost({spa: 2})) {
					this.add('-immune', target, '[msg]', '[from] ability: Lightning Rod');
				}
				return null;
			}
		},
		onAnyRedirectTarget(target, source, source2, move) {
			if (move.type !== 'Electric' || move.id in {firepledge: 1, grasspledge: 1, waterpledge: 1}) return;
			if (this.validTarget(this.effectData.target, source, move.target)) {
				if (this.effectData.target !== target) {
					this.add('-activate', this.effectData.target, 'ability: Lightning Rod');
				}
				return this.effectData.target;
			}
		},
	},
	"marvelscale": {
		inherit: true,
		desc: "If this Pokemon has a major status condition, its Defense is multiplied by 2.",
		shortDesc: "If this Pokemon is statused, its Defense is 2x.",
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			if (pokemon.status) {
				return this.chainModify(2);
			}
		},
	},
	"megalauncher": {
		inherit: true,
		desc: "This Pokemon's pulse moves have their power multiplied by 2. Heal Pulse restores a target's maximum HP.",
		shortDesc: "This Pokemon's pulse moves have 2x power. Heal Pulse heals max HP.",
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['pulse']) {
				return this.chainModify(2);
			}
		},
	},
	"minus": {
		inherit: true,
		desc: "If an active ally has this Ability or the Ability Plus, this Pokemon's Special Attack is multiplied by 2.",
		shortDesc: "If an active ally has this Ability or the Ability Plus, this Pokemon's Sp. Atk is 2x.",
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			if (pokemon.side.active.length === 1) {
				return;
			}
			for (const ally of pokemon.side.active) {
				if (ally && ally.position !== pokemon.position && !ally.fainted && ally.hasAbility(['minus', 'plus'])) {
					return this.chainModify(2);
				}
			}
		},
	},
	"moody": {
		inherit: true,
		desc: "This Pokemon has a random stat raised by 3 stages and another stat lowered by 2 stages at the end of each turn.",
		shortDesc: "Raises a random stat by 3 and lowers another stat by 2 at the end of each turn.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			let stats: BoostName[] = [];
			const boost: SparseBoostsTable = {};
			let statPlus: BoostName;
			for (statPlus in pokemon.boosts) {
				if (pokemon.boosts[statPlus] < 6) {
					stats.push(statPlus);
				}
			}
			let randomStat: BoostName | "" = stats.length ? stats[this.random(stats.length)] : "";
			if (randomStat) boost[randomStat] = 3;

			stats = [];
			let statMinus: BoostName;
			for (statMinus in pokemon.boosts) {
				if (pokemon.boosts[statMinus] > -6 && statMinus !== randomStat) {
					stats.push(statMinus);
				}
			}
			randomStat = stats.length ? stats[this.random(stats.length)] : "";
			if (randomStat) boost[randomStat] = -2;

			this.boost(boost);
		},
	},
	"motordrive": {
		inherit: true,
		desc: "This Pokemon is immune to Electric-type moves and raises its Speed by 2 stages when hit by an Electric-type move.",
		shortDesc: "This Pokemon's Speed is raised 2 stages if hit by an Electric move; Electric immunity.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.boost({spe: 2})) {
					this.add('-immune', target, '[msg]', '[from] ability: Motor Drive');
				}
				return null;
			}
		},
	},
	"moxie": {
		inherit: true,
		desc: "This Pokemon's Attack is raised by 2 stages if it attacks and knocks out another Pokemon.",
		shortDesc: "This Pokemon's Attack is raised by 2 stages if it attacks and KOes another Pokemon.",
		onSourceFaint(target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({atk: 2}, source);
			}
		},
	},
	"multiscale": {
		inherit: true,
		shortDesc: "If this Pokemon is at full HP, damage taken from attacks is one third.",
		onSourceModifyDamage(damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				this.debug('Multiscale weaken');
				return this.chainModify([1, 3]);
			}
		},
	},
	"overgrow": {
		inherit: true,
		desc: "When this Pokemon has 1/2 or less of its maximum HP, its attacking stat is multiplied by 2 while using a Grass-type attack.",
		shortDesc: "When this Pokemon has 1/2 or less of its max HP, its Grass attacks do 2x damage.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Grass' && attacker.hp <= attacker.maxhp / 2) {
				this.debug('Overgrow boost');
				return this.chainModify(2);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Grass' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Overgrow boost');
				return this.chainModify(2);
			}
		},
	},
	"parentalbond": {
		inherit: true,
		desc: "This Pokemon's damaging moves become multi-hit moves that hit three times. Each hit has its damage halved from the previous. Does not affect multi-hit moves or moves that have multiple targets.",
		shortDesc: "This Pokemon's damaging moves hit three times. Each hit has its damage halved from the previou.",
		onPrepareHit(source, target, move) {
			if (move.id in {iceball: 1, rollout: 1}) return;
			if (move.category !== 'Status' && !move.selfdestruct && !move.multihit && !move.flags['charge'] && !move.spreadHit) {
				move.multihit = 3;
				source.addVolatile('parentalbond');
			}
		},
		condition: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower(basePower) {
				if (this.effectData.hit) {
					return this.chainModify(0.5);
				} else {
					this.effectData.hit = true;
				}
			},
		},
	},
	"pixilate": {
		inherit: true,
		desc: "This Pokemon's Normal-type moves become Fairy-type moves and have their power multiplied by 1.6. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Fairy type and have 1.6x power.",
		onModifyMovePriority: -1,
		onModifyMove(move, pokemon) {
			if (move.type === 'Normal' && move.id !== 'naturalgift') {
				move.type = 'Fairy';
				if (move.category !== 'Status') pokemon.addVolatile('pixilate');
			}
		},
		condition: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower(basePower, pokemon, target, move) {
				return this.chainModify([0x199A, 0x1000]);
			},
		},
	},
	"plus": {
		inherit: true,
		desc: "If an active ally has this Ability or the Ability Minus, this Pokemon's Special Attack is multiplied by 2.",
		shortDesc: "If an active ally has this Ability or the Ability Minus, this Pokemon's Sp. Atk is 2x.",
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			if (pokemon.side.active.length === 1) {
				return;
			}
			for (const ally of pokemon.side.active) {
				if (ally && ally.position !== pokemon.position && !ally.fainted && ally.hasAbility(['minus', 'plus'])) {
					return this.chainModify(2);
				}
			}
		},
	},
	"poisonheal": {
		inherit: true,
		desc: "If this Pokemon is poisoned, it restores 1/6 of its maximum HP, rounded down, at the end of each turn instead of losing HP.",
		shortDesc: "This Pokemon is healed by 1/6 of its max HP each turn when poisoned; no HP loss.",
		onDamage(damage, target, source, effect) {
			if (effect.id === 'psn' || effect.id === 'tox') {
				this.heal(target.maxhp / 6);
				return false;
			}
		},
	},
	"poisonpoint": {
		inherit: true,
		shortDesc: "60% chance a Pokemon making contact with this Pokemon will be poisoned.",
		onDamagingHit(damage, target, source, move) {
			if (move?.flags['contact']) {
				if (this.random(10) < 6) {
					source.trySetStatus('psn', target);
				}
			}
		},
	},
	"poisontouch": {
		inherit: true,
		shortDesc: "This Pokemon's contact moves have a 60% chance of poisoning.",
		// upokecenter says this is implemented as an added secondary effect
		onModifyMove(move) {
			if (!move || !move.flags['contact']) return;
			if (!move.secondaries) {
				move.secondaries = [];
			}
			move.secondaries.push({
				chance: 60,
				status: 'psn',
			});
		},
	},
	"prankster": {
		inherit: true,
		shortDesc: "This Pokemon's non-damaging moves have their priority increased by 2.",
		onModifyPriority(priority, pokemon, target, move) {
			if (move && move.category === 'Status') {
				return priority + 2;
			}
		},
	},
	"pressure": {
		inherit: true,
		desc: "If this Pokemon is the target of an opposing Pokemon's move, that move loses two additional PP.",
		shortDesc: "If this Pokemon is the target of a foe's move, that move loses two additional PP.",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Pressure');
		},
		onDeductPP(target, source) {
			if (target.side === source.side) return;
			return 2;
		},
	},
	"purepower": {
		inherit: true,
		shortDesc: "This Pokemon's Attack is trebled.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk) {
			return this.chainModify(3);
		},
	},
	"quickfeet": {
		inherit: true,
		desc: "If this Pokemon has a major status condition, its Speed is multiplied by 2; the Speed drop from paralysis is ignored.",
		shortDesc: "If this Pokemon is statused, its Speed is 2x; ignores Speed drop from paralysis.",
		onModifySpe(spe, pokemon) {
			if (pokemon.status) {
				return this.chainModify(2);
			}
		},
	},
	"raindish": {
		inherit: true,
		desc: "If Rain Dance is active, this Pokemon restores 1/12 of its maximum HP, rounded down, at the end of each turn.",
		shortDesc: "If Rain Dance is active, this Pokemon heals 1/12 of its max HP each turn.",
		onWeather(target, source, effect) {
			if (effect.id === 'raindance' || effect.id === 'primordialsea') {
				this.heal(target.maxhp / 12);
			}
		},
	},
	"rattled": {
		inherit: true,
		desc: "This Pokemon's Speed is raised by 2 stages if hit by a Bug-, Dark-, or Ghost-type attack.",
		shortDesc: "This Pokemon's Speed is raised 2 stages if hit by a Bug-, Dark-, or Ghost-type attack.",
		onDamagingHit(damage, target, source, effect) {
			if (effect && (effect.type === 'Dark' || effect.type === 'Bug' || effect.type === 'Ghost')) {
				this.boost({spe: 2});
			}
		},
	},
	"reckless": {
		inherit: true,
		desc: "This Pokemon's attacks with recoil or crash damage have their power multiplied by 1.4. Does not affect Struggle.",
		shortDesc: "This Pokemon's attacks with recoil or crash damage have 1.4x power; not Struggle.",
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) {
			if (move.recoil || move.hasCrashDamage) {
				this.debug('Reckless boost');
				return this.chainModify([0x1666, 0x1000]);
			}
		},
	},
	"refrigerate": {
		inherit: true,
		desc: "This Pokemon's Normal-type moves become Ice-type moves and have their power multiplied by 1.6. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Ice type and have 1.6x power.",
		onModifyMovePriority: -1,
		onModifyMove(move, pokemon) {
			if (move.type === 'Normal' && move.id !== 'naturalgift') {
				move.type = 'Ice';
				if (move.category !== 'Status') pokemon.addVolatile('refrigerate');
			}
		},
		condition: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower(basePower, pokemon, target, move) {
				return this.chainModify([0x199A, 0x1000]);
			},
		},
	},
	"regenerator": {
		inherit: true,
		shortDesc: "This Pokemon restores 1/2 of its maximum HP, rounded down, when it switches out.",
		onSwitchOut(pokemon) {
			pokemon.heal(pokemon.maxhp / 2);
		},
	},
	"rivalry": {
		inherit: true,
		desc: "This Pokemon's attacks have their power multiplied by 1.5 against targets of the same gender or multiplied by 0.5 against targets of the opposite gender. There is no modifier if either this Pokemon or the target is genderless.",
		shortDesc: "This Pokemon's attacks do 1.5x on same gender targets; 0.5x on opposite gender.",
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.gender && defender.gender) {
				if (attacker.gender === defender.gender) {
					this.debug('Rivalry boost');
					return this.chainModify(1.5);
				} else {
					this.debug('Rivalry weaken');
					return this.chainModify(0.5);
				}
			}
		},
	},
	"roughskin": {
		inherit: true,
		desc: "Pokemon making contact with this Pokemon lose 1/6 of their maximum HP, rounded down.",
		shortDesc: "Pokemon making contact with this Pokemon lose 1/6 of their max HP.",
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				this.damage(source.maxhp / 6, source, target, null, true);
			}
		},
	},
	"sandforce": {
		inherit: true,
		desc: "If Sandstorm is active, this Pokemon's Ground-, Rock-, and Steel-type attacks have their power multiplied by 1.6. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "This Pokemon's Ground/Rock/Steel attacks do 1.6x in Sandstorm; immunity to it.",
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) {
			if (this.field.isWeather('sandstorm')) {
				if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel') {
					this.debug('Sand Force boost');
					return this.chainModify([0x199A, 0x1000]);
				}
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
	},
	"sandrush": {
		inherit: true,
		desc: "If Sandstorm is active, this Pokemon's Speed is trebled. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "If Sandstorm is active, this Pokemon's Speed is trebled; immunity to Sandstorm.",
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather('sandstorm')) {
				return this.chainModify(3);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
	},
	"sandveil": {
		inherit: true,
		desc: "If Sandstorm is active, this Pokemon's evasiveness is multiplied by 1.5. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "If Sandstorm is active, this Pokemon's evasiveness is 1.5x; immunity to Sandstorm.",
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.field.isWeather('sandstorm')) {
				this.debug('Sand Veil - decreasing accuracy');
				return accuracy * 2 / 3;
			}
		},
	},
	"sapsipper": {
		inherit: true,
		desc: "This Pokemon is immune to Grass-type moves and raises its Attack by 2 stages when hit by a Grass-type move.",
		shortDesc: "This Pokemon's Attack is raised 2 stages if hit by a Grass move; Grass immunity.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Grass') {
				if (!this.boost({atk: 2})) {
					this.add('-immune', target, '[msg]', '[from] ability: Sap Sipper');
				}
				return null;
			}
		},
		onAllyTryHitSide(target, source, move) {
			if (target === this.effectData.target || target.side !== source.side) return;
			if (move.type === 'Grass') {
				this.boost({atk: 2}, this.effectData.target);
			}
		},
	},
	"serenegrace": {
		inherit: true,
		shortDesc: "This Pokemon's moves have their secondary effect chance trebled.",
		onModifyMovePriority: -2,
		onModifyMove(move) {
			if (move.secondaries) {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) {
					if (secondary.chance) secondary.chance *= 3;
				}
			}
		},
	},
	"shedskin": {
		inherit: true,
		desc: "This Pokemon has a 67% chance to have its major status condition cured at the end of each turn.",
		shortDesc: "This Pokemon has a 67% chance to have its status cured at the end of each turn.",
		onResidualOrder: 5,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			if (pokemon.hp && pokemon.status && this.random(3) !== 0) {
				this.debug('shed skin');
				this.add('-activate', pokemon, 'ability: Shed Skin');
				pokemon.cureStatus();
			}
		},
	},
	"sheerforce": {
		inherit: true,
		desc: "This Pokemon's attacks with secondary effects have their power multiplied by 1.6, but the secondary effects are removed.",
		shortDesc: "This Pokemon's attacks with secondary effects have 1.6x power; nullifies the effects.",
		onModifyMove(move, pokemon) {
			if (move.secondaries) {
				delete move.secondaries;
				// Actual negation of `AfterMoveSecondary` effects implemented in scripts.js
				pokemon.addVolatile('sheerforce');
			}
		},
		condition: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower(basePower, pokemon, target, move) {
				return this.chainModify([0x199A, 0x1000]);
			},
		},
	},
	"simple": {
		inherit: true,
		shortDesc: "If this Pokemon's stat stages are raised or lowered, the effect is trebled instead.",
		onBoost(boost) {
			let i: BoostName;
			for (i in boost) {
				boost[i]! *= 3;
			}
		},
	},
	"slowstart": {
		inherit: true,
		shortDesc: "On switch-in, this Pokemon's Attack and Speed are halved for 10 turns.",
		onStart(pokemon) {
			pokemon.addVolatile('slowstart');
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['slowstart'];
			this.add('-end', pokemon, 'Slow Start', '[silent]');
		},
		condition: {
			duration: 10,
			onStart(target) {
				this.add('-start', target, 'Slow Start');
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				return this.chainModify(0.5);
			},
			onModifySpe(spe, pokemon) {
				return this.chainModify(0.5);
			},
			onEnd(target) {
				this.add('-end', target, 'Slow Start');
			},
		},
	},
	"sniper": {
		inherit: true,
		shortDesc: "If this Pokemon strikes with a critical hit, the damage is multiplied by 2.",
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).crit) {
				this.debug('Sniper boost');
				return this.chainModify(2);
			}
		},
	},
	"snowcloak": {
		inherit: true,
		desc: "If Hail is active, this Pokemon's evasiveness is multiplied by 1.5. This Pokemon takes no damage from Hail.",
		shortDesc: "If Hail is active, this Pokemon's evasiveness is 1.5x; immunity to Hail.",
		onImmunity(type, pokemon) {
			if (type === 'hail') return false;
		},
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.field.isWeather('hail')) {
				this.debug('Snow Cloak - decreasing accuracy');
				return accuracy * 2 / 3;
			}
		},
	},
	"solarpower": {
		inherit: true,
		desc: "If Sunny Day is active, this Pokemon's Special Attack is multiplied by 2 and it loses 1/6 of its maximum HP, rounded down, at the end of each turn.",
		shortDesc: "If Sunny Day is active, this Pokemon's Sp. Atk is 2x; loses 1/6 max HP per turn.",
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(2);
			}
		},
		onWeather(target, source, effect) {
			if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
				this.damage(target.maxhp / 6, target, target);
			}
		},
	},
	"solidrock": {
		inherit: true,
		shortDesc: "This Pokemon receives 3/5 damage from supereffective attacks.",
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				this.debug('Solid Rock neutralize');
				return this.chainModify(0.6);
			}
		},
	},
	"speedboost": {
		inherit: true,
		desc: "This Pokemon's Speed is raised by 2 stages at the end of each full turn it has been on the field.",
		shortDesc: "This Pokemon's Speed is raised 2 stages at the end of each full turn on the field.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			if (pokemon.activeTurns) {
				this.boost({spe: 2});
			}
		},
	},
	"static": {
		inherit: true,
		shortDesc: "60% chance a Pokemon making contact with this Pokemon will be paralyzed.",
		onDamagingHit(damage, target, source, effect) {
			if (effect?.flags['contact']) {
				if (this.random(10) < 6) {
					source.trySetStatus('par', target);
				}
			}
		},
	},
	"steadfast": {
		inherit: true,
		shortDesc: "If this Pokemon flinches, its Speed is raised by 2 stages.",
		onFlinch(pokemon) {
			this.boost({spe: 2});
		},
	},
	"stench": {
		inherit: true,
		shortDesc: "This Pokemon's attacks without a chance to flinch have a 20% chance to flinch.",
		onModifyMove(move) {
			if (move.category !== "Status") {
				this.debug('Adding Stench flinch');
				if (!move.secondaries) move.secondaries = [];
				for (const secondary of move.secondaries) {
					if (secondary.volatileStatus === 'flinch') return;
				}
				move.secondaries.push({
					chance: 20,
					volatileStatus: 'flinch',
				});
			}
		},
	},
	"stormdrain": {
		inherit: true,
		desc: "This Pokemon is immune to Water-type moves and raises its Special Attack by 2 stages when hit by a Water-type move. If this Pokemon is not the target of a single-target Water-type move used by another Pokemon, this Pokemon redirects that move to itself if it is within the range of that move.",
		shortDesc: "This Pokemon draws Water moves to itself to raise Sp. Atk by 2; Water immunity.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.boost({spa: 2})) {
					this.add('-immune', target, '[msg]', '[from] ability: Storm Drain');
				}
				return null;
			}
		},
		onAnyRedirectTarget(target, source, source2, move) {
			if (move.type !== 'Water' || move.id in {firepledge: 1, grasspledge: 1, waterpledge: 1}) return;
			if (this.validTarget(this.effectData.target, source, move.target)) {
				if (this.effectData.target !== target) {
					this.add('-activate', this.effectData.target, 'ability: Storm Drain');
				}
				return this.effectData.target;
			}
		},
	},
	"strongjaw": {
		inherit: true,
		desc: "This Pokemon's bite-based attacks have their power multiplied by 2.",
		shortDesc: "This Pokemon's bite-based attacks have 2x power. Bug Bite is not boosted.",
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['bite']) {
				return this.chainModify(2);
			}
		},
	},
	"sturdy": {
		inherit: true,
		desc: "If this Pokemon is at full HP, it survives one hit with at least 50% HP. OHKO moves fail when used against this Pokemon.",
		shortDesc: "If this Pokemon is at full HP, it survives one hit with at least 50% HP. Immune to OHKO.",
		onTryHit(pokemon, target, move) {
			if (move.ohko) {
				this.add('-immune', pokemon, '[msg]', '[from] ability: Sturdy');
				return null;
			}
		},
		onDamagePriority: -100,
		onDamage(damage, target, source, effect) {
			if (target.hp === target.maxhp && damage >= target.hp / 2 && effect && effect.effectType === 'Move') {
				this.add('-ability', target, 'Sturdy');
				return target.hp / 2;
			}
		},
	},
	"superluck": {
		inherit: true,
		shortDesc: "This Pokemon's critical hit ratio is raised by 2 stages.",
		onModifyCritRatio(critRatio) {
			return critRatio + 2;
		},
	},
	"swarm": {
		inherit: true,
		desc: "When this Pokemon has 1/2 or less of its maximum HP, rounded down, its attacking stat is multiplied by 2 while using a Bug-type attack.",
		shortDesc: "When this Pokemon has 1/2 or less of its max HP, its Bug attacks do 2x damage.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Bug' && attacker.hp <= attacker.maxhp / 2) {
				this.debug('Swarm boost');
				return this.chainModify(2);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Bug' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Swarm boost');
				return this.chainModify(2);
			}
		},
	},
	"swiftswim": {
		inherit: true,
		shortDesc: "If Rain Dance is active, this Pokemon's Speed is trebled.",
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather(['raindance', 'primordialsea'])) {
				return this.chainModify(3);
			}
		},
	},
	"tangledfeet": {
		inherit: true,
		shortDesc: "This Pokemon's evasiveness is trebled as long as it is confused.",
		onModifyAccuracy(accuracy, target) {
			if (typeof accuracy !== 'number') return;
			if (target?.volatiles['confusion']) {
				this.debug('Tangled Feet - decreasing accuracy');
				return accuracy / 3;
			}
		},
	},
	"technician": {
		inherit: true,
		desc: "This Pokemon's moves of 60 power or less have their power multiplied by 2. Does affect Struggle.",
		shortDesc: "This Pokemon's moves of 60 power or less have 2x power. Includes Struggle.",
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) {
			if (basePower <= 60) {
				this.debug('Technician boost');
				return this.chainModify(2);
			}
		},
	},
	"thickfat": {
		inherit: true,
		desc: "If a Pokemon uses a Fire- or Ice-type attack against this Pokemon, that Pokemon's attacking stat is one third when calculating the damage to this Pokemon.",
		shortDesc: "Fire/Ice-type moves against this Pokemon deal damage with one third of the attacking stat.",
		onModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Thick Fat weaken');
				return this.chainModify([1, 3]);
			}
		},
		onModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Thick Fat weaken');
				return this.chainModify([1, 3]);
			}
		},
	},
	"tintedlens": {
		inherit: true,
		shortDesc: "This Pokemon's attacks are never resisted by a target.",
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod < 0) {
				this.debug('Tinted Lens boost');
				target.getMoveHitData(move).typeMod = 0;
			}
		},
	},
	"torrent": {
		inherit: true,
		desc: "When this Pokemon has 1/2 or less of its maximum HP, rounded down, its attacking stat is multiplied by 2 while using a Water-type attack.",
		shortDesc: "When this Pokemon has 1/2 or less of its max HP, its Water attacks do 2x damage.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water' && attacker.hp <= attacker.maxhp / 2) {
				this.debug('Torrent boost');
				return this.chainModify(2);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Water' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Torrent boost');
				return this.chainModify(1.5);
			}
		},
	},
	"toxicboost": {
		inherit: true,
		desc: "While this Pokemon is poisoned, the power of its physical attacks is multiplied by 2.",
		shortDesc: "While this Pokemon is poisoned, its physical attacks have 2x power.",
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) {
			if ((attacker.status === 'psn' || attacker.status === 'tox') && move.category === 'Physical') {
				return this.chainModify(2);
			}
		},
	},
	"toughclaws": {
		inherit: true,
		shortDesc: "This Pokemon's contact moves have their power multiplied by 1.6.",
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['contact']) {
				return this.chainModify([0x199A, 0x1000]);
			}
		},
	},
	"unburden": {
		inherit: true,
		desc: "If this Pokemon loses its held item for any reason, its Speed is trebled. This boost is lost if it switches out or gains a new item or Ability.",
		shortDesc: "Speed is trebled on held item loss; boost is lost if it switches, gets new item/Ability.",
		onAfterUseItem(item, pokemon) {
			if (pokemon !== this.effectData.target) return;
			pokemon.addVolatile('unburden');
		},
		onTakeItem(item, pokemon) {
			pokemon.addVolatile('unburden');
		},
		onEnd(pokemon) {
			pokemon.removeVolatile('unburden');
		},
		condition: {
			onModifySpe(spe, pokemon) {
				if (!pokemon.item) {
					return this.chainModify(3);
				}
			},
		},
	},
	"victorystar": {
		inherit: true,
		shortDesc: "This Pokemon and its allies' moves have their accuracy multiplied by 1.2.",
		onAllyModifyMove(move) {
			if (typeof move.accuracy === 'number') {
				move.accuracy *= 1.2;
			}
		},
	},
	"voltabsorb": {
		inherit: true,
		desc: "This Pokemon is immune to Electric-type moves and restores 1/3 of its maximum HP, rounded down, when hit by an Electric-type move.",
		shortDesc: "This Pokemon heals 1/3 of its max HP when hit by Electric moves; Electric immunity.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.heal(target.maxhp / 3)) {
					this.add('-immune', target, '[msg]', '[from] ability: Volt Absorb');
				}
				return null;
			}
		},
	},
	"waterabsorb": {
		inherit: true,
		desc: "This Pokemon is immune to Water-type moves and restores 1/3 of its maximum HP, rounded down, when hit by a Water-type move.",
		shortDesc: "This Pokemon heals 1/3 of its max HP when hit by Water moves; Water immunity.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.maxhp / 3)) {
					this.add('-immune', target, '[msg]', '[from] ability: Water Absorb');
				}
				return null;
			}
		},
	},
	"weakarmor": {
		inherit: true,
		desc: "If a physical attack hits this Pokemon, its Defense is lowered by 2 stages and its Speed is raised by 2 stages.",
		shortDesc: "If a physical attack hits this Pokemon, Defense is lowered by 2, Speed is raised by 2.",
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Physical') {
				this.boost({def: -2, spe: 2});
			}
		},
	},
	"wonderskin": {
		inherit: true,
		desc: "All non-damaging moves that check accuracy have their accuracy changed to 25% when used on this Pokemon. This change is done before any other accuracy modifying effects.",
		shortDesc: "Status moves with accuracy checks are 25% accurate when used on this Pokemon.",
		onModifyAccuracyPriority: 10,
		onModifyAccuracy(accuracy, target, source, move) {
			if (move.category === 'Status' && typeof move.accuracy === 'number') {
				this.debug('Wonder Skin - setting accuracy to 25');
				return 25;
			}
		},
	},
};
