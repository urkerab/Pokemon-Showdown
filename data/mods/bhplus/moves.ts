export const Moves: {[k: string]: ModdedMoveData} = {
	"naturepower": {
		inherit: true,
		onTryHit(target, pokemon) {
			let move = 'earthquake';
			if (this.field.isTerrain('electricterrain')) {
				move = 'thunderbolt';
			} else if (this.field.isTerrain('grassyterrain')) {
				move = 'energyball';
			} else if (this.field.isTerrain('mistyterrain')) {
				move = 'moonblast';
			}
			this.useMove(move, pokemon, target);
			return null;
		},
	},
};
