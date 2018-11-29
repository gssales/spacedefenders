import {SpriteSheet} from "../res/sprite.js"

// Função loadSpriteSheet
// Carrega imagem e armazena em um SpriteSheet.
export function loadSpriteSheet(url, w, h) {
	return loadImage(url)
		.then(image => {
			const sprites = new SpriteSheet(image, w, h);
			return sprites;
		});
}

// Função loadSprite
// Carrega um sprite simples de um arquivo.
export function loadSprite(url) {
	return loadImage(url)
		.then(image => {
			const buffer = document.createElement("canvas");
			buffer.width = image.width;
			buffer.height = image.height;
			buffer.getContext('2d')
				.drawImage(image, 0, 0, image.width, image.height,
					0, 0, buffer.width, buffer.height);
			return buffer;
		});
}

// Função loadImage
// Carrega uma imagem.
// Tirei do vídeo do Meth Meth Method
export function loadImage(url) {
	return new Promise(resolve => {
		const image = new Image()
		image.addEventListener("load", () => {
			resolve(image)
		})
		image.src = url
	})
}

export function loadJSON(url) {
	return new Promise(resolve => {
		const xobj = new XMLHttpRequest();
		xobj.onreadystatechange = () => {
			if(xobj.readyState == 4 && xobj.status == "200") {
				let str = xobj.response;
				resolve(JSON.parse(str));
			}
		}
		xobj.open("POST", url, true);
		xobj.send(null);
	});
}
