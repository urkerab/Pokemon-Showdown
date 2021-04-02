export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen7',
	runMove(moveOrMoveName, pokemon, targetLoc, sourceEffect, zMove, externalMove) {
		let target = this.getTarget(pokemon, zMove || moveOrMoveName, targetLoc);
		let baseMove = this.dex.getActiveMove(moveOrMoveName);
		const pranksterBoosted = baseMove.pranksterBoosted;
		if (!sourceEffect && baseMove.id !== 'struggle' && !zMove) {
			const changedMove = this.runEvent('OverrideAction', pokemon, target, baseMove);
			if (changedMove && changedMove !== true) {
				baseMove = this.dex.getActiveMove(changedMove);
				if (pranksterBoosted) baseMove.pranksterBoosted = pranksterBoosted;
				target = this.getRandomTarget(pokemon, baseMove);
			}
		}
		let move = zMove ? this.getActiveZMove(baseMove, pokemon) : baseMove;

		move.isExternal = externalMove;

		this.setActiveMove(move, pokemon, target);

		/* if (pokemon.moveThisTurn) {
			// THIS IS PURELY A SANITY CHECK
			// DO NOT TAKE ADVANTAGE OF THIS TO PREVENT A POKEMON FROM MOVING;
			// USE this.cancelMove INSTEAD
			this.debug('' + pokemon.id + ' INCONSISTENT STATE, ALREADY MOVED: ' + pokemon.moveThisTurn);
			this.clearActiveMove(true);
			return;
		} */
		const willTryMove = this.runEvent('BeforeMove', pokemon, target, move);
		if (!willTryMove) {
			if (pokemon.volatiles['twoturnmove'] && pokemon.volatiles['twoturnmove'].move === move.id) { // Linked mod
				pokemon.removeVolatile('twoturnmove');
			}
			this.runEvent('MoveAborted', pokemon, target, move);
			this.clearActiveMove(true);
			// The event 'BeforeMove' could have returned false or null
			// false indicates that this counts as a move failing for the purpose of calculating Stomping Tantrum's base power
			// null indicates the opposite, as the Pokemon didn't have an option to choose anything
			pokemon.moveThisTurnResult = willTryMove;
			return;
		}
		if (move.beforeMoveCallback) {
			if (move.beforeMoveCallback.call(this, pokemon, target, move)) {
				this.clearActiveMove(true);
				pokemon.moveThisTurnResult = false;
				return;
			}
		}
		pokemon.lastDamage = 0;
		let lockedMove;
		if (!externalMove) {
			lockedMove = this.runEvent('LockMove', pokemon);
			if (lockedMove === true) lockedMove = false;
			if (!lockedMove) {
				if (!pokemon.deductPP(baseMove, null, target) && (move.id !== 'struggle')) {
					this.add('cant', pokemon, 'nopp', move);
					const gameConsole = [null, 'Game Boy', 'Game Boy', 'Game Boy Advance', 'DS', 'DS'][this.gen] || '3DS';
					this.add('-hint', "This is not a bug, this is really how it works on the " + gameConsole + "; try it yourself if you don't believe us.");
					this.clearActiveMove(true);
					pokemon.moveThisTurnResult = false;
					return;
				}
			} else {
				sourceEffect = this.dex.getEffect('lockedmove');
			}
			pokemon.moveUsed(move, targetLoc);
		}

		// Dancer Petal Dance hack
		// TODO: implement properly
		const noLock = externalMove && !pokemon.volatiles.lockedmove;

		if (zMove) {
			if (pokemon.illusion) {
				this.singleEvent('End', this.dex.getAbility('Illusion'), pokemon.abilityData, pokemon);
			}
			this.add('-zpower', pokemon);
			pokemon.side.zMoveUsed = true;
		}
		const moveDidSomething = this.useMove(baseMove, pokemon, target, sourceEffect, zMove);
		if (this.activeMove) move = this.activeMove;
		this.singleEvent('AfterMove', move, null, pokemon, target, move);
		this.runEvent('AfterMove', pokemon, target, move);

		// Dancer's activation order is completely different from any other event, so it's handled separately
		if (move.flags['dance'] && moveDidSomething && !move.isExternal) {
			const dancers = [];
			for (const side of this.sides) {
				for (const currentPoke of side.active) {
					if (!currentPoke || !currentPoke.hp || pokemon === currentPoke) continue;
					if (currentPoke.hasAbility('dancer') && !currentPoke.isSemiInvulnerable()) {
						dancers.push(currentPoke);
					}
				}
			}
			// Dancer activates in order of lowest speed stat to highest
			// Ties go to whichever Pokemon has had the ability for the least amount of time
			dancers.sort(function (a, b) { return -(b.storedStats['spe'] - a.storedStats['spe']) || b.abilityOrder - a.abilityOrder; });
			for (const dancer of dancers) {
				if (this.faintMessages()) break;
				this.add('-activate', dancer, 'ability: Dancer');
				this.runMove(move.id, dancer, 0, this.dex.getAbility('dancer'), undefined, true);
				// Using a Dancer move is enough to spoil Fake Out etc.
				dancer.activeTurns++;
			}
		}
		if (noLock && pokemon.volatiles.lockedmove) delete pokemon.volatiles.lockedmove;
	},
	queue: {
		resolveAction(action, midTurn = false) {
			if (!action) throw new Error(`Action not passed to resolveAction`);
			if (action.choice === 'pass') return [];
			const actions = [action];


			if (!action.side && action.pokemon) action.side = action.pokemon.side;
			if (!action.move && action.moveid) action.move = this.battle.dex.getActiveMove(action.moveid);
			if (!action.choice && action.move) action.choice = 'move';
			if (!action.order) {
				const orders: {[choice: string]: number} = {
					team: 1,
					start: 2,
					instaswitch: 3,
					beforeTurn: 4,
					beforeTurnMove: 5,

					runUnnerve: 100,
					runSwitch: 101,
					runPrimal: 102,
					switch: 103,
					megaEvo: 104,
					megaEvoDone: 105,
					runDynamax: 106,

					shift: 200,
					// default is 200 (for moves)

					residual: 300,
				};
				if (action.choice in orders) {
					action.order = orders[action.choice];
				} else {
					action.order = 200;
					if (!['move', 'event'].includes(action.choice)) {
						throw new Error(`Unexpected orderless action ${action.choice}`);
					}
				}
			}
			if (!midTurn) {
				if (action.choice === 'move') {
					if (!action.zmove && action.move.beforeTurnCallback) {
						actions.unshift(...this.resolveAction({
							choice: 'beforeTurnMove', pokemon: action.pokemon, move: action.move, targetLoc: action.targetLoc,
						}));
					}
					if (action.mega) {
						// TODO: Check that the Pokémon is not affected by Sky Drop.
						// (This is currently being done in `runMegaEvo`).
						actions.unshift(...this.resolveAction({
							choice: 'megaEvo',
							pokemon: action.pokemon,
						}));
						if (this.battle.gen === 7) {
							actions.unshift(...this.resolveAction({
								choice: 'megaEvoDone',
								pokemon: action.pokemon,
							}));
						}
					}

					const linkedMoves: ID[] = action.pokemon.getLinkedMoves();
					if (linkedMoves.length && !action.pokemon.getItem().isChoice && !action.zmove) {
						const decisionMove = this.battle.toID(action.move);
						if (linkedMoves.includes(decisionMove)) {
							// flag the move as linked here
							action.linked = linkedMoves.map(moveId => this.battle.dex.getActiveMove(moveId));
							const linkedOtherMove = action.linked[1 - linkedMoves.indexOf(decisionMove)];
							if (linkedOtherMove.beforeTurnCallback) {
								actions.unshift(...this.resolveAction({
									choice: 'beforeTurnMove', pokemon: action.pokemon, move: linkedOtherMove, targetLoc: action.targetLoc,
								}));
							}
						}
					}
					action.fractionalPriority = this.battle.runEvent('FractionalPriority', action.pokemon, null, action.move, 0);
				} else if (action.choice === 'switch' || action.choice === 'instaswitch') {
					if (typeof action.pokemon.switchFlag === 'string') {
						action.sourceEffect = this.battle.dex.getMove(action.pokemon.switchFlag);
					}
					action.pokemon.switchFlag = false;
				}
			}

			const deferPriority = this.battle.gen === 7 && action.mega && action.mega !== 'done';
			if (action.move) {
				let target = null;
				action.move = this.battle.dex.getActiveMove(action.move);

				if (!action.targetLoc) {
					target = this.battle.getRandomTarget(action.pokemon, action.move);
					if (target) action.targetLoc = this.battle.getTargetLoc(target, action.pokemon);
				}

				if (!action.priority && !deferPriority) {
					// This updates priority, so ensure this is done first.
					if (!action.speed) this.battle.getActionSpeed(action);
					let move = action.move;
					if (action.zmove) {
						if (move.id === 'weatherball') this.battle.singleEvent('ModifyMove', move, null, action.pokemon, target, move, move);
						const zMoveName = this.battle.getZMove(action.move, action.pokemon, true);
						const zMove = this.battle.dex.getMove(zMoveName);
						if (zMove.exists) {
							move = zMove;
						}
					}

					let priority = move.priority;
					const linkedMoves: ID[] = action.pokemon.getLinkedMoves();
					let linkIndex = -1;

					if (linkedMoves.length && !move.isZ && (linkIndex = linkedMoves.indexOf(this.battle.toID(action.move))) >= 0) {
						const linkedActions = action.linked || linkedMoves.map(moveId => this.battle.dex.getActiveMove(moveId));
						const altMove = linkedActions[1 - linkIndex];
						const thisPriority = this.battle.runEvent('ModifyPriority', action.pokemon, target, linkedActions[linkIndex], priority);
						const otherPriority = this.battle.runEvent('ModifyPriority', action.pokemon, target, altMove, altMove.priority);

						priority = Math.min(thisPriority, otherPriority);
						action.priority = priority;
						if (this.battle.gen > 5) {
							// Gen 6+: Quick Guard blocks moves with artificially enhanced priority.
							// This also applies to Psychic Terrain.
							linkedActions[linkIndex].priority = priority;
							altMove.priority = priority;
						}
					} else {
						priority = this.battle.runEvent('ModifyPriority', action.pokemon, target, move, priority);
						action.priority = priority;

						if (this.battle.gen > 5) {
							// Gen 6+: Quick Guard blocks moves with artificially enhanced priority.
							// This also applies to Psychic Terrain.
							action.move.priority = priority;
						}
					}
				}
			}
			if (!action.speed) {
				if ((action.choice === 'switch' || action.choice === 'instaswitch') && action.target) {
					this.battle.getActionSpeed(action);
				} else if (!action.pokemon) {
					action.speed = 1;
				} else if (!deferPriority) {
					this.battle.getActionSpeed(action);
				}
			}
			return actions as any;
		},
	},

	runAction(action) {
		// returns whether or not we ended in a callback
		switch (action.choice) {
		case 'start': {
			// I GIVE UP, WILL WRESTLE WITH EVENT SYSTEM LATER
			const format = this.format;

			// Remove Pokémon duplicates remaining after `team` decisions.
			this.p1.pokemon = this.p1.pokemon.slice(0, this.p1.pokemonLeft);
			this.p2.pokemon = this.p2.pokemon.slice(0, this.p2.pokemonLeft);

			if (format.teamLength && format.teamLength.battle) {
				// Trim the team: not all of the Pokémon brought to Preview will battle.
				this.p1.pokemon = this.p1.pokemon.slice(0, format.teamLength.battle);
				this.p1.pokemonLeft = this.p1.pokemon.length;
				this.p2.pokemon = this.p2.pokemon.slice(0, format.teamLength.battle);
				this.p2.pokemonLeft = this.p2.pokemon.length;
			}

			this.add('start');
			for (let pos = 0; pos < this.p1.active.length; pos++) {
				this.switchIn(this.p1.pokemon[pos], pos);
			}
			for (let pos = 0; pos < this.p2.active.length; pos++) {
				this.switchIn(this.p2.pokemon[pos], pos);
			}
			for (const pokemon of this.p1.pokemon) {
				this.singleEvent('Start', this.dex.getEffect(pokemon.species), pokemon.speciesData, pokemon);
			}
			for (const pokemon of this.p2.pokemon) {
				this.singleEvent('Start', this.dex.getEffect(pokemon.species), pokemon.speciesData, pokemon);
			}
			this.midTurn = true;
			break;
		}

		case 'move':
			if (!action.pokemon.isActive) return false;
			if (action.pokemon.fainted) return false;
			// This is where moves are linked
			if (action.linked) {
				const linkedMoves = action.linked;
				for (let i = linkedMoves.length - 1; i >= 0; i--) {
					const isValidTarget = this.validTargetLoc(action.targetLoc, action.pokemon, linkedMoves[i].target);
					const targetLoc = isValidTarget ? action.targetLoc : this.getRandomTarget(action.pokemon, linkedMoves[i])!.position + 1;
					const pseudoAction: MoveAction = {choice: 'move', order: action.order, priority: action.priority, fractionalPriority: action.fractionalPriority, speed: action.speed, pokemon: action.pokemon, targetLoc: targetLoc, originalTarget: action.originalTarget, moveid: linkedMoves[i].id, move: linkedMoves[i], mega: action.mega};
					this.queue.unshift(pseudoAction);
				}
				return;
			}
			this.runMove(action.move, action.pokemon, action.targetLoc, action.sourceEffect, action.zmove);
			break;
		case 'megaEvo':
			this.runMegaEvo(action.pokemon);
			break;
		case 'megaEvoDone':
			// In Gen 7, the action order is recalculated for a Pokémon that mega evolves.
			const moveIndex = this.queue.list.findIndex(queuedAction => queuedAction.pokemon === action.pokemon && queuedAction.choice === 'move');
			if (moveIndex >= 0) {
				const moveAction = this.queue.list.splice(moveIndex, 1)[0] as MoveAction;
				moveAction.mega = 'done';
				this.queue.insertChoice(moveAction, true);
			}
			return false;
		case 'beforeTurnMove': {
			if (!action.pokemon.isActive) return false;
			if (action.pokemon.fainted) return false;
			this.debug('before turn callback: ' + action.move.id);
			const target = this.getTarget(action.pokemon, action.move, action.targetLoc);
			if (!target) return false;
			if (!action.move.beforeTurnCallback) throw new Error(`beforeTurnMove has no beforeTurnCallback`);
			action.move.beforeTurnCallback.call(this, action.pokemon, target);
			break;
		}

		case 'event':
			// @ts-ignore Easier than defining a custom event attribute tbh
			this.runEvent(action.event, action.pokemon);
			break;
		case 'team': {
			action.pokemon.side.pokemon.splice(action.index, 0, action.pokemon);
			action.pokemon.position = action.index;
			// we return here because the update event would crash since there are no active pokemon yet
			return;
		}

		case 'pass':
			return;
		case 'instaswitch':
		case 'switch':
			if (action.choice === 'switch' && action.pokemon.status && this.dex.data.Abilities.naturalcure) {
				this.singleEvent('CheckShow', this.dex.getAbility('naturalcure'), null, action.pokemon);
			}
			if (this.switchIn(action.target, action.pokemon.position, action.sourceEffect) === 'pursuitfaint') {
				// a pokemon fainted from Pursuit before it could switch
				if (this.gen <= 4) {
					// in gen 2-4, the switch still happens
					action.priority = -101;
					this.queue.unshift(action);
					this.add('-hint', 'Pursuit target fainted, switch continues in gen 2-4');
					break;
				}
				// in gen 5+, the switch is cancelled
				this.debug('A Pokemon can\'t switch between when it runs out of HP and when it faints');
				break;
			}
			if (action.target.isActive) {
				this.add('-hint', 'Switch failed; switch target is already active');
				break;
			}
			/*
			if (action.choice === 'switch' && action.pokemon.activeTurns === 1) {
				for (const foeActive of action.pokemon.side.foe.active) {
					if (foeActive.isStale >= 2) {
						action.pokemon.isStaleCon++;
						action.pokemon.isStaleSource = 'switch';
						break;
					}
				}
			}
			*/
			this.switchIn(action.target, action.pokemon.position, action.sourceEffect);
			break;
		case 'runUnnerve':
			this.singleEvent('PreStart', action.pokemon.getAbility(), action.pokemon.abilityData, action.pokemon);
			break;
		case 'runSwitch':
			this.runEvent('SwitchIn', action.pokemon);
			if (this.gen <= 2 && !action.pokemon.side.faintedThisTurn && action.pokemon.draggedIn !== this.turn) this.runEvent('AfterSwitchInSelf', action.pokemon);
			if (!action.pokemon.hp) break;
			action.pokemon.isStarted = true;
			if (!action.pokemon.fainted) {
				this.singleEvent('Start', action.pokemon.getAbility(), action.pokemon.abilityData, action.pokemon);
				action.pokemon.abilityOrder = this.abilityOrder++;
				this.singleEvent('Start', action.pokemon.getItem(), action.pokemon.itemData, action.pokemon);
			}
			action.pokemon.draggedIn = null;
			break;
		case 'runPrimal':
			if (!action.pokemon.transformed) this.singleEvent('Primal', action.pokemon.getItem(), action.pokemon.itemData, action.pokemon);
			break;
		case 'shift': {
			if (!action.pokemon.isActive) return false;
			if (action.pokemon.fainted) return false;
			action.pokemon.activeTurns--;
			this.swapPosition(action.pokemon, 1);
			/*
			for (const foeActive of action.pokemon.side.foe.active) {
				if (foeActive.isStale >= 2) {
					action.pokemon.isStaleCon++;
					action.pokemon.isStaleSource = 'switch';
					break;
				}
			}
			*/
			break;
		}

		case 'beforeTurn':
			this.eachEvent('BeforeTurn');
			break;
		case 'residual':
			this.add('');
			this.clearActiveMove(true);
			this.updateSpeed();
			this.residualEvent('Residual');
			this.add('upkeep');
			break;
		}

		// phazing (Roar, etc)
		for (const pokemon of this.p1.active) {
			if (pokemon.forceSwitchFlag) {
				if (pokemon.hp) this.dragIn(pokemon.side, pokemon.position);
				pokemon.forceSwitchFlag = false;
			}
		}
		for (const pokemon of this.p2.active) {
			if (pokemon.forceSwitchFlag) {
				if (pokemon.hp) this.dragIn(pokemon.side, pokemon.position);
				pokemon.forceSwitchFlag = false;
			}
		}

		this.clearActiveMove();

		// fainting

		this.faintMessages();
		if (this.ended) return true;

		// switching (fainted pokemon, U-turn, Baton Pass, etc)

		if (!this.queue.peek() || (this.gen <= 3 && ['move', 'residual'].includes(this.queue.peek()!.choice))) {
			// in gen 3 or earlier, switching in fainted pokemon is done after
			// every move, rather than only at the end of the turn.
			this.checkFainted();
		} else if (this.queue.peek()?.choice === 'instaswitch') {
			return false;
		}

		let p1switch = this.p1.active.some(mon => mon && !!mon.switchFlag);
		let p2switch = this.p2.active.some(mon => mon && !!mon.switchFlag);

		if (p1switch && !this.canSwitch(this.p1)) {
			for (const pokemon of this.p1.active) {
				pokemon.switchFlag = false;
			}
			p1switch = false;
		}
		if (p2switch && !this.canSwitch(this.p2)) {
			for (const pokemon of this.p2.active) {
				pokemon.switchFlag = false;
			}
			p2switch = false;
		}

		if (p1switch || p2switch) {
			if (this.gen >= 5) {
				this.eachEvent('Update');
			}
			this.makeRequest('switch');
			return true;
		}

		this.eachEvent('Update');

		return false;
	},

	pokemon: {
		moveUsed(move, targetLoc) {
			if (!this.moveThisTurn) this.m.lastMoveAbsolute = move;
			this.lastMove = move;
			this.moveThisTurn = move.id;
			this.lastMoveTargetLoc = targetLoc;
		},
		getLinkedMoves(ignoreDisabled) {
			const linkedMoves = this.moveSlots.slice(0, 2);
			if (linkedMoves.length !== 2 || linkedMoves[0].pp <= 0 || linkedMoves[1].pp <= 0) return [];
			const ret = [linkedMoves[0].id, linkedMoves[1].id];
			if (ignoreDisabled) return ret;

			// Disabling effects which won't abort execution of moves already added to battle event loop.
			if (!this.ateBerry && ret.includes('belch' as ID)) return [];
			if (this.hasItem('assaultvest') && (this.battle.dex.getMove(ret[0]).category === 'Status' || this.battle.dex.getMove(ret[1]).category === 'Status')) {
				return [];
			}
			return ret;
		},
		hasLinkedMove(move) {
			const linkedMoves = this.getLinkedMoves(true);
			if (!linkedMoves.length) return false;
			return linkedMoves[0] === move || linkedMoves[1] === move;
		},
	},
};
