export const Items: {[k: string]: ModdedItemData} = {
	"apicotberry": {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || pokemon.hasAbility('gluttony')) {
				pokemon.eatItem();
			}
		},
	},
	"custapberry": {
		inherit: true,
		onModifyPriority(priority, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || pokemon.hasAbility('gluttony')) {
				if (pokemon.eatItem()) {
					this.add('-activate', pokemon, 'Custap Berry');
					pokemon.removeVolatile('custapberry');
					return Math.round(priority) + 0.1;
				}
			}
		},
	},
	"ganlonberry": {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || pokemon.hasAbility('gluttony')) {
				pokemon.eatItem();
			}
		},
	},
	"lansatberry": {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || pokemon.hasAbility('gluttony')) {
				pokemon.eatItem();
			}
		},
	},
	"liechiberry": {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || pokemon.hasAbility('gluttony')) {
				pokemon.eatItem();
			}
		},
	},
	"micleberry": {
		inherit: true,
		onResidual(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || pokemon.hasAbility('gluttony')) {
				pokemon.eatItem();
			}
		},
	},
	"petayaberry": {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || pokemon.hasAbility('gluttony')) {
				pokemon.eatItem();
			}
		},
	},
	"salacberry": {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || pokemon.hasAbility('gluttony')) {
				pokemon.eatItem();
			}
		},
	},
	"starfberry": {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || pokemon.hasAbility('gluttony')) {
				pokemon.eatItem();
			}
		},
	},
};
