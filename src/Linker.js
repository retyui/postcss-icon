export class Linker {
	constructor() {
		this._rootsMap = new Map();
	}

	_getRootMap(rootOrMq) {
		if (!this._rootsMap.has(rootOrMq)) {
			this._rootsMap.set(rootOrMq, new Map());
		}
		return this._rootsMap.get(rootOrMq);
	}

	_getNodesArray(root, iconName) {
		const _rootMap = this._getRootMap(root);

		if (!_rootMap.get(iconName)) {
			_rootMap.set(iconName, []);
		}
		return _rootMap.get(iconName);
	}

	push({ root, iconName, parent }) {
		this._getNodesArray(root, iconName)
			.push(parent);
	}

	get rootMap() {
		return this._rootsMap;
	}
}
