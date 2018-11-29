
/* Funções de movimento dos inimigos.
 * Todas devem receber como parâmetro:
 *	enemyMovement_x(body, speed, direction, dt, step)
 * body: objeto da classe Body, manipulado para dar o movimento.
 * config: Objeto que define algumas caracteristicas do movimento.
 * dt: Número, a diferença de tempo entre cada update;
 */

/* Função enemyMovement_1
 * Define o movimento do tipo 1 de inimigo. Movimento simples da esquerda para a
 * direita ou vice e versa.
 */
export function enemyMovement_1(body, config, dt) {
	body.velocity.valueX = config.speed;
}

/* Função enemyMovement_2
 * Define o movimento do tipo 2 de inimigo. Movimento revezado para a direita e
 * depois para a esquerda.
 * step == 0: para a direita
 * step == 1: para a esquerda
 */
export function enemyMovement_2(body, config, dt) {
	if(config.step != 1 && config.step != -1) // garante os passos do movimento
		config.step = 1;

	config.count += dt; // conta o tempo entre os passos
	if(config.count >= config.wait) {
		config.count = 0;
		config.step = (config.step == -1? 1 : -1);
	}

	body.velocity.valueX = config.speed * config.step;
}

/* Função enemyMovement_3
 * Define o movimento do tipo 3 de inimigo. Movimento baseado na função seno.
 */
export function enemyMovement_3(body, config, dt) {
	config.waveAngle += Math.PI/180;
	if(config.waveAngle >= 2 * Math.PI)
		config.waveAngle = 0;
	body.velocity.valueX = config.speed;

	if(config.waveType == 0)
		body.coord.y = config.waveHeight + config.waveAmplitude
				* Math.sin(config.waveLength*config.waveAngle);
	else
		body.coord.y = config.waveHeight + config.waveAmplitude
				* Math.cos(config.waveLength*config.waveAngle);
}

export function enemyMovement_4(body, config, dt){
	if(config.step < 0 && config.step > 3) // garante os passos do movimento
		config.step = 0;

	config.count += dt; // conta o tempo entre os passos
	if((config.count >= config.wait) || (config.step%2 == 1 && config.count >= 1000)) {
		config.count = 0;
		config.step++;
		if(config.step > 3)
			config.step = 0;
	}

	switch(config.step) {
	case 0:
	case 2:
		body.velocity.valueY = 0;
		break;
	case 1:
		body.velocity.valueY = config.waveHeight;
		break;
	case 3:
		body.velocity.valueY = -config.waveHeight;
		break;
	}
	body.velocity.valueX = config.speed;
}
