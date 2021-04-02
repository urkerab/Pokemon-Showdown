export const Items: {[k: string]: ModdedItemData} = {
	"airballoon": {
		inherit: true,
		onDamagingHit(damage, target, source, effect) {
			if (effect.effectType === 'Move' && effect.id !== 'confused') {
				this.add('-enditem', target, 'Air Balloon');
				if (target.item === 'airballoon') {
					target.item = '';
					target.itemData = {id: '', target: target};
				}
				if (target.ability === 'airballoon') {
					target.baseAbility = target.ability = '';
					target.abilityData = {id: '', target: target};
				}
				this.runEvent('AfterUseItem', target, null, null, 'airballoon');
			}
		},
		onAfterSubDamage(damage, target, source, effect) {
			if (effect.effectType === 'Move' && effect.id !== 'confused') {
				this.add('-enditem', target, 'Air Balloon');
				if (target.item === 'airballoon') {
					target.item = '';
					target.itemData = {id: '', target: target};
				}
				if (target.ability === 'airballoon') {
					target.baseAbility = target.ability = '';
					target.abilityData = {id: '', target: target};
				}
				this.runEvent('AfterUseItem', target, null, null, 'airballoon');
			}
		},
	},
};
