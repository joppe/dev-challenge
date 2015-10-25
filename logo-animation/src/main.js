function startAnimation(animation) {
    let active = true;

    (function animloop() {
        if (true === active) {
            window.requestAnimationFrame(animloop);
        }
        active = animation();
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

// quart
function easeOut(t, b, c, d) {
    return -c * ((t = t/d - 1) * t * t * t - 1) + b;
}
/**/
/*/ sine
function easeOut(t, b, c, d) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
}/**/

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

function getSector(pixel, rectangle) {
     let dw = rectangle.width() / 3,
         dy = rectangle.height() / 3,
         sector = 0;

    if (pixel.point.x < rectangle.topleft.x + dw) {
        sector = 1;
    } else if (pixel.point.x < rectangle.topleft.x + (2 * dw)) {
        sector = 2;
    } else {
        sector = 3;
    }

    if (pixel.point.y < rectangle.topleft.y + dy) {
    } else if (pixel.point.y < rectangle.topleft.y + (2 * dy)) {
        sector += 3;
    } else {
        sector += 6;
    }

    return sector;
}

function pointOutsideBox(sector, rectangle, offset, range) {
    let point;

    function left() {
        let maxX = rectangle.topleft.x - offset;

        return random(maxX - range, maxX);
    }

    function center() {
        return random(rectangle.topleft.x, rectangle.bottomright.x);
    }

    function right() {
        let minX = rectangle.bottomright.x + offset;

        return random(minX, minX + range);
    }

    function top() {
        let maxY = rectangle.topleft.y - offset;

        return random(maxY - range, maxY);
    }

    function middle() {
        return random(rectangle.topleft.y, rectangle.bottomright.y);
    }

    function bottom() {
        let minY = rectangle.bottomright.y + offset;

        return random(minY, minY + range);
    }

    switch (sector) {
        case 1: // left - top
            point = createPoint(left(), top());
            break;
        case 2: // center - top
            point = createPoint(center(), top());
            break;
        case 3: // right - top
            point = createPoint(right(), top());
            break;
        case 4: // left - middle
            point = createPoint(left(), middle());
            break;
        case 5: // center - middle
            point = createPoint(top(), middle());
            break;
        case 6: // right - middle
            point = createPoint(right(), middle());
            break;
        case 7: // left - bottom
            point = createPoint(left(), bottom());
            break;
        case 8: // center - bottom
            point = createPoint(center(), bottom());
            break;
        case 9: // right - bottom
            point = createPoint(right(), bottom());
            break;
    }

    return point;
}

function zoomingPixel(pixel, image, imageRect, boundingBox) {
    let finished = false,
        animating = false,
        time = 0,
        duration = random(50, 120),
        radius = random(boundingBox.width(), 1.5 * boundingBox.width()),
        endPoint = pixel.point,
        startPoint = pointOutsideBox(getSector(pixel, imageRect), boundingBox, radius, 300),
        width = radius,
        height = radius,
        x = startPoint.x,
        y = startPoint.y,
        dx = endPoint.x - startPoint.x,
        dy = endPoint.y - startPoint.y;

    return {
        start() {
            animating = true;
        },

        draw(canvas) {
            if (true === animating) {
                let percentage = easeOut(time, 0, 100, duration) / 100;

                time += 1;

                x = startPoint.x + (percentage * dx);
                y = startPoint.y + (percentage * dy);
                height = width = radius - (percentage * (radius - 1));

                if (time === duration) {
                    x = endPoint.x;
                    y = endPoint.y;
                    width = 1;
                    height = 1;
                    animating = false;
                    finished = true;
                }
            }

            if (width < 5) {
                canvas.getContext().fillStyle = 'rgba(' + pixel.rgba.r + ',' + pixel.rgba.g + ',' + pixel.rgba.b + ',' + pixel.rgba.a + ')';
                canvas.getContext().fillRect(x, y, width, height);
            } else {
                canvas.getContext().drawImage(image.getElement(), x, y, width, height);
            }
        },

        isFinished() {
            return finished || width < 30;
        }
    };
}

function createAnimation(availablePixels, canvas, minAmountAnimating, maxAmountAnimating, onFinished) {
    let animatedPixels = [];

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
        console.log(animatedPixels.length);
        if (animatedPixels.length === 0) {
            onFinished();
            return false;
        }

        return true;
    };
}

function createAnimation2(availablePixels, canvas, minAmountAnimating, maxAmountAnimating, onFinished) {
    let animatedPixels = [],
        finishedPixels = [];

    function populateAnimating() {
        let amount = random(minAmountAnimating, maxAmountAnimating);

        if (animatedPixels.length < amount && 0 < availablePixels.length) {
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

        finishedPixels.forEach((drawable) => {
            drawable.draw(canvas);
        });

        remove.forEach((drawable) => {
            animatedPixels.splice(animatedPixels.indexOf(drawable), 1);
            finishedPixels.push(drawable);
        });

        if (animatedPixels.length === 0) {
            onFinished();
            return false;
        }

        return true;
    };
}

onDocumentReady(() => {
    let boundingBox,
        canvas,
        ghost,
        image;

    boundingBox = createRectangle(createPoint(0, 0), createPoint(window.innerWidth, window.innerHeight));
    canvas = createCanvas(boundingBox.width(), boundingBox.height());
    ghost = createCanvas(boundingBox.width(), boundingBox.height());
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
            pixels,
            fall,
            zoom;

        ghost.getContext().drawImage(image.getElement(), rect.topleft.x, rect.topleft.y, rect.width(), rect.height());

        pixels = createPixels(ghost, rect);

        /*/ draw the pixels individually on the canvas
        forRange(0, pixels.length - 1, (i) => {
            let pixel = pixels.pixels[i];

            canvas.getContext().putImageData(pixel.imageData, pixel.point.x, pixel.point.y);
        });
        /**/

        // falling pixels
        fall = function () {
            let fallingPixels = [];

            pixels.pixels.forEach((pixel) => {
                fallingPixels.push(fallingPixel(pixel, boundingBox));
            });

            window.setTimeout(() => {

                startAnimation(createAnimation(fallingPixels, canvas, 20, 60, zoom));
            }, 2000);
        };

        // zooming pixels
        zoom = function () {
            let zoomingPixels = [];

            pixels.pixels.forEach((pixel) => {
                zoomingPixels.push(zoomingPixel(pixel, image, rect, boundingBox));
            });

            window.setTimeout(() => {
                startAnimation(createAnimation2(zoomingPixels, canvas, 3, 12, fall));
            }, 1000);
        };

        zoom();
    });
});