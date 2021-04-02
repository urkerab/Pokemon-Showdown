export const Abilities: {[k: string]: ModdedAbilityData} = {
	chlorophyll: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (!this.field.suppressingWeather()) {
				return this.chainModify(2);
			}
		},
	},
	drought: {
		inherit: true,
		onStart(source) {
		},
	},
	flowergift: {
		inherit: true,
		onUpdate(pokemon) {
			if (!pokemon.isActive || pokemon.baseSpecies.id !== 'cherrim') return;
			const template = this.field.suppressingWeather() ? 'Cherrim' : 'Cherrim-Sunshine';
			if (pokemon.species.id !== this.toID(template)) {
				pokemon.formeChange(template, this.effect, false, '[msg]');
			}
		},
		onAllyModifyAtk(atk) {
			if (this.effectState.target.baseSpecies.baseSpecies !== 'Cherrmin') return;
			return this.chainModify(1.5);
		},
		onAllyModifySpD(spd) {
			if (this.effectState.target.baseSpecies.baseSpecies !== 'Cherrmin') return;
			return this.chainModify(1.5);
		},
	},
	harvest: {
		inherit: true,
		onResidual(pokemon) {
			if (pokemon.hp && !pokemon.item && this.dex.items.get(pokemon.lastItem).isBerry && (!this.field.suppressingWeather() || this.random(2))) {
				pokemon.setItem(pokemon.lastItem);
				this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Harvest');
			}
		},
	},
	icebody: {
		inherit: true,
		onWeather(target, source, effect) {
			if (!this.field.suppressingWeather()) this.heal(target.maxhp / 16);
		},
	},
	leafguard: {
		inherit: true,
		onSetStatus(pokemon) {
			if (!this.field.suppressingWeather()) return false;
		},
		onTryHit(target, source, move) {
			if (move && move.id === 'yawn' && !this.field.suppressingWeather()) return false;
		},
	},
	primordialsea: {
		inherit: true,
		onEnd(pokemon) {
		},
	},
	sandforce: {
		inherit: true,
		onBasePower(basePower, attacker, defender, move) {
			if ((move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel') && !this.field.suppressingWeather()) return this.chainModify([0x14CD, 0x1000]);
		},
	},
	sandrush: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (!this.field.suppressingWeather()) return this.chainModify(2);
		},
	},
	sandstream: {
		inherit: true,
		onStart(source) {
		},
	},
	sandveil: {
		inherit: true,
		onAccuracy(accuracy) {
			if (typeof accuracy === "number" && !this.field.suppressingWeather()) return accuracy * 0.8;
		},
	},
	snowcloak: {
		inherit: true,
		onAccuracy(accuracy) {
			if (typeof accuracy === "number" && !this.field.suppressingWeather()) return accuracy * 0.8;
		},
	},
	snowwarning: {
		inherit: true,
		onStart(source) {
		},
	},
	solarpower: {
		inherit: true,
		onModifySpA(spa, pokemon) {
			if (!this.field.suppressingWeather()) return this.chainModify(1.5);
		},
		onWeather(target, source, effect) {
			this.damage(target.maxhp / 8);
		},
	},
};
