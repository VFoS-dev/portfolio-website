import { gameLoop } from "@/utilities/game";
import { drawStars, initStars } from "./starfield-util";

export function setupStarField(canvas) {
    let width, height, stars = [], starCount = 500, mouseX, mouseY;
    let focalX = window.innerWidth / 2;
    let focalY = window.innerHeight / 2;
    resize();
    ({ stars } = initStars(width, height, starCount));
    drawStars(stars, canvas, width, height, mouseX, mouseY, focalX, focalY)

    const { start, stop } = gameLoop(() => {
        drawStars(stars, canvas, width, height, mouseX, mouseY, focalX, focalY)
    })

    function resize() {
        const { innerWidth, innerHeight } = window
        canvas.width = width = innerWidth;
        canvas.height = height = innerHeight;
        focalX = width / 2;
        focalY = height / 2;
    }

    function trackMouse(e) {
        let sensitivity = 0.05;
        focalX = width / 2 + (e.clientX - width / 2) * sensitivity;
        focalY = height / 2 + (e.clientY - height / 2) * sensitivity;
    }

    addEventListener('resize', resize);
    addEventListener('mousemove', trackMouse);

    return {
        pause() {
            stop();
            console.log('star pause');
        },
        unpause() {
            start();
            console.log('star unpause');
        },
        unmount() {
            stop();
            removeEventListener('resize', resize);
            removeEventListener('mousemove', trackMouse);
        },
    }
}