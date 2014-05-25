define(function (require) {

    require('microevent');

    var CanvasObject = function () {

        this.zIndex = 0;
        this.type = 'object';
        this.height = 0;
        this.width = 0;
        this.x = 0;
        this.y = 0;
        this.lineWidth = 0;
        this.fillStyle = '#ffffff';
        this.strokeStyle = '#000000';
        this.isClickable = false;
        this.isSelectable = false;
        this.isFocusable = false;
        this.hasFocus = false;
        this.translateDelta = 0;
    }

    CanvasObject.prototype = {

        constructor : CanvasObject,

        execute : function (command, e) {

            this[command + 'Command'](e);
        },
        fuzzyEqual : function (valueA, valueB, delta) {

            var fuzzyEqual = false;

            fuzzyEqual = Math.round(valueA/delta)*delta === Math.round(valueB/delta)*delta;

            return fuzzyEqual;
        },
        tickCommand : function (e) {

            this.translate();
        },
        translate : function () {

            var translateDelta = 5;

            if (this.destinationX) {
                this.x = this.x < this.destinationX ? this.x + translateDelta : this.x - translateDelta;
                this.destinationX = this.fuzzyEqual(this.destinationX, this.x, translateDelta) ? null : this.destinationX;
            }

            if (this.destinationY) {
                this.y = this.y < this.destinationY ? this.y + translateDelta : this.y - translateDelta;
                this.destinationY = this.fuzzyEqual(this.destinationY, this.y, translateDelta) ? null : this.destinationY;
            }
        },
        serialize : function () {

            return {

                zIndex      : 1,
                type        : this.type,
                height      : this.height,
                width       : this.width,
                x           : this.x,
                y           : this.y,
                lineWidth   : this.lineWidth,
                fillStyle   : this.fillStyle,
                strokeStyle : this.strokecolour
            }
        },
        blurCommand : function (e) {
            this.hasFocus = false;
            this.isSelected = false;
        },
        focusCommand : function (e) {
            if (this.isFocusable) {
                this.hasFocus = true;
            }
        },
        clickCommand : function (e) {
            if (this.isClickable) {
                console.log(this);
                console.log('clicked');
            }
        },
        selectCommand : function (e) {
            if (this.isSelectable) {
                this.isSelected = true;
            }
        }
    }

    MicroEvent.mixin(CanvasObject);

    return CanvasObject;
});
