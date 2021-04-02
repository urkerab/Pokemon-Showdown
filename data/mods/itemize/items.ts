export const Items: {[k: string]: ModdedItemData} = {
	"adamantorb": {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Steel' || move.type === 'Dragon') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		desc: "Holder's Steel- and Dragon-type attacks have 1.2x power.",
	},
	"deepseascale": {
		inherit: true,
		onModifySpD(spd, pokemon) {
			return this.chainModify(2);
		},
		desc: "Holder's Sp. Def is doubled.",
	},
	"deepseatooth": {
		inherit: true,
		onModifySpA(spa, pokemon) {
			return this.chainModify(2);
		},
		desc: "Holder's Sp. Atk is doubled.",
	},
	"eviolite": {
		inherit: true,
		onModifyDef(def, pokemon) {
			return this.chainModify(1.5);
		},
		onModifySpD(spd, pokemon) {
			return this.chainModify(1.5);
		},
		desc: "Holder's Defense and Sp. Def are 1.5x.",
	},
	"griseousorb": {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Ghost' || move.type === 'Dragon') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		desc: "Holder's Ghost- and Dragon-type attacks have 1.2x power.",
	},
	"lightball": {
		inherit: true,
		onModifyAtk(atk, pokemon) {
			return this.chainModify(2);
		},
		onModifySpA(spa, pokemon) {
			return this.chainModify(2);
		},
		desc: "Holder's Attack and Sp. Atk are doubled.",
	},
	"luckypunch": {
		inherit: true,
		onModifyCritRatio(critRatio) {
			return critRatio + 2;
		},
		gen: 2,
		desc: "Holder's critical hit ratio is raised by 2 stages.",
	},
	"lustrousorb": {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Water' || move.type === 'Dragon') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		desc: "Holder's Water- and Dragon-type attacks have 1.2x power.",
	},
	"metalpowder": {
		inherit: true,
		onModifyDef(def, pokemon) {
			return this.chainModify(2);
		},
		desc: "Holder's Defense is doubled.",
	},
	"quickpowder": {
		inherit: true,
		onModifySpe(spe, pokemon) {
			return this.chainModify(2);
		},
		desc: "Holder's Speed is doubled.",
	},
	"souldew": {
		inherit: true,
		onModifySpA(spa, pokemon) {
			return this.chainModify(1.5);
		},
		onModifySpD(spd, pokemon) {
			return this.chainModify(1.5);
		},
		desc: "Holder's Sp. Atk and Sp. Def are 1.5x.",
	},
	"stick": {
		inherit: true,
		onModifyCritRatio(critRatio) {
			return critRatio + 2;
		},
		desc: "Holder's critical hit ratio is raised by 2 stages.",
	},
	"thickclub": {
		inherit: true,
		onModifyAtk(atk, pokemon) {
			return this.chainModify(2);
		},
		desc: "Holder's Attack is doubled.",
	},
};
