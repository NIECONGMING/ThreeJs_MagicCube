import * as THREE from '/build/three.module.js';
import * as dat from '/dat.gui';
import { OrbitControls } from '/jsm/controls/OrbitControls';
import { MagicBoxGeometry } from "./magic/MagicBoxGeometry";
import { CubeUntils } from "./CubeUntils";
export class MagicSquare {
    constructor() {
        this._isRotating = false;
        this._initStatus = []; //魔方初始状态
        this.checkProperty();
        this.init();
        console.log('MagicCube inited');
    }
    checkProperty() {
        this._camera = null;
        this._scene = null;
        this._light = null;
        this._renderer = null;
        this._width = 0; //页面宽度
        this._height = 0; //页面高度
        this._origPoint = null;
        this._isRotating = false;
        this._intersect = null; //碰撞光线穿过的元素
        this._normalize = null; //触发平面法向量
        this._startPoint = null; //触发点
        this._movePoint = null;
        this._initStatus = []; //魔方初始状态
        this._intersectObjectIndex = 0;
        this._raycaster = new THREE.Raycaster(); //光线碰撞检测器
        this._mouse = new THREE.Vector2();
        this._origPoint = new THREE.Vector3(0, 0, 0);
        this._color = new THREE.Color("#000000");
    }
    init() {
        console.log('magic Client!!!!!!!!!!!');
        this.initThree();
        this.initCamera(this._width, this._height);
        this.initScene();
        this.initLight(this._scene);
        this.initObject(this._scene);
        this.render();
        this.initPlane();
        //视角控制
        this._controller = new OrbitControls(this._camera, this._renderer.domElement);
        this._controller.target = this._origPoint;
        this.startCube = this.startCube.bind(this);
        this.moveCube = this.moveCube.bind(this);
        this.stopCube = this.stopCube.bind(this);
        //监听鼠标事件
        this._renderer.domElement.addEventListener('mousedown', this.startCube, false);
        this._renderer.domElement.addEventListener('mousemove', this.moveCube, false);
        this._renderer.domElement.addEventListener('mouseup', this.stopCube, false);
        //监听触摸事件
        this._renderer.domElement.addEventListener('touchstart', this.startCube, false);
        this._renderer.domElement.addEventListener('touchmove', this.moveCube, false);
        this._renderer.domElement.addEventListener('touchend', this.stopCube, false);
        window.addEventListener('resize', this.resize.bind(this), true);
    }
    initCamera(width, height) {
        this._camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
        this._camera.position.set(0, 0, 600);
        this._camera.up.set(0, 1, 0); //正方向
        this._camera.lookAt(this._origPoint);
    }
    initThree() {
        console.log(document);
        this._width = window.innerWidth;
        this._height = window.innerHeight;
        this._renderer = new THREE.WebGLRenderer({ antialias: true });
        this._renderer.setSize(this._width, this._height);
        this._renderer.setClearColor(0xFFFFFF, 1.0);
        document.body.appendChild(this._renderer.domElement);
    }
    initScene() {
        this._scene = new THREE.Scene();
        this._color.set('#c0c0c0');
        this._scene.background = this._color;
    }
    initLight(scene) {
        this._light = new THREE.AmbientLight();
        scene.add(this._light);
        this._dirLight = new THREE.DirectionalLight();
        this._dirLight.position.set(150, 200, 200);
        this._scene.add(this._dirLight);
    }
    initObject(scene) {
        this._cubes = this.simpleCube(MagicSquare.CubeParams.x, MagicSquare.CubeParams.y, MagicSquare.CubeParams.z, MagicSquare.CubeParams.num, MagicSquare.CubeParams.len, MagicSquare.CubeParams.color);
        for (let i = 0; i < this._cubes.length; i++) {
            let item = this._cubes[i];
            this._initStatus.push({
                x: item.position.x,
                y: item.position.y,
                z: item.position.z,
                cubeIndex: item.id
            });
            scene.add(this._cubes[i]);
            item['cubeIndex'] = item.id;
        }
        // //透明正方体
        let cubegeo = new MagicBoxGeometry(150, 150, 150);
        var hex = 0x000000;
        for (let i = 0; i < cubegeo.faces.length; i += 2) {
            cubegeo.faces[i].color.setHex(hex);
            cubegeo.faces[i + 1].color.setHex(hex);
        }
        var cubemat = new THREE.MeshBasicMaterial({ vertexColors: true, opacity: 0, transparent: true });
        let cube = new THREE.Mesh(cubegeo, cubemat);
        cube['cubeType'] = 'coverCube';
        scene.add(cube);
    }
    switchShadow(bswitch = true) {
        //开启阴影条件
        //1.材质要满足足够对光有反应
        //2.设置渲染器开启阴影的计算 render.shadowMap.enabled = true;
        //3.设置光照投射阴影 directionlLight.castshaow = true;
        //4.设置物体投射阴影 sphere.castshadow = true;
        //5.设置物体接收阴影 plane.receiceshadow = true;
        this._dirLight.castShadow = bswitch;
        this._renderer.shadowMap.enabled = bswitch;
        this._plane.receiveShadow = bswitch;
        for (let i = 0; i < this._cubes.length; i++) {
            this._cubes[0].castShadow = bswitch;
        }
        // this._cubes[0].castShadow = true;
        // directionlLight.castshaow = true;
    }
    initPlane() {
        //材质
        let standMaterial = new THREE.MeshStandardMaterial({ color: "#56005D" });
        //添加平面
        this._plane = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), standMaterial);
        this._plane.position.set(0, -90, 0);
        this._plane.rotation.set(1.57, 0, 0);
        this._scene.add(this._plane);
        standMaterial.side = THREE.DoubleSide;
        let num = {
            x: 5,
            isOpenAmlight: true,
            isopenDirLight: true,
            dirLightIntensity: 100
        };
        let _gui = new dat.GUI();
        _gui.addColor({ color: "#3e3e3e" }, "color")
            .name('改变背景色')
            .onChange((val) => {
            this._color.set(val);
            this._scene.background = this._color;
        });
        _gui.add(num, "isOpenAmlight")
            .name('开关环境光')
            .onChange((val) => {
            this._light.visible = val;
        });
        _gui.add(num, "isopenDirLight")
            .name('开关太阳光')
            .onChange((val) => {
            this._dirLight.visible = val;
        });
        _gui.add(num, "dirLightIntensity")
            .min(0)
            .max(100)
            .step(2)
            .name('设置太阳光亮度')
            .onChange((val) => {
            if (this._dirLight.visible) {
                this._dirLight.intensity = val;
            }
        });
        _gui.add(num, "x")
            .min(-50)
            .max(50)
            .step(0.01)
            .name('改变太阳光x轴')
            .onChange((vall) => {
            console.log('值被修改', vall);
            this._dirLight.position.x = vall;
        });
        console.log(_gui);
    }
    render() {
        this._renderer.render(this._scene, this._camera);
        window.requestAnimationFrame(this.render.bind(this));
    }
    simpleCube(x, y, z, num, len, colors) {
        let leftUpX = x - num / 2 * len;
        let leftUpY = y + num / 2 * len;
        let leftUpz = z + num / 2 * len;
        let materialArr = [];
        for (let i = 0; i < colors.length; i++) {
            let texture = new THREE.Texture(this.faces(colors[i]));
            texture.needsUpdate = true;
            let material = new THREE.MeshLambertMaterial({ map: texture });
            materialArr.push(material);
        }
        let cubes = [];
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < num * num; j++) {
                let cubeEgo = new MagicBoxGeometry(len, len, len);
                let cube = new THREE.Mesh(cubeEgo, materialArr);
                cube.position.x = (leftUpX + len / 2) + (j % num) * len;
                cube.position.y = (leftUpY - len / 2) - parseInt((j / num).toString(), 16) * len;
                cube.position.z = (leftUpz - len / 2) - i * len;
                cubes.push(cube);
            }
        }
        return cubes;
    }
    faces(color) {
        let canvas = CubeUntils.createCanvasByColor(256, 256, color);
        return canvas;
    }
    startCube(event) {
        this.getIntersects(event);
        //魔方没有处于转动过程中且存在碰撞物体
        if (!this._isRotating && this._intersect) {
            this._startPoint = this._intersect.point; //开始转动，设置起始点
            this._controller.enabled = false; //当刚开始的接触点在魔方上时操作为转动魔方，屏蔽控制器转动
        }
        else {
            this._controller.enabled = true; //当刚开始的接触点没有在魔方上或者在魔方上但是魔方正在转动时操作转动控制器
        }
    }
    moveCube(event) {
        this.getIntersects(event);
        if (this._intersect) {
            if (!this._isRotating && this._startPoint) { //魔方没有进行转动且满足进行转动的条件
                this._movePoint = this._intersect.point;
                if (!this._movePoint.equals(this._startPoint)) { //和起始点不一样则意味着可以得到转动向量了
                    this._isRotating = true; //转动标识置为true
                    let sub = this._movePoint.sub(this._startPoint); //计算转动向量
                    let direction = this.getDirection(sub); //获得方向
                    let elements = this.getBoxs(this._intersect, direction);
                    let startTime = new Date().getTime();
                    window.requestAnimationFrame(function (timestamp) {
                        this.rotateAnimation(elements, direction, timestamp, 0);
                    }.bind(this));
                }
            }
        }
        event.preventDefault();
    }
    stopCube(event) {
        this._intersect = null;
        this._startPoint = null;
    }
    //获取操作焦点以及该焦点所在平面的法向量
    getIntersects(event) {
        {
            this._mouse.x = (event.clientX / this._width) * 2 - 1;
            this._mouse.y = -(event.clientY / this._height) * 2 + 1;
        }
        this._raycaster.setFromCamera(this._mouse, this._camera);
        //Raycaster方式定位选取元素，可能会选取多个，以第一个为准
        let intersects = this._raycaster.intersectObjects(this._scene.children);
        if (intersects.length) {
            try {
                if (intersects[0].object.cubeType === 'coverCube') {
                    this._intersect = intersects[1];
                    this._normalize = intersects[0].face.normal;
                }
                else {
                    this._intersect = intersects[0];
                    this._normalize = intersects[1].face.normal;
                }
                for (let i = 0; i < this._scene.children.length; i++) {
                    let child = this._scene.children[i];
                    if (this._intersect.object.id == child.id) {
                        this._intersectObjectIndex = i;
                        break;
                    }
                }
            }
            catch (err) {
                //nothing
                console.warn('MagicClient ', err);
            }
        }
    }
    //获得旋转方向
    getDirection(vector3) {
        let direction;
        //判断差向量和x、y、z轴的夹角
        let xAngle = vector3.angleTo(CubeUntils.xLine);
        let xAngleAd = vector3.angleTo(CubeUntils.xLineAd);
        let yAngle = vector3.angleTo(CubeUntils.yLine);
        let yAngleAd = vector3.angleTo(CubeUntils.yLineAd);
        let zAngle = vector3.angleTo(CubeUntils.zLine);
        let zAngleAd = vector3.angleTo(CubeUntils.zLineAd);
        let minAngle = CubeUntils.min([xAngle, xAngleAd, yAngle, yAngleAd, zAngle, zAngleAd]); //最小夹角
        switch (minAngle) {
            case xAngle:
                direction = 0; //向x轴正方向旋转90度（还要区分是绕z轴还是绕y轴）
                if (this._normalize.equals(CubeUntils.yLine)) {
                    direction = direction + 0.1; //绕z轴顺时针
                }
                else if (this._normalize.equals(CubeUntils.yLineAd)) {
                    direction = direction + 0.2; //绕z轴逆时针
                }
                else if (this._normalize.equals(CubeUntils.zLine)) {
                    direction = direction + 0.3; //绕y轴逆时针
                }
                else {
                    direction = direction + 0.4; //绕y轴顺时针
                }
                break;
            case xAngleAd:
                direction = 1; //向x轴反方向旋转90度
                if (this._normalize.equals(CubeUntils.yLine)) {
                    direction = direction + 0.1; //绕z轴逆时针
                }
                else if (this._normalize.equals(CubeUntils.yLineAd)) {
                    direction = direction + 0.2; //绕z轴顺时针
                }
                else if (this._normalize.equals(CubeUntils.zLine)) {
                    direction = direction + 0.3; //绕y轴顺时针
                }
                else {
                    direction = direction + 0.4; //绕y轴逆时针
                }
                break;
            case yAngle:
                direction = 2; //向y轴正方向旋转90度
                if (this._normalize.equals(CubeUntils.zLine)) {
                    direction = direction + 0.1; //绕x轴逆时针
                }
                else if (this._normalize.equals(CubeUntils.zLineAd)) {
                    direction = direction + 0.2; //绕x轴顺时针
                }
                else if (this._normalize.equals(CubeUntils.xLine)) {
                    direction = direction + 0.3; //绕z轴逆时针
                }
                else {
                    direction = direction + 0.4; //绕z轴顺时针
                }
                break;
            case yAngleAd:
                direction = 3; //向y轴反方向旋转90度
                if (this._normalize.equals(CubeUntils.zLine)) {
                    direction = direction + 0.1; //绕x轴顺时针
                }
                else if (this._normalize.equals(CubeUntils.zLineAd)) {
                    direction = direction + 0.2; //绕x轴逆时针
                }
                else if (this._normalize.equals(CubeUntils.xLine)) {
                    direction = direction + 0.3; //绕z轴顺时针
                }
                else {
                    direction = direction + 0.4; //绕z轴逆时针
                }
                break;
            case zAngle:
                direction = 4; //向z轴正方向旋转90度
                if (this._normalize.equals(CubeUntils.yLine)) {
                    direction = direction + 0.1; //绕x轴顺时针
                }
                else if (this._normalize.equals(CubeUntils.yLineAd)) {
                    direction = direction + 0.2; //绕x轴逆时针
                }
                else if (this._normalize.equals(CubeUntils.xLine)) {
                    direction = direction + 0.3; //绕y轴顺时针
                }
                else {
                    direction = direction + 0.4; //绕y轴逆时针
                }
                break;
            case zAngleAd:
                direction = 5; //向z轴反方向旋转90度
                if (this._normalize.equals(CubeUntils.yLine)) {
                    direction = direction + 0.1; //绕x轴逆时针
                }
                else if (this._normalize.equals(CubeUntils.yLineAd)) {
                    direction = direction + 0.2; //绕x轴顺时针
                }
                else if (this._normalize.equals(CubeUntils.xLine)) {
                    direction = direction + 0.3; //绕y轴逆时针
                }
                else {
                    direction = direction + 0.4; //绕y轴顺时针
                }
                break;
            default:
                break;
        }
        return direction;
    }
    //根据方向获得运动元素
    getBoxs(target, direction) {
        let cubeIndex = this._intersectObjectIndex;
        var targetId = target.object.cubeIndex;
        var ids = [];
        for (var i = 0; i < this._cubes.length; i++) {
            ids.push(this._cubes[i]['cubeIndex']);
        }
        var minId = CubeUntils.min(ids);
        targetId = targetId - minId;
        var numI = parseInt((targetId / 9).toString());
        var numJ = targetId % 9;
        var boxs = [];
        //根据绘制时的规律判断 no = i*9+j
        switch (direction) {
            //绕z轴
            case 0.1:
            case 0.2:
            case 1.1:
            case 1.2:
            case 2.3:
            case 2.4:
            case 3.3:
            case 3.4:
                for (var i = 0; i < this._cubes.length; i++) {
                    var tempId = this._cubes[i]['cubeIndex'] - minId;
                    if (numI === parseInt((tempId / 9).toString())) {
                        boxs.push(this._cubes[i]);
                    }
                }
                break;
            //绕y轴
            case 0.3:
            case 0.4:
            case 1.3:
            case 1.4:
            case 4.3:
            case 4.4:
            case 5.3:
            case 5.4:
                for (var i = 0; i < this._cubes.length; i++) {
                    var tempId = this._cubes[i]["cubeIndex"] - minId;
                    if (parseInt((numJ / 3).toString()) === parseInt((tempId % 9 / 3).toString())) {
                        boxs.push(this._cubes[i]);
                    }
                }
                break;
            //绕x轴
            case 2.1:
            case 2.2:
            case 3.1:
            case 3.2:
            case 4.1:
            case 4.2:
            case 5.1:
            case 5.2:
                for (var i = 0; i < this._cubes.length; i++) {
                    var tempId = this._cubes[i]["cubeIndex"] - minId;
                    if (tempId % 9 % 3 === numJ % 3) {
                        boxs.push(this._cubes[i]);
                    }
                }
                break;
            default:
                break;
        }
        return boxs;
    }
    //更新位置索引
    updateCubeIndex(elements) {
        for (var i = 0; i < elements.length; i++) {
            var temp1 = elements[i];
            for (var j = 0; j < this._initStatus.length; j++) {
                var temp2 = this._initStatus[j];
                if (Math.abs(temp1.position.x - temp2.x) <= MagicSquare.CubeParams.len / 2 &&
                    Math.abs(temp1.position.y - temp2.y) <= MagicSquare.CubeParams.len / 2 &&
                    Math.abs(temp1.position.z - temp2.z) <= MagicSquare.CubeParams.len / 2) {
                    temp1.cubeIndex = temp2.cubeIndex;
                    break;
                }
            }
        }
    }
    /**
         * 旋转动画
         */
    rotateAnimation(elements, direction, currentstamp, startstamp, laststamp) {
        let totalTime = 500; //转动的总运动时间
        if (startstamp === 0) {
            startstamp = currentstamp;
            laststamp = currentstamp;
        }
        if (currentstamp - startstamp >= totalTime) {
            currentstamp = startstamp + totalTime;
            this._isRotating = false;
            this._startPoint = null;
            this.updateCubeIndex(elements);
        }
        switch (direction) {
            //绕z轴顺时针
            case 0.1:
            case 1.2:
            case 2.4:
            case 3.3:
                for (var i = 0; i < elements.length; i++) {
                    this.rotateAroundWorldZ(elements[i], -90 * Math.PI / 180 * (currentstamp - laststamp) / totalTime);
                }
                break;
            //绕z轴逆时针
            case 0.2:
            case 1.1:
            case 2.3:
            case 3.4:
                for (var i = 0; i < elements.length; i++) {
                    this.rotateAroundWorldZ(elements[i], 90 * Math.PI / 180 * (currentstamp - laststamp) / totalTime);
                }
                break;
            //绕y轴顺时针
            case 0.4:
            case 1.3:
            case 4.3:
            case 5.4:
                for (var i = 0; i < elements.length; i++) {
                    this.rotateAroundWorldY(elements[i], -90 * Math.PI / 180 * (currentstamp - laststamp) / totalTime);
                }
                break;
            //绕y轴逆时针
            case 1.4:
            case 0.3:
            case 4.4:
            case 5.3:
                for (var i = 0; i < elements.length; i++) {
                    this.rotateAroundWorldY(elements[i], 90 * Math.PI / 180 * (currentstamp - laststamp) / totalTime);
                }
                break;
            //绕x轴顺时针
            case 2.2:
            case 3.1:
            case 4.1:
            case 5.2:
                for (var i = 0; i < elements.length; i++) {
                    this.rotateAroundWorldX(elements[i], 90 * Math.PI / 180 * (currentstamp - laststamp) / totalTime);
                }
                break;
            //绕x轴逆时针
            case 2.1:
            case 3.2:
            case 4.2:
            case 5.1:
                for (var i = 0; i < elements.length; i++) {
                    this.rotateAroundWorldX(elements[i], -90 * Math.PI / 180 * (currentstamp - laststamp) / totalTime);
                }
                break;
            default:
                break;
        }
        // if(currentstamp-startstamp<totalTime)
        // {
        //     window.requestAnimationFrame(this.rotateAnimation.bind(this));
        // }
        if (currentstamp - startstamp < totalTime) {
            window.requestAnimationFrame(function (timestamp) {
                this.rotateAnimation(elements, direction, timestamp, startstamp, currentstamp);
            }.bind(this));
        }
    }
    //绕着世界坐标系的某个轴旋转
    rotateAroundWorldY(obj, rad) {
        var x0 = obj.position.x;
        var z0 = obj.position.z;
        /**
         * 因为物体本身的坐标系是随着物体的变化而变化的，
         * 所以如果使用rotateZ、rotateY、rotateX等方法，
         * 多次调用后就会出问题，先改为Quaternion实现。
         */
        var q = new THREE.Quaternion();
        q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rad);
        obj.quaternion.premultiply(q);
        //obj.rotateY(rad);
        obj.position.x = Math.cos(rad) * x0 + Math.sin(rad) * z0;
        obj.position.z = Math.cos(rad) * z0 - Math.sin(rad) * x0;
    }
    rotateAroundWorldZ(obj, rad) {
        var x0 = obj.position.x;
        var y0 = obj.position.y;
        var q = new THREE.Quaternion();
        q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), rad);
        obj.quaternion.premultiply(q);
        //obj.rotateZ(rad);
        obj.position.x = Math.cos(rad) * x0 - Math.sin(rad) * y0;
        obj.position.y = Math.cos(rad) * y0 + Math.sin(rad) * x0;
    }
    rotateAroundWorldX(obj, rad) {
        var y0 = obj.position.y;
        var z0 = obj.position.z;
        var q = new THREE.Quaternion();
        q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), rad);
        obj.quaternion.premultiply(q);
        //obj.rotateX(rad);
        obj.position.y = Math.cos(rad) * y0 - Math.sin(rad) * z0;
        obj.position.z = Math.cos(rad) * z0 + Math.sin(rad) * y0;
    }
    resize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        //更新矩阵
        this._camera.updateProjectionMatrix();
        //更新渲染器
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        //设置渲染器的像素比
        this._renderer.setPixelRatio(window.devicePixelRatio);
    }
}
MagicSquare.CubeParams = {
    x: 0,
    y: 0,
    z: 0,
    num: 3,
    len: 50,
    color: ['rgba(255,193,37,1)', 'rgba(0,191,255,1)',
        'rgba(50,205,50,1)', 'rgba(178,34,34,1)',
        'rgba(255,255,0,1)', 'rgba(255,255,255,1)']
};
