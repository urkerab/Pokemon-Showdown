export const Moves: {[k: string]: ModdedMoveData} = {
	"incinerate": {
		inherit: true,
		onHit(pokemon, source) {
			const item = pokemon.getItem();
			if ((item.isBerry || item.isGem) && pokemon.takeItem(source)) {
				this.add('-enditem', pokemon, item.name, '[from] move: Incinerate');
			}
			const dual = pokemon.getAbility() as any as Item;
			if ((dual.isBerry || dual.isGem) && pokemon.takeDual(source)) {
				this.add('-endItem', pokemon, dual.name, '[from] move: Incinerate');
			}
		},
	},
	"knockoff": {
		inherit: true,
		onBasePower(basePower, source, target, move) {
			const item = target.getItem();
			if (item.id && this.singleEvent('TakeItem', item, target.itemData, target, source, move, item)) {
				return this.chainModify(1.5);
			}
			const dual = target.getAbility() as any as Item;
			if (dual.id && dual.effectType === 'Item' && this.singleEvent('TakeItem', dual, target.abilityData, target, source, move, dual)) {
				return this.chainModify(1.5);
			}
		},
		onAfterHit(target, source) {
			if (source.hp) {
				let item = target.takeItem();
				if (item) {
					this.add('-enditem', target, item.name, '[from] move: Knock Off', '[of] ' + source);
				}
				item = target.takeDual();
				if (item) {
					this.add('-enditem', target, item.name, '[from] move: Knock Off', '[of]' + source);
				}
			}
		},
	},
	"switcheroo": {
		inherit: true,
		onHit(target, source, move) {
			let didSomething = false;
			const yourItem = target.takeItem(source);
			const myItem = source.takeItem();
			if (target.item || source.item || (!yourItem && !myItem)) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
			} else if ((myItem && !this.singleEvent('TakeItem', myItem, source.itemData, target, source, move, myItem)) || (yourItem && !this.singleEvent('TakeItem', yourItem, target.itemData, source, target, move, yourItem))) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
			} else {
				this.add('-activate', source, 'move: Trick', '[of] ' + target);
				if (myItem) {
					target.setItem(myItem);
					this.add('-item', target, myItem, '[from] move: Switcheroo');
				} else {
					this.add('-enditem', target, yourItem, '[silent]', '[from] move: Switcheroo');
				}
				if (yourItem) {
					source.setItem(yourItem);
					this.add('-item', source, yourItem, '[from] move: Switcheroo');
				} else {
					this.add('-enditem', source, myItem, '[silent]', '[from] move: Switcheroo');
				}
				didSomething = true;
			}
			const yourDual = target.takeDual(source);
			const myDual = source.takeDual();
			if (target.ability || source.ability || (!yourItem && !myItem)) {
				if (yourDual) target.baseAbility = target.ability = yourDual.id;
				if (myDual) source.baseAbility = source.ability = myDual.id;
			} else if ((myDual && !this.singleEvent('TakeItem', myDual, source.abilityData, target, source, move, myDual)) || (yourDual && !this.singleEvent('TakeItem', yourDual, target.abilityData, source, target, move, yourDual))) {
				if (yourDual) target.baseAbility = target.ability = yourDual.id;
				if (myDual) source.baseAbility = source.ability = myDual.id;
			} else {
				this.add('-activate', source, 'move: Trick', '[of] ' + target);
				if (myDual) {
					target.setAbility(myDual.id);
					target.baseAbility = target.ability;
					this.add('-item', target, myDual, '[from] move: Switcheroo');
				} else {
					this.add('-enditem', target, yourDual, '[silent]', '[from] move: Switcheroo');
				}
				if (yourDual) {
					source.setAbility(yourDual.id);
					source.baseAbility = source.ability;
					this.add('-item', source, yourDual, '[from] move: Switcheroo');
				} else {
					this.add('-enditem', source, myDual, '[silent]', '[from] move: Switcheroo');
				}
				didSomething = true;
			}
			if (!didSomething) return false;
		},
	},
	"trick": {
		inherit: true,
		onHit(target, source, move) {
			let didSomething = false;
			const yourItem = target.takeItem(source);
			const myItem = source.takeItem();
			if (target.item || source.item || (!yourItem && !myItem)) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
			} else if ((myItem && !this.singleEvent('TakeItem', myItem, source.itemData, target, source, move, myItem)) || (yourItem && !this.singleEvent('TakeItem', yourItem, target.itemData, source, target, move, yourItem))) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
			} else {
				this.add('-activate', source, 'move: Trick', '[of] ' + target);
				if (myItem) {
					target.setItem(myItem);
					this.add('-item', target, myItem, '[from] move: Switcheroo');
				} else {
					this.add('-enditem', target, yourItem, '[silent]', '[from] move: Switcheroo');
				}
				if (yourItem) {
					source.setItem(yourItem);
					this.add('-item', source, yourItem, '[from] move: Switcheroo');
				} else {
					this.add('-enditem', source, myItem, '[silent]', '[from] move: Switcheroo');
				}
				didSomething = true;
			}
			const yourDual = target.takeDual(source);
			const myDual = source.takeDual();
			if (target.ability || source.ability || (!yourItem && !myItem)) {
				if (yourDual) target.baseAbility = target.ability = yourDual.id;
				if (myDual) source.baseAbility = source.ability = myDual.id;
			} else if ((myDual && !this.singleEvent('TakeItem', myDual, source.abilityData, target, source, move, myDual)) || (yourDual && !this.singleEvent('TakeItem', yourDual, target.abilityData, source, target, move, yourDual))) {
				if (yourDual) target.baseAbility = target.ability = yourDual.id;
				if (myDual) source.baseAbility = source.ability = myDual.id;
			} else {
				this.add('-activate', source, 'move: Trick', '[of] ' + target);
				if (myDual) {
					target.setAbility(myDual.id);
					this.add('-item', target, myDual, '[from] move: Switcheroo');
				} else {
					this.add('-enditem', target, yourDual, '[silent]', '[from] move: Switcheroo');
				}
				if (yourDual) {
					source.setAbility(yourDual.id);
					this.add('-item', source, yourDual, '[from] move: Switcheroo');
				} else {
					this.add('-enditem', source, myDual, '[silent]', '[from] move: Switcheroo');
				}
				didSomething = true;
			}
			if (!didSomething) return false;
		},
	},
};
