
/* Classe SpriteSheet
 * Armazena sprites
 * Tirei do vídeo do Meth Meth Method
 */
export class SpriteSheet {

	constructor(image, width, height) {
		this.image = image;
		this.width = width;
		this.height = height;
	}

	cropSprite(x, y, w, h, proportion) {

		const buffer = document.createElement("canvas");
		buffer.width = this.width * w * proportion;
		buffer.height = this.height * h * proportion;
		buffer.getContext('2d')
			.drawImage(this.image,
				x * this.width, y * this.height, w * this.width, h * this.height,
				0, 0, this.width * w * proportion, this.height * h * proportion);
		return buffer;
	}
}
