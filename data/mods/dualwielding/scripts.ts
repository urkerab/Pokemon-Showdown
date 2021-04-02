export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen7',
	actions: {
		getZMove(move, pokemon, skipChecks) {
			const item = pokemon.getItem();
			const dual = pokemon.getAbility() as any as Item;
			if (pokemon.side.zMoveUsed) return;
			if (!item.zMove && !dual.zMove) return;
			if (item.itemUser && !item.itemUser.includes(pokemon.species.name)) return;
			const moveData = pokemon.getMoveData(move);
			if (!moveData || !moveData.pp) return; // Draining the PP of the base move prevents the corresponding Z-move from being used.

			if (move.name === item.zMoveFrom) {
				if (item.itemUser && !item.itemUser.includes(pokemon.species.name)) return;
				return item.zMove as string;
			}
			if (move.name === dual.zMoveFrom) {
				if (dual.itemUser && !dual.itemUser.includes(pokemon.species.name)) return;
				return dual.zMove as string;
			}
			if (move.type === item.zMoveType || move.type === dual.zMoveType) {
				if (move.category === "Status") {
					return move.name;
				} else if (move.zMove?.basePower) {
					return this.Z_MOVES[move.type];
				}
			}
		},
		getActiveZMove(move, pokemon) {
			move = this.dex.moves.get(move);
			if (pokemon) {
				const item = pokemon.getItem();
				if (move.name === item.zMoveFrom) {
					return this.dex.getActiveMove(item.zMove as string);
				}
				const dual = pokemon.getAbility() as any as Item;
				if (move.name === dual.zMoveFrom) {
					return this.dex.getActiveMove(dual.zMove as string);
				}
			}

			if (move.category === 'Status') {
				const zMove = this.dex.getActiveMove(move);
				if (!zMove.isZ) (zMove as any).name = 'Z-' + zMove.name;
				zMove.isZ = true;
				return zMove;
			}
			const zMove = this.dex.getActiveMove(this.Z_MOVES[move.type]);
			zMove.basePower = move.zMove!.basePower!;
			zMove.category = move.category;
			// copy the priority for Quick Guard
			zMove.priority = move.priority;
			return zMove;
		},
		canZMove(pokemon) {
			if (pokemon.side.zMoveUsed) return;
			let atLeastOne = false;
			const zMoves = [];
			for (const moveSlot of pokemon.moveSlots) {
				if (moveSlot.pp <= 0) {
					zMoves.push(null);
					continue;
				}
				const move = this.dex.moves.get(moveSlot.id);
				if (this.getZMove(move, pokemon)) {
					const zMove = this.getActiveZMove(move, pokemon);
					zMoves.push({move: zMove.name, target: zMove.target, basePower: zMove.basePower, category: zMove.category});
					atLeastOne = true;
				} else {
					zMoves.push(null);
				}
			}
			if (atLeastOne) return zMoves;
		},
		/*
		canMegaEvo(pokemon) { Doesn't validate anyway
			// Not checking for Mega Rayquaza
			let item = pokemon.getItem();
			if (item.megaEvolves === pokemon.species) return item.megaStone;
			let dual = pokemon.getAbility();
			if (dual.megaEvolves === pokemon.species) return dual.megaStone;
		},*/
	},
	pokemon: {
		getAbility() {
			const item = this.battle.dex.items.get(this.ability);
			return item.exists ? item as Effect as Ability : this.battle.dex.abilities.get(this.ability);
		},
		hasItem(item) {
			if (this.ignoringItem()) return false;
			if (!Array.isArray(item)) {
				item = this.battle.toID(item);
				return item === this.item || item === this.ability;
			}
			item = item.map(this.battle.toID);
			return item.includes(this.item) || item.includes(this.ability);
		},
		eatItem() {
			if (!this.hp || !this.isActive) return false;
			const source = this.battle.event.target;
			const item = this.battle.effect;
			if (this.battle.runEvent('UseItem', this, null, null, item) && this.battle.runEvent('TryEatItem', this, null, null, item)) {
				this.battle.add('-enditem', this, item, '[eat]');

				this.battle.singleEvent('Eat', item, this.itemState, this, source, item);
				this.battle.runEvent('EatItem', this, null, null, item);

				if (this.item === item.id) {
					this.lastItem = this.item;
					this.item = '';
					this.itemState = {id: '', target: this};
				}
				if (this.ability === item.id) {
					this.lastItem = this.ability;
					this.baseAbility = this.ability = '';
					this.abilityState = {id: '', target: this};
				}
				this.usedItemThisTurn = true;
				this.ateBerry = true;
				this.battle.runEvent('AfterUseItem', this, null, null, item);
				return true;
			}
			return false;
		},
		useItem(unused, source) {
			const item = this.battle.effect as Item;
			if ((!this.hp && !item.isGem) || !this.isActive) return false;
			if (!source && this.battle.event && this.battle.event.target) source = this.battle.event.target;
			if (this.battle.runEvent('UseItem', this, null, null, item)) {
				switch (item.id) {
				case 'redcard':
					this.battle.add('-enditem', this, item, '[of] ' + source);
					break;
				default:
					if (!item.isGem) {
						this.battle.add('-enditem', this, item);
					}
					break;
				}

				this.battle.singleEvent('Use', item, this.itemState, this, source, item);

				if (this.item === item.id) {
					this.lastItem = this.item;
					this.item = '';
					this.itemState = {id: '', target: this};
				}
				if (this.ability === item.id) {
					this.lastItem = this.ability;
					this.baseAbility = this.ability = '';
					this.abilityState = {id: '', target: this};
				}
				this.usedItemThisTurn = true;
				this.battle.runEvent('AfterUseItem', this, null, null, item);
				return true;
			}
			return false;
		},
		isGrounded(negateImmunity) {
			if ('gravity' in this.battle.field.pseudoWeather) return true;
			if ('ingrain' in this.volatiles && this.battle.gen >= 4) return true;
			if ('smackdown' in this.volatiles) return true;
			const item = (this.ignoringItem() ? '' : this.item);
			const dual = (this.ignoringItem() ? '' : this.ability);
			if (item === 'ironball' || dual === 'ironball') return true;
			// If a Fire/Flying type uses Burn Up and Roost, it becomes ???/Flying-type, but it's still grounded.
			if (!negateImmunity && this.hasType('Flying') && !('roost' in this.volatiles)) return false;
			if (this.hasAbility('levitate') && !this.battle.suppressingAbility(this)) return null;
			if ('magnetrise' in this.volatiles) return false;
			if ('telekinesis' in this.volatiles) return false;
			return item !== 'airballoon' && dual !== 'airballoon';
		},
		setAbility(ability, source, isFromFormeChange) {
			if (this.battle.dex.items.get(this.ability).exists) return false;
			return Object.getPrototypeOf(this).setAbility.call(this, ability, source, isFromFormeChange);
		},
		takeDual(source) {
			if (!this.isActive) return false;
			if (!this.ability) return false;
			if (!source) source = this;
			const dual = this.getAbility() as any as Item;
			if (dual.effectType !== 'Item') return false;
			if (this.battle.runEvent('TakeItem', this, source, null, dual)) {
				this.baseAbility = this.ability = '';
				this.abilityState = {id: '', target: this};
				return dual;
			}
			return false;
		},
	},
};
