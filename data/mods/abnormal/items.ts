export const Items: {[k: string]: ModdedItemData} = {
	"chilanberry": {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === source.getTypes()[0] && !target.volatiles['substitute']) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					return this.chainModify(0.5);
				}
			}
		},
	},
	"normalgem": {
		inherit: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status' || move.id in {firepledge: 1, grasspledge: 1, waterpledge: 1}) return;
			if (move.type === source.getTypes()[0]) {
				if (source.useItem()) {
					this.add('-enditem', source, 'Normal Gem', '[from] gem', '[move] ' + move.name);
					source.addVolatile('gem');
				}
			}
		},
	},
	"silkscarf": {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move.type === user.getTypes()[0]) {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
	},
};
