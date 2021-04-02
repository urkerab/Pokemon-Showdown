export const Abilities: {[k: string]: ModdedAbilityData} = {
	"electricsurge": {
		inherit: true,
		onStart(source) {
		},
	},
	"grasspelt": {
		inherit: true,
		onModifyDef(pokemon) {
			return this.chainModify(1.5);
		},
	},
	"grassysurge": {
		inherit: true,
		onStart(source) {
		},
	},
	"mistysurge": {
		inherit: true,
		onStart(source) {
		},
	},
	"psychicsurge": {
		inherit: true,
		onStart(source) {
		},
	},
	"surgesurfer": {
		inherit: true,
		onModifySpe(spe) {
			return this.chainModify(2);
		},
	},
};
