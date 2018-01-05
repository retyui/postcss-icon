import { asyncRun, objectMap } from "./helps.js";
import { CssIconSet } from "./CssIconSet.js";
import { FontIconSet } from "./FontIconSet.js";
import { NAME } from "./config";

export function isCustomSet(t) {
	const { styles, keymap } = t;
	return (isCssSet(t) && styles) || (isFontSet(t) && keymap);
}
export function isCssSet({ type }) {
	return type === "css";
}
export function isFontSet({ type }) {
	return type === "font";
}

export class LazyIconSet {
	constructor(pluginOption) {
		this._unicSetList = new Map();
		this._badPrefixSetList = [];

		objectMap(pluginOption, (options, name) => {
			if (!options) {
				return;
			}
			const { prefix = "" } = options;
			const configLazySet = {
				name,
				options,
				_iconSet: null,
				_loaded: false,
				get isLoaded() {
					return Boolean(this._loaded);
				},
				get iconSet() {
					if (this._loaded === true) {
						return this._iconSet;
					}

					if (isCustomSet(this.options)) {
						this._loaded = true;
						return (this._iconSet = LazyIconSet.initIconSet({
							name: this.name,
							...options
						}));
					}

					const dataIconSet = require(this.name);
					this._loaded = true;
					return (this._iconSet = LazyIconSet.initIconSet({
						name: this.name,
						...dataIconSet,
						...options
					}));
				}
			};

			if (this._unicSetList.has(prefix)) {
				this._badPrefixSetList.push(configLazySet);
			} else {
				this._unicSetList.set(prefix, configLazySet);
			}
		});
	}

	async applySet(...opt) {
		await Promise.all(this._getLoadedSets().map(({ iconSet }) => iconSet.applyIcons(...opt)));
	}

	_getLoadedSets() {
		return this._badPrefixSetList
			.concat([...this._unicSetList.values()])
			.filter(({ isLoaded }) => isLoaded === true);
	}

	static initIconSet(configIconSet = {}) {
		const { name, type } = configIconSet;
		switch (type) {
			case "css":
				return new CssIconSet(configIconSet);
			case "font":
				return new FontIconSet(configIconSet);
			default:
				throw new Error(
					`[${NAME}]: The plugin does not support this type \`${type}\`, for css icons \`${name}\``
				);
		}
	}

	addIcon(addData) {
		const { iconName } = addData;
		for (const prefix of this._unicSetList.keys()) {
			// try find/add by prefix
			if (iconName.indexOf(prefix) === 0) {
				const { iconSet } = this._unicSetList.get(prefix);
				return iconSet.addIcon(addData);
			}
		}

		for (const { iconSet } of this._badPrefixSetList) {
			// try find/add in other set
			if (iconSet.addIcon(addData)) {
				return true;
			} // else find in another icon set
		}
		return false;
	}
}
