export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen8',
	pokemon: {
		getItem() {
			const ability = this.battle.dex.abilities.getByID(this.item);
			return ability.exists ? Object.assign(Object.create(ability), {onTakeItem: false}) : this.battle.dex.items.getByID(this.item);
		},
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
