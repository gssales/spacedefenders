import {Point} from "../res/graphics.js"
import {drawImage} from "../res/drawable.js"

export class Animation {

	constructor(qttFrames, duration, frameSheet) {
		this.point = new Point(0, 0);
		this.qttFrames = qttFrames;
		this.waitFrame = duration/qttFrames;
		this.framesheet = frameSheet;
		this.frameIndex = 1;
		this.playing = false;
		this.count = 0;
	}

	addFrame(frame){
		this.frames.push(frame);
	}

	play() {
		this.playing = true;
	}

	stop() {
		this.playing = false;
	}

	update(dt) {
		if(this.playing) {
			this.count += dt;
			if(this.count >= this.waitFrame) {
				this.count = 0;
				this.frameIndex++;
				if(this.frameIndex > this.qttFrames)
					this.playing = false;
			}
		}
	}

	draw() {
		drawImage(this.point, this.framesheet.cropSprite(this.frameIndex, 0,
				1, 1, 1), 0);
	}

	clone() {
		return new Animation(this.qttFrames, this.waitFrame * this.qttFrames, this.framesheet);
	}
}
