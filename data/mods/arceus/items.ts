export const Items: {[k: string]: ModdedItemData} = {
	"clearplate": {
		name: "Clear Plate",
		onPlate: 'Normal',
		onBasePowerPriority: 6,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Normal') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
				return false;
			}
			return true;
		},
		forcedForme: "Arceus",
		gen: 4,
		desc: "Holder's Normal-type attacks have 1.2x power. Judgment is Normal type.",
	},
};
