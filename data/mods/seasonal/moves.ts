export const Moves: {[k: string]: ModdedMoveData} = {
	// Eevee General
	adminthings: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Taunts and badly poisons opponent and lowers their Atk/SpA, then switches.",
		isNonstandard: "Custom",
		name: "Admin Things",
		pp: 5,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, authentic: 1},
		selfSwitch: true,
		boosts: {atk: -1, spa: -1},
		onHit(target, source) {
			target.trySetStatus('tox', source); // Doesn't use the status property to prevent the move
			target.addVolatile('taunt', source); // from failing before executing all actions.
			if (source.name === 'Eevee General') this.add("c|~Eevee General|Sorry but I have to go! Please submit your request in <<adminrequests>> and we'll look at it soon.");
		},
		target: "normal",
		type: "Normal",
	},
	// Aurora
	aerialfury: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		shortDesc: "No additional effect.",
		isNonstandard: "Custom",
		name: "Aerial Fury",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, gravity: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Defog", source);
			this.add('-anim', source, "Bounce", target);
		},
		target: "normal",
		type: "Flying",
	},
	// Albert
	aestheticallypleasing: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		shortDesc: "40% chance to paralyze the target.",
		isNonstandard: "Custom",
		name: "Aesthetically Pleasing",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Mist Ball", target);
		},
		secondary: {
			chance: 40,
			status: 'par',
		},
		target: "normal",
		type: "Dragon",
	},
	// Asty
	amphibiantoxic: {
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		shortDesc: "Badly poisons the target and sets two layers of toxic spikes.",
		isNonstandard: "Custom",
		name: "Amphibian Toxic",
		pp: 5,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			status: 'tox',
		},
		onHit(pokemon) {
			pokemon.side.addSideCondition('toxicspikes');
			pokemon.side.addSideCondition('toxicspikes');
		},
		target: "normal",
		type: "Poison",
		contestType: "Tough",
	},
	// awu
	ancestorsrage: {
		accuracy: 100,
		basePower: 115,
		category: "Physical",
		shortDesc: "30% chance to confuse the target.",
		isNonstandard: "Custom",
		name: "Ancestor's Rage",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'confusion',
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Torment", source);
			this.add('-anim', source, "Psystrike", target);
		},
		target: "normal",
		type: "Fairy",
	},
	// spacebass
	armyofmushrooms: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Boosts Def/SpD before turn. Calls Sleep Powder, Powder and Leech Seed.",
		isNonstandard: "Custom",
		name: "Army of Mushrooms",
		pp: 5,
		priority: -1,
		flags: {snatch: 1},
		beforeTurnCallback(pokemon) {
			this.boost({def: 1, spd: 1}, pokemon, pokemon, this.dex.conditions.get('Mushroom Army'));
		},
		onHit(pokemon) {
			this.actions.useMove("sleeppowder", pokemon);
			this.actions.useMove("leechseed", pokemon);
			this.actions.useMove("powder", pokemon);
		},
		target: "self",
		type: "Grass",
	},
	// Eyan
	attackofthetoucan: {
		accuracy: 100,
		basePower: 65,
		basePowerCallback(pokemon, target) {
			if (target.status) return 130;
			return 65;
		},
		category: "Special",
		shortDesc: "Power doubles if the target has a status ailment. Cures user's status.",
		isNonstandard: "Custom",
		name: "Attack of the TOUCAN",
		pp: 10,
		priority: 1,
		flags: {mirror: 1, protect: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Bubble Beam", target);
		},
		onHit(target, source) {
			source.cureStatus();
		},
		target: "normal",
		type: "Fighting",
	},
	// boTTT
	automoderation: {
		accuracy: true,
		basePower: 40,
		basePowerCallback(pokemon, target) {
			const boosts = target.positiveBoosts();
			if (boosts) {
				this.add('-message', target.name + " was " + ['warned', 'muted', 'roombanned', 'locked', 'blacklisted', 'banned', 'permabanned'][(boosts < 8 ? boosts - 1 : 6)] + " by boTTT. (Automated moderation: spamming boosts)");
			}
			return 40 * Math.pow(1.5, boosts);
		},
		category: "Physical",
		shortDesc: "Hits first. 1.5×power for each of target's stat boosts. Ignores target's Def.",
		isNonstandard: "Custom",
		name: "Auto-Moderation",
		pp: 35,
		priority: 3,
		flags: {authentic: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Night Shade", target);
		},
		ignoreDefensive: true,
		target: "normal",
		type: "Ghost",
	},
	// Always
	backtothebenchagain: {
		accuracy: true,
		basePower: 70,
		category: "Special",
		shortDesc: "User switches out after damaging the target. This move ignores stat boosts and does not check accuracy.",
		isNonstandard: "Custom",
		name: "Back to the bench again?",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			source.m.oldspaboosts = source.boosts["spa"];
			source.boosts["spa"] = 0;
			source.m.oldatkboosts = source.boosts["atk"];
			source.boosts["spa"] = 0;
		},
		onAfterHit(target, source) {
			source.boosts["spa"] = source.m.oldspaboosts || source.boosts["spa"];
			source.boosts["atk"] = source.m.oldatkboosts || source.boosts["atk"];
		},
		ignoreDefensive: true,
		selfSwitch: true,
		target: "normal",
		type: "Dragon",
	},
	// TEG
	badcode: {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		shortDesc: "Gives target the reverse effect of Moody. Nullifies the target's Ability.",
		isNonstandard: "Custom",
		name: "Bad Code",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onHit(target, source) {
			let stats: BoostID[] = [];
			const boost: SparseBoostsTable = {};
			let statPlus: BoostID;
			for (statPlus in target.boosts) {
				if (target.boosts[statPlus] < 6) {
					stats.push(statPlus);
				}
			}
			let randomStat: BoostID | "" = stats.length ? stats[this.random(stats.length)] : "";
			if (randomStat) boost[randomStat] = 1;

			stats = [];
			let statMinus: BoostID;
			for (statMinus in target.boosts) {
				if (target.boosts[statMinus] > -6 && statMinus !== randomStat) {
					stats.push(statMinus);
				}
			}
			randomStat = stats.length ? stats[this.random(stats.length)] : "";
			if (randomStat) boost[randomStat] = -2;

			this.boost(boost, target, source);
		},
		volatileStatus: 'gastroacid',
		target: "normal",
		type: "Electric",
	},
	// shrang
	banword: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		shortDesc: "20% chance to flinch the target. Deals 10% damage to healthiest ally.",
		isNonstandard: "Custom",
		name: ".banword",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Draco Meteor", target);
		},
		onHit(target) {
			const targets = target.side.pokemon.filter(pokemon => !(pokemon === target));
			targets.sort(() => (Math.round(Math.random()) - 0.5));
			let highestpct = 0, pokemon = target;
			for (const candidate of targets) {
				if (candidate.hp / candidate.maxhp > highestpct && candidate.hp > 1) {
					highestpct = candidate.hp / candidate.maxhp;
					pokemon = candidate;
				}
			}
			if (pokemon !== target) {
				this.add('message', "On " + target.side.name + "'s bench, " + pokemon.name + " was hit by the wake of the attack!");
				if (pokemon.hasAbility('Magic Guard')) {
					this.add('message', "But it resisted the effect using its Magic Guard!");
				} else {
					pokemon.hp -= Math.floor(pokemon.maxhp / 10);
					this.add('message', "It took slight collateral damage!");
				}
				if (!pokemon.hp) pokemon.hp = 1;
			}
		},
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Normal",
	},
	// Fireburn
	barnall: {
		accuracy: 90,
		basePower: 75,
		onBasePower(basePower, source, target) {
			if (target.status === 'brn') {
				return this.chainModify(2);
			}
		},
		category: "Physical",
		shortDesc: "Power doubles if target is burned. Thaws user.",
		isNonstandard: "Custom",
		name: "BARN ALL",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, defrost: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Overheat", target);
		},
		target: "normal",
		type: "Fire",
	},
	// Ace
	bignarstie: {
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		shortDesc: "30% chance to paralyze the target.",
		isNonstandard: "Custom",
		name: "Big Narstie",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			if (source.name === 'Ace') {
				this.add('c|@Ace|AAAUAUUUGOGOOHOOHOHOHOHOHOHOHOOHOH');
			}
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dragon Rush", target);
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Dragon",
	},
	// atomicllamas
	bitchycomment: {
		accuracy: 95,
		basePower: 100,
		category: "Special",
		shortDesc: "50% chance to burn the target.",
		isNonstandard: "Custom",
		name: "Bitchy Comment",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Metal Sound", target);
			this.add('-anim', source, "Torment", target);
		},
		secondary: {
			chance: 50,
			status: 'brn',
		},
		target: "normal",
		type: "Psychic",
	},
	// HeaLnDeaL
	boobersoblivion: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		shortDesc: "User recovers 2/3 of the damage dealt, but faints if move is used 3 times in a row.",
		isNonstandard: "Custom",
		name: "Boober's Oblivion",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, heal: 1},
		drain: [2, 3],
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Eruption", target);
		},
		secondary: {
			chance: 30,
			status: 'brn',
		},
		self: {volatileStatus: 'boobersoblivion'},
		condition: {
			onStart() {
				this.effectState.numConsecutive = 0;
				this.effectState.lastMove = 'boobersoblivion';
			},
			onBeforeMove(source, target, move) {
				if (this.effectState.lastMove === 'boobersoblivion') {
					this.effectState.numConsecutive++;
					if (move.id === this.effectState.lastMove && this.effectState.numConsecutive > 1) {
						source.faint();
					}
				} else {
					this.effectState.numConsecutive = 0;
				}
				this.effectState.lastMove = move.id;
			},
		},
		target: "any",
		type: "Fire",
	},
	// CoolStoryBrobat
	bravebat: {
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		shortDesc: "High critical hit ratio.",
		isNonstandard: "Custom",
		name: "Brave Bat",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, gravity: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Brave Bird", target);
		},
		critRatio: 2,
		target: "normal",
		type: "Flying",
	},
	// Teremiare
	brokenmirror: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Protects from attacks. Attacker's stat boosts are inverted.",
		isNonstandard: "Custom",
		name: "Broken Mirror",
		pp: 10,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'brokenmirror',
		onTryHit(pokemon) {
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect'] || move.category === 'Status') return;
				this.add('-activate', target, 'Protect');
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				const sourceBoosts = {};
				let i: BoostID;
				for (i in source.boosts) {
					source.boosts[i] = -source.boosts[i];
				}
				source.setBoost(sourceBoosts);
				this.add('-invertboost', source, '[from] move: Broken Mirror');
				return null;
			},
		},
		target: "self",
		type: "Dark",
	},
	// Kid Wizard
	brokenwand: {
		accuracy: true,
		basePower: 0,
		category: "Special",
		shortDesc: "Calls Thunderbolt, Ice Beam, Calm Mind and Spikes. 20% chance to backfire.",
		isNonstandard: "Custom",
		name: "Broken Wand",
		pp: 10,
		priority: 0,
		flags: {mirror: 1, snatch: 1},
		onHit(target, source) {
			if (this.random(100) < 20) {
				this.add('-message', "Broken Wand backfired!");
				this.damage(source.maxhp * 0.75, source, source, this.dex.conditions.get('Broken Wand'));
				return false;
			}
			if (source.side.foe.active[0].hp) this.actions.useMove('thunderbolt', source);
			if (!source.hp || !source.side.foe.active[0].hp) return;
			this.actions.useMove('icebeam', source);
			if (!source.hp || !source.side.foe.active[0].hp) return;
			this.actions.useMove('calmmind', source);
			this.actions.useMove('spikes', source);
		},
		target: "self",
		type: "Psychic",
	},
	// Raven
	buckfastbuzz: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		shortDesc: "User recovers 75% of the damage dealt. User's secondary typing switches between Flying and Electric.",
		isNonstandard: "Custom",
		name: "Buckfast Buzz",
		pp: 30,
		priority: 0,
		flags: {protect: 1, mirror: 1, heal: 1},
		drain: [3, 4],
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Oblivion Wing", target);
			if (this.toID(source.name) === 'raven') {
				this.add('c|&Raven|*hic* Ah\'ve had mah tonic wine and ah\'m ready tae batter yeh like a Mars bar ye wee Sassenach.');
			}
		},
		onAfterMoveSecondarySelf(source) {
			if (source.types[1]) {
				if (source.types[1] === 'Flying') {
					source.setType([source.types[0], 'Electric']);
					this.add('-start', source, 'typechange', source.types[0] + '/Electric');
				} else if (source.types[1] === 'Electric') {
					source.setType([source.types[0], 'Flying']);
					this.add('-start', source, 'typechange', source.types[0] + '/Flying');
				}
			}
		},
		target: "normal",
		type: "Flying",
	},
	// Phable (Paradise)
	burnspikes: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Burns grounded foes on switch-in.",
		isNonstandard: "Custom",
		name: "Burn Spikes",
		pp: 20,
		priority: 0,
		flags: {reflectable: 1, nonsky: 1},
		sideCondition: 'burnspikes',
		condition: {
			// this is a side condition
			onStart() {
				this.add('-message', 'The Burn Spikes on the field will burn grounded Pokemon!');
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded()) return;
				if (!pokemon.runImmunity('Fire')) return;
				if (pokemon.hasType('Fire')) {
					this.add('-message', 'The Burn Spikes on the field was absorbed!');
					pokemon.side.removeSideCondition('burnspikes');
				} else {
					pokemon.trySetStatus('brn', pokemon.side.foe.active[0]);
				}
			},
		},
		target: "foeSide",
		type: "Fire",
	},
	// grimAuxiliatrix
	buzzaxerampage: {
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		shortDesc: "Has 33% recoil. Moves user's hazards to the target.",
		isNonstandard: "Custom",
		name: "Buzz Axe Rampage",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Night Slash", target);
		},
		onHit(target, source) {
			const sideConditions = {'spikes': 1, 'toxicspikes': 1, 'burnspikes': 1, 'stealthrock': 1, 'stickyweb': 1};
			for (const i in sideConditions) {
				if (source.side.removeSideCondition(i)) {
					this.add('-sideend', source.side, this.dex.conditions.get(i).name, '[from] move: Buzz Axe Rampage', '[of] ' + source);
					target.side.addSideCondition(i, source);
				}
			}
		},
		recoil: [33, 100],
		target: "normal",
		type: "Dark",
	},
	// Beowulf
	buzzingoftheswarm: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		shortDesc: "10% chance to flinch the target.",
		isNonstandard: "Custom",
		name: "Buzzing of the Swarm",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Bug Buzz", target);
		},
		secondary: {
			chance: 10,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Bug",
	},
	// Zebraiken
	bzzt: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Protects from attacks. Raises user's Attack and Sp. Atk by 1.",
		isNonstandard: "Custom",
		name: "bzzt",
		pp: 5,
		noPPBoosts: true,
		priority: 4,
		flags: {sound: 1},
		self: {boosts: {spa: 1, atk: 1}},
		stallingMove: true,
		volatileStatus: 'protect',
		onPrepareHit(pokemon) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Parabolic Charge", pokemon);
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		target: "self",
		type: "Fighting",
	},
	// Snobalt
	capbust: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		overrideDefensiveStat: 'def',
		shortDesc: "User recovers 50% of the damge dealt. Super effective on Fairy.",
		isNonstandard: "Custom",
		name: "Cap Bust",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Psyshock", target);
		},
		onEffectiveness(typeMod, target, type) {
			if (type === 'Fairy') return 1;
		},
		target: "normal",
		type: "Fighting",
	},
	// iplaytennislol
	cathy: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Often goes first. Raises a random stat by 2. Heals 65% of max HP.",
		isNonstandard: "Custom",
		name: "Cathy",
		pp: 10,
		priority: 0.1,
		flags: {heal: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Judgment", target);
		},
		onHit(target) {
			const stats: BoostID[] = [];
			let stat: BoostID;
			for (stat in target.boosts) {
				if (target.boosts[stat] < 6) {
					stats.push(stat);
				}
			}
			if (stats.length) {
				const randomStat = stats[this.random(stats.length)];
				const boost: SparseBoostsTable = {};
				boost[randomStat] = 2;
				this.boost(boost);
			} else {
				return false;
			}
		},
		heal: [13, 20],
		target: "self",
		type: "Normal",
	},
	// LJ
	chaoswheel: {
		accuracy: true,
		basePower: 100,
		category: "Physical",
		shortDesc: "This move does not check accuracy.",
		isNonstandard: "Custom",
		name: "Chaos Wheel",
		pp: 15,
		priority: 0,
		flags: {contact: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Shadow Force", target);
		},
		target: "normal",
		type: "Ghost",
	},
	// Bondie
	clawguard: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Protects from attacks. Raises the user's Defense by 1 and Attack by 1 and for each hit.",
		isNonstandard: "Custom",
		name: "Claw Guard",
		pp: 5,
		noPPBoosts: true,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'clawguard',
		onPrepareHit(pokemon) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Agility", pokemon);
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('clawguardprotect');
			pokemon.addVolatile('stall');
			this.add('-singleturn', pokemon, 'Protect');
		},
		condition: {
			onStart(pokemon) {
				this.effectState.stage = 0;
				this.add('-start', pokemon, 'Rage');
			},
			onHit(target, source, move) {
				if (move.category === 'Status' || !target.hp || target === source || this.effectState.stage > 5) return;
				this.effectState.stage++;
				this.add('-anim', target, "Torment", target);
				this.add('-message', 'Its rage is building up! (Rage × ' + this.effectState.stage + ')');
			},
			onModifyAtk(atk) {
				return atk + this.modify(atk, this.effectState.stage, 2);
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!target.volatiles['clawguardprotect']) return;
				target.removeVolatile('clawguardprotect');
				if (!move.flags['protect'] || move.category === 'Status') return;
				this.add('-activate', target, 'Protect');
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return null;
			},
			onResidual(pokemon) {
				pokemon.removeVolatile('clawguardprotect');
			},
		},
		boosts: {
			atk: 1,
			def: 1,
		},
		target: "self",
		type: "Normal",
	},
	// Steamroll
	conflagration: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "First turn out only. Protects from moves. Raises user's stats by 2.",
		isNonstandard: "Custom",
		name: "Conflagration",
		pp: 40,
		priority: 4,
		flags: {},
		volatileStatus: 'protect',
		onPrepareHit(pokemon) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Sacred Fire", pokemon);
			return !!this.queue.willAct();
		},
		onTry(pokemon) {
			if (pokemon.activeMoveActions > 1) {
				this.add('-fail', pokemon);
				this.add('-hint', "Conflagration only works on your first turn out.");
				return null;
			}
		},
		boosts: {
			atk: 2,
			def: 2,
			spa: 2,
			spd: 2,
			spe: 2,
		},
		target: "self",
		type: "Fire",
	},
	// Sailor Cosmos
	cosmosray: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		overrideDefensiveStat: 'def',
		shortDesc: "80% chance to paralyze or confuse. Damages based on Defense, not Sp. Def.",
		isNonstandard: "Custom",
		name: "Cosmos Ray",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Cosmic Power', source);
			this.add('-anim', source, 'Freeze Shock', target);
		},
		secondary: {
			chance: 80,
			onHit(target, source) {
				if (this.random(2) === 1) {
					target.trySetStatus('par', source);
				} else {
					target.addVolatile('confusion', source);
				}
			},
		},
		target: "normal",
		type: "Water",
	},
	// Vexen IV
	debilitate: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Usually goes first. Lowers target's Def, Sp. Def, Speed by 1.",
		isNonstandard: "Custom",
		name: "Debilitate",
		pp: 5,
		priority: 1,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Night Shade", target);
		},
		boosts: {
			def: -1,
			spd: -1,
			spe: -1,
		},
		target: "allAdjacentFoes",
		type: "Dark",
	},
	// TONE114
	desolationpulse: {
		accuracy: 90,
		basePower: 50,
		category: "Special",
		shortDesc: "Raises user's Sp. Atk, Sp. Def, Speed by 1 if this KOes the target.",
		name: "Desolation Pulse",
		pp: 5,
		priority: 0,
		isNonstandard: "Custom",
		flags: {pulse: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dark Pulse", source);
			this.add('-anim', source, "Origin Pulse", target);
		},
		onHit(target, pokemon) {
			pokemon.addVolatile('desolationpulse');
		},
		condition: {
			duration: 1,
			onAfterMoveSecondarySelf(pokemon, target, move) {
				if (!target || target.fainted || target.hp <= 0) this.boost({spa: 1, spd: 1, spe: 1}, pokemon, pokemon, move);
				pokemon.removeVolatile('desolationpulse');
			},
		},
		willCrit: true,
		target: "normal",
		type: "Water",
	},
	// Blast Chance
	doesntthisjustwin: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "User must be asleep. Uses two other known moves.",
		isNonstandard: "Custom",
		name: "Doesn't this just win?",
		pp: 5,
		noPPBoosts: true,
		priority: 0,
		flags: {},
		sleepUsable: true,
		onPrepareHit() {
			this.attrLastMove('[still]');
		},
		onTryHit(pokemon) {
			if (pokemon.status !== 'slp') return false;
		},
		onHit(pokemon) {
			for (let j = 0; j < 2; j++) {
				const moves = [];
				for (const move of pokemon.moves) {
					const noSleepTalk = ['assist', 'belch', 'bide', 'chatter', 'copycat', 'focuspunch', 'mefirst', 'metronome', 'mimic', 'mirrormove', 'naturepower', 'sketch', 'sleeptalk', 'uproar', 'doesntthisjustwin'];
					if (move && !(noSleepTalk.includes(move) || this.dex.moves.get(move).flags['charge'])) {
						moves.push(move);
					}
				}
				let randomMove = '';
				if (moves.length) randomMove = moves[this.random(moves.length)];
				if (!randomMove) {
					return false;
				}
				if (randomMove === "rest" && pokemon.hp < pokemon.maxhp) {
					pokemon.cureStatus();
				}
				this.actions.useMove(randomMove, pokemon);
			}
		},
		target: "self",
		type: "Psychic",
	},
	// galbia
	dog: {
		accuracy: 80,
		basePower: 120,
		category: "Physical",
		shortDesc: "Hits Ghosts. Can't miss in sand.",
		isNonstandard: "Custom",
		name: "(dog)",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onModifyMove(move) {
			if (this.field.isWeather('sandstorm')) move.accuracy = true;
		},
		ignoreImmunity: true,
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Outrage", target);
		},
		target: "normal",
		type: "Normal",
	},
	// anty
	doubleedgy: {
		accuracy: true,
		basePower: 90,
		category: "Physical",
		shortDesc: "This move does not check accuracy. Has 25% recoil.",
		isNonstandard: "Custom",
		name: "Double-Edgy",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		recoil: [1, 4],
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Brave Bird", target);
		},
		target: "normal",
		type: "Steel",
	},
	// Mizuhime
	doublelaser: {
		accuracy: 90,
		basePower: 75,
		category: "Special",
		shortDesc: "Hits 3 times. Each hit can miss.",
		isNonstandard: "Custom",
		name: "Double Laser",
		pp: 40,
		priority: 0,
		flags: {pulse: 1, protect: 1, mirror: 1},
		multihit: 2,
		multiaccuracy: true,
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Water Pulse", target);
		},
		target: "normal",
		type: "Water",
	},
	// Galom
	dragonslayer: {
		accuracy: 100,
		basePower: 110,
		category: "Physical",
		shortDesc: "Super effective on Dragon.",
		isNonstandard: "Custom",
		name: "Dragon Slayer",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Night Slash", target);
		},
		onEffectiveness(typeMod, target, type) {
			if (type === 'Dragon') return 1;
		},
		target: "normal",
		type: "Steel",
	},
	// Aelita
	energyfield: {
		accuracy: 90,
		basePower: 150,
		category: "Special",
		shortDesc: "40% chance to paralyze target. Can't miss in rain. Lowers user's Sp. Atk, Sp. Def, Speed.",
		isNonstandard: "Custom",
		name: "Energy Field",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onModifyMove(move) {
			if (this.field.isWeather(['raindance', 'primordialsea'])) {
				move.accuracy = true;
			} else if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				move.accuracy = 50;
			}
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Parabolic Charge", source);
			this.add('-anim', source, "Parabolic Charge", source);
			this.add('-anim', source, "Ion Deluge", target);
		},
		self: {boosts: {spa: -1, spd: -1, spe: -1}},
		secondary: {
			chance: 40,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
	},
	// Giagantic
	eternalashes: {
		accuracy: 85,
		basePower: 0,
		category: "Status",
		shortDesc: "Burns target. Reduces target's damage by 20%.",
		isNonstandard: "Custom",
		name: "Eternal Ashes",
		pp: 5,
		noPPBoosts: true,
		priority: 0,
		flags: {reflectable: 1, protect: 1, powder: 1, mirror: 1, defrost: 1},
		onTryImmunity(target) {
			return target.runStatusImmunity('powder');
		},
		onPrepareHit(target) {
			this.attrLastMove('[still]');
			this.add('-anim', target, "Spore", target);
		},
		onHit(target, source) {
			target.trySetStatus('brn');
			target.addVolatile('eternalashes', source);
		},
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Eternal Ashes', '[silent]');
				this.add('-message', 'Eternal Ashes will weaken the power of moves!');
			},
			onBasePowerPriority: 99,
			onBasePower() {
				this.add('-message', 'Eternal Ashes weakened the power of moves!');
				return this.chainModify(0.8);
			},
		},
		target: "normal",
		type: "Fire",
	},
	// MattL
	evaporatingsurge: {
		accuracy: 85,
		basePower: 110,
		category: "Physical",
		shortDesc: "Super effective on Water.",
		isNonstandard: "Custom",
		name: "Evaporating Surge",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onEffectiveness(typeMod, target, type) {
			if (type === 'Water') return 1;
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Bolt Strike", target);
		},
		target: "allAdjacentFoes",
		type: "Water",
	},
	// Juanma
	exception: {
		accuracy: true,
		basePower: 110,
		category: "Special",
		shortDesc: "66% chance to burn. Torments and confuses target. This move does not check accuracy.",
		isNonstandard: "Custom",
		name: "\\Exception",
		pp: 5,
		priority: 0,
		flags: {mirror: 1, authentic: true},
		onTryHit(target, source) {
			this.add('-message', "PHP Fatal error: Uncaught exception 'Exception' with message 'The requested file does not exists.' in \\your\\moms\\basement:1\nStack trace:\n#0 {main}\nthrown in \\your\\moms\\basement on line 1.");
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Moonlight", source);
			this.add('-anim', source, "Draco Meteor", target);
		},
		onHit(target, source) {
			target.addVolatile('torment');
			target.addVolatile('confusion');
		},
		secondary: {
			chance: 66,
			status: 'brn',
		},
		self: {boosts: {spe: -1}},
		target: "allAdjacentFoes",
		type: "Fire",
	},
	// Marshmallon
	excuse: {
		accuracy: 90,
		basePower: 0,
		category: "Status",
		shortDesc: "Nearly always goes first. Confuses and Taunts target.",
		isNonstandard: "Custom",
		name: "Excuse",
		pp: 5,
		noPPBoosts: true,
		priority: 2,
		flags: {protect: 1, reflectable: 1, mirror: 1, authentic: 1},
		onHit(pokemon) {
			pokemon.addVolatile('confusion');
			pokemon.addVolatile('taunt');
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Agility", source);
		},
		target: "normal",
		type: "Dark",
	},
	// Dirpz
	fairytypesong: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		overrideDefensiveStat: 'spd',
		shortDesc: "100% chance to confuse. Damages based on Sp. Def., not Defense.",
		isNonstandard: "Custom",
		name: "Fairy Type Song",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Fairy Lock", target);
			this.add('-anim', source, "Relic Song", target);
		},
		onHit(target, source) {
			if (this.toID(source.name) === 'dirpz') {
				this.add('c|+Dirpz|https://www.youtube.com/watch?v=9fGCVb6eS6A');
			}
		},
		secondary: {
			chance: 100,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Fairy",
	},
	// Feliburn
	falconpunch: {
		accuracy: 85,
		basePower: 150,
		category: "Physical",
		shortDesc: "Lowers the user's Attack, Defense and Sp. Def. by 1.",
		isNonstandard: "Custom",
		name: "Falcon Punch",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		onPrepareHit(target, source) {
			if (this.toID(source.name) === 'feliburn') {
				this.add('c|@Feliburn|FAALCOOOOOOON');
			}
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dynamic Punch", target);
		},
		onHit(target, source) {
			if (this.toID(source.name) === 'feliburn') {
				this.add('c|@Feliburn|PUUUUUNCH!!');
			}
		},
		self: {
			boosts: {
				atk: -1,
				def: -1,
				spd: -1,
			},
		},
		target: "normal",
		type: "Fire",
	},
	// Winry
	fighttothedeath: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Uses a random OKHO move.",
		isNonstandard: "Custom",
		name: "Fight to the Death",
		pp: 3,
		noPPBoosts: true,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit() {
			this.attrLastMove('[still]');
		},
		onHit(target, source) {
			this.actions.useMove(['Guillotine', 'Fissure', 'Sheer Cold', 'Horn Drill'][this.random(4)], source);
		},
		target: "normal",
		type: "Fighting",
	},
	// Sunfished
	flatjoke: {
		accuracy: 80,
		basePower: 0,
		category: "Status",
		isNonstandard: "Custom",
		shortDesc: "User and target are forced to switch and their replacements are Taunted.",
		name: "Flat Joke",
		pp: 20,
		priority: -9,
		flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, authentic: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Metal Sound", source);
		},
		onHit() {
			this.add('message', "......");
			this.add('message', "(sweatdrop)");
			this.add('message', "......");
		},
		forceSwitch: true,
		sideCondition: 'flatjoke',
		selfSwitch: true,
		self: {
			/// forceSwitch: true,
			sideCondition: 'flatjoke',
		},
		condition: {
			onSwitchIn(pokemon) {
				pokemon.side.removeSideCondition('flatjoke');
			},
			onResidual(pokemon) {
				if (pokemon.hp) pokemon.side.removeSideCondition('flatjoke');
			},
			onEnd(side) {
				if (side.active.length && side.active[0].hp) {
					side.active[0].addVolatile('taunt', side.active[0]);
				}
			},
		},
		target: "normal",
		type: "Dark",
	},
	// chaos
	forcewin: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Taunts, Embargoes, Torments, Confuses and Heal Blocks target.",
		isNonstandard: "Custom",
		name: "Forcewin",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Taunt", source);
		},
		onHit(pokemon) {
			pokemon.addVolatile('taunt');
			pokemon.addVolatile('embargo');
			pokemon.addVolatile('torment');
			pokemon.addVolatile('confusion');
			pokemon.addVolatile('healblock');
		},
		target: "normal",
		type: "Dark",
	},
	// Former Hope
	formerlyformer: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Swaps all stat changes with target. If user is KO'd, attacker also faints.",
		isNonstandard: "Custom",
		name: "Formerly Former",
		pp: 5,
		priority: 0,
		flags: {authentic: 1},
		onPrepareHit(target) {
			this.attrLastMove('[still]');
			this.add('-anim', target, "Grudge", target);
		},
		onHit(target, source) {
			const targetBoosts: SparseBoostsTable = {};
			const sourceBoosts: SparseBoostsTable = {};

			let i: BoostID;
			for (i in target.boosts) {
				targetBoosts[i] = target.boosts[i];
				sourceBoosts[i] = source.boosts[i];
			}

			target.setBoost(sourceBoosts);
			source.setBoost(targetBoosts);

			this.add('-swapboost', source, target, '[from] move: Heart Swap');
		},
		self: {
			volatileStatus: 'destinybond',
		},
		target: "normal",
		type: "Ghost",
	},
	// GoodMorningEspeon
	fridgeoff: {
		accuracy: 70,
		basePower: 120,
		category: "Special",
		overrideDefensiveStat: 'def',
		shortDesc: "30% chance to confuse. Damages based on Defense, not Sp. Def.",
		isNonstandard: "Custom",
		name: "FRIDGE OFF",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Avalanche", target);
		},
		secondary: {
			chance: 30,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Ice",
	},
	// bumbadadabum
	freesoftware: {
		accuracy: 95,
		basePower: 110,
		category: "Special",
		shortDesc: "30% chance to paralyze the target.",
		isNonstandard: "Custom",
		name: "Free Software",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {chance: 30, status: 'par'},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Electro Ball", source);
		},
		onHit(target, source) {
			if (source.name === 'bumbadadabum') {
				this.add('c|@bumbadadabum|I\'d just like to interject for a moment. What you\'re referring to as Linux, is in fact, GNU/Linux, or as I\'ve recently taken to calling it, GNU plus Linux. Linux is not an operating system unto itself, but rather another free component of a fully functioning GNU system made useful by the GNU corelibs, shell utilities and vital system components comprising a full OS as defined by POSIX.');
				this.add('c|@bumbadadabum|Many computer users run a modified version of the GNU system every day, without realizing it. Through a peculiar turn of events, the version of GNU which is widely used today is often called Linux, and many of its users are not aware that it is basically the GNU system, developed by the GNU Project.');
				this.add('c|@bumbadadabum|There really is a Linux, and these people are using it, but it is just a part of the system they use. Linux is the kernel: the program in the system that allocates the machine\'s resources to the other programs that you run. The kernel is an essential part of an operating system, but useless by itself; it can only function in the context of a complete operating system. Linux is normally used in combination with the GNU operating system: the whole system is basically GNU with Linux added, or GNU/Linux. All the so-called Linux distributions are really distributions of GNU/Linux!');
			}
		},
		target: "normal",
		type: "Electric",
	},
	// flying kebab
	frozenkebabskewers: {
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		shortDesc: "Combines Rock type effectiveness. Boosts user's Atk and Spe. 10% change to freeze.",
		isNonstandard: "Custom",
		name: "Frozen Kebab Skewers",
		pp: 5,
		noPPBoosts: true,
		priority: 1,
		flags: {authentic: 1, mirror: 1},
		multihit: 2,
		ignoreDefensive: true,
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Icicle Spear", target);
		},
		onAfterMoveSecondarySelf(source) {
			if (source.boosts['atk'] < 2) this.boost({atk: 1}, source, source);
			this.boost({spe: 1}, source, source);
		},
		onEffectiveness(typeMod, target, type) {
			return typeMod + this.dex.getEffectiveness('Rock', type);
		},
		secondary: {
			chance: 10,
			status: 'frz',
		},
		target: "normal",
		type: "Ice",
	},
	// biggie
	foodrush: {
		accuracy: 90,
		basePower: 75,
		category: "Physical",
		shortDesc: "Forces the target to switch to a random ally.",
		isNonstandard: "Custom",
		name: "Food Rush",
		pp: 5,
		noPPBoosts: true,
		priority: -6,
		flags: {contact: 1, protect: 1, mirror: 1},
		forceSwitch: true,
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Brave Bird", target);
		},
		self: {boosts: {evasion: -1}},
		target: "normal",
		type: "Normal",
	},
	// Imanalt
	freegenvbh: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Always calls Earthquake.",
		isNonstandard: "Custom",
		name: "FREE GENV BH",
		pp: 20,
		priority: 0,
		flags: {mirror: 1},
		onTryHit(target, source) {
			this.attrLastMove('[still]');
			this.actions.useMove('earthquake', source);
			return null;
		},
		target: "self",
		type: "Normal",
	},
	// Sigilyph
	gammarayburst: {
		accuracy: 90,
		basePower: 350,
		category: "Special",
		shortDesc: "Hits Dark types neutrally. Clears user and target side's hazards. User faints.",
		isNonstandard: "Custom",
		name: "Gamma Ray Burst",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		ignoreImmunity: {'Psychic': true},
		onPrepareHit(target, source) {
			if (this.toID(source.name) === 'sigilyph') {
				this.add('c|@Sigilyph|**SOOOOGOOOOLOOOOPH**');
			}
			this.attrLastMove('[still]');
			this.add('-anim', source, "Cosmic Power", source);
			this.add('-anim', source, "Explosion", source);
			this.add('-anim', source, "Light of Ruin", target);
		},
		onAfterMoveSecondarySelf(source, target) {
			const removeTarget = ['reflect', 'lightscreen', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'burnspikes', 'stealthrock', 'stickyweb'];
			const removeAll = ['spikes', 'toxicspikes', 'burnspikes', 'stealthrock', 'stickyweb'];
			for (const targetCondition of removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					if (!removeAll.includes(targetCondition)) continue;
					this.add('-sideend', target.side, this.dex.conditions.get(targetCondition).name, '[from] move: Defog', '[of] ' + target);
				}
			}
			for (const sideCondition of removeAll) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: Defog', '[of] ' + source);
				}
			}
		},
		selfdestruct: "always",
		target: "allAdjacentFoes",
		type: "Psychic",
	},
	// Joim
	gasterblaster: {
		accuracy: 100,
		basePower: 165,
		category: "Special",
		shortDesc: "Combines Ice type effectiveness. User cannot move next turn unless target faints.",
		isNonstandard: "Custom",
		name: "Gaster Blaster",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onEffectiveness(typeMod, target, type) {
			return typeMod + this.dex.getEffectiveness('Ice', type);
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Hyper Beam", target);
		},
		onAfterHit(target, source) {
			if (target.hp > 0) {
				source.addVolatile('mustrecharge');
			} else {
				this.add("c|~Joim|You are wearing the expression of someone who's fainted a few times. Let's make it one more.");
			}
		},
		target: "normal",
		type: "Electric",
	},
	// Scotteh
	geomagneticstorm: {
		accuracy: 100,
		basePower: 140,
		category: "Special",
		shortDesc: "No additional effect. Hits adjacent Pokemon.",
		isNonstandard: "Custom",
		name: "Geomagnetic Storm",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Discharge", target);
		},
		target: "allAdjacent",
		type: "Electric",
	},
	// xfix
	glitchdimension: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Hits 2-5 times in one turn. Picks a random move.",
		isNonstandard: "Custom",
		name: "(Glitch Dimension)",
		pp: 10,
		priority: 0,
		multihit: [2, 5],
		flags: {},
		onHit(target, source) {
			// The PP could be increased properly, instead of this silly hack,
			// but I like this hack, so it stays. It's intentionally buggy move, after all.
			const ppData = source.getMoveData('glitchdimension');
			if (ppData?.pp) {
				ppData.pp = Math.round(ppData.pp * 10 + this.random(3) + 5) / 10;
			}
			const moves = Object.keys(Moves);
			this.actions.useMove(moves[this.random(moves.length)], target);
		},
		onTryHit(target, source, effect) {
			if (!source.isActive) return null;
			// This easter egg shouldn't happen too often.
			// The values here are meaningful, but I will provide the exercise in
			// figuring them out to whoever reads the code. Don't want to spoil
			// the fun in that.
			if (this.random(722) === 66) {
				this.field.addPseudoWeather('glitchdimension', source, effect);
			}
		},
		condition: {
			duration: 5,
			onStart(target, source) {
				// Why do I make way too complex easter eggs that nobody will
				// notice? I don't know, but I did that in previous Super Staff
				// Bros., so let's continue with the tradition.
				const colors = [
					// CSS basic colors
					"black (is that even a color)", "silver", "gray", "white",
					"maroon", "red", "purple", "fuchsia", "green", "lime",
					"olive", "yellow", "navy", "blue", "teal", "aqua", "orange",
					// Pokemon Games
					"gold", "crystal", "ruby", "sapphire", "emerald", "diamond",
					"pearl", "platinum", "X", "Y",
					// PMD gummis (some don't make sense as colors, but whatever)
					"brown", "clear", "grass", "pink", "royal", "sky", "wander", "wonder",
					// Game Boy Color colors
					"strawberry", "grape", "kiwi", "dandelion", "atomic purple", "Pikachu & Pichu",
					// Game Boy Color palettes
					"dark brown", "pastel mix", "dark blue", "dark green", "reverse",
					// Why not?
					"shiny", "randomly", "'); DROP TABLE colors; --", "Ho-Oh", "blue screen",
				];
				const colorText = [];
				const times = this.random(3) + 1;
				for (let i = 0; i < times; i++) {
					const dice = this.random(colors.length);
					colorText.push(colors[dice]);
					colors.splice(dice, 1);
				}
				this.add('-message', "Ho-Oh is now colored " + colorText.join(" and ") + "! As well as every other \u3069\u25C0mon.");
			},
			onEffectiveness() {
				return this.random(3) - 1;
			},
			onEnd() {
				this.add('-message', "Ho-Oh is no longer colored!");
			},
		},
		target: "self",
		type: "Normal",
	},
	// Sonired
	godturn: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		shortDesc: "User switches out after damaging the target, passing stat changes and more.",
		isNonstandard: "Custom",
		name: "God Turn",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "U-turn", target);
		},
		onAfterMoveSecondarySelf(source) {
			this.actions.useMove('batonpass', source);
		},
		// selfSwitch: 'copyvolatile' does not work with targeted moves.
		target: "normal",
		type: "Bug",
	},
	// xShiba
	goindalikelinda: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Raises the user's Attack and Speed by 2.",
		isNonstandard: "Custom",
		name: "Go Inda Like Linda",
		pp: 30,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			spe: 2,
			atk: 2,
		},
		target: "self",
		type: "Flying",
	},
	// Hashtag
	gottagostrats: {
		accuracy: 90,
		basePower: 100,
		category: "Physical",
		shortDesc: "Raises user's Attack by 2 if this KOes the target.",
		isNonstandard: "Custom",
		name: "GOTTA GO STRATS",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Last Resort", target);
		},
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.boost({atk: 2}, pokemon, pokemon, move);
		},
		target: "normal",
		type: "Normal",
	},
	// pluviometer
	grammarhammer: {
		accuracy: 100,
		basePower: 104, // Pixilate
		category: "Special",
		shortDesc: "100% chance to burn the target.",
		isNonstandard: "Custom",
		name: "Grammar Hammer",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, defrost: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', target, "Fusion Flare", target);
		},
		secondary: {
			chance: 100,
			status: 'brn',
		},
		target: "normal",
		type: "Fairy",
	},
	// Lyto
	gravitystorm: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		shortDesc: "User is immune to Ground moves for 5 turns. Lowers user's accuracy and evasion by 1.",
		isNonstandard: "Custom",
		name: "Gravity Storm",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', target, "Ion Deluge", target);
			this.add('-anim', source, "Magnet Rise", source);
		},
		onHit(target, source) {
			if (!(source.volatiles['magnetrise'] || this.field.pseudoWeather['gravity'])) {
				source.addVolatile('magnetrise');
				this.boost({accuracy: -1, evasion: -1}, source, source);
			}
		},
		target: "normal",
		type: "Electric",
	},
	// Snowy
	hailwhitequeen: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Protects from attacks. Physical contact freezes team.",
		isNonstandard: "Custom",
		name: "Hail Whitequeen",
		pp: 5,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'hailwhitequeen',
		onTryHit(pokemon) {
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onPrepareHit() {
			this.attrLastMove('[still]');
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect'] || move.category === 'Status') return;
				this.add('-activate', target, 'Protect');
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (move.flags['contact'] && move.category === 'Physical') {
					for (const pokemon of source.side.pokemon) {
						if (pokemon.status === 'frz') return null;
					}
					source.trySetStatus('frz');
				}
				return null;
			},
		},
		target: "self",
		type: "Ice",
	},
	// nv
	hamsterdance: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Confuses and removes target's boosts.",
		isNonstandard: "Custom",
		name: "Hamster Dance",
		pp: 30,
		priority: 0,
		flags: {authentic: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dragon Dance", source);
		},
		onHit(target, source) {
			target.addVolatile('confusion', source);
			let reset = false;
			let boost: BoostID;
			for (boost in target.boosts) {
				if (target.boosts[boost] > 0) {
					target.boosts[boost] = 0;
					this.add('-setboost', target, boost, 0);
					reset = true;
				}
			}
			if (reset) this.add('message', 'Hamster Dance has reset stat changes!');
		},
		target: "normal",
		type: "Normal",
	},
	// Anttya
	hax: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Randomly chooses one of four effects.",
		isNonstandard: "Custom",
		name: "Hax",
		pp: 10,
		priority: 0,
		flags: {},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Agility", target);
		},
		onModifyMove(move) {
			const rand = this.random(10);
			if (rand < 1) {
				move.onHit = function (pokemon) {
					const damage = this.actions.getDamage(pokemon, pokemon, 40);
					if (typeof damage !== 'number') throw new Error("Confusion damage not dealt");
					this.damage(damage, pokemon, pokemon, {
						effectType: 'Move',
						type: '???',
					} as ActiveMove);
				};
			} else if (rand < 5) {
				move.boosts = {
					spa: 2,
					spd: 2,
					spe: 2,
				};
			} else {
				move.target = "normal";
				if (rand < 6) {
					move.onPrepareHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Fairy Lock", target);
					};
					move.onHit = function (target, source) {
						source.trySetStatus('par');
						source.addVolatile('confusion');
						target.trySetStatus('par');
						target.addVolatile('confusion');
					};
				} else {
					move.accuracy = 90;
					move.basePower = 60;
					move.category = "Special";
					move.flags = {protect: 1};
					move.willCrit = true;
					move.onPrepareHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Mist Ball", target);
					};
					move.secondary = {chance: 30, volatileStatus: 'flinch'};
				}
			}
		},
		target: "self",
		type: "Normal",
	},
	// Hippopotas
	hazardpass: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "User switches out after setting two different random hazards.",
		isNonstandard: "Custom",
		name: "Hazard Pass",
		pp: 20,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		selfSwitch: true,
		onHit(pokemon) {
			const hazards = ['stealthrock', 'spikes', 'toxicspikes', 'stickyweb'];
			pokemon.side.addSideCondition(hazards.splice(this.random(hazards.length), 1)[0]);
			pokemon.side.addSideCondition(hazards.splice(this.random(hazards.length), 1)[0]);
		},
		target: "normal",
		type: "Dark",
	},
	// qtrx
	hiddenpowernormal: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "If mega, trades with opponent or explodes. Otherwise hits 3-6 times with random hidden power.",
		isNonstandard: "Custom",
		name: "Hidden Power Normal",
		pp: 65,
		priority: 0,
		flags: {snatch: 1, authentic: 1},
		onModifyMove(move, source) {
			if (source.species.isMega) {
				(move as any).name = "SUPER GLITCH";
				if (this.p1.pokemon.filter(mon => !mon.fainted).length > 1 && this.p2.pokemon.filter(mon => !mon.fainted).length > 1) {
					source.addVolatile('hiddenpowernormal');
					move.forceSwitch = true;
					move.selfSwitch = true;
				}
			} else {
				(move as any).name = "KEYBOARD SMASH";
			}
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Fairy Lock", target);
			this.add('-anim', target, "Fairy Lock", target); // DRAMATIC FLASHING
		},
		onHit(target, source) {
			if (!source.species.isMega) {
				let gibberish = '';
				let hits = 0;
				const hps = ['hiddenpowerbug', 'hiddenpowerdark', 'hiddenpowerdragon', 'hiddenpowerelectric', 'hiddenpowerfighting', 'hiddenpowerfire', 'hiddenpowerflying', 'hiddenpowerghost', 'hiddenpowergrass', 'hiddenpowerground', 'hiddenpowerice', 'hiddenpowerpoison', 'hiddenpowerpsychic', 'hiddenpowerrock', 'hiddenpowersteel', 'hiddenpowerwater'];
				const hitcount = [3, 4, 4, 4, 4, 5, 5, 6, 6][this.random(9)];
				if (source.name === 'qtrx') this.add('c|@qtrx|/me slams face into keyboard!');
				source.m.isDuringAttack = true; // Prevents the user from being kicked out in the middle of using Hidden Powers.
				for (let i = 0; i < hitcount; i++) {
					if (target.hp !== 0) {
						const len = 16 + this.random(35);
						gibberish = '';
						for (let j = 0; j < len; j++) gibberish += String.fromCharCode(48 + this.random(79));
						this.add('-message', gibberish);
						this.actions.useMove(hps[this.random(16)], source, target);
						hits++;
					}
				}
				this.add('-message', 'Hit ' + hits + (hits === 1 ? ' time!' : ' times!'));
				source.m.isDuringAttack = false;
			} else if (source.volatiles['ingrain'] || target.volatiles['ingrain']) {
				// Avoid weirdness with trade prompts when trading is not possible
				source.removeVolatile('hiddenpowernormal');
				this.actions.useMove("perishsong", source, target);
			} else if (source.volatiles['hiddenpowernormal']) {
				target.m.swapping = true;
				source.m.swapping = true;
			} else {
				this.actions.useMove("explosion", source, target);
			}
		},
		condition: {
			duration: 1,
			onAfterMoveSecondarySelf(source, target) {
				if (source.m.swapping && target.m.swapping) {
					this.add("raw|<div class=\"broadcast-blue\"><b>" + source.side.name + " will trade " + source.name + " for " + target.side.name + "'s " + target.name + ".</b></div>");
					this.add('message', "Link standby... Please wait.");
				} else {
					this.add('message', "Trade cancelled.");
				}
			},
		},
		target: "normal",
		type: "Normal",
	},
	// SpecsMegaBeedrill
	highfive: {
		accuracy: 100,
		basePower: 30,
		category: "Special",
		shortDesc: "Hits 5 times in one turn.",
		isNonstandard: "Custom",
		name: "High Five",
		pp: 35,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		multihit: 5,
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Pin Missile", target);
		},
		target: "normal",
		type: "Bug",
	},
	// Albacore
	hitandrun: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		shortDesc: "User switches out after damaging the target. 100% chance to confuse the target.",
		isNonstandard: "Custom",
		name: "Hit-And-Run",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "U-turn", target);
		},
		selfSwitch: true,
		secondary: {
			chance: 100,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Psychic",
	},
	// Ciran
	hmu: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Prevents moves from affecting the user this turn. Frisks opponent.",
		isNonstandard: "Custom",
		name: "HMU",
		pp: 40,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'protect',
		onModifyMove(move) {
			(move as any).name = 'HMU (Hold My Unicorn)';
		},
		onPrepareHit(pokemon) {
			this.attrLastMove('[still]');
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
			for (const foe of pokemon.side.foe.active) {
				if (!foe || foe.fainted) continue;
				if (foe.item) {
					this.add('-item', foe, foe.getItem().name, '[from] ability: Frisk', '[of] ' + pokemon, '[identify]');
				}
			}
		},
		target: "self",
		type: "Fairy",
	},
	// E4 Flint
	holographicdragonstorm: {
		accuracy: 75,
		basePower: 150,
		category: "Special",
		shortDesc: "Lowers the user's Sp. Atk by 2. If user has 1/4 its max HP it puts it in a Substitute.",
		isNonstandard: "Custom",
		name: "Holographic Dragon Storm",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Night Shade", source);
			this.add('-anim', source, "Wish", source);
			this.add('-anim', source, "Draco Meteor", target);
		},
		onHit(target, source) {
			if (!source.volatiles['substitute'] && source.hp > source.maxhp / 4 && source.addVolatile('substitute', source)) {
				this.directDamage(source.maxhp / 4, source, source);
			}
		},
		self: {
			boosts: {
				spa: -2,
			},
		},
		target: "normal",
		type: "Dragon",
	},
	// urkerab
	holyorders: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Calls Heal Order, Defend Order and Attack Order.",
		isNonstandard: "Custom",
		name: "Holy Orders",
		pp: 10,
		priority: 0,
		flags: {},
		onPrepareHit() {
			this.attrLastMove('[still]');
		},
		onHit(target, source) {
			this.actions.useMove("healorder", source);
			this.actions.useMove("defendorder", source);
			this.actions.useMove("attackorder", source);
		},
		target: "self",
		type: "Fighting",
	},
	// Clefairy
	hyperspaceearrape: {
		accuracy: true,
		basePower: 140,
		category: "Special",
		shortDesc: "This move does not check accuracy. Lowers user's Defense, Sp. Atk. and Sp. Def. by 1.",
		isNonstandard: "Custom",
		name: "Hyperspace Earrape",
		pp: 5,
		priority: 0,
		flags: {mirror: 1, authentic: 1, sound: 1},
		breaksProtect: true,
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Cosmic Power", source);
			this.add('-anim', source, "Boomburst", target);
		},
		self: {
			boosts: {
				def: -1,
				spa: -1,
				spd: -1,
			},
		},
		target: "normal",
		type: "Dark",
	},
	// ih8ih8sn0w
	imprisonform: {
		accuracy: 85,
		basePower: 0,
		category: "Status",
		shortDesc: "Transforms the user into their opponent and Imprisons them.",
		isNonstandard: "Custom",
		name: "Imprisonform",
		pp: 3,
		noPPBoosts: true,
		priority: 0,
		flags: {},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Heal Block", source);
			this.add('-anim', target, "Heal Block", target);
		},
		onHit(target, source) {
			if (!source.transformInto(target)) {
				return false;
			}
		},
		self: {volatileStatus: 'Imprison'},
		target: "normal",
		type: "Dark",
	},
	// talkingtree
	iwantyouback: {
		accuracy: 100,
		basePower: 96,
		category: "Physical",
		shortDesc: "User recovers 75% of the damage dealt. Sets Stealth Rock.",
		isNonstandard: "Custom",
		name: "I Want You Back",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, heal: 1},
		sideCondition: 'stealthrock',
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Smack Down", target);
		},
		drain: [3, 4],
		target: "normal",
		type: "Rock",
	},
	// sirDonovan
	ladiesfirst: {
		accuracy: 100,
		basePower: 120,
		category: 'Special',
		shortDesc: "100% chance to raise the user's Speed by 1. Always moves last if the target is female.",
		isNonstandard: "Custom",
		name: 'Ladies First',
		pp: 20,
		priority: 0,
		flags: {protect: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Sing", target);
		},
		onHit(target, pokemon) {
			const decision = this.queue.willMove(pokemon);
			if (decision && target.gender === 'F') {
				this.queue.cancelMove(pokemon);
				this.queue.unshift(decision);
				this.add('-activate', pokemon, 'move: Ladies First');
			}
		},
		self: {boosts: {spe: 1}},
		target: 'normal',
		type: 'Fairy',
	},
	// Rekeri
	landbeforetime: {
		accuracy: 90,
		basePower: 125,
		category: "Physical",
		shortDesc: "35% chance to flinch the target.",
		isNonstandard: "Custom",
		name: "Land Before Time",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {chance: 35, volatileStatus: 'flinch'},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Precipice Blades", target);
		},
		target: "normal",
		type: "Rock",
	},
	// Crestfall
	lightofunruin: {
		accuracy: 85,
		basePower: 110,
		category: "Special",
		shortDesc: "User recovers 50% of the damage dealt. Lowers user's defenses.",
		isNonstandard: "Custom",
		name: "Light of Unruin",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		drain: [1, 2],
		self: {boosts: {def: -1, spd: -1}},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Light Of Ruin", target);
		},
		target: "normal",
		type: "Fairy",
	},
	// scpinion
	lolroom: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Swaps user's Sp. Atk. and Sp. Def. stats. For 5 turns, slower Pokemon move first.",
		isNonstandard: "Custom",
		name: "LOL! Room",
		pp: 5,
		priority: 0,
		flags: {mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Agility", target);
		},
		onHit(target, source, effect) {
			if (this.field.pseudoWeather['trickroom']) {
				this.field.removePseudoWeather('trickroom');
			} else {
				this.field.addPseudoWeather('trickroom', source, effect);
			}
		},
		volatileStatus: 'lolroom',
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'LOL! Room');
				const newatk = pokemon.storedStats.spd;
				const newdef = pokemon.storedStats.spa;
				pokemon.storedStats.spa = newatk;
				pokemon.storedStats.spd = newdef;
			},
			onCopy(pokemon) {
				this.add('-start', pokemon, 'LOL! Room');
				const newatk = pokemon.storedStats.spd;
				const newdef = pokemon.storedStats.spa;
				pokemon.storedStats.spa = newatk;
				pokemon.storedStats.spd = newdef;
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'LOL! Room');
				const newatk = pokemon.storedStats.spd;
				const newdef = pokemon.storedStats.spa;
				pokemon.storedStats.spa = newatk;
				pokemon.storedStats.spd = newdef;
			},
			onRestart(pokemon) {
				pokemon.removeVolatile('LOL! Room');
			},
		},
		target: "self",
		type: "Psychic",
	},
	// Kalalokki
	maelstrm: {
		accuracy: 85,
		basePower: 100,
		category: "Special",
		shortDesc: "Traps and damages the target for 5-7 turns.",
		isNonstandard: "Custom",
		name: "Maelström",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Surf", target);
			this.add('-anim', source, "Dark Void", target);
		},
		onHit(target, source) {
			target.addVolatile('maelstrm', source);
		},
		condition: {
			duration: 5,
			durationCallback(target, source) {
				if (source.hasItem('gripclaw')) return 8;
				return this.random(5, 7);
			},
			onStart() {
				this.add('message', 'It became trapped in an enormous maelström!');
			},
			onResidualOrder: 11,
			onResidual(pokemon) {
				if (this.effectState.source.hasItem('bindingband')) {
					this.damage(pokemon.maxhp / 6);
				} else {
					this.damage(pokemon.maxhp / 8);
				}
			},
			onEnd() {
				this.add('message', 'The maelström dissipated.');
			},
			onTrapPokemon(pokemon) {
				pokemon.tryTrap();
			},
		},
		target: "normal",
		type: "Water",
	},
	// Jetpack
	malicioushypnosis: {
		accuracy: 90,
		basePower: 100,
		category: "Special",
		shortDesc: "40% chance to put the target to sleep.",
		isNonstandard: "Custom",
		name: "Malicious Hypnosis",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Hypnosis", target);
		},
		secondary: {
			chance: 40,
			status: 'slp',
		},
		target: "normal",
		type: "Psychic",
	},
	// Omega-Xis
	memecannon: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		shortDesc: "The user's Ability becomes Flash Fire.",
		isNonstandard: "Custom",
		name: "Meme Cannon",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTry(pokemon) {
			if (pokemon.activeMoveActions > 1) {
				this.add('c|+Omega-Xis|good shit go౦ԁ sHit thats ✔ some goodshit rightthere right✔there ✔✔if i do ƽaү so my self i say so thats what im talking about right there right there (chorus: ʳᶦᵍʰᵗ ᵗʰᵉʳᵉ) mMMMMᎷМ НO0ОଠOOOOOОଠଠOoooᵒᵒᵒᵒᵒᵒᵒᵒᵒ Good shit');
			} else {
				this.add('c|+Omega-Xis|Jet fuel can’t melt steel beams.');
			}
		},
		onTryHit(target, source) {
			const oldAbility = source.setAbility('flashfire');
			if (oldAbility) {
				this.add('-ability', source, source.getAbility().name, '[from] move: Meme Cannon', '[of] ' + target);
			}
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Flash Cannon", target);
		},
		target: "normal",
		type: "Steel",
	},
	// Hollywood
	mememime: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Raises all the user's stats by 1 (not evasion).",
		isNonstandard: "Custom",
		name: "Meme Mime",
		pp: 5,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			atk: 1,
			def: 1,
			spa: 1,
			spd: 1,
			spe: 1,
			accuracy: 1,
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Geomancy", target);
		},
		target: "self",
		type: "Psychic",
	},
	// Spy
	mineralpulse: {
		accuracy: 100,
		basePower: 95,
		category: "Special",
		shortDesc: "20% chance to confuse the target.",
		isNonstandard: "Custom",
		name: "Mineral Pulse",
		pp: 20,
		priority: 0,
		flags: {protect: 1, pulse: 1, mirror: 1, distance: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Flash Cannon", target);
		},
		secondary: {
			chance: 20,
			volatileStatus: 'confusion',
		},
		target: "any",
		type: "Steel",
	},
	// Death on Wings
	monoflying: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "For 5 turns, all Pokemon become Flying type. Clears user and target side's hazards.",
		isNonstandard: "Custom",
		name: "Mono Flying",
		pp: 20,
		priority: 0,
		flags: {mirror: 1, gravity: 1},
		onHit(target, source) {
			if (this.field.pseudoWeather['monoflying']) {
				this.field.removePseudoWeather('monoflying');
			} else {
				this.field.addPseudoWeather('monoflying', source);
			}
			const removeTarget = ['reflect', 'lightscreen', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'burnspikes', 'stealthrock', 'stickyweb'];
			const removeAll = ['spikes', 'toxicspikes', 'burnspikes', 'stealthrock', 'stickyweb'];
			for (const targetCondition of removeTarget) {
				const foe = source.side.foe;
				if (foe.removeSideCondition(targetCondition)) {
					if (!removeAll.includes(targetCondition)) continue;
					this.add('-sideend', foe, this.dex.conditions.get(targetCondition).name, '[from] move: Defog', '[of] ' + foe.active[0]);
				}
			}
			for (const sideCondition of removeAll) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: Defog', '[of] ' + source);
				}
			}
		},
		condition: {
			duration: 5,
			onStart() {
				this.add('message', 'All active Pokemon became pure Flying-type!');
				for (const side of this.sides) {
					for (const pokemon of side.active) {
						if ((pokemon.types[0] === 'Flying' && !pokemon.types[1]) || !pokemon.hp) continue;
						pokemon.setType('Flying');
						this.add('-start', pokemon, 'typechange', 'Flying');
					}
				}
			},
			onResidualOrder: 90,
			onUpdate(pokemon) {
				if ((pokemon.types[0] === 'Flying' && !pokemon.types[1]) || !pokemon.hp) return;
				pokemon.setType('Flying');
				this.add('-start', pokemon, 'typechange', 'Flying');
			},
			onSwitchIn(pokemon) {
				if ((pokemon.types[0] === 'Flying' && !pokemon.types[1]) || !pokemon.hp) return;
				pokemon.setType('Flying');
				this.add('-start', pokemon, 'typechange', 'Flying');
			},
			onEnd() {
				this.add('message', 'Active Pokemon are no longer forced to be pure Flying-type.');
				for (const side of this.sides) {
					for (const pokemon of side.active) {
						if ((pokemon.species.types[0] === 'Flying' && !pokemon.species.types[1]) || !pokemon.hp) continue;
						pokemon.setType(pokemon.species.types);
						this.add('-end', pokemon, 'typechange');
					}
				}
			},
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Defog", source);
		},
		target: "self",
		type: "Flying",
	},
	// gangnam style
	motherfathergentleman: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		shortDesc: "Hits 3 times.",
		isNonstandard: "Custom",
		name: "Mother, Father, Gentleman",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		multihit: 3,
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Agility", source);
			this.add('-anim', source, "Sky Drop", source);
		},
		target: "normal",
		type: "Dark",
	},
	// Overneat
	neattokick: {
		accuracy: 90,
		basePower: 130,
		category: "Physical",
		shortDesc: "50% chance to paralyze the target.",
		isNonstandard: "Custom",
		name: "Neatto Kick",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, gravity: 1},
		hasCrashDamage: true,
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "High Jump Kick", target);
		},
		onMoveFail(target, source) {
			this.damage(source.maxhp / 2, source, source, this.dex.getActiveMove('highjumpkick'));
		},
		secondary: {
			chance: 50,
			status: 'par',
		},
		target: "normal",
		type: "Fighting",
	},
	// Acast
	needsmorescreens: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Bounces back certain non-damaging moves. For 5 turns, protects user's party.",
		isNonstandard: "Custom",
		name: "Needs More Screens",
		pp: 5,
		noPPBoosts: true,
		priority: 0,
		self: {volatileStatus: 'magiccoat'},
		flags: {},
		onPrepareHit() {
			this.attrLastMove('[still]');
		},
		onHit(target, source) {
			source.side.addSideCondition('reflect', source);
			if (this.random(2) === 1) source.side.addSideCondition('lightscreen', source);
			if (this.random(2) === 1) source.side.addSideCondition('safeguard', source);
		},
		target: "self",
		type: "Normal",
	},
	// Level 51
	nextlevelstrats: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Raises the user's Speed by 1 and advances 40 levels (does not affect stats).",
		isNonstandard: "Custom",
		name: "Next Level Strats",
		pp: 25,
		priority: 0,
		flags: {protect: 1, mirror: 1, snatch: 1},
		boosts: {spe: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Follow Me", target);
		},
		onHit(pokemon) {
			if (pokemon.level < 300) {
				pokemon.level += 40;
				this.add('-message', pokemon.name + ' advanced 40 levels! It is now level ' + pokemon.level + '!');
			}
		},
		target: "self",
		type: "Normal",
	},
	// Golui
	notfriezaenough: {
		accuracy: 100,
		basePower: 120,
		category: "Special",
		shortDesc: "10% chance to freeze. Super effective on Water. For 5 turns, Hail crashes down. Lowers user's Sp. Atk. and Sp. Def.",
		isNonstandard: "Custom",
		name: "Not Frieza Enough",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onEffectiveness(typeMod, target, type) {
			if (type === 'Water') return 1;
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Sheer Cold", target);
		},
		onHit() {
			this.field.setWeather('Hail');
		},
		secondary: {
			chance: 10,
			status: 'frz',
		},
		self: {
			boosts: {
				spa: -1,
				spd: -1,
			},
		},
		target: "normal",
		type: "Ice",
	},
	// McMeghan
	oddpunch: {
		accuracy: 100,
		basePower: 50,
		shortDesc: "Usually goes first. 70% chance to paralyze the target. 40% flinch chance.",
		category: "Physical",
		isNonstandard: "Custom",
		name: "Odd Punch",
		pp: 15,
		priority: 1,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Bullet Punch", target);
		},
		secondary: {
			chance: 100,
			onHit(target, source) {
				if (this.random(10) < 7) target.trySetStatus('par');
				if (this.random(10) < 4) target.addVolatile('flinch', source);
			},
		},
		target: "normal",
		type: "Fighting",
	},
	// uselesstrainer
	ofcurse: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "This move does not check accuracy. Combines Memento, Lunar Dance and Mean Look.",
		isNonstandard: "Custom",
		name: "Of Curse",
		pp: 40,
		priority: 0,
		flags: {authentic: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			if (!this.canSwitch(source.side)) {
				/// delete move.selfdestruct;
				return false;
			}
			this.add('-anim', source, "Torment", source);
			this.add('-anim', source, "Grudge", source);
			this.add('-anim', source, "Explosion", source);
		},
		self: {slotCondition: 'ofcurse'},
		condition: {
			duration: 2,
			onStart(pokemon) {
				pokemon.side.addSlotCondition(pokemon, 'lunardance');
			},
			onSwitchIn(pokemon) {
				pokemon.side.removeSlotCondition(pokemon, 'ofcurse');
			},
			onEnd(pokemon) {
				const active = pokemon.side.active;
				const foes = pokemon.side.foe.active;
				if (active.length && active[0].hp && foes.length && foes[0].hp) {
					foes[0].addVolatile('trapped', active[0], this.dex.conditions.get('meanlook'), 'trapper');
				}
			},
		},
		boosts: {
			atk: -2,
			spa: -2,
		},
		selfdestruct: "ifHit",
		target: "normal",
		type: "Ghost",
	},
	// starry
	oh: {
		accuracy: 100,
		basePower: 0,
		damage: 'level',
		category: "Physical",
		shortDesc: "Does damage equal to the user's level. Boosts user's speed by 2. Lowers target's attacks by 1.",
		isNonstandard: "Custom",
		name: "oh",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		boosts: {atk: -1, spa: -1},
		self: {boosts: {spe: 2}},
		target: "normal",
		type: "Dark",
	},
	// ajhockeystar
	ohcanada: {
		accuracy: 55,
		basePower: 0,
		category: "Status",
		shortDesc: "Freezes the target. Lowers the user's speed by 2 if successful, 1 if not.",
		isNonstandard: "Custom",
		name: "OH CANADA",
		pp: 35,
		priority: 0,
		flags: {reflectable: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Icy Wind", target);
			this.add('-anim', source, "Haze", source);
		},
		onHit(target, source) {
			if (target.setStatus('frz')) {
				this.add('-message', source.name + " has become trapped in sticky maple syrup!");
				this.boost({spe: -2}, source, source);
			}
		},
		onMoveFail(target, source) {
			this.add('-message', source.name + " has become trapped in sticky maple syrup!");
			this.boost({spe: -1}, source, source);
		},
		target: 'normal',
		type: "Ice",
	},
	// Andy (AndrewGoncel)
	pilfer: {
		accuracy: true,
		basePower: 70,
		category: "Physical",
		shortDesc: "User steals support moves to use itself, then attacks. Fails if target is attacking.",
		isNonstandard: "Custom",
		name: "Pilfer",
		pp: 15,
		priority: 1,
		flags: {protect: 1, authentic: 1},
		onTryHit(target, pokemon) {
			const decision = this.queue.willMove(target);
			if (decision) {
				const move = this.dex.getActiveMove(decision.move.id);
				if (move.category === 'Status' && move.id !== 'mefirst') {
					this.actions.useMove(move, pokemon);
					this.attrLastMove('[still]');
					this.add('-anim', pokemon, "Night Slash", target);
					return;
				}
			}
			return false;
		},
		pressureTarget: "foeSide",
		target: "normal",
		type: "Dark",
	},
	// sparktrain
	pillfrenzy: {
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		shortDesc: "Hits 3-5 times. Boosts user's speed by 1 and lowers user's evasion by 1 with each hit.",
		isNonstandard: "Custom",
		name: "Pill Frenzy",
		pp: 30,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Spike Cannon", target);
		},
		multihit: [3, 5],
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spe: 1,
					evasion: -1,
				},
			},
		},
		target: "normal",
		type: "Water",
	},
	// Layell
	pixelprotection: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Protects from moves. Fails if used twice without switching. Raises user's Def. by 4 and Sp. Def. by 2.",
		isNonstandard: "Custom",
		name: "Pixel Protection",
		pp: 10,
		priority: 4,
		flags: {},
		volatileStatus: 'pixelprotection',
		condition: {
			onStart(pokemon) {
				pokemon.addVolatile('protect');
			},
		},
		onPrepareHit(pokemon) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Moonblast", pokemon);
			return !!this.queue.willAct();
		},
		onTry(pokemon) {
			if (pokemon.volatiles['pixelprotection']) {
				this.add('-fail', pokemon);
				this.add('-hint', "Pixel Protection only works once per outing.");
				return null;
			}
		},
		boosts: {
			def: 4,
			spd: 2,
		},
		target: "self",
		type: "Normal",
	},
	// Megazard
	playdead: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Target's moves all become Ghost-type.",
		isNonstandard: "Custom",
		name: "Play Dead",
		pp: 25,
		priority: -3,
		flags: {},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Grudge", target);
		},
		volatileStatus: 'playdead',
		condition: {
			duration: 3,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Play Dead');
				this.add('message', 'Playing Dead causes its moves to all turn into Ghost-type!');
			},
			onModifyMove(move) {
				if (move.id !== 'struggle') {
					move.type = 'Ghost';
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Play Dead');
			},
		},
		target: "normal",
		type: "Fairy",
	},
	// AM
	predator: {
		accuracy: 100,
		basePower: 40,
		basePowerCallback(pokemon, target) {
			if (target.beingCalledBack) {
				return 120;
			}
			return 60;
		},
		category: "Physical",
		shortDesc: "Power doubles if a foe is switching out. Lowers user's attacks by 1 and accuracy by 2.",
		isNonstandard: "Custom",
		name: "Predator",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		boosts: {atk: -1, spa: -1, accuracy: -2},
		beforeTurnCallback(pokemon, target) {
			target.side.addSideCondition('predator', pokemon);
			if (!target.side.sideConditions['predator'].sources) {
				target.side.sideConditions['predator'].sources = [];
			}
			target.side.sideConditions['predator'].sources.push(pokemon);
		},
		onModifyMove(move, source, target) {
			if (target?.beingCalledBack) move.accuracy = true;
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Pursuit", target);
		},
		onTryHit(target, pokemon) {
			target.side.removeSideCondition('predator');
		},
		condition: {
			duration: 1,
			onBeforeSwitchOut(pokemon) {
				this.debug('Pursuit start');
				this.add('-activate', pokemon, 'move: Pursuit');
				for (const source of this.effectState.sources) {
					if (source.moveThisTurn || source.fainted) continue;
					this.queue.cancelMove(source);
					// Run through each decision in queue to check if the Pursuit user is supposed to Mega Evolve this turn.
					// If it is, then Mega Evolve before moving.
					if (source.canMegaEvo) {
						for (const [j, action] of this.queue.entries()) {
							if (action.pokemon === source && action.choice === 'megaEvo') {
								this.actions.runMegaEvo(source);
								this.queue.list.splice(j, 1);
								break;
							}
						}
					}
					this.actions.runMove('predator', source, pokemon.getLocOf(source));
				}
			},
		},
		target: "normal",
		type: "Dark",
	},
	// Blitzamirin
	pneumarelinquish: {
		accuracy: 100,
		basePower: 0,
		damageCallback(source, target) {
			return target.hp / 2;
		},
		category: "Special",
		shortDesc: "Does damage equal to 1/2 target's current HP. User recovers 50% of the damage dealt. Nullifies the target's Ability.",
		isNonstandard: "Custom",
		name: "Pneuma Relinquish",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, heal: 1},
		drain: [3, 4],
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Roar of Time", target);
		},
		secondary: {
			chance: 100,
			volatileStatus: 'gastroacid',
		},
		target: "normal",
		type: "Ghost",
	},
	// Antemortem
	postmortem: {
		accuracy: 85,
		basePower: 110,
		category: "Special",
		shortDesc: "50% chance to boost the user's Sp. Atk. and Speed by 1.",
		isNonstandard: "Custom",
		name: "Postmortem",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, heal: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Moonblast", target);
		},
		secondary: {chance: 50, self: {boosts: {spa: 1, spe: 1}}},
		target: "normal",
		type: "Fairy",
	},
	// rssp1
	praiserufflets: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Protects from moves. First turn out only. Boosts user's Atk. and Def. by 2.",
		isNonstandard: "Custom",
		name: "Praise Rufflets",
		pp: 40,
		priority: 4,
		flags: {},
		volatileStatus: 'praiserufflets',
		condition: {
			onStart(pokemon) {
				pokemon.addVolatile('protect');
			},
		},
		onPrepareHit(pokemon) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Growth", pokemon);
			return !!this.queue.willAct();
		},
		onTry(pokemon) {
			if (pokemon.volatiles['praiserufflets']) {
				this.add('-fail', pokemon);
				this.add('-hint', "Praise Rufflets only works once per outing.");
				return null;
			}
		},
		boosts: {
			atk: 2,
			def: 2,
		},
		target: "self",
		type: "Flying",
	},
	// Haund
	psychokinesis: {
		accuracy: 100,
		basePower: 120,
		category: "Special",
		shortDesc: "Steals target's boosts after dealing damage.",
		isNonstandard: "Custom",
		name: "Psychokinesis",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Aura Sphere", target);
		},
		secondary: {
			chance: 100,
			onHit(target, source) {
				let stolen = false;
				let boost: BoostID;
				for (boost in target.boosts) {
					if (target.boosts[boost] > 0) {
						stolen = true;
						source.boosts[boost] += target.boosts[boost];
						if (source.boosts[boost] > 6) source.boosts[boost] = 6;
						target.boosts[boost] = 0;
						this.add('-setboost', source, boost, source.boosts[boost]);
						this.add('-setboost', target, boost, target.boosts[boost]);
					}
				}
				if (stolen) {
					this.add('-message', "Boosts were psychokinetically stolen!");
				}
			},
		},
		target: "normal",
		type: "Fighting",
	},
	// Zero Lux Given
	punray: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		shortDesc: "100% chance to confuse the target.",
		isNonstandard: "Custom",
		name: "Pun Ray",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1, distance: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Freeze Shock", target);
		},
		secondary: {
			chance: 100,
			volatileStatus: 'confusion',
		},
		target: "any",
		type: "Flying",
	},
	// Pikachuun
	pureskill: {
		accuracy: true,
		basePower: 0,
		category: "Special",
		shortDesc: "This move does not check accuracy. Randomly chooses from three effects.",
		isNonstandard: "Custom",
		name: "Pure Skill",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onModifyMove(move) {
			move.type = "???";
			const rand = this.random(20);
			if (rand < 10) {
				move.damageCallback = function (source, target) {
					return Math.max(target.hp / 2, target.maxhp / 4);
				};
			} else if (rand < 12) {
				move.onHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Explosion", target);
					this.damage(source.maxhp, source, source);
					if (this.toID(source.name) === 'pikachuun') {
						this.add('c|+Pikachuun|i\'ve been outskilled');
					}
					return true;
				};
			} else {
				move.basePower = 255;
				move.self = {boosts: {spa: -1, accuracy: -1}};
			}
		},
		target: "normal",
		type: "Normal",
	},
	// Raseri
	purifysoul: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Heals the user by 1/3 of its max HP. Boosts the user's Sp. Atk. and Sp. Def. by 1.",
		isNonstandard: "Custom",
		name: "Purify Soul",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		heal: [1, 3],
		boosts: {spa: 1, spd: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dazzling Gleam", source);
		},
		target: "self",
		type: "Normal",
	},
	// Duck
	quattack: {
		accuracy: 95,
		basePower: 95,
		category: "Physical",
		shortDesc: "Usually goes first. High critical hit ratio.",
		isNonstandard: "Custom",
		name: "QUAttaCK",
		pp: 5,
		priority: 1,
		critRatio: 2,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Quick Attack", target);
		},
		target: "normal",
		type: "Normal",
	},
	// Innovamania
	ragequit: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "The user faints.",
		isNonstandard: "Custom",
		name: "Rage Quit",
		pp: 40,
		priority: 0,
		flags: {gravity: 1},
		onHit(pokemon) {
			pokemon.faint();
		},
		target: "self",
		type: "Normal",
	},
	// DMT
	reallybigswordsdance: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Raises the user's Attack by 4.",
		isNonstandard: "Custom",
		name: "Really Big Swords Dance",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		boosts: {atk: 4},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Growth", source);
			this.add('-anim', source, "Swords Dance", source);
			this.add('-anim', source, "Swords Dance", source);
		},
		target: "self",
		type: "Normal",
	},
	// Zarel
	relicsongdance: {
		accuracy: 100,
		basePower: 60,
		multihit: 2,
		category: "Special",
		shortDesc: "Hits 2 times. Second hit is as Meloette-Pirouette using a Physical Fighting move.",
		isNonstandard: "Custom",
		name: "Relic Song Dance",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		/// negateSecondary: true,
		ignoreImmunity: true,
		onTryHit(target, pokemon) {
			this.attrLastMove('[still]');
			const move = pokemon.species.id === 'meloettapirouette' ? 'Brick Break' : 'Relic Song';
			this.add('-anim', pokemon, move, target);
		},
		onHit(target, pokemon, move) {
			if (pokemon.species.id === 'meloettapirouette') {
				pokemon.formeChange('Meloetta', this.effect, false, '[msg]');
			} else {
				pokemon.formeChange('Meloetta-Pirouette', this.effect, false, '[msg]');
				// Modifying the move outside of the ModifyMove event? BLASPHEMY
				move.category = 'Physical';
				move.type = 'Fighting';
			}
		},
		onAfterMove(pokemon) {
			// Ensure Meloetta goes back to standard form after using the move
			if (pokemon.species.id === 'meloettapirouette') {
				pokemon.formeChange('Meloetta', this.effect, false, '[msg]');
			}
		},
		condition: {
			duration: 1,
			onAfterMoveSecondarySelf(pokemon, target, move) {
				if (pokemon.species.id === 'meloettapirouette') {
					pokemon.formeChange('Meloetta', this.effect, false, '[msg]');
				} else {
					pokemon.formeChange('Meloetta-Pirouette', this.effect, false, '[msg]');
				}
				pokemon.removeVolatile('relicsong');
			},
		},
		target: "allAdjacentFoes",
		type: "Psychic",
	},
	// Quite Quiet
	retreat: {
		accuracy: 100,
		basePower: 55,
		category: "Special",
		shortDesc: "User switches out after damaging the target. This move is always super-effective.",
		isNonstandard: "Custom",
		name: "Retreat",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onEffectiveness() {
			return 1;
		},
		selfSwitch: true,
		ignoreImmunity: true,
		target: "normal",
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Volt Switch", target);
		},
		type: "Electric",
	},
	// Jasmine
	reversetransform: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Target copies user's stats, moves, types, and Ability.",
		isNonstandard: "Custom",
		name: "Reverse Transform",
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		flags: {protect: 1, mirror: 1, authentic: 1},
		onHit(target, source) {
			if (!target.transformInto(source)) {
				return false;
			}
			target.canMegaEvo = null;
		},
		target: "normal",
		type: "Normal",
	},
	// macle
	ribbit: {
		accuracy: true,
		basePower: 90,
		category: "Physical",
		shortDesc: "The target's Ability becomes Soundproof.",
		isNonstandard: "Custom",
		name: "Ribbit",
		pp: 40,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Boomburst", target);
			if (source.name === 'macle') {
				this.add("c|+macle|Follow the Frog Blog - https://gonefroggin.wordpress.com/");
			}
		},
		secondary: {
			chance: 100,
			onHit(pokemon) {
				const oldAbility = pokemon.setAbility('soundproof');
				if (oldAbility) {
					this.add('-endability', pokemon, oldAbility, '[from] move: Ribbit');
					this.add('-ability', pokemon, 'Soundproof', '[from] move: Ribbit');
					return;
				}
			},
		},
		target: "normal",
		type: "Water",
	},
	// Starmei
	rkoouttanowhere: {
		accuracy: 100,
		basePower: 0,
		damageCallback(pokemon) {
			return (this.random(50, 151) * pokemon.level) / 100;
		},
		category: "Special",
		shortDesc: "Random damage equal to 0.5x-1.5x user's level.",
		isNonstandard: "Custom",
		name: "RKO Outta Nowhere",
		pp: 35,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Surf", target);
		},
		target: "normal",
		type: "Water",
	},
	// Trickster
	sacredspearexplosion: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		shortDesc: "Combines Steel in its type effectiveness. 30% chance to burn adjacent foes.",
		isNonstandard: "Custom",
		name: "Sacred Spear Explosion",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Megahorn", target);
			this.add('-anim', target, "Explosion", source);
			// Resets sprite after explosion
			this.add('-formechange', target, target.species.name, '');
		},
		onEffectiveness(typeMod, target, type) {
			return typeMod + this.dex.getEffectiveness('Steel', type);
		},
		secondary: {chance: 30, status: 'brn'},
		target: "allAdjacentFoes",
		type: "Fairy",
	},
	// Halite
	saltstorm: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		shortDesc: "User switches out. Replacement gets Magic Guard for 2 turns and crit rate +2.",
		isNonstandard: "Custom",
		name: "Saltstorm",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Icy Wind", target);
		},
		selfSwitch: true,
		self: {sideCondition: 'saltstorm'},
		condition: {
			onSwitchIn(pokemon) {
				pokemon.side.removeSideCondition('saltstorm');
			},
			onResidual(pokemon) {
				if (pokemon.hp) pokemon.side.removeSideCondition('saltstorm');
			},
			onEnd(side) {
				if (!(side.active.length && side.active[0].hp)) return;
				const pokemon = side.active[0];
				pokemon.addVolatile('saltguard');
				pokemon.addVolatile('focusenergy');
			},
		},
		target: "normal",
		type: "Ice",
	},
	// Freeroamer
	screwthismatchup: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Raises the user's Attack by 2. User's secondary type is switched with opponent's primary type.",
		isNonstandard: "Custom",
		name: "Screw This Matchup",
		pp: 5,
		priority: 0,
		flags: {},
		boosts: {atk: 2},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Barrier", source);
		},
		onHit(target, source) {
			if (!source.types[1]) return true;
			const foes = source.side.foe.active;
			if (foes.length && foes[0].hp) {
				const opponent = foes[0];
				if (opponent.types[0] === source.types[1]) {
					source.setType(source.types[0]);
					this.add('-start', source, 'typechange', source.types[0]);
				} else if (opponent.types[0] === source.types[0]) {
					if (opponent.types[1]) {
						if (opponent.types[1] === source.types[1]) {
							opponent.setType(source.types[1]);
							this.add('-start', opponent, 'typechange', opponent.types[0]);
						} else {
							opponent.setType([source.types[1], opponent.types[1]]);
							this.add('-start', opponent, 'typechange', opponent.types[0] + '/' + opponent.types[1]);
						}
					} else {
						opponent.setType(source.types[1]);
						this.add('-start', opponent, 'typechange', opponent.types[0]);
					}
					source.setType(source.types[0]);
					this.add('-start', source, 'typechange', source.types[0]);
				} else {
					const mytype = source.types[1];
					source.setType([source.types[0], opponent.types[0]]);
					this.add('-start', source, 'typechange', source.types[0] + '/' + source.types[1]);
					if (opponent.types[1]) {
						if (opponent.types[1] === mytype) {
							opponent.setType(mytype);
							this.add('-start', opponent, 'typechange', opponent.types[0]);
						} else {
							source.setType([mytype, opponent.types[1]]);
							this.add('-start', opponent, 'typechange', opponent.types[0] + '/' + opponent.types[1]);
						}
					} else {
						opponent.setType(mytype);
						this.add('-start', opponent, 'typechange', opponent.types[0]);
					}
				}
			}
		},
		target: "self",
		type: "Normal",
	},
	// Lemonade
	seemsgood: {
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			const targetWeight = target.getWeight();
			if (targetWeight >= 200) {
				return 120;
			}
			if (targetWeight >= 100) {
				return 100;
			}
			if (targetWeight >= 50) {
				return 80;
			}
			if (targetWeight >= 25) {
				return 60;
			}
			if (targetWeight >= 10) {
				return 40;
			}
			return 20;
		},
		category: "Physical",
		shortDesc: "More power the heavier the target.",
		isNonstandard: "Custom",
		name: "Seems Good",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Low Kick", target);
		},
		target: "normal",
		type: "Fighting",
	},
	// f(x)
	shakethatbrass: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Uses another known move at 1.5x power and 100% accuracy.",
		isNonstandard: "Custom",
		name: "shake that brass",
		pp: 20,
		priority: 0,
		onTryHit(target, pokemon) {
			const moveSlots = pokemon.moveSlots.map(x => x.id).filter(x => x !== 'shakethatbrass');
			const move = moveSlots[this.random(moveSlots.length)];
			pokemon.addVolatile('shakethatbrass');
			this.actions.useMove(move, pokemon, target);
			return null;
		},
		flags: {protect: 1, authentic: 1},
		condition: {
			duration: 1,
			onBasePowerPriority: 4,
			onBasePower(basePower) {
				return this.chainModify(1.5);
			},
			onAccuracy(accuracy) {
				return 100;
			},
		},
		target: "adjacentFoe",
		type: "Normal",
	},
	// Legitimate Username
	shellfortress: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Raises Def, SpD by 2; lowers Atk, SpA, Spe by 4.",
		isNonstandard: "Custom",
		name: "Shell Fortress",
		pp: 15,
		priority: 0,
		flags: {snatch: 1},
		boosts: {def: 2, spd: 2, atk: -4, spa: -4, spe: -4},
		target: "self",
		type: "Normal",
	},
	// GeoffBruedly
	shitpostparadise: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "For 5 turns, female Pokemon gain +2 priority.",
		isNonstandard: "Custom",
		name: "Shitpost Paradise",
		pp: 10,
		priority: 0,
		flags: {mirror: 1},
		onHitField(target, source, effect) {
			if (this.field.pseudoWeather['shitpostparadise']) {
				this.field.removePseudoWeather('shitpostparadise');
			} else {
				this.field.addPseudoWeather('shitpostparadise', source, effect);
			}
		},
		condition: {
			duration: 5,
			onStart(target, source) {
				this.add('-fieldstart', 'move: Shitpost Paradise', '[silent]');
				this.add('message', 'Female Pokemon have gained additional priority to their moves!');
			},
			onResidualOrder: 25,
			onEnd() {
				this.add('-fieldend', 'move: Shitpost Paradise', '[silent]');
				this.add('message', 'The altered priorities returned to normal.');
			},
			onModifyPriority(priority, pokemon, target, move) {
				if (pokemon && pokemon.gender === 'F') {
					return priority + 2;
				}
			},
		},
		target: "all",
		type: "Psychic",
	},
	// Orda-Y
	shockswitch: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		shortDesc: "Forces the target to switch to a random ally. User switches out after damaging the target.",
		isNonstandard: "Custom",
		name: "Shock Switch",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Ice Beam", target);
		},
		selfSwitch: true,
		forceSwitch: true,
		target: "normal",
		type: "Ice",
	},
	// The Immortal
	sleepwalk: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "User sleeps 2 turns and restores HP and status. Uses another known move.",
		isNonstandard: "Custom",
		name: "Sleep Walk",
		pp: 10,
		priority: 0,
		flags: {},
		sleepUsable: true,
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Healing Wish", target);
		},
		onHit(pokemon, source) {
			if (pokemon.status !== 'slp') {
				if (pokemon.hp >= pokemon.maxhp) return false;
				if (!pokemon.setStatus('slp')) return false;
				pokemon.statusState.time = 3;
				pokemon.statusState.startTime = 3;
				this.heal(pokemon.maxhp);
				this.add('-status', pokemon, 'slp', '[from] move: Rest');
			}
			const moves = [];
			for (const move of pokemon.moves) {
				if (move && move !== 'sleepwalk') moves.push(move);
			}
			let move = '';
			if (moves.length) move = moves[this.random(moves.length)];
			if (!move) return false;
			this.actions.useMove(move, pokemon);
			if (!pokemon.m.informed && source.name === 'The Immortal') {
				this.add('c|~The Immortal|I don\'t really sleep walk...');
				pokemon.m.informed = true;
			}
		},
		target: "self",
		type: "Normal",
	},
	// Scyther NO Swiping
	sniperswipes: {
		accuracy: true,
		basePower: 35,
		category: "Physical",
		shortDesc: "Hits 3 times. High critical hit ratio. Uses an inverted type chart.",
		isNonstandard: "Custom",
		name: "Sniper Swipes",
		pp: 10,
		priority: 0,
		critRatio: 2,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "X-Scissor", target);
		},
		onAfterMoveSecondarySelf(source, target, move) {
			if (move.hit === 3 && this.toID(source.name) === 'scythernoswiping') {
				this.add('c|%Scyther NO Swiping|Oh baby a triple!!!');
			}
		},
		onEffectiveness(typeMod) {
			return -typeMod;
		},
		multihit: 3,
		target: "normal",
		type: "Bug",
	},
	// HiMyNamesL
	solarstorm: {
		accuracy: 100,
		basePower: 120,
		category: "Special",
		shortDesc: "For 5 turns, intense sunlight powers Fire moves. 15% chance to burn the opponent. Lasts 2-3 turns.",
		isNonstandard: "Custom",
		name: "Solar Storm",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryHit() {
			this.field.setWeather("sunnyday");
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Solar Beam', target);
			this.add('-anim', target, 'Overheat', target);
		},
		self: {
			volatileStatus: 'lockedmove',
		},
		onAfterMove(pokemon) {
			if (pokemon.volatiles['lockedmove'] && pokemon.volatiles['lockedmove'].duration === 1) {
				pokemon.removeVolatile('lockedmove');
			}
		},
		secondary: {
			chance: 15,
			status: 'brn',
		},
		target: "randomNormal",
		type: "Fire",
	},
	// Hannah
	sparklerain: {
		accuracy: 100,
		basePower: 75,
		category: "Special",
		shortDesc: "Combines Fire in its type effectiveness. 30% chance to cause sleep.",
		isNonstandard: "Custom",
		name: "Sparkle Rain",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Misty Terrain', target);
			this.add('-anim', source, 'Powder', target);
		},
		onEffectiveness(typeMod, target, type) {
			return typeMod + this.dex.getEffectiveness('Fire', type);
		},
		secondary: {
			chance: 30,
			status: 'slp',
		},
		target: "normal",
		type: "Normal",
	},
	// Ascriptmaster
	spectrumtripletbeam: {
		accuracy: 100,
		basePower: 30,
		/// stab: 1,
		category: "Special",
		shortDesc: "Hits 3 times. Always results in a critical hit. Each hit uses a random type but ignores type immunities.",
		isNonstandard: "Custom",
		name: "Spectrum Triplet Beam",
		pp: 30,
		priority: 0,
		multihit: 3,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[anim] Tri Attack');
			const types = (move as any).types = [
				'Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting',
				'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice',
				'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water',
			];
			this.prng.shuffle(types);
			types.splice(3);
			this.add("c|@Ascriptmaster|Go! " + types.join(', ') + "! Spectrum Triplet Beam!!!");
		},
		onTryHit(target, source, move) {
			move.type = ((move as any).types as string[])[move.hit];
		},
		willCrit: true,
		ignoreImmunity: true,
		target: "allAdjacentFoes",
		type: "Normal",
	},
	// Bummer
	speedpaint: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Usually goes first. Copies foe's move. User must be faster.",
		isNonstandard: "Custom",
		name: "Speedpaint",
		pp: 10,
		priority: 1,
		flags: {protect: 1, authentic: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Agility", target);
		},
		onTryHit(target, pokemon) {
			const decision = this.queue.willMove(target);
			if (decision && !(decision.move.id === 'speedpaint')) {
				const noMeFirst = ['chatter', 'counter', 'covet', 'focuspunch', 'mefirst', 'metalburst', 'mirrorcoat', 'struggle', 'thief'];
				const move = this.dex.getActiveMove(decision.move.id);
				if (!noMeFirst.includes(move.id)) {
					this.actions.useMove(move, pokemon, target);
					return null;
				}
			}
			return false;
		},
		pressureTarget: "foeSide",
		target: "normal",
		type: "Normal",
	},
	// unfixable
	spikeyrain: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "For 5 turns, +Grass power and +2 priority, Grass types gain 50% to defenses.",
		isNonstandard: "Custom",
		name: "SPIKEY RAIN",
		pp: 10,
		priority: 1,
		terrain: 'spikeyrain',
		flags: {},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Grassy Terrain", source);
			this.add('-anim', source, "Spikes", source);
			this.add('-anim', source, "Grassy Terrain", source);
		},
		condition: {
			duration: 5,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Grass') {
					return this.chainModify(1.5);
				}
			},
			onModifyPriority(priority, pokemon, target, move) {
				if (move && move.type === 'Grass') {
					return priority + 2;
				}
			},
			onModifyDef(def, pokemon) {
				if (pokemon.hasType('Grass')) {
					return this.chainModify(1.5);
				}
			},
			onModifySpD(spd, pokemon) {
				if (pokemon.hasType('Grass')) {
					return this.chainModify(1.5);
				}
			},
			onStart() {
				this.add('-fieldstart', 'move: Spikey Rain');
				this.add('message', 'Cactus spikes pour down from the heavens, boosting Grass-type moves, granting them priority, and shielding Grass-type Pokemon!');
			},
			onEnd() {
				this.add('-fieldend', 'move: Spikey Rain');
			},
		},
		target: "all",
		type: "Grass",
	},
	// bludz
	splatter: {
		accuracy: 100,
		basePower: 200,
		category: "Special",
		shortDesc: "Usually goes first. User faints. Lowers target's Speed by 1. Target cannot switch next turn.",
		isNonstandard: "Custom",
		name: "Splatter",
		pp: 40,
		priority: 1,
		flags: {protect: 1, mirror: 1},
		selfdestruct: "always",
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Explosion", source);
			this.add('-anim', target, "Rototiller", target);
		},
		volatileStatus: 'splatter',
		condition: {
			duration: 2,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Splatter');
				this.add('message', 'The sticky splatter prevents switching!');
				this.boost({spe: -1}, pokemon);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Splatter');
			},
			onTrapPokemon(pokemon) {
				pokemon.tryTrap();
			},
		},
		target: "allAdjacentFoes",
		type: "Bug",
	},
	// Jack Higgins
	splinters: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		shortDesc: "Hits 3 times. Randomly sets Spikes or Toxic Spikes. Damages target for subsequent turns.",
		isNonstandard: "Custom",
		name: "Splinters",
		pp: 10,
		multihit: 3,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Spikes", target);
		},
		onHit(target, source, move) {
			target.side.addSideCondition(['spikes', 'toxicspikes'][this.random(2)], source, move);
		},
		onAfterMove(source, target) {
			target.addVolatile('splinters', source);
		},
		condition: {
			onStart(target) {
				this.add('message', 'Painful splinters lodged into ' + target.name + '!');
				this.effectState.stage = 1;
			},
			onRestart(target) {
				if (this.effectState.stage < 4) {
					this.add('message', 'More painful splinters lodged into ' + target.name + '!');
					this.effectState.stage++;
				}
			},
			onEnd(target) {
				this.add('message', 'The splinters were dislodged from ' + target.name + '.');
			},
			onResidualOrder: 98,
			onResidual(pokemon) {
				this.damage(this.clampIntRange(pokemon.maxhp / 16, 1) * this.effectState.stage);
			},
		},
		target: "normal",
		type: "Rock",
	},
	// Temporaryanonymous
	spoopyedgecut: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		shortDesc: "Usually moves first. Lowers user's accuracy by 2.",
		isNonstandard: "Custom",
		name: "SPOOPY EDGE CUT",
		pp: 30,
		priority: 1,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.add('-message', '*@Temporaryanonymous teleports behind you*');
			this.attrLastMove('[still]');
			this.add('-anim', source, "Night Shade", target);
		},
		onHit(pokemon) {
			if (pokemon.hp <= 0 || pokemon.fainted) {
				this.add('c|@Temporaryanonymous|YOU ARE ALREADY DEAD *unsheathes glorious cursed nippon steel katana and cuts you in half with it* heh......nothing personnel.........kid......................');
			}
		},
		onMoveFail(target, source, move) {
			this.add('-message', '*@Temporaryanonymous teleports behind you*');
			this.add('c|@Temporaryanonymous|YOU ARE ALREADY DEAD *misses* Tch......not bad.........kid......................');
		},
		self: {boosts: {accuracy: -2}},
		target: "normal",
		type: "Ghost",
	},
	// Zodiax
	standingfull: {
		accuracy: true,
		basePower: 100,
		category: "Physical",
		shortDesc: "This move does not check accuracy. 100% chance to confuse (30% if target moves before the user).",
		isNonstandard: "Custom",
		name: "Standing Full",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Splash", source);
		},
		secondary: {
			chance: 100,
			onHit(target, source) {
				const damagedByTarget = source.attackedBy.some(p =>
					p.source === target && p.damage > 0 && p.thisTurn
				);
				if (damagedByTarget) {
					if (this.random(100) < 30) {
						target.addVolatile('confusion');
					}
				} else {
					target.addVolatile('confusion');
				}
			},
		},
		target: "normal",
		type: "Fighting",
	},
	// Astara
	starboltdesperation: {
		accuracy: 75,
		basePower: 0,
		category: "Physical",
		shortDesc: "Does damage equal to 3/4 target's current HP. Uses a random type. 50% chance of random status. 50% chance to confuse. Randomly alters user's stats.",
		isNonstandard: "Custom",
		name: 'Star Bolt Desperation',
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1},
		damageCallback(pokemon, target) {
			return target.hp * 0.75;
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Grudge", target);
			this.add('-anim', source, "Dragon Ascent", target);
		},
		onHit(target, source) {
			const boosts: SparseBoostsTable = {};
			const stats: BoostID[] = ['atk', 'def', 'spa', 'spd', 'spe', 'accuracy'];
			const increase = stats[this.random(6)];
			const decrease = stats[this.random(6)];
			boosts[increase] = 1;
			boosts[decrease] = -1;
			this.boost(boosts, source, source);
		},
		onModifyMove(move) {
			move.type = [
				'Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting',
				'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice',
				'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water',
			][this.random(18)];
		},
		secondary: {
			chance: 100,
			onHit(target) {
				if (this.random(2) === 1) {
					const status = ['par', 'brn', 'frz', 'psn', 'tox', 'slp'][this.random(6)];
					if (status === 'frz') {
						let freeze = true;
						for (const pokemon of target.side.pokemon) {
							if (pokemon.status === 'frz') freeze = false;
						}
						if (freeze) target.trySetStatus('frz');
					} else {
						target.trySetStatus(status);
					}
				}
				if (this.random(2) === 1) target.addVolatile('confusion');
			},
		},
		target: "normal",
		type: "Normal",
	},
	// manu 11
	surskitenergy: {
		accuracy: 95,
		basePower: 130,
		category: "Special",
		shortDesc: "Combines Bug in its type effectiveness. Calls Sticky Web.",
		isNonstandard: "Custom",
		name: "Surskit Energy",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onEffectiveness(typeMod, target, type) {
			return typeMod + this.dex.getEffectiveness('Bug', type);
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Rototiller", target);
			this.add('-anim', source, "Origin Pulse", target);
		},
		secondary: {
			chance: 100,
			sideCondition: 'stickyweb',
		},
		target: "normal",
		type: "Water",
	},
	// RosieTheVenusaur
	swagplant: {
		accuracy: 90,
		basePower: 150,
		category: "Physical",
		shortDesc: "User cannot move next turn. 100% chance to confuse opponent. RAises user's Atk and Def by 1.",
		isNonstandard: "Custom",
		name: "Swag Plant",
		pp: 5,
		priority: 0,
		flags: {recharge: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Taunt", target);
			this.add('-anim', source, "Frenzy Plant", target);
		},
		self: {
			volatileStatus: 'mustrecharge',
			boosts: {
				atk: 1,
				def: 1,
			},
		},
		secondary: {
			chance: 100,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Grass",
	},
	// Dream Eater Gengar
	sweetdreams: {
		accuracy: 90,
		basePower: 0,
		category: "Status",
		shortDesc: "100% chance to cause sleep. User drains target's health while it is asleep. User cuts its own HP.",
		isNonstandard: "Custom",
		name: "Sweet Dreams",
		pp: 25,
		priority: 0,
		flags: {reflectable: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dark Void", target);
		},
		onHit(target, source) {
			let highcost = false;
			if (target.status !== 'slp') {
				if (!target.trySetStatus("slp", source)) return false;
				highcost = true;
			} else if (target.volatiles["nightmare"] && target.volatiles["sweetdreams"]) {
				return false;
			}
			this.directDamage(this.modify(source.maxhp, (highcost ? 0.5 : 0.25)), source, source);
			target.addVolatile("nightmare");
			target.addVolatile("sweetdreams", source);
		},
		condition: {
			onStart(pokemon) {
				if (pokemon.status !== 'slp') {
					return false;
				}
				this.add('-start', pokemon, 'Sweet Dreams');
			},
			onResidualOrder: 8,
			onResidual(pokemon) {
				const target = this.effectState.source.side.active[pokemon.volatiles['sweetdreams'].sourcePosition];
				if (!target || target.fainted || target.hp <= 0) {
					return;
				}
				const damage = this.damage(pokemon.maxhp / 8, pokemon, target);
				if (damage) {
					this.heal(damage, target, pokemon);
				}
			},
			onUpdate(pokemon) {
				if (pokemon.status !== 'slp') {
					pokemon.removeVolatile('sweetdreams');
					this.add('-end', pokemon, 'Sweet Dreams', '[silent]');
				}
			},
		},
		secondary: {
			chance: 100,
			self: {
				boosts: {def: -1, spd: -1},
			},
		},
		target: "normal",
		type: "Ghost",
	},
	// imas234
	sweg: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		shortDesc: "Raises the target's Attack by 2 and confuses it. 30% chance to paralyze.",
		isNonstandard: "Custom",
		name: "Sweg",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Follow Me", target);
			this.add('-anim', source, "Roar of Time", target);
			this.add('-anim', source, "Torment", target);
		},
		onHit(target, source) {
			this.boost({atk: 2}, target, source);
			target.addVolatile('confusion', source);
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Dragon",
	},
	// Iyarito
	tomalawey: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Protects from moves. Boosts users Spa, Spd and Speed by 1.",
		isNonstandard: "Custom",
		name: "Tomala wey",
		pp: 5,
		noPPBoosts: true,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'protect',
		onPrepareHit(pokemon) {
			this.attrLastMove('[still]');
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		boosts: {
			spa: 1,
			spd: 1,
			spe: 1,
		},
		target: "self",
		type: "Ground",
	},
	// Articuno
	truesupport: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Target takes 1/4 its max HP to put in a substitute and then switches to a random ally.",
		isNonstandard: "Custom",
		name: "True Support",
		pp: 10,
		priority: -6,
		flags: {reflectable: 1, mirror: 1, authentic: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Whirlwind", target);
		},
		onHit(target) {
			this.actions.useMove('substitute', target);
		},
		forceSwitch: true,
		target: "normal",
		type: "Normal",
	},
	// Skitty
	ultimatedismissal: {
		accuracy: 100,
		basePower: 40,
		basePowerCallback(pokemon) {
			return 40 + 20 * (Math.log(Math.max(pokemon.positiveBoosts(), 1)) / Math.log(1.5));
		},
		category: "Special",
		shortDesc: "Has more power when the user has more stat boosts.",
		isNonstandard: "Custom",
		name: "Ultimate Dismissal",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Swift", target);
			move.drain = [25, target.maxhp];
		},
		target: "normal",
		type: "Fairy",
	},
	// Sweep
	wave: {
		accuracy: 100,
		basePower: 120,
		category: "Special",
		shortDesc: "20% chance to flinch the target.",
		isNonstandard: "Custom",
		name: "(wave(",
		pp: 35,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Water Spout", target);
		},
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Water",
	},
	// Brandon (Brrandon)
	waveofindifference: {
		accuracy: 95,
		basePower: 140,
		category: "Special",
		shortDesc: "Deals typeless damage.",
		isNonstandard: "Custom",
		name: "Wave of Indifference",
		pp: 10,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Swift", target);
		},
		onEffectiveness() {
			return 0;
		},
		ignoreImmunity: {'Psychic': true},
		target: "normal",
		type: "Psychic",
	},
	// Vapo
	wetwork: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "For 5 turns, slower Pokemon move first. Heals the user by 40% of its max HP.",
		isNonstandard: "Custom",
		name: "Wetwork",
		pp: 10,
		priority: -7,
		flags: {heal: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Water Pulse", target);
		},
		onHit(target, source) {
			let moved = false;
			if (!this.field.pseudoWeather['trickroom']) {
				this.field.addPseudoWeather('trickroom', source);
				moved = true;
			}
			if (source.maxhp !== source.hp) {
				this.heal(this.modify(target.maxhp, 0.4), target, source);
				moved = true;
			}
			if (!moved) return false;
		},
		target: "self",
		type: "Water",
	},
	// Solaris Fox
	wonderbark: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Hits first. This move does not check accuracy. Target's moves are randomised.",
		isNonstandard: "Custom",
		name: "Wonder Bark",
		pp: 1,
		noPPBoosts: true,
		priority: 3,
		flags: {reflectable: 1, sound: 1, authentic: 1},
		volatileStatus: 'flinch',
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Cosmic Power", target);
			this.add('-anim', source, "Hyper Voice", source);
		},
		onHit(pokemon, source) {
			this.add('-message', 'You hear a sound echo across the universe. Things seem different now.');
			const newMoves = ['boomburst', 'flamethrower', 'freezedry', 'thunderbolt', 'steameruption', 'gigadrain', 'bugbuzz',
				'darkpulse', 'psychic', 'shadowball', 'flashcannon', 'dragonpulse', 'moonblast', 'focusblast', 'aeroblast',
				'earthpower', 'sludgebomb', 'paleowave', 'bodyslam', 'flareblitz', 'iciclecrash', 'volttackle', 'waterfall',
				'leafblade', 'xscissor', 'knockoff', 'shadowforce', 'ironhead', 'outrage', 'playrough', 'closecombat',
				'bravebird', 'earthquake', 'stoneedge', 'extremespeed', 'stealthrock', 'spikes', 'toxicspikes', 'stickyweb',
				'quiverdance', 'shellsmash', 'dragondance', 'recover', 'toxic', 'willowisp', 'leechseed',
			];
			for (let i = 0; i < pokemon.moveSlots.length; i++) {
				const length = newMoves.length;
				const index = this.random(length);
				const moveData = this.dex.moves.get(newMoves[index]);
				newMoves[index] = newMoves[length - 1];
				newMoves.pop();

				const moveBuffer = {
					id: moveData.id,
					move: moveData.name,
					pp: moveData.pp,
					maxpp: moveData.pp,
					target: moveData.target,
					disabled: false,
					used: false,
				};
				pokemon.moveSlots[i] = moveBuffer;
				pokemon.baseMoveSlots[i] = moveBuffer;
			}
		},
		target: "normal",
		type: "Dark",
	},
	// xJoelituh
	xhaxlituh: {
		accuracy: 90,
		basePower: 20,
		category: "Physical",
		shortDesc: "Hits 2-5 times. High critical hit ratio. Each hit has a 5% chance of random status.",
		isNonstandard: "Custom",
		name: "xHaxlituh",
		pp: 35,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		critRatio: 2,
		multihit: [2, 5],
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Bonemerang", target);
		},
		onHit(target, source, move) {
			if (target.getMoveHitData(move).crit) {
				this.add('c|+xJoelituh|That didn\'t mattered, I had everything calc\'d');
				this.add('c|+xJoelituh|!calc');
				this.add('raw|<div class="infobox">Pokémon Showdown! damage calculator. (Courtesy of Honko) <br> - <a href="https://pokemonshowdown.com/damagecalc/">Damage Calculator</a></br></div>');
			}
		},
		secondary: {
			chance: 5,
			onHit(target, source) {
				const status = ['par', 'brn', 'frz', 'psn', 'tox', 'slp'][this.random(6)];
				let prompt = false;
				if (status === 'frz') {
					let freeze = true;
					for (const pokemon of target.side.pokemon) {
						if (pokemon.status === 'frz') freeze = false;
					}
					if (freeze && target.trySetStatus('frz') && this.toID(source.name) === 'xjoelituh') {
						prompt = true;
					}
				} else if (target.trySetStatus(status) && this.toID(source.name) === 'xjoelituh') {
					prompt = true;
				}
				if (prompt) {
					this.add('c|+xJoelituh|That didn\'t mattered, I had everything calc\'d');
					this.add('c|+xJoelituh|!calc');
					this.add('raw|<div class="infobox">Pokémon Showdown! damage calculator. (Courtesy of Honko) <br> - <a href="https://pokemonshowdown.com/damagecalc/">Damage Calculator</a></br></div>');
				}
			},
		},
		target: "normal",
		type: "Ground",
	},
	// jdarden
	wyvernswind: {
		accuracy: 90,
		basePower: 80,
		category: "Special",
		shortDesc: "Forces the target to switch to a random ally.",
		isNonstandard: "Custom",
		name: "Wyvern's Wind",
		pp: 10,
		priority: -6,
		flags: {protect: 1, mirror: 1},
		forceSwitch: true,
		onTryHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Boomburst", target);
		},
		target: "normal",
		type: "Flying",
	},
	// Frysinger
	zapconfirmed: {
		accuracy: 100,
		basePower: 25,
		category: "Special",
		shortDesc: "Hits 4 times. 30% chance to paralyze.",
		isNonstandard: "Custom",
		name: "ZAP Confirmed",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		multihit: 4,
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Charge Beam", target);
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
	},

	// Modified moves
	"defog": {
		inherit: true,
		onHit(target, source, move) {
			if (!target.volatiles['substitute'] || move.infiltrates) this.boost({evasion: -1});
			const removeTarget = ['reflect', 'lightscreen', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'burnspikes', 'stealthrock', 'stickyweb'];
			const removeAll = ['spikes', 'toxicspikes', 'burnspikes', 'stealthrock', 'stickyweb'];
			for (const targetCondition of removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					if (!removeAll.includes(targetCondition)) continue;
					this.add('-sideend', target.side, this.dex.conditions.get(targetCondition).name, '[from] move: Defog', '[of] ' + target);
				}
			}
			for (const sideCondition of removeAll) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: Defog', '[of] ' + source);
				}
			}
		},
	},
	"rapidspin": {
		inherit: true,
		self: {
			onHit(pokemon) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
				}
				const sideConditions = {spikes: 1, toxicspikes: 1, burnspikes: 1, stealthrock: 1, stickyweb: 1};
				for (const i in sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(i)) {
						this.add('-sideend', pokemon.side, this.dex.conditions.get(i).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
				if (pokemon.hp && pokemon.volatiles['maelstrm']) {
					pokemon.removeVolatile('maelstrm');
				}
				if (pokemon.hp && pokemon.volatiles['splinters']) {
					pokemon.removeVolatile('splinters');
				}
			},
		},
	},
	"hypnosis": {
		inherit: true,
		accuracy: 45,
	},
};
