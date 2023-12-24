export const Moves: {[k: string]: ModdedMoveData} = {
	acupressure: {
		inherit: true,
		accuracy: true,
		onHit(target) {
			let toBoost: BoostID = 'atk';
			let previousMax = 0;
			let found = 0;
			let i: StatIDExceptHP;
			for (i in target.storedStats) {
				if (target.baseStoredStats[i] > previousMax && target.boosts[i] < 6) {
					toBoost = i;
					previousMax = target.baseStoredStats[i];
					found++;
				}
			}
			if (found > 0) {
				const boost: SparseBoostsTable = {};
				boost[toBoost] = 2;
				this.boost(boost);
			} else {
				return false;
			}
		},
	},
	aerialace: {
		inherit: true,
		accuracy: true,
		basePower: 80,
		ignoreDefensive: true,
	},
	aurasphere: {
		inherit: true,
		basePower: 80,
		ignoreDefensive: true,
	},
	blizzard: {
		inherit: true,
		accuracy: true,
		basePower: 77,
		onModifyMove(move) {
			if (this.field.isWeather('hail')) move.basePower = 110;
		},
	},
	bonerush: {
		inherit: true,
		accuracy: true,
		basePower: 26,
		multihit: 3,
	},
	bulletseed: {
		inherit: true,
		accuracy: true,
		basePower: 26,
		multihit: 3,
	},
	chargebeam: {
		inherit: true,
		accuracy: true,
		basePower: 31,
		secondary: {
			chance: 100,
			self: {boosts: {spa: 1}},
		},
	},
	coil: {
		inherit: true,
		boosts: {
			atk: 2,
			def: 1,
			spa: 1,
		},
	},
	cometpunch: {
		inherit: true,
		accuracy: true,
		basePower: 19,
		multihit: 3,
	},
	conversion2: {
		inherit: true,
		accuracy: true,
		onHit(target, source) {
			if (!target.lastMove) {
				return false;
			}
			const possibleTypes = [];
			const attackType = this.dex.moves.get(target.lastMove).type;
			for (const type in this.dex.data.TypeChart) {
				if (source.hasType(type) || target.hasType(type)) continue;
				const typeCheck = this.dex.data.TypeChart[type].damageTaken[attackType];
				if (typeCheck === 2 || typeCheck === 3) {
					possibleTypes.push(type);
				}
			}
			if (!possibleTypes.length) {
				return false;
			}
			let type = possibleTypes[0];
			if (possibleTypes.length > 1) {
				// If there's more than one, let's find if a move has STAB.
				const hasMoveTypes: {[k: string]: 1} = {};
				for (const moveid of source.moves) {
					const move = this.dex.moves.get(moveid);
					if (move.category !== 'Status') hasMoveTypes[move.type] = 1;
				}
				for (const possibleType of possibleTypes) {
					if (possibleType in hasMoveTypes) {
						type = possibleType;
						break;
					}
				}
			}

			if (!source.setType(type)) return false;
			this.add('-start', source, 'typechange', type);
		},
	},
	crushclaw: {
		inherit: true,
		accuracy: true,
		basePower: 36,
		secondary: {chance: 100, boosts: {def: -1}},
	},
	darkvoid: {
		inherit: true,
		accuracy: true,
		status: '',
		volatileStatus: 'darkvoid',
		secondary: {chance: 80, status: 'slp'},
	},
	defog: {
		inherit: true,
		accuracy: true,
		onHit(target, source) {
			if (!target.volatiles['substitute']) this.boost({def: -1, spd: -1});
			const sideConditions = {reflect: 1, lightscreen: 1, safeguard: 1, mist: 1, spikes: 1, toxicspikes: 1, stealthrock: 1, stickyweb: 1};
			for (const i in sideConditions) {
				if (target.side.removeSideCondition(i)) {
					this.add('-sideend', target.side, this.dex.conditions.get(i).name, '[from] move: Defog', '[of] ' + target);
				}
			}
			for (const i in sideConditions) {
				if (i === 'reflect' || i === 'lightscreen') continue;
				if (source.side.removeSideCondition(i)) {
					this.add('-sideend', source.side, this.dex.conditions.get(i).name, '[from] move: Defog', '[of] ' + source);
				}
			}
		},
	},
	diamondstorm: {
		inherit: true,
		accuracy: true,
		basePower: 47,
		secondary: {
			chance: 100,
			self: {boosts: {def: 1}},
		},
	},
	disarmingvoice: {
		inherit: true,
		accuracy: true,
		ignoreDefensive: true,
	},
	doubleteam: {
		inherit: true,
		accuracy: true,
		boosts: {
			def: 1,
			spd: 1,
		},
	},
	dynamicpunch: {
		inherit: true,
		accuracy: true,
		basePower: 50,
		secondary: {chance: 100, volatileStatus: 'confusion'},
	},
	feintattack: {
		inherit: true,
		accuracy: true,
		ignoreDefensive: true,
	},
	fierydance: {
		inherit: true,
		accuracy: true,
		basePower: 40,
		secondary: {chance: 100, self: {boosts: {spa: 1}}},
	},
	fissure: {
		inherit: true,
		accuracy: true,
		basePower: 90,
		ignoreDefensive: true,
	},
	flash: {
		inherit: true,
		accuracy: true,
		boosts: {
			atk: -1,
			spa: -1,
		},
	},
	focusenergy: {
		inherit: true,
		accuracy: true,
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: Focus Energy');
			},
			onModifyMove(move) {
				move.basePower *= 1.25;
			},
		},
	},
	frostbreath: {
		inherit: true,
		accuracy: true,
		basePower: 81,
		ignoreDefensive: true,
	},
	glaciate: {
		inherit: true,
		accuracy: true,
		basePower: 61,
		secondary: {chance: 100, boosts: {spe: -1}},
	},
	grasswhistle: {
		inherit: true,
		accuracy: true,
		status: '',
		volatileStatus: 'grasswhistle',
		secondary: {chance: 55, status: 'slp'},
	},
	gravity: {
		inherit: true,
		accuracy: true,
		condition: {
			duration: 5,
			onStart() {
				this.add('-fieldstart', 'move: Gravity');
				for (const pokemon of this.sides[0].active.concat(this.sides[1].active)) {
					let applies = false;
					if (pokemon.removeVolatile('bounce') || pokemon.removeVolatile('fly')) {
						applies = true;
						this.queue.cancelMove(pokemon);
					}
					if (pokemon.volatiles['skydrop']) {
						applies = true;
						this.queue.cancelMove(pokemon);

						if (pokemon.volatiles['skydrop'].source) {
							this.add('-end', pokemon.volatiles['twoturnmove'].source, 'Sky Drop', '[interrupt]');
						}
						pokemon.removeVolatile('skydrop');
						pokemon.removeVolatile('twoturnmove');
					}
					if (pokemon.volatiles['magnetrise']) {
						applies = true;
						delete pokemon.volatiles['magnetrise'];
					}
					if (pokemon.volatiles['telekinesis']) {
						applies = true;
						delete pokemon.volatiles['telekinesis'];
					}
					if (applies) this.add('-activate', pokemon, 'Gravity');
				}
			},
			onBasePowerPriority: 3,
			onBasePower(basePower) {
				return this.chainModify(5 / 3);
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (this.dex.moves.get(moveSlot.id).flags['gravity']) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
				if (move.flags['gravity']) {
					this.add('cant', pokemon, 'move: Gravity', move);
					return false;
				}
			},
			onModifyMove(move, pokemon) {
				if (move.flags['gravity']) {
					this.add('cant', pokemon, 'move: Gravity', move);
					return false;
				}
			},
			onResidualOrder: 22,
			onEnd() {
				this.add('-fieldend', 'move: Gravity');
			},
		},
	},
	guillotine: {
		inherit: true,
		accuracy: true,
		basePower: 90,
		ignoreDefensive: true,
	},
	honeclaws: {
		inherit: true,
		accuracy: true,
		boosts: {
			atk: 2,
			spa: 1,
		},
	},
	horndrill: {
		inherit: true,
		accuracy: true,
		basePower: 90,
		ignoreDefensive: true,
	},
	hurricane: {
		inherit: true,
		accuracy: true,
		basePower: 77,
		onModifyMove(move) {
			if (this.field.isWeather(['raindance', 'primordialsea'])) {
				move.basePower = 110;
			} else if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				move.basePower = 62;
			}
		},
	},
	hypnosis: {
		inherit: true,
		accuracy: true,
		status: '',
		volatileStatus: 'hypnosis',
		secondary: {chance: 60, status: 'slp'},
	},
	inferno: {
		inherit: true,
		accuracy: true,
		basePower: 50,
		secondary: {chance: 100, status: 'brn'},
	},
	kinesis: {
		inherit: true,
		accuracy: true,
		secondary: {chance: 100, boosts: {def: -1, spd: -1}},
	},
	leaftornado: {
		inherit: true,
		accuracy: true,
		basePower: 29,
		secondary: {chance: 100, boosts: {atk: -1, spa: -1}},
	},
	lockon: {
		inherit: true,
		accuracy: true,
		condition: {
			duration: 2,
			onFoeModifyMove(move, source, target) {
				if (source === this.effectState.source && move.ohko) {
					move.basePower *= 2;
				}
			},
		},
	},
	lovelykiss: {
		inherit: true,
		accuracy: true,
		status: '',
		volatileStatus: 'lovelykiss',
		secondary: {chance: 75, status: 'slp'},
	},
	luckychant: {
		inherit: true,
		accuracy: true,
		condition: {
			duration: 5,
			onStart(side) {
				this.add('-sidestart', side, 'move: Lucky Chant');
			},
			onDamage(damage) {
				return damage * 0.875;
			},
			onResidualOrder: 21,
			onResidualSubOrder: 5,
			onEnd(side) {
				this.add('-sideend', side, 'move: Lucky Chant');
			},
		},
	},
	lusterpurge: {
		inherit: true,
		accuracy: true,
		basePower: 35,
		secondary: {chance: 100, boosts: {spd: -1}},
	},
	magicalleaf: {
		inherit: true,
		accuracy: true,
		ignoreDefensive: true,
	},
	magnetbomb: {
		inherit: true,
		accuracy: true,
		ignoreDefensive: true,
	},
	magnitude: {
		inherit: true,
		accuracy: true,
		basePower: 90,
		onModifyMove() {},
	},
	metronome: {
		inherit: true,
		accuracy: true,
		onHit(target, source) {
			const moves = [];
			for (const i in exports.BattleMovedex) {
				const move = exports.BattleMovedex[i];
				if (i !== move.id) continue;
				if (move.isZ || move.isNonstandard) continue;
				const noMetronome: {[k: string]: 1} = {
					afteryou: 1, assist: 1, belch: 1, bestow: 1, celebrate: 1, chatter: 1, copycat: 1, counter: 1, covet: 1,
					craftyshield: 1, destinybond: 1, detect: 1, diamondstorm: 1, dragonascent: 1, endure: 1, feint: 1, focuspunch: 1,
					followme: 1, freezeshock: 1, happyhour: 1, helpinghand: 1, holdhands: 1, hyperspacefury: 1, hyperspacehole: 1,
					iceburn: 1, kingsshield: 1, lightofruin: 1, matblock: 1, mefirst: 1, metronome: 1, mimic: 1, mirrorcoat: 1,
					mirrormove: 1, naturepower: 1, originpulse: 1, precipiceblades: 1, protect: 1, quash: 1, quickguard: 1,
					ragepowder: 1, relicsong: 1, secretsword: 1, sketch: 1, sleeptalk: 1, snarl: 1, snatch: 1, snore: 1, spikyshield: 1,
					steameruption: 1, struggle: 1, switcheroo: 1, technoblast: 1, thief: 1, thousandarrows: 1, thousandwaves: 1,
					transform: 1, trick: 1, vcreate: 1, wideguard: 1,
				};
				if (noMetronome[move.id]) continue;
				if (this.dex.moves.get(i).gen > this.gen) continue;
				moves.push(move.id);
			}
			let move = '';
			if (moves.length) {
				if (!source.m.metronome) {
					source.m.metronome = 0;
				}
				move = moves.sort()[source.m.metronome++];
			}
			if (!move) {
				return false;
			}
			this.actions.useMove(move, target);
		},
	},
	mindreader: {
		inherit: true,
		accuracy: true,
		condition: {
			duration: 2,
			onFoeModifyMove(move, source, target) {
				if (source === this.effectState.source && move.ohko) {
					move.basePower *= 2;
				}
			},
		},
	},
	minimize: {
		inherit: true,
		accuracy: true,
		condition: {
			noCopy: true,
			onSourceModifyDamage(damage, source, target, move) {
				if (move.id in {'stomp': 1, 'steamroller': 1, 'bodyslam': 1, 'flyingpress': 1, 'dragonrush': 1, 'phantomforce': 1}) {
					return this.chainModify(4);
				}
			},
		},
		boosts: {
			def: 2,
			spd: 2,
		},
	},
	miracleeye: {
		inherit: true,
		accuracy: true,
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Miracle Eye');
			},
			onNegateImmunity(pokemon, type) {
				if (type === 'Psychic' || type === 'Normal' || type === 'Ghost' || type === 'Fighting') return false;
			},
			/// XXX does this disable status and weather immunity?
			onSetStatusPriority: -1,
			onSetStatus(status) {
				return true;
			},
			onImmunityPriority: -1,
			onImmunity(type) {
				return true;
			},
			onFoeModifyMove(move, source, target) {
				move.ignoreDefensive = true;
			},
		},
	},
	mistball: {
		inherit: true,
		accuracy: true,
		basePower: 35,
		secondary: {chance: 100, boosts: {spa: -1}},
	},
	mudslap: {
		inherit: true,
		accuracy: true,
		secondary: {chance: 100, boosts: {atk: -1, spa: -1}},
	},
	octazooka: {
		inherit: true,
		accuracy: true,
		basePower: 28,
		secondary: {chance: 100, boosts: {atk: -1, spa: -1}},
	},
	odorsleuth: {
		inherit: true,
		accuracy: true,
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Odor Sleuth');
			},
			onNegateImmunity(pokemon, type) {
				if (type === 'Psychic' || type === 'Normal' || type === 'Ghost' || type === 'Fighting') return false;
			},
			/// XXX does this disable status and weather immunity?
			onSetStatusPriority: -1,
			onSetStatus(status) {
				return true;
			},
			onImmunityPriority: -1,
			onImmunity(type) {
				return true;
			},
			onFoeModifyMove(move, source, target) {
				move.ignoreDefensive = true;
			},
		},
	},
	poisonfang: {
		inherit: true,
		accuracy: true,
		basePower: 25,
		secondary: {
			chance: 100,
			status: 'tox',
		},
	},
	present: {
		inherit: true,
		accuracy: true,
		basePower: 1,
		onModifyMove() {},
		onHit(target, source) {
			this.heal(Math.ceil(target.maxhp * 0.25));
		},
		onBasePower(basePower, pokemon, target) {
			const percent = Math.ceil(target.hp * target.maxhp / 100);
			basePower = 60;
			if (percent > 75) {
				basePower = 120;
			} else if (percent > 50) {
				basePower = 100;
			} else if (percent > 25) {
				basePower = 80;
			}
			return basePower;
		},
	},
	psywave: {
		inherit: true,
		accuracy: true,
		damageCallback(pokemon) {
			return pokemon.level + 50;
		},
	},
	rockblast: {
		inherit: true,
		accuracy: true,
		basePower: 26,
		multihit: 3,
	},
	rocksmash: {
		inherit: true,
		accuracy: true,
		basePower: 20,
		secondary: {chance: 100, boosts: {def: -1}},
	},
	sandattack: {
		inherit: true,
		accuracy: true,
		boosts: {
			atk: -1,
			spa: -1,
		},
	},
	seedflare: {
		inherit: true,
		accuracy: true,
		secondary: {
			chance: 80,
			boosts: {
				spd: -1,
			},
		},
	},
	shadowpunch: {
		inherit: true,
		accuracy: true,
		ignoreDefensive: true,
	},
	sheercold: {
		inherit: true,
		accuracy: true,
		basePower: 90,
		ignoreDefensive: true,
	},
	shockwave: {
		inherit: true,
		accuracy: true,
		ignoreDefensive: true,
	},
	sing: {
		inherit: true,
		accuracy: true,
		status: '',
		volatileStatus: 'sing',
		secondary: {chance: 55, status: 'slp'},
	},
	sleeppowder: {
		inherit: true,
		accuracy: true,
		status: '',
		volatileStatus: 'sleeppowder',
		secondary: {chance: 75, status: 'slp'},
	},
	sleeptalk: {
		inherit: true,
		accuracy: true,
		onHit(pokemon) {
			if (pokemon.status !== 'slp') return false;
			const moves = [];
			for (const move of pokemon.moves) {
				const NoSleepTalk: {[k: string]: 1} = {
					assist: 1, bide: 1, chatter: 1, copycat: 1, focuspunch: 1, mefirst: 1, metronome: 1, mimic: 1, mirrormove: 1, naturepower: 1, sketch: 1, sleeptalk: 1, uproar: 1,
				};
				if (move && !(NoSleepTalk[move] || this.dex.moves.get(move).flags['charge'])) {
					moves.push(move);
				}
			}
			let move = '';
			if (moves.length) move = moves[this.random(moves.length)];
			if (!move) {
				return false;
			}
			this.actions.useMove(move, pokemon);
		},
	},
	smokescreen: {
		inherit: true,
		accuracy: true,
		boosts: {
			atk: -1,
			spa: -1,
		},
	},
	spikecannon: {
		inherit: true,
		accuracy: true,
		basePower: 21,
		multihit: 3,
	},
	stormthrow: {
		inherit: true,
		accuracy: true,
		ignoreDefensive: true,
	},
	sweetscent: {
		inherit: true,
		accuracy: true,
		boosts: {
			def: -2,
			spd: -2,
		},
	},
	swift: {
		inherit: true,
		accuracy: true,
		ignoreDefensive: true,
	},
	tailslap: {
		inherit: true,
		accuracy: true,
		basePower: 26,
		multihit: 3,
	},
	telekinesis: {
		inherit: true,
		accuracy: true,
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Telekinesis');
			},
			onNegateImmunity(pokemon, type) {
				if (type === 'Psychic' || type === 'Normal' || type === 'Ghost' || type === 'Fighting') return false;
			},
			/// XXX does this disable status and weather immunity?
			onSetStatusPriority: -1,
			onSetStatus(status) {
				return true;
			},
			onImmunityPriority: -1,
			onImmunity(type) {
				return true;
			},
			onFoeModifyMove(move, source, target) {
				move.ignoreDefensive = true;
			},
		},
	},
	thunder: {
		inherit: true,
		accuracy: true,
		onModifyMove(move) {
			if (this.field.isWeather(['raindance', 'primordialsea'])) {
				move.basePower = 110;
			} else if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				move.basePower = 62;
			}
		},
	},
	triattack: {
		inherit: true,
		secondaries: [{
			chance: 20,
			status: 'brn',
		}, {
			chance: 20,
			status: 'par',
		}, {
			chance: 20,
			status: 'frz',
		}],
	},
	vitalthrow: {
		inherit: true,
		accuracy: true,
		ignoreDefensive: true,
	},
	watershuriken: {
		inherit: true,
		accuracy: true,
		basePower: 16,
		multihit: 3,
	},
	willowisp: {
		inherit: true,
		accuracy: true,
		status: '',
		volatileStatus: 'willowisp',
		secondary: {chance: 85, status: 'brn'},
	},
};
