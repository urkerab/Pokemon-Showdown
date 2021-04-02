export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen7',
	getDamage(pokemon, target, move, suppressMessages) {
		if (typeof move === 'string') move = this.dex.getActiveMove(move);

		if (typeof move === 'number') {
			move = {
				basePower: move,
				type: '???',
				category: 'Physical',
				flags: {},
			} as ActiveMove;
		}

		if (!move.ignoreImmunity || (move.ignoreImmunity !== true && !move.ignoreImmunity[move.type])) {
			if (!target.runImmunity(move.type, !suppressMessages)) {
				return false;
			}
		}

		if (move.ohko) {
			return target.maxhp;
		}

		if (move.damageCallback) {
			return move.damageCallback.call(this, pokemon, target);
		}
		if (move.damage === 'level') {
			return pokemon.level;
		}
		if (move.damage) {
			return move.damage;
		}

		if (!move.type) move.type = '???';
		const type = move.type;
		// '???' is typeless damage: used for Struggle and Confusion etc
		const category = this.getCategory(move);
		const defensiveCategory = move.defensiveCategory || category;

		let basePower: number | false | null | undefined = move.basePower;
		if (move.basePowerCallback) {
			basePower = move.basePowerCallback.call(this, pokemon, target, move);
		}
		if (!basePower) {
			if (basePower === 0) return; // returning undefined means not dealing damage
			return basePower;
		}
		basePower = this.clampIntRange(basePower, 1);

		let critMult;
		let critRatio = this.runEvent('ModifyCritRatio', pokemon, target, move, move.critRatio || 0);
		if (this.gen <= 5) {
			critRatio = this.clampIntRange(critRatio, 0, 5);
			critMult = [0, 16, 8, 4, 3, 2];
		} else {
			critRatio = this.clampIntRange(critRatio, 0, 4);
			critMult = [0, 16, 8, 2, 1];
		}

		const moveHit = target.getMoveHitData(move);
		moveHit.crit = move.willCrit || false;
		if (move.willCrit === undefined) {
			if (critRatio) {
				moveHit.crit = (this.random(critMult[critRatio]) === 0);
			}
		}

		if (moveHit.crit) {
			moveHit.crit = this.runEvent('CriticalHit', target, null, move);
		}

		// happens after crit calculation
		basePower = this.runEvent('BasePower', pokemon, target, move, basePower, true);

		if (!basePower) return 0;
		basePower = this.clampIntRange(basePower, 1);

		const level = pokemon.level;

		const attacker = pokemon;
		const defender = target;
		const defenseStat: StatNameExceptHP = defensiveCategory === 'Physical' ? 'def' : 'spd';
		const statTable: {[k in keyof StatsExceptHPTable]: string} = {atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe'};
		let maxAttack = 0;
		let attack;
		let defense;

		let defBoosts = defender.boosts[defenseStat];

		let ignoreNegativeOffensive = !!move.ignoreNegativeOffensive;
		let ignorePositiveDefensive = !!move.ignorePositiveDefensive;

		if (moveHit.crit) {
			ignoreNegativeOffensive = true;
			ignorePositiveDefensive = true;
		}
		const ignoreDefensive = !!(move.ignoreDefensive || (ignorePositiveDefensive && defBoosts > 0));

		if (ignoreDefensive) {
			this.debug('Negating (sp)def boost/penalty.');
			defBoosts = 0;
		}

		for (const attackStat of ['atk', 'def', 'spa', 'spd', 'spe'] as StatNameExceptHP[]) {
			let atkBoosts = move.useTargetOffensive ? defender.boosts[attackStat] : attacker.boosts[attackStat];
			const ignoreOffensive = !!(move.ignoreOffensive || (ignoreNegativeOffensive && atkBoosts < 0));
			if (ignoreOffensive) {
				this.debug('Negating (sp)atk boost/penalty.');
				atkBoosts = 0;
			}
			if (move.useTargetOffensive) {
				attack = defender.calculateStat(attackStat, atkBoosts);
			} else {
				attack = attacker.calculateStat(attackStat, atkBoosts);
			}
			attack = this.runEvent('Modify' + statTable[attackStat], attacker, defender, move, attack);
			if (attack > maxAttack) maxAttack = attack;
		}

		defense = defender.calculateStat(defenseStat, defBoosts);

		// Apply Stat Modifiers
		defense = this.runEvent('Modify' + statTable[defenseStat], defender, attacker, move, defense);

		// int(int(int(2 * L / 5 + 2) * A * P / D) / 50);
		let baseDamage = Math.floor(Math.floor(Math.floor(2 * level / 5 + 2) * basePower * maxAttack / defense) / 50) + 2;

		// multi-target modifier (doubles only)
		if (move.spreadHit) {
			const spreadModifier = move.spreadModifier || 0.75;
			this.debug('Spread modifier: ' + spreadModifier);
			baseDamage = this.modify(baseDamage, spreadModifier);
		}

		// weather modifier
		baseDamage = this.runEvent('WeatherModifyDamage', pokemon, target, move, baseDamage);

		// crit - not a modifier
		const isCrit = target.getMoveHitData(move).crit;
		if (isCrit) {
			baseDamage = this.modify(baseDamage, move.critModifier || (this.gen >= 6 ? 1.5 : 2));
		}

		// this is not a modifier
		baseDamage = this.randomizer(baseDamage);

		// STAB
		if (move.forceSTAB || type !== '???' && pokemon.hasType(type)) {
			// The "???" type never gets STAB
			// Not even if you Roost in Gen 4 and somehow manage to use
			// Struggle in the same turn.
			// (On second thought, it might be easier to get a Missingno.)
			baseDamage = this.modify(baseDamage, move.stab || 1.5);
		}
		// types
		let typeMod = target.runEffectiveness(move);
		typeMod = this.clampIntRange(typeMod, -6, 6);
		target.getMoveHitData(move).typeMod = typeMod;
		if (typeMod > 0) {
			if (!suppressMessages) this.add('-supereffective', target);

			for (let i = 0; i < typeMod; i++) {
				baseDamage *= 2;
			}
		}
		if (typeMod < 0) {
			if (!suppressMessages) this.add('-resisted', target);

			for (let i = 0; i > typeMod; i--) {
				baseDamage = Math.floor(baseDamage / 2);
			}
		}

		if (isCrit && !suppressMessages) this.add('-crit', target);

		if (pokemon.status === 'brn' && basePower && move.category === 'Physical' && !pokemon.hasAbility('guts')) {
			if (this.gen < 6 || move.id !== 'facade') {
				baseDamage = this.modify(baseDamage, 0.5);
			}
		}

		// Generation 5 sets damage to 1 before the final damage modifiers only
		if (this.gen === 5 && basePower && !Math.floor(baseDamage)) {
			baseDamage = 1;
		}

		// Final modifier. Modifiers that modify damage after min damage check, such as Life Orb.
		baseDamage = this.runEvent('ModifyDamage', pokemon, target, move, baseDamage);

		if (this.gen !== 5 && basePower && !Math.floor(baseDamage)) {
			return 1;
		}

		return Math.floor(baseDamage);
	},
};
