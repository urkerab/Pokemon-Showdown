export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen7',
	init() {
		const transfers: {[k: string]: string} = {Bug: 'Grass', Flying: 'Normal', Ghost: 'Psychic', Ground: 'Fighting', Ice: 'Water', Poison: 'Psychic', Rock: 'Fighting'};
		for (const i in this.data.Moves) {
			if (this.data.Moves[i].type in transfers) this.modData('Moves', i).type = transfers[this.data.Moves[i].type];
		}
		for (const i in this.data.Pokedex) {
			if (this.data.Pokedex[i].types[0] in transfers) this.modData('Pokedex', i).types[0] = transfers[this.data.Pokedex[i].types[0]];
			if (this.data.Pokedex[i].types[1] in transfers) this.modData('Pokedex', i).types[1] = transfers[this.data.Pokedex[i].types[1]];
			if (this.data.Pokedex[i].types[0] === this.data.Pokedex[i].types[1]) this.data.Pokedex[i].types.pop();
		}
	},
	pokemon: {
		hasType(type) {
			if (!type) return false;
			if (Array.isArray(type)) {
				for (const t of type) {
					if (this.hasType(t)) return true;
				}
			} else {
				const transfers: {[k: string]: string} = {Bug: 'Grass', Flying: 'Normal', Ghost: 'Psychic', Ground: 'Fighting', Ice: 'Water', Poison: 'Psychic', Rock: 'Fighting'};
				type = transfers[type] || type;
				if (this.getTypes().includes(type)) return true;
			}
			return false;
		},
		getTypes(excludeAdded) {
			let types = this.types;
			types = this.battle.runEvent('Type', this, null, null, types);
			if (!excludeAdded && this.addedType) {
				types = types.concat(this.addedType);
			}
			if (types.length) return types;
			return ['Normal'];
		},
		isGrounded(/** negateImmunity*/) {
			if ('gravity' in this.battle.field.pseudoWeather) return true;
			if ('ingrain' in this.volatiles) return true;
			if ('smackdown' in this.volatiles) return true;
			if (this.hasItem('ironball')) return true;
			/// if (!negateImmunity && this.hasType('Flying')) return false;
			if (this.hasAbility('levitate') && !this.battle.suppressingAttackEvents()) return null;
			if ('magnetrise' in this.volatiles) return false;
			if ('telekinesis' in this.volatiles) return false;
			return !this.hasItem('airballoon');
		},
		runImmunity(type, message) {
			if (!type || type === '???') {
				return true;
			}
			const transfers: {[k: string]: string} = {Bug: 'Grass', Flying: 'Normal', Ghost: 'Psychic', Ground: 'Fighting', Ice: 'Water', Poison: 'Psychic', Rock: 'Fighting'};
			type = transfers[type] || type;
			if (this.fainted) {
				return false;
			}
			let isGrounded;
			const negateResult = this.battle.runEvent('NegateImmunity', this, type);
			if (type === 'Fighting') {
				isGrounded = this.isGrounded(!negateResult);
				if (isGrounded === null) {
					if (message) {
						this.battle.add('-immune', this, '[msg]', '[from] ability: Levitate');
					}
					return false;
				}
			}
			if (!negateResult) return true;
			if ((isGrounded === undefined && !this.battle.dex.getImmunity(type, this)) || isGrounded === false) {
				if (message) {
					this.battle.add('-immune', this, '[msg]');
				}
				return false;
			}
			return true;
		},
	},
};
