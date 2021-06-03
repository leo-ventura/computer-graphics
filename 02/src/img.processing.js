(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.ImageProcessing = {}));
}(this, (function (exports) { 'use strict';



    function ImageProcesser(img, kernel = null, xform = null, bhandler = 'icrop') {
        this.img = img.clone();
        this.width = img.shape[1];
        this.height = img.shape[0];
        this.kernel = kernel;
        this.xform = xform;
        this.bhandler = bhandler;
    }

    Object.assign( ImageProcesser.prototype, {

        apply_kernel: function(border = 'icrop') {
            // Method to apply kernel over image (incomplete)
            // border: 'icrop' is for cropping image borders, 'extend' is for extending image border
            // You may create auxiliary functions/methods if you'd like
            const box = () => {
                // Media aritmetica dos pixels cobertos pelo filtro
                let filtered_img = this.img.clone();

                for (let i = 1; i < this.width - 1; i++) {
                    for (let j = 1; j < this.height - 1; j++) {
                        const total = this.img.get(i-1, j-1)
                                    + this.img.get(i  , j-1)
                                    + this.img.get(i+1, j-1)
                                    + this.img.get(i-1, j  )
                                    + this.img.get(i  , j  )
                                    + this.img.get(i+1, j  )
                                    + this.img.get(i-1, j+1)
                                    + this.img.get(i  , j+1)
                                    + this.img.get(i+1, j+1)

                        const pixel = total/9;

                        filtered_img.set(i, j, pixel);
                    }
                }

                return filtered_img;
            };

            const sobel = () => {
                // Modulo do gradiente de I
                // [ref]: https://pt.wikipedia.org/wiki/Filtro_Sobel
                let filtered_img = this.img.clone();

                for (let i = 1; i < this.width - 1; i++) {
                    for (let j = 1; j < this.height - 1; j++) {
                        const totalSx = this.img.get(i-1, j-1) * -1
                                      + this.img.get(i  , j-1) * -2
                                      + this.img.get(i+1, j-1) * -1
                                      // + this.img.get(i-1, j  ) * 0
                                      // + this.img.get(i  , j  ) * 0
                                      // + this.img.get(i+1, j  ) * 0
                                      + this.img.get(i-1, j+1) * 1
                                      + this.img.get(i  , j+1) * 2
                                      + this.img.get(i+1, j+1) * 1
                        const X_ = Math.pow(totalSx/8, 2);

                        const totalSy = this.img.get(i-1, j-1) * 1
                                    //   + this.img.get(i  , j-1) * 0
                                      + this.img.get(i+1, j-1) * -1
                                      + this.img.get(i-1, j  ) * 2
                                    //   + this.img.get(i  , j  ) * 0
                                      + this.img.get(i+1, j  ) * -2
                                      + this.img.get(i-1, j+1) * 1
                                    //   + this.img.get(i  , j+1) * 0
                                      + this.img.get(i+1, j+1) * -1

                        const Y_ = Math.pow(totalSy/8, 2);

                        const pixel = Math.sqrt(X_ + Y_);

                        filtered_img.set(i, j, pixel);
                    }
                }

                return filtered_img;
            };

            const laplace = () => {
                let filtered_img = this.img.clone();

                for (let i = 1; i < this.width - 1; i++) {
                    for (let j = 1; j < this.height - 1; j++) {
                        const total = this.img.get(i-1, j-1) * 0
                                    + this.img.get(i  , j-1) * -1
                                    // + this.img.get(i+1, j-1) * 0
                                    + this.img.get(i-1, j  ) * -1
                                    + this.img.get(i  , j  ) * 4
                                    + this.img.get(i+1, j  ) * -1
                                    // + this.img.get(i-1, j+1) * 0
                                    + this.img.get(i  , j+1) * -1
                                    // + this.img.get(i+1, j+1) * 0

                        const pixel = total/4;

                        filtered_img.set(i, j, pixel);
                    }
                }

                return filtered_img;
            };

            const kernels = {
                "box": box,
                "sobel": sobel,
                "laplace": laplace,
            };

            this.img = kernels[this.kernel]();
        },

        apply_xform: function()  {
            // Method to apply affine transform through inverse mapping (incomplete)
            // You may create auxiliary functions/methods if you'd like
        },

        update: function() {
            // Method to process image and present results
            var start = new Date().valueOf();

            if(this.kernel != null) {
                this.apply_kernel(this.bhandler);
            }

            if(this.xform != null) {
                this.apply_xform();
            }

            // Loading HTML elements and saving
            var $transformed = document.getElementById('transformed');
            $transformed.width = this.width; 
            $transformed.height = this.height;
            nj.images.save(this.img, $transformed);
            var duration = new Date().valueOf() - start;
            document.getElementById('duration').textContent = '' + duration;
        }

    } )


    exports.ImageProcesser = ImageProcesser;


})));

