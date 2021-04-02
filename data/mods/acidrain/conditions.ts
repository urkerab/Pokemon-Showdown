export const Conditions: {[k: string]: ModdedConditionData} = {
	primordialsea: {
		effectType: 'Weather',
		duration: 0,
		onImmunity(type) {
			if (type === 'frz') return false;
		},
		onModifySpDPriority: 10,
		onModifySpD(spd, pokemon) {
			if (pokemon.hasType('Rock')) return this.modify(spd, 1.5);
		},
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (move.type === 'Water' || move.type === 'Fire') return this.chainModify(0.75);
		},
		onResidualOrder: 1,
		onResidual() {
			this.add('-weather', 'PrimordialSea', '[upkeep]');
			this.eachEvent('Weather');
		},
		onStart(battle, source, effect) {
			this.add('-weather', 'PrimordialSea');
		},
		onWeather(target) {
			this.damage(target.maxhp / 16, target, null, this.dex.getEffect("sandstorm"));
			this.damage(target.maxhp / 16, target, null, this.dex.getEffect("hail"));
		},
	},
};
