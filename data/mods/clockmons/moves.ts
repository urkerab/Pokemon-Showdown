export const Moves: {[k: string]: ModdedMoveData} = {
	"doomdesire": {
		inherit: true,
		desc: "Deals damage one turn after this move is used. At the end of that turn, the damage is calculated at that time and dealt to the Pokemon at the position the target had when the move was used. If the user is no longer active at the time, damage is calculated based on the user's natural Special Attack stat, types, and level, with no boosts from its held item or Ability. Fails if this move or Future Sight is already in effect for the target's position.",
		shortDesc: "Hits one turn after being used.",
		onTry(source, target) {
			target.side.addSideCondition('futuremove');
			if (target.side.sideConditions['futuremove'].positions[target.position]) {
				return false;
			}
			target.side.sideConditions['futuremove'].positions[target.position] = {
				duration: 2,
				move: 'doomdesire',
				source: source,
				moveData: {
					id: 'doomdesire',
					name: "Doom Desire",
					accuracy: 100,
					basePower: 140,
					category: "Special",
					flags: {},
					effectType: 'Move',
					isFutureMove: true,
					type: 'Steel',
				},
			};
			this.add('-start', source, 'Doom Desire');
			return null;
		},
	},
	"electricterrain": {
		inherit: true,
		desc: "For 10 turns, the terrain becomes Electric Terrain. During the effect, the power of Electric-type attacks made by grounded Pokemon is multiplied by 1.5 and grounded Pokemon cannot fall asleep; Pokemon already asleep do not wake up. Camouflage transforms the user into an Electric type, Nature Power becomes Thunderbolt, and Secret Power has a 30% chance to cause paralysis. Fails if the current terrain is Electric Terrain.",
		shortDesc: "10 turns. Grounded: +Electric power, can't sleep.",
		condition: {
			duration: 10,
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
	"futuresight": {
		inherit: true,
		desc: "Deals damage one turn after this move is used. At the end of that turn, the damage is calculated at that time and dealt to the Pokemon at the position the target had when the move was used. If the user is no longer active at the time, damage is calculated based on the user's natural Special Attack stat, types, and level, with no boosts from its held item or Ability. Fails if this move or Doom Desire is already in effect for the target's position.",
		shortDesc: "Hits one turn after being used.",
		onTry(source, target) {
			target.side.addSideCondition('futuremove');
			if (target.side.sideConditions['futuremove'].positions[target.position]) {
				return false;
			}
			target.side.sideConditions['futuremove'].positions[target.position] = {
				duration: 2,
				move: 'futuresight',
				source: source,
				moveData: {
					id: 'futuresight',
					name: "Future Sight",
					accuracy: 100,
					basePower: 120,
					category: "Special",
					flags: {},
					ignoreImmunity: false,
					effectType: 'Move',
					isFutureMove: true,
					type: 'Psychic',
				},
			};
			this.add('-start', source, 'move: Future Sight');
			return null;
		},
	},
	"grassyterrain": {
		inherit: true,
		desc: "For 10 turns, the terrain becomes Grassy Terrain. During the effect, the power of Grass-type attacks used by grounded Pokemon is multiplied by 1.5, the power of Bulldoze, Earthquake, and Magnitude used against grounded Pokemon is multiplied by 0.5, and grounded Pokemon have 1/16 of their maximum HP, rounded down, restored at the end of each turn, including the last turn. Camouflage transforms the user into a Grass type, Nature Power becomes Energy Ball, and Secret Power has a 30% chance to cause sleep. Fails if the current terrain is Grassy Terrain.",
		shortDesc: "10 turns. Grounded: +Grass power,+1/16 max HP.",
		condition: {
			duration: 10,
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
		desc: "For 10 turns, the evasiveness of all active Pokemon is multiplied by 0.6. At the time of use, Bounce, Fly, Magnet Rise, Sky Drop, and Telekinesis end immediately for all active Pokemon. During the effect, Bounce, Fly, Flying Press, High Jump Kick, Jump Kick, Magnet Rise, Sky Drop, Splash, and Telekinesis are prevented from being used by all active Pokemon. Ground-type attacks, Spikes, Toxic Spikes, Sticky Web, and the Ability Arena Trap can affect Flying types or Pokemon with the Ability Levitate. Fails if this move is already in effect.",
		shortDesc: "For 10 turns, negates all Ground immunities.",
		condition: {
			duration: 10,
			onStart() {
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
					if (applies) this.add('-activate', pokemon, 'Gravity');
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
	"hail": {
		inherit: true,
		desc: "For 10 turns, the weather becomes Hail. At the end of each turn except the last, all active Pokemon lose 1/16 of their maximum HP, rounded down, unless they are an Ice type, or have the Abilities Ice Body, Magic Guard, Overcoat, or Snow Cloak. Lasts for 13 turns if the user is holding Icy Rock. Fails if the current weather is Hail.",
		shortDesc: "For 10 turns, hail crashes down.",
	},
	"magicroom": {
		inherit: true,
		desc: "For 10 turns, the held items of all active Pokemon have no effect. An item's effect of causing forme changes is unaffected, but any other effects from such items are negated. During the effect, Fling and Natural Gift are prevented from being used by all active Pokemon. If this move is used during the effect, the effect ends.",
		shortDesc: "For 10 turns, all held items have no effect.",
		condition: {
			duration: 10,
			onStart(target, source) {
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
		desc: "For 10 turns, the terrain becomes Misty Terrain. During the effect, the power of Dragon-type attacks used against grounded Pokemon is multiplied by 0.5 and grounded Pokemon cannot be inflicted with a major status condition. Camouflage transforms the user into a Fairy type, Nature Power becomes Moonblast, and Secret Power has a 30% chance to lower Special Attack by 1 stage. Fails if the current terrain is Misty Terrain.",
		shortDesc: "10 turns. Can't status,-Dragon power vs grounded.",
		condition: {
			duration: 10,
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
	"raindance": {
		inherit: true,
		desc: "For 10 turns, the weather becomes Rain Dance. The damage of Water-type attacks is multiplied by 1.5 and the damage of Fire-type attacks is multiplied by 0.5 during the effect. Lasts for 13 turns if the user is holding Damp Rock. Fails if the current weather is Rain Dance.",
		shortDesc: "For 10 turns, heavy rain powers Water moves.",
	},
	"reflect": {
		inherit: true,
		desc: "For 10 turns, the user and its party members take 0.5x damage from physical attacks, or 0.66x damage if in a Double or Triple Battle. Critical hits ignore this protection. It is removed from the user's side if the user or an ally is successfully hit by Brick Break or Defog. Brick Break removes the effect before damage is calculated. Lasts for 13 turns if the user is holding Light Clay.",
		shortDesc: "For 10 turns, physical damage to allies is halved.",
		condition: {
			duration: 10,
			durationCallback(target, source, effect) {
				if (source?.hasItem('lightclay')) {
					return 13;
				}
				return 10;
			},
			onAnyModifyDamage(damage, source, target, move) {
				if (target !== source && target.side === this.effectData.target && this.getCategory(move) === 'Physical') {
					if (!target.getMoveHitData(move).crit && !move.infiltrates) {
						this.debug('Reflect weaken');
						if (target.side.active.length > 1) return this.chainModify([0xAAC, 0x1000]);
						return this.chainModify(0.5);
					}
				}
			},
			onStart(side) {
				this.add('-sidestart', side, 'Reflect');
			},
			onResidualOrder: 21,
			onEnd(side) {
				this.add('-sideend', side, 'Reflect');
			},
		},
	},
	"sandstorm": {
		inherit: true,
		desc: "For 10 turns, the weather becomes Sandstorm. At the end of each turn except the last, all active Pokemon lose 1/16 of their maximum HP, rounded down, unless they are a Ground, Rock, or Steel type, or have the Abilities Magic Guard, Overcoat, Sand Force, Sand Rush, or Sand Veil. The Special Defense of Rock-type Pokemon is multiplied by 1.5 when taking damage from a special attack during the effect. Lasts for 13 turns if the user is holding Smooth Rock. Fails if the current weather is Sandstorm.",
		shortDesc: "For 10 turns, a sandstorm rages.",
	},
	"spikes": {
		inherit: true,
		desc: "Sets up a hazard on the foe's side of the field for 8 turns, damaging each foe that switches in, unless it is a Flying-type Pokemon or has the Ability Levitate. Can be used up to two times before failing. Foes lose 1/6 of their maximum HP with one layer and 1/4 of their maximum HP with two layers, all rounded down. Can be removed from the foe's side if any foe uses Rapid Spin or Defog, or is hit by Defog.",
		shortDesc: "Hurts grounded foes on switch-in for 8 turns. Max 2 layers.",
		condition: {
			// this is a side condition
			duration: 9,
			onStart(side) {
				this.add('-sidestart', side, 'Spikes');
				this.add('-sidestart', side, 'Spikes');
				this.effectData.layers = 6;
			},
			onRestart(side) {
				if (this.effectData.layers === 4) return false;
				this.add('-sidestart', side, 'Spikes');
				this.effectData.layers = 4;
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded()) return;
				this.damage(pokemon.maxhp / this.effectData.layers);
			},
		},
	},
	"stealthrock": {
		inherit: true,
		desc: "Sets up a hazard on the foe's side of the field for 8 turns, damaging each foe that switches in. Can be used only once before failing. Foes lose 1/32, 1/16, 1/8, 1/4, or 1/2 of their maximum HP, rounded down, based on their weakness to the Rock type; 0.25x, 0.5x, neutral, 2x, or 4x, respectively. Can be removed from the foe's side if any foe uses Rapid Spin or Defog, or is hit by Defog.",
		shortDesc: "Hurts foes on switch-in for 8 turns. Factors Rock weakness.",
		condition: {
			// this is a side condition
			duration: 9,
			onStart(side) {
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
		desc: "Sets up a hazard on the foe's side of the field for 8 turns, lowering the Speed by 1 stage of each foe that switches in, unless it is a Flying-type Pokemon or has the Ability Levitate. Can be used only once before failing. Can be removed from the foe's side if any foe uses Rapid Spin or Defog, or is hit by Defog.",
		shortDesc: "Lowers Speed of grounded foes by 1 on switch-in for 8 turns.",
		condition: {
			duration: 9,
			onStart(side) {
				this.add('-sidestart', side, 'move: Sticky Web');
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded()) return;
				this.add('-activate', pokemon, 'move: Sticky Web');
				this.boost({spe: -1}, pokemon, pokemon.side.foe.active[0], this.dex.getActiveMove('stickyweb'));
			},
		},
	},
	"sunnyday": {
		inherit: true,
		desc: "For 10 turns, the weather becomes Sunny Day. The damage of Fire-type attacks is multiplied by 1.5 and the damage of Water-type attacks is multiplied by 0.5 during the effect. Lasts for 13 turns if the user is holding Heat Rock. Fails if the current weather is Sunny Day.",
		shortDesc: "For 10 turns, intense sunlight powers Fire moves.",
	},
	"tailwind": {
		inherit: true,
		desc: "For 8 turns, the user and its party members have their Speed doubled. Fails if this move is already in effect for the user's side.",
		shortDesc: "For 8 turns, allies' Speed is doubled.",
		condition: {
			duration: 8,
			onStart(side) {
				this.add('-sidestart', side, 'move: Tailwind');
			},
			onModifySpe(spe, pokemon) {
				return this.chainModify(2);
			},
			onResidualOrder: 21,
			onResidualSubOrder: 4,
			onEnd(side) {
				this.add('-sideend', side, 'move: Tailwind');
			},
		},
	},
	"toxicspikes": {
		inherit: true,
		desc: "Sets up a hazard on the foe's side of the field for 8 turns, poisoning each foe that switches in, unless it is a Flying-type Pokemon or has the Ability Levitate. Can be used up to two times before failing. Foes become poisoned with one layer and badly poisoned with two layers. Can be removed from the foe's side if any foe uses Rapid Spin or Defog, is hit by Defog, or a grounded Poison-type Pokemon switches in. Safeguard prevents the foe's party from being poisoned on switch-in, but a substitute does not.",
		shortDesc: "Poisons grounded foes on switch-in for 8 turns. Max 2 layers.",
		condition: {
			// this is a side condition
			duration: 9,
			onStart(side) {
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectData.layers = 1;
			},
			onRestart(side) {
				if (this.effectData.layers >= 2) return false;
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectData.layers++;
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded()) return;
				if (!pokemon.runImmunity('Poison')) return;
				if (pokemon.hasType('Poison')) {
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
		desc: "For 10 turns, all active Pokemon with lower Speed will move before those with higher Speed, within their priority brackets. If this move is used during the effect, the effect ends.",
		shortDesc: "For 10 turns, slower Pokemon move first.",
		condition: {
			duration: 10,
			onStart(target, source) {
				this.add('-fieldstart', 'move: Trick Room', '[of] ' + source);
			},
			// Speed modification is changed in BattlePokemon.getActionSpeed() in battle-engine.js
			onResidualOrder: 23,
			onEnd() {
				this.add('-fieldend', 'move: Trick Room');
			},
		},
	},
	"wonderroom": {
		inherit: true,
		desc: "For 10 turns, all active Pokemon have their Defense and Special Defense stats swapped. Stat stage changes are unaffected. If this move is used during the effect, the effect ends.",
		shortDesc: "For 10 turns, all Defense and Sp. Def stats switch.",
		condition: {
			duration: 10,
			onStart(side, source) {
				this.add('-fieldstart', 'move: WonderRoom', '[of] ' + source);
			},
			onModifyMovePriority: -100,
			onModifyMove(move) {
				move.defensiveCategory = ((move.defensiveCategory || this.getCategory(move)) === 'Physical' ? 'Special' : 'Physical');
				this.debug('Defensive Category: ' + move.defensiveCategory);
			},
			onResidualOrder: 24,
			onEnd() {
				this.add('-fieldend', 'move: Wonder Room');
			},
		},
	},
};
