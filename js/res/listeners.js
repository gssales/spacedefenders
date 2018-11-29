import {canvas} from "./context.js"

// Classe kbListener
// Possui info sobre cada tecla do teclado.
export class kbListener {

	static set key(keys) {
		this.keys = {
			none: true,
			Enter: false,
			SpaceBar: false,
			ArrowUp: false,
			ArrowRight: false,
			ArrowDown: false,
			ArrowLeft: false,
			q: false, Q: false,
			w: false, W: false,
			e: false, E: false,
			r: false, R: false,
			t: false, T: false,
			y: false, Y: false,
			u: false, U: false,
			i: false, I: false,
			o: false, O: false,
			p: false, P: false,
			r: false, A: false,
			s: false, S: false,
			d: false, D: false,
			f: false, F: false,
			g: false, G: false,
			h: false, H: false,
			j: false, J: false,
			k: false, K: false,
			l: false, L: false,
			z: false, Z: false,
			x: false, X: false,
			c: false, C: false,
			v: false, V: false,
			b: false, B: false,
			n: false, N: false,
			m: false, M: false};
	}

	static get key() {
		if(!this.keys)
			this.key = null;

		if(!document.onkeypress)
			document.onkeypress = (event) => {
				//alert(event.key)
				if(event.key){
					if(event.key == ' ' && event.target == document.body) {
						this.keys.SpaceBar = true;
						event.preventDefault();
					}
					else
						this.keys[event.key] = true;
					this.keys.none = false;
				}
			}

		if(!document.onkeyup)
			document.onkeyup = (event) => {
				if(event.key){
					if(event.key == ' ')
						this.keys.SpaceBar = false;
					else
						this.keys[event.key] = false;
					this.keys.none = this.isNone();
				}
			}
		return this.keys;
	}

	static isNone() {
		var n = false
		for (let key in this.keys) {
			n = n || this.keys[key]
		}
		return !n
	}
}

// Classe tsListener
// Possui info sobre toques na tela.
export class tsListener {

	static get NO_TOUCH() { return -1 }
	static get TOUCH_RIGHT() { return 21 }
	static get TOUCH_UPPER_RIGHT() { return 15 }
	static get TOUCH_TOP() { return 10}
	static get TOUCH_UPPER_LEFT() { return 5}
	static get TOUCH_LEFT() { return 7}
	static get TOUCH_LOWER_LEFT() { return 11}
	static get TOUCH_BOTTOM() { return 22}
	static get TOUCH_LOWER_RIGHT() { return 33}
	static get TOUCH_CENTER() { return 14}

	static set touch(touches) {
		this.touches = {
			noTouch: true,
			right: false,
			upperRight: false,
			top: false,
			upperLeft: false,
			left: false,
			lowerLeft: false,
			bottom: false,
			lowerRight: false,
			center: false
		}
	}

	static get touch() {
		if(!this.touches)
			this.touch = null;

		if(!canvas.ontouchstart)
			canvas.ontouchstart = (e) => {
				var x = e.touches[0].clientX,
					y = e.touches[0].clientY;

				this.touches[this.touchRegion(x, y)] = true;
				this.touches.noTouch = false;
			}

		if(!canvas.ontouchend)
			canvas.ontouchend = (e) => {
				var x = e.changedTouches[0].clientX,
					y = e.changedTouches[0].clientY;

				this.touches[this.touchRegion(x, y)] = false;
				this.touches.noTouch = true;
			}

		return this.touches;
	}

	static touchRegion(tx, ty) {
		var rect = canvas.getBoundingClientRect();
		var x = tx - rect.left;
		var y = ty - rect.top;
		var result = 0;

		if(x < rect.width * 0.75)
			if(x < rect.width * 0.25)
				result = 1;
			else
				result = 2;
		else
			result = 3;

		if(y < rect.height * 0.75)
			if(y < rect.height * 0.25)
				result *= 5;
			else
				result *= 7;
		else
			result *= 11;

		switch(result){
		case this.TOUCH_RIGHT:
			return "right";
		case this.TOUCH_UPPER_RIGHT:
			return "upperRight";
		case this.TOUCH_TOP:
			return "top";
		case this.TOUCH_UPPER_LEFT:
			return "upperLeft";
		case this.TOUCH_LEFT:
			return "left";
		case this.TOUCH_LOWER_LEFT:
			return "lowerLeft";
		case this.TOUCH_BOTTOM:
			return "bottom";
		case this.TOUCH_LOWER_RIGHT:
			return "lowerRight";
		case this.TOUCH_CENTER:
			return "center";
		}
	}
}
