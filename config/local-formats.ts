/* eslint spaced-comment: "off" */
// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.js

export const Formats: (InheritableFormatData | {section: string, column?: number})[] = [

	// Sw/Sh Singles
	///////////////////////////////////////////////////////////////////

	{
		section: "Sw/Sh Singles",
		column: 1,
	},
	{
		name: "[Gen 8] Random Battle",
	},
	{
		name: "[Gen 8] Unrated Random Battle",
	},
	{
		name: "[Gen 8] Free-For-All Random Battle",
	},
	{
		name: "[Gen 8] Multi Random Battle",
	},
	{
		name: "[Gen 8] Battle Factory",
	},
	{
		name: "[Gen 8] OU",
	},
	{
		name: "[Gen 8] OU (Blitz)",

		mod: 'gen8',
		ruleset: ['[Gen 8] OU', 'Blitz'],
	},
	{
		name: "[Gen 8] Ubers",
	},
	{
		name: "[Gen 8] UU",
	},
	{
		name: "[Gen 8] RU",
	},
	{
		name: "[Gen 8] NU",
	},
	{
		name: "[Gen 8] PU",
	},
	{
		name: "[Gen 8] ZU",
	},
	{
		name: "[Gen 8] NFE",
	},
	{
		name: "[Gen 8] LC",
	},
	{
		name: "[Gen 8] Anything Goes",
	},
	{
		name: "[Gen 8] CAP",
	},
	{
		name: "[Gen 8] Battle Stadium Singles",
	},
	{
		name: "[Gen 8] BSS Factory",
	},
	{
		name: "[Gen 8] National Dex",
	},
	{
		name: "[Gen 8] National Dex AG",
	},
	{
		name: "[Gen 8] Custom Game",
	},

	// Sw/Sh Doubles
	///////////////////////////////////////////////////////////////////

	{
		section: "Sw/Sh Doubles",
		column: 1,
	},
	{
		name: "[Gen 8] Random Doubles Battle",
	},
	{
		name: "[Gen 8] Doubles OU",
	},
	{
		name: "[Gen 8] Doubles Ubers",
	},
	{
		name: "[Gen 8] Doubles UU",
	},
	{
		name: "[Gen 8] Doubles LC",
	},
	{
		name: "[Gen 8] VGC 2021",
	},
	{
		name: "[Gen 8] VGC 2020",
	},
	{
		name: "[Gen 8] Battle Stadium Doubles",
		inherit: ["[Gen 8] Battle Stadium Singles"],
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3658057/">BSD Discussion</a>`,
		],

		gameType: 'doubles',
	},
	{
		name: '[Gen 8] Metronome Battle',
	},
	{
		name: "[Gen 8] Doubles Custom Game",
	},

	// Other Metagames
	///////////////////////////////////////////////////////////////////

	{
		section: 'Other Metagames',
		column: 1,
	},
	{
		name: "[Gen 8] 1v1",
	},
	{
		name: '[Gen 8] 2v2 Doubles',
	},
	{
		name: "[Gen 8] 350 Cup",
		desc: "Pok&eacute;mon with a base stat of 350 or lower get their stats doubled.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656554/">350 Cup</a>`,
		],

		ruleset: ['[Gen 8] Ubers'],
		banlist: [
			'Calyrex-Shadow', 'Pawniard', 'Rufflet', 'Zacian-Crowned', 'Arena Trap', 'Moody', 'Eviolite', 'Light Ball',
		],

		mod: 'gen8',
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;

			if (!template.abilities) return;

			if (template.id === 'wishiwashischool') {
				const newTemplate = this.dex.deepClone(template);
				newTemplate.bst += newTemplate.baseStats.hp;
				newTemplate.baseStats.hp *= 2;
				return newTemplate;
			}

			if (template.bst > 350) return;

			const newTemplate = this.dex.deepClone(template);
			for (const statid of ['hp', 'atk', 'def', 'spa', 'spd', 'spe']) {
				newTemplate.baseStats[statid] *= 2;
			}
			newTemplate.bst *= 2;
			return newTemplate;
		},
	},
	{
		name: "[Gen 8] Almost Any Ability (Official)",
		desc: "Pok&eacute;mon can use any ability, barring the few that are banned.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656414/">Almost Any Ability</a>`,
		],

		mod: 'gen8',
		searchShow: true,
		ruleset: ['[Gen 8] OU', '2 Ability Clause', '!Obtainable Abilities'],
		banlist: [
			'Archeops', 'Blacephalon', 'Buzzwole', 'Dragapult', 'Genesect', 'Gengar', 'Keldeo', 'Magearna', 'Naganadel', 'Noivern', 'Shedinja', 'Urshifu', 'Weavile', 'Zeraora', 'Zygarde',
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Gorilla Tactics', 'Huge Power', 'Ice Scales', 'Illusion',
			'Imposter', 'Innards Out', 'Intrepid Sword', 'Libero', 'Magic Bounce', 'Magnet Pull', 'Neutralizing Gas', 'Parental Bond',
			'Poison Heal', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Unburden', 'Water Bubble', 'Wonder Guard',
			'Electrify',
		],
		unbanlist: ['Darmanitan', 'Power Construct'],
	},
	{
		name: "[Gen 8] Alphabet Cup",
		desc: "Pok&eacute;mon may learn any move that starts with the same letter as their species.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3672756/">Alphabet Cup</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] OU'],
		banlist: ['Kartana', 'Pheromosa', 'Acupressure', 'Thousand Arrows'],
		restricted: ['Bolt Beak', 'Double-Iron Bash', 'Fishious Rend', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Surging Strikes'],
		unbanlist: ['Zamazenta'],
		checkCanLearn(move, template, lsetData, set) {
			let letters = template.id[0];
			let prevo = template;
			while (prevo.prevo) {
				prevo = this.dex.species.get(prevo.prevo);
				letters += prevo.id[0];
			}
			if (!move.isNonstandard && !move.isMax && !this.ruleTable.isRestricted('move:' + move.id) && letters.includes(move.id[0])) return null;
			return this.checkCanLearn(move, template, lsetData, set);
		},
	},
	{
		name: "[Gen 8] Balanced Hackmons",
	},
	{
		name: "[Gen 8] Bonus Type",
		desc: "Pok&eacute;mon gain an additional type by being nicknamed.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3683173/">Bonus Type</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] OU'],
		banlist: ['Dragapult', 'Kartana', 'Naganadel', 'Spectrier', 'Urshifu'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			const type = this.dex.types.get(target.set.name);
			if (!type.exists) return;
			return {...template, addedType: type.name};
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			if (pokemon.addedType) this.add('-start', pokemon, 'typeadd', pokemon.addedType);
		},
		onAfterMega(pokemon) {
			if (pokemon.addedType) this.add('-start', pokemon, 'typeadd', pokemon.addedType);
		},
	},
	{
		name: "[Gen 8] Broken Record",
		desc: "Pokémon can hold any TR to use it as a fifth move.",

		mod: 'brokenrecord',
		ruleset: ['[Gen 8] OU', '!Sleep Clause Mod', 'Sleep Moves Clause'],
		banlist: ['Dragapult', 'Kartana', 'Melmetal', 'Regieleki', 'Rillaboom', 'TR29 (Baton Pass)', 'TR82 (Stored Power)'],
		unbanlist: ['Zamazenta-Crowned'],
		onValidateTeam(team) {
			const itemTable: {[k: string]: number} = {};
			for (const set of team) {
				const item = this.toID(set.item);
				if (!itemTable[item]) itemTable[item] = 0;
				if (++itemTable[item] < 2) continue;
				if (this.dex.items.get(item).moveid) return ["You are limited to one of each TR.", "(You have more than one " + item.toUpperCase() + ".)"];
			}
		},
		onBegin() {
			for (const pokemon of this.p1.pokemon.concat(this.p2.pokemon)) {
				const moveid = pokemon.getItem().moveid;
				if (moveid && !pokemon.baseMoves.includes(moveid)) {
					const move = this.dex.moves.get(moveid);
					pokemon.baseMoveSlots.push({
						move: move.name,
						id: move.id,
						pp: move.pp * 8 / 5,
						maxpp: move.pp * 8 / 5,
						target: move.target,
						disabled: false,
						disabledSource: '',
						used: false,
					});
					pokemon.moveSlots = pokemon.baseMoveSlots.slice();
				}
			}
		},
	},
	{
		name: "[Gen 8] Camomons",
		desc: "Pok&eacute;mon change type to match their first two moves.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656413/">Camomons</a>`,
		],

		mod: 'gen8',
		searchShow: true,
		ruleset: ['[Gen 8] OU'],
		banlist: ['Dragonite', 'Hydreigon', 'Lycanroc-Dusk', 'Kyurem', 'Mew', 'Naganadel', 'Pheromosa', 'Shedinja', 'Tornadus-Therian', 'Volcarona', 'Zeraora', 'Calm Mind'],
		unbanlist: ['Melmetal'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			const types = [...new Set(target.set.moves.slice(0, 2).map(move => this.dex.moves.get(move).type))];
			return {...template, types};
		},
	},
	{
		name: "[Gen 8] Category Swap",
		desc: "All damaging moves have the opposite category.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3702709/">Category Swap</a>`,
		],

		mod: 'gen8',
		searchShow: true,
		ruleset: ['[Gen 8] OU'],
		banlist: ['Dragapult', 'Nidoking', 'Draco Meteor', 'Overheat', 'Slurpuff'],
		unbanlist: ['Cinderace', 'Marshadow', 'Naganadel', 'Spectrier', 'Zygarde'],
		onModifyMove(move) {
			move.category = ({Physical: 'Special', Special: 'Physical', Status: 'Status'} as {[id in MoveCategory]: MoveCategory})[move.category];
		},
	},
	{
		name: "[Gen 8] Challenge Cup",
	},
	{
		name: "[Gen 8] Challenge Cup 1v1",
	},
	{
		name: "[Gen 8] Challenge Cup 2v2",
	},
	{
		name: "[Gen 8] Chimera",
		desc: "Bring 6 Pok&eacute;mon and choose their order at Team Preview. The lead Pok&eacute;mon then receives the Item, Ability, Stats and Moves of the other five Pok&eacute;mon, who play no further part in the battle.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3661215/">Chimera 1v1</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] OU', 'Picked Team Size = 6'],
		banlist: ['Shedinja', 'Huge Power', 'Neutralizing Gas', 'Truant', 'Focus Sash', 'Bolt Beak', 'Disable', 'Double Iron Bash', 'Fishious Rend', 'Grass Whistle', 'Hypnosis', 'Lovely Kiss', 'Perish Song', 'Sing', 'Sleep Powder', 'Spore', 'Switcheroo', 'Transform', 'Trick'],
		unbanlist: ['Shadow Tag', 'Baton Pass'],
		onBeforeSwitchIn(pokemon) {
			const allies = pokemon.side.pokemon.splice(1);
			pokemon.side.pokemonLeft = 1;
			const newTemplate = this.dex.deepClone(pokemon.baseSpecies);
			newTemplate.baseStats = allies[2].baseSpecies.baseStats;
			newTemplate.bst = allies[2].baseSpecies.bst;
			newTemplate.baseSpecies = newTemplate.species += '-Chimera';
			pokemon.baseSpecies = newTemplate;
			pokemon.item = allies[0].item;
			pokemon.ability = pokemon.baseAbility = allies[1].ability;
			pokemon.set.evs = allies[2].set.evs;
			pokemon.set.nature = allies[2].set.nature;
			pokemon.set.ivs = allies[2].set.ivs;
			pokemon.hpType = pokemon.baseHpType = allies[2].baseHpType;
			pokemon.moveSlots = pokemon.baseMoveSlots = allies[3].baseMoveSlots.slice(0, 2).concat(allies[4].baseMoveSlots.slice(2)).filter((move, index, moveSlots) => moveSlots.find(othermove => othermove.id === move.id) === move);
			pokemon.maxhp = 0;
			pokemon.setSpecies(pokemon.baseSpecies, null);
		},
	},
	{
		name: "[Gen 8] Cross Evolution",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3657562/">Cross Evolution</a>`,
		],

		mod: 'gen8',
		ruleset: ['Standard', 'Dynamax Clause', 'Moody Clause', '2 Ability Clause', 'Overflow Stat Mod'],
		banlist: ['Corsola-Galar', 'Sneasel', 'Type: Null', 'Ice Scales', "King's Rock", 'Baton Pass'],
		restricted: ['Chansey', 'Lunala', 'Shedinja', 'Solgaleo', 'Gorilla Tactics', 'Huge Power', 'Pure Power', 'Shadow Tag'],
		onValidateTeam(team) {
			const nameTable: {[k: string]: boolean} = {};
			for (const {name} of team) {
				if (name) {
					if (nameTable[name]) {
						return ["Your Pokémon must have different nicknames.", "(You have more than one " + name + ")"];
					}
					nameTable[name] = true;
				}
			}
		},
		checkCanLearn(move, template, lsetData, set) {
			if (!set?.template || !set.crossTemplate) return this.checkCanLearn(move, template, lsetData, set);
			const problem = this.checkCanLearn(move, set.template);
			if (!problem) return null;
			if (!set.crossMovesLeft) return problem;
			if (this.checkCanLearn(move, set.crossTemplate)) return problem;
			set.crossMovesLeft--;
			return null;
		},
		validateSet(set, teamHas) {
			const crossTemplate = this.dex.species.get(set.name);
			if (!crossTemplate.exists || crossTemplate.isNonstandard) return this.validateSet(set, teamHas);
			const template = this.dex.species.get(set.species);
			if (!template.exists || template.isNonstandard || template === crossTemplate) return this.validateSet(set, teamHas);
			if (!template.nfe) return ["" + template.name + " cannot cross evolve because it doesn't evolve."];
			if (crossTemplate.battleOnly || crossTemplate.isNonstandard || !crossTemplate.prevo) return ["" + template.name + " cannot cross evolve into " + crossTemplate.name + " because it isn't an evolution."];
			if (this.ruleTable.isRestrictedSpecies(crossTemplate)) return ["" + template.name + " cannot cross evolve into " + crossTemplate.name + " because it is banned."];
			const crossPrevoTemplate = this.dex.species.get(crossTemplate.prevo);
			if (!crossPrevoTemplate.prevo !== !template.prevo) return ["" + template.name + " cannot cross evolve into " + crossTemplate.name + " because they are not consecutive evolutionary stages."];

			// Ability test
			const ability = this.dex.abilities.get(set.ability);
			if (!this.ruleTable.isBannedSpecies(template) && (!this.ruleTable.isRestricted('ability:' + ability.id) || Object.values(template.abilities).includes(ability.name))) set.species = crossTemplate.name;

			set.template = template;
			set.crossTemplate = crossTemplate;
			set.crossMovesLeft = 2;
			const problems = this.validateSet(set, teamHas);
			set.name = crossTemplate.name;
			set.species = template.name;
			return problems;
		},
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			if (target.set.name === target.set.species) return;
			const crossTemplate = this.dex.species.get(target.set.name);
			if (!crossTemplate.exists) return;
			if (template.battleOnly || !template.nfe) return;
			if (crossTemplate.battleOnly || crossTemplate.isNonstandard || !crossTemplate.prevo) return;
			const crossPrevoTemplate = this.dex.species.get(crossTemplate.prevo);
			if (!crossPrevoTemplate.prevo !== !template.prevo) return;

			const mixedTemplate = this.dex.deepClone(template);
			mixedTemplate.baseSpecies = mixedTemplate.name = template.name + '-' + crossTemplate.name;
			mixedTemplate.weighthg = Math.max(1, template.weighthg + crossTemplate.weighthg - crossPrevoTemplate.weighthg);
			mixedTemplate.nfe = false;
			mixedTemplate.evos = [];
			mixedTemplate.eggGroups = crossTemplate.eggGroups;
			mixedTemplate.abilities = crossTemplate.abilities;

			let statid: StatID;
			for (statid in template.baseStats) {
				mixedTemplate.baseStats[statid] = this.clampIntRange(template.baseStats[statid] + crossTemplate.baseStats[statid] - crossPrevoTemplate.baseStats[statid], 1, 255);
			}
			mixedTemplate.bst = mixedTemplate.baseStats.hp + mixedTemplate.baseStats.atk + mixedTemplate.baseStats.def + mixedTemplate.baseStats.spa + mixedTemplate.baseStats.spd + mixedTemplate.baseStats.spe;

			if (crossTemplate.types[0] !== crossPrevoTemplate.types[0]) mixedTemplate.types[0] = crossTemplate.types[0];
			if (crossTemplate.types[1] !== crossPrevoTemplate.types[1]) mixedTemplate.types[1] = crossTemplate.types[1] || crossTemplate.types[0];
			if (mixedTemplate.types[0] === mixedTemplate.types[1]) mixedTemplate.types.length = 1;

			target.m.crossEvolved = true;
			return mixedTemplate;
		},
		onBegin() {
			const allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (const pokemon of allPokemon) {
				pokemon.baseSpecies = pokemon.species;
			}
		},
	},
	{
		name: "[Gen 8] Doubles Hackmons Cup",
	},
	{
		name: "[Gen 8] First Blood",
		desc: "The first player to have a Pok&eacute;mon faint loses.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3682954/">First Blood</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] OU'],
		banlist: ['Heatran', 'Porygon-Z', 'Magnet Pull', 'Eject Button'],
		onFaint(pokemon) {
			pokemon.side.pokemonLeft = 0;
		},
	},
	{
		name: "[Gen 8] First Blood Random Battle",
		inherit: ["[Gen 8] First Blood"],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod', 'Dynamax Clause'],
		banlist: [],
	},
	{
		name: "[Gen 8] Flipped",
		desc: "Every Pok&eacute;mon's stats are reversed. HP becomes Spe, Atk becomes Sp. Def, Def becomes Sp. Atk, and vice versa. To see a Pok&eacute;mon's stats outside of battle, type <code>/dt [pokemon], flipped</code>.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3662020/">Flipped</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] OU'],
		banlist: ['Azumarill', 'Blissey', 'Steelix', 'Psychic Surge', 'Psychic Terrain', 'Shell Smash'],
		unbanlist: ['Cinderace', 'Darmanitan-Galar', 'Dracovish'],
		onModifySpecies(template, target, source, effect) {
			const newTemplate = this.dex.deepClone(template);
			const baseStats = template.baseStats;
			const spe = this.dex.species.get(target.set.species).baseStats.spe;
			newTemplate.baseStats = {hp: spe, atk: baseStats.spd, def: baseStats.spa, spa: baseStats.def, spd: baseStats.atk, spe: baseStats.hp};
			return newTemplate;
		},
	},
	{
		name: "[Gen 8] Godly Gift",
		desc: "Each Pok&eacute;mon receives one base stat from your God depending on its position in your team.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3660461/">Godly Gift</a>`,
		],

		mod: 'gen8',
		searchShow: true,
		ruleset: ['[Gen 8] OU', '!Sleep Clause Mod', 'Sleep Moves Clause'],
		banlist: ['Blissey', 'Calyrex-Shadow', 'Chansey', 'Crawdaunt', 'Dragapult', 'Eternatus', 'Hawlucha', 'Kyogre', 'Marowak-Alola', 'Melmetal', 'Nidoking', 'Nidoqueen', 'Pikachu', 'Toxapex', 'Xerneas', 'Zacian', 'Huge Power', 'Swift Swim', 'Focus Band', 'Quick Claw', 'Uber > 1', 'Uber ++ Power Construct'],
		unbanlist: ['Uber'],
		onModifySpecies(template, target, format, effect) {
			if (!target.side) return;
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			const uber = target.side.team.find(set => this.dex.species.get(set.species).tier === 'Uber') || target.side.team[0];
			const stat = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'][target.side.team.indexOf(target.set)] as StatID;
			const newTemplate = this.dex.deepClone(template);
			newTemplate.baseStats[stat] = this.dex.species.get(uber.species).baseStats[stat];
			newTemplate.bst += newTemplate.baseStats[stat] - template.baseStats[stat];
			return newTemplate;
		},
	},
	{
		name: "[Gen 8] Hackmons Cup",
	},
	{
		name: "[Gen 8] Inheritance",
		desc: "Pok&eacute;mon may use the ability and moves of another, except those that are restricted, as long as they forfeit their own learnset.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3565811/">Inheritance</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] OU', '!Sleep Clause Mod', 'Sleep Moves Clause'],
		banlist: ['Shedinja', 'Assist', 'Shell Smash', 'Imposter', 'Huge Power', 'Water Bubble', 'Innards Out'],
		restricted: ['Dracozolt', 'Dracovish'],
		getEvoFamily(species) {
			let template = Dex.species.get(species);
			while (template.prevo) {
				template = Dex.species.get(template.prevo);
			}
			return template.id;
		},
		validateSet(set, teamHas) {
			const abilityMap = this.format.abilityMap || Object.create(null);
			if (!this.format.abilityMap) {
				for (const speciesid in this.dex.data.Pokedex) {
					const pokemon = this.dex.data.Pokedex[speciesid];
					if (pokemon.num < 1 || pokemon.num > 898) continue;
					if (pokemon.requiredAbility || pokemon.requiredItem || pokemon.requiredMove || pokemon.battleOnly || ["Gmax", "Antique"].includes(pokemon.forme!)) continue;
					if (['Unreleased', 'Illegal', 'Uber'].includes(this.dex.data.FormatsData[speciesid].tier!)) continue;
					let key: AbilityIndex;
					for (key in pokemon.abilities) {
						const abilityId = this.toID(pokemon.abilities[key]);
						if (abilityMap[abilityId]) {
							abilityMap[abilityId][pokemon.evos ? 'push' : 'unshift'](speciesid);
						} else {
							abilityMap[abilityId] = [speciesid];
						}
					}
				}
				this.format.abilityMap = abilityMap;
			}

			let problems = this.validateForme(set);
			if (problems.length) return problems;

			const species = this.toID(set.species);
			const template = this.dex.species.get(species);
			if (!template.exists) return [`The Pokemon "${set.species}" does not exist.`];
			const problem = this.checkSpecies(set, template, template, {});
			if (problem) return [problem];

			const name = set.name;
			let canonicalSource = set.species;
			if (set.name === set.species) set.name = "";

			const abilityId = this.toID(set.ability);
			const pokemonWithAbility = abilityMap[abilityId];
			if (!pokemonWithAbility) return ["" + set.ability + " is an invalid ability."];
			const isBaseAbility = Object.values(template.abilities).map(this.toID).includes(abilityId);
			if (!isBaseAbility && this.ruleTable.isRestricted('ability:' + abilityId)) return ["" + set.ability + " is banned from being passed down."];

			const validSources: string[] = set.abilitySources = []; // evolutionary families
			for (const speciesid of pokemonWithAbility) {
				const donorTemplate = this.dex.species.get(speciesid);
				const evoFamily = this.format.getEvoFamily!(donorTemplate);

				if (validSources.includes(evoFamily)) {
					// The existence of a legal set has already been established.
					// We only keep iterating to find all legal donor families (Donor Clause).
					// Skip this redundant iteration.
					continue;
				}

				if (donorTemplate.id !== this.toID(set.species) && this.ruleTable.isRestrictedSpecies(donorTemplate)) {
					continue;
				}
				set.name = set.species = donorTemplate.name;
				if (!this.validateSet(set)) {
					canonicalSource = donorTemplate.name;
					validSources.push(evoFamily);
				}
				if (validSources.length > 1) {
					// Specific for the basic implementation of Donor Clause (see onValidateTeam).
					break;
				}
			}

			set.name = set.species = canonicalSource;
			problems = this.validateSet(set, teamHas)!;
			set.species = species;
			set.name = name;
			set.moves.unshift(canonicalSource);
			return problems;
		},
		onValidateTeam(team, format, teamHas) {
			// Donor Clause
			const evoFamilyLists = [];
			for (const set of team) {
				if (!set.abilitySources) continue;
				evoFamilyLists.push(new Set(set.abilitySources.map(format.getEvoFamily!)));
			}

			// Checking actual full incompatibility would require expensive algebra.
			// Instead, we only check the trivial case of multiple Pokémon only legal for exactly one family. FIXME?
			const requiredFamilies = Object.create(null);
			for (const evoFamily of evoFamilyLists) {
				if (evoFamily.size !== 1) continue;
				const evoFamilies = Array.from(evoFamily);
				if (requiredFamilies[evoFamilies[0]]) return ["You are limited to one inheritance from each family by the Donor Clause.", "(You inherit more than once from " + this.dex.species.get(evoFamilies[0]).name + "'s.)"];
				requiredFamilies[evoFamilies[0]] = 1;
			}
		},
		onBegin() {
			for (const pokemon of this.p1.pokemon.concat(this.p2.pokemon)) {
				pokemon.m.donorTemplate = pokemon.moves[0];
				pokemon.baseMoveSlots.shift();
				pokemon.moveSlots.shift();
			}
		},
		onSwitchIn(pokemon) {
			// Place volatiles on the Pokémon to show its donor
			this.add('-start', pokemon, pokemon.m.donorTemplate, '[silent]');
		},
		onSwitchOut(pokemon) {
			this.add('-end', pokemon, pokemon.m.donorTemplate, '[silent]');
		},
	},
	{
		name: "[Gen 8] Inverse Battle",
		desc: "The effectiveness of each attack is inverted.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3666858/">Inverse Battle</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] OU', 'Inverse Mod'],
		banlist: ['Cinderace', 'Diggersby', 'Dracozolt', 'Kartana', 'Kyurem-Base', 'Naganadel', 'Pheromosa', 'Porygon-Z', 'Regidrago', 'Regieleki', 'Reuniclus', 'Rillaboom', 'Spectrier'],
		unbanlist: ['Zygarde', 'Zamazenta-Crowned'],
	},
	{
		name: "[Gen 8] Inverse Random Battle",
		desc: "Battle with an inverted type chart.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3666858/">Inverse Battle</a>`,
		],

		team: 'random',
		mod: 'gen8',
		ruleset: ['Obtainable', 'Inverse Mod', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 8] Level Balanced Challenge Cup 1v1",

		mod: 'gen8',
		team: 'randomLBCC',
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview', 'Dynamax Clause', 'Picked Team Size = 1'],
	},
	{
		name: "[Gen 8] Level Balanced Hackmons Cup",
		desc: `Randomized teams of level-balanced Pok&eacute;mon with absolutely any ability, moves, and item.`,

		mod: 'gen8',
		team: 'randomLBHC',
		ruleset: ['Obtainable Formes', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 8] Linked",
		desc: "The first two moves in a Pok&eacute;mon's moveset are used simultaneously.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3660421/">Linked</a>`,
		],

		mod: 'linked',
		ruleset: ['[Gen 8] OU'],
		banlist: ['Cloyster', 'Kartana', 'Kyurem', 'Volcarona', 'Chlorophyll', 'Sand Rush', 'Slush Rush', 'Speed Boost', 'Surge Surfer', 'Swift Swim', 'Unburden'],
		restricted: ['Baneful Bunker', 'Bounce', 'Detect', 'Dig', 'Dive', 'Fly', "King's Shield", "Nature's Madness", 'Night Shade', 'Obstruct', 'Phantom Force', 'Protect', 'Seismic Toss', 'Shadow Force', 'Sky Drop', 'Spiky Shield', 'Super Fang', 'Trick Room'],
		onValidateSet(set, format) {
			const problems = [];
			for (const moveid of set.moves.slice(0, 2)) {
				if (this.ruleTable.isRestricted('move:' + moveid)) {
					const move = this.dex.moves.get(moveid);
					problems.push(`${set.name || set.species}'s move ${move.name} cannot be linked.`);
				}
			}
			return problems;
		},
	},
	{
		name: "[Gen 8] Max Berries",
		desc: "All berries have their effects maximised.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3677136/">Max Berries</a>`,
		],

		mod: 'maxberries',
		ruleset: ['[Gen 8] OU'],
		banlist: ['Magearna', 'Substitute', 'Jaboca Berry', 'Rowap Berry', 'Starf Berry'],
	},
	{
		name: "[Gen 8] Mix and Mega",
		desc: "Mega Stones can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656469/">Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3659028/">M&amp;M Resources</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] Ubers', 'Moody Clause', 'Overflow Stat Mod'],
		banlist: ['Calyrex-Shadow', 'Eternatus', 'Kyogre', 'Zacian', 'Electrify'],
		restricted: [
			'Beedrillite', 'Blazikenite', 'Gengarite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite',
			'Uber', 'Gengar', 'Melmetal', 'Regigigas', 'Urshifu-Rapid-Strike',
		],
		unbanlist: [
			'Darmanitan', 'Dracovish', 'Genesect', 'Landorus-Base', 'Magearna', 'Solgaleo', 'Spectrier', 'Zamazenta',
			'Abomasnow-Mega', 'Absol-Mega', 'Aerodactyl-Mega', 'Aggron-Mega', 'Alakazam-Mega', 'Altaria-Mega',
			'Audino-Mega', 'Blastoise-Mega', 'Blaziken-Mega', 'Charizard-Mega-X', 'Charizard-Mega-Y',
			'Diancie-Mega', 'Gallade-Mega', 'Garchomp-Mega', 'Gardevoir-Mega', 'Gengar-Mega', 'Glalie-Mega', 'Gyarados-Mega', 'Heracross-Mega',
			'Kangaskhan-Mega', 'Latias-Mega', 'Latios-Mega', 'Lopunny-Mega', 'Lucario-Mega', 'Manectric-Mega', 'Metagross-Mega', 'Mawile-Mega',
			'Mewtwo-Mega-X', 'Mewtwo-Mega-Y', 'Pinsir-Mega', 'Sableye-Mega', 'Salamence-Mega', 'Sceptile-Mega', 'Scizor-Mega',
			'Sharpedo-Mega', 'Slowbro-Mega', 'Steelix-Mega', 'Swampert-Mega', 'Tyranitar-Mega', 'Venusaur-Mega',
			'Abomasite', 'Absolite', 'Aerodactylite', 'Aggronite', 'Alakazite', 'Altarianite', 'Ampharosite',
			'Audinite', 'Banettite', 'Blastoisinite', 'Cameruptite', 'Charizardite X', 'Charizardite Y',
			'Diancite', 'Galladite', 'Garchompite', 'Gardevoirite', 'Glalitite', 'Gyaradosite', 'Heracronite',
			'Houndoominite', 'Latiasite', 'Latiosite', 'Lopunnite', 'Lucarionite', 'Manectite', 'Metagrossite',
			'Mewtwonite X', 'Mewtwonite Y', 'Pinsirite', 'Sablenite', 'Salamencite', 'Sceptilite', 'Scizorite',
			'Sharpedonite', 'Slowbronite', 'Steelixite', 'Swampertite', 'Tyranitarite', 'Venusaurite',
		],
		onValidateTeam(team) {
			const itemTable: {[k: string]: number} = {};
			for (const set of team) {
				const item = this.toID(set.item);
				if (!itemTable[item]) itemTable[item] = 0;
				if (++itemTable[item] < 2) continue;
				if (this.dex.items.get(item).megaStone) return ["You are limited to one of each Mega Stone.", "(You have more than one " + this.dex.items.get(item).name + ".)"];
			}
		},
		onValidateSet(set) {
			const template = this.dex.species.get(set.species || set.name);
			const item = this.dex.items.get(set.item);
			if (!item.megaStone) return;
			if (this.ruleTable.isRestrictedSpecies(template)) return [template.name + " is not allowed to hold a Mega Stone."];
			if (template.baseSpecies === item.megaEvolves) return;
			const ability = this.dex.species.get(item.megaStone).abilities[0];
			if (this.toID(set.ability) === this.toID(ability)) return;
			if (this.ruleTable.isRestricted('item:' + item.id)) {
				return ["You are only allowed to hold " + item.name + " if your Ability is " + ability + "."];
			}
		},
		onModifySpecies(template, target, format, effect) {
			if (effect?.effectType !== 'Item') return;
			const megaSpecies = effect.megaStone;
			if (!megaSpecies || megaSpecies === template.name) return;
			template = this.getMixedSpecies(template, megaSpecies);
			return template;
		},
		onBegin() {
			const allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (const pokemon of allPokemon) {
				pokemon.m.originalSpecies = pokemon.baseSpecies.name;
			}
		},
		onSwitchIn(pokemon) {
			const oMegaTemplate = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				// Place volatiles on the Pokémon to show its mega-evolved condition and details
				this.add('-start', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
				const oTemplate = this.dex.species.get(pokemon.m.originalSpecies);
				if (oTemplate.types.length !== pokemon.species.types.length || oTemplate.types[1] !== pokemon.species.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut(pokemon) {
			const oMegaTemplate = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				this.add('-end', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			}
		},
		actions: {
			canMegaEvo(pokemon) {
				if (pokemon.baseSpecies.isMega) return null;

				const item = pokemon.getItem();
				if (item.megaStone === pokemon.species.name) return null;
				return item.megaStone;
			},
			runMegaEvo(pokemon) {
				if (pokemon.baseSpecies.isMega) return false;
				const oMegaTemplate = this.dex.species.get(pokemon.canMegaEvo);
				const effect = this.dex.items.get(oMegaTemplate.requiredItem);
				const template = oMegaTemplate.baseSpecies === pokemon.species.baseSpecies ? oMegaTemplate : pokemon.baseSpecies;

				pokemon.formeChange(template, effect, true);
				pokemon.baseSpecies = pokemon.species;
				pokemon.baseAbility = pokemon.ability;

				// Do we have a proper sprite for it?
				if (this.dex.species.get(pokemon.canMegaEvo).baseSpecies !== pokemon.m.originalSpecies) {
					const oTemplate = this.dex.species.get(pokemon.m.originalSpecies);
					this.battle.add('-start', pokemon, oMegaTemplate.requiredItem, '[silent]');
					if (oTemplate.types.length !== pokemon.species.types.length || oTemplate.types[1] !== pokemon.species.types[1]) {
						this.battle.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
					}
				}

				pokemon.canMegaEvo = null;
				this.battle.runEvent('AfterMega', pokemon);
				return true;
			},
		},
		battle: {
			getMixedSpecies(originalSpecies, megaSpecies) {
				const originalTemplate = this.dex.species.get(originalSpecies);
				const megaTemplate = this.dex.species.get(megaSpecies);
				if (originalTemplate.baseSpecies === megaTemplate.baseSpecies) return megaTemplate;
				const deltas = this.getMegaDeltas(megaTemplate);
				const template = this.doGetMixedSpecies(originalTemplate, deltas);
				return template;
			},
			getMegaDeltas(megaTemplate) {
				const baseSpecies = this.dex.species.get(megaTemplate.baseSpecies);
				const deltas: MegaDeltas = {
					abilities: megaTemplate.abilities,
					baseStats: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
					weighthg: megaTemplate.weighthg - baseSpecies.weighthg,
					isMega: megaTemplate.forme,
					originalMega: megaTemplate.name,
					requiredItem: megaTemplate.requiredItem,
				};
				let statId: StatID;
				for (statId in megaTemplate.baseStats) {
					deltas.baseStats[statId] = megaTemplate.baseStats[statId] - baseSpecies.baseStats[statId];
				}
				if (megaTemplate.types.length > baseSpecies.types.length) {
					deltas.type = megaTemplate.types[1];
				} else if (megaTemplate.types.length < baseSpecies.types.length) {
					deltas.type = '';// baseSpecies.types[0];
				} else if (megaTemplate.types[1] !== baseSpecies.types[1]) {
					deltas.type = megaTemplate.types[1];
				}
				return deltas;
			},
			doGetMixedSpecies(template, deltas) {
				if (!deltas) throw new TypeError("Must specify deltas!");
				if (!template || typeof template === 'string') template = this.dex.species.get(template);
				const newTemplate = this.dex.deepClone(template);
				newTemplate.abilities = deltas.abilities;
				if (deltas.type === '' || deltas.type === newTemplate.types[0]) {
					newTemplate.types = newTemplate.types.slice(0, 1);
				} else if (deltas.type) {
					newTemplate.types[1] = deltas.type;
				}
				const baseStats = newTemplate.baseStats as StatsTable;
				let statName: StatID;
				for (statName in baseStats) {
					baseStats[statName] = this.clampIntRange(baseStats[statName] + deltas.baseStats[statName], 1, 255);
				}
				newTemplate.bst = newTemplate.baseStats.hp + newTemplate.baseStats.atk + newTemplate.baseStats.def + newTemplate.baseStats.spa + newTemplate.baseStats.spd + newTemplate.baseStats.spe;
				newTemplate.weighthg = Math.max(1, newTemplate.weighthg + deltas.weighthg);
				newTemplate.originalMega = deltas.originalMega;
				newTemplate.requiredItem = deltas.requiredItem;
				newTemplate.isMega = true;
				newTemplate.species += '-' + deltas.isMega;
				return newTemplate;
			},
		},
		pokemon: {
			getItem() {
				const item = this.battle.dex.items.get(this.item);
				if (item.megaStone) {
					const clone = this.battle.dex.deepClone(item);
					clone.onTakeItem = false;
					return clone;
				}
				return item;
			},
		},
	},
	{
		name: "[Gen 8] Monotype",
	},
	{
		name: "[Gen 8] Multibility",
		desc: "Multibility is a metagame where you sacrifice your item slot for a secondary ability.",

		mod: 'multibility',
		ruleset: ['[Gen 8] OU', '2 Ability Clause', 'Sleep Moves Clause', '!Sleep Clause Mod'],
		banlist: ['Kyurem-Black', 'Shedinja', 'Stench', 'Emergency Exit + Regenerator', 'Wimp Out + Regenerator'],
		restricted: ['Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Ice Scales', 'Illusion', 'Imposter', 'Innards Out', 'Intrepid Sword', 'Libero', 'Neutralizing Gas', 'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Tinted Lens', 'Unaware', 'Water Bubble', 'Wonder Guard'],
		unbanlist: ['Deoxys-Defense', 'Deoxys-Speed', 'Genesect', 'Greninja', 'Landorus'],
		validateSet(set, teamHas) {
			const setCopy = {...set};
			const problems = this.validateSet(setCopy, teamHas);
			if (setCopy.item) set.item = setCopy.item;
			return problems;
		},
		onChangeSet(set, format, setHas, teamHas) {
			const multibility = this.dex.abilities.get(set.item);
			if (multibility.exists) {
				set.item = '';
				const problem = this.checkAbility(set, multibility, setHas!);
				if (problem) return [problem];
			}
		},
		onValidateSet(set) {
			const ability = this.dex.abilities.get(set.ability);
			const item = this.dex.items.get(set.item);
			if (ability.id === item.id) return ["You are not allowed to have " + ability.name + " as both the Ability and the Multibility on the same Pokemon."];
		},
		onFaint(pokemon) {
			this.singleEvent('End', pokemon.getItem(), pokemon.itemState, pokemon);
		},
		onSwitchOut(pokemon) {
			this.singleEvent('End', pokemon.getItem(), pokemon.itemState, pokemon);
		},
		pokemon: {
		},
	},
	{
		name: "[Gen 8] Monotype Random Battle",
	},
	{
		name: "[Gen 8] National Dex Monotype",
	},
	{
		name: "[Gen 8] Nature Swap",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3673622/">Nature Swap</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] OU'],
		banlist: ['Blissey', 'Chansey', 'Cloyster', 'Melmetal'],
		battle: {
			natureModify(stats, set) {
				const nature = this.dex.natures.get(set.nature);
				if (nature.plus && nature.minus) {
					const stat = stats[nature.minus];
					stats[nature.minus] = stats[nature.plus];
					stats[nature.plus] = Math.floor(stat * 1.1);
				}
				return stats;
			},
		},
	},
	{
		name: "[Gen 8] Pacifistmons",
		desc: "Only status moves are allowed.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3658719/">Pacifistmons</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] Ubers'],
		banlist: [
			'Magic Guard', 'Magic Bounce', 'Regenerator',
			'Ingrain', 'Life Dew', 'move:Metronome', 'Moonlight', 'Morning Sun', 'Nature Power', 'Purify', 'Recover',
			'Rest', 'Roost', 'Slack Off', 'Soft-Boiled', 'Strength Sap', 'Swallow', 'Synthesis', 'Wish', 'Taunt',
		],
		onValidateSet(set) {
			const problems = [];
			for (const moveid of set.moves) {
				const move = this.dex.moves.get(moveid);
				if (move.category !== 'Status') problems.push(move.name + ' is banned because it is a ' + move.category + ' move.');
			}
			return problems;
		},
	},
	{
		name: "[Gen 8] Partners in Crime",
		desc: "Doubles-based metagame where both active ally Pok&eacute;mon share abilities and moves.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3664378/">Partners in Crime</a>`,
		],

		mod: 'pic',
		gameType: 'doubles',
		ruleset: ['[Gen 8] Doubles OU', 'Sleep Clause Mod'],
		banlist: ['Contrary', 'Huge Power', 'Imposter', 'Serene Grace', 'Wimp Out', 'Wonder Guard', 'Ally Switch', 'Bolt Beak', 'Fishious Rend', 'Mimic', 'Shell Smash', 'Sketch', 'Transform'],
		restricted: ['Receiver', 'Trace'],
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			if (this.p1.active.every(ally => ally && !ally.fainted)) {
				const p1a = this.p1.active[0], p1b = this.p1.active[1];
				if (p1a.ability !== p1b.ability) {
					const p1a_innate = 'ability:' + p1b.ability;
					p1a.volatiles[p1a_innate] = {id: p1a_innate, target: p1a};
					const p1b_innate = 'ability:' + p1a.ability;
					p1b.volatiles[p1b_innate] = {id: p1b_innate, target: p1b};
				}
			}
			if (this.p2.active.every(ally => ally && !ally.fainted)) {
				const p2a = this.p2.active[0], p2b = this.p2.active[1];
				if (p2a.ability !== p2b.ability) {
					const p2a_innate = 'ability:' + p2b.ability;
					p2a.volatiles[p2a_innate] = {id: p2a_innate, target: p2a};
					const p2b_innate = 'ability:' + p2a.ability;
					p2b.volatiles[p2b_innate] = {id: p2b_innate, target: p2b};
				}
			}
			const ally = pokemon.side.active.find(active => active && active !== pokemon && !active.fainted);
			if (ally && ally.ability !== pokemon.ability) {
				if (!pokemon.m.innate) {
					pokemon.m.innate = 'ability:' + ally.ability;
					delete pokemon.volatiles[pokemon.m.innate];
					pokemon.addVolatile(pokemon.m.innate);
				}
				if (!ally.m.innate) {
					ally.m.innate = 'ability:' + pokemon.ability;
					delete ally.volatiles[ally.m.innate];
					ally.addVolatile(ally.m.innate);
				}
			}
		},
		onSwitchOut(pokemon) {
			if (pokemon.m.innate) {
				pokemon.removeVolatile(pokemon.m.innate);
				delete pokemon.m.innate;
			}
			const ally = pokemon.side.active.find(active => active && active !== pokemon && !active.fainted);
			if (ally?.m.innate) {
				ally.removeVolatile(ally.m.innate);
				delete ally.m.innate;
			}
		},
		onFaint(pokemon) {
			if (pokemon.m.innate) {
				pokemon.removeVolatile(pokemon.m.innate);
				delete pokemon.m.innate;
			}
			const ally = pokemon.side.active.find(active => active && active !== pokemon && !active.fainted);
			if (ally?.m.innate) {
				ally.removeVolatile(ally.m.innate);
				delete ally.m.innate;
			}
		},
	},
	{
		name: "[Gen 8] Pokebilities",
		desc: "Pok&eacute;mon have all of their Abilities simultaneously, excluding unreleased or banned Abilities.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3679692/">Pok&eacute;bilities</a>`,
		],

		mod: 'pokebilities',
		ruleset: ['[Gen 8] OU', 'Evasion Abilities Clause'],
		banlist: ['Conkeldurr', 'Dracozolt', 'Excadrill', 'Porygon-Z'],
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				if (pokemon.ability === this.toID(pokemon.species.abilities['S'])) {
					pokemon.m.innates = [];
					continue;
				}
				pokemon.m.innates = (Object.keys(pokemon.species.abilities) as AbilityIndex[]).filter(key => key !== 'S' && (key !== 'H' || !pokemon.species.unreleasedHidden)).map(key => this.toID(pokemon.species.abilities[key])).filter(ability => ability !== pokemon.ability && !this.ruleTable.get('-ability:' + ability));
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			(pokemon.m.innates as string[]).forEach(innate => pokemon.addVolatile('ability:' + innate, pokemon));
		},
	},
	{
		name: "[Gen 8] Pure Hackmons",
		desc: "Anything that can be hacked in-game and is usable in local battles is allowed.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656851/">Pure Hackmons</a>`,
		],

		mod: 'gen8',
		searchShow: false,
		ruleset: ['-Nonexistent', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Endless Battle Clause'],
	},
	{
		name: "[Gen 8] Re-Evolution",
		desc: "Pok&eacute;mon gain stats equal to the difference with their previous stage.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3703643/">Re-Evolution</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] Ubers', 'Evasion Abilities Clause', 'Overflow Stat Mod'],
		banlist: ['Calyrex-Shadow', 'Darmanitan-Galar', 'Gyarados', 'Lunala', 'Milotic', 'Naganadel', 'Slowking-Galar', 'Solgaleo', 'Urshifu-Base', 'Volcarona', 'Zacian-Crowned', "King's Rock"],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			const baseSpecies = this.dex.species.get(template.baseSpecies);
			if (!baseSpecies.prevo) return;
			const prevo = this.dex.species.get(baseSpecies.prevo);
			const newTemplate = this.dex.deepClone(template);
			let stat: StatID;
			for (stat in prevo.baseStats) {
				newTemplate.baseStats[stat] = this.clampIntRange(newTemplate.baseStats[stat] + baseSpecies.baseStats[stat] - prevo.baseStats[stat], 1, 255);
			}
			newTemplate.bst = newTemplate.baseStats.hp + newTemplate.baseStats.atk + newTemplate.baseStats.def + newTemplate.baseStats.spa + newTemplate.baseStats.spd + newTemplate.baseStats.spe;
			return newTemplate;
		},
	},
	{
		name: "[Gen 8] Revelationmons",
		desc: "Each Pok&eacute;mon's first move is changed to its type. If it has a secondary type, then its second move is changed to that type.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3692297/">Revelationmons</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] OU', '!Sleep Clause Mod', 'Sleep Moves Clause'],
		banlist: ['Blacephalon', 'Dragapult', 'Dragonite', 'Kingdra', 'Kommo-o', 'Noivern', 'Polteageist', 'Thundurus-Therian', 'Magnet Pull'],
		unbanlist: ['Cinderace', 'Darmanitan-Galar-Zen'],
		restricted: ['Bolt Beak', 'Close Combat', 'U-Turn', 'Volt Switch'],
		onValidateSet(set) {
			const problems = [];
			for (const [index, moveid] of set.moves.slice(0, this.dex.species.get(set.species).types.length).entries()) {
				const move = this.dex.moves.get(moveid);
				if (this.ruleTable.isRestricted('move:' + move.id)) problems.push(`${set.name || set.species}'s move ${move.name} can't be in moveslot ${index + 1} because it's restricted.`);
			}
			return problems;
		},
		onModifyTypePriority: -2,
		onModifyType(move, pokemon) {
			if (['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball'].includes(move.id)) return;
			const index = pokemon.moves.indexOf(move.id);
			move.type = pokemon.getTypes()[index] || move.type;
		},
	},
	{
		name: "[Gen 8] Scalemons",
		desc: "Every Pok&eacute;mon has its stats (excluding HP) scaled to give a BST of near to 600.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3658482/">Scalemons</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] Ubers'],
		banlist: ['Crawdaunt', 'Darmanitan', 'Darumaka', 'Gastly', 'Arena Trap', 'Drizzle', 'Drought', 'Huge Power', 'Moody', 'Rain Dance', 'Sunny Day', 'Eviolite', 'Light Ball'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			const newTemplate = this.dex.deepClone(template);
			const stats: StatIDExceptHP[] = ['atk', 'def', 'spa', 'spd', 'spe'];
			const pst = template.bst - template.baseStats['hp'];
			const scale = 600 - template.baseStats['hp'];
			for (const stat of stats) {
				newTemplate.baseStats[stat] = this.clampIntRange(newTemplate.baseStats[stat] * scale / pst, 1, 255);
			}
			newTemplate.bst = newTemplate.baseStats.hp + newTemplate.baseStats.atk + newTemplate.baseStats.def + newTemplate.baseStats.spa + newTemplate.baseStats.spd + newTemplate.baseStats.spe;
			return newTemplate;
		},
	},
	{
		name: "[Gen 8] Shared Power",
		desc: "Once a Pok&eacute;mon swtiches in, its ability is shared with the rest of the team.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3623341/">Shared Power</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] OU', 'Evasion Abilities Clause'],
		banlist: [
			'Shedinja', 'Toxapex', 'Leppa Berry',
			'Contrary', 'Flare Boost', 'Fur Coat', 'Guts', 'Huge Power', 'Imposter', 'Innards Out',
			'Magic Bounce', 'Magic Guard', 'Mirror Armor', 'Mold Breaker', 'Neutralizing Gas', 'Sand Rush',
			'Simple', 'Slush Rush', 'Speed Boost', 'Stench', 'Tinted Lens', 'Trace', 'Unaware', 'Unburden', 'Water Bubble',
			'Chlorophyll ++ Drought', 'Drizzle ++ Swift Swim', 'Electric Surge ++ Surge Surfer', 'Emergency Exit ++ Regenerator', 'Regenerator ++ Wimp Out', 'Steelworker ++ Steely Spirit',
		],
		restricted: ['Mirror Armor', 'Trace'],
		unbanlist: ['Cinderace', 'Landorus-Base', 'Spectrier', 'Zygarde-Base'],
		field: {
			suppressingWeather() {
				for (const pokemon of this.battle.getAllActive()) {
					if (!pokemon.ignoringAbility() && pokemon.hasAbility('Cloud Nine')) {
						return true;
					}
				}
				return false;
			},
		},
		pokemon: {
			hasAbility(ability) {
				if (this.ignoringAbility()) return false;
				if (Array.isArray(ability)) return ability.some(this.hasAbility, this);
				ability = this.battle.toID(ability);
				return this.ability === ability || !!this.volatiles['ability:' + ability];
			},
			getSharedPower() {
				if (!this.side.sharedPower) this.side.sharedPower = new Set();
				if (!this.battle.ruleTable.isRestricted('ability:' + this.battle.toID(this.baseAbility))) this.side.sharedPower.add(this.baseAbility);
				const sharedPower = new Set(this.side.sharedPower);
				sharedPower.delete(this.baseAbility);
				return sharedPower;
			},
		},
		onBeforeSwitchIn(pokemon) {
			for (const ability of pokemon.getSharedPower()) {
				const effect = 'ability:' + ability;
				pokemon.volatiles[effect] = {id: effect, target: pokemon};
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			for (const ability of pokemon.getSharedPower()) {
				const effect = 'ability:' + ability;
				delete pokemon.volatiles[effect];
				pokemon.addVolatile(effect);
			}
		},
	},
	{
		name: "[Gen 8] Sketchmons",
		desc: "Each Pok&eacute;mon can learn Sketch once.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3680298/">Sketchmons</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] OU', '!Sleep Clause Mod', 'Sleep Moves Clause'],
		banlist: ['Cinderace', 'Dragapult', 'Hawlucha', 'Kartana', 'Porygon-Z', 'Rillaboom', 'Shedinja', 'Tapu Bulu', 'Urshifu-Single-Strike', 'Zeraora', 'Magnet Pull', 'Sand Rush'],
		restricted: ['Acupressure', 'Astral Barrage', 'Belly Drum', 'Bolt Beak', 'Clangorous Soul', 'Double Iron Bash', 'Electrify', 'Extreme Speed', 'Fishious Rend', 'Geomancy', 'Glacial Lance', 'Lovely Kiss', 'No Retreat', 'Octolock', 'Quiver Dance', 'Secret Sword', 'Shell Smash', 'Shift Gear', 'Sleep Powder', 'Spore', 'Thousand Arrows', 'Transform', 'V-Create', 'Wicked Blow'],
		validateSet(set, teamHas) {
			const problems = this.validateSet(set, teamHas);
			for (set.sketchMove of set.moves.map(this.toID)) {
				if (!this.validateSet(set)) return null;
			}
			delete set.sketchMove;
			return problems;
		},
		checkCanLearn(move, template, lsetData, set) {
			if (!set?.sketchMove || move.isZ || move.isMax || this.ruleTable.isRestricted('move:' + move.id)) return this.checkCanLearn(move, template, lsetData, set);
			if (move.id === set.sketchMove || !this.checkCanLearn(move, template, lsetData, set)) return null;
			return `${template.name}'s move ${move.name} can't be Sketched because it can only Sketch 1 move.`;
		},
		onValidateTeam(team, format, teamHas) {
			const sketches: {[k: string]: number} = {};
			for (const set of team) {
				if (set.sketchMove) {
					if (!sketches[set.sketchMove]) sketches[set.sketchMove] = 0;
					sketches[set.sketchMove]++;
				}
			}
			const overSketched = Object.keys(sketches).filter(move => sketches[move] > 1);
			if (overSketched.length) return overSketched.map(move => "You are limited to 1 of " + this.dex.moves.get(move).name + " by Sketch Clause. (You have sketched " + this.dex.moves.get(move).name + " " + sketches[move] + " times.)");
		},
	},
	{
		name: "[Gen 8] STABmons",
		desc: "Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656429/">STABmons</a>`,
		],

		mod: 'gen8',
		searchShow: true,
		ruleset: ['[Gen 8] OU', '!Sleep Clause Mod', 'Sleep Moves Clause'],
		banlist: ['Aegislash', 'Blacephalon', 'Dragapult', 'Dragonite', 'Garchomp', 'Kartana', 'Landorus-Therian', 'Naganadel', 'Porygon-Z', 'Silvally', 'Tapu Bulu', 'Tapu Lele', 'Thundurus-Base', 'Magnet Pull'],
		unbanlist: ['Melmetal'],
		restricted: ['Acupressure', 'Astral Barrage', 'Belly Drum', 'Bolt Beak', 'Clangorous Soul', 'Double Iron Bash', 'Electrify', 'Extreme Speed', 'Final Gambit', 'Fishious Rend', 'Geomancy', 'Glacial Lance', 'Oblivion Wing', 'Precipice Blades', 'Shell Smash', 'Shift Gear', 'Thousand Arrows', 'Thunderous Kick', 'V-Create', 'Wicked Blow'],
		checkCanLearn(move, template, lsetData, set) {
			if (!move.isMax && !this.ruleTable.isRestricted('move:' + move.id)) {
				for (let gen = this.dex.gen; gen >= template.gen && gen >= move.gen; gen--) {
					const dex = this.dex.forGen(gen);
					const species = this.dex.species.get(template.name);
					let types = species.types;
					if (species.prevo) types = types.concat(dex.species.get(dex.species.get(species.prevo).prevo || species.prevo).types);
					if (gen >= 5 && template.baseSpecies === 'Rotom') types = ['Electric', 'Ghost', 'Fire', 'Water', 'Ice', 'Flying', 'Grass'];
					if (template.baseSpecies === 'Shaymin') types = ['Grass', 'Flying'];
					if (template.baseSpecies === 'Hoopa') types = ['Psychic', 'Ghost', 'Dark'];
					if (template.baseSpecies === 'Oricorio') types = ['Fire', 'Flying', 'Electric', 'Psychic', 'Ghost'];
					if (template.baseSpecies === 'Necrozma') types = ['Psychic', 'Steel', 'Ghost'];
					if (template.baseSpecies === 'Arceus' || template.baseSpecies === 'Silvally' || types.includes(dex.moves.get(move.id).type)) return null;
				}
			}
			return this.checkCanLearn(move, template, lsetData, set);
		},
	},
	{
		name: "[Gen 8] Suicide Cup",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3657270/">Suicide Cup</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] Ubers', '!OHKO Clause', 'Adjust Level = 100', 'Picked Team Size = 6'],
		banlist: ['Shedinja', 'Infiltrator', 'Magic Guard', 'Explosion', 'Final Gambit', 'Healing Wish', 'Magic Room', 'Memento', 'Self Destruct', 'Choice Scarf'],
		unbanlist: ['Baton Pass'],
		onValidateTeam(team) {
			const familyTable: {[k: string]: boolean} = {};
			for (const set of team) {
				let template = this.dex.species.get(set.species);
				while (template.prevo) {
					template = this.dex.species.get(template.prevo);
				}
				if (familyTable[template.id]) return ["You are limited to one Pok&eacute;mon from each family by the Family Clause.", "(You have more than one evolution of " + template.name + ".)"];
				familyTable[template.id] = true;
			}
		},
		battle: {
			win(side) {
				if (this.ended) {
					return false;
				}
				if (side === 'p1' || side === 'p2') {
					side = this[side];
				}
				let foe = null;
				if (side === this.p1 || side === this.p2) {
					foe = side.foe;
				}
				this.winner = foe ? foe.name : '';

				this.add('');
				if (foe) {
					this.add('win', foe.name);
				} else {
					this.add('tie');
				}
				this.ended = true;
				this.requestState = '';
				for (const s of this.sides) {
					s.activeRequest = null;
				}
				return true;
			},
		},
	},
	{
		name: "[Gen 8] Tier Shift",
		desc: "Pok&eacute;mon below OU get all their stats boosted. UU/RBL get +10, RU/NUBL get +20, NU/PUBL get +30, and PU or lower get +40.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3662165/">Tier Shift</a>`,
		],

		mod: 'gen8',
		searchShow: true,
		ruleset: ['[Gen 8] OU', 'Overflow Stat Mod'],
		banlist: ['Damp Rock', 'Eviolite', 'Heat Rock'],
		unbanlist: ['Melmetal'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			if (!template.abilities) return;

			const boosts: {[k: string]: number} = {
				'UU': 10,
				'RUBL': 10,
				'RU': 20,
				'NUBL': 20,
				'NU': 30,
				'PUBL': 30,
				'PU': 40,
				'NFE': 40,
				'LC Uber': 40,
				'LC': 40,
			};
			const newTemplate = this.dex.deepClone(template);
			if (newTemplate.tier[0] === '(') newTemplate.tier = newTemplate.tier.slice(1, -1);
			if (!(newTemplate.tier in boosts)) return;
			if (target.set.moves.includes('lightclay') && boosts[newTemplate.tier] > 10) newTemplate.tier = 'RUBL';
			if (target.set.moves.includes('auroraveil') && boosts[newTemplate.tier] > 10) newTemplate.tier = 'NUBL';
			if (['Drizzle', 'Drought', 'Snow Warning'].includes(target.set.ability) && boosts[newTemplate.tier] > 20) newTemplate.tier = 'NUBL';

			const boost = boosts[newTemplate.tier];
			for (const statName of ['atk', 'def', 'spa', 'spd', 'spe']) {
				newTemplate.baseStats[statName] = this.clampIntRange(newTemplate.baseStats[statName] + boost, 1, 255);
			}
			newTemplate.bst = newTemplate.baseStats.hp + newTemplate.baseStats.atk + newTemplate.baseStats.def + newTemplate.baseStats.spa + newTemplate.baseStats.spd + newTemplate.baseStats.spe;
			return newTemplate;
		},
	},
	{
		name: "[Gen 8] Tier Shift Random Battle",
		inherit: ['[Gen 8] Tier Shift'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: [],
		unbanlist: [],
	},
	{
		name: "[Gen 8] Trademarked",
		desc: "Pok&eacute;mon may use any Status move as an Ability, excluding those that are banned.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3647897/">Trademarked</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] OU'],
		banlist: ['Dragapult', 'Kartana', 'Marowak-Alola', 'Spectrier', 'Victini', 'Zygarde-Base', 'Neutralizing Gas', 'Trace'],
		restricted: ['Baneful Bunker', 'Baton Pass', 'Block', 'Copycat', 'Corrosive Gas', 'Destiny Bond', 'Detect', 'Disable', 'Encore', 'Fairy Lock', 'Ingrain', 'Instruct', "King's Shield", 'Mat Block', 'Mean Look', 'Memento', 'move:Metronome', 'Nature Power', 'Obstruct', 'Octolock', 'Parting Shot', 'Protect', 'Psycho Shift', 'Recycle', 'Roar', 'Skill Swap', 'Spiky Shield', 'Sleep Talk', 'Substitute', 'Switcheroo', 'Teleport', 'Trick', 'Whirlwind', 'Wish', 'Yawn'],
		onValidateTeam(team, format, teamHas) {
			for (const trademark in teamHas.trademarks) {
				if (teamHas.trademarks[trademark] > 1) return ['You are limited to 1 of each Trademark. (You have ' + teamHas.trademarks[trademark] + ' of ' + trademark + ').'];
			}
		},
		validateSet(set, teamHas) {
			const move = this.dex.moves.get(set.ability);
			if (move.category !== 'Status' || move.status === 'slp' || this.ruleTable.isRestricted('move:' + move.id) || set.moves.map(this.toID).includes(move.id)) return this.validateSet(set, teamHas);
			const customRules = this.format.customRules || [];
			if (!customRules.includes('!obtainableabilities')) customRules.push('!obtainableabilities');
			const TeamValidator = this.constructor as new(format: string | Format) => TeamValidator;
			const validator = new TeamValidator(Dex.formats.get(this.format.id + '@@@' + customRules.join(',')));
			const moves = set.moves;
			set.moves = [set.ability];
			set.ability = '';
			let problems = validator.validateSet(set) || [];
			set.moves = moves;
			set.ability = '';
			problems = problems.concat(validator.validateSet(set, teamHas) || []);
			set.ability = move.id;
			if (!teamHas.trademarks) teamHas.trademarks = {};
			teamHas.trademarks[move.name] = (teamHas.trademarks[move.name] || 0) + 1;
			return problems.length ? problems : null;
		},
		pokemon: {
			getAbility() {
				const move = this.battle.dex.moves.get(this.ability);
				if (!move.exists) return this.battle.dex.abilities.get(this.ability);
				const abilityData: AbilityData = {
					id: move.id,
					name: move.name,
					fullname: 'ability: ' + move.name,
					effectType: 'Ability',
					exists: true,
					num: 0,
					gen: 0,
					sourceEffect: "",
					rating: 0,
					onStart(pokemon) {
						this.add('-activate', pokemon, 'ability: ' + move.name);
						this.actions.useMove(move.id, pokemon);
					},
					toString() {
						return ""; // for useMove
					},
				};
				return abilityData as Ability;
			},
		},
	},

	// USM Singles
	///////////////////////////////////////////////////////////////////

	{
		section: "USM Singles",
		column: 2,
	},
	{
		name: "[Gen 7] Random Battle",
	},
	{
		name: "[Gen 7] Unrated Random Battle",

		mod: 'gen7',
		team: 'random',
		challengeShow: false,
		rated: false,
		ruleset: ['PotD', 'Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Battle Factory",
	},
	{
		name: "[Gen 7] OU",
		searchShow: true,
	},
	{
		name: "[Gen 7] OU (Blitz)",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3646999/">OU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3621329/">OU Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3638845/">OU Sample Teams</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU', 'Blitz'],
	},
	{
		name: "[Gen 7] Ubers",
		searchShow: true,
	},
	{
		name: "[Gen 7] UU",
		searchShow: true,
	},
	{
		name: "[Gen 7] RU",
		searchShow: true,
	},
	{
		name: "[Gen 7] NU",
		searchShow: true,
	},
	{
		name: "[Gen 7] PU",
		searchShow: true,
	},
	{
		name: "[Gen 7] ZU",
		searchShow: true,
	},
	{
		name: "[Gen 7] NFE",
		desc: "Only Pok&eacute;mon that can evolve are allowed.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3648183/">NFE</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU', 'Not Fully Evolved'],
		banlist: [
			'Chansey', 'Doublade', 'Gligar', 'Golbat', 'Gurdurr', 'Magneton', 'Piloswine',
			'Porygon2', 'Rhydon', 'Scyther', 'Sneasel', 'Type: Null', 'Vigoroth',
			'Drought', 'Aurora Veil',
		],
	},
	{
		name: "[Gen 7] LC",
		searchShow: true,
	},
	{
		name: "[Gen 7] LC UU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3628499/">LC UU</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] LC'],
		banlist: [
			"Abra", "Anorith", "Bunnelby", "Carvanha", "Chinchou", "Corphish", "Croagunk", "Dewpider", "Diglett-Base",
			"Doduo", "Drilbur", "Dwebble", "Elekid", "Ferroseed", "Foongus", "Gastly", "Grimer-Alola", "Magnemite", "Mareanie",
			"Meowth-Base", "Mienfoo", "Mudbray", "Onix", "Pawniard", "Pikipek", "Ponyta", "Pumpkaboo-Super", "Scraggy", "Shellder",
			"Snivy", "Snubbull", "Spritzee", "Staryu", "Surskit", "Timburr", "Tirtouga", "Vullaby", "Vulpix-Alola", "Zigzagoon",
			// LC UUBL
			"Magby", "Rufflet", "Wynaut", "Deep Sea Tooth",
		],
	},
	{
		name: "[Gen 7] Anything Goes",
		searchShow: true,
	},
	{
		name: "[Gen 7] Battle Spot Singles",
		searchShow: true,
	},
	{
		name: "[Gen 7] BSS Factory",
		searchShow: true,
	},
	{
		name: "[Gen 7] Alola Friendly",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3591710/">Alola Friendly</a>`,
		],

		mod: 'gen7',
		ruleset: ['Obtainable', 'Species Clause', 'Nickname Clause', 'Item Clause', 'Team Preview', 'Cancel Mod', 'Alola Pokedex', 'Adjust Level Down = 50', 'Picked Team Size = Auto', 'Min Source Gen = 7'],
		banlist: ['Solgaleo', 'Lunala', 'Necrozma', 'Magearna', 'Marshadow', 'Zygarde', 'Mega'],
	},
	{
		name: "[Gen 7] Battle Spot Special 2",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3592974/">Battle Spot Special</a>`,
		],

		mod: 'gen7',
		ruleset: ['Obtainable', 'Species Clause', 'Nickname Clause', 'Item Clause', 'Team Preview', 'Cancel Mod', 'Adjust Level Down = 50', 'Picked Team Size = Auto'],
		banlist: [
			'Soul Dew', 'Battle Bond',
			'Mewtwo + Mew + Lugia + Ho-Oh + Celebi + Kyogre + Groudon + Rayquaza + Jirachi + Deoxys + Dialga + Palkia + Giratina + Phione + Manaphy + Darkrai + Shaymin + Arceus + Victini + Reshiram + Zekrom + Kyurem + Keldeo + Meloetta + Genesect + Xerneas + Yveltal + Zygarde + Diancie + Hoopa + Volcanion + Cosmog + Cosmoem + Solgaleo + Lunala + Necrozma + Magearna > 1',
		],
	},
	{
		name: "[Gen 7] CAP",
		searchShow: true,
	},
	{
		name: "[Gen 7] CAP LC",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3599594/">CAP LC</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] LC', '+CAP'],
	},
	{
		name: "[Gen 7] Hackmons Cup",
	},
	{
		name: "[Gen 7] Custom Game",
	},

	// USM Doubles
	///////////////////////////////////////////////////////////////////

	{
		section: "USM Doubles",
		column: 1,
	},
	{
		name: "[Gen 7] Random Doubles Battle",
	},
	{
		name: "[Gen 7] Doubles OU",
		searchShow: true,
	},
	{
		name: "[Gen 7] Doubles Ubers",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3635755/">Doubles Ubers</a>`,
		],

		mod: 'gen7',
		gameType: 'doubles',
		ruleset: ['Standard Doubles'],
		banlist: ['Dark Void'],
	},
	{
		name: "[Gen 7] Doubles UU",
		searchShow: true,
	},
	{
		name: "[Gen 7] VGC 2017",
	},
	{
		name: "[Gen 7] VGC 2018",
	},
	{
		name: "[Gen 7] VGC 2019 Sun Series",

		mod: 'gen7',
		gameType: 'doubles',
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Min Source Gen = 7', 'VGC Timer', 'Limit Two Restricted'],
		banlist: ['Unown', 'Dragon Ascent', 'Custap Berry', 'Enigma Berry', 'Jaboca Berry', 'Micle Berry', 'Rowap Berry'],
		restricted: ['Restricted Legendary'],
		onValidateTeam(team) {
			let n = 0;
			const problems = [];
			for (const set of team) {
				const species = this.dex.species.get(set.species);
				if (this.ruleTable.isRestrictedSpecies(species)) n++;
				const item = this.dex.items.get(set.item);
				if (item.zMove || item.megaStone || ['redorb', 'blueorb'].includes(item.id)) problems.push(`${set.name || set.species}'s item ${item.name} is banned.`);
			}
			if (n > 2) problems.push(`You can only use up to two legendary Pok\u00E9mon.`);
			return problems;
		},
	},
	{
		name: "[Gen 7] VGC 2019 Moon Series",

		mod: 'gen7',
		gameType: 'doubles',
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Min Source Gen = 7', 'VGC Timer', 'Limit Two Restricted'],
		banlist: ['Unown', 'Dragon Ascent'],
		restricted: ['Restricted Legendary'],
		onValidateTeam(team) {
			let n = 0;
			const problems = [];
			for (const set of team) {
				const species = this.dex.species.get(set.species);
				if (this.ruleTable.isRestrictedSpecies(species)) n++;
				const item = this.dex.items.get(set.item);
				if (item.megaStone || ['redorb', 'blueorb', 'ultranecroziumz'].includes(item.id)) problems.push(`${set.name || set.species}'s item ${item.name} is banned.`);
			}
			if (n > 2) problems.push(`You can only use up to two legendary Pok\u00E9mon.`);
			return problems;
		},
	},
	{
		name: "[Gen 7] VGC 2019 Ultra Series",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3641100/">VGC 2019 Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3641123/">VGC 2019 Viability Rankings</a>`,
		],

		mod: 'gen7',
		gameType: 'doubles',
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Min Source Gen = 7', 'VGC Timer', 'Limit Two Restricted'],
		banlist: ['Unown'],
		restricted: ['Restricted Legendary'],
		onValidateTeam(team) {
			let n = 0;
			for (const set of team) {
				const species = this.dex.species.get(set.species);
				if (this.ruleTable.isRestrictedSpecies(species)) n++;
				if (n > 2) return [`You can only use up to two legendary Pok\u00E9mon.`];
			}
		},
	},
	{
		name: "[Gen 7] Battle Spot Doubles",
	},
	{
		name: "[Gen 7] Mega Melee",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3613480/">Mega Melee</a>`,
		],

		mod: 'gen7',
		ruleset: ['Flat Rules', 'Min Team Size = 3', '!!Picked Team Size = 1'],
		onValidateSet(set, format) {
			const template = this.dex.species.get(set.species || set.name);
			if (!template.otherFormes || !this.dex.species.get(template.otherFormes[0]).isMega) {
				return [`${set.name || set.species} can't Mega Evolve and is banned in ${format.name}.`];
			}
		},
	},
	{
		name: "[Gen 7] tiny tourney",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3605226/">tiny tourney Discussion</a>`,
		],

		mod: 'gen7',
		gameType: 'doubles',
		ruleset: ['Flat Rules', '!!Adjust Level = 50'],
		banlist: ['Mega'],
		onValidateSet(set) {
			const template = this.dex.species.get(set.species || set.name);
			if (template.heightm > 1) return [`${set.name || set.species} is over 1.0 m tall, which is banned in tiny tourney.`];
		},
	},
	{
		name: "[Gen 7] Simple Symphony",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3645825/">Simple Symphony Discussion</a>`,
		],

		mod: 'gen7',
		ruleset: ['Flat Rules', '!!Adjust Level = 50'],
		banlist: ['Darmanitan'],
		onValidateSet(set, format) {
			const template = this.dex.species.get(set.species);
			if (!template.types) return [`Invalid pokemon ${set.name || set.species}`];
			if (template.types.length > 1) return [`${template.name} is dual-type, and cannot participate in ${format.name}.`];
			if (set.item) {
				const item = this.dex.items.get(set.item);
				if (item.megaStone) return [`${set.name || set.species} has ${item.name}, which is banned in ${format.name}.`];
			}
		},
	},
	{
		name: "[Gen 7] Doubles Hackmons Cup",

		mod: 'gen7',
		gameType: 'doubles',
		team: 'randomHC',
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Doubles Custom Game",
	},

	// Brilliant Diamond/Shining Pearl
	///////////////////////////////////////////////////////////////////

	{
		section: "BD/SP",
		column: 3,
	},
	{
		name: "[Gen 8 BDSP] Random Battle",
	},
	{
		name: "[Gen 8 BDSP] OU",
	},
	{
		name: "[Gen 8 BDSP] Ubers",
		searchShow: true,
	},
	{
		name: "[Gen 8 BDSP] UU",
		searchShow: true,
	},
	{
		name: "[Gen 8 BDSP] RU",
		searchShow: true,
	},
	{
		name: "[Gen 8 BDSP] NU",
		searchShow: true,
	},
	{
		name: "[Gen 8 BDSP] PU",
		searchShow: true,
	},
	{
		name: "[Gen 8 BDSP] LC",
		searchShow: true,
	},
	{
		name: "[Gen 8 BDSP] Monotype",
		searchShow: true,
	},
	{
		name: "[Gen 8 BDSP] CAP",
		searchShow: true,
	},
	{
		name: "[Gen 8 BDSP] Doubles OU",
	},
	{
		name: "[Gen 8 BDSP] Battle Festival Doubles",
		searchShow: true,
	},

	// Let's Go!
	///////////////////////////////////////////////////////////////////

	{
		section: "Let's Go!",
		column: 3,
	},
	{
		name: "[Gen 7 Let's Go] Random Battle",
		searchShow: true,
	},
	{
		name: "[Gen 7 Let's Go] OU",
	},
	{
		name: "[Gen 7 Let's Go] Singles No Restrictions",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3643931/">Let's Go! Discussion</a>`,
		],

		mod: 'gen7letsgo',
		ruleset: ['Obtainable', 'Allow AVs', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7 Let's Go] Doubles No Restrictions",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3643931/">Let's Go! Discussion</a>`,
		],

		mod: 'gen7letsgo',
		gameType: 'doubles',
		ruleset: ['Obtainable', 'Allow AVs', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7 Let's Go] 1v1",
		desc: "Bring three Pok&eacute;mon to Team Preview and choose one to battle.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587523/">1v1</a>`,
		],

		mod: 'gen7letsgo',
		ruleset: ['Obtainable', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Accuracy Moves Clause', 'Swagger Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview', 'Max Team Size = 3', 'Picked Team Size = 1', 'Adjust Level = 50'],
		banlist: ['Charizard', 'Mewtwo', 'Hypnosis', 'Lovely Kiss', 'Sing', 'Sleep Powder'],
	},
	{
		name: "[Gen 7] Let's Go! Cup",
		desc: "Bring either Pikachu or Eevee.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3639342/">Let's Go! Cup</a>`,
		],

		mod: 'gen7',
		ruleset: ['Obtainable', 'Cancel Mod', 'Adjust Level = 50', 'Max Team Size = 1'],
		banlist: ['All Pokemon'],
		unbanlist: ['Eevee', 'Pikachu'],
	},
	{
		name: "[Gen 7 Let's Go] Hackmons",
		desc: "Anything that can be hacked in-game and is usable in local battles is allowed.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/posts/7973280/">Let's Go Hackmons</a>`,
		],

		mod: 'gen7letsgo',
		ruleset: ['-Nonexistent', 'Allow AVs', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
	},

	// XY Singles
	///////////////////////////////////////////////////////////////////

	{
		section: "ORAS Singles",
		column: 4,
	},
	{
		name: "[Gen 6] Random Battle",
		searchShow: true,
	},
	{
		name: "[Gen 6] Battle Factory",
		searchShow: true,
	},
	{
		name: "[Gen 6] OU",
		searchShow: true,
	},
	{
		name: "[Gen 6] OU (no Mega)",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3536150/">OU (no Mega) Viability Ranking</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Mega'],
	},
	{
		name: "[Gen 6] Ubers",
		searchShow: true,
	},
	{
		name: "[Gen 6] UU",
		searchShow: true,
	},
	{
		name: "[Gen 6] RU",
		searchShow: true,
	},
	{
		name: "[Gen 6] NU",
		searchShow: true,
	},
	{
		name: "[Gen 6] PU",
		searchShow: true,
	},
	{
		name: "[Gen 6] NFE",
		desc: "Only Pok&eacute;mon that can evolve are allowed.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656369/">NFE</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU', 'Not Fully Evolved'],
		banlist: [
			'Chansey', 'Doublade', 'Fletchinder', 'Gligar', 'Golbat', 'Gurdurr',
			'Haunter', 'Machoke', 'Magneton', 'Monferno', 'Pawniard', 'Piloswine',
			'Porygon2', 'Rhydon', 'Scyther', 'Servine', 'Sneasel', 'Vigoroth',
			'Drought',
		],
	},
	{
		name: "[Gen 6] LC",
		searchShow: true,
	},
	{
		name: "[Gen 6] LC UU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3562639/">LC UU</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3562640/">LC UU Viability Ranking</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] LC'],
		banlist: [
			'Abra', 'Aipom', 'Anorith', 'Archen', 'Bunnelby', 'Carvanha', 'Chinchou', 'Cottonee', 'Croagunk', 'Diglett',
			'Drilbur', 'Dwebble', 'Elekid', 'Ferroseed', 'Fletchling', 'Foongus', 'Gastly', 'Gothita', 'Honedge',
			'Larvesta', 'Magnemite', 'Mienfoo', 'Munchlax', 'Omanyte', 'Onix', 'Pawniard', 'Ponyta', 'Porygon', 'Scraggy',
			'Shellder', 'Snivy', 'Snubbull', 'Spritzee', 'Staryu', 'Stunky', 'Surskit', 'Timburr', 'Tirtouga', 'Vullaby',
			'Corphish', 'Houndour', 'Pancham', 'Skrelp', 'Vulpix', 'Zigzagoon', 'Shell Smash', 'Sticky Web',
		],
	},
	// Anything Goes - Old Gens
	{
		name: "[Gen 6] Battle Spot Singles",
		searchShow: true,
	},
	{
		name: "[Gen 6] CAP",
	},
	{
		name: "[Gen 6] Hackmons Cup",
		desc: "Randomized teams of level-balanced Pok&eacute;mon with absolutely any ability, moves, and item.",

		mod: 'gen6',
		team: 'randomHC',
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 6] Custom Game",
	},

	// XY Doubles/Triples
	///////////////////////////////////////////////////////////////////

	{
		section: "ORAS Doubles/Triples",
		column: 4,
	},
	{
		name: "[Gen 6] Random Doubles Battle",

		mod: 'gen6',
		gameType: 'doubles',
		team: 'random',
		ruleset: ['PotD', 'Obtainable', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 6] Doubles OU",
		searchShow: true,
	},
	{
		name: "[Gen 6] Doubles Ubers",
		threads: [
			`&bullet; <a href="http://www.smogon.com/forums/threads/3542746/">ORAS Doubles Ubers</a>`,
		],

		mod: 'gen6',
		gameType: 'doubles',
		ruleset: ['Standard Doubles'],
		banlist: ['Dark Void'],
	},
	{
		name: "[Gen 6] Doubles UU",
		threads: [
			`&bullet; <a href="http://www.smogon.com/forums/threads/3542755/">ORAS Doubles UU</a>`,
		],

		mod: 'gen6',
		gameType: 'doubles',
		ruleset: ['[Gen 6] Doubles OU'],
		banlist: [
			'Aegislash', 'Amoonguss', 'Arcanine', 'Azumarill', 'Bisharp', 'Breloom', 'Charizard-Mega-Y', 'Charizardite Y',
			'Conkeldurr', 'Cresselia', 'Diancie-Mega', 'Diancite', 'Ferrothorn', 'Garchomp', 'Gardevoir-Mega', 'Gardevoirite',
			'Gastrodon', 'Gengar', 'Greninja', 'Heatran', 'Hitmontop', 'Hoopa-Unbound', 'Hydreigon', 'Jirachi',
			'Kangaskhan-Mega', 'Kangaskhanite', 'Keldeo', 'Kyurem-Black', 'Landorus-Therian', 'Latios', 'Ludicolo', 'Milotic',
			'Politoed', 'Raichu', 'Rotom-Wash', 'Scizor', 'Scrafty', 'Shaymin-Sky', 'Suicune', 'Sylveon', 'Talonflame',
			'Terrakion', 'Thundurus', 'Togekiss', 'Tyranitar', 'Venusaur', 'Volcanion', 'Weavile', 'Whimsicott', 'Zapdos',
		],
	},
	{
		name: "[Gen 6] Doubles NU",

		mod: 'gen6',
		gameType: 'doubles',
		ruleset: ['[Gen 6] Doubles UU'],
		banlist: [
			'Abomasnow-Mega', 'Abomasite', 'Aerodactyl-Mega', 'Aerodactylite', 'Altaria-Mega', 'Altarianite', 'Ambipom', 'Aromatisse',
			'Aurorus', 'Blastoise-Mega', 'Blastoisinite', 'Bronzong', 'Clawitzer', 'Cofagrigus', 'Cradily', 'Crawdaunt', 'Crobat',
			'Deoxys-Attack', 'Dusclops', 'Eelektross', 'Entei', 'Escavalier', 'Espeon', 'Excadrill', 'Genesect', 'Hariyama', 'Infernape',
			'Jellicent', 'Jolteon', 'Klefki', 'Krookodile', 'Latias', 'Liepard', 'Lopunny-Mega', 'Lopunnite', 'Machamp', 'Malamar',
			'Manaphy', 'Meowstic', 'Metagross-Mega', 'Metagrossite', 'Mew', 'Murkrow', 'Ninetales', 'Reuniclus', 'Rhyperior', 'Rotom-Heat',
			'Sableye', 'Salamence', 'Sceptile-Mega', 'Sceptilite', 'Snorlax', 'Togetic', 'Tornadus', 'Vaporeon', 'Victini', 'Volcarona',
		],
	},
	{
		name: "[Gen 6] VGC 2016",
	},
	{
		name: "[Gen 6] Battle Spot Doubles",
	},
	{
		name: "[Gen 6] Doubles Hackmons Cup",
		desc: "Randomized teams of level-balanced Pok&eacute;mon with absolutely any ability, moves, and item.",

		mod: 'gen6',
		gameType: 'doubles',
		team: 'randomHC',
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 6] Doubles Custom Game",
	},
	{
		name: "[Gen 6] Pikachu Cup",
		desc: "Mono-electric doubles tournament.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3545810/">Pikachu Cup</a>`,
		],

		mod: 'gen6',
		gameType: 'doubles',
		ruleset: ['Flat Rules'],
		banlist: ['Raikou', 'Thundurus', 'Thundurus-Therian', 'Zapdos'],
		onValidateSet(set) {
			const template = this.dex.species.get(set.species);
			if (!template.types || !template.types.includes('Electric')) return [template.name + " is not allowed because it does not have Electric type."];
		},
	},

	// XY Triples
	///////////////////////////////////////////////////////////////////

	{
		name: "[Gen 6] Random Triples Battle",
		inherit: ['[Gen 6] Random Doubles Battle'],

		gameType: 'triples',
	},
	// Smogon Triples - Old Gens
	{
		name: "[Gen 6] Battle Spot Triples",
	},
	{
		name: "[Gen 6] Triples Hackmons Cup",
		desc: "Randomized teams of level-balanced Pok&eacute;mon with absolutely any ability, moves, and item.",

		mod: 'gen6',
		gameType: 'triples',
		team: 'randomHC',
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 6] Triples Custom Game",
	},

	// Other Metagames
	///////////////////////////////////////////////////////////////////

	{
		section: 'USM Other Metagames',
		column: 2,
	},
	{
		name: "[Gen 7] 1v1",
		searchShow: true,
	},
	{
		name: "[Gen 7] 1v1 UU",
		desc: "Bring three Pok&eacute;mon to Team Preview and choose one to battle.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3612051/">UU OMs Mega Thread</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] 1v1'],
		banlist: [
			'Charizard-Mega-X', 'Charizard-Mega-Y', 'Donphan', 'Dragonite', 'Gardevoir-Mega', 'Greninja', 'Gyarados-Mega',
			'Lopunny-Mega', 'Magearna', 'Magnezone', 'Mawile-Mega', 'Metagross-Mega',
			'Porygon-Z', 'Tapu Fini', 'Tapu Lele', 'Venusaur-Mega', 'Victini', 'Zygarde',
		],
	},
	{
		name: "[Gen 7] 350 Cup",
		desc: "Pok&eacute;mon with a base stat of 350 or lower get their stats doubled.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3589641/">350 Cup</a>`,
		],

		ruleset: ['[Gen 7] Ubers'],
		banlist: [
			'Pawniard', 'Rufflet', 'Arena Trap', 'Shadow Tag', 'Deep Sea Tooth', 'Eevium Z', 'Eviolite', 'Light Ball',
		],

		mod: 'gen7',
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;

			if (!template.abilities) return;

			if (template.id === 'wishiwashischool') {
				const newTemplate = this.dex.deepClone(template);
				newTemplate.bst += newTemplate.baseStats.hp;
				newTemplate.baseStats.hp *= 2;
				return newTemplate;
			}

			if (template.bst > 350) return;

			const newTemplate = this.dex.deepClone(template);
			for (const statid of ['hp', 'atk', 'def', 'spa', 'spd', 'spe']) {
				newTemplate.baseStats[statid] *= 2;
			}
			newTemplate.bst *= 2;
			return newTemplate;
		},
	},
	{
		name: "[Gen 7] Accessorize",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3628762/">Accessorize</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		accessories: {
			charcoal: {type: "Fire", atk: 25, def: -5, spa: 25, spd: -5},
			spelltag: {type: "Ghost", atk: 25, def: -5, spa: 25, spd: -5},
			mysticwater: {type: "Water", spa: 20, spd: 30, spe: -10},
			hardstone: {type: "Rock", atk: 20, def: 30, spe: -10},
			magnet: {type: "Electric", def: -5, spa: 20, spd: -5, spe: 30},
			sharpbeak: {type: "Flying", atk: 20, def: -5, spd: -5, spe: 30},
			cherishball: {type: "Fairy", def: 25, spd: 25, spe: -10},
			metalcoat: {type: "Steel", def: 25, spd: 25, spe: -10},
			twistedspoon: {type: "Psychic", def: -10, spa: 25, spd: 10, spe: 15},
			silverpowder: {type: "Bug", atk: 25, def: 10, spd: -10, spe: 15},
			silkscarf: {type: "Normal", atk: 10, def: -10, spa: 30, spd: 10},
			softsand: {type: "Ground", atk: 30, def: 10, spa: 10, spd: -10},
			miracleseed: {type: "Grass", def: 15, spa: 20, spd: 15, spe: -10},
			poisonbarb: {type: "Poison", atk: 20, def: 15, spd: 15, spe: -10},
			dragonfang: {type: "Dragon", atk: 20, def: -5, spa: 20, spd: -5, spe: 10},
			nevermeltice: {type: "Ice", atk: 20, def: -5, spa: 20, spd: -5, spe: 10},
			blackglasses: {type: "Dark", def: -10, spa: 30, spd: 15, spe: 5},
			blackbelt: {type: "Fighting", atk: 30, def: 15, spd: -10, spe: 5},
		},
		restricted: ['Chatter', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Thousand Arrows'],
		checkCanLearn(move, template, lsetData, set) {
			const problem = this.checkCanLearn(move, template, lsetData, set);
			if (!problem) return null;
			const item = this.dex.items.get(set!.item);
			const accessories = this.format.accessories || {};
			const accessory = accessories[item.id];
			if (!accessory || move.type !== accessory.type || move.isZ || this.ruleTable.isRestricted('move:' + move.id)) return problem;
			if (set!.sketchMove) return `${template.name}'s move ${move.name} can't be Sketched because it can only Sketch 1 move.`;
			set!.sketchMove = move.id;
			return null;
		},
		onValidateSet(set, format) {
			const template = this.dex.species.get(set.species);
			const item = this.dex.items.get(set.item);
			const accessories = format.accessories || {};
			const accessory = accessories[item.id];
			if (accessory) {
				const stats = {'atk': 'Attack', 'def': 'Defense', 'spa': 'Special Attack', 'spd': 'Special Defense', 'spe': 'Speed'};
				let statid: StatIDExceptHP;
				for (statid in stats) {
					const delta = accessory[statid];
					if (delta) {
						const stat = template.baseStats[statid] + delta;
						if (stat <= 0) return [`${template.name} does not have enough ${stats[statid]} to hold ${item.name}.`];
						if (stat > 255) return [`${template.name} has too much ${stats[statid]} to hold ${item.name}.`];
					}
				}
			}
		},
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			const accessory = format.accessories![this.toID(target.set.item!)];
			if (!accessory) return;
			const newTemplate = this.dex.deepClone(template);
			if (!template.types.includes(accessory.type)) newTemplate.types[1] = accessory.type;
			let stat: StatID;
			for (stat in template.baseStats) {
				if (accessory[stat]) {
					newTemplate.baseStats[stat] += accessory[stat];
					newTemplate.bst += accessory[stat];
				}
			}
			return newTemplate;
		},
		onBegin() {
			const accessories = this.format.accessories || {};
			for (const pokemon of this.p1.pokemon.concat(this.p2.pokemon)) {
				if (accessories[this.toID(pokemon.set.item)]) pokemon.item = 'ultranecroziumz' as ID;
			}
		},
		onSwitchIn(pokemon) {
			const accessories = this.format.accessories || {};
			if (accessories[this.toID(pokemon.set.item)]) {
				this.add('-start', pokemon, this.toID(pokemon.set.item), '[silent]');
			}
		},
	},
	{
		name: "[Gen 7] All Terrain",
		desc: "All four types of terrain are active 100% of the time.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3596038/">All Terrain</a>`,
		],

		mod: 'allterrain',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Camouflage', 'Nature Power', 'Secret Power', 'Raichu-Alola'],
		unbanlist: ['Landorus'],
		onBegin() {
			this.add('-fieldstart', 'move: Electric Terrain');
			this.add('-fieldstart', 'move: Grassy Terrain');
			this.add('-fieldstart', 'move: Misty Terrain');
			this.add('-fieldstart', 'move: Psychic Terrain');
			this.field.terrain = 'psychicterrain' as ID;
			this.field.terrainState = {
				id: 'psychicterrain',
			};
		},
	},
	{
		name: "[Gen 7] AAA 1v1",
		inherit: ['[Gen 7] Almost Any Ability', '[Gen 7] 1v1'],
		desc: "Pok&eacute;mon can use any ability, barring the few that are restricted. Bring three Pok&eacute;mon to Team Preview and choose one to battle.",

		ruleset: ['[Gen 7] 1v1', '2 Ability Clause', '!Obtainable Abilities'],
		banlist: ['Archeops', 'Kartana', 'Pheromosa', 'Regigigas', 'Slaking'],
		restricted: [
			'Fur Coat', 'Huge Power', 'Hustle', 'Illusion', 'Imposter', 'Multiscale', 'Normalize',
			'Parental Bond', 'Protean', 'Psychic Surge', 'Pure Power', 'Shadow Shield', 'Simple', 'Speed Boost', 'Water Bubble', 'Wonder Guard',
		],
	},
	{
		name: "[Gen 7] AAA Factory",
		inherit: ['[Gen 7] Battle Factory'],
		factoryTier: "Almost Any Ability",
	},
	{
		name: "[Gen 7] AAA Sketchmons",
		inherit: ['[Gen 7] Almost Any Ability', '[Gen 7] Sketchmons'],
		desc: "Pok&eacute;mon can use any ability, barring the few that are restricted, and can learn Sketch once.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587743/">Sketchmons</a>`,
		],

		ruleset: ['[Gen 7] Sketchmons', '!Obtainable Abilities', '[Gen 7] Almost Any Ability'],
		banlist: [],
		unbanlist: [],
		restricted: [],
	},
	{
		name: "[Gen 7] Almost Any Ability",
		desc: "Pok&eacute;mon can use any ability, barring the few that are restricted.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Almost Any Ability</a>`,
		],

		mod: 'gen7',
		searchShow: true,
		ruleset: ['[Gen 7] OU', '2 Ability Clause', '!Obtainable Abilities'],
		banlist: ['Archeops', 'Dragonite', 'Hoopa-Unbound', 'Kartana', 'Keldeo', 'Kyurem-Black', 'Regigigas', 'Shedinja', 'Slaking', 'Terrakion', 'Weavile'],
		unbanlist: ['Aegislash', 'Blaziken', 'Genesect', 'Landorus-Base', 'Metagross-Mega', 'Naganadel', 'Pheromosa'],
		restricted: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
		],
		onValidateSet(set, format) {
			if (this.ruleTable.isRestricted('ability:' + this.toID(set.ability))) {
				const template = this.dex.species.get(set.species || set.name);
				let legalAbility = false;
				let i: AbilityIndex;
				for (i in template.abilities) {
					if (set.ability === template.abilities[i]) legalAbility = true;
				}
				if (!legalAbility) return ['The ability ' + set.ability + ' is banned on Pok\u00e9mon that do not naturally have it.'];
			}
		},
	},
	{
		name: "[Gen 7] Almost Any Ability UU",
		inherit: ['[Gen 7] Almost Any Ability'],
		desc: "Pok&eacute;mon can use any ability, barring the few that are restricted.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3612051/">UU OMs Mega Thread</a>`,
		],

		searchShow: true,
		ruleset: ['[Gen 7] Almost Any Ability'],
		banlist: [
			'Alakazam-Mega', 'Blacephalon', 'Buzzwole', 'Celesteela', 'Chansey', 'Excadrill', 'Ferrothorn', 'Garchomp',
			'Genesect', 'Gengar', 'Gliscor', 'Golisopod', 'Greninja', 'Heatran', 'Hippowdon', 'Infernape', 'Kommo-o', 'Landorus-Therian', 'Latios',
			'Magearna', 'Mamoswine', 'Manaphy', 'Metagross', 'Mew', 'Minior', 'Muk-Alola', 'Noivern', 'Shuckle', 'Skarmory', 'Snorlax',
			'Swampert-Mega', 'Talonflame', 'Tapu Koko', 'Toxapex', 'Victini', 'Volcanion', 'Volcarona', 'Xurkitree', 'Zapdos', 'Zeraora',
		],
		unbanlist: [],
		restricted: [],
	},
	{
		name: "[Gen 7] Alphabet Cup",
		desc: "Pok&eacute;mon may learn any move that starts with the same letter as their species.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3617977/">Alphabet Cup</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Geomancy'],
		restricted: ['Shell Smash', 'Sketch'],
		checkCanLearn(move, template, lsetData, set) {
			if (!move.isNonstandard && !move.isZ && !this.ruleTable.isRestricted('move:' + move.id) && move.id[0] === template.id[0]) return null;
			return this.checkCanLearn(move, template, lsetData, set);
		},
		onValidateTeam(team) {
			const nameTable: {[k: string]: boolean} = {};
			for (const {species} of team) {
				if (nameTable[species[0]]) return ["You are limited to one Pokemon per letter."];
				nameTable[species[0]] = true;
			}
		},
	},
	{
		name: "[Gen 7] Automagic",
		desc: "If a move's secondary effect triggers, all your setup moves automagically activate.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3594333/">Automagic</a>`,
		],

		ruleset: ['[Gen 7] OU'],
		banlist: ["King's Rock", 'Razor Fang'],

		mod: 'gen7',
		onModifySecondaries(secondaries) {
			for (const secondary of secondaries) {
				if (!secondary.self) {
					secondary.self = {volatileStatus: 'automagic'};
				} else if (!secondary.self.volatileStatus) {
					secondary.self.volatileStatus = 'automagicself';
				}
			}
		},
		onAfterMoveSecondary(target, source) {
			// Deliberately using bitwise OR here
			if (+source.removeVolatile('automagicself') | +(source.removeVolatile('automagic') && target.hp)) {
				if (source !== target) { // probably unnecessary
					for (const moveid of source.moves) {
						const move = this.dex.getActiveMove(moveid);
						if (((move.id === 'curse' && !target.hasType('Ghost')) || move.id === 'acupressure' || move.id === 'bellydrum' || (move.target === 'self' && move.boosts)) && source.deductPP(move, null, source)) {
							this.actions.useMove(move, source);
						}
					}
				}
			}
		},
	},
	{
		name: "[Gen 7] Averagemons",
		desc: "Every Pok&eacute;mon has a stat spread of 100/100/100/100/100/100.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3590605/">Averagemons</a>`,
		],

		mod: 'gen7',
		ruleset: ['Standard', 'Evasion Abilities Clause', 'Baton Pass Clause'],
		banlist: ['Smeargle', 'Deep Sea Tooth', 'Eviolite', 'Light Ball', 'Thick Club', 'Arena Trap', 'Huge Power', 'Pure Power', 'Shadow Tag', 'Baton Pass', 'Chatter'],
		onModifySpecies(template, target, format, effect) {
			return {...template, baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100}};
		},
	},
	{
		name: "[Gen 7] Averagemons Random Battle",
		inherit: ['[Gen 7] Averagemons'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: [],
	},
	{
		name: "[Gen 7] Bad STABmons",
		inherit: ['[Gen 7] STABmons'],
		desc: "Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn, but they cannot have a BST of more than 450.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587949/">STABmons</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] STABmons'],
		banlist: ['Chansey', 'Gumshoos', 'Minior', 'Pelipper', 'Rotom', 'Sableye', 'Wishiwashi', 'Huge Power', 'Pure Power', 'Simple', 'Chatter', 'Thick Club', 'Mega'],
		unbanlist: ['Extreme Speed', 'Spore'],
		restricted: [],
		onValidateSet(set) {
			const template = this.dex.species.get(set.species);
			if (template.bst > 450) return ["You are limited to a BST of 450 by Bad STABmons.", "(" + set.species + "'s BST is " + template.bst + ".)"];
		},
	},
	{
		name: "[Gen 7] Balanced Hackmons",
		desc: `Anything that can be hacked in-game and is usable in local battles is allowed.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/posts/8407209/">USM Balanced Hackmons</a>`,
		],

		mod: 'gen7',
		ruleset: ['-Nonexistent', '2 Ability Clause', 'OHKO Clause', 'Evasion Moves Clause', 'CFZ Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Endless Battle Clause'],
		banlist: ['Groudon-Primal', 'Rayquaza-Mega', 'Arena Trap', 'Contrary', 'Huge Power', 'Illusion', 'Innards Out', 'Magnet Pull', 'Moody', 'Parental Bond', 'Protean', 'Psychic Surge', 'Pure Power', 'Shadow Tag', 'Stakeout', 'Water Bubble', 'Wonder Guard', 'Chatter', 'Comatose + Sleep Talk'],
		unbanlist: ['Kangaskhanite', 'Mawilite', 'Medichamite', 'Red Orb'],
	},
	{
		name: "[Gen 7] Balanced Hackmons UU",
		desc: "Anything that can be hacked in-game and is usable in local battles is allowed.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3612051/">UU OMs Mega Thread</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] Balanced Hackmons'],
		banlist: [
			'Aegislash', 'Arceus', 'Audino-Mega', 'Blaziken-Mega', 'Blissey', 'Celesteela', 'Chansey', 'Deoxys-Attack', 'Deoxys-Speed',
			'Dialga', 'Diancie-Mega', 'Garchomp-Mega', 'Gengar-Mega', 'Giratina', 'Greninja-Ash', 'Gyarados-Mega', 'Ho-Oh', 'Kartana', 'Kyogre-Primal', 'Kyurem-Black',
			'Magearna', 'Mewtwo-Mega-X', 'Mewtwo-Mega-Y', 'Necrozma-Dusk-Mane',
			'Regigigas', 'Registeel', 'Sceptile-Mega', 'Shedinja', 'Slaking', 'Solgaleo', 'Tyranitar-Mega', 'Xerneas', 'Yveltal', 'Zygarde-Complete',
			'Kangaskhanite', 'Red Orb',
		],
		unbanlist: ['Audinite', 'Blazikenite', 'Blue Orb', 'Diancite', 'Gyaradosite', 'Metagrossite', 'Mewtwonite X', 'Mewtwonite Y', 'Sceptilite', 'Tyranitarite', 'Ultranecrozium Z'],
	},
	{
		name: "[Gen 7] Benjamin Butterfree",
		desc: "Pok&eacute;mon that faint reincarnate as their prevo, but without the moves they can't learn.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3605680/">Benjamin Butterfree</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Blissey'],
		onBeforeFaint(pokemon) {
			const prevo = pokemon.baseSpecies.isMega ? this.dex.species.get(pokemon.baseSpecies.baseSpecies).prevo : pokemon.baseSpecies.prevo;
			if (!prevo || pokemon.set.ability === 'Battle Bond') return;
			let template = this.dex.species.get(pokemon.set.species);
			let abilitySlot = (Object.keys(template.abilities) as AbilityIndex[]).find(slot => template.abilities[slot] === pokemon.set.ability);
			template = this.dex.species.get(prevo);
			if (!abilitySlot || !template.abilities[abilitySlot]) abilitySlot = '0';
			pokemon.faintQueued = false;
			pokemon.hp = pokemon.maxhp;
			if (Object.values(pokemon.boosts).find(boost => boost !== 0)) {
				pokemon.clearBoosts();
				this.add('-clearboost', pokemon);
			}
			pokemon.formeChange(template, this.format, true, '', abilitySlot);
			this.add('-message', `${pokemon.name} has devolved into ${template.name}!`);
			pokemon.cureStatus(true);
			this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
			// XXX Use Validator.checkCanLearn
			const learnset = this.dex.species.getLearnset(template.id) || this.dex.species.getLearnset(this.toID(template.baseSpecies)) || {};
			const prevoset = template.prevo && this.dex.species.getLearnset(this.toID(template.prevo)) || {};
			for (const moveSlot of pokemon.baseMoveSlots) {
				if (!learnset[moveSlot.id] && !prevoset[moveSlot.id]) {
					moveSlot.used = true;
					moveSlot.pp = 0;
				}
			}
			pokemon.canMegaEvo = null;
			return false;
		},
	},
	{
		name: "[Gen 7] Benjamin Butterfree Random Battle",
		inherit: ['[Gen 7] Benjamin Butterfree'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: [],
	},
	{
		name: "[Gen 7] Camomons",
		desc: "Pok&eacute;mon change type to match their first two moves.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3598418/">Camomons</a>`,
		],

		mod: 'gen7',
		searchShow: true,
		ruleset: ['[Gen 7] OU'],
		banlist: ['Dragonite', 'Kartana', 'Kyurem-Black', 'Shedinja'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			const types = [...new Set(target.set.moves.slice(0, 2).map(move => this.dex.moves.get(move).type))];
			return {...template, types};
		},
	},
	{
		name: "[Gen 7] Camomons Factory",
		inherit: ['[Gen 7] Camomons', '[Gen 7] Battle Factory'],
		banlist: [],
		factoryTier: "Camomons",
	},
	{
		name: "[Gen 7] Camomons LC",
		inherit: ['[Gen 7] Camomons'],
		ruleset: ['[Gen 7] LC'],
		banlist: [],
	},
	{
		name: "[Gen 7] Challenge Cup",

		mod: 'gen7',
		team: 'randomCC',
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
	},
	{
		name: "[Gen 7] Challenge Cup 1v1",

		mod: 'gen7',
		team: 'randomCC',
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview', 'Picked Team Size = 1'],
	},
	{
		name: "[Gen 7] Chimera",
		desc: "Bring 6 Pok&eacute;mon and choose their order at Team Preview. The lead Pok&eacute;mon then receives the Item, Ability, Stats and Moves of the other five Pok&eacute;mon, who play no further part in the battle.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3607451/">Chimera 1v1</a>`,
		],

		mod: 'gen7',
		ruleset: ['Obtainable', 'Moody Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview', 'Picked Team Size = 6'],
		banlist: ['Shedinja', 'Smeargle', 'Huge Power', 'Pure Power', 'Focus Sash', 'Dark Void', 'Grass Whistle', 'Hypnosis', 'Lovely Kiss', 'Perish Song', 'Sing', 'Sleep Powder', 'Spore', 'Transform'],
		onBeforeSwitchIn(pokemon) {
			const allies = pokemon.side.pokemon.splice(1);
			pokemon.side.pokemonLeft = 1;
			const newTemplate = this.dex.deepClone(pokemon.baseSpecies);
			newTemplate.baseStats = allies[2].baseSpecies.baseStats;
			newTemplate.bst = allies[2].baseSpecies.bst;
			newTemplate.baseSpecies = newTemplate.species += '-Chimera';
			pokemon.baseSpecies = newTemplate;
			pokemon.item = allies[0].item;
			pokemon.ability = pokemon.baseAbility = allies[1].ability;
			pokemon.set.evs = allies[2].set.evs;
			pokemon.set.nature = allies[2].set.nature;
			pokemon.set.ivs = allies[2].set.ivs;
			pokemon.hpType = pokemon.baseHpType = allies[2].baseHpType;
			pokemon.moveSlots = pokemon.baseMoveSlots = allies[3].baseMoveSlots.slice(0, 2).concat(allies[4].baseMoveSlots.slice(2)).filter((move, index, moveSlots) => moveSlots.find(othermove => othermove.id === move.id) === move);
			pokemon.canMegaEvo = null;
			pokemon.maxhp = 0;
			pokemon.setSpecies(pokemon.baseSpecies, null);
		},
	},
	{
		name: "[Gen 7] Cross Evolution",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3594854/">Cross Evolution</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers', '!Mega Rayquaza Clause', 'Overflow Stat Mod'],
		banlist: ['Sneasel', 'Type: Null'],
		restricted: ['Shedinja', 'Solgaleo', 'Lunala'],
		onValidateTeam(team) {
			const nameTable: {[k: string]: boolean} = {};
			for (const {name} of team) {
				if (name) {
					if (nameTable[name]) {
						return ["Your Pokémon must have different nicknames.", "(You have more than one " + name + ")"];
					}
					nameTable[name] = true;
				}
			}
		},
		checkCanLearn(move, template, lsetData, set) {
			if (!set?.template || !set.crossTemplate) return this.checkCanLearn(move, template, lsetData, set);
			const problem = this.checkCanLearn(move, set.template);
			if (!problem) return null;
			if (!set.crossMovesLeft) return problem;
			if (this.checkCanLearn(move, set.crossTemplate)) return problem;
			set.crossMovesLeft--;
			return null;
		},
		validateSet(set, teamHas) {
			const crossTemplate = this.dex.species.get(set.name);
			if (!crossTemplate.exists || crossTemplate.isNonstandard) return this.validateSet(set, teamHas);
			const template = this.dex.species.get(set.species);
			if (!template.exists || template.isNonstandard || template === crossTemplate) return this.validateSet(set, teamHas);
			if (!template.nfe) return ["" + template.name + " cannot cross evolve because it doesn't evolve."];
			if (crossTemplate.battleOnly || crossTemplate.isNonstandard || !crossTemplate.prevo) return ["" + template.name + " cannot cross evolve into " + crossTemplate.name + " because it isn't an evolution."];
			if (this.ruleTable.isRestrictedSpecies(crossTemplate)) return ["" + template.name + " cannot cross evolve into " + crossTemplate.name + " because it is banned."];
			const crossPrevoTemplate = this.dex.species.get(crossTemplate.prevo);
			if (!crossPrevoTemplate.prevo !== !template.prevo) return ["" + template.name + " cannot cross evolve into " + crossTemplate.name + " because they are not consecutive evolutionary stages."];

			// Ability test
			const ability = this.dex.abilities.get(set.ability);
			if ((ability.name !== 'Huge Power' && ability.name !== 'Pure Power' && ability.name !== 'Shadow Tag') || Object.values(template.abilities).includes(ability.name)) set.species = crossTemplate.name;

			set.template = template;
			set.crossTemplate = crossTemplate;
			set.crossMovesLeft = 2;
			const problems = this.validateSet(set, teamHas);
			set.name = crossTemplate.name;
			set.species = template.name;
			return problems;
		},
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			if (target.set.name === target.set.species) return;
			const crossTemplate = this.dex.species.get(target.set.name);
			if (!crossTemplate.exists) return;
			if (template.battleOnly || !template.nfe) return;
			if (crossTemplate.battleOnly || crossTemplate.isNonstandard || !crossTemplate.prevo) return;
			const crossPrevoTemplate = this.dex.species.get(crossTemplate.prevo);
			if (!crossPrevoTemplate.prevo !== !template.prevo) return;

			const mixedTemplate = this.dex.deepClone(template);
			mixedTemplate.baseSpecies = mixedTemplate.name = template.name + '-' + crossTemplate.name;
			mixedTemplate.weighthg = Math.max(1, template.weighthg + crossTemplate.weighthg - crossPrevoTemplate.weighthg);
			mixedTemplate.nfe = false;
			mixedTemplate.evos = [];
			mixedTemplate.eggGroups = crossTemplate.eggGroups;
			mixedTemplate.abilities = crossTemplate.abilities;

			let statid: StatID;
			for (statid in template.baseStats) {
				mixedTemplate.baseStats[statid] = this.clampIntRange(template.baseStats[statid] + crossTemplate.baseStats[statid] - crossPrevoTemplate.baseStats[statid], 1, 255);
			}
			mixedTemplate.bst = mixedTemplate.baseStats.hp + mixedTemplate.baseStats.atk + mixedTemplate.baseStats.def + mixedTemplate.baseStats.spa + mixedTemplate.baseStats.spd + mixedTemplate.baseStats.spe;

			if (crossTemplate.types[0] !== crossPrevoTemplate.types[0]) mixedTemplate.types[0] = crossTemplate.types[0];
			if (crossTemplate.types[1] !== crossPrevoTemplate.types[1]) mixedTemplate.types[1] = crossTemplate.types[1] || crossTemplate.types[0];
			if (mixedTemplate.types[0] === mixedTemplate.types[1]) mixedTemplate.types.length = 1;

			target.m.crossEvolved = true;
			return mixedTemplate;
		},
		onBegin() {
			const allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (const pokemon of allPokemon) {
				pokemon.baseSpecies = pokemon.species;
			}
		},
	},
	{
		name: "[Gen 7] Dancerability",
		desc: "Whenever a move triggers a Pok&eacute;mon's Ability, it additionally bounces the move.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3600658/">Dancerability</a>`,
		],

		mod: 'dancerability',
		ruleset: ['[Gen 7] OU'],
	},
	{
		name: "[Gen 7] Dual Wielding",
		desc: "Poe&eacute;mon can forgo their Ability in order to use a second item.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3608611/">Dual Wielding</a>`,
		],

		mod: 'dualwielding',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Slaking', 'Regigigas'],
		validateSet(set, teamHas) {
			const dual = this.dex.items.get(set.ability);
			if (!dual.exists) return this.validateSet(set, teamHas);
			const customRules = this.format.customRules || [];
			if (!customRules.includes('!obtainableabilities')) customRules.push('!obtainableabilities');
			const TeamValidator = this.constructor as new(format: string | Format) => TeamValidator;
			const validator = new TeamValidator(Dex.formats.get(this.format.id + '@@@' + customRules.join(',')));
			const problems = validator.validateSet({...set, ability: ''}, teamHas) || validator.validateSet({...set, ability: '', item: set.ability}, teamHas) || [];
			if (this.toID(set.item) === this.toID(set.ability)) problems.push((set.name || this.dex.species.get(set.species).name) + " is limited to 1 of " + this.dex.items.get(set.item).name);
			else if (this.toID(set.item).startsWith('choice') && this.toID(set.ability).startsWith('choice')) problems.push((set.name || this.dex.species.get(set.species).name) + " has the combination of " + this.dex.items.get(set.item).name + " and " + dual.name + ", which is banned.");
			return problems.length ? problems : null;
		},
	},
	{
		name: "[Gen 7] Evos for Everyone",
		threads: [
			"&bullet; <a href=https://www.smogon.com/forums/threads/3636813/>Evos for Everyone</a>",
		],

		mod: 'evosforeveryone',
		ruleset: ['[Gen 7] OU'],
		onSwitchIn(pokemon) {
			this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
		},
	},
	{
		name: "[Gen 7] Fallen Friends",
		desc: "Pok&eacute;mon recieve a boost from each fainted Pok&eacute;mon on their team.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3611355/">Fallen Friends</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		onSwitchIn(pokemon) {
			const boosts: SparseBoostsTable = {};
			for (const ally of pokemon.side.pokemon) {
				if (ally.fainted) {
					let stat: StatIDExceptHP = 'atk';
					let bestStat = 0;
					let i: StatIDExceptHP;
					for (i in ally.storedStats) {
						if (ally.baseStoredStats[i] > bestStat) {
							stat = i;
							bestStat = ally.storedStats[i];
						}
					}
					if (!boosts[stat]) boosts[stat] = 0;
					boosts[stat]!++;
				}
			}
			let i: BoostID;
			for (i in boosts) {
				pokemon.boosts[i] += boosts[i]!;
				this.add('-boost', pokemon, i, boosts[i]);
			}
		},
	},
	{
		name: "[Gen 7] Follow the Leader",
		desc: "All Pok&eacute;mon must use the abilities and moves of the Pok&eacute;mon in the first slot.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3603860/">Follow the Leader</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Smeargle', 'Shedinja', 'Regigigas', 'Slaking', 'Huge Power', 'Imposter', 'Pure Power'],
		checkCanLearn(move, template, lsetData, set) {
			return set?.follower ? null : this.checkCanLearn(move, template, lsetData, set);
		},
		validateSet(set, teamHas) {
			if (!teamHas.leader) {
				const problems = this.validateSet(set, teamHas);
				teamHas.leader = set.species;
				return problems;
			}
			const leader = this.dex.deepClone(set);
			leader.species = teamHas.leader;
			let problems = this.validateSet(leader, teamHas);
			if (problems) return problems;
			set.ability = this.dex.species.get(set.species || set.name).abilities['0'];
			set.follower = true;
			problems = this.validateSet(set, teamHas);
			set.ability = leader.ability;
			return problems;
		},
	},
	{
		name: "[Gen 7] Fortemons",
		desc: "Use a move as an item to gain some of its effects on all your moves.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3638520/">Fortemons</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU]'],
		banlist: ['Serene Grace'],
		restricted: ['Bide', 'Chatter', 'Dynamic Punch', 'Fake Out', 'Inferno', 'Power Trip', 'Power-Up Punch', 'Pursuit', 'Stored Power', 'Zap Cannon'],
		validateSet(set, teamHas) {
			const item = set.item;
			const move = this.dex.moves.get(set.item);
			if (!move.exists || move.type === 'Status' || this.ruleTable.isRestricted('move:' + move.id)) return this.validateSet(set, teamHas);
			set.item = '';
			const problems = this.validateSet(set, teamHas) || [];
			set.item = item;
			if (this.format.checkCanLearn!.call(this, move, this.dex.species.get(set.species))) problems.push(`${set.species} can't learn ${move.name}.`);
			if (move.secondaries && move.secondaries.some(secondary => !!secondary.boosts && !!secondary.boosts.accuracy && secondary.boosts.accuracy < 0)) problems.push(`${set.name || set.species}'s move ${move.name} can't be used as an item.`);
			return problems.length ? problems : null;
		},
		checkCanLearn(move, template, lsetData, set) {
			if (move.id === 'beatup' || move.id === 'fakeout' || move.damageCallback || Array.isArray(move.multihit)) return `${template.name}'s move ${move.name} is banned.`;
			return this.checkCanLearn(move, template, lsetData, set);
		},
		onBegin() {
			for (const pokemon of this.p1.pokemon.concat(this.p2.pokemon)) {
				const move = this.dex.moves.get(pokemon.set.item);
				if (move.exists && move.category !== 'Status') {
					pokemon.m.forte = move;
					pokemon.item = 'ultranecroziumz' as ID;
				}
			}
		},
		onModifyPriority(priority, pokemon, target, move) {
			if (move.category !== 'Status' && pokemon && pokemon.m.forte) return priority + pokemon.m.forte.priority;
		},
		onModifyMovePriority: 1,
		onModifyMove(move, pokemon) {
			if (move.category !== 'Status' && pokemon.m.forte) {
				if (pokemon.m.forte.self) move.self = Object.assign(move.self || {}, pokemon.m.forte.self);
				if (pokemon.m.forte.secondaries) move.secondaries = (move.secondaries || []).concat(this.dex.deepClone(pokemon.m.forte.secondaries));
				for (const prop of ['basePowerCallback', 'breaksProtect', 'critRatio', 'defensiveCategory', 'drain', 'flags', 'forceSwitch', 'ignoreAbility', 'ignoreDefensive', 'ignoreEvasion', 'ignoreImmunity', 'pseudoWeather', 'recoil', 'selfSwitch', 'sleepUsable', 'stealsBoosts', 'thawsTarget', 'useTargetOffensive', 'volatileStatus', 'willCrit']) {
					// @ts-ignore Seriously, how do you get this past TypeScript?
					if (pokemon.m.forte[prop]) move[prop] = pokemon.m.forte[prop];
				}
			}
		},
	},
	{
		name: "[Gen 7] Full Potential",
		desc: "Moves use the Pok&eacute;mon's highest effective stat for damage calculation.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3596777/">Full Potential</a>`,
		],

		mod: 'fullpotential',
		ruleset: ['[Gen 7] OU', 'Item Clause'],
		banlist: ['Pheromosa', 'Raichu-Alola', 'Shuckle', 'Tapu Koko', 'Chlorophyll', 'Sand Rush', 'Slush Rush', 'Speed Boost', 'Surge Surfer', 'Swift Swim', 'Unburden'],
		unbanlist: ['Hoopa-Unbound'],
	},
	{
		name: "[Gen 7] Full Potential Random Battle",
		desc: "Moves use the Pok&eacute;mon's highest effective stat for damage calculation.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3596777/">Full Potential</a>`,
		],

		team: 'random',
		mod: 'fullpotential',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Godly Gift",
		desc: "Each Pok&eacute;mon receives one base stat from your God depending on its position in your team.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3597618/">Godly Gift</a>`,
		],

		mod: 'gen7',
		searchShow: true,
		ruleset: ['[Gen 7] Ubers'],
		banlist: ['Huge Power', 'Pure Power', 'Shadow Tag', 'Blissey', 'Chansey', 'Deoxys-Attack', 'Sableye-Mega', 'Toxapex', 'Uber > 1', 'Uber ++ Power Construct'],
		onModifySpecies(template, target, format, effect) {
			if (!target.side) return;
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			const uber = target.side.team.find(set => {
				const item = this.dex.items.get(set.item);
				return this.toID(set.ability) === 'powerconstruct' || this.toID(set.ability) === 'shadowtag' || this.dex.species.get(item.megaEvolves === set.species ? item.megaStone : set.species).tier === 'Uber';
			}) || target.side.team[0];
			const stat = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'][target.side.team.indexOf(target.set)] as StatID;
			const newTemplate = this.dex.deepClone(template);
			newTemplate.baseStats[stat] = this.dex.species.get(uber.species).baseStats[stat];
			newTemplate.bst += newTemplate.baseStats[stat] - template.baseStats[stat];
			return newTemplate;
		},
	},
	{
		name: "[Gen 7] Gods and Followers",
		desc: "The Pok&eacute;mon in the first slot is the God; the Followers must share a type with the God. If the God Pok&eacute;mon faints, the Followers are inflicted with Embargo.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3589187/">Gods and Followers</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers'],
		validateSet(set, teamHas) {
			if (!teamHas.typeTable) {
				const problems = this.validateSet(set, teamHas);
				let template = this.dex.species.get(set.species);
				const item = this.dex.items.get(set.item);
				teamHas.typeTable = item.id === 'ultranecroziumz' && ['Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane'].includes(template.name) ? ['Psychic'] : template.types;
				if (template.name === item.megaEvolves) {
					template = this.dex.species.get(item.megaStone);
					if (template.types[1] !== teamHas.typeTable[1]) teamHas.typeTable = [teamHas.typeTable[0]];
				}
				return problems;
			}
			const TeamValidator = this.constructor as new(format: string | Format) => TeamValidator;
			const problems = new TeamValidator('gen7ou').validateSet(set, teamHas);
			if (problems) return problems;
			let template = this.dex.species.get(set.species);
			if (!template.types.some(type => teamHas.typeTable.includes(type))) return ["Followers must share a type with the God."];
			const item = this.dex.items.get(set.item);
			if (template.name === item.megaEvolves) {
				template = this.dex.species.get(item.megaStone);
				if (!template.types.some(type => teamHas.typeTable.includes(type))) return ["Followers must share a type with the God."];
			}
			return null;
		},
		onBegin() {
			for (const side of this.sides) {
				side.god = side.pokemon[0];
			}
		},
		onFaint(pokemon) {
			if (pokemon.side.pokemonLeft > 1 && pokemon.side.god === pokemon) {
				this.add('-message', pokemon.set.name + " has fallen! " + pokemon.side.name + "'s team has been Embargoed!");
			}
		},
		onSwitchIn(pokemon) {
			if (pokemon.side.god && pokemon.side.god.hp === 0 && pokemon.addVolatile('embargo', pokemon)) delete pokemon.volatiles['embargo'].duration;
		},
	},
	{
		name: "[Gen 7] Hidden Type",
		desc: "Pok&eacute;mon have an added type determined by their IVs. Same as the Hidden Power type.",
		threads: [
			`&bullet; <a href="http://www.smogon.com/forums/threads/3591194/">Hidden Type</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Kyurem-Black'],
		onModifySpecies(template, pokemon, format, effect) {
			if (template.types.includes(pokemon.hpType)) return;
			return {...template, addedType: pokemon.hpType};
		},
	},
	{
		name: "[Gen 7] Hot Potato",
		desc: "All attacking moves transfer stat drops, entry hazards, statuses, and certain volatiles, to the target.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3643676/">Hot Potato</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Perish Song'],
		onDamagingHit(damage, target, source, effect) {
			if (source && source !== target && effect && effect.effectType === 'Move' && target.hp) this.activeMove!.hotPotato = true;
		},
		onAfterMove(source, target, move) {
			if (this.activeMove?.hotPotato && target.hp) {
				const negativeBoosts: SparseBoostsTable = {};
				let boosted = false;
				let stat: BoostID;
				for (stat in source.boosts) {
					if (source.boosts[stat] < 0) {
						boosted = true;
						negativeBoosts[stat] = source.boosts[stat];
						source.boosts[stat] = 0;
					}
				}
				if (boosted) {
					this.add('-clearnegativeboost', source);
					this.boost(negativeBoosts, target, source);
				}
				const noCopy = ['id', 'target', 'source', 'sourceEffect', 'sourcePosition', 'linkedStatus', 'linkedPokemon', 'move', 'layers'];
				for (const sideCondition of ['stealthrock', 'spikes', 'toxicspikes', 'stickyweb']) {
					const oldData = source.side.sideConditions[sideCondition];
					if (oldData) {
						source.side.removeSideCondition(sideCondition);
						this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name);
						if (target.side.addSideCondition(sideCondition, source)) {
							const newData = target.side.sideConditions[sideCondition];
							for (const i in oldData) {
								if (!noCopy.includes(i)) newData[i] = oldData[i];
							}
							for (let i = 1; i < oldData.layers; i++) target.side.addSideCondition(sideCondition, source);
						}
					}
				}
				if (source.status) {
					const oldData = source.statusState;
					source.cureStatus();
					if (target.trySetStatus(oldData.id, source)) {
						for (const i in oldData) {
							if (!noCopy.includes(i)) target.statusState[i] = oldData[i];
						}
					}
				}
				for (const volatile of ['confusion', 'trapped', 'partiallytrapped', 'taunt', 'encore', 'leechseed', 'torment', 'disable', 'attract', 'perishsong', 'telekinesis', 'nightmare', 'curse', 'healblock', 'embargo', 'miracleeye', 'foresight']) {
					if (source.volatiles[volatile]) {
						const oldData = source.volatiles[volatile];
						source.removeVolatile(volatile);
						if (target.addVolatile(volatile, source, null, oldData.linkedStatus)) {
							const newData = target.volatiles[volatile];
							for (const i in oldData) {
								if (!noCopy.includes(i)) newData[i] = oldData[i];
							}
						}
					}
				}
			}
		},
	},
	{
		name: "[Gen 7] Hot Potato Random Battle",
		inherit: ['[Gen 7] Hot Potato'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: [],
	},
	{
		name: "[Gen 7] Inheritance",
		desc: "Pok&eacute;mon may use the ability and moves of another, as long as they forfeit their own learnset.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3592844/">Inheritance</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Blacephalon', 'Hoopa-Unbound', 'Kartana', 'Kyurem-Black', 'Regigigas', 'Shedinja', 'Slaking', 'Assist', 'Chatter', 'Shell Smash', 'Gyaradosite'],
		restricted: ['Liepard', 'Meowstic', 'Murkrow', 'Purrloin', 'Smeargle', 'Huge Power', 'Imposter', 'Innards Out', 'No Guard', 'Pure Power', 'Speed Boost', 'Water Bubble', 'Wonder Guard'],
		getEvoFamily(species) {
			let template = Dex.species.get(species);
			while (template.prevo) {
				template = Dex.species.get(template.prevo);
			}
			return template.id;
		},
		validateSet(set, teamHas) {
			const abilityMap = this.format.abilityMap || Object.create(null);
			if (!this.format.abilityMap) {
				for (const speciesid in this.dex.data.Pokedex) {
					const pokemon = this.dex.data.Pokedex[speciesid];
					if (pokemon.num < 1 || pokemon.num > 807 || ['Gmax', 'Galar', 'Galar-Zen', 'Hisui'].includes(pokemon.forme!)) continue;
					if (this.dex.data.Pokedex[speciesid].requiredAbility || this.dex.data.Pokedex[speciesid].requiredItem || Dex.data.Pokedex[speciesid].requiredMove) continue;
					let key: AbilityIndex;
					for (key in pokemon.abilities) {
						const abilityId = this.toID(pokemon.abilities[key]);
						if (abilityMap[abilityId]) {
							abilityMap[abilityId][pokemon.evos ? 'push' : 'unshift'](speciesid);
						} else {
							abilityMap[abilityId] = [speciesid];
						}
					}
				}
				this.format.abilityMap = abilityMap;
			}

			let problems = this.validateForme(set);
			if (problems.length) return problems;

			const species = this.toID(set.species);
			const template = this.dex.species.get(species);
			if (!template.exists) return [`The Pokemon "${set.species}" does not exist.`];
			const item = this.dex.items.get(set.item);
			const megaTemplate = item.megaEvolves === set.species ? this.dex.species.get(item.megaStone) : template;
			if (megaTemplate.tier === 'Uber') return ["" + megaTemplate.name + " is in Uber, which is banned."];
			const problem = this.checkSpecies(set, template, megaTemplate, {});
			if (problem) return [problem];

			const name = set.name;
			let canonicalSource = set.species;

			const abilityId = this.toID(set.ability);
			const pokemonWithAbility = abilityMap[abilityId];
			if (!pokemonWithAbility) return ["" + set.ability + " is an invalid ability."];
			const isBaseAbility = Object.values(template.abilities).map(this.toID).includes(abilityId);
			if (!isBaseAbility && this.ruleTable.isRestricted('ability:' + abilityId)) return ["" + set.ability + " is banned from being passed down."];

			const validSources: string[] = set.abilitySources = []; // evolutionary families
			for (const speciesid of pokemonWithAbility) {
				const donorTemplate = this.dex.species.get(speciesid);
				const evoFamily = this.format.getEvoFamily!(donorTemplate);

				if (validSources.includes(evoFamily)) {
					// The existence of a legal set has already been established.
					// We only keep iterating to find all legal donor families (Donor Clause).
					// Skip this redundant iteration.
					continue;
				}

				if (donorTemplate.id !== this.toID(set.species) && this.ruleTable.isRestrictedSpecies(donorTemplate)) {
					continue;
				} else if (donorTemplate.id !== this.toID(set.species) && this.ruleTable.isRestricted('ability:' + abilityId)) {
					continue;
				}
				set.name = set.species = donorTemplate.name;
				if (!this.validateSet(set)) {
					canonicalSource = donorTemplate.name;
					validSources.push(evoFamily);
				}
				if (validSources.length > 1) {
					// Specific for the basic implementation of Donor Clause (see onValidateTeam).
					break;
				}
			}

			set.name = set.species = canonicalSource;
			problems = this.validateSet(set, teamHas)!;
			set.species = species;
			set.name = name;
			set.moves.unshift(canonicalSource);
			return problems;
		},
		onValidateTeam(team, format, teamHas) {
			// Donor Clause
			const evoFamilyLists = [];
			for (const set of team) {
				if (!set.abilitySources) continue;
				evoFamilyLists.push(new Set(set.abilitySources.map(format.getEvoFamily!)));
			}

			// Checking actual full incompatibility would require expensive algebra.
			// Instead, we only check the trivial case of multiple Pokémon only legal for exactly one family. FIXME?
			const requiredFamilies = Object.create(null);
			for (const evoFamily of evoFamilyLists) {
				if (evoFamily.size !== 1) continue;
				const evoFamilies = Array.from(evoFamily);
				if (requiredFamilies[evoFamilies[0]]) return ["You are limited to one inheritance from each family by the Donor Clause.", "(You inherit more than once from " + this.dex.species.get(evoFamilies[0]).name + "'s.)"];
				requiredFamilies[evoFamilies[0]] = 1;
			}
		},
		onBegin() {
			for (const pokemon of this.p1.pokemon.concat(this.p2.pokemon)) {
				pokemon.m.donorTemplate = pokemon.moves[0];
				pokemon.baseMoveSlots.shift();
				pokemon.moveSlots.shift();
			}
		},
		onSwitchIn(pokemon) {
			// Place volatiles on the Pokémon to show its donor
			this.add('-start', pokemon, pokemon.m.donorTemplate, '[silent]');
		},
		onSwitchOut(pokemon) {
			this.add('-end', pokemon, pokemon.m.donorTemplate, '[silent]');
		},
	},
	{
		name: "[Gen 7] Inheritance Random Battle",
		desc: "Pok&eacute;mon may use the ability and moves of another, as long as they forfeit their own learnset.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3592844/">Inheritance</a>`,
		],

		mod: 'gen7',
		team: 'randomInheritance',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		onSwitchIn(pokemon) {
			// Place volatiles on the Pokémon to show its donor
			this.add('-start', pokemon, pokemon.set.donorTemplate, '[silent]');
		},
		onSwitchOut(pokemon) {
			this.add('-end', pokemon, pokemon.set.donorTemplate, '[silent]');
		},
	},
	{
		name: "[Gen 7] Inverse Battle",
		desc: "The effectiveness of each attack is inverted.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3590154/">Inverse Battle</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU', 'Inverse Mod'],
		banlist: ['Diggersby', 'Hoopa-Unbound', 'Kartana', 'Kyurem-Black', 'Serperior', 'Tapu Bulu', 'Tapu Lele'],
		unbanlist: ['Aegislash', 'Dialga', 'Giratina', 'Lucario-Mega', 'Solgaleo'],
	},
	{
		name: "[Gen 7] Inverse Random Battle",
		desc: "Battle with an inverted type chart.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3590154/">Inverse Battle</a>`,
		],

		team: 'random',
		mod: 'gen7',
		ruleset: ['Obtainable', 'Inverse Mod', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Last Will",
		desc: "When a Pok&eacute;mon faints, it gets to use the move in its fourth moveslot one last time.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3601362/">Last Will</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Endeavor', 'Blast Burn ++ Explosion ++ Frenzy Plant ++ Giga Impact ++ Hydro Cannon ++ Hyper Beam ++ Self Destruct ++ V-Create > 2'],
		onBeforeFaint(target) {
			this.add('-activate', target, 'Last Will');
			this.actions.runMove(target.moves[target.moves.length - 1] as string, target, 0, this.format, undefined, true);
		},
	},
	{
		name: "[Gen 7] Linked",
		desc: "The first two moves in a Pok&eacute;mon's moveset are used simultaneously.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3627804/">Linked</a>`,
		],

		mod: 'gen7linked',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Chlorophyll', 'Sand Rush', 'Slush Rush', 'Surge Surfer', 'Swift Swim', 'Unburden', "King's Rock", 'Razor Fang'],
		restricted: ['Baneful Bunker', 'Bounce', 'Detect', 'Dig', 'Dive', 'Fly', "Nature's Madness", 'Night Shade', 'Phantom Force', 'Protect', 'Seismic Toss', 'Shadow Force', 'Sky Drop', 'Spiky Shield', 'Super Fang'],
		onValidateSet(set, format) {
			const problems = [];
			for (const moveid of set.moves.slice(0, 2)) {
				if (this.ruleTable.isRestricted('move:' + moveid)) {
					const move = this.dex.moves.get(moveid);
					problems.push(`${set.name || set.species}'s move ${move.name} cannot be linked.`);
				}
			}
			return problems;
		},
	},
	{
		name: "[Gen 7] Lockdown",
		desc: "From Turn 7 onward, hazards, rooms, sports, terrains and weather become permanent.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3593815/">Lockdown</a>`,
		],

		mod: 'gen7lockdown',
		ruleset: ['[Gen 7] OU'],
		unbanlist: ['Genesect'],
	},
	{
		name: "[Gen 7] Mediocremons",
		desc: "Only Pok&eacute;mon whose stats are all less than 100 are allowed.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3602094/">Mediocremons</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Clefable', 'Kingdra', 'Nidoqueen', 'Silvally', 'Type: Null', 'Venomoth', 'Wishiwashi', 'Huge Power', 'Pure Power'],
		onValidateSet(set) {
			const problems = [];
			let template = this.dex.species.get(set.species);
			const item = this.dex.items.get(set.item);
			if (item.megaEvolves === template.name) template = this.dex.species.get(item.megaStone);
			const statTable = {hp: 'an HP', atk: 'an Attack', def: 'a Defense', spa: 'a Special Attack', spd: 'a Special Defense', spe: 'a Speed'};
			let stat: StatID;
			for (stat in statTable) {
				if (template.baseStats[stat] >= 100) problems.push(template.name + " has " + statTable[stat] + " of " + template.baseStats[stat] + ", which is banned.");
			}
			return problems;
		},
	},
	{
		name: "[Gen 7] Mediocremons Anything Goes",
		desc: "Only Pok&eacute;mon whose stats are all less than 100 are allowed.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3602094/">Mediocremons</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		onValidateSet(set) {
			const problems = [];
			let template = this.dex.species.get(set.species);
			const item = this.dex.items.get(set.item);
			if (item.megaEvolves === template.name) template = this.dex.species.get(item.megaStone);
			const statTable = {hp: 'an HP', atk: 'an Attack', def: 'a Defense', spa: 'a Special Attack', spd: 'a Special Defense', spe: 'a Speed'};
			let stat: StatID;
			for (stat in statTable) {
				if (template.baseStats[stat] >= 100) problems.push(template.name + " has " + statTable[stat] + " of " + template.baseStats[stat] + ", which is banned.");
			}
			return problems;
		},
	},
	{
		name: "[Gen 7] Mergemons",
		desc: "Pok&eacute;mon gain the movepool of the previous and next fully evolved Pok&eacute;mon in the PSDex.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3591780/">Mergemons</a>`,
		],

		mod: 'mergemons',
		ruleset: ['[Gen 7] OU'],
		banlist: [],
	},
	{
		name: "[Gen 7] Metagamiate",
		desc: "All Pok&eacute;mon get an -ate Ability if they do not already have one.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3604808/">Metagamiate</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Dragonite', 'Kyurem-Black'],
		onModifyTypePriority: -2,
		onModifyType(move, pokemon) {
			if (move.type === 'Normal' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = pokemon.set.shiny && pokemon.types[1] || pokemon.types[0];
				move.metagamiateBoosted = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower(basePower, pokemon, target, move) {
			if (move.metagamiateBoosted) return this.chainModify([0x1333, 0x1000]);
		},
		validateSet(set, teamHas) {
			const problems = this.validateSet(set);
			if (problems?.length) {
				set = {...set, shiny: !set.shiny};
				const shiny = this.validateSet(set);
				if (shiny && shiny.length > problems.length) return problems;
			}
			return this.validateSet(set, teamHas);
		},
	},
	{
		name: "[Gen 7] Middle Cup",
		desc: "Only Pok&eacute;mon that are in the middle stage of an evolutionary line are allowed.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3588047/">Middle Cup</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU', 'Max Level = 50', 'Default Level = 50'],
		banlist: ['Combusken', 'Conversion', 'Eviolite', 'Light Ball'],
		onValidateSet(set) {
			const template = this.dex.species.get(set.species);
			if (!template.prevo) return [set.species + " is not an evolved Pokemon."];
			if (!template.nfe) return [set.species + " does not have an evolution."];
		},
	},
	{
		name: "[Gen 7] Mix and Mega",
		desc: "Mega Stones and Primal Orbs can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587740/">Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3591580/">Mix and Mega Resources</a>`,
		],

		mod: 'gen7mixandmega',
		ruleset: ['[Gen 7] Ubers', 'Overflow Stat Mod'],
		banlist: ['Electrify', 'Shadow Tag'],
		unbanlist: [],
		restricted: ['Beedrillite', 'Blazikenite', 'Gengarite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Ultranecrozium Z'],
		onValidateTeam(team) {
			const itemTable: {[k: string]: number} = {};
			for (const set of team) {
				const item = this.toID(set.item);
				if (!itemTable[item]) itemTable[item] = 0;
				if (++itemTable[item] < 2) continue;
				if (this.dex.items.get(item).megaStone) return ["You are limited to one of each Mega Stone.", "(You have more than one " + this.dex.items.get(item).name + ".)"];
				if (item === 'blueorb' || item === 'redorb') return ["You are limited to one of each Primal Orb.", "(You have more than one " + this.dex.items.get(item).name + ".)"];
			}
		},
		onValidateSet(set) {
			const template = this.dex.species.get(set.species || set.name);
			const item = this.dex.items.get(set.item);
			if (!item.megaStone && item.id !== 'blueorb' && item.id !== 'redorb') return;
			if (template.baseSpecies === item.megaEvolves || (template.baseSpecies === 'Groudon' && item.id === 'redorb') || (template.baseSpecies === 'Kyogre' && item.id === 'blueorb') || (template.baseSpecies === 'Necrozma' && item.id === 'ultranecroziumz')) return;
			if (template.tier.endsWith('Uber') || set.ability === 'Power Construct') {
				return [template.name + " is not allowed to hold a Mega Stone."];
			}
			switch (item.id) {
			case 'beedrillite': case 'gengarite': case 'kangaskhanite': case 'pidgeotite':
				return [item.name + " is only allowed to be held by " + item.megaEvolves + "."];
			case 'blazikenite':
				if (set.ability === 'Speed Boost') break;
				return ["You are only allowed to hold Blazikenite if your Ability is Speed Boost."];
			case 'mawilite': case 'medichamite':
				if (set.ability === 'Huge Power' || set.ability === 'Pure Power') break;
				if (template.name === "Mawile" || template.name === "Medicham") break;
				return ["You are only allowed to hold " + item.name + " if your Ability is Huge Power or Pure Power."];
			case 'ultranecroziumz':
				return ["Ultranecrozium Z is only allowed to be held by Necrozma-Dawn-Wings or Necrozma-Dusk-Mane."];
			}
		},
		onModifySpecies(template, target, format, effect) {
			if (!effect || ['imposter', 'transform'].includes(effect.id)) return;
			const megaSpecies = (effect as Item).megaStone || ({dragonascent: 'Rayquaza-Mega', redorb: 'Groudon-Primal', blueorb: 'Kyogre-Primal'} as {[k: string]: string})[effect.id];
			if (!megaSpecies || megaSpecies === template.name) return;
			template = this.getMixedSpecies(template, megaSpecies);
			return template;
		},
		onBegin() {
			const allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (const pokemon of allPokemon) {
				pokemon.m.originalSpecies = pokemon.baseSpecies.name;
			}
		},
		onSwitchIn(pokemon) {
			const oMegaTemplate = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				// Place volatiles on the Pokémon to show its mega-evolved condition and details
				this.add('-start', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
				const oTemplate = this.dex.species.get(pokemon.m.originalSpecies);
				if (oTemplate.types.length !== pokemon.species.types.length || oTemplate.types[1] !== pokemon.species.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut(pokemon) {
			const oMegaTemplate = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				this.add('-end', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			}
		},
	},
	{
		name: "[Gen 7] Mix and Mega Random Battle",
		inherit: ['[Gen 7] Mix and Mega'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod', 'Overflow Stat Mod'],
		banlist: [],
		restricted: [],
	},
	{
		name: "[Gen 7] Mix and Mega Factory",
		inherit: ['[Gen 7] Mix and Mega Random Battle', '[Gen 7] Battle Factory'],
		mod: 'gen7mixandmega',
		factoryTier: "Mix and Mega",
	},
	{
		name: "[Gen 7] Monotype",

		searchShow: true,
		ruleset: ['[Gen 7] OU', 'Same Type Clause'],
		banlist: ['Greninja-Ash', 'Hoopa-Unbound', 'Kartana', 'Magearna', 'Medicham-Mega', 'Tapu Lele', 'Damp Rock', 'Smooth Rock', 'Terrain Extender'],
		unbanlist: ['Deoxys-Defense', 'Deoxys-Speed', 'Landorus'],
	},
	{
		name: "[Gen 7] Monotype Random Battle",
		searchShow: true,

		mod: 'gen7',
		team: 'random',
		ruleset: ['Obtainable', 'Same Type Clause', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Monotype Battle Factory",
	},
	{
		name: "[Gen 7] Monotype UU",

		mod: 'gen7',
		ruleset: ['[Gen 7] Monotype'],
		banlist: [
			'Altaria-Mega', 'Araquanid', 'Azumarill', 'Bisharp', 'Breloom',
			'Celesteela', 'Chansey', 'Charizard-Mega-Y', 'Cradily', 'Crobat',
			'Diancie-Mega', 'Diggersby', 'Dragonite', 'Excadrill', 'Ferrothorn', 'Forretress', 'Gallade-Mega',
			'Galvantula', 'Garchomp', 'Gengar',
			'Greninja-Base', 'Heatran', 'Heracross', 'Hydreigon', 'Infernape',
			'Jirachi', 'Keldeo', 'Kingdra', 'Klefki', 'Kyurem-Black',
			'Landorus-Therian', 'Latios', 'Lopunny-Mega',
			'Magnezone', 'Mamoswine', 'Mandibuzz', 'Marshadow',
			'Meloetta', 'Mimikyu', 'Muk-Alola', 'Nidoking', 'Nihilego', 'Ninetales-Alola',
			'Pelipper', 'Pinsir-Mega', 'Porygon2', 'Porygon-Z', 'Rotom-Wash', 'Sableye-Mega',
			'Scizor', 'Shuckle', 'Skarmory', 'Staraptor', 'Swampert-Mega', 'Tapu Bulu',
			'Tapu Koko', 'Terrakion', 'Togekiss', 'Torkoal', 'Toxapex', 'Tyranitar',
			'Venusaur-Mega', 'Victini', 'Volcanion', 'Volcarona', 'Zapdos',
		],
	},
	{
		name: "[Gen 7] Monotype CAP",
		desc: "All the Pok&eacute;mon on a team must share a type.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3600651/">Monotype OM Mega Thread</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] Monotype'],
		banlist: ['Cawmodore'],
		unbanlist: ['CAP'],
	},
	{
		name: "[Gen 7] Monotype Sketchmons",
		inherit: ['[Gen 7] Sketchmons'],
		desc: "All the Pok&eacute;mon on a team must share a type. Each Pok&eacute;mon can learn Sketch once.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587743/">Sketchmons</a>`,
		],

		ruleset: ['[Gen 7] Sketchmons', '[Gen 7] Monotype'],
		banlist: [],
		unbanlist: [],
		restricted: [],
	},
	{
		name: "Monotype Gen 8",
		desc: "A Monotype-based Pet Mod with lots of new Pok&eacute;mon.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3642289/">Monotype Gen 8 Thread</a>`,
		],

		mod: 'monotypegen8',
		ruleset: ['[Gen 7] Monotype'],
		onSwitchIn(pokemon) {
			this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
		},
	},
	{
		name: "[Gen 7] Move Equality",
		desc: "All standard attacks with a fixed base power are now 100BP total.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3599280/">Move Equality</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Fell Stinger', 'Mud-Slap', 'Power-Up Punch'],
		restricted: ['Body Slam', 'Earthquake', 'Flying Press', 'Gust', 'Magnitude', 'Phantom Force', 'Shadow Force', 'Steamroller', 'Stomp', 'Surf', 'Twister', 'Whirlpool'],
		onModifyMove(move, pokemon) {
			if (this.ruleTable.isRestricted('move:' + move.name)) return;
			if (move.category === 'Status') return;
			const moveCopy = this.dex.moves.get(move.id);
			if (!moveCopy.basePower) return;
			if (moveCopy.priority) return;
			if (moveCopy.basePowerCallback) return;
			if (moveCopy.onBasePower) return;
			if (typeof move.multihit === 'number') {
				move.basePower = 100 / move.multihit;
			} else if (move.multihit) {
				move.basePower = 100 / move.multihit[1];
			} else if (move.isZ) {
				move.basePower = 180;
			} else {
				move.basePower = 100;
			}
		},
	},
	{
		name: "[Gen 7] Nature Swap",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3612727/">Nature Swap</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Blissey', 'Chansey', 'Cloyster', 'Hoopa-Unbound', 'Kyurem-Black', 'Stakataka'],
		battle: {
			natureModify(stats, set) {
				const nature = this.dex.natures.get(set.nature);
				if (nature.plus && nature.minus) {
					const stat = stats[nature.minus];
					stats[nature.minus] = stats[nature.plus];
					stats[nature.plus] = Math.floor(stat * 1.1);
				}
				return stats;
			},
		},
	},
	{
		name: "[Gen 7] Pokebilities",
		desc: "Pok&eacute;mon have all of their Abilities simultaneously, excluding unreleased or banned Abilities.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3588652/">Pok&eacute;bilities</a>`,
		],

		mod: 'gen7pokebilities',
		ruleset: ['[Gen 7] OU', 'Evasion Abilities Clause'],
		banlist: ['Excadrill', 'Porygon-Z'],
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				if (pokemon.ability === this.toID(pokemon.species.abilities['S'])) {
					pokemon.m.innates = [];
					continue;
				}
				pokemon.m.innates = (Object.keys(pokemon.species.abilities) as AbilityIndex[]).filter(key => key !== 'S' && (key !== 'H' || !pokemon.species.unreleasedHidden)).map(key => this.toID(pokemon.species.abilities[key])).filter(ability => ability !== pokemon.ability && !this.ruleTable.get('-ability:' + ability));
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			(pokemon.m.innates as string[]).forEach(innate => pokemon.addVolatile('ability:' + innate, pokemon));
		},
		onAfterMega(pokemon) {
			Object.keys(pokemon.volatiles).filter(innate => innate.startsWith('ability:')).forEach(innate => pokemon.removeVolatile(innate));
			pokemon.m.innates = [];
		},
	},
	{
		name: "[Gen 7] Pokebilities Random Battle",
		inherit: ['[Gen 7] Pokebilities'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: [],
	},
	{
		name: "[Gen 7] Reversed",
		desc: "Physical and Special stats are switched.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3623871/">Reversed</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Kyurem-Black', 'Tapu Koko'],
		unbanlist: ['Kyurem-White', 'Marshadow', 'Metagross-Mega', 'Naganadel', 'Reshiram'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			const newTemplate = this.dex.deepClone(template);
			const baseStats = template.baseStats;
			newTemplate.baseStats = {hp: baseStats.hp, atk: baseStats.spa, def: baseStats.spd, spa: baseStats.atk, spd: baseStats.def, spe: baseStats.spe};
			return newTemplate;
		},
	},
	{
		name: "[Gen 7] Scalemons",
		desc: "Every Pok&eacute;mon has its stats (excluding HP) scaled to give a BST of near to 600.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3607934/">Scalemons</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers', '!Mega Rayquaza Clause'],
		banlist: ['Abra', 'Carvanha', 'Gastly', 'Medicham-Mega', 'Shedinja', 'Arena Trap', 'Huge Power', 'Shadow Tag', 'Deep Sea Scale', 'Deep Sea Tooth', 'Eevium Z', 'Eviolite', 'Light Ball', 'Thick Club'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			const newTemplate = this.dex.deepClone(template);
			const stats: StatIDExceptHP[] = ['atk', 'def', 'spa', 'spd', 'spe'];
			const pst = template.bst - template.baseStats['hp'];
			const scale = 600 - template.baseStats['hp'];
			for (const stat of stats) {
				newTemplate.baseStats[stat] = this.clampIntRange(newTemplate.baseStats[stat] * scale / pst, 1, 255);
			}
			newTemplate.bst = newTemplate.baseStats.hp + newTemplate.baseStats.atk + newTemplate.baseStats.def + newTemplate.baseStats.spa + newTemplate.baseStats.spd + newTemplate.baseStats.spe;
			return newTemplate;
		},
	},
	{
		name: "[Gen 7] Shared Power",
		desc: "All of the team's abilities are active at once, except those that are restricted.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3623341/">Shared Power</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU', 'Evasion Abilities Clause'],
		banlist: ['Gyarados-Mega', 'Shedinja', 'Prankster ++ Substitute'],
		unbanlist: ['Aegislash', 'Blaziken', 'Blaziken-Mega', 'Deoxys-Defense'],
		restricted: [
			'Chlorophyll', 'Comatose', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Magic Guard', 'Mold Breaker', 'Multiscale', 'Protean', 'Pure Power', 'Quick Feet', 'Rattled', 'Regenerator', 'Sand Rush', 'Simple', 'Skill Link', 'Slush Rush', 'Speed Boost',
			'Sturdy', 'Surge Surfer', 'Swift Swim', 'Teravolt', 'Tinted Lens', 'Trace', 'Unburden', 'Water Bubble', 'Weak Armor',
		],
		field: {
			suppressingWeather() {
				for (const pokemon of this.battle.getAllActive()) {
					if (!pokemon.ignoringAbility() && pokemon.hasAbility('Cloud Nine')) {
						return true;
					}
				}
				return false;
			},
		},
		pokemon: {
			hasAbility(ability) {
				if (this.ignoringAbility()) return false;
				if (Array.isArray(ability)) return ability.some(this.hasAbility, this);
				ability = this.battle.toID(ability);
				return this.ability === ability || !!this.volatiles['ability:' + ability];
			},
			getSharedPower() {
				const sharedPower: Set<string> = new Set();
				for (const ally of this.side.pokemon) {
					if (ally !== this && !this.battle.ruleTable.isRestricted('ability:' + ally.baseAbility)) sharedPower.add(ally.baseAbility);
				}
				return sharedPower;
			},
		},
		onBeforeSwitchIn(pokemon) {
			for (const ability of pokemon.getSharedPower()) {
				const effect = 'ability:' + ability;
				pokemon.volatiles[effect] = {id: effect, target: pokemon};
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			for (const ability of pokemon.getSharedPower()) {
				const effect = 'ability:' + ability;
				delete pokemon.volatiles[effect];
				pokemon.addVolatile(effect);
			}
		},
		onAfterMega(pokemon) {
			pokemon.removeVolatile('ability:' + pokemon.baseAbility);
			for (const ability of pokemon.getSharedPower()) {
				const effect = 'ability:' + ability;
				pokemon.addVolatile(effect);
			}
		},
	},
	{
		name: "[Gen 7] Shared Power Monotype",
		inherit: ['[Gen 7] Shared Power'],
		desc: "All of the team's abilities are active at once, except those that are restricted. All the Pok&eacute;mon on a team must share a type.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3623341/">Shared Power</a>`,
		],

		ruleset: ['[Gen 7] Shared Power', 'Same Type Clause'],
		banlist: [],
		unbanlist: ['Innards Out', 'Regenerator', 'Skill Link', 'Sturdy'],
		restricted: ['Harvest', 'Pressure'],
		onBeforeSwitchIn() {},
		onSwitchIn() {},
		onAfterMega() {},
	},
	{
		name: "[Gen 7] Sketchmons",
		desc: "Each Pok&eacute;mon can learn Sketch once.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587743/">Sketchmons</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Porygon-Z'],
		restricted: ['Belly Drum', 'Celebrate', 'Chatter', 'Conversion', "Forest's Curse", 'Geomancy', 'Happy Hour', 'Hold Hands', 'Lovely Kiss', 'Purify', 'Quiver Dance', 'Shell Smash', 'Shift Gear', 'Sketch', 'Spore', 'Sticky Web', 'Trick-or-Treat'],
		validateSet(set, teamHas) {
			const problems = this.validateSet(set, teamHas);
			for (set.sketchMove of set.moves.map(this.toID)) {
				if (!this.validateSet(set)) return null;
			}
			delete set.sketchMove;
			return problems;
		},
		checkCanLearn(move, template, lsetData, set) {
			if (!set?.sketchMove || move.isZ || this.ruleTable.isRestricted('move:' + move.id)) return this.checkCanLearn(move, template, lsetData, set);
			if (move.id === set.sketchMove || !this.checkCanLearn(move, template, lsetData, set)) return null;
			return `${template.name}'s move ${move.name} can't be Sketched because it can only Sketch 1 move.`;
		},
		onValidateTeam(team, format, teamHas) {
			const sketches: {[k: string]: number} = {};
			for (const set of team) {
				if (set.sketchMove) {
					if (!sketches[set.sketchMove]) sketches[set.sketchMove] = 0;
					sketches[set.sketchMove]++;
				}
			}
			const overSketched = Object.keys(sketches).filter(move => sketches[move] > 1);
			if (overSketched.length) return overSketched.map(move => "You are limited to 1 of " + this.dex.moves.get(move).name + " by Sketch Clause. (You have sketched " + this.dex.moves.get(move).name + " " + sketches[move] + " times.)");
		},
	},
	{
		name: "[Gen 7] Sketchmons UU",
		inherit: ['[Gen 7] Sketchmons'],
		desc: "Each Pok&eacute;mon can learn Sketch once.",

		ruleset: ['[Gen 7] Sketchmons'],
		banlist: [
			'Azumarill',
			'Celesteela', 'Chansey', 'Comfey', 'Diancie', 'Diancie-Mega',
			'Ferrothorn', 'Galvantula', 'Garchomp', 'Gardevoir-Mega',
			'Greninja', 'Heatran', 'Jirachi', 'Kartana',
			'Kyurem-Black', 'Landorus-Therian', 'Lopunny-Mega',
			'Magearna', 'Malamar', 'Marowak-Alola',
			'Mawile-Mega', 'Mimikyu', 'Nihilego', 'Ninetales-Alola', 'Pidgeot-Mega', 'Pinsir-Mega',
			'Porygon2', 'Primarina', 'Rhyperior', 'Salamence',
			'Serperior', 'Shedinja', 'Shuckle', 'Slaking', 'Snorlax', 'Skarmory',
			'Tangrowth', 'Tapu Koko',
			'Tapu Lele', 'Toxapex', 'Ursaring', 'Xurkitree', 'Zygarde',
		],
		restricted: [],
	},
	{
		name: "[Gen 7] STABmons",
		desc: "Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587949/">STABmons</a>`,
		],

		mod: 'gen7',
		searchShow: true,
		ruleset: ['[Gen 7] OU'],
		banlist: ['Aerodactyl', 'Araquanid', 'Blacephalon', 'Kartana', 'Komala', 'Kyurem-Black', 'Porygon-Z', 'Silvally', 'Tapu Koko', 'Tapu Lele', "King's Rock", 'Razor Fang'],
		unbanlist: ['Deoxys-Defense', 'Deoxys-Speed', 'Kyurem-White'],
		restricted: ['Acupressure', 'Belly Drum', 'Chatter', 'Extreme Speed', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Sketch', 'Spore', 'Thousand Arrows'],
		checkCanLearn(move, template, lsetData, set) {
			if (!move.isZ && !this.ruleTable.isRestricted('move:' + move.id)) {
				let types = template.types;
				if (template.prevo) types = types.concat(this.dex.species.get(this.dex.species.get(template.prevo).prevo || template.prevo).types);
				if (template.baseSpecies === 'Rotom') types = ['Electric', 'Ghost', 'Fire', 'Water', 'Ice', 'Flying', 'Grass'];
				if (template.baseSpecies === 'Shaymin') types = ['Grass', 'Flying'];
				if (template.baseSpecies === 'Hoopa') types = ['Psychic', 'Ghost', 'Dark'];
				if (template.baseSpecies === 'Oricorio') types = ['Fire', 'Flying', 'Electric', 'Psychic', 'Ghost'];
				if (template.baseSpecies === 'Necrozma') types = ['Psychic', 'Steel', 'Ghost'];
				if (template.baseSpecies === 'Arceus' || template.baseSpecies === 'Silvally' || types.includes(move.type)) return null;
			}
			return this.checkCanLearn(move, template, lsetData, set);
		},
	},
	{
		name: "[Gen 7] STABmons Factory",
		inherit: ['[Gen 7] Battle Factory'],
		factoryTier: "STABmons",
	},
	{
		name: "[Gen 7] Statattack",
		desc: "Pok&eacute;mon may replace one of their moveslots with an automatic stat boost.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3613153/">Statattack</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		validateSet(set, teamHas) {
			const effectiveSet = {...set};
			const stats = ['atk', 'attack', 'def', 'defense', 'spa', 'specialattack', 'spd', 'specialdefense', 'spe', 'speed'];
			effectiveSet.moves = set.moves.filter(move => !stats.includes(this.toID(move)));
			if (set.moves.length - effectiveSet.moves.length > 1) return [(set.name || set.species) + ' has more than one boost.'];
			return this.validateSet(effectiveSet, teamHas);
		},
		onBegin() {
			const stats = ['atk', 'attack', 'def', 'defense', 'spa', 'specialattack', 'spd', 'specialdefense', 'spe', 'speed'];
			for (const pokemon of this.p1.pokemon.concat(this.p2.pokemon)) {
				pokemon.moveSlots = pokemon.baseMoveSlots = pokemon.baseMoveSlots.filter(move => !stats.includes(move.id));
			}
		},
		onSwitchIn(pokemon) {
			const stats = ['attack', 'atk', 'defense', 'def', 'specialattack', 'spa', 'specialdefense', 'spd', 'speed', 'spe'];
			for (const move of pokemon.set.moves) {
				const index = stats.indexOf(this.toID(move)) | 1;
				if (index >= 0) {
					const boost: {[k: string]: number} = {};
					boost[stats[index]] = 1;
					this.boost(boost, pokemon, pokemon);
				}
			}
		},
	},
	{
		name: "[Gen 7] Status Hazard",
		desc: "Status moves in a Pokemon's first and second move slots can become hazard-setting moves.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3571986/">Status Hazard</a>`,
		],

		mod: 'statushazard',
		ruleset: ['[Gen 7] OU'],
		restricted: ['Block', 'Curse', 'Mean Look', 'Spider Web', 'Roar', 'Whirlwind', 'Taunt'],
		maxHazards: 2,
		onBegin() {
			this.add('-message', "Remember, status moves in your first two move slots can become status hazards!");
			const maxHazards = this.format.maxHazards;
			if (maxHazards) {
				this.add('-message', `Only ${maxHazards} may be set at once per side.`);
			}
		},
		onModifyMovePriority: -999,
		onModifyMove(move, pokemon, target) {
			if (move.category === 'Status' && ["normal", "allAdjacentFoes", "allAdjacent", "adjacentFoe"].includes(move.target) && pokemon.moves.indexOf(move.id) < 2 && !this.ruleTable.isRestricted('move:' + move.id)) {
				move.statusHazard = true;
				move.target = "foeSide";
				move.flags['reflectable'] = true;
			}
		},
		onTryHitSidePriority: -999,
		onTryHitSide(target, source, move) {
			if (move.statusHazard) {
				target.side.addSideCondition('statushazard');
				const s = target.side.sideConditions['statushazard'];
				const currentHazards = (s.hazards as ActiveMove[]).map(a => a.id);
				if (currentHazards.includes(move.id)) return false;

				// accuracy check time!
				const boostTable = [1, 4 / 3, 5 / 3, 2, 7 / 3, 8 / 3, 3];
				let accuracy = move.accuracy;
				let boosts, boost;
				if (accuracy !== true) {
					if (!move.ignoreAccuracy) {
						boosts = this.runEvent('ModifyBoost', source, null, null, {...source.boosts});
						boost = this.clampIntRange(boosts['accuracy'], -6, 6);
						if (boost > 0) {
							accuracy *= boostTable[boost];
						} else {
							accuracy /= boostTable[-boost];
						}
					}
				}
				// run accuracy modifiers! but we don't have a target...
				// The hack is to run the ModifyAccuracy event with no target (global modifiers like Gravity)
				// and then pretend SourceModifyAccuracy is an event in its own right (source modifiers like CompoundEyes).
				// There are many ways this could go wrong, like if the user's ally had an onAllyModifyAccuracy,
				// or if a foe sideCondition had a ModifyAccuracy. We would want to account for both of these.
				// Thankfully, I don't believe these cases exist.
				accuracy = this.runEvent('ModifyAccuracy', null, null, move, accuracy);
				accuracy = this.runEvent('SourceModifyAccuracy', source, null, move, accuracy);
				if (move.alwaysHit || source.hasAbility('noguard') || (move.id === 'toxic' && source.hasType('Poison'))) {
					accuracy = true;
				} else {
					// I don't think either of these do anything.
					accuracy = this.runEvent('Accuracy', null, null, move, accuracy);
					accuracy = this.runEvent('SourceAccuracy', source, null, move, accuracy);
				}

				if (accuracy !== true && this.random(100) >= accuracy) {
					this.add('-miss', source, target);
					return false;
				}

				// ---hit line---
				move.target = 'normal';
				if (move.selfdestruct === 'ifHit') { // Memento case
					this.faint(source);
					delete move.selfdestruct;
				}
				if (move.selfSwitch) { // Parting Shot case
					source.switchFlag = move.id;
					delete move.selfSwitch;
				}
				if (['defog', 'curse'].includes(move.id)) { // super-special cases
					this.singleEvent('Hit', move, null, target, source, move);
					delete move.onHit;
				}

				const maxHazards = this.format.maxHazards;
				if (maxHazards && s.hazards.length === maxHazards) {
					const removedHazard = s.hazards.shift();
					this.add('-message', `The ${removedHazard.name} hazard vanished!`);
					this.add('-sideend', target.side, `hazard:${removedHazard.id}`, '[silent]');
				}

				this.add('-message', `A ${move.name} hazard was set!`);
				this.add('-sidestart', target.side, `hazard:${move.id}`, '[silent]');
				s.hazards.push(move);
				return null;
			}
		},
	},
	{
		name: "[Gen 7] Suicide Cup",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3633603/">Suicide Cup</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers', '!Mega Rayquaza Clause', '!OHKO Clause', 'Min Team Size = 6', 'Adjust Level = 100'],
		banlist: ['Shedinja', 'Infiltrator', 'Magic Guard', 'Misty Surge', 'Explosion', 'Final Gambit', 'Healing Wish', 'Lunar Dance', 'Magic Room', 'Memento', 'Misty Terrain', 'Self Destruct', 'Assault Vest', 'Choice Scarf'],
		unbanlist: ['Baton Pass'],
		onValidateTeam(team) {
			const familyTable: {[k: string]: boolean} = {};
			for (const set of team) {
				let template = this.dex.species.get(set.species);
				while (template.prevo) {
					template = this.dex.species.get(template.prevo);
				}
				if (familyTable[template.id]) return ["You are limited to one Pok&eacute;mon from each family by the Family Clause.", "(You have more than one evolution of " + template.name + ".)"];
				familyTable[template.id] = true;
			}
		},
		battle: {
			win(side) {
				if (this.ended) {
					return false;
				}
				if (side === 'p1' || side === 'p2') {
					side = this[side];
				}
				let foe = null;
				if (side === this.p1 || side === this.p2) {
					foe = side.foe;
				}
				this.winner = foe ? foe.name : '';

				this.add('');
				if (foe) {
					this.add('win', foe.name);
				} else {
					this.add('tie');
				}
				this.ended = true;
				this.requestState = '';
				for (const s of this.sides) {
					s.activeRequest = null;
				}
				return true;
			},
		},
	},
	{
		name: "[Gen 7] Tier Shift",
		desc: "Pok&eacute;mon below OU get all their stats boosted. UU/RBL get +10, RU/NUBL get +20, NU/PUBL get +30, and PU or lower get +40.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3610073/">Tier Shift</a>`,
		],

		mod: 'gen7',
		searchShow: true,
		ruleset: ['[Gen 7] OU', 'Overflow Stat Mod'],
		banlist: ['Drought', 'Damp Rock', 'Heat Rock', 'Deep Sea Tooth', 'Eviolite'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			if (!template.abilities) return;

			const boosts: {[k: string]: number} = {
				'UU': 10,
				'RUBL': 10,
				'RU': 20,
				'NUBL': 20,
				'NU': 30,
				'PUBL': 30,
				'PU': 40,
				'NFE': 40,
				'LC Uber': 40,
				'LC': 40,
			};
			const newTemplate = this.dex.deepClone(template);
			if (target.set.item) {
				const item = this.dex.items.get(target.set.item);
				if (item.megaEvolves === template.name) newTemplate.tier = this.dex.species.get(item.megaStone).tier;
			}
			if (newTemplate.tier[0] === '(') newTemplate.tier = newTemplate.tier.slice(1, -1);
			if (!(newTemplate.tier in boosts)) return;
			if (target.set.moves.includes('chatter')) newTemplate.tier = 'PUBL';
			if (target.set.moves.includes('auroraveil') && boosts[newTemplate.tier] > 10) newTemplate.tier = 'RUBL';
			if (target.set.ability === 'Drought') {
				if (boosts[newTemplate.tier] > 20) newTemplate.tier = 'NUBL';
				else if (boosts[newTemplate.tier] === 10) newTemplate.tier = 'UUBL';
			}
			if (target.set.ability === 'Drizzle') newTemplate.tier = 'UUBL';

			const boost = boosts[newTemplate.tier];
			for (const statName of ['atk', 'def', 'spa', 'spd', 'spe']) {
				newTemplate.baseStats[statName] = this.clampIntRange(newTemplate.baseStats[statName] + boost, 1, 255);
			}
			newTemplate.bst = newTemplate.baseStats.hp + newTemplate.baseStats.atk + newTemplate.baseStats.def + newTemplate.baseStats.spa + newTemplate.baseStats.spd + newTemplate.baseStats.spe;
			return newTemplate;
		},
	},
	{
		name: "[Gen 7] Tier Shift Random Battle",
		inherit: ['[Gen 7] Tier Shift'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: [],
	},
	{
		name: "[Gen 7] Trademarked",
		desc: "Pok&eacute;mon may use any Status move as an Ability, excluding those that are banned.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3647897/">Trademarked</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Slaking', 'Regigigas'],
		restricted: ['Assist', 'Baneful Bunker', 'Block', 'Copycat', 'Destiny Bond', 'Detect', 'Instruct', 'Mat Block', 'Mean Look', 'Nature Power', 'Protect', 'Roar', 'Skill Swap', 'Spider Web', 'Spiky Shield', 'Whirlwind', 'Yawn'],
		onValidateTeam(team, format, teamHas) {
			for (const trademark in teamHas.trademarks) {
				if (teamHas.trademarks[trademark] > 1) return ['You are limited to 1 of each Trademark. (You have ' + teamHas.trademarks[trademark] + ' of ' + trademark + ').'];
			}
		},
		validateSet(set, teamHas) {
			const move = this.dex.moves.get(set.ability);
			if (move.category !== 'Status' || move.status === 'slp' || this.ruleTable.isRestricted('move:' + move.id) || set.moves.map(this.toID).includes(move.id)) return this.validateSet(set, teamHas);
			const customRules = this.format.customRules || [];
			if (!customRules.includes('!obtainableabilities')) customRules.push('!obtainableabilities');
			const TeamValidator = this.constructor as new(format: string | Format) => TeamValidator;
			const validator = new TeamValidator(Dex.formats.get(this.format.id + '@@@' + customRules.join(',')));
			const moves = set.moves;
			set.moves = [set.ability];
			set.ability = '';
			let problems = validator.validateSet(set) || [];
			set.moves = moves;
			set.ability = '';
			problems = problems.concat(validator.validateSet(set, teamHas) || []);
			set.ability = move.id;
			if (!teamHas.trademarks) teamHas.trademarks = {};
			teamHas.trademarks[move.name] = (teamHas.trademarks[move.name] || 0) + 1;
			return problems.length ? problems : null;
		},
		pokemon: {
			getAbility() {
				const move = this.battle.dex.moves.get(this.ability);
				if (!move.exists) return this.battle.dex.abilities.get(this.ability);
				const abilityData: AbilityData = {
					id: move.id,
					name: move.name,
					fullname: 'ability: ' + move.name,
					effectType: 'Ability',
					exists: true,
					num: 0,
					gen: 0,
					sourceEffect: "",
					rating: 0,
					onStart(pokemon) {
						this.add('-activate', pokemon, 'ability: ' + move.name);
						this.actions.useMove(move.id, pokemon);
					},
					toString() {
						return ""; // for useMove
					},
				};
				return abilityData as Ability;
			},
		},
	},
	{
		name: "[Gen 7] Typemons",
		desc: "All Pok&eacute;mon on a team get access to all moves of a chosen type which must be the same for the entire team, except for those moves that are restricted.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3606351/">Typemons</a>`,
		],

		mod: 'gen7',
		searchShow: true,
		ruleset: ['Gen 7] OU'],
		banlist: ['Serperior'],
		restricted: ['Geomancy', 'Quiver Dance', 'Shift Gear', 'Sticky Web', 'Tail Glow'],
		checkCanLearn(move, template, lsetData, set) {
			const problem = this.checkCanLearn(move, template, lsetData, set);
			if (!problem || !set) return problem;
			if (move.isZ || this.ruleTable.isRestricted('move:' + move.id)) return problem;
			const typemons = set.typemons!;
			if (!typemons.type) typemons.type = move.type;
			if (move.type !== typemons.type) return `${template.name}'s move ${move.name} can't be Sketched because it needs to have the ${typemons.type} type.`;
			if (typemons.moves.includes(move.id)) return `${template.name}'s move ${move.name} can't be Sketched because it has already been Sketched by another team member.`;
			typemons.moves.push(move.id);
			return null;
		},
		validateSet(set, teamHas) {
			if (!teamHas.typemons) teamHas.typemons = {type: null, moves: []};
			set.typemons = teamHas.typemons;
			return this.validateSet(set, teamHas);
		},
	},
	{
		name: "[Gen 7] Ultimate Z",
		desc: "Z-Crystals can be used at any time and do not have to be the same type as the base move.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3609393/">Ultimate Z</a>`,
		],

		mod: 'ultimatez',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Kyurem-Black', 'Celebrate', 'Conversion', 'Happy Hour', 'Hold Hands'],
	},

	// Doubles Metagames
	///////////////////////////////////////////////////////////////////

	{
		section: 'USM Doubles Metagames',
		column: 1,
	},
	{
		name: "[Gen 7] 2v2 Doubles",
		desc: "Doubles battle where you bring four Pok&eacute;mon to Team Preview and choose only two.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3606989/">2v2 Doubles</a>`,
		],

		mod: 'gen7',
		gameType: 'doubles',
		searchShow: true,
		ruleset: ['[Gen 7] Doubles OU', 'Accuracy Moves Clause', 'Sleep Clause Mod', 'Z-Crystals Clause', 'Max Team Size = 4', 'Picked Team Size = 2'],
		banlist: ['Salamence-Mega', 'Tapu Lele', 'Final Gambit', 'Perish Song', 'Focus Sash'],
	},
	{
		name: "[Gen 7] AAA Doubles",
		inherit: ['[Gen 7] Almost Any Ability', '[Gen 7] Doubles OU'],
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3635904/">OM Mashup Megathread</a>`,
		],

		gameType: 'doubles',
		ruleset: ['[Gen 7] Doubles OU', '2 Ability Clause', '!Obtainable Abilities'],
		banlist: ['Archeops', 'Dragonite', 'Hoopa-Unbound', 'Kartana', 'Keldeo', 'Kyurem-Black', 'Regigigas', 'Shedinja', 'Slaking', 'Terrakion'],
		restricted: [
			'Anger Point', 'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Justified', 'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
		],
	},
	{
		name: "[Gen 7] Anything Goes Doubles",
		inherit: ['[Gen 7] Anything Goes'],
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3635904/">OM Mashup Megathread</a>`,
		],

		gameType: 'doubles',
		ruleset: ['[Gen 7] Anything Goes'],
		banlist: [],
	},
	{
		name: "[Gen 7] BH Doubles",
		inherit: ['[Gen 7] Balanced Hackmons'],
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3635904/">OM Mashup Megathread</a>`,
		],

		searchShow: true,
		gameType: 'doubles',
		ruleset: ['[Gen 7] Balanced Hackmons'],
		banlist: [],
		unbanlist: [],
	},
	{
		name: "[Gen 7] Challenge Cup 2v2",

		mod: 'gen7',
		team: 'randomCC',
		gameType: 'doubles',
		searchShow: false,
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview', 'Picked Team Size = 2'],
	},
	{
		name: "[Gen 7] Metronome Battle",
		desc: "A 2v2 BH Doubles format where the only move allowed is Metronome.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3632075/">Metronome Battle</a>`,
		],

		mod: 'gen7',
		gameType: 'doubles',
		searchShow: true,
		ruleset: ['Obtainable', 'Moody Clause', 'HP Percentage Mod', 'Cancel Mod', 'Max Team Size = 2', 'Min Team Size = 2'],
		banlist: [
			'Cheek Pouch', 'Cursed Body', 'Desolate Land', 'Dry Skin', 'Fluffy', 'Fur Coat', 'Grassy Surge', 'Huge Power', 'Ice Body',
			'Iron Barbs', 'Parental Bond', 'Poison Heal', 'Power Construct', 'Pressure', 'Primordial Sea', 'Protean', 'Pure Power', 'Rain Dish',
			'Rough Skin', 'Sand Stream', 'Schooling', 'Snow Warning', 'Stamina', 'Volt Absorb', 'Water Absorb', 'Wonder Guard',
			'Aguav Berry', 'Berry', 'Berry Juice', 'Berserk Gene', 'Black Sludge', 'Enigma Berry', 'Figy Berry', 'Gold Berry', 'Iapapa Berry',
			'Leftovers', 'Mago Berry', 'Normalium Z', 'Oran Berry', 'Rocky Helmet', 'Shell Bell', 'Sitrus Berry', 'Wiki Berry',
			'Shedinja + Sturdy', 'Harvest + Jaboca Berry', 'Harvest + Rowap Berry',
		],
		onValidateSet(set) {
			let template = this.dex.species.get(set.species);
			const item = this.dex.items.get(set.item);
			if (item.megaEvolves === template.name) template = this.dex.species.get(item.megaStone);
			if (this.toID(set.ability) === 'battlebond' && template.id === 'greninja') template = this.dex.species.get('greninjaash');
			if (set.name === template.baseSpecies) return [`${template.name} must have a nickname.`];
			if (template.types.includes('Ghost') && template.types.includes('Steel')) return [`${set.name} (${template.name}) is ${template.types.join('/')} type, which is banned.`];
			if (template.bst > 625) return [`${set.name} (${template.name}) has a BST greater than 625.`];
			if (set.moves.length !== 1 || this.toID(set.moves[0]) !== 'metronome') return [`${set.name} (${template.name}) has an illegal moveset (only Metronome is allowed).`];
		},
	},
	{
		name: "[Gen 7] Mix and Mega Doubles",
		inherit: ['[Gen 7] Mix and Mega'],
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3635904/">OM Mashup Megathread</a>`,
		],

		gameType: 'doubles',
		ruleset: ['[Gen 7] Doubles Ubers', 'Swagger Clause', 'Sleep Moves Clause', 'Mega Rayquaza Clause', 'Overflow Stat Mod'],
		banlist: ['Blue Orb', 'Red Orb', 'Electrify'],
		unbanlist: ['Shadow Tag'],
		onValidateSet(set) {
			const template = this.dex.species.get(set.species || set.name);
			const item = this.dex.items.get(set.item);
			if (!item.megaStone && item.id !== 'blueorb' && item.id !== 'redorb') return;
			if (template.baseSpecies === item.megaEvolves || (template.baseSpecies === 'Groudon' && item.id === 'redorb') || (template.baseSpecies === 'Kyogre' && item.id === 'blueorb') || (template.baseSpecies === 'Necrozma' && item.id === 'ultranecroziumz')) return;
			if (template.doublesTier.endsWith('Uber') || set.ability === 'Power Construct') {
				return [template.name + " is not allowed to hold a Mega Stone."];
			}
			switch (item.id) {
			case 'beedrillite': case 'kangaskhanite': case 'pidgeotite':
				return [item.name + " is only allowed to be held by " + item.megaEvolves + "."];
			case 'blazikenite':
				if (set.ability === 'Speed Boost') break;
				return ["You are only allowed to hold Blazikenite if your Ability is Speed Boost."];
			case 'gengarite':
				if (set.ability === 'Shadow Tag') break;
				return ["You are only allowed to hold Gengarite if your Ability is Shadow Tag."];
			case 'mawilite': case 'medichamite':
				if (set.ability === 'Huge Power' || set.ability === 'Pure Power') break;
				if (template.name === "Mawile" || template.name === "Medicham") break;
				return ["You are only allowed to hold " + item.name + " if your Ability is Huge Power or Pure Power."];
			case 'ultranecroziumz':
				return ["Ultranecrozium Z is only allowed to be held by Necrozma-Dawn-Wings or Necrozma-Dusk-Mane."];
			}
		},
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 7] Mix and Mega Random Doubles Battle",
		inherit: ['[Gen 7] Mix and Mega Doubles', '[Gen 7] Mix and Mega Random Battle'],
	},
	{
		name: "[Gen 7] Mix and Mega Random Multi Battle",
		inherit: ["[Gen 7] Mix and Mega Random Doubles Battle"],

		gameType: 'multi',
	},
	{
		name: "[Gen 7] Monotype Doubles OU",
		desc: "All the Pok&eacute;mon on a team must share a type.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3600651/">Monotype OM Mega Thread</a>`,
		],

		gameType: 'doubles',
		mod: 'gen7',
		ruleset: ['[Gen 7] Doubles OU', 'Same Type Clause'],
		banlist: ['Damp Rock', 'Smooth Rock', 'Terrain Extender'],
	},
	{
		name: "[Gen 7] Partners in Crime",
		desc: "Doubles-based metagame where both active ally Pok&eacute;mon share abilities and moves.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3618488/">Partners in Crime</a>`,
		],

		mod: 'gen7pic',
		gameType: 'doubles',
		ruleset: ['[Gen 7] Doubles OU', 'Sleep Clause Mod'],
		banlist: ['Huge Power', 'Imposter', 'Normalize', 'Parental Bond', 'Pure Power', 'Wonder Guard', 'Mimic', 'Sketch', 'Sweet Scent', 'Transform'],
		restricted: ['Power of Alchemy', 'Receiver', 'Trace'],
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			if (this.p1.active.every(ally => ally && !ally.fainted)) {
				const p1a = this.p1.active[0], p1b = this.p1.active[1];
				if (p1a.ability !== p1b.ability) {
					const p1a_innate = 'ability:' + p1b.ability;
					p1a.volatiles[p1a_innate] = {id: p1a_innate, target: p1a};
					const p1b_innate = 'ability:' + p1a.ability;
					p1b.volatiles[p1b_innate] = {id: p1b_innate, target: p1b};
				}
			}
			if (this.p2.active.every(ally => ally && !ally.fainted)) {
				const p2a = this.p2.active[0], p2b = this.p2.active[1];
				if (p2a.ability !== p2b.ability) {
					const p2a_innate = 'ability:' + p2b.ability;
					p2a.volatiles[p2a_innate] = {id: p2a_innate, target: p2a};
					const p2b_innate = 'ability:' + p2a.ability;
					p2b.volatiles[p2b_innate] = {id: p2b_innate, target: p2b};
				}
			}
			const ally = pokemon.side.active.find(active => active && active !== pokemon && !active.fainted);
			if (ally && ally.ability !== pokemon.ability) {
				if (!pokemon.m.innate) {
					pokemon.m.innate = 'ability:' + ally.ability;
					delete pokemon.volatiles[pokemon.m.innate];
					pokemon.addVolatile(pokemon.m.innate);
				}
				if (!ally.m.innate) {
					ally.m.innate = 'ability:' + pokemon.ability;
					delete ally.volatiles[ally.m.innate];
					ally.addVolatile(ally.m.innate);
				}
			}
		},
		onSwitchOut(pokemon) {
			if (pokemon.m.innate) {
				pokemon.removeVolatile(pokemon.m.innate);
				delete pokemon.m.innate;
			}
			const ally = pokemon.side.active.find(active => active && active !== pokemon && !active.fainted);
			if (ally?.m.innate) {
				ally.removeVolatile(ally.m.innate);
				delete ally.m.innate;
			}
		},
		onFaint(pokemon) {
			if (pokemon.m.innate) {
				pokemon.removeVolatile(pokemon.m.innate);
				delete pokemon.m.innate;
			}
			const ally = pokemon.side.active.find(active => active && active !== pokemon && !active.fainted);
			if (ally?.m.innate) {
				ally.removeVolatile(ally.m.innate);
				delete ally.m.innate;
			}
		},
	},
	{
		name: "[Gen 7] AAA Partners in Crime",
		inherit: ['[Gen 7] AAA Doubles', '[Gen 7] Partners in Crime'],
		desc: "Doubles-based metagame where both active ally Pok&eacute;mon share abilities and moves. Pok&eacute;mon can use any ability, barring the few that are restricted.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3618488/">Partners in Crime</a>`,
		],

		ruleset: ['[Gen 7] Partners in Crime', '!Obtainable Abilities', '[Gen 7] AAA Doubles'],
		banlist: [],
		unbanlist: [],
		restricted: [],
		onSwitchIn() {},
		onSwitchOut() {},
		onFaint() {},
	},
	{
		name: "[Gen 7] Scalemons Doubles",
		inherit: ['[Gen 7] Scalemons'],

		gameType: 'doubles',
		ruleset: ['[Gen 7] Scalemons'],
		banlist: [],
	},
	{
		name: "[Gen 7] Sketchmons Doubles",
		inherit: ['[Gen 7] Sketchmons'],
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3635904/">OM Mashup Megathread</a>`,
		],

		gameType: 'doubles',
		ruleset: ['[Gen 7] Sketchmons', '[Gen 7] Doubles OU'],
		banlist: ['Shedinja'],
		unbanlist: ['Sticky Web'],
		restricted: [],
	},
	{
		name: "[Gen 7] STABmons Doubles",
		inherit: ['[Gen 7] STABmons'],
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3635904/">OM Mashup Megathread</a>`,
		],

		gameType: 'doubles',
		ruleset: ['[Gen 7] Doubles OU'],
		banlist: ['Komala', 'Shedinja', 'Silvally', 'Drizzle'],
		unbanlist: [],
		restricted: ['Chatter', 'Diamond Storm', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Sketch', 'Thousand Arrows'],
	},

	// Unofficial Metagames
	///////////////////////////////////////////////////////////////////

	{
		section: 'Unofficial Metagames',
		column: 3,
	},
	{
		name: "[Gen 8] Almost Any Ability",
		desc: "Pok&eacute;mon can use any ability, barring the few that are restricted.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656414/">Almost Any Ability</a>`,
		],

		mod: 'gen8',
		searchShow: true,
		ruleset: ['[Gen 8] OU', '2 Ability Clause', '!Obtainable Abilities'],
		banlist: ['Archeops', 'Blacephalon', 'Buzzwole', 'Dragapult', 'Genesect', 'Gengar', 'Keldeo', 'Magearna', 'Naganadel', 'Noivern', 'Shedinja', 'Urshifu', 'Weavile', 'Zeraora', 'Zygarde', 'Electrify'],
		unbanlist: ['Darmanitan', 'Power Construct'],
		restricted: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Gorilla Tactics', 'Huge Power', 'Ice Scales', 'Illusion',
			'Imposter', 'Innards Out', 'Intrepid Sword', 'Libero', 'Magic Bounce', 'Magnet Pull', 'Neutralizing Gas', 'Parental Bond',
			'Poison Heal', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Unburden', 'Water Bubble', 'Wonder Guard',
		],
		onValidateSet(set, format) {
			if (this.ruleTable.isRestricted('ability:' + this.toID(set.ability))) {
				const template = this.dex.species.get(set.species || set.name);
				let legalAbility = false;
				let i: AbilityIndex;
				for (i in template.abilities) {
					if (set.ability === template.abilities[i]) legalAbility = true;
				}
				if (!legalAbility) return ['The ability ' + set.ability + ' is banned on Pok\u00e9mon that do not naturally have it.'];
			}
		},
	},
	{
		name: "[Gen 8] Frantic Fusions",
		desc: "By naming your Pok&eacute;mon after another Pok&eacute;mon it gains their first Ability as an additional ability, their stats are averaged and its secondary type is taken from their primary or secondary type depending on whether it is shiny.",

		mod: 'franticfusions',
		ruleset: ['[Gen 8] OU'],
		banlist: ['Shedinja', 'Swoobat', 'Assist', 'Huge Power', 'Pure Power'],
		unbanlist: ['Kyurem'],
		onValidateTeam(team) {
			const nameTable: {[k: string]: boolean} = {};
			for (const {name} of team) {
				if (name) {
					if (nameTable[name]) {
						return ["Your Pokémon must have different nicknames.", "(You have more than one " + name + ")"];
					}
					nameTable[name] = true;
				}
			}
		},
		checkCanLearn(move, template, lsetData, set) {
			if (move.id === 'snore') return null;
			if (set?.fuseTemplate && !this.checkCanLearn(move, set.fuseTemplate)) return null;
			return this.checkCanLearn(move, template, lsetData, set);
		},
		validateSet(set, teamHas) {
			const fuseTemplate = this.dex.species.get(set.name);
			if (!fuseTemplate.exists) return this.validateSet(set, teamHas);
			const fuseSet = {...set};
			fuseSet.species = fuseTemplate.name;
			fuseSet.item = '';
			fuseSet.ability = fuseTemplate.abilities['0'];
			fuseSet.moves = ['snore'];
			let problems = this.validateSet(fuseSet);
			if (problems) {
				fuseSet.shiny = !fuseSet.shiny;
				problems = this.validateSet(fuseSet);
			}
			if (problems) return problems;
			set.name = '';
			set.fuseTemplate = fuseTemplate;
			set.shiny = !set.shiny;
			problems = this.validateSet(set);
			if (!problems) this.validateSet(set, teamHas);
			set.shiny = !set.shiny;
			if (problems) problems = this.validateSet(set, teamHas);
			set.name = fuseTemplate.name;
			return problems;
		},
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			if (target.set.name === (template.battleOnly ? template.baseSpecies : template.name)) return;
			const fuseTemplate = this.dex.species.get(target.set.name);
			if (!fuseTemplate.exists) return;
			const mixedTemplate = this.dex.deepClone(template);
			mixedTemplate.heightm = Math.round((template.heightm + fuseTemplate.heightm) * 5) / 10;
			mixedTemplate.weighthg = Math.round((template.weighthg + fuseTemplate.weighthg) / 2);
			let statid: StatID;
			for (statid in template.baseStats) {
				mixedTemplate.baseStats[statid] = template.baseStats[statid] + fuseTemplate.baseStats[statid] >> 1;
			}
			mixedTemplate.bst = mixedTemplate.baseStats.hp + mixedTemplate.baseStats.atk + mixedTemplate.baseStats.def + mixedTemplate.baseStats.spa + mixedTemplate.baseStats.spd + mixedTemplate.baseStats.spe;

			mixedTemplate.types = [template.types[0]];
			const fuseType = target.set.shiny && fuseTemplate.types[1] || fuseTemplate.types[0];
			if (fuseType !== template.types[0]) mixedTemplate.types.push(fuseType);
			const ability = target.set.ability || Object.keys(template.abilities).length > 1 ? target.set.ability : template.abilities[0];
			if (fuseTemplate.abilities[0] !== ability) mixedTemplate.innate = this.toID(fuseTemplate.abilities[0]);
			return mixedTemplate;
		},
		onBegin() {
			const allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (const pokemon of allPokemon) {
				pokemon.m.innate = pokemon.species.innate;
			}
		},
		onBeforeSwitchIn(pokemon) {
			if (pokemon.m.innate) {
				const effect = 'ability:' + pokemon.m.innate;
				pokemon.volatiles[effect] = {id: effect, target: pokemon};
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			if (pokemon.m.innate) {
				const effect = 'ability:' + pokemon.m.innate;
				delete pokemon.volatiles[effect];
				pokemon.addVolatile(effect);
			}
		},
		onSwitchOut(pokemon) {
			if (pokemon.m.innate) pokemon.removeVolatile('ability:' + pokemon.m.innate);
		},
	},
	{
		name: "[Gen 8] Frantic Fusions Random Battle",
		inherit: ['[Gen 8] Frantic Fusions'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: [],
	},
	{
		name: "[Gen 8] Frantic Fusions Ubers",
		inherit: ['[Gen 8] Frantic Fusions'],

		ruleset: ['[Gen 8] Ubers'],
		banlist: ['Shedinja', 'Swoobat', 'Huge Power', 'Pure Power'],
	},
	{
		name: "[Gen 8] Frantic Fusions CAP",
		inherit: ['[Gen 8] Frantic Fusions'],

		unbanlist: ['CAP', 'Kyurem'],
	},
	{
		name: "[Gen 8] PokeMMO",
		desc: "Gen 8 mechanics but you are only allowed non-legendaries from Gen 5 or earlier.",

		mod: 'gen8',
		ruleset: ['Standard', 'Dynamax Clause'],
		banlist: ['Focus Band', "King's Rock", 'Quick Claw'],
		unbanlist: ['Unobtainable', 'Past'],
		onValidateSet(set) {
			const species = this.dex.species.get(set.species);
			const lsetData = this.dex.species.getLearnsetData(species.id);
			if (species.gen > 5 || lsetData.eventOnly || species.name === 'Pichu-Spiky-eared') return [species.name + " is not available in PokeMMO."];
			if (this.toID(set.ability) === this.toID(species.abilities['H'])) return [species.name + "'s ability " + species.abilities['H'] + " is not available in PokeMMO."];
		},
	},
	{
		name: "[Gen 8] Second Chance",
		desc: "Pok&eacute;mon that faint reincarnate as their name.",

		mod: 'gen8',
		ruleset: ['[Gen 8] OU'],
		onValidateSet(set) {
			const template = this.dex.species.get(set.name);
			if (template.battleOnly || template.isNonstandard || this.ruleTable.isRestrictedSpecies(template)) return ["" + template.name + " cannot have a second chance."];
		},
		onValidateTeam(team) {
			const speciesTable: Set<number> = new Set();
			for (const set of team) speciesTable.add(this.dex.species.get(set.species).num);
			for (const set of team) {
				if (!set.name) continue;
				const species = this.dex.species.get(set.name);
				if (!species.exists) continue;
				if (speciesTable.has(species.num)) {
					return [`You are limited to one of each Pokémon by Species Clause.`, `(You have more than one ${species.baseSpecies})`];
				}
				speciesTable.add(species.num);
			}
		},
		onBeforeFaint(pokemon) {
			let abilitySlot = (Object.keys(pokemon.baseSpecies.abilities) as AbilityIndex[]).find(slot => pokemon.baseSpecies.abilities[slot] === pokemon.set.ability);
			const template = this.dex.species.get(pokemon.set.name);
			if (template.num === pokemon.baseSpecies.num) return;
			if (!abilitySlot || !template.abilities[abilitySlot]) abilitySlot = '0';
			pokemon.faintQueued = false;
			pokemon.hp = pokemon.maxhp;
			if (Object.values(pokemon.boosts).find(boost => boost !== 0)) {
				pokemon.clearBoosts();
				this.add('-clearboost', pokemon);
			}
			pokemon.formeChange(template, this.format, true, '', abilitySlot);
			this.add('-message', `${template.name} has a second chance!`);
			pokemon.cureStatus(true);
			this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
			pokemon.canMegaEvo = null;
			return false;
		},
	},
	{
		name: "[Gen 8] Shared Power Ubers",
		inherit: ['[Gen 8] Shared Power'],

		ruleset: ['[Gen 8] Ubers', 'Evasion Abilities Clause'],
		banlist: ['Shedinja', 'Neutralizing Gas'],
		restricted: ['Huge Power', 'Mirror Armor', 'Mold Breaker', 'Trace', 'Teravolt', 'Turboblaze'],
	},
	{
		name: "[Gen 8] Single Stage Cup",
		desc: "Pok&eacute;mon that are part of an evolutionary line, Ultra Bests, and Legendary and Mythical Pok&eacute;mon are banned.",

		mod: 'gen8',
		ruleset: ['Standard NatDex', 'OHKO Clause', 'Evasion Moves Clause', 'Species Clause', 'Dynamax Clause', 'Sleep Clause Mod'],
		banlist: [
			"Arceus", "Articuno", "Azelf", "Blacephalon", "Buzzwole", "Calyrex", "Celebi", "Celesteela", "Cobalion", "Cosmoem", "Cosmog",
			"Cresselia", "Darkrai", "Deoxys", "Dialga", "Diancie", "Entei", "Eternatus", "Genesect", "Giratina", "Glastrier", "Groudon",
			"Guzzlord", "Heatran", "Ho-Oh", "Hoopa", "Jirachi", "Kartana", "Keldeo", "Kubfu", "Kyogre", "Kyurem", "Landorus", "Latias", "Latios",
			"Lugia", "Lunala", "Magearna", "Manaphy", "Marshadow", "Melmetal", "Meloetta", "Meltan", "Mesprit", "Mew", "Mewtwo", "Moltres",
			"Naganadel", "Necrozma", "Nihilego", "Palkia", "Pheromosa", "Phione", "Poipole", "Raikou", "Rayquaza", "Regice", "Regidrago",
			"Regieleki", "Regigigas", "Regirock", "Registeel", "Reshiram", "Shaymin", "Silvally", "Solgaleo", "Spectrier", "Stakataka", "Suicune",
			"Tapu Bulu", "Tapu Fini", "Tapu Koko", "Tapu Lele", "Terrakion", "Thundurus", "Tornadus", "Type: Null", "Urshifu", "Uxie", "Victini",
			"Virizion", "Volcanion", "Xerneas", "Xurkitree", "Yveltal", "Zacian", "Zamazenta", "Zapdos", "Zarude", "Zekrom", "Zeraora", "Zygarde",
		],
		onValidateSet(set) {
			const species = this.dex.species.get(set.species);
			if (species.prevo || species.evos.length) return [`${set.name || set.species} is from an evolutionary line.`];
		},
	},
	{
		name: "[Gen 8] Stat Switch",

		mod: 'gen8',
		ruleset: ['[Gen 8] OU'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			const baseStats = {...template.baseStats};
			const stats = Object.values(baseStats).slice(template.battleOnly ? 1 : 0);
			const lowest = Math.min(...stats);
			const highest = Math.max(...stats);
			let stat: StatID;
			for (stat in baseStats) {
				if (baseStats[stat] === lowest) {
					baseStats[stat] = highest;
				} else if (baseStats[stat] === highest) {
					baseStats[stat] = lowest;
				}
			}
			if (template.battleOnly) baseStats.hp = this.dex.species.get(template.baseSpecies).baseStats.hp;
			const bst = baseStats.hp + baseStats.atk + baseStats.def + baseStats.spa + baseStats.spd + baseStats.spe;
			return {...template, baseStats, bst};
		},
	},
	{
		name: "[Gen 8] TRMons",
		desc: "Pokémon can hold the TR of a move that they can learn to use it as a fifth move.",

		mod: 'gen8',
		ruleset: ['[Gen 8] OU'],
		banlist: ['TR29'],
		onValidateSet(set) {
			const moveid = this.dex.items.get(set.item).moveid;
			if (moveid) {
				let species = this.dex.species.get(set.species);
				let learnset = this.dex.species.getLearnset(species.id);
				if (!learnset) {
					species = this.dex.species.get(species.changesFrom || species.baseSpecies);
					learnset = this.dex.species.getLearnset(species.id);
				}
				if (!learnset?.[moveid]?.includes("8M")) return [(set.species || set.name) + ' cannot learn ' + this.dex.moves.get(moveid).name + '.'];
			}
		},
		onBegin() {
			for (const pokemon of this.p1.pokemon.concat(this.p2.pokemon)) {
				const moveid = pokemon.getItem().moveid;
				if (moveid && !pokemon.baseMoves.includes(moveid)) {
					const move = this.dex.moves.get(moveid);
					pokemon.baseMoveSlots.push({
						move: move.name,
						id: move.id,
						pp: move.pp * 8 / 5,
						maxpp: move.pp * 8 / 5,
						target: move.target,
						disabled: false,
						disabledSource: '',
						used: false,
					});
					pokemon.moveSlots = pokemon.baseMoveSlots.slice();
				}
			}
		},
	},
	{
		name: "[Gen 8] VoltTurn Mayhem",
		desc: "All targeted moves force you to switch.",

		mod: 'gen8',
		ruleset: ['[Gen 8] OU'],
		banlist: ['Fake Out > 1'],
		onModifyMovePriority: -1,
		onModifyMove(move) {
			switch (move.target) {
			case 'normal':
			case 'randomNormal':
			case 'allAdjacent':
			case 'allAdjacentFoes':
			case 'any':
			case 'scripted':
				move.selfSwitch = true;
			}
		},
	},
	{
		name: "[Gen 8] VoltTurn Mayhem Random Battle",
		inherit: ['[Gen 8] VoltTurn Mayhem'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: [],
	},
	{
		name: "[Gen 7] 0v0",

		team: 'random', //Just so a team can be generated so the "battle" can occur
		mod: 'gen7',
		ruleset: [],
		onBegin() {
			this.p1.team = this.p2.team = [];
			this.p1.pokemon = this.p2.pokemon = [];
			this.p1.pokemonLeft = this.p2.pokemonLeft = 0;
			this.win(this.sides[this.random(2)]);
		},
	},
	{
		name: "[Gen 7] 1v1 Reversed",
		desc: "Bring three Pok&eacute;mon to Team Preview and choose one to battle. You command your foe's Pokémon.",

		mod: 'gen7',
		ruleset: ['[Gen 7] 1v1'],
		battle: {
			makeRequest(type) {
				if (type) {
					this.requestState = type;
					this.p1.clearChoice();
					this.p2.clearChoice();
				} else {
					type = this.requestState;
				}

				// default to no request
				let p1request: any = null;
				let p2request: any = null;
				this.p1.activeRequest = null;
				this.p2.activeRequest = null;

				switch (type) {
				case 'teampreview':
					const maxChosenTeamSize = this.ruleTable.pickedTeamSize || undefined;
					this.add('teampreview|' + maxChosenTeamSize);
					p1request = {teamPreview: true, maxChosenTeamSize, side: this.p1.getRequestData()};
					p2request = {teamPreview: true, maxChosenTeamSize, side: this.p2.getRequestData()};
					break;

				default:
					let activeData = this.p2.active.map(pokemon => pokemon?.getMoveRequestData());
					p1request = {active: activeData, side: this.p1.getRequestData()};

					activeData = this.p1.active.map(pokemon => pokemon?.getMoveRequestData());
					p2request = {active: activeData, side: this.p2.getRequestData()};
					break;
				}

				if (p1request) {
					if (!this.supportCancel || !p2request) p1request.noCancel = true;
					this.p1.emitRequest(p1request);
				} else {
					this.p1.emitRequest({wait: true, side: this.p1.getRequestData()});
				}

				if (p2request) {
					if (!this.supportCancel || !p1request) p2request.noCancel = true;
					this.p2.emitRequest(p2request);
				} else {
					this.p2.emitRequest({wait: true, side: this.p2.getRequestData()});
				}

				if (this.p1.isChoiceDone() && this.p2.isChoiceDone()) {
					throw new Error(`Choices are done immediately after a request`);
				}
			},
			undoChoice(sideid) {
				let side = null;
				if (sideid === 'p1' || sideid === 'p2') side = this[sideid];
				if (!side) throw new Error(`Invalid side ${sideid}`);
				if (!side.requestState) return;

				const targetSide = side.requestState === 'teampreview' ? side : side.foe;

				if (side.choice.cantUndo) {
					side.emitChoiceError(`Can't undo: A trapping/disabling effect would cause undo to leak information`);
					return;
				}

				targetSide.clearChoice();
			},
			choose(sideid, input) {
				let side = null;
				if (sideid === 'p1' || sideid === 'p2') side = this[sideid];
				if (!side) throw new Error(`Invalid side ${sideid}`);

				const targetSide = side.requestState === 'teampreview' ? side : side.foe;
				if (!targetSide.choose(input)) return false;

				if (this.allChoicesDone()) this.commitDecisions();
				return true;
			},
		},
	},
	{
		name: "[Gen 7] A Berry Useful Immunity",
		desc: "Berries that would normally halve damage of a given supereffective type now make the Pok&eacute;mon immune to moves of that type.",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		onTryHit(target, source, move) {
			if (target !== source && !target.ignoringItem()) {
				const item = target.getItem();
				if ((item as ItemData).onSourceModifyDamage && item.naturalGift && item.naturalGift.type === move.type && target.runEffectiveness(move) > 0 && this.runEvent('TryEatItem', target, source, null, item)) {
					this.add('-immune', target, '[msg]');
					return null;
				}
			}
		},
	},
	{
		name: "[Gen 7] Abilimoves",
		desc: "Pok&eacute;mon can spend move slots on additional abilities, barring the few that are restricted.",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Shedinja'],
		restricted: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Trace', 'Water Bubble', 'Wonder Guard',
		],
		field: {
			suppressingWeather() {
				for (const pokemon of this.battle.getAllActive()) {
					if (!pokemon.ignoringAbility() && pokemon.hasAbility('Cloud Nine')) {
						return true;
					}
				}
				return false;
			},
		},
		pokemon: {
			hasAbility(ability) {
				if (this.ignoringAbility()) return false;
				if (Array.isArray(ability)) return ability.some(this.hasAbility, this);
				ability = this.battle.toID(ability);
				return this.ability === ability || !!this.volatiles['ability:' + ability];
			},
		},
		validateSet(set, teamHas) {
			if (set.moves.length <= 4) {
				set = this.dex.deepClone(set);
				set.moves = set.moves.filter(move => {
					const ability = this.dex.abilities.get(move);
					return !ability.exists || ability.isNonstandard || this.ruleTable.isRestricted('ability:' + ability.id);
				});
			}
			return this.validateSet(set, teamHas);
		},
		onValidateTeam(team) {
			const abilityTable: {[k: string]: boolean} = {};
			for (const set of team) {
				for (const move of set.moves) {
					const ability = this.dex.abilities.get(move);
					if (ability.exists) {
						if (abilityTable[ability.id]) return ["You are limited to one of each Ability.", "(You have more than one " + ability.name + ".)"];
						abilityTable[ability.id] = true;
					}
				}
			}
		},
		onBegin() {
			for (const pokemon of this.p1.pokemon.concat(this.p2.pokemon)) {
				pokemon.baseMoveSlots = pokemon.baseMoveSlots.filter(slot => !this.dex.abilities.get(slot.id).exists);
				pokemon.moveSlots = pokemon.baseMoveSlots.slice();
			}
		},
		onSwitchIn(pokemon) {
			for (const move of pokemon.set.moves) {
				pokemon.addVolatile('ability:' + this.toID(move));
			}
		},
	},
	{
		name: "[Gen 7] Ability Bridge",
		desc: "Pok&eacute;mon can use any move learned by another Pok&eacute;mon with the same ability, barring the few that are restricted.",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		restricted: ['Levitate', 'Pressure', 'Shadow Tag'],
		checkCanLearn(move, template, lsetData, set) {
			const ability = this.dex.abilities.get(set!.ability);
			if (!this.ruleTable.isRestricted('ability:' + ability.id)) {
				for (const speciesid in this.dex.data.Learnsets) {
					const pokemon = this.dex.data.Pokedex[speciesid] || this.dex.species.get(speciesid);
					if (pokemon.num < 1 || pokemon.num > 807) continue;
					if ((pokemon.baseSpecies || pokemon.name) === template.baseSpecies) continue;
					if (!Object.values(pokemon.abilities).includes(set!.ability)) continue;
					if (pokemon.unreleasedHidden && set!.ability === pokemon.abilities['H']) continue;
					if (this.checkCanLearn(move, this.dex.species.get(speciesid))) continue;
					return null;
				}
			}
			return this.checkCanLearn(move, template, lsetData, set);
		},
	},
	{
		name: "[Gen 7] Alphability Cup",
		inherit: ["[Gen 7] Alphabet Cup"],
		desc: "Pok&eacute;mon may use any ability that starts with the same letter as their species, barring the many that are restricted. Pok&eacute;mon may learn any move that starts with the same letter as their species.",

		ruleset: ['[Gen 7] OU', '!Obtainable Abilities'],
		banlist: [
			'Regigigas', 'Slaking',
			'Battle Bond', 'Fluffy', 'Fur Coat', 'Huge Power',
			'Multiscale', 'Parental Bond', 'Pure Power',
			'Shadow Shield', 'Simple', 'Speed Boost', 'Stamina',
			'Triage', 'Water Bubble', 'Wonder Guard',
			'Acupressure', 'Chatter', 'Confuse Ray', 'Flash', 'Flatter',
			'Geomancy', 'Lovely Kiss', 'Sand Attack', 'Shell Smash',
			'Smokescreen', 'Spectral Thief', 'Spore', 'Strength Sap',
			'Supersonic', 'Swagger', 'Tail Glow', 'Teeter Dance',
			'Chansey + Comatose', 'Chansey + Cotton Guard',
			'Cresselia + Cheek Pouch', 'Cresselia + Comatose',
			'Cresselia + Cotton Guard', "Kyurem-Black + King's Shield",
			'Shaymin-Sky + Serene Grace', 'Registeel + Regenerator',
			'Shedinja + Sturdy', 'Hoopa-Unbound + Hustle + Hyperspace Fury',
			'Cosmic Power + Comatose', 'Serene Grace + Leaf Tornado',
			"Forest's Curse + Ghostium Z", 'Happy Hour + Normalium Z',
			'Hold Hands + Normalium Z', 'Purify + Poisonium Z',
			'Trick-or-Treat + Ghostium Z',
		],
		unbanlist: ['Blaziken', 'Deoxys-Attack', 'Deoxys-Defense', 'Genesect', 'Landorus', 'Shaymin-Sky'],
		onValidateSet(set) {
			const template = this.dex.species.get(set.species || set.name);
			if (this.toID(set.ability)[0] !== template.id[0]) {
				let legalAbility = false;
				let i: AbilityIndex;
				for (i in template.abilities) {
					if (set.ability === template.abilities[i]) legalAbility = true;
				}
				if (!legalAbility) return [(set.species || set.name) + ' cannot have ' + set.ability + '.'];
			}
		},
	},
	{
		name: "[Gen 7] Any Mon Goes Mix and Mega",
		inherit: ["[Gen 7] BH Mix and Mega"],

		ruleset: ['Obtainable', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
	},
	{
		name: "[Gen 7] Arceus Metronome Battle",
		desc: "A team of 6 Arceus with randomly generated Plates using the move Metronome in a Triples format.",

		gameType: 'triples',
		mod: 'gen7',
		team: 'randomArceus',
		ruleset: ['Team Preview', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Arceus Metronome Doubles Battle",
		desc: "A team of 6 Arceus with randomly generated Plates using the move Metronome in a Doubles format.",

		gameType: 'doubles',
		mod: 'gen7',
		team: 'randomArceus',
		ruleset: ['Team Preview', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Bad'n'Boosted",
		desc: "Pok&eacute;mon with base stats of 70 or lower get those stats doubled.",

		ruleset: ['[Gen 7] Ubers'],
		banlist: [
			'Huge Power', 'Pure Power', 'Eviolite',
		],

		mod: 'gen7',
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;

			if (!template.abilities) return;

			if (Math.min(...Object.values(template.baseStats)) > 70) return;

			const newTemplate = this.dex.deepClone(template);
			for (const statName in newTemplate.baseStats) {
				if (newTemplate.baseStats[statName] <= 70) {
					newTemplate.bst += newTemplate.baseStats[statName];
					newTemplate.baseStats[statName] *= 2;
				}
			}
			return newTemplate;
		},
	},
	{
		name: "[Gen 7] BasePowerMons",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		onModifyMovePriority: 2,
		onModifyMove(move, pokemon) {
			if (move.basePower > 0 && !move.multihit && move.priority <= 0) {
				move.basePower = move.name.length * 8;
			}
		},
	},
	{
		name: "[Gen 7] BasePowerMons Random Battle",
		inherit: ['[Gen 7] BasePowerMons'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Burning 'Mon",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		unbanlist: ['Aegislash', 'Genesect', 'Greninja', 'Groudon', 'Hoopa-Unbound', 'Kangaskhan-Mega', 'Landorus', 'Lucario-Mega', 'Mawile-Mega', 'Zekrom'],
		onBegin() {
			for (const pokemon of this.p1.pokemon) {
				if (pokemon.runStatusImmunity('brn')) {
					pokemon.status = 'brn' as ID;
				}
			}
			for (const pokemon of this.p2.pokemon) {
				if (pokemon.runStatusImmunity('brn')) {
					pokemon.status = 'brn' as ID;
				}
			}
		},
		onResidualOrder: 999,
		onResidual() {
			this.p1.pokemon[0].trySetStatus('brn');
			this.p2.pokemon[0].trySetStatus('brn');
		},
	},
	{
		name: "[Gen 7] Burning 'Mon Random Battle",
		inherit: ["[Gen 7] Burning 'Mon"],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		unbanlist: [],
	},
	{
		name: "[Gen 7] Challenge Cup 3v3",
		inherit: ['[Gen 7] Challenge Cup 2v2'],

		gameType: 'triples',
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview', 'Picked Team Size = 3'],
	},
	{
		name: "[Gen 7] Field Frenzy",
		desc: "If your Pok&eacute;mon's first move is a field effect move, it activates automatically when it switches in.",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		onSwitchIn(pokemon) {
			const move = this.dex.getActiveMove(pokemon.moves[0]);
			if (move.weather) this.field.setWeather(move.weather, pokemon, move);
			if (move.terrain) this.field.setTerrain(move.terrain, pokemon, move);
			if (move.pseudoWeather) this.field.addPseudoWeather(move.pseudoWeather, pokemon, move);
		},
	},
	{
		name: "[Gen 7] Frantic Fusions",
		desc: "By naming your Pok&eacute;mon after another Pok&eacute;mon it gains their first Ability as an additional ability, their stats are averaged and its secondary type is taken from their primary or secondary type depending on whether it is shiny.",

		mod: 'gen7franticfusions',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Shedinja', 'Swoobat', 'Assist', 'Huge Power', 'Pure Power'],
		onValidateTeam(team) {
			const nameTable: {[k: string]: boolean} = {};
			for (const {name} of team) {
				if (name) {
					if (nameTable[name]) {
						return ["Your Pokémon must have different nicknames.", "(You have more than one " + name + ")"];
					}
					nameTable[name] = true;
				}
			}
		},
		checkCanLearn(move, template, lsetData, set) {
			if (move.id === 'snore') return null;
			if (set?.fuseTemplate && !this.checkCanLearn(move, set.fuseTemplate)) return null;
			return this.checkCanLearn(move, template, lsetData, set);
		},
		validateSet(set, teamHas) {
			const fuseTemplate = this.dex.species.get(set.name);
			if (!fuseTemplate.exists) return this.validateSet(set, teamHas);
			const fuseSet = {...set};
			fuseSet.species = fuseTemplate.name;
			fuseSet.item = '';
			fuseSet.ability = fuseTemplate.abilities['0'];
			fuseSet.moves = ['snore'];
			let problems = this.validateSet(fuseSet);
			if (problems) {
				fuseSet.shiny = !fuseSet.shiny;
				problems = this.validateSet(fuseSet);
			}
			if (problems) return problems;
			set.name = '';
			set.fuseTemplate = fuseTemplate;
			set.shiny = !set.shiny;
			problems = this.validateSet(set);
			if (!problems) this.validateSet(set, teamHas);
			set.shiny = !set.shiny;
			if (problems) problems = this.validateSet(set, teamHas);
			set.name = fuseTemplate.name;
			return problems;
		},
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			if (target.set.name === (template.battleOnly ? template.baseSpecies : template.name)) return;
			const fuseTemplate = this.dex.species.get(target.set.name);
			if (!fuseTemplate.exists) return;
			const mixedTemplate = this.dex.deepClone(template);
			mixedTemplate.heightm = Math.round((template.heightm + fuseTemplate.heightm) * 5) / 10;
			mixedTemplate.weighthg = Math.round((template.weighthg + fuseTemplate.weighthg) / 2);
			let statid: StatID;
			for (statid in template.baseStats) {
				mixedTemplate.baseStats[statid] = template.baseStats[statid] + fuseTemplate.baseStats[statid] >> 1;
			}
			mixedTemplate.bst = mixedTemplate.baseStats.hp + mixedTemplate.baseStats.atk + mixedTemplate.baseStats.def + mixedTemplate.baseStats.spa + mixedTemplate.baseStats.spd + mixedTemplate.baseStats.spe;

			mixedTemplate.types = [template.types[0]];
			const fuseType = target.set.shiny && fuseTemplate.types[1] || fuseTemplate.types[0];
			if (fuseType !== template.types[0]) mixedTemplate.types.push(fuseType);
			const ability = target.set.ability || Object.keys(template.abilities).length > 1 ? target.set.ability : template.abilities[0];
			if (fuseTemplate.abilities[0] !== ability) mixedTemplate.innate = this.toID(fuseTemplate.abilities[0]);
			return mixedTemplate;
		},
		onBegin() {
			const allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (const pokemon of allPokemon) {
				pokemon.m.innate = pokemon.species.innate;
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			if (pokemon.m.innate) pokemon.addVolatile('ability:' + pokemon.m.innate);
		},
		onSwitchOut(pokemon) {
			if (pokemon.m.innate) pokemon.removeVolatile('ability:' + pokemon.m.innate);
		},
		onAfterMega(pokemon) {
			if (pokemon.m.innate === pokemon.ability) {
				pokemon.removeVolatile('ability:' + pokemon.m.innate);
				delete pokemon.m.innate;
			}
		},
	},
	{
		name: "[Gen 7] Frantic Fusions Ubers",
		inherit: ['[Gen 7] Frantic Fusions'],
		ruleset: ['[Gen 7] Ubers'],
		banlist: ['Shedinja', 'Swoobat', 'Huge Power', 'Pure Power'],
	},
	{
		name: "[Gen 7] Frantic Fusions CAP",
		inherit: ['[Gen 7] Frantic Fusions'],
		ruleset: ['[Gen 7] Frantic Fusions'],
		banlist: [],
		unbanlist: ['CAP'],
		onSwitchIn() {},
		onSwitchOut() {},
		onAfterMega() {},
	},
	{
		name: "[Gen 7] Frantic Fusions Random Battle",
		inherit: ['[Gen 7] Frantic Fusions'],
		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: [],
	},
	{
		name: "[Gen 7] Forest's Treat",
		desc: "All Pok&eacute;mon gain the type of the move that they use. If they already have the type then nothing happens. If they previously had a type added then it is removed. This mirrors the behaviour of the moves Forest's Curse and Trick-or-Treat.",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		onPrepareHitPriority: -1,
		onPrepareHit(source, target, move) {
			if (move.hasBounced) return;
			const type = move.type;
			if (!type) return;
			if (type === '???') return;
			if (source.hasType(type)) return;
			if (!source.addType(type)) return;
			this.attrLastMove('[still]');
			this.add('-start', source, 'typeadd', type);
			if (!move.flags['charge'] || source.volatiles[move.id]) this.add('-anim', source, move, target);
		},
	},
	{
		name: "[Gen 7] Forest's Treat Random Battle",
		inherit: ["[Gen 7] Forest's Treat"],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Freeze-Dry Mania",
		desc: "All moves are super-effective against the type of your fourth move but resist the type of your second move.",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		onModifyMove(move, pokemon, target) {
			move.type1 = this.dex.moves.get(pokemon.moves[1]).type;
			move.type3 = this.dex.moves.get(pokemon.moves[3]).type;
			if (target?.hasType(move.type1) && this.dex.getImmunity(move, move.type1) ||
				target?.hasType(move.type3) && this.dex.getImmunity(move, move.type3)) {
				move.ignoreImmunity = true;
			}
		},
		onEffectiveness(typeMod, target, type, move) {
			if (type === move.type1) return -1;
			if (type === move.type3) return 1;
		},
	},
	{
		name: "[Gen 7] Gods Among Us",
		desc: "Uber Pok&eacute; are legal but have their base stats reduced.",

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers'],
		banlist: ['Blue Orb ++ Red Orb > 1'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			if (template.tier !== 'Uber') return;
			const baseStats = {...template.baseStats};
			let stat: StatID;
			for (stat in baseStats) {
				baseStats[stat] = Math.floor(template.baseStats[stat] / 2 + 40);
			}
			const bst = baseStats.hp + baseStats.atk + baseStats.def + baseStats.spa + baseStats.spd + baseStats.spe;
			return {...template, baseStats, bst};
		},
	},
	{
		name: "[Gen 7] Gooed",
		desc: "Each evolved Pok&eacute;mon gets double the stats of its unevolved form; NFEs get 50% more (rounded up).",

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers'],
		banlist: ['Scizor', 'Silvally', 'Slowbro-Mega'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			const baseSpecies = template.baseSpecies ? this.dex.species.get(template.baseSpecies) : template;
			if (!baseSpecies.prevo) return;
			let prevoTemplate = this.dex.species.get(baseSpecies.prevo);
			if (prevoTemplate.prevo) prevoTemplate = this.dex.species.get(prevoTemplate.prevo);
			const multiplier = template.evos.length ? 1.5 : 2;
			const newTemplate = this.dex.deepClone(template);
			let statName: StatID;
			for (statName in template.baseStats) {
				newTemplate.baseStats[statName] = this.clampIntRange(Math.round(prevoTemplate.baseStats[statName] * multiplier) + newTemplate.baseStats[statName] - baseSpecies.baseStats[statName], 1, 255);
			}
			newTemplate.bst = newTemplate.baseStats.hp + newTemplate.baseStats.atk + newTemplate.baseStats.def + newTemplate.baseStats.spa + newTemplate.baseStats.spd + newTemplate.baseStats.spe;
			return newTemplate;
		},
	},
	{
		name: "[Gen 7] Head Start",
		desc: "Each Pok&eacute;mon gets a \"prioribility\" that increases the priority of moves of its secondary typing by 1.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3530541/">Head Start</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Archeops', 'Regigigas', 'Slaking'],
		validateSet(set, teamHas) {
			if (this.toID(set.ability) !== 'galewings') return this.validateSet(set, teamHas);
			const customRules = this.format.customRules || [];
			if (!customRules.includes('!obtainableabilities')) customRules.push('!obtainableabilities');
			const TeamValidator = this.constructor as new(format: string | Format) => TeamValidator;
			return new TeamValidator(Dex.formats.get(this.format.id + '@@@' + customRules.join(','))).validateSet(set, teamHas);
		},
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;

			if (!template.abilities) return;

			if (target.baseAbility !== 'galewings') return;

			const newTemplate = this.dex.deepClone(template);
			newTemplate.abilities = {0: 'Gale Wings'};
			return newTemplate;
		},
	},
	{
		name: "[Gen 7] Impostor UU",
		desc: "A mostly UU team... but watch out for the OU Impostor!",

		mod: 'gen7',
		ruleset: ['[Gen 7] UU'],
		validateSet(set, teamHas) {
			const problems = this.validateSet(set);
			if (!problems || teamHas.impostor) return this.validateSet(set, teamHas);
			const TeamValidator = this.constructor as new(format: string | Format) => TeamValidator;
			if (!new TeamValidator('gen7ou').validateSet(set, teamHas)) {
				teamHas.impostor = true;
				return null;
			}
			return problems;
		},
	},
	{
		name: "[Gen 7] Inaccuratemons",
		desc: "All moves that have 100% effective accuracy miss. Does not affect No Guard or other effects that bypass accuracy checks.",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		onModifyAccuracy(accuracy, target, source, move) {
			if (typeof accuracy === 'number') return accuracy % 100;
		},
	},
	{
		name: "[Gen 7] Inheritance (no reveal)",
		desc: "Pok&eacute;mon may use the ability and moves of another, as long as they forfeit their own learnset.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3592844/">Inheritance</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Blacephalon', 'Hoopa-Unbound', 'Kartana', 'Kyurem-Black', 'Regigigas', 'Shedinja', 'Slaking', 'Assist', 'Chatter', 'Shell Smash', 'Gyaradosite'],
		restricted: ['Liepard', 'Meowstic', 'Murkrow', 'Purrloin', 'Smeargle', 'Huge Power', 'Imposter', 'Innards Out', 'No Guard', 'Pure Power', 'Speed Boost', 'Water Bubble', 'Wonder Guard'],
		getEvoFamily(species) {
			let template = Dex.species.get(species);
			while (template.prevo) {
				template = Dex.species.get(template.prevo);
			}
			return template.id;
		},
		validateSet(set, teamHas) {
			const abilityMap = this.format.abilityMap || Object.create(null);
			if (!this.format.abilityMap) {
				for (const speciesid in this.dex.data.Pokedex) {
					const pokemon = this.dex.data.Pokedex[speciesid];
					if (pokemon.num < 1 || pokemon.num > 807) continue;
					if (this.dex.data.Pokedex[speciesid].requiredAbility || this.dex.data.Pokedex[speciesid].requiredItem || Dex.data.Pokedex[speciesid].requiredMove) continue;
					let key: AbilityIndex;
					for (key in pokemon.abilities) {
						const abilityId = this.toID(pokemon.abilities[key]);
						if (abilityMap[abilityId]) {
							abilityMap[abilityId][pokemon.evos ? 'push' : 'unshift'](speciesid);
						} else {
							abilityMap[abilityId] = [speciesid];
						}
					}
				}
				this.format.abilityMap = abilityMap;
			}

			let problems = this.validateForme(set);
			if (problems.length) return problems;

			const species = this.toID(set.species);
			const template = this.dex.species.get(species);
			if (!template.exists) return [`The Pokemon "${set.species}" does not exist.`];
			const item = this.dex.items.get(set.item);
			const megaTemplate = item.megaEvolves === set.species ? this.dex.species.get(item.megaStone) : template;
			if (megaTemplate.tier === 'Uber') return ["" + megaTemplate.name + " is in Uber, which is banned."];
			const problem = this.checkSpecies(set, template, megaTemplate, {});
			if (problem) return [problem];

			const name = set.name;
			let canonicalSource = set.species;

			const abilityId = this.toID(set.ability);
			const pokemonWithAbility = abilityMap[abilityId];
			if (!pokemonWithAbility) return ["" + set.ability + " is an invalid ability."];
			const isBaseAbility = Object.values(template.abilities).map(this.toID).includes(abilityId);
			if (!isBaseAbility && this.ruleTable.isRestricted('ability:' + abilityId)) return ["" + set.ability + " is banned from being passed down."];

			const validSources: string[] = set.abilitySources = []; // evolutionary families
			for (const speciesid of pokemonWithAbility) {
				const donorTemplate = this.dex.species.get(speciesid);
				const evoFamily = this.format.getEvoFamily!(donorTemplate);

				if (validSources.includes(evoFamily)) {
					// The existence of a legal set has already been established.
					// We only keep iterating to find all legal donor families (Donor Clause).
					// Skip this redundant iteration.
					continue;
				}

				if (donorTemplate.id !== this.toID(set.species) && this.ruleTable.isRestrictedSpecies(donorTemplate)) {
					continue;
				} else if (donorTemplate.id !== this.toID(set.species) && this.ruleTable.isRestricted('ability:' + abilityId)) {
					continue;
				}
				set.name = set.species = donorTemplate.name;
				if (!this.validateSet(set)) {
					canonicalSource = donorTemplate.name;
					validSources.push(evoFamily);
				}
				if (validSources.length > 1) {
					// Specific for the basic implementation of Donor Clause (see onValidateTeam).
					break;
				}
			}

			set.name = set.species = canonicalSource;
			problems = this.validateSet(set, teamHas)!;
			set.species = species;
			set.name = name;
			return problems;
		},
		onValidateTeam(team, format, teamHas) {
			// Donor Clause
			const evoFamilyLists = [];
			for (const set of team) {
				if (!set.abilitySources) continue;
				evoFamilyLists.push(new Set(set.abilitySources.map(format.getEvoFamily!)));
			}

			// Checking actual full incompatibility would require expensive algebra.
			// Instead, we only check the trivial case of multiple Pokémon only legal for exactly one family. FIXME?
			const requiredFamilies = Object.create(null);
			for (const evoFamily of evoFamilyLists) {
				if (evoFamily.size !== 1) continue;
				const evoFamilies = Array.from(evoFamily);
				if (requiredFamilies[evoFamilies[0]]) return ["You are limited to one inheritance from each family by the Donor Clause.", "(You inherit more than once from " + this.dex.species.get(evoFamilies[0]).name + "'s.)"];
				requiredFamilies[evoFamilies[0]] = 1;
			}
		},
	},
	{
		name: "[Gen 7] Inverse Challenge Cup",
		desc: "The effectiveness of each attack is inverted.",

		mod: 'gen7',
		team: 'randomCC',
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview', 'Inverse Mod'],
	},
	{
		name: "[Gen 7] Inverse Challenge Cup 1v1",
		desc: "The effectiveness of each attack is inverted.",

		mod: 'gen7',
		team: 'randomCC',
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview', 'Inverse Mod', 'Picked Team Size = 1'],
	},
	{
		name: "[Gen 7] Inverse Hackmons Cup",
		desc: "Randomized teams of level-balanced Pok&eacute;mon with absolutely any ability, moves, and item. The effectiveness of each attack is inverted.",

		mod: 'gen7',
		team: 'randomHC',
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod', 'Inverse Mod'],
	},
	{
		name: "[Gen 7] LC AG",
		inherit: ["[Gen 7] LC"],

		banlist: ['Dragon Rage', 'Sonic Boom'],
	},
	{
		name: "[Gen 7] LC Mix and Mega",
		desc: "Mega Stones and Primal Orbs can be used with no Mega Evolution limit.",

		mod: 'gen7mixandmega',
		ruleset: ['Standard', 'Swagger Clause', 'Little Cup'],
		banlist: ['Gligar', 'Baton Pass', 'Dragon Rage', 'Sonic Boom', 'Ultranecrozium Z'],
		restricted: ['Archen', 'Bunnelby', 'Carvanha', 'Corphish', 'Dratini', 'Klink', 'Mienfoo', 'Murkrow', 'Pawniard', 'Ponyta', 'Scyther', 'Sneasel', 'Yanma', 'Beedrillite', 'Blazikenite', 'Gengarite', 'Mawilite', 'Medichamite', 'Pidgeotite'],
		onValidateTeam(team) {
			const itemTable: {[k: string]: number} = {};
			for (const set of team) {
				const item = this.dex.items.get(set.item);
				if (!itemTable[item.id]) itemTable[item.id] = 0;
				if (++itemTable[item.id] < 2) continue;
				if (item.megaStone) return ["You are limited to one of each Mega Stone.", "(You have more than one " + item.name + ".)"];
				if (item.id === 'blueorb' || item.id === 'redorb') return ["You are limited to one of each Primal Orb.", "(You have more than one " + item.name + ".)"];
			}
		},
		onValidateSet(set) {
			const template = this.dex.species.get(set.species || set.name);
			const item = this.dex.items.get(set.item);
			if (!item.megaStone && !item.onPrimal) return;
			let itemUser = this.dex.species.get(item.itemUser![0]);
			while (itemUser.prevo) itemUser = this.dex.species.get(itemUser.prevo);
			if (itemUser.baseSpecies === template.baseSpecies) return;
			if (this.ruleTable.isRestrictedSpecies(template)) return [template.name + " is not allowed to hold a Mega Stone."];
			if (!this.ruleTable.isRestricted('item:' + item.id)) return;
			switch (item.id) {
			case 'mawilite': case 'medichamite':
				if (set.ability === 'Huge Power' || set.ability === 'Pure Power') break;
				return ["You are only allowed to hold " + item.name + " if your Ability is Huge Power or Pure Power."];
			case 'blueorb':
			case 'redorb':
				return [item.name + " is only allowed to be held by " + item.itemUser![0]];
			default:
				const ability = this.dex.species.get(item.megaStone).abilities[0];
				if (set.ability === ability) return;
				return ["You are only allowed to hold " + item.name + " if your Ability is " + ability + "."];
			}
		},
		onModifySpecies(template, target, format, effect) {
			if (!effect || ['imposter', 'transform'].includes(effect.id)) return;
			const megaSpecies = (effect as Item).megaStone || ({dragonascent: 'Rayquaza-Mega', redorb: 'Groudon-Primal', blueorb: 'Kyogre-Primal'} as {[k: string]: string})[effect.id];
			if (!megaSpecies || megaSpecies === template.name) return;
			template = this.getMixedSpecies(template, megaSpecies);
			return template;
		},
		onBegin() {
			const allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (const pokemon of allPokemon) {
				pokemon.m.originalSpecies = pokemon.baseSpecies.name;
			}
		},
		onSwitchIn(pokemon) {
			const oMegaTemplate = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				// Place volatiles on the Pokémon to show its mega-evolved condition and details
				this.add('-start', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
				const oTemplate = this.dex.species.get(pokemon.m.originalSpecies);
				if (oTemplate.types.length !== pokemon.species.types.length || oTemplate.types[1] !== pokemon.species.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut(pokemon) {
			const oMegaTemplate = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				this.add('-end', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			}
		},
	},
	{
		name: "[Gen 7] Meta Man",
		desc: "Pok&eacute;mon steal the last move and Ability of any Pok&eacute;mon that they KO.",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		onFaint(pokemon, source, effect) {
			if (source && effect && effect.effectType === 'Move' && !effect.isFutureMove) {
				if (source.setAbility(pokemon.ability)) {
					this.add('-ability', source, source.getAbility().name, '[from] move: Role Play', '[of] ' + pokemon);
				}
				if (pokemon.lastMove && pokemon.lastMove.id && !source.baseMoves.includes(pokemon.lastMove.id)) {
					const move = this.dex.moves.get(pokemon.lastMove.id);
					const metaMove = {
						move: move.name,
						id: move.id,
						pp: move.pp,
						maxpp: move.pp,
						target: move.target,
						disabled: false,
						used: false,
					};
					source.baseMoveSlots.push(metaMove);
					if (!source.transformed) {
						source.moveSlots.push(metaMove);
					}
					this.add('-activate', source, 'move: Sketch', move.name);
				}
			}
		},
	},
	{
		name: "[Gen 7] Minimized Cup",
		desc: "Pok&eacute;mon have their level set according to their BST.",

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers', 'Max Level = 1000'],
		banlist: ['Munchlax', 'Smeargle', 'Snorlax', 'Dragon Rage', 'Sonic Boom', 'Tail Glow', 'Arena Trap', 'Fur Coat', 'Huge Power', 'Pure Power', 'Shadow Tag', 'Deep Sea Scale', 'Deep Sea Tooth', 'Eviolite', 'Light Ball', 'Parental Bond + Seismic Toss'],
		onValidateSet(set) {
			const template = this.dex.species.get(set.species || set.name);
			set.level = Math.round((1000 - template.bst) / 100);
		},
	},
	{
		name: "[Gen 7] Mix and Mega ROCS",
		inherit: ["[Gen 7] Mix and Mega"],
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/posts/9503466/">Random Other Custom Stones</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587740/">Mix and Mega</a>`,
		],

		mod: 'gen7mixandmegarocs',
		banlist: ['Electrify', 'Shadow Tag', 'Roseradite', 'Slowkingite', 'Smearglite'],
	},
	{
		name: "[Gen 7] LC Balanced Hackmons",
		inherit: ["[Gen 7] Balanced Hackmons"],
		threads: [
		],

		ruleset: ['-Nonexistent', '2 Ability Clause', 'OHKO Clause', 'Evasion Moves Clause', 'CFZ Clause', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Little Cup'],
		banlist: ['Gligar', 'Scyther', 'Sneasel', 'Type: Null', 'Arena Trap', 'Contrary', 'Huge Power', 'Illusion', 'Innards Out', 'Magnet Pull', 'Moody', 'Protean', 'Psychic Surge', 'Pure Power', 'Shadow Tag', 'Skill Link', 'Stakeout', 'Water Bubble', 'Wonder Guard', 'Baton Pass', 'Dragon Rage', 'Sonic Boom'],
		unbanlist: [],
	},
	{
		name: "[Gen 7] Mono UU",

		mod: 'gen7',
		ruleset: ['[Gen 7] Monotype'],
		customBans: {
			"Bug": ["Buzzwole", "Galvantula", "Pinsir-Mega", "Scizor", "Volcarona"],
			"Dark": ["Bisharp", "Greninja", "Hydreigon", "Muk-Alola", "Sableye-Mega", "Sharpedo-Mega", "Tyranitar", "Weavile"],
			"Dragon": ["Altaria-Mega", "Dragonite", "Garchomp", "Hydreigon", "Kyurem-Black", "Latias", "Latios", "Salamence", "Kommonium Z"],
			"Electric": ["Magnezone", "Rotom-Wash", "Tapu Koko", "Xurkitree", "Zapdos"],
			"Fairy": ["Azumarill", "Diancie-Mega", "Klefki", "Mimikyu", "Ninetales-Alola", "Tapu Bulu", "Tapu Koko"],
			"Fighting": ["Breloom", "Buzzwole", "Gallade-Mega", "Hawlucha", "Infernape", "Keldeo", "Terrakion", "Kommonium Z"],
			"Fire": ["Blacephalon", "Charizard-Mega-X", "Charizard-Mega-Y", "Heatran", "Infernape", "Victini", "Volcarona", "Heat Rock"],
			"Flying": ["Celesteela", "Charizard-Mega-Y", "Dragonite", "Gliscor", "Gyarados", "Hawlucha", "Landorus-Base", "Landorus-Therian", "Salamence", "Skarmory", "Thundurus-Base", "Zapdos"],
			"Ghost": ["Blacephalon", "Gengar", "Mimikyu", "Sableye-Mega"],
			"Grass": ["Breloom", "Ferrothorn", "Tapu Bulu", "Venusaur-Mega"],
			"Ground": ["Excadrill", "Garchomp", "Hippowdon", "Landorus-Base", "Landorus-Therian", "Mamoswine", "Arena Trap"],
			"Ice": ["Cloyster", "Kyurem-Black", "Mamoswine", "Ninetales-Alola", "Weavile", "Icy Rock"],
			"Normal": ["Chansey", "Diggersby", "Ditto", "Lopunny-Mega", "Porygon2", "Porygon-Z", "Staraptor"],
			"Poison": ["Gengar", "Muk-Alola", "Nidoking", "Nihilego", "Toxapex", "Venusaur-Mega"],
			"Psychic": ["Alakazam", "Deoxys-Defense", "Deoxys-Speed", "Gallade-Mega", "Jirachi", "Latias", "Latios", "Mew", "Slowbro-Mega", "Victini"],
			"Rock": ["Diancie-Mega", "Terrakion", "Tyranitar", "Nihilego", "Stakataka"],
			"Steel": ["Bisharp", "Celesteela", "Excadrill", "Ferrothorn", "Heatran", "Jirachi", "Magnezone", "Scizor", "Skarmory", "Stakataka"],
			"Water": ["Azumarill", "Cloyster", "Greninja", "Gyarados", "Keldeo", "Manaphy", "Quagsire", "Sharpedo-Mega", "Slowbro-Mega", "Suicune", "Swampert", "Toxapex", "Drizzle", "Damp Rock"],
		},
		onValidateSet(set, format, setHas, teamHas) {
			if (!teamHas.typeMap) {
				teamHas.typeMap = new Map();
				for (const type of this.dex.types.names()) teamHas.typeMap.set(type, []);
			}
			let template = this.dex.species.get(set.species);
			if (!template.types) return [`Invalid pokemon ${set.name || set.species}`];
			for (const [type] of teamHas.typeMap) {
				if (!template.types.includes(type)) teamHas.typeMap.delete(type);
			}
			const item = this.dex.items.get(set.item);
			if (item.megaStone && template.name === item.megaEvolves) {
				template = this.dex.species.get(item.megaStone);
				for (const [type] of teamHas.typeMap) {
					if (!template.types.includes(type)) teamHas.typeMap.delete(type);
				}
			}
			if (!teamHas.typeMap.size) return [`Your team must share a type.`];
			for (const [type, problems] of teamHas.typeMap) {
				for (const ban of format.customBans![type]) {
					if (setHas[this.dex.formats.validateBanRule(ban)]) problems.push(`${ban} is banned on ${type} teams.`);
				}
			}
		},
		onValidateTeam(team, format, teamHas) {
			let allProblems: string[] = [];
			for (const [, problems] of teamHas.typeMap) {
				if (!problems.length) return;
				allProblems = allProblems.concat(problems);
			}
			return allProblems;
		},
	},
	{
		name: "[Gen 7] MonsJustMons",
		desc: "Abilities, Items, Natures, EVs, and IVs are ignored.",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Archeops', 'Regigigas', 'Slaking'],
		unbanlist: ['Aegislash', 'Blaziken', 'Genesect', 'Landorus', 'Shaymin-Sky'],
		onValidateSet(set) {
			set.ability = '';
			set.evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
			set.hpType = 'Fighting';
			set.item = '';
			set.ivs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
			set.nature = '';
		},
	},
	{
		name: "[Gen 7] Multibility",
		desc: "Multibility is a metagame where you sacrifice your item slot for a secondary ability.",

		mod: 'gen7multibility',
		ruleset: ['[Gen 7] OU', '2 Ability Clause'],
		banlist: ['Kyurem-Black', 'Porygon-Z', 'Togekiss', 'Shedinja', 'Chatter', 'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Imposter', 'Innards Out', 'Parental Bond', 'Pure Power', 'Simple', 'Stakeout', 'Water Bubble', 'Wonder Guard'],
		unbanlist: ['Deoxys-Defense', 'Deoxys-Speed', 'Genesect', 'Greninja', 'Landorus'],
		validateSet(set, teamHas) {
			if (!this.dex.abilities.get(set.item).exists) return this.validateSet(set, teamHas);
			const problems = this.validateSet({...set, item: ''}, teamHas);
			if (problems) return problems;
			const customRules = this.format.customRules || [];
			if (!customRules.includes('!obtainableabilities')) customRules.push('!obtainableabilities');
			const TeamValidator = this.constructor as new(format: string | Format) => TeamValidator;
			return new TeamValidator(Dex.formats.get(this.format.id + '@@@' + customRules.join(','))).validateSet({...set, ability: set.item, item: ''}, teamHas);
		},
		onValidateSet(set) {
			const ability = this.dex.abilities.get(set.ability);
			const item = this.dex.items.get(set.item);
			if (ability.id === item.id) return ["You are not allowed to have " + ability.name + " as both the Ability and the Multibility on the same Pokemon."];
		},
		onFaint(pokemon) {
			this.singleEvent('End', pokemon.getItem(), pokemon.itemState, pokemon);
		},
		onSwitchOut(pokemon) {
			this.singleEvent('End', pokemon.getItem(), pokemon.itemState, pokemon);
		},
	},
	{
		name: "[Gen 7] The Negative Metagame",
		desc: "All base stats are subtracted from 160.",

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers', '!Mega Rayquaza Clause'],
		banlist: ['Smeargle', 'Huge Power', 'Pure Power', 'Deep Sea Tooth', 'Deep Sea Scale', 'Eevium Z', 'Eviolite', 'Light Ball', 'Thick Club'],
		unbanlist: ['Unreleased'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			const newTemplate = this.dex.deepClone(template);
			for (const statName in newTemplate.baseStats) {
				newTemplate.baseStats[statName] = this.clampIntRange(160 - newTemplate.baseStats[statName], 5, 155);
			}
			newTemplate.bst = newTemplate.baseStats.hp + newTemplate.baseStats.atk + newTemplate.baseStats.def + newTemplate.baseStats.spa + newTemplate.baseStats.spd + newTemplate.baseStats.spe;
			return newTemplate;
		},
	},
	{
		name: "[Gen 7] The Negative Metagame Random Battle",
		inherit: ["[Gen 7] The Negative Metagame"],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: [],
		unbanlist: [],
	},
	{
		name: "[Gen 7] Nice'n'Neutralized",
		desc: "Pok&eacute;mon with base stats of 140 or higher get those stats halved.",

		ruleset: ['[Gen 7] Ubers', '!Mega Rayquaza Clause'],

		mod: 'gen7',
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;

			if (!template.abilities) return;

			if (Math.max(...Object.values(template.baseStats)) < 140) return;

			const newTemplate = this.dex.deepClone(template);
			for (const statName in newTemplate.baseStats) {
				if (newTemplate.baseStats[statName] >= 140) newTemplate.baseStats[statName] >>= 1;
			}
			newTemplate.bst = newTemplate.baseStats.hp + newTemplate.baseStats.atk + newTemplate.baseStats.def + newTemplate.baseStats.spa + newTemplate.baseStats.spd + newTemplate.baseStats.spe;
			return newTemplate;
		},
	},
	{
		name: "[Gen 7] One Move Slot Syndrome",
		desc: "Pok&eacute;mon are only allowed one move.",

		mod: 'gen7',
		ruleset: ['Standard'],
		banlist: ['Uber', 'Marowak-Alola', 'Regenerator', 'Leppa Berry'],
		unbanlist: ['Aegislash', 'Blaziken', 'Darkrai', 'Deoxys-Defense', 'Landorus', 'Marshadow', 'Naganadel', 'Pheromosa', 'Zygarde'],
		onValidateSet(set, format, setHas, teamHas) {
			if (set.moves.length > 1) return [(set.name || set.species) + ' is only allowed one move.'];
			if (teamHas['move:' + this.toID(set.moves[0])] > 2) return ['Your team has the combination of ' + this.dex.moves.get(set.moves[0]).name + ' > 2, which is banned.'];
		},
	},
	{
		name: "[Gen 7] OU Dream World",
		desc: "OU with unreleased Pok&eacute;mon, abilities, moves and items (including Mega stones).",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		unbanlist: ['Unreleased'],
	},
	{
		name: "[Gen 7] OUber Metagame",
		desc: "Ubers are reduced to level 90.",

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers'],
		onValidateSet(set) {
			if (this.dex.species.get(set.species).tier === 'Uber' && set.level > 90) set.level = 90;
		},
	},
	{
		name: "[Gen 7] Pain Splitter",
		desc: "Pok&eacute;mon use the move Pain Split after every unresisted attack.",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		onAfterMove(pokemon, target, move) {
			if (!pokemon.fainted && !target.fainted && target.getMoveHitData(move).typeMod >= 0) {
				const averagehp = Math.floor((target.hp + pokemon.hp) / 2) || 1;
				target.sethp(averagehp);
				this.add('-sethp', target, target.getHealth, '[from] move: Pain Split');
				pokemon.sethp(averagehp);
				this.add('-sethp', pokemon, pokemon.getHealth, '[from] move: Pain Split');
			}
		},
	},
	{
		name: "[Gen 7] Plates and Crystals",
		desc: "By equipping a Plate or a Crystal, you grant a Pok&eacute;mon an additional type and also access to moves of that type.",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		restricted: ['Acupressure', 'Belly Drum', 'Chatter', 'Geomancy', 'Shell Smash', 'Shift Gear', 'Sketch', 'Thousand Arrows'],
		checkCanLearn(move, template, lsetData, set) {
			if (!move.isZ && !this.ruleTable.isRestricted('move:' + move.id) && move.type === this.dex.items.get(set!.item).onPlate) return null;
			return this.checkCanLearn(move, template, lsetData, set);
		},
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			const item = this.dex.items.get(target.set.item);
			if (item.onPlate && !template.types.includes(item.onPlate)) return {...template, addedType: item.onPlate};
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			if (pokemon.addedType) this.add('-start', pokemon, 'typeadd', pokemon.addedType);
		},
		onAfterMega(pokemon) {
			if (pokemon.addedType) this.add('-start', pokemon, 'typeadd', pokemon.addedType);
		},
		onTakeItemPriority: 1,
		onTakeItem(item) {
			if (item.onPlate) return false;
		},
	},
	{
		name: "[Gen 7] Protean Palace",
		desc: "All Pok&eacute;mon have the ability Protean on top of their original ability.",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		onPrepareHitPriority: -1,
		onPrepareHit(source, target, move) {
			if (move.hasBounced) return;
			const type = move.type;
			if (!type) return;
			if (type === '???') return;
			if (source.getTypes().join() === type) return;
			if (!source.setType(type)) return;
			this.attrLastMove('[still]');
			this.add('-start', source, 'typechange', type);
			if (!move.flags['charge'] || source.volatiles[move.id]) this.add('-anim', source, move, target);
		},
	},
	{
		name: "[Gen 7] Protean Palace Random Battle",
		inherit: ['[Gen 7] Protean Palace'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Proxy War",
		desc: "Whenever a Pok&eacute;mon switches in it automatically sets up a Substitute if possible.",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		onSwitchInPriority: -1,
		onSwitchIn(pokemon) {
			if (pokemon.volatiles['substitute']) return;
			if (pokemon.hp === 1 || pokemon.hp <= pokemon.maxhp / 4) return;
			pokemon.addVolatile('substitute');
			this.directDamage(pokemon.maxhp / 4);
		},
	},
	{
		name: "[Gen 7] Proxy War Random Battle",
		inherit: ['[Gen 7] Proxy War'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Random Triples Battle",
		inherit: ['[Gen 7] Random Doubles Battle'],

		gameType: 'triples',
	},
	{
		name: "[Gen 7] Real 1v1",
		desc: "Bring one Pok&eacute;mon to battle.",

		mod: 'gen7',
		ruleset: ['Standard', 'Accuracy Moves Clause', 'Swagger Clause', 'Z-Crystals Clause', 'Max Team Size = 1'],
		banlist: ['Uber', 'Jirachi', 'Kyurem-Black', 'Mimikyu', 'Focus Sash', 'Perish Song', 'Switcheroo', 'Trick'],
		unbanlist: ['Aegislash', 'Deoxys-Speed', 'Genesect', 'Gengar-Mega', 'Landorus-Base', 'Lucario-Mega', 'Metagross-Mega', 'Naganadel', 'Pheromosa', 'Zygarde-Complete'],
	},
	{
		name: "[Gen 7] Reliablemons",
		desc: "Each Pok&eacute;mon's first move is changed to its type. If it has a secondary type, then its second move is changed to that type.",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		onModifyTypePriority: -2,
		onModifyType(move, pokemon) {
			const index = pokemon.moves.indexOf(move.id);
			move.type = pokemon.getTypes()[index] || move.type;
		},
	},
	{
		name: "[Gen 7] Reliablemons Random Battle",
		inherit: ['[Gen 7] Reliablemons'],

		team: 'randomReliable',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Return'd",
		desc: "The base power of the move in the first slot is determined as if it was the move Return. Does not apply to multihit moves.",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		onModifyMovePriority: 2,
		onModifyMove(move, pokemon) {
			if (move.basePower > 0 && !move.multihit && move.id === pokemon.moves[0]) {
				move.basePower = Math.floor(pokemon.happiness * 2 / 5) || 1;
			}
		},
	},
	{
		name: "[Gen 7] Return'd Random Battle",
		inherit: ["[Gen 7] Return'd"],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Shared Power Ubers",
		inherit: ['[Gen 7] Shared Power'],
		ruleset: ['[Gen 7] Ubers', 'Evasion Abilities Clause'],
		banlist: ['Gyarados-Mega', 'Shedinja', 'Reshiram', 'Prankster ++ Substitute'],
		unbanlist: [],
		restricted: ['Arena Trap', 'Chlorophyll', 'Huge Power', 'Mold Breaker', 'Pure Power', 'Shadow Shield', 'Shadow Tag', 'Speed Boost', 'Swift Swim', 'Teravolt', 'Turboblaze'],
	},
	{
		name: "[Gen 7] Shared Power Anything Goes",
		inherit: ['[Gen 7] Shared Power'],
		ruleset: ['[Gen 7] Anything Goes'],
		banlist: [],
		unbanlist: [],
		restricted: [],
	},
	{
		name: "[Gen 7] Shedinja Metronome Battle",
		desc: "Bring a team of Shedinjas with the move Metronome to play in a Triples format.",

		gameType: 'triples',
		mod: 'gen7',
		ruleset: ['Obtainable', 'Nickname Clause', 'Cancel Mod', 'Team Preview'],
		checkCanLearn(move, template, lsetData, set) {
			return move.id === 'metronome' ? null : `${set!.species}'s move ${move.name} is invalid because it isn't Metronome.`;
		},
		validateSet(set, teamHas) {
			set.ability = 'wonderguard';
			return this.validateSet(set, teamHas);
		},
	},
	{
		name: "[Gen 7] Shedinja Metronome Doubles Battle",
		inherit: ['[Gen 7] Shedinja Metronome Battle'],
		desc: "Bring a team of Shedinjas with the move Metronome to play in a Doubles format.",

		gameType: 'doubles',
	},
	{
		name: "[Gen 7] Single Slot",
		desc: "Pok&eacute;mon are only allowed one move, unless they forgo their item for a second move.",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		unbanlist: ['Baton Pass'],
		onValidateSet(set) {
			if (set.moves.length > (set.item ? 1 : 2)) return [set.species + ' has too many moves.'];
		},
	},
	{
		name: "[Gen 7] Single Typed",
		desc: "Pok&eacute;mon lose their secondary typing, if any.",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Kyurem-Black', 'Spectral Thief'],
		unbanlist: ['Aegislash', 'Genesect', 'Marshadow', 'Naganadel', 'Pheromosa', 'Solgaleo'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			if (template.types.length === 1) return;
			return {...template, types: [template.types[0]]};
		},
	},
	{
		name: "[Gen 7] SlowMons",
		desc: "Pok&eacute;mon move as if Trick Room is in effect. Trick Room itself negates this.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3483381/">SlowMons</a>`,
		],

		mod: 'slowmons',
		ruleset: ['[Gen 7] OU'],
	},
	{
		name: "[Gen 7] SlowMons Random Battle",
		desc: "Pok&eacute;mon move as if Trick Room is in effect. Trick Room itself negates this.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3483381/">SlowMons</a>`,
		],

		team: 'random',
		mod: 'slowmons',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Stat Switch",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3518568/">Stat Switch</a>`,
		],

		mod: 'statswitch',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Azumarill', 'Diancie-Mega', 'Regice'],
		unbanlist: ['Aegislash', 'Deoxys-Defense', 'Genesect', 'Kangaskhan-Mega', 'Kyurem-White'],
	},
	{
		name: "[Gen 7] Stat Switch Random Battle",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3518568/">Stat Switch</a>`,
		],

		team: 'random',
		mod: 'statswitch',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Stat Switch Anything Goes",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3518568/">Stat Switch</a>`,
		],

		mod: 'statswitch',
		ruleset: ['[Gen 7] Anything Goes'],
	},
	{
		name: "[Gen 7] Stored Trip",
		desc: "If a move has a base power of 60 or less, it gets increased by 20 for each positive stat boost. Does not apply to priority or multihit moves.",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Speed Boost', 'Coil', 'Geomancy', 'Quiver Dance', 'Shell Smash', 'Tail Glow'],
		onBasePowerPriority: 9,
		onBasePower(basePower, pokemon, target, move) {
			if (basePower <= 60 && !move.multihit && move.priority < 0.5) {
				return basePower + 20 * pokemon.positiveBoosts();
			}
		},
	},
	{
		name: "[Gen 7] Super-Effectivemons",
		desc: "Each Pok&eacute;mon can learn any moves that are super-effective on it.",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		checkCanLearn(move, template, lsetData, set) {
			if (this.dex.getImmunity(move, template) && this.dex.getEffectiveness(move, template) > 0) return null;
			if (template.prevo && this.dex.getImmunity(move, this.dex.species.get(template.prevo)) && this.dex.getEffectiveness(move, this.dex.species.get(template.prevo)) > 0) return null;
			return this.checkCanLearn(move, template, lsetData, set);
		},
	},
	{
		name: "[Gen 7] The 5th Move",
		desc: "Each Pok&eacute;mon gains access to its previous teammate's first move in addition to its moves.",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Smeargle'],
		onValidateTeam(team) {
			let donorMove = team[team.length - 1].moves[0];
			for (const set of team) {
				set.moves.push(donorMove);
				donorMove = set.moves[0];
			}
		},
	},
	{
		name: "[Gen 7] Tier Shift ft. Ubers",
		desc: "Pok&eacute;mon below Ubers get all their stats boosted. HP and Speed get +10 while other stats vary by tier: OU/UUBL get +10, UU/RUBL get +20, RU/NUBL get +30, NU/PUBL get +40, PU and NFE get +50, LC Uber get +60 and LC get +70.",

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers', 'Overflow Stat Mod'],
		banlist: ['Electro Ball', 'Deep Sea Tooth'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			if (!template.abilities) return;
			if (['Arena Trap', 'Power Construct', 'Shadow Tag'].includes(target.set.ability)) return;

			const boosts: {[k: string]: number} = {
				'OU': 10,
				'UUBL': 10,
				'UU': 20,
				'RUBL': 20,
				'RU': 30,
				'NUBL': 30,
				'NU': 40,
				'PUBL': 40,
				'PU': 50,
				'NFE': 50,
				'LC Uber': 60,
				'LC': 70,
			};
			const newTemplate = this.dex.deepClone(template);
			if (target.set.item) {
				const item = this.dex.items.get(target.set.item);
				if (item.megaEvolves === template.name) newTemplate.tier = this.dex.species.get(item.megaStone).tier;
			}
			if (newTemplate.tier[0] === '(') newTemplate.tier = newTemplate.tier.slice(1, -1);
			if (!(newTemplate.tier in boosts)) return;
			if (target.set.moves.includes('chatter')) newTemplate.tier = 'PUBL';
			if (target.set.moves.includes('auroraveil') && boosts[newTemplate.tier] > 20) newTemplate.tier = 'RUBL';
			if (target.set.ability === 'Drought') {
				if (boosts[newTemplate.tier] > 30) newTemplate.tier = 'NUBL';
				else if (boosts[newTemplate.tier] === 20) newTemplate.tier = 'UUBL';
			}
			if (target.set.ability === 'Drizzle' && boosts[newTemplate.tier] > 10) newTemplate.tier = 'UUBL';

			const boost = boosts[newTemplate.tier];
			for (const statName in newTemplate.baseStats) {
				newTemplate.baseStats[statName] += statName === 'hp' || statName === 'spe' ? 10 : boost;
			}
			newTemplate.bst = newTemplate.baseStats.hp + newTemplate.baseStats.atk + newTemplate.baseStats.def + newTemplate.baseStats.spa + newTemplate.baseStats.spd + newTemplate.baseStats.spe;
			return newTemplate;
		},
	},
	{
		name: "[Gen 7] Tormenting Spirits",
		desc: "All Pok&eacute;mon are permanently under the effect of Torment.",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Encore', 'Switcheroo + Choice Band', 'Switcheroo + Choice Scarf', 'Switcheroo + Choice Specs', 'Trick + Choice Band', 'Trick + Choice Scarf', 'Trick + Choice Specs'],
		onDisableMove(pokemon) {
			if (pokemon.lastMove && pokemon.lastMove.id !== 'struggle') pokemon.disableMove(pokemon.lastMove.id);
		},
	},
	{
		name: "[Gen 7] Tormenting Spirits Random Battle",
		inherit: ['[Gen 7] Tormenting Spirits'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: [],
	},
	{
		name: "[Gen 7] Triples OU",
		ruleset: ['[Gen 7] Doubles OU'],

		mod: 'gen7',
		gameType: 'triples',
	},
	{
		name: "[Gen 7] Triples Ubers",
		ruleset: ['[Gen 7] Doubles Ubers'],

		mod: 'gen7',
		gameType: 'triples',
	},
	{
		name: "[Gen 7] Triples UU",
		ruleset: ['[Gen 7] Doubles UU'],

		mod: 'gen7',
		gameType: 'triples',
	},
	{
		name: "[Gen 7] Triples Hackmons Cup",
		inherit: ['[Gen 7] Doubles Hackmons Cup'],
		desc: "Randomized teams of level-balanced Pok&eacute;mon with absolutely any ability, moves, and item.",

		gameType: 'triples',
	},
	{
		name: "[Gen 7] Triples Custom Game",
		inherit: ['[Gen 7] Doubles Custom Game'],

		gameType: 'triples',
	},
	{
		name: "[Gen 7] Twenty Four",
		desc: "Each of your Pok&eacute;mon share the 24 moves that your team starts with, but they only have 1 PP each!",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Imposter', 'Regenerator', 'Sketch', 'Transform', 'Trump Card', 'Leppa Berry'],
		onBegin() {
			for (const side of this.sides) {
				const moves: Set<string> = new Set();
				for (const set of side.team) {
					for (const moveid of set.moves) moves.add(moveid);
				}
				const baseMoveSlots = [];
				for (const moveid of moves) {
					const move = this.dex.moves.get(this.dex.moves.get(moveid).id);
					baseMoveSlots.push({
						move: move.name,
						id: move.id,
						pp: 1,
						maxpp: 1,
						target: move.target,
						disabled: false,
						disabledSource: '',
						used: false,
					});
				}
				for (const pokemon of side.pokemon) pokemon.moveSlots = pokemon.baseMoveSlots = baseMoveSlots;
			}
		},
	},
	{
		name: "[Gen 7] Type CondensinG",
		desc: "The current 18 types are condensed into the 11 types that are available in the Trading Card Game.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3573231/">Type CondensinG</a>`,
		],

		mod: 'tcg',
		ruleset: ['[Gen 7] OU'],
	},
	{
		name: "[Gen 7] Type Gems",
		desc: "Holding a Gem changes the Pok&eacute; and its first move into that type.",

		mod: 'gem',
		ruleset: ['[Gen 7] OU'],
		onModifySpecies(template, target, effect) {
			const item = this.dex.items.get(target.set.item);
			if (effect && item.type && !template.types.includes(item.type)) return {...template, types: [template.types[0], item.type]};
		},
		onModifyTypePriority: -2,
		onModifyType(move, pokemon, target) {
			const type = pokemon.getItem().type;
			if (type && pokemon.moves.indexOf(move.id) === 0) move.type = type;
		},
	},
	{
		name: "[Gen 7] Type Gems Random Battle",
		inherit: ["[Gen 7] Type Gems"],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: [],
	},
	{
		name: "[Gen 7] Type Reflectors",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Shedinja'],
		onBegin() {
			for (const side of this.sides) {
				side.pokemon[0].m.isReflector = true;
				side.reflectedType = side.pokemon[0].types[0];
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			if (pokemon.m.isReflector) return;
			const type = pokemon.side.reflectedType!;
			if (pokemon.types.indexOf(type) > 0 || pokemon.types.length === 1 && pokemon.types[0] === type) return;
			if (pokemon.species.isMega && pokemon.types.join() !== this.dex.species.get(pokemon.species.baseSpecies).types.join()) return;
			if (pokemon.types.length > 1 && pokemon.types[0] === type) {
				pokemon.setType(type);
			} else {
				pokemon.setType([pokemon.types[0], type]);
			}
			this.add('-start', pokemon, 'typechange', pokemon.types.join('/'));
		},
		onAfterMega(pokemon) {
			if (pokemon.m.isReflector) return;
			const type = pokemon.side.reflectedType!;
			if (pokemon.types.indexOf(type) > 0 || pokemon.types.length === 1 && pokemon.types[0] === type) return;
			if (pokemon.types.join() !== this.dex.species.get(pokemon.species.baseSpecies).types.join()) return;
			if (pokemon.types.length > 1 && pokemon.types[0] === type) {
				pokemon.setType(type);
			} else {
				pokemon.setType([pokemon.types[0], type]);
			}
			this.add('-start', pokemon, 'typechange', pokemon.types.join('/'));
		},
	},
	{
		name: "[Gen 7] Type Reflectors Random Battle",
		inherit: ['[Gen 7] Type Reflectors'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: [],
	},
	{
		name: "[Gen 7] Ubers Tier Shift",
		desc: "Pok&eacute;mon below Uber get all their stats boosted. OU/UUBL get +10, UU/RUBL get +15, RU/NUBL get +20 and NU or lower get +25.",

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers', 'Overflow Stat Mod'],
		onModifySpecies(template, target, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			if (!template.abilities) return;
			if (['Arena Trap', 'Power Construct', 'Shadow Tag'].includes(target.set.ability)) return;

			const boosts: {[k: string]: number} = {
				'OU': 10,
				'UUBL': 10,
				'UU': 15,
				'RUBL': 15,
				'RU': 20,
				'NUBL': 20,
				'NU': 25,
				'PUBL': 25,
				'PU': 25,
				'NFE': 25,
				'LC Uber': 25,
				'LC': 25,
			};
			const newTemplate = this.dex.deepClone(template);
			if (target.set.item) {
				const item = this.dex.items.get(target.set.item);
				if (item.megaEvolves === newTemplate.species) newTemplate.tier = this.dex.species.get(item.megaStone).tier;
			}
			if (newTemplate.tier[0] === '(') newTemplate.tier = newTemplate.tier.slice(1, -1);
			if (!(newTemplate.tier in boosts)) return;
			if (target.set.moves.includes('chatter')) newTemplate.tier = 'PUBL';
			if (target.set.moves.includes('auroraveil') && boosts[newTemplate.tier] > 20) newTemplate.tier = 'RUBL';
			if (target.set.ability === 'Drought') {
				if (boosts[newTemplate.tier] > 20) newTemplate.tier = 'NUBL';
				else if (boosts[newTemplate.tier] === 15) newTemplate.tier = 'UUBL';
			}
			if (target.set.ability === 'Drizzle' && boosts[newTemplate.tier] > 10) newTemplate.tier = 'UUBL';

			const boost = boosts[newTemplate.tier];
			for (const statName in newTemplate.baseStats) {
				newTemplate.baseStats[statName] = this.clampIntRange(newTemplate.baseStats[statName] + boost, 1, 255);
			}
			newTemplate.bst = newTemplate.baseStats.hp + newTemplate.baseStats.atk + newTemplate.baseStats.def + newTemplate.baseStats.spa + newTemplate.baseStats.spd + newTemplate.baseStats.spe;
			return newTemplate;
		},
	},
	{
		name: "[Gen 7] Ubers UU",
		desc: "Pok&eacute;mon not exceeding 3.41% by usage in the Ubers metagame.",

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers'],
		banlist: [
			'Aegislash', 'Arceus-Base', 'Arceus-Fairy', 'Arceus-Ground', 'Arceus-Water', 'Blaziken-Mega', 'Darkrai', 'Deoxys-Attack', 'Deoxys-Speed',
			'Diancie-Mega', 'Ferrothorn', 'Gengar-Mega', 'Giratina-Base', 'Giratina-Origin', 'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Lucario-Mega', 'Lugia',
			'Lunala', 'Magearna', 'Marshadow', 'Mewtwo-Mega-X', 'Mewtwo-Mega-Y', 'Naganadel', 'Necrozma-Dusk-Mane',
			'Rayquaza', 'Sableye-Mega', 'Salamence-Mega', 'Smeargle', 'Xerneas', 'Yveltal', 'Zygarde', 'Blue Orb', 'Red Orb',
		],
	},
	{
		name: "[Gen 7] UU Mix and Mega",
		desc: "Mega Stones and Primal Orbs can be used on any Pok&eacute;mon below OU with no Mega Evolution limit.",

		mod: 'gen7mixandmegauu',
		ruleset: ['[Gen 7] OU', 'Overflow Stat Mod'],
		banlist: ['Electrify'],
		restricted: ['Beedrillite', 'Blazikenite', 'Gengarite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Ultranecrozium Z'],
		onValidateTeam(team) {
			const itemTable: {[k: string]: number} = {};
			for (const set of team) {
				const item = this.dex.items.get(set.item);
				if (!itemTable[item.id]) itemTable[item.id] = 0;
				if (++itemTable[item.id] < 2) continue;
				if (item.megaStone) return ["You are limited to one of each Mega Stone.", "(You have more than one " + item.name + ".)"];
				if (item.id === 'blueorb' || item.id === 'redorb') return ["You are limited to one of each Primal Orb.", "(You have more than one " + item.name + ".)"];
			}
		},
		onValidateSet(set) {
			const template = this.dex.species.get(set.species || set.name);
			const item = this.dex.items.get(set.item);
			if (!item.megaEvolves && item.id !== 'blueorb' && item.id !== 'redorb') return;
			if (template.baseSpecies === item.megaEvolves) return;
			if (template.tier === 'OU') return [template.name + " is not allowed to hold a Mega Stone."];
			switch (item.id) {
			case 'beedrillite': case 'gengarite': case 'kangaskhanite':
				return [item.name + " is only allowed to be held by " + item.megaEvolves + "."];
			case 'blazikenite':
				if (set.ability === 'Speed Boost') break;
				return ["You are only allowed to hold Blazikenite if your Ability is Speed Boost."];
			case 'mawilite': case 'medichamite':
				if (set.ability === 'Huge Power' || set.ability === 'Pure Power') break;
				if (template.name === "Mawile" || template.name === "Medicham") break;
				return ["You are only allowed to hold " + item.name + " if your Ability is Huge Power or Pure Power."];
			case 'ultranecroziumz':
				return ["Ultranecrozium Z is only allowed to be held by Necrozma-Dawn-Wings or Necrozma-Dusk-Mane."];
			}
		},
		onModifySpecies(template, target, format, effect) {
			if (!effect || ['imposter', 'transform'].includes(effect.id)) return;
			const megaSpecies = (effect as Item).megaStone || ({dragonascent: 'Rayquaza-Mega', redorb: 'Groudon-Primal', blueorb: 'Kyogre-Primal'} as {[k: string]: string})[effect.id];
			if (!megaSpecies || megaSpecies === template.name) return;
			template = this.getMixedSpecies(template, megaSpecies);
			return template;
		},
		onBegin() {
			const allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (const pokemon of allPokemon) {
				pokemon.m.originalSpecies = pokemon.baseSpecies.name;
			}
		},
		onSwitchIn(pokemon) {
			const oMegaTemplate = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				// Place volatiles on the Pokémon to show its mega-evolved condition and details
				this.add('-start', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
				const oTemplate = this.dex.species.get(pokemon.m.originalSpecies);
				if (oTemplate.types.length !== pokemon.species.types.length || oTemplate.types[1] !== pokemon.species.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut(pokemon) {
			const oMegaTemplate = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				this.add('-end', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			}
		},
	},
	{
		name: "[Gen 7] UU Mix and Mega Random Battle",
		inherit: ['[Gen 7] UU Mix and Mega'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod', 'Overflow Stat Mod'],
		banlist: [],
		restricted: [],
	},
	{
		name: "[Gen 7] VoltTurn Mayhem",
		desc: "All targeted moves force you to switch.",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Fake Out > 1'],
		onModifyMovePriority: -1,
		onModifyMove(move) {
			switch (move.target) {
			case 'normal':
			case 'randomNormal':
			case 'allAdjacent':
			case 'allAdjacentFoes':
			case 'any':
			case 'scripted':
				move.selfSwitch = true;
			}
		},
	},
	{
		name: "[Gen 7] VoltTurn Mayhem Random Battle",
		inherit: ['[Gen 7] VoltTurn Mayhem'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: [],
	},
	{
		name: "[Gen 7] X-Mons",
		desc: "Boosts always affect your highest stat(s).",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3579276/">X-Mons</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		battle: {
			boost(boost, target, source, effect, isSecondary, isSelf) {
				if (this.event) {
					if (!target) target = this.event.target;
					if (!source) source = this.event.source;
					if (!effect) effect = this.effect;
				}
				if (!target || !target.hp) return 0;
				if (!target.isActive) return false;
				if (this.gen > 5 && !target.side.foe.pokemonLeft) return false;
				boost = this.runEvent('Boost', target, source, effect, {...boost});
				let success = null;
				let boosted = false;
				const stats: StatsExceptHPTable = {atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
				const statList: StatIDExceptHP[] = ['atk', 'def', 'spa', 'spd', 'spe'];
				for (const stat of statList) {
					stats[stat] = target.calculateStat(stat, target.boosts[stat]);
				}
				statList.sort((a, b) => stats[b] - stats[a] || Math.random() - 0.5);
				let i: BoostID;
				for (i in boost) {
					const currentBoost: SparseBoostsTable = {};
					if (i in stats) {
						currentBoost[statList[0]] = boost[i];
						i = statList.shift()!;
					} else {
						currentBoost[i] = boost[i];
					}
					let boostBy = target.boostBy(currentBoost);
					let msg = '-boost';
					if (boost[i]! < 0) {
						msg = '-unboost';
						boostBy = -boostBy;
					}
					if (boostBy) {
						success = true;
						switch (effect?.id) {
						case 'bellydrum':
							this.add('-setboost', target, i, target.boosts[i], '[from] move: Belly Drum');
							break;
						case 'bellydrum2':
							this.add(msg, target, i, boostBy, '[silent]');
							this.add('-hint', "In Gen 2, Belly Drum boosts by 2 when it fails.");
							break;
						case 'intimidate': case 'gooey': case 'tanglinghair':
							this.add(msg, target, i, boostBy);
							break;
						case 'zpower':
							this.add(msg, target, i, boostBy, '[zeffect]');
							break;
						default:
							if (effect?.effectType === 'Move') {
								this.add(msg, target, i, boostBy);
							} else {
								if (effect?.effectType === 'Ability' && !boosted) {
									this.add('-ability', target, effect.name, 'boost');
									boosted = true;
								}
								this.add(msg, target, i, boostBy);
							}
							break;
						}
						this.runEvent('AfterEachBoost', target, source, effect, currentBoost);
					} else if (effect?.effectType === 'Ability') {
						if (isSecondary) this.add(msg, target, i, boostBy);
					} else if (!isSecondary && !isSelf) {
						this.add(msg, target, i, boostBy);
					}
				}
				return success;
			},
		},
	},
	{
		name: "[Gen 7] You First",
		desc: "Every time you use a move, your opponent gets to use it first.",

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Explosion', 'Final Gambit', 'Healing Wish', 'Last Resort', 'Lunar Dance', 'Memento', 'Self Destruct', 'Transform'],
		onBeforeMovePriority: -1,
		onBeforeMove(attacker, defender, move) {
			const target = attacker.side.foe.active[attacker.side.foe.active.length - 1 - attacker.position];
			if (target) this.actions.useMove(move, target, attacker === defender ? target : attacker);
			return attacker.hp !== 0;
		},
	},

	// OM Mashups
	///////////////////////////////////////////////////////////////////

	{
		section: "OM Mashups",
		column: 1,
	},
	{
		name: "[Gen 8] AAA LC",
		inherit: ['[Gen 8] Almost Any Ability'],
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3635904/">OM Mashup Megathread</a>`,
		],

		ruleset: ['[Gen 8] LC', '2 Ability Clause', '!Obtainable Abilities'],
		banlist: [],
		unbanlist: ['Cutiefly', 'Drifloon', 'Gothita', 'Rufflet', 'Scyther', 'Swirlix', 'Tangela', 'Vulpix-Alola'],
	},
	{
		name: "[Gen 8] AAA Monotype",
		inherit: ['[Gen 8] Almost Any Ability'],
		desc: "Pok&eacute;mon can use any ability, barring the few that are restricted. All the Pok&eacute;mon on a team must share a type.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3660464/">Monotype OM Mega Thread</a>`,
		],

		ruleset: ['[Gen 8] Monotype', '!Obtainable Abilities', '[Gen 8] Almost Any Ability'],
		banlist: ['Dragonite', 'Melmetal', 'Psychic Surge', 'Triage'],
		unbanlist: ['Buzzwole', 'Zeraora'],
		restricted: [],
	},
	{
		name: "[Gen 8] AAA Monotype (Official)",
		inherit: ['[Gen 8] Almost Any Ability (Official)'],
		desc: "Pok&eacute;mon can use any ability, barring the few that are banned. All the Pok&eacute;mon on a team must share a type.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3660464/">Monotype OM Mega Thread</a>`,
		],

		ruleset: ['[Gen 8] Monotype', '!Obtainable Abilities', '[Gen 8] Almost Any Ability'],
		banlist: ['Dragonite', 'Melmetal', 'Psychic Surge', 'Triage'],
		unbanlist: ['Buzzwole', 'Zeraora'],
	},
	{
		name: "[Gen 8] AAA Ubers",
		inherit: ['[Gen 8] Almost Any Ability'],
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3657519/">OM Mashup Megathread</a>`,
		],

		ruleset: ['[Gen 8] Ubers', '2 Ability Clause', '!Obtainable Abilities'],
		banlist: ['Shedinja', 'Arena Trap'],
		unbanlist: [],
	},
	{
		name: "[Gen 8] Balanced Hackmons LC",
		desc: "Anything that can be hacked in-game and is usable in local battles is allowed.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3657519/">OM Mashup Megathread</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] Balanced Hackmons', 'Little Cup'],
	},
	{
		name: "[Gen 8] CAAAmomons",
		inherit: ["[Gen 8] Camomons", "[Gen 8] Almost Any Ability"],
		desc: "Pok&eacute;mon change type to match their first two moves. Pok&eacute;mon can use any ability, barring the few that are banned.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3657519/">OM Mashup Megathread</a>`,
		],
		banlist: ['Shedinja'],
	},
	{
		name: "[Gen 8] Camomons BH",
		inherit: ["[Gen 8] Camomons", "[Gen 8] Balanced Hackmons"],
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3657519/">OM Mashup Megathread</a>`,
		],
	},
	{
		name: "[Gen 8] Camomons LC",
		inherit: ['[Gen 8] Camomons'],

		ruleset: ['[Gen 8] LC'],
		banlist: ['Cherubi'],
		unbanlist: ['Cutiefly', 'Drifloon', 'Gothita', 'Rufflet', 'Scyther', 'Swirlix', 'Tangela', 'Vulpix-Alola'],
	},
	{
		name: "[Gen 8] Mix and Mega LC",
		inherit: ['[Gen 8] Mix and Mega'],
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3657519/">OM Mashup Megathread</a>`,
		],

		ruleset: ['[Gen 8] Mix and Mega', 'Little Cup'],
		banlist: ['Chlorophyll'],
		restricted: ['Archen', 'Corsola-Galar', 'Dratini', 'Gastly', 'Scyther', 'Sneasel', 'Tangela'],
		unbanlist: [],
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 8] Monotype LC",
		desc: "All the Pok&eacute;mon on a team must share a type.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3660464/">Monotype OM Mega Thread</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] LC', 'Same Type Clause'],
		unbanlist: ['Vulpix-Alola'],
	},
	{
		name: "[Gen 8] Monotype STABmons",
		inherit: ['[Gen 8] STABmons'],
		desc: "All the Pok&eacute;mon on a team must share a type. Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3660464/">Monotype OM Mega Thread</a>`,
		],

		ruleset: ['[Gen 8] STABmons', '[Gen 8] Monotype'],
		banlist: [],
		unbanlist: ['Cinderace', 'Darmanitan', 'Gengar', 'Thundurus-Base', 'Arena Trap'],
		restricted: [],
	},
	{
		name: "[Gen 8] Monotype Ubers",
		desc: "All the Pok&eacute;mon on a team must share a type.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3660464/">Monotype OM Mega Thread</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] Ubers', 'Same Type Clause'],
	},
	{
		name: "[Gen 8] STAAABmons",
		inherit: ['[Gen 8] Almost Any Ability', '[Gen 8] STABmons'],
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3680144/">STAAABmons</a>`,
		],

		ruleset: ['[Gen 8] STABmons', '!Obtainable Abilities', '[Gen 8] Almost Any Ability'],
		banlist: ['Chandelure', 'Latios', 'Melmetal', 'Regigigas', 'Terrakion', 'Victini', 'Volcarona', 'Quick Draw'],
		unbanlist: ['Buzzwole', 'Darmanitan-Galar', 'Dracovish', 'Dragonite', 'Kyurem', 'Landorus-Incarnate', 'Mamoswine', 'Porygon-Z', 'Urshifu-Rapid-Strike', 'Precipice Blades'],
		restricted: ['Dragon Ascent', 'Dragon Energy', 'Eruption', 'Transform', 'Water Spout'],
	},
	{
		name: "[Gen 8] STABmons LC",
		inherit: ['[Gen 8] STABmons'],
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3657519/">OM Mashup Megathread</a>`,
		],

		ruleset: ['[Gen 8] LC'],
		banlist: ['Cherubi', 'Porygon'],
		unbanlist: [
			'Cutiefly', 'Drifloon', 'Gothita', 'Rufflet', 'Scyther', 'Swirlix', 'Tangela', 'Vulpix-Alola',
			'Astral Barrage', 'Clangorous Soul', 'Oblivion Wing', 'Precipice Blades', 'Thunderous Kick',
		],
	},
	{
		name: "[Gen 8] STABmons Ubers",
		inherit: ['[Gen 8] STABmons'],
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3657519/">OM Mashup Megathread</a>`,
		],

		ruleset: ['[Gen 8] Ubers'],
		banlist: [],
		unbanlist: [],
		restricted: ['Acupressure', 'Belly Drum', 'Chatter', 'Extreme Speed', 'Geomancy', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows'],
	},
	{
		name: "[Gen 8] Ultra Mix",
		inherit: ["[Gen 8] Mix and Mega", "[Gen 8] Alphabet Cup"],
		desc: "Ultra Mix is a combination of Almost Any Ability, Alphabet Cup, Camonons, Mix and Mega, Scalemons and Tier Shift.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3657519/">OM Mashup Megathread</a>`,
		],

		ruleset: ['[Gen 8] Mix and Mega', '[Gen 8] Alphabet Cup', '!Obtainable Abilities', '[Gen 8] Almost Any Ability'],
		banlist: ['Abra', 'Darumaka', 'Gastly', 'Pikachu'],
		restricted: ['Butterfree', 'Chansey', 'Raichu', 'Sneasel', 'Whismur', 'Wishiwashi'],
		unbanlist: [],
		onModifySpecies(template, target, format, effect) {
			let newTemplate = this.dex.deepClone(template);
			if (effect && effect.effectType === 'Item') {
				const megaSpecies = effect.megaStone;
				if (megaSpecies && megaSpecies !== template.name) {
					newTemplate = this.getMixedSpecies(template, megaSpecies);
				}
			}
			const stats: StatIDExceptHP[] = ['atk', 'def', 'spa', 'spd', 'spe'];
			const pst = newTemplate.bst - newTemplate.baseStats['hp'];
			const scale = 600 - newTemplate.baseStats['hp'];
			for (const stat of stats) {
				newTemplate.baseStats[stat] = this.clampIntRange(newTemplate.baseStats[stat] * scale / pst, 1, 255);
			}
			if (!effect || !['imposter', 'transform'].includes(effect.id)) {
				newTemplate.types = [...new Set(target.set.moves.slice(0, 2).map(move => this.dex.moves.get(move).type))];
				const boosts: {[k: string]: number} = {
					'UU': 10,
					'RUBL': 10,
					'RU': 20,
					'NUBL': 20,
					'NU': 30,
					'PUBL': 30,
					'PU': 40,
					'NFE': 40,
					'LC Uber': 40,
					'LC': 40,
				};
				if (newTemplate.tier[0] === '(') newTemplate.tier = newTemplate.tier.slice(1, -1);
				if (newTemplate.tier in boosts) {
					if (target.set.moves.includes('lightclay') && boosts[newTemplate.tier] > 10) newTemplate.tier = 'RUBL';
					if (target.set.moves.includes('auroraveil') && boosts[newTemplate.tier] > 10) newTemplate.tier = 'NUBL';
					if (['Drizzle', 'Drought', 'Snow Warning'].includes(target.set.ability) && boosts[newTemplate.tier] > 20) newTemplate.tier = 'NUBL';

					const boost = boosts[newTemplate.tier];
					for (const statName of ['atk', 'def', 'spa', 'spd', 'spe']) {
						newTemplate.baseStats[statName] = this.clampIntRange(newTemplate.baseStats[statName] + boost, 1, 255);
					}
				}
			}
			newTemplate.bst = newTemplate.baseStats.hp + newTemplate.baseStats.atk + newTemplate.baseStats.def + newTemplate.baseStats.spa + newTemplate.baseStats.spd + newTemplate.baseStats.spe;
			return newTemplate;
		},
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 7] AAA LC",
		inherit: ['[Gen 7] Almost Any Ability'],
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3635904/">OM Mashup Megathread</a>`,
		],

		ruleset: ['[Gen 7] LC', '2 Ability Clause', '!Obtainable Abilities'],
		banlist: ['Archen'],
		unbanlist: ['Drifloon', 'Gothita', 'Swirlix', 'Trapinch', 'Vulpix-Base', 'Wingull'], // was [],
		restricted: [
			'Arena Trap', 'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Shadow Tag', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
		],
	},
	{
		name: "[Gen 7] AAA Monotype",
		inherit: ['[Gen 7] Almost Any Ability'],
		desc: "Pok&eacute;mon can use any ability, barring the few that are restricted. All the Pok&eacute;mon on a team must share a type.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3600651/">Monotype OM Mega Thread</a>`,
		],

		ruleset: ['[Gen 7] Monotype', '!Obtainable Abilities', '[Gen 7] Almost Any Ability'],
		banlist: ['Aegislash', 'Genesect', 'Mawile-Mega', 'Metagross-Mega', 'Minior', 'Naganadel', 'Noivern', 'Zygarde', 'Psychic Surge'], // was ['Noivern']
		unbanlist: ['Greninja-Ash', 'Tapu Lele', 'Arena Trap'],
		restricted: [],
	},
	{
		name: "[Gen 7] Balanced Hackmons LC",
		desc: "Anything that can be hacked in-game and is usable in local battles is allowed.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3635904/">OM Mashup Megathread</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] Balanced Hackmons', 'Little Cup'],
		banlist: ['Gligar', 'Scyther', 'Sneasel', 'Type: Null', 'Eevium Z', 'Dragon Rage', 'Sonic Boom'],
	},
	{
		name: "[Gen 7] CAAAmomons",
		inherit: ['[Gen 7] Almost Any Ability', '[Gen 7] Camomons'],
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3635904/">OM Mashup Megathread</a>`,
		],

		ruleset: ['[Gen 7] Camomons', '!Obtainable Abilities', '[Gen 7] Almost Any Ability'],
		banlist: [],
		unbanlist: [],
		restricted: [],
	},
	{
		name: "[Gen 7] Monotype LC",
		desc: "All the Pok&eacute;mon on a team must share a type.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3600651/">Monotype OM Mega Thread</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] LC', 'Same Type Clause'],
		unbanlist: ['Gothita', 'Misdreavus', 'Torchic', 'Vulpix-Base', 'Wingull'],
	},
	{
		name: "[Gen 7] Monotype STABmons",
		inherit: ['[Gen 7] STABmons'],
		desc: "All the Pok&eacute;mon on a team must share a type. Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3600651/">Monotype OM Mega Thread</a>`,
		],

		ruleset: ['[Gen 7] STABmons', '[Gen 7] Monotype'],
		banlist: ['Kyurem-White', 'Zygarde'], // was []
		unbanlist: ['Araquanid', 'Blacephalon', 'Kartana', 'Magearna', 'Medicham-Mega', 'Porygon-Z', 'Thundurus', 'Terrain Extender'], // was ['Terrain Extender']
		restricted: ['Boomburst', 'Celebrate', 'Conversion', "Forest's Curse", 'Happy Hour', 'Hold Hands', 'Purify', 'Trick-or-Treat'],
	},
	{
		name: "[Gen 7] Monotype Ubers",
		desc: "All the Pok&eacute;mon on a team must share a type.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3600651/">Monotype OM Mega Thread</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers', 'Same Type Clause'],
		banlist: ['Marshadow'],
	},
	{
		name: "[Gen 7] Pure Hackmons",
		desc: "Anything that can be hacked in-game and is usable in local battles is allowed.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3635904/">OM Mashup Megathread</a>`,
		],

		mod: 'gen7',
		ruleset: ['-Nonexistent', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] STAAABmons",
		inherit: ['[Gen 7] Almost Any Ability', '[Gen 7] STABmons'],
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3635904/">OM Mashup Megathread</a>`,
		],

		ruleset: ['[Gen 7] STABmons', '!Obtainable Abilities', '[Gen 7] Almost Any Ability'],
		banlist: ['Blaziken', 'Deoxys-Defense', 'Deoxys-Speed', 'Kyurem-White', 'Pheromosa', 'Thundurus-Therian'],
		unbanlist: ['Porygon-Z', 'Tapu Lele'],
		restricted: [],
	},
	{
		name: "[Gen 7] STABmons LC",
		inherit: ['[Gen 7] STABmons'],
		desc: "Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3635904/">OM Mashup Megathread</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] STABmons', '[Gen 7] LC'],
		banlist: [],
		unbanlist: ['Gothita', 'Extreme Speed', 'Spore'],
		restricted: [],
	},
	{
		name: "[Gen 7] STABmons Ubers",
		inherit: ['[Gen 7] STABmons'],
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3635904/">OM Mashup Megathread</a>`,
		],

		ruleset: ['[Gen 7] Ubers'],
		banlist: ['Arceus', 'Kangaskhan-Mega', 'Komala'],
		unbanlist: [],
		restricted: ['Acupressure', 'Belly Drum', 'Chatter', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Sketch', 'Spore', 'Thousand Arrows'],
	},
	{
		name: "[Gen 7 Let's Go] LC",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3635904/">OM Mashup Megathread</a>`,
		],

		mod: 'gen7letsgo',
		ruleset: ["[Gen 7 Let's Go] OU", 'Little Cup'],
	},
	{
		name: "[Gen 7 Let's Go] Inverse Battle",
		desc: "The effectiveness of each attack is inverted.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3635904/">OM Mashup Megathread</a>`,
		],

		mod: 'gen7letsgo',
		ruleset: ["[Gen 7 Let's Go] OU", 'Inverse Mod'],
	},
	{
		name: "[Gen 7 Let's Go] STABmons",
		desc: "Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3635904/">OM Mashup Megathread</a>`,
		],

		mod: 'gen7letsgo',
		ruleset: ["[Gen 7 Let's Go] OU"],
		restricted: ['Lovely Kiss', 'Shell Smash', 'Spore'],
		checkCanLearn(move, template, lsetData, set) {
			if (!move.isZ && !this.ruleTable.isRestricted('move:' + move.id)) {
				let types = template.types;
				if (template.prevo) types = types.concat(this.dex.species.get(this.dex.species.get(template.prevo).prevo || template.prevo).types);
				if (types.includes(move.type)) return null;
			}
			return this.checkCanLearn(move, template, lsetData, set);
		},
	},

	// Mix and Mega Mashups
	///////////////////////////////////////////////////////////////////

	{
		section: "Mix and Mega Mashups",
		column: 2,
	},
	{
		name: "[Gen 8] 1v1 Mix and Mega",
		inherit: ["[Gen 8] Mix and Mega"],
		desc: "Bring three Pok&eacute;mon to Team Preview and choose one to battle. Mega Stones can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",

		ruleset: ['[Gen 8] Mix and Mega', 'Picked Team Size = 1', 'Max Team Size = 3'],
		banlist: ['Banettite', 'Beedrillite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite'],
		restricted: ['Eternatus-Base', 'Kyurem'],
		unbanlist: ['Pheromosa', 'Urshifu', 'Urshifu-Rapid-Strike', 'Gengarite'],
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 8] Bonus Type Mix and Mega",
		inherit: ["[Gen 8] Mix and Mega"],
		desc: "Pok&eacute;mon gain an additional type by being nicknamed. Mega Stones can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3683173/">Bonus Type</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656469/">Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3659028/">M&amp;M Resources</a>`,
		],

		ruleset: ['[Gen 8] Mix and Mega'],
		banlist: [],
		unbanlist: [],
		restricted: [],
		onModifySpecies(template, target, format, effect) {
			let newTemplate = this.dex.deepClone(template);
			if (effect && effect.effectType === 'Item') {
				const megaSpecies = effect.megaStone;
				if (megaSpecies && megaSpecies !== template.name) {
					newTemplate = this.getMixedSpecies(template, megaSpecies);
				}
			}
			if (effect && ['imposter', 'transform'].includes(effect.id)) return newTemplate;
			const type = this.dex.types.get(target.set.name);
			if (type.exists) newTemplate.addedType = type.name;
			return newTemplate;
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			if (pokemon.addedType) this.add('-start', pokemon, 'typeadd', pokemon.addedType);
		},
		onAfterMega(pokemon) {
			if (pokemon.addedType) this.add('-start', pokemon, 'typeadd', pokemon.addedType);
		},
		onSwitchOut() {},
	},
	{
		name: "[Gen 8] BH Mix and Mega",
		inherit: ["[Gen 8] Mix and Mega Anything Goes"],

		ruleset: ['[Gen 8] Balanced Hackmons', 'Overflow Stat Mod'],
	},
	{
		name: "[Gen 8] Camomons Mix and Mega",
		inherit: ["[Gen 8] Mix and Mega"],
		desc: "Pok&eacute;mon change type to match their first two moves. Mega Stones can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656413/">Camomons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656469/">Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3659028/">M&amp;M Resources</a>`,
		],

		ruleset: ['[Gen 8] Mix and Mega'],
		banlist: ['Shedinja'],
		restricted: ['Eternatus', 'Mew', 'Zygarde-Base'],
		unbanlist: ['Urshifu-Rapid-Strike'],
		onModifySpecies(template, target, format, effect) {
			let newTemplate = this.dex.deepClone(template);
			if (effect && effect.effectType === 'Item') {
				const megaSpecies = effect.megaStone;
				if (megaSpecies && megaSpecies !== template.name) {
					newTemplate = this.getMixedSpecies(template, megaSpecies);
				}
			}
			if (!effect || !['imposter', 'transform'].includes(effect.id)) {
				newTemplate.types = [...new Set(target.set.moves.slice(0, 2).map(move => this.dex.moves.get(move).type))];
			}
			return newTemplate;
		},
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 8] Godly Gift Mix and Mega",
		inherit: ["[Gen 8] Mix and Mega"],
		desc: "Each Pok&eacute;mon receives one base stat from your God depending on its position in your team. Mega Stones can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3660461/">Godly Gift</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656469/">Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3659028/">M&amp;M Resources</a>`,
		],

		ruleset: ['[Gen 8] Mix and Mega', '[Gen 8] Godly Gift'],
		banlist: [],
		restricted: [],
		unbanlist: [],
		onModifySpecies(template, target, format, effect) {
			let newTemplate = this.dex.deepClone(template);
			if (effect && effect.effectType === 'Item') {
				const megaSpecies = effect.megaStone;
				if (megaSpecies && megaSpecies !== template.name) {
					newTemplate = this.getMixedSpecies(template, megaSpecies);
				}
			}
			if (!effect || !['imposter', 'transform'].includes(effect.id)) {
				const uber = target.side.team.find(set => this.dex.species.get(set.species).tier === 'Uber') || target.side.team[0];
				const stat = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'][target.side.team.indexOf(target.set)] as StatID;
				newTemplate.bst -= newTemplate.baseStats[stat];
				newTemplate.baseStats[stat] = this.dex.species.get(uber.species).baseStats[stat];
				newTemplate.bst += newTemplate.baseStats[stat];
			}
			return newTemplate;
		},
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 8] Mix and Mega Draft",
		inherit: ['[Gen 8] Mix and Mega'],

		ruleset: ['Draft', 'Overflow Stat Mod', 'Dynamax Clause'],
		banlist: [],
		restricted: [],
	},
	{
		name: "[Gen 8] Mix and Mega Doubles",
		inherit: ['[Gen 8] Mix and Mega'],

		gameType: 'doubles',
		ruleset: ['[Gen 8] Doubles Ubers', 'Dynamax Clause', 'Sleep Moves Clause', 'Overflow Stat Mod'],
		banlist: ['Calyrex-Shadow', 'Magearna', 'Zacian-Crowned', 'Moody', 'Shadow Tag', 'Electrify', 'Charizardite Y'],
		restricted: [
			'Beedrillite', 'Blazikenite', 'Gengarite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite',
			'DUber', 'Kyogre', 'Kyurem-Black',
		],
		unbanlist: [
			'Jirachi', 'Landorus-Therian', 'Naganadel', 'Pheromosa',
			'Abomasnow-Mega', 'Absol-Mega', 'Aerodactyl-Mega', 'Aggron-Mega', 'Alakazam-Mega', 'Altaria-Mega',
			'Audino-Mega', 'Blastoise-Mega', 'Blaziken-Mega', 'Charizard-Mega-X', 'Charizard-Mega-Y',
			'Diancie-Mega', 'Gallade-Mega', 'Garchomp-Mega', 'Gardevoir-Mega', 'Gengar-Mega', 'Glalie-Mega', 'Gyarados-Mega', 'Heracross-Mega',
			'Kangaskhan-Mega', 'Latias-Mega', 'Latios-Mega', 'Lopunny-Mega', 'Lucario-Mega', 'Manectric-Mega', 'Metagross-Mega', 'Mawile-Mega',
			'Mewtwo-Mega-X', 'Mewtwo-Mega-Y', 'Pinsir-Mega', 'Sableye-Mega', 'Salamence-Mega', 'Sceptile-Mega', 'Scizor-Mega',
			'Sharpedo-Mega', 'Slowbro-Mega', 'Steelix-Mega', 'Swampert-Mega', 'Tyranitar-Mega', 'Venusaur-Mega',
			'Abomasite', 'Absolite', 'Aerodactylite', 'Aggronite', 'Alakazite', 'Altarianite', 'Ampharosite',
			'Audinite', 'Banettite', 'Blastoisinite', 'Cameruptite', 'Charizardite X',
			'Diancite', 'Galladite', 'Garchompite', 'Gardevoirite', 'Glalitite', 'Gyaradosite', 'Heracronite',
			'Houndoominite', 'Latiasite', 'Latiosite', 'Lopunnite', 'Lucarionite', 'Manectite', 'Metagrossite',
			'Mewtwonite X', 'Mewtwonite Y', 'Pinsirite', 'Sablenite', 'Salamencite', 'Sceptilite', 'Scizorite',
			'Sharpedonite', 'Slowbronite', 'Steelixite', 'Swampertite', 'Tyranitarite', 'Venusaurite',
			'Yawn',
		],
		side: {
			chooseMove(moveText, targetLoc, megaOrZ) {
				this.choice.mega = false;
				return this.constructor.prototype.chooseMove.call(this, moveText, targetLoc, megaOrZ);
			},
		},
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 8] Mix and Mega Anything Goes",
		inherit: ['[Gen 8] Mix and Mega'],

		ruleset: ['Obtainable', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview', 'Overflow Stat Mod'],
		banlist: [],
		restricted: ['Ultranecrozium Z'],
		unbanlist: [
			'Abomasnow-Mega', 'Absol-Mega', 'Aerodactyl-Mega', 'Aggron-Mega', 'Alakazam-Mega', 'Altaria-Mega',
			'Audino-Mega', 'Blastoise-Mega', 'Blaziken-Mega', 'Charizard-Mega-X', 'Charizard-Mega-Y',
			'Diancie-Mega', 'Gallade-Mega', 'Garchomp-Mega', 'Gardevoir-Mega', 'Gengar-Mega', 'Glalie-Mega', 'Gyarados-Mega', 'Heracross-Mega',
			'Kangaskhan-Mega', 'Latias-Mega', 'Latios-Mega', 'Lopunny-Mega', 'Lucario-Mega', 'Manectric-Mega', 'Metagross-Mega', 'Mawile-Mega',
			'Mewtwo-Mega-X', 'Mewtwo-Mega-Y', 'Pinsir-Mega', 'Sableye-Mega', 'Salamence-Mega', 'Sceptile-Mega', 'Scizor-Mega',
			'Sharpedo-Mega', 'Slowbro-Mega', 'Steelix-Mega', 'Swampert-Mega', 'Tyranitar-Mega', 'Venusaur-Mega',
			'Abomasite', 'Absolite', 'Aerodactylite', 'Aggronite', 'Alakazite', 'Altarianite', 'Ampharosite',
			'Audinite', 'Banettite', 'Beedrillite', 'Blastoisinite', 'Blazikenite', 'Cameruptite', 'Charizardite X', 'Charizardite Y',
			'Diancite', 'Galladite', 'Garchompite', 'Gardevoirite', 'Gengarite', 'Glalitite', 'Gyaradosite', 'Heracronite',
			'Houndoominite', 'Kangaskhanite', 'Latiasite', 'Latiosite', 'Lopunnite', 'Lucarionite', 'Manectite', 'Metagrossite', 'Mawilite',
			'Medichamite', 'Mewtwonite X', 'Mewtwonite Y', 'Pidgeotite', 'Pinsirite', 'Sablenite', 'Salamencite', 'Sceptilite', 'Scizorite',
			'Sharpedonite', 'Slowbronite', 'Steelixite', 'Swampertite', 'Tyranitarite', 'Venusaurite',
		],
		onValidateTeam() {},
	},
	{
		name: "[Gen 8] Mix and Mega CAP",
		inherit: ['[Gen 8] Mix and Mega'],

		ruleset: ['[Gen 8] Mix and Mega'],
		banlist: [],
		restricted: ['Blacephalon', 'Cawmodore'],
		unbanlist: ['CAP'],
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 8] Mix and Mega Hackmons Cup",
		inherit: ['[Gen 8] Mix and Mega'],
		desc: "Mega Stones can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",

		team: 'randomHC',
		ruleset: ['Obtainable Formes', 'HP Percentage Mod', 'Cancel Mod', 'Overflow Stat Mod'],
		banlist: ['Nonexistent'],
		restricted: [],
		unbanlist: [],
	},
	{
		name: "[Gen 8] Mix and Mega Inverse Battle",
		inherit: ['[Gen 8] Mix and Mega'],
		desc: "The effectiveness of each attack is inverted. Mega Stones can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",

		ruleset: ['[Gen 8] Mix and Mega', 'Inverse Mod'],
		banlist: [],
		restricted: [],
		unbanlist: [],
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 8] Mix and Mega NFE",
		inherit: ['[Gen 8] Mix and Mega'],

		ruleset: ['[Gen 8] Mix and Mega', 'Not Fully Evolved'],
		banlist: ['Chansey', 'Golbat', 'Arena Trap'],
		restricted: ['Dragonair', 'Doublade', 'Electabuzz', 'Haunter', 'Magmar', 'Magneton', 'Mr. Mime-Galar', 'Pawniard', 'Pikachu', 'Piloswine', 'Porygon-2', 'Rhydon', 'Scyther', 'Sneasel', 'Type: Null'],
		unbanlist: [],
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 8] Mix and Mega Ubers",
		inherit: ['[Gen 8] Mix and Mega'],

		ruleset: ['[Gen 8] Mix and Mega'],
		banlist: [],
		restricted: ['Calyrex-Shadow', 'Kyogre', 'Necrozma-Dusk-Mane', 'Zacian'],
		unbanlist: ['Uber', 'Gengar', 'Melmetal', 'Pheromosa', 'Regigigas', 'Urshifu'],
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 8] Mix and Mega UU",
		inherit: ["[Gen 8] Mix and Mega"],

		ruleset: ['[Gen 8] Mix and Mega'],
		banlist: [
			'Arcanine', 'Blissey', 'Corviknight', 'Dragapult', 'Dragonite', 'Entei', 'Genesect', 'Heatran',
			'Hippowdon', 'Ho-Oh', 'Hydreigon', 'Jirachi', 'Kartana', 'Kyurem', 'Landorus-Therian', 'Lunala', 'Magearna',
			'Mew', 'Milotic', 'Regieleki', 'Rhyperior', 'Slowbro', 'Solgaleo', 'Swampert', 'Tapu Koko', 'Tapu Lele', 'Toxapex',
			'Toxtricity', 'Urshifu-Rapid-Strike', 'Vaporeon', 'Volcanion', 'Weavile', 'Xerneas', 'Zeraora', 'Zygarde-Base',
		],
		restricted: [],
		unbanlist: [],
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 8] Monotype Mix and Mega",
		inherit: ['[Gen 8] Mix and Mega'],
		desc: "Mega Stones can be used on any Pok&eacute;mon with no Mega Evolution limit. All the Pok&eacute;mon on a team must share a type.",

		ruleset: ['[Gen 8] Mix and Mega'],
		banlist: ['Damp Rock', 'Smooth Rock', 'Terrain Extender'],
		unbanlist: [],
		restricted: [],
		onValidateTeam(team) {
			let typeTable: string[] | null = null;
			for (const set of team) {
				const template = this.dex.species.get(set.species);
				let types = template.types;
				if (!types) return ["Your team must share a type."];
				const item = this.dex.items.get(set.item);
				if (item.megaStone) {
					const megaTemplate = this.dex.species.get(item.megaStone);
					if (megaTemplate.types[1] !== this.dex.species.get(item.megaEvolves).types[1] && types[1] !== (megaTemplate.types[1] || megaTemplate.types[0])) types = [types[0]];
				}
				if (!typeTable) {
					typeTable = types;
				} else {
					typeTable = typeTable.filter(type => types.includes(type));
				}
				if (!typeTable.length) return ["Your team must share a type."];
			}
		},
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 8] National Dex Mix and Mega",
		inherit: ['[Gen 8] Mix and Mega'],

		ruleset: ['Standard NatDex', 'Dynamax Clause', 'Moody Clause', 'Overflow Stat Mod'],
		banlist: ['Shadow Tag', 'Baton Pass'],
		unbanlist: ['Deoxys-Defense'],
		restricted: ['Arceus', 'Deoxys', 'Slaking', 'Beedrillite', 'Blazikenite', 'Gengarite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite'],
	},
	{
		name: "[Gen 8] National Dex Mix and Mega Draft",
		inherit: ['[Gen 8] Mix and Mega Draft'],

		ruleset: ['Draft', '+Past', 'Overflow Stat Mod', 'Dynamax Clause'],
	},
	{
		name: "[Gen 8] Revelationmons Mix and Mega",
		inherit: ['[Gen 8] Revelationmons', '[Gen 8] Mix and Mega'],
		desc: "Each Pok&eacute;mon's first move is changed to its type. If it has a secondary type, then its second move is changed to that type. Mega Stones can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3692297/">Revelationmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656469/">Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3659028/">M&amp;M Resources</a>`,
		],

		ruleset: ['[Gen 8] Mix and Mega'],
		banlist: [],
		unbanlist: ['Eternatus-Base', 'Urshifu-Rapid-Strike', 'Zygarde'],
		restricted: ['Regieleki', 'Bolt Beak', 'Fishious Rend', 'U-Turn', 'Volt Switch'],
		onValidateSet(set) {
			const problems = [];
			for (const [index, moveid] of set.moves.slice(0, 2).entries()) {
				const move = this.dex.moves.get(moveid);
				if (this.ruleTable.isRestricted(`move:${move.id}`)) problems.push(`${set.name || set.species}'s move ${move.name} can't be in moveslot ${index + 1} because it's restricted.`);
			}
			return problems;
		},
		onModifyTypePriority: -2,
		onModifyType(move, pokemon) {
			if (['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball'].includes(move.id)) return;
			const index = pokemon.moves.indexOf(move.id);
			move.type = pokemon.getTypes()[index] || move.type;
		},
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 8] Revelationmons Monotype Mix and Mega",
		inherit: ['[Gen 8] Revelationmons Mix and Mega'],
		desc: "Each Pok&eacute;mon's first move is changed to its type. If it has a secondary type, then its second move is changed to that type. Mega Stones can be used on almost any Pok&eacute;mon with no Mega Evolution limit. All the Poke&eacute;mon on a team must share a type.",

		ruleset: ['[Gen 8] Revelationmons Mix and Mega'],
		banlist: ['Damp Rock', 'Smooth Rock', 'Terrain Extender'],
		unbanlist: [],
		restricted: [],
		onValidateTeam(team) {
			let typeTable: string[] | null = null;
			for (const set of team) {
				const template = this.dex.species.get(set.species);
				let types = template.types;
				if (!types) return ["Your team must share a type."];
				const item = this.dex.items.get(set.item);
				if (item.megaStone) {
					const megaTemplate = this.dex.species.get(item.megaStone);
					if (megaTemplate.types[1] !== this.dex.species.get(item.megaEvolves).types[1] && types[1] !== (megaTemplate.types[1] || megaTemplate.types[0])) types = [types[0]];
				}
				if (!typeTable) {
					typeTable = types;
				} else {
					typeTable = typeTable.filter(type => types.includes(type));
				}
				if (!typeTable.length) return ["Your team must share a type."];
			}
		},
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 8] Sketchmons Mix and Mega",
		inherit: ['[Gen 8] Mix and Mega', '[Gen 8] Sketchmons'],
		desc: "Each Pok&eacute;mon can learn Sketch once. Mega Stones can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587743/">Sketchmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656469/">Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3659028/">M&amp;M Resources</a>`,
		],

		ruleset: ['[Gen 8] Mix and Mega'],
		banlist: ['Shedinja', 'Sand Rush', "King's Rock"],
		restricted: ['Solgaleo', 'Acupressure', 'Astral Barrage', 'Belly Drum', 'Bolt Beak', 'Boomburst', 'Clangorous Soul', 'Double Iron Bash', 'Electrify', 'Extreme Speed', 'Fishious Rend', 'Geomancy', 'Glacial Lance', 'Lovely Kiss', 'No Retreat', 'Octolock', 'Quiver Dance', 'Secret Sword', 'Shell Smash', 'Shift Gear', 'Sleep Powder', 'Spore', 'Thousand Arrows', 'Transform', 'V-Create', 'Wicked Blow'],
		unbanlist: ['Landorus', 'Zygarde-Base'],
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 8] STABmons Mix and Mega",
		inherit: ['[Gen 8] STABmons', '[Gen 8] Mix and Mega'],
		desc: "Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn. Mega Stones and Primal Orbs can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",

		ruleset: ['[Gen 8] Mix and Mega', '[Gen 8] STABmons Ubers'],
		banlist: ["King's Rock"],
		unbanlist: ['Eternatus-Base', 'Landorus', 'Pheromosa', 'Urshifu-Rapid-Strike'],
		restricted: ['Dragapult', 'Dragonite', 'Keldeo', 'Landorus-Therian', 'Terrakion', 'Thundurus', 'Zeraora', 'Astral Barrage', 'Bolt Beak', 'Boomburst', 'Clangorous Soul', 'Double Iron Bash', 'Fishious Rend', 'Glacial Lance', 'Lovely Kiss', 'No Retreat', 'Precipice Blades', 'Sleep Powder', 'Transform', 'V-Create', 'Wicked Blow'],
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 8] Tier Shift Mix and Mega",
		inherit: ['[Gen 8] Mix and Mega'],
		desc: "Pok&eacute;mon below OU get all their stats boosted. UU/RBL get +10, RU/NUBL get +20, NU/PUBL get +30, and PU or lower get +40. Mega Stones and Primal Orbs can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",

		ruleset: ['[Gen 8] Mix and Mega', '[Gen 8] Tier Shift'],
		banlist: ['Icy Rock'],
		restricted: ['Archeops'],
		unbanlist: [],
		onModifySpecies(template, target, format, effect) {
			if (template.isMega) return;
			let newTemplate = this.dex.deepClone(template);
			if (effect && effect.effectType === 'Item') {
				const megaSpecies = effect.megaStone;
				if (megaSpecies && megaSpecies !== template.name) {
					newTemplate = this.getMixedSpecies(template, megaSpecies);
				}
			}
			if (!effect || !['imposter', 'transform'].includes(effect.id)) {
				const boosts: {[k: string]: number} = {
					'UU': 10,
					'RUBL': 10,
					'RU': 20,
					'NUBL': 20,
					'NU': 30,
					'PUBL': 30,
					'PU': 40,
					'NFE': 40,
					'LC Uber': 40,
					'LC': 40,
				};
				if (newTemplate.tier[0] === '(') newTemplate.tier = newTemplate.tier.slice(1, -1);
				if (newTemplate.tier in boosts) {
					if (target.set.moves.includes('lightclay') && boosts[newTemplate.tier] > 10) newTemplate.tier = 'RUBL';
					if (target.set.moves.includes('auroraveil') && boosts[newTemplate.tier] > 10) newTemplate.tier = 'NUBL';
					if (['Drizzle', 'Drought', 'Snow Warning'].includes(target.set.ability) && boosts[newTemplate.tier] > 20) newTemplate.tier = 'NUBL';

					const boost = boosts[newTemplate.tier];
					for (const statName of ['atk', 'def', 'spa', 'spd', 'spe']) {
						newTemplate.baseStats[statName] = this.clampIntRange(newTemplate.baseStats[statName] + boost, 1, 255);
					}
					newTemplate.bst = newTemplate.baseStats.hp + newTemplate.baseStats.atk + newTemplate.baseStats.def + newTemplate.baseStats.spa + newTemplate.baseStats.spd + newTemplate.baseStats.spe;
				}
			}
			return newTemplate;
		},
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 8] Ultra Mix and Mega LC",
		desc: "Ultra Mix and Mega LC is a combination of Mix and Mega, STABmons, Tier Shift and VoltTurn Mayhem. Any LC and CAP LC Pok&eacute;mon can be used without restriction.",
		threads: [],
		inherit: ['[Gen 8] Mix and Mega'],

		ruleset: ['[Gen 8] Mix and Mega', '[Gen 8] STABmons', '[Gen 8] VoltTurn Mayhem', 'Little Cup', '!Species Clause'],
		banlist: [],
		restricted: [],
		unbanlist: ['CAP'],
		onModifySpecies(template, target, format, effect) {
			if (template.isMega) return;
			let newTemplate = this.dex.deepClone(template);
			if (effect && effect.effectType === 'Item') {
				const megaSpecies = effect.megaStone;
				if (megaSpecies && megaSpecies !== template.name) {
					newTemplate = this.getMixedSpecies(template, megaSpecies);
				}
			}
			if (!effect || !['imposter', 'transform'].includes(effect.id)) {
				for (const statName of ['atk', 'def', 'spa', 'spd', 'spe']) {
					newTemplate.baseStats[statName] = this.clampIntRange(newTemplate.baseStats[statName] + 40, 1, 255);
				}
				newTemplate.bst = newTemplate.baseStats.hp + newTemplate.baseStats.atk + newTemplate.baseStats.def + newTemplate.baseStats.spa + newTemplate.baseStats.spd + newTemplate.baseStats.spe;
			}
			return newTemplate;
		},
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 8] VoltTurn Mayhem Mix and Mega",
		desc: "All targeted moves force you to switch. Mega Stones can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",
		inherit: ["[Gen 8] VoltTurn Mayhem", "[Gen 8] Mix and Mega"],

		ruleset: ['[Gen 8] Mix and Mega'],
		banlist: ['Giga Impact', 'Hyper Beam', 'Fake Out > 1', 'Gengarite'],
		restricted: [],
		unbanlist: ['Gengar', 'Shadow Tag', 'Blazikenite'],
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 7] 1v1 Mix and Mega",
		inherit: ["[Gen 7] Mix and Mega"],
		desc: "Bring three Pok&eacute;mon to Team Preview and choose one to battle. Mega Stones can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",

		ruleset: ['[Gen 7] Mix and Mega', 'Picked Team Size = 1', 'Max Team Size = 3'],
		banlist: [],
		restricted: [],
		unbanlist: [],
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 7] BH Mix and Mega",
		desc: "Mega Stones and Primal Orbs can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",

		mod: 'gen7mixandmegabh',
		ruleset: ['[Gen 7] Balanced Hackmons', 'Overflow Stat Mod'],
		banlist: ['Electrify'],
		unbanlist: ['Groudon-Primal'],
		restricted: ['Beedrillite', 'Gengarite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Ultranecrozium Z'],
		onValidateTeam(team) {
			const itemTable: {[k: string]: number} = {};
			for (const set of team) {
				const item = this.dex.items.get(set.item);
				if (!itemTable[item.id]) itemTable[item.id] = 0;
				if (++itemTable[item.id] < 2) continue;
				if (item.megaStone) return ["You are limited to one of each Mega Stone.", "(You have more than one " + item.name + ".)"];
				if (item.id === 'blueorb' || item.id === 'redorb') return ["You are limited to one of each Primal Orb.", "(You have more than one " + item.name + ".)"];
			}
		},
		onValidateSet(set) {
			const template = this.dex.species.get(set.species || set.name);
			const item = this.dex.items.get(set.item);
			if (!item.megaEvolves && item.id !== 'blueorb' && item.id !== 'redorb' && item.id !== 'ultranecroziumz') return;
			if (template.baseSpecies === item.megaEvolves || (template.baseSpecies === 'Groudon' && item.id === 'redorb') || (template.baseSpecies === 'Kyogre' && item.id === 'blueorb') || (template.baseSpecies === 'Necrozma' && item.id === 'ultranecroziumz')) return;
			switch (item.id) {
			case 'beedrillite': case 'gengarite': case 'kangaskhanite':
				return [item.name + " is only allowed to be held by " + item.megaEvolves + "."];
			case 'mawilite': case 'medichamite':
				if (set.ability === 'Huge Power' || set.ability === 'Pure Power') break;
				if (template.name === "Mawile" || template.name === "Medicham") break;
				return ["You are only allowed to hold " + item.name + " if your Ability is Huge Power or Pure Power."];
			case 'ultranecroziumz':
				return ["Ultranecrozium Z is only allowed to be held by Necrozma-Dawn-Wings or Necrozma-Dusk-Mane."];
			}
		},
		onModifySpecies(template, target, format, effect) {
			if (!effect || ['imposter', 'transform'].includes(effect.id)) return;
			const megaSpecies = (effect as Item).megaStone || ({dragonascent: 'Rayquaza-Mega', redorb: 'Groudon-Primal', blueorb: 'Kyogre-Primal'} as {[k: string]: string})[effect.id];
			if (!megaSpecies || megaSpecies === template.name) return;
			template = this.getMixedSpecies(template, megaSpecies);
			return template;
		},
		onBegin() {
			const allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (const pokemon of allPokemon) {
				pokemon.m.originalSpecies = pokemon.baseSpecies.name;
			}
		},
		onSwitchIn(pokemon) {
			const oMegaTemplate = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				// Place volatiles on the Pokémon to show its mega-evolved condition and details
				this.add('-start', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
				const oTemplate = this.dex.species.get(pokemon.m.originalSpecies);
				if (oTemplate.types.length !== pokemon.species.types.length || oTemplate.types[1] !== pokemon.species.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut(pokemon) {
			const oMegaTemplate = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				this.add('-end', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			}
		},
	},
	{
		name: "[Gen 7] Camomons Mix and Mega",
		inherit: ["[Gen 7] Mix and Mega"],
		desc: "Pok&eacute;mon change type to match their first two moves. Mega Stones and Primal Orbs can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3598418/">Camomons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587740/">Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3591580/">Mix and Mega Resources</a>`,
		],

		mod: 'gen7mixandmegacamomons',
		ruleset: ['[Gen 7] Mix and Mega'],
		banlist: [],
		restricted: [],
		unbanlist: [],
		onModifySpecies(template, target, format, effect) {
			let newTemplate = this.dex.deepClone(template);
			const megaSpecies = effect?.effectType === 'Item' && (effect.megaStone || ({dragonascent: 'Rayquaza-Mega', redorb: 'Groudon-Primal', blueorb: 'Kyogre-Primal'} as {[k: string]: string})[effect.id]);
			if (megaSpecies && megaSpecies !== template.name) {
				newTemplate = this.getMixedSpecies(template, megaSpecies);
			}
			if (!effect || !['imposter', 'transform'].includes(effect.id)) {
				newTemplate.types = [...new Set(target.set.moves.slice(0, 2).map(move => this.dex.moves.get(move).type))];
			}
			return newTemplate;
		},
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 7] Godly Gift Mix and Mega",
		inherit: ["[Gen 7] Mix and Mega"],
		desc: "Each Pok&eacute;mon receives one base stat from your God depending on its position in your team. Mega Stones can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3597618/">Godly Gift</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587740/">Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3591580/">Mix and Mega Resources</a>`,
		],

		ruleset: ['[Gen 7] Mix and Mega', '[Gen 7] Godly Gift'],
		banlist: [],
		restricted: [],
		unbanlist: [],
		onModifySpecies(template, target, format, effect) {
			let newTemplate = this.dex.deepClone(template);
			if (effect && effect.effectType === 'Item') {
				const megaSpecies = (effect as Item).megaStone || ({dragonascent: 'Rayquaza-Mega', redorb: 'Groudon-Primal', blueorb: 'Kyogre-Primal'} as {[k: string]: string})[effect.id];
				if (megaSpecies && megaSpecies !== template.name) {
					newTemplate = this.getMixedSpecies(template, megaSpecies);
				}
			}
			if (!effect || !['imposter', 'transform'].includes(effect.id)) {
				const uber = target.side.team.find(set => this.dex.species.get(set.species).tier === 'Uber') || target.side.team[0];
				const stat = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'][target.side.team.indexOf(target.set)] as StatID;
				newTemplate.bst -= newTemplate.baseStats[stat];
				newTemplate.baseStats[stat] = this.dex.species.get(uber.species).baseStats[stat];
				newTemplate.bst += newTemplate.baseStats[stat];
			}
			return newTemplate;
		},
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 7] Hidden Type Mix and Mega",
		inherit: ["[Gen 7] Mix and Mega"],
		desc: "Pok&eacute;mon have an added type determined by their IVs. Same as the Hidden Power type. Mega Stones can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",
		threads: [
			`&bullet; <a href="http://www.smogon.com/forums/threads/3591194/">Hidden Type</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587740/">Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3591580/">Mix and Mega Resources</a>`,
		],

		ruleset: ['[Gen 7] Mix and Mega'],
		banlist: [],
		unbanlist: [],
		restricted: [],
		onModifySpecies(template, pokemon, format, effect) {
			let newTemplate = this.dex.deepClone(template);
			const megaSpecies = effect?.effectType === 'Item' && (effect.megaStone || ({dragonascent: 'Rayquaza-Mega', redorb: 'Groudon-Primal', blueorb: 'Kyogre-Primal'} as {[k: string]: string})[effect.id]);
			if (megaSpecies && megaSpecies !== template.name) {
				newTemplate = this.getMixedSpecies(template, megaSpecies);
			}
			if (effect && ['imposter', 'transform'].includes(effect.id)) return newTemplate;
			if (!newTemplate.types.includes(pokemon.hpType)) newTemplate.addedType = pokemon.hpType;
			return newTemplate;
		},
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 7] Mix and Mega Draft",
		inherit: ['[Gen 7] Mix and Mega'],

		ruleset: ['Draft', 'Overflow Stat Mod'],
		banlist: [],
		restricted: [],
	},
	{
		name: "[Gen 7] Mix and Mega Anything Goes",

		mod: 'gen7mixandmega',
		ruleset: ['Obtainable', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview', 'Overflow Stat Mod'],
		restricted: ['Ultranecrozium Z'],
		onValidateSet(set) {
			const template = this.dex.species.get(set.species || set.name);
			const item = this.dex.items.get(set.item);
			if (!item.megaEvolves && item.id !== 'blueorb' && item.id !== 'redorb' && item.id !== 'ultranecroziumz') return;
			if (template.baseSpecies === item.megaEvolves || (template.baseSpecies === 'Groudon' && item.id === 'redorb') || (template.baseSpecies === 'Kyogre' && item.id === 'blueorb') || (template.baseSpecies === 'Necrozma' && item.id === 'ultranecroziumz') && template.name !== 'Necrozma') return;
			if (this.ruleTable.isRestrictedSpecies(template)) return [template.name + " is not allowed to hold a Mega Stone."];
			switch (item.id) {
			case 'ultranecroziumz':
				return ["Ultranecrozium Z is only allowed to be held by Necrozma-Dawn-Wings or Necrozma-Dusk-Mane."];
			}
		},
		onModifySpecies(template, target, format, effect) {
			if (!effect || ['imposter', 'transform'].includes(effect.id)) return;
			const megaSpecies = (effect as Item).megaStone || ({dragonascent: 'Rayquaza-Mega', redorb: 'Groudon-Primal', blueorb: 'Kyogre-Primal'} as {[k: string]: string})[effect.id];
			if (!megaSpecies || megaSpecies === template.name) return;
			template = this.getMixedSpecies(template, megaSpecies);
			return template;
		},
		onBegin() {
			const allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (const pokemon of allPokemon) {
				pokemon.m.originalSpecies = pokemon.baseSpecies.name;
			}
		},
		onSwitchIn(pokemon) {
			const oMegaTemplate = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				// Place volatiles on the Pokémon to show its mega-evolved condition and details
				this.add('-start', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
				const oTemplate = this.dex.species.get(pokemon.m.originalSpecies);
				if (oTemplate.types.length !== pokemon.species.types.length || oTemplate.types[1] !== pokemon.species.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut(pokemon) {
			const oMegaTemplate = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				this.add('-end', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			}
		},
	},
	{
		name: "[Gen 7] Mix and Mega CAP",
		inherit: ['[Gen 7] Mix and Mega'],

		mod: 'gen7mixandmegacap',
		unbanlist: ['CAP'],
	},
	{
		name: "[Gen 7] Mix and Mega LC",
		desc: "Mega Stones and Primal Orbs can be used with no Mega Evolution limit.",

		mod: 'gen7mixandmega',
		ruleset: ['Standard', 'Swagger Clause', 'Little Cup'],
		banlist: ['Baton Pass', 'Dragon Rage', 'Sonic Boom', 'Beedrillite', 'Blazikenite', 'Eevium Z', 'Gengarite', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Ultranecrozium Z'],
		restricted: ['Archen', 'Carvanha', 'Dratini', 'Gligar', 'Murkrow', 'Scyther', 'Sneasel'],
		onValidateTeam(team) {
			const itemTable: {[k: string]: number} = {};
			for (const set of team) {
				const item = this.dex.items.get(set.item);
				if (!itemTable[item.id]) itemTable[item.id] = 0;
				if (++itemTable[item.id] < 2) continue;
				if (item.megaStone) return ["You are limited to one of each Mega Stone.", "(You have more than one " + item.name + ".)"];
				if (item.id === 'blueorb' || item.id === 'redorb') return ["You are limited to one of each Primal Orb.", "(You have more than one " + item.name + ".)"];
			}
		},
		onValidateSet(set) {
			const template = this.dex.species.get(set.species || set.name);
			const item = this.dex.items.get(set.item);
			if (!item.megaStone && !item.onPrimal) return;
			if (item.itemUser!.includes(template.baseSpecies)) return;
			if (this.ruleTable.isRestrictedSpecies(template)) return [template.name + " is not allowed to hold a Mega Stone."];
			if (!this.ruleTable.isRestricted('item:' + item.id)) return;
			switch (item.id) {
			case 'beedrillite':
				if (set.ability === 'Adaptability') break;
				return ["You are only allowed to hold Blazikenite if your Ability is Adaptability."];
			case 'blazikenite':
				if (set.ability === 'Speed Boost') break;
				return ["You are only allowed to hold Blazikenite if your Ability is Speed Boost."];
			case 'mawilite': case 'medichamite':
				if (set.ability === 'Huge Power' || set.ability === 'Pure Power') break;
				return ["You are only allowed to hold " + item.name + " if your Ability is Huge Power or Pure Power."];
			case 'blueorb':
			case 'redorb':
				return [item.name + " is only allowed to be held by " + item.itemUser![0]];
			default:
				const ability = this.dex.species.get(item.megaStone).abilities[0];
				if (set.ability === ability) return;
				return ["You are only allowed to hold " + item.name + " if your Ability is " + ability + "."];
			}
		},
		onModifySpecies(template, target, format, effect) {
			if (!effect || ['imposter', 'transform'].includes(effect.id)) return;
			const megaSpecies = (effect as Item).megaStone || ({dragonascent: 'Rayquaza-Mega', redorb: 'Groudon-Primal', blueorb: 'Kyogre-Primal'} as {[k: string]: string})[effect.id];
			if (!megaSpecies || megaSpecies === template.name) return;
			template = this.getMixedSpecies(template, megaSpecies);
			return template;
		},
		onBegin() {
			const allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (const pokemon of allPokemon) {
				pokemon.m.originalSpecies = pokemon.baseSpecies.name;
			}
		},
		onSwitchIn(pokemon) {
			const oMegaTemplate = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				// Place volatiles on the Pokémon to show its mega-evolved condition and details
				this.add('-start', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
				const oTemplate = this.dex.species.get(pokemon.m.originalSpecies);
				if (oTemplate.types.length !== pokemon.species.types.length || oTemplate.types[1] !== pokemon.species.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut(pokemon) {
			const oMegaTemplate = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				this.add('-end', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			}
		},
	},
	{
		name: "[Gen 7] Mix and Mega Inverse Battle",
		inherit: ['[Gen 7] Mix and Mega'],
		desc: "The effectiveness of each attack is inverted. Mega Stones can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",

		ruleset: ['[Gen 7] Mix and Mega', 'Inverse Mod'],
		banlist: [],
		restricted: [],
		unbanlist: [],
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 7] Mix and Mega NFE",
		desc: "Mega Stones and Primal Orbs can be used with no Mega Evolution limit.",

		mod: 'gen7mixandmega',
		ruleset: ['Standard', 'Not Fully Evolved'],
		banlist: ['Aurora Veil', 'Ultranecrozium Z'],
		restricted: ['Chansey', 'Doublade', 'Gligar', 'Golbat', 'Gurdurr', 'Magneton', 'Piloswine', 'Porygon2', 'Rhydon', 'Scyther', 'Sneasel', 'Type: Null', 'Beedrillite', 'Blazikenite', 'Gengarite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite'],
		onValidateTeam(team) {
			const itemTable: {[k: string]: number} = {};
			for (const set of team) {
				const item = this.dex.items.get(set.item);
				if (!itemTable[item.id]) itemTable[item.id] = 0;
				if (++itemTable[item.id] < 2) continue;
				if (item.megaStone) return ["You are limited to one of each Mega Stone.", "(You have more than one " + item.name + ".)"];
				if (item.id === 'blueorb' || item.id === 'redorb') return ["You are limited to one of each Primal Orb.", "(You have more than one " + item.name + ".)"];
			}
		},
		onValidateSet(set) {
			const template = this.dex.species.get(set.species || set.name);
			const item = this.dex.items.get(set.item);
			if (!item.megaStone && !item.onPrimal) return;
			if (item.itemUser!.includes(template.baseSpecies)) return;
			if (this.ruleTable.isRestrictedSpecies(template)) return [template.name + " is not allowed to hold a Mega Stone."];
			if (!this.ruleTable.isRestricted('item:' + item.id)) return;
			switch (item.id) {
			case 'mawilite': case 'medichamite':
				if (set.ability === 'Huge Power' || set.ability === 'Pure Power') break;
				return ["You are only allowed to hold " + item.name + " if your Ability is Huge Power or Pure Power."];
			case 'blueorb':
			case 'redorb':
				return [item.name + " is only allowed to be held by " + item.itemUser![0]];
			default:
				const ability = this.dex.species.get(item.megaStone).abilities[0];
				if (set.ability === ability) return;
				return ["You are only allowed to hold " + item.name + " if your Ability is " + ability + "."];
			}
		},
		onModifySpecies(template, target, format, effect) {
			if (!effect || ['imposter', 'transform'].includes(effect.id)) return;
			const megaSpecies = (effect as Item).megaStone || ({dragonascent: 'Rayquaza-Mega', redorb: 'Groudon-Primal', blueorb: 'Kyogre-Primal'} as {[k: string]: string})[effect.id];
			if (!megaSpecies || megaSpecies === template.name) return;
			template = this.getMixedSpecies(template, megaSpecies);
			return template;
		},
		onBegin() {
			const allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (const pokemon of allPokemon) {
				pokemon.m.originalSpecies = pokemon.baseSpecies.name;
			}
		},
		onSwitchIn(pokemon) {
			const oMegaTemplate = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				// Place volatiles on the Pokémon to show its mega-evolved condition and details
				this.add('-start', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
				const oTemplate = this.dex.species.get(pokemon.m.originalSpecies);
				if (oTemplate.types.length !== pokemon.species.types.length || oTemplate.types[1] !== pokemon.species.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut(pokemon) {
			const oMegaTemplate = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				this.add('-end', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			}
		},
	},
	{
		name: "[Gen 7] Mix and Mega Ubers",

		mod: 'gen7mixandmega',
		ruleset: ['[Gen 7] Ubers', 'Overflow Stat Mod'],
		banlist: ['Electrify', 'Shadow Tag'],
		restricted: ['Beedrillite', 'Blazikenite', 'Gengarite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Ultranecrozium Z'],
		onValidateTeam(team) {
			const itemTable: {[k: string]: number} = {};
			for (const set of team) {
				const item = this.toID(set.item);
				if (!itemTable[item]) itemTable[item] = 0;
				if (++itemTable[item] < 2) continue;
				if (this.dex.items.get(item).megaStone) return ["You are limited to one of each Mega Stone.", "(You have more than one " + this.dex.items.get(item).name + ".)"];
				if (item === 'blueorb' || item === 'redorb') return ["You are limited to one of each Primal Orb.", "(You have more than one " + this.dex.items.get(item).name + ".)"];
			}
		},
		onValidateSet(set) {
			const template = this.dex.species.get(set.species || set.name);
			const item = this.dex.items.get(set.item);
			if (!item.megaEvolves && item.id !== 'blueorb' && item.id !== 'redorb' && item.id !== 'ultranecroziumz') return;
			if (item.itemUser!.includes(template.baseSpecies) || item.id === 'ultranecroziumz' && template.baseSpecies === 'Necrozma' && template.name !== 'Necrozma') return;
			if (this.ruleTable.isRestrictedSpecies(template)) return [template.name + " is not allowed to hold a Mega Stone."];
			if (!this.ruleTable.isRestricted('item:' + item.id)) return;
			switch (item.id) {
			case 'blazikenite':
				if (set.ability === 'Speed Boost') break;
				return ["You are only allowed to hold Blazikenite if your Ability is Speed Boost."];
			case 'mawilite': case 'medichamite':
				if (set.ability === 'Huge Power' || set.ability === 'Pure Power') break;
				if (template.name === "Mawile" || template.name === "Medicham") break;
				return ["You are only allowed to hold " + item.name + " if your Ability is Huge Power or Pure Power."];
			case 'ultranecroziumz':
				return ["Ultranecrozium Z is only allowed to be held by Necrozma-Dawn-Wings or Necrozma-Dusk-Mane."];
			case 'blueorb':
			case 'redorb':
				return [item.name + " is only allowed to be held by " + item.itemUser![0]];
			default:
				const ability = this.dex.species.get(item.megaStone).abilities[0];
				if (set.ability === ability) return;
				return ["You are only allowed to hold " + item.name + " if your Ability is " + ability + "."];
			}
		},
		onModifySpecies(template, target, format, effect) {
			if (!effect || ['imposter', 'transform'].includes(effect.id)) return;
			const megaSpecies = (effect as Item).megaStone || ({dragonascent: 'Rayquaza-Mega', redorb: 'Groudon-Primal', blueorb: 'Kyogre-Primal'} as {[k: string]: string})[effect.id];
			if (!megaSpecies || megaSpecies === template.name) return;
			template = this.getMixedSpecies(template, megaSpecies);
			return template;
		},
		onBegin() {
			const allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (const pokemon of allPokemon) {
				pokemon.m.originalSpecies = pokemon.baseSpecies.name;
			}
		},
		onSwitchIn(pokemon) {
			const oMegaTemplate = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				// Place volatiles on the Pokémon to show its mega-evolved condition and details
				this.add('-start', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
				const oTemplate = this.dex.species.get(pokemon.m.originalSpecies);
				if (oTemplate.types.length !== pokemon.species.types.length || oTemplate.types[1] !== pokemon.species.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut(pokemon) {
			const oMegaTemplate = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				this.add('-end', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			}
		},
	},
	{
		name: "[Gen 7] Mix and Mega UU",
		inherit: ["[Gen 7] Mix and Mega"],
		desc: "Mega Stones and Primal Orbs can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3612051/">UU OMs Mega Thread</a>`,
		],

		banlist: [
			'Arceus', 'Blissey', 'Breloom', 'Buzzwole', 'Celesteela', 'Darkrai', 'Deoxys-Defense',
			'Entei', 'Excadrill', 'Genesect', 'Golisopod', 'Groudon-Primal',
			'Kartana', 'Keldeo', 'Kyogre', 'Lucario', 'Lunala', 'Magearna', 'Mamoswine', 'Manaphy', 'Mandibuzz', 'Metagross', 'Mew',
			'Milotic', 'Nihilego', 'Noivern', 'Skarmory',
			'Tapu Lele', 'Terrakion', 'Toxapex', 'Victini', 'Xerneas', 'Zapdos', 'Zeraora', 'Zygarde-Base',
			'Electrify', 'Shadow Tag',
		],
	},
	{
		name: "[Gen 7] Monotype Mix and Mega",
		inherit: ['[Gen 7] Mix and Mega'],
		desc: "Mega Stones and Primal Orbs can be used on any Pok&eacute;mon with no Mega Evolution limit. All the Pok&eacute;mon on a team must share a type.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587740/">Mix and Mega</a>`,
		],

		ruleset: ['[Gen 7] Mix and Mega', 'Same Type Clause'],
		banlist: ['Smooth Rock', 'Terrain Extender'],
		restricted: [],
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 7] Reliablemons Mix and Mega",
		inherit: ['[Gen 7] Reliablemons', '[Gen 7] Mix and Mega'],
		desc: "Each Pok&eacute;mon's first move is changed to its type. If it has a secondary type, then its second move is changed to that type. Mega Stones can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587740/">Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3591580/">Mix and Mega Resources</a>`,
		],

		restricted: ['U-Turn', 'Volt Switch'],
		onValidateSet(set) {
			const problems = [];
			for (const [index, moveid] of set.moves.slice(0, 2).entries()) {
				const move = this.dex.moves.get(moveid);
				if (this.ruleTable.isRestricted(`move:${move.id}`)) problems.push(`${set.name || set.species}'s move ${move.name} can't be in moveslot ${index + 1} because it's restricted.`);
			}
			return problems;
		},
		onModifyTypePriority: -2,
		onModifyType(move, pokemon) {
			if (['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball'].includes(move.id)) return;
			const index = pokemon.moves.indexOf(move.id);
			move.type = pokemon.getTypes()[index] || move.type;
		},
	},
	{
		name: "[Gen 7] Sketchmons Mix and Mega",
		inherit: ['[Gen 7] Mix and Mega', '[Gen 7] Sketchmons'],
		desc: "Each Pok&eacute;mon can learn Sketch once. Mega Stones can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587743/">Sketchmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587740/">Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3591580/">Mix and Mega Resources</a>`,
		],

		mod: 'gen7mixandmega',
		ruleset: ['[Gen 7] Mix and Mega'],
		unbanlist: [],
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 7] STABmons Mix and Mega",
		inherit: ['[Gen 7] STABmons', '[Gen 7] Mix and Mega'],
		desc: "Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn. Mega Stones and Primal Orbs can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",

		mod: 'gen7mixandmegastabmons',
		ruleset: ['[Gen 7] Mix and Mega', '[Gen 7] STABmons Ubers'],
		banlist: [],
		unbanlist: [],
		restricted: ['Arceus', 'Boomburst', 'Extreme Speed', 'Tail Glow'],
		onValidateSet(set) {
			const template = this.dex.species.get(set.species || set.name);
			const item = this.dex.items.get(set.item);
			if (!item.megaStone && item.id !== 'blueorb' && item.id !== 'redorb') return;
			if (template.baseSpecies === item.megaEvolves || (template.baseSpecies === 'Groudon' && item.id === 'redorb') || (template.baseSpecies === 'Kyogre' && item.id === 'blueorb') || (template.baseSpecies === 'Necrozma' && item.id === 'ultranecroziumz')) return;
			if (template.tier.endsWith('Uber') || set.ability === 'Power Construct') {
				return [template.name + " is not allowed to hold a Mega Stone."];
			}
			switch (item.id) {
			case 'beedrillite': case 'gengarite': case 'kangaskhanite': case 'mawilite': case 'medichamite': case 'pidgeotite':
				return [item.name + " is only allowed to be held by " + item.megaEvolves + "."];
			case 'blazikenite':
				if (set.ability === 'Speed Boost') break;
				return ["You are only allowed to hold Blazikenite if your Ability is Speed Boost."];
			case 'ultranecroziumz':
				return ["Ultranecrozium Z is only allowed to be held by Necrozma-Dawn-Wings or Necrozma-Dusk-Mane."];
			}
		},
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 7] Tier Shift Mix and Mega",
		inherit: ['[Gen 7] Mix and Mega'],
		desc: "Pok&eacute;mon below OU get all their stats boosted. UU/RBL get +10, RU/NUBL get +20, NU/PUBL get +30, and PU or lower get +40. Mega Stones and Primal Orbs can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",

		ruleset: ['[Gen 7] Mix and Mega', '[Gen 7] Tier Shift'],
		banlist: ['Archeops', 'Beedrillite', 'Blazikenite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite'],
		restricted: [],
		unbanlist: [],
		onModifySpecies(template, target, format, effect) {
			if (template.isMega || template.isPrimal) return;
			let newTemplate = this.dex.deepClone(template);
			if (effect && effect.effectType === 'Item') {
				const megaSpecies = (effect as Item).megaStone || ({dragonascent: 'Rayquaza-Mega', redorb: 'Groudon-Primal', blueorb: 'Kyogre-Primal'} as {[k: string]: string})[effect.id];
				if (megaSpecies && megaSpecies !== template.name) {
					newTemplate = this.getMixedSpecies(template, megaSpecies);
				}
			}
			if (!effect || !['imposter', 'transform'].includes(effect.id)) {
				const boosts: {[k: string]: number} = {
					'UU': 10,
					'RUBL': 10,
					'RU': 20,
					'NUBL': 20,
					'NU': 30,
					'PUBL': 30,
					'PU': 40,
					'NFE': 40,
					'LC Uber': 40,
					'LC': 40,
				};
				if (newTemplate.tier[0] === '(') newTemplate.tier = newTemplate.tier.slice(1, -1);
				if (newTemplate.tier in boosts) {
					if (target.set.moves.includes('lightclay') && boosts[newTemplate.tier] > 10) newTemplate.tier = 'RUBL';
					if (target.set.moves.includes('auroraveil') && boosts[newTemplate.tier] > 10) newTemplate.tier = 'NUBL';
					if (['Drizzle', 'Drought', 'Snow Warning'].includes(target.set.ability) && boosts[newTemplate.tier] > 20) newTemplate.tier = 'NUBL';

					const boost = boosts[newTemplate.tier];
					for (const statName of ['atk', 'def', 'spa', 'spd', 'spe']) {
						newTemplate.baseStats[statName] = this.clampIntRange(newTemplate.baseStats[statName] + boost, 1, 255);
					}
					newTemplate.bst = newTemplate.baseStats.hp + newTemplate.baseStats.atk + newTemplate.baseStats.def + newTemplate.baseStats.spa + newTemplate.baseStats.spd + newTemplate.baseStats.spe;
				}
			}
			return newTemplate;
		},
		onSwitchIn() {},
		onSwitchOut() {},
	},
	{
		name: "[Gen 7] VoltTurn Mayhem Mix and Mega",
		desc: "All targeted moves force you to switch. Mega Stones can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",
		inherit: ["[Gen 7] VoltTurn Mayhem", "[Gen 7] Mix and Mega"],

		mod: 'gen7mixandmegavtm',
		ruleset: ['[Gen 7] Mix and Mega'],
		banlist: ['Giga Impact', 'Hyper Beam', 'Fake Out > 1', 'Gengarite'],
		restricted: [],
		unbanlist: ['Shadow Tag'],
		onValidateSet(set) {
			const template = this.dex.species.get(set.species || set.name);
			const item = this.dex.items.get(set.item);
			if (!item.megaStone && item.id !== 'blueorb' && item.id !== 'redorb') return;
			if (template.baseSpecies === item.megaEvolves || (template.baseSpecies === 'Groudon' && item.id === 'redorb') || (template.baseSpecies === 'Kyogre' && item.id === 'blueorb') || (template.baseSpecies === 'Necrozma' && item.id === 'ultranecroziumz')) return;
			if (template.tier.endsWith('Uber') || set.ability === 'Power Construct') {
				return [template.name + " is not allowed to hold a Mega Stone."];
			}
			switch (item.id) {
			case 'beedrillite': case 'gengarite': case 'kangaskhanite': case 'pidgeotite':
				return [item.name + " is only allowed to be held by " + item.megaEvolves + "."];
			case 'mawilite': case 'medichamite':
				if (set.ability === 'Huge Power' || set.ability === 'Pure Power') break;
				if (template.name === "Mawile" || template.name === "Medicham") break;
				return ["You are only allowed to hold " + item.name + " if your Ability is Huge Power or Pure Power."];
			case 'ultranecroziumz':
				return ["Ultranecrozium Z is only allowed to be held by Necrozma-Dawn-Wings or Necrozma-Dusk-Mane."];
			}
		},
		onSwitchIn() {},
		onSwitchOut() {},
	},

	// Featured Metagames
	///////////////////////////////////////////////////////////////////

	{
		section: "Featured Metagames",
		column: 4,
	},
	{
		name: "[Gen 6] 350 Cup",
		desc: "Pok&eacute;mon with a base stat of 350 or lower get their stats doubled.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3512945/">350 Cup</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] Ubers'],
		banlist: [
			'Abra', 'Cranidos', 'Darumaka', 'Gastly', 'Pawniard', 'Smeargle', 'Spritzee',
			'Shadow Tag', 'Deep Sea Scale', 'Deep Sea Tooth', 'Eviolite', 'Light Ball', 'Thick Club',
		],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;

			if (!template.abilities) return;

			if (template.bst > 350) return;

			const newTemplate = this.dex.deepClone(template);
			for (const statName in newTemplate.baseStats) {
				newTemplate.baseStats[statName] *= 2;
			}
			newTemplate.bst *= 2;
			return newTemplate;
		},
	},
	// Ability Shift
	{
		name: "Ability Unity",
		desc: "Pok&eacute;mon can use any ability, barring the few that are restricted, that is shared by a Pok&eacute;mon of the same type.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3507278/">Ability Unity</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU', '!Obtainable Abilities'],
		banlist: ['Archeops', 'Regigigas', 'Slaking'],
		restricted: ['Aerilate', 'Arena Trap', 'Flower Gift', 'Forecast', 'Fur Coat', 'Huge Power', 'Imposter', 'Parental Bond', 'Pure Power', 'Shadow Tag', 'Simple', 'Speed Boost', 'Stance Change', 'Wonder Guard', 'Zen Mode'],
		onValidateTeam(team, format) {
			const problems = [];
			const pokedex = Object.keys(this.dex.data.Pokedex);
			const usedPokemon: string[] = [];
			for (const set of team) {
				const template = this.dex.species.get(set.species);
				const ability = set.ability;
				if (!ability) {
					problems.push(template.name + " needs to have an ability.");
					continue;
				}
				const sources = pokedex.filter(pokemon => !usedPokemon.includes(pokemon) && this.dex.data.Pokedex[pokemon].num > 0 && template.types.slice().sort().toString() === this.dex.data.Pokedex[pokemon].types.slice().sort().toString() && Object.values(this.dex.data.Pokedex[pokemon].abilities).includes(ability) && this.dex.species.get(pokemon).gen <= this.gen);
				if (!sources.length) {
					problems.push(template.name + " cannot obtain the ability " + ability + ".");
					continue;
				}
				if (this.ruleTable.isRestricted('ability:' + this.toID(ability))) {
					let legalAbility = false;
					let i: AbilityIndex;
					for (i in template.abilities) {
						if (ability === template.abilities[i]) legalAbility = true;
					}
					if (!legalAbility) {
						problems.push("The ability " + ability + " is banned on Pok\u00e9mon that do not naturally have it.");
						continue;
					}
				}
				usedPokemon.push(sources[0]);
			}
			return problems;
		},
	},
	{
		name: "[Gen 6] Alphabet Cup", // 6T
		inherit: ['[Gen 7] Alphabet Cup'],
		desc: "Pok&eacute;mon may learn any move that starts with the same letter as their species.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3498167/">Alphabet Cup</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Swoobat'],
		restricted: ['Sketch'],
	},
	// Averagemons - Randomised
	{
		name: "Budgetmons",
		desc: "The total BST of your team must not exceed 2300.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3486872/">Budgetmons</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		onValidateTeam(team) {
			let total = 0;
			for (const set of team) {
				const item = this.dex.items.get(set.item);
				const template = this.dex.species.get(item.megaEvolves === set.species ? item.megaStone : set.species);
				total += template.bst;
			}
			if (total > 2300) return ["You are limited to a BST of 2300 by Budgetmons.", "(Your team's BST is " + total + ".)"];
		},
	},
	{
		name: "Custom Power",
		desc: "Each Pok&eacute;mon's first move is changed to the type that its Hidden Power would be.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3562927/">Custom Power</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		onModifyTypePriority: -2,
		onModifyType(move, pokemon) {
			if (move.id === pokemon.moves[0]) {
				move.type = pokemon.hpType || 'Dark';
			}
		},
	},
	{
		name: "Enchanted Items",
		desc: "Enchanted Items is a metagame where you sacrifice your item slot for a secondary ability.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3570431/">Enchanted Items</a>`,
		],

		mod: 'enchanteditems',
		ruleset: ['[Gen 6] Ubers', '2 Ability Clause'],
		banlist: ['Kyurem-Black', 'Porygon-Z', 'Togekiss', 'Shedinja', 'Bug Gem', 'Dark Gem', 'Dragon Gem', 'Electric Gem', 'Fairy Gem', 'Fire Gem', 'Ice Gem', 'Poison Gem', 'Psychic Gem', 'Steel Gem', 'Poke Ball', 'Chatter'],
		unbanlist: ['Deoxys-Defense', 'Deoxys-Speed', 'Genesect', 'Greninja', 'Hoopa-Unbound', 'Landorus'],
		validateSet(set, teamHas) {
			const ability = this.dex.abilities.get(set.item);
			if (ability.item) set.item = ability.item;
			return this.validateSet(set, teamHas);
		},
		onValidateSet(set) {
			const ability = this.dex.abilities.get(set.ability);
			const item = this.dex.items.get(set.item);
			if (ability.item && ability.item === item.id) return ["You are not allowed to have " + ability.name + " and " + item.name + " on the same Pokemon."];
		},
		onBegin() {
			const allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (const pokemon of allPokemon) {
				const ability = this.dex.abilities.get(pokemon.item);
				if (ability.item) pokemon.item = ability.item;
			}
		},
		onFaint(pokemon) {
			this.singleEvent('End', pokemon.getItem(), pokemon.itemState, pokemon);
		},
		onSwitchOut(pokemon) {
			this.singleEvent('End', pokemon.getItem(), pokemon.itemState, pokemon);
		},
	},
	{
		name: "Extreme Tier Shift",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3540047/">Extreme Tier Shift</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] Ubers', 'Baton Pass Clause', 'Overflow Stat Mod'],
		banlist: ['Eviolite'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			if (target.set.ability in {'Drizzle': 1, 'Drought': 1, 'Shadow Tag': 1}) return;

			if (!template.abilities) return;

			const boosts: {[k: string]: number} = {
				'UU': 10,
				'RUBL': 10,
				'RU': 20,
				'NUBL': 20,
				'NU': 30,
				'PUBL': 30,
				'PU': 40,
				'NFE': 40,
				'LC Uber': 40,
				'LC': 40,
			};
			let tier = template.tier as string;
			if (target.set.item) {
				const item = this.dex.items.get(target.set.item);
				if (item.megaEvolves === template.name) tier = this.dex.species.get(item.megaStone).tier;
			}
			if (tier[0] === '(') tier = tier.slice(1, -1);
			if (!(tier in boosts)) return;

			const boost = target.set.moves.includes('chatter') ? 30 : boosts[tier];
			const newTemplate = this.dex.deepClone(template);
			for (const statName in newTemplate.baseStats) {
				newTemplate.baseStats[statName] = this.clampIntRange(newTemplate.baseStats[statName] + boost, 1, 255);
			}
			newTemplate.bst = newTemplate.baseStats.hp + newTemplate.baseStats.atk + newTemplate.baseStats.def + newTemplate.baseStats.spa + newTemplate.baseStats.spd + newTemplate.baseStats.spe;
			return newTemplate;
		},
	},
	{
		name: "[Gen 6] Follow the Leader",
		inherit: ["[Gen 7] Follow the Leader"],
		desc: "All Pok&eacute;mon must use the abilities and moves of the Pok&eacute;mon in the first slot.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3565685/">Follow the Leader</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Chatter', 'Smeargle', 'Shedinja', 'Regigigas', 'Slaking', 'Huge Power', 'Imposter', 'Pure Power'],
		unbanlist: ['Aegislash'],
	},
	{
		name: "[Gen 6] FU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3519286/">FU</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] PU'],
		banlist: [
			'Altaria', 'Ampharos', 'Arbok', 'Armaldo', 'Articuno', 'Audino', 'Avalugg', 'Basculin', 'Beheeyem', 'Bouffalant', 'Cacturne', 'Camerupt',
			'Chatot', 'Clefairy', 'Combusken', 'Crustle', 'Cryogonal', 'Dodrio', 'Drifblim', 'Dusknoir', 'Electrode', 'Flareon', 'Floatzel', 'Fraxure',
			'Gabite', 'Golem', 'Gorebyss', 'Gourgeist-Super', 'Grumpig', 'Kadabra', 'Kingler', 'Lapras', 'Leafeon', 'Leavanny', 'Lickilicky', 'Lumineon',
			'Marowak', 'Mawile', 'Metang', 'Misdreavus', 'Monferno', 'Mr. Mime', 'Muk', 'Ninetales', 'Ninjask', 'Pawniard', 'Pelipper', 'Prinplup',
			'Probopass', 'Quagsire', 'Raichu', 'Rampardos', 'Rapidash', 'Regice', 'Relicanth', 'Roselia', 'Rotom-Fan', 'Rotom-Frost', 'Simisear',
			'Smeargle', 'Stoutland', 'Stunfisk', 'Swanna', 'Tangela', 'Torkoal', 'Trevenant', 'Ursaring', 'Vullaby', 'Zebstrika', 'Sticky Web',
		],
	},
	{
		name: "[Gen 6] Gods and Followers",
		desc: "The Pok&eacute;mon in the first slot is the God; the Followers must share a type with the God. If the God Pok&eacute;mon faints, the Followers are inflicted with Embargo.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3545230/">Gods and Followers</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] Ubers'],
		banlist: ['Geomancy', 'Baton Pass > 1'],
		validateSet(set, teamHas) {
			if (!teamHas.typeTable) {
				const problems = this.validateSet(set, teamHas);
				const template = this.dex.species.get(set.species);
				teamHas.typeTable = template.types;
				return problems;
			}
			const TeamValidator = this.constructor as new(format: string | Format) => TeamValidator;
			const problems = new TeamValidator('gen6ou').validateSet(set, teamHas);
			if (problems) return problems;
			const template = this.dex.species.get(set.species);
			if (!template.types.some(type => teamHas.typeTable.includes(type))) return ["Followers must share a type with the God."];
			return null;
		},
		onBegin() {
			for (const side of this.sides) {
				side.god = side.pokemon[0];
			}
		},
		onFaint(pokemon) {
			if (pokemon.side.pokemonLeft > 1 && pokemon.side.god === pokemon) {
				this.add('-message', pokemon.set.name + " has fallen! " + pokemon.side.name + "'s team has been Embargoed!");
			}
		},
		onSwitchIn(pokemon) {
			if (pokemon.side.god!.hp === 0 && pokemon.addVolatile('embargo', pokemon)) delete pokemon.volatiles['embargo'].duration;
		},
	},
	// Got Talent? - Randomised
	// Highest Stat Meta
	// Inheritance - Randomised
	{
		name: "Mediocremons",
		desc: "Only Pok&eacute;mon whose stats are all less than 100 are allowed.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3507608/">Mediocremons</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Clefable', 'Kingdra', 'Venomoth', 'Huge Power', 'Pure Power'],
		onValidateSet(set) {
			const problems = [];
			let template = this.dex.species.get(set.species);
			const item = this.dex.items.get(set.item);
			if (item.megaEvolves === template.name) template = this.dex.species.get(item.megaStone);
			const statTable: Record<StatID, string> = {hp: 'an HP', atk: 'an Attack', def: 'a Defense', spa: 'a Special Attack', spd: 'a Special Defense', spe: 'a Speed'};
			let stat: StatID;
			for (stat in statTable) {
				if (template.baseStats[stat] >= 100) problems.push(template.name + " has " + statTable[stat] + " of " + template.baseStats[stat] + ", which is banned.");
			}
			return problems;
		},
	},
	{
		name: "Megamons",
		desc: "Mega Evolutions can be used as if they were normal Pok&eacute;mon.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3566648/">Megamons</a>`,
		],

		mod: 'megamons',
		ruleset: ['[Gen 6] Ubers'],
	},
	{
		name: "Metagamiate",
		desc: "All Pok&eacute;mon get an -ate Ability if they do not already have one.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3502303/">Metagamiate</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Dragonite', 'Kyurem-Black'],
		onModifyTypePriority: -2,
		onModifyType(move, pokemon) {
			if (move.type === 'Normal' && !['judgment', 'naturalgift', 'technoblast', 'weatherball'].includes(move.id)) {
				move.type = pokemon.set.shiny && pokemon.types[1] || pokemon.types[0];
				move.metagamiateBoosted = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower(basePower, pokemon, target, move) {
			if (move.metagamiateBoosted) return this.chainModify([0x1333, 0x1000]);
		},
		validateSet(set, teamHas) {
			const problems = this.validateSet(set);
			if (problems?.length) {
				set = {...set, shiny: !set.shiny};
				const shiny = this.validateSet(set);
				if (shiny && shiny.length > problems.length) return problems;
			}
			return this.validateSet(set, teamHas);
		},
	},
	{
		name: "[Gen 6] Middle Cup",
		desc: "Only Pok&eacute;mon that are in the middle stage of an evolutionary line are allowed.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3524287/">Middle Cup</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU', 'Max Level = 50'],
		banlist: ['Chansey', 'Combusken', 'Kadabra', 'Magneton', 'Eviolite', 'Light Ball', 'Contrary', 'Protean'],
		onValidateSet(set) {
			const template = this.dex.species.get(set.species);
			if (!template.prevo) return [set.species + " is not an evolved Pokemon."];
			if (!template.nfe) return [set.species + " does not have an evolution."];
		},
	},
	// Mix and Mega - Randomised
	{
		name: "Monogen",
		desc: "All Pok&eacute;mon on a team must be from the same generation.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3516475/">Monogen</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		onValidateTeam(team) {
			if (!team[0]) return;
			const gen = this.dex.species.get(team[0].species).gen;
			if (!gen) return ["Your team must be from the same generation."];
			for (const set of team) {
				const template = this.dex.species.get(set.species);
				if (template.gen !== gen) return ["Your team must be from the same generation."];
			}
		},
	},
	{
		name: "Move Equality 1v1",
		desc: "All standard attacks with a fixed base power are now 100BP total.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3539145/">Move Equality</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] 1v1'],
		banlist: ['Deoxys-Defense', 'Keldeo', 'Metagross-Mega', 'Fire Spin', 'Infestation', 'Sand Tomb', 'Whirlpool'],
		onModifyMove(move, pokemon) {
			const excludedMoves = ['bodyslam', 'flyingpress', 'phantomforce', 'shadowforce', 'steamroller', 'stomp'];
			if (!move.priority) {
				if (typeof move.multihit === 'number') {
					move.basePower = 100 / move.multihit;
				} else if (move.multihit) {
					move.basePower = 100 / move.multihit[1];
				} else if (!move.basePowerCallback && !move.onBasePower && move.basePower && move.category !== 'Status' && !excludedMoves.includes(move.id)) {
					move.basePower = 100;
				}
			}
		},
	},
	{
		name: "[Gen 6] Nature Swap",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3577739/">Nature Swap</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Chansey', 'Cloyster'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			const nature = this.dex.natures.get(target.set.nature);
			if (!nature.plus || !nature.minus) return;
			const baseStats = {...template.baseStats};
			baseStats[nature.plus] = template.baseStats[nature.minus];
			baseStats[nature.minus] = template.baseStats[nature.plus];
			return {...template, baseStats};
		},
	},
	{
		name: "No Status",
		desc: "All status moves are banned.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3542555/">No Status</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		unbanlist: ['Blaziken', 'Deoxys-Defense', 'Deoxys-Speed', 'Giratina', 'Hoopa-Unbound', 'Lugia'],
		onValidateSet(set) {
			return set.moves.map(move => this.dex.moves.get(move)).filter(move => move.category === 'Status').map(move => set.species + "'s move " + move.name + " is banned by No Status.");
		},
	},
	// Same Type Stealth Rock
	// Sketchmons - Old Gens
	// Stabmons - Permanent
	// Stat Switch - Randomised
	// Type Reflectors - Randomised
	// VoltTurn Mayhem - Randomised

	// Other Metagames
	///////////////////////////////////////////////////////////////////

	{
		section: "Old Gens Metagames",
		column: 5,
	},
	{
		name: "[Gen 6] 1v1",
		desc: "Bring three Pok&eacute;mon to Team Preview and choose one to battle.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3496773/">1v1</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3536109/">1v1 Resources</a>`,
		],

		mod: 'gen6',
		ruleset: ['Obtainable', 'Species Clause', 'Nickname Clause', 'Moody Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Accuracy Moves Clause', 'Swagger Clause', 'Endless Battle Clause', 'Sleep Moves Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview', 'Max Team Size = 3', 'Picked Team Size = 1'],
		banlist: [
			'Arceus', 'Blaziken', 'Darkrai', 'Deoxys-Base', 'Deoxys-Attack', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kangaskhan-Mega',
			'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Salamence-Mega', 'Shaymin-Sky', 'Xerneas', 'Yveltal', 'Zekrom', 'Focus Sash', 'Soul Dew',
			'Perish Song', 'Chansey + Charm + Seismic Toss',
		],
	},
	{
		name: "[Gen 5] 1v1",
		desc: "Bring three Pok&eacute;mon to Team Preview and choose one to battle.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3483807/">1v1</a>`,
		],

		mod: 'gen5',
		ruleset: ['[Gen 5] OU', '!Evasion Abilities Clause', 'Accuracy Moves Clause', 'Max Team Size = 3', 'Picked Team Size = 1'],
		banlist: ['Cottonee', 'Dragonite', 'Jirachi', 'Kyurem-Black', 'Mew', 'Togekiss', 'Whimsicott', 'Victini', 'Focus Band', 'Focus Sash', 'Quick Claw', 'Perish Song'],
		unbanlist: ['Dugtrio', 'Genesect', 'Landorus', 'Manaphy', 'Thundurus', 'Tornadus-Therian', 'Arena Trap', 'Sand Rush'],
	},
	{
		name: "[Gen 5] 1v1 Ubers",
		inherit: ["[Gen 5] 1v1"],

		ruleset: ['[Gen 5] Ubers'],
		unbanlist: [],
	},
	{
		name: "[Gen 4] 1v1",
		desc: "Bring three Pok&eacute;mon to Team Preview and choose one to battle.",

		mod: 'gen4',
		ruleset: ['[Gen 4] OU', 'Accuracy Moves Clause', 'Swagger Clause', 'Team Preview', 'Max Team Size = 3', 'Picked Team Size = 1'],
		banlist: ['Porygon-Z', 'Focus Sash', 'Grass Whistle', 'Hypnosis', 'Lovely Kiss', 'Perish Song', 'Sing', 'Sleep Powder', 'Spore'],
		unbanlist: ['Wobbuffet', 'Wynaut'],
	},
	{
		name: "[Gen 3] 1v1",
		desc: "Bring three Pok&eacute;mon to Team Preview and choose one to battle.",

		mod: 'gen3',
		ruleset: ['[Gen 3] OU', 'Swagger Clause', 'Team Preview', 'Max Team Size = 3', 'Picked Team Size = 1'],
		banlist: ['Slaking', 'Snorlax', 'Suicune', 'Destiny Bond', 'Explosion', 'Flash', 'Ingrain', 'Kinesis', 'Mud-Slap', 'Muddy Water', 'Octazooka', 'Perish Song', 'Sand Attack', 'Self-Destruct', 'Smokescreen'],
	},
	{
		name: "[Gen 2] 1v1",
		desc: "Bring three Pok&eacute;mon to Team Preview and choose one to battle.",

		mod: 'gen2',
		ruleset: ['[Gen 2] OU', 'Swagger Clause', 'Team Preview', 'Max Team Size = 3', 'Picked Team Size = 1'],
		banlist: ['Snorlax', 'Clefable', 'Zapdos', 'Destiny Bond', 'Explosion', 'Flash', 'Hypnosis', 'Kinesis', 'Lovely Kiss', 'Mud-Slap', 'Octazooka', 'Perish Song', 'Sand Attack', 'Self-Destruct', 'Sing', 'Sleep Powder', 'Smokescreen', 'Spore', 'Berserk Gene', 'Focus Band', "King's Rock", 'Quick Claw'],
	},
	{
		name: "[Gen 1] 1v1",
		desc: "Bring three Pok&eacute;mon to Team Preview and choose one to battle.",

		mod: 'gen1',
		ruleset: ['[Gen 1] OU', 'Team Preview', 'Max Team Size = 3', 'Picked Team Size = 1'],
		banlist: ['Mew', 'Mewtwo', 'Clamp', 'Explosion', 'Flash', 'Fire Spin', 'Hypnosis', 'Kinesis', 'Lovely Kiss', 'Sand Attack', 'Self-Destruct', 'Sing', 'Sleep Powder', 'Smokescreen', 'Spore'],
	},
	{
		name: "[Gen 6] Almost Any Ability",
		desc: "Pok&eacute;mon can use any ability, barring the few that are restricted.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3528058/">Almost Any Ability</a>`,
		],

		mod: 'gen6',
		searchShow: true,
		ruleset: ['[Gen 6] OU', '2 Ability Clause', '!Obtainable Abilities'],
		banlist: ['Archeops', 'Bisharp', 'Chatot', 'Dragonite', 'Hoopa-Unbound', 'Keldeo', 'Kyurem-Black', 'Mamoswine', 'Regigigas', 'Shedinja', 'Slaking', 'Smeargle', 'Snorlax', 'Suicune', 'Terrakion', 'Weavile', 'Dynamic Punch', 'Zap Cannon'],
		unbanlist: ['Aegislash', 'Blaziken', 'Deoxys-Defense', 'Deoxys-Speed', 'Genesect', 'Greninja', 'Landorus'],
		restricted: [
			'Contrary', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Parental Bond',
			'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Wonder Guard',
		],
		onValidateSet(set, format) {
			if (this.ruleTable.isRestricted('ability:' + this.toID(set.ability))) {
				const template = this.dex.species.get(set.species || set.name);
				let legalAbility = false;
				let i: AbilityIndex;
				for (i in template.abilities) {
					if (set.ability === template.abilities[i]) legalAbility = true;
				}
				if (!legalAbility) return ['The ability ' + set.ability + ' is banned on Pok\u00e9mon that do not naturally have it.'];
			}
		},
	},
	{
		name: "[Gen 3] Almost Any Ability",
		desc: "Pok&eacute;mon can use any ability, barring the few that are restricted.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3597495/">Almost Any Ability</a>`,
		],

		mod: 'gen3',
		ruleset: ['[Gen 3] OU', '2 Ability Clause', '!Obtainable Abilities'],
		banlist: ['Slaking'],
		restricted: [
			'Huge Power', 'Pure Power', 'Speed Boost', 'Wonder Guard',
		],
		onValidateSet(set, format) {
			if (this.ruleTable.isRestricted('ability:' + this.toID(set.ability))) {
				const template = this.dex.species.get(set.species || set.name);
				let legalAbility = false;
				let i: AbilityIndex;
				for (i in template.abilities) {
					if (set.ability === template.abilities[i]) legalAbility = true;
				}
				if (!legalAbility) return ['The ability ' + set.ability + ' is banned on Pok\u00e9mon that do not naturally have it.'];
			}
		},
	},
	{
		name: "[Gen 6] Anything Goes",
		searchShow: true,
	},
	{
		name: "[Gen 5] Anything Goes",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3589266/">Anything Goes Discussion</a>`,
		],

		mod: 'gen5',
		ruleset: ['Obtainable', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 4] Anything Goes",

		mod: 'gen4',
		ruleset: ['Obtainable', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 6] Balanced Hackmons",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3489849/">Balanced Hackmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3566051/">BH Suspects and Bans</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3571384/">BH Resources</a>`,
		],

		mod: 'gen6',
		ruleset: ['-Nonexistent', '2 Ability Clause', ' -ate Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Groudon-Primal', 'Kyogre-Primal', 'Arena Trap', 'Huge Power', 'Moody', 'Parental Bond', 'Protean', 'Pure Power', 'Shadow Tag', 'Wonder Guard', 'Assist', 'Chatter'],
		unbanlist: ['Blue Orb', 'Gengarite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Red Orb'],
	},
	{
		name: "[Gen 5] Balanced Hackmons",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3463764/">Balanced Hackmons</a>`,
		],

		mod: 'gen5',
		ruleset: ['-Nonexistent', 'Sleep Clause Mod', 'OHKO Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Arena Trap', 'Huge Power', 'Pure Power', 'Shadow Tag', 'Wonder Guard'],
	},
	{
		name: "[Gen 4] Balanced Hackmons",

		mod: 'gen4',
		ruleset: ['-Nonexistent', '2 Ability Clause', 'OHKO Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Arena Trap', 'Huge Power', 'Pure Power', 'Shadow Tag', 'Wonder Guard', 'Drizzle ++ Swift Swim', 'Drought ++ Chlorophyll', 'Sand Stream ++ Sand Rush'],
	},
	{
		name: "[Gen 3] Balanced Hackmons",

		mod: 'gen3',
		ruleset: ['-Nonexistent', 'Sleep Clause Mod', 'OHKO Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Slaking', 'Arena Trap', 'Huge Power', 'Pure Power', 'Shadow Tag', 'Wonder Guard', 'Soul Dew', 'Belly Drum'],
	},
	{
		name: "[Gen 2] Balanced Hackmons",

		mod: 'gen2',
		ruleset: ['-Nonexistent', 'Sleep Clause Mod', 'OHKO Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Mewtwo > 1', 'Mean Look + Hypnosis', 'Mean Look + Lovely Kiss', 'Mean Look + Sing', 'Mean Look + Sleep Powder', 'Mean Look + Spore', 'Spider Web + Hypnosis', 'Spider Web + Lovely Kiss', 'Spider Web + Sing', 'Spider Web + Sleep Powder', 'Spider Web + Spore'],
	},
	{
		name: "[Gen 1] Balanced Hackmons",

		mod: 'gen1',
		ruleset: ['-Nonexistent', 'Freeze Clause Mod', 'Sleep Clause Mod', 'OHKO Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Mewtwo', 'Bind', 'Clamp', 'Fire Spin', 'Wrap'],
	},
	{
		name: "[Gen 6] Inverse Battle",
		desc: "Battle with an inverted type chart.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3518146/">Inverse Battle</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3526371/">Inverse Battle Viability Ranking</a>`,
		],

		searchShow: true,
		mod: 'gen6',
		ruleset: ['[Gen 6] OU', 'Inverse Mod'],
		banlist: ['Diggersby', 'Kyurem-Black', 'Serperior', 'Snorlax'],
		unbanlist: ['Aegislash', 'Dialga', 'Genesect', 'Giratina', 'Greninja', 'Landorus', 'Mawile-Mega', 'Lucario-Mega'],
	},
	{
		name: "[Gen 6] Inverse Random Battle",
		desc: "Battle with an inverted type chart.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3518146/">Inverse Battle</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3526371/">Inverse Battle Viability Ranking</a>`,
		],

		mod: 'gen6',
		team: 'random',
		ruleset: ['Obtainable', 'Inverse Mod', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 6] Mix and Mega",
		desc: "Mega Stones and Primal Orbs can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3540979/">Mix and Mega</a>`,
		],

		mod: 'gen6mixandmega',
		ruleset: ['[Gen 6] Ubers', 'Overflow Stat Mod'],
		banlist: ['Baton Pass', 'Dynamic Punch', 'Electrify', 'Zap Cannon'],
		restricted: ['Beedrillite', 'Gengarite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Ultranecrozium Z'],
		onValidateTeam(team) {
			const itemTable: {[k: string]: boolean} = {};
			for (const set of team) {
				const item = this.dex.items.get(set.item);
				if (itemTable[item.id] && item.megaStone) return ["You are limited to one of each Mega Stone.", "(You have more than one " + item.name + ".)"];
				if (itemTable[item.id] && (item.id === 'blueorb' || item.id === 'redorb')) return ["You are limited to one of each Primal Orb.", "(You have more than one " + item.name + ".)"];
				itemTable[item.id] = true;
			}
		},
		onValidateSet(set) {
			const template = this.dex.species.get(set.species || set.name);
			const item = this.dex.items.get(set.item);
			if (!item.megaEvolves && item.id !== 'blueorb' && item.id !== 'redorb') return;
			if (template.baseSpecies === item.megaEvolves || (template.baseSpecies === 'Groudon' && item.id === 'redorb') || (template.baseSpecies === 'Kyogre' && item.id === 'blueorb')) return;
			if (template.tier === 'Uber') return [template.name + " is not allowed to hold a Mega Stone."];
			switch (item.id) {
			case 'beedrillite': case 'gengarite': case 'kangaskhanite':
				return [item.name + " is only allowed to be held by " + item.megaEvolves + "."];
			case 'mawilite': case 'medichamite':
				if (set.ability === 'Huge Power' || set.ability === 'Pure Power') break;
				if (template.name === "Mawile" || template.name === "Medicham") break;
				return ["You are only allowed to hold " + item.name + " if your Ability is Huge Power or Pure Power."];
			}
		},
		onModifySpecies(template, target, format, effect) {
			if (!effect || ['imposter', 'transform'].includes(effect.id)) return;
			const megaSpecies = (effect as Item).megaStone || ({dragonascent: 'Rayquaza-Mega', redorb: 'Groudon-Primal', blueorb: 'Kyogre-Primal'} as {[k: string]: string})[effect.id];
			if (!megaSpecies || megaSpecies === template.name) return;
			template = this.getMixedSpecies(template, megaSpecies);
			return template;
		},
		onBegin() {
			const allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (const pokemon of allPokemon) {
				pokemon.m.originalSpecies = pokemon.baseSpecies.name;
			}
		},
		onSwitchIn(pokemon) {
			const oMegaTemplate = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				// Place volatiles on the Pokémon to show its mega-evolved condition and details
				this.add('-start', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
				const oTemplate = this.dex.species.get(pokemon.m.originalSpecies);
				if (oTemplate.types.length !== pokemon.species.types.length || oTemplate.types[1] !== pokemon.species.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut(pokemon) {
			const oMegaTemplate = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				this.add('-end', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			}
		},
	},
	{
		name: "Mix and Mega Random Battle",
		inherit: ['[Gen 6] Mix and Mega'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod', 'Overflow Stat Mod'],
		banlist: [],
		restricted: [],
	},
	{
		name: "[Gen 6] Monotype",
		desc: "All the Pok&eacute;mon on a team must share a type.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3544507/">Monotype</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3575778/">Monotype Viability Ranking</a>`,
		],

		mod: 'gen6',
		searchShow: true,
		ruleset: ['[Gen 6] OU', 'Same Type Clause'],
		banlist: ['Altaria-Mega', 'Charizard-Mega-X', 'Metagross-Mega', 'Sableye-Mega', 'Slowbro-Mega', 'Talonflame', 'Damp Rock', 'Focus Band', "King's Rock", 'Quick Claw', 'Razor Fang', 'Smooth Rock'],
		unbanlist: ['Deoxys-Defense', 'Hoopa-Unbound', 'Landorus', 'Shadow Tag'],
	},
	{
		name: "[Gen 6] Monotype Random Battle",

		mod: 'gen6',
		team: 'random',
		ruleset: ['Obtainable', 'Same Type Clause', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 5] Monotype",
		desc: "All the Pok&eacute;mon on a team must share a type.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/104013/">Monotype</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3565162/">Monotype</a>`,
		],

		mod: 'gen5',
		ruleset: ['[Gen 5] OU', 'Same Type Clause'],
	},
	{
		name: "[Gen 5] Monotype Random Battle",

		mod: 'gen5',
		team: 'random',
		ruleset: ['Obtainable', 'Same Type Clause', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 4] Monotype",
		desc: "All the Pok&eacute;mon on a team must share a type.",

		mod: 'gen4',
		ruleset: ['[Gen 4] OU', 'Same Type Clause'],
	},
	{
		name: "[Gen 4] Monotype Random Battle",

		mod: 'gen4',
		team: 'random',
		ruleset: ['Obtainable', 'Same Type Clause', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 3] Monotype",
		desc: "All the Pok&eacute;mon on a team must share a type.",

		mod: 'gen3',
		ruleset: ['[Gen 3] OU', 'Same Type Clause'],
	},
	{
		name: "[Gen 3] Monotype Random Battle",

		mod: 'gen3',
		team: 'random',
		ruleset: ['Obtainable', 'Same Type Clause', 'Sleep Clause Mod', 'Freeze Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 6] Sketchmons",
		inherit: ['[Gen 7] Sketchmons'],
		desc: "Each Pok&eacute;mon can learn Sketch once.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3479657/">Sketchmons</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Diggersby', 'Pinsir-Mega', "King's Rock", 'Razor Fang'],
		restricted: ['Chatter', 'Shell Smash'],
	},
	{
		name: "STABmons",
		desc: "Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3547279/">STABmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3558034/">STABmons Viability Ranking</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Aerodactyl-Mega', 'Altaria-Mega', 'Diggersby', 'Kyurem-Black', 'Metagross-Mega', 'Porygon-Z', 'Thundurus', "King's Rock", 'Razor Fang'],
		unbanlist: [],
		restricted: ['Acupressure', 'Belly Drum', 'Chatter', 'Dark Void', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Sketch'],
		checkCanLearn(move, template, lsetData, set) {
			if (!move.isZ && !this.ruleTable.isRestricted('move:' + move.id)) {
				let types = template.types;
				if (template.prevo || template.baseSpecies) types = types.concat(this.dex.species.get(this.dex.species.get(template.prevo || template.baseSpecies).prevo || template.prevo || template.baseSpecies).types);
				if (template.baseSpecies === 'Shaymin') types = ['Grass', 'Flying'];
				if (template.baseSpecies === 'Hoopa') types = ['Psychic', 'Ghost', 'Dark'];
				if (types.includes(move.type)) return null;
			}
			return this.checkCanLearn(move, template, lsetData, set);
		},
	},
	{
		name: "[Gen 5] STABmons",
		inherit: ['STABmons'],
		desc: "Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3484106/">STABmons</a>`,
		],

		mod: 'gen5',
		ruleset: ['[Gen 5] OU'],
		banlist: [],
		unbanlist: ['Darkrai', 'Deoxys-Defense', 'Deoxys-Speed', 'Excadrill', 'Thundurus', 'Tornadus-Therian', 'Landorus'],
		restricted: ['Acupressure', 'Chatter', 'Sketch'],
	},
	{
		name: "[Gen 4] STABmons",
		inherit: ['[Gen 5] STABmons'],
		desc: "Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn.",

		mod: 'gen4',
		ruleset: ['[Gen 4] OU'],
		banlist: ['Belly Drum'],
		unbanlist: [],
	},
	{
		name: "Smogon Triples",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3511522/">Smogon Triples</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3540390/">Triples Viability Ranking</a>`,
		],

		mod: 'gen6',
		gameType: 'triples',
		ruleset: ['Obtainable', 'Species Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		banlist: ['Arceus', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White',
			'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Xerneas', 'Yveltal', 'Zekrom',
			'Soul Dew', 'Dark Void', 'Perish Song',
		],
	},
	{
		name: "Tier Shift",
		desc: "Pok&eacute;mon below OU/UUBL get all their stats boosted. UU/RUBL get +5, RU/NUBL get +10, NU/PUBL get +15, and PU or lower get +20.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3554765/">Tier Shift</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU', 'Overflow Stat Mod'],
		banlist: ['Damp Rock'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			if (target.set.ability in {'Drizzle': 1, 'Drought': 1, 'Shadow Tag': 1}) return;

			if (!template.abilities) return;

			const boosts: {[k: string]: number} = {
				'UU': 5,
				'RUBL': 5,
				'RU': 10,
				'NUBL': 10,
				'NU': 15,
				'PUBL': 15,
				'PU': 20,
				'NFE': 20,
				'LC Uber': 20,
				'LC': 20,
			};
			let tier = template.tier as string;
			if (target.set.item) {
				const item = this.dex.items.get(target.set.item);
				if (item.megaEvolves === template.name) tier = this.dex.species.get(item.megaStone).tier;
			}
			if (tier[0] === '(') tier = tier.slice(1, -1);
			if (!(tier in boosts)) return;

			const boost = target.set.moves.includes('chatter') ? 15 : boosts[tier];
			const newTemplate = this.dex.deepClone(template);
			for (const statName in newTemplate.baseStats) {
				newTemplate.baseStats[statName] = this.clampIntRange(newTemplate.baseStats[statName] + boost, 1, 255);
			}
			newTemplate.bst = newTemplate.baseStats.hp + newTemplate.baseStats.atk + newTemplate.baseStats.def + newTemplate.baseStats.spa + newTemplate.baseStats.spd + newTemplate.baseStats.spe;
			return newTemplate;
		},
	},
	{
		name: "[Gen 5] Tier Shift",
		desc: "Pok&eacute;mon below OU/UUBL get all their stats boosted. UU/RUBL get +5, RU/NUBL get +10 and NU or lower get +15.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3479358/">Tier Shift</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3485704/">Tier Shift Viability Rankings</a>`,
		],

		mod: 'gen5',
		ruleset: ['[Gen 5] OU', 'Overflow Stat Mod'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			if (target.set.ability in {'Drizzle': 1, 'Drought': 1, 'Shadow Tag': 1}) return;

			if (!template.abilities) return;

			const boosts: {[k: string]: number} = {
				'UU': 5,
				'RUBL': 5,
				'RU': 10,
				'NUBL': 10,
				'NU': 15,
				'PUBL': 15,
				'PU': 15,
				'NFE': 15,
				'LC Uber': 15,
				'LC': 15,
			};
			let tier = template.tier as string;
			if (target.set.item) {
				const item = this.dex.items.get(target.set.item);
				if (item.megaEvolves === template.name) tier = this.dex.species.get(item.megaStone).tier;
			}
			if (!(tier in boosts)) return;

			const boost = target.set.moves.includes('chatter') ? 15 : boosts[tier];
			const newTemplate = this.dex.deepClone(template);
			for (const statName in newTemplate.baseStats) {
				newTemplate.baseStats[statName] = this.clampIntRange(newTemplate.baseStats[statName] + boost, 1, 255);
			}
			newTemplate.bst = newTemplate.baseStats.hp + newTemplate.baseStats.atk + newTemplate.baseStats.def + newTemplate.baseStats.spa + newTemplate.baseStats.spd + newTemplate.baseStats.spe;
			return newTemplate;
		},
	},
	{
		name: "[Gen 4] Tier Shift",
		desc: "Pok&eacute;mon below OU/UUBL get all their stats boosted. UU/RUBL get +5 and NU or lower get +10.",

		mod: 'gen4',
		ruleset: ['[Gen 4] OU', 'Overflow Stat Mod'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			if (target.set.ability in {'Drizzle': 1, 'Drought': 1, 'Shadow Tag': 1}) return;

			if (!template.abilities) return;

			const boosts: {[k: string]: number} = {
				'UU': 5,
				'RUBL': 5,
				'RU': 10,
				'NUBL': 10,
				'NU': 10,
				'PUBL': 10,
				'PU': 10,
				'NFE': 10,
				'LC Uber': 10,
				'LC': 10,
			};
			let tier = template.tier;
			if (target.set.item) {
				const item = this.dex.items.get(target.set.item);
				if (item.megaEvolves === template.name) tier = this.dex.species.get(item.megaStone).tier;
			}
			if (!(tier in boosts)) return;

			const boost = target.set.moves.includes('chatter') ? 15 : boosts[tier];
			const newTemplate = this.dex.deepClone(template);
			for (const statName in newTemplate.baseStats) {
				newTemplate.baseStats[statName] = this.clampIntRange(newTemplate.baseStats[statName] + boost, 1, 255);
			}
			newTemplate.bst = newTemplate.baseStats.hp + newTemplate.baseStats.atk + newTemplate.baseStats.def + newTemplate.baseStats.spa + newTemplate.baseStats.spd + newTemplate.baseStats.spe;
			return newTemplate;
		},
	},

	// BW2 Singles
	///////////////////////////////////////////////////////////////////

	{
		section: "BW2 Singles",
		column: 5,
	},
	{
		name: "[Gen 5] OU",
	},
	{
		name: "[Gen 5] Weather Wars",

		mod: 'gen5',
		ruleset: ['[Gen 5] OU'],
		unbanlist: ['Drizzle ++ Swift Swim', 'Drought ++ Chlorophyll', 'Sand Stream ++ Sand Rush'],
	},
	{
		name: "[Gen 5] Ubers",
		searchShow: true,
	},
	{
		name: "[Gen 5] UU",
		searchShow: true,
	},
	{
		name: "[Gen 5] RU",
		searchShow: true,
	},
	{
		name: "[Gen 5] NU",
		searchShow: true,
	},
	{
		name: "[Gen 5] PU",

		mod: 'gen5',
		ruleset: ['[Gen 5] NU'],
		banlist: [
			'Alomomola', 'Ampharos', 'Armaldo', 'Basculin', 'Braviary',
			'Cacturne', 'Camerupt', 'Carracosta', 'Charizard', 'Eelektross',
			'Electabuzz', 'Exeggutor', 'Garbodor', 'Gardevoir', 'Golem',
			'Golurk', 'Gorebyss', 'Gurdurr', 'Haunter', 'Jynx', 'Kadabra',
			'Kangaskhan', 'Lickilicky', 'Liepard', 'Linoone', 'Ludicolo',
			'Mandibuzz', 'Metang', 'Miltank', 'Misdreavus', 'Musharna',
			'Piloswine', 'Pinsir', 'Primeape', 'Probopass', 'Regirock',
			'Roselia', 'Rotom-Fan', 'Samurott', 'Sawk', 'Sawsbuck',
			'Scolipede', 'Seismitoad', 'Serperior', 'Skuntank', 'Swellow',
			'Tangela', 'Tauros', 'Torkoal', 'Wartortle', 'Zangoose',
			'Drizzle',
		],
	},
	{
		name: "[Gen 5] NFE",
		desc: "Only Pok&eacute;mon that can evolve are allowed.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656369/">NFE</a>`,
		],

		mod: 'gen5',
		ruleset: ['[Gen 5] OU', 'Not Fully Evolved', '!Sleep Moves Clause'],
		banlist: [
			'Chansey', 'Dusclops', 'Fraxure', 'Gligar', 'Golbat', 'Gurdurr', 'Haunter',
			'Machoke', 'Magmar', 'Magneton', 'Riolu', 'Rhydon', 'Scyther', 'Vigoroth',
			'Drought',
		],
		unbanlist: ['Sand Rush'],
	},
	{
		name: "[Gen 5] LC",
		searchShow: true,
	},
	{
		name: "[Gen 5] GBU Singles",
		searchShow: true,
	},
	{
		name: "[Gen 5] Random Battle",
		searchShow: true,
	},
	{
		name: "[Gen 5] Custom Game",
	},

	// BW2 Doubles
	///////////////////////////////////////////////////////////////////

	{
		section: 'BW2 Doubles',
		column: 5,
	},
	{
		name: "[Gen 5] Doubles OU",
	},
	{
		name: "[Gen 5] GBU Doubles",

		mod: 'gen5',
		gameType: 'doubles',
		ruleset: ['Flat Rules'],
		banlist: ['Dark Void', 'Sky Drop', 'Soul Dew'],
	},
	{
		name: "[Gen 5] Random Doubles",

		mod: 'gen5',
		gameType: 'doubles',
		team: 'random',
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 5] Doubles Custom Game",

		mod: 'gen5',
		gameType: 'doubles',
		debug: true,
		battle: {trunc: Math.trunc},
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},
	{
		name: "[Gen 5] Triples Custom Game",

		mod: 'gen5',
		gameType: 'triples',
		searchShow: false,
		debug: true,
		battle: {trunc: Math.trunc},
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},

	// Past Generations
	///////////////////////////////////////////////////////////////////

	{
		section: "Past Generations",
		column: 5,
	},
	{
		name: "[Gen 4] OU",
	},
	{
		name: "[Gen 4] Ubers",
		searchShow: true,
	},
	{
		name: "[Gen 4] UU",
		searchShow: true,
	},
	{
		name: "[Gen 4] NU",
		searchShow: true,
	},
	{
		name: "[Gen 4] NFE",
		desc: "Only Pok&eacute;mon that can evolve are allowed.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656369/">NFE</a>`,
		],

		mod: 'gen4',
		ruleset: ['[Gen 4] OU', 'NFE Clause', 'Evasion Abilities Clause'],
		banlist: [
			'Chansey', 'Dragonair', 'Dusclops', 'Electabuzz', 'Haunter', 'Machoke',
			'Magmar', 'Magneton', 'Porygon2', 'Rhydon', 'Scyther', 'Sneasel',
			'Sunny Day', 'Deep Sea Tooth', 'Light Ball', 'Light Clay', 'Thick Club',
		],
	},
	{
		name: "[Gen 4] LC",
		searchShow: true,
	},
	{
		name: "[Gen 4] Random Battle",
	},
	{
		name: "[Gen 4] Custom Game",
	},
	{
		name: "[Gen 4] Doubles OU",
		searchShow: true,
	},
	{
		name: "[Gen 4] Random Doubles",

		mod: 'gen4',
		gameType: 'doubles',
		team: 'random',
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 4] Doubles Custom Game",

		mod: 'gen4',
		gameType: 'doubles',
		debug: true,
		battle: {trunc: Math.trunc},
		// no restrictions
		ruleset: ['Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},
	{
		name: "[Gen 3] OU",
	},
	{
		name: "[Gen 3] Ubers",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/posts/7433832/">ADV Ubers Information &amp; Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3536426/">ADV Ubers Viability Ranking</a>`,
		],

		mod: 'gen3',
		ruleset: ['Standard'],
		banlist: ['Smeargle + Ingrain', 'Wobbuffet + Leftovers'],
	},
	{
		name: "[Gen 3] UU",
		searchShow: true,
	},
	{
		name: "[Gen 3] NU",
		searchShow: true,
	},
	{
		name: "[Gen 3] Random Battle",
	},
	{
		name: "[Gen 3] Custom Game",
	},
	{
		name: "[Gen 2] OU",
	},
	{
		name: "[Gen 2] Ubers",
		searchShow: true,
	},
	{
		name: "[Gen 2] UU",
		searchShow: true,
	},
	{
		name: "[Gen 2] NU",
		searchShow: true,
	},
	{
		name: "[Gen 2] Random Battle",
		searchShow: true,
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 2] Stadium OU",
		searchShow: true,
	},
	{
		name: "[Gen 2] Custom Game",
	},
	{
		name: "[Gen 1] OU",
	},
	{
		name: "[Gen 1] Ubers",
		searchShow: true,
	},
	{
		name: "[Gen 1] OU (Tradeback)",
		desc: `RBY OU with movepool additions from the Time Capsule.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/articles/rby-tradebacks-ou">RBY Tradebacks OU</a>`,
		],

		mod: 'gen1',
		ruleset: ['Obtainable', 'Allow Tradeback', 'Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause', 'HP Percentage Mod', 'Cancel Mod', 'Desync Clause Mod'],
		banlist: ['Uber',
			'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember',
		],
	},
	{
		name: "[Gen 1] Random Battle",
	},
	{
		name: "[Gen 1] Challenge Cup",
	},
	{
		name: "[Gen 1] Stadium OU",

		mod: 'gen1stadium',
		searchShow: true,
		ruleset: ['Standard', 'Team Preview'],
		banlist: ['Uber',
			'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember',
		],
	},
	{
		name: "[Gen 1] Tradebacks OU",
	},
	{
		name: "[Gen 1] Custom Game",
	},

	// Seasonal Metagames
	///////////////////////////////////////////////////////////////////

	{
		section: "Seasonal Metagames",
		column: 5,
	},
	{
		name: "[Gen 8] Super Staff Bros 4",
	},
	{
		name: "[Gen 7] Super Staff Bros Brawl",
		desc: "Super Staff Bros returns for another round! Battle with a random team of pokemon created by the sim staff.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/articles/super-staff-bros-brawl">Introduction &amp; Roster</a>`,
		],

		mod: 'gen7ssb',
		team: 'randomStaffBros',
		ruleset: ['HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod'],
		onBegin() {
			this.add('raw|SUPER STAFF BROS <b>BRAWL</b>!!');
			this.add('message', 'GET READY FOR THE NEXT BATTLE!');
			this.add(`raw|<div class='broadcast-green'><b>Wondering what all these custom moves, abilities, and items do?<br />Check out the <a href="https://www.smogon.com/articles/super-staff-bros-brawl" target="_blank">Super Staff Bros Brawl Guide</a> and find out!</b></div>`);
		},
		onSwitchIn(pokemon) {
			let name: string = this.toID(pokemon.illusion ? pokemon.illusion.name : pokemon.name);
			if (this.dex.species.get(name).exists) {
				// Certain pokemon have volatiles named after their speciesid
				// To prevent overwriting those, and to prevent accidentaly leaking
				// that a pokemon is on a team through the onStart even triggering
				// at the start of a match, users with pokemon names will need their
				// statuse's to end in "user".
				name = name + 'user';
			}
			// Add the mon's status effect to it as a volatile.
			const status = this.dex.conditions.get(name);
			if (status?.exists) {
				pokemon.addVolatile(name, pokemon);
			}
		},
	},
	{
		name: "[Seasonal] Super Staff Bros. Melee",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3491902/">Seasonal Ladder</a>`,
			`&bullet; <a href="https://github.com/Zarel/Pokemon-Showdown/blob/8768b2d7fb71840521f30e659d7fe717c3cd47f1/mods/seasonal/README.md">Player's Manual</a>`,
		],

		mod: 'seasonal',
		team: 'random',
		ruleset: ['Sleep Clause Mod', 'Freeze Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		onBegin() {
			this.add("raw|Super Staff Bros. <b>MELEEEEEEEEEEEEEE</b>!!");
			this.add('message', "SURVIVAL! GET READY FOR THE NEXT BATTLE!");
			this.add('raw|<div class="broadcast-green">Huh? But what do all these weird moves do??<br><b>Pro tip: Refer to <s>the PLAYER\'S MANUAL</s> <code>/details</code>!</b></div>');

			const globalRenamedMoves: {[k: string]: string} = {};
			const customRenamedMoves: {[k: string]: {[k: string]: string}} = {};

			const allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (const pokemon of allPokemon) {
				const last = pokemon.moves.length - 1;
				if (pokemon.moves[last] && pokemon.set.signatureMove) {
					pokemon.moveSlots[last].move = pokemon.set.signatureMove;
					pokemon.baseMoveSlots[last].move = pokemon.set.signatureMove;
				}
				for (let j = 0; j < pokemon.moveSlots.length; j++) {
					const moveData = pokemon.moveSlots[j];
					if (globalRenamedMoves[moveData.id]) {
						moveData.move = globalRenamedMoves[moveData.id];
						pokemon.baseMoveSlots[j].move = globalRenamedMoves[moveData.id];
					}

					const customRenamedSet = customRenamedMoves[this.toID(pokemon.name)];
					if (customRenamedSet?.[moveData.id]) {
						moveData.move = customRenamedSet[moveData.id];
						pokemon.baseMoveSlots[j].move = customRenamedSet[moveData.id];
					}
				}
			}
		},
		// Here we add some flavour or design immunities.
		onImmunity(type, pokemon) {
			if (this.toID(pokemon.name) === 'juanma' && type === 'Fire') {
				this.add('-message', "Did you think fire would stop __him__? You **fool**!");
				return false;
			}
		},
		onNegateImmunity(pokemon, type) {
			if (pokemon.volatiles['flipside']) return false;
			const foes = pokemon.side.foe.active;
			if (foes.length && foes[0].volatiles['samuraijack'] && pokemon.hasType('Dark') && type === 'Psychic') return false;
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target?.volatiles['flipside']) return;
			if (move && move.id === 'retreat') return;
			if (move && move.id === 'freezedry' && type === 'Water') return;
			if (move && !this.dex.getImmunity(move, type)) return 1;
			return -typeMod;
		},
		// Hacks for megas changed abilities. This allow for their changed abilities.
		onAfterMega(pokemon) {
			const name = this.toID(pokemon.name);
			if (name === 'andy') {
				pokemon.setAbility('adaptability');
				this.add('-ability', pokemon, 'Adaptability');
			}
			if (name === 'reisen') {
				pokemon.setAbility('adaptability');
				this.add('-ability', pokemon, 'Tough Claws');
			}
			if (name === 'crestfall') {
				pokemon.setAbility('simple');
				this.add('-ability', pokemon, 'Simple');
			}
			if (name === 'dreameatergengar') {
				pokemon.setAbility('infiltrator');
				this.add('-ability', pokemon, 'Infiltrator');
			}
			if (name === 'overneat') {
				pokemon.setAbility('noguard');
				this.add('-ability', pokemon, 'No Guard');
			}
			if (name === 'skitty') {
				pokemon.setAbility('shedskin');
				this.add('-ability', pokemon, 'Shed Skin');
			}
			if (name === 'theimmortal') {
				pokemon.setAbility('cloudnine');
			}
		},
		// Here we treat many things, read comments inside for information.
		onSwitchInPriority: 1,
		onSwitchIn(pokemon) {
			const name = this.toID(pokemon.illusion ? pokemon.illusion.name : pokemon.name);
			// Wonder Guard is available, but it curses you.
			if (pokemon.getAbility().id === 'wonderguard' && pokemon.baseSpecies.baseSpecies !== 'Shedinja' && pokemon.baseSpecies.baseSpecies !== 'Kakuna') {
				pokemon.addVolatile('curse', pokemon);
				this.add('-message', pokemon.name + "'s Wonder Guard has cursed it!");
			}

			// Add here more hacky stuff for mega abilities.
			// This happens when the mega switches in, as opposed to mega-evolving on the turn.
			if (pokemon.species.isMega) {
				if (name === 'andy' && pokemon.getAbility().id === 'magicbounce') {
					pokemon.setAbility('adaptability');
					this.add('-ability', pokemon, 'Adaptability');
				}
				if (name === 'reisen' && pokemon.getAbility().id === 'hugepower') {
					pokemon.setAbility('adaptability');
					this.add('-ability', pokemon, 'Tough Claws');
				}
				if (name === 'crestfall' && pokemon.getAbility().id === 'magicbounce') {
					pokemon.setAbility('simple');
					this.add('-ability', pokemon, 'Simple');
				}
				if (name === 'dreameatergengar' && pokemon.getAbility().id === 'shadowtag') {
					pokemon.setAbility('infiltrator');
					this.add('-ability', pokemon, 'Infiltrator');
				}
				if (name === 'overneat' && pokemon.getAbility().id === 'speedboost') {
					pokemon.setAbility('noguard');
					this.add('-ability', pokemon, 'No Guard');
				}
				if (name === 'skitty' && pokemon.getAbility().id === 'healer') {
					pokemon.setAbility('shedskin');
					this.add('-ability', pokemon, 'Shed Skin');
				}
				if (name === 'theimmortal' && pokemon.getAbility().id === 'megalauncher') {
					pokemon.setAbility('cloudnine');
				}
			} else {
				// Bypass one mega limit.
				pokemon.canMegaEvo = this.actions.canMegaEvo(pokemon);
			}

			// Innate effects.
			if (name === 'ascriptmaster') {
				pokemon.addVolatile('ascriptinnate', pokemon);
			}
			if (name === 'atomicllamas') {
				pokemon.addVolatile('baddreamsinnate', pokemon);
			}
			if (name === 'blastchance') {
				pokemon.addVolatile('flipside', pokemon);
			}
			if (name === 'bondie') {
				pokemon.addVolatile('crabstance', pokemon);
			}
			if (name === 'clefairy') {
				pokemon.addVolatile('coldsteel', pokemon);
			}
			if (name === 'duck') {
				pokemon.addVolatile('firstblood', pokemon);
			}
			if (name === 'eeveegeneral') {
				this.add('-mega', pokemon, 'Eevee', null);
				this.add('detailschange', pokemon, pokemon.details); //run mega evo animation
				for (const i of ['atk', 'def', 'spa', 'spd', 'spe'] as StatIDExceptHP[]) {
					pokemon.storedStats[i] += 50;
				}
			}
			if (name === 'formerhope') {
				pokemon.addVolatile('cursedbodyinnate', pokemon);
			}
			if (name === 'galbia' || name === 'aurora') {
				this.field.setWeather('sandstorm');
			}
			if (name === 'rodan') {
				pokemon.addVolatile('gonnamakeyousweat', pokemon);
			}
			if (name === 'giagantic') {
				pokemon.addVolatile('deltastreaminnate', pokemon);
			}
			if (name === 'hashtag') {
				this.boost({spe: 1}, pokemon, pokemon, this.dex.conditions.get('Innate Ability'));
			}
			if (name === 'haund') {
				pokemon.addVolatile('prodigy', pokemon);
			}
			if (name === 'innovamania' && !pokemon.illusion) {
				this.boost({atk: 6, def: 6, spa: 6, spd: 6, spe: 6, accuracy: 6}, pokemon, pokemon, this.dex.conditions.get('Divine Grace'));
			}
			if (name === 'jackhiggins') {
				this.field.setWeather('sunnyday');
			}
			if (name === 'lemonade') {
				pokemon.addVolatile('adaptabilityinnate', pokemon);
			}
			if (name === 'manu11') {
				pokemon.addVolatile('arachnophobia', pokemon);
			}
			if (name === 'marshmallon') {
				this.boost({def: 1}, pokemon, pokemon, this.dex.conditions.get('Fur Coat Innate'));
			}
			if (name === 'mizuhime' || name === 'kalalokki' || name === 'sweep') {
				this.field.setWeather('raindance');
			}
			if (name === 'nv') {
				pokemon.addVolatile('cuteness', pokemon);
			}
			if (name === 'pikachuun') {
				this.boost({spe: 1}, pokemon, pokemon, this.dex.conditions.get('Reisen Cosplay'));
			}
			if (name === 'qtrx') {
				pokemon.addVolatile('qtrxinnate', pokemon);
			}
			if (name === 'raseri') {
				this.actions.useMove('hypnosis', pokemon);
			}
			if (name === 'rssp1') {
				pokemon.addVolatile('speedboostinnate', pokemon);
			}
			if (name === 'scythernoswiping') {
				pokemon.addVolatile('mountaineerinnate', pokemon);
			}
			if (name === 'sigilyph') {
				pokemon.addVolatile('samuraijack', pokemon);
			}
			if (name === 'sonired') {
				this.boost({def: -1, spd: -1, atk: 1, spe: 1}, pokemon, pokemon, this.dex.conditions.get('Weak Skin'));
			}
			if (name === 'snobalt') {
				pokemon.addVolatile('amityabsorb', pokemon);
			}
			if (name === 'spacebass') {
				pokemon.addVolatile('badtrip', pokemon);
			}
			if (name === 'sparktrain') {
				pokemon.addVolatile('refrigerateinnate', pokemon);
			}
			if (name === 'specsmegabeedrill') {
				pokemon.addVolatile('weed', pokemon);
			}
			if (name === 'starmei') {
				this.actions.useMove('cosmicpower', pokemon);
			}
			if (name === 'talkingtree') {
				this.actions.useMove('synthesis', pokemon);
				this.actions.useMove('bulkup', pokemon);
			}
			if (name === 'teremiare') {
				pokemon.addVolatile('coinflip', pokemon);
			}
			if (name === 'trickster' || name === 'blitzamirin') {
				const target = pokemon.battle[pokemon.side.id === 'p1' ? 'p2' : 'p1'].active[0];
				const targetBoosts: {[k: string]: number} = {};
				const sourceBoosts: {[k: string]: number} = {};
				let i: BoostID;
				for (i in target.boosts) {
					targetBoosts[i] = target.boosts[i];
					sourceBoosts[i] = pokemon.boosts[i];
				}
				target.setBoost(sourceBoosts);
				pokemon.setBoost(targetBoosts);
				this.add('-swapboost', pokemon, target);
			}
			if (name === 'unfixable') {
				pokemon.addVolatile('ironbarbsinnate', pokemon);
			}
			if (name === 'urkerab') {
				pokemon.addVolatile('focusenergy', pokemon);
				this.actions.useMove('magnetrise', pokemon);
			}
			if (name === 'uselesstrainer') {
				pokemon.addVolatile('ninja', pokemon);
			}
			if (name === 'winry') {
				pokemon.addVolatile('hellacute', pokemon);
			}

			// Edgy switch-in sentences go here.
			// Sentences vary in style and how they are presented, so each Pokémon has its own way of sending them.
			let sentences = [];
			let sentence = '';

			if (name === 'acast') {
				this.add('c|%Acast|__A wild Castform appeared!__');
			}
			if (name === 'ace') {
				this.add('c|@Ace|Lmaonade');
			}
			if (name === 'aelita') {
				this.add('c|%Aelita|Transfer, Aelita. Scanner, Aelita. Virtualization!');
			}
			if (name === 'ajhockeystar') {
				this.add('c|+ajhockeystar|Here comes the greatest hockey player alive!');
			}
			if (name === 'albacore') {
				this.add('c|@Albacore|do I have to?');
			}
			if (name === 'albert') {
				this.add('c|+Albert|Art is risk.');
			}
			if (name === 'always') {
				sentence = (pokemon.side.foe.active.length && pokemon.side.foe.active[0].hp ? pokemon.side.foe.active[0].name : "... ohh nobody's there...");
				this.add('c|+Always|Oh it\'s ' + sentence);
			}
			if (name === 'am') {
				this.add('c|+AM|Lucky and Bad');
			}
			if (name === 'andy') {
				this.add('c|%Andy|:I');
			}
			if (name === 'antemortem') {
				this.add('c|&antemortem|I Am Here To Oppress Users');
			}
			if (name === 'anttya') {
				this.add('c|+Anttya|Those crits didn\'t even matter');
			}
			if (name === 'anty') {
				this.add('c|+Anty|mhm');
			}
			if (name === 'articuno') {
				this.add('c|%Articuno|Abolish the patriarchy!');
			}
			if (name === 'ascriptmaster') {
				this.add("c|@Ascriptmaster|It's time for a hero to take the stage!");
			}
			if (name === 'astara') {
				this.add('c|%Ast☆arA|I\'d rather take a nap, I hope you won\'t be a petilil shit, Eat some rare candies and get on my level.');
			}
			if (name === 'asty') {
				this.add('c|@Asty|Top kek :^)');
			}
			if (name === 'atomicllamas') {
				this.add('c|&atomicllamas|(celebrate)(dog)(celebrate)');
			}
			if (name === 'aurora') {
				this.add('c|@Aurora|Best of luck to all competitors!');
			}
			if (name === 'reisen') {
				this.add('c|%Reisen|Fite me irl bruh.');
			}
			if (name === 'beowulf') {
				this.add('c|@Beowulf|Grovel peasant, you are in the presence of the RNGesus');
			}
			if (name === 'biggie') {
				sentences = ["Now I'm in the limelight cause I rhyme tight", "HAPPY FEET! WOMBO COMBO!", "You finna mess around and get dunked on"];
				this.add('c|@biggie|' + sentences[this.random(3)]);
			}
			if (name === 'blastchance') {
				this.add("c|+Blast Chance|MAN BALAMAR");
			}
			if (name === 'blitzamirin') {
				this.add('c|@Blitzamirin|How Can Mirrors Be Real If Our Eyes Aren\'t Real? ╰( ~ ◕ ᗜ ◕ ~ )੭━☆ﾟ.*･｡ﾟ');
			}
			if (name === 'bludz') {
				this.add('c|+bludz|420 blaze it');
			}
			if (name === 'bondie') {
				this.add('c|+Bondie|__(\\/) snip snip (\\/)__');
			}
			if (name === 'bottt') {
				this.add('c|boTTT|Beep, boop');
			}
			if (name === 'brandon') {
				this.add("c|+Brrandon|Life's too short to take it seriously ALL the time.");
			}
			if (name === 'bumbadadabum') {
				this.add('c|@bumbadadabum|Time for card games on motorcycles!');
				if (pokemon.side.foe.active.length && pokemon.side.foe.active[0].name === 'Scotteh') this.add('c|@bumbadadabum|Also, fuck you Scotteh');
			}
			if (name === 'bummer') {
				this.add("c|&Bummer|Oh hi.");
			}
			if (name === 'chaos') {
				this.add("c|~chaos|I always win");
			}
			if (name === 'ciran') {
				this.add("c|+Ciran|You called?");
			}
			if (name === 'clefairy') {
				this.add('c|+Clefairy|google "dj clefairyfreak" now');
			}
			if (name === 'coolstorybrobat') {
				sentence = [
					"Time to GET SLAYED", "BRUH!", "Ahem! Gentlemen...", "I spent 6 months training in the mountains for this day!",
					"Shoutout to all the pear...",
				][this.random(5)];
				this.add('c|@CoolStoryBrobat|' + sentence);
			}
			if (name === 'crestfall') {
				this.add('c|%Crestfall|To say that we\'re in love is dangerous');
			}
			if (name === 'deathonwings') {
				this.add('c|+Death on Wings|rof');
			}
			if (name === 'dirpz') {
				this.add('c|+Dirpz|IT\'S A WATER/FAIRY TYPE!!11!');
			}
			if (name === 'dmt') {
				this.add('c|+DMT|DMT');
			}
			if (name === 'dreameatergengar') {
				this.add('c|+Dream Eater Gengar|Goodnight sweet prince.');
			}
			if (name === 'duck') {
				this.add('c|@Duck|Don\'t duck with me!');
			}
			if (name === 'e4flint') {
				this.add('c|+E4 Flint|hf lul');
			}
			if (name === 'eeveegeneral') {
				sentences = ['yo', 'anyone seen goku?'];
				this.add('c|~Eevee General|' + sentences[this.random(2)]);
			}
			if (name === 'eyan') {
				this.add('c|@Eyan|░░░░░░░░▄▄▄▀▀▀▄▄███▄░░░░░░░░░░░░░░░░░');
				this.add('c|@Eyan|░░░░░▄▀▀░░░░░░░▐░▀██▌░░░░░░░░░░░░░░░░');
				this.add('c|@Eyan|░░░▄▀░░░░▄▄███░▌▀▀░▀█░░░░░░░░░░░░░░░░');
				this.add('c|@Eyan|░░▄█░░▄▀▀▒▒▒▒▒▄▐░░░░█▌░░░░░░░░░░░░░░░ ');
				this.add('c|@Eyan|░▐█▀▄▀▄▄▄▄▀▀▀▀▌░░░░░▐█▄░░░░░░░░░░░░░░');
				this.add('c|@Eyan|░▌▄▄▀▀░░░░░░░░▌░░░░▄███████▄░░░░░░░░░');
				this.add('c|@Eyan|░░░░░░░░░░░░░▐░░░░▐███████████▄░░░░░░');
				this.add('c|@Eyan|░░░░░le░░░░░░░▐░░░░▐█████████████▄░░░');
				this.add('c|@Eyan|░░░░toucan░░░░░░▀▄░░░▐██████████████▄');
				this.add('c|@Eyan|░░░░░░has░░░░░░░░▀▄▄████████████████▄');
				this.add('c|@Eyan|░░░░░arrived░░░░░░░░░░░░█▀██████░░░░░');
				this.add('c|@Eyan|WELCOME TO COMPETITIVE TOUCANNING');
			}
			if (name === 'feliburn') {
				this.add('c|@Feliburn|you don\'t go hand to hand with a fighter noob');
			}
			if (name === 'fireburn') {
				this.add('c|+Fireburn|:V');
			}
			if (name === 'flyingkebab') {
				this.add("c|+Flying Kebab|Kebab > Pizza");
			}
			if (name === 'formerhope') {
				this.add('c|@Former Hope|I have Hope');
			}
			if (name === 'freeroamer') {
				this.add('c|%Freeroamer|lol this is a wrap');
			}
			if (name === 'frysinger') {
				this.add("c|+Frysinger|Nice boosts kid.");
			}
			if (name === 'fx') {
				this.add("c|+f(x)|love is 4 wawawawawawawalls");
			}
			if (name === 'galbia') {
				this.add('c|@galbia|(dog)');
			}
			if (name === 'galom') {
				this.add('c|+Galom|To the end.');
			}
			if (name === 'rodan') { // don't delete
				this.add("c|+RODAN|Here I Come, Rougher Than The Rest of 'Em.");
			}
			if (name === 'geoffbruedly') {
				this.add("c|%GeoffBruedly|FOR WINRY");
			}
			if (name === 'giagantic') {
				this.add("c|%Giagantic|e.e");
			}
			if (name === 'golui') {
				this.add("c|+Golui|Golly gee");
			}
			if (name === 'goodmorningespeon') {
				this.add("c|+GoodMorningEspeon|type /part to continue participating in this battle :)");
			}
			if (name === 'grimauxiliatrix') {
				this.add("c|%grimAuxiliatrix|ᕕ( ᐛ )ᕗ");
			}
			if (name === 'halite') {
				this.add('c|@Halite|You’re gonna get haxxed kid :^)');
			}
			if (name === 'hannah') {
				this.add('c|+Hannahh|♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥');
			}
			if (name === 'hashtag') {
				this.add("c|#Hashtag|hey opponent, you get 5 hashtag points if you forfeit right now ;}");
			}
			if (name === 'haund') {
				this.add('c|%Haund|le balanced normal flying bird has arrived');
			}
			if (name === 'healndeal') {
				this.add('c|+HeaLnDeaL|screw clerics');
			}
			if (name === 'himynamesl') {
				this.add('c|@HiMyNamesL|There’s no such thing as winning or losing. There is won and there is lost, there is victory and defeat. There are absolutes. Everything in between is still left to fight for.');
				this.add('c|@HiMyNamesL|' + pokemon.side.foe.name + ' will have won only when there is no one left to stand against them. Until then, there is only the struggle, because tides do what tides do – they turn.');
			}
			if (name === 'hippopotas') {
				this.add('-message', '@Hippopotas\'s Sand Stream whipped up a sandstorm!');
			}
			if (name === 'hollywood') {
				this.add('c|+hollywood|Kappa');
			}
			if (name === 'ih8ih8sn0w') {
				this.add('c|+ih8ih8sn0w|*sips tea*');
			}
			if (name === 'imanalt') {
				this.add('c|+imanalt|muh bulk');
			}
			if (name === 'imas234') {
				this.add('c|@imas234|hlo');
			}
			if (name === 'innovamania') {
				sentences = ['Don\'t take this seriously', 'These Black Glasses sure look cool', 'Ready for some fun?( ͡° ͜ʖ ͡°)', '( ͡° ͜ʖ ͡°'];
				this.add('c|@innovamania|' + sentences[this.random(4)]);
			}
			if (name === 'iplaytennislol') {
				this.add('c|%iplaytennislol|KACAW');
			}
			if (name === 'iyarito') {
				this.add('c|+Iyarito|Welp');
			}
			if (name === 'jackhiggins') {
				this.add("c|+Jack Higgins|Ciran was right, fun deserved to be banned");
			}
			if (name === 'jasmine') {
				this.add("c|+Jasmine|I'm still relevant!");
			}
			if (name === 'jdarden') {
				this.add('c|@jdarden|Did someone call for some BALK?');
			}
			if (name === 'jetpack') {
				this.add('c|+Jetpack|You\'ve met with a terrible fate, haven\'t you?');
			}
			if (name === 'joim') {
				const dice = this.random(8);
				if (dice === 1) {
					this.add('c|~Joim|░░░░░░░░░░░░▄▐');
					this.add('c|~Joim|░░░░░░▄▄▄░░▄██▄');
					this.add('c|~Joim|░░░░░▐▀█▀▌░░░░▀█▄');
					this.add('c|~Joim|░░░░░▐█▄█▌░░░░░░▀█▄');
					this.add('c|~Joim|░░░░░░▀▄▀░░░▄▄▄▄▄▀▀');
					this.add('c|~Joim|░░░░▄▄▄██▀▀▀▀');
					this.add('c|~Joim|░░░█▀▄▄▄█░▀▀');
					this.add('c|~Joim|░░░▌░▄▄▄▐▌▀▀▀');
					this.add('c|~Joim|▄░▐░░░▄▄░█░▀▀ U HAVE BEEN SPOOKED');
					this.add('c|~Joim|▀█▌░░░▄░▀█▀░▀');
					this.add('c|~Joim|░░░░░░░▄▄▐▌▄▄ BY THE');
					this.add('c|~Joim|░░░░░░░▀███▀█░▄');
					this.add('c|~Joim|░░░░░░▐▌▀▄▀▄▀▐▄ SPOOKY SKILENTON');
					this.add('c|~Joim|░░░░░░▐▀░░░░░░▐▌');
					this.add('c|~Joim|░░░░░░█░░░░░░░░█');
					this.add('c|~Joim|░░░░░▐▌░░░░░░░░░█');
					this.add('c|~Joim|░░░░░█░░░░░░░░░░▐▌ SEND THIS TO 7 PPL OR SKELINTONS WILL EAT YOU');
				} else {
					sentences = [
						"Finally a good reason to punch a teenager in the face!", "WUBBA LUBBA DUB DUB",
						"``So here we are again, it's always such a pleasure.``", "My ex-wife still misses me, BUT HER AIM IS GETTING BETTER!",
						"A man chooses, a slave obeys.", "You're gonna have a bad time.", "Would you kindly let me win?",
						"I'm sorry, but I only enjoy vintage memes from the early 00's.",
					];
					sentence = sentences[this.random(8)];
					this.add('c|~Joim|' + sentence);
				}
			}
			if (name === 'juanma') {
				this.add("c|+Juanma|Okay, well, sometimes, science is more art than science, " + pokemon.side.name + ". A lot of people don't get that.");
			}
			if (name === 'kalalokki') {
				this.add('c|+Kalalokki|(•_•)');
				this.add('c|+Kalalokki|( •_•)>⌐■-■');
				this.add('c|+Kalalokki|(⌐■_■)');
			}
			if (name === 'kidwizard') {
				this.add('c|+Kid Wizard|Eevee General room mod me.');
			}
			if (name === 'layell') {
				this.add('c|@Layell|Enter stage left');
			}
			if (name === 'legitimateusername') {
				sentence = ["This isn't my fault.", "I'm not sorry."][this.random(2)];
				this.add('c|@LegitimateUsername|``' + sentence + '``');
			}
			if (name === 'lemonade') {
				this.add('c|+Lemonade|Pasta');
			}
			if (name === 'level51') {
				this.add('c|@Level 51|n_n!');
			}
			if (name === 'lj') {
				this.add('c|%LJDarkrai|Powerfulll');
			}
			if (name === 'lyto') {
				sentences = ["This is divine retribution!", "I will handle this myself!", "Let battle commence!"];
				this.add('c|@Lyto|' + sentences[this.random(3)]);
			}
			if (name === 'macle') {
				this.add("c|+macle|Follow the Frog Blog");
			}
			if (name === 'manu11') {
				this.add("c|@manu 11|/me is pet by ihateyourpancreas");
			}
			if (name === 'marshmallon') {
				this.add("c|%Marshmallon|Marshtomb be like");
				this.add("c|%Marshmallon|- He sees you when you're sleeping -");
				this.add("c|%Marshmallon|- He knows when you're awake -");
				this.add("c|%Marshmallon|- He knows if you've been bad or good -");
				this.add("c|%Marshmallon|- So be good for goodness sake -");
			}
			if (name === 'mattl') {
				this.add('c|+MattL|If you strike me down, I shall become more powerful than you can possibly imagine.');
			}
			if (name === 'mcmeghan') {
				this.add("c|&McMeghan|A Game of Odds");
			}
			if (name === 'megazard') {
				this.add('c|+Megazard|New tricks');
			}
			if (name === 'mizuhime') {
				this.add('c|+Mizuhime|Thou Shalt Double Laser From The Edge');
			}
			if (name === 'nv') {
				this.add('c|+nv|Who tf is nv?');
			}
			if (name === 'omegaxis') {
				this.add('c|+Omega-Xis|lol this isn’t even my final form');
			}
			if (name === 'orday') {
				this.add('c|%Orda-Y|❄');
			}
			if (name === 'overneat') {
				this.add('c|+Overneat|tsk, tsk, is going to be funny');
			}
			if (name === 'paradise') {
				this.add('c|%Paradise~|I sexually identify as a hazard setter');
			}
			if (name === 'pikachuun') {
				sentences = ['Reisen is best waifu', 'Hey look I coded myself into the game', 'sup (\'.w.\')'];
				this.add('c|+Pikachuun|' + sentences[this.random(3)]);
			}
			if (name === 'pluviometer') {
				this.add('c|+pluviometer|p^2laceholder');
			}
			if (name === 'qtrx') {
				sentences = ["cutie are ex", "q-trix", "quarters", "cute T-rex", "Qatari", "random letters", "spammy letters", "asgdf"];
				this.add("c|@qtrx|omg DONT call me '" + sentences[this.random(8)] + "' pls respect my name its very special!!1!");
			}
			if (name === 'quitequiet') {
				this.add("c|@Quite Quiet|I'll give it a shot.");
			}
			if (name === 'raseri') {
				this.add('c|&Raseri|gg');
			}
			if (name === 'raven') {
				this.add('c|&Raven|Are you ready? Then let the challenge... Begin!');
			}
			if (name === 'rekeri') {
				this.add('c|@rekeri|Get Rekeri\'d :]');
			}
			if (name === 'rosiethevenusaur') {
				sentences = ['!dt party', 'Are you Wifi whitelisted?', 'Read the roomintro!'];
				this.add('c|@RosieTheVenusaur|' + sentences[this.random(3)]);
			}
			if (name === 'rssp1') {
				this.add('c|+rssp1|Witness the power of the almighty Rufflet!');
			}
			if (name === 'sailorcosmos') {
				this.add("c|+SailorCosmos|Cosmos Prism Power Make Up!");
			}
			if (name === 'scotteh') {
				this.add('c|&Scotteh|─────▄▄████▀█▄');
				this.add('c|&Scotteh|───▄██████████████████▄');
				if (pokemon.side.foe.active.length && pokemon.side.foe.active[0].name === 'bumbadadabum') this.add('c|@bumbadadabum|Fuck you Scotteh');
				this.add('c|&Scotteh|─▄█████.▼.▼.▼.▼.▼.▼.▼');
			}
			if (name === 'scpinion') {
				this.add('c|@scpinion|/me welcomes funbro');
			}
			if (name === 'scythernoswiping') {
				this.add('c|%Scyther NO Swiping|/me prepares to swipe victory');
			}
			if (name === 'shrang') {
				this.add('raw| [15:30] @<b>Scrappie</b>: It is I, the great and powerful shrang, who is superior to you proles in every conceivable way.');
			}
			if (name === 'sigilyph') {
				this.add('c|@Sigilyph|Prepare to feel the mighty power of an exploding star!');
			}
			if (name === 'sirdonovan') {
				this.add('c|&sirDonovan|Oh, a battle? Let me finish my tea and crumpets');
			}
			if (name === 'skitty') {
				this.add('c|@Skitty|\\_$-_-$_/');
			}
			if (name === 'snobalt') {
				this.add('c|+Snobalt|By the power vested in me from the great Lord Tomohawk...');
			}
			if (name === 'snowy') {
				this.add('c|+Snowy|Why do a lot of black people call each other monica?');
			}
			if (name === 'solarisfox') {
				this.add('raw|<div class="chat chatmessage-solarisfox"><small>%</small><b><font color="#2D8F1E"><span class="username" data-name="SolarisFox">SolarisFox</span>:</font></b> <em><marquee behavior="alternate" scrollamount=3 scrolldelay="60" width="108">[Intense vibrating]</marquee></em></div>');
			}
			if (name === 'sonired') {
				this.add('c|+Sonired|~');
			}
			if (name === 'spacebass') {
				this.add('c|@SpaceBass|He aims his good ear best he can towards conversation and sometimes leans in awkward toward your seat');
				this.add('c|@SpaceBass|And if by chance one feels their space too invaded, then try your best to calmly be discreet');
				this.add('c|@SpaceBass|Because this septic breathed man that stands before you is a champion from days gone by');
			}
			if (name === 'sparktrain') {
				this.add('c|+sparktrain|hi');
			}
			if (name === 'specsmegabeedrill') {
				this.add('c|+SpecsMegaBeedrill|(◕‿◕✿)');
			}
			if (name === 'spy') {
				sentences = ['curry consumer', 'try to keep up', 'fucking try to knock me down', 'Sometimes I slather myself in vasoline and pretend I\'m a slug', 'I\'m really feeling it!'];
				this.add('c|+Spy|' + sentences[this.random(5)]);
			}
			if (name === 'starmei') {
				this.add('c|+Starmei|Starmei wins again');
			}
			if (name === 'starry') {
				this.add('c|%starry|oh');
			}
			if (name === 'steamroll') {
				this.add('c|@Steamroll|Banhammer ready!');
			}
			if (name === 'sunfished') {
				this.add('c|+Sunfished|*raptor screeches*');
			}
			if (name === 'sweep') {
				this.add('c|&Sweep|(ninjacat)(beer)');
			}
			if (name === 'talkingtree') {
				this.add('c|+talkingtree|I am Groot n_n');
			}
			if (name === 'teg') {
				this.add("c|+TEG|It's __The__ Eevee General");
			}
			if (name === 'temporaryanonymous') {
				sentences = ['Hey, hey, can I gently scramble your insides (just for laughs)? ``hahahaha``', 'check em', 'If you strike me down, I shall become more powerful than you can possibly imagine! I have a strong deathrattle effect and I cannot be silenced!'];
				this.add('c|@Temporaryanonymous|' + sentences[this.random(3)]);
			}
			if (name === 'teremiare') {
				this.add('c|%Teremiare|I like to call it skill');
			}
			if (name === 'theimmortal') {
				this.add('c|~The Immortal|Give me my robe, put on my crown!');
			}
			if (name === 'tone114') {
				this.add('c|+TONE114|Haven\'t you heard the new sensation sweeping the nation?');
			}
			if (name === 'trickster') {
				sentences = ["heh….watch out before you get cut on my edge", "AaAaAaAAaAaAAa"];
				this.add('c|@Trickster|' + sentences[this.random(2)]);
			}
			if (name === 'unfixable') {
				this.add('c|+unfixable|eevee general sucks lol');
			}
			if (name === 'urkerab') {
				this.add('j|urkerab');
			}
			if (name === 'uselesstrainer') {
				sentences = ['huehuehuehue', 'PIZA', 'SPAGUETI', 'RAVIOLI RAVIOLI GIVE ME THE FORMUOLI', 'get ready for PUN-ishment', 'PIU\' RUSPE PER TUTTI, E I MARO\'???'];
				this.add('c|@useless trainer|' + sentences[this.random(6)]);
			}
			if (name === 'vapo') {
				this.add('c|%Vapo|/me vapes');
			}
			if (name === 'vexeniv') {
				this.add('c|+Vexen IV|The Arcana is the means by which all is revealed.');
			}
			if (name === 'winry') {
				this.add('c|@Winry|fight me irl');
			}
			if (name === 'xfix') {
				if (this.random(2)) {
					// The classic one
					const hazards = {stealthrock: 1, spikes: 1, toxicspikes: 1, burnspikes: 1, stickyweb: 1};
					let hasHazards = false;
					for (const hazard in hazards) {
						if (pokemon.side.getSideCondition(hazard)) {
							hasHazards = true;
							break;
						}
					}
					if (hasHazards) {
						this.add('c|+xfix|(no haz... too late)');
					} else {
						this.add('c|+xfix|(no hazards, attacks only, final destination)');
					}
				} else {
					this.add("c|+xfix|//starthunt 1 + 1 | 2 | 2 + 2 | 4 | Opponent's status soon (answer with three letters) | FNT :)");
				}
			}
			if (name === 'xjoelituh') {
				this.add("c|%xJoelituh|I won't be haxed again, you will be the next one. UUUUUU");
			}
			if (name === 'xshiba') { // dd
				this.add("c|+xShiba|LINDA IS INDA");
			}
			if (name === 'zarel') {
				this.add('c|~Zarel|Your mom');
			}
			if (name === 'zebraiken') {
				pokemon.m.phraseIndex = this.random(3);
				// Zeb's faint and entry phrases correspond to each other.
				if (pokemon.m.phraseIndex === 2) {
					this.add('c|&Zebraiken|bzzt n_n');
				} else if (pokemon.m.phraseIndex === 1) {
					this.add('c|&Zebraiken|bzzt *_*');
				} else {
					this.add('c|&Zebraiken|bzzt o_o');
				}
			}
			if (name === 'zeroluxgiven') {
				this.add('c|%Zero Lux Given|This should be an electrifying battle!');
			}
			if (name === 'zodiax') {
				this.add('c|%Zodiax|Introducing 7 time Grand Champion to the battle!');
			}
		},
		onFaint(pokemon, source, effect) {
			const name = this.toID(pokemon.name);

			if (name === 'innovamania') {
				pokemon.side.addSideCondition('healingwish', pokemon, this.format);
			}
			// Add here salty tears, that is, custom faint phrases.
			let sentences = [];
			// This message is different from others, as it triggers when
			// opponent faints
			if (source && source.name === 'galbia') {
				this.add('c|@galbia|literally 2HKOged');
			}
			// Actual faint phrases
			if (name === 'acast') {
				this.add('c|%Acast|If only I had more screens...');
			}
			if (name === 'ace') {
				this.add('c|@Ace|inhale all of this');
			}
			if (name === 'aelita') {
				this.add('c|%Aelita|CODE: LYOKO. Tower deactivated...');
			}
			if (name === 'ajhockeystar') {
				this.add('c|+ajhockeystar|You may have beaten me in battle, but never in hockey.');
			}
			if (name === 'albacore') {
				this.add('c|@Albacore|Joke\'s on you, I was just testing!');
			}
			if (name === 'albert') {
				this.add("c|+Albert|You may be good looking, but you're not a piece of art.");
			}
			if (name === 'always') {
				this.add('c|+Always|i swear to fucking god how can a single person be this lucky after getting played all the fucking way. you are a mere slave you glorified heap of trash.');
			}
			if (name === 'am') {
				this.add('c|+AM|RIP');
			}
			if (name === 'andy') {
				this.add('c|%Andy|wow r00d! :c');
			}
			if (name === 'antemortem') {
				this.add('c|&antemortem|FUCKING CAMPAIGNERS');
			}
			if (name === 'anttya') {
				this.add('c|+Anttya|Can\'t beat hax ¯\\_(ツ)_/¯');
			}
			if (name === 'anty') {
				this.add('c|+Anty|k');
			}
			if (name === 'articuno') {
				this.add('c|%Articuno|This is why you don\'t get any girls.');
			}
			if (name === 'ascriptmaster') {
				this.add('c|@Ascriptmaster|Farewell, my friends. May we meet another day...');
			}
			if (name === 'astara') {
				sentences = ['/me twerks into oblivion', 'good night ♥', 'Astara Vista Baby'];
				this.add('c|%Ast☆arA|' + sentences[this.random(3)]);
			}
			if (name === 'asty') {
				this.add('c|@Asty|Bottom kek :^(');
			}
			if (name === 'atomicllamas') {
				this.add('c|&atomicllamas|(puke)');
			}
			if (name === 'aurora') {
				this.add('c|@Aurora|are you serious you\'re so bad oh my god haxed ughhhhh');
			}
			if (name === 'reisen') {
				this.add("c|%Reisen|No need for goodbye. I'll see you on the flip side.");
			}
			if (name === 'beowulf') {
				this.add('c|@Beowulf|There is no need to be mad');
			}
			if (name === 'biggie') {
				sentences = ['It was all a dream', 'It\'s gotta be the shoes', 'ヽ༼ຈل͜ຈ༽ﾉ RIOT ヽ༼ຈل͜ຈ༽ﾉ'];
				this.add('c|@biggie|' + sentences[this.random(3)]);
			}
			if (name === 'blastchance') {
				this.add("c|+Blast Chance|**oh no!**");
			}
			if (name === 'blitzamirin') {
				this.add('c|@Blitzamirin|The Mirror Can Lie It Doesn\'t Show What\'s Inside ╰( ~ ◕ ᗜ ◕ ~ )੭━☆ﾟ.*･｡ﾟ');
			}
			if (name === 'bludz') {
				this.add('c|+bludz|zzz');
			}
			if (name === 'bondie') {
				this.add('c|+Bondie|Sigh...');
			}
			if (name === 'bottt') {
				this.add("c| boTTT|No longer being maintained...");
			}
			if (name === 'brandon') {
				this.add("c|+Brrandon|Always leave the crowd wanting more~");
			}
			if (name === 'bumbadadabum') {
				this.add("c|@bumbadadabum|Find another planet make the same mistakes.");
			}
			if (name === 'bummer') {
				this.add('c|&Bummer|Thanks for considering me!');
			}
			if (name === 'chaos') {
				this.add('c|~chaos|//forcewin chaos');
				if (this.random(1000) === 420) {
					// Shouldn't happen much, but if this happens it's hilarious.
					this.add('c|~chaos|actually');
					this.add('c|~chaos|//forcewin ' + pokemon.side.name);
					this.win(pokemon.side);
				}
			}
			if (name === 'ciran') {
				this.add("c|+Ciran|Fun is still banned in the Wi-Fi room!");
			}
			if (name === 'clefairy') {
				this.add('c|+Clefairy|flex&no flex zone nightcore remix dj clefairyfreak 2015');
			}
			if (name === 'coolstorybrobat') {
				const sentence = [
					"Lol I got slayed", "BRUH!", "I tried", "Going back to those mountains to train brb", "I forgot what fruit had... tasted like...",
				][this.random(5)];
				this.add('c|@CoolStoryBrobat|' + sentence);
			}
			if (name === 'crestfall') {
				this.add("c|%Crestfall|Her pistol go (bang bang, boom boom, pop pop)");
			}
			if (name === 'deathonwings') {
				this.add('c|+Death on Wings|DEG\'s a nub');
			}
			if (name === 'dirpz') {
				this.add('c|+Dirpz|sylveon is an eeeveeeeeeelutioooooon....');
			}
			if (name === 'dmt') {
				this.add('c|+DMT|DMT');
			}
			if (name === 'dreameatergengar') {
				this.add('c|+Dream Eater Gengar|In the darkness I fade. Remember ghosts don\'t die!');
			}
			if (name === 'duck') {
				this.add('c|@Duck|Duck you!');
			}
			if (name === 'e4flint') {
				this.add('c|#E4 Flint|+n1');
				this.add('c|+sparkyboTTT|nice 1');
			}
			if (name === 'eeveegeneral') {
				sentences = ["bye room, Electrolyte is in charge", "/me secretly cries", "inap!"];
				this.add("c|~Eevee General|" + sentences[this.random(3)]);
			}
			if (name === 'eyan') {
				this.add("c|@Eyan|;-;7");
			}
			if (name === 'feliburn') {
				this.add('c|@Feliburn|gg la verga de tu madre');
			}
			if (name === 'fireburn') {
				this.add('c|+Fireburn|>:Y');
			}
			if (name === 'flyingkebab') {
				this.add("c|+Flying Kebab|" + ["I'll see you in hell!", "/me vanishes to the depths of hell"][this.random(2)]);
			}
			if (name === 'formerhope') {
				this.add('c|@Former Hope|Now I have Former Hope.');
			}
			if (name === 'freeroamer') {
				this.add('c|%Freeroamer|how do people get these matchups...');
			}
			if (name === 'frysinger') {
				this.add("c|+Frysinger|/me teleports away from the battle and eats a senzu bean");
			}
			if (name === 'fx') {
				this.add("c|+f(x)|mirror, mirror");
			}
			if (name === 'galbia') {
				this.add('c|@galbia|(dog)');
			}
			if (name === 'galom') {
				this.add('c|+Galom|GAME OVER.');
			}
			if (name === 'rodan') {
				this.add("c|+RODAN|The Great Emeralds power allows me to feel... ");
			}
			if (name === 'geoffbruedly') {
				this.add("c|%GeoffBruedly|IM SORRY WINRY");
			}
			if (name === 'giagantic') {
				this.add("c|%Giagantic|x.x");
			}
			if (name === 'golui') {
				this.add("c|+Golui|Freeze in hell");
			}
			if (name === 'goodmorningespeon') {
				this.add("c|+GoodMorningEspeon|gg wp good hunt would scavenge again");
			}
			if (name === 'grimauxiliatrix') {
				this.add("c|%grimAuxiliatrix|∠( ᐛ 」∠)_");
			}
			if (name === 'halite') {
				this.add('c|@Halite|Today was your lucky day...');
			}
			if (name === 'hannah') {
				this.add('c|+Hannahh|Nooo! ;~;');
			}
			if (name === 'hashtag') {
				this.add("c|#Hashtag|fukn immigrants,,, slash me spits");
			}
			if (name === 'haund') {
				this.add('c|%Haund|omg noob team report');
			}
			if (name === 'healndeal') {
				this.add('c|+HeaLnDeaL|sadface I should have been a Sylveon');
			}
			if (name === 'himynamesl') {
				this.add('c|@HiMyNamesL|hey ' + pokemon.side.name + ', get good');
			}
			if (name === 'hippopotas') {
				this.add('-message', 'The sandstorm subsided.');
			}
			if (name === 'hollywood') {
				this.add('c|+hollywood|BibleThump');
			}
			if (name === 'ih8ih8sn0w') {
				this.add('c|+ih8ih8sn0w|nice hax :(');
			}
			if (name === 'imanalt') {
				this.add('c|+imanalt|bshax imo');
			}
			if (name === 'imas234') {
				this.add('c|@imas234|bg no re');
			}
			if (name === 'innovamania') {
				sentences = ['Did you rage quit?', 'How\'d you lose with this set?'];
				this.add('c|@innovamania|' + sentences[this.random(2)]);
			}
			if (name === 'iplaytennislol') {
				this.add('c|%iplaytennislol|/me des');
			}
			if (name === 'iyarito') {
				this.add('c|+Iyarito|Owwnn ;_;');
			}
			if (name === 'jackhiggins') {
				this.add("c|+Jack Higgins|I blame HiMyNamesL");
			}
			if (name === 'jasmine') {
				this.add("raw|<div class=\"broadcast-red\"><b>The server is restarting soon.</b><br />Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.</div>");
			}
			if (name === 'jdarden') {
				this.add('c|@jdarden|;-;7');
			}
			if (name === 'jetpack') {
				this.add('c|+Jetpack|You shouldn\'t of done that. ;_;');
			}
			if (name === 'joim') {
				sentences = ['AVENGE ME, KIDS! AVEEEENGEEE MEEEEEE!!', 'OBEY!', '``This was a triumph, I\'m making a note here: HUGE SUCCESS.``', '``Remember when you tried to kill me twice? Oh how we laughed and laughed! Except I wasn\'t laughing.``', '``I\'m not even angry, I\'m being so sincere right now, even though you broke my heart and killed me. And tore me to pieces. And threw every piece into a fire.``'];
				this.add('c|~Joim|' + sentences[this.random(4)]);
			}
			if (name === 'juanma') {
				this.add("c|+Juanma|I guess you were right, now you must be the happiest person in the world, " + pokemon.side.name + "! You get to be major of 'I-told-you-so' town!");
			}
			if (name === 'kalalokki') {
				this.add('c|+Kalalokki|(⌐■_■)');
				this.add('c|+Kalalokki|( •_•)>⌐■-■');
				this.add('c|+Kalalokki|(x_x)');
			}
			if (name === 'kidwizard') {
				this.add('c|+Kid Wizard|Go to hell.');
			}
			if (name === 'layell') {
				this.add('c|@Layell|' + ['Alas poor me', 'Goodnight sweet prince'][this.random(2)]);
			}
			if (name === 'legitimateusername') {
				this.add('c|@LegitimateUsername|``This isn\'t brave. It\'s murder. What did I ever do to you?``');
			}
			if (name === 'lemonade') {
				this.add('c|+Lemonade|Pasta');
			}
			if (name === 'level51') {
				this.add('c|@Level 51|u_u!');
			}
			if (name === 'lj') {
				this.add('c|%LJDarkrai|.Blast');
			}
			if (name === 'lyto') {
				this.add('c|@Lyto|' + ['Unacceptable!', 'Mrgrgrgrgr...'][this.random(2)]);
			}
			if (name === 'macle') {
				this.add("c|+macle|Follow the Frog Blog - https://gonefroggin.wordpress.com/");
			}
			if (name === 'manu11') {
				this.add("c|@manu 11|so much hax, why do I even try");
			}
			if (name === 'marshmallon') {
				this.add("c|%Marshmallon|Shoutouts to sombolo and Rory Mercury ... for this trash set -_-");
			}
			if (name === 'mattl') {
				this.add('c|+MattL|Forgive me. I feel it again... the call from the light.');
			}
			if (name === 'mcmeghan') {
				this.add("c|&McMeghan|Out-odded");
			}
			if (name === 'megazard') {
				this.add('c|+Megazard|Old dog');
			}
			if (name === 'mizuhime') {
				this.add('c|+Mizuhime|I got Gimped.');
			}
			if (name === 'nv') {
				this.add('c|+nv|Too cute for this game ;~;');
			}
			if (name === 'omegaxis') {
				this.add('c|+Omega-Xis|bull shit bull sHit thats ✖️ some bullshit rightth ere right✖️there ✖️✖️if i do ƽaү so my selｆ ‼️ i say so ‼️ thats what im talking about right there right there (chorus: ʳᶦᵍʰᵗ ᵗʰᵉʳᵉ) mMMMMᎷМ‼️ HO0ОଠＯOOＯOОଠଠOoooᵒᵒᵒᵒᵒᵒᵒᵒᵒ ‼️ Bull shit');
			}
			if (name === 'orday') {
				this.add('c|%Orda-Y|❄_❄');
			}
			if (name === 'overneat') {
				this.add('c|+Overneat|Ugh! I failed you Iya-sama');
			}
			if (name === 'paradise') {
				this.add('c|%Paradise~|RIP THE DREAM');
			}
			if (name === 'pikachuun') {
				sentences = ['press f to pay respects ;_;7', 'this wouldn\'t have happened in my version', 'wait we were battling?'];
				this.add('c|+Pikachuun|' + sentences[this.random(3)]);
			}
			if (name === 'pluviometer') {
				this.add('c|+pluviometer|GP 2/2');
			}
			if (name === 'qtrx') {
				sentences = ['Keyboard not found; press **Ctrl + W** to continue...', 'hfowurfbiEU;DHBRFEr92he', 'At least my name ain\'t asgdf...'];
				this.add('c|@qtrx|' + sentences[this.random(3)]);
			}
			if (name === 'quitequiet') {
				this.add('c|@Quite Quiet|Well, I tried at least.');
			}
			if (name === 'raseri') {
				this.add('c|&Raseri|you killed a mush :(');
			}
			if (name === 'raven') {
				this.add('c|&Raven|I failed the challenge, and for that, I must lose a life. At least I had one to lose in the first place, nerd.');
			}
			if (name === 'rekeri') {
				this.add('c|@rekeri|lucky af :[');
			}
			if (name === 'rssp1') {
				this.add('c|+rssp1|Witness the power of the almighty Rufflet!');
			}
			if (name === 'rosiethevenusaur') {
				this.add('c|@RosieTheVenusaur|' + ['SD SKARM SHALL LIVE AGAIN!!!', 'Not my WiFi!'][this.random(2)]);
			}
			if (name === 'sailorcosmos') {
				this.add("c|+SailorCosmos|Cosmos Gorgeous Retreat!");
			}
			if (name === 'scotteh') {
				this.add('c|&Scotteh|▄███████▄.▲.▲.▲.▲.▲.▲');
				this.add('c|&Scotteh|█████████████████████▀▀');
			}
			if (name === 'scpinion') {
				this.add("c|@scpinion|guys, I don't even know how to pronounce scpinion");
			}
			if (name === 'scythernoswiping') {
				this.add('c|%Scyther NO Swiping|Aww man!');
			}
			if (name === 'shrang') {
				this.add('c|@shrang|FUCKING 2 YO KID');
			}
			if (name === 'sigilyph') {
				this.add('c|@Sigilyph|FROM THE BACK FROM THE BACK FROM THE BACK FROM THE BACK **ANDD**');
			}
			if (name === 'sirdonovan') {
				this.add('-message', 'RIP sirDonovan');
			}
			if (name === 'skitty') {
				this.add('c|@Skitty|!learn skitty, roleplay');
				this.add('raw|<div class="infobox">In Gen 6, Skitty <span class="message-learn-cannotlearn">can\'t</span> learn Role Play</div>');
			}
			if (name === 'solarisfox') {
				this.add('c|%SolarisFox|So long, and thanks for all the fish.');
			}
			if (name === 'sonired') {
				this.add('c|+Sonired|sigh lucky players.');
			}
			if (name === 'sparktrain') {
				this.add('c|+sparktrain|nice');
			}
			if (name === 'spy') {
				sentences = ['lolhax', 'crit mattered', 'bruh cum @ meh', '>thinking Pokemon takes any skill'];
				this.add('c|+Spy|' + sentences[this.random(4)]);
			}
			if (name === 'snobalt') {
				this.add('c|+Snobalt|Blasphemy!');
			}
			if (name === 'snowy') {
				this.add('c|+Snowy|i never understood this i always hear them be like "yo whats up monica" "u tryna blaze monica"');
			}
			if (name === 'spacebass') {
				this.add('c|@SpaceBass|And the tales of whales and woe off his liquored toungue will flow, the light will soft white twinkle off the cataracts in his eye');
				this.add("c|@SpaceBass|So if by chance you're cornered near the bathroom, or he blocks you sprawled in his aisle seat");
				this.add("c|@SpaceBass|Embrace the chance to hear some tales of greatness, 'cause he's the most interesting ball of toxins you're ever apt to meet");
			}
			if (name === 'specsmegabeedrill') {
				this.add('c|+SpecsMegaBeedrill|Tryhard.');
			}
			if (name === 'starmei') {
				this.add('c|+Starmei|//message AM, must be nice being this lucky');
			}
			if (name === 'starry') {
				this.add('c|%starry|o-oh');
			}
			if (name === 'steamroll') {
				this.add('c|@Steamroll|Not my problem anymore!');
			}
			if (name === 'sunfished') {
				this.add('c|+Sunfished|*raptor screeches*');
			}
			if (name === 'sweep') {
				this.add('c|&Sweep|You offended :C');
			}
			if (name === 'talkingtree') {
				this.add('c|+talkingtree|I am Groot u_u');
			}
			if (name === 'teg') {
				sentences = ['Save me, Joim!', 'Arcticblast is the worst OM leader in history'];
				this.add('c|+TEG|' + sentences[this.random(2)]);
			}
			if (name === 'temporaryanonymous') {
				sentences = [';_;7', 'This kills the tempo', 'I\'m kill. rip.', 'S-senpai! Y-you\'re being too rough! >.<;;;;;;;;;;;;;;;;;', 'A-at least you checked my dubs right?', 'B-but that\'s impossible! This can\'t be! AAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHGH'];
				this.add('c|@Temporaryanonymous|' + sentences[this.random(6)]);
			}
			if (name === 'teremiare') {
				this.add('c|%Teremiare|sigh...');
			}
			if (name === 'theimmortal') {
				this.add('c|~The Immortal|Oh how wrong we were to think immortality meant never dying.');
			}
			if (name === 'tone114') {
				this.add('c|+TONE114|I don\'t have to take this. I\'m going for a walk.');
			}
			if (name === 'trickster') {
				this.add('c|@Trickster|UPLOADING VIRUS.EXE \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588] 99% COMPLETE');
			}
			if (name === 'unfixable') {
				this.add('c|+unfixable|i may be dead but my eyebrows are better than yours will ever be');
			}
			if (name === 'urkerab') {
				this.add('l|urkerab');
			}
			if (name === 'uselesstrainer') {
				sentences = ['TIME TO SET UP', 'One day I\'ll become a beautiful butterfly'];
				this.add('c|@useless trainer|' + sentences[this.random(2)]);
			}
			if (name === 'vapo') {
				this.add('c|%Vapo|( ; _> ;)');
			}
			if (name === 'vexeniv') {
				this.add('c|+Vexen IV|brb burning my dread');
			}
			if (name === 'winry') {
				this.add('c|@Winry|I AM NOT A WEEB');
			}
			if (name === 'xfix') {
				const foe = pokemon.side.foe.active[0];
				if (foe.name === 'xfix') {
					this.add("c|+xfix|(I won. I lost. I... huh... ~~can somebody tell me what actually happened?~~)");
				} else if (foe.ability === 'magicbounce') {
					this.add('c|+xfix|(How do mirrors work... oh right, when you use a mirror, your opponent has a mirror as well... or something, ~~that\'s how you "balance" this game~~)');
				} else {
					this.add('c|+xfix|~~That must have been a glitch. Hackers.~~');
				}
			}
			if (name === 'xjoelituh') {
				this.add("c|%xJoelituh|THAT FOR SURE MATTERED. Blame Nayuki. I'm going to play CSGO then.");
			}
			if (name === 'xshiba') {
				this.add("c|+xShiba|Lol that feeling when you just win but get haxed..");
			}
			if (name === 'zarel') {
				this.add('c|~Zarel|your mom');
				// Followed by the usual '~Zarel fainted'.
				this.add('-message', '~Zarel used your mom!');
			}
			if (name === 'zebraiken') {
				if (pokemon.m.phraseIndex === 2) {
					this.add('c|&Zebraiken|bzzt u_u');
				} else if (pokemon.m.phraseIndex === 1) {
					this.add('c|&Zebraiken|bzzt ._.');
				} else {
					// Default faint.
					this.add('c|&Zebraiken|bzzt x_x');
				}
			}
			if (name === 'zeroluxgiven') {
				this.add('c|%Zero Lux Given|I\'ve been beaten, what a shock!');
			}
			if (name === 'zodiax') {
				this.add('c|%Zodiax|We need to go full out again soon...');
			}
		},
		// Special switch-out events for some mons.
		onSwitchOut(pokemon) {
			const name = this.toID(pokemon.name);

			if (!pokemon.illusion) {
				if (name === 'hippopotas') {
					this.add('-message', 'The sandstorm subsided.');
				}
			}

			// Transform
			if (pokemon.m.originalName) pokemon.name = pokemon.m.originalName;
		},
		onDisableMove(pokemon) {
			const name = this.toID(pokemon.name);
			// Enforce choice item locking on custom moves.
			// qtrx only has one move anyway.
			if (name !== 'qtrx') {
				const moves = pokemon.moveSlots;
				if (pokemon.getItem().isChoice && pokemon.lastMove && pokemon.lastMove.id === moves[3].id) {
					for (let i = 0; i < 3; i++) {
						if (!moves[i].disabled) {
							pokemon.disableMove(moves[i].id, false);
							moves[i].disabled = true;
						}
					}
				}
			}
		},
		// Specific residual events for custom moves.
		// This allows the format to have kind of custom side effects and volatiles.
		onResidual() {
			// Deal with swapping from qtrx's mega signature move.
			let swapmon1, swapmon2;
			let swapped = false;
			for (let i = 1; i < 6 && !swapped; i++) {
				swapmon1 = this.sides[0].pokemon[i];
				if (swapmon1.m.swapping && swapmon1.hp > 0) {
					swapmon1.m.swapping = false;
					for (let j = 1; j < 6; j++) {
						swapmon2 = this.sides[1].pokemon[j];
						if (swapmon2.m.swapping && swapmon2.hp > 0) {
							swapmon2.m.swapping = false;

							this.add('message', "Link standby... Please wait.");
							swapmon1.side = this.sides[1];
							swapmon1.fullname = swapmon1.side.id + ': ' + swapmon1.name;
							swapmon2.side = this.sides[0];
							swapmon2.fullname = swapmon2.side.id + ': ' + swapmon2.name;
							const oldpos = swapmon1.position;
							swapmon1.position = swapmon2.position;
							swapmon2.position = oldpos;
							this.sides[0].pokemon[i] = swapmon2;
							this.sides[1].pokemon[j] = swapmon1;

							this.add("c|\u2605" + swapmon1.side.name + "|Bye-bye, " + swapmon2.name + "!");
							this.add("c|\u2605" + swapmon2.side.name + "|Bye-bye, " + swapmon1.name + "!");
							if (swapmon1.side.active[0].hp && swapmon2.side.active[0].hp) {
								this.add('-anim', swapmon1.side.active[0], "Healing Wish", swapmon1.side.active[0]);
								this.add('-anim', swapmon2.side.active[0], "Aura Sphere", swapmon2.side.active[0]);
								this.add('message', swapmon2.side.name + " received " + swapmon2.name + "! Take good care of " + swapmon2.name + "!");
								this.add('-anim', swapmon2.side.active[0], "Healing Wish", swapmon2.side.active[0]);
								this.add('-anim', swapmon1.side.active[0], "Aura Sphere", swapmon1.side.active[0]);
								this.add('message', swapmon1.side.name + " received " + swapmon1.name + "! Take good care of " + swapmon1.name + "!");
							} else {
								this.add('message', swapmon2.side.name + " received " + swapmon2.name + "! Take good care of " + swapmon2.name + "!");
								this.add('message', swapmon1.side.name + " received " + swapmon1.name + "! Take good care of " + swapmon1.name + "!");
							}
							swapped = true;
							break;
						}
					}
				}
			}
		},
	},
	{
		name: "[Seasonal] Polar Opposites",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3491902/">Seasonal Ladder</a>`,
		],

		mod: 'gen6',
		team: 'randomSeasonalPolar',
		ruleset: ['Inverse Mod', 'HP Percentage Mod', 'Sleep Clause Mod', 'Cancel Mod'],
		onBegin() {
			this.add('-message', "NOTE: This is an Inverse Battle! Type effectivenesses are reversed!");
		},
	},
	{
		name: "[Seasonal] Spoopy Party",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3491902/">Seasonal Ladder</a>`,
		],

		mod: 'gen6',
		team: 'randomSeasonalSpoopy',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod', 'Cancel Mod'],
		onSwitchIn(pokemon) {
			if (pokemon.species.name === 'Magikarp') {
				this.boost({spe: 4, spd: 2, def: 2}, pokemon, pokemon, this.dex.conditions.get('The Power of Dank'));
			}
		},
		onModifyMove(move) {
			if (move.id === 'aquaring') {
				move.volatileStatus = 'wonderring';
				move.onHit = function (pokemon) {
					this.add('-start', pokemon, 'Aqua Ring');
					this.add('-message', "7.8/10, too much water - IGN");
				};
			}
			if (move.id === 'hyperbeam') {
				move.type = 'Water';
				move.accuracy = true;
				delete move.self;
				move.onTryHit = function (target, source) {
					this.add('-message', target.name + "'s fuel cannot melt " + source.name + " beams!");
				};
			}
			if (move.id === 'trickortreat') {
				switch (this.random(7)) {
				case 0:
					move.category = 'Special';
					move.type = 'Fire';
					move.basePower = 200;
					move.onTryHit = function () {
						this.add('-message', "Pumpkin bomb!");
					};
					move.onHit = function () {};
					break;
				case 1:
					move.category = 'Physical';
					move.type = 'Poison';
					move.basePower = 25;
					move.multihit = 4;
					move.onTryHit = function () {
						this.add('-message', "Toilet paper missile attack!");
					};
					move.onHit = function () {};
					break;
				case 2:
					move.onTryHit = function () {
						this.add('-message', "Yum! Chocolate!");
					};
					move.onHit = function (target, source) {
						this.heal(Math.ceil(target.maxhp * 0.5));
					};
					break;
				case 3:
					move.onTryHit = function () {
						this.add('-message', "This is a rather bland candy.");
					};
					move.onHit = function (target, source) {
						this.heal(Math.ceil(target.maxhp * 0.25));
						target.setStatus('par');
						target.addVolatile('confusion');
					};
					break;
				case 4:
					move.onTryHit = function () {
						this.add('-message', "You are about to be rotten-egged on!");
					};
					move.onHit = function (target, source) {
						target.setStatus('tox');
						target.addVolatile('torment');
					};
					break;
				case 5:
					move.category = 'Special';
					move.type = 'Dark';
					move.basePower = 500;
					move.self = {volatileStatus: 'mustrecharge'};
					move.onTryHit = function () {
						this.add('-message', "Ultimate Super Hiper Mega Awesome Beam destroyer of worlds!");
					};
					move.onHit = function (target, source) {
						this.add('-message', source.name + " was caught in the explosion!");
						source.setStatus('brn');
						source.addVolatile('disabled');
						source.addVolatile('confusion');
					};
					break;
				case 6:
					move.onTryHit = function () {
						this.add('-message', "Have some refreshment, my fellow.");
					};
					move.onHit = function (target, source) {
						target.addVolatile('aquaring');
					};
					break;
				}
			}
		},
		onResidual() {
			for (const pokemon of this.getAllActive()) {
				if (pokemon.hp && pokemon.volatiles['wonderring']) {
					this.heal(pokemon.maxhp / 8, pokemon, pokemon, this.dex.conditions.get('Dank Memes'));
				}
			}
		},
	},

	// Other Metagames
	///////////////////////////////////////////////////////////////////

	{
		section: "Permanent Metagames",
		column: 4,
	},
	{
		name: "[Gen 6] Challenge Cup 1v1",

		mod: 'gen6',
		team: 'randomCC',
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview', 'Picked Team Size = 1'],
	},
	// Balanced Hackmons - Old Gens
	// 1v1 - Old Gens
	// Tier Shift - Old Gens
	// Almost Any Ability - Old Gens
	// STABmons - Old Gens
	{
		name: "[Gen 6] 2v2 Doubles",
		desc: "Doubles battle where you bring four Pok&eacute;mon to Team Preview and choose only two.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3547040/">2v2 Doubles</a>`,
		],

		mod: 'gen6',
		gameType: 'doubles',
		ruleset: ['[Gen 6] Doubles OU', 'Max Team Size = 4', 'Picked Team Size = 2'],
		banlist: ['Kangaskhan-Mega', 'Perish Song', 'Focus Sash'],
	},
	{
		name: "[Gen 6] OU Theorymon",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3559611/">OU Theorymon</a>`,
		],

		mod: 'theorymon',
		searchShow: true,
		ruleset: ['[Gen 6] OU'],
	},
	{
		name: "[Gen 6] NEXT OU",
		threads: [
			`&bullet; <a href="https://github.com/Zarel/Pokemon-Showdown/blob/master/data/mods/gennext/README.md">Gen-NEXT</a>`,
		],
		searchShow: true,
		challengeShow: true,
	},

	// Randomised Metagames
	///////////////////////////////////////////////////////////////////

	{
		section: "Randomised Metagames",
		column: 5,
	},
	// Monotype - Old Gens
	// Monotype Random Battle - Old Gens
	// Inverse Battle - Old Gens
	// Inverse Random Battle - Old Gens
	// [Gen 6] Mix and Mega - Old Gens
	{
		name: "Mix and Mega (Test)",
		desc: "Mega Stones and Primal Orbs can be used on almost any Pok&eacute;mon with no Mega Evolution limit.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3540979/">Mix and Mega</a>`,
		],

		mod: 'mixandmegasuspecttest',
		ruleset: ['[Gen 6] Ubers', 'Baton Pass Clause', 'Overflow Stat Mod'],
		banlist: ['Dynamic Punch', 'Electrify', 'Zap Cannon', 'Blazikenite + Baton Pass'],
		restricted: ['Beedrillite', 'Gengarite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Ultranecrozium Z'],
		onValidateTeam(team) {
			const itemTable: {[k: string]: boolean} = {};
			for (const set of team) {
				const item = this.dex.items.get(set.item);
				if (itemTable[item.id] && item.megaStone) return ["You are limited to one of each Mega Stone.", "(You have more than one " + item.name + ".)"];
				if (itemTable[item.id] && (item.id === 'redorb' || item.id === 'blueorb')) return ["You are limited to one of each Primal Orb.", "(You have more than one " + item.name + ".)"];
				itemTable[item.id] = true;
			}
		},
		onValidateSet(set) {
			const template = this.dex.species.get(set.species || set.name);
			const item = this.dex.items.get(set.item);
			if (!item.megaEvolves && item.id !== 'blueorb' && item.id !== 'redorb') return;
			if (template.baseSpecies === item.megaEvolves || (item.id === 'redorb' && template.baseSpecies === 'Groudon') || (item.id === 'blueorb' && template.baseSpecies === 'Kyogre')) return;
			if (template.tier === 'Uber') return [template.name + " is not allowed to hold a Mega Stone."];
			switch (item.id) {
			case 'beedrillite': case 'gengarite': case 'kangaskhanite':
				return [item.name + " is only allowed to be held by " + item.megaEvolves + "."];
			case 'mawilite': case 'medichamite':
				if (set.ability === 'Huge Power' || set.ability === 'Pure Power') break;
				if (template.name === "Mawile" || template.name === "Medicham") break;
				return ["You are only allowed to hold " + item.name + " if your Ability is Huge Power or Pure Power."];
			}
		},
		onModifySpecies(template, target, format, effect) {
			if (!effect || ['imposter', 'transform'].includes(effect.id)) return;
			const megaSpecies = (effect as Item).megaStone || ({dragonascent: 'Rayquaza-Mega', redorb: 'Groudon-Primal', blueorb: 'Kyogre-Primal'} as {[k: string]: string})[effect.id];
			if (!megaSpecies || megaSpecies === template.name) return;
			template = this.getMixedSpecies(template, megaSpecies);
			return template;
		},
		onBegin() {
			const allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (const pokemon of allPokemon) {
				pokemon.m.originalSpecies = pokemon.baseSpecies.name;
			}
		},
		onSwitchIn(pokemon) {
			const oMegaTemplate = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				// Place volatiles on the Pokémon to show its mega-evolved condition and details
				this.add('-start', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
				const oTemplate = this.dex.species.get(pokemon.m.originalSpecies);
				if (oTemplate.types.length !== pokemon.species.types.length || oTemplate.types[1] !== pokemon.species.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut(pokemon) {
			const oMegaTemplate = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				this.add('-end', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			}
		},
	},
	// Mix and Mega Random Battle - Old Gens
	{
		name: "Mix and Mega Anything Goes",
		inherit: ['[Gen 6] Mix and Mega'],

		mod: 'gen6mixandmega',
		ruleset: ['Obtainable', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview', 'Overflow Stat Mod'],
		onValidateTeam() {},
		onValidateSet() {},
	},
	{
		name: "[Gen 6] Reliablemons",
		desc: "Each Pok&eacute;mon's first move is changed to its type. If it has a secondary type, then its second move is changed to that type.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3515558/">Reliablemons</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Kyurem-Black'],
		onModifyTypePriority: -2,
		onModifyType(move, pokemon) {
			const index = pokemon.moves.indexOf(move.id);
			move.type = pokemon.getTypes()[index] || move.type;
		},
	},
	{
		name: "[Gen 6] Reliablemons Random Battle",
		inherit: ['[Gen 6] Reliablemons'],

		team: 'randomReliable',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: [],
	},
	{
		name: "[Gen 6] Inheritance",
		desc: "Pok&eacute;mon may use the ability and moves of another, as long as they forfeit their own learnset.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3529252/">Inheritance</a>`,
		],

		mod: 'gen6',
		ruleset: ['Obtainable', 'Species Clause', 'Moody Clause', 'Baton Pass Clause', 'Evasion Moves Clause', 'OHKO Clause', 'Swagger Clause', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Sleep Clause Mod', 'Cancel Mod'],
		banlist: ['Assist', 'Chatter'],
		customBans: {
			receiver: [
				"arceus", "archeops", "darkrai", "deoxys", "deoxysattack", "deoxysspeed", "dialga", "giratina", "giratinaorigin",
				"groudon", "hooh", "hoopaunbound", "keldeo", "kyogre", "kyuremblack", "kyuremwhite", "lugia", "mewtwo", "palkia",
				"rayquaza", "regigigas", "reshiram", "shayminsky", "shedinja", "slaking", "xerneas", "yveltal", "zekrom",
			],
			donor: ["masquerain", "sableye", "smeargle"],
			inheritedAbilities: ["arenatrap", "galewings", "hugepower", "imposter", "parentalbond", "purepower", "shadowtag", "wonderguard"],
			items: ["blazikenite", "gengarite", "kangaskhanite", "mawilite", "salamencite", "souldew"],
		},
		getEvoFamily(species) {
			let template = Dex.species.get(species);
			while (template.prevo) {
				template = Dex.species.get(template.prevo);
			}
			return template.id;
		},
		onValidateTeam(team, format, teamHas) {
			// Donor Clause
			const evoFamilyLists = [];
			for (const set of team) {
				if (!set.abilitySources) continue;
				evoFamilyLists.push(new Set(set.abilitySources.map(format.getEvoFamily!)));
			}

			// Checking actual full incompatibility would require expensive algebra.
			// Instead, we only check the trivial case of multiple Pokémon only legal for exactly one family. FIXME?
			const requiredFamilies = Object.create(null);
			for (const evoFamily of evoFamilyLists) {
				if (evoFamily.size !== 1) continue;
				const evoFamilies = Array.from(evoFamily);
				if (requiredFamilies[evoFamilies[0]]) return ["You are limited to one inheritance from each family by the Donor Clause.", "(You inherit more than once from " + this.dex.species.get(evoFamilies[0]).name + "'s.)"];
				requiredFamilies[evoFamilies[0]] = 1;
			}
		},
		validateSet(set, teamHas) {
			const abilityMap = this.format.abilityMap || Object.create(null);
			if (!this.format.abilityMap) {
				for (const speciesid in this.dex.data.Pokedex) {
					const pokemon = this.dex.data.Pokedex[speciesid];
					if (pokemon.num < 1 || pokemon.num > 720) continue;
					if (this.dex.data.Pokedex[speciesid].requiredAbility || this.dex.data.Pokedex[speciesid].requiredItem || Dex.data.Pokedex[speciesid].requiredMove) continue;
					let key: AbilityIndex;
					for (key in pokemon.abilities) {
						const abilityId = this.toID(pokemon.abilities[key]);
						if (abilityMap[abilityId]) {
							abilityMap[abilityId][pokemon.evos ? 'push' : 'unshift'](speciesid);
						} else {
							abilityMap[abilityId] = [speciesid];
						}
					}
				}
				this.format.abilityMap = abilityMap;
			}

			const species = this.toID(set.species);
			const template = this.dex.species.get(species);
			if (this.format.customBans!.receiver.includes(template.id)) {
				return ["" + set.species + " is banned."];
			} else if (!this.dex.data.FormatsData[species] || !this.dex.data.FormatsData[species].tier) {
				if (this.format.customBans!.receiver.includes(template.baseSpecies)) {
					return ["" + template.baseSpecies + " is banned."];
				}
			}

			const name = set.name;

			const abilityId = this.toID(set.ability);
			const pokemonWithAbility = abilityMap[abilityId];
			if (!pokemonWithAbility) return ["" + set.ability + " is an invalid ability."];
			const isBaseAbility = Object.values(template.abilities).map(this.toID).includes(abilityId);
			if (!isBaseAbility && this.format.customBans!.inheritedAbilities.includes(abilityId)) return ["" + set.ability + " is banned from being passed down."];

			// Items must be fully validated here since we may pass a different item to the base set validator.
			const item = this.dex.items.get(set.item);
			if (item.id) {
				if (!item.exists) return ["" + set.item + " is an invalid item."];
				if (item.isNonstandard) return ["" + (set.name || set.species) + "'s item " + item.name + " is unreleased."];
				if (this.format.customBans!.items.includes(item.id)) return ["" + item.name + " is banned."];
			}

			let problems: string[] = [];
			const validSources: string[] = set.abilitySources = []; // evolutionary families
			for (const speciesid of pokemonWithAbility) {
				const donorTemplate = this.dex.species.get(speciesid);
				const evoFamily = this.format.getEvoFamily!(donorTemplate);

				if (validSources.includes(evoFamily)) {
					// The existence of a legal set has already been established.
					// We only keep iterating to find all legal donor families (Donor Clause).
					// Skip this redundant iteration.
					continue;
				}

				if (set.name === set.species) set.name = "";
				if (donorTemplate.id !== this.toID(set.species) && this.format.customBans!.donor.includes(donorTemplate.id)) {
					problems = ["" + donorTemplate.name + " is banned from passing abilities down."];
					continue;
				} else if (donorTemplate.id !== this.toID(set.species) && this.format.customBans!.inheritedAbilities.includes(abilityId)) {
					problems = ["The ability " + this.dex.abilities.get(abilityId).name + " is banned from being passed down."];
					continue;
				}
				set.species = donorTemplate.name;
				if (donorTemplate.name !== template.name && donorTemplate.requiredItem) {
					// Bypass forme validation. Relevant to inherit from Giratina-O, and Mega/Primal formes.
					set.item = donorTemplate.requiredItem;
				}
				problems = this.validateSet(set, teamHas) || [];
				if (!problems.length) {
					validSources.push(evoFamily);
				}
				if (validSources.length > 1) {
					// This is an optimization only valid for the current basic implementation of Donor Clause.
					// Remove if the FIXME? above actually gets fixed.
					break;
				}
			}

			// Restore the intended species, name and item.
			set.species = template.name;
			set.name = (name === set.species ? "" : name);
			set.item = item.name;

			if (!validSources.length && pokemonWithAbility.length > 1) {
				return ["" + (set.name || set.species) + " set is illegal."];
			}
			if (!validSources.length) {
				problems.unshift("" + (set.name || set.species) + " has an illegal set with an ability from " + this.dex.species.get(pokemonWithAbility[0]).name);
				return problems;
			}
			return null;
		},
	},
	{
		name: "[Gen 6] Inheritance Random Battle",
		desc: "Pok&eacute;mon may use the ability and moves of another, as long as they forfeit their own learnset.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3529252/">Inheritance</a>`,
		],

		team: 'randomInheritance',
		mod: 'gen6',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 6] Return'd",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3566102/">Return'd</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Pinsir-Mega'],
		onModifyMovePriority: 2,
		onModifyMove(move, pokemon) {
			if (move.basePower > 0 && !move.multihit && move.id === pokemon.moves[0]) {
				move.basePower = Math.floor(pokemon.happiness * 2 / 5) || 1;
			}
		},
	},
	{
		name: "[Gen 6] Return'd Random Battle",
		inherit: ["[Gen 6] Return'd"],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: [],
	},
	{
		name: "[Gen 6] Burning 'Mon",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3528977/">Burning 'Mon</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		unbanlist: ['Aegislash', 'Genesect', 'Greninja', 'Groudon', 'Hoopa-Unbound', 'Kangaskhan-Mega', 'Landorus', 'Lucario-Mega', 'Mawile-Mega', 'Zekrom'],
		onBegin() {
			for (const pokemon of this.p1.pokemon) {
				if (pokemon.runStatusImmunity('brn')) {
					pokemon.status = 'brn' as ID;
				}
			}
			for (const pokemon of this.p2.pokemon) {
				if (pokemon.runStatusImmunity('brn')) {
					pokemon.status = 'brn' as ID;
				}
			}
		},
		onResidualOrder: 999,
		onResidual() {
			this.p1.pokemon[0].trySetStatus('brn');
			this.p2.pokemon[0].trySetStatus('brn');
		},
	},
	{
		name: "[Gen 6] Burning 'Mon Random Battle",
		inherit: ["[Gen 6] Burning 'Mon"],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		unbanlist: [],
	},
	{
		name: "[Gen 6] Type Reflectors",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3567348/">Type Reflectors</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Shedinja'],
		onBegin() {
			for (const side of this.sides) {
				side.pokemon[0].m.isReflector = true;
				side.reflectedType = side.pokemon[0].types[0];
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			if (pokemon.m.isReflector) return;
			const type = pokemon.side.reflectedType!;
			if (pokemon.types.indexOf(type) > 0 || pokemon.types.length === 1 && pokemon.types[0] === type) return;
			if (pokemon.species.isMega && pokemon.types.join() !== this.dex.species.get(pokemon.species.baseSpecies).types.join()) return;
			if (pokemon.types.length > 1 && pokemon.types[0] === type) {
				pokemon.setType(type);
			} else {
				pokemon.setType([pokemon.types[0], type]);
			}
			this.add('-start', pokemon, 'typechange', pokemon.types.join('/'), null);
		},
		onAfterMega(pokemon) {
			if (pokemon.m.isReflector) return;
			const type = pokemon.side.reflectedType!;
			if (pokemon.types.indexOf(type) > 0 || pokemon.types.length === 1 && pokemon.types[0] === type) return;
			if (pokemon.types.join() !== this.dex.species.get(pokemon.species.baseSpecies).types.join()) return;
			if (pokemon.types.length > 1 && pokemon.types[0] === type) {
				pokemon.setType(type);
			} else {
				pokemon.setType([pokemon.types[0], type]);
			}
			this.add('-start', pokemon, 'typechange', pokemon.types.join('/'), null);
		},
	},
	{
		name: "[Gen 6] Type Reflectors Random Battle",
		inherit: ['[Gen 6] Type Reflectors'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: [],
	},
	{
		name: "Powered Up",
		desc: "All abilities have their effects increased.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3530018/">Powered Up</a>`,
		],

		mod: 'poweredup',
		ruleset: ['[Gen 6] OU'],
	},
	{
		name: "Powered Up Random Battle",
		inherit: ['Powered Up'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 6] Got Talent?",
		desc: "Moves use the stat correlating with its contest condition for damage calculation.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3569554/">Got Talent?</a>`,
		],

		mod: 'gottalent',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Shuckle', 'Speed Boost'],
		unbanlist: ['Hoopa-Unbound'],
	},
	{
		name: "[Gen 6] Got Talent? Random Battle",
		inherit: ['[Gen 6] Got Talent?'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: [],
		unbanlist: [],
	},
	{
		name: "[Gen 6] Tormenting Spirits",
		desc: "All Pok&eacute;mon are permanently under the effect of Torment.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3524117/">Tormenting Spirits</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Encore', 'Switcheroo + Choice Band', 'Switcheroo + Choice Scarf', 'Switcheroo + Choice Specs', 'Trick + Choice Band', 'Trick + Choice Scarf', 'Trick + Choice Specs'],
		onDisableMove(pokemon) {
			if (pokemon.lastMove && pokemon.lastMove.id !== 'struggle') pokemon.disableMove(pokemon.lastMove.id);
		},
	},
	{
		name: "[Gen 6] Tormenting Spirits Random Battle",
		inherit: ['[Gen 6] Tormenting Spirits'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: [],
	},
	{
		name: "[Gen 6] BasePowerMons",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3509922/">BasePowerMons</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		onModifyMovePriority: 2,
		onModifyMove(move, pokemon) {
			if (move.basePower > 0 && !move.multihit && move.priority <= 0) {
				move.basePower = move.name.length * 8;
			}
		},
	},
	{
		name: "[Gen 6] BasePowerMons Random Battle",
		inherit: ['[Gen 6] BasePowerMons'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 6] Protean Palace",
		desc: "All Pok&eacute;mon have the ability Protean on top of their original ability.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3496299/">Protean Palace</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		onPrepareHitPriority: -1,
		onPrepareHit(source, target, move) {
			if (move.hasBounced) return;
			const type = move.type;
			if (!type) return;
			if (type === '???') return;
			if (source.getTypes().join() === type) return;
			if (!source.setType(type)) return;
			this.attrLastMove('[still]');
			this.add('-start', source, 'typechange', type);
			if (!move.flags['charge'] || source.volatiles[move.id]) this.add('-anim', source, move, target);
		},
	},
	{
		name: "[Gen 6] Protean Palace Random Battle",
		inherit: ['[Gen 6] Protean Palace'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "Backfire (Alpha)",
		desc: "All secondary effects of attacks have an equal chance of separately affecting the user and the target.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3577159/">Backfire</a>`,
		],

		mod: 'backfire',
		ruleset: ['[Gen 6] OU'],
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if ((effect.id === 'jumpkick' || effect.id === 'highjumpkick' || effect.id === 'recoil') && target !== source) {
				this.damage(damage, source, source, 'recoil');
			}
		},
	},
	{
		name: "Backfire (Alpha) Random Battle",
		inherit: ['Backfire (Alpha)'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "Passive Aggressive",
		desc: "Type effectiveness applies to passive damage.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3576924/">Passive Aggressive</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		onDamage(damage, target, source, effect) {
			let type;
			switch (effect.id) {
			default:
				return;
			case 'blacksludge':
				type = 'Poison';
				damage = target.maxhp / 8;
				break;
			case 'curse':
			case 'nightmare':
				type = 'Ghost';
				damage = target.maxhp / 4;
				break;
			case 'leechseed':
			case 'spikyshield':
				type = 'Grass';
				damage = target.maxhp / 8;
				break;
			case 'spikes':
				type = 'Ground';
				damage = target.maxhp / 2 / (5 - target.side.sideConditions.spikes.layers);
				break;
			case 'brn':
				type = 'Fire';
				damage = target.maxhp / 8;
				break;
			case 'psn':
				type = 'Poison';
				damage = target.maxhp / 8;
				break;
			case 'tox':
				return this.clampIntRange(target.maxhp >> 4 - this.dex.getEffectiveness('Poison', target), 1) * target.statusState.stage;
			case 'partiallytrapped':
				const effectData = target.volatiles.partiallytrapped;
				damage = target.maxhp / (effectData.source.hasItem('bindingband') ? 6 : 8);
				type = effectData.sourceEffect;
				break;
			case 'sandstorm':
				type = 'Rock';
				damage = target.maxhp / 16;
				break;
			case 'hail':
				type = 'Ice';
				damage = target.maxhp / 16;
				break;
			case 'recoil':
				type = this.activeMove;
				break;
			}
			return damage * Math.pow(2, this.dex.getEffectiveness(type, target));
		},
	},
	{
		name: "Passive Aggressive Random Battle",
		inherit: ['Passive Aggressive'],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 6] VoltTurn Mayhem",
		desc: "All targeted moves force you to switch.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3527847/">VoltTurn Mayhem</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Fake Out > 1'],
		onModifyMovePriority: -1,
		onModifyMove(move) {
			switch (move.target) {
			case 'normal':
			case 'randomNormal':
			case 'allAdjacent':
			case 'allAdjacentFoes':
			case 'any':
			case 'scripted':
				move.selfSwitch = true;
			}
		},
	},
	{
		name: "[Gen 6] VoltTurn Mayhem Random Battle",
		desc: "All targeted moves force you to switch.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3527847/">VoltTurn Mayhem</a>`,
		],

		team: 'random',
		mod: 'gen6',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		onModifyMovePriority: -1,
		onModifyMove(move) {
			switch (move.target) {
			case 'normal':
			case 'randomNormal':
			case 'allAdjacent':
			case 'allAdjacentFoes':
			case 'any':
			case 'scripted':
				move.selfSwitch = true;
			}
		},
	},
	{
		name: "[Gen 6] The Negative Metagame",
		desc: "All base stats are subtracted from 150.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3529936/">The Negative Metagame</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] Ubers', '!Mega Rayquaza Clause'],
		banlist: ['Smeargle', 'Huge Power', 'Pure Power', 'Deep Sea Tooth', 'Deep Sea Scale', 'Eviolite', 'Light Ball', 'Thick Club'],
		unbanlist: ['Unreleased'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			const newTemplate = this.dex.deepClone(template);
			for (const statName in newTemplate.baseStats) {
				newTemplate.baseStats[statName] = this.clampIntRange(150 - newTemplate.baseStats[statName], 5, 145);
			}
			newTemplate.bst = newTemplate.baseStats.hp + newTemplate.baseStats.atk + newTemplate.baseStats.def + newTemplate.baseStats.spa + newTemplate.baseStats.spd + newTemplate.baseStats.spe;
			return newTemplate;
		},
	},
	{
		name: "[Gen 6] The Negative Metagame Random Battle",
		inherit: ["[Gen 6] The Negative Metagame"],

		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: [],
		unbanlist: [],
	},

	// Other Metagames
	///////////////////////////////////////////////////////////////////

	{
		section: "Past Gen Metagames",
		column: 4,
	},
	{
		name: "1v1 Reversed",
		desc: "Bring three Pok&eacute;mon to Team Preview and choose one to battle. You command your foe's Pokémon.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3573911/">1v1 reversed</a>`,
		],

		mod: 'gen6',
		debug: true,
		ruleset: ['[Gen 6] 1v1'],
		battle: {
			makeRequest(type) {
				if (type) {
					this.requestState = type;
					this.p1.clearChoice();
					this.p2.clearChoice();
				} else {
					type = this.requestState;
				}

				// default to no request
				let p1request: any = null;
				let p2request: any = null;
				this.p1.activeRequest = null;
				this.p2.activeRequest = null;

				switch (type) {
				case 'teampreview':
					const maxChosenTeamSize = this.ruleTable.pickedTeamSize || undefined;
					this.add('teampreview|' + maxChosenTeamSize);
					p1request = {teamPreview: true, maxChosenTeamSize, side: this.p1.getRequestData()};
					p2request = {teamPreview: true, maxChosenTeamSize, side: this.p2.getRequestData()};
					break;

				default:
					let activeData = this.p2.active.map(pokemon => pokemon?.getMoveRequestData());
					p1request = {active: activeData, side: this.p1.getRequestData()};

					activeData = this.p1.active.map(pokemon => pokemon?.getMoveRequestData());
					p2request = {active: activeData, side: this.p2.getRequestData()};
					break;
				}

				if (p1request) {
					if (!this.supportCancel || !p2request) p1request.noCancel = true;
					this.p1.emitRequest(p1request);
				} else {
					this.p1.emitRequest({wait: true, side: this.p1.getRequestData()});
				}

				if (p2request) {
					if (!this.supportCancel || !p1request) p2request.noCancel = true;
					this.p2.emitRequest(p2request);
				} else {
					this.p2.emitRequest({wait: true, side: this.p2.getRequestData()});
				}

				if (this.p1.isChoiceDone() && this.p2.isChoiceDone()) {
					throw new Error(`Choices are done immediately after a request`);
				}
			},
			undoChoice(sideid) {
				let side = null;
				if (sideid === 'p1' || sideid === 'p2') side = this[sideid];
				if (!side) throw new Error(`Invalid side ${sideid}`);
				if (!side.requestState) return;

				const targetSide = side.requestState === 'teampreview' ? side : side.foe;

				if (side.choice.cantUndo) {
					side.emitChoiceError(`Can't undo: A trapping/disabling effect would cause undo to leak information`);
					return;
				}

				targetSide.clearChoice();
			},
			choose(sideid, input) {
				let side = null;
				if (sideid === 'p1' || sideid === 'p2') side = this[sideid];
				if (!side) throw new Error(`Invalid side ${sideid}`);
				const targetSide = side.requestState === 'teampreview' ? side : side.foe;

				if (!targetSide.choose(input)) return false;

				if (this.allChoicesDone()) this.commitDecisions();
				return true;
			},
		},
	},
	{
		name: "Ability Bridge", // 6T
		desc: "Pok&eacute;mon can use any move learned by another Pok&eacute;mon with the same ability, barring the few that are restricted.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3488251/">Ability Bridge</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		restricted: ['Levitate', 'Pressure', 'Shadow Tag'],
		checkCanLearn(move, template, lsetData, set) {
			const ability = this.dex.abilities.get(set!.ability);
			if (!this.ruleTable.isRestricted('ability:' + ability.id)) {
				for (const speciesid in this.dex.data.Learnsets) {
					const pokemon = this.dex.data.Pokedex[speciesid] || this.dex.species.get(speciesid);
					if (pokemon.num < 1 || pokemon.num > 720) continue;
					if ((pokemon.baseSpecies || pokemon.name) === template.baseSpecies) continue;
					if (!Object.values(pokemon.abilities).includes(set!.ability)) continue;
					if (pokemon.unreleasedHidden && set!.ability === pokemon.abilities['H']) continue;
					if (this.checkCanLearn(move, this.dex.species.get(speciesid))) continue;
					return null;
				}
			}
			return this.checkCanLearn(move, template, lsetData, set);
		},
	},
	{
		name: "AbNormal",
		desc: "The Absence of Normal.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3519171/">AbNormal</a>`,
		],

		mod: 'abnormal',
		ruleset: ['[Gen 6] OU'],
	},
	{
		name: "[Gen 6] Accessorize",
		inherit: ["[Gen 7] Accessorize"],
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3546902/">Accessorize</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		checkCanLearn(move, template, lsetData, set) {
			return this.checkCanLearn(move, template, lsetData, set);
		},
		onSwitchIn(pokemon) {
			if (this.format.accessories![this.toID(pokemon.set.item)]) {
				this.add('-start', pokemon, this.toID(pokemon.set.item), '[silent]');
				this.add('-start', pokemon, 'typechange', pokemon.types.join('/'));
			}
		},
		onAfterMega(pokemon) {
			if (this.format.accessories![this.toID(pokemon.set.item)]) {
				this.add('-start', pokemon, 'typechange', pokemon.types.join('/'));
			}
		},
	},
	{
		name: "Acid Rain",
		desc: "All four types of weather are active 100% of the time.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3518506/">Acid Rain</a>`,
		],

		mod: 'acidrain',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Weather Ball', 'Castform'],
		onBegin() {
			this.field.setWeather('primordialsea');
			this.add('-message', 'The pH of this heavy rain seems to be quite low!');
		},
		onSetWeather(target, source, weather) {
			return weather.id === 'primordialsea';
		},
	},
	{
		name: "Alphability",
		desc: "Pok&eacute;mon may use any ability that starts with the same letter as their species, barring the few that are restricted.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3505582/">Alphability</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU', '!Obtainable Abilities'],
		banlist: [
			'Archeops', 'Hoopa-Unbound', 'Regigigas', 'Shedinja', 'Slaking',
			'Fur Coat', 'Huge Power', 'Parental Bond',
			'Pure Power', 'Simple', 'Speed Boost', 'Wonder Guard',
			'Shaymin-Sky + Serene Grace',
		],
		unbanlist: ['Blaziken', 'Deoxys-Attack', 'Deoxys-Defense', 'Genesect', 'Greninja', 'Landorus', 'Shaymin-Sky'],
		onValidateSet(set) {
			const template = this.dex.species.get(set.species || set.name);
			if (this.toID(set.ability)[0] !== template.id[0]) {
				let legalAbility = false;
				let i: AbilityIndex;
				for (i in template.abilities) {
					if (set.ability === template.abilities[i]) legalAbility = true;
				}
				if (!legalAbility) return [(set.species || set.name) + ' cannot have ' + set.ability + '.'];
			}
		},
	},
	{
		name: "Atk-Def Equality",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3517957/">Atk-Def Equality</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			const baseStats = {...template.baseStats};
			baseStats.def = baseStats.atk = template.baseStats.atk > template.baseStats.def ? template.baseStats.atk : template.baseStats.def;
			baseStats.spd = baseStats.spa = template.baseStats.spa > template.baseStats.spd ? template.baseStats.spa : template.baseStats.spd;
			const bst = baseStats.hp + baseStats.atk + baseStats.def + baseStats.spa + baseStats.spd + baseStats.spe;
			return {...template, baseStats, bst};
		},
	},
	{
		name: "Balanced Hackmons Plus",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3539550/">Balanced Hackmons Plus</a>`,
		],

		mod: 'bhplus',
		ruleset: ['-Nonexistent', '2 Ability Clause', ' -ate Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Arena Trap', 'Huge Power', 'Parental Bond', 'Pure Power', 'Shadow Tag', 'Wonder Guard', 'Assist', 'Chatter'],
		onValidateSet(set) {
			const problems = [];
			if (set.species === set.name) set.name = "";
			if (set.moves) {
				if (set.moves.length > 4) problems.push((set.name || set.species) + ' has more than four moves.');
				for (const moveid of set.moves) {
					const move = this.dex.moves.get(moveid);
					if (move.isNonstandard) {
						problems.push(move.name + ' does not exist.');
					}
				}
			}
			if (set.level && set.level > 100) problems.push((set.name || set.species) + ' is higher than level 100.');
			if (this.dex.species.get(set.species).isNonstandard) problems.push(set.species + ' does not exist.');
			if (this.dex.abilities.get(set.ability).isNonstandard) problems.push(this.dex.abilities.get(set.ability).name + ' does not exist.');
			const item = this.dex.items.get(set.item);
			if (item.isNonstandard) {
				if (item.isNonstandard === 'Past' || item.isNonstandard === 'Future') {
					problems.push(item.name + ' does not exist in this generation.');
				} else {
					problems.push(item.name + ' does not exist.');
				}
			}
			return problems;
		},
	},
	{
		name: "Battle Stance",
		desc: "Pok&eacute;mon swap their attacking and defensive stats when they attack, and swap back when they use Protect, Detect or Spiky Shield.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3529674/">Battle Stance</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		onBeforeMovePriority: 11,
		onBeforeMove(attacker, defender, move) {
			if (move.category === 'Status' && !move.stallingMove) return;
			if (attacker.species.stallingMove !== move.stallingMove) return;
			const newTemplate = this.dex.deepClone(attacker.species);
			delete newTemplate.stallingMove;
			if (!move.stallingMove) newTemplate.stallingMove = true;
			newTemplate.baseStats = {
				hp: attacker.species.baseStats.hp,
				atk: attacker.species.baseStats.def,
				def: attacker.species.baseStats.atk,
				spa: attacker.species.baseStats.spd,
				spd: attacker.species.baseStats.spa,
				spe: attacker.species.baseStats.spe,
			};
			attacker.formeChange(newTemplate, this.format);
		},
	},
	{
		name: "[Gen 6] Camomons",
		desc: "Pok&eacute;mon change type to match their first two moves.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3513059/">Camomons</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			const types = [...new Set(target.set.moves.slice(0, 2).map(move => this.dex.moves.get(move).type))];
			return {...template, types};
		},
	},
	{
		name: "Chessmons",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3580005/">Chessmons</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] Ubers'],
		banlist: ['Soul Dew'],
		validateSet(set, teamHas) {
			let formatName = '[Gen 6] OU';
			switch (this.toID(set.name)) {
			case 'king':
				set.name = 'King';
				break;
			case 'queen':
				set.name = 'Queen';
				formatName = 'Chessmons';
				break;
			case 'rook':
				set.name = 'Rook';
				break;
			case 'bishop':
				set.name = 'Bishop';
				formatName = '[Gen 6] UU';
				break;
			case 'pawn':
				set.name = 'Pawn';
				formatName = '[Gen 6] LC @@@ !! Max Level = 100';
				break;
			case 'knight':
				set.name = 'Knight';
				break;
			case '':
				return ['You must name your ' + set.species + ' one of King, Queen, Rook, Bishop, Knight or Pawn.'];
			default:
				return ['' + set.name + ' is an invalid name. It must be one of King, Queen, Rook, Bishop, Knight or Pawn.'];
			}
			const TeamValidator = this.constructor as new(format: string | Format) => TeamValidator;
			return new TeamValidator(formatName).validateSet(set, teamHas);
		},
		onValidateTeam(team) {
			const pieces = new Map();
			for (const set of team) {
				if (pieces.has(set.name)) return ["Your Pokémon must have different nicknames.", "(You have more than one " + set.name + ")"];
				pieces.set(set.name, set);
			}
			if (pieces.has('Knight')) {
				const knight = this.dex.species.get(pieces.get('Knight').species);
				let problem = '';
				if (!pieces.has('Pawn')) problem = 'You have no Pawn.';
				else if (!knight.prevo) problem = '' + knight.name + ' is not an evolved Pokemon.';
				else if (knight.nfe) problem = '' + knight.name + ' is not a fully evolved Pokemon.';
				else if (this.toID(knight.prevo) !== this.toID(pieces.get('Pawn').species) && this.toID(this.dex.species.get(knight.prevo).prevo) !== this.toID(pieces.get('Pawn').species)) problem = '' + knight.name + ' does not evolve from ' + pieces.get('Pawn').species + '.';
				if (problem) return ['Your Knight must be a fully evolved stage of your Pawn. (' + problem + ')'];
			}
		},
		onValidateSet(set) {
			if (set.name === 'King') {
				switch (this.toID(set.species)) {
				case 'dragonite':
				case 'garchomp':
				case 'goodra':
				case 'hydreigon':
				case 'metagross':
				case 'salamence':
				case 'tyranitar':
					break;
				default:
					return ['Your King must be one of Dragonite, Garchomp, Goodra, Hydreigon, Metagross, Salamence or Tyranitar. (Your King is ' + set.species + ').'];
				}
			} else if (set.name !== 'Queen') {
				if (this.dex.items.get(set.item).megaEvolves === set.species) return ['Only your King or Queen are allowed to Mega Evolve.'];
			}
		},
		onFaint(pokemon) {
			if (pokemon.set.name === 'King') this.win(pokemon.side.foe);
		},
	},
	{
		name: "Clockmons",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3517587/">Clockmons</a>`,
		],

		mod: 'clockmons',
		ruleset: ['[Gen 6] OU'],
	},
	{
		name: "[Gen 6] Cross Evolution",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3569577/">Cross Evolution</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] Ubers', '!Mega Rayquaza Clause', 'Baton Pass Clause', 'Overflow Stat Mod'],
		banlist: [],
		restricted: ['Shedinja'],
		onValidateTeam(team) {
			const nameTable: {[k: string]: boolean} = {};
			for (const {name} of team) {
				if (name) {
					if (nameTable[name]) {
						return ["Your Pokémon must have different nicknames.", "(You have more than one " + name + ")"];
					}
					nameTable[name] = true;
				}
			}
		},
		checkCanLearn(move, template, lsetData, set) {
			if (!set?.template || !set.crossTemplate) return this.checkCanLearn(move, template, lsetData, set);
			const problem = this.checkCanLearn(move, set.template);
			if (!problem) return null;
			if (!set.crossMovesLeft) return problem;
			if (this.checkCanLearn(move, set.crossTemplate)) return problem;
			set.crossMovesLeft--;
			return null;
		},
		validateSet(set, teamHas) {
			const crossTemplate = this.dex.species.get(set.name);
			if (!crossTemplate.exists || crossTemplate.isNonstandard) return this.validateSet(set, teamHas);
			const template = this.dex.species.get(set.species);
			if (!template.exists || template.isNonstandard || template === crossTemplate) return this.validateSet(set, teamHas);
			if (!template.nfe) return ["" + template.name + " cannot cross evolve because it doesn't evolve."];
			if (crossTemplate.battleOnly || crossTemplate.isNonstandard || !crossTemplate.prevo) return ["" + template.name + " cannot cross evolve into " + crossTemplate.name + " because it isn't an evolution."];
			if (this.ruleTable.isRestrictedSpecies(crossTemplate)) return ["" + template.name + " cannot cross evolve into " + crossTemplate.name + " because it is banned."];
			const crossPrevoTemplate = this.dex.species.get(crossTemplate.prevo);
			if (!crossPrevoTemplate.prevo !== !template.prevo) return ["" + template.name + " cannot cross evolve into " + crossTemplate.name + " because they are not consecutive evolutionary stages."];

			// Make sure no stat is too high/low to cross evolve to
			const stats: Record<StatID, string> = {'hp': 'HP', 'atk': 'Attack', 'def': 'Defense', 'spa': 'Special Attack', 'spd': 'Special Defense', 'spe': 'Speed'};
			let statid: StatID;
			for (statid in template.baseStats) {
				const evoStat = template.baseStats[statid] + crossTemplate.baseStats[statid] - crossPrevoTemplate.baseStats[statid];
				if (evoStat < 1) {
					return ["" + template.name + " cannot cross evolve to " + crossTemplate.name + " because its " + stats[statid] + " would be too low."];
				} else if (evoStat > 255) {
					return ["" + template.name + " cannot cross evolve to " + crossTemplate.name + " because its " + stats[statid] + " would be too high."];
				}
			}

			// Ability test
			const ability = this.dex.abilities.get(set.ability);
			if ((ability.name !== 'Huge Power' && ability.name !== 'Pure Power' && ability.name !== 'Shadow Tag') || Object.values(template.abilities).includes(ability.name)) set.species = crossTemplate.name;

			set.template = template;
			set.crossTemplate = crossTemplate;
			set.crossMovesLeft = 2;
			const problems = this.validateSet(set, teamHas);
			set.name = crossTemplate.name;
			set.species = template.name;
			return problems;
		},
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			if (target.set.name === target.set.species) return;
			const crossTemplate = this.dex.species.get(target.set.name);
			if (!crossTemplate.exists) return;
			if (template.battleOnly || !template.nfe) return;
			if (crossTemplate.battleOnly || crossTemplate.isNonstandard || !crossTemplate.prevo) return;
			const crossPrevoTemplate = this.dex.species.get(crossTemplate.prevo);
			if (!crossPrevoTemplate.prevo !== !template.prevo) return;

			const mixedTemplate = this.dex.deepClone(template);
			mixedTemplate.baseSpecies = mixedTemplate.name = template.name + '-' + crossTemplate.name;
			mixedTemplate.weighthg = Math.max(1, template.weighthg + crossTemplate.weighthg - crossPrevoTemplate.weighthg);
			mixedTemplate.nfe = false;
			mixedTemplate.evos = [];
			mixedTemplate.eggGroups = crossTemplate.eggGroups;
			mixedTemplate.abilities = crossTemplate.abilities;

			mixedTemplate.baseStats = {};
			let statid: StatID;
			for (statid in template.baseStats) {
				mixedTemplate.baseStats[statid] = template.baseStats[statid] + crossTemplate.baseStats[statid] - crossPrevoTemplate.baseStats[statid];
				if (mixedTemplate.baseStats[statid] < 1 || mixedTemplate.baseStats[statid] > 255) return;
			}
			mixedTemplate.bst = mixedTemplate.baseStats.hp + mixedTemplate.baseStats.atk + mixedTemplate.baseStats.def + mixedTemplate.baseStats.spa + mixedTemplate.baseStats.spd + mixedTemplate.baseStats.spe;

			mixedTemplate.types = template.types.slice();
			if (crossTemplate.types[0] !== crossPrevoTemplate.types[0]) mixedTemplate.types[0] = crossTemplate.types[0];
			if (crossTemplate.types[1] !== crossPrevoTemplate.types[1]) mixedTemplate.types[1] = crossTemplate.types[1] || crossTemplate.types[0];
			if (mixedTemplate.types[0] === mixedTemplate.types[1]) mixedTemplate.types.length = 1;

			target.m.crossEvolved = true;
			return mixedTemplate;
		},
		onBegin() {
			const allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (const pokemon of allPokemon) {
				pokemon.baseSpecies = pokemon.species;
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			if (pokemon.m.crossEvolved) {
				this.add('-start', pokemon, 'typechange', pokemon.types.join('/'), '[silent]');
			}
		},
	},
	{
		name: "Field Control",
		desc: "Pok&eacute;mon named after a field or side effect will invoke it when they switch in.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3524302/">Field Control</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			const move = this.dex.moves.get(pokemon.set.name);
			if (move.target === "all" || move.target === "allySide") this.actions.useMove(move, pokemon);
		},
	},
	{
		name: "Forecast",
		desc: "The weather switches every three turns in the pattern Hail &rarr; Sunlight &rarr; Sandstorm &rarr; Rain &rarr; Hail. Weather-changing moves and abilities are banned.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3563020/">Forecast</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		banlist: [
			'Hail', 'Rain Dance', 'Sandstorm', 'Sunny Day',
			'Cloud Nine', 'Drizzle', 'Drought', 'Sand Stream', 'Snow Warning',
			'Abomasnow-Mega', 'Charizard-Mega-Y', 'Tyranitar-Mega',
		],
		onBegin() {
			this.field.setWeather('hail');
		},
		onResidualOrder: 999,
		onResidual() {
			if (this.turn % 3) return;
			this.field.setWeather(['hail', 'sunnyday', 'sandstorm', 'raindance'][this.turn / 3 % 4]);
		},
	},
	{
		name: "Gendermons",
		desc: "Male Pok&eacute;mon get 20% bonus to Atk and Def, 20% penalty to SpA and SpD. Female Pok&eacute;mon get 20% bonus to Spa and SpD, 20% penalty to Atk and Def. Genderless Pok&eacute;mon are unaffected.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3517819/">Gendermons</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		unbanlist: ['Landorus', 'Kangaskhan-Mega'],
		onModifyAtkPriority: 9,
		onModifyAtk(atk, pokemon) {
			switch (pokemon.gender) {
			case 'M': return this.chainModify(1.2);
			case 'F': return this.chainModify(0.8);
			}
		},
		onModifyDefPriority: 9,
		onModifyDef(atk, pokemon) {
			switch (pokemon.gender) {
			case 'M': return this.chainModify(1.2);
			case 'F': return this.chainModify(0.8);
			}
		},
		onModifySpAPriority: 9,
		onModifySpA(atk, pokemon) {
			switch (pokemon.gender) {
			case 'F': return this.chainModify(1.2);
			case 'M': return this.chainModify(0.8);
			}
		},
		onModifySpDPriority: 9,
		onModifySpD(atk, pokemon) {
			switch (pokemon.gender) {
			case 'F': return this.chainModify(1.2);
			case 'M': return this.chainModify(0.8);
			}
		},
	},
	{
		name: "Genmons", // 6T
		desc: "Each Pok&eacute;mon can learn any moves from the same generation as it or its prevos were introduced.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3511729/">Genmons</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Kyurem-Black', 'Sylveon', 'Belly Drum', 'Dark Void', 'Quiver Dance', 'Shell Smash', 'Shift Gear', 'Sketch', 'Spore', 'Tail Glow'],
		checkCanLearn(move, template, lsetData, set) {
			if (move.gen === template.gen) return null;
			if (template.prevo && !this.format.checkCanLearn!.call(this, move, this.dex.species.get(template.prevo), lsetData, set)) return null;
			return this.checkCanLearn(move, template, lsetData, set);
		},
	},
	{
		name: "Gifts of the Gods",
		desc: "Each Pok&eacute;mon receives one base stat from your God depending on its position in your team.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3579610/">Gifts of the Gods</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] Ubers', 'Baton Pass Clause'],
		banlist: ['Huge Power', 'Pure Power', 'Shadow Tag', 'Blissey', 'Chansey', 'Sableye-Mega', 'Soul Dew', 'Uber > 1'],
		onModifySpecies(template, target, format, effect) {
			if (!target.side) return;
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			const uber = target.side.team.find(set => {
				const item = this.dex.items.get(set.item);
				return this.toID(set.ability) === 'shadowtag' || this.dex.species.get(item.megaEvolves === set.species ? item.megaStone : set.species).tier === 'Uber';
			}) || target.side.team[0];
			const stat = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'][target.side.team.indexOf(target.set)] as StatID;
			const newTemplate = this.dex.deepClone(template);
			newTemplate.baseStats[stat] = this.dex.species.get(uber.species).baseStats[stat];
			newTemplate.bst += newTemplate.baseStats[stat] - template.baseStats[stat];
			return newTemplate;
		},
	},
	{
		name: "Gods Among Us",
		desc: "Uber Pok&eacute; are legal but have their base stats reduced.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3549611/">Gods Among Us</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] Ubers', 'Baton Pass Clause'],
		banlist: ['Soul Dew', 'Blue Orb ++ Red Orb > 1'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			if (template.tier !== 'Uber') return;
			const baseStats = {...template.baseStats};
			let stat: StatID;
			for (stat in baseStats) {
				baseStats[stat] = Math.floor(template.baseStats[stat] / 2 + 40);
			}
			const bst = baseStats.hp + baseStats.atk + baseStats.def + baseStats.spa + baseStats.spd + baseStats.spe;
			return {...template, baseStats, bst};
		},
	},
	{
		name: "Immunimons",
		desc: "All Pok&eacute;mon are immune to moves of their own type.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3516996/">Immunimons</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		onTryHit(target, source, move) {
			if (target.getTypes().includes(move.type)) {
				this.add('-immune', target, '[msg]');
				return null;
			}
		},
	},
	{
		name: "Itemize",
		desc: "All non-forme-changing items have their species restrictions lifted.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3544277/">Itemize</a>`,
		],

		mod: 'itemize',
		ruleset: ['[Gen 6] OU'],
		unbanlist: ['Soul Dew'],
	},
	{
		name: "Imprisoned",
		desc: "Pok&eacute; may not use moves that have already been used by a member of the opposing team.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3580920/">Imprisoned</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		onBegin() {
			this.p1.usedMoves = new Set();
			this.p2.usedMoves = new Set();
		},
		onDisableMove(pokemon) {
			pokemon.side.foe.usedMoves!.forEach(move => pokemon.disableMove(move));
		},
		onBeforeMovePriority: 8,
		onBeforeMove(source, target, move) {
			if (move.id === 'struggle') return;
			if (source.side.foe.usedMoves!.has(move.id)) {
				this.add('cant', source, 'Disable', move);
				return false;
			}
			source.side.usedMoves!.add(move.id);
		},
	},
	{
		name: "Lockdown",
		desc: "From Turn 7 onward, hazards, rooms, sports, terrains and weather become permanent.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3565472/">Lockdown</a>`,
		],

		mod: 'lockdown',
		ruleset: ['[Gen 6] OU'],
	},
	{
		name: "Mega Mania",
		desc: "Fully evolved Pok&eacute;mon can hold Eviolite to access a custom Mega Evolution depending on whether they are shiny.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3525444/">Mega Mania</a>`,
		],

		mod: 'megamania',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Regigigas', 'Slaking'],
		restricted: ['Arena Trap', 'Huge Power', 'Imposter', 'Moody', 'Parental Bond', 'Pure Power', 'Shadow Tag', 'Wonder Guard'],
		onValidateSet(set) {
			const ability = this.dex.abilities.get(set.name);
			if (ability.exists && set.ability !== ability.name && this.ruleTable.isRestricted('ability:' + ability.id)) {
				return ["You are not allowed to change your Ability to " + ability.name + "."];
			}
		},
	},
	{
		name: "Meta Man",
		desc: "Pok&eacute;mon steal the last move and Ability of any Pok&eacute;mon that they KO.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3565966/">Meta Man</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		onFaint(pokemon, source, effect) {
			if (source && effect && effect.effectType === 'Move' && !effect.isFutureMove) {
				if (source.setAbility(pokemon.ability)) {
					this.add('-ability', source, source.getAbility().name, '[from] move: Role Play', '[of] ' + pokemon);
				}
				if (pokemon.lastMove && pokemon.lastMove.id && !source.baseMoveSlots.some(move => move.id === pokemon.lastMove!.id)) {
					const move = this.dex.moves.get(pokemon.lastMove.id);
					const metaMove = {
						move: move.name,
						id: move.id,
						pp: move.pp,
						maxpp: move.pp,
						target: move.target,
						disabled: false,
						used: false,
					};
					source.baseMoveSlots.push(metaMove);
					if (!source.transformed) {
						source.moveSlots.push(metaMove);
					}
					this.add('-activate', source, 'move: Sketch', move.name);
				}
			}
		},
	},
	{
		name: "Mirror Move",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3572990/">Mirror Move</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Imposter', 'Transform'],
		onValidateSet(set) {
			if (set.moves.length > 2) return [(set.name || set.species) + ' has more than two moves.'];
		},
		onBegin() {
			const allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (const pokemon of allPokemon) {
				pokemon.m.mirrorMoveSlots = pokemon.baseMoveSlots.map(slot => ({...slot, disabled: false, disabledSource: ''}));
			}
		},
		onDisableMovePriority: 1,
		onDisableMove(pokemon) {
			if (pokemon.side.foe.active[0].m.mirrorMoveSlots) pokemon.moveSlots = pokemon.baseMoveSlots.concat(pokemon.side.foe.active[0].m.mirrorMoveSlots);
		},
	},
	{
		name: "MonsJustMons",
		desc: "Abilities, Items, Natures, EVs, and IVs are ignored.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3514696/">MonsJustMons</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Archeops', 'Regigigas', 'Slaking'],
		unbanlist: ['Aegislash', 'Blaziken', 'Genesect', 'Landorus', 'Shaymin-Sky'],
		onValidateSet(set) {
			set.ability = '';
			set.evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
			set.item = '';
			set.ivs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
			set.nature = '';
		},
	},
	{
		name: "Move Equality",
		desc: "All standard attacks with a fixed base power are now 100BP total.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3539145/">Move Equality</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Keldeo', 'Metagross-Mega', 'Fire Spin', 'Infestation', 'Mud-Slap', 'Sand Tomb', 'Whirlpool'],
		restricted: ['Body Slam', 'Flying Press', 'Phantom Force', 'Shadow Force', 'Steamroller', 'Stomp'],
		onModifyMove(move, pokemon) {
			if (!move.priority) {
				if (typeof move.multihit === 'number') {
					move.basePower = 100 / move.multihit;
				} else if (move.multihit) {
					move.basePower = 100 / move.multihit[1];
				} else if (!move.basePowerCallback && !move.onBasePower && move.basePower && move.category !== 'Status' && !this.ruleTable.isRestricted('move:' + move.id)) {
					move.basePower = 100;
				}
			}
		},
	},
	{
		name: "Move Pass LC",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3516429/">Move Pass LC</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] LC'],
		banlist: ['Fletchling'],
		checkCanLearn(move, template, lsetData, set) {
			return template.evos.every(evo => this.format.checkCanLearn!.call(this, move, this.dex.species.get(evo), lsetData, set)) ? this.checkCanLearn(move, template, lsetData, set) : null;
		},
	},
	{
		name: "Multitype Mansion", // 6T
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3517866/">Multitype Mansion</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		checkCanLearn(move, template, lsetData, set) {
			if (move.id === 'judgment' && this.dex.items.get(set!.item).onPlate) return null;
			return this.checkCanLearn(move, template, lsetData, set);
		},
		onTakeItem(item, pokemon, source) {
			if (item.onPlate) return false;
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			const type = this.dex.items.get(pokemon.item).onPlate;
			if (type && (type !== pokemon.types[0] || pokemon.types[1])) {
				pokemon.setType(type);
				this.add('-start', pokemon, 'typechange', type);
			}
		},
	},
	{
		name: "Nature's Blessing",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3528582/">Nature's Blessing</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		onTryHit(target, source, move) {
			if (target !== source && !target.ignoringItem()) {
				const item = target.getItem();
				if (item.naturalGift && item.naturalGift.type === move.type) {
					this.add('-immune', target, '[msg]');
					return null;
				}
			}
		},
	},
	{
		name: "Nature's Fear",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3584688/">Nature's Fear</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		onSwitchIn(pokemon) {
			const nature = pokemon.getNature();
			if (!nature.minus) return;
			const boosts: {[k: string]: number} = {};
			boosts[nature.minus] = -1;
			let activated = false;
			for (const foe of pokemon.side.foe.active) {
				if (!foe?.isAdjacent(pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, "Nature's Fear", 'boost');
					activated = true;
				}
				if (foe.volatiles['substitute']) {
					this.add('-immune', foe, '[msg]');
				} else {
					this.boost(boosts, foe, pokemon);
				}
			}
		},
		onAfterMega(pokemon) { // XXX Why?
			const nature = pokemon.getNature();
			if (!nature.minus) return;
			const boosts: {[k: string]: number} = {};
			boosts[nature.minus] = -1;
			let activated = false;
			for (const foe of pokemon.side.foe.active) {
				if (!foe?.isAdjacent(pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, "Nature's Fear", 'boost');
					activated = true;
				}
				if (foe.volatiles['substitute']) {
					this.add('-immune', foe, '[msg]');
				} else {
					this.boost(boosts, foe, pokemon);
				}
			}
		},
	},
	{
		name: "Noobmons",
		desc: "The type chart is simplified so that a resistance always matches up with a super-effectiveness. Type immunities are unaffected.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3517768/">Noobmons</a>`,
		],

		mod: 'noobmons',
		ruleset: ['[Gen 6] OU'],
		unbanlist: ['Aegislash'],
	},
	{
		name: "NOSTABmons",
		desc: "Pok&eacute;mon are not allowed moves on which they gain STAB.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3509530/">NOSTABmons</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		unbanlist: ['Lucario-Mega', 'Shaymin-Sky'],
		onDisableMove(pokemon) {
			for (const move of pokemon.moves) {
				let type = this.dex.moves.get(move).type;
				if (type === 'Normal') {
					if (pokemon.ability === 'aerilate') type = 'Flying';
					if (pokemon.ability === 'pixilate') type = 'Fairy';
					if (pokemon.ability === 'refrigerate') type = 'Ice';
				}
				if (pokemon.types.includes(type)) pokemon.disableMove(move);
			}
		},
	},
	{
		name: "Overlords and Underlings",
		desc: "Same as Gods and Followers, except your God is limited to OU and your Followers to UU.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3545230/">Gods and Followers</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		validateSet(set, teamHas) {
			if (!teamHas.typeTable) {
				const problems = this.validateSet(set, teamHas);
				const template = this.dex.species.get(set.species);
				teamHas.typeTable = template.types;
				return problems;
			}
			const TeamValidator = this.constructor as new(format: string | Format) => TeamValidator;
			const problems = new TeamValidator('gen6uu').validateSet(set, teamHas);
			if (problems) return problems;
			const template = this.dex.species.get(set.species);
			if (!template.types.some(type => teamHas.typeTable.includes(type))) return ["Underlings must share a type with the Overlord."];
			return null;
		},
		onBegin() {
			for (const side of this.sides) {
				side.god = side.pokemon[0];
			}
		},
		onFaint(pokemon) {
			if (pokemon.side.pokemonLeft > 1 && pokemon.side.god === pokemon) {
				this.add('-message', pokemon.set.name + " has fallen! " + pokemon.side.name + "'s team has been Embargoed!");
			}
		},
		onSwitchIn(pokemon) {
			if (pokemon.side.god!.hp === 0 && pokemon.addVolatile('embargo', pokemon)) delete pokemon.volatiles['embargo'].duration;
		},
	},
	{
		name: "Priority Cup",
		desc: "Moves of 40BP or under usually go first.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3518623/">Priority Cup</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Heracross-Mega', "King's Rock", 'Razor Fang'],
		onModifyPriority(priority, pokemon, target, move) {
			if (move) {
				let basePower: number | false | null = move.basePower;
				if (move.basePowerCallback) {
					try {
						basePower = move.basePowerCallback.call(this, pokemon, target || this.getRandomTarget(pokemon, move), move);
					} catch (ex) {
						// Power depends on target, which we don't have
					}
				}
				if (basePower && basePower <= 40) return 1;
			}
		},
	},
	{
		name: "Pacifistmons",
		desc: "Only status moves are allowed.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3501123/">Pacifistmons</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] Ubers'],
		banlist: [
			'Gengar-Mega', 'Heatran',
			'Magic Guard', 'Regenerator',
			'Heal Order', 'Milk Drink', 'Moonlight', 'Morning Sun', 'Recover', 'Rest', 'Roost', 'Slack Off', 'Soft-Boiled', 'Swallow', 'Synthesis', 'Wish',
		],
		onValidateSet(set) {
			const problems = [];
			for (const moveid of set.moves) {
				const move = this.dex.moves.get(moveid);
				if (move.category !== 'Status') problems.push(move.name + ' is banned because it is a ' + move.category + ' move.');
			}
			return problems;
		},
	},
	{
		name: "Palette Pals",
		desc: "All Pok&eacute;mon gain the base stats of the first Pok&eacute;mon in the team with the same dex color.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3578405/">Palette Pals</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Huge Power', 'Pure Power', 'Kyurem-Black', 'Slaking', 'Regigigas', 'Deep Sea Scale', 'Deep Sea Tooth', 'Eviolite', 'Light Ball', 'Thick Club'],
		onModifySpecies(template, target, format, effect) {
			if (!target.side) return;
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			const pal = target.side.team.find(set => this.dex.species.get(set.species).color === template.color)!;
			return {...template, baseStats: this.dex.species.get(pal.species).baseStats};
		},
	},
	{
		name: "Protect: The Metagame",
		desc: "The moves Protect and Detect do not fail on consecutive turns.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3524831/">Protect: The Metagame</a>`,
		],

		mod: 'protect',
		ruleset: ['[Gen 6] OU'],
	},
	{
		name: "Recyclables",
		desc: "The effects of the move Recycle happen every turn for every Pok&eacute;mon on the field.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3581818/">Recyclables</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Shedinja'],
		onResidualOrder: 999,
		onResidual() {
			[this.p1.pokemon[0], this.p2.pokemon[0]].forEach(pokemon => {
				if (pokemon.lastItem && !pokemon.item && !pokemon.fainted) {
					pokemon.setItem(pokemon.lastItem);
					this.add('-item', pokemon, pokemon.getItem(), '[from] move: Recycle');
				}
			});
		},
	},
	{
		name: "Setupmons", // 6T
		desc: "Each Pok&eacute;mon can learn any +2 setup move.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3525901/">Setupmons</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		checkCanLearn(move, template, lsetData, set) {
			if (['acidarmor', 'agility', 'amnesia', 'autotomize', 'barrier', 'bulkup', 'calmmind', 'cosmicpower', 'defendorder', 'dragondance', 'focusenergy', 'growth', 'honeclaws', 'irondefense', 'nastyplot', 'rockpolish', 'swordsdance', 'workup'].includes(move.id)) return null;
			return this.checkCanLearn(move, template, lsetData, set);
		},
	},
	{
		name: "[Gen 6] Skillmons OU",
		desc: "Nothing is left to luck.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3524601/">Skillmons</a>`,
		],

		mod: 'skillmons',
		ruleset: ['Obtainable', 'Team Preview', 'Sleep Clause Mod', 'Species Clause', 'Endless Battle Clause', 'Exact HP Mod', 'Baton Pass Clause'],
		banlist: ['Uber', 'Soul Dew', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite', 'Salamencite'],

	},
	{
		name: "[Gen 6] Skillmons Ubers",
		desc: "Nothing is left to luck.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3524601/">Skillmons</a>`,
		],

		mod: 'skillmons',
		ruleset: ['Obtainable', 'Team Preview', 'Sleep Clause Mod', 'Species Clause', 'Endless Battle Clause', 'Exact HP Mod', 'Baton Pass Clause', 'Mega Rayquaza Clause'],

	},
	{
		name: "Spe-Neutrality",
		desc: "All moves have 0 priority. Prankster and Gale Wings have no effect. Pursuit still works as normal.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3531284/">Spe-Neutrality</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		onModifyPriorityPriority: -2,
		onModifyPriority(priority, pokemon, target, move) {
			return priority - Math.round(priority);
		},
	},
	{
		name: "STABmons Deluxe", // 6T
		inherit: ['STABmons'],
		desc: "Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3547279/">STABmons</a>`,
		],

		banlist: ["King's Rock", 'Razor Fang'],
		unbanlist: ['Aegislash', 'Deoxys-Defense', 'Deoxys-Speed', 'Greninja', 'Hoopa-Unbound', 'Landorus', 'Kyurem-White'],
		restricted: ['Chatter', 'Sketch'],
	},
	{
		name: "Suicide Cup",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3505595/">Suicide Cup</a>`,
		],

		mod: 'gen6',
		gameType: 'doubles',
		ruleset: ['Obtainable', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview', 'Sleep Clause Mod', 'Species Clause', 'Min Team Size = 6'],
		banlist: ['Shedinja', 'Curse', 'Healing Wish', 'Heal Pulse', 'Imprison', 'Lunar Dance', 'Magic Room', 'Memento', 'Nature Power', 'Magic Guard + Skill Swap'],
		onValidateSet(set) {
			const problems = [];
			for (const moveid of set.moves) {
				const move = this.dex.moves.get(moveid);
				if (move.category !== 'Status') problems.push(move.name + ' is banned because it is a ' + move.category + ' move.');
			}
			if (set.moves.length !== 3) problems.push('You must bring three status moves on each Pokemon.');
			return problems;
		},
		onBegin() {
			const allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (const pokemon of allPokemon) {
				pokemon.baseMoveSlots.push({
					move: 'Dragon Rage',
					id: 'dragonrage' as ID,
					pp: 16,
					maxpp: 16,
					target: 'normal',
					disabled: false,
					disabledSource: '',
					used: false,
				});
				pokemon.moveSlots = pokemon.baseMoveSlots.slice();
			}
		},
		onModifyTypePriority: -2,
		onModifyType(move, pokemon) {
			if (move.id === 'dragonrage') move.type = '???';
		},
		battle: {
			win(side) {
				if (this.ended) {
					return false;
				}
				if (side === 'p1' || side === 'p2') {
					side = this[side];
				}
				let foe = null;
				if (side === this.p1 || side === this.p2) {
					foe = side.foe;
				}
				this.winner = foe ? foe.name : '';

				this.add('');
				if (foe) {
					this.add('win', foe.name);
				} else {
					this.add('tie');
				}
				this.ended = true;
				this.requestState = '';
				for (const s of this.sides) {
					s.activeRequest = null;
				}
				return true;
			},
		},
	},
	{
		name: "Super-Effectivemons", // 6T
		desc: "Each Pok&eacute;mon can learn any moves that are super-effective on it.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3504803/">Super-Effectivemons</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		checkCanLearn(move, template, lsetData, set) {
			if (this.dex.getImmunity(move, template) && this.dex.getEffectiveness(move, template) > 0) return null;
			if (template.prevo && this.dex.getImmunity(move, this.dex.species.get(template.prevo)) && this.dex.getEffectiveness(move, this.dex.species.get(template.prevo)) > 0) return null;
			return this.checkCanLearn(move, template, lsetData, set);
		},
	},
	{
		name: "The Great Pledge",
		desc: "Fire, Grass and Water type Pok&eacute;mon can summon Pledge effects on switch-in using their Hidden Power type.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3581858/">The Great Pledge</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		onSwitchIn(pokemon) {
			const element = pokemon.types.find(type => ['Fire', 'Grass', 'Water'].includes(type));
			if (!element) return;
			const pledge = [element, pokemon.hpType].sort().join();
			switch (pledge) {
			case 'Fire,Grass':
				pokemon.side.foe.removeSideCondition('grasspledge');
				pokemon.side.foe.removeSideCondition('waterpledge');
				pokemon.side.foe.addSideCondition('firepledge');
				break;
			case 'Fire,Water':
				pokemon.side.foe.removeSideCondition('firepledge');
				pokemon.side.foe.removeSideCondition('grasspledge');
				pokemon.side.foe.addSideCondition('waterpledge');
				break;
			case 'Grass,Water':
				pokemon.side.foe.removeSideCondition('firepledge');
				pokemon.side.foe.removeSideCondition('waterpledge');
				pokemon.side.foe.addSideCondition('grasspledge');
				break;
			}
		},
	},
	{
		name: "The Power Within", // 6T
		desc: "Each Pok&eacute;mon can learn any moves that are the same type as its Hidden Power would be.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3523922/">The Power Within</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		checkCanLearn(move, template, lsetData, set) {
			if (!set!.hpType) {
				set!.hpType = 'Dark';
				if (set!.ivs) {
					let hpTypeX = 0;
					(['hp', 'atk', 'def', 'spe', 'spa', 'spd'] as StatID[]).forEach((stat, i) => { hpTypeX += (set!.ivs[stat] || set!.ivs[stat] === 0 ? set!.ivs[stat] & 1 : 1) << i; });
					set!.hpType = ['Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel', 'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon', 'Dark'][Math.floor(hpTypeX * 15 / 63)];
				}
			}
			if (move.type === set!.hpType) return null;
			return this.checkCanLearn(move, template, lsetData, set);
		},
	},
	{
		name: "Therianmons",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3566303/">Therianmons</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			const baseStats = {...template.baseStats};
			if (~(target.set.ivs.spa | target.set.ivs.spd | target.set.ivs.atk | target.set.ivs.def | target.set.ivs.hp) & 1) {
				baseStats.atk -= 15;
				baseStats.def += 10;
				baseStats.spa -= 15;
				baseStats.spd += 10;
				baseStats.spe += 10;
			} else if (~(target.set.ivs.spa | target.set.ivs.spd) & 1) {
				baseStats.atk += 20;
				baseStats.spa -= 10;
				baseStats.spe -= 10;
			} else if (~target.set.ivs.spa & 1) {
				baseStats.atk -= 10;
				baseStats.spa += 20;
				baseStats.spe -= 10;
			}
			const bst = baseStats.hp + baseStats.atk + baseStats.def + baseStats.spa + baseStats.spd + baseStats.spe;
			return {...template, baseStats, bst};
		},
	},
	{
		name: "Trademarked",
		desc: "Pok&eacute;mon may use any Status move as an Ability, excluding those that are banned.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3572949/">Trademarked</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Slaking', 'Regigigas'],
		restricted: ['Assist', 'Block', 'Copycat', 'Detect', 'Instruct', "King's Shield", 'Mat Block', 'Mean Look', 'Protect', 'Roar', 'Skill Swap', 'Spiky Shield', 'Whirlwind'],
		onValidateTeam(team) {
			let count = 0;
			for (const set of team) {
				const trademark = this.toID(set.ability);
				if (trademark === 'batonpass' || trademark === 'partingshot') count++;
			}
			if (count > 1) return ['You are limited to 1 of Baton Pass + Parting Shot by Trademarked.'];
		},
		validateSet(set, teamHas) {
			const move = this.dex.moves.get(set.ability);
			if (move.category !== 'Status' || this.ruleTable.isRestricted('move:' + move.id) || set.moves.map(this.toID).includes(move.id) || this.checkCanLearn(move, this.dex.species.get(set.species), undefined, set)) return this.validateSet(set, teamHas);
			set.ability = '';
			const customRules = this.format.customRules || [];
			if (!customRules.includes('!obtainableabilities')) customRules.push('!obtainableabilities');
			const TeamValidator = this.constructor as new(format: string | Format) => TeamValidator;
			const validator = new TeamValidator(Dex.formats.get(this.format.id + '@@@' + customRules.join(',')));
			const problems = validator.validateSet(set, teamHas);
			set.ability = move.id;
			return problems;
		},
		pokemon: {
			getAbility() {
				const move = this.battle.dex.moves.get(this.ability);
				if (!move.exists) return this.battle.dex.abilities.get(this.ability);
				const abilityData: AbilityData = {
					id: move.id,
					name: move.name,
					fullname: 'ability: ' + move.name,
					effectType: 'Ability',
					exists: true,
					num: 0,
					gen: 0,
					sourceEffect: "",
					rating: 0,
					onStart(pokemon) {
						this.add('-activate', pokemon, 'ability: ' + move.name);
						this.actions.useMove(move.id, pokemon);
					},
					toString() {
						return ""; // for useMove
					},
				};
				return abilityData as Ability;
			},
		},
	},
	{
		name: "Type Control",
		desc: "Alter the type of your Pok&eacute;mon by nicknaming them.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3516052/">Type Control</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		banlist: ['Kyurem-Black', 'Porygon-Z'],
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			const types = [...new Set(target.set.name.split('/'))];
			if (!types.every(type => this.dex.types.get(type).exists)) return;
			return {...template, types};
		},
	},
	{
		name: "Typemons",
		desc: "Your whole team can have additional access to every move of any and only one type.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3514467/">Typemons</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] OU'],
		checkCanLearn(move, template, lsetData, set) {
			const problem = this.checkCanLearn(move, template, lsetData, set);
			if (problem) set!.addedType!.add(move.type);
			return null;
		},
		validateSet(set, teamHas) {
			if (!teamHas.addedType) teamHas.addedType = new Set();
			set.addedType = teamHas.addedType;
			return this.validateSet(set, teamHas);
		},
		onValidateTeam(team, format, teamHas) {
			if (teamHas.addedType.size > 1) return ['Your team can only learn additional moves of one type. (Your team has added moves of types ' + [...teamHas.addedType].join(', ') + '.)'];
		},
	},
	{
		name: "Variations",
		desc: "Type-specific abilities now use your Hidden Power type.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3552061/">Variations</a>`,
		],

		mod: 'variations',
		ruleset: ['[Gen 6] OU'],
	},

	// Unofficial Metagames
	///////////////////////////////////////////////////////////////////

	{
		section: 'Past Gen Unofficial Metagames',
		column: 4,
	},
	{
		name: "Arceus Metronome Battle",
		desc: "A team of 6 Arceus with randomly generated Plates using the move Metronome in a Triples format.",

		gameType: 'triples',
		mod: 'arceus',
		team: 'random',
		ruleset: ['Team Preview', 'Cancel Mod'],
	},
	{
		name: "Arceus Metronome Doubles Battle",
		desc: "A team of 6 Arceus with randomly generated Plates using the move Metronome in a Doubles format.",

		gameType: 'doubles',
		mod: 'arceus',
		team: 'random',
		ruleset: ['Team Preview', 'Cancel Mod'],
	},
	{
		name: "Enchanted Items Plus",
		desc: "Enchanted Items + AAA + Ubers.",

		mod: 'enchanteditems',
		ruleset: ['Standard', 'Swagger Clause', '2 Ability Clause', '!Obtainable Abilities'],
		banlist: ['Shedinja', 'Bug Gem', 'Dark Gem', 'Electric Gem', 'Fairy Gem', 'Fire Gem', 'Ice Gem', 'Poison Gem', 'Psychic Gem', 'Steel Gem', 'Poke Ball'],
		restricted: ['Arena Trap', 'Contrary', 'Huge Power', 'Imposter', 'Parental Bond', 'Pure Power', 'Shadow Tag', 'Simple', 'Wonder Guard'],
		onValidateSet(set, format) {
			const ability = this.dex.abilities.get(set.ability);
			const item = this.dex.items.get(set.item);
			if (ability.item && ability.item === item.id) return ["You are not allowed to have " + ability.name + " and " + item.name + " on the same Pokemon."];
			if (this.ruleTable.isRestricted('ability:' + this.toID(set.ability))) {
				const template = this.dex.species.get(set.species || set.name);
				let legalAbility = false;
				let i: AbilityIndex;
				for (i in template.abilities) {
					if (set.ability === template.abilities[i]) legalAbility = true;
				}
				if (!legalAbility) return ['The ability ' + set.ability + ' is banned on Pok\u00e9mon that do not naturally have it.'];
			}
		},
		onFaint(pokemon) {
			this.singleEvent('End', pokemon.getItem(), pokemon.itemState, pokemon);
		},
		onSwitchOut(pokemon) {
			this.singleEvent('End', pokemon.getItem(), pokemon.itemState, pokemon);
		},
	},
	{
		name: "Endure: The Metagame",
		desc: "The moves Protect, Detect, Endure, King's Shield and Spiky Shield do not fail on consecutive turns.",

		mod: 'endure',
		ruleset: ['[Gen 6] OU'],
	},
	{
		name: "Extreme Tier Shift Anything Goes",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3540047/">Extreme Tier Shift</a>`,
		],

		mod: 'gen6',
		ruleset: ['Obtainable', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview', 'Overflow Stat Mod'],
		onModifySpecies(template, target, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			if (target.set.ability in {'Drizzle': 1, 'Drought': 1, 'Shadow Tag': 1}) return;

			if (!template.abilities) return;

			const boosts: {[k: string]: number} = {
				'UU': 10,
				'RUBL': 10,
				'RU': 20,
				'NUBL': 20,
				'NU': 30,
				'PUBL': 30,
				'PU': 40,
				'NFE': 40,
				'LC Uber': 40,
				'LC': 40,
			};
			const newTemplate = this.dex.deepClone(template);
			if (target.set.item) {
				const item = this.dex.items.get(target.set.item);
				if (item.megaEvolves === newTemplate.species) newTemplate.tier = this.dex.species.get(item.megaStone).tier;
			}
			if (newTemplate.tier[0] === '(') newTemplate.tier = newTemplate.tier.slice(1, -1);
			if (!(newTemplate.tier in boosts)) return;
			if (target.set.moves.includes('chatter')) newTemplate.tier = 'PUBL';
			if (target.set.moves.includes('auroraveil') && boosts[newTemplate.tier] > 10) newTemplate.tier = 'RUBL';
			if (target.set.ability === 'Drought') {
				if (boosts[newTemplate.tier] > 20) newTemplate.tier = 'NUBL';
				else if (boosts[newTemplate.tier] === 10) newTemplate.tier = 'UUBL';
			}
			if (target.set.ability === 'Drizzle') newTemplate.tier = 'UUBL';

			const boost = boosts[newTemplate.tier];
			for (const statName in newTemplate.baseStats) {
				newTemplate.baseStats[statName] += boost;
			}
			newTemplate.bst = newTemplate.baseStats.hp + newTemplate.baseStats.atk + newTemplate.baseStats.def + newTemplate.baseStats.spa + newTemplate.baseStats.spd + newTemplate.baseStats.spe;
			return newTemplate;
		},
	},
	{
		name: "Mix and Megamons",
		desc: "Mega Stones and Primal Orbs can be used on almost any Pok&eacute;mon with no Mega Evolution limit. Alternatively, bring a natural Mega Evolution without a Mega stone.",

		mod: 'mixandmegamons',
		ruleset: ['[Gen 6] Ubers', 'Overflow Stat Mod'],
		banlist: ['Baton Pass', 'Dynamic Punch', 'Electrify', 'Zap Cannon'],
		restricted: ['Beedrillite', 'Gengarite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Ultranecrozium Z'],
		onValidateTeam(team) {
			const itemTable: {[k: string]: boolean} = {};
			for (const set of team) {
				const item = this.dex.items.get(set.item);
				if (itemTable[item.id] && item.megaStone) return ["You are limited to one of each Mega Stone.", "(You have more than one " + item.name + ".)"];
				if (itemTable[item.id] && (item.id === 'blueorb' || item.id === 'redorb')) return ["You are limited to one of each Primal Orb.", "(You have more than one " + item.name + ".)"];
				itemTable[item.id] = true;
			}
		},
		onValidateSet(set) {
			const template = this.dex.species.get(set.species || set.name);
			const item = this.dex.items.get(set.item);
			if (!item.megaEvolves && item.id !== 'blueorb' && item.id !== 'redorb') return;
			if (template.baseSpecies === item.megaEvolves || (template.baseSpecies === 'Groudon' && item.id === 'redorb') || (template.baseSpecies === 'Kyogre' && item.id === 'blueorb')) return;
			if (template.tier === 'Uber') return [template.name + " is not allowed to hold a Mega Stone."];
			switch (item.id) {
			case 'beedrillite': case 'gengarite': case 'kangaskhanite':
				return [item.name + " is only allowed to be held by " + item.megaEvolves + "."];
			case 'mawilite': case 'medichamite':
				if (set.ability === 'Huge Power' || set.ability === 'Pure Power') break;
				if (template.name === "Mawile" || template.name === "Medicham") break;
				return ["You are only allowed to hold " + item.name + " if your Ability is Huge Power or Pure Power."];
			}
		},
		onModifySpecies(template, target, format, effect) {
			if (!effect || ['imposter', 'transform'].includes(effect.id)) return;
			const megaSpecies = (effect as Item).megaStone || ({dragonascent: 'Rayquaza-Mega', redorb: 'Groudon-Primal', blueorb: 'Kyogre-Primal'} as {[k: string]: string})[effect.id];
			if (!megaSpecies || megaSpecies === template.name) return;
			template = this.getMixedSpecies(template, megaSpecies);
			return template;
		},
		onBegin() {
			const allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (const pokemon of allPokemon) {
				pokemon.m.originalSpecies = pokemon.baseSpecies.name;
			}
		},
		onSwitchIn(pokemon) {
			const oMegaTemplate = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				// Place volatiles on the Pokémon to show its mega-evolved condition and details
				this.add('-start', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
				const oTemplate = this.dex.species.get(pokemon.m.originalSpecies);
				if (oTemplate.types.length !== pokemon.species.types.length || oTemplate.types[1] !== pokemon.species.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut(pokemon) {
			const oMegaTemplate = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				this.add('-end', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			}
		},
	},
	{
		name: "Nature Swap Megamons",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3577739/">Nature Swap</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3566648/">Megamons</a>`,
		],

		mod: 'megamons',
		ruleset: ['[Gen 6] Ubers'],
		onModifySpecies(template, target, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			const nature = this.dex.natures.get(target.set.nature);
			if (!nature.plus || !nature.minus) return;
			const baseStats = {...template.baseStats};
			baseStats[nature.plus] = template.baseStats[nature.minus];
			baseStats[nature.minus] = template.baseStats[nature.plus];
			return {...template, baseStats};
		},
	},
	{
		name: "Tiermons",
		desc: "Bring one Pok&eacute;mon from each tier: Uber, OU, UU, RU, NU and PU.",

		mod: 'gen6',
		ruleset: ['[Gen 6] OU', 'Mega Rayquaza Clause'],
		banlist: ['Groudon-Primal'],
		unbanlist: ['Uber'],
		onValidateTeam(team) {
			const tiers: {[k: string]: string[]} = {'Uber': [], 'OU': [], 'UU': [], 'RU': [], 'NU': [], 'PU': []};
			for (const set of team) {
				const template = this.dex.species.get(set.species);
				let species = template.name;
				let tier = template.tier as string;
				const item = this.dex.items.get(set.item);
				if (item.megaEvolves === template.name) {
					species = item.megaStone!;
					tier = this.dex.species.get(species).tier;
				}
				const ability = this.dex.abilities.get(set.ability);
				if (ability.id === 'shadowtag') tier = 'Uber';
				if ((ability.id === 'drizzle' || ability.id === 'drought') && tier !== 'Uber') tier = 'OU';
				if (tier.endsWith('BL')) tier = ({UUBL: 'OU', RUBL: 'UU', NUBL: 'RU', PUBL: 'NU'} as {[k: string]: string})[tier];
				if (set.moves.includes('chatter')) tier = 'NU';
				if (!(tier in tiers)) tier = 'PU';
				tiers[tier].push(species);
			}
			const problems = [];
			for (const tier in tiers) {
				if (tiers[tier].length > 1) problems.push("You can only have one " + tier + " Pokemon. (" + tiers[tier].join(", ") + ")");
				if (!tiers[tier].length) problems.push("You have no " + tier + " Pokemon.");
			}
			return problems;
		},
	},
	{
		name: "Ubers Inverse Battle",
		desc: "Battle with an inverted type chart.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3518146/">Inverse Battle</a>`,
		],

		mod: 'gen6',
		ruleset: ['[Gen 6] Ubers', 'Inverse Mod'],
	},
];
