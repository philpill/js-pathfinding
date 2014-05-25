define(function (require) {

    require('microevent');

    var Ticker = function (config) {

        this.timeout = config.timeout;
        this.previousTime = new Date();
        this.currentTime = new Date();
        this.requestID ;
        this.fps = 0;
    }

    Ticker.prototype = {

        constructor : Ticker,

        init : function (args) {

            this.requestID = requestAnimationFrame(this.tick.bind(this));
        },
        tick : function () {

            this.currentTime = new Date();
            this.fps = 1000 / (this.currentTime - this.previousTime);
            this.trigger('tick', { 'fps' : this.fps, 'time' : Date.now() });
            this.previousTime = this.currentTime;
            this.requestID = requestAnimationFrame(this.tick.bind(this));
        },
        pauseCommand : function () {

            cancelAnimationFrame(this.requestID);
            this.requestID = null;
            this.trigger('pause');
        },
        resumeCommand : function () {

            if (!this.requestID ) {
                this.requestID = requestAnimationFrame(this.tick.bind(this));
            }
            this.trigger('resume');
        },
        execute : function (command) {

            this[command + 'Command']();
        }
    }

    MicroEvent.mixin(Ticker);

    return Ticker;
});
