export const Moves: {[k: string]: ModdedMoveData} = {
	defog: {
		inherit: true,
		onHit(target, source, move) {
			let success = false;
			if (!target.volatiles['substitute'] || move.infiltrates) success = !!this.boost({evasion: -1});
			const removeTarget = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
			const removeAll = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
			for (const targetCondition of removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					if (!removeAll.includes(targetCondition)) continue;
					this.add('-sideend', target.side, this.dex.getEffect(targetCondition).name, '[from] move: Defog', '[of] ' + target);
					success = true;
				}
			}
			for (const sideCondition of removeAll) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.dex.getEffect(sideCondition).name, '[from] move: Defog', '[of] ' + source);
					success = true;
				}
			}
			if (target.side.removeSideCondition('statushazard')) success = true;
			if (source.side.removeSideCondition('statushazard')) success = true;
			return success;
		},
	},
	'rapidspin': {
		inherit: true,
		self: {
			onHit(pokemon) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
				}
				const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
				for (const condition of sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
						this.add('-sideend', pokemon.side, this.dex.getEffect(condition).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
				if (pokemon.hp) pokemon.side.removeSideCondition('statushazard');
			},
		},
	},
};
