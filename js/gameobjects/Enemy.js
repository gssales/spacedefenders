import {canvas} from "../res/context.js"
import {drawImage, fillRect} from "../res/drawable.js"
import {Body, Vector} from "../res/physics.js"
import {Point, CircleShape, RectangleShape} from "../res/graphics.js"
import {kbListener as kb} from "../res/listeners.js"
import {Shot, Laser} from "./Shot.js"

// Classe Enemy
// Representa um inimigo no jogo. O inimigos deve dar a volta na tela.
class Enemy {

	constructor(body, speed) {
		this.body = body;
		this.spriteMap = new Map();
		this.animations = new Array();
		this.speed = speed;
		this.counter = 0;
		this.destroyed = false;
		this.initAnim = false;
	}

	update(dt) {
		if(!this.destroyed && !this.dead) {
			if(this.counter >= 500)
				this.movement(dt);
			else
				this.counter += dt;

			this.body.update(dt);

			if(this.laser) {
				if(!this.countLaser)
					this.countLaser = 0;

				this.laser.body.coord.x = this.body.coord.x;
				this.laser.body.shape.point.x = this.body.coord.x-8;

				this.countLaser += dt;
				if(this.countLaser >= 1000) {
					this.countLaser = 0;
					this.laser = null;
				}
			}
		}
		if(this.destroyed){
			if(!this.initAnim) {
				this.initAnim = true;
				this.animations.forEach((anim) => {
					anim.point.x += this.body.coord.x;
					anim.point.y += this.body.coord.y;
				});
			}

			this.animations.forEach((anim) => {
				anim.play();
				anim.update(dt);
				if(!anim.playing) {
					this.dead = true;
					this.destroyed = false;
				}
			});
		}

	}

	draw() {
		if(!this.dead) {
			drawImage(this.body.coord, this.spriteMap.get("spaceship"),
					this.body.rotation);
			if(this.destroyed) {
				this.animations.forEach((anim) => {
					anim.draw();
				});
			}
		}

	}

	// Método addSprite
	// Adiciona um sprite ao mapa de sprites do objeto. É preciso saber
	// o identificador do sprite para poder usá-lo.
	addSprite(name, sprite) {
		this.spriteMap.set(name, sprite);
		return this;
	}

	addAnimation(animation) {
		let width = this.body.shape.width;
		let nx = Math.random() * width - width/2;
		let ny = Math.random() * width - width/2;

		animation.point = new Point(nx, ny);
		this.animations.push(animation);
		return this;
	}
}

export class Enemy1 extends Enemy {

	movement(dt) {
		this.body.velocity.valueX = this.speed;
	}

	shoot() {
		let shot = new Shot(new Body(this.body.coord.x, this.body.coord.y+32, 1,
					new CircleShape(0, 0, 5), this.body.rotation),
					this.spriteMap.get("shot"), 0);
		shot.body.applyForce(new Vector().consVectorXY(0, 300), 1);
		return [shot];
	}

}

export class Enemy2 extends Enemy {


	movement(dt) {
		if(!this.step) { // garante os passos do movimento
			this.step = 1;
			this.count = 0;
		}

		if(this.count >= 3000) {
			this.body.velocity.valueY = 300*this.step;
			if(this.body.coord.y > 200){
				this.body.velocity.valueY = 0;
				this.body.coord.y = 200;
				this.count = 0;
				this.step = -1;
			}
			if(this.body.coord.y < 50){
				this.body.velocity.valueY = 0;
				this.body.coord.y = 50;
				this.count = 0;
				this.step = 1;
			}
		}
		else {
			this.count += dt;
			this.body.velocity.valueY = 0;
		}

		this.body.velocity.valueX = this.speed;
	}

	shoot() {
		let shot1 = new Shot(new Body(this.body.coord.x-16, this.body.coord.y+24, 1,
					new CircleShape(0, 0, 5), this.body.rotation),
					this.spriteMap.get("shot"), 0);
		let shot2 = new Shot(new Body(this.body.coord.x+16, this.body.coord.y+24, 1,
					new CircleShape(0, 0, 5), this.body.rotation),
					this.spriteMap.get("shot"), 0);
		shot1.body.applyForce(new Vector().consVectorXY(0, 300), 1);
		shot2.body.applyForce(new Vector().consVectorXY(0, 300), 1);
		return [shot1, shot2]
	}
}

export class Enemy3 extends Enemy {

	movement(dt) {
		if(!this.count){
			this.count = 0;
		}

		if(kb.key.SpaceBar)
			this.shooting = true;

		if(this.shooting){
			this.count += dt;
			if(this.count >= 1000){
				this.shooting = false;
				this.count = 0;
			}
			this.body.velocity.valueX = 100;
		}
		else {
			this.body.velocity.valueX = this.speed;
		}
	}

	shoot() {
		this.shooting = true;

		let shot1 = new Shot(new Body(this.body.coord.x -24, this.body.coord.y+24, 1,
					new CircleShape(0, 0, 5), this.body.rotation),
					this.spriteMap.get("shot"), 0);
		let shot2 = new Shot(new Body(this.body.coord.x, this.body.coord.y+32, 1,
					new CircleShape(0, 0, 5), this.body.rotation),
					this.spriteMap.get("shot"), 0);
		let shot3 = new Shot(new Body(this.body.coord.x + 24, this.body.coord.y+24, 1,
					new CircleShape(0, 0, 5), this.body.rotation),
					this.spriteMap.get("shot"), 0);
		shot1.body.applyForce(new Vector().consVectorXY(0, 300), 1);
		shot2.body.applyForce(new Vector().consVectorXY(0, 300), 1);
		shot3.body.applyForce(new Vector().consVectorXY(0, 300), 1);
		return [shot1, shot2, shot3]
	}

}

export class Enemy4 extends Enemy {

	movement(dt) {
		if(!this.step) { // garante os passos do movimento
			this.step = 1;
			this.count = 0;
			this.wait = false;
		}

		if(!this.wait) {
			this.body.velocity.valueY = this.speed*this.step;
			if(this.body.coord.y > 200){
				this.body.velocity.valueY = 0;
				this.body.coord.y = 200;
				this.wait = true
				this.step = -1;
			}
			if(this.body.coord.y < 50){
				this.body.velocity.valueY = 0;
				this.body.coord.y = 50;
				this.wait = true
				this.step = 1;
			}

			this.body.velocity.valueX = this.speed;
		}
		else {
			this.body.velocity.valueX = 0;

			this.count += dt;
			if(this.count >= 50) {
				this.count = 0;
				this.wait = false;
			}
		}
	}

	shoot() {
		let shot1 = new Shot(new Body(this.body.coord.x, this.body.coord.y+24, 1,
					new CircleShape(0, 0, 5), this.body.rotation),
					this.spriteMap.get("shot"), 0);
		let shot2 = new Shot(new Body(this.body.coord.x-24, this.body.coord.y+16, 1,
					new CircleShape(0, 0, 5), this.body.rotation+Math.PI/6),
					this.spriteMap.get("shot"), 0);
		let shot3 = new Shot(new Body(this.body.coord.x+24, this.body.coord.y+16, 1,
					new CircleShape(0, 0, 5), this.body.rotation-Math.PI/6),
					this.spriteMap.get("shot"), 0);
		shot1.body.applyForce(new Vector().consVectorXY(0, 300), 1);
		shot2.body.applyForce(new Vector().consVectorAngle(shot2.body.rotation-Math.PI/2, 300), 1);
		shot3.body.applyForce(new Vector().consVectorAngle(shot3.body.rotation-Math.PI/2, 300), 1);
		return [shot1, shot2, shot3]
	}
}

export class Enemy5 extends Enemy {
	movement(dt) {
		if(!this.waveAngle) {
			this.waveAngle = 0;
			this.waveHeight = this.body.coord.y;
		}

		this.waveAngle += Math.PI/180;
		if(this.waveAngle >= 2 * Math.PI)
			this.waveAngle = 0;
		this.body.velocity.valueX = this.speed;

		this.body.coord.y = this.waveHeight + 80 * Math.sin(10*this.waveAngle);
	}

	shoot() {
		let shot1 = new Shot(new Body(this.body.coord.x-32, this.body.coord.y+8, 1,
					new CircleShape(0, 0, 5), this.body.rotation+Math.PI/3),
					this.spriteMap.get("shot"), 0);
		let shot2 = new Shot(new Body(this.body.coord.x-16, this.body.coord.y+16, 1,
					new CircleShape(0, 0, 5), this.body.rotation+Math.PI/6),
					this.spriteMap.get("shot"), 0);
		let shot3 = new Shot(new Body(this.body.coord.x, this.body.coord.y+24, 1,
					new CircleShape(0, 0, 5), this.body.rotation),
					this.spriteMap.get("shot"), 0);
		let shot4 = new Shot(new Body(this.body.coord.x+16, this.body.coord.y+16, 1,
					new CircleShape(0, 0, 5), this.body.rotation-Math.PI/6),
					this.spriteMap.get("shot"), 0);
		let shot5 = new Shot(new Body(this.body.coord.x+32, this.body.coord.y+8, 1,
					new CircleShape(0, 0, 5), this.body.rotation-Math.PI/3),
					this.spriteMap.get("shot"), 0);
		shot1.body.applyForce(new Vector().consVectorAngle(shot1.body.rotation-Math.PI/2, 300), 1);
		shot2.body.applyForce(new Vector().consVectorAngle(shot2.body.rotation-Math.PI/2, 300), 1);
		shot3.body.applyForce(new Vector().consVectorXY(0, 300), 1);
		shot4.body.applyForce(new Vector().consVectorAngle(shot4.body.rotation-Math.PI/2, 300), 1);
		shot5.body.applyForce(new Vector().consVectorAngle(shot5.body.rotation-Math.PI/2, 300), 1);

		return [shot1, shot2, shot3, shot4, shot5]
	}
}

export class Enemy6 extends Enemy {

	movement(dt) {
		if(!this.destiny){
			this.destiny = this.findDestiny()
			this.gotoDestiny();
			this.wait = false;
			this.count = 0;
		}

		if(!this.wait){

			if(Point.distance(this.body.coord, this.destiny) <= this.body.shape.width) {
				this.wait = true;
			}
		}
		else {
			this.body.velocity.valueX = 0;
			this.body.velocity.valueY = 0;

			this.count += dt;
			if(this.count >= 200) {
				this.count = 0;

				this.destiny = this.findDestiny()
				this.gotoDestiny();

				this.wait = false;
			}
		}
	}

	gotoDestiny() {
		let angle = Point.angle(this.body.coord, this.destiny);

		this.body.velocity.valueX = this.speed * Math.cos(angle);
		this.body.velocity.valueY = this.speed * Math.sin(angle) * -1;
	}

	findDestiny() {
		var destiny;
		do {
			destiny = new Point(Math.random() * (canvas.width-100) + 50,
					Math.random() * 150 + 50);
		} while(Point.distance(this.body.coord, destiny) <= this.body.shape.radius+20)
		return destiny
	}

	shoot() {
		let shot = new Shot(new Body(this.body.coord.x, this.body.coord.y+32, 1,
					new CircleShape(0, 0, 5), this.body.rotation),
					this.spriteMap.get("shot"), 0);
		shot.body.applyForce(new Vector().consVectorXY(0, 600), 1);
		return [shot];
	}
}

export class Enemy7 extends Enemy {

	movement(dt) {

		if(!this.step) { // garante os passos do movimento
			this.step = 1;
			this.count = 0;
		}

		this.count += dt; // conta o tempo entre os passos
		if(this.count >= (500+this.body.shape.width)/this.speed*1000) {
			this.count = 0;
			this.step = (this.step == -1? 1 : -1);
		}

		this.body.velocity.valueX = this.speed * this.step;
	}

	shoot() {
		if(!this.laser) {
			this.laser = new Laser(new Body(this.body.coord.x-8, this.body.coord.y+228, 1,
					new RectangleShape(this.body.coord.x-8, this.body.coord.y+32, 16, 512), Math.PI/2),
					this.spriteMap.get("shot"));
		}
		return [];
	}

}

export class Boss1 extends Enemy {

}

export class Boss2 extends Enemy {

}

export class Boss3 extends Enemy {

}
