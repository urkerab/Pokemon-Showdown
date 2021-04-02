export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen7',
	pokemon: {
		getActionSpeed() {
			let speed = this.getStat('spe');
			if (speed > 10000) speed = 10000;
			if (!this.battle.field.getPseudoWeather('trickroom')) {
				speed = 10000 - speed;
			}
			return speed & 0x1FFF;
		},
	},
};
