import { Linker } from "./Linker.js";

export class IconSet {
  constructor() {
    this._linker = new Linker();
  }

  addIcon(data) {
    const { iconName } = data;
    if (this.hasIcon(iconName)) {
      this._linker.push(data);
      return true;
    }
    return false;
  }
}
