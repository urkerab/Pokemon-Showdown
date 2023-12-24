export const Conditions: {[k: string]: ModdedConditionData} = {
	choicelock: {
		inherit: true,
		onBeforeMove(pokemon, target, move) {
			if (!(pokemon.getItem().isChoice || (pokemon.getAbility() as Effect as Item).isChoice) || !pokemon.hasMove(this.effectState.move)) {
				pokemon.removeVolatile('choicelock');
				return;
			}
			if (move.id !== this.effectState.move && move.id !== 'struggle') {
				// Fails even if the Choice item is being ignored, and no PP is lost
				this.addMove('move', pokemon, move.name);
				this.attrLastMove('[still]');
				this.add('-fail', pokemon);
				return false;
			}
		},
		onDisableMove(pokemon) {
			if (!(pokemon.getItem().isChoice || (pokemon.getAbility() as Effect as Item).isChoice) || !pokemon.hasMove(this.effectState.move)) {
				pokemon.removeVolatile('choicelock');
				return;
			}
			if (pokemon.ignoringItem()) {
				return;
			}
			for (const moveSlot of pokemon.moveSlots) {
				if (moveSlot.id !== this.effectState.move) {
					pokemon.disableMove(moveSlot.id, false, this.effectState.sourceEffect);
				}
			}
		},
	},
};
