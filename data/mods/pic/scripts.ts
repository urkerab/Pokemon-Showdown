export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen8',
	pokemon: {
		getVolatile(status) {
			status = this.battle.dex.getEffect(status);
			if (!this.volatiles[status.id]) return null;
			if (this.battle.ruleTable.isRestricted(status.id)) return null;
			return status;
		},
		setAbility(ability, source, isFromFormechange) {
			if (!this.hp) return false;
			ability = this.battle.dex.getAbility(ability);
			const oldAbility = this.ability;
			if (!isFromFormechange) {
				if (['illusion', 'battlebond', 'comatose', 'disguise', 'gulpmissile', 'hungerswitch', 'iceface', 'multitype', 'powerconstruct', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange'].includes(ability.id)) return false;
				if (['battlebond', 'comatose', 'disguise', 'gulpmissile', 'hungerswitch', 'iceface', 'multitype', 'powerconstruct', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange'].includes(oldAbility)) return false;
			}
			this.battle.singleEvent('End', this.battle.dex.getAbility(oldAbility), this.abilityData, this, source);
			const ally = this.side.active.find(active => active && active !== this && !active.fainted);
			if (ally?.m.innate) {
				ally.removeVolatile(ally.m.innate);
				delete ally.m.innate;
			}
			this.ability = ability.id;
			this.abilityData = {id: ability.id, target: this};
			if (ability.id) {
				this.battle.singleEvent('Start', ability, this.abilityData, this, source);
				if (ally && ally.ability !== this.ability) {
					ally.m.innate = 'ability:' + ability.id;
					ally.addVolatile(ally.m.innate);
					if (!this.m.innate) {
						this.m.innate = 'ability:' + ally.ability;
						this.addVolatile(this.m.innate);
					}
				} else if (this.m.innate) {
					this.removeVolatile(this.m.innate);
					delete this.m.innate;
				}
			}
			this.abilityOrder = this.battle.abilityOrder++;
			return oldAbility;
		},
		hasAbility(ability) {
			if (!this.ignoringAbility()) {
				if (Array.isArray(ability) ? ability.map(this.battle.toID).includes(this.ability) : this.battle.toID(ability) === this.ability) {
					return true;
				}
			}
			const ally = this.side.active.find(active => active && active !== this && !active.fainted);
			if (!ally || ally.ignoringAbility()) return false;
			if (Array.isArray(ability)) return ability.map(this.battle.toID).includes(ally.ability);
			return this.battle.toID(ability) === ally.ability;
		},
		getMoveRequestData() {
			const ally = this.side.active.find(active => active && active !== this && !active.fainted);
			this.moveSlots = this.baseMoveSlots.concat(ally ? ally.baseMoveSlots : []);
			for (const moveSlot of this.moveSlots) {
				moveSlot.disabled = false;
				moveSlot.disabledSource = '';
			}
			this.battle.runEvent('DisableMove', this);
			if (!this.ateBerry) this.disableMove('belch');
			return Object.getPrototypeOf(this).getMoveRequestData.call(this);
		},
	},
};
