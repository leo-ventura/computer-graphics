function WaveAnimation() {}

Object.assign( WaveAnimation.prototype, {

    init: function() {
        let upperArmTween = new TWEEN.Tween( {theta:0} )
            .to( {theta:Math.PI/2 }, 500)
            .onUpdate(function(){
                // This is an example of rotation of the right_upper_arm 
                // Notice that the transform is M = T * R 
                let right_upper_arm = robot.getObjectByName("right_upper_arm");
                const pivot = {x: 0, y: 2, z:0};
                const {x, y, z} = right_upper_arm.position;
                right_upper_arm.matrix.makeTranslation(0,0,0)
                    .premultiply( new THREE.Matrix4().makeTranslation(-pivot.x, -pivot.y, -pivot.z))
                    .premultiply( new THREE.Matrix4().makeRotationZ(this._object.theta))
                    .premultiply( new THREE.Matrix4().makeTranslation(pivot.x, pivot.y, pivot.z))
                    .premultiply( new THREE.Matrix4().makeTranslation(x, y, z));


                // Updating final world matrix (with parent transforms) - mandatory
                right_upper_arm.updateMatrixWorld(true);
                // Updating screen
                stats.update();
                renderer.render(scene, camera);
            })

        let lowerArmTween = new TWEEN.Tween( {theta:0} )
            .to( {theta:Math.PI/2 }, 500)
            .onUpdate(function(){
                let right_lower_arm = robot.getObjectByName("right_upper_arm")
                    .getObjectByName("lower_arm");

                const pivot = {x: 0, y: 1.5, z:0};
                const {x, y, z} = right_lower_arm.position;
                right_lower_arm.matrix.makeTranslation(0,0,0)
                    .premultiply( new THREE.Matrix4().makeTranslation(-pivot.x, -pivot.y, -pivot.z))
                    .premultiply( new THREE.Matrix4().makeRotationZ(this._object.theta))
                    .premultiply( new THREE.Matrix4().makeTranslation(pivot.x, pivot.y, pivot.z))
                    .premultiply( new THREE.Matrix4().makeTranslation(x, y, z));

                right_lower_arm.updateMatrixWorld(true);
                stats.update();
                renderer.render(scene, camera);
            })

        let handTween = new TWEEN.Tween( {theta:0} )
            .to( {theta:Math.PI/30 }, 300)
            .onUpdate(function(){
                let hand = robot.getObjectByName("right_upper_arm")
                    .getObjectByName("lower_arm").getObjectByName("hand");

                const {x, y, z} = hand.position;
                hand.matrix.makeTranslation(0,0,0)
                    .premultiply( new THREE.Matrix4().makeRotationZ(this._object.theta))
                    .premultiply( new THREE.Matrix4().makeTranslation(x, y, z));

                hand.updateMatrixWorld(true);
                stats.update();
                renderer.render(scene, camera);
            }).repeat(5).yoyo(true);

        let lowerArmTweenReturn = new TWEEN.Tween( {theta:Math.PI/2} )
            .to( {theta:0 }, 500)
            .onUpdate(function(){
                let right_lower_arm = robot.getObjectByName("right_upper_arm")
                    .getObjectByName("lower_arm");

                const pivot = {x: 0, y: 1.5, z:0};
                const {x, y, z} = right_lower_arm.position;
                right_lower_arm.matrix.makeTranslation(0,0,0)
                    .premultiply( new THREE.Matrix4().makeTranslation(-pivot.x, -pivot.y, -pivot.z))
                    .premultiply( new THREE.Matrix4().makeRotationZ(this._object.theta))
                    .premultiply( new THREE.Matrix4().makeTranslation(pivot.x, pivot.y, pivot.z))
                    .premultiply( new THREE.Matrix4().makeTranslation(x, y, z));

                right_lower_arm.updateMatrixWorld(true);
                stats.update();
                renderer.render(scene, camera);
            })

        let upperArmTweenReturn = new TWEEN.Tween( {theta:Math.PI/2} )
            .to( {theta:0 }, 500)
            .onUpdate(function(){
                // This is an example of rotation of the right_upper_arm 
                // Notice that the transform is M = T * R 
                let right_upper_arm = robot.getObjectByName("right_upper_arm");
                const pivot = {x: 0, y: 2, z:0};
                const {x, y, z} = right_upper_arm.position;
                right_upper_arm.matrix.makeTranslation(0,0,0)
                    .premultiply( new THREE.Matrix4().makeTranslation(-pivot.x, -pivot.y, -pivot.z))
                    .premultiply( new THREE.Matrix4().makeRotationZ(this._object.theta))
                    .premultiply( new THREE.Matrix4().makeTranslation(pivot.x, pivot.y, pivot.z))
                    .premultiply( new THREE.Matrix4().makeTranslation(x, y, z));


                // Updating final world matrix (with parent transforms) - mandatory
                right_upper_arm.updateMatrixWorld(true);
                // Updating screen
                stats.update();
                renderer.render(scene, camera);
            })

        upperArmTween.start();
        lowerArmTween.start();
        lowerArmTween.chain(handTween);
        handTween.chain(lowerArmTweenReturn, upperArmTweenReturn);
    },
    animate: function(time) {
        window.requestAnimationFrame(this.animate.bind(this));
        TWEEN.update(time);
    },
    run: function() {
        this.init();
        this.animate(0);
    }
});




