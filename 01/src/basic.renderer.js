(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.BasicRenderer = {}));
}(this, (function (exports) { 'use strict';

// shape.js
const createShapeFromPrimitive = (primitive) => {
    let shape;
    switch(primitive.shape.toLowerCase()) {
        case "circle":
            shape = Circle;
            break;
        case "triangle":
            shape = Triangle;
            break;
        case "polygon":
            shape = Polygon;
            break;
        default:
            console.error(`Can't instantiate shape ${primitive.shape}`);
            return;
    }
    return new shape(primitive);
}

const calculateNormal = (p0, p1) => {
    return nj.array([-(p1[1] - p0[1]), p1[0] - p0[0]]);
};

const L_i = (q, p0, p1) => {
    const n = calculateNormal(p0, p1);
    return (q - p0).dot(n.T);
};
class Shape {
    constructor({vertices, color}) {
        this.boundingBox = this.createBoundingBox(vertices);
        this.vertices = vertices;
        this.color = color;
    }

    isInsideBoundingBox(x,y) {
        const {min_x, max_x, min_y, max_y} = this.boundingBox;
        return between(min_x, x, max_x) && between(min_y, y, max_y);
    }

    isInsideShape(x, y) {
        const q = nj.array();
        const circularVertices = [...this.vertices, this.vertices[0]];
        let Ls = [];
        for (let i; i < circularVertices.length; i++) {
            const p0 = nj.array(circularVertices[i]);
            const p1 = nj.array(circularVertices[i+1]);
            const L = L_i(q, p0, p1);
            if (i != 0 && Ls[i-1] * L < 0) {
                return false;
            }
            Ls.push(L);
        }
        return true;
    }

    isInside(x, y) {
        return this.isInsideBoundingBox(x,y) && this.isInsideShape(x,y);
    }
};

// triangle.js
class Triangle extends Shape {
    constructor(primitive) {
        super(primitive);
    }

    createBoundingBox(vertices) {
        let min_x = Number.MAX_VALUE;
        let min_y = Number.MAX_VALUE;
        let max_x = Number.MIN_VALUE;
        let max_y = Number.MIN_VALUE;
        for (let [x,y] of vertices) {
            min_x = x < min_x ? x : min_x;
            max_x = x > max_x ? x : max_x;
            min_y = y < min_y ? y : min_y;
            max_y = y > max_y ? y : max_y;
        }
        return {
            min_x,
            max_x,
            min_y,
            max_y
        };
    }
}

const between = (left, x, right) => {
    return left <= x && x <= right;
}

// circle.js
class Circle {};

// polygon.js
class Polygon {};

// --------------------------------- Basic Renderer functionalities ----------- //
function inside(x, y, primitive) {
    return primitive.isInside(x,y);
}

function Screen( width, height, scene ) {
    this.width = width;
    this.height = height;
    this.scene = this.preprocess(scene);
    this.createImage(); 
}

Object.assign( Screen.prototype, {

        preprocess: function(scene) {
            // Possible preprocessing with scene primitives, for now we don't change anything
            // You may define bounding boxes, convert shapes, etc
            let preprop_scene = [];

            for( let primitive of scene ) {
                // do some processing
                // for now, only copies each primitive to a new list
                let primitiveShape = createShapeFromPrimitive(primitive);
                preprop_scene.push(primitiveShape);
            }

            
            return preprop_scene;
        },

        createImage: function() {
            this.image = nj.ones([this.height, this.width, 3]).multiply(255);
        },

        rasterize: function() {
            var color;

            // In this loop, the image attribute must be updated after the rasterization procedure.
            for( var primitive of this.scene ) {

                // Loop through all pixels
                // Use bounding boxes in order to speed up this loop
                for (var i = 0; i < this.width; i++) {
                    var x = i + 0.5;
                    for( var j = 0; j < this.height; j++) {
                        var y = j + 0.5;

                        // First, we check if the pixel center is inside the primitive 
                        if ( inside( x, y, primitive ) ) {
                            // only solid colors for now
                            color = nj.array(primitive.color);
                            this.set_pixel( i, this.height - (j + 1), color );
                        }
                        
                    }
                }
            }
            
            
            
        },

        set_pixel: function( i, j, colorarr ) {
            // We assume that every shape has solid color
        
            this.image.set(j, i, 0,    colorarr.get(0));
            this.image.set(j, i, 1,    colorarr.get(1));
            this.image.set(j, i, 2,    colorarr.get(2));
        },

        update: function () {
            // Loading HTML element
            var $image = document.getElementById('raster_image');
            $image.width = this.width; $image.height = this.height;

            // Saving the image
            // nj.images.save( this.image, $image );
        }
    }
);

    exports.Screen = Screen;
    
})));

