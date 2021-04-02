export const Abilities: {[k: string]: ModdedAbilityData} = {
	"aerilate": {
		inherit: true,
		onModifyMovePriority: -1,
		onModifyMove(move, pokemon) {
			if (move.type === 'Normal' && move.id !== 'naturalgift') {
				move.type = pokemon.hpType;
				if (move.category !== 'Status') pokemon.addVolatile('aerilate');
			}
		},
	},
	"blaze": {
		inherit: true,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === attacker.hpType && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Blaze boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === attacker.hpType && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Blaze boost');
				return this.chainModify(1.5);
			}
		},
	},
	"chlorophyll": {
		inherit: true,
		onModifySpe(spe, pokemon) {
			switch (pokemon.hpType) {
			case 'ice':
				if (this.field.isWeather('hail')) return this.chainModify(2);
				break;
			case 'rock':
				if (this.field.isWeather('sandstorm')) return this.chainModify(2);
				break;
			case 'water':
				if (this.field.isWeather('raindance')) return this.chainModify(2);
				break;
			default:
				if (this.field.isWeather('sunnyday')) return this.chainModify(2);
				break;
			}
		},
	},
	"darkaura": {
		inherit: true,
		onAnyTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === source.hpType) {
				source.addVolatile('aura');
			}
		},
	},
	"fairyaura": {
		inherit: true,
		onAnyTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === source.hpType) {
				source.addVolatile('aura');
			}
		},
	},
	"flashfire": {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === target.hpType) {
				move.accuracy = true;
				if (!target.addVolatile('flashfire')) {
					this.add('-immune', target, '[msg]', '[from] ability: Flash Fire');
				}
				return null;
			}
		},
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(target) {
				this.add('-start', target, 'ability: Flash Fire');
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, attacker, defender, move) {
				if (move.type === attacker.hpType) {
					this.debug('Flash Fire boost');
					return this.chainModify(1.5);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA(atk, attacker, defender, move) {
				if (move.type === attacker.hpType) {
					this.debug('Flash Fire boost');
					return this.chainModify(1.5);
				}
			},
			onEnd(target) {
				this.add('-end', target, 'ability: Flash Fire', '[silent]');
			},
		},
	},
	"galewings": {
		inherit: true,
		onModifyPriority(priority, pokemon, target, move) {
			if (move && move.type === pokemon.hpType) return priority + 1;
		},
	},
	"heatproof": {
		inherit: true,
		onSourceBasePower(basePower, attacker, defender, move) {
			if (move.type === defender.hpType) {
				return this.chainModify(0.5);
			}
		},
	},
	"hydration": {
		inherit: true,
		onResidual(pokemon) {
			if (!pokemon.status) return;
			switch (pokemon.hpType) {
			case 'fire':
				if (!this.field.isWeather('sunnyday')) return;
				break;
			case 'ice':
				if (!this.field.isWeather('hail')) return;
				break;
			case 'rock':
				if (!this.field.isWeather('sandstorm')) return;
				break;
			default:
				if (!this.field.isWeather('raindance')) return;
				break;
			}
			this.debug('hydration');
			this.add('-activate', pokemon, 'ability: Hydration');
			pokemon.cureStatus();
		},
	},
	"icebody": {
		inherit: true,
		onWeather(target, source, effect) {
			switch (target.hpType) {
			case 'fire':
				if (effect.id !== 'sunnyday') return;
				break;
			case 'rock':
				if (effect.id !== 'sandstorm') return;
				break;
			case 'water':
				if (effect.id !== 'raindance') return;
				break;
			default:
				if (effect.id !== 'hail') return;
				break;
			}
			this.heal(target.maxhp / 16);
		},
		onImmunity(type, pokemon) {
			switch (pokemon.hpType) {
			case 'fire':
				break;
			case 'rock':
				if (type === 'sandstorm') return false;
				break;
			case 'water':
				break;
			default:
				if (type === 'hail') return false;
				break;
			}
		},
	},
	"justified": {
		inherit: true,
		onDamagingHit(damage, target, source, effect) {
			if (effect && effect.type === target.hpType) {
				this.boost({atk: 1});
			}
		},
	},
	"leafguard": {
		inherit: true,
		onSetStatus(status, target, source, effect) {
			switch (target.hpType) {
			case 'ice':
				if (!this.field.isWeather('hail')) return;
				break;
			case 'rock':
				if (!this.field.isWeather('sandstorm')) return;
				break;
			case 'water':
				if (!this.field.isWeather('raindance')) return;
				break;
			default:
				if (!this.field.isWeather('sunnyday')) return;
				break;
			}
			if ((effect as ActiveMove)?.status) this.add('-immune', target, '[msg]', '[from] ability: Leaf Guard');
			return false;
		},
		onTryAddVolatile(status, target) {
			if (status.id !== 'yawn') return;
			switch (target.hpType) {
			case 'ice':
				if (!this.field.isWeather('hail')) return;
				break;
			case 'rock':
				if (!this.field.isWeather('sandstorm')) return;
				break;
			case 'water':
				if (!this.field.isWeather('raindance')) return;
				break;
			default:
				if (!this.field.isWeather('sunnyday')) return;
				break;
			}
			this.add('-immune', target, '[msg]', '[from] ability: Leaf Guard');
			return null;
		},
	},
	"levitate": {
		inherit: true,
		onImmunity(type, pokemon) {
			if (type !== 'Ground' && type === pokemon.hpType) return false;
		},
	},
	"lightningrod": {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === target.hpType) {
				if (!this.boost({spa: 1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Lightning Rod');
				}
				return null;
			}
		},
		onAnyRedirectTarget(target, source, source2, move) {
			if (move.type !== this.effectData.target.hpType || move.id in {firepledge: 1, grasspledge: 1, waterpledge: 1}) return;
			if (this.validTarget(this.effectData.target, source, move.target)) {
				if (this.effectData.target !== target) {
					this.add('-activate', this.effectData.target, 'ability: Lightning Rod');
				}
				return this.effectData.target;
			}
		},
	},
	"magnetpull": {
		inherit: true,
		onFoeTrapPokemon(pokemon) {
			if (pokemon.hasType(this.effectData.target.hpType) && this.isAdjacent(pokemon, this.effectData.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectData.target;
			if (!source || !this.isAdjacent(pokemon, source)) return;
			if (!pokemon.knownType || pokemon.hasType(source.hpType)) {
				pokemon.maybeTrapped = true;
			}
		},
	},
	"motordrive": {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === target.hpType) {
				if (!this.boost({spe: 1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Motor Drive');
				}
				return null;
			}
		},
	},
	"normalize": {
		inherit: true,
		onModifyMove(move, pokemon) {
			if (move.id !== 'struggle' && this.dex.getMove(move.id).type !== pokemon.hpType) {
				move.type = pokemon.hpType;
			}
		},
	},
	"overgrow": {
		inherit: true,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === attacker.hpType && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Overgrow boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === attacker.hpType && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Overgrow boost');
				return this.chainModify(1.5);
			}
		},
	},
	"pixilate": {
		inherit: true,
		onModifyMove(move, pokemon) {
			if (move.type === 'Normal' && move.id !== 'naturalgift') {
				move.type = pokemon.hpType;
				if (move.category !== 'Status') pokemon.addVolatile('pixilate');
			}
		},
	},
	"raindish": {
		inherit: true,
		onWeather(target, source, effect) {
			switch (target.hpType) {
			case 'fire':
				if (effect.id !== 'sunnyday') return;
				break;
			case 'ice':
				if (effect.id !== 'hail') return;
				break;
			case 'rock':
				if (effect.id !== 'sandstorm') return;
				break;
			default:
				if (effect.id !== 'raindance') return;
				break;
			}
			this.heal(target.maxhp / 16);
		},
		onImmunity(type, pokemon) {
			switch (pokemon.hpType) {
			case 'fire':
				break;
			case 'ice':
				if (this.field.isWeather('hail')) return false;
				break;
			case 'rock':
				if (this.field.isWeather('sandstorm')) return false;
				break;
			default:
				break;
			}
		},
	},
	"rattled": {
		inherit: true,
		onDamagingHit(damage, target, source, effect) {
			if (effect && this.dex.data.TypeChart[target.hpType].damageTaken[effect.type] === 1) {
				this.boost({spe: 1});
			}
		},
	},
	"refrigerate": {
		inherit: true,
		onModifyMove(move, pokemon) {
			if (move.type === 'Normal' && move.id !== 'naturalgift') {
				move.type = pokemon.hpType;
				if (move.category !== 'Status') pokemon.addVolatile('refrigerate');
			}
		},
	},
	"sandrush": {
		inherit: true,
		onModifySpe(spe, pokemon) {
			switch (pokemon.hpType) {
			case 'fire':
				if (!this.field.isWeather('sunnyday')) return;
				break;
			case 'ice':
				if (!this.field.isWeather('hail')) return;
				break;
			case 'water':
				if (!this.field.isWeather('raindance')) return;
				break;
			default:
				if (!this.field.isWeather('sandstorm')) return;
				break;
			}
			return this.chainModify(2);
		},
		onImmunity(type, pokemon) {
			switch (pokemon.hpType) {
			case 'fire':
				break;
			case 'ice':
				if (this.field.isWeather('hail')) return false;
				break;
			case 'water':
				break;
			default:
				if (this.field.isWeather('sandstorm')) return false;
				break;
			}
		},
	},
	"sandveil": {
		inherit: true,
		onImmunity(type, pokemon) {
			switch (pokemon.hpType) {
			case 'fire':
				break;
			case 'ice':
				if (this.field.isWeather('hail')) return false;
				break;
			case 'water':
				break;
			default:
				if (this.field.isWeather('sandstorm')) return false;
				break;
			}
		},
		onModifyAccuracy(accuracy, pokemon) {
			if (typeof accuracy !== 'number') return;
			switch (pokemon.hpType) {
			case 'fire':
				if (!this.field.isWeather('sunnyday')) return;
				break;
			case 'ice':
				if (!this.field.isWeather('hail')) return;
				break;
			case 'water':
				if (!this.field.isWeather('raindance')) return;
				break;
			default:
				if (!this.field.isWeather('sandstorm')) return;
				break;
			}
			this.debug('Sand Veil - decreasing accuracy');
			return accuracy * 0.8;
		},
	},
	"sapsipper": {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === target.hpType) {
				if (!this.boost({atk: 1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Sap Sipper');
				}
				return null;
			}
		},
		onAllyTryHitSide(target, source, move) {
			if (target === this.effectData.target || target.side !== source.side) return;
			if (move.type === target.hpType) {
				this.boost({atk: 1}, this.effectData.target);
			}
		},
	},
	"snowcloak": {
		inherit: true,
		onImmunity(type, pokemon) {
			switch (pokemon.hpType) {
			case 'fire':
				break;
			case 'rock':
				if (type === 'sandstorm') return false;
				break;
			case 'water':
				break;
			default:
				if (type === 'hail') return false;
				break;
			}
		},
		onModifyAccuracy(accuracy, pokemon) {
			if (typeof accuracy !== 'number') return;
			switch (pokemon.hpType) {
			case 'fire':
				if (!this.field.isWeather('sunnyday')) return;
				break;
			case 'rock':
				if (!this.field.isWeather('sandstorm')) return;
				break;
			case 'water':
				if (!this.field.isWeather('raindance')) return;
				break;
			default:
				if (!this.field.isWeather('hail')) return;
				break;
			}
			this.debug('Snow Cloak - decreasing accuracy');
			return accuracy * 0.8;
		},
	},
	"solarpower": {
		inherit: true,
		onModifySpA(spa, pokemon) {
			switch (pokemon.hpType) {
			case 'ice':
				if (this.field.isWeather('hail')) return this.chainModify(1.5);
				break;
			case 'rock':
				if (this.field.isWeather('sandstorm')) return this.chainModify(1.5);
				break;
			case 'water':
				if (this.field.isWeather('raindance')) return this.chainModify(1.5);
				break;
			default:
				if (this.field.isWeather('sunnyday')) return this.chainModify(1.5);
				break;
			}
		},
		onWeather(target, source, effect) {
			switch (target.hpType) {
			case 'ice':
				if (effect.id !== 'hail') return;
				break;
			case 'rock':
				if (effect.id !== 'sandstorm') return;
				break;
			case 'water':
				if (effect.id !== 'raindance') return;
				break;
			default:
				if (effect.id !== 'sunnyday') return;
				break;
			}
			this.damage(target.maxhp / 8, target, target);
		},
	},
	"stormdrain": {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === target.hpType) {
				if (!this.boost({spa: 1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Storm Drain');
				}
				return null;
			}
		},
		onAnyRedirectTarget(target, source, source2, move) {
			if (move.type !== this.effectData.target.hpType || move.id in {firepledge: 1, grasspledge: 1, waterpledge: 1}) return;
			if (this.validTarget(this.effectData.target, source, move.target)) {
				if (this.effectData.target !== target) {
					this.add('-activate', this.effectData.target, 'ability: Storm Drain');
				}
				return this.effectData.target;
			}
		},
	},
	"swarm": {
		inherit: true,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === attacker.hpType && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Swarm boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === attacker.hpType && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Swarm boost');
				return this.chainModify(1.5);
			}
		},
	},
	"swiftswim": {
		inherit: true,
		onModifySpe(spe, pokemon) {
			switch (pokemon.hpType) {
			case 'fire':
				if (this.field.isWeather('sunnyday')) return this.chainModify(2);
				break;
			case 'ice':
				if (this.field.isWeather('hail')) return this.chainModify(2);
				break;
			case 'rock':
				if (this.field.isWeather('sandstorm')) return this.chainModify(2);
				break;
			default:
				if (this.field.isWeather('raindance')) return this.chainModify(2);
				break;
			}
		},
		onImmunity(type, pokemon) {
			switch (pokemon.hpType) {
			case 'fire':
				break;
			case 'ice':
				if (this.field.isWeather('hail')) return false;
				break;
			case 'rock':
				if (this.field.isWeather('sandstorm')) return false;
				break;
			default:
				break;
			}
		},
	},
	"torrent": {
		inherit: true,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === attacker.hpType && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Torrent boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === attacker.hpType && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Torrent boost');
				return this.chainModify(1.5);
			}
		},
	},
	"voltabsorb": {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === target.hpType) {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Volt Absorb');
				}
				return null;
			}
		},
	},
	"waterabsorb": {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === target.hpType) {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Water Absorb');
				}
				return null;
			}
		},
	},
};
