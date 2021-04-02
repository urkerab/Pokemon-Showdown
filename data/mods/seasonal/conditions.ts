export const Conditions: {[k: string]: ModdedConditionData} = {
	// Innate abilities
	// Lemonade
	adaptabilityinnate: {
		effectType: 'Ability',
		onModifyMove(move) {
			move.stab = 2;
		},
	},
	// Snobalt
	amityabsorb: {
		effectType: 'Ability',
		name: 'Amity Absorb',
		shortDesc: "Heals 25% of max HP when hit by Fairy-type attack.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fairy') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Amity Absorb');
				}
				return null;
			}
		},
	},
	// manu 11
	arachnophobia: {
		effectType: 'Ability',
		name: 'Arachnophobia',
		shortDesc: "Bad Dreams + Tinted Lens + Boosts SpD/Spe on switch in.",
		onStart(target, source) {
			source.addVolatile('baddreamsinnate');
			this.boost({spd: 1, spe: 1}, source, source);
		},
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod < 0) {
				return this.chainModify(2);
			}
		},
	},
	// ascriptmaster
	ascriptinnate: {
		effectType: 'Ability',
		onStart(target, source) {
			source.types = ['Electric'];
			this.add('-start', source, 'typechange', 'Electric');
			this.actions.useMove('magnetrise', source);
		},
		onModifyMove(move) {
			let modifyanim = true;
			if (move.id === 'thunderbolt') {
				(move as any).name = 'Spectrum Shock';
			} else if (move.id === 'mysticalfire') {
				(move as any).name = 'Spectrum Blaze';
			} else if (move.id === 'aurorabeam') {
				(move as any).name = 'Spectrum Impact';
			} else if (move.id === 'psyshock') {
				(move as any).name = 'Spectrum Flash';
			} else {
				modifyanim = false;
			}
			if (modifyanim) {
				move.onPrepareHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, 'Swift', target);
				};
			}
		},
	},
	// atomicllamas, manu 11
	baddreamsinnate: {
		effectType: 'Ability',
		onResidual(pokemon) {
			if (!pokemon.hp) return;
			const thisSide = pokemon.side;
			if (thisSide.foe.active.length) {
				const opponent = thisSide.foe.active[0];
				if (opponent.hp && opponent.status === 'slp') {
					this.add('-ability', pokemon, 'Bad Dreams');
					this.damage(opponent.maxhp / 8, opponent, pokemon, this.dex.conditions.get("Bad Dreams"));
				}
			}
		},
	},
	// SpaceBass
	badtrip: {
		effectType: 'Ability',
		onSwitchOut(pokemon) {
			pokemon.heal(this.modify(pokemon.maxhp, 0.4));
		},
	},
	// Teremiare
	coinflip: {
		effectType: 'Ability',
		onStart(target, source) {
			this.add('-ability', source, 'Coin Flip');
			const pool: BoostID[] = ['atk', 'def', 'spa', 'spd', 'spe'];
			const boost1 = pool.splice(this.random(pool.length), 1)[0];
			const boost2 = pool.splice(this.random(pool.length), 1)[0];
			source.boosts[boost1] = 6;
			this.add('-setboost', source, boost1, source.boosts[boost1]);
			const foes = source.side.foe.active;
			if (foes.length && foes[0].hp) {
				const opponent = foes[0];
				opponent.boosts[boost2] = 6;
				this.add('-setboost', opponent, boost2, opponent.boosts[boost2]);
			}
		},
	},
	// Bondie
	crabstance: {
		effectType: 'Ability',
		name: 'Crab Stance',
		shortDesc: "Raises Def/SpD with each hit, Atk/SpA with each attack.",
		onDamagingHit(damage, target, source, effect) {
			if (effect && effect.category in {Physical: 1, Special: 1}) {
				this.boost({def: 1, spd: 1}, target, target);
			}
		},
		onAfterMoveSecondarySelf(source, target, move) {
			if (move && move.category !== 'Status') {
				this.boost({atk: 1, spa: 1}, source, source);
			}
		},
	},
	// Clefairy
	coldsteel: {
		effectType: 'Ability',
		name: 'Coldsteel',
		shortDesc: "Boosts Spe and adds Dark type on switch in, changes to Steel after 3 turns.",
		duration: 3,
		onStart(pokemon) {
			this.boost({spe: 1}, pokemon, pokemon);
			pokemon.addType('Dark');
			this.add('-start', pokemon, 'typeadd', 'Dark', '[from] ability: Coldsteel');
		},
		onEnd(pokemon) {
			this.heal(this.modify(pokemon.maxhp, 0.25));
			pokemon.addType('Steel');
			this.add('-start', pokemon, 'typeadd', 'Steel', '[from] ability: Coldsteel');
		},
	},
	// Former Hope
	cursedbodyinnate: {
		effectType: 'Ability',
		onDamagingHit(damage, target, source, move) {
			if (!source || source.volatiles['disable']) return;
			if (source !== target && move && move.effectType === 'Move') {
				if (this.random(10) < 3) {
					source.addVolatile('disable');
				}
			}
		},
	},
	// nv
	cuteness: {
		effectType: 'Ability',
		shortDesc: "Lowers opponent's stats on switch in. 1.8×Atk/Def.",
		onStart(target, source) {
			if (!source.side.foe.active[0].hp) return;
			this.add('-ability', source, 'Cuteness');
			this.boost({atk: -1, def: -1, spa: -1, spd: -1, spe: -1, evasion: -1}, source.side.foe.active[0], source, null, true);
		},
		onModifyAtk() {
			return this.chainModify(1.8);
		},
		onModifyDef() {
			return this.chainModify(1.8);
		},
	},
	// Giagantic
	deltastreaminnate: {
		effectType: 'Ability',
		onStart(source) {
			this.field.setWeather('deltastream');
		},
		onAnySetWeather(target, source, weather) {
			if (this.field.getWeather().id === 'deltastream' && !(weather.id in {desolateland: 1, primordialsea: 1, deltastream: 1})) return false;
		},
		onSwitchOut(pokemon) {
			if (this.field.getWeather().id === 'deltastream') {
				if (pokemon.side.foe.active.length) {
					const opponent = pokemon.side.foe.active[0];
					if (opponent.hasAbility('deltastream') || (opponent.volatiles['deltastreaminnate'])) {
						this.field.weatherState.source = opponent;
					} else {
						this.field.clearWeather();
					}
				} else {
					this.field.clearWeather();
				}
			}
		},
		onFaint(pokemon) {
			if (this.field.getWeather().id === 'deltastream') {
				if (pokemon.side.foe.active.length) {
					const opponent = pokemon.side.foe.active[0];
					if (opponent.hasAbility('deltastream') || (opponent.volatiles['deltastreaminnate'])) {
						this.field.weatherState.source = opponent;
					} else {
						this.field.clearWeather();
					}
				} else {
					this.field.clearWeather();
				}
			}
		},
	},
	// Duck
	firstblood: {
		effectType: 'Ability',
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).crit) {
				return this.chainModify(1.5);
			}
		},
	},
	// Blast Chance
	flipside: {
		effectType: 'Ability',
		shortDesc: "Uses Topsy-Turvy on switch in. Takes inverse type chart damage.",
		onStart(target, source) {
			this.actions.useMove('Topsy-Turvy', source);
			this.add('-ability', source, 'Flipside');
			this.add('message', source.name + '\'s Flipside has reversed type matchups against it!');
		},
		// Actual implementation in formats.js
	},
	// RODAN
	gonnamakeyousweat: {
		effectType: 'Ability',
		name: 'Gonna Make You Sweat',
		shortDesc: "Recovers 25% of max HP every turn.",
		onResidual(pokemon) {
			if (!pokemon.hp) return;
			this.heal(this.modify(pokemon.maxhp, 0.25));
		},
	},
	// Winry
	hellacute: {
		effectType: 'Ability',
		shortDesc: "OHKO moves have 55% acc but faint if miss. 1.7×Atk/SpA, 3.2×Def/SpD. Lowers attacker's Def/SpD when hit.",
		onModifyDef() {
			return this.chainModify(3.2);
		},
		onModifySpD() {
			return this.chainModify(3.2);
		},
		onModifyAtk() {
			return this.chainModify(1.7);
		},
		onModifySpA() {
			return this.chainModify(1.7);
		},
		onDamagingHit(damage, target, source, effect) {
			if (effect && (effect.category in {Physical: 1, Special: 1}) && source && source.hp) {
				this.add('-ability', target, 'Hella Cute');
				this.boost({def: -1, spd: -1}, source, target, effect);
			}
		},
		onModifyMove(move) {
			if (move.ohko) {
				move.onMoveFail = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Explosion", target);
					this.damage(source.maxhp, source, source);
				};
			}
		},
		onAnyAccuracy(accuracy, target, source, move) {
			if (source.volatiles['hellacute'] && move.ohko) return 55;
			return accuracy;
		},
	},
	// unfixable
	ironbarbsinnate: {
		effectType: 'Ability',
		name: 'Iron Barbs',
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				this.damage(source.maxhp / 8, source, target, null, true);
			}
		},
	},
	// Scyther NO Swiping
	mountaineerinnate: {
		effectType: 'Ability',
		shortDesc: "On switch-in, this Pokemon avoids all Rock-type attacks and Stealth Rock.",
		onDamage(damage, target, source, effect) {
			if (effect && effect.id === 'stealthrock') {
				return false;
			}
		},
		onTryHit(target, source, move) {
			if (move.type === 'Rock' && !target.activeTurns) {
				this.add('-immune', target, '[msg]', '[from] ability: Mountaineer');
				return null;
			}
		},
	},
	// uselesstrainer
	ninja: {
		effectType: 'Ability',
		onModifyPriority(priority) {
			return Math.round(priority) + 0.2;
		},
	},
	// Haund
	prodigy: {
		effectType: 'Ability',
		shortDesc: "Physical and Special moves switch category.",
		onStart(target, source) {
			this.add('-ability', source, 'Prodigy');
			this.field.addPseudoWeather('prodigyweather', source, this.dex.conditions.get("Prodigy"));
		},
		onSwitchOut(pokemon) {
			const foes = pokemon.side.foe.active;
			if (this.field.pseudoWeather['prodigyweather'] && !(foes.length && foes[0].volatiles['prodigy'])) {
				this.field.removePseudoWeather('prodigyweather');
			}
		},
		onFaint(pokemon) {
			const foes = pokemon.side.foe.active;
			if (this.field.pseudoWeather['prodigyweather'] && !(foes.length && foes[0].volatiles['prodigy'])) {
				this.field.removePseudoWeather('prodigyweather');
			}
		},
	},
	// qtrx
	qtrxinnate: {
		effectType: 'Ability',
		onStart(target, source) {
			source.addVolatile('focusenergy');
			source.addVolatile('telekinesis');
		},
		onDragOut(pokemon) {
			if (pokemon.m.isDuringAttack) {
				this.add('-message', "But it had no effect!");
				return null;
			}
		},
		onResidual(pokemon) {
			if (!pokemon.hp) return;
			this.add('-message', pokemon.name + "'s aura of spammy letters is tearing at the very fabric of reality!");
			this.actions.useMove(((this.random(2) === 1) ? 'trickroom' : 'wonderroom'), pokemon);
		},
	},
	// sparktrain
	refrigerateinnate: {
		effectType: 'Ability',
		onSwitchIn(pokemon) {
			if (!pokemon.addType('Ice')) return false;
			this.add('-start', pokemon, 'typeadd', 'Ice');
		},
		onModifyMove(move, pokemon) {
			if (move.type === 'Normal' && move.id !== 'naturalgift') {
				move.type = 'Ice';
				if (move.category !== 'Status') pokemon.addVolatile('refrigerate');
			}
		},
		onModifySpD() {
			return this.chainModify(1.6);
		},
		name: "Refrigerate",
	},
	// Sigilyph
	samuraijack: {
		effectType: 'Ability',
		onModifySpe() {
			return this.chainModify(1.1);
		},
	},
	// Anttya
	serenegraceinnate: {
		effectType: 'Ability',
		onModifyMovePriority: -2,
		onModifyMove(move) {
			if (move.secondaries) {
				for (const secondary of move.secondaries) {
					if (secondary.chance) secondary.chance *= 2;
				}
			}
		},
	},
	// bludz
	shielddustinnate: {
		effectType: 'Ability',
		onModifySecondaries(secondaries) {
			return secondaries.filter(effect => !!effect.self);
		},
	},
	// rssp1
	speedboostinnate: {
		effectType: 'Ability',
		name: 'Speed Boost',
		onResidual(pokemon) {
			if (pokemon.activeTurns) {
				this.boost({spe: 1});
			}
		},
	},
	// SpecsMegaBeedrill
	weed: {
		effectType: 'Ability',
		shortDesc: "2.5×Atk/SpA, 1.75×Spe.",
		onStart(target, source) {
			this.add('-ability', source, 'Weed');
			this.add('-anim', source, 'Geomancy', source);
			this.add('-message', source.name + " is high on Weed!");
		},
		onModifySpe() {
			return this.chainModify(1.75);
		},
		onModifyAtk() {
			return this.chainModify(2.5);
		},
		onModifySpA() {
			return this.chainModify(2.5);
		},
	},
	// Weathers
	hail: {
		inherit: true,
		onStart(battle, source, effect) {
			if (effect && effect.effectType === 'Ability') {
				if (effect.id === 'holyhail') this.effectState.duration = 0;
				this.add('-weather', 'Hail', '[from] ability: ' + effect, '[of] ' + source);
			} else {
				this.add('-weather', 'Hail');
			}
		},
		durationCallback(source) {
			if (!source) return 5;
			if (source.hasAbility('holyhail')) return 0;
			if (source.hasItem('icyrock')) return 8;
			return 5;
		},
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (attacker.hasAbility('holyhail') && move.type === 'Ice') {
				return this.chainModify(1.5);
			}
		},
		onModifySpD(spd, pokemon) {
			if (pokemon.hasAbility('holyhail') && pokemon.hasType('Ice') && this.field.isWeather('hail')) {
				return this.modify(spd, 1.5);
			}
		},
	},
	prodigyweather: {
		duration: 0,
		onStart() {
			this.add('message', "Physical and special move categories on the battlefield have become inverted!");
		},
		onModifyMove(move) {
			if (move.category === 'Physical') {
				move.category = 'Special';
			} else if (move.category === 'Special') {
				move.category = 'Physical';
			}
		},
		onEnd() {
			this.add('message', "Physical and special move categories on the battlefield have returned to normal!");
		},
	},
	// Other effects
	saltguard: {
		duration: 2,
		onStart(pokemon) {
			this.add('-start', pokemon, 'Salt', '[silent]');
			this.add('message', "Residual salt is protecting againt indirect damage!");
		},
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				return false;
			}
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'Salt', '[silent]');
			this.add('message', "The salt subsided.");
		},
	},
};
