export const Conditions: {[k: string]: ModdedConditionData} = {
	raindance: {
		inherit: true,
		onStart(battle, source, effect) {
			if (effect && effect.effectType === 'Ability') {
				this.effectData.duration = 0;
				this.add('-weather', 'RainDance', '[from] ability: ' + effect, '[of] ' + source);
			} else {
				this.add('-weather', 'RainDance');
			}
		},
	},
	sunnyday: {
		inherit: true,
		onStart(battle, source, effect) {
			if (effect && effect.effectType === 'Ability') {
				this.effectData.duration = 0;
				this.add('-weather', 'SunnyDay', '[from] ability: ' + effect, '[of] ' + source);
			} else {
				this.add('-weather', 'SunnyDay');
			}
		},
	},
	sandstorm: {
		inherit: true,
		onStart(battle, source, effect) {
			if (effect && effect.effectType === 'Ability') {
				this.effectData.duration = 0;
				this.add('-weather', 'Sandstorm', '[from] ability: ' + effect, '[of] ' + source);
			} else {
				this.add('-weather', 'Sandstorm');
			}
		},
	},
	hail: {
		inherit: true,
		onStart(battle, source, effect) {
			if (effect && effect.effectType === 'Ability') {
				this.effectData.duration = 0;
				this.add('-weather', 'Hail', '[from] ability: ' + effect, '[of] ' + source);
			} else {
				this.add('-weather', 'Hail');
			}
		},
	},

	arceus: {
		onType(types, pokemon) {
			if (pokemon.transformed || pokemon.ability !== 'multitype') return types;
			let type = pokemon.getItem().onPlate;
			if (!type) {
				type = 'Normal';
			}
			return [type];
		},
	},
};
