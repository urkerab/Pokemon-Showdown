export const Abilities: {[k: string]: ModdedAbilityData} = {
	"unaware": {
		inherit: true,
		onAnyModifyBoost(boosts, target) {
			const source = this.effectData.target;
			if (source === target) return;
			if (source === this.activePokemon && target === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
				boosts['evasion'] = 0;
			}
			if (target === this.activePokemon && source === this.activeTarget) {
				boosts['atk'] = 0;
				boosts['def'] = 0;
				boosts['spa'] = 0;
				boosts['spd'] = 0;
				boosts['spe'] = 0;
				boosts['accuracy'] = 0;
			}
		},
	},
};
