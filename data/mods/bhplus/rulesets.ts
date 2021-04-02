export const Rulesets: {[k: string]: ModdedFormatData} = {
	ateclause: {
		effectType: 'ValidatorRule',
		name: '-ate Clause',
		banlist: ['Aerilate ++ Pixilate ++ Refrigerate > 1'],
		onBegin() {
			this.add('rule', '-ate Clause: Limit one of Aerilate/Refrigerate/Pixilate');
		},
	},
};
