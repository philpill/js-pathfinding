require.config({
    baseUrl: 'js',
    paths: {
        json: 'external/json',
        text: 'external/text',
        microevent: 'external/microevent'
    },
    shim: {
        microevent: { exports : 'MicroEvent' }

    },
    deps: ['core', 'json!config.json'],
    callback: function(Core, config) {

        var core = new Core(config);

        core.init();
    }
});