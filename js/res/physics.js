import {canvas} from "./context.js"
import {Point} from "./graphics.js"

// Classe Vector
// Representa um vetor no mundo. Possui o vetor horizontal e o
// vertical, no eixo x e no eixo y, respectivamente.
export class Vector {

	constructor() {
		this.valueX = 0
		this.valueY = 0
	}

	consVectorXY(x, y) {
		this.valueX = x
		this.valueY = y

		return this
	}

	consVectorAngle(angle, magnitude) {
		this.valueX = Math.cos(angle) * magnitude
		this.valueY = Math.sin(angle) * magnitude

		return this;
	}

	get magnitude() {
		return Math.sqrt(this.valueX*this.valueX ,
				this.valueY*this.valueY)
	}
	set magnitude(magnitude) {
		this.consVectorAngle(this.angle, magnitude)
	}

	get angle() {
		return Math.asin(this.valueY / this.magnitude)
	}
	set angle(angle) {
		this.consVectorAngle(angle, this.magnitude)
	}
}

// Classe Body
// Representa um corpo no mundo.
export class Body {

	constructor(x, y, mass, shape, rotation){
		this.coord = new Point(x, y);
		this.mass = mass;
		this.shape = shape;
		this.rotation = rotation;
		this.velocity = new Vector();
	}

	update(dt) {
		this.coord.x += this.velocity.valueX * (dt / 1000)
		this.coord.y += this.velocity.valueY * (dt / 1000)

		this.shape.point = this.coord;
	}

	// Método applyForce
	// Recebe um vetor que representa um força a ser aplicada ao corpo.
	// Calcula a nova velocidade do corpo.
	applyForce(vector, dt) {
		this.velocity.valueX += (vector.valueX * dt) / this.mass
		this.velocity.valueY += (vector.valueY * dt) / this.mass
	}
}

// Classe Collider
// Possui métodos que verificam colisões entre corpos.
export class Collider {

	static get NO_COLLISION() {
		return -1;
	}
	static get BORDER_TOP() {
		return 0;
	}
	static get BORDER_RIGHT() {
		return 1;
	}
	static get BORDER_BOTTOM() {
		return 2;
	}
	static get BORDER_LEFT() {
		return 3;
	}

	// Método borderCollision
	// Verifica se o corpo colidiu com alguma borda da tela.
	// Retorna true se houve colisão e false caso contrário.
	static borderCollision(body) {
		if(body.coord.y - body.shape.height/2 < 0)
			return this.BORDER_TOP;
		if(body.coord.x + body.shape.width/2 > canvas.width)
			return this.BORDER_RIGHT;
		if(body.coord.x - body.shape.width/2 < 0)
			return this.BORDER_LEFT;
		if(body.coord.y + body.shape.height/2 > canvas.height)
			return this.BORDER_BOTTOM;

		return this.NO_COLLISION;
	}

	// Método circleCollision
	// Verifica a colisão entre dois corpos circulares
	// Retorna true se houve colisão e false caso contrário.
	static circleCollision(bodyA, bodyB) {
		return Point.distance(bodyA.coord, bodyB.coord)
				<= bodyA.shape.radius + bodyB.shape.radius;
	}
}
