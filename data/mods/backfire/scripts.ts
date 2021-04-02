export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen6',
	init() {
		for (const moveid in this.data.Moves) {
			const movedata = this.data.Moves[moveid];
			if (movedata.self || movedata.secondary || movedata.secondaries) {
				const move = this.modData("Moves", moveid);
				if (move.self) {
					(Object.keys(move.self) as (keyof HitEffect)[]).forEach(effect => {
						if (move.self[effect] !== 'lockedmove') {
							move[effect] = move.self[effect];
						}
					});
				}
				if (move.volatileStatus === 'partiallytrapped') {
					if (!move.self) move.self = {};
					move.self.volatileStatus = 'partiallytrapped';
				}
				if (move.secondary && !move.secondaries) move.secondaries = [move.secondary];
				if (move.secondaries) {
					const secondaries = move.secondaries.map((secondary: SecondaryEffect) => secondary.self || {self: secondary});
					move.secondaries = move.secondaries.concat(secondaries);
				}
			}
		}
	},
};
