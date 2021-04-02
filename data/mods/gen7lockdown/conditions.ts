export const Conditions: {[k: string]: ModdedConditionData} = {
	raindance: {
		inherit: true,
		durationCallback(source, effect) {
			if (this.turn > 2) {
				return 0;
			}
			return 5;
		},
		onStart(battle, source, effect) {
			if (this.turn > 6) return false;
			if (effect && effect.effectType === 'Ability') {
				this.add('-weather', 'RainDance', '[from] ability: ' + effect, '[of] ' + source);
			} else {
				this.add('-weather', 'RainDance');
			}
		},
	},
	sunnyday: {
		inherit: true,
		durationCallback(source, effect) {
			if (this.turn > 2) {
				return 0;
			}
			return 5;
		},
		onStart(battle, source, effect) {
			if (this.turn > 6) return false;
			if (effect && effect.effectType === 'Ability') {
				this.add('-weather', 'SunnyDay', '[from] ability: ' + effect, '[of] ' + source);
			} else {
				this.add('-weather', 'SunnyDay');
			}
		},
	},
	sandstorm: {
		inherit: true,
		durationCallback(source, effect) {
			if (this.turn > 2) {
				return 0;
			}
			return 5;
		},
		onStart(battle, source, effect) {
			if (this.turn > 6) return false;
			if (effect && effect.effectType === 'Ability') {
				this.add('-weather', 'Sandstorm', '[from] ability: ' + effect, '[of] ' + source);
			} else {
				this.add('-weather', 'Sandstorm');
			}
		},
	},
	hail: {
		inherit: true,
		durationCallback(source, effect) {
			if (this.turn > 2) {
				return 0;
			}
			return 5;
		},
		onStart(battle, source, effect) {
			if (this.turn > 6) return false;
			if (effect && effect.effectType === 'Ability') {
				this.add('-weather', 'Hail', '[from] ability: ' + effect, '[of] ' + source);
			} else {
				this.add('-weather', 'Hail');
			}
		},
	},
};
