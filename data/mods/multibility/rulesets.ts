export const Formats: {[k: string]: ModdedFormatData} = {
	abilityclause: {
		effectType: 'Rule',
		name: 'Ability Clause',
		onBegin() {
			this.add('rule', 'Ability Clause: Limit two of each ability');
		},
		onValidateTeam(team, format) {
			const abilityTable: {[k: string]: number} = {};
			for (const set of team) {
				let ability = this.dex.getAbility(set.ability);
				if (!abilityTable[ability.id]) abilityTable[ability.id] = 0;
				if (++abilityTable[ability.id] > 2) {
					return ["You are limited to two of each ability by Ability Clause.", "(You have more than two of " + ability.name + ")"];
				}
				ability = this.dex.getAbility(set.item);
				if (!ability.exists) continue;
				if (!abilityTable[ability.id]) abilityTable[ability.id] = 0;
				if (++abilityTable[ability.id] > 2) {
					return ["You are limited to two of each ability by Ability Clause.", "(You have more than two of " + ability.name + ")"];
				}
			}
		},
	},
};
