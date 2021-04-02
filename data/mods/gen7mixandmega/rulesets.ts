export const Formats: {[k: string]: ModdedFormatData} = {
	sametypeclause: {
		effectType: 'ValidatorRule',
		name: 'Same Type Clause',
		desc: "Forces all Pok&eacute;mon on a team to share a type with each other",
		onBegin() {
			this.add('rule', 'Same Type Clause: Pokémon in a team must share a type');
		},
		onValidateTeam(team) {
			let typeTable: string[] | null = null;
			for (const set of team) {
				const template = this.dex.getSpecies(set.species);
				let types = template.types;
				if (!types) return ["Your team must share a type."];
				const item = this.dex.getItem(set.item);
				if (item.megaStone) {
					const megaTemplate = this.dex.getSpecies(item.megaStone);
					if (megaTemplate.types[1] !== this.dex.getSpecies(item.megaEvolves).types[1] && types[1] !== (megaTemplate.types[1] || megaTemplate.types[0])) types = [types[0]];
				}
				if (!typeTable) {
					typeTable = types;
				} else {
					typeTable = typeTable.filter(type => types.includes(type));
				}
				if (!typeTable.length) return ["Your team must share a type."];
			}
		},
	},
};
