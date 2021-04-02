export const Scripts: ModdedBattleScriptsData = {
	runAction(action) {
		const pokemonOriginalHP = action.pokemon?.hp;
		let residualPokemon: (readonly [Pokemon, number])[] = [];
		// returns whether or not we ended in a callback
		switch (action.choice) {
		case 'start': {
			for (const side of this.sides) {
				if (side.pokemonLeft) side.pokemonLeft = side.pokemon.length;
			}

			this.add('start');

			for (const side of this.sides) {
				for (let i = 0; i < side.active.length; i++) {
					this.actions.switchIn(side.pokemon[i], i);
				}
			}
			for (const pokemon of this.getAllPokemon()) {
				this.singleEvent('Start', this.dex.conditions.getByID(pokemon.species.id), pokemon.speciesState, pokemon);
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
					const validTarget = this.validTargetLoc(action.targetLoc, action.pokemon, linkedMoves[i].target);
					const targetLoc = validTarget ? action.targetLoc : this.getRandomTarget(action.pokemon, linkedMoves[i])!.position + 1;
					const pseudoAction: MoveAction = {
						choice: 'move', priority: action.priority, speed: action.speed, pokemon: action.pokemon,
						targetLoc: targetLoc, moveid: linkedMoves[i].id, move: linkedMoves[i], mega: action.mega,
						order: action.order, fractionalPriority: action.fractionalPriority, originalTarget: action.originalTarget,
					};
					this.queue.unshift(pseudoAction);
				}
				return;
			}
			this.actions.runMove(action.move, action.pokemon, action.targetLoc, action.sourceEffect, action.zmove);
			break;
		case 'megaEvo':
			this.actions.runMegaEvo(action.pokemon);
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
			this.runEvent(action.event!, action.pokemon);
			break;
		case 'team':
			if (action.index === 0) {
				action.pokemon.side.pokemon = [];
			}
			action.pokemon.side.pokemon.push(action.pokemon);
			action.pokemon.position = action.index;
			// we return here because the update event would crash since there are no active pokemon yet
			return;

		case 'pass':
			return;
		case 'instaswitch':
		case 'switch':
			if (action.choice === 'switch' && action.pokemon.status) {
				this.singleEvent('CheckShow', this.dex.abilities.getByID('naturalcure' as ID), null, action.pokemon);
			}
			if (this.actions.switchIn(action.target, action.pokemon.position, action.sourceEffect) === 'pursuitfaint') {
				// a pokemon fainted from Pursuit before it could switch
				if (this.gen <= 4) {
					// in gen 2-4, the switch still happens
					this.hint("Previously chosen switches continue in Gen 2-4 after a Pursuit target faints.");
					action.priority = -101;
					this.queue.unshift(action);
					break;
				} else {
					// in gen 5+, the switch is cancelled
					this.hint("A Pokemon can't switch between when it runs out of HP and when it faints");
					break;
				}
			}
			break;
		case 'runUnnerve':
			this.singleEvent('PreStart', action.pokemon.getAbility(), action.pokemon.abilityState, action.pokemon);
			break;
		case 'runSwitch':
			this.actions.runSwitch(action.pokemon);
			break;
		case 'runPrimal':
			if (!action.pokemon.transformed) {
				this.singleEvent('Primal', action.pokemon.getItem(), action.pokemon.itemState, action.pokemon);
			}
			break;
		case 'shift':
			if (!action.pokemon.isActive) return false;
			if (action.pokemon.fainted) return false;
			this.swapPosition(action.pokemon, 1);
			break;

		case 'beforeTurn':
			this.eachEvent('BeforeTurn');
			break;
		case 'residual':
			this.add('');
			this.clearActiveMove(true);
			this.updateSpeed();
			residualPokemon = this.getAllActive().map(pokemon => [pokemon, pokemon.getUndynamaxedHP()] as const);
			this.residualEvent('Residual');
			this.add('upkeep');
			break;
		}

		// phazing (Roar, etc)
		for (const side of this.sides) {
			for (const pokemon of side.active) {
				if (pokemon.forceSwitchFlag) {
					if (pokemon.hp) this.actions.dragIn(pokemon.side, pokemon.position);
					pokemon.forceSwitchFlag = false;
				}
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

		this.eachEvent('Update');
		for (const [pokemon, originalHP] of residualPokemon) {
			const maxhp = pokemon.getUndynamaxedHP(pokemon.maxhp);
			if (pokemon.hp && pokemon.getUndynamaxedHP() <= maxhp / 2 && originalHP > maxhp / 2) {
				this.runEvent('EmergencyExit', pokemon);
			}
		}

		if (action.choice === 'runSwitch') {
			const pokemon = action.pokemon;
			if (pokemon.hp && pokemon.hp <= pokemon.maxhp / 2 && pokemonOriginalHP! > pokemon.maxhp / 2) {
				this.runEvent('EmergencyExit', pokemon);
			}
		}

		const switches = this.sides.map(
			side => side.active.some(pokemon => pokemon && !!pokemon.switchFlag)
		);

		for (let i = 0; i < this.sides.length; i++) {
			if (switches[i] && !this.canSwitch(this.sides[i])) {
				for (const pokemon of this.sides[i].active) {
					pokemon.switchFlag = false;
				}
				switches[i] = false;
			} else if (switches[i]) {
				for (const pokemon of this.sides[i].active) {
					if (pokemon.switchFlag && !pokemon.skipBeforeSwitchOutEventFlag) {
						this.runEvent('BeforeSwitchOut', pokemon);
						pokemon.skipBeforeSwitchOutEventFlag = true;
						this.faintMessages(); // Pokemon may have fainted in BeforeSwitchOut
						if (this.ended) return true;
						if (pokemon.fainted) {
							switches[i] = this.sides[i].active.some(sidePokemon => sidePokemon && !!sidePokemon.switchFlag);
						}
					}
				}
			}
		}

		for (const playerSwitch of switches) {
			if (playerSwitch) {
				this.makeRequest('switch');
				return true;
			}
		}

		return false;
	},
	actions: {
		runMove(moveOrMoveName, pokemon, targetLoc, sourceEffect, zMove, externalMove) {
			pokemon.activeMoveActions++;
			let target = this.battle.getTarget(pokemon, zMove || moveOrMoveName, targetLoc);
			let baseMove = this.dex.getActiveMove(moveOrMoveName);
			const pranksterBoosted = baseMove.pranksterBoosted;
			if (baseMove.id !== 'struggle' && !zMove && !externalMove) {
				const changedMove = this.battle.runEvent('OverrideAction', pokemon, target, baseMove);
				if (changedMove && changedMove !== true) {
					baseMove = this.dex.getActiveMove(changedMove);
					if (pranksterBoosted) baseMove.pranksterBoosted = pranksterBoosted;
					target = this.battle.getRandomTarget(pokemon, baseMove);
				}
			}
			let move = zMove ? this.getActiveZMove(baseMove, pokemon) : baseMove;

			move.isExternal = externalMove;

			this.battle.setActiveMove(move, pokemon, target);

			/* if (pokemon.moveThisTurn) {
				// THIS IS PURELY A SANITY CHECK
				// DO NOT TAKE ADVANTAGE OF THIS TO PREVENT A POKEMON FROM MOVING;
				// USE this.queue.cancelMove INSTEAD
				this.debug('' + pokemon.id + ' INCONSISTENT STATE, ALREADY MOVED: ' + pokemon.moveThisTurn);
				this.clearActiveMove(true);
				return;
			} */
			const willTryMove = this.battle.runEvent('BeforeMove', pokemon, target, move);
			if (!willTryMove) {
				if (pokemon.volatiles['twoturnmove']?.move === move.id) {
					pokemon.removeVolatile('twoturnmove');
				}
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
						this.battle.add('-hint', "This is not a bug, this is really how it works on the " + gameConsole + "; try it yourself if you don't believe us.");
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
				pokemon.side.zMoveUsed = true;
			}
			const moveDidSomething = this.useMove(baseMove, pokemon, target, sourceEffect, zMove);
			this.battle.lastSuccessfulMoveThisTurn = moveDidSomething ? this.battle.activeMove && this.battle.activeMove.id : null;
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
				// Note that the speed stat used is after any volatile replacements like Speed Swap,
				// but before any multipliers like Agility or Choice Scarf
				// Ties go to whichever Pokemon has had the ability for the least amount of time
				dancers.sort(
					(a, b) => -(b.storedStats['spe'] - a.storedStats['spe']) || b.abilityOrder - a.abilityOrder
				);
				for (const dancer of dancers) {
					if (this.battle.faintMessages()) break;
					if (dancer.fainted) continue;
					this.battle.add('-activate', dancer, 'ability: Dancer');
					const dancersTarget = !target!.isAlly(dancer) && pokemon.isAlly(dancer) ? target! : pokemon;
					const dancersTargetLoc = dancer.getLocOf(dancersTarget);
					this.runMove(move.id, dancer, dancersTargetLoc, this.dex.abilities.get('dancer'), undefined, true);
				}
			}
			if (noLock && pokemon.volatiles['lockedmove']) delete pokemon.volatiles['lockedmove'];
			this.battle.faintMessages();
			this.battle.checkWin();
		},
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
					if (action.mega && !action.pokemon.isSkyDropped()) {
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

					action.fractionalPriority = this.battle.runEvent('FractionalPriority', action.pokemon, null, action.move, 0);
					const linkedMoves: ID[] = action.pokemon.getLinkedMoves();
					if (linkedMoves.length && !action.pokemon.getItem().isChoice && !action.zmove) {
						const decisionMove = this.battle.toID(action.move);
						if (linkedMoves.includes(decisionMove)) {
							// flag the move as linked here
							action.linked = linkedMoves.map(moveid => this.battle.dex.getActiveMove(moveid));
							const linkedOtherMove = action.linked[1 - linkedMoves.indexOf(decisionMove)];
							if (linkedOtherMove.beforeTurnCallback) {
								this.addChoice({
									choice: 'beforeTurnMove',
									pokemon: action.pokemon,
									move: linkedOtherMove,
									targetLoc: action.targetLoc,
								});
							}
						}
					}
				} else if (['switch', 'instaswitch'].includes(action.choice)) {
					if (typeof action.pokemon.switchFlag === 'string') {
						action.sourceEffect = this.battle.dex.moves.get(action.pokemon.switchFlag);
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
					// TODO: what actually happens here?
					if (target) action.targetLoc = action.pokemon.getLocOf(target);
				}
				action.originalTarget = action.pokemon.getAtLoc(action.targetLoc);

				if (!action.priority && !deferPriority) {
					// This updates priority, so ensure this is done first.
					if (!action.speed) this.battle.getActionSpeed(action);
					let move = action.move;
					if (action.zmove) {
						if (move.id === 'weatherball') this.battle.singleEvent('ModifyMove', move, null, action.pokemon, target, move, move);
						const zMoveName = this.battle.actions.getZMove(action.move, action.pokemon, true);
						const zMove = this.battle.dex.moves.get(zMoveName);
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
			if (this.hasItem('assaultvest') && (this.battle.dex.moves.get(ret[0]).category === 'Status' || this.battle.dex.moves.get(ret[1]).category === 'Status')) {
				return [];
			}
			return ret;
		},
		hasLinkedMove(moveid) {
			const linkedMoves = this.getLinkedMoves(true);
			return linkedMoves.includes(moveid);
		},
	},
};
