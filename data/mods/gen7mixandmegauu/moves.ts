export const Moves: {[k: string]: ModdedMoveData} = {
	"darkvoid": {
		inherit: true,
		onTryMove(pokemon) {
			if (pokemon.species.baseSpecies === 'Darkrai') {
				return;
			}
			this.add('-hint', "Only a Pokemon whose form is Darkrai can use this move.");
			this.add('-fail', pokemon, 'move: Dark Void'); // TODO: client-side
			return null;
		},
	},
};
