export const Items: {[k: string]: ItemData} = {
	"electivite": {
		name: "Electivite",
		spritenum: 577,
		megaStone: "Electivire-Mega",
		megaEvolves: "Electivite",
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1,
		gen: 7,
		desc: "If held by a Electivire, this item allows it to Mega Evolve in battle.",
	},
	"stakatakiumz": {
		name: "Stakatakium Z",
		spritenum: 658,
		onTakeItem: false,
		zMove: "Gyration Dimension",
		zMoveFrom: "Gyro Ball",
		itemUser: ["Stakataka"],
		num: -2,
		gen: 7,
		desc: "If held by a Stakataka with Gyro Ball, it can use Gyration Dimension.",
	},
	"roomextender": {
		name: "Room Extender",
		spritenum: 662,
		fling: {
			basePower: 60,
		},
		num: 879,
		gen: 7,
		desc: "Holder's use of Magic/Wonder/Trick Room lasts 8 turns instead of 5.",
	},
};
