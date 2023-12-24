export const Conditions: {[k: string]: ModdedConditionData} = {
	par: {
		inherit: true,
		onBeforeMove(pokemon) {},
	},
	slp: {
		inherit: true,
		onStart(target) {
			this.add('-status', target, 'slp');
			this.effectState.startTime = 3;
			this.effectState.time = this.effectState.startTime;
		},
	},
	frz: {
		inherit: true,
		onStart(target) {
			this.add('-status', target, 'frz');
			if (target.species.name === 'Shaymin-Sky' && target.baseSpecies.name === target.species.name) {
				const template = this.dex.species.get('Shaymin');
				target.formeChange(template);
				target.baseSpecies = template;
				target.setAbility(template.abilities['0']);
				target.baseAbility = target.ability;
				target.details = template.name + (target.level === 100 ? '' : ', L' + target.level) + (target.gender === '' ? '' : ', ' + target.gender) + (target.set.shiny ? ', shiny' : '');
				this.add('detailschange', target, target.details);
				this.add('message', target.species + " has reverted to Land Forme! (placeholder)");
			}
			this.effectState.startTime = 5;
			this.effectState.time = this.effectState.startTime;
		},
		onHit(target, source, move) {
			if (move.thawsTarget || move.type in {'Fire': 1, 'Rock': 1, 'Fighting': 1, 'Normal': 1, 'Ground': 1}) {
				target.cureStatus();
			}
		},
		onBeforeMovePriority: 2,
		onBeforeMove(pokemon, target, move) {
			pokemon.statusState.time--;
			if (pokemon.statusState.time <= 0) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'frz');
			return false;
		},
	},
	confusion: {
		// this is a volatile status
		onStart(target, source, sourceEffect) {
			const result = this.runEvent('TryConfusion', target, source, sourceEffect);
			if (!result) return result;
			this.add('-start', target, 'confusion');
			this.effectState.time = 4;
		},
		onEnd(target) {
			this.add('-end', target, 'confusion');
		},
		onModifyDamage(dmg, source, target, move) {
			source.volatiles.confusion.time--;
			if (!source.volatiles.confusion.time) {
				source.removeVolatile('confusion');
				return;
			}
			this.add('-activate', source, 'confusion');
			const damage = this.actions.getDamage(source, target, 20);
			if (typeof damage !== 'number') throw new Error("Confusion damage not dealt");
			this.directDamage(damage);
			return this.chainModify(0.5);
		},
	},
	partiallytrapped: {
		inherit: true,
		duration: 5,
		durationCallback(target, source) {
			if (source.hasItem('gripclaw')) return 8;
			return 5;
		},
	},
	lockedmove: {
		// Outrage, Thrash, Petal Dance...
		duration: 2,
		inherit: true,
		onStart(target, source, effect) {
			this.effectState.trueDuration = 2;
			this.effectState.move = effect.id;
		},
		onRestart() {
			if (this.effectState.trueDuration >= 2) {
				this.effectState.duration = 2;
			}
		},
	},
	stall: {
		// Protect, Detect, Endure counter
		duration: 2,
		onStart() {
			this.effectState.counter = 1;
			this.effectState.move = this.activeMove!.id;
		},
		onStallMove() {
			// Don't allow pointless Endure stall
			const move = this.activeMove!.id;
			if (move === 'endure' || move === 'craftyshield') {
				return !this.effectState.counter;
			}
		},
		onFoeModifyMove(move) {
			if (move.id === 'endure' || move.id === 'craftyshield' || this.effectState.duration === 1) return;
			if (this.effectState.counter !== 1) {
				move.breaksProtect = true;
			}
			if (move.secondaries) {
				for (const secondary of move.secondaries) {
					if (secondary.chance) secondary.chance *= 1 - Math.pow(2, 1 - this.effectState.counter);
				}
			}
		},
		onSourceModifyDamage() {
			const move = this.effectState.move;
			if (move === 'endure' || move === 'craftyshield' || this.effectState.duration === 1) return;
			return this.chainModify(1 - Math.pow(2, 1 - this.effectState.counter));
		},
		onRestart() {
			this.effectState.counter += 1;
			this.effectState.duration = 2;
			this.effectState.move = this.activeMove!.id;
		},
	},
};
