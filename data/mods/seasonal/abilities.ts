export const Abilities: {[k: string]: ModdedAbilityData} = {
	// Asty
	astyabsorb: {
		shortDesc: "Sap Sipper + Water Absorb.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Asty Absorb');
				}
				return null;
			}
			if (target !== source && move.type === 'Grass') {
				if (!this.boost({atk: 1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Asty Absorb');
				}
				return null;
			}
		},
		onAllyTryHitSide(target, source, move) {
			if (target === this.effectData.target || target.side !== source.side) return;
			if (move.type === 'Grass') {
				this.boost({atk: 1}, this.effectData.target);
			}
		},
		name: "Asty Absorb",
		rating: 3.5,
	},
	// GeoffBruedley
	baitkai: {
		shortDesc: "Infatuates and confuses opponents that make contact.",
		onDamagingHit(damage, target, source, move) {
			if (move?.flags['contact']) {
				source.addVolatile('attract', target);
				source.addVolatile('confusion', target);
			}
		},
		name: "Baitkai",
		rating: 2,
	},
	// Frysinger
	funhouse: {
		shortDesc: "Uses Topsy-Turvy on switch in.",
		onStart(source) {
			this.useMove('Topsy-Turvy', source);
		},
		name: "Funhouse",
		rating: 3.5,
	},
	// MattL
	gravitationalfield: {
		shortDesc: "On switch-in, this Pokemon causes the effects of Gravity to occur.",
		onStart(source) {
			this.field.addPseudoWeather('gravity', source);
		},
		name: "Gravitational Field",
		rating: 4,
	},
	// TEG
	hiddentype: {
		shortDesc: "This Pokemon's type changes to match its held Plate.",
		onSwitchInPriority: 101,
		onSwitchIn(pokemon) {
			let type = pokemon.getItem().onPlate;
			if (!type) {
				type = 'Normal';
			}
			pokemon.addType(type);
			this.add('-start', pokemon, 'typeadd', type, '[from] ability: Hidden Type');
		},
		name: "Hidden Type",
		rating: 5,
	},
	// Snowy
	holyhail: {
		shortDesc: "On switch-in, this Pokemon summons permanent Hail.",
		onStart() {
			this.field.setWeather('hail');
		},
		onAnySetWeather(target, source, weather) {
			if (weather.id !== 'hail') {
				this.add('message', 'The Holy Hail resisted the attempt to change the weather!');
				return false;
			}
		},
		onImmunity(type) {
			if (type === 'hail') return false;
		},
		onModifySpe() {
			if (this.field.isWeather(['hail'])) {
				return this.chainModify(2);
			}
		},
		onWeather(target, source, effect) {
			if (effect.id === 'hail') {
				this.heal(target.maxhp / 16);
			}
		},
		name: "Holy Hail",
		rating: 5,
	},
	// Sunfished
	killjoy: {
		shortDesc: "All Status moves have prioirty raised by 1 but require recharge.",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Killjoy');
			this.field.addPseudoWeather('killjoy', pokemon, this.dex.getEffect("Killjoy"));
		},
		onEnd(pokemon) {
			const foes = pokemon.side.foe.active;
			if (this.field.pseudoWeather['killjoy'] && !(foes.length && foes[0].hasAbility('killjoy'))) {
				this.field.removePseudoWeather('killjoy');
			}
		},
		condition: {
			onStart() {
				this.add('message', 'All status moves will gain priority and cause recharge in the user!');
			},
			onModifyPriority(priority, pokemon, target, move) {
				if (move && move.category === 'Status') return priority + 1;
			},
			onModifyMove(move) {
				if (move.category === 'Status') {
					move.flags.recharge = 1;
					move.onAfterMove = function (source) {
						source.addVolatile('mustrecharge', source);
					};
				}
			},
			onEnd() {
				this.add('message', 'The priority of status moves have returned to normal.');
			},
		},
		name: "Killjoy",
		rating: 2,
	},
	// Halite
	lightlysalted: {
		shortDesc: "This Pokemon's Physical moves become Special. 18% chance to freeze. +1 priority to Status moves.",
		onModifyPriority(priority, pokemon, target, move) {
			if (move && move.category === 'Status') {
				return priority + 1;
			}
		},
		onModifyMovePriority: 90,
		onModifyMove(move) {
			if (move.category === "Physical") {
				move.category = "Special";
			}
			if (!move.flags['contact']) return;
			if (!move.secondaries) {
				move.secondaries = [];
			}
			move.secondaries.push({
				chance: 18,
				status: 'frz',
			});
		},
		name: "Lightly Salted",
		rating: 3.5,
	},
	// Golui
	specialsnowflake: {
		desc: "All Physical attacks against this Pokemon become Special.",
		onStart(source) {
			this.add('-ability', source, 'Special Snowflake');
			this.add('message', 'All moves that target a Special Snowflake will become Special!');
		},
		onTryHit(target, source, move) {
			if (move.category !== 'Status') {
				move.category = 'Special';
			}
		},
		name: "Special Snowflake",
		rating: 3,
	},
};
