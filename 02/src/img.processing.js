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

                for (let i = 1; i < this.height - 1; i++) {
                    for (let j = 1; j < this.width - 1; j++) {
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

                for (let i = 1; i < this.height - 1; i++) {
                    for (let j = 1; j < this.width - 1; j++) {
                        const totalSx = this.img.get(i-1, j-1) * -1
                                      + this.img.get(i  , j-1) * -2
                                      + this.img.get(i+1, j-1) * -1
                                      + this.img.get(i-1, j+1) *  1
                                      + this.img.get(i  , j+1) *  2
                                      + this.img.get(i+1, j+1) *  1

                        const X_ = Math.pow(totalSx/8, 2);

                        const totalSy = this.img.get(i-1, j-1) *  1
                                      + this.img.get(i+1, j-1) * -1
                                      + this.img.get(i-1, j  ) *  2
                                      + this.img.get(i+1, j  ) * -2
                                      + this.img.get(i-1, j+1) *  1
                                      + this.img.get(i+1, j+1) * -1

                        const Y_ = Math.pow(totalSy/8, 2);

                        const pixel = Math.sqrt(X_ + Y_);

                        filtered_img.set(i, j, pixel);
                    }
                }

                return filtered_img;
            };

            const laplace = (border) => {
                let filtered_img = this.img.clone();

                for (let i = 1; i < this.height - 1; i++) {
                    for (let j = 1; j < this.width - 1; j++) {
                        const total = this.img.get(i  , j-1) * -1
                                    + this.img.get(i-1, j  ) * -1
                                    + this.img.get(i  , j  ) *  4
                                    + this.img.get(i+1, j  ) * -1
                                    + this.img.get(i  , j+1) * -1

                        const pixel = total/4;

                        filtered_img.set(i, j, pixel);
                    }
                }

                return filtered_img;
            };

            const extendImg = () => {
                // Add extended border
                // Add four borders:
                // Top, bottom, left and right
                // First top and bottom, then left and right
                let topArray = [];
                for (let j = 0; j < this.width; j++) {
                    topArray.push(this.img.get(0, j));
                }
                topArray = nj.array(topArray);

                let bottomArray = [];
                for (let j = 0; j < this.width; j++) {
                    bottomArray.push(this.img.get(this.height-1, j));
                }
                bottomArray = nj.array(bottomArray);

                let leftArray = [this.img.get(0,0)];
                for (let i = 0; i < this.height; i++) {
                    leftArray.push(this.img.get(i, 0));
                }
                leftArray.push(this.img.get(this.height-1, 0));
                leftArray = nj.array(leftArray);

                let rightArray = [this.img.get(0,this.width-1)];
                for (let i = 0; i < this.height; i++) {
                    rightArray.push(this.img.get(i, this.width-1));
                }
                rightArray.push(this.img.get(this.height-1, this.width-1));
                rightArray = nj.array(rightArray);

                let extendedImg = nj.concatenate(topArray.reshape(1,this.width).T, this.img.T).T;
                extendedImg = nj.concatenate(extendedImg.T, bottomArray.reshape(this.width, 1)).T;
                extendedImg = nj.concatenate(leftArray.reshape(this.height+2, 1), extendedImg);
                extendedImg = nj.concatenate(extendedImg, rightArray.reshape(this.height+2, 1));

                this.width += 2;
                this.height += 2;
                this.img = extendedImg;
            };

            const undoExtension = () => {
                this.img = this.img.slice(1,1);
                this.img = this.img.slice([null, -1], [null,-1]);
                this.width -= 2;
                this.height -= 2;
            }

            const kernels = {
                "box": box,
                "sobel": sobel,
                "laplace": laplace,
            };

            if (border === 'extend') {
                extendImg();
                this.img = kernels[this.kernel]();
                undoExtension();
            } else {
                this.img = kernels[this.kernel]();
            }

        },

        apply_xform: function()  {
            // Method to apply affine transform through inverse mapping (incomplete)
            // You may create auxiliary functions/methods if you'd like
            const applyXForm = (x, y, xform) => {
                const vertice = nj.array([x, y, 1]);
                const tVertice = nj.dot(xform, vertice);
                return [tVertice.get(0), tVertice.get(1)];
            };

            const matrixInverse = (xform) => {
                let invXform = nj.arange(9).reshape(3,3);
                const det = xform.get(0,0) * (
                                xform.get(1,1) * xform.get(2,2) - xform.get(2,1) * xform.get(1,2))
                          - xform.get(0,1) * (
                                xform.get(1,0) * xform.get(2,2) - xform.get(1,2) * xform.get(2,0))
                          + xform.get(0,2) * (
                                xform.get(1,0) * xform.get(2,1) - xform.get(1,1) * xform.get(2,0));

                const detInv = 1/det;

                invXform.set(0,0, xform.get(1,1) * xform.get(2,2) - xform.get(2,1) * xform.get(1,2));
                invXform.set(0,1, xform.get(0,2) * xform.get(2,1) - xform.get(0,1) * xform.get(2,2));
                invXform.set(0,2, xform.get(0,1) * xform.get(1,2) - xform.get(0,2) * xform.get(1,1));
                invXform.set(1,0, xform.get(1,2) * xform.get(2,0) - xform.get(1,0) * xform.get(2,2));
                invXform.set(1,1, xform.get(0,0) * xform.get(2,2) - xform.get(0,2) * xform.get(2,0));
                invXform.set(1,2, xform.get(1,0) * xform.get(0,2) - xform.get(0,0) * xform.get(1,2));
                invXform.set(2,0, xform.get(1,0) * xform.get(2,1) - xform.get(2,0) * xform.get(1,1));
                invXform.set(2,1, xform.get(2,0) * xform.get(0,1) - xform.get(0,0) * xform.get(2,1));
                invXform.set(2,2, xform.get(0,0) * xform.get(1,1) - xform.get(1,0) * xform.get(0,1));

                return invXform.multiply(detInv);
            };

            const inversedXForm = matrixInverse(this.xform);
            console.log(inversedXForm);

            let transformedImg = this.img.clone();
            for (let i = 0; i < this.height; i++) {
                for (let j = 0; j < this.width; j++) {
                    const [u, v] = applyXForm(i, j, inversedXForm);

                    // Should we use Math.round or change it to better resampling technique?
                    const pixel = this.img.get(Math.round(u), Math.round(v));
                    transformedImg.set(i, j, pixel);
                }
            }
            this.img = transformedImg;
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

