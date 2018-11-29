
// Classe Point
// Representa um ponto no mundo.

export class Point{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}

	setX(x) {
		this.x = x;
		return this;
	}

	setY(y) {
		this.y = y;
		return this;
	}

	static distance(coordA, coordB) {
		let dx = coordA.x - coordB.x;
		let dy = coordA.y - coordB.y;

		return Math.sqrt(dx*dx + dy*dy);
	}

	static angle(point1, point2) {
		let dy = point1.y - point2.y;
		let dx = point2.x - point1.x;

		return Math.atan2(dy, dx);
	}

	clone() {
		return new Point(this.x, this.y);
	}
}

/* Classe Shape
 * Representa uma forma bidimensional, que pode ser representada
 * na tela do jogo. Possui coordenadas x e y, que representam o
 * algum ponto de referência na forma
 */
class Shape {

	constructor(x, y) {
		this.point = new Point(x, y)
	}
}

/* Classe RectangleShape
 * Representa uma forma retangular. É definida pelo construtor com
 * a coordenada superior esquerda e com a largura e altura do
 * retângulo representado.
 */
export class RectangleShape extends Shape {

	constructor(x, y, width, height) {
		super(x, y)
		this.w = width
		this.h = height

	}

	get supLeft() {
		return new Point(this.point.x, this.point.y)
	}

	get supRight() {
		return new Point(this.point.x + this.w, this.point.y)
	}

	get infRight() {
		return new Point(this.point.x + this.w,
						this.point.y + this.h)
	}

	get infLeft() {
		return new Point(this.point.x, this.point.y + this.h)
	}

	get area() {
		return this.w * this.h
	}

	get getPoints() {
		return [this.supLeft, this.supRight,
				this.infRight, this.infLeft]
	}

}

/* Classe CircleShape
 * Representa uma forma circular. É defina pelo construtor com a
 * coordenada do centro e com o raio do círculo representado.
 */
export class CircleShape extends Shape {

	constructor(x, y, radius) {
		super(x, y)
		this.radius = radius
	}

	get width() {
		return this.radius*2;
	}

	get height() {
		return this.radius*2;
	}

	get area() {
		return Math.PI * this.radius * this.radius
	}

}
