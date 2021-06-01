function AirSquat() {}

Object.assign(AirSquat.prototype, {
  init: function () {
    let upperLeftLegTween = new TWEEN.Tween({ theta: 0 })
      .to({ theta: Math.PI / 4 }, 500)
      .onUpdate(function () {
        let left_upper_leg = robot.getObjectByName("left_upper_leg");
        const pivot = { x: 0, y: -2, z: 0 };
        const { x, y, z } = left_upper_leg.position;
        left_upper_leg.matrix
          .makeTranslation(0, 0, 0)
          .premultiply(
            new THREE.Matrix4().makeTranslation(pivot.x, pivot.y, pivot.z)
          )
          .premultiply(new THREE.Matrix4().makeRotationZ(-this._object.theta))
          .premultiply(
            new THREE.Matrix4().makeTranslation(-pivot.x, -pivot.y, -pivot.z)
          )
          .premultiply(new THREE.Matrix4().makeTranslation(x, y, z));

        left_upper_leg.updateMatrixWorld(true);
        stats.update();
        renderer.render(scene, camera);
      }).repeat(5).yoyo(true);

    let lowerLeftLegTween = new TWEEN.Tween({ theta: 0 })
      .to({ theta: Math.PI / 4 }, 500)
      .onUpdate(function () {
        let left_lower_arm = robot
          .getObjectByName("left_upper_leg")
          .getObjectByName("lower_leg");

        const pivot = { x: 0, y: 1.5, z: 0 };
        const { x, y, z } = left_lower_arm.position;
        left_lower_arm.matrix
          .makeTranslation(0, 0, 0)
          .premultiply(
            new THREE.Matrix4().makeTranslation(-pivot.x, -pivot.y, -pivot.z)
          )
          .premultiply(new THREE.Matrix4().makeRotationZ(this._object.theta))
          .premultiply(
            new THREE.Matrix4().makeTranslation(pivot.x, pivot.y, pivot.z)
          )
          .premultiply(new THREE.Matrix4().makeTranslation(x, y, z));

        left_lower_arm.updateMatrixWorld(true);
        stats.update();
        renderer.render(scene, camera);
      }).repeat(5).yoyo(true);

    let upperRightLegTween = new TWEEN.Tween({ theta: 0 })
      .to({ theta: Math.PI / 4 }, 500)
      .onUpdate(function () {
        let right_upper_leg = robot.getObjectByName("right_upper_leg");
        const pivot = { x: 0, y: -2, z: 0 };
        const { x, y, z } = right_upper_leg.position;
        right_upper_leg.matrix
          .makeTranslation(0, 0, 0)
          .premultiply(
            new THREE.Matrix4().makeTranslation(pivot.x, pivot.y, pivot.z)
          )
          .premultiply(new THREE.Matrix4().makeRotationZ(this._object.theta))
          .premultiply(
            new THREE.Matrix4().makeTranslation(-pivot.x, -pivot.y, -pivot.z)
          )
          .premultiply(new THREE.Matrix4().makeTranslation(x, y, z));

        right_upper_leg.updateMatrixWorld(true);
        stats.update();
        renderer.render(scene, camera);
      }).repeat(5).yoyo(true);

    let lowerRightLegTween = new TWEEN.Tween({ theta: 0 })
      .to({ theta: Math.PI / 4 }, 500)
      .onUpdate(function () {
        let right_lower_arm = robot
          .getObjectByName("right_upper_leg")
          .getObjectByName("lower_leg");

        const pivot = { x: 0, y: 1.5, z: 0 };
        const { x, y, z } = right_lower_arm.position;
        right_lower_arm.matrix
          .makeTranslation(0, 0, 0)
          .premultiply(
            new THREE.Matrix4().makeTranslation(-pivot.x, -pivot.y, -pivot.z)
          )
          .premultiply(new THREE.Matrix4().makeRotationZ(-this._object.theta))
          .premultiply(
            new THREE.Matrix4().makeTranslation(pivot.x, pivot.y, pivot.z)
          )
          .premultiply(new THREE.Matrix4().makeTranslation(x, y, z));

        right_lower_arm.updateMatrixWorld(true);
        stats.update();
        renderer.render(scene, camera);
      }).repeat(5).yoyo(true);

    let upperRightArmTween = new TWEEN.Tween({ theta: 0 })
      .to({ theta: Math.PI/2 }, 500)
      .onUpdate(function () {
        let right_upper_arm = robot.getObjectByName("right_upper_arm");
        const pivot = { x: 0, y: 2, z: 0 };
        const { x, y, z } = right_upper_arm.position;
        right_upper_arm.matrix
          .makeTranslation(0, 0, 0)
          .premultiply(
            new THREE.Matrix4().makeTranslation(-pivot.x, -pivot.y, -pivot.z)
          )
          .premultiply(new THREE.Matrix4().makeRotationZ(this._object.theta))
          .premultiply(
            new THREE.Matrix4().makeTranslation(pivot.x, pivot.y, pivot.z)
          )
          .premultiply(new THREE.Matrix4().makeTranslation(x, y, z));

        right_upper_arm.updateMatrixWorld(true);
        stats.update();
        renderer.render(scene, camera);
      }).repeat(5).yoyo(true);
    
      let upperLeftArmTween = new TWEEN.Tween({ theta: 0 })
      .to({ theta: Math.PI/2 }, 500)
      .onUpdate(function () {
        let left_upper_arm = robot.getObjectByName("left_upper_arm");
        const pivot = { x: 0, y: 2, z: 0 };
        const { x, y, z } = left_upper_arm.position;
        left_upper_arm.matrix
          .makeTranslation(0, 0, 0)
          .premultiply(
            new THREE.Matrix4().makeTranslation(-pivot.x, -pivot.y, -pivot.z)
          )
          .premultiply(new THREE.Matrix4().makeRotationZ(-this._object.theta))
          .premultiply(
            new THREE.Matrix4().makeTranslation(pivot.x, pivot.y, pivot.z)
          )
          .premultiply(new THREE.Matrix4().makeTranslation(x, y, z));

        left_upper_arm.updateMatrixWorld(true);
        stats.update();
        renderer.render(scene, camera);
      }).repeat(5).yoyo(true);

    upperLeftLegTween.start();
    lowerLeftLegTween.start();
    upperRightLegTween.start();
    lowerRightLegTween.start();
    upperLeftArmTween.start();
    upperRightArmTween.start();
  },
  animate: function (time) {
    window.requestAnimationFrame(this.animate.bind(this));
    TWEEN.update(time);
  },
  run: function () {
    this.init();
    this.animate(0);
  },
});
