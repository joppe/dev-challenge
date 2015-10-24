export class Visual {
    constructor(path) {
        this.path = path;

        this.image = Visual.createImage(this.path);
    }

    getElement() {
        return this.image;
    }

    static createImage(path) {
        let image = new Image();

        image.setAttribute('src', path);

        return image;
    }

    static preload(image, onLoad, onError) {
        let preload = new Image();

        preload.addEventListener('load', () => {
            onLoad.call(this, preload);
        });
        preload.addEventListener('error`', () => {
            onError.call(this, preload);
        });
        preload.setAttribute('src', image.getAttribute('src'));

    }

    static getSize(image, onReady) {
        Visual.preload(image, () => {
            image.style.visibility = 'hidden';
            image.style.position = 'absolute';

            document.body.appendChild(image);

            onReady({
                width: image.offsetWidth,
                height: image.offsetHeight
            });
        }, () => {
            throw 'Image could not be loaded';
        });
    }
}