export const Conditions: {[k: string]: ModdedConditionData} = {
	aura: {
		duration: 1,
		onBasePowerPriority: 8,
		onBasePower(basePower, user, target, move) {
			let modifier = 0x1A8E;
			this.debug('Aura Boost');
			if (user.volatiles['aurabreak']) {
				modifier = 0x099A;
				this.debug('Aura Boost reverted by Aura Break');
			}
			return this.chainModify([modifier, 0x1000]);
		},
	},
	slp: {
		effectType: 'Status',
		onStart(target) {
			this.add('-status', target, 'slp');
			// 1-3 turns
			this.effectData.startTime = this.random(2, 5);
			this.effectData.time = this.effectData.startTime;
		},
		onBeforeMovePriority: 10,
		onBeforeMove(pokemon, target, move) {
			if (pokemon.hasAbility('earlybird')) {
				pokemon.statusData.time -= 2;
			}
			pokemon.statusData.time--;
			if (pokemon.statusData.time <= 0) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'slp');
			if (move.sleepUsable) {
				return;
			}
			return false;
		},
	},
	raindance: {
		inherit: true,
		onStart(battle, source, effect) {
			if (effect && effect.effectType === 'Ability') {
				this.effectData.duration *= 2;
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
				this.effectData.duration *= 2;
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
				this.effectData.duration *= 2;
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
				this.effectData.duration *= 2;
				this.add('-weather', 'Hail', '[from] ability: ' + effect, '[of] ' + source);
			} else {
				this.add('-weather', 'Hail');
			}
		},
	},
};
