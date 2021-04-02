export const Items: {[k: string]: ModdedItemData} = {
	absorbbulb: {
		inherit: true,
		isNonstandard: "Future",
	},
	adrenalineorb: {
		inherit: true,
		isNonstandard: "Future",
	},
	airballoon: {
		inherit: true,
		isNonstandard: "Future",
	},
	assaultvest: {
		inherit: true,
		isNonstandard: "Future",
	},
	berrysweet: {
		inherit: true,
		isNonstandard: "Future",
	},
	bindingband: {
		inherit: true,
		isNonstandard: "Future",
	},
	beastball: {
		inherit: true,
		isNonstandard: "Future",
	},
	blunderpolicy: {
		inherit: true,
		isNonstandard: "Future",
	},
	bugmemory: {
		inherit: true,
		isNonstandard: "Future",
	},
	burndrive: {
		inherit: true,
		isNonstandard: "Future",
	},
	cellbattery: {
		inherit: true,
		isNonstandard: "Future",
	},
	chilldrive: {
		inherit: true,
		isNonstandard: "Future",
	},
	chippedpot: {
		inherit: true,
		isNonstandard: "Future",
	},
	cloversweet: {
		inherit: true,
		isNonstandard: "Future",
	},
	coverfossil: {
		inherit: true,
		isNonstandard: "Future",
	},
	crackedpot: {
		inherit: true,
		isNonstandard: "Future",
	},
	darkmemory: {
		inherit: true,
		isNonstandard: "Future",
	},
	dousedrive: {
		inherit: true,
		isNonstandard: "Future",
	},
	dracoplate: {
		inherit: true,
		isNonstandard: null,
	},
	dragonmemory: {
		inherit: true,
		isNonstandard: "Future",
	},
	dreadplate: {
		inherit: true,
		isNonstandard: null,
	},
	dreamball: {
		inherit: true,
		isNonstandard: "Future",
	},
	earthplate: {
		inherit: true,
		isNonstandard: null,
	},
	ejectbutton: {
		inherit: true,
		isNonstandard: "Unobtainable",
		onAfterMoveSecondary(target, source, move) {
			if (source && source !== target && target.hp && move && move.category !== 'Status' && !move.isFutureMove) {
				if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.beingCalledBack || target.isSkyDropped()) return;
				for (const pokemon of this.getAllActive()) {
					if (pokemon.switchFlag === true) return;
				}
				// TODO: Confirm mechanics
				this.add("-activate", target, "item: Eject Button");
				target.switchFlag = true;
				source.switchFlag = false;
			}
		},
	},
	ejectpack: {
		inherit: true,
		isNonstandard: "Future",
	},
	electricmemory: {
		inherit: true,
		isNonstandard: "Future",
	},
	electricseed: {
		inherit: true,
		isNonstandard: "Future",
	},
	eviolite: {
		inherit: true,
		isNonstandard: "Unobtainable",
		// TODO: Figure out calculation
	},
	fairymemory: {
		inherit: true,
		isNonstandard: "Future",
	},
	fightingmemory: {
		inherit: true,
		isNonstandard: "Future",
	},
	firememory: {
		inherit: true,
		isNonstandard: "Future",
	},
	fistplate: {
		inherit: true,
		isNonstandard: null,
	},
	flameplate: {
		inherit: true,
		isNonstandard: null,
	},
	floatstone: {
		inherit: true,
		isNonstandard: "Future",
	},
	flowersweet: {
		inherit: true,
		isNonstandard: "Future",
	},
	flyingmemory: {
		inherit: true,
		isNonstandard: "Future",
	},
	fossilizedbird: {
		inherit: true,
		isNonstandard: "Future",
	},
	fossilizeddino: {
		inherit: true,
		isNonstandard: "Future",
	},
	fossilizeddrake: {
		inherit: true,
		isNonstandard: "Future",
	},
	fossilizedfish: {
		inherit: true,
		isNonstandard: "Future",
	},
	galaricacuff: {
		inherit: true,
		isNonstandard: "Future",
	},
	galaricawreath: {
		inherit: true,
		isNonstandard: "Future",
	},
	ghostmemory: {
		inherit: true,
		isNonstandard: "Future",
	},
	grassmemory: {
		inherit: true,
		isNonstandard: "Future",
	},
	grassyseed: {
		inherit: true,
		isNonstandard: "Future",
	},
	groundmemory: {
		inherit: true,
		isNonstandard: "Future",
	},
	heavydutyboots: {
		inherit: true,
		isNonstandard: "Future",
	},
	icememory: {
		inherit: true,
		isNonstandard: "Future",
	},
	icestone: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	icicleplate: {
		inherit: true,
		isNonstandard: null,
	},
	insectplate: {
		inherit: true,
		isNonstandard: null,
	},
	ironplate: {
		inherit: true,
		isNonstandard: null,
	},
	jawfossil: {
		inherit: true,
		isNonstandard: "Future",
	},
	keeberry: {
		inherit: true,
		isNonstandard: "Future",
	},
	lovesweet: {
		inherit: true,
		isNonstandard: "Future",
	},
	luckypunch: {
		inherit: true,
		isNonstandard: null,
	},
	luminousmoss: {
		inherit: true,
		isNonstandard: "Future",
	},
	marangaberry: {
		inherit: true,
		isNonstandard: "Future",
	},
	meadowplate: {
		inherit: true,
		isNonstandard: null,
	},
	mindplate: {
		inherit: true,
		isNonstandard: null,
	},
	mistyseed: {
		inherit: true,
		isNonstandard: "Future",
	},
	normalgem: {
		inherit: true,
		isNonstandard: "Future",
	},
	plumefossil: {
		inherit: true,
		isNonstandard: "Future",
	},
	poisonmemory: {
		inherit: true,
		isNonstandard: "Future",
	},
	protectivepads: {
		inherit: true,
		isNonstandard: "Future",
	},
	psychicmemory: {
		inherit: true,
		isNonstandard: "Future",
	},
	psychicseed: {
		inherit: true,
		isNonstandard: "Future",
	},
	razorfang: {
		inherit: true,
		isNonstandard: null,
	},
	redcard: {
		inherit: true,
		isNonstandard: "Future",
	},
	ribbonsweet: {
		inherit: true,
		isNonstandard: "Future",
	},
	ringtarget: {
		inherit: true,
		isNonstandard: "Future",
	},
	rockmemory: {
		inherit: true,
		isNonstandard: "Future",
	},
	rockyhelmet: {
		inherit: true,
		isNonstandard: "Future",
	},
	roomservice: {
		inherit: true,
		isNonstandard: "Future",
	},
	rustedshield: {
		inherit: true,
		isNonstandard: "Future",
	},
	rustedsword: {
		inherit: true,
		isNonstandard: "Future",
	},
	sachet: {
		inherit: true,
		isNonstandard: "Future",
	},
	safariball: {
		inherit: true,
		isNonstandard: "Future",
	},
	safetygoggles: {
		inherit: true,
		isNonstandard: "Future",
	},
	sailfossil: {
		inherit: true,
		isNonstandard: "Future",
	},
	shockdrive: {
		inherit: true,
		isNonstandard: "Future",
	},
	skyplate: {
		inherit: true,
		isNonstandard: null,
	},
	snowball: {
		inherit: true,
		isNonstandard: "Future",
	},
	splashplate: {
		inherit: true,
		isNonstandard: null,
	},
	spookyplate: {
		inherit: true,
		isNonstandard: null,
	},
	starsweet: {
		inherit: true,
		isNonstandard: "Future",
	},
	steelmemory: {
		inherit: true,
		isNonstandard: "Future",
	},
	stoneplate: {
		inherit: true,
		isNonstandard: null,
	},
	strawberrysweet: {
		inherit: true,
		isNonstandard: "Future",
	},
	sweetapple: {
		inherit: true,
		isNonstandard: "Future",
	},
	tartapple: {
		inherit: true,
		isNonstandard: "Future",
	},
	terrainextender: {
		inherit: true,
		isNonstandard: "Future",
	},
	throatspray: {
		inherit: true,
		isNonstandard: "Future",
	},
	toxicplate: {
		inherit: true,
		isNonstandard: null,
	},
	tr00: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr01: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr02: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr03: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr04: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr05: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr06: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr07: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr08: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr09: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr10: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr11: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr12: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr13: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr14: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr15: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr16: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr17: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr18: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr19: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr20: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr21: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr22: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr23: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr24: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr25: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr26: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr27: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr28: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr29: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr30: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr31: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr32: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr33: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr34: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr35: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr36: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr37: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr38: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr39: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr40: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr41: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr42: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr43: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr44: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr45: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr46: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr47: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr48: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr49: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr50: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr51: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr52: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr53: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr54: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr55: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr56: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr57: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr58: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr59: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr60: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr61: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr62: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr63: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr64: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr65: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr66: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr67: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr68: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr69: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr70: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr71: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr72: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr73: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr74: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr75: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr76: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr77: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr78: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr79: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr80: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr81: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr82: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr83: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr84: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr85: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr86: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr87: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr88: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr89: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr90: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr91: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr92: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr93: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr94: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr95: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr96: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr97: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr98: {
		inherit: true,
		isNonstandard: "Future",
	},
	tr99: {
		inherit: true,
		isNonstandard: "Future",
	},
	utilityumbrella: {
		inherit: true,
		isNonstandard: "Future",
	},
	watermemory: {
		inherit: true,
		isNonstandard: "Future",
	},
	weaknesspolicy: {
		inherit: true,
		isNonstandard: "Future",
	},
	whippeddream: {
		inherit: true,
		isNonstandard: "Future",
	},
	zapplate: {
		inherit: true,
		isNonstandard: null,
	},
};
