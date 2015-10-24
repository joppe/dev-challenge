import {onDocumentReady} from 'DOM/Ready.js'

function createPoint(x, y) {
    return {
        x,
        y
    }
}

function createRectangle(topleft, bottomright) {
    return {
        topleft,
        bottomright,
        width() {
            return bottomright.x - topleft.x;
        },
        height() {
            return bottomright.y - topleft.y;
        }
    }
}

function createImage(path) {
    let image = new Image(),
        size;

    image.setAttribute('src', path);

    return {
        getElement() {
            return image;
        },

        preload(onLoad, onError) {
            let preload = new Image();

            preload.addEventListener('load', () => {
                onLoad.call(this, preload);
            });
            preload.addEventListener('error`', () => {
                onError.call(this, preload);
            });
            preload.setAttribute('src', image.getAttribute('src'));
        },

        getSize(onReady) {
            if (undefined === size) {
                this.preload(() => {
                    image.style.visibility = 'hidden';
                    image.style.position = 'absolute';

                    document.body.appendChild(image);

                    size = {
                        width: image.offsetWidth,
                        height: image.offsetHeight
                    };

                    onReady.call(this, size);
                }, () => {
                    throw 'Image could not be loaded';
                });
            } else {
                onReady.call(this, size);
            }
        }
    };
}

function createCanvas(width = '400', height = '400') {
    let el = document.createElement('canvas'),
        ctx;

    el.setAttribute('width', width);
    el.setAttribute('height', height);

    ctx = el.getContext('2d');

    return {
        clear() {
            ctx.clearRect(0, 0, width, height);
        },

        getSize() {
            return {
                width,
                height
            };
        },

        getContext() {
            return ctx;
        },

        getElement() {
            return el;
        }
    };
}

function getRGBAFromImageData(data) {
    return {
        r: data.data[0],
        g: data.data[1],
        b: data.data[2],
        a: data.data[3]
    };
}

function isWhitePixel(pixel) {
    return pixel.r === 0 && pixel.g === 0 && pixel.b === 0;
}

function forRange(start, end, func) {
    let inc = (start > end) ? -1 : 1;

    for (let i = start; i <= end; i += inc) {
        func.call(this, i);
    }
}

function getImageData(canvas, rect, func) {
    forRange(rect.topleft.x, rect.bottomright.x, (x) => {
        forRange(rect.topleft.y, rect.bottomright.y, (y) => {
            func.call(this, createPoint(x, y), canvas.getContext().getImageData(x, y, 1, 1));
        });
    });
}

function random(min, max) {
    let d = max - min,
        r = Math.random();

    return min + Math.round(d * r);
}

function createPixel(point, rgba) {
    return {
        point,
        rgba
    };
}

function createPixels(canvas, rect) {
    let pixels = [];

    getImageData(canvas, rect, (point, imageData) => {
        let rgba = getRGBAFromImageData(imageData);

        if (false === isWhitePixel(rgba)) {
            pixels.push(createPixel(point, rgba));
        }
    });

    return {
        length: pixels.length,
        pixels
    };
}

onDocumentReady(() => {
    let canvas = createCanvas(window.innerWidth, window.innerHeight),
        ghost = createCanvas(window.innerWidth, window.innerHeight),
        image = createImage('img/zicht-z-dark-logo-x2.png');

    document.body.appendChild(ghost.getElement());
    ghost.getElement().style.position = 'absolute';
    ghost.getElement().style.visibility = 'hidden';

    document.body.appendChild(canvas.getElement());

    // draw the logo on the ghost
    image.getSize((size) => {
        let x = (ghost.getSize().width - size.width) / 2,
            y = (ghost.getSize().height - size.height) / 2,
            rect = createRectangle(createPoint(x, y), createPoint(x + size.width, y + size.height)),
            pixels;

        ghost.getContext().drawImage(image.getElement(), rect.topleft.x, rect.topleft.y, rect.width(), rect.height());

        pixels = createPixels(ghost, rect);


        forRange(0, pixels.length - 1, (i) => {
            let pixel = pixels.pixels[i],
                data = canvas.getContext().getImageData(pixel.point.x, pixel.point.y, 1, 1);

            data.data[0] = pixel.rgba.r;
            data.data[1] = pixel.rgba.g;
            data.data[2] = pixel.rgba.b;
            data.data[3] = pixel.rgba.a;

            canvas.getContext().putImageData(data, pixel.point.x, pixel.point.y);
        });
        /**/
    });
});