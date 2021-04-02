export const Items: {[k: string]: ModdedItemData} = {
	"snowball": {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Water' && target.useItem()) {
				this.boost({atk: 1});
			}
		},
		desc: "Raises holder's Attack by 1 if hit by a Water-type attack. Single use.",
	},
};
