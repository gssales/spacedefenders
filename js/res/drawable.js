import {context} from "./context.js"

// Função drawCircle
// Desenha um círculo no canvas.
function drawCircle(point, radius, fillStyle) {
    context.arc(point.x, point.y, radius, 0, 2*Math.PI, false)
	context.closePath();
}

// Função fillCircle
// Desenha um círculo preenchido no canvas.
export function fillCircle(point, radius, fillStyle) {
	context.fillStyle = fillStyle
	drawCircle(point, radius, fillStyle);
	context.fill();
}

// Função strokeCircle
// Desenha um círculo vazio no canvas.
export function strokeCircle(point, radius, strokeStyle) {
	context.strokeStyle = strokeStyle
	drawCircle(point, radius, strokeStyle);
	context.stroke();
}

// Função drawPolygon
// Desenha um polígono definido por uma série de pontos.
function drawPolygon(points, fillStyle) {
	context.beginPath();
	context.moveTo(points[0].x, points[0].y);
	points.forEach((element, index) => {
		context.lineTo(element.x, element.y);
	});
	context.closePath();
}

// Função fillPolygon
// Desenha um polígono preenchido no canvas.
export function fillPolygon(points, fillStyle) {
	context.fillStyle = fillStyle;
	drawPolygon(points, fillStyle);
	context.fill();
}

// Função strokePolygon
// Desenha um polígono vazio no canvas.
export function strokePolygon(points, strokeStyle) {
	context.strokeStyle = strokeStyle;
	drawPolygon(points, strokeStyle);
	context.stroke();
}

// Função fillShape
// Desenha a partir de uma forma, preenchendo a forma.
export function fillShape(shape, fillStyle) {
	if(shape.radius)
		fillCircle(shape.point, shape.radius, fillStyle);
		fillPolygon(shape.getPoints, fillStyle);
}

// Função strokeShape
// Desenha a partir de uma forma, com a forma vazia.
export function strokeShape(shape, strokeStyle) {
	if(shape.radius)
		strokeCircle(shape.point, shape.radius, strokeStyle);
	else
		strokePolygon(shape.getPoints, strokeStyle);
}

// Função fillText
// Desenha um texto no canvas.
export function fillText(x, y, text, font, align, color) {
	context.font = font;
	context.fillStyle = color;
	context.textAlign = align;
	context.textBaseline = "top";

	context.fillText(text, x, y);
}

// Função fillRect
// Preenche um retângulo no canvas.
export function fillRect(x, y, width, height, fillStyle) {
	context.fillStyle = fillStyle;
	context.fillRect(x, y, width, height);
}

// Função drawImage
// Desenha um imagem no canvas.
export function drawImage(point, image, rotation) {
	context.save()
		context.translate(point.x, point.y)
		context.rotate(rotation)
		context.drawImage(image, image.width/(-2), image.height/(-2));
	context.restore()
}

export function drawImage2(point, image, width) {
	context.drawImage(image, 0, 0, image.width, image.height,
		point.x-image.width/2, point.y-image.height/2, width, image.height);
}

export function drawImage3(point, image) {
	context.save()
		context.translate(point.x, point.y)
		context.scale(-1, 1)
		context.drawImage(image, image.width/(-2), image.height/(-2));
	context.restore()
}
