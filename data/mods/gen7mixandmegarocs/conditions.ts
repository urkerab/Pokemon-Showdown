export const Conditions: {[k: string]: ModdedConditionData} = {
	dusttempest: {
		name: 'Dust Temptest',
		effectType: 'Weather',
		duration: 0,
		onModifySpDPriority: 10,
		onModifySpD(spd, pokemon) {
			if (pokemon.hasType('Rock') && this.field.isWeather('dusttempest')) {
				return this.modify(spd, 1.5);
			}
		},
		onFieldStart(field, source, effect) {
			this.add('-weather', 'Dust Tempest', '[from] ability: ' + effect.name, '[of] ' + source);
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'Dust Tempest', '[upkeep]');
			if (this.field.isWeather('dusttempest')) this.eachEvent('Weather');
		},
		onWeather(target) {
			this.damage(target.baseMaxhp / 16);
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},
};
