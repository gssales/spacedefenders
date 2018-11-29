import {context as ctx, canvas} from "../res/context.js"
import {drawImage} from "../res/drawable.js"
import {Point} from "../res/graphics.js"
import {Vector} from "../res/physics.js"

// Classe Background
// Controla o background. Possui funções de paralaxe.
export class Background {
	constructor() {
		this.position = new Point(0, 0);
		this.movement = new Vector();
		this.sprites = new Array();
		this.backgroundId = 0;
	}

	update(dt) {
		this.position.x += this.movement.valueX*(dt/1000);
		this.position.y += this.movement.valueY*(dt/1000);

		if(this.position.x >= canvas.width)
			this.position.x = 0;
		if(this.position.y >= canvas.height)
			this.position.y = 0;
	}

	draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for(let i = 0; i < this.sprites.length; i++) {
			let position = this.position.clone();
			if(i > 0) {
				position.x *= i*2;
				position.y *= i*2;
			}
			position.x += canvas.width/2;
			position.y += canvas.height/2;
			drawImage(position, this.sprites[i], i*Math.PI);

			if(position.x > canvas.width/2) {
				position.x -= canvas.width;
				drawImage(position, this.sprites[i], i*Math.PI);
				position.x -= canvas.width;
				drawImage(position, this.sprites[i], i*Math.PI);
				position.x += 2*canvas.width;
			}
			else {
				if(position.x < canvas.width/2) {
					position.x += canvas.width;
					drawImage(position, this.sprites[i], i*Math.PI);
					position.x += canvas.width;
					drawImage(position, this.sprites[i], i*Math.PI);
					position.x -= 2*canvas.width;
				}
			}

			if(position.y > canvas.height/2) {
				position.y -= canvas.height;
				drawImage(position, this.sprites[i], i*Math.PI);
				position.y -= canvas.height;
				drawImage(position, this.sprites[i], i*Math.PI);
				position.y += 2*canvas.height;
			}
			else {
				if(position.y < canvas.height/2) {
					position.y += canvas.height;
					drawImage(position, this.sprites[i], i*Math.PI);
					position.y += canvas.height;
					drawImage(position, this.sprites[i], i*Math.PI);
					position.y -= 2*canvas.height;
				}
			}

		}
	}

	// Método addSprite
	// Adiciona um sprite ao mapa de sprites do objeto. É preciso saber
	// o identificador do sprite para poder usá-lo.
	addSprite(sprite) {
		this.sprites.push(sprite);
	}

	clone() {
		let bg = new Background();
		this.sprites.forEach((sprite) => {
			bg.addSprite(sprite);
		});
		return bg;
	}
}
