export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen7',
	/* Fake out the team validator
	init() {
		Object.keys(this.data.Abilities).forEach(ability => this.data.Items[ability] = Object.assign({onTakeItem: false}, this.getAbility(ability)));
	},
        */
	getItem(name) {
		const ability = this.dex.getAbility(this.toID(name));
		return ability.exists ? Object.assign(Object.create(ability), {onTakeItem: false}) : Object.getPrototypeOf(this).getItem.call(this, name);
	},
	/*
	suppressingAttackEvents() {
		return (this.activePokemon && this.activePokemon.isActive && (!this.activePokemon.ignoringAbility() && this.activePokemon.getAbility().stopAttackEvents || !this.activePokemon.ignoringItem() && this.activePokemon.getItem().stopAttackEvents));
	},
	*/
	pokemon: {
		hasAbility(ability) {
			if (this.ignoringAbility()) return false;
			if (!Array.isArray(ability)) {
				ability = this.battle.toID(ability);
				if (this.ability === ability) return true;
			} else {
				ability = ability.map(this.battle.toID);
				if (ability.includes(this.ability)) return true;
			}
			if (ability === 'klutz' || this.ignoringItem()) return false;
			if (!Array.isArray(ability)) return ability === this.item;
			return ability.includes(this.item);
		},
	},
};
