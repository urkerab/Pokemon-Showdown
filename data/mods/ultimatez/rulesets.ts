export const Rulesets: {[k: string]: ModdedFormatData} = {
	evasionmovesclause: {
		effectType: 'ValidatorRule',
		name: 'Evasion Moves Clause',
		desc: "Bans moves that consistently raise the user's evasion when used, or when powered up by a Z-Crystal",
		banlist: ['Minimize', 'Double Team'],
		onBegin() {
			this.add('rule', 'Evasion Moves Clause: Evasion moves are banned');
		},
		onValidateSet(set, format, setHas) {
			const item = this.dex.items.get(set.item);
			if (!item.zMove) return;
			let evasionBoosted = false;
			for (const moveid of set.moves) {
				const move = this.dex.moves.get(moveid);
				if (move.zMove?.boost?.evasion && move.zMove.boost.evasion > 0) {
					evasionBoosted = true;
					break;
				}
			}
			if (evasionBoosted) return [(set.name || set.species) + " can boost Evasion, which is banned by Evasion Moves Clause."];
		},
	},
};
