export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen7',
	bounceMove(move, target, source) {
		if (!target.hp) return;
		if (target === source || move.effectType !== 'Move' || move.isExternal) return;
		this.runMove(move.id, target, 0, this.format, undefined, true);
	},
	pokemon: {
		runImmunity(type, message) {
			if (!type || type === '???') {
				return true;
			}
			if (!(type in this.battle.dex.data.TypeChart)) {
				if (type === 'Fairy' || type === 'Dark' || type === 'Steel') return true;
				throw new Error("Use runStatusImmunity for " + type);
			}
			if (this.fainted) {
				return false;
			}
			let isGrounded;
			const negateResult = this.battle.runEvent('NegateImmunity', this, type);
			if (type === 'Ground') {
				isGrounded = this.isGrounded(!negateResult);
				if (isGrounded === null) {
					if (message) {
						this.battle.add('-immune', this, '[msg]', '[from] ability: Levitate');
						if (this.battle.activeMove) this.battle.bounceMove(this.battle.activeMove, this);
					}
					return false;
				}
			}
			if (!negateResult) return true;
			if ((isGrounded === undefined && !this.battle.dex.getImmunity(type, this)) || isGrounded === false) {
				if (message) {
					this.battle.add('-immune', this, '[msg]');
				}
				return false;
			}
			return true;
		},
	},
};
