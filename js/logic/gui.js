import {fillShape, strokeShape, fillText, fillRect, drawImage, drawImage2}
 	from "../res/drawable.js"
import {Point} from "../res/graphics.js"

// Classe GUI
// Classe que representa um interface no jogo.
export class GUI {

	constructor(shape, color, border){
		this.shape = shape;
		this.color = color;
		this.border = border;
		this.items = new Map();
		this.procedure = () => {return;};
	}

	addItem(name, item) {
		this.items.set(name, item);
		return this;
	}

	setItemValue(name, attr, value) {
		this.items.get(name)[attr] = value;

	}

	update(dt) {
		this.procedure();

		this.items.forEach((element, index) => {
			element.update(dt);
		});
	}

	draw() {
		fillShape(this.shape, this.color);
		strokeShape(this.shape, this.border);

		this.items.forEach((element, index) => {
			element.draw(this.shape.point);
		});
	}
}

// Classe Item
// Classe abstrata que representa um item de interface.
export class Item {
	constructor(x, y) {
		this.position = new Point(x, y);
	}

	update(dt) {

	}
}

// Classe TextItem
// Representa um item de texto na interface
export class TextItem extends Item {
	constructor(x, y, text, font, align, color) {
		super(x, y);
		this.text = text;
		this.font = font;
		this.align = align;
		this.color = color;
	}

	draw(reference) {
		fillText(this.position.x + reference.x, this.position.y + reference.y,
				this.text, this.font, this.align, this.color);
	}
}

// Classe BarItem
// Representa uma barra na interface. Possui um valor máximo e um valor atual.
// A barra é preenchida proporcionalmente ao valor máximo.
export class BarItem extends Item {
	constructor(x, y, width, height, maxValue, fillColor, emptyColor) {
		super(x, y);
		this.width = width;
		this.height = height;
		this.maxValue = maxValue;
		this.value = maxValue;
		this.fillColor = fillColor;
		this.emptyColor = emptyColor;
	}

	draw(reference) {
		fillRect(this.position.x + reference.x, this.position.y + reference.y,
			this.width, this.height, this.emptyColor);
		fillRect(this.position.x + reference.x, this.position.y + reference.y,
			this.fillWidth(), this.height, this.fillColor);
	}

	// Método fillWidth
	// Calcula o quanto da barra está preenchida.
	fillWidth() {
		return this.width * (this.value / this.maxValue);
	}
}

export class BarTextureItem extends Item {
	constructor(x, y, maxValue, outTexture, fillTexture, emptyTexture) {
		super(x, y);
		this.maxValue = maxValue;
		this.value = maxValue;
		this.outTexture = outTexture;
		this.fillTexture = fillTexture;
		this.emptyTexture = emptyTexture;
	}

	draw(reference) {
		drawImage(new Point(this.position.x + reference.x,
				this.position.y + reference.y), this.emptyTexture, 0);
		drawImage2(new Point(this.position.x + reference.x,
				this.position.y + reference.y), this.fillTexture,
				this.fillWidth());
		drawImage(new Point(this.position.x + reference.x,
				this.position.y + reference.y), this.outTexture, 0);
	}

	// Método fillWidth
	// Calcula o quanto da barra está preenchida.
	fillWidth() {
		return this.fillTexture.width * (this.value / this.maxValue);
	}
}

export class ProgressBarTextureItem extends Item {
	constructor(x, y, text, outTexture, fillTexture) {
		super(x, y);
		this.value = 0;
		this.text = text;
		this.outTexture = outTexture;
		this.fillTexture = fillTexture;
	}

	draw(reference) {
		drawImage(new Point(this.position.x + reference.x,
				this.position.y + reference.y), this.outTexture, 0);
		for(let i = 0; i < this.value; i++) {
			drawImage(new Point(this.position.x + reference.x + 8 + i*12 - 112,
					this.position.y + reference.y), this.fillTexture, 0);
		}
		fillText(this.position.x + reference.x + 24, this.position.y + reference.y-5,
				this.text, '12px "Press Start 2P"', "left", "#fff");
	}

}

// Classe ImageItem
// Representa um item de imagem na interface.
export class ImageItem extends Item {
	constructor(x, y, image, rotation) {
		super(x, y);
		this.image = image;
		this.rotation = rotation;
	}

	draw(reference) {
		drawImage(new Point(this.position.x + reference.x,
				this.position.y + reference.y), this.image, this.rotation);
	}
}
