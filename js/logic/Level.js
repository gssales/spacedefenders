import {canvas} from "../res/context.js"
import {explosionAnimation, spritesheet, ships, player, levelManager,
		background1, background2} from "../main.js"
import EnemyManager from "../gameobjects/EnemyManager.js"
import {GUI, TextItem, BarTextureItem, ProgressBarTextureItem} from "./gui.js"
import {RectangleShape, Point} from "../res/graphics.js"
import LevelManager from "./LevelManager.js"
import {fillText, drawImage, drawImage3, fillRect, strokeShape} from "../res/drawable.js"
import {kbListener as kb} from "../res/listeners.js"

export class Level {
	constructor(json) {
		this.player = player;
		this.background = background1.clone();
		this.json = json;
		this.enemyManager = new EnemyManager();

		this.gui = new GUI(new RectangleShape(10, canvas.height-110,
				canvas.width-20, 100), "#000", "#fff");
		this.gui.addItem("life_label", new TextItem(30, 20, "Integrity",
				'12px "Press Start 2P"', "left", "#fff"))
		this.gui.addItem("life", new BarTextureItem(canvas.width/4+25, 50, this.player.baseLife,
				spritesheet.cropSprite(8, 0, 4, 0.5, 1),
				spritesheet.cropSprite(8, 0.5, 4, 0.5, 1),
				spritesheet.cropSprite(8, 2, 4, 0.5, 1)))
		this.gui.addItem("energy_label", new TextItem(450, 20, "Energy",
				'12px "Press Start 2P"', "right", "#fff"))
		this.gui.addItem("energy", new BarTextureItem(3*canvas.width/4+25, 50, this.player.baseEnergy,
				spritesheet.cropSprite(8, 1, 4, 0.5, 1),
				spritesheet.cropSprite(8, 1.5, 4, 0.5, 1),
				spritesheet.cropSprite(8, 2, 4, 0.5, 1)));
		this.gui.addItem("minutes", new TextItem(canvas.width/2-18, 20 -canvas.height + 110, "0",
				'16px "Press Start 2P"', "right", "#fff"))
		this.gui.addItem(":", new TextItem(canvas.width/2, 20 -canvas.height + 110, ":",
				'16px "Press Start 2P"', "right", "#fff"))
		this.gui.addItem("seconds", new TextItem(canvas.width/2+-2, 20 -canvas.height + 110, "00",
				'16px "Press Start 2P"', "left", "#fff"))

		this.nextLevel = json.nextLevel;
		this.initiated = false;
		this.endLevel = false;
		this.win = false;
		this.lose = false;
		this.count = 0;

		this.countdown = 150000;
	}

	initiate() {
		this.initiated = true;
		this.enemyManager.loadLevel(this.json);
		this.player.initiate();
		this.gui.setItemValue("energy", "maxValue", this.player.baseEnergy - 150*this.player.cannonPoints);
		this.gui.setItemValue("life", "maxValue", this.player.baseLife + 50*this.player.integrityPoints);
	}

	update(dt) {
		this.background.update(dt);
		this.background.movement.valueX = this.player.body.velocity.valueX/4;
		this.background.movement.valueY = -this.player.body.velocity.valueY;

		this.player.update(dt);
		this.enemyManager.update(dt);

		this.player.shots.forEach((shot, index) => {
			if(this.enemyManager.checkShot(shot))
				this.player.shots[index] = null;
		});
		for(let i = 0; i < this.player.shots.length; i++) {
			if(this.player.shots[i] == null) {
				this.player.shots.splice(i, 1);
				i--;
			}
		}

		if(this.enemyManager.checkPlayer(this.player.body))
			this.player.hit = true;

		this.gui.setItemValue("energy", "value", this.player.energy);
		this.gui.setItemValue("life", "value", this.player.life);

		let minutes = Math.floor(this.countdown/60000);
		let seconds = Math.floor(this.countdown/1000) - minutes*60;

		this.gui.setItemValue("minutes", "text", minutes)
		this.gui.setItemValue("seconds", "text", seconds)

		if(this.player.life <= 0 && !this.win) {
			//console.log("lose");
			this.lose = true;
			this.terminate(dt);
			return;
		}
		if(this.enemyManager.qttEnemies <= 0 && !this.lose) {
			//console.log("win");
			this.win = true;
			this.terminate(dt);
			return;
		}

		if(this.countdown > 0)
			this.countdown -= dt;
		else
			this.countdown = 0;
	}

	draw() {
		if(!this.lose) {
			this.background.draw();
			this.player.draw();
			this.enemyManager.draw();
			this.gui.draw();
		}
		if(this.win)
			fillText(10, canvas.height/2-32, "LEVEL COMPLETED",
					'32px "Press Start 2P"', "left", "#fff");
		if(this.lose)
			fillText(100, canvas.height/2-32, "GAME OVER",
					'32px "Press Start 2P"', "left", "#fff");
	}

	terminate(dt) {
		//console.log("aaaa");
		this.endLevel = true;
		this.count += dt;
		if(this.count >= 3000) {
			if(this.win) {
				levelManager.activeLevel = this.nextLevel;
				levelManager.upgraded = false;
				this.player.sparePoints += 1+ Math.floor(this.countdown/30000);
			}
			if(this.lose) {
				levelManager.menu = true;
				levelManager.activeLevel = 0;
				this.player.sparePoints = 0;
				this.player.cannonPoints = 0;
				this.player.propelerPoints = 0;
				this.player.integrityPoints = 0;
			}
			levelManager.initiated = false;
		}
	}
}

export class Upgrade {
	constructor() {
		this.background = background2.clone();
		this.ship = ships.cropSprite(0, 1, 1, 1, 1);
		this.propeler = ships.cropSprite(1, 1, 1, 1, 1);
		this.dx = 0;

		this.barCannon = new ProgressBarTextureItem(3*canvas.width/4-32, canvas.height/2 - 112,
			"Cannon",
			spritesheet.cropSprite(8, 3, 4, 0.5, 1),
			spritesheet.cropSprite(8, 3.5, 0.5, 0.5, 1));
		this.barIntegrity = new ProgressBarTextureItem(3*canvas.width/4-32, canvas.height/2,
			"Integrity",
			spritesheet.cropSprite(8, 3, 4, 0.5, 1),
			spritesheet.cropSprite(8, 3.5, 0.5, 0.5, 1));
		this.barPropeler = new ProgressBarTextureItem(3*canvas.width/4-32, canvas.height/2 + 112,
			"Propeler",
			spritesheet.cropSprite(8, 3, 4, 0.5, 1),
			spritesheet.cropSprite(8, 3.5, 0.5, 0.5, 1));
		this.upgradePoints = new TextItem(canvas.width/4-10, 50,
			"Upgrade Points: 0", '16px "Press Start 2P"', "left", "#fff");
		this.selector1 = new TextItem(canvas.width/2-64, canvas.height/2 - 124,
			"<       >", '32px "Press Start 2P"', "left", "#fff");
		this.selector2 = new TextItem(canvas.width/2-64, canvas.height/2 - 12,
			"<        >", '32px "Press Start 2P"', "left", "#fff");
		this.selector3 = new TextItem(canvas.width/2-64, canvas.height/2 +100,
			"<        >", '32px "Press Start 2P"', "left", "#fff");
		this.selection = 1

		this.initiated = false;
	}

	initiate() {
		this.initiated = true;
		this.background.movement.valueY = 800;
	}

	update(dt) {
		this.background.update(dt);
		this.dx = Math.random() * 6 - 3;
		this.barCannon.value = player.cannonPoints;
		this.barIntegrity.value = player.integrityPoints;
		this.barPropeler.value = player.propelerPoints;
		this.upgradePoints.text = "Upgrade Points: "+player.sparePoints;

		if(kb.key.w || kb.key.ArrowUp)
			this.selection -= 1;
		if(kb.key.s || kb.key.ArrowDown)
			this.selection += 1;
		if(this.selection < 1)
			this.selection = 3;
		if(this.selection > 3)
			this.selection = 1;

		if(kb.key.d || kb.key.ArrowRight) {
			if(player.sparePoints > 0){
				switch (this.selection) {
					case 1:
						if(player.cannonPoints < 10) {
							player.cannonPoints += 1;
							player.sparePoints -= 1;
						}
						break;
					case 2:
						if(player.integrityPoints < 10) {
							player.integrityPoints += 1;
							player.sparePoints -= 1;
						}
						break;
					case 3:
						if(player.propelerPoints < 10) {
							player.propelerPoints += 1;
							player.sparePoints -= 1;
						}
						break;
				}
			}
		}
		if(kb.key.a || kb.key.ArrowLeft) {
			switch(this.selection) {
				case 1:
					if(player.cannonPoints > 0) {
						player.sparePoints += 1;
						player.cannonPoints -= 1;
					}
					break;
				case 2:
					if(player.integrityPoints > 0) {
						player.sparePoints += 1;
						player.integrityPoints -= 1;
					}
					break;
				case 3:
					if(player.propelerPoints > 0) {
						player.sparePoints += 1;
						player.propelerPoints -= 1;
					}
					break;
			}
		}

		if(kb.key.SpaceBar)
			this.terminate(dt);
	}

	draw() {
		this.background.draw();
		drawImage(new Point(canvas.width/4+this.dx-32, canvas.height/2),
				this.propeler, 0);
		drawImage(new Point(canvas.width/4+this.dx-32, canvas.height/2),
				this.ship, 0);

		fillRect(canvas.width/2-150, 42, 300, 30, "#000");
		strokeShape(new RectangleShape(canvas.width/2-150, 42,
				300, 30), "#fff");
		fillRect(canvas.width/2-60, canvas.height/4-12, 305, 324, "#000");
		strokeShape(new RectangleShape(canvas.width/2-60, canvas.height/4-12,
				305, 324), "#fff");
		fillRect(canvas.width/2-150, canvas.height - 50, 300, 30, "#000");
		strokeShape(new RectangleShape(canvas.width/2-150, canvas.height - 50,
				300, 30), "#fff");
		new TextItem(canvas.width/4-10, canvas.height - 40,
			"Press Space Bar to continue",
			'10px "Press Start 2P"', "left", "#fff").draw(new Point(0, 0));

		this.barCannon.draw(new Point(0, 0));
		this.barIntegrity.draw(new Point(0, 0));
		this.barPropeler.draw(new Point(0, 0));
		this.upgradePoints.draw(new Point(0, 0));
		switch (this.selection) {
			case 1:
				this.selector1.draw(new Point(0, 0));
				break;
			case 2:
				this.selector2.draw(new Point(0, 0));
				break;
			case 3:
				this.selector3.draw(new Point(0, 0));
				break;
		}
		new TextItem(canvas.width/2-50, canvas.height/2 - 92,
			"Velocidade de recarga da",
			'10px "Press Start 2P"', "left", "#fff").draw(new Point(0, 0));
		new TextItem(canvas.width/2-50, canvas.height/2 - 81,
			"energia",
			'10px "Press Start 2P"', "left", "#fff").draw(new Point(0, 0));
		new TextItem(canvas.width/2-50, canvas.height/2 +20,
			"Quantidade de dano suportado ",
			'10px "Press Start 2P"', "left", "#fff").draw(new Point(0, 0));
		new TextItem(canvas.width/2-50, canvas.height/2 +31,
			"pela sua nave",
			'10px "Press Start 2P"', "left", "#fff").draw(new Point(0, 0));
		new TextItem(canvas.width/2-50, canvas.height/2 + 132,
			"Aceleração da sua nave",
			'10px "Press Start 2P"', "left", "#fff").draw(new Point(0, 0));

	}

	terminate(dt) {
		levelManager.initiated = false;
		levelManager.upgraded = true;
	}
}

export class Menu {
	constructor() {
		this.background = background1.clone();
		this.background.movement.valueX = 100;
	}

	initiate() {

	}

	update(dt) {
		this.background.update(dt);
		if(kb.key.Enter)
			this.terminate(dt);
	}

	draw() {
		this.background.draw();
		new TextItem(90, 50, "SPACE", '64px "Press Start 2P"', "left", "#fff")
			.draw(new Point(0, 0));
		new TextItem(90, 115, "DEFENDERS*", '32px "Press Start 2P"', "left", "#fff")
			.draw(new Point(0, 0));
		new TextItem(canvas.width, canvas.height-9, "*not related to Space Invaders",
			'8px "Press Start 2P"', "right", "#fff")
			.draw(new Point(0, 0));
		new TextItem(canvas.width/2-5*16, canvas.height/2-4*16, "Controles:",
			'16px "Press Start 2P"', "left", "#fff")
			.draw(new Point(0, 0));
		new TextItem(canvas.width/2-16*12, canvas.height/2-2*16, "A e D ou Setas do Teclado",
			'16px "Press Start 2P"', "left", "#fff")
			.draw(new Point(0, 0));
		new TextItem(canvas.width/2-16*9, canvas.height/2-16, "movimentar da nave",
			'16px "Press Start 2P"', "left", "#fff")
			.draw(new Point(0, 0));
		new TextItem(canvas.width/2-16*7.5, canvas.height/2+16, "Barra de Espaço",
			'16px "Press Start 2P"', "left", "#fff")
			.draw(new Point(0, 0));
		new TextItem(canvas.width/2-16*3, canvas.height/2+2*16, "atirar",
			'16px "Press Start 2P"', "left", "#fff")
			.draw(new Point(0, 0));
		new TextItem(canvas.width/2-16*9.5, canvas.height/2+16*8, "Press Enter to play",
			'16px "Press Start 2P"', "left", "#fff")
			.draw(new Point(0, 0));
	}

	terminate(dt) {
		levelManager.initiated = false;
		levelManager.menu = false;
		levelManager.upgraded = true;
	}
}

export class WinScreen {
	constructor() {
		this.background = background1.clone();
		this.background.movement.valueX = 100;
	}

	initiate() {

	}

	update(dt) {
		this.background.update(dt);
		if(kb.key.Enter)
			this.terminate(dt);
	}

	draw() {
		this.background.draw();
		new TextItem(canvas.width/4+24*1.5, canvas.height/4,
			"wow", '24px "Press Start 2P"', "right", "#fff")
			.draw(new Point(0, 0));
		new TextItem(3*canvas.width/4-24*3.5, canvas.height/4,
			"you win", '24px "Press Start 2P"', "left", "#fff")
			.draw(new Point(0, 0));
		new TextItem(canvas.width/4+24*4.5, canvas.height/2,
			"very good", '24px "Press Start 2P"', "right", "#fff")
			.draw(new Point(0, 0));
		new TextItem(3*canvas.width/4-24*4, canvas.height/2-64,
			"con", '24px "Press Start 2P"', "left", "#fff")
			.draw(new Point(0, 0));
		new TextItem(3*canvas.width/4-24*4, canvas.height/2-32,
			"gra", '24px "Press Start 2P"', "left", "#fff")
			.draw(new Point(0, 0));
		new TextItem(3*canvas.width/4-24*4, canvas.height/2,
			"tu", '24px "Press Start 2P"', "left", "#fff")
			.draw(new Point(0, 0));
		new TextItem(3*canvas.width/4-24*4, canvas.height/2+32,
			"la tions", '24px "Press Start 2P"', "left", "#fff")
			.draw(new Point(0, 0));
		new TextItem(canvas.width/2-16*9.5, canvas.height/2+16*8, "Press Enter to exit",
			'16px "Press Start 2P"', "left", "#fff")
			.draw(new Point(0, 0));
	}

	terminate(dt) {
		levelManager.initiated = false;
		levelManager.menu = true;
		levelManager.upgraded = true;
	}
}
