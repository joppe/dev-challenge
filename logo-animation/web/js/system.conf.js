/*global System*/

System.config({
    baseURL: './',

    transpiler: 'babel',

    map: {
        jquery: 'vendor/jquery/dist/jquery.js',
        underscore: 'vendor/underscore/underscore.js',
        backbone: 'vendor/backbone/backbone.js',
        react: 'vendor/react/react.js'
    },

    meta: {
        backbone: {
            deps: ['jquery', 'underscore']
        }
    }
});