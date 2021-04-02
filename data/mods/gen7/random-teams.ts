import {RandomTeams, TeamData} from '../../random-teams';
import {PRNG, PRNGSeed} from '../../../sim/prng';
import {Utils} from '../../../lib';
import {toID} from '../../../sim/dex';

export class RandomGen7Teams extends RandomTeams {
	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		super(format, prng);

		this.moveEnforcementCheckers = {
			Bug: movePool => movePool.includes('megahorn') || movePool.includes('pinmissile'),
			Dark: (movePool, hasMove, hasAbility, hasType, counter) => !counter.Dark && !hasAbility['Protean'],
			Dragon: (movePool, hasMove, hasAbility, hasType, counter) => (
				!counter.Dragon &&
				!hasAbility['Aerilate'] && !hasAbility['Pixilate'] &&
				!hasMove['fly'] && !hasMove['rest'] && !hasMove['sleeptalk']
			),
			Electric: (movePool, hasMove, hasAbility, hasType, counter) => !counter.Electric || movePool.includes('thunder'),
			Fairy: (movePool, hasMove, hasAbility, hasType, counter) => (
				!counter.Fairy && !hasType['Flying'] && !hasAbility['Pixilate']
			),
			Fighting: (movePool, hasMove, hasAbility, hasType, counter) => !counter.Fighting || !counter.stab,
			Fire: (movePool, hasMove, hasAbility, hasType, counter) => (
				!counter.Fire || movePool.includes('flareblitz') || movePool.includes('quiverdance')
			),
			Flying: (movePool, hasMove, hasAbility, hasType, counter) => (
				!counter.Flying && (
					hasAbility['Gale Wings'] ||
					hasAbility['Serene Grace'] || (
						hasType['Normal'] && (movePool.includes('beakblast') || movePool.includes('bravebird'))
					)
				)
			),
			Ghost: (movePool, hasMove, hasAbility, hasType, counter) => (
				(!counter.Ghost || movePool.includes('spectralthief')) &&
				!hasType['Dark'] &&
				!hasAbility['Steelworker']
			),
			Grass: (movePool, hasMove, hasAbility, hasType, counter, species) => (
				!counter.Grass && (species.baseStats.atk >= 100 || movePool.includes('leafstorm'))
			),
			Ground: (movePool, hasMove, hasAbility, hasType, counter) => (
				!counter.Ground && !hasMove['rest'] && !hasMove['sleeptalk']
			),
			Ice: (movePool, hasMove, hasAbility, hasType, counter) => (
				!hasAbility['Refrigerate'] && (
					!counter.Ice ||
					movePool.includes('iciclecrash') ||
					(hasAbility['Snow Warning'] && movePool.includes('blizzard'))
				)
			),
			Normal: movePool => movePool.includes('facade'),
			Poison: (movePool, hasMove, hasAbility, hasType, counter) => (
				!counter.Poison &&
				(counter.setupType || hasAbility['Adaptability'] || hasAbility['Sheer Force'] || movePool.includes('gunkshot'))
			),
			Psychic: (movePool, hasMove, hasAbility, hasType, counter, species) => (
				!counter.Psychic && (
					hasAbility['Psychic Surge'] ||
					movePool.includes('psychicfangs') ||
					(!hasType['Flying'] && !hasAbility['Pixilate'] && counter.stab < species.types.length)
				)
			),
			Rock: (movePool, hasMove, hasAbility, hasType, counter, species) => (
				!counter.Rock &&
				!hasType['Fairy'] &&
				(counter.setupType === 'Physical' || species.baseStats.atk >= 105 || hasAbility['Rock Head'])
			),
			Steel: (movePool, hasMove, hasAbility, hasType, counter, species) => (
				!counter.Steel && (species.baseStats.atk >= 100 || hasAbility['Steelworker'])
			),
			Water: (movePool, hasMove, hasAbility, hasType, counter, species) => (
				(!counter.Water && !hasAbility['Protean']) ||
				!counter.stab ||
				movePool.includes('crabhammer')
			),
			Adaptability: (movePool, hasMove, hasAbility, hasType, counter, species) => (
				!counter.setupType &&
				species.types.length > 1 &&
				(!counter[species.types[0]] || !counter[species.types[1]])
			),
			Contrary: (movePool, hasMove, hasAbility, hasType, counter, species) => !counter.contrary && species.name !== 'Shuckle',
			'Slow Start': movePool => movePool.includes('substitute'),
		};
	}

	shouldCullMove(
		move: Move,
		hasType: {[k: string]: true},
		hasMove: {[k: string]: true},
		hasAbility: {[k: string]: true},
		counter: {[k: string]: any},
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		moves: ID[],
		isLead: boolean,
		isDoubles: boolean,
	): {cull: boolean, isSetup?: boolean} {
		const hasRestTalk = hasMove['rest'] && hasMove['sleeptalk'];
		switch (move.id) {
		// Not very useful without their supporting moves
		case 'clangingscales': case 'electricterrain': case 'happyhour': case 'holdhands':
			return {
				cull: !!teamDetails.zMove || hasRestTalk,
				isSetup: move.id === 'happyhour' || move.id === 'holdhands',
			};
		case 'cottonguard': case 'defendorder':
			return {cull: !counter.recovery && !hasMove['rest']};
		case 'bounce': case 'dig': case 'fly':
			return {cull: !!teamDetails.zMove || counter.setupType !== 'Physical'};
		case 'focuspunch':
			return {cull: !hasMove['substitute'] || counter.damagingMoves.length < 2};
		case 'icebeam':
			return {cull: hasAbility['Tinted Lens'] && !!counter.Status};
		case 'perishsong':
			return {cull: !hasMove['protect']};
		case 'reflect':
			if (movePool.length > 1) {
				const screen = movePool.indexOf('lightscreen');
				if (screen >= 0) this.fastPop(movePool, screen);
			}
			return {cull: !hasMove['calmmind'] && !hasMove['lightscreen']};
		case 'rest':
			return {cull: movePool.includes('sleeptalk')};
		case 'sleeptalk':
			if (movePool.length > 1) {
				const rest = movePool.indexOf('rest');
				if (rest >= 0) this.fastPop(movePool, rest);
			}
			return {cull: !hasMove['rest']};
		case 'storedpower':
			return {cull: !counter.setupType};
		case 'switcheroo': case 'trick':
			return {cull: counter.Physical + counter.Special < 3 || ['electroweb', 'snarl', 'suckerpunch'].some(m => hasMove[m])};

		// Set up once and only if we have the moves for it
		case 'bellydrum': case 'bulkup': case 'coil': case 'curse': case 'dragondance': case 'honeclaws': case 'swordsdance':
			return {cull: (
				counter.setupType !== 'Physical' ||
				counter.physicalsetup > 1 ||
				(counter.Physical + counter.physicalpool < 2 && !hasRestTalk) ||
				(move.id === 'bulkup' && hasRestTalk) ||
				(move.id === 'bellydrum' && !hasAbility['Unburden'] && !counter.priority)
			), isSetup: true};
		case 'calmmind': case 'geomancy': case 'nastyplot': case 'quiverdance': case 'tailglow':
			if (hasType['Dark'] && hasMove['darkpulse']) {
				counter.setupType = 'Special';
				return {cull: false, isSetup: true};
			}
			return {cull: (
				counter.setupType !== 'Special' ||
				counter.specialsetup > 1 ||
				(counter.Special + counter.specialpool < 2 && !hasRestTalk)
			), isSetup: true};
		case 'growth': case 'shellsmash': case 'workup':
			return {cull: (
				counter.setupType !== 'Mixed' ||
				counter.mixedsetup > 1 ||
				counter.damagingMoves.length + counter.physicalpool + counter.specialpool < 2 ||
				(move.id === 'growth' && !hasMove['sunnyday'])
			), isSetup: true};
		case 'agility': case 'autotomize': case 'rockpolish': case 'shiftgear':
			return {cull: counter.damagingMoves.length < 2 || hasRestTalk, isSetup: !counter.setupType};
		case 'flamecharge':
			return {cull: hasMove['dracometeor'] || hasMove['overheat'] || counter.damagingMoves.length < 3 && !counter.setupType};

		// Bad after setup
		case 'circlethrow': case 'dragontail':
			return {cull: (
				counter.speedsetup ||
				(isDoubles && hasMove['superpower']) ||
				(counter.setupType && ((!hasMove['rest'] && !hasMove['sleeptalk']) || hasMove['stormthrow'])) ||
				['encore', 'raindance', 'roar', 'trickroom', 'whirlwind'].some(m => hasMove[m]) ||
				(counter[move.type] > 1 && counter.Status > 1) ||
				(hasAbility['Sheer Force'] && !!counter.sheerforce)
			)};
		case 'defog':
			return {cull: counter.setupType || hasMove['spikes'] || hasMove['stealthrock'] || teamDetails.defog};
		case 'fakeout': case 'tailwind':
			return {cull: counter.setupType || ['substitute', 'switcheroo', 'trick'].some(m => hasMove[m])};
		case 'foulplay':
			return {cull: (
				counter.setupType ||
				counter.speedsetup ||
				counter.Dark > 2 ||
				hasMove['clearsmog'] ||
				counter.damagingMoves.length - 1 === counter.priority ||
				hasRestTalk
			)};
		case 'haze': case 'spikes':
			return {cull: counter.setupType || !!counter.speedsetup || hasMove['trickroom']};
		case 'healbell': case 'technoblast':
			return {cull: counter.speedsetup};
		case 'healingwish': case 'memento':
			return {cull: counter.setupType || !!counter.recovery || hasMove['substitute']};
		case 'helpinghand': case 'yawn':
			return {cull: counter.setupType};
		case 'icywind': case 'stringshot':
			return {cull: !!counter.speedsetup || hasMove['trickroom']};
		case 'leechseed': case 'roar': case 'whirlwind':
			return {cull: (
				counter.setupType ||
				!!counter.speedsetup ||
				hasMove['dragontail'] ||
				(isDoubles && (movePool.includes('protect') || movePool.includes('spikyshield')))
			)};
		case 'protect':
			const doublesCondition = (
				hasMove['fakeout'] ||
				(hasMove['tailwind'] && hasMove['roost']) ||
				movePool.includes('bellydrum') ||
				movePool.includes('shellsmash')
			);
			const singlesCondition = counter.setupType && !hasMove['wish'];
			return {cull: (
				(isDoubles ? doublesCondition : singlesCondition) ||
				!!counter.speedsetup ||
				hasMove['rest'] || hasMove['roar'] || hasMove['whirlwind'] ||
				(hasMove['lightscreen'] && hasMove['reflect'])
			)};
		case 'pursuit':
			return {cull: counter.setupType || counter.Status > 1 || counter.Dark > 2 || (hasMove['knockoff'] && !hasType['Dark'])};
		case 'rapidspin':
			return {cull: counter.setupType || teamDetails.rapidSpin};
		case 'reversal':
			return {cull: hasMove['substitute'] && !!teamDetails.zMove};
		case 'seismictoss': case 'superfang':
			return {cull: !hasAbility['Parental Bond'] && (counter.damagingMoves.length > 1 || counter.setupType)};
		case 'stealthrock':
			return {cull: (
				counter.setupType || counter.speedsetup ||
				['rest', 'substitute', 'trickroom'].some(m => hasMove[m]) ||
				teamDetails.stealthRock
			)};
		case 'stickyweb':
			return {cull: !!teamDetails.stickyWeb};
		case 'toxicspikes':
			return {cull: counter.setupType || teamDetails.toxicSpikes};
		case 'trickroom':
			return {cull: (
				counter.setupType ||
				counter.speedsetup ||
				counter.damagingMoves.length < 2 ||
				hasMove['lightscreen'] ||
				hasMove['reflect']
			)};
		case 'uturn':
			return {cull: (
				(hasAbility['Speed Boost'] && hasMove['protect']) ||
				(hasAbility['Protean'] && counter.Status > 2) ||
				counter.setupType ||
				counter.speedsetup || (
					hasType['Bug'] &&
					counter.stab < 2 &&
					counter.damagingMoves.length > 2 &&
					!hasAbility['Adaptability'] &&
					!hasAbility['Download']
				)
			)};
		case 'voltswitch':
			return {cull: (
				counter.setupType ||
				counter.speedsetup ||
				['electricterrain', 'raindance', 'uturn'].some(m => hasMove[m])
			)};

		// Bit redundant to have both
		// Attacks:
		case 'bugbite': case 'bugbuzz': case 'infestation': case 'signalbeam':
			return {cull: hasMove['uturn'] && !counter.setupType && !hasAbility['Tinted Lens']};
		case 'darkestlariat': case 'nightslash':
			return {cull: hasMove['knockoff'] || hasMove['pursuit']};
		case 'darkpulse':
			return {cull: ['crunch', 'knockoff', 'hyperspacefury'].some(m => hasMove[m]) && counter.setupType !== 'Special'};
		case 'suckerpunch':
			return {cull: counter.damagingMoves.length < 2 || hasMove['glare'] || !hasType['Dark'] && counter.Dark > 1};
		case 'dracometeor':
			return {cull: hasRestTalk};
		case 'dragonpulse': case 'spacialrend':
			return {cull: hasMove['dracometeor'] || hasMove['outrage'] || (hasMove['dragontail'] && !counter.setupType)};
		case 'outrage':
			return {cull: (
				hasMove['dragonclaw'] ||
				(hasMove['dracometeor'] && counter.damagingMoves.length < 3) ||
				(hasMove['clangingscales'] && !teamDetails.zMove)
			)};
		case 'thunderbolt':
			return {cull: hasMove['discharge'] || (hasMove['voltswitch'] && hasMove['wildcharge'])};
		case 'moonblast':
			return {cull: isDoubles && hasMove['dazzlinggleam']};
		case 'aurasphere': case 'focusblast':
			return {cull: hasRestTalk || ((hasMove['closecombat'] || hasMove['superpower']) && counter.setupType !== 'Special')};
		case 'drainpunch':
			return {cull: (
				(!hasMove['bulkup'] && (hasMove['closecombat'] || hasMove['highjumpkick'])) ||
				((hasMove['focusblast'] || hasMove['superpower']) && counter.setupType !== 'Physical')
			)};
		case 'closecombat': case 'highjumpkick':
			return {cull: (
				(hasMove['bulkup'] && hasMove['drainpunch']) ||
				(counter.setupType === 'Special' && ['aurasphere', 'focusblast'].some(m => hasMove[m] || movePool.includes(m)))
			)};
		case 'dynamicpunch': case 'vacuumwave':
			return {cull: (hasMove['closecombat'] || hasMove['facade']) && counter.setupType !== 'Special'};
		case 'stormthrow':
			return {cull: hasMove['circlethrow'] && hasRestTalk};
		case 'superpower':
			return {
				cull: (counter.Fighting > 1 && counter.setupType) || (hasRestTalk && !hasAbility['Contrary']),
				isSetup: hasAbility['Contrary'],
			};
		case 'fierydance': case 'heatwave':
			return {cull: hasMove['fireblast'] && (!!counter.Status || isDoubles)};
		case 'firefang': case 'firepunch': case 'flamethrower':
			return {cull: (
				['blazekick', 'heatwave', 'overheat'].some(m => hasMove[m]) ||
				((hasMove['fireblast'] || hasMove['lavaplume']) && counter.setupType !== 'Physical')
			)};
		case 'fireblast': case 'magmastorm':
			return {cull: (
				(hasMove['flareblitz'] && counter.setupType !== 'Special') ||
				(hasMove['lavaplume'] && !counter.setupType && !counter.speedsetup)
			)};
		case 'lavaplume':
			return {cull: hasMove['firepunch'] || hasMove['fireblast'] && (counter.setupType || !!counter.speedsetup)};
		case 'overheat':
			return {cull: ['fireblast', 'flareblitz', 'lavaplume'].some(m => hasMove[m])};
		case 'hurricane':
			return {cull: hasMove['bravebird'] || hasMove['airslash'] && !!counter.Status};
		case 'hex':
			return {cull: !hasMove['thunderwave'] && !hasMove['willowisp']};
		case 'shadowball':
			return {cull: hasMove['darkpulse'] || (hasMove['hex'] && hasMove['willowisp'])};
		case 'shadowclaw':
			return {cull: (
				hasMove['shadowforce'] ||
				hasMove['shadowsneak'] ||
				(hasMove['shadowball'] && counter.setupType !== 'Physical')
			)};
		case 'shadowsneak':
			return {cull: hasMove['trick'] || hasRestTalk || (hasType['Ghost'] && species.types.length > 1 && counter.stab < 2)};
		case 'gigadrain':
			return {cull: (
				hasMove['petaldance'] ||
				hasMove['powerwhip'] ||
				(!isDoubles && hasMove['seedbomb']) ||
				(hasMove['leafstorm'] && counter.Special < 4 && !counter.setupType && !hasMove['trickroom'])
			)};
		case 'leafblade': case 'woodhammer':
			return {cull: (
				(hasMove['gigadrain'] && counter.setupType !== 'Physical') ||
				(hasMove['hornleech'] && counter.setupType)
			)};
		case 'leafstorm':
			return {cull: hasMove['trickroom'] || (isDoubles && hasMove['energyball']) || (counter.Grass > 1 && counter.setupType)};
		case 'seedbomb':
			return {cull: hasMove['leafstorm'] || isDoubles && hasMove['gigadrain']};
		case 'solarbeam':
			return {cull: (!hasAbility['Drought'] && !hasMove['sunnyday']) || hasMove['gigadrain'] || hasMove['leafstorm']};
		case 'bonemerang': case 'precipiceblades':
			return {cull: hasMove['earthquake']};
		case 'earthpower':
			return {cull: hasMove['earthquake'] && counter.setupType !== 'Special'};
		case 'earthquake':
			return {cull: isDoubles && hasMove['highhorsepower']};
		case 'freezedry':
			return {cull: hasMove['icebeam'] || hasMove['icywind'] || counter.stab < 2};
		case 'bodyslam': case 'return':
			return {cull: (
				hasMove['doubleedge'] ||
				(hasMove['glare'] && hasMove['headbutt']) ||
				(move.id === 'return' && hasMove['bodyslam'])
			)};
		case 'endeavor':
			return {cull: !isLead && !hasAbility['Defeatist']};
		case 'explosion':
			return {cull: counter.setupType || hasMove['wish'] || hasAbility['Refrigerate'] && hasMove['freezedry']};
		case 'extremespeed': case 'skyattack':
			return {cull: hasMove['substitute'] || counter.setupType !== 'Physical' && hasMove['vacuumwave']};
		case 'facade':
			return {cull: hasMove['bulkup'] || hasRestTalk};
		case 'hiddenpower':
			return {cull: hasMove['rest'] || !counter.stab && counter.damagingMoves.length < 2};
		case 'hypervoice':
			return {cull: hasMove['blizzard']};
		case 'judgment':
			return {cull: counter.setupType !== 'Special' && counter.stab > 1};
		case 'quickattack':
			return {cull: (
				!!counter.speedsetup ||
				(hasType['Rock'] && !!counter.Status) ||
				hasMove['feint'] ||
				(hasType['Normal'] && !counter.stab)
			)};
		case 'weatherball':
			return {cull: !hasMove['raindance'] && !hasMove['sunnyday']};
		case 'poisonjab':
			return {cull: hasMove['gunkshot']};
		case 'acidspray': case 'sludgewave':
			return {cull: hasMove['poisonjab'] || hasMove['sludgebomb']};
		case 'psychic':
			return {cull: hasMove['psyshock']};
		case 'psychocut': case 'zenheadbutt':
			return {cull: (
				((hasMove['psychic'] || hasMove['psyshock']) && counter.setupType !== 'Physical') ||
				(hasAbility['Contrary'] && !counter.setupType && !!counter.physicalpool)
			)};
		case 'psyshock':
			const psychic = movePool.indexOf('psychic');
			if (psychic >= 0) this.fastPop(movePool, psychic);
			return {cull: false};
		case 'headsmash':
			return {cull: hasMove['stoneedge'] || isDoubles && hasMove['rockslide']};
		case 'rockblast': case 'rockslide':
			return {cull: (hasMove['headsmash'] || hasMove['stoneedge']) && !isDoubles};
		case 'stoneedge':
			return {cull: (
				hasMove['rockslide'] ||
				(hasAbility['Guts'] && !hasMove['dynamicpunch']) ||
				(isDoubles && hasMove['rockslide'])
			)};
		case 'bulletpunch':
			return {cull: hasType['Steel'] && counter.stab < 2 && !hasAbility['Technician']};
		case 'flashcannon':
			return {cull: (hasMove['ironhead'] || hasMove['meteormash']) && counter.setupType !== 'Special'};
		case 'hydropump':
			return {cull: (
				hasMove['liquidation'] ||
				hasMove['waterfall'] ||
				hasRestTalk ||
				(hasMove['scald'] && ((counter.Special < 4 && !hasMove['uturn']) || (species.types.length > 1 && counter.stab < 3)))
			)};
		case 'muddywater':
			return {cull: isDoubles && (hasMove['scald'] || hasMove['hydropump'])};
		case 'originpulse': case 'surf':
			return {cull: hasMove['hydropump'] || hasMove['scald']};
		case 'scald':
			return {cull: ['liquidation', 'waterfall', 'waterpulse'].some(m => hasMove[m])};

		// Status:
		case 'electroweb': case 'stunspore': case 'thunderwave':
			return {cull: (
				counter.setupType ||
				!!counter.speedsetup ||
				hasRestTalk ||
				['discharge', 'spore', 'toxic', 'trickroom', 'yawn'].some(m => hasMove[m])
			)};
		case 'glare': case 'headbutt':
			return {cull: hasMove['bodyslam'] || !hasMove['glare']};
		case 'toxic':
			const otherStatus = ['hypnosis', 'sleeppowder', 'toxicspikes', 'willowisp', 'yawn'].some(m => hasMove[m]);
			return {cull: otherStatus || counter.setupType || hasMove['flamecharge'] || hasMove['raindance']};
		case 'willowisp':
			return {cull: hasMove['scald']};
		case 'raindance':
			return {cull: counter.Physical + counter.Special < 2 || hasRestTalk || (!hasType['Water'] && !counter.Water)};
		case 'sunnyday':
			const cull = (
				counter.Physical + counter.Special < 2 ||
				(!hasAbility['Chlorophyll'] && !hasAbility['Flower Gift'] && !hasMove['solarbeam']) ||
				hasRestTalk
			);

			if (cull && movePool.length > 1) {
				const solarbeam = movePool.indexOf('solarbeam');
				if (solarbeam >= 0) this.fastPop(movePool, solarbeam);
				if (movePool.length > 1) {
					const weatherball = movePool.indexOf('weatherball');
					if (weatherball >= 0) this.fastPop(movePool, weatherball);
				}
			}

			return {cull};
		case 'painsplit': case 'recover': case 'roost': case 'synthesis':
			return {cull: hasMove['leechseed'] || hasMove['rest']};
		case 'substitute':
			return {cull: (
				hasMove['dracometeor'] ||
				(hasMove['leafstorm'] && !hasAbility['Contrary']) ||
				['encore', 'pursuit', 'rest', 'taunt', 'uturn', 'voltswitch', 'whirlwind'].some(m => hasMove[m]) ||
				movePool.includes('copycat')
			)};
		case 'powersplit':
			return {cull: hasMove['guardsplit']};
		case 'wideguard':
			return {cull: hasMove['protect']};
		case 'bravebird':
			// Hurricane > Brave Bird in the rain
			return {cull: (hasMove['raindance'] || hasAbility['Drizzle']) && movePool.includes('hurricane')};
		}
		return {cull: false};
	}

	shouldCullAbility(
		ability: string,
		hasType: {[k: string]: true},
		hasMove: {[k: string]: true},
		hasAbility: {[k: string]: true},
		counter: {[k: string]: any},
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isDoubles: boolean
	) {
		switch (ability) {
		case 'Battle Bond': case 'Dazzling': case 'Flare Boost': case 'Hyper Cutter':
		case 'Ice Body': case 'Innards Out': case 'Moody': case 'Steadfast':
			return true;
		case 'Aerilate': case 'Galvanize': case 'Pixilate': case 'Refrigerate':
			return !counter.Normal;
		case 'Analytic': case 'Download':
			return species.nfe;
		case 'Battle Armor': case 'Sturdy':
			return (!!counter.recoil && !counter.recovery);
		case 'Chlorophyll': case 'Leaf Guard':
			return (
				species.baseStats.spe > 100 ||
				hasAbility['Harvest'] ||
				(!hasMove['sunnyday'] && !teamDetails.sun)
			);
		case 'Competitive':
			return (!counter.Special || hasMove['sleeptalk'] && hasMove['rest']);
		case 'Compound Eyes': case 'No Guard':
			return !counter.inaccurate;
		case 'Contrary': case 'Iron Fist': case 'Skill Link': case 'Strong Jaw':
			return !counter[toID(ability)];
		case 'Defiant': case 'Justified': case 'Moxie':
			return !counter.Physical || hasMove['dragontail'];
		case 'Flash Fire':
			return hasAbility['Drought'];
		case 'Gluttony':
			return !hasMove['bellydrum'];
		case 'Harvest':
			return hasAbility['Frisk'];
		case 'Hustle':
			return counter.Physical < 2;
		case 'Hydration': case 'Rain Dish': case 'Swift Swim':
			return (species.baseStats.spe > 100 || !hasMove['raindance'] && !teamDetails.rain);
		case 'Slush Rush': case 'Snow Cloak':
			return !teamDetails.hail;
		case 'Immunity': case 'Snow Warning':
			return (hasMove['facade'] || hasMove['hypervoice']);
		case 'Intimidate':
			return (hasMove['bodyslam'] || hasMove['rest'] || hasAbility['Reckless'] && counter.recoil > 1);
		case 'Lightning Rod':
			return species.types.includes('Ground');
		case 'Limber':
			return species.types.includes('Electric');
		case 'Liquid Voice':
			return !counter.sound;
		case 'Magic Guard': case 'Speed Boost':
			return (hasAbility['Tinted Lens'] && (!counter.Status || hasMove['uturn']));
		case 'Magician':
			return hasMove['switcheroo'];
		case 'Magnet Pull':
			return (!!counter.Normal || !hasType['Electric'] && !hasMove['earthpower']);
		case 'Mold Breaker':
			return (
				hasMove['acrobatics'] || hasMove['sleeptalk'] ||
				hasAbility['Adaptability'] || hasAbility['Iron Fist'] ||
				(hasAbility['Sheer Force'] && counter.sheerforce)
			);
		case 'Overgrow':
			return !counter.Grass;
		case 'Poison Heal':
			return (hasAbility['Technician'] && !!counter.technician);
		case 'Power Construct':
			return species.baseSpecies !== 'Zygarde' || species.forme === '10%' && !hasMove['substitute'];
		case 'Prankster':
			return !counter.Status;
		case 'Pressure': case 'Synchronize':
			return (counter.Status < 2 || !!counter.recoil || !!species.isMega);
		case 'Regenerator':
			return hasAbility['Magic Guard'];
		case 'Quick Feet':
			return hasMove['bellydrum'];
		case 'Reckless': case 'Rock Head':
			return (!counter.recoil || !!species.isMega);
		case 'Sand Force': case 'Sand Rush': case 'Sand Veil':
			return !teamDetails.sand;
		case 'Scrappy':
			return !species.types.includes('Normal');
		case 'Serene Grace':
			return (!counter.serenegrace || species.name === 'Blissey');
		case 'Sheer Force':
			return (!counter.sheerforce || hasMove['doubleedge'] || hasAbility['Guts'] || !!species.isMega);
		case 'Simple':
			return (!counter.setupType && !hasMove['flamecharge']);
		case 'Solar Power':
			return (!counter.Special || !teamDetails.sun || !!species.isMega);
		case 'Swarm':
			return (!counter.Bug || !!species.isMega);
		case 'Sweet Veil':
			return hasType['Grass'];
		case 'Technician':
			return (!counter.technician || hasMove['tailslap'] || !!species.isMega);
		case 'Tinted Lens':
			return (
				hasMove['protect'] || !!counter.damage ||
				(counter.Status > 2 && !counter.setupType) ||
				hasAbility['Prankster'] ||
				(hasAbility['Magic Guard'] && !!counter.Status)
			);
		case 'Torrent':
			return (!counter.Water || !!species.isMega);
		case 'Unaware':
			return (counter.setupType || hasAbility['Magic Guard']);
		case 'Unburden':
			return (!!species.isMega || hasAbility['Prankster'] || !counter.setupType && !hasMove['acrobatics']);
		case 'Water Absorb':
			return hasMove['raindance'] || ['Drizzle', 'Unaware', 'Volt Absorb'].some(abil => hasAbility[abil]);
		case 'Weak Armor':
			return counter.setupType !== 'Physical';
		}

		return false;
	}

	getHighPriorityItem(
		ability: string,
		hasType: {[k: string]: true},
		hasMove: {[k: string]: true},
		counter: {[k: string]: any},
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		moves: ID[],
		isLead: boolean,
		isDoubles: boolean
	): string | undefined {
		if (species.requiredItems) {
			if (species.baseSpecies === 'Arceus' && (hasMove['judgment'] || !counter[species.types[0]] || teamDetails.zMove)) {
				// Judgment doesn't change type with Z-Crystals
				return species.requiredItems[0];
			}
			return this.sample(species.requiredItems);
		}
		if (species.inheritedItem && (hasMove['judgment'] || hasMove['multiattack'] || hasMove['technoblast'])) {
			return species.inheritedItem;
		}

		// First, the extra high-priority items
		if (ability === 'Levitate' && hasType['Flying']) return 'Air Balloon'; // This is just to amuse Zarel
		if (ability === 'Cheek Pouch') return hasMove['substitute'] ? 'Petaya Berry' : 'Sitrus Berry';
		if (species.name === 'Deoxys-Attack') return (isLead && hasMove['stealthrock']) ? 'Focus Sash' : 'Life Orb';
		if (species.name === 'Farfetch\u2019d') return 'Stick';
		if (species.name === 'Genesect' && hasMove['technoblast']) return 'Douse Drive';
		if (['Cubone', 'Marowak'].includes(species.baseSpecies)) return 'Thick Club';
		if (species.name === 'Pikachu') return 'Light Ball';
		if (species.name === 'Shedinja' || species.name === 'Smeargle') return 'Focus Sash';
		if (species.name === 'Unfezant' && counter.Physical >= 2) return 'Scope Lens';
		if (species.name === 'Unown') return 'Choice Specs';
		if (species.name === 'Wobbuffet') return 'Custap Berry';
		if (ability === 'Harvest' || ability === 'Emergency Exit' && !!counter.Status) return 'Sitrus Berry';
		if (ability === 'Imposter') return 'Choice Scarf';
		if (ability === 'Poison Heal') return 'Toxic Orb';
		if (species.evos.length) return (ability === 'Technician' && counter.Physical >= 4) ? 'Choice Band' : 'Eviolite';
		if (hasMove['switcheroo'] || hasMove['trick']) {
			if (species.baseStats.spe >= 60 && species.baseStats.spe <= 108) {
				return 'Choice Scarf';
			} else {
				return (counter.Physical > counter.Special) ? 'Choice Band' : 'Choice Specs';
			}
		}
		if (hasMove['bellydrum']) {
			if (ability === 'Gluttony') {
				return `${this.sample(['Aguav', 'Figy', 'Iapapa', 'Mago', 'Wiki'])} Berry`;
			} else if (species.baseStats.spe <= 50 && !teamDetails.zMove && this.randomChance(1, 2)) {
				return 'Normalium Z';
			} else {
				return 'Sitrus Berry';
			}
		}
		if (hasMove['copycat'] && counter.Physical >= 3) return 'Choice Band';
		if (hasMove['geomancy'] || hasMove['skyattack']) return 'Power Herb';
		if (hasMove['shellsmash']) return (ability === 'Solid Rock' && !!counter.priority) ? 'Weakness Policy' : 'White Herb';
		if (!hasType['Fire'] && ability !== 'Quick Feet' && ability !== 'Toxic Boost' && (ability === 'Guts' || hasMove['facade'] || hasMove['psychoshift']) && !hasMove['sleeptalk']) {
			return 'Flame Orb';
		}
		if (!hasType['Poison'] && !hasType['Steel'] && (ability === 'Guts' || hasMove['facade'] || hasMove['psychoshift']) && !hasMove['sleeptalk']) {
			return 'Toxic Orb';
		}
		if (
			(ability === 'Magic Guard' && counter.damagingMoves.length > 1) ||
			(ability === 'Sheer Force' && counter.sheerforce)
		) {
			return 'Life Orb';
		}
		if (ability === 'Unburden') return hasMove['fakeout'] ? 'Normal Gem' : 'Sitrus Berry';
		if (hasMove['acrobatics']) return '';
		if (hasMove['electricterrain'] || ability === 'Electric Surge' && hasMove['thunderbolt']) return 'Electrium Z';
		if (hasMove['happyhour'] || hasMove['holdhands'] || (hasMove['encore'] && ability === 'Contrary')) return 'Normalium Z';
		if (hasMove['raindance']) {
			if (species.baseSpecies === 'Castform' && !teamDetails.zMove) {
				return 'Waterium Z';
			} else {
				return (ability === 'Forecast') ? 'Damp Rock' : 'Life Orb';
			}
		}
		if (hasMove['sunnyday']) {
			if ((species.baseSpecies === 'Castform' || species.baseSpecies === 'Cherrim') && !teamDetails.zMove) {
				return 'Firium Z';
			} else {
				return (ability === 'Forecast') ? 'Heat Rock' : 'Life Orb';
			}
		}

		if (hasMove['solarbeam'] && ability !== 'Drought' && !hasMove['sunnyday'] && !teamDetails.sun) {
			return !teamDetails.zMove ? 'Grassium Z' : 'Power Herb';
		}

		if (hasMove['auroraveil'] || hasMove['lightscreen'] && hasMove['reflect']) return 'Light Clay';
		if (
			hasMove['rest'] && !hasMove['sleeptalk'] &&
			ability !== 'Natural Cure' && ability !== 'Shed Skin' && ability !== 'Shadow Tag'
		) {
			return 'Chesto Berry';
		}

		// Z-Moves
		if (!teamDetails.zMove) {
			if (species.name === 'Decidueye' && hasMove['spiritshackle'] && counter.setupType) {
				return 'Decidium Z';
			}
			if (species.name === 'Kommo-o') return hasMove['clangingscales'] ? 'Kommonium Z' : 'Dragonium Z';
			if (species.baseSpecies === 'Lycanroc' && hasMove['stoneedge'] && counter.setupType) {
				return 'Lycanium Z';
			}
			if (species.name === 'Marshadow' && hasMove['spectralthief'] && counter.setupType) {
				return 'Marshadium Z';
			}
			if (species.name === 'Necrozma-Dusk-Mane' || species.name === 'Necrozma-Dawn-Wings') {
				if (hasMove['autotomize'] && hasMove['sunsteelstrike']) {
					return 'Solganium Z';
				} else if (hasMove['trickroom'] && hasMove['moongeistbeam']) {
					return 'Lunalium Z';
				} else {
					return 'Ultranecrozium Z';
				}
			}

			if (
				!isDoubles &&
				species.name === 'Porygon-Z' &&
				hasMove['nastyplot'] &&
				!hasMove['trick'] &&
				!['nastyplot', 'icebeam', 'triattack'].includes(moves[0])
			) {
				return 'Normalium Z';
			}

			if (species.name === 'Mimikyu' && hasMove['playrough'] && counter.setupType) return 'Mimikium Z';
			if (species.name === 'Raichu-Alola' && hasMove['thunderbolt'] && counter.setupType) return 'Aloraichium Z';
			if (hasMove['bugbuzz'] && counter.setupType && species.baseStats.spa > 100) return 'Buginium Z';
			if (
				(hasMove['darkpulse'] && ability === 'Fur Coat' && counter.setupType) ||
				(hasMove['suckerpunch'] && ability === 'Moxie' && counter.Dark < 2)
			) {
				return 'Darkinium Z';
			}
			if (hasMove['outrage'] && counter.setupType && !hasMove['fly']) return 'Dragonium Z';
			if (hasMove['fleurcannon'] && !!counter.speedsetup) return 'Fairium Z';
			if (
				(hasMove['focusblast'] && hasType['Fighting'] && counter.setupType) ||
				(hasMove['reversal'] && hasMove['substitute'])
			) {
				return 'Fightinium Z';
			}
			if (
				hasMove['fly'] ||
				(hasMove['hurricane'] && species.baseStats.spa >= 125 && (!!counter.Status || hasMove['superpower'])) ||
				((hasMove['bounce'] || hasMove['bravebird']) && counter.setupType)
			) {
				return 'Flyinium Z';
			}
			if (hasMove['shadowball'] && counter.setupType && ability === 'Beast Boost') return 'Ghostium Z';
			if (
				hasMove['sleeppowder'] && hasType['Grass'] &&
				counter.setupType && species.baseStats.spe <= 70
			) {
				return 'Grassium Z';
			}
			if (hasMove['magmastorm']) return 'Firium Z';
			if (hasMove['dig']) return 'Groundium Z';
			if (hasMove['photongeyser'] && counter.setupType) return 'Psychium Z';
			if (hasMove['stoneedge'] && hasType['Rock'] && hasMove['swordsdance']) return 'Rockium Z';
			if (hasMove['hydropump'] && ability === 'Battle Bond' && hasMove['uturn']) return 'Waterium Z';
			if ((hasMove['hail'] || (hasMove['blizzard'] && ability !== 'Snow Warning'))) return 'Icium Z';
		}
	}

	getMediumPriorityItem(
		ability: string,
		hasMove: {[k: string]: true},
		counter: {[k: string]: any},
		species: Species,
		moves: ID[],
		isDoubles: boolean,
		isLead: boolean,
	): string | undefined {
		const defensiveStatTotal = species.baseStats.hp + species.baseStats.def + species.baseStats.spd;

		if (
			(ability === 'Speed Boost' || ability === 'Stance Change' || species.name === 'Pheromosa') &&
			counter.Physical + counter.Special > 2 &&
			!hasMove['uturn']
		) {
			return 'Life Orb';
		}

		if (isDoubles && hasMove['uturn'] && counter.Physical === 4 && !hasMove['fakeout']) {
			return (
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				!counter.priority && this.randomChance(1, 2)
			) ? 'Choice Scarf' : 'Choice Band';
		}
		if (isDoubles && counter.Special === 4 && hasMove['waterspout'] || hasMove['eruption']) return 'Choice Scarf';

		if (
			!isDoubles &&
			counter.Physical >= 4 &&
			['bodyslam', 'dragontail', 'fakeout', 'flamecharge', 'rapidspin', 'suckerpunch'].every(m => !hasMove[m])
		) {
			return (
				(species.baseStats.atk >= 100 || ability === 'Huge Power') &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				!counter.priority &&
				this.randomChance(2, 3)
			) ? 'Choice Scarf' : 'Choice Band';
		}
		if (
			!isDoubles &&
			(counter.Special >= 4 || (counter.Special >= 3 && hasMove['uturn'])) &&
			!hasMove['acidspray'] && !hasMove['clearsmog']
		) {
			return (
				species.baseStats.spa >= 100 &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				ability !== 'Tinted Lens' &&
				!counter.Physical && !counter.priority &&
				this.randomChance(2, 3)
			) ? 'Choice Scarf' : 'Choice Specs';
		}
		if (
			!isDoubles &&
			counter.Physical >= 3 &&
			hasMove['defog'] &&
			!hasMove['foulplay'] &&
			species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
			!counter.priority
		) {
			return 'Choice Scarf';
		}
		if (!isDoubles && (
			ability === 'Drizzle' ||
			ability === 'Slow Start' ||
			species.name.includes('Rotom-') ||
			['aromatherapy', 'bite', 'clearsmog', 'curse', 'protect', 'sleeptalk'].some(m => hasMove[m]))
		) {
			return 'Leftovers';
		}
		if (['endeavor', 'flail', 'reversal'].some(m => hasMove[m]) && ability !== 'Sturdy') {
			return (ability === 'Defeatist') ? 'Expert Belt' : 'Focus Sash';
		}
		if (hasMove['outrage'] && counter.setupType) return 'Lum Berry';
		if (
			isDoubles &&
			counter.damagingMoves.length >= 3 &&
			species.baseStats.spe >= 70 &&
			ability !== 'Multiscale' && ability !== 'Sturdy' && [
				'acidspray', 'electroweb', 'fakeout', 'feint', 'flamecharge', 'icywind',
				'incinerate', 'naturesmadness', 'rapidspin', 'snarl', 'suckerpunch', 'uturn',
			].every(m => !hasMove[m])
		) {
			return defensiveStatTotal >= 275 ? 'Sitrus Berry' : 'Life Orb';
		}

		if (hasMove['substitute']) return counter.damagingMoves.length > 2 && !!counter.drain ? 'Life Orb' : 'Leftovers';
		if (
			!isDoubles &&
			this.dex.getEffectiveness('Ground', species) >= 2 &&
			ability !== 'Levitate' &&
			!hasMove['magnetrise']
		) {
			return 'Air Balloon';
		}
		if ((ability === 'Iron Barbs' || ability === 'Rough Skin') && this.randomChance(1, 2)) return 'Rocky Helmet';
		if (
			counter.Physical + counter.Special >= 4 &&
			species.baseStats.spd >= 50 && defensiveStatTotal >= 235
		) {
			return 'Assault Vest';
		}
		if (species.name === 'Palkia' && (hasMove['dracometeor'] || hasMove['spacialrend']) && hasMove['hydropump']) {
			return 'Lustrous Orb';
		}
		if (counter.damagingMoves.length >= 4) {
			return (counter.Dragon || counter.Dark || counter.Normal) ? 'Life Orb' : 'Expert Belt';
		}
		if (counter.damagingMoves.length >= 3 && !!counter.speedsetup && defensiveStatTotal >= 300) return 'Weakness Policy';
		if (
			!isDoubles && isLead &&
			!['Regenerator', 'Sturdy'].includes(ability) &&
			!counter.recoil && !counter.recovery &&
			defensiveStatTotal < 255
		) {
			return 'Focus Sash';
		}
	}

	getLowPriorityItem(
		ability: string,
		hasType: {[k: string]: true},
		hasMove: {[k: string]: true},
		hasAbility: {[k: string]: true},
		counter: {[k: string]: any},
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean
	): string | undefined {
		// This is the "REALLY can't think of a good item" cutoff
		if (hasMove['stickyweb'] && ability === 'Sturdy') return 'Mental Herb';
		if (ability === 'Serene Grace' && hasMove['airslash'] && species.baseStats.spe > 100) return 'Metronome';
		if (ability === 'Sturdy' && hasMove['explosion'] && !counter.speedsetup) return 'Custap Berry';
		if (ability === 'Super Luck') return 'Scope Lens';
		if (
			!isDoubles &&
			counter.damagingMoves.length >= 3 &&
			ability !== 'Sturdy' &&
			['acidspray', 'dragontail', 'foulplay', 'rapidspin', 'superfang', 'uturn'].every(m => !hasMove[m]) && (
				counter.speedsetup ||
				hasMove['trickroom'] ||
				(species.baseStats.spe > 40 && species.baseStats.hp + species.baseStats.def + species.baseStats.spd < 275)
			)
		) {
			return 'Life Orb';
		}
	}

	randomSet(
		species: string | Species,
		teamDetails: RandomTeamsTypes.TeamDetails = {},
		isLead = false,
		isDoubles = false
	): RandomTeamsTypes.RandomSet {
		species = this.dex.getSpecies(species);
		let forme = species.name;

		if (typeof species.battleOnly === 'string') {
			// Only change the forme. The species has custom moves, and may have different typing and requirements.
			forme = species.battleOnly;
		}
		if (species.cosmeticFormes) {
			forme = this.sample([species.name].concat(species.cosmeticFormes));
		}

		const randMoves = isDoubles && species.randomDoubleBattleMoves || species.randomBattleMoves;
		const movePool = randMoves?.slice() || Object.keys(Dex.getLearnsetData(species.id).learnset!);
		const rejectedPool = [];
		const moves: ID[] = [];
		let ability = '';

		const evs = {hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85};
		const ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
		const hasType: {[k: string]: true} = {};
		hasType[species.types[0]] = true;
		if (species.types[1]) {
			hasType[species.types[1]] = true;
		}
		const hasAbility: {[k: string]: true} = {};
		hasAbility[species.abilities[0]] = true;
		if (species.abilities[1]) {
			hasAbility[species.abilities[1]] = true;
		}
		if (species.abilities['H']) {
			hasAbility[species.abilities['H']] = true;
		}
		let availableHP = 0;
		for (const moveid of movePool) {
			if (moveid.startsWith('hiddenpower')) availableHP++;
		}

		// These moves can be used even if we aren't setting up to use them:
		const SetupException = ['closecombat', 'diamondstorm', 'extremespeed', 'superpower', 'clangingscales'];

		let hasMove: {[k: string]: true} = {};
		let counter: AnyObject;

		do {
			// Keep track of all moves we have:
			hasMove = {};
			for (const moveid of moves) {
				if (moveid.startsWith('hiddenpower')) {
					hasMove['hiddenpower'] = true;
				} else {
					hasMove[moveid] = true;
				}
			}

			// Choose next 4 moves from learnset/viable moves and add them to moves list:
			while (moves.length < 4 && movePool.length) {
				const moveid = this.sampleNoReplace(movePool);
				if (moveid === 'curse') {
					if (this.format.id.endsWith('proteanpalacerandombattle')) continue;
					if (this.format.id.endsWith('foreststreatrandombattle') && !hasType['Ghost']) continue;
				}
				if (moveid === 'stickyweb' && this.format.id.endsWith('slowmonsrandombattle')) continue;
				if (moveid === 'freezedry' && (this.format.id.endsWith('inverserandombattle') || this.format.id.endsWith('polaropposites'))) continue;
				if ((moveid === 'aromatherapy' || moveid === 'healbell' || moveid === 'willowisp') && this.format.id.endsWith('burningmonrandombattle')) continue;
				if (moveid.startsWith('hiddenpower')) {
					availableHP--;
					if (hasMove['hiddenpower']) continue;
					hasMove['hiddenpower'] = true;
				} else {
					hasMove[moveid] = true;
				}
				moves.push(moveid);
			}
			while (moves.length < 4 && rejectedPool.length) {
				const moveid = this.sampleNoReplace(rejectedPool);
				hasMove[moveid] = true;
				moves.push(moveid);
			}

			counter = this.queryMoves(moves, hasType, hasAbility, movePool);
			const runEnforcementChecker = (checkerName: string) => (
				this.moveEnforcementCheckers[checkerName]?.(
					movePool, hasMove, hasAbility, hasType, counter, species as Species, teamDetails
				)
			);

			// Iterate through the moves again, this time to cull them:
			for (const [k, moveId] of moves.entries()) {
				const move = this.dex.getMove(moveId);
				const moveid = move.id;
				let {cull, isSetup} = this.shouldCullMove(
					move, hasType, hasMove, hasAbility, counter, movePool, teamDetails,
					species, moves, isLead, isDoubles
				);

				// This move doesn't satisfy our setup requirements:
				if (
					(move.category === 'Physical' && counter.setupType === 'Special') ||
					(move.category === 'Special' && counter.setupType === 'Physical')
				) {
					// Reject STABs last in case the setup type changes later on
					const stabs = counter[species.types[0]] + (counter[species.types[1]] || 0);
					if (
						!SetupException.includes(moveid) &&
						(!hasType[move.type] || stabs > 1 || counter[move.category] < 2)
					) cull = true;
				}
				// Hidden Power isn't good enough
				if (
					counter.setupType === 'Special' &&
					moveid === 'hiddenpower' &&
					species.types.length > 1 &&
					counter.Special <= 2 &&
					!hasType[move.type] &&
					!counter.Physical &&
					counter.specialpool
				) {
					cull = true;
				}

				const singlesEnforcement = (
					!['judgment', 'lightscreen', 'reflect', 'sleeptalk', 'toxic'].includes(moveid) &&
					(move.category !== 'Status' || !move.flags.heal)
				);
				// Pokemon should have moves that benefit their Type/Ability/Weather, as well as moves required by its forme
				if (
					!cull &&
					!move.damage &&
					!isSetup &&
					!move.weather &&
					!move.stallingMove &&
					(isDoubles || singlesEnforcement) && (
						!counter.setupType || counter.setupType === 'Mixed' ||
						(move.category !== counter.setupType && move.category !== 'Status') ||
						(counter[counter.setupType] + counter.Status > 3 && !counter.hazards)
					) && (
						move.category === 'Status' ||
						!hasType[move.type] ||
						(move.basePower && move.basePower < 40 && !move.multihit)
					)
				) {
					if (
						(!counter.stab && !hasMove['nightshade'] && !hasMove['seismictoss'] && (
							species.types.length > 1 ||
							(species.types[0] !== 'Normal' && species.types[0] !== 'Psychic') ||
							!hasMove['icebeam'] ||
							species.baseStats.spa >= species.baseStats.spd
						)) || (
							hasMove['suckerpunch'] && !hasAbility['Contrary'] && counter.stab < species.types.length
						) || (
							(['recover', 'roost', 'slackoff', 'softboiled'].some(m => movePool.includes(m))) &&
							counter.Status &&
							!counter.setupType &&
							['healingwish', 'trick', 'trickroom'].every(m => !hasMove[m])
						) || (
							movePool.includes('milkdrink') ||
							movePool.includes('shoreup') ||
							(movePool.includes('stickyweb') && !counter.setupType && !teamDetails.stickyWeb)
						) || (
							isLead &&
							movePool.includes('stealthrock') &&
							counter.Status && !counter.setupType &&
							!counter.speedsetup && !hasMove['substitute']
						) || (
							species.requiredMove && movePool.includes(toID(species.requiredMove))
						) || (
							!counter.Normal &&
							(hasAbility['Aerilate'] || hasAbility['Pixilate'] || (hasAbility['Refrigerate'] && !hasMove['blizzard']))
						)
					) {
						cull = true;
					} else {
						for (const type of Object.keys(hasType)) {
							if (runEnforcementChecker(type)) {
								cull = true;
							}
						}
						for (const abil of Object.keys(hasAbility)) {
							if (runEnforcementChecker(abil)) {
								cull = true;
							}
						}
					}
				}

				// Sleep Talk shouldn't be selected without Rest
				if (moveid === 'rest' && cull) {
					const sleeptalk = movePool.indexOf('sleeptalk');
					if (sleeptalk >= 0) {
						if (movePool.length < 2) {
							cull = false;
						} else {
							this.fastPop(movePool, sleeptalk);
						}
					}
				}

				// Remove rejected moves from the move list
				if (cull && (
					movePool.length - availableHP ||
					(availableHP && (moveid === 'hiddenpower' || !hasMove['hiddenpower']))
				)) {
					if (move.category !== 'Status' && !move.damage && !move.flags.charge && (moveid !== 'hiddenpower' || !availableHP)) {
						rejectedPool.push(moves[k]);
					}
					moves.splice(k, 1);
					break;
				}

				if (cull && rejectedPool.length) {
					moves.splice(k, 1);
					break;
				}
			}
		} while (moves.length < 4 && (movePool.length || rejectedPool.length));

		// Moveset modifications
		if (hasMove['autotomize'] && hasMove['heavyslam']) {
			if (species.id === 'celesteela') {
				moves[moves.indexOf('heavyslam' as ID)] = 'flashcannon' as ID;
			} else {
				moves[moves.indexOf('autotomize' as ID)] = 'rockpolish' as ID;
			}
		}
		if (hasMove['raindance'] && hasMove['thunderbolt'] && !isDoubles) {
			moves[moves.indexOf('thunderbolt' as ID)] = 'thunder' as ID;
		}
		if (hasMove['workup'] && !counter.Special && species.id === 'zeraora') {
			moves[moves.indexOf('workup' as ID)] = 'bulkup' as ID;
		}

		if (this.format.id.endsWith('returndrandombattle')) {
			const getBenefit = (move: Move) => !move.multihit && move.basePower && move.basePower - 102 || 0;
			moves.sort((a, b) => getBenefit(this.dex.getMove(a)) - getBenefit(this.dex.getMove(b)));
		}

		const battleOnly = species.battleOnly && !species.requiredAbility;
		const baseSpecies: Species = battleOnly ? this.dex.getSpecies(species.battleOnly as string) : species;

		const abilityNames: string[] = Object.values(baseSpecies.abilities);
		abilityNames.sort((a, b) => this.dex.getAbility(b).rating - this.dex.getAbility(a).rating);

		const abilities = abilityNames.map(name => this.dex.getAbility(name));
		if (abilityNames[1]) {
			// Sort abilities by rating with an element of randomness
			if (abilityNames[2] && abilities[1].rating <= abilities[2].rating && this.randomChance(1, 2)) {
				[abilities[1], abilities[2]] = [abilities[2], abilities[1]];
			}
			if (abilities[0].rating <= abilities[1].rating && this.randomChance(1, 2)) {
				[abilities[0], abilities[1]] = [abilities[1], abilities[0]];
			} else if (abilities[0].rating - 0.6 <= abilities[1].rating && this.randomChance(2, 3)) {
				[abilities[0], abilities[1]] = [abilities[1], abilities[0]];
			}
			ability = abilities[0].name;

			while (this.shouldCullAbility(
				ability, hasType, hasMove, hasAbility, counter, movePool, teamDetails, species, isDoubles
			)) {
				if (ability === abilities[0].name && abilities[1].rating >= 1) {
					ability = abilities[1].name;
				} else if (ability === abilities[1].name && abilities[2] && abilities[2].rating >= 1) {
					ability = abilities[2].name;
				} else {
					// Default to the highest rated ability if all are rejected
					ability = abilityNames[0];
					break;
				}
			}

			if (
				abilityNames.includes('Guts') &&
				ability !== 'Quick Feet' &&
				(hasMove['facade'] || (hasMove['protect'] && !isDoubles) || (hasMove['sleeptalk'] && hasMove['rest']))
			) {
				ability = 'Guts';
			} else if (abilityNames.includes('Moxie') && (counter.Physical > 3 || hasMove['bounce']) && !isDoubles) {
				ability = 'Moxie';
			} else if (isDoubles) {
				if (abilityNames.includes('Intimidate')) ability = 'Intimidate';
				if (abilityNames.includes('Guts') && ability !== 'Intimidate') ability = 'Guts';
				if (abilityNames.includes('Storm Drain')) ability = 'Storm Drain';
				if (abilityNames.includes('Harvest')) ability = 'Harvest';
				if (abilityNames.includes('Unburden') && ability !== 'Prankster' && !species.isMega) ability = 'Unburden';
			}
			if (species.name === 'Ambipom' && !counter.technician) {
				// If it doesn't qualify for Technician, Skill Link is useless on it
				ability = 'Pickup';
			}
			if (species.name === 'Raticate-Alola') ability = 'Hustle';
			if (species.name === 'Altaria') ability = 'Natural Cure';
		} else {
			ability = abilities[0].name;
		}

		if (species.name === 'Genesect' && hasMove['technoblast']) forme = 'Genesect-Douse';
		if (!isDoubles && species.id === 'pikachu') {
			const pikachuForme = this.sample(['', '-Original', '-Hoenn', '-Sinnoh', '-Unova', '-Kalos', '-Alola', '-Partner']);
			forme = `Pikachu${pikachuForme}`;
			if (forme !== 'Pikachu') ability = 'Static';
		}

		if (
			!hasMove['photongeyser'] &&
			!teamDetails.zMove &&
			(species.name === 'Necrozma-Dusk-Mane' || species.name === 'Necrozma-Dawn-Wings')
		) {
			for (const moveid of moves) {
				const move = this.dex.getMove(moveid);
				if (move.category === 'Status' || hasType[move.type]) continue;
				moves[moves.indexOf(moveid)] = 'photongeyser' as ID;
				break;
			}
		}

		let item = this.getHighPriorityItem(ability, hasType, hasMove, counter, teamDetails, species, moves, isLead, isDoubles);
		if (item === undefined) item = this.getMediumPriorityItem(ability, hasMove, counter, species, moves, isDoubles, isLead);
		if (item === undefined) {
			item = this.getLowPriorityItem(ability, hasType, hasMove, hasAbility, counter, teamDetails, species, isLead, isDoubles);
		}
		if (species.id === 'porygonz' && item === 'Normalium Z') {
			moves[moves.indexOf('nastyplot' as ID)] = 'conversion' as ID;
			moves[moves.indexOf('triattack' as ID)] = 'recover' as ID;
		}

		// fallback
		if (item === undefined) item = isDoubles ? 'Sitrus Berry' : 'Leftovers';
		// For Trick / Switcheroo
		if (item === 'Leftovers' && hasType['Poison'] && !this.format.id.endsWith('proteanpalacerandombattle')) {
			item = 'Black Sludge';
		}
		if (item === 'Choice Scarf' && this.format.id.endsWith('slowmonsrandombattle')) {
			item = 'Macho Brace';
		}

		let level: number;
		if (!isDoubles) {
			const levelScale: {[k: string]: number} = {uber: 76, ou: 80, uu: 82, ru: 84, nu: 86, pu: 88};
			const customScale: {[k: string]: number} = {
				// Banned Ability
				Dugtrio: 82, Gothitelle: 82, Pelipper: 84, Politoed: 84, Torkoal: 84, Wobbuffet: 82,
				// Holistic judgement
				'Castform-Rainy': 100, 'Castform-Snowy': 100, 'Castform-Sunny': 100, Delibird: 100, Spinda: 100, Unown: 100,
			};
			let tier = species.tier as string;
			if (tier.includes('Unreleased') && species.battleOnly) {
				tier = this.dex.getSpecies(species.baseSpecies).tier;
			}
			tier = toID(tier).replace('bl', '');
			level = levelScale[tier] || (species.nfe ? 90 : 80);
			if (customScale[species.name]) level = customScale[species.name];
		} else {
			// We choose level based on BST. Min level is 70, max level is 99. 600+ BST is 70, less than 300 is 99. Calculate with those values.
			// Every 10.34 BST adds a level from 70 up to 99. Results are floored. Uses the Mega's stats if holding a Mega Stone
			const baseStats = species.baseStats;

			let bst = species.bst;
			// If Wishiwashi, use the school-forme's much higher stats
			if (species.baseSpecies === 'Wishiwashi') bst = this.dex.getSpecies('wishiwashischool').bst;
			// Adjust levels of mons based on abilities (Pure Power, Sheer Force, etc.) and also Eviolite
			// For the stat boosted, treat the Pokemon's base stat as if it were multiplied by the boost. (Actual effective base stats are higher.)
			const speciesAbility = (baseSpecies === species ? ability : species.abilities[0]);
			if (speciesAbility === 'Huge Power' || speciesAbility === 'Pure Power') {
				bst += baseStats.atk;
			} else if (speciesAbility === 'Parental Bond') {
				bst += 0.25 * (counter.Physical > counter.Special ? baseStats.atk : baseStats.spa);
			} else if (speciesAbility === 'Protean') {
				bst += 0.3 * (counter.Physical > counter.Special ? baseStats.atk : baseStats.spa);
			} else if (speciesAbility === 'Fur Coat') {
				bst += baseStats.def;
			} else if (speciesAbility === 'Slow Start') {
				bst -= baseStats.atk / 2 + baseStats.spe / 2;
			} else if (speciesAbility === 'Truant') {
				bst *= 2 / 3;
			}
			if (item === 'Eviolite') {
				bst += 0.5 * (baseStats.def + baseStats.spd);
			} else if (item === 'Light Ball') {
				bst += baseStats.atk + baseStats.spa;
			}
			level = 70 + Math.floor(((600 - Utils.clampIntRange(bst, 300, 600)) / 10.34));
		}

		// Prepare optimal HP
		const srWeakness = this.dex.getEffectiveness('Rock', species);
		while (evs.hp > 1) {
			const hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			if (hasMove['substitute'] && hasMove['reversal']) {
				// Reversal users should be able to use four Substitutes
				if (hp % 4 > 0) break;
			} else if (hasMove['substitute'] && (
				item === 'Petaya Berry' || item === 'Sitrus Berry' ||
				(ability === 'Power Construct' && item !== 'Leftovers')
			)) {
				// Three Substitutes should activate Petaya Berry for Dedenne
				// Two Substitutes should activate Sitrus Berry or Power Construct
				if (hp % 4 === 0) break;
			} else if (hasMove['bellydrum'] && (item === 'Sitrus Berry' || ability === 'Gluttony')) {
				// Belly Drum should activate Sitrus Berry
				if (hp % 2 === 0) break;
			} else {
				// Maximize number of Stealth Rock switch-ins
				if (srWeakness <= 0 || hp % (4 / srWeakness) > 0) break;
			}
			evs.hp -= 4;
		}

		// Minimize confusion damage
		if (!counter.Physical && !hasMove['copycat'] && !hasMove['transform']) {
			evs.atk = 0;
			ivs.atk = 0;
		}

		if (ability === 'Beast Boost' && counter.Special < 1) {
			evs.spa = 0;
			ivs.spa = 0;
		}

		if (['gyroball', 'metalburst', 'trickroom'].some(m => hasMove[m])) {
			evs.spe = 0;
			ivs.spe = 0;
		}

		return {
			name: species.baseSpecies,
			species: forme,
			gender: species.gender,
			shiny: this.randomChance(1, 1024),
			moves,
			ability,
			evs,
			ivs,
			item,
			level,
		};
	}

	randomTeam() {
		const seed = this.prng.seed;
		const ruleTable = this.dex.getRuleTable(this.format);
		const pokemon = [];

		const allowedNFE = ['Chansey', 'Doublade', 'Gligar', 'Pikachu', 'Porygon2', 'Scyther', 'Type: Null'];

		// For Monotype
		const isMonotype: string | false = ruleTable.has('sametypeclause') && this.sample(Object.keys(this.dex.data.TypeChart));

		const availableFormes: {[k: string]: string[]} = {};
		for (const id in this.dex.data.FormatsData) {
			const template = this.dex.getSpecies(id);
			if (isMonotype) {
				let types = template.types;
				if (template.battleOnly) types = this.dex.getSpecies(template.baseSpecies).types;
				if (!types.includes(isMonotype)) continue;
			}
			if (this.format.id.endsWith("benjaminbutterfree") && !template.prevo) continue;
			if (template.gen <= this.gen && (!template.nfe || allowedNFE.includes(template.name)) && !template.isMega && !template.isPrimal && !template.isNonstandard && template.randomBattleMoves) {
				if (!availableFormes[template.baseSpecies]) {
					availableFormes[template.baseSpecies] = [id];
				} else {
					availableFormes[template.baseSpecies].push(id);
				}
			}
		}
		const pokemonPool = Object.values(availableFormes);

		// PotD stuff
		let potd;
		if (global.Config && Config.potd && ruleTable.has('potd')) {
			potd = this.dex.getSpecies(Config.potd);
		}

		const baseFormes: {[k: string]: number} = {};
		const tierCount: {[k: string]: number} = {};
		const typeCount: {[k: string]: number} = {};
		const typeComboCount: {[k: string]: number} = {};
		const teamDetails: RandomTeamsTypes.TeamDetails = {};

		while (pokemonPool.length && pokemon.length < 6) {
			let template = this.dex.getSpecies(this.sample(this.sampleNoReplace(pokemonPool)));
			if (!template.exists) continue;

			const tier = template.tier;

			// Limit two Pokemon per tier
			if (tierCount[tier] > 1) {
				continue;
			}

			const types = template.types;

			if (!isMonotype) {
				// Limit two of any type
				let skip = false;
				for (const type of types) {
					if (typeCount[type] > 1 && this.randomChance(4, 5)) {
						skip = true;
						break;
					}
				}
				if (skip) continue;
			}

			if (potd?.exists) {
				// The Pokemon of the Day belongs in slot 4
				if (pokemon.length === 3) {
					template = potd;
				} else if (template.name === potd.name) {
					continue; // No thanks, I've already got it
				}
			}

			const set = this.randomSet(template, teamDetails, !pokemon.length, this.format.gameType !== 'singles');

			// Limit 1 of any type combination, 2 in Monotype
			let typeCombo = types.slice().sort().join();
			if (set.ability === 'Drought' || set.ability === 'Drizzle' || set.ability === 'Sand Stream') {
				// Drought, Drizzle and Sand Stream don't count towards the type combo limit
				typeCombo = set.ability;
				if (typeCombo in typeComboCount) continue;
			} else {
				if (typeComboCount[typeCombo] >= (isMonotype ? 2 : 1)) continue;
			}

			const item = this.dex.getItem(set.item);

			// Limit one Z-Move per team
			if (item.zMove && teamDetails.zMove) continue;

			// Zoroark copies the last Pokemon
			if (set.ability === 'Illusion') {
				if (pokemon.length < 1) continue;
				set.level = pokemon[pokemon.length - 1].level;
			}

			if (template.cosmeticFormes) set.species = template.cosmeticFormes[this.random(template.cosmeticFormes.length)];

			// Okay, the set passes, add it to our team
			pokemon.unshift(set);

			// Don't bother tracking details for the 6th Pokemon
			if (pokemon.length === 6) break;

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[template.baseSpecies] = 1;

			// Tier counter.
			if (tierCount[tier]) {
				tierCount[tier]++;
			} else {
				tierCount[tier] = 1;
			}

			// Increment type counters
			for (const type of types) {
				if (type in typeCount) {
					typeCount[type]++;
				} else {
					typeCount[type] = 1;
				}
			}
			if (typeCombo in typeComboCount) {
				typeComboCount[typeCombo]++;
			} else {
				typeComboCount[typeCombo] = 1;
			}

			// Track what the team has
			if (item.megaStone) teamDetails['megaStone'] = 1;
			if (item.zMove) teamDetails.zMove = 1;
			if (set.ability === 'Snow Warning' || set.moves.includes('hail')) teamDetails.hail = 1;
			if (set.moves.includes('raindance') || set.ability === 'Drizzle' && !item.onPrimal) teamDetails.rain = 1;
			if (set.ability === 'Sand Stream') teamDetails.sand = 1;
			if (set.moves.includes('sunnyday') || set.ability === 'Drought' && !item.onPrimal) teamDetails.sun = 1;
			if (set.moves.includes('spikes')) teamDetails.spikes = (teamDetails.spikes || 0) + 1;
			if (set.moves.includes('stealthrock')) teamDetails.stealthRock = 1;
			if (set.moves.includes('stickyweb')) teamDetails.stickyWeb = 1;
			if (set.moves.includes('toxicspikes')) teamDetails.toxicSpikes = 1;
			if (set.moves.includes('defog')) teamDetails.defog = 1;
			if (set.moves.includes('rapidspin')) teamDetails.rapidSpin = 1;
		}
		if (pokemon.length < 6) throw new Error(`Could not build a random team for ${this.format} (seed=${seed})`);

		return pokemon;
	}

	randomArceusTeam() {
		const natures = Object.keys(this.dex.data.Natures);
		const arceus = ['arceus'].concat(this.dex.getSpecies('arceus').otherFormes || []);
		const team = [];
		for (let i = 0; i < 6; i++) {
			const species = this.dex.getSpecies(this.sampleNoReplace(arceus));

			const item = species.requiredItems ? species.requiredItems[0] : 'Normalium Z';

			// Random EVs
			const evs: StatsTable = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
			const s: StatName[] = ["hp", "atk", "def", "spa", "spd", "spe"];
			let evpool = 510;
			do {
				const x = s[this.random(s.length)];
				const y = this.random(Math.min(256 - evs[x], evpool + 1));
				evs[x] += y;
				evpool -= y;
			} while (evpool > 0);

			// Random IVs
			const ivs = {hp: this.random(32), atk: this.random(32), def: this.random(32), spa: this.random(32), spd: this.random(32), spe: this.random(32)};

			// Random nature
			const nature = natures[this.random(natures.length)];

			// Random happiness
			const happiness = this.random(256);

			// Random shininess
			const shiny = !this.random(1024);

			team.push({
				name: species.baseSpecies,
				species: species.name,
				gender: species.gender,
				item: item,
				ability: 'Multitype',
				moves: ['Metronome'],
				evs: evs,
				ivs: ivs,
				nature: nature,
				level: 100,
				happiness: happiness,
				shiny: shiny,
			});
		}
		return team;
	}

	randomReliableTeam() {
		const pokemon = [];

		const excludedTiers = ['NFE', 'LC Uber', 'LC'];
		const allowedNFE = ['Chansey', 'Doublade', 'Gligar', 'Porygon2', 'Scyther', 'Togetic'];

		const availableFormes: {[k: string]: string[]} = {};
		for (const id in this.dex.data.FormatsData) {
			const template = this.dex.getSpecies(id);
			if (!excludedTiers.includes(template.tier) && !template.isMega && !template.isPrimal && !template.isNonstandard && template.randomBattleMoves) {
				if (!availableFormes[template.baseSpecies]) {
					availableFormes[template.baseSpecies] = [id];
				} else {
					availableFormes[template.baseSpecies].push(id);
				}
			}
		}
		const pokemonPool = Object.values(availableFormes);

		// PotD stuff
		let potd;
		if (global.Config && Config.potd && this.dex.getRuleTable(this.format).has('potd')) {
			potd = this.dex.getSpecies(Config.potd);
		}

		const typeCount: {[k: string]: number} = {};
		const typeComboCount: {[k: string]: number} = {};
		const baseFormes: {[k: string]: number} = {};
		let uberCount = 0;
		let puCount = 0;
		const teamDetails: RandomTeamsTypes.TeamDetails = {};

		while (pokemonPool.length && pokemon.length < 6) {
			let template = this.dex.getSpecies(this.sample(this.sampleNoReplace(pokemonPool)));
			if (!template.exists) continue;

			// Useless in Random Battle without greatly lowering the levels of everything else
			if (template.name === 'Unown') continue;

			// Only certain NFE Pokemon are allowed
			if (template.evos.length && !allowedNFE.includes(template.name)) continue;

			const tier = template.tier;
			switch (tier) {
			case 'Uber':
				// Ubers are limited to 2 but have a 20% chance of being added anyway.
				if (uberCount > 1 && this.random(5) >= 1) continue;
				break;
			case 'PU':
				// PUs are limited to 2 but have a 20% chance of being added anyway.
				if (puCount > 1 && this.random(5) >= 1) continue;
				break;
			case 'Unreleased':
				// Unreleased Pokémon have 20% the normal rate
				if (this.random(5) >= 1) continue;
				break;
			case 'CAP':
				// CAPs have 20% the normal rate
				if (this.random(5) >= 1) continue;
			}

			// Limit 2 of any type
			const types = template.types;
			let skip = false;
			for (const type of types) {
				if (typeCount[type] > 1 && this.random(5) >= 1) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			if (potd?.exists) {
				// The Pokemon of the Day belongs in slot 2
				if (pokemon.length === 1) {
					template = potd;
					if (template.name === 'Magikarp') {
						template = {...potd, randomBattleMoves: ['bounce', 'flail', 'splash', 'magikarpsrevenge'] as ID[]};
					} else if (template.name === 'Delibird') {
						template = {...potd, randomBattleMoves: ['present', 'bestow'] as ID[]};
					}
				} else if (template.name === potd.name) {
					continue; // No, thanks, I've already got one
				}
			}

			const set = this.randomSet(template, teamDetails, !pokemon.length);

			// Illusion shouldn't be the last Pokemon of the team
			if (set.ability === 'Illusion' && pokemon.length > 4) continue;

			// Limit 1 of any type combination
			let typeCombo = types.slice().sort().join();
			if (set.ability === 'Drought' || set.ability === 'Drizzle' || set.ability === 'Sand Stream') {
				// Drought, Drizzle and Sand Stream don't count towards the type combo limit
				typeCombo = set.ability;
			}
			if (typeCombo in typeComboCount) continue;

			const typedMoves: (Move | null)[] = [null, null];
			for (const moveid of set.moves) {
				const move = this.dex.getMove(moveid);
				if (move.type === types[0] && (!typedMoves[0] || move.basePower > typedMoves[0].basePower)) typedMoves[0] = move;
				if (move.type === types[1] && (!typedMoves[1] || move.basePower > typedMoves[1].basePower)) typedMoves[1] = move;
			}
			let newMoves = [];
			if (typedMoves[0]) newMoves.push(typedMoves[0]);
			if (typedMoves[1]) newMoves.push(typedMoves[1]);
			if (!newMoves[0]) {
				// Could be Protean, Multitype, -ate or hazard setter. For
				// Protean or -ate we want to avoid changing the move's type.
				set.moves = set.moves.sort((a, b) =>
					+(this.dex.getMove(a).category === "Status") -
					+(this.dex.getMove(b).category === "Status"));
			} else {
				if (newMoves[1] && newMoves[1].basePower > newMoves[0].basePower) newMoves = [newMoves[1], newMoves[0]];
				for (const moveid in this.dex.getLearnsetData(template.id).learnset) {
					if (moveid === 'dreameater' || moveid === 'explosion' || moveid === 'focuspunch' || moveid === 'futuresight' || moveid === 'lastresort' || moveid === 'selfdestruct' || moveid === 'synchronoise' || set.moves.includes(moveid)) continue;
					const move = this.dex.getMove(moveid);
					if (move.flags.charge || move.flags.recharge || move.accuracy < 90) continue;
					if (move.category === newMoves[0].category && move.basePower > newMoves[0].basePower) {
						if (newMoves[1]) newMoves[1] = newMoves[0];
						newMoves[0] = move;
					}
				}
				let newMoveIds: string[] = [];
				if (newMoves[0]) {
					newMoveIds[0] = newMoves[0].id;
					if (newMoves[1]) {
						newMoveIds[1] = newMoves[1].id;
						if (this.random(2)) newMoveIds = [newMoveIds[1], newMoveIds[0]];
					}
				}
				for (const moveid of set.moves) {
					if (typedMoves[0] && moveid === typedMoves[0].id) continue;
					if (typedMoves[1] && moveid === typedMoves[1].id) continue;
					if (newMoveIds.length === 1 && types.length === 2 && this.random(2)) {
						newMoveIds.unshift(moveid);
					} else {
						newMoveIds.push(moveid);
					}
				}
				set.moves = newMoveIds;
			}

			if (template.cosmeticFormes) set.species = template.cosmeticFormes[this.random(template.cosmeticFormes.length)];

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[template.baseSpecies] = 1;

			// Increment type counters
			for (const type of types) {
				if (type in typeCount) {
					typeCount[type]++;
				} else {
					typeCount[type] = 1;
				}
			}
			typeComboCount[typeCombo] = 1;

			// Increment Uber/NU counters
			if (tier === 'Uber') {
				uberCount++;
			} else if (tier === 'PU') {
				puCount++;
			}

			// Team has weather/hazards
			if (set.ability === 'Snow Warning') teamDetails['hail'] = 1;
			if (set.ability === 'Drizzle' || set.moves.includes('raindance')) teamDetails['rain'] = 1;
			if (set.ability === 'Sand Stream') teamDetails['sand'] = 1;
			if (set.moves.includes('stealthrock')) teamDetails['stealthRock'] = 1;
			if (set.moves.includes('toxicspikes')) teamDetails['toxicSpikes'] = 1;
			if (set.moves.includes('defog')) teamDetails['defog'] = 1;
			if (set.moves.includes('rapidspin')) teamDetails['rapidSpin'] = 1;
		}
		return pokemon;
	}

	randomInheritanceTeam() {
		const pokemon = [];

		const excludedTiers = ['NFE', 'LC Uber', 'LC'];
		if (this.gen > 6) excludedTiers.push('Uber');
		const allowedNFE = ['Chansey', 'Doublade', 'Gligar', 'Porygon2', 'Scyther', 'Togetic'];

		const availableFormes: {[k: string]: string[]} = {};
		for (const id in this.dex.data.FormatsData) {
			const template = this.dex.getSpecies(id);
			if (template.gen <= this.gen && !excludedTiers.includes(template.tier) && !template.isMega && !template.isPrimal && !template.isNonstandard && template.randomBattleMoves) {
				if (!availableFormes[template.baseSpecies]) {
					availableFormes[template.baseSpecies] = [id];
				} else {
					availableFormes[template.baseSpecies].push(id);
				}
			}
		}
		let pokemonPool = Object.values(availableFormes);

		// PotD stuff
		let potd;
		if (global.Config && Config.potd && this.dex.getRuleTable(this.format).has('potd')) {
			potd = this.dex.getSpecies(Config.potd);
		}

		const typeCount: {[k: string]: number} = {};
		const typeComboCount: {[k: string]: number} = {};
		const baseFormes: {[k: string]: number} = {};
		let uberCount = 0;
		let puCount = 0;
		const teamDetails: RandomTeamsTypes.TeamDetails = {};

		while (pokemonPool.length && pokemon.length < 6) {
			const template = this.dex.getSpecies(this.sample(this.sampleNoReplace(pokemonPool)));
			if (!template.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[template.baseSpecies]) continue;

			// Useless in Random Battle without greatly lowering the levels of everything else
			if (template.name === 'Unown') continue;

			// Only certain NFE Pokemon are allowed
			if (template.evos.length && !allowedNFE.includes(template.name)) continue;
			const hasAbility: {[k: string]: boolean} = {};
			hasAbility[template.abilities[0]] = true;
			if (template.abilities[1]) {
				hasAbility[template.abilities[1]] = true;
			}
			if (template.abilities['H']) {
				hasAbility[template.abilities['H']] = true;
			}

			let sample;
			let inheritor: Species;
			const samples = [];
			let hasType: {[k: string]: boolean} = {};
			let movePool: string[] = [];
			do {
				const formes = this.sampleNoReplace(pokemonPool) as string[];
				samples.push(formes);
				if (!formes) break;
				sample = this.sample(formes);
				inheritor = this.dex.getSpecies(sample);
				if (!inheritor.exists) continue;
				if (this.gen > 6 && (inheritor.name === 'Kyurem-Black' || inheritor.name === 'Slaking' || inheritor.name === 'Regigigas')) continue;

				hasType = {};
				hasType[inheritor.types[0]] = true;
				if (inheritor.types[1]) {
					hasType[inheritor.types[1]] = true;
				}
				movePool = template.randomBattleMoves?.slice() || Object.keys(this.dex.getLearnsetData(template.id).learnset || {});
				if (inheritor.randomBattleMoves) {
					let learnset = Object.keys(this.dex.getLearnsetData(toID(template.baseSpecies)).learnset || {});
					if (template.baseSpecies === 'Smeargle') {
						learnset = inheritor.randomBattleMoves.filter(moveid => moveid !== 'chatter');
					} else if (this.dex.getLearnsetData(template.id).learnset) {
						learnset = learnset.concat(Object.keys(this.dex.getLearnsetData(template.id).learnset || {}));
						if (template.name.substr(0, 6) === 'Rotom-' || template.name.substr(0, 9) === 'Necrozma-') {
							learnset = learnset.concat(Object.keys(this.dex.getLearnsetData(toID(template.baseSpecies)).learnset || {}));
						}
					}
					for (const move of inheritor.randomBattleMoves || []) {
						if (!movePool.includes(move) && learnset.includes(move)) movePool.push(move);
					}
				}
			} while (!this.queryMoves(movePool, hasType, hasAbility).stab);
			samples.pop();
			pokemonPool = pokemonPool.concat(samples);
			if (!sample) continue;

			// Useless in Random Battle without greatly lowering the levels of everything else
			if (inheritor!.name === 'Unown') continue;

			// Only certain NFE Pokemon are allowed
			if (inheritor!.evos.length && !allowedNFE.includes(inheritor!.name)) continue;

			let tier: string = inheritor!.tier;
			if (inheritor!.name === 'Slaking' || inheritor!.name === 'Regigigas') tier = 'Uber';
			switch (tier) {
			case 'Uber':
				// Ubers are limited to 2 but have a 20% chance of being added anyway.
				if (uberCount > 1 && this.random(5) >= 1) continue;
				break;
			case 'PU':
				// PUs are limited to 2 but have a 20% chance of being added anyway.
				if (puCount > 1 && this.random(5) >= 1) continue;
				break;
			case 'Unreleased':
				// Unreleased Pokémon have 20% the normal rate
				if (this.random(5) >= 1) continue;
				break;
			case 'CAP':
				// CAPs have 20% the normal rate
				if (this.random(5) >= 1) continue;
			}

			// Limit 2 of any type
			const types = inheritor!.types;
			let skip = false;
			for (const type of types) {
				if (typeCount[type] > 1 && this.random(5) >= 1) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			if (potd?.exists) {
				// The Pokemon of the Day belongs in slot 2
				if (pokemon.length === 1) {
					inheritor = potd;
				} else if (inheritor!.name === potd.name) {
					continue; // No, thanks, I've already got one
				}
			}

			if (inheritor!.otherFormes) {
				const battleForme = this.dex.getSpecies(inheritor!.otherFormes[0]);
				if (battleForme.isPrimal || (battleForme.isMega && !teamDetails.megaStone)) inheritor = battleForme;
			}
			const mixedTemplate = this.dex.deepClone(inheritor!);
			mixedTemplate.randomBattleMoves = movePool;
			mixedTemplate.abilities = template.abilities;
			mixedTemplate.inheritedItem = template.requiredItems && template.requiredItems[0];
			mixedTemplate.requiredMove = null;
			mixedTemplate.otherFormes = null;
			const set = this.randomSet(mixedTemplate, teamDetails, !pokemon.length);

			// Illusion shouldn't be the last Pokemon of the team
			if (set.ability === 'Illusion' && pokemon.length > 4) continue;

			// Limit 1 of any type combination
			let typeCombo = types.slice().sort().join();
			if (set.ability === 'Drought' || set.ability === 'Drizzle' || set.ability === 'Sand Stream') {
				// Drought, Drizzle and Sand Stream don't count towards the type combo limit
				typeCombo = set.ability;
			}
			if (typeCombo in typeComboCount) continue;

			// Okay, the set passes, add it to our team
			set.donorTemplate = template.id;
			pokemon.push(set);

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[template.baseSpecies] = 1;

			// Increment type counters
			for (const type of types) {
				if (type in typeCount) {
					typeCount[type]++;
				} else {
					typeCount[type] = 1;
				}
			}
			typeComboCount[typeCombo] = 1;

			// Increment Uber/NU counters
			if (tier === 'Uber') {
				uberCount++;
			} else if (tier === 'PU') {
				puCount++;
			}

			// Team has Mega/weather/hazards
			if (this.dex.getItem(set.item).megaStone) teamDetails['megaStone'] = 1;
			if (set.ability === 'Snow Warning') teamDetails['hail'] = 1;
			if (set.ability === 'Drizzle' || set.moves.includes('raindance')) teamDetails['rain'] = 1;
			if (set.ability === 'Sand Stream') teamDetails['sand'] = 1;
			if (set.moves.includes('stealthrock')) teamDetails['stealthRock'] = 1;
			if (set.moves.includes('toxicspikes')) teamDetails['toxicSpikes'] = 1;
			if (set.moves.includes('defog')) teamDetails['defog'] = 1;
			if (set.moves.includes('rapidspin')) teamDetails['rapidSpin'] = 1;
		}
		return pokemon;
	}

	randomNoMegaTeam() {
		const pokemon = [];

		const excludedTiers = ['NFE', 'LC Uber', 'LC'];
		const allowedNFE = ['Chansey', 'Doublade', 'Gligar', 'Porygon2', 'Scyther', 'Togetic'];

		const availableFormes: {[k: string]: string[]} = {};
		for (const id in this.dex.data.FormatsData) {
			const template = this.dex.getSpecies(id);
			if (!excludedTiers.includes(template.tier) && !template.requiredItem && !template.isMega && !template.isPrimal && !template.isNonstandard && template.randomBattleMoves) {
				if (!availableFormes[template.baseSpecies]) {
					availableFormes[template.baseSpecies] = [id];
				} else {
					availableFormes[template.baseSpecies].push(id);
				}
			}
		}
		const pokemonPool = Object.values(availableFormes);

		// PotD stuff
		let potd;
		if (global.Config && Config.potd && this.dex.getRuleTable(this.format).has('potd')) {
			potd = this.dex.getSpecies(Config.potd);
		}

		const typeCount: {[k: string]: number} = {};
		const typeComboCount: {[k: string]: number} = {};
		const baseFormes: {[k: string]: number} = {};
		let uberCount = 0;
		let puCount = 0;
		const teamDetails: RandomTeamsTypes.TeamDetails = {};

		while (pokemonPool.length && pokemon.length < 6) {
			let template = this.dex.getSpecies(this.sample(this.sampleNoReplace(pokemonPool)));
			if (!template.exists) continue;

			// Useless in Random Battle without greatly lowering the levels of everything else
			if (template.name === 'Unown') continue;

			// Only certain NFE Pokemon are allowed
			if (template.evos.length && !allowedNFE.includes(template.name)) continue;

			const tier = template.tier;
			switch (tier) {
			case 'Uber':
				// Ubers are limited to 2 but have a 20% chance of being added anyway.
				if (uberCount > 1 && this.random(5) >= 1) continue;
				break;
			case 'PU':
				// PUs are limited to 2 but have a 20% chance of being added anyway.
				if (puCount > 1 && this.random(5) >= 1) continue;
				break;
			case 'Unreleased':
				// Unreleased Pokémon have 20% the normal rate
				if (this.random(5) >= 1) continue;
				break;
			case 'CAP':
				// CAPs have 20% the normal rate
				if (this.random(5) >= 1) continue;
			}

			// Limit 2 of any type
			const types = template.types;
			let skip = false;
			for (const type of types) {
				if (typeCount[type] > 1 && this.random(5) >= 1) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			if (potd?.exists) {
				// The Pokemon of the Day belongs in slot 2
				if (pokemon.length === 1) {
					template = potd;
					if (template.name === 'Magikarp') {
						template = {...potd, randomBattleMoves: ['bounce', 'flail', 'splash', 'magikarpsrevenge'] as ID[]};
					} else if (template.name === 'Delibird') {
						template = {...potd, randomBattleMoves: ['present', 'bestow'] as ID[]};
					}
				} else if (template.name === potd.name) {
					continue; // No, thanks, I've already got one
				}
			}

			const set = this.randomSet(template, teamDetails, !pokemon.length);

			// Illusion shouldn't be the last Pokemon of the team
			if (set.ability === 'Illusion' && pokemon.length > 4) continue;

			// Limit 1 of any type combination
			let typeCombo = types.slice().sort().join();
			if (set.ability === 'Drought' || set.ability === 'Drizzle' || set.ability === 'Sand Stream') {
				// Drought, Drizzle and Sand Stream don't count towards the type combo limit
				typeCombo = set.ability;
			}
			if (typeCombo in typeComboCount) continue;

			if (template.cosmeticFormes) set.species = template.cosmeticFormes[this.random(template.cosmeticFormes.length)];

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[template.baseSpecies] = 1;

			// Increment type counters
			for (const type of types) {
				if (type in typeCount) {
					typeCount[type]++;
				} else {
					typeCount[type] = 1;
				}
			}
			typeComboCount[typeCombo] = 1;

			// Increment Uber/NU counters
			if (tier === 'Uber') {
				uberCount++;
			} else if (tier === 'PU') {
				puCount++;
			}

			// Team has Mega/weather/hazards
			if (this.dex.getItem(set.item).megaStone) teamDetails['megaStone'] = 1;
			if (set.ability === 'Snow Warning') teamDetails['hail'] = 1;
			if (set.ability === 'Drizzle' || set.moves.includes('raindance')) teamDetails['rain'] = 1;
			if (set.ability === 'Sand Stream') teamDetails['sand'] = 1;
			if (set.moves.includes('stealthrock')) teamDetails['stealthRock'] = 1;
			if (set.moves.includes('toxicspikes')) teamDetails['toxicSpikes'] = 1;
			if (set.moves.includes('defog')) teamDetails['defog'] = 1;
			if (set.moves.includes('rapidspin')) teamDetails['rapidSpin'] = 1;
		}
		return pokemon;
	}

	randomFactorySets: AnyObject = require('./factory-sets.json');
	randomOMFactorySets: AnyObject = require('./om-factory-sets.json');

	randomFactorySet(
		species: Species, teamData: RandomTeamsTypes.FactoryTeamDetails, tier: string
	): RandomTeamsTypes.RandomFactorySet | null {
		const id = toID(species.name);
		const factorySets = this.format.factoryTier ? this.randomOMFactorySets : this.randomFactorySets;
		const mnm = this.format.id === 'gen7mixandmegafactory';
		const setList = factorySets[tier][id].sets;

		const itemsMax: {[k: string]: number} = {
			choicespecs: 1,
			choiceband: 1,
			choicescarf: 1,
		};
		const movesMax: {[k: string]: number} = {
			rapidspin: 1,
			batonpass: 1,
			stealthrock: 1,
			defog: 1,
			spikes: 1,
			toxicspikes: 1,
		};
		const requiredMoves: {[k: string]: string} = {
			stealthrock: 'hazardSet',
			rapidspin: 'hazardClear',
			defog: 'hazardClear',
		};
		const weatherAbilitiesRequire: {[k: string]: string} = {
			hydration: 'raindance', swiftswim: 'raindance',
			leafguard: 'sunnyday', solarpower: 'sunnyday', chlorophyll: 'sunnyday',
			sandforce: 'sandstorm', sandrush: 'sandstorm', sandveil: 'sandstorm',
			slushrush: 'hail', snowcloak: 'hail',
		};
		const weatherAbilities = ['drizzle', 'drought', 'snowwarning', 'sandstream'];

		// Build a pool of eligible sets, given the team partners
		// Also keep track of sets with moves the team requires
		let effectivePool: {set: AnyObject, moveVariants?: number[]}[] = [];
		const priorityPool = [];
		for (const curSet of setList) {
			const item = this.dex.getItem(curSet.item);
			if (!mnm && teamData.megaCount && teamData.megaCount > 0 && item.megaStone) continue; // reject 2+ mega stones
			if (teamData.zCount && teamData.zCount > 0 && item.zMove) continue; // reject 2+ Z stones
			if (itemsMax[item.id] && teamData.has[item.id] >= itemsMax[item.id]) continue;

			const ability = this.dex.getAbility(curSet.ability);
			if (weatherAbilitiesRequire[ability.id] && teamData.weather !== weatherAbilitiesRequire[ability.id]) continue;
			if (teamData.weather && weatherAbilities.includes(ability.id)) continue; // reject 2+ weather setters

			let reject = false;
			let hasRequiredMove = false;
			const curSetVariants = [];
			for (const move of curSet.moves) {
				const variantIndex = this.random(move.length);
				const moveId = toID(move[variantIndex]);
				if (movesMax[moveId] && teamData.has[moveId] >= movesMax[moveId]) {
					reject = true;
					break;
				}
				if (requiredMoves[moveId] && !teamData.has[requiredMoves[moveId]]) {
					hasRequiredMove = true;
				}
				curSetVariants.push(variantIndex);
			}
			if (reject) continue;
			effectivePool.push({set: curSet, moveVariants: curSetVariants});
			if (hasRequiredMove) priorityPool.push({set: curSet, moveVariants: curSetVariants});
		}
		if (priorityPool.length) effectivePool = priorityPool;

		if (!effectivePool.length) {
			if (!teamData.forceResult) return null;
			for (const curSet of setList) {
				effectivePool.push({set: curSet});
			}
		}

		const setData = this.sample(effectivePool);
		const moves = [];
		for (const [i, moveSlot] of setData.set.moves.entries()) {
			moves.push(setData.moveVariants ? moveSlot[setData.moveVariants[i]] : this.sample(moveSlot));
		}


		const item = this.sampleIfArray(setData.set.item);
		const ability = this.sampleIfArray(setData.set.ability);
		const nature = this.sampleIfArray(setData.set.nature);

		return {
			name: setData.set.name || species.baseSpecies,
			species: setData.set.species,
			gender: setData.set.gender || species.gender || (this.randomChance(1, 2) ? 'M' : 'F'),
			item: item || '',
			ability: ability || species.abilities['0'],
			shiny: typeof setData.set.shiny === 'undefined' ? this.randomChance(1, 1024) : setData.set.shiny,
			level: setData.set.level ? setData.set.level : tier === "LC" ? 5 : 100,
			happiness: typeof setData.set.happiness === 'undefined' ? 255 : setData.set.happiness,
			evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, ...setData.set.evs},
			ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31, ...setData.set.ivs},
			nature: nature || 'Serious',
			moves,
		};
	}

	randomFactoryTeam(side: PlayerOptions, depth = 0): RandomTeamsTypes.RandomFactorySet[] {
		const forceResult = (depth >= 4);

		// The teams generated depend on the tier choice in such a way that
		// no exploitable information is leaked from rolling the tier in getTeam(p1).
		const availableTiers = ['Uber', 'OU', 'UU', 'RU', 'NU', 'PU', 'LC', 'Mono'];
		if (!this.factoryTier) this.factoryTier = this.format.factoryTier || this.sample(availableTiers);
		const chosenTier = this.factoryTier;

		const tierValues: {[k: string]: number} = {
			Uber: 5,
			OU: 4, UUBL: 4,
			UU: 3, RUBL: 3,
			RU: 2, NUBL: 2,
			NU: 1, PUBL: 1,
			PU: 0,
		};

		const pokemon = [];
		const factorySets = this.format.factoryTier ? this.randomOMFactorySets : this.randomFactorySets;
		const mnm = this.format.id === 'gen7mixandmegafactory';
		const pokemonPool = Object.keys(factorySets[chosenTier]);

		const typePool = Object.keys(this.dex.data.TypeChart);
		const type = this.sample(typePool);

		const teamData: TeamData = {
			typeCount: {}, typeComboCount: {}, baseFormes: {}, megaCount: 0, zCount: 0,
			has: {}, forceResult: forceResult, weaknesses: {}, resistances: {},
		};
		const requiredMoveFamilies = ['hazardSet', 'hazardClear'];
		const requiredMoves: {[k: string]: string} = {
			stealthrock: 'hazardSet',
			rapidspin: 'hazardClear',
			defog: 'hazardClear',
		};
		const weatherAbilitiesSet: {[k: string]: string} = {
			drizzle: 'raindance',
			drought: 'sunnyday',
			snowwarning: 'hail',
			sandstream: 'sandstorm',
		};
		const resistanceAbilities: {[k: string]: string[]} = {
			dryskin: ['Water'], waterabsorb: ['Water'], stormdrain: ['Water'],
			flashfire: ['Fire'], heatproof: ['Fire'],
			lightningrod: ['Electric'], motordrive: ['Electric'], voltabsorb: ['Electric'],
			sapsipper: ['Grass'],
			thickfat: ['Ice', 'Fire'],
			levitate: ['Ground'],
		};

		while (pokemonPool.length && pokemon.length < 6) {
			const species = this.dex.getSpecies(this.sampleNoReplace(pokemonPool));
			if (!species.exists) continue;

			// Lessen the need of deleting sets of Pokemon after tier shifts
			if (
				chosenTier in tierValues && species.tier in tierValues &&
				tierValues[species.tier] > tierValues[chosenTier]
			) continue;

			const speciesFlags = factorySets[chosenTier][species.id].flags;

			// Limit to one of each species (Species Clause)
			if (teamData.baseFormes[species.baseSpecies]) continue;

			// Limit the number of Megas to one
			if (!teamData.megaCount) teamData.megaCount = 0;
			if (!mnm && teamData.megaCount >= 1 && speciesFlags.megaOnly) continue;

			const set = this.randomFactorySet(species, teamData, chosenTier);
			if (!set) continue;

			const itemData = this.dex.getItem(set.item);

			// Actually limit the number of Megas to one
			if (!mnm && teamData.megaCount >= 1 && itemData.megaStone) continue;

			// Limit the number of Z moves to one
			if (teamData.zCount && teamData.zCount >= 1 && itemData.zMove) continue;

			// Mega stone clause, sort of
			if (mnm && teamData.has[itemData.id]) continue;

			let types = species.types;

			// Enforce Monotype
			if (chosenTier === 'Mono') {
				// Prevents Mega Evolutions from breaking the type limits
				if (itemData.megaStone) {
					const megaSpecies = this.dex.getSpecies(itemData.megaStone);
					if (types.length > megaSpecies.types.length) types = [species.types[0]];
					// Only check the second type because a Mega Evolution should always share the first type with its base forme.
					if (megaSpecies.types[1] && types[1] && megaSpecies.types[1] !== types[1]) {
						types = [megaSpecies.types[0]];
					}
				}
				if (!types.includes(type)) continue;
			} else {
				// If not Monotype, limit to two of each type
				let skip = false;
				for (const typeName of types) {
					if (teamData.typeCount[typeName] > 1 && this.randomChance(4, 5)) {
						skip = true;
						break;
					}
				}
				if (skip) continue;

				// Limit 1 of any type combination
				let typeCombo = types.slice().sort().join();
				if (set.ability + '' === 'Drought' || set.ability + '' === 'Drizzle') {
				// Drought and Drizzle don't count towards the type combo limit
					typeCombo = set.ability + '';
				}
				if (typeCombo in teamData.typeComboCount) continue;
			}

			if (species.cosmeticFormes) set.species = species.cosmeticFormes[this.random(species.cosmeticFormes.length)];

			// Okay, the set passes, add it to our team
			pokemon.push(set);
			const typeCombo = types.slice().sort().join();
			// Now that our Pokemon has passed all checks, we can update team data:
			for (const typeName of types) {
				if (typeName in teamData.typeCount) {
					teamData.typeCount[typeName]++;
				} else {
					teamData.typeCount[typeName] = 1;
				}
			}
			teamData.typeComboCount[typeCombo] = 1;

			teamData.baseFormes[species.baseSpecies] = 1;

			if (itemData.megaStone) teamData.megaCount++;
			if (itemData.zMove) {
				if (!teamData.zCount) teamData.zCount = 0;
				teamData.zCount++;
			}
			if (itemData.id in teamData.has) {
				teamData.has[itemData.id]++;
			} else {
				teamData.has[itemData.id] = 1;
			}

			const abilityData = this.dex.getAbility(set.ability);
			if (abilityData.id in weatherAbilitiesSet) {
				teamData.weather = weatherAbilitiesSet[abilityData.id];
			}

			for (const move of set.moves) {
				const moveId = toID(move);
				if (moveId in teamData.has) {
					teamData.has[moveId]++;
				} else {
					teamData.has[moveId] = 1;
				}
				if (moveId in requiredMoves) {
					teamData.has[requiredMoves[moveId]] = 1;
				}
			}

			for (const typeName in this.dex.data.TypeChart) {
				// Cover any major weakness (3+) with at least one resistance
				if (teamData.resistances[typeName] >= 1) continue;
				if (resistanceAbilities[abilityData.id]?.includes(typeName) || !this.dex.getImmunity(typeName, types)) {
					// Heuristic: assume that Pokémon with these abilities don't have (too) negative typing.
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
					continue;
				}
				const typeMod = this.dex.getEffectiveness(typeName, types);
				if (typeMod < 0) {
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
				} else if (typeMod > 0) {
					teamData.weaknesses[typeName] = (teamData.weaknesses[typeName] || 0) + 1;
				}
			}
		}
		if (pokemon.length < 6) return this.randomFactoryTeam(side, ++depth);

		// Quality control
		if (!teamData.forceResult) {
			for (const requiredFamily of requiredMoveFamilies) {
				if (!teamData.has[requiredFamily]) return this.randomFactoryTeam(side, ++depth);
			}
			for (const typeName in teamData.weaknesses) {
				if (teamData.weaknesses[typeName] >= 3) return this.randomFactoryTeam(side, ++depth);
			}
		}

		return pokemon;
	}

	randomBSSFactorySets: AnyObject = require('./bss-factory-sets.json');

	randomBSSFactorySet(
		species: Species, teamData: RandomTeamsTypes.FactoryTeamDetails
	): RandomTeamsTypes.RandomFactorySet | null {
		const id = toID(species.name);
		// const flags = this.randomBSSFactorySets[tier][id].flags;
		const setList = this.randomBSSFactorySets[id].sets;

		const movesMax: {[k: string]: number} = {
			batonpass: 1,
			stealthrock: 1,
			spikes: 1,
			toxicspikes: 1,
			doubleedge: 1,
			trickroom: 1,
		};
		const requiredMoves: {[k: string]: number} = {};
		const weatherAbilitiesRequire: {[k: string]: string} = {
			swiftswim: 'raindance',
			sandrush: 'sandstorm', sandveil: 'sandstorm',
		};
		const weatherAbilities = ['drizzle', 'drought', 'snowwarning', 'sandstream'];

		// Build a pool of eligible sets, given the team partners
		// Also keep track of sets with moves the team requires
		let effectivePool: {set: AnyObject, moveVariants?: number[], itemVariants?: number, abilityVariants?: number}[] = [];
		const priorityPool = [];
		for (const curSet of setList) {
			const item = this.dex.getItem(curSet.item);
			if (teamData.megaCount && teamData.megaCount > 1 && item.megaStone) continue; // reject 3+ mega stones
			if (teamData.zCount && teamData.zCount > 1 && item.zMove) continue; // reject 3+ Z stones
			if (teamData.has[item.id]) continue; // Item clause

			const ability = this.dex.getAbility(curSet.ability);
			if (weatherAbilitiesRequire[ability.id] && teamData.weather !== weatherAbilitiesRequire[ability.id]) continue;
			if (teamData.weather && weatherAbilities.includes(ability.id)) continue; // reject 2+ weather setters

			if (curSet.species === 'Aron' && teamData.weather !== 'sandstorm') continue; // reject Aron without a Sand Stream user

			let reject = false;
			let hasRequiredMove = false;
			const curSetVariants = [];
			for (const move of curSet.moves) {
				const variantIndex = this.random(move.length);
				const moveId = toID(move[variantIndex]);
				if (movesMax[moveId] && teamData.has[moveId] >= movesMax[moveId]) {
					reject = true;
					break;
				}
				if (requiredMoves[moveId] && !teamData.has[requiredMoves[moveId]]) {
					hasRequiredMove = true;
				}
				curSetVariants.push(variantIndex);
			}
			if (reject) continue;
			effectivePool.push({set: curSet, moveVariants: curSetVariants});
			if (hasRequiredMove) priorityPool.push({set: curSet, moveVariants: curSetVariants});
		}
		if (priorityPool.length) effectivePool = priorityPool;

		if (!effectivePool.length) {
			if (!teamData.forceResult) return null;
			for (const curSet of setList) {
				effectivePool.push({set: curSet});
			}
		}

		const setData = this.sample(effectivePool);
		const moves = [];
		for (const [i, moveSlot] of setData.set.moves.entries()) {
			moves.push(setData.moveVariants ? moveSlot[setData.moveVariants[i]] : this.sample(moveSlot));
		}

		return {
			name: setData.set.nickname || setData.set.name || species.baseSpecies,
			species: setData.set.species,
			gender: setData.set.gender || species.gender || (this.randomChance(1, 2) ? 'M' : 'F'),
			item: setData.set.item || '',
			ability: setData.set.ability || species.abilities['0'],
			shiny: typeof setData.set.shiny === 'undefined' ? this.randomChance(1, 1024) : setData.set.shiny,
			level: setData.set.level || 50,
			happiness: typeof setData.set.happiness === 'undefined' ? 255 : setData.set.happiness,
			evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, ...setData.set.evs},
			ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31, ...setData.set.ivs},
			nature: setData.set.nature || 'Serious',
			moves,
		};
	}

	randomBSSFactoryTeam(side: PlayerOptions, depth = 0): RandomTeamsTypes.RandomFactorySet[] {
		const forceResult = (depth >= 4);

		const pokemon = [];

		const pokemonPool = Object.keys(this.randomBSSFactorySets);

		const teamData: TeamData = {
			typeCount: {}, typeComboCount: {}, baseFormes: {}, megaCount: 0, zCount: 0,
			eeveeLimCount: 0, has: {}, forceResult: forceResult, weaknesses: {}, resistances: {},
		};
		const requiredMoveFamilies: string[] = [];
		const requiredMoves: {[k: string]: string} = {};
		const weatherAbilitiesSet: {[k: string]: string} = {
			drizzle: 'raindance',
			drought: 'sunnyday',
			snowwarning: 'hail',
			sandstream: 'sandstorm',
		};
		const resistanceAbilities: {[k: string]: string[]} = {
			waterabsorb: ['Water'],
			flashfire: ['Fire'],
			lightningrod: ['Electric'], voltabsorb: ['Electric'],
			thickfat: ['Ice', 'Fire'],
			levitate: ['Ground'],
		};

		while (pokemonPool.length && pokemon.length < 6) {
			const species = this.dex.getSpecies(this.sampleNoReplace(pokemonPool));
			if (!species.exists) continue;

			const speciesFlags = this.randomBSSFactorySets[species.id].flags;
			if (!teamData.megaCount) teamData.megaCount = 0;

			// Limit to one of each species (Species Clause)
			if (teamData.baseFormes[species.baseSpecies]) continue;

			// Limit the number of Megas + Z-moves to 3
			if (teamData.megaCount + (teamData.zCount ? teamData.zCount : 0) >= 3 && speciesFlags.megaOnly) continue;

			// Limit 2 of any type
			const types = species.types;
			let skip = false;
			for (const type of types) {
				if (teamData.typeCount[type] > 1 && this.randomChance(4, 5)) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			// Restrict Eevee with certain Pokemon
			if (speciesFlags.limEevee) {
				if (!teamData.eeveeLimCount) teamData.eeveeLimCount = 0;
				teamData.eeveeLimCount++;
			}
			if (teamData.eeveeLimCount && teamData.eeveeLimCount >= 1 && speciesFlags.limEevee) continue;

			const set = this.randomBSSFactorySet(species, teamData);
			if (!set) continue;

			// Limit 1 of any type combination
			let typeCombo = types.slice().sort().join();
			if (set.ability === 'Drought' || set.ability === 'Drizzle') {
				// Drought and Drizzle don't count towards the type combo limit
				typeCombo = set.ability;
			}
			if (typeCombo in teamData.typeComboCount) continue;

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			// Now that our Pokemon has passed all checks, we can update team data:
			for (const type of types) {
				if (type in teamData.typeCount) {
					teamData.typeCount[type]++;
				} else {
					teamData.typeCount[type] = 1;
				}
			}
			teamData.typeComboCount[typeCombo] = 1;

			teamData.baseFormes[species.baseSpecies] = 1;

			// Limit Mega and Z-move
			const itemData = this.dex.getItem(set.item);
			if (itemData.megaStone) teamData.megaCount++;
			if (itemData.zMove) {
				if (!teamData.zCount) teamData.zCount = 0;
				teamData.zCount++;
			}
			// Limit to one of each item
			teamData.has[itemData.id] = 1;

			const abilityData = this.dex.getAbility(set.ability);
			if (abilityData.id in weatherAbilitiesSet) {
				teamData.weather = weatherAbilitiesSet[abilityData.id];
			}

			for (const move of set.moves) {
				const moveId = toID(move);
				if (moveId in teamData.has) {
					teamData.has[moveId]++;
				} else {
					teamData.has[moveId] = 1;
				}
				if (moveId in requiredMoves) {
					teamData.has[requiredMoves[moveId]] = 1;
				}
			}

			for (const typeName in this.dex.data.TypeChart) {
				// Cover any major weakness (3+) with at least one resistance
				if (teamData.resistances[typeName] >= 1) continue;
				if (resistanceAbilities[abilityData.id]?.includes(typeName) || !this.dex.getImmunity(typeName, types)) {
					// Heuristic: assume that Pokémon with these abilities don't have (too) negative typing.
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
					continue;
				}
				const typeMod = this.dex.getEffectiveness(typeName, types);
				if (typeMod < 0) {
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
				} else if (typeMod > 0) {
					teamData.weaknesses[typeName] = (teamData.weaknesses[typeName] || 0) + 1;
				}
			}
		}
		if (pokemon.length < 6) return this.randomBSSFactoryTeam(side, ++depth);

		// Quality control
		if (!teamData.forceResult) {
			for (const requiredFamily of requiredMoveFamilies) {
				if (!teamData.has[requiredFamily]) return this.randomBSSFactoryTeam(side, ++depth);
			}
			for (const type in teamData.weaknesses) {
				if (teamData.weaknesses[type] >= 3) return this.randomBSSFactoryTeam(side, ++depth);
			}
		}

		return pokemon;
	}

	randomSeasonalFireworksTeam() {
		const seasonalPokemonList = [
			"aerodactyl", "altaria", "archeops", "articuno", "azelf", "beautifly", "braviary", "bronzong",
			"butterfree", "carnivine", "charizard", "chingling", "claydol", "cresselia", "crobat", "cryogonal",
			"dragonite", "drifblim", "eelektross", "emolga", "fearow", "flygon", "giratinaorigin", "gligar",
			"gliscor", "gyarados", "honchkrow", "hooh", "hydreigon", "jumpluff", "landorus", "landorustherian",
			"latias", "latios", "lugia", "lunatone", "mandibuzz", "mantine", "masquerain", "mesprit", "mismagius",
			"moltres", "mothim", "ninjask", "noctowl", "noivern", "pelipper", "pidgeot", "rayquaza", "rotom",
			"rotomfan", "rotomfrost", "rotomheat", "rotommow", "rotomwash", "salamence", "scyther", "sigilyph",
			"skarmory", "solrock", "staraptor", "swanna", "swellow", "swoobat", "talonflame", "thundurus",
			"thundurustherian", "togekiss", "tornadus", "tornadustherian", "tropius", "unfezant", "uxie",
			"vespiquen", "vivillon", "weezing", "xatu", "yanma", "yanmega", "yveltal", "zapdos",
		];

		const forbiddenMoves = [
			'bodyslam', 'bulldoze', 'dig', 'dive', 'earthpower', 'earthquake', 'electricterrain', 'fissure',
			'firepledge', 'flyingpress', 'frenzyplant', 'geomancy', 'grassknot', 'grasspledge', 'grassyterrain',
			'gravity', 'heatcrash', 'heavyslam', 'ingrain', 'landswrath', 'magnitude', 'matblock', 'mistyterrain',
			'mudsport', 'muddywater', 'rototiller', 'seismictoss', 'slam', 'smackdown', 'spikes', 'stomp',
			'substitute', 'surf', 'toxicspikes', 'thousandarrows', 'thousandwaves', 'waterpledge', 'watersport',
		];

		const team = [];
		const typeCount: {[k: string]: number} = {};
		const typeComboCount: {[k: string]: number} = {};
		const baseFormes: {[k: string]: number} = {};
		let uberCount = 0;
		let puCount = 0;
		const teamDetails: RandomTeamsTypes.TeamDetails = {};
		const multipleFormes: {[k: string]: number} = {
			'Landorus': 2,
			'Rotom': 6,
			'Thundurus': 2,
			'Tornadus': 2,
		};

		while (team.length < 6) {
			const pokemon = this.sampleNoReplace(seasonalPokemonList);
			const template = this.dex.deepClone(this.dex.getSpecies(pokemon));

			if (!template.randomBattleMoves) template.randomBattleMoves = template.learnset;
			template.randomBattleMoves = template.randomBattleMoves.filter((move: string) => !forbiddenMoves.includes(move));

			// Define sets for the Ground/Flying mons that don't have good Flying STAB
			if (template.id === 'gligar') {
				template.randomBattleMoves = ['stealthrock', 'roost', 'knockoff', ['uturn', 'toxic'][this.random(2)]];
			}
			if (template.id === 'gliscor') {
				template.randomBattleMoves = ['stealthrock', 'protect', 'knockoff', ['toxic', 'roost'][this.random(2)]];
			}
			if (template.id === 'landorus') {
				template.randomBattleMoves = ['sludgewave', 'knockoff', 'rockslide', ['focusblast', 'psychic'][this.random(2)]];
			}
			if (template.id === 'landorustherian') {
				template.randomBattleMoves = ['uturn', 'stealthrock', 'stoneedge', 'knockoff'];
			}

			const tier = template.tier;
			switch (tier) {
			case 'Uber':
				// Ubers are limited to 2 but have a 20% chance of being added anyway.
				if (uberCount > 1 && this.random(5) >= 1) continue;
				break;
			case 'PU':
				// PUs are limited to 2 but have a 20% chance of being added anyway.
				if (puCount > 1 && this.random(5) >= 1) continue;
				break;
			}

			// Adjust rate for species with multiple formes
			if (multipleFormes[template.baseSpecies] && !this.randomChance(1, multipleFormes[template.baseSpecies]--)) continue;

			const set = this.randomSet(template, {}, !team.length);

			const types = template.types;

			// Limit 2 of any type, except Flying because it's most common
			let skip = false;
			for (const type of types) {
				if (type !== 'Flying' && typeCount[type] > 1 && this.random(5) >= 1) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			// Limit 1 of any type combination
			const typeCombo = types.slice().sort().join();
			if (typeCombo in typeComboCount) continue;

			// Okay, the set passes, add it to our team
			team.push(set);

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[template.baseSpecies] = 1;

			// Increment type counters
			for (const type of types) {
				if (type in typeCount) {
					typeCount[type]++;
				} else {
					typeCount[type] = 1;
				}
			}
			if (typeCombo in typeComboCount) {
				typeComboCount[typeCombo]++;
			} else {
				typeComboCount[typeCombo] = 1;
			}

			// Increment Uber/NU counters
			if (tier === 'Uber') {
				uberCount++;
			} else if (tier === 'PU') {
				puCount++;
			}

			// Team has Mega/weather/hazards
			if (this.dex.getItem(set.item).megaStone) teamDetails['megaStone'] = 1;
			if (set.ability === 'Snow Warning') teamDetails['hail'] = 1;
			if (set.ability === 'Drizzle' || set.moves.includes('raindance')) teamDetails['rain'] = 1;
			if (set.ability === 'Sand Stream') teamDetails['sand'] = 1;
			if (set.moves.includes('stealthrock')) teamDetails['stealthRock'] = 1;
			if (set.moves.includes('defog')) teamDetails['defog'] = 1;
			if (set.moves.includes('rapidspin')) teamDetails['rapidSpin'] = 1;
		}

		return team;
	}
}

export default RandomGen7Teams;
