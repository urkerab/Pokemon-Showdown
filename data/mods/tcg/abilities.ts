export const Abilities: {[k: string]: ModdedAbilityData} = {
	"aerilate": {
		desc: "This Pokemon's Normal-type moves have their power multiplied by 1.3. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves have 1.3x power.",
		onModifyMovePriority: -1,
		onModifyMove(move, pokemon) {
			if (move.type === 'Normal' && move.id !== 'naturalgift') {
				if (move.category !== 'Status') pokemon.addVolatile('aerilate');
			}
		},
		condition: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower(basePower, pokemon, target, move) {
				return this.chainModify([0x14CD, 0x1000]);
			},
		},
		name: "Aerilate",
		rating: 4,
		num: 185,
	},
	"galewings": {
		shortDesc: "This Pokemon's Flying-type moves have their priority increased by 1.",
		onModifyPriority(priority, pokemon, target, move) {
			if (move && move.type === 'Normal') return priority + 1;
		},
		name: "Gale Wings",
		rating: 4.5,
		num: 177,
	},
	"rattled": {
		desc: "This Pokemon's Speed is raised by 1 stage if hit by a Dark-, Grass-, or Psychic-type attack.",
		shortDesc: "This Pokemon's Speed is raised 1 stage if hit by a Dark-, Grass-, or Psychic-type attack.",
		onDamagingHit(damage, target, source, effect) {
			if (effect && (effect.type === 'Grass' || effect.type === 'Dark' || effect.type === 'Psychic')) {
				this.boost({spe: 1});
			}
		},
		name: "Rattled",
		rating: 1.5,
		num: 155,
	},
	"refrigerate": {
		desc: "This Pokemon's Normal-type moves become Water-type moves and have their power multiplied by 1.3. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Water type and have 1.3x power.",
		onModifyMovePriority: -1,
		onModifyMove(move, pokemon) {
			if (move.type === 'Normal' && move.id !== 'naturalgift') {
				move.type = 'Water';
				if (move.category !== 'Status') pokemon.addVolatile('refrigerate');
			}
		},
		condition: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower(basePower, pokemon, target, move) {
				return this.chainModify([0x14CD, 0x1000]);
			},
		},
		name: "Refrigerate",
		rating: 4,
		num: 174,
	},
	"sandforce": {
		desc: "If Sandstorm is active, this Pokemon's Fighting- and Steel-type attacks have their power multiplied by 1.3. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "This Pokemon's Fighting/Steel attacks do 1.3x in Sandstorm; immunity to it.",
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) {
			if (this.field.isWeather('sandstorm')) {
				if (move.type === 'Fighting' || move.type === 'Steel') {
					this.debug('Sand Force boost');
					return this.chainModify([0x14CD, 0x1000]);
				}
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		name: "Sand Force",
		rating: 2,
		num: 159,
	},
	"scrappy": {
		shortDesc: "This Pokemon can hit Psychic types with Normal- and Fighting-type moves.",
		onModifyMovePriority: -5,
		onModifyMove(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Fighting'] = true;
				move.ignoreImmunity['Normal'] = true;
			}
		},
		name: "Scrappy",
		rating: 3,
		num: 113,
	},
	"swarm": {
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its attacking stat is multiplied by 1.5 while using a Grass-type attack.",
		shortDesc: "When this Pokemon has 1/3 or less of its max HP, its Grass attacks do 1.5x damage.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Grass' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Swarm boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Grass' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Swarm boost');
				return this.chainModify(1.5);
			}
		},
		name: "Swarm",
		rating: 2,
		num: 68,
	},
	"thickfat": {
		desc: "If a Pokemon uses a Fire- or Water-type attack against this Pokemon, that Pokemon's attacking stat is halved when calculating the damage to this Pokemon.",
		shortDesc: "Fire/Water-type moves against this Pokemon deal damage with a halved attacking stat.",
		onModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water' || move.type === 'Fire') {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Water' || move.type === 'Fire') {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		name: "Thick Fat",
		rating: 3.5,
		num: 47,
	},
};
