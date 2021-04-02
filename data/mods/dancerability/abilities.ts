export const Abilities: {[k: string]: ModdedAbilityData} = {
	"aftermath": {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact'] && !target.hp) {
				this.damage(source.maxhp / 4, source, target);
				if (!source.hasAbility('magicguard')) this.bounceMove(move, target, source);
			}
		},
	},
	"angerpoint": {
		inherit: true,
		onHit(target, source, move) {
			if (!target.hp) return;
			if (move && move.effectType === 'Move' && target.getMoveHitData(move).crit) {
				target.setBoost({atk: 6});
				this.add('-setboost', target, 'atk', 12, '[from] ability: Anger Point');
				this.bounceMove(move, target, source);
			}
		},
	},
	"aromaveil": {
		inherit: true,
		onAllyTryAddVolatile(status, target, source, effect) {
			if (status.id in {attract: 1, disable: 1, encore: 1, healblock: 1, taunt: 1, torment: 1}) {
				if (effect.effectType === 'Move') {
					this.add('-activate', this.effectData.target, 'ability: Aroma Veil', '[of] ' + target);
					this.bounceMove(effect, target, source);
				}
				return null;
			}
		},
	},
	/*
	"battlearmor": {
		inherit: true,
		onCriticalHit(target, source, move) {
			this.bounceMove(move, target, source);
			return false;
		},
	},
	*/
	"berserk": {
		inherit: true,
		onAfterMoveSecondary(target, source, move) {
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			if (target.hp <= target.maxhp / 2 && target.hp + move.totalDamage > target.maxhp / 2) {
				this.boost({spa: 1});
				this.bounceMove(move, target, source);
			}
		},
	},
	"bigpecks": {
		inherit: true,
		onBoost(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost['def'] && boost['def'] < 0) {
				delete boost['def'];
				if (!(effect as ActiveMove).secondaries) {
					this.add("-fail", target, "unboost", "Defense", "[from] ability: Big Pecks", "[of] " + target);
					this.bounceMove(effect, target, source);
				}
			}
		},
	},
	"bulletproof": {
		inherit: true,
		onTryHit(target, source, move) {
			if (move.flags['bullet']) {
				this.add('-immune', target, '[msg]', '[from] ability: Bulletproof');
				this.bounceMove(move, target, source);
				return null;
			}
		},
	},
	"clearbody": {
		inherit: true,
		onBoost(boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			let i: BoostName;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries) {
				this.add("-fail", target, "unboost", "[from] ability: Clear Body", "[of] " + target);
				this.bounceMove(effect, target, source);
			}
		},
	},
	"colorchange": {
		inherit: true,
		onAfterMoveSecondary(target, source, move) {
			if (!target.hp) return;
			const type = move.type;
			if (target.isActive && move.effectType === 'Move' && move.category !== 'Status' && type !== '???' && !target.hasType(type)) {
				if (!target.setType(type)) return false;
				this.add('-start', target, 'typechange', type, '[from] ability: Color Change');

				if (target.side.active.length === 2 && target.position === 1) {
					// Curse Glitch
					const decision = this.queue.willMove(target);
					if (decision && decision.move.id === 'curse') {
						decision.targetLoc = -1;
					}
				}
				this.bounceMove(move, target, source);
			}
		},
	},
	"comatose": {
		inherit: true,
		onSetStatus(status, target, source, effect) {
			if (!(effect as ActiveMove)?.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Comatose');
			this.bounceMove(effect, target, source);
			return false;
		},
	},
	"competitive": {
		inherit: true,
		onAfterEachBoost(boost, target, source, effect) {
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
				this.boost({spa: 2}, target, target, null, true);
				this.bounceMove(effect, target, source);
			}
		},
	},
	"cursedbody": {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (!source || source.volatiles['disable']) return;
			if (source !== target && move && move.effectType === 'Move' && !move.isFutureMove) {
				if (this.random(10) < 3) {
					source.addVolatile('disable', this.effectData.target);
					this.bounceMove(move, target, source);
				}
			}
		},
	},
	"cutecharm": {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move?.flags['contact']) {
				if (this.random(10) < 3) {
					source.addVolatile('attract', this.effectData.target);
					this.bounceMove(move, target, source);
				}
			}
		},
	},
	"damp": {
		inherit: true,
		onAnyTryMove(target, source, effect) {
			if (effect.id === 'selfdestruct' || effect.id === 'explosion') {
				this.attrLastMove('[still]');
				this.add('cant', this.effectData.target, 'ability: Damp', effect, '[of] ' + target);
				this.bounceMove(effect, this.effectData.target, target);
				return false;
			}
		},
	},
	"dazzling": {
		inherit: true,
		onFoeTryMove(target, source, effect) {
			if ((source.side === this.effectData.target.side || effect.id === 'perishsong') && effect.priority > 0.1 && effect.target !== 'foeSide') {
				this.attrLastMove('[still]');
				this.add('cant', this.effectData.target, 'ability: Dazzling', effect, '[of] ' + target);
				this.bounceMove(effect, this.effectData.target, target);
				return false;
			}
		},
	},
	"defiant": {
		inherit: true,
		onAfterEachBoost(boost, target, source, effect) {
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
				this.boost({atk: 2}, target, target, null, true);
				this.bounceMove(effect, target, source);
			}
		},
	},
	"disguise": {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (effect && effect.effectType === 'Move' && target.species.id === 'mimikyu' && !target.transformed) {
				this.add('-activate', target, 'ability: Disguise');
				this.effectData.busted = true;
				this.bounceMove(effect, target, source);
				return 0;
			}
		},
	},
	"dryskin": {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Dry Skin');
				}
				this.bounceMove(move, target, source);
				return null;
			}
		},
	},
	"effectspore": {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move?.flags['contact'] && !source.status && source.runStatusImmunity('powder')) {
				const r = this.random(100);
				if (r < 11) {
					source.setStatus('slp', target);
				} else if (r < 21) {
					source.setStatus('par', target);
				} else if (r < 30) {
					source.setStatus('psn', target);
				}
				if (r < 30) this.bounceMove(move, target, source);
			}
		},
	},
	"emergencyexit": {
		inherit: true,
		onAfterMoveSecondary(target, source, move) {
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			if (target.hp <= target.maxhp / 2 && target.hp + move.totalDamage > target.maxhp / 2) {
				if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) return;
				target.switchFlag = true;
				source.switchFlag = false;
				this.add('-activate', target, 'ability: Emergency Exit');
				this.bounceMove(move, target, source);
			}
		},
	},
	"flamebody": {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move?.flags['contact']) {
				if (this.random(10) < 3) {
					if (source.trySetStatus('brn', target)) this.bounceMove(move, target, source);
				}
			}
		},
	},
	"flashfire": {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				move.accuracy = true;
				if (!target.addVolatile('flashfire')) {
					this.add('-immune', target, '[msg]', '[from] ability: Flash Fire');
					this.bounceMove(move, target, source);
				}
				return null;
			}
		},
	},
	"flowerveil": {
		inherit: true,
		onAllyBoost(boost, target, source, effect) {
			if ((source && target === source) || !target.hasType('Grass')) return;
			let showMsg = false;
			let i: BoostName;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries) {
				this.add('-fail', this.effectData.target, 'unboost', '[from] ability: Flower Veil', '[of] ' + target);
				this.bounceMove(effect, target, source);
			}
		},
		onAllySetStatus(status, target, source, effect) {
			if (target.hasType('Grass')) {
				if (!(effect as ActiveMove)?.status) return false;
				this.add('-activate', this.effectData.target, 'ability: Flower Veil', '[of] ' + target);
				this.bounceMove(effect, target, source);
				return null;
			}
		},
	},
	"fullmetalbody": {
		inherit: true,
		onBoost(boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			let i: BoostName;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries) {
				this.add("-fail", target, "unboost", "[from] ability: Full Metal Body", "[of] " + target);
				this.bounceMove(effect, target, source);
			}
		},
	},
	"gooey": {
		inherit: true,
		onDamagingHit(damage, target, source, effect) {
			if (effect?.flags['contact']) {
				this.add('-ability', target, 'Gooey');
				this.boost({spe: -1}, source, target, null, true);
				this.bounceMove(effect, target, source);
			}
		},
	},
	"hypercutter": {
		inherit: true,
		onBoost(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost['atk'] && boost['atk'] < 0) {
				delete boost['atk'];
				if (!(effect as ActiveMove).secondaries) {
					this.add("-fail", target, "unboost", "Attack", "[from] ability: Hyper Cutter", "[of] " + target);
					this.bounceMove(effect, target, source);
				}
			}
		},
	},
	"illusion": {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (target.illusion && move && move.effectType === 'Move' && move.id !== 'confused') {
				this.singleEvent('End', this.dex.getAbility('Illusion'), target.abilityData, target, target);
				this.bounceMove(move, target, source);
			}
		},
	},
	"immunity": {
		inherit: true,
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'psn' && status.id !== 'tox') return;
			if (!(effect as ActiveMove)?.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Immunity');
			this.bounceMove(effect, target, source);
			return false;
		},
	},
	"innardsout": {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (source && source !== target && move && move.effectType === 'Move' && !target.hp) {
				this.damage(damage, source, target);
				this.bounceMove(move, target, source);
			}
		},
	},
	"innerfocus": {
		inherit: true,
		onFlinch: false, // FIXME
	},
	"insomnia": {
		inherit: true,
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'slp') return;
			if (!(effect as ActiveMove)?.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Insomnia');
			this.bounceMove(effect, target, source);
			return false;
		},
	},
	"ironbarbs": {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				this.damage(source.maxhp / 8, source, target);
				this.bounceMove(move, target, source);
			}
		},
	},
	"justified": {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move && move.type === 'Dark') {
				this.boost({atk: 1});
				this.bounceMove(move, target, source);
			}
		},
	},
	"keeneye": {
		inherit: true,
		onBoost(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost['accuracy'] && boost['accuracy'] < 0) {
				delete boost['accuracy'];
				if (!(effect as ActiveMove).secondaries) {
					this.add("-fail", target, "unboost", "accuracy", "[from] ability: Keen Eye", "[of] " + target);
					this.bounceMove(effect, target, source);
				}
			}
		},
	},
	"leafguard": {
		inherit: true,
		onSetStatus(status, target, source, effect) {
			if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				if ((effect as ActiveMove)?.status) {
					this.add('-immune', target, '[msg]', '[from] ability: Leaf Guard');
					this.bounceMove(effect, target, source);
				}
				return false;
			}
		},
		onTryAddVolatile(status, target, source) {
			if (status.id === 'yawn' && this.field.isWeather(['sunnyday', 'desolateland'])) {
				this.add('-immune', target, '[msg]', '[from] ability: Leaf Guard');
				if (this.activeMove) this.bounceMove(this.activeMove, target, source);
				return null;
			}
		},
	},
	"levitate": {
		inherit: true,
		// airborneness implemented in battle-engine.js:BattlePokemon#isGrounded
		// FIXME
	},
	"lightningrod": {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.boost({spa: 1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Lightning Rod');
				}
				this.bounceMove(move, target, source);
				return null;
			}
		},
		onAnyRedirectTarget(target, source, source2, move) {
			if (move.type !== 'Electric' || move.id in {firepledge: 1, grasspledge: 1, waterpledge: 1}) return;
			if (this.validTarget(this.effectData.target, source, move.target)) {
				if (this.effectData.target !== target) {
					this.add('-activate', this.effectData.target, 'ability: Lightning Rod');
					this.bounceMove(move, target, source);
				}
				return this.effectData.target;
			}
		},
	},
	"limber": {
		inherit: true,
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'par') return;
			if (!(effect as ActiveMove)?.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Limber');
			this.bounceMove(effect, target, source);
			return false;
		},
	},
	"liquidooze": {
		inherit: true,
		onSourceTryHeal(damage, target, source, effect) {
			this.debug("Heal is occurring: " + target + " <- " + source + " :: " + effect.id);
			const canOoze = ['drain', 'leechseed', 'strengthsap'];
			if (canOoze.includes(effect.id)) {
				this.damage(damage);
				if (this.activeMove && effect.id !== 'leechseed') this.bounceMove(this.activeMove, source, target);
				return 0;
			}
		},
	},
	"magicbounce": {
		inherit: true,
		onTryHit(target, source, move) {
			if (target === source || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			this.bounceMove(move, target, source);
			this.bounceMove(move, target, source);
			return null;
		},
		onAllyTryHitSide(target, source, move) {
			if (target.side === source.side || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			this.bounceMove(move, target, source);
			this.bounceMove(move, target, source);
			return null;
		},
	},
	/*
	"magmaarmor": {
		inherit: true,
		onImmunity(type, pokemon) {
			if (type === 'frz') return false;
		},
	},
	*/
	"motordrive": {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.boost({spe: 1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Motor Drive');
				}
				this.bounceMove(move, target, source);
				return null;
			}
		},
	},
	"mummy": {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact'] && source.ability !== 'mummy') {
				const oldAbility = source.setAbility('mummy', target);
				if (oldAbility) {
					this.add('-activate', target, 'ability: Mummy', this.dex.getAbility(oldAbility).name, '[of] ' + source);
					this.bounceMove(move, target, source);
				}
			}
		},
	},
	"oblivious": {
		inherit: true,
		onTryHit(target, source, move) {
			if (move.id === 'attract' || move.id === 'captivate' || move.id === 'taunt') {
				this.add('-immune', target, '[msg]', '[from] ability: Oblivious');
				this.bounceMove(move, target, source);
				return null;
			}
		},
	},
	"overcoat": {
		inherit: true,
		onTryHit(target, source, move) {
			if (move.flags['powder'] && target !== source && this.dex.getImmunity('powder', target)) {
				this.add('-immune', target, '[msg]', '[from] ability: Overcoat');
				this.bounceMove(move, target, source);
				return null;
			}
		},
	},
	"owntempo": {
		inherit: true,
		onHit(target, source, move) {
			if (move && move.volatileStatus === 'confusion') {
				this.add('-immune', target, 'confusion', '[from] ability: Own Tempo');
				this.bounceMove(move, target, source);
			}
		},
	},
	"pickpocket": {
		inherit: true,
		onAfterMoveSecondary(target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				if (target.item) {
					return;
				}
				const yourItem = source.takeItem(target);
				if (!yourItem) {
					return;
				}
				if (!target.setItem(yourItem)) {
					source.item = yourItem.id;
					return;
				}
				this.add('-item', target, yourItem, '[from] ability: Pickpocket', '[of] ' + source);
				this.bounceMove(move, target, source);
			}
		},
	},
	"poisonpoint": {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move?.flags['contact']) {
				if (this.random(10) < 3) {
					if (source.trySetStatus('psn', target)) this.bounceMove(move, target, source);
				}
			}
		},
	},
	"queenlymajesty": {
		inherit: true,
		onFoeTryMove(target, source, effect) {
			if ((source.side === this.effectData.target.side || effect.id === 'perishsong') && effect.priority > 0.1 && effect.target !== 'foeSide') {
				this.attrLastMove('[still]');
				this.add('cant', this.effectData.target, 'ability: Queenly Majesty', effect, '[of] ' + target);
				this.bounceMove(effect, this.effectData.target, target);
				return false;
			}
		},
	},
	"rattled": {
		inherit: true,
		onDamagingHit(damage, target, source, effect) {
			if (effect && (effect.type === 'Dark' || effect.type === 'Bug' || effect.type === 'Ghost')) {
				this.boost({spe: 1});
				this.bounceMove(effect, target, source);
			}
		},
	},
	"roughskin": {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				this.damage(source.maxhp / 8, source, target);
				this.bounceMove(move, target, source);
			}
		},
	},
	"sapsipper": {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Grass') {
				if (!this.boost({atk: 1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Sap Sipper');
				}
				this.bounceMove(move, target, source);
				return null;
			}
		},
		onAllyTryHitSide(target, source, move) {
			if (target === this.effectData.target || target.side !== source.side) return;
			if (move.type === 'Grass') {
				this.boost({atk: 1}, this.effectData.target);
				this.bounceMove(move, target, source);
			}
		},
	},
	/*
	"shellarmor": {
		inherit: true,
		onCriticalHit(target, source, move) {
			this.useMove(move.id, target, source);
			return false;
		},
	},
	*/
	"soundproof": {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.flags['sound']) {
				this.add('-immune', target, '[msg]', '[from] ability: Soundproof');
				this.bounceMove(move, target, source);
				return null;
			}
		},
		onAllyTryHitSide(target, source, move) {
			if (move.flags['sound']) {
				this.add('-immune', this.effectData.target, '[msg]', '[from] ability: Soundproof');
				this.bounceMove(move, target, source);
			}
		},
	},
	"stamina": {
		inherit: true,
		onDamagingHit(damage, target, source, effect) {
			if (effect && effect.effectType === 'Move' && effect.id !== 'confused') {
				this.boost({def: 1});
				this.bounceMove(effect, target, source);
			}
		},
	},
	"static": {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move?.flags['contact']) {
				if (this.random(10) < 3) {
					if (source.trySetStatus('par', target)) this.bounceMove(move, target, source);
				}
			}
		},
	},
	/*
	"steadfast": {
		inherit: true,
		onFlinch(pokemon) {
			this.boost({spe: 1});
		},
	},
	*/
	"stickyhold": {
		inherit: true,
		onTakeItem(item, pokemon, source) {
			if (this.suppressingAttackEvents() && pokemon !== this.activePokemon || !pokemon.hp || pokemon.item === 'stickybarb') return;
			if ((source && source !== pokemon) || this.activeMove?.id === 'knockoff') {
				this.add('-activate', pokemon, 'ability: Sticky Hold');
				if (this.activeMove) this.bounceMove(this.activeMove, pokemon, source);
				return false;
			}
		},
	},
	"stormdrain": {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.boost({spa: 1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Storm Drain');
				}
				this.bounceMove(move, target, source);
				return null;
			}
		},
		onAnyRedirectTarget(target, source, source2, move) {
			if (move.type !== 'Water' || move.id in {firepledge: 1, grasspledge: 1, waterpledge: 1}) return;
			if (this.validTarget(this.effectData.target, source, move.target)) {
				if (this.effectData.target !== target) {
					this.add('-activate', this.effectData.target, 'ability: Storm Drain');
					this.bounceMove(move, target, source);
				}
				return this.effectData.target;
			}
		},
	},
	"sturdy": {
		inherit: true,
		onTryHit(target, source, move) {
			if (move.ohko) {
				this.add('-immune', target, '[msg]', '[from] ability: Sturdy');
				this.bounceMove(move, target, source);
				return null;
			}
		},
		onDamage(damage, target, source, effect) {
			if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-ability', target, 'Sturdy');
				this.bounceMove(effect, target, source);
				return target.hp - 1;
			}
		},
	},
	"suctioncups": {
		inherit: true,
		onDragOut(pokemon) {
			this.add('-activate', pokemon, 'ability: Suction Cups');
			if (this.activeMove) this.bounceMove(this.activeMove, pokemon);
			return null;
		},
	},
	"sweetveil": {
		inherit: true,
		onAllySetStatus(status, target, source, effect) {
			if (status.id === 'slp') {
				this.debug('Sweet Veil interrupts sleep');
				this.add('-activate', this.effectData.target, 'ability: Sweet Veil', '[of] ' + target);
				this.bounceMove(effect, target, source);
				return null;
			}
		},
		onAllyTryAddVolatile(status, target, source) {
			if (status.id === 'yawn') {
				this.debug('Sweet Veil blocking yawn');
				this.add('-activate', this.effectData.target, 'ability: Sweet Veil', '[of] ' + target);
				if (this.activeMove) this.bounceMove(this.activeMove, target, source);
				return null;
			}
		},
	},
	"synchronize": {
		inherit: true,
		onAfterSetStatus(status, target, source, effect) {
			if (!source || source === target) return;
			if (effect && effect.id === 'toxicspikes') return;
			if (status.id === 'slp' || status.id === 'frz') return;
			this.add('-activate', target, 'ability: Synchronize');
			if (source.trySetStatus(status, target, {status: status.id, id: 'synchronize' as ID} as Effect)) this.bounceMove(effect, target, source);
		},
	},
	"tanglinghair": {
		inherit: true,
		onDamagingHit(damage, target, source, effect) {
			if (effect?.flags['contact']) {
				this.add('-ability', target, 'Tangling Hair');
				this.boost({spe: -1}, source, target, null, false, true);
				this.bounceMove(effect, target, source);
			}
		},
	},
	"telepathy": {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && target.side === source.side && move.category !== 'Status') {
				this.add('-activate', target, 'ability: Telepathy');
				this.bounceMove(move, target, source);
				return null;
			}
		},
	},
	"vitalspirit": {
		inherit: true,
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'slp') return;
			if (!(effect as ActiveMove).status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Vital Spirit');
			this.bounceMove(effect, target, source);
			return false;
		},
	},
	"voltabsorb": {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Volt Absorb');
				}
				this.bounceMove(move, target, source);
				return null;
			}
		},
	},
	"waterabsorb": {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Water Absorb');
				}
				this.bounceMove(move, target, source);
				return null;
			}
		},
	},
	"waterbubble": {
		inherit: true,
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if (!(effect as ActiveMove).status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Water Bubble');
			this.bounceMove(effect, target, source);
			return false;
		},
	},
	"watercompaction": {
		inherit: true,
		onDamagingHit(damage, target, source, effect) {
			if (effect && effect.type === 'Water') {
				this.boost({def: 2});
				this.bounceMove(effect, target, source);
			}
		},
	},
	"waterveil": {
		inherit: true,
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if (!(effect as ActiveMove).status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Water Veil');
			this.bounceMove(effect, target, source);
			return false;
		},
	},
	"weakarmor": {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Physical') {
				this.boost({def: -1, spe: 2});
				this.bounceMove(move, target, source);
			}
		},
	},
	"whitesmoke": {
		inherit: true,
		onBoost(boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			let i: BoostName;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries) {
				this.add("-fail", target, "unboost", "[from] ability: White Smoke", "[of] " + target);
				this.bounceMove(effect, target, source);
			}
		},
	},
	"wimpout": {
		inherit: true,
		onAfterMoveSecondary(target, source, move) {
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			if (target.hp <= target.maxhp / 2 && target.hp + move.totalDamage > target.maxhp / 2) {
				if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) return;
				target.switchFlag = true;
				source.switchFlag = false;
				this.add('-activate', target, 'ability: Wimp Out');
				this.bounceMove(move, target, source);
			}
		},
	},
	"wonderguard": {
		inherit: true,
		onTryHit(target, source, move) {
			if (target === source || move.category === 'Status' || move.type === '???' || move.id === 'struggle') return;
			this.debug('Wonder Guard immunity: ' + move.id);
			if (target.runEffectiveness(move) <= 0) {
				this.add('-immune', target, '[msg]', '[from] ability: Wonder Guard');
				this.bounceMove(move, target, source);
				return null;
			}
		},
	},
};
