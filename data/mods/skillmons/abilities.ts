export const Abilities: {[k: string]: ModdedAbilityData} = {
	angerpoint: {
		inherit: true,
		/// onCriticalHit() {},
		onHit(target, source, move) {
			if (target.hp && move && target.getMoveHitData(move).typeMod > 0) {
				this.boost({atk: 6});
			}
		},
	},
	battlearmor: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			return damage * 93.75 / 100;
		},
	},
	compoundeyes: {
		inherit: true,
		onBasePower(basePower, pokemon, target, move) {
			return this.chainModify(1.3);
		},
	},
	forewarn: {
		inherit: true,
		onStart(pokemon) {
			let warnMoves: (Move|Pokemon)[][] = [];
			let warnBp = 1;
			for (const target of pokemon.side.foe.active) {
				if (target.fainted) continue;
				for (const moveid of target.moves) {
					const move = this.dex.getMove(moveid);
					let bp = move.basePower;
					if (move.ohko) bp = 160;
					if (move.id === 'counter' || move.id === 'metalburst' || move.id === 'mirrorcoat') bp = 120;
					if (!bp && move.category !== 'Status') bp = 80;
					if (bp > warnBp) {
						warnMoves = [[move, target]];
						warnBp = bp;
					} else if (bp === warnBp) {
						warnMoves.push([move, target]);
					}
				}
			}
			if (!warnMoves.length) return;
			const warnMove = warnMoves[0];
			this.add('-activate', pokemon, 'ability: Forewarn', warnMove[0], warnMove[1]);
		},
	},
	hustle: {
		inherit: true,
		onModifyAtkPriority: 5,
		onModifyAtk(atk) {
			return this.modify(atk, 1.3);
		},
		onModifySpAPriority: 5,
		onModifySpA(spa) {
			return this.modify(spa, 0.8);
		},
	},
	keeneye: {
		inherit: true,
		onBoost(boost, target, source, effect) {
			let showMsg = false;
			let i: BoostName;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg) this.add("-fail", target, "unboost", "[from] ability: Keen Eye", "[of] " + target);
		},
	},
	moody: {
		inherit: true,
		onResidual(pokemon) {
			let toBoost: BoostName = 'atk';
			let toLower: BoostName = 'def';
			let previousMax = pokemon.baseStoredStats.atk;
			let previousMin = pokemon.baseStoredStats.def;
			let i: StatNameExceptHP;
			for (i in pokemon.storedStats) {
				if (pokemon.baseStoredStats[i] > previousMax && pokemon.boosts[i] < 6) {
					toBoost = i;
					previousMax = pokemon.baseStoredStats[i];
				}
				if (pokemon.baseStoredStats[i] < previousMin && pokemon.boosts[i] > -6) {
					toLower = i;
					previousMin = pokemon.baseStoredStats[i];
				}
			}
			const boost: SparseBoostsTable = {};
			boost[toBoost] = 2;
			boost[toLower] = -1;
			this.boost(boost);
		},
	},
	noguard: {
		inherit: true,
		onModifyMove(move) {
			move.ignoreImmunity = true;
		},
	},
	sandveil: {
		inherit: true,
		onModifyDefPriority: 2,
		onModifyDef(def, pokemon) {
			if (this.field.isWeather('sandstorm')) return this.chainModify(1.125);
		},
		onModifySpDPriority: 2,
		onModifySpD(spd, pokemon) {
			if (this.field.isWeather('sandstorm')) return this.chainModify(1.125);
		},
	},
	shellarmor: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			return damage * 93.75 / 100;
		},
	},
	shedskin: {
		inherit: true,
		onResidual(pokemon) {
			if (!pokemon.m.lastShedSkin) pokemon.m.lastShedSkin = pokemon.battle.turn;
			if (pokemon.hp && pokemon.status && pokemon.battle.turn - pokemon.m.lastShedSkin >= 3) {
				this.add('-activate', pokemon, 'ability: Shed Skin');
				pokemon.cureStatus();
				pokemon.m.lastShedSkin = pokemon.battle.turn;
			}
		},
	},
	skilllink: {
		inherit: true,
		onBasePower(basePower, pokemon, target, move) {
			if (move.multihit === 3) {
				return this.chainModify(5 / 3);
			}
		},
	},
	sniper: {
		inherit: true,
		onBasePower(basePower, pokemon, target, move) {
			return this.chainModify(1.125);
		},
	},
	snowcloak: {
		inherit: true,
		onModifyDefPriority: 2,
		onModifyDef(def, pokemon) {
			if (this.field.isWeather('hail')) return this.chainModify(1.125);
		},
		onModifySpDPriority: 2,
		onModifySpD(spd, pokemon) {
			if (this.field.isWeather('hail')) return this.chainModify(1.125);
		},
	},
	superluck: {
		inherit: true,
		onBasePower(basePower, pokemon, target, move) {
			return this.chainModify(1.0625);
		},
	},
	tangledfeet: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (target.volatiles['confusion']) return damage / 2;
		},
	},
	trace: {
		inherit: true,
		onUpdate(pokemon) {
			const possibleTargets = [];
			for (const foe of pokemon.side.foe.active) {
				if (foe && !foe.fainted) possibleTargets.push(foe);
			}
			while (possibleTargets.length) {
				const target = possibleTargets[0];
				const ability = target.getAbility();
				const bannedAbilities: {[k: string]: 1} = {flowergift: 1, forecast: 1, illusion: 1, imposter: 1, multitype: 1, stancechange: 1, trace: 1, zenmode: 1};
				if (bannedAbilities[target.ability]) {
					possibleTargets.splice(0, 1);
					continue;
				}
				this.add('-ability', pokemon, ability, '[from] ability: Trace', '[of] ' + target);
				pokemon.setAbility(ability);
				return;
			}
		},
	},
	victorystar: {
		inherit: true,
		onAllyModifyMove(move) {
			if (typeof move.basePower === 'number') {
				move.basePower *= 1.1;
			}
		},
	},
	wonderskin: {
		inherit: true,
		onSetStatus(status, target, source) {
			this.add('-message', 'Wonder Skin blocks status change.');
			return false;
		},
	},
};
