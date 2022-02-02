'use strict'
/**
babel.config.js with useful plugins. 
*/
module.exports = function (api) {
    api.cache(true);
    api.assertVersion("^7.4.5");

    const presets = [
        [
            "@babel/preset-env", {
                "targets": {
                    "esmodules": true,
                    "node": true
                }
            }
        ]
    ];


    const plugins = [
        [
            require.resolve('babel-plugin-module-resolver'),
            {
                root: ["./"],
                alias: {
                    "@modules": "./src/modules",
                    "@src": "./src",
                    "@database": "./database"
                }
            }

        ]

    ];


    return {
        presets,
        plugins
    }
}