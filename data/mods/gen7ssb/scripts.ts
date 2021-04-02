export const Scripts: ModdedBattleScriptsData = {
	actions: {
		runMove(moveOrMoveName, pokemon, targetLoc, sourceEffect, zMove, externalMove) {
			pokemon.activeMoveActions++;
			let target = this.battle.getTarget(pokemon, zMove || moveOrMoveName, targetLoc);
			let baseMove = this.dex.getActiveMove(moveOrMoveName);
			const pranksterBoosted = baseMove.pranksterBoosted;
			if (!sourceEffect && baseMove.id !== 'struggle' && !zMove) {
				const changedMove = this.battle.runEvent('OverrideAction', pokemon, target, baseMove);
				if (changedMove && changedMove !== true) {
					baseMove = this.dex.getActiveMove(changedMove);
					if (pranksterBoosted) baseMove.pranksterBoosted = pranksterBoosted;
					target = this.battle.getRandomTarget(pokemon, baseMove);
				}
			}
			let move = zMove ? this.getActiveZMove(baseMove, pokemon) : baseMove;

			if (!target && target !== false) target = this.battle.getRandomTarget(pokemon, move);

			move.isExternal = externalMove;

			this.battle.setActiveMove(move, pokemon, target);

			/* if (pokemon.moveThisTurn) {
				// THIS IS PURELY A SANITY CHECK
				// DO NOT TAKE ADVANTAGE OF THIS TO PREVENT A POKEMON FROM MOVING;
				// USE this.cancelMove INSTEAD
				this.debug('' + pokemon.id + ' INCONSISTENT STATE, ALREADY MOVED: ' + pokemon.moveThisTurn);
				this.clearActiveMove(true);
				return;
			} */
			const willTryMove = this.battle.runEvent('BeforeMove', pokemon, target, move);
			if (!willTryMove) {
				this.battle.runEvent('MoveAborted', pokemon, target, move);
				this.battle.clearActiveMove(true);
				// The event 'BeforeMove' could have returned false or null
				// false indicates that this counts as a move failing for the purpose of calculating Stomping Tantrum's base power
				// null indicates the opposite, as the Pokemon didn't have an option to choose anything
				pokemon.moveThisTurnResult = willTryMove;
				return;
			}
			if (move.beforeMoveCallback) {
				if (move.beforeMoveCallback.call(this.battle, pokemon, target, move)) {
					this.battle.clearActiveMove(true);
					pokemon.moveThisTurnResult = false;
					return;
				}
			}
			pokemon.lastDamage = 0;
			let lockedMove;
			if (!externalMove) {
				lockedMove = this.battle.runEvent('LockMove', pokemon);
				if (lockedMove === true) lockedMove = false;
				if (!lockedMove) {
					if (!pokemon.deductPP(baseMove, null, target) && (move.id !== 'struggle')) {
						this.battle.add('cant', pokemon, 'nopp', move);
						const gameConsole = [null, 'Game Boy', 'Game Boy', 'Game Boy Advance', 'DS', 'DS'][this.battle.gen] || '3DS';
						this.battle.hint(`This is not a bug, this is really how it works on the ${gameConsole}; try it yourself if you don't believe us.`);
						this.battle.clearActiveMove(true);
						pokemon.moveThisTurnResult = false;
						return;
					}
				} else {
					sourceEffect = this.dex.conditions.get('lockedmove');
				}
				pokemon.moveUsed(move, targetLoc);
			}

			// Dancer Petal Dance hack
			// TODO: implement properly
			const noLock = externalMove && !pokemon.volatiles.lockedmove;

			if (zMove) {
				if (pokemon.illusion) {
					this.battle.singleEvent('End', this.dex.abilities.get('Illusion'), pokemon.abilityState, pokemon);
				}
				this.battle.add('-zpower', pokemon);
				pokemon.m.zMoveUsed = true;
			}
			const moveDidSomething = this.useMove(baseMove, pokemon, target, sourceEffect, zMove);
			if (this.battle.activeMove) move = this.battle.activeMove;
			this.battle.singleEvent('AfterMove', move, null, pokemon, target, move);
			this.battle.runEvent('AfterMove', pokemon, target, move);

			// Dancer's activation order is completely different from any other event, so it's handled separately
			if (move.flags['dance'] && moveDidSomething && !move.isExternal) {
				const dancers = [];
				for (const currentPoke of this.battle.getAllActive()) {
					if (pokemon === currentPoke) continue;
					if (currentPoke.hasAbility('dancer') && !currentPoke.isSemiInvulnerable()) {
						dancers.push(currentPoke);
					}
				}
				// Dancer activates in order of lowest speed stat to highest
				// Ties go to whichever Pokemon has had the ability for the least amount of time
				dancers.sort(function (a, b) { return -(b.storedStats['spe'] - a.storedStats['spe']) || b.abilityOrder - a.abilityOrder; });
				for (const dancer of dancers) {
					if (this.battle.faintMessages()) break;
					this.battle.add('-activate', dancer, 'ability: Dancer');
					this.runMove(move.id, dancer, 0, this.dex.abilities.get('dancer'), undefined, true);
				}
			}
			if (noLock && pokemon.volatiles.lockedmove) delete pokemon.volatiles.lockedmove;
			this.battle.faintMessages();
			this.battle.checkWin();
		},
		// Modded to allow unlimited mega evos
		runMegaEvo(pokemon) {
			const templateid = pokemon.canMegaEvo || pokemon.canUltraBurst;
			if (!templateid) return false;

			pokemon.formeChange(templateid, pokemon.getItem(), true);

			// Limit mega evolution to once-per-Pokemon
			pokemon.canMegaEvo = null;

			this.battle.runEvent('AfterMega', pokemon);

			// E4 flint gains fire type when mega evolving
			if (pokemon.name === 'E4 Flint' && !pokemon.illusion) this.battle.add('-start', pokemon, 'typeadd', 'Fire');

			return true;
		},
		getZMove(move, pokemon, skipChecks) {
			const item = pokemon.getItem();
			if (!skipChecks) {
				if (!item.zMove) return;
				if (item.itemUser && !item.itemUser.includes(pokemon.species.name)) return;
				const moveData = pokemon.getMoveData(move);
				if (!moveData || !moveData.pp) return; // Draining the PP of the base move prevents the corresponding Z-move from being used.
			}

			if (item.zMoveFrom) {
				if (Array.isArray(item.zMoveFrom)) {
					if (item.zMoveFrom.includes(move.name)) return item.zMove as string;
				} else {
					if (move.name === item.zMoveFrom) return item.zMove as string;
				}
			} else if (item.zMove === true) {
				if (move.type === item.zMoveType) {
					if (move.category === "Status") {
						return move.name;
					} else if (move.zMove?.basePower) {
						return this.Z_MOVES[move.type];
					}
				}
			}
		},
		getActiveZMove(move, pokemon) {
			let zMove;
			if (pokemon) {
				const item = pokemon.getItem();
				if (item.zMoveFrom && Array.isArray(item.zMoveFrom) ? item.zMoveFrom.includes(move.name) : item.zMoveFrom === move.name) {
					// @st-ignore
					zMove = this.dex.getActiveMove(item.zMove as string);
					// @st-ignore Hack for Snaquaza's Z move
					zMove.baseMove = move.id;
					zMove.isZOrMaxPowered = true;
					return zMove;
				}
			}

			if (move.category === 'Status') {
				zMove = this.dex.getActiveMove(move);
				zMove.isZ = true;
				zMove.isZOrMaxPowered = true;
				return zMove;
			}
			zMove = this.dex.getActiveMove(this.Z_MOVES[move.type]);
			// @st-ignore
			zMove.basePower = move.zMove!.basePower!;
			zMove.category = move.category;
			zMove.isZOrMaxPowered = true;
			return zMove;
		},
		// Modded to allow each Pokemon on a team to use a Z move once per battle
		canZMove(pokemon) {
			if (pokemon.m.zMoveUsed || (pokemon.transformed && (pokemon.species.isMega || pokemon.species.isPrimal || pokemon.species.forme === "Ultra"))) return;
			const item = pokemon.getItem();
			if (!item.zMove) return;
			if (item.itemUser && !item.itemUser.includes(pokemon.species.name)) return;
			let atLeastOne = false;
			const zMoves: ZMoveOptions = [];
			for (const moveSlot of pokemon.moveSlots) {
				if (moveSlot.pp <= 0) {
					zMoves.push(null);
					continue;
				}
				const move = this.dex.moves.get(moveSlot.move);
				let zMoveName = this.getZMove(move, pokemon, true) || '';
				if (zMoveName) {
					const zMove = this.dex.moves.get(zMoveName);
					if (!zMove.isZ && zMove.category === 'Status') zMoveName = "Z-" + zMoveName;
					zMoves.push({move: zMoveName, target: zMove.target, basePower: zMove.basePower, category: zMove.category});
				} else {
					zMoves.push(null);
				}
				if (zMoveName) atLeastOne = true;
			}
			if (atLeastOne) return zMoves;
		},
		runZPower(move, pokemon) {
			const zPower = this.dex.conditions.get('zpower');
			if (move.category !== 'Status') {
				this.battle.attrLastMove('[zeffect]');
			} else if (move.zMove?.boost) {
				this.battle.boost(move.zMove.boost, pokemon, pokemon, zPower);
			} else if (move.zMove?.effect) {
				switch (move.zMove.effect) {
				case 'heal':
					this.battle.heal(pokemon.maxhp, pokemon, pokemon, zPower);
					break;
				case 'healhalf':
					// For DragonWhale
					this.battle.heal(pokemon.maxhp / 2, pokemon, pokemon, zPower);
					break;
				case 'healreplacement':
					move.self = {sideCondition: 'healreplacement'};
					break;
				case 'boostreplacement':
					// For nui
					move.self = {sideCondition: 'boostreplacement'};
					break;
				case 'clearnegativeboost':
					const boosts: SparseBoostsTable = {};
					let i: BoostID;
					for (i in pokemon.boosts) {
						// @st-ignore
						if (pokemon.boosts[i] < 0) {
							boosts[i] = 0;
						}
					}
					pokemon.setBoost(boosts);
					this.battle.add('-clearnegativeboost', pokemon, '[zeffect]');
					break;
				case 'redirect':
					pokemon.addVolatile('followme', pokemon, zPower);
					break;
				case 'crit2':
					pokemon.addVolatile('focusenergy', pokemon, zPower);
					break;
				case 'curse':
					if (pokemon.hasType('Ghost')) {
						this.battle.heal(pokemon.maxhp, pokemon, pokemon, zPower);
					} else {
						this.battle.boost({atk: 1}, pokemon, pokemon, zPower);
					}
				}
			}
		},
	},
	field: {
		setTerrain(status, source = null, sourceEffect = null) {
			status = this.battle.dex.conditions.get(status);
			if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
			if (!source && this.battle.event && this.battle.event.target) source = this.battle.event.target;
			if (source === 'debug') source = this.battle.sides[0].active[0];
			if (!source) throw new Error(`setting terrain without a source`);

			if (this.terrain === status.id) return false;
			const prevTerrain = this.terrain;
			const prevTerrainState = this.terrainState;
			this.terrain = status.id;
			this.terrainState = {
				id: status.id,
				source,
				sourcePosition: source.position,
				duration: status.duration,
			};
			if (status.durationCallback) {
				this.terrainState.duration = status.durationCallback.call(this.battle, source, source, sourceEffect);
			}
			if (!this.battle.singleEvent('Start', status, this.terrainState, this, source, sourceEffect)) {
				this.terrain = prevTerrain;
				this.terrainState = prevTerrainState;
				return false;
			}
			// Always run a terrain end event to prevent a visual glitch with custom terrains
			if (prevTerrain) this.battle.singleEvent('End', this.battle.dex.conditions.get(prevTerrain), prevTerrainState, this);
			this.battle.runEvent('TerrainStart', source, source, status);
			return true;
		},
	},
	pokemon: {
		getActionSpeed() {
			let speed = this.getStat('spe', false, false);
			if (this.battle.field.getPseudoWeather('trickroom') || this.battle.field.getPseudoWeather('alienwave')) {
				speed = 0x2710 - speed;
			}
			return this.battle.trunc(speed, 13);
		},
	},
};
