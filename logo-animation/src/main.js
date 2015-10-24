function startAnimation(animation) {
    (function animloop(){
        window.requestAnimationFrame(animloop);
        animation();
    })();
}


function onDocumentReady(func) {
    let states = ['interactive', 'complete'];

    if (states.indexOf(document.readyState) !== -1) {
        func.call(this);
    } else if (document.attachEvent) {
        document.attachEvent('onreadystatechange', () => {
            if (states.indexOf(document.readyState) !== -1) {
                func.call(this);
            }
        });
    } else {
        document.addEventListener('DOMContentLoaded', (event) => {
            func.call(this);
        });
    }
}

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

function createPixel(point, rgba, imageData) {
    return {
        point,
        rgba,
        imageData
    };
}

function createPixels(canvas, rect) {
    let pixels = [];

    getImageData(canvas, rect, (point, imageData) => {
        let rgba = getRGBAFromImageData(imageData);

        if (false === isWhitePixel(rgba)) {
            pixels.push(createPixel(point, rgba, imageData));
        }
    });

    return {
        length: pixels.length,
        pixels
    };
}

/**
 * Easing equation function for a sinusoidal (sin(t))
 * easing in: accelerating from zero velocity.
 * @param {number} t  Current time (in frames or seconds).
 * @param {number} b  Starting value.
 * @param {number} c  Change needed in value.
 * @param {number} d  Expected easing duration (in frames or seconds).
 * @return {number} The correct value.
 */
function easeInSine(t, b, c, d) {
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
}

function fallingPixel(pixel, boundingBox) {
    let finished = false,
        time = 0,
        duration = 200;

    return {
        draw(canvas) {
            let y;

            time += 1;
            y = easeInSine(time, pixel.point.y, pixel.point.y + boundingBox.height(), duration);

            canvas.getContext().putImageData(pixel.imageData, pixel.point.x, y);

            if (time === duration) {
                finished = true;
            }
        },

        isFinished() {
            return finished;
        }
    };
}

function fallingAnimation(pixels, boundingBox, canvas) {
    let drawables = [],
        available = [];

    pixels.forEach((pixel) => {
        available.push(fallingPixel(pixel, boundingBox));
    });

    return function () {
        canvas.clear();
        drawables.forEach((drawable) => {
            if (false === drawable.isFinished()) {
                drawable.draw(canvas);
            }
        });
    };
}

onDocumentReady(() => {
    let boundingBox = createRectangle(createPoint(0, 0), createPoint(window.innerWidth, window.innerHeight)),
        canvas = createCanvas(boundingBox.width(), boundingBox.height()),
        ghost = createCanvas(boundingBox.width(), boundingBox.height()),
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

        // draw the pixels individually on the canvas
        forRange(0, pixels.length - 1, (i) => {
            let pixel = pixels.pixels[i];

            canvas.getContext().putImageData(pixel.imageData, pixel.point.x, pixel.point.y);
        });

        startAnimation(fallingAnimation(pixels.pixels, boundingBox, canvas));
    });
});