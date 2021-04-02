export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen7',
	getZMove(move, pokemon, skipChecks) {
		const item = pokemon.getItem();
		if (!skipChecks) {
			if (!item.zMove) return;
			if (item.itemUser && !item.itemUser.includes(pokemon.species.name)) return;
			const moveData = pokemon.getMoveData(move);
			if (!moveData || !moveData.pp) return; // Draining the PP of the base move prevents the corresponding Z-move from being used.
		}

		if (move.category === 'Status') return move.name;
		if (item.zMoveFrom) {
			if (move.name === item.zMoveFrom) return item.zMove as string;
		} else if (move.zMove?.basePower) {
			if (item.zMoveType) return this.zMoveTable[item.zMoveType];
		}
	},
	getActiveZMove(move, pokemon) {
		move = this.dex.getMove(move);
		if (move.category === 'Status') {
			const zMove = this.dex.getActiveMove(move);
			if (!zMove.isZ) (zMove as any).name = 'Z-' + zMove.name;
			zMove.isZ = true;
			return zMove;
		}
		const item = pokemon.getItem();
		if (item.zMoveFrom) return this.dex.getActiveMove(item.zMove as string);
		const zMove = this.dex.getActiveMove(this.zMoveTable[item.zMoveType!]);
		zMove.basePower = move.zMove!.basePower!;
		zMove.category = move.category;
		// copy the priority for Quick Guard
		zMove.priority = move.priority;
		return zMove;
	},
	canZMove(pokemon) {
		const item = pokemon.getItem();
		if (!item.zMove) return;
		if (item.itemUser && !item.itemUser.includes(pokemon.species.name)) return;
		let atLeastOne = false;
		const zMoves = [];
		for (const moveSlot of pokemon.moveSlots) {
			if (moveSlot.pp <= 0) {
				zMoves.push(null);
				continue;
			}
			const move = this.dex.getMove(moveSlot.id);
			if (this.getZMove(move, pokemon, true)) {
				const zMove = this.getActiveZMove(move, pokemon);
				zMoves.push({move: zMove.name, target: zMove.target, basePower: zMove.basePower, category: zMove.category});
				atLeastOne = true;
			} else {
				zMoves.push(null);
			}
		}
		if (atLeastOne) return zMoves;
	},
};
