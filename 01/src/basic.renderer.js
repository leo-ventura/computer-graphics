(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.BasicRenderer = {}));
}(this, (function (exports) { 'use strict';


const calculateNormal = (p0, p1) => {
    return nj.array([-(p1.get(1) - p0.get(1)), p1.get(0) - p0.get(0)]);
};

const L_i = (q, p0, p1) => {
    const n = calculateNormal(p0, p1);
    return nj.dot(nj.subtract(q, p0), n);
};

const getCircleVertices = ({center, radius}) => {
    let points = 20;
    let verticesNumber = points + 2;
    const x = center[0];
    const y = center[1]
    const vertices = [];
    let doublePi = 2 * Math.PI;
    for(var i=0; i<verticesNumber; i++) {
        var xPoint = x + (radius * Math.cos((i  * doublePi) / verticesNumber));
        var yPoint = y + (radius * Math.sin((i  * doublePi) / verticesNumber));
        vertices.push([xPoint, yPoint])
    }
    return vertices;
}

const createBoundingBox = ({vertices}) => {
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
};

const applyXForm = ({vertices, xform}) => {
    let transformedVertices = [];
    xform = nj.array(xform);
    for (let vertice of vertices) {
        vertice = nj.array([...vertice, 1]);
        const tVertice = nj.dot(xform, vertice);
        transformedVertices.push([tVertice.get(0), tVertice.get(1)]);
    }
    return transformedVertices;
};

function inside(x, y, primitive) {
    const q = nj.array([x,y]);
    // Assumes vertices are somehow ordered
    const circularVertices = [...primitive.vertices, primitive.vertices[0]];
    let Ls = [];
    for (let i = 0; i < primitive.vertices.length; i++) {
        const p0 = nj.array(circularVertices[i]);
        const p1 = nj.array(circularVertices[i+1]);
        // L_i's return is a scalar, get the first element of array
        const L = L_i(q, p0, p1).get(0);
        if (i != 0 && Ls[i-1] * L < 0) {
            return false;
        }
        Ls.push(L);
    }
    return true;
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
                if (primitive.shape === "circle") {
                    primitive.vertices = getCircleVertices(primitive);
                }

                if (primitive.hasOwnProperty('xform')) {
                    primitive.vertices = applyXForm(primitive);
                }

                primitive.boundingBox = createBoundingBox(primitive);
                preprop_scene.push(primitive);
            }

            return preprop_scene;
        },

        createImage: function() {
            this.image = nj.ones([this.height, this.width, 3]).multiply(255);
        },

        rasterize: function() {
            var color;

            // In this loop, the image attribute must be updated after the rasterization procedure.
            for( let primitive of this.scene ) {
                // Loop through all pixels
                // Use bounding boxes in order to speed up this loop
                const {min_x, max_x, min_y, max_y} = primitive.boundingBox;
                for (var i = Math.floor(min_x); i < Math.floor(max_x); i++) {
                    var x = i + 0.5;
                    for( var j = Math.floor(min_y); j < Math.floor(max_y); j++) {
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
            nj.images.save( this.image, $image );
        }
    }
);

    exports.Screen = Screen;

})));

