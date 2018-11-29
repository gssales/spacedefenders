
/* Função gameloop
 * Define a lógica do jogo, na parte da iteração de frames.
 * Recebe três funções, uma que é executada apenas um vez,
 * no início do jogo, a segunda que define a atualização de
 * objetos do jogo, e outra que define como os objetos são
 * desenhados.
 */
export function gameloop(load, update, draw) {

    const maxFPS = 24
    var lastTimestamp = 0,
        dt = 0

    function mainloop(timestamp) {

        if(timestamp < lastTimestamp + (1000 / maxFPS)) {
            requestAnimationFrame(mainloop)
            return
        }
        dt = timestamp - lastTimestamp
        lastTimestamp = timestamp

        update(dt)
        draw()

        requestAnimationFrame(mainloop)
    }

    load();
    mainloop(0);

}
