let onDocumentReady;

onDocumentReady = (function () {
    let states = ['interactive', 'complete'];

    return function (func) {
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
    };
}());

export { onDocumentReady }