"use strict";
import {canvas} from "./res/context.js"
import {gameloop} from "./logic/gameloop.js"
import {loadSpriteSheet, loadSprite, loadJSON} from "./logic/loaders.js"
import {Background} from "./logic/background.js"
import {Animation} from "./logic/animations.js"
import {SpriteSheet} from "./res/sprite.js"
import Player from "./gameobjects/Player.js"
import LevelManager from "./logic/LevelManager.js"

export var explosionAnimation, spritesheet, player, background1, background2,
	levelManager, ships;

Promise.all([
	loadSpriteSheet("js/assets/spritesheet.png", 64, 64),
	loadSpriteSheet("js/assets/ships.png", 256, 256),
	loadSprite("https://opengameart.org/sites/default/files/Parallax100.png"),
	loadSprite("js/assets/Parallax0.png"),
	loadSprite("js/assets/background3.png"),
	loadJSON("js/assets/lvl-1.json"),
	loadJSON("js/assets/lvl-2.json"),
	loadJSON("js/assets/lvl-3.json"),
	loadJSON("js/assets/lvl-4.json"),
	loadJSON("js/assets/lvl-5.json"),
	loadJSON("js/assets/lvl-6.json"),
	loadJSON("js/assets/lvl-7.json")
])
.then(([s, shipsSprite, background_1, background_2, background_3,
		lvl1, lvl2, lvl3, lvl4, lvl5, lvl6, lvl7]) => {

	ships = shipsSprite;
	spritesheet = s;

	explosionAnimation = new Animation(6, 500,
			new SpriteSheet(spritesheet.cropSprite(8, 2.5, 4, 0.5, 1), 32, 32));

	player = new Player();
	player.addSprite("spaceship", spritesheet.cropSprite(0, 0, 2, 2, 0.75));
	player.addSprite("propeler", spritesheet.cropSprite(0, 4, 1, 1, 0.75));
	player.addSprite("shot", spritesheet.cropSprite(1, 4, 1, 1, 0.75));

	background1 = new Background();
	background1.addSprite(background_2);
	background2 = new Background();
	background2.addSprite(background_3);

	gameloop(
		function load(){
			levelManager = new LevelManager([lvl1, lvl2, lvl3, lvl4, lvl5, lvl6, lvl7]);
		},

		function update(dt) {
			levelManager.update(dt);
		},

		function draw() {
			levelManager.draw();
		}
	)
});
