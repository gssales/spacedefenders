import {drawImage} from "../res/drawable.js"

/* Classe Shot
 * Representa um disparo da nave.
 */
export class Shot {
	constructor(body, sprite, wait) {
		this.body = body;
		this.sprite = sprite;
		this.wait = wait;
		this.active = false
	}

	update(dt) {
		if(this.wait <= 0)
			this.active = true;
		else
			this.wait -= dt;

		if(this.active)
			this.body.update(dt);
	}

	draw() {
		if(this.active)
			drawImage(this.body.coord, this.sprite, this.body.rotation);
	}
}

export class Laser {
	constructor(body, sprite) {
		this.body = body;
		this.sprite = sprite;
	}

	update(dt) {
		this.body.update(dt);
	}

	draw() {
		drawImage(this.body.coord, this.sprite, this.body.rotation);
	}

}
