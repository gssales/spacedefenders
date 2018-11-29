import {Level, Upgrade, Menu, WinScreen} from "./Level.js"

export default class LevelManager {
	constructor(arrLevels) {
		this.arrLevels = arrLevels;
		this.level = null;
		this.activeLevel = 0;
		this.initiated = false;
		this.upgraded = true;
		this.menu = true;
	}

	initiate() {
		this.initiated = true;
		if(this.activeLevel >= 0) {
			if(this.upgraded) {
				this.level = new Level(this.arrLevels[this.activeLevel]);
				this.upgraded = false;
			}
			else {
				this.level = new Upgrade();
				this.upgraded = true;
			}
		}
		else {
			this.level = new WinScreen();
			this.activeLevel = 0;
		}

		if(this.menu) {
			this.menu = false;
			this.upgraded = true;
			this.level = new Menu();
		}
	}

	update(dt) {
		if(!this.initiated)
			this.initiate();

		if(!this.level.initiated)
			this.level.initiate();
		this.level.update(dt);
	}

	draw() {
		this.level.draw();
	}
}
