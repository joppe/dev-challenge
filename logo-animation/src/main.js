import {onDocumentReady} from 'DOM/Ready.js'
import {Canvas} from 'Element/Canvas.js'
import {Visual} from 'Asset/Visual.js'

onDocumentReady(() => {
    let canvas = new Canvas(window.innerWidth, window.innerHeight),
        image = new Visual('img/zicht-z-dark-logo-x2.png');

    document.body.appendChild(canvas.getElement());

    // draw the logo on the canvas
    Visual.getSize(image.getElement(), (size) => {
        let x = (canvas.getSize().width - size.width) / 2,
            y = (canvas.getSize().height - size.height) / 2;

        canvas.getContext().drawImage(image.getElement(), x, y, size.width, size.height);
    });
});