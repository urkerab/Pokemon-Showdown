export const Conditions: {[k: string]: ModdedConditionData} = {
	raindance: {
		inherit: true,
		duration: 10,
		durationCallback(source, effect) {
			if (source?.hasItem('damprock')) {
				return 13;
			}
			return 10;
		},
	},
	sunnyday: {
		inherit: true,
		duration: 10,
		durationCallback(source, effect) {
			if (source?.hasItem('heatrock')) {
				return 13;
			}
			return 10;
		},
	},
	sandstorm: {
		inherit: true,
		duration: 10,
		durationCallback(source, effect) {
			if (source?.hasItem('smoothrock')) {
				return 13;
			}
			return 10;
		},
	},
	hail: {
		inherit: true,
		duration: 10,
		durationCallback(source, effect) {
			if (source?.hasItem('icyrock')) {
				return 13;
			}
			return 10;
		},
	},
};
