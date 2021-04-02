export const Items: {[k: string]: ModdedItemData} = {
	"stick": {
		inherit: true,
		onModifyCritRatio(critRatio, user) {
			if (user.baseSpecies.name === 'Farfetch\'d' || user.baseSpecies.name === 'Canard') {
				return critRatio + 2;
			}
		},
	},
	"audimortite": {
		name: "Audimortite",
		spritenum: 577,
		megaStone: "Audimorte-Mega",
		megaEvolves: "Audimorte",
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1,
		gen: 6,
		isNonstandard: 'Custom',
		desc: "If held by an Audimorte, this item allows it to Mega Evolve in battle.",
	},
	"cloudyseed": {
		name: "Cloudy Seed",
		spritenum: 665,
		fling: {
			basePower: 10,
		},
		onUpdate(pokemon) {
			if (this.field.isTerrain('cloudyterrain') && pokemon.useItem()) {
				this.boost({spd: 1});
			}
		},
		num: 882,
		gen: 7,
		desc: "If the terrain is Psychic Terrain, raises holder's Sp. Def by 1 stage. Single use.",
	},
};
