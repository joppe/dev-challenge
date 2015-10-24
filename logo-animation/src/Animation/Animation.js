export class Animation {
    static start(animation) {
        (function animloop(){
            window.requestAnimationFrame(animloop);
            animation();
        })();
    }
}