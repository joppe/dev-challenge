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
        document.addEventListener('DOMContentLoaded', () => {
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

function easeInSine(t, b, c, d) {
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
}

function easeOutSine(t, b, c, d) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
}

function fallingPixel(pixel, boundingBox) {
    let finished = false,
        animating = false,
        time = 0,
        duration = 200;

    return {
        start() {
            animating = true;
        },

        draw(canvas) {
            let y;

            if (false === animating) {
                y = pixel.point.y;
            } else {
                time += 1;

                if (time === duration || y > boundingBox.bottomright.y) {
                    finished = true;
                }

                y = easeInSine(time, pixel.point.y, pixel.point.y + boundingBox.height(), duration)

            }

            canvas.getContext().putImageData(pixel.imageData, pixel.point.x, y);
        },

        isFinished() {
            return finished;
        }
    };
}

function pointOutsideBox(rectangle, offset, range) {
    let left = random(1, 10) <= 5,
        top = random(1, 10) <= 5,
        x,
        y;

    if (left) {
        let max = rectangle.topleft.x - offset;

        x = random(max - range, max)
    } else {
        let min = rectangle.bottomright.x + offset;

        x = random(min, min + range);
    }

    if (top) {
        let max = rectangle.topleft.y - offset;

        y = random(max - range, max)
    } else {
        let min = rectangle.bottomright.y + offset;

        y = random(min, min + range);
    }

    return createPoint(x, y);
}

function zoomingPixel(pixel, image, boundingBox) {
    let finished = false,
        animating = false,
        time = 0,
        duration = random(150, 300),
        radius = random(200, 400),
        startPoint = pointOutsideBox(boundingBox, radius, 300);

    return {
        start() {
            animating = true;
        },

        draw(canvas) {
            //canvas.getContext().drawImage(image.getElement(), rect.topleft.x, rect.topleft.y, rect.width(), rect.height());
        },

        isFinished() {
            return finished;
        }
    };
}

function createAnimation(availablePixels, canvas) {
    let animatedPixels = [],
        minAmountAnimating = 20,
        maxAmountAnimating = 60;

    function populateAnimating() {
        if (0 < availablePixels.length) {
            let amount = random(minAmountAnimating, maxAmountAnimating);

            forRange(0, Math.min(amount, availablePixels.length - 1), () => {
                let index = random(0, availablePixels.length - 1),
                    drawable = availablePixels[index];

                drawable.start();

                animatedPixels.push(drawable);
                availablePixels.splice(index, 1);
            });
        }
    }

    return function () {
        let remove = [];

        populateAnimating();

        canvas.clear();

        animatedPixels.forEach((drawable) => {
            if (false === drawable.isFinished()) {
                drawable.draw(canvas);
            } else {
                remove.push(drawable);
            }
        });

        availablePixels.forEach((drawable) => {
            drawable.draw(canvas);
        });

        remove.forEach((drawable) => {
            animatedPixels.splice(animatedPixels.indexOf(drawable), 1);
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

        pointOutsideBox(boundingBox, 100, 500);
        window.setTimeout(() => {
            let fallingPixels = [];

            pixels.pixels.forEach((pixel) => {
                fallingPixels.push(fallingPixel(pixel, boundingBox));
            });

            startAnimation(createAnimation(fallingPixels, canvas));
        }, 2000);
    });
});