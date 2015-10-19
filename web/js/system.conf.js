/*global System*/

System.config({
    baseURL: './',

    transpiler: 'babel',

    map: {
        jquery: 'vendor/jquery/dist/jquery',
        underscore: 'vendor/underscore/underscore',
        backbone: 'vendor/backbone/backbone',
        react: 'vendor/react/react'
    },

    meta: {
        backbone: {
            deps: ['jquery', 'underscore']
        }
    }
});