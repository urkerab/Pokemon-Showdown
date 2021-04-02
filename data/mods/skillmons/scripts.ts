const pnames: {[k: string]: string} = {
	atk: 'Attack boost',
	minusatk: 'Attack debuff',
	def: 'Defense boost',
	minusdef: 'Defense debuff',
	spa: 'Special Attack boost',
	minusspa: 'Special Attack debuff',
	spd: 'Special Defense boost',
	minusspd: 'Special Defense debuff',
	spe: 'Speed boost',
	minusspe: 'Speed debuff',
	brn: 'Burn',
	par: 'Paralyze',
	psn: 'Poison',
	tox: 'Badly poisoned',
	slp: 'Sleep status',
	frz: 'Frozen',
	flinch: 'Flinch',
	confusion: 'Confusion',
};

export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen6',
	actions: {
		// Edit getDamage so there is no crits and no random damage.
		getDamage(pokemon, target, move, suppressMessages) {
			if (typeof move === 'string') {
				move = this.dex.getActiveMove(move);
			}

			if (typeof move === 'number') {
				move = {
					basePower: move,
					type: '???',
					category: 'Physical',
					hit: 0,
				} as ActiveMove;
			}

			if (!move.ignoreImmunity || (move.ignoreImmunity !== true && !move.ignoreImmunity[move.type])) {
				if (!target.runImmunity(move.type, true)) {
					return false;
				}
			}

			if (move.damageCallback) {
				return move.damageCallback.call(this.battle, pokemon, target);
			}
			if (move.damage === 'level') {
				return pokemon.level;
			}
			if (move.damage) {
				return move.damage;
			}

			if (!move.type) move.type = '???';
			const type = move.type;
			// '???' is typeless damage: used for Struggle and Confusion etc
			const category = this.battle.getCategory(move);

			let accuracy = move.accuracy;
			if (accuracy === true) {
				accuracy = 100;
			}
			let basePower: number | false | null = move.basePower;
			if (move.basePowerCallback) {
				basePower = move.basePowerCallback.call(this.battle, pokemon, target, move);
			}
			if (!basePower) {
				if (basePower === 0) return; // returning undefined means not dealing damage
				return basePower;
			}
			basePower *= accuracy / 100;
			const critRatio = this.battle.runEvent('ModifyCritRatio', pokemon, target, move, move.critRatio || 0);
			if (critRatio === 2) basePower *= 1.125;
			if (critRatio === 3) basePower *= 1.25;

			basePower = this.battle.clampIntRange(basePower, 1);

			basePower = this.battle.runEvent('BasePower', pokemon, target, move, basePower, true);
			if (!basePower) return 0;
			basePower = this.battle.clampIntRange(basePower, 1);

			const level = pokemon.level;

			const attacker = pokemon;
			const defender = target;
			const attackStat: StatIDExceptHP = category === 'Physical' ? 'atk' : 'spa';
			const defenseStat: StatIDExceptHP = move.overrideDefensiveStat || (category === 'Physical' ? 'def' : 'spd');
			const statTable = {atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe'};
			let attack;
			let defense;

			let atkBoosts = move.overrideOffensivePokemon === 'target' ? defender.boosts[attackStat] : attacker.boosts[attackStat];
			let defBoosts = defender.boosts[defenseStat];

			const ignoreNegativeOffensive = !!move.ignoreNegativeOffensive;
			const ignorePositiveDefensive = !!move.ignorePositiveDefensive;

			const ignoreOffensive = !!(move.ignoreOffensive || (ignoreNegativeOffensive && atkBoosts < 0));
			const ignoreDefensive = !!(move.ignoreDefensive || (ignorePositiveDefensive && defBoosts > 0));

			if (ignoreOffensive) {
				this.battle.debug('Negating (sp)atk boost/penalty.');
				atkBoosts = 0;
			}
			if (ignoreDefensive) {
				this.battle.debug('Negating (sp)def boost/penalty.');
				defBoosts = 0;
			}

			if (move.overrideOffensivePokemon === 'target') {
				attack = defender.calculateStat(attackStat, atkBoosts);
			} else {
				attack = attacker.calculateStat(attackStat, atkBoosts);
			}

			defense = defender.calculateStat(defenseStat, defBoosts);

			// Apply Stat Modifiers
			attack = this.battle.runEvent('Modify' + statTable[attackStat], attacker, defender, move, attack);
			defense = this.battle.runEvent('Modify' + statTable[defenseStat], defender, attacker, move, defense);

			// int(int(int(2 * L / 5 + 2) * A * P / D) / 50);
			let baseDamage = Math.floor(Math.floor(Math.floor(2 * level / 5 + 2) * basePower * attack / defense) / 50) + 2;

			// multi-target modifier (doubles only)
			if (move.spreadHit) {
				const spreadModifier = move.spreadModifier || 0.75;
				this.battle.debug('Spread modifier: ' + spreadModifier);
				baseDamage = this.battle.modify(baseDamage, spreadModifier);
			}
			// weather modifier (TODO: relocate here)

			// STAB
			if (move.forceSTAB || type !== '???' && pokemon.hasType(type)) {
				// The "???" type never gets STAB
				// Not even if you Roost in Gen 4 and somehow manage to use
				// Struggle in the same turn.
				// (On second thought, it might be easier to get a Missingno.)
				baseDamage = this.battle.modify(baseDamage, move.stab || 1.5);
			}
			// types
			let typeMod = target.runEffectiveness(move);
			typeMod = this.battle.clampIntRange(typeMod, -6, 6);
			target.getMoveHitData(move).typeMod = typeMod;
			if (typeMod > 0) {
				if (!suppressMessages) this.battle.add('-supereffective', target);

				for (let i = 0; i < typeMod; i++) {
					baseDamage *= 2;
				}
			}
			if (typeMod < 0) {
				if (!suppressMessages) this.battle.add('-resisted', target);

				for (let i = 0; i > typeMod; i--) {
					baseDamage = Math.floor(baseDamage / 2);
				}
			}

			if (basePower && !Math.floor(baseDamage)) {
				return 1;
			}

			// Final modifier. Modifiers that modify damage after min damage check, such as Life Orb.
			baseDamage = this.battle.runEvent('ModifyDamage', pokemon, target, move, baseDamage);

			return Math.floor(baseDamage);
		},
		tryMoveHit(target, pokemon, move) {
			if (Array.isArray(target)) target = target[0];
			this.battle.setActiveMove(move, pokemon, target);

			let hitResult = this.battle.singleEvent('PrepareHit', move, {}, target, pokemon, move);
			if (!hitResult) {
				if (hitResult === false) {
					this.battle.add('-fail', pokemon);
					this.battle.attrLastMove('[still]');
				}
				return false;
			}
			this.battle.runEvent('PrepareHit', pokemon, target, move);

			if (!this.battle.singleEvent('Try', move, null, pokemon, target, move)) {
				return false;
			}

			if (move.target === 'all' || move.target === 'foeSide' || move.target === 'allySide' || move.target === 'allyTeam') {
				if (move.target === 'all') {
					hitResult = this.battle.runEvent('TryHitField', target, pokemon, move);
				} else {
					hitResult = this.battle.runEvent('TryHitSide', target, pokemon, move);
				}
				if (!hitResult) {
					if (hitResult === false) {
						this.battle.add('-fail', pokemon);
						this.battle.attrLastMove('[still]');
					}
					return false;
				}
				return this.moveHit(target, pokemon, move);
			}

			hitResult = this.battle.runEvent('Invulnerability', target, pokemon, move);
			if (!hitResult) {
				if (hitResult !== null) {
					if (!move.spreadHit) this.battle.attrLastMove('[miss]');
					this.battle.add('-miss', pokemon, target);
				}
				return false;
			}

			if (move.ignoreImmunity === undefined) {
				move.ignoreImmunity = (move.category === 'Status');
			}

			if ((!move.ignoreImmunity || (move.ignoreImmunity !== true && !move.ignoreImmunity[move.type])) && !target.runImmunity(move.type, true)) {
				return false;
			}

			hitResult = this.battle.runEvent('TryHit', target, pokemon, move);
			if (!hitResult) {
				if (hitResult === false) {
					this.battle.add('-fail', pokemon);
					this.battle.attrLastMove('[still]');
				} else if (hitResult === this.battle.NOT_FAIL) {
					return hitResult;
				}
				return false;
			}

			if (move.flags['powder'] && target !== pokemon && !this.dex.getImmunity('powder', target)) {
				this.battle.debug('natural powder immunity');
				this.battle.add('-immune', target);
				return false;
			}

			if (move.breaksProtect) {
				let broke = false;
				for (const effectid of ['banefulbunker', 'kingsshield', 'protect', 'spikyshield']) {
					if (target.removeVolatile(effectid)) broke = true;
				}
				if (this.battle.gen >= 6 || target.side !== pokemon.side) {
					for (const effectid of ['craftyshield', 'matblock', 'quickguard', 'wideguard']) {
						if (target.side.removeSideCondition(effectid)) broke = true;
					}
				}
				if (broke) {
					if (move.id === 'feint') {
						this.battle.add('-activate', target, 'move: Feint');
					} else {
						this.battle.add('-activate', target, 'move: ' + move.name, '[broken]');
					}
					delete target.volatiles['stall'];
				}
			}

			move.totalDamage = 0;
			let damage: number | false | undefined = 0;
			pokemon.lastDamage = 0;
			if (move.multihit) {
				let hits = move.multihit;
				if (Array.isArray(hits)) {
					hits = 3;
				}
				hits = Math.floor(hits);
				let nullDamage = true;
				let moveDamage: number | false | undefined;
				// There is no need to recursively check the ´sleepUsable´ flag as Sleep Talk can only be used while asleep.
				const isSleepUsable = move.sleepUsable || this.dex.moves.get(move.sourceEffect).sleepUsable;
				let i;
				for (i = 0; i < hits && target.hp && pokemon.hp; i++) {
					if (pokemon.status === 'slp' && !isSleepUsable) break;
					move.hit = i + 1;

					moveDamage = this.moveHit(target, pokemon, move);
					if (moveDamage === false) break;
					if (nullDamage && (moveDamage || moveDamage === 0 || moveDamage === undefined)) nullDamage = false;
					// Damage from each hit is individually counted for the
					// purposes of Counter, Metal Burst, and Mirror Coat.
					damage = (moveDamage || 0);
					// Total damage dealt is accumulated for the purposes of recoil (Parental Bond).
					move.totalDamage += damage;
					this.battle.eachEvent('Update');
				}
				if (i === 0) return false;
				if (nullDamage) damage = false;
				this.battle.add('-hitcount', target, i);
			} else {
				damage = this.moveHit(target, pokemon, move);
				move.totalDamage = damage;
			}

			if (move.recoil && move.totalDamage) {
				this.battle.damage(this.calcRecoilDamage(move.totalDamage, move), pokemon, pokemon, 'recoil');
			}

			if (move.struggleRecoil) {
				this.battle.directDamage(this.battle.clampIntRange(Math.round(pokemon.maxhp / 4), 1), pokemon, pokemon, {id: 'strugglerecoil'} as Condition);
			}

			if (target && pokemon !== target) target.gotAttacked(move, damage, pokemon);

			if (!damage && damage !== 0) return damage;

			this.battle.eachEvent('Update');

			if (target && !move.negateSecondary && !(move.hasSheerForce && pokemon.hasAbility('sheerforce'))) {
				this.battle.singleEvent('AfterMoveSecondary', move, null, target, pokemon, move);
				this.battle.runEvent('AfterMoveSecondary', target, pokemon, move);
			}

			return damage;
		},
		moveHit(target, pokemon, moveOrMoveName, moveData, isSecondary, isSelf) {
			let damage: number | false | undefined;
			const move = this.dex.getActiveMove(moveOrMoveName);

			if (!moveData) moveData = move;
			if (!moveData.flags) moveData.flags = {};
			let hitResult: boolean | number | null = true;

			if (move.target === 'all' && !isSelf) {
				hitResult = this.battle.singleEvent('TryHitField', moveData, {}, target, pokemon, move);
			} else if ((move.target === 'foeSide' || move.target === 'allySide') && !isSelf) {
				hitResult = this.battle.singleEvent('TryHitSide', moveData, {}, target, pokemon, move);
			} else if (target) {
				hitResult = this.battle.singleEvent('TryHit', moveData, {}, target, pokemon, move);
			}
			if (!hitResult) {
				if (hitResult === false) {
					this.battle.add('-fail', pokemon);
					this.battle.attrLastMove('[still]');
				}
				return false;
			}
			if (target && !isSecondary && !isSelf) {
				if (move.target !== 'all' && move.target !== 'allySide' && move.target !== 'foeSide') {
					hitResult = this.battle.runEvent('TryPrimaryHit', target, pokemon, moveData);
					if (hitResult === 0) {
						// special Substitute flag
						hitResult = true;
						target = null;
					}
				}
			}
			if (target && isSecondary && !moveData.self) {
				hitResult = true;
			}
			if (!hitResult) {
				return false;
			}

			if (target) {
				let didSomething: number | boolean | null | undefined = undefined;

				const curDamage = this.getDamage(pokemon, target, moveData);

				if (curDamage === false || curDamage === null) {
					if (curDamage === false && !isSecondary && !isSelf) {
						this.battle.add('-fail', pokemon);
						this.battle.attrLastMove('[still]');
					}
					this.battle.debug('damage calculation interrupted');
					return false;
				}
				if (move.selfdestruct === 'ifHit') {
					this.battle.faint(pokemon, pokemon, move);
				}
				damage = curDamage;
				if ((damage || damage === 0) && !target.fainted) {
					damage = this.battle.damage(damage, target, pokemon, move);
					if (!(damage || damage === 0)) {
						this.battle.debug('damage interrupted');
						return false;
					}
					didSomething = true;
				}

				if (moveData.boosts && !target.fainted) {
					hitResult = this.battle.boost(moveData.boosts, target, pokemon, move);
					didSomething = didSomething || hitResult;
				}
				if (moveData.heal && !target.fainted) {
					const d = this.battle.heal(Math.round(target.maxhp * moveData.heal[0] / moveData.heal[1]), target, pokemon, move);
					if (!d && d !== 0) {
						this.battle.add('-fail', pokemon);
						this.battle.attrLastMove('[still]');
						this.battle.debug('heal interrupted');
						return false;
					}
					didSomething = true;
				}
				if (moveData.status) {
					hitResult = target.trySetStatus(moveData.status, pokemon, moveData.ability ? moveData.ability : move);
					if (!hitResult && move.status) return false;
					didSomething = didSomething || hitResult;
				}
				if (moveData.forceStatus) {
					hitResult = target.setStatus(moveData.forceStatus, pokemon, move);
					didSomething = didSomething || hitResult;
				}
				if (moveData.volatileStatus) {
					hitResult = target.addVolatile(moveData.volatileStatus, pokemon, move);
					didSomething = didSomething || hitResult;
				}
				if (moveData.sideCondition) {
					hitResult = target.side.addSideCondition(moveData.sideCondition, pokemon, move);
					didSomething = didSomething || hitResult;
				}
				if (moveData.slotCondition) {
					hitResult = target.side.addSlotCondition(target, moveData.slotCondition, pokemon, move);
					didSomething = didSomething || hitResult;
				}
				if (moveData.weather) {
					hitResult = this.battle.field.setWeather(moveData.weather, pokemon, move);
					didSomething = didSomething || hitResult;
				}
				if (moveData.terrain) {
					hitResult = this.battle.field.setTerrain(moveData.terrain, pokemon, move);
					didSomething = didSomething || hitResult;
				}
				if (moveData.pseudoWeather) {
					hitResult = this.battle.field.addPseudoWeather(moveData.pseudoWeather, pokemon, move);
					didSomething = didSomething || hitResult;
				}
				if (moveData.forceSwitch) {
					hitResult = !!this.battle.canSwitch(target.side);
					didSomething = didSomething || hitResult;
				}
				if (moveData.selfSwitch) {
					// If the move is Parting Shot and it fails to change the target's stats in gen 7, didSomething will be null instead of undefined.
					// Leaving didSomething as null will cause this function to return before setting the switch flag, preventing the switch.
					if (this.battle.canSwitch(pokemon.side) && (didSomething !== null || this.battle.gen < 7)) {
						didSomething = true;
					} else {
						didSomething = didSomething || false;
					}
				}
				// Hit events
				//   These are like the TryHit events, except we don't need a FieldHit event.
				//   Scroll up for the TryHit event documentation, and just ignore the "Try" part. ;)
				if (move.target === 'all' && !isSelf) {
					if (moveData.onHitField) {
						hitResult = this.battle.singleEvent('HitField', moveData, {}, target, pokemon, move);
						didSomething = didSomething || hitResult;
					}
				} else if ((move.target === 'foeSide' || move.target === 'allySide') && !isSelf) {
					if (moveData.onHitSide) {
						hitResult = this.battle.singleEvent('HitSide', moveData, {}, target.side, pokemon, move);
						didSomething = didSomething || hitResult;
					}
				} else {
					if (moveData.onHit) {
						hitResult = this.battle.singleEvent('Hit', moveData, {}, target, pokemon, move);
						didSomething = didSomething || hitResult;
					}
					if (!isSelf && !isSecondary) {
						this.battle.runEvent('Hit', target, pokemon, move);
					}
					if (moveData.onAfterHit) {
						hitResult = this.battle.singleEvent('AfterHit', moveData, {}, target, pokemon, move);
						didSomething = didSomething || hitResult;
					}
				}

				// Move didn't fail because it didn't try to do anything
				if (didSomething === undefined) didSomething = true;

				if (!didSomething && !moveData.self && !moveData.selfdestruct) {
					if (!isSelf && !isSecondary) {
						if (didSomething === false) {
							this.battle.add('-fail', pokemon);
							this.battle.attrLastMove('[still]');
						}
					}
					this.battle.debug('move failed because it did nothing');
					return false;
				}
			}
			if (moveData.self && !move.selfDropped) {
				if (!isSecondary && moveData.self.boosts) {
					// This is done solely to mimic in-game RNG behaviour. All self drops have a 100% chance of happening but still grab a random number.
					this.battle.random(100);
					if (!move.multihit) move.selfDropped = true;
				}
				this.moveHit(pokemon, pokemon, move, moveData.self, isSecondary, true);
			}
			if (moveData.secondaries && this.battle.runEvent('TrySecondaryHit', target, pokemon, moveData)) {
				const messages: [number, string, Pokemon | null, boolean, string, BoostID?, number?][] = [];
				// We gather the effects to apply them.
				for (const secondary of moveData.secondaries) {
					let buffDebuff = 'none';
					let accuracy = moveData.accuracy;
					if (accuracy === true) {
						accuracy = 100;
					}
					const points = Math.floor(secondary.chance! * accuracy / 100);
					let boosts: SparseBoostsTable | undefined;
					let status: string | undefined;
					let volatileStatus: string | undefined;
					let secTarget: null | Pokemon = null;
					let isSecSelf = false;
					if (secondary.self) {
						boosts = secondary.self.boosts!;
						/// status = secondary.self.status;
						volatileStatus = secondary.self.volatileStatus;
						secTarget = pokemon;
						isSecSelf = true;
					} else if (target) {
						boosts = secondary.boosts!;
						status = secondary.status;
						volatileStatus = secondary.volatileStatus;
						secTarget = target;
					}

					// If boosts, go through all of them.
					if (boosts) {
						let b: BoostID;
						for (b in boosts) {
							buffDebuff = (boosts[b]! > 0) ? b : 'minus' + b;
							messages.push([points, buffDebuff, secTarget, isSecSelf, 'boosts', b, boosts[b]]);
						}
					} else if (status) {
						messages.push([points, status, secTarget, isSecSelf, 'status']);
					} else if (volatileStatus) {
						messages.push([points, volatileStatus, secTarget, isSecSelf, 'volatileStatus']);
					}
				}
				// After having gathered the effects, add points and trigger them.
				for (const [pointsBuff, buffing, secTarget, /** isSecSelf*/, actualWhat, boost, boostBy] of messages) {
					if (!!buffing && !!pointsBuff && !!secTarget) {
						if (!secTarget.side.points) secTarget.side.points = {};
						if (!secTarget.side.points[buffing] && secTarget.side.points[buffing] !== 0) secTarget.side.points[buffing] = 50;
						if (!secTarget.fainted && secTarget.hp > 0) {
							if (actualWhat !== 'status' || !secTarget.status) {
								secTarget.side.points[buffing] += pointsBuff;
								this.battle.add('-message', secTarget.side.name + ' acquired ' + pointsBuff + ' points in ' + pnames[buffing] + ' [Total: ' + secTarget.side.points[buffing] + ']!');
							}
							if (secTarget.side.points[buffing] >= 100 && secTarget.hp > 0) {
								secTarget.side.points[buffing] -= 100;
								this.battle.add('-message', 'A secondary effect on ' + pnames[buffing] + ' triggered! [-100 points]');
								// Actually trigger here the secondaries to avoid recursion.
								if (actualWhat === 'boosts') {
									const boosting: SparseBoostsTable = {};
									boosting[boost!] = boostBy;
									this.battle.boost(boosting, secTarget, pokemon, move);
								}
								if (actualWhat === 'status') {
									if (!secTarget.status) {
										secTarget.trySetStatus(buffing, pokemon, move);
									}
									secTarget.removeVolatile(move.id);
								}
								if (actualWhat === 'volatileStatus') {
									secTarget.addVolatile(buffing, pokemon, move);
								}
							}
						}
					}
				}
			}
			if (target && target.hp > 0 && pokemon.hp > 0 && moveData.forceSwitch && this.battle.canSwitch(target.side)) {
				hitResult = this.battle.runEvent('DragOut', target, pokemon, move);
				if (hitResult) {
					target.forceSwitchFlag = true;
				} else if (hitResult === false && move.category === 'Status') {
					this.battle.add('-fail', pokemon);
					this.battle.attrLastMove('[still]');
					return false;
				}
			}
			if (move.selfSwitch && pokemon.hp) {
				pokemon.switchFlag = move.id;
			}
			return damage;
		},
	},
	comparePriority(a, b) {
		a.priority = a.priority || 0;
		a.subOrder = a.subOrder || 0;
		a.speed = a.speed || 0;
		b.priority = b.priority || 0;
		b.subOrder = b.subOrder || 0;
		b.speed = b.speed || 0;
		if ((typeof a.order === 'number' || typeof b.order === 'number') && a.order !== b.order) {
			if (typeof a.order !== 'number') {
				return -1;
			}
			if (typeof b.order !== 'number') {
				return 1;
			}
			if (b.order - a.order) {
				return -(b.order - a.order);
			}
		}
		if (b.priority - a.priority) {
			return b.priority - a.priority;
		}
		if (b.speed - a.speed) {
			return b.speed - a.speed;
		}
		if (b.subOrder - a.subOrder) {
			return -(b.subOrder - a.subOrder);
		}
		const a_hp = a.pokemon ? a.pokemon.hp : 0;
		const b_hp = b.pokemon ? b.pokemon.hp : 0;
		if (b_hp - a_hp) {
			return b_hp - a_hp;
		}
		if (b.speed - a.speed) {
			return b.speed - a.speed;
		}
		const a_weight = a.pokemon ? a.pokemon.weight : 0;
		const b_weight = b.pokemon ? b.pokemon.weight : 0;
		if (b_weight - a_weight) {
			return -(b_weight - a_weight);
		}
		const a_height = a.pokemon ? a.pokemon.height : 0;
		const b_height = b.pokemon ? b.pokemon.height : 0;
		if (b_height - a_height) {
			return -(b_height - a_height);
		}
		let a_totalSpeed = 0;
		if (a.side) {
			for (const pokemon of a.side.pokemon) {
				a_totalSpeed += pokemon.speed;
			}
		}
		let b_totalSpeed = 0;
		if (b.side) {
			for (const pokemon of b.side.pokemon) {
				b_totalSpeed += pokemon.speed;
			}
		}
		if (b_totalSpeed - a_totalSpeed) {
			return b_totalSpeed - a_totalSpeed;
		}
		return Math.random() - 0.5;
	},
};
