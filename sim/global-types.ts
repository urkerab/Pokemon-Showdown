/* eslint-disable @typescript-eslint/no-unused-vars */

type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
};

type Battle = import('./battle').Battle;
type RequestState = import('./battle').RequestState;
type Field = import('./field').Field;
type BattleQueue = import('./battle-queue').BattleQueue;
type BattleActions = import('./battle-actions').BattleActions;
type Action = import('./battle-queue').Action;
type MoveAction = import('./battle-queue').MoveAction;
type ActionChoice = import('./battle-queue').ActionChoice;
type ModdedDex = import('./dex').ModdedDex;
type MoveSlot = import('./pokemon').MoveSlot;
type Pokemon = import('./pokemon').Pokemon;
type PRNGSeed = import('./prng').PRNGSeed;
type Side = import('./side').Side;
type TeamValidator = import('./team-validator').TeamValidator;
type PokemonSources = import('./team-validator').PokemonSources;

/** An ID must be lowercase alphanumeric. */
type ID = '' | string & {__isID: true};
type PokemonSlot = '' | string & {__isSlot: true};
interface AnyObject {[k: string]: any}

type GenderName = 'M' | 'F' | 'N' | '';
type StatsExceptHPTable = {atk: number, def: number, spa: number, spd: number, spe: number};
type StatIDExceptHP = keyof StatsExceptHPTable;
type StatsTable = {hp: number, atk: number, def: number, spa: number, spd: number, spe: number};
type StatID = keyof StatsTable;
type SparseStatsTable = Partial<StatsTable>;
type BoostsTable = {atk: number, def: number, spa: number, spd: number, spe: number, accuracy: number, evasion: number};
type SparseBoostsTable = Partial<BoostsTable>;
type BoostID = keyof BoostsTable;
type Nonstandard = 'Past' | 'Future' | 'Unobtainable' | 'CAP' | 'LGPE' | 'Custom' | 'Gigantamax';

type PokemonSet = import('./teams').PokemonSet;

type MegaDeltas = {
	abilities: SpeciesAbility,
	baseStats: StatsTable,
	weighthg: number,
	originalMega: string,
	requiredItem?: string,
	type?: string,
	isMega?: string,
	isPrimal?: boolean,
};

/**
 * Describes a possible way to get a move onto a pokemon.
 *
 * First character is a generation number, 1-7.
 * Second character is a source ID, one of:
 *
 * - M = TM/HM
 * - T = tutor
 * - L = start or level-up, 3rd char+ is the level
 * - R = restricted (special moves like Rotom moves)
 * - E = egg
 * - D = Dream World, only 5D is valid
 * - S = event, 3rd char+ is the index in .eventData
 * - V = Virtual Console or Let's Go transfer, only 7V/8V is valid
 * - C = NOT A REAL SOURCE, see note, only 3C/4C is valid
 *
 * C marks certain moves learned by a pokemon's prevo. It's used to
 * work around the chainbreeding checker's shortcuts for performance;
 * it lets the pokemon be a valid father for teaching the move, but
 * is otherwise ignored by the learnset checker (which will actually
 * check prevos for compatibility).
 */
type MoveSource = string;

namespace TierTypes {
	export type Singles = "AG" | "Uber" | "(Uber)" | "OU" | "(OU)" | "UUBL" | "UU" | "RUBL" | "RU" | "NUBL" | "NU" |
	"(NU)" | "PUBL" | "PU" | "(PU)" | "NFE" | "LC";
	export type Doubles = "DUber" | "(DUber)" | "DOU" | "(DOU)" | "DBL" | "DUU" | "(DUU)" | "NFE" | "LC";
	export type Other = "Unreleased" | "Illegal" | "CAP" | "CAP NFE" | "CAP LC";
}

interface EventInfo {
	generation: number;
	level?: number;
	/** true: always shiny, 1: sometimes shiny, false | undefined: never shiny */
	shiny?: boolean | 1;
	gender?: GenderName;
	nature?: string;
	ivs?: SparseStatsTable;
	perfectIVs?: number;
	/** true: has hidden ability, false | undefined: never has hidden ability */
	isHidden?: boolean;
	abilities?: string[];
	maxEggMoves?: number;
	moves?: string[];
	pokeball?: string;
	from?: string;
	/** Japan-only events can't be transferred to international games in Gen 1 */
	japan?: boolean;
}

type Effect = Ability | Item | ActiveMove | Species | Condition | Format;

interface CommonHandlers {
	ModifierEffect: (this: Battle, relayVar: number, target: Pokemon, source: Pokemon, effect: Effect) => number | void;
	ModifierMove: (this: Battle, relayVar: number, target: Pokemon, source: Pokemon, move: ActiveMove) => number | void;
	ResultMove: boolean | (
		(this: Battle, target: Pokemon, source: Pokemon, move: ActiveMove) => boolean | null | number | "" | void
	);
	ExtResultMove: boolean | (
		(this: Battle, target: Pokemon, source: Pokemon, move: ActiveMove) => boolean | null | number | "" | void
	);
	VoidEffect: (this: Battle, target: Pokemon, source: Pokemon, effect: Effect) => void;
	VoidMove: (this: Battle, target: Pokemon, source: Pokemon, move: ActiveMove) => void;
	ModifierSourceEffect: (
		this: Battle, relayVar: number, source: Pokemon, target: Pokemon, effect: Effect
	) => number | void;
	ModifierSourceMove: (
		this: Battle, relayVar: number, source: Pokemon, target: Pokemon, move: ActiveMove
	) => number | void;
	ResultSourceMove: boolean | (
		(this: Battle, source: Pokemon, target: Pokemon, move: ActiveMove) => boolean | null | "" | void
	);
	ExtResultSourceMove: boolean | (
		(this: Battle, source: Pokemon, target: Pokemon, move: ActiveMove) => boolean | null | number | "" | void
	);
	VoidSourceEffect: (this: Battle, source: Pokemon, target: Pokemon, effect: Effect) => void;
	VoidSourceMove: (this: Battle, source: Pokemon, target: Pokemon, move: ActiveMove) => void;
}

interface EffectData {
	name?: string;
	desc?: string;
	duration?: number;
	durationCallback?: (this: Battle, target: Pokemon, source: Pokemon, effect: Effect | null) => number;
	effectType?: string;
	infiltrates?: boolean;
	isNonstandard?: Nonstandard | null;
	shortDesc?: string;
}

interface ModdedEffectData extends Partial<EffectData> {
	inherit?: boolean;

	// oms
	fullname?: string;
}

type EffectType =
	'Condition' | 'Pokemon' | 'Move' | 'Item' | 'Ability' | 'Format' |
	'Nature' | 'Ruleset' | 'Weather' | 'Status' | 'Rule' | 'ValidatorRule';

interface BasicEffect extends EffectData {
	id: ID;
	effectType: EffectType;
	exists: boolean;
	fullname: string;
	gen: number;
	sourceEffect: string;
	toString: () => string;
}

type ConditionData = import('./dex-conditions').ConditionData;
type ModdedConditionData = import('./dex-conditions').ModdedConditionData;
type Condition = import('./dex-conditions').Condition;

type MoveData = import('./dex-moves').MoveData;
type ModdedMoveData = import('./dex-moves').ModdedMoveData;
type ActiveMove = import('./dex-moves').ActiveMove;
type Move = import('./dex-moves').Move;
type MoveTarget = import('./dex-moves').MoveTarget;
type MoveCategory = import('./dex-moves').MoveCategory;
type HitEffect = import('./dex-moves').HitEffect;
type SecondaryEffect = import('./dex-moves').SecondaryEffect;

type ItemData = import('./dex-items').ItemData;
type ModdedItemData = import('./dex-items').ModdedItemData;
type Item = import('./dex-items').Item;

type AbilityData = import('./dex-abilities').AbilityData;
type ModdedAbilityData = import('./dex-abilities').ModdedAbilityData;
type Ability = import('./dex-abilities').Ability;

type SpeciesData = import('./dex-species').SpeciesData;
type ModdedSpeciesData = import('./dex-species').ModdedSpeciesData;
type SpeciesFormatsData = import('./dex-species').SpeciesFormatsData;
type ModdedSpeciesFormatsData = import('./dex-species').ModdedSpeciesFormatsData;
type LearnsetData = import('./dex-species').LearnsetData;
type ModdedLearnsetData = import('./dex-species').ModdedLearnsetData;
type Species = import('./dex-species').Species;
type AbilityIndex = import('./dex-species').AbilityIndex;
type SpeciesAbility = import('./dex-species').SpeciesAbility;

type FormatData = import('./dex-formats').FormatData;
type FormatList = import('./dex-formats').FormatList;
type ModdedFormatData = import('./dex-formats').ModdedFormatData;
type Format = import('./dex-formats').Format;

interface InheritableFormatData extends Partial<FormatData> {
	inherit?: string[];
}

interface NatureData {
	name: string;
	plus?: StatIDExceptHP;
	minus?: StatIDExceptHP;
}

type ModdedNatureData = NatureData | Partial<Omit<NatureData, 'name'>> & {inherit: true};

type Nature = import('./dex-data').Nature;

type GameType = 'singles' | 'doubles' | 'triples' | 'rotation' | 'multi' | 'freeforall';
type SideID = 'p1' | 'p2' | 'p3' | 'p4';

interface GameTimerSettings {
	dcTimer: boolean;
	dcTimerBank: boolean;
	starting: number;
	grace: number;
	addPerTurn: number;
	maxPerTurn: number;
	maxFirstTurn: number;
	timeoutAutoChoose: boolean;
	accelerate: boolean;
}

type SpreadMoveTargets = (Pokemon | false | null)[];
type SpreadMoveDamage = (number | boolean | undefined)[];
type ZMoveOptions = ({move: string, target: MoveTarget, basePower: number, category: string} | null)[];
interface DynamaxOptions {
	maxMoves: ({move: string, target: MoveTarget, disabled?: boolean})[];
	gigantamax?: string;
}

interface BattleScriptsData {
	gen: number;
}

interface ModdedBattleActions {
	inherit?: true;
	afterMoveSecondaryEvent?: (this: BattleActions, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => undefined;
	calcRecoilDamage?: (this: BattleActions, damageDealt: number, move: Move) => number;
	canMegaEvo?: (this: BattleActions, pokemon: Pokemon) => string | undefined | null;
	canUltraBurst?: (this: BattleActions, pokemon: Pokemon) => string | null;
	canZMove?: (this: BattleActions, pokemon: Pokemon) => ZMoveOptions | void;
	canDynamax?: (this: BattleActions, pokemon: Pokemon, skipChecks?: boolean) => DynamaxOptions | void;
	forceSwitch?: (
		this: BattleActions, damage: SpreadMoveDamage, targets: SpreadMoveTargets, source: Pokemon,
		move: ActiveMove, moveData: ActiveMove, isSecondary?: boolean, isSelf?: boolean
	) => SpreadMoveDamage;
	getActiveMaxMove?: (this: BattleActions, move: Move, pokemon: Pokemon) => ActiveMove;
	getActiveZMove?: (this: BattleActions, move: Move, pokemon: Pokemon) => ActiveMove;
	getMaxMove?: (this: BattleActions, move: Move, pokemon: Pokemon) => Move | undefined;
	getSpreadDamage?: (
		this: BattleActions, damage: SpreadMoveDamage, targets: SpreadMoveTargets, source: Pokemon,
		move: ActiveMove, moveData: ActiveMove, isSecondary?: boolean, isSelf?: boolean
	) => SpreadMoveDamage;
	getZMove?: (this: BattleActions, move: Move, pokemon: Pokemon, skipChecks?: boolean) => string | true | undefined;
	hitStepAccuracy?: (this: BattleActions, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => boolean[];
	hitStepBreakProtect?: (this: BattleActions, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => undefined;
	hitStepMoveHitLoop?: (this: BattleActions, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => SpreadMoveDamage;
	hitStepTryImmunity?: (this: BattleActions, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => boolean[];
	hitStepStealBoosts?: (this: BattleActions, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => undefined;
	hitStepTryHitEvent?: (this: BattleActions, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => (boolean | '')[];
	hitStepInvulnerabilityEvent?: (
		this: BattleActions, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove
	) => boolean[];
	hitStepTypeImmunity?: (this: BattleActions, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => boolean[];
	moveHit?: (
		this: BattleActions, target: Pokemon | null, pokemon: Pokemon, move: ActiveMove,
		moveData?: ActiveMove, isSecondary?: boolean, isSelf?: boolean
	) => number | undefined | false;
	runMegaEvo?: (this: BattleActions, pokemon: Pokemon) => boolean;
	runMove?: (
		this: BattleActions, moveOrMoveName: Move | string, pokemon: Pokemon, targetLoc: number, sourceEffect?: Effect | null,
		zMove?: string, externalMove?: boolean, maxMove?: string, originalTarget?: Pokemon
	) => void;
	runMoveEffects?: (
		this: BattleActions, damage: SpreadMoveDamage, targets: SpreadMoveTargets, source: Pokemon,
		move: ActiveMove, moveData: ActiveMove, isSecondary?: boolean, isSelf?: boolean
	) => SpreadMoveDamage;
	runZPower?: (this: BattleActions, move: ActiveMove, pokemon: Pokemon) => void;
	secondaries?: (
		this: BattleActions, targets: SpreadMoveTargets, source: Pokemon, move: ActiveMove,
		moveData: ActiveMove, isSelf?: boolean
	) => void;
	selfDrops?: (
		this: BattleActions, targets: SpreadMoveTargets, source: Pokemon,
		move: ActiveMove, moveData: ActiveMove, isSecondary?: boolean
	) => void;
	spreadMoveHit?: (
		this: BattleActions, targets: SpreadMoveTargets, pokemon: Pokemon, move: ActiveMove,
		moveData?: ActiveMove, isSecondary?: boolean, isSelf?: boolean
	) => [SpreadMoveDamage, SpreadMoveTargets];
	targetTypeChoices?: (this: BattleActions, targetType: string) => boolean;
	tryMoveHit?: (
		this: BattleActions, target: Pokemon, pokemon: Pokemon, move: ActiveMove
	) => number | undefined | false;
	tryPrimaryHitEvent?: (
		this: BattleActions, damage: SpreadMoveDamage, targets: SpreadMoveTargets, pokemon: Pokemon,
		move: ActiveMove, moveData: ActiveMove, isSecondary?: boolean
	) => SpreadMoveDamage;
	trySpreadMoveHit?: (
		this: BattleActions, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove, notActive?: boolean
	) => boolean;
	useMove?: (
		this: BattleActions, move: Move, pokemon: Pokemon, target?: Pokemon | null,
		sourceEffect?: Effect | null, zMove?: string, maxMove?: string
	) => boolean;
	useMoveInner?: (
		this: BattleActions, move: Move, pokemon: Pokemon, target?: Pokemon | null,
		sourceEffect?: Effect | null, zMove?: string, maxMove?: string
	) => boolean;
	getDamage?: (
		this: BattleActions, pokemon: Pokemon, target: Pokemon, move: string | number | ActiveMove, suppressMessages: boolean
	) => number | undefined | null | false;
	modifyDamage?: (
		this: BattleActions, baseDamage: number, pokemon: Pokemon, target: Pokemon, move: ActiveMove, suppressMessages?: boolean
	) => void;

	// oms
	doGetMixedSpecies?: (this: BattleActions, species: Species, deltas: AnyObject) => Species;
	getMegaDeltas?: (this: BattleActions, megaSpecies: Species) => AnyObject;
	getMixedSpecies?: (this: BattleActions, originalName: string, megaName: string) => Species;
}

interface ModdedBattleSide {
	canDynamaxNow?: (this: Side) => boolean;
	chooseMove?: (
		this: Side, moveText: string | number, targetLoc?: number, megaOrZ?: 'mega' | 'zmove' | 'ultra' | 'dynamax' | ''
	) => boolean;
	getRequestData?: (this: Side, forAlly?: boolean) => {name: string, id: ID, pokemon: AnyObject[]};
	lastMove?: Move | null;
	/// emitCallback?: (this: Side, ...args: (string | number | AnyObject)[]) => void;
}

interface ModdedBattlePokemon {
	inherit?: true;
	lostItemForDelibird?: Item | null;
	boostBy?: (this: Pokemon, boost: SparseBoostsTable) => boolean | number;
	clearBoosts?: (this: Pokemon) => void;
	calculateStat?: (this: Pokemon, statName: StatIDExceptHP, boost: number, modifier?: number) => number;
	cureStatus?: (this: Pokemon, silent?: boolean) => boolean;
	eatItem?: (this: Pokemon, force?: boolean, source?: Pokemon, sourceEffect?: Effect) => boolean;
	formeChange?: (
		this: Pokemon, speciesId: string | Species, source: Effect, isPermanent?: boolean, message?: string
	) => boolean;
	getAbility?: (this: Pokemon) => Ability;
	getActionSpeed?: (this: Pokemon) => number;
	getItem?: (this: Pokemon) => Item;
	getMoveRequestData?: (this: Pokemon) => {
		moves: {move: string, id: ID, target?: string, disabled?: boolean}[],
		maybeDisabled?: boolean, trapped?: boolean, maybeTrapped?: boolean,
		canMegaEvo?: boolean, canUltraBurst?: boolean, canZMove?: ZMoveOptions,
	};
	getStat?: (
		this: Pokemon, statName: StatIDExceptHP, unboosted?: boolean, unmodified?: boolean, fastReturn?: boolean
	) => number;
	getTypes?: (this: Pokemon, excludeAdded?: boolean) => string[];
	getVolatile?: (this: Pokemon, status: string | Effect) => Effect | null;
	getWeight?: (this: Pokemon) => number;
	hasAbility?: (this: Pokemon, ability: string | string[]) => boolean;
	hasItem?: (this: Pokemon, item: string | string[]) => boolean;
	hasType?: (this: Pokemon, type: string | string[]) => boolean;
	isGrounded?: (this: Pokemon, negateImmunity: boolean | undefined) => boolean | null;
	modifyStat?: (this: Pokemon, statName: StatIDExceptHP, modifier: number) => void;
	moveUsed?: (this: Pokemon, move: ActiveMove, targetLoc?: number) => void;
	recalculateStats?: (this: Pokemon) => void;
	runImmunity?: (this: Pokemon, type: string, message?: string | boolean) => boolean;
	setAbility?: (
		this: Pokemon, ability: string | Ability, source: Pokemon | null, isFromFormeChange: boolean
	) => string | false;
	setItem?: (this: Pokemon, item: string | Item, source?: Pokemon, effect?: Effect) => boolean;
	setStatus?: (
		this: Pokemon, status: string | Condition, source: Pokemon | null,
		sourceEffect: Effect | null, ignoreImmunities: boolean
	) => boolean;
	takeItem?: (this: Pokemon, source: Pokemon | undefined) => boolean | Item;
	transformInto?: (this: Pokemon, pokemon: Pokemon, effect: Effect | null) => boolean;
	useItem?: (this: Pokemon, source?: Pokemon, sourceEffect?: Effect) => boolean;
	ignoringAbility?: (this: Pokemon) => boolean;
	ignoringItem?: (this: Pokemon) => boolean;

	// OMs
	getSharedPower?: (this: Pokemon) => Set<string>;
	takeDual?: (this: Pokemon, source?: Pokemon) => Item | false;
	getLinkedMoves?: (this: Pokemon, ignoreDisabled?: boolean) => ID[];
	hasLinkedMove?: (this: Pokemon, moveid: ID) => boolean;
}

interface ModdedBattleQueue extends Partial<BattleQueue> {
	resolveAction?: (this: BattleQueue, action: ActionChoice, midTurn?: boolean) => Action[];
}

interface ModdedField extends Partial<Field> {
	suppressingWeather?: (this: Field) => boolean;
	setTerrain?: (this: Field, status: string | Effect, source: Pokemon | 'debug' | null, sourceEffect: Effect | null) => boolean;
}

interface ModdedBattleScriptsData extends Partial<BattleScriptsData> {
	inherit?: string;
	actions?: ModdedBattleActions;
	pokemon?: ModdedBattlePokemon;
	queue?: ModdedBattleQueue;
	field?: ModdedField;
	side?: ModdedBattleSide;
	boost?: (
		this: Battle, boost: SparseBoostsTable, target: Pokemon, source?: Pokemon | null,
		effect?: Effect | null, isSecondary?: boolean, isSelf?: boolean
	) => boolean | null | 0;
	choose?: (this: Battle, sideid: string, input: string) => boolean;
	debug?: (this: Battle, activity: string) => void;
	faintMessages?: (this: Battle, lastFirst?: boolean) => void;
	getActionSpeed?: (this: Battle, action: AnyObject) => void;
	init?: (this: ModdedDex) => void;
	makeRequest?: (this: Battle, type?: RequestState) => void;
	natureModify?: (this: Battle, stats: StatsTable, set: PokemonSet) => StatsTable;
	nextTurn?: (this: Battle) => void;
	runAction?: (this: Battle, action: Action) => void;
	spreadModify?: (this: Battle, baseStats: StatsTable, set: PokemonSet) => StatsTable;
	tiebreak?: (this: Battle) => boolean;
	trunc?: (n: number) => number;
	undoChoice?: (this: Battle, sideid: string) => void;

	// oms
	doGetMixedSpecies?: (this: Battle, species: Species, deltas: MegaDeltas) => Species;
	getItem?: (this: Battle, item: string | Item) => Item;
	getMegaDeltas?: (this: Battle, megaSpecies: Species) => MegaDeltas;
	getMixedSpecies?: (this: Battle, originalName: string, megaName: string) => Species;
	win?: (this: Battle, side?: string | Side | null) => boolean;
	bounceMove?: (this: Battle, move: Effect, target: Pokemon, source?: Pokemon) => void;
	tryMoveHit?: (this: Battle, target: Pokemon, pokemon: Pokemon, move: ActiveMove) => number | undefined | false;
	moveHit?: (
		this: Battle, target: Pokemon | null, pokemon: Pokemon, move: ActiveMove,
		moveData?: ActiveMove, isSecondary?: boolean, isSelf?: boolean
	) => number | undefined | false;
	comparePriority?: (this: Battle, a: AnyObject, b: AnyObject) => number;
}

interface TypeData {
	damageTaken: {[attackingTypeNameOrEffectid: string]: number};
	HPdvs?: SparseStatsTable;
	HPivs?: SparseStatsTable;
	isNonstandard?: Nonstandard | null;
}

type ModdedTypeData = TypeData | Partial<Omit<TypeData, 'name'>> & {inherit: true};

type TypeInfo = import('./dex-data').TypeInfo;

interface PlayerOptions {
	name?: string;
	avatar?: string;
	rating?: number;
	team?: PokemonSet[] | string | null;
	seed?: PRNGSeed;
}

interface TextObject {
	desc?: string;
	shortDesc?: string;
}
interface Plines {
	activate?: string;
	addItem?: string;
	block?: string;
	boost?: string;
	cant?: string;
	changeAbility?: string;
	damage?: string;
	end?: string;
	heal?: string;
	move?: string;
	start?: string;
	transform?: string;
}

interface TextFile extends TextObject {
	name: string;
	gen1?: ModdedTextObject;
	gen2?: ModdedTextObject;
	gen3?: ModdedTextObject;
	gen4?: ModdedTextObject;
	gen5?: ModdedTextObject;
	gen6?: ModdedTextObject;
	gen7?: ModdedTextObject;
}

interface MovePlines extends Plines {
	alreadyStarted?: string;
	blockSelf?: string;
	clearBoost?: string;
	endFromItem?: string;
	fail?: string;
	failSelect?: string;
	failTooHeavy?: string;
	failWrongForme?: string;
	megaNoItem?: string;
	prepare?: string;
	removeItem?: string;
	startFromItem?: string;
	startFromZEffect?: string;
	switchOut?: string;
	takeItem?: string;
	typeChange?: string;
	upkeep?: string;
}

interface AbilityText extends TextFile, Plines {
	activateNoTarget?: string;
	transformEnd?: string;
}

/* eslint-disable @typescript-eslint/no-empty-interface */
interface MoveText extends TextFile, MovePlines {}

interface ItemText extends TextFile, Plines {}

interface PokedexText extends TextFile {}

interface DefaultText extends AnyObject {}

interface ModdedTextObject extends TextObject, Plines {}
/* eslint-enable @typescript-eslint/no-empty-interface */

namespace RandomTeamsTypes {
	export interface TeamDetails {
		megaStone?: number;
		zMove?: number;
		hail?: number;
		rain?: number;
		sand?: number;
		sun?: number;
		stealthRock?: number;
		spikes?: number;
		toxicSpikes?: number;
		stickyWeb?: number;
		rapidSpin?: number;
		defog?: number;
		screens?: number;
		illusion?: number;
		statusCure?: number;
	}
	export interface FactoryTeamDetails {
		megaCount?: number;
		zCount?: number;
		forceResult: boolean;
		weather?: string;
		typeCount: {[k: string]: number};
		typeComboCount: {[k: string]: number};
		baseFormes: {[k: string]: number};
		has: {[k: string]: number};
		weaknesses: {[k: string]: number};
		resistances: {[k: string]: number};
		gigantamax?: boolean;
	}
	export interface RandomSet {
		name: string;
		species: string;
		gender: string | boolean;
		moves: string[];
		ability: string;
		evs: SparseStatsTable;
		ivs: SparseStatsTable;
		item: string;
		level: number;
		shiny: boolean;
		nature?: string;
		happiness?: number;
		dynamaxLevel?: number;
		gigantamax?: boolean;
		// oms
		donorTemplate?: string;
	}
	export interface RandomFactorySet {
		name: string;
		species: string;
		gender: string;
		item: string;
		ability: string;
		shiny: boolean;
		level: number;
		happiness: number;
		evs: SparseStatsTable;
		ivs: SparseStatsTable;
		nature: string;
		moves: string[];
		dynamaxLevel?: number;
		gigantamax?: boolean;
	}
}
