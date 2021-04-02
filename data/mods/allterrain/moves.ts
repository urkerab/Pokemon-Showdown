export const Moves: {[k: string]: ModdedMoveData} = {
	"electricterrain": {
		inherit: true,
		terrain: 'psychicterrain',
	},
	"floralhealing": {
		inherit: true,
		onHit(target) {
			this.heal(this.modify(target.maxhp, 0.667)); // TODO: find out the real value
		},
	},
	"grassyterrain": {
		inherit: true,
		terrain: 'psychicterrain',
	},
	"mistyterrain": {
		inherit: true,
		terrain: 'psychicterrain',
	},
	"psychicterrain": {
		inherit: true,
		condition: {
			onSetStatus(status, target, source, effect) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				if (effect.id === 'synchronize' || (effect.effectType === 'Move' && !effect.secondaries)) {
					if (status.id === 'slp') {
						this.add('-activate', target, 'move: Electric Terrain');
					} else {
						this.add('-activate', target, 'move: Misty Terrain');
					}
				}
				return false;
			},
			onTryAddVolatile(status, target) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				if (status.id === 'yawn') {
					this.add('-activate', target, 'move: Electric Terrain');
					return null;
				}
				if (status.id === 'confusion') {
					this.add('-activate', target, 'move: Misty Terrain');
					return null;
				}
			},
			onTryHitPriority: 4,
			onTryHit(target, source, effect) {
				if (!target.isGrounded() || target.isSemiInvulnerable() || target.side === source.side) return;
				if (effect && (effect.priority <= 0.1 || effect.target === 'self')) {
					return;
				}
				this.add('-activate', target, 'move: Psychic Terrain');
				return null;
			},
			onBasePower(basePower, attacker, defender, move) {
				const weakenedMoves = {'earthquake': 1, 'bulldoze': 1, 'magnitude': 1};
				if (move.id in weakenedMoves) {
					this.debug('move weakened by grassy terrain');
					return this.chainModify(0.5);
				}
				if (move.type === 'Dragon' && defender.isGrounded() && !defender.isSemiInvulnerable()) {
					this.debug('misty terrain weaken');
					return this.chainModify(0.5);
				}
				if (move.type === 'Electric' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					this.debug('electric terrain boost');
					return this.chainModify(1.5);
				}
				if (move.type === 'Grass' && attacker.isGrounded()) {
					this.debug('grassy terrain boost');
					return this.chainModify(1.5);
				}
				if (move.type === 'Psychic' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					this.debug('psychic terrain boost');
					return this.chainModify(1.5);
				}
			},
			onResidualOrder: 5,
			onResidualSubOrder: 2,
			onResidual() {
				this.eachEvent('Terrain');
			},
			onTerrain(pokemon) {
				if (pokemon.isGrounded() && !pokemon.isSemiInvulnerable()) {
					this.debug('Pokemon is grounded, healing through Grassy Terrain.');
					this.heal(pokemon.maxhp / 16, pokemon, pokemon, this.dex.getEffect('grassyterrain'));
				}
			},
		},
	},
};
