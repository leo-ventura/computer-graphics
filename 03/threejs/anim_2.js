function YMCA(key) {this.key = key;}

Object.assign( YMCA.prototype, {
    init: async function() {
        const MOVEMENT_DELAY = 1000;

        const armMovement = (initial_theta, final_theta, arm, pivot={x:0, y:2, z:0}) => {
            return new TWEEN.Tween( {theta:initial_theta} )
            .to( {theta:final_theta }, 500)
                .onUpdate(function(){
                    const {x, y, z} = arm.position;
                    arm.matrix.makeTranslation(0,0,0)
                        .premultiply( new THREE.Matrix4().makeTranslation(-pivot.x, -pivot.y, -pivot.z))
                        .premultiply( new THREE.Matrix4().makeRotationZ(this._object.theta))
                        .premultiply( new THREE.Matrix4().makeTranslation(pivot.x, pivot.y, pivot.z))
                        .premultiply( new THREE.Matrix4().makeTranslation(x, y, z));

                    arm.updateMatrixWorld(true);
                    stats.update();
                    renderer.render(scene, camera);
                })
        };

        const executeMovement = (tween) => {
            tween.rightArm.start();
            tween.leftArm.start();
            tween.rightLowerArm.start();
            tween.leftLowerArm.start();
            tween.rightArmReturn.delay(MOVEMENT_DELAY);
            tween.leftArmReturn.delay(MOVEMENT_DELAY);
            tween.rightLowerArmReturn.delay(MOVEMENT_DELAY);
            tween.leftLowerArmReturn.delay(MOVEMENT_DELAY);
            tween.rightArm.chain(tween.rightArmReturn, tween.rightLowerArmReturn);
            tween.leftArm.chain(tween.leftArmReturn, tween.leftLowerArmReturn);
        };

        const asymmetricArmMovement = (right_angle, left_angle, right_arm, left_arm) => {
            const rightArm = armMovement(0, right_angle, right_arm);
            const leftArm = armMovement(0, left_angle, left_arm);
            const rightArmReturn = armMovement(right_angle, 0, right_arm);
            const leftArmReturn = armMovement(left_angle, 0, left_arm);
            return {
                rightArm,
                leftArm,
                rightArmReturn,
                leftArmReturn,
            };
        };

        const symmetricArmMovement = (angle, right_arm, left_arm) => {
            const arm = asymmetricArmMovement(angle, -angle, right_arm, left_arm);
            return {
                ...arm
            };
        };

        const symmetricLowerArmMovement = (angle, right_arm, left_arm) => {
            const lower = symmetricArmMovement(angle, right_arm, left_arm);
            return {
                rightLowerArm: lower.rightArm,
                leftLowerArm: lower.leftArm,
                rightLowerArmReturn: lower.rightArmReturn,
                leftLowerArmReturn: lower.leftArmReturn,
            };
        };

        const yMovement = () => {
            const angle = Math.PI*3/4;
            const arm = symmetricArmMovement(angle, right_arm, left_arm);
            const lowerArm = symmetricLowerArmMovement(0, right_lower_arm, left_lower_arm);

            return {
                ...arm,
                ...lowerArm,
            };
        };

        const mMovement = () => {
            const upper_angle = Math.PI*3/4;
            const arm = symmetricArmMovement(upper_angle, right_arm, left_arm);

            const lower_angle = -Math.PI/2;
            const lowerArm = symmetricLowerArmMovement(lower_angle, right_lower_arm, left_lower_arm);

            return {
                ...arm,
                ...lowerArm,
            };
        }

        const cMovement = () => {
            const left_upper_angle = Math.PI/4;
            const right_upper_angle = Math.PI/2
            const arm = asymmetricArmMovement(right_upper_angle, left_upper_angle,
                right_arm, left_arm);

            const lower_angle = -Math.PI/8;
            const lowerArm = symmetricLowerArmMovement(lower_angle, right_lower_arm, left_lower_arm);

            return {
                ...arm,
                ...lowerArm,
            };
        }

        const aMovement = () => {
            const upper_angle = Math.PI*3/4;
            const arm = symmetricArmMovement(upper_angle, right_arm, left_arm);

            const lower_angle = Math.PI/2;
            const lowerArm = symmetricLowerArmMovement(lower_angle, right_lower_arm, left_lower_arm);

            return {
                ...arm,
                ...lowerArm,
            };
        }

        const right_arm = robot.getObjectByName("right_upper_arm");
        const right_lower_arm = right_arm.getObjectByName("lower_arm");
        const left_arm = robot.getObjectByName("left_upper_arm");
        const left_lower_arm = left_arm.getObjectByName("lower_arm");

        switch(this.key) {
            case 'y':
                executeMovement(yMovement());
                break;
            case 'm':
                executeMovement(mMovement());
                break;
            case 'c':
                executeMovement(cMovement());
                break;
            case 'a':
                executeMovement(aMovement());
                break;
            case '2':
                // [ref]: https://stackoverflow.com/a/39914235
                // Javascript eu te odeio por nao ter `sleep`
                executeMovement(yMovement());
                await new Promise(r => setTimeout(r, 2*MOVEMENT_DELAY));
                executeMovement(mMovement());
                await new Promise(r => setTimeout(r, 2*MOVEMENT_DELAY));
                executeMovement(cMovement());
                await new Promise(r => setTimeout(r, 2*MOVEMENT_DELAY));
                executeMovement(aMovement());
                break;
        }
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
