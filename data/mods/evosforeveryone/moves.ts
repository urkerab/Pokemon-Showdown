export const Moves: {[k: string]: ModdedMoveData} = {
	"aquatail": {
		inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1, tail: 1},
	},
	"defog": {
		inherit: true,
		onHit(target, source, move) {
			let success = false;
			if (!target.volatiles['substitute'] || move.infiltrates) success = !!this.boost({evasion: -1});
			const removeTarget = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
			const removeAll = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
			for (const targetCondition of removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					if (!removeAll.includes(targetCondition)) continue;
					this.add('-sideend', target.side, this.dex.getEffect(targetCondition).name, '[from] move: Defog', '[of] ' + source);
					success = true;
				}
			}
			if (target.hasAbility('anchored') || source.hasAbility('anchored')) return;
			for (const sideCondition of removeAll) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.dex.getEffect(sideCondition).name, '[from] move: Defog', '[of] ' + source);
					success = true;
				}
			}
			return success;
		},
	},
	"dragontail": {
		inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1, tail: 1},
	},
	"gravity": {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', effect);
					return 7;
				}
				return 5;
			},
			onStart() {
				this.add('-fieldstart', 'move: Gravity');
				if (this.field.getPseudoWeather('antigravity')) this.field.removePseudoWeather('antigravity');
				for (const pokemon of this.sides[0].active.concat(this.sides[1].active)) {
					let applies = false;
					if (pokemon.removeVolatile('bounce') || pokemon.removeVolatile('fly')) {
						applies = true;
						this.queue.cancelMove(pokemon);
						pokemon.removeVolatile('twoturnmove');
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
					if (applies) this.add('-activate', pokemon, 'move: Gravity');
				}
			},
			onModifyAccuracy(accuracy) {
				if (typeof accuracy !== 'number') return;
				return accuracy * 5 / 3;
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (this.dex.getMove(moveSlot.id).flags['gravity']) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
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
	"irontail": {
		inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1, tail: 1},
	},
	"poisontail": {
		inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1, tail: 1},
	},
	"rapidspin": {
		inherit: true,
		self: {
			onHit(pokemon, target, move) {
				if (pokemon.hp) pokemon.removeVolatile('leechseed', pokemon, move);
				if (pokemon.hp) pokemon.removeVolatile('partiallytrapped');
				if (pokemon.hasAbility('anchored') || target.hasAbility('anchored')) return;
				const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
				for (const condition of sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
						this.add('-sideend', pokemon.side, this.dex.getEffect(condition).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
					}
				}
			},
		},
	},
	"tailslap": {
		inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1, tail: 1},
	},
	"tailwhip": {
		inherit: true,
		flags: {protect: 1, reflectable: 1, mirror: 1, tail: 1},
	},
	"suddenstrike": {
		num: 0,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "Nearly always goes first.",
		name: "Sudden Strike",
		pp: 5,
		priority: 2,
		flags: {contact: 1, protect: 1, mirror: 1, bite: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Poison Fang", target);
		},
		secondary: null,
		target: "normal",
		type: "Ground",
		zMove: {basePower: 160},
		contestType: "Cool",
	},
	"boilerburst": {
		num: 0,
		accuracy: 75,
		basePower: 100,
		category: "Special",
		desc: "Prevents the target from switching for four or five turns; seven turns if the user is holding Grip Claw. Causes damage to the target equal to 1/8 of its maximum HP (1/6 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Parting Shot, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin or Substitute. This effect is not stackable or reset by using this or another partial-trapping move.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		name: "Boiler Burst",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Mirror Shot", target);
		},
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
		type: "Steel",
		zMove: {basePower: 180},
		contestType: "Tough",
	},
	"twirlingstrike": {
		num: 0,
		accuracy: 85,
		basePower: 55,
		category: "Physical",
		desc: "Hits twice. If the first hit breaks the target's substitute, it will take damage for the second hit.",
		shortDesc: "Hits 2 times in one turn.",
		name: "Twirling Strike",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Brave Bird", target);
		},
		multihit: 2,
		secondary: null,
		target: "normal",
		type: "Flying",
		zMove: {basePower: 190},
		contestType: "Clever",
	},
	"plasmajolt": {
		num: 84,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "No additional effect.",
		shortDesc: "Usually goes first.",
		name: "Plasma Jolt",
		pp: 30,
		priority: 1,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Thundershock", target);
		},
		secondary: null,
		target: "normal",
		type: "Electric",
		zMove: {basePower: 100},
		contestType: "Cute",
	},
	"cloudyterrain": {
		num: 580.5,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the terrain becomes Cloudy Terrain. During the effect, attacks used by grounded Pokemon hit targets with type immunities for neutral damage. Camouflage transforms the user into a Normal type, Nature Power becomes Tri Attack, and Secret Power has a 30% chance to make the opponent flinch. Fails if the current terrain is Cloudy Terrain.",
		shortDesc: "5 turns. Grounded: Attacks have no type immunities, Ghost damage halved.",
		name: "Cloudy Terrain",
		pp: 10,
		priority: 0,
		flags: {nonsky: 1},
		terrain: 'cloudyterrain',
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onTryMove(pokemon, target, move) {
				if (pokemon.isGrounded()) move.ignoreImmunity = true;
			},
			onStart(battle, source, effect) {
				if (effect && effect.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Cloudy Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Cloudy Terrain');
				}
			},
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Ghost' && defender.isGrounded() && !defender.isSemiInvulnerable()) {
					this.debug('cloudy terrain weaken');
					return this.chainModify(0.5);
				}
			},
			onResidualOrder: 5,
			onResidualSubOrder: 3,
			onResidual() {
				this.eachEvent('Terrain');
			},
			onEnd() {
				if (!this.effectData.duration) this.eachEvent('Terrain');
				this.add('-fieldend', 'move: Cloudy Terrain');
			},
		},
		secondary: null,
		target: "all",
		type: "Normal",
		zMove: {boost: {spd: 1}},
		contestType: "Beautiful",
	},
	"fireball": {
		num: 394.5,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		desc: "Has a 10% chance to burn the target. If the target lost HP, the user takes recoil damage equal to 33% the HP lost by the target, rounded half up, but not less than 1 HP.",
		shortDesc: "Has 33% recoil. 10% chance to burn",
		name: "Fireball",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		recoil: [33, 100],
		secondary: {
			chance: 10,
			status: 'brn',
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Flame Charge", target);
		},
		target: "normal",
		type: "Fire",
		zMove: {basePower: 180},
		contestType: "Beautiful",
	},
	"wildfire": {
		num: 609.5,
		accuracy: 100,
		basePower: 20,
		category: "Special",
		desc: "Has a 100% chance to burn the target.",
		shortDesc: "100% chance to burn the target.",
		name: "Wildfire ",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			status: 'brn',
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Inferno", target);
		},
		target: "normal",
		type: "Fire",
		zMove: {basePower: 100},
		contestType: "Cool",
	},
	"spiritsteal": {
		num: 668,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Special Defense by 1 stage. The user restores its HP equal to the target's Special Defense stat calculated with its stat stage before this move was used. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down. Fails if the target's Special Defense stat stage is -6.",
		shortDesc: "User heals HP=target's SpD stat. Lowers SpD by 1.",
		name: "Spirit Steal",
		pp: 10,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, heal: 1},
		onHit(target, source) {
			if (target.boosts.spd === -6) return false;
			const spd = target.getStat('spd', false, true);
			const success = this.boost({spd: -1}, target, source, null, false, true);
			return !!(this.heal(spd, source, target) || success);
		},
		secondary: null,
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Spectral Thief", target);
		},
		target: "normal",
		type: "Ghost",
		zMove: {boost: {def: 1}},
		contestType: "Clever",
	},
	"burrow": {
		num: 393,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the user is immune to Ground-type attacks and the effects of Spikes, Toxic Spikes, Sticky Web, and the Arena Trap Ability as long as it remains active. If the user uses Baton Pass, the replacement will gain the effect. Ingrain, Smack Down, Thousand Arrows, and Iron Ball override this move if the user is under any of their effects. Fails if the user is already under this effect or the effects of Ingrain, Smack Down, or Thousand Arrows.",
		shortDesc: "For 5 turns, the user has immunity to Ground.",
		name: "Burrow",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, gravity: 1},
		volatileStatus: 'burrow',
		condition: {
			onStart(target) {
				this.add('-start', target, 'Burrow');
			},
			onModifyPriority(priority, pokemon, target, move) {
				return priority + 1;
			},
			onTryMove(source, target) {
				source.removeVolatile('burrow');
			},
			onHit(pokemon) {
				pokemon.removeVolatile('burrow');
			},
			onTryPrimaryHitPriority: -2,
			onTryPrimaryHit(target, source, move) {
				if (target === source || move.flags['authentic'] || move.infiltrates) {
					return;
				}
				const damage = this.getDamage(source, target, move);
				if (!damage && damage !== 0) {
					this.add('-fail', target);
					return null;
				}
			},
			onResidualOrder: 15,
			onEnd(target) {
				this.add('-end', target, 'Burrow');
			},
		},
		secondary: null,
		target: "self",
		type: "Electric",
		zMove: {boost: {evasion: 1}},
		contestType: "Clever",
	},
	"fiercepounce": {
		num: 706,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		desc: "If this attack does not miss, the effects of Reflect, Light Screen, and Aurora Veil end for the target's side of the field before damage is calculated.",
		shortDesc: "Destroys screens, unless the target is immune.",
		name: "Fierce Pounce",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryHit(pokemon) {
			// will shatter screens through sub, before you hit
			if (pokemon.runImmunity('Normal')) {
				pokemon.side.removeSideCondition('reflect');
				pokemon.side.removeSideCondition('lightscreen');
				pokemon.side.removeSideCondition('auroraveil');
			}
		},
		secondary: null,
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Extreme Speed", target);
		},
		target: "normal",
		type: "Normal",
		zMove: {basePower: 130},
		contestType: "Tough",
	},
	"lethality": {
		num: 357,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "As long as the target remains active, its evasiveness stat stage is ignored during accuracy checks against it if it is greater than 0, and Psychic-type attacks can hit the target if it is a Dark type. Fails if the target is already affected, or affected by Foresight or Odor Sleuth.",
		shortDesc: "Psychic hits Dark. Evasiveness ignored.",
		name: "Lethality",
		pp: 20,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, authentic: 1},
		volatileStatus: 'lethality',
		onTryHit(target) {
			if (target.volatiles['foresight']) return false;
		},
		condition: {
			noCopy: true,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Lethality');
			},
			onNegateImmunity(pokemon, type) {
				if (pokemon.hasType('Ghost') && type === 'Normal') return false;
				if (pokemon.hasType('Ghost') && type === 'Fighting') return false;
			},
			onEffectiveness(typeMod, target, type, move) {
				if (type === 'Normal' || type === 'Fighting') {
					return 0;
				}
			},
		},
		secondary: null,
		target: "normal",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Punishment", target);
		},
		type: "Dark",
		zMove: {basePower: 150},
		contestType: "Tough",
	},
	"unlock": {
		num: 525,
		accuracy: 90,
		basePower: 60,
		category: "Physical",
		desc: "If both the user and the target have not fainted, the target is forced to switch out and be replaced with a random unfainted ally. This effect fails if the target used Ingrain previously, has the Suction Cups Ability, or this move hit a substitute.",
		shortDesc: "Forces the target to switch to a random ally.",
		name: "Unlock",
		pp: 10,
		priority: -6,
		flags: {contact: 1, protect: 1, mirror: 1, tail: 1},
		forceSwitch: true,
		target: "normal",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Fairy Lock", target);
		},
		type: "Steel",
		zMove: {basePower: 120},
		contestType: "Clever",
	},
	"lightblitz": {
		num: 98,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "Usually goes first.",
		name: "Light Blitz",
		pp: 30,
		priority: 1,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: null,
		target: "normal",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Flash", target);
		},
		type: "Fairy",
		zMove: {basePower: 100},
		contestType: "Beautiful",
	},
	"washaway": {
		num: 229,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "If this move is successful and the user has not fainted, all hazards are removed from the user's side of the field.",
		shortDesc: "Frees user from hazards.",
		name: "Wash Away",
		pp: 40,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		self: {
			onHit(pokemon, target) {
				if (pokemon.hasAbility('anchored') || target.hasAbility('anchored')) return;
				const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
				for (const condition of sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
						this.add('-sideend', pokemon.side, this.dex.getEffect(condition).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
					}
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Water",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Surf", target);
		},
		zMove: {basePower: 120},
		contestType: "Clever",
	},
	"tinfins": {
		num: 348,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "Has a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
		name: "Tin Fins",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		critRatio: 2,
		secondary: null,
		target: "normal",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Smart Strike", target);
		},
		type: "Steel",
		zMove: {basePower: 175},
		contestType: "Cool",
	},
	"ancientforce": {
		num: 394,
		accuracy: 80,
		basePower: 120,
		category: "Special",
		desc: "Has a 10% chance to paralyze the target. If the target lost HP, the user takes recoil damage equal to 33% the HP lost by the target, rounded half up, but not less than 1 HP.",
		shortDesc: "Has 33% recoil. 10% chance to paralyze.",
		name: "Ancient Force",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		recoil: [33, 100],
		secondary: {
			chance: 10,
			status: 'par',
		},
		target: "normal",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Ancient Power", target);
		},
		type: "Rock",
		zMove: {basePower: 190},
		contestType: "Tough",
	},
	"meteorshower": {
		num: 437,
		accuracy: 90,
		basePower: 130,
		category: "Special",
		desc: "Lowers the user's Special Attack by 2 stages.",
		shortDesc: "Lowers the user's Sp. Atk by 2.",
		name: "Meteor Shower",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		self: {
			boosts: {
				spa: -2,
			},
		},
		secondary: null,
		target: "normal",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Draco Meteor", target);
		},
		type: "Rock",
		zMove: {basePower: 195},
		contestType: "Beautiful",
	},
	"ozoneburst": {
		num: 403,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "Deals 50% more damage if the user is below 50% HP.",
		shortDesc: "Deals 50% more damage if the user is below 50% HP.",
		name: "Ozone Burst",
		onBasePower(basePower, pokemon, target) {
			if (pokemon.hp * 2 <= pokemon.maxhp) {
				return this.chainModify(1.5);
			}
		},
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, distance: 1},
		target: "any",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Oblivion Wing", target);
		},
		type: "Flying",
		zMove: {basePower: 130},
		contestType: "Cool",
	},
	"antigravity": {
		num: 356,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the evasiveness of all active Pokemon is multiplied by 0.6. At the time of use, Bounce, Fly, Magnet Rise, Sky Drop, and Telekinesis end immediately for all active Pokemon. During the effect, Bounce, Fly, Flying Press, High Jump Kick, Jump Kick, Magnet Rise, Sky Drop, Splash, and Telekinesis are prevented from being used by all active Pokemon. Ground-type attacks, Spikes, Toxic Spikes, Sticky Web, and the Arena Trap Ability can affect Flying types or Pokemon with the Levitate Ability. Fails if this move is already in effect.",
		shortDesc: "For 5 turns, negates all Ground immunities.",
		name: "Anti-Gravity",
		pp: 5,
		priority: 0,
		flags: {nonsky: 1},
		pseudoWeather: 'antigravity',
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', effect);
					return 7;
				}
				return 5;
			},
			onStart() {
				this.add('-fieldstart', 'move: Anti-Gravity');
				if (this.field.getPseudoWeather('gravity')) this.field.removePseudoWeather('gravity');
			},
			onModifyMovePriority: -2,
			onModifyMove(move) {
				if (move.type === 'Ground' || move.flags['contact']) {
					move.basePower = move.basePower / 2;
					this.debug(move.name + "'s type changed to Electric");
				}
			},
			onResidualOrder: 22,
			onEnd() {
				this.add('-fieldend', 'move: Anti-Gravity');
			},
		},
		secondary: null,
		target: "all",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Gravity", target);
		},
		type: "Psychic",
		zMove: {boost: {spa: 1}},
		contestType: "Clever",
	},
	"energyblock": {
		num: 694,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the user and its party members take 0.5x damage from physical and special attacks, or 0.66x damage if in a Double Battle; does not reduce damage further with Reflect or Light Screen. Critical hits ignore this protection. It is removed from the user's side if the user or an ally is successfully hit by Brick Break, Psychic Fangs, or Defog. Brick Break and Psychic Fangs remove the effect before damage is calculated. Lasts for 8 turns if the user is holding Light Clay. Fails unless Trick Room is active.",
		shortDesc: "For 5 turns, damage to allies is halved. Trick Room only.",
		name: "Energy Block",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		sideCondition: 'energyblock',
		onTryHitSide() {
			if (!this.field.pseudoWeather.trickroom) return false;
		},
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (source?.hasItem('lightclay')) {
					return 8;
				}
				return 5;
			},
			onAnyModifyDamage(damage, source, target, move) {
				if (target !== source && target.side === this.effectData.target) {
					if ((target.side.sideConditions['reflect'] && this.getCategory(move) === 'Physical') ||
							(target.side.sideConditions['lightscreen'] && this.getCategory(move) === 'Special')) {
						return;
					}
					if (!target.getMoveHitData(move).crit && !move.infiltrates) {
						this.debug('Energy Block weaken');
						if (target.side.active.length > 1) return this.chainModify([0xAAC, 0x1000]);
						return this.chainModify(0.5);
					}
				}
			},
			onStart(side) {
				this.add('-sidestart', side, 'move: Energy Block');
			},
			onResidualOrder: 21,
			onResidualSubOrder: 1,
			onEnd(side) {
				this.add('-sideend', side, 'move: Energy Block');
			},
		},
		secondary: null,
		target: "allySide",
		type: "Psychic",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Safeguard", target);
		},
		zMove: {boost: {spe: 1}},
		contestType: "Beautiful",
	},
	"mindbend": {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "For 5 turns, all Pokémon on the field are resistant to normally super-effective types and weak to normally not-very-effective or ineffective types (as in Inverse Battles) ",
		name: "Mind Bend",
		pp: 8,
		priority: 0,
		flags: {mirror: 1},
		pseudoWeather: 'mindbend',
		condition: {
			onStart(target, source) {
				this.add('-fieldstart', 'ability: Mind Bend', '[of] ' + target);
				this.effectData.source = target;
			},
			onResidual() {
				const source = this.effectData.source;
				if (source.fainted) this.field.removePseudoWeather('mindbend');
				return null;
			},
			onModifyMove(move) {
				move.ignoreImmunity = true;
			},
			onEffectiveness(typeMod, target, type, move) {
				if (move && !this.dex.getImmunity(move, type)) return 1;
				return -typeMod;
			},
			onResidualOrder: 23,
			onEnd() {
				this.add('-fieldend', 'ability: Mind Bend');
			},
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', target, "Trick Room", source);
		},
		secondary: null,
		target: "all",
		type: "Psychic",
		zMove: {boost: {accuracy: 1}},
	},
};
