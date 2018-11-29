import {kbListener as kb} from "../res/listeners.js"
import {Collider, Body} from "../res/physics.js"
import {CircleShape, RectangleShape} from "../res/graphics.js"
import {Enemy1, Enemy2, Enemy3, Enemy4, Enemy5, Enemy6, Enemy7} from "./Enemy.js"
import {canvas} from "../res/context.js"
import {explosionAnimation, spritesheet, player} from "../main.js"

export default class EnemyManager {

	constructor() {
		this.enemies = new Array();
		this.shots = new Array();
		this.qttEnemies = 0;
		this.speed = 100;
		this.count = 0;
		this.idShooting = 0;
		this.deathAnimation = explosionAnimation;
	}

	update(dt) {
		this.enemies.forEach((enemy) => {
			enemy.update(dt);

			if(enemy.body.coord.x > canvas.width+50)
				enemy.body.coord.x = -50;
			if(enemy.body.coord.x < -50)
				enemy.body.coord.x = canvas.width + 50;

			if(enemy.laser) {
				if(Collider.circleCollision(player.body,
						new Body(enemy.body.coord.x, player.body.coord.y, 0,
						new CircleShape(enemy.body.coord.x, player.body.coord.y, 5), 0))) {
					player.hit = true;
				}
			}
		});

		this.shots.forEach((shot, index) => {
			shot.update(dt);
			if(!(Collider.borderCollision(shot.body) == Collider.NO_COLLISION)) {
				this.shots[index] = null;
			}
		});
		for(let i = 0; i < this.shots.length; i++) {
			if(this.shots[i] == null) {
				this.shots.splice(i, 1);
				i--;
			}
		}

		this.count += dt;
		if(this.count >= this.speed){
			this.count = 0;
			if(this.qttEnemies > 0)
				this.shoot();
		}
	}

	draw() {
		this.enemies.forEach((enemy) => {
			if(enemy.laser && !enemy.dead)
				enemy.laser.draw();

			enemy.draw();
		});
		this.shots.forEach((shot) => {
			shot.draw();
		});
	}

	addEnemy(enemy) {
		this.enemies.push(enemy);
		this.qttEnemies++;
		return this;
	}

	checkShot(shot) {
		for(let i = 0; i < this.enemies.length; i++) {
			if(!this.enemies[i].destroyed && !this.enemies[i].dead
					&& Collider.circleCollision(shot.body, this.enemies[i].body)) {
				this.enemies[i].destroyed = true;
				this.qttEnemies--;
				return true;
			}
		}
		return false;
	}
	checkPlayer(body) {
		for(let i = 0; i < this.shots.length; i++) {
			if(Collider.circleCollision(body, this.shots[i].body)) {
				this.shots.splice(i, 1);
				return true;
			}
		}
		return false;
	}

	shoot() {
		this.idShooting = this.nextId();
		this.shots = this.shots.concat(this.enemies[this.idShooting].shoot());
	}

	nextId() {
		let nextId
		do {
			nextId = Math.floor(Math.random() * this.enemies.length);
		} while(this.enemies[nextId].destroyed || this.enemies[nextId].dead)

		return nextId;
	}

	loadLevel(json) {
		this.speed = json.speed;
		json.enemies.forEach((e) => {
			let enemy;
			switch(e.type) {
			case 1:
			default:
				enemy = new Enemy1(new Body(e.x, e.y, 100000,
						new CircleShape(0, 0, 25), Math.PI), e.speed)
					.addSprite("spaceship", spritesheet.cropSprite(0, 2, 2, 2, 0.75))
					.addSprite("shot", spritesheet.cropSprite(1, 4, 1, 1, 0.75))
					.addAnimation(this.deathAnimation.clone())
					.addAnimation(this.deathAnimation.clone())
					.addAnimation(this.deathAnimation.clone());

				break;
			case 2:
				enemy = new Enemy2(new Body(e.x, e.y, 100000,
						new CircleShape(0, 0, 25), Math.PI), e.speed)
					.addSprite("spaceship", spritesheet.cropSprite(4, 2, 2, 2, 0.75))
					.addSprite("shot", spritesheet.cropSprite(1, 4, 1, 1, 0.75))
					.addAnimation(this.deathAnimation.clone())
					.addAnimation(this.deathAnimation.clone())
					.addAnimation(this.deathAnimation.clone());
				break;
			case 3:
				enemy = new Enemy3(new Body(e.x, e.y, 100000,
						new CircleShape(0, 0, 25), Math.PI), e.speed)
					.addSprite("spaceship", spritesheet.cropSprite(2, 2, 2, 2, 0.75))
					.addSprite("shot", spritesheet.cropSprite(1, 4, 1, 1, 0.75))
					.addAnimation(this.deathAnimation.clone())
					.addAnimation(this.deathAnimation.clone())
					.addAnimation(this.deathAnimation.clone());
				break;
			case 4:
				enemy = new Enemy4(new Body(e.x, e.y, 100000,
						new CircleShape(0, 0, 25), Math.PI), e.speed)
					.addSprite("spaceship", spritesheet.cropSprite(2, 0, 2, 2, 0.75))
					.addSprite("shot", spritesheet.cropSprite(1, 4, 1, 1, 0.75))
					.addAnimation(this.deathAnimation.clone())
					.addAnimation(this.deathAnimation.clone())
					.addAnimation(this.deathAnimation.clone());
				break;
			case 5:
				enemy = new Enemy5(new Body(e.x, e.y, 100000,
						new CircleShape(0, 0, 25), Math.PI), e.speed)
					.addSprite("spaceship", spritesheet.cropSprite(4, 0, 2, 2, 0.75))
					.addSprite("shot", spritesheet.cropSprite(1, 4, 1, 1, 0.75))
					.addAnimation(this.deathAnimation.clone())
					.addAnimation(this.deathAnimation.clone())
					.addAnimation(this.deathAnimation.clone());
				break;
			case 6:
				enemy = new Enemy6(new Body(e.x, e.y, 100000,
						new CircleShape(0, 0, 10), Math.PI), e.speed)
					.addSprite("spaceship", spritesheet.cropSprite(6, 0, 2, 2, 0.75))
					.addSprite("shot", spritesheet.cropSprite(2, 4, 1, 1, 0.75))
					.addAnimation(this.deathAnimation.clone())
					.addAnimation(this.deathAnimation.clone())
					.addAnimation(this.deathAnimation.clone());
				break;
			case 7:
				enemy = new Enemy7(new Body(e.x, e.y, 100000,
						new CircleShape(0, 0, 25), Math.PI), e.speed)
					.addSprite("spaceship", spritesheet.cropSprite(6, 2, 2, 2, 0.75))
					.addSprite("shot", spritesheet.cropSprite(3, 4, 8, 0.5, 0.75))
					.addAnimation(this.deathAnimation.clone())
					.addAnimation(this.deathAnimation.clone())
					.addAnimation(this.deathAnimation.clone());
				break;
			}
			this.addEnemy(enemy);
		});
	}
}
