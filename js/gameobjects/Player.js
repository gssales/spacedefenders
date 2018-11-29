import {canvas} from "../res/context.js"
import {Point, CircleShape} from "../res/graphics.js"
import {Vector, Collider, Body} from "../res/physics.js"
import {kbListener as kb, tsListener as ts} from "../res/listeners.js"
import {drawImage} from "../res/drawable.js"
import {Shot} from "./Shot.js"
import {explosionAnimation} from "../main.js"

// Classe Player
// Representa a nave do jogador no jogo. Responde às ações no teclado.
export default class Player {

	constructor() {
		this.body = new Body(canvas.width/2, canvas.height - 164,
				100000, new CircleShape(0, 0, 25), 0);
		this.spriteMap = new Map();
		this.propeler = false;
		this.baseLife = 150;
		this.life = this.baseLife;
		this.integrityPoints = 0;
		this.baseEnergy = 2000;
		this.energy = this.baseEnergy;
		this.cannonPoints = 0;
		this.shots = new Array();
		this.baseSpeed = 20000;
		this.speed = this.baseSpeed;
		this.propelerPoints = 0;
		this.sparePoints = 0;

		this.hit = false;

		this.animation = explosionAnimation.clone();
		let width = this.body.shape.width;
		let nx = Math.random() * width - width/2;
		let ny = Math.random() * width - width/2;
		this.animation.point = new Point(nx, ny);
	}

	initiate() {
		this.body.coord.x = canvas.width/2;
		this.body.coord.y = canvas.height - 164;
		this.life = this.baseLife + 50*this.integrityPoints;
		this.energy = this.baseEnergy - 150*this.cannonPoints;
		this.speed = this.baseSpeed + 8000*this.propelerPoints;
	}

	update(dt) {

		this.kbInteract(dt);

		this.body.update(dt);
		this.updateShot(dt);
		this.checkBorderCollision();

		this.checkHit(dt);

		if(this.animation.playing)
			this.animation.update(dt);

		if(this.energy > this.baseEnergy - 150*this.cannonPoints)
			this.energy = this.baseEnergy - 150*this.cannonPoints;

		if(this.energy < this.baseEnergy - 150*this.cannonPoints)
			this.energy += dt;
	}

	draw() {
		if(this.propeler)
			drawImage(this.body.coord.clone().setY(this.body.coord.y + 24),
					this.spriteMap.get("propeler"), this.body.rotation);

		drawImage(this.body.coord, this.spriteMap.get("spaceship"),
				this.body.rotation);

		if(this.animation.playing)
			this.animation.draw();

		this.shots.forEach((shot) => {
			shot.draw();
		});
	}

	// Método addSprite
	// Adiciona um sprite ao mapa de sprites do objeto. É preciso saber
	// o identificador do sprite para poder usá-lo.
	addSprite(name, sprite) {
		this.spriteMap.set(name, sprite);
	}

	// Método shoot
	// Cria um objeto de Shot na frente da nave do jogador.
	shoot(){
		let newShot = new Shot(new Body(this.body.coord.x, this.body.coord.y-32, 1,
						new CircleShape(0, 0, 5), this.body.rotation),
						this.spriteMap.get("shot"), 0);

		newShot.body.applyForce(new Vector().consVectorXY(0, -300), 1);

		this.shots = this.shots.concat([newShot]);
	}

	kbInteract(dt) {
		let vector = new Vector();

		if(kb.key.a || kb.key.ArrowLeft || ts.touch.left) {
			vector.consVectorXY(-this.speed, 0);
			this.body.applyForce(vector, dt);
		}
		if(kb.key.d || kb.key.ArrowRight || ts.touch.right) {
			vector.consVectorXY(this.speed, 0);
			this.body.applyForce(vector, dt);
		}
		if((kb.key.SpaceBar || ts.touch.center) && this.energy >= this.baseEnergy - 150*this.cannonPoints) {
			this.shoot();
			this.energy = 0;
		}
		this.propeler = kb.key.p;

		if(kb.key.none && ts.touch.noTouch)
			this.body.velocity.valueX /= 1.25;
	}

	checkBorderCollision() {
		let coll = Collider.borderCollision(this.body);

		if(coll != Collider.NO_COLLISION) {
			this.body.velocity.valueX = 0;
			switch(coll) {
			case Collider.BORDER_LEFT:
				this.body.coord.x = this.body.shape.width/2 + 1;
				break;
			case Collider.BORDER_RIGHT:
				this.body.coord.x = canvas.width - this.body.shape.width/2 - 1;
				break;
			}
		}
	}

	checkHit(dt) {
		if(this.hit) {
			this.hit = false;
			this.animation.frameIndex = 0;

			let width = this.body.shape.width;
			let nx = Math.random() * width - width/2;
			let ny = Math.random() * width - width/2;
			this.animation.point = new Point(this.body.coord.x + nx,
				this.body.coord.y + ny);

			this.animation.play();

			this.life -= 50;
		}
	}

	updateShot(dt) {
		this.shots.forEach((shot, index) => {
			shot.update(dt);
			if((Collider.borderCollision(shot.body) == Collider.BORDER_TOP)) {
				this.shots[index] = null;
			}
		});
		for(let i = 0; i < this.shots.length; i++) {
			if(this.shots[i] == null) {
				this.shots.splice(i, 1);
				i--;
			}
		}
	}
}
