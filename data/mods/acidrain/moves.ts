export const Moves: {[k: string]: ModdedMoveData} = {
	"blizzard": {
		inherit: true,
		onModifyMove(move) {
			if (!this.field.suppressingWeather()) move.accuracy = true;
		},
	},
	"growth": {
		inherit: true,
		onModifyMove(move) {
			if (!this.field.suppressingWeather()) move.boosts = {atk: 2, spa: 2};
		},
	},
	"hail": {
		inherit: true,
		weather: "primordialsea",
	},
	"moonlight": {
		inherit: true,
		onHit(pokemon) {
			this.heal(pokemon.maxhp / (this.field.suppressingWeather() ? 2 : 12));
		},
	},
	"morningsun": {
		inherit: true,
		onHit(pokemon) {
			this.heal(pokemon.maxhp / (this.field.suppressingWeather() ? 2 : 12));
		},
	},
	"sandstorm": {
		inherit: true,
		weather: "primordialsea",
	},
	"solarbeam": {
		inherit: true,
		onTry(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) return;
			this.add('-prepare', attacker, move.name, defender);
			if (this.field.suppressingWeather() && this.runEvent('ChargeMove', attacker, defender, move)) {
				attacker.addVolatile('twoturnmove', defender);
				return null;
			}
			this.add('-anim', attacker, move.name, defender);
		},
		onBasePower(basePOwer, pokemon, target) {
			if (!this.field.suppressingWeather()) this.chainModify(0.125);
		},
	},
	"sunnyday": {
		inherit: true,
		weather: "primordialsea",
	},
	"synthesis": {
		inherit: true,
		onHit(pokemon) {
			this.heal(pokemon.maxhp / (this.field.suppressingWeather() ? 2 : 12));
		},
	},
	"weatherball": {
		inherit: true,
		basePowerCallback() {
			return this.field.suppressingWeather() ? 50 : 800;
		},
		onModifyMove(move) {
			if (!this.field.suppressingWeather()) move.type = 'Ice';
		},
	},
};
