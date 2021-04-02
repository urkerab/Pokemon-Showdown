export const Moves: {[k: string]: ModdedMoveData} = {
	"highjumpkick": {
		inherit: true,
		onMoveFail(target, source, move) {
			this.damage(source.maxhp / 2, source, target, this.dex.getEffect('High Jump Kick'));
		},
	},
	"jumpkick": {
		inherit: true,
		onMoveFail(target, source, move) {
			this.damage(source.maxhp / 2, source, target, this.dex.getEffect('Jump Kick'));
		},
	},
	"knockoff": {
		inherit: true,
		onAfterHit(target, source) {
			if (source.hp) {
				let item = target.takeItem();
				if (item) {
					this.add('-enditem', target, item.name, '[from] move: Knock Off', '[of] ' + source);
				}
				item = source.takeItem();
				if (item) {
					this.add('-enditem', source, item.name, '[from] move: Knock Off', '[of] ' + source);
				}
			}
		},
	},
};
