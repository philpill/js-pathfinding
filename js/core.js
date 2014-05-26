define(function (require) {

    var Ticker = require('ticker');
    var Interface = require('interface');
    var Canvas = require('canvas');
    var Circle = require('circle');
    var Square = require('square');
    var data = require('data');

    var Core = function (config) {

        this.config = config;
    }

    Core.prototype = {

        constructor : Core,

        init : function () {

            this.loadModules(this.config);
            this.bindEvents(this.config);
            this.loadShapes(this.config);

            this.selected = null;
        },
        loadShapes : function (config) {

            this.shapes = [];
            this.shapes = this.shapes.concat(data.getSquares());
            this.shapes = this.shapes.concat(data.getCircles());
        },
        loadModules : function (config) {

            this.ticker = new Ticker(config);
            this.ticker.init();

            this.interface = new Interface(config);
            this.interface.init();

            this.canvas = new Canvas(config);
            this.canvas.init();
        },
        getSerializedShapes : function () {

            var l = this.shapes ? this.shapes.length : 0;
            var serializedShapes = [];
            while (l--) {
                serializedShapes.push(this.shapes[l].serialize());
            }
            return serializedShapes;
        },
        getClickedObject : function (e) {

            var objects = [];
            var l = this.shapes ? this.shapes.length : 0;
            while (l--) {
                if (this.shapes[l].contains(e.x, e.y)) {
                    objects.push(this.shapes[l]);
                }
            }
            return objects.sort(function(a, b) {
                return a.zIndex - b.zIndex;
            })[0];
        },

        getMouse : function(e) {
            var element = this.canvas.canvas, offsetX = 0, offsetY = 0, mx, my;

            if (element.offsetParent !== undefined) {
                do {
                  offsetX += element.offsetLeft;
                  offsetY += element.offsetTop;
                } while ((element = element.offsetParent));
              }

            mx = e.pageX - offsetX;
            my = e.pageY - offsetY;

            return {x: mx, y: my};
        },

        blurObjects : function () {
            this.selected = null;
            var l = this.shapes.length;
            while (l--) {
                this.shapes[l].execute('blur');
            }
        },

        getGrid : function () {

            var width = this.config.canvas.grid.width;

            var height = this.config.canvas.grid.height;

            var grid = new Array(width);

            var l = grid.length;

            while (l--) {

                grid[l] = [height];

                for (var k = 0; k < height; k++) {

                    grid[l][k] = 0;
                }
            }

            return grid;
        },

        getObjectMap : function () {

            var gridSize = this.config.canvas.grid.size;

            var objects = this.shapes;

            var l = objects.length;

            var grid = this.getGrid();

            while (l--) {
                objects[l].gridX = Math.round(objects[l].x/gridSize) + 1;
                objects[l].gridY = Math.round(objects[l].y/gridSize) + 1;
                grid[objects[l].gridX][objects[l].gridY] = 1;
            }

            return grid;
        },

        tickObjects : function (objects, e) {
            var l = objects.length;
            while (l--) {
                objects[l].execute('tick', e, this.getObjectMap());
            }
        },

        bindEvents : function (config) {

            var that = this;

            this.ticker.bind('tick', function(e) {
                that.interface.execute('tick', e);
                that.tickObjects(that.shapes, e);
                that.canvas.execute('tick', {
                    event: e,
                    shapes : that.getSerializedShapes()
                });
            });

            this.canvas.bind('click', function(e) {
                var mouse = that.getMouse(e);
                var object = that.getClickedObject(that.getMouse(e));
                if (object && object.isSelected) {

                    that.blurObjects();

                } else if (object) {

                    that.blurObjects();

                    that.blurObjects();
                    object.execute('focus', e);
                    object.execute('click', e);

                    if (object.isSelectable) {
                        that.selected = object;
                        object.execute('select', e);
                    }

                } else if (that.selected) {

                    if (!config.isPaused) {
                        // move object
                        that.selected.destinationX = mouse.x;
                        that.selected.destinationY = mouse.y;
                    }

                }
            });

            this.ticker.bind('pause', function(e) {
                console.log('ticker:pause');
                that.interface.execute('pause');
                config.isPaused = true;
            });

            this.ticker.bind('resume', function(e) {
                console.log('ticker:resume');
                that.interface.execute('resume');
                config.isPaused = false;
            });

            this.interface.bind('pause', function(e) {
                console.log('interface:pause');
                that.ticker.execute('pause');
            });

            this.interface.bind('resume', function(e) {
                console.log('interface:resume');
                that.ticker.execute('resume');
            });
        }
    }

    return Core;

});
