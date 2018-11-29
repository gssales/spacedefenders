"use strict";
import {canvas} from "./res/context.js"
import {gameloop} from "./logic/gameloop.js"
import {loadLevels, loadSpriteSheet, loadSprite, loadJSON} from "./logic/loaders.js"
import {Background} from "./logic/background.js"
import {Animation} from "./logic/animations.js"
import {SpriteSheet} from "./res/sprite.js"
import Player from "./gameobjects/Player.js"
import LevelManager from "./logic/LevelManager.js"

export var explosionAnimation, spritesheet, player, background1, background2,
	levelManager, ships;

	gameloop(
		function load(resolve){
			var p1 = loadSpriteSheet("js/assets/ships.png", 256, 256)
				.then((s) => {
					ships = s
					console.log(p1)
				})

			var p2 = loadSpriteSheet("js/assets/spritesheet.png", 64, 64)
				.then((s) => {
					spritesheet = s

					explosionAnimation = new Animation(6, 500,
							new SpriteSheet(spritesheet.cropSprite(8, 2.5, 4, 0.5, 1), 32, 32))

					player = new Player();
					player.addSprite("spaceship", spritesheet.cropSprite(0, 0, 2, 2, 0.75))
					player.addSprite("propeler", spritesheet.cropSprite(0, 4, 1, 1, 0.75))
					player.addSprite("shot", spritesheet.cropSprite(1, 4, 1, 1, 0.75))
				})

			var p3 = Promise.all([loadSprite("https://opengameart.org/sites/default/files/Parallax100.png"),
				loadSprite("js/assets/Parallax0.png"),
				loadSprite("js/assets/background3.png")])
			.then(([background_1, background_2, background_3]) => {

				background1 = new Background()
				background1.addSprite(background_1)
				background1.addSprite(background_2)
				background2 = new Background()
				background2.addSprite(background_3)
			})

			var plvls = Promise.all(loadLevels(7))
			.then((lvls) => {
				levelManager = new LevelManager(lvls)
			})

			Promise.all([p1, p2, p3, plvls])
			.then(() => {
				resolve()
			})
		},

		function update(dt) {
			levelManager.update(dt);
		},

		function draw() {
			levelManager.draw();
		}
	)
