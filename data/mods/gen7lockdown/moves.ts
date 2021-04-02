export const Moves: {[k: string]: ModdedMoveData} = {
	"defog": {
		inherit: true,
		onHit(target, source, move) {
			if (!target.volatiles['substitute'] || move.infiltrates) this.boost({evasion: -1});
			const removeTarget = {reflect: 1, lightscreen: 1, safeguard: 1, mist: 1};
			const removeAll = {spikes: 1, toxicspikes: 1, stealthrock: 1, stickyweb: 1};
			for (const targetCondition in removeTarget) {
				target.side.removeSideCondition(targetCondition);
			}
			if (this.turn < 7) {
				for (const sideCondition in removeAll) {
					if (target.side.removeSideCondition(sideCondition)) {
						this.add('-sideend', source.side, this.dex.getEffect(sideCondition).name, '[from] move: Defog', '[of] ' + source);
					}
				}
				for (const sideCondition in removeAll) {
					if (source.side.removeSideCondition(sideCondition)) {
						this.add('-sideend', source.side, this.dex.getEffect(sideCondition).name, '[from] move: Defog', '[of] ' + source);
					}
				}
			}
		},
	},
	"electricterrain": {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (this.turn > 2) {
					return 0;
				}
				return 5;
			},
			onSetStatus(status, target, source, effect) {
				if (status.id === 'slp' && target.isGrounded() && !target.isSemiInvulnerable()) {
					if (effect.effectType === 'Move' && !effect.secondaries) {
						this.add('-activate', target, 'move: Electric Terrain');
					}
					return false;
				}
			},
			onTryAddVolatile(status, target) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				if (status.id === 'yawn') {
					this.add('-activate', target, 'move: Electric Terrain');
					return null;
				}
			},
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Electric' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					this.debug('electric terrain boost');
					return this.chainModify(1.5);
				}
			},
			onStart(battle, source, effect) {
				if (this.turn > 6) return false;
				if (effect && effect.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Electric Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Electric Terrain');
				}
			},
			onResidualOrder: 21,
			onResidualSubOrder: 2,
			onEnd() {
				this.add('-fieldend', 'move: Electric Terrain');
			},
		},
	},
	"grassyterrain": {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (this.turn > 2) {
					return 0;
				}
				return 5;
			},
			onBasePower(basePower, attacker, defender, move) {
				const weakenedMoves = ['earthquake', 'bulldoze', 'magnitude'];
				if (weakenedMoves.includes(move.id)) {
					this.debug('move weakened by grassy terrain');
					return this.chainModify(0.5);
				}
				if (move.type === 'Grass' && attacker.isGrounded()) {
					this.debug('grassy terrain boost');
					return this.chainModify(1.5);
				}
			},
			onStart(battle, source, effect) {
				if (this.turn > 6) return false;
				if (effect && effect.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Grassy Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Grassy Terrain');
				}
			},
			onResidualOrder: 5,
			onResidualSubOrder: 3,
			onResidual() {
				this.eachEvent('Terrain');
			},
			onTerrain(pokemon) {
				if (pokemon.isGrounded() && !pokemon.isSemiInvulnerable()) {
					this.debug('Pokemon is grounded, healing through Grassy Terrain.');
					this.heal(pokemon.maxhp / 16, pokemon, pokemon);
				}
			},
			onEnd(battle) {
				if (!this.effectData.duration) this.eachEvent('Terrain');
				this.add('-fieldend', 'move: Grassy Terrain');
			},
		},
	},
	"gravity": {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (this.turn > 2) {
					return 0;
				}
				return 5;
			},
			onStart() {
				if (this.turn > 6) return false;
				this.add('-fieldstart', 'move: Gravity');
				const allActivePokemon = this.sides[0].active.concat(this.sides[1].active);
				for (const pokemon of allActivePokemon) {
					let applies = false;
					if (pokemon.removeVolatile('bounce') || pokemon.removeVolatile('fly')) {
						applies = true;
						this.queue.cancelMove(pokemon);
						pokemon.removeVolatile('twoturnmove');
					}
					if (pokemon.volatiles['skydrop']) {
						applies = true;
						this.queue.cancelMove(pokemon);

						if (pokemon.volatiles['skydrop'].source) {
							this.add('-end', pokemon.volatiles['twoturnmove'].source, 'Sky Drop', '[interrupt]');
						}
						pokemon.removeVolatile('skydrop');
						pokemon.removeVolatile('twoturnmove');
					}
					if (pokemon.volatiles['magnetrise']) {
						applies = true;
						delete pokemon.volatiles['magnetrise'];
					}
					if (pokemon.volatiles['telekinesis']) {
						applies = true;
						delete pokemon.volatiles['telekinesis'];
					}
					if (applies) this.add('-activate', pokemon, 'move: Gravity');
				}
			},
			onModifyAccuracy(accuracy) {
				if (typeof accuracy !== 'number') return;
				return accuracy * 5 / 3;
			},
			onDisableMove(pokemon) {
				for (const move of pokemon.moves) {
					if (this.dex.getMove(move).flags['gravity']) {
						pokemon.disableMove(move);
					}
				}
			},
			// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
				if (move.flags['gravity']) {
					this.add('cant', pokemon, 'move: Gravity', move);
					return false;
				}
			},
			onResidualOrder: 22,
			onEnd() {
				this.add('-fieldend', 'move: Gravity');
			},
		},
	},
	"magicroom": {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (this.turn > 2) {
					return 0;
				}
				return 5;
			},
			onStart(target, source) {
				if (this.turn > 6) return false;
				this.add('-fieldstart', 'move: Magic Room', '[of] ' + source);
			},
			// Item suppression implemented in BattlePokemon.ignoringItem() within battle-engine.js
			onResidualOrder: 25,
			onEnd() {
				this.add('-fieldend', 'move: Magic Room', '[of] ' + this.effectData.source);
			},
		},
	},
	"mistyterrain": {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (this.turn > 2) {
					return 0;
				}
				return 5;
			},
			onSetStatus(status, target, source, effect) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				if (effect.id === 'synchronize' || (effect.effectType === 'Move' && !effect.secondaries)) {
					this.add('-activate', target, 'move: Misty Terrain');
				}
				return false;
			},
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Dragon' && defender.isGrounded() && !defender.isSemiInvulnerable()) {
					this.debug('misty terrain weaken');
					return this.chainModify(0.5);
				}
			},
			onStart(battle, source, effect) {
				if (this.turn > 6) return false;
				if (effect && effect.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Misty Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Misty Terrain');
				}
			},
			onResidualOrder: 21,
			onResidualSubOrder: 2,
			onEnd(side) {
				this.add('-fieldend', 'Misty Terrain');
			},
		},
	},
	"mudsport": {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (this.turn > 2) {
					return 0;
				}
				return 5;
			},
			onStart(side, source) {
				if (this.turn > 6) return false;
				this.add('-fieldstart', 'move: Mud Sport', '[of] ' + source);
			},
			onBasePowerPriority: 1,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Electric') {
					this.debug('mud sport weaken');
					return this.chainModify([0x548, 0x1000]);
				}
			},
			onResidualOrder: 21,
			onEnd() {
				this.add('-fieldend', 'move: Mud Sport');
			},
		},
	},
	"psychicterrain": {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (this.turn > 2) {
					return 0;
				}
				return 5;
			},
			onTryHitPriority: 4,
			onTryHit(target, source, effect) {
				if (!target.isGrounded() || target.isSemiInvulnerable() || target.side === source.side) return;
				if (effect && (effect.priority <= 0.1 || effect.target === 'self')) {
					return;
				}
				this.add('-activate', target, 'move: Psychic Terrain');
				return null;
			},
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Psychic' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					this.debug('psychic terrain boost');
					return this.chainModify(1.5);
				}
			},
			onStart(battle, source, effect) {
				if (this.turn > 6) return false;
				if (effect && effect.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Psychic Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Psychic Terrain');
				}
			},
			onResidualOrder: 21,
			onResidualSubOrder: 2,
			onEnd() {
				this.add('-fieldend', 'move: Psychic Terrain');
			},
		},
	},
	"rapidspin": {
		inherit: true,
		self: {
			onHit(pokemon) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
				}
				if (pokemon.hp && this.turn < 7) {
					const sideConditions = {spikes: 1, toxicspikes: 1, stealthrock: 1, stickyweb: 1};
					for (const i in sideConditions) {
						if (pokemon.side.removeSideCondition(i)) {
							this.add('-sideend', pokemon.side, this.dex.getEffect(i).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
						}
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
			},
		},
	},
	"spikes": {
		inherit: true,
		condition: {
			// this is a side condition
			onStart(side) {
				if (this.turn > 6) return false;
				this.add('-sidestart', side, 'Spikes');
				this.effectData.layers = 1;
			},
			onRestart(side) {
				if (this.turn > 6) return false;
				if (this.effectData.layers >= 3) return false;
				this.add('-sidestart', side, 'Spikes');
				this.effectData.layers++;
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded()) return;
				const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
				this.damage(damageAmounts[this.effectData.layers] * pokemon.maxhp / 24);
			},
		},
	},
	"stealthrock": {
		inherit: true,
		condition: {
			// this is a side condition
			onStart(side) {
				if (this.turn > 6) return false;
				this.add('-sidestart', side, 'move: Stealth Rock');
			},
			onSwitchIn(pokemon) {
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('stealthrock')), -6, 6);
				this.damage(pokemon.maxhp * Math.pow(2, typeMod) / 8);
			},
		},
	},
	"stickyweb": {
		inherit: true,
		condition: {
			onStart(side) {
				if (this.turn > 6) return false;
				this.add('-sidestart', side, 'move: Sticky Web');
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded()) return;
				this.add('-activate', pokemon, 'move: Sticky Web');
				this.boost({spe: -1}, pokemon, pokemon.side.foe.active[0], this.dex.getActiveMove('stickyweb'));
			},
		},
	},
	"toxicspikes": {
		inherit: true,
		condition: {
			// this is a side condition
			onStart(side) {
				if (this.turn > 6) return false;
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectData.layers = 1;
			},
			onRestart(side) {
				if (this.turn > 6) return false;
				if (this.effectData.layers >= 2) return false;
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectData.layers++;
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded()) return;
				if (!pokemon.runImmunity('Poison')) return;
				if (this.turn < 7 && pokemon.hasType('Poison')) {
					this.add('-sideend', pokemon.side, 'move: Toxic Spikes', '[of] ' + pokemon);
					pokemon.side.removeSideCondition('toxicspikes');
				} else if (this.effectData.layers >= 2) {
					pokemon.trySetStatus('tox', pokemon.side.foe.active[0]);
				} else {
					pokemon.trySetStatus('psn', pokemon.side.foe.active[0]);
				}
			},
		},
	},
	"trickroom": {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (this.turn > 2) {
					return 0;
				}
				return 5;
			},
			onStart(target, source) {
				if (this.turn > 6) return false;
				this.add('-fieldstart', 'move: Trick Room', '[of] ' + source);
			},
			// Speed modification is changed in BattlePokemon.getActionSpeed() in battle-engine.js
			onResidualOrder: 23,
			onEnd() {
				this.add('-fieldend', 'move: Trick Room');
			},
		},
	},
	"watersport": {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (this.turn > 2) {
					return 0;
				}
				return 5;
			},
			onStart(side, source) {
				if (this.turn > 6) return false;
				this.add('-fieldstart', 'move: Water Sport', '[of] ' + source);
			},
			onBasePowerPriority: 1,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Fire') {
					this.debug('water sport weaken');
					return this.chainModify([0x548, 0x1000]);
				}
			},
			onResidualOrder: 21,
			onEnd() {
				this.add('-fieldend', 'move: Water Sport');
			},
		},
	},
};
