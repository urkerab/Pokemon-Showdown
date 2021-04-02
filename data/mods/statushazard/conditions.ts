export const Conditions: {[k: string]: ModdedConditionData} = {
	'statushazard': {
		onStart(side, source, sourceEffect) {
			this.effectData.hazards = [];
		},
		onSwitchInPriority: -999, // run after other SwitchIn events
		onSwitchIn(pokemon) {
			for (let i = this.effectData.hazards.length - 1; i >= 0; i--) {
				// Status hazards take effect in order from newest to oldest.
				const hazard = this.effectData.hazards[i];
				if (hazard.status && !this.dex.getImmunity(hazard.status, pokemon) && !pokemon.hasType('Steel')) {
					// Remember, we only remove hazards if the type of the target is naturally immune to a major status, Steel types excepted.
					this.add('-message', `The ${hazard.name} hazard vanished!`);
					this.add('-sideend', `hazard:${hazard.id}`, '[silent]');
					this.effectData.hazards.splice(i, 1);
				} else {
					this.add('-message', `The Pokemon was affected by the ${hazard.name} hazard!`);
					this.moveHit(pokemon, pokemon.side.foe.active[0], hazard);
				}
			}
		},
		onEnd(side) {
			this.add('-message', 'The status hazards vanished from the battlefield!');
			for (const hazard of this.effectData.hazards) {
				this.add('-sideend', side, `hazard:${hazard.id}`, '[silent]');
			}
		},
	},
};
