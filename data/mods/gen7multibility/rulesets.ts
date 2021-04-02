export const Rulesets: {[k: string]: ModdedFormatData} = {
	"2abilityclause": {
		effectType: 'Rule',
		name: '2 Ability Clause',
		onBegin() {
			this.add('rule', '2 Ability Clause: Limit two of each ability');
		},
		onValidateTeam(team, format) {
			const abilityTable: {[k: string]: number} = {};
			for (const set of team) {
				let ability = this.dex.abilities.get(set.ability);
				if (!abilityTable[ability.id]) abilityTable[ability.id] = 0;
				if (++abilityTable[ability.id] > 2) {
					return ["You are limited to two of each ability by 2 Ability Clause.", "(You have more than two of " + ability.name + ")"];
				}
				ability = this.dex.abilities.get(set.item);
				if (!ability.exists) continue;
				if (!abilityTable[ability.id]) abilityTable[ability.id] = 0;
				if (++abilityTable[ability.id] > 2) {
					return ["You are limited to two of each ability by 2 Ability Clause.", "(You have more than two of " + ability.name + ")"];
				}
			}
		},
	},
};
