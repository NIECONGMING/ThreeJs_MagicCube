import * as THREE from '/build/three.module.js' 
import { OrbitControls } from '/jsm/controls/OrbitControls'
import { WebGLRenderer } from './magic/webGLRender'
import { BufferBigEndian } from './unicodeText'
import {MagicBoxGeometry} from "./magic/MagicBoxGeometry"
export class MagicSquare
{
    private _camera:THREE.PerspectiveCamera;
    private _scene:THREE.Scene;
    private _light:THREE.AmbientLight;
    private _renderer:THREE.WebGLRenderer;
    private _controller:OrbitControls;
    private _cubes;

    private _width;//页面宽度
    private _height;//页面高度


    private _mouse :THREE.Vector2;
    private _origPoint:THREE.Vector3;

    private _isRotating = false;
    private _intersect;//碰撞光线穿过的元素
    private _intersectObjectIndex:number;
    private _normalize;//触发平面法向量
    private _startPoint;//触发点
    private _movePoint;
    private _raycaster;//光线碰撞检测器
    private _initStatus = [];//魔方初始状态
    private _cubeParams;

    // //魔方转动的六个方向
    private _xLine ;//X轴正方向
    private _xLineAd ;//X轴负方向
    private _yLine ;//Y轴正方向
    private _yLineAd ;//Y轴负方向
    private _zLine ;//Z轴正方向
    private _zLineAd ;//Z轴负方向

    constructor()
    {
        this.checkProperty();

        this.init();

        console.log('MagicCube inited')
    }

    private checkProperty()
    {
        this._camera = null;
        this._scene = null;
        this._light = null;
        this._renderer = null;
    
        this._width = 0;//页面宽度
        this._height = 0;//页面高度
        
        this._origPoint = null;
    
        this._isRotating = false;
        this._intersect = null;//碰撞光线穿过的元素

        this._normalize = null;//触发平面法向量
        this._startPoint = null;//触发点
        this._movePoint = null;
        this._initStatus = [];//魔方初始状态
        this._intersectObjectIndex = 0;

        this._cubeParams = null;

        this._raycaster = new THREE.Raycaster();//光线碰撞检测器
        this._mouse = new THREE.Vector2();
        this._xLine = new THREE.Vector3( 1, 0, 0 );//X轴正方向
        this._xLineAd = new THREE.Vector3( -1, 0, 0 );//X轴负方向
        this._yLine = new THREE.Vector3( 0, 1, 0 );//Y轴正方向
        this._yLineAd = new THREE.Vector3( 0, -1, 0 );//Y轴负方向
        this._zLine = new THREE.Vector3( 0, 0, 1 );//Z轴正方向
        this._zLineAd = new THREE.Vector3( 0, 0, -1 );//Z轴负方向

        
        this._origPoint = new THREE.Vector3(0, 0, 0);
    }
    
    public init()
    {
        console.log('magic Client!!!!!!!!!!!')
        this._cubeParams = {x:0,
            y:0,
            z:0,
            num:3,
            len:50,
            color:['rgba(255,193,37,1)','rgba(0,191,255,1)',
                    'rgba(50,205,50,1)','rgba(178,34,34,1)',
                    'rgba(255,255,0,1)','rgba(255,255,255,1)']
        };

        this.initThree();
        this.initCamera(this._width,this._height);
        this.initScene();
        this.initLight(this._scene);
        this.initObject(this._scene);
        this.render();

    
        //视角控制
        this._controller = new OrbitControls(this._camera,this._renderer.domElement);
        this._controller.target = this._origPoint;

        this.startCube = this.startCube.bind(this);
        this.moveCube = this.moveCube.bind(this);
        this.stopCube = this.stopCube.bind(this);
        //监听鼠标事件
        this._renderer.domElement.addEventListener('mousedown', this.startCube, false)
        this._renderer.domElement.addEventListener('mousemove', this.moveCube, false );
        this._renderer.domElement.addEventListener('mouseup', this.stopCube,false);
        //监听触摸事件
        this._renderer.domElement.addEventListener('touchstart', this.startCube, false);
        this._renderer.domElement.addEventListener('touchmove', this.moveCube, false);
        this._renderer.domElement.addEventListener('touchend', this.stopCube, false);

        window.addEventListener('resize',this.resize.bind(this),true)
        
    }

    private initCamera(width:number,height)
    {
        this._camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
        this._camera.position.set(0, 0, 600);
        this._camera.up.set(0, 1, 0);//正方向
        this._camera.lookAt(this._origPoint);

    }

    private initThree()
    {
        console.log(document)
        this._width = window.innerWidth;
        this._height = window.innerHeight;

        this._renderer = new THREE.WebGLRenderer({antialias:true});

        this._renderer.setSize(this._width,this._height);
        this._renderer.setClearColor(0xFFFFFF,1.0);

        document.body.appendChild(this._renderer.domElement);
    }

    private initScene()
    {
        this._scene = new THREE.Scene();
    }


    private initLight(scene:THREE.Scene)
    {
        this._light = new THREE.AmbientLight();
        scene.add(this._light);
    }

    
    private initObject(scene)
    {
        this._cubes = this.simpleCube(this._cubeParams.x,this._cubeParams.y,this._cubeParams.z,
            this._cubeParams.num,this._cubeParams.len,this._cubeParams.color);

        for(let i = 0; i< this._cubes.length;i++)
        {
            let item = this._cubes[i];
            this._initStatus.push({
                x:item.position.x,
                y:item.position.y,
                z:item.position.z,
                cubeIndex:item.id
            });
            scene.add(this._cubes[i]);
            item.cubeIndex = item.id;
        }
            
        // //透明正方体
        let cubegeo:MagicBoxGeometry = new MagicBoxGeometry(150,150,150);

        var hex = 0x000000;
        for ( let i = 0; i < cubegeo.faces.length; i += 2 ) {
            cubegeo.faces[ i ].color.setHex( hex );
            cubegeo.faces[ i + 1 ].color.setHex( hex );
        }
        var cubemat = new THREE.MeshBasicMaterial({vertexColors: true,opacity: 0, transparent: true});
        let cube:THREE.Mesh = new THREE.Mesh( cubegeo, cubemat );
        cube['cubeType'] = 'coverCube';
        scene.add( cube );
        
    }
    public render()
    {
        this._renderer.render(this._scene,this._camera);
        window.requestAnimationFrame(this.render.bind(this));
    }

    private simpleCube(x:number,y:number,z:number,num:number,len:number,colors:string[])
    {
        let leftUpX = x - num / 2 * len;
        let leftUpY = y + num / 2 * len;
        let leftUpz = z + num / 2 * len;

        let materialArr:THREE.MeshLambertMaterial[] = [];

        for(let i = 0;i<colors.length;i++)
        { 
            let texture = new THREE.Texture(this.faces(colors[i]));

            texture.needsUpdate = true;
            let material = new THREE.MeshLambertMaterial({map:texture});

            materialArr.push(material);
        }

        let cubes:THREE.Mesh[] = [];
        for(let i = 0 ;i < num; i++)
        {
            for(let j = 0; j < num*num ; j++)
            {
                let cubeEgo = new MagicBoxGeometry(len,len,len);
                let cube = new THREE.Mesh(cubeEgo,materialArr);

                cube.position.x = (leftUpX + len / 2) + (j % num)*len;
                cube.position.y = (leftUpY - len / 2) - parseInt((j / num).toString(),16) * len;
                cube.position.z = (leftUpz - len / 2) - i * len;

                cubes.push(cube)
            }
        }
        return cubes;
    }

    private faces(color:string):HTMLCanvasElement
    {
        let canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        let context = canvas.getContext('2d');
        if(context)
        {
            context.fillStyle = 'rgba(0,0,0,1)';
            context.fillRect(0,0,256,256);
            context.rect(16,16,224,224);
            context.lineJoin = 'round';
            context.lineWidth = 16;
            context.fillStyle = color;
            context.strokeStyle = color;
            context.stroke();
            context.fill();
        }
        else
        {
            console.error('您的浏览器不支持Canvas无法预览');
        }
        return canvas;
    }


    private startCube(event)
    {
        this.getIntersects(event);
        //魔方没有处于转动过程中且存在碰撞物体
        if(!this._isRotating&&this._intersect){
            this._startPoint = this._intersect.point;//开始转动，设置起始点
            this._controller.enabled = false;//当刚开始的接触点在魔方上时操作为转动魔方，屏蔽控制器转动
        }else{
            this._controller.enabled = true;//当刚开始的接触点没有在魔方上或者在魔方上但是魔方正在转动时操作转动控制器
        }
    }

    private moveCube(event)
    {
        this.getIntersects(event);
        if(this._intersect){
            if(!this._isRotating&&this._startPoint){//魔方没有进行转动且满足进行转动的条件
                this._movePoint = this._intersect.point;
                if(!this._movePoint.equals(this._startPoint)){//和起始点不一样则意味着可以得到转动向量了
                    this._isRotating = true;//转动标识置为true
                    let sub = this._movePoint.sub(this._startPoint);//计算转动向量
                    let direction = this.getDirection(sub);//获得方向
                    let elements = this.getBoxs(this._intersect,direction);
                    let startTime:number = new Date().getTime();
                    window.requestAnimationFrame(function(timestamp){
                        this.rotateAnimation(elements,direction,timestamp,0);
                    }.bind(this));
                }
            }
        }
        event.preventDefault();
    }

    private stopCube(event)
    {
        this._intersect = null;
        this._startPoint = null
    }

    //获取操作焦点以及该焦点所在平面的法向量
    private getIntersects(event)
    {
        //触摸事件和鼠标事件获得坐标的方式有点区别
        if(event.touches)
        {
            var touch = event.touches[0];
            this._mouse.x = (touch.clientX / this._width)*2 - 1;
            this._mouse.y = -(touch.clientY / this._height)*2 + 1;
        }else
        {
            this._mouse.x = (event.clientX / this._width)*2 - 1;
            this._mouse.y = -(event.clientY / this._height)*2 + 1;
        }

        this._raycaster.setFromCamera(this._mouse, this._camera);
        //Raycaster方式定位选取元素，可能会选取多个，以第一个为准
        let intersects = this._raycaster.intersectObjects(this._scene.children);
        if(intersects.length){
            try
            {
                if(intersects[0].object.cubeType==='coverCube')
                {
                    this._intersect = intersects[1];
                    this._normalize = intersects[0].face.normal;
                }else
                {
                    this._intersect = intersects[0];
                    this._normalize = intersects[1].face.normal;
                }

                for(let i = 0;i<this._scene.children.length ;i++)
                {
                    let child = this._scene.children[i];
                    if(this._intersect.object.id == child.id)
                    {
                        this._intersectObjectIndex = i;
                        break;
                    }
                }
            }
            catch(err)
            {
                //nothing
            }
        }
    }

    //获得旋转方向
    public getDirection(vector3){
        let direction;
        //判断差向量和x、y、z轴的夹角
        let xAngle = vector3.angleTo(this._xLine);
        let xAngleAd = vector3.angleTo(this._xLineAd);
        let yAngle = vector3.angleTo(this._yLine);
        let yAngleAd = vector3.angleTo(this._yLineAd);
        let zAngle = vector3.angleTo(this._zLine);
        let zAngleAd = vector3.angleTo(this._zLineAd);
        let minAngle = this.min([xAngle,xAngleAd,yAngle,yAngleAd,zAngle,zAngleAd]);//最小夹角

        switch(minAngle){
            case xAngle:
                direction = 0;//向x轴正方向旋转90度（还要区分是绕z轴还是绕y轴）
                if(this._normalize.equals(this._yLine)){
                    direction = direction+0.1;//绕z轴顺时针
                }else if(this._normalize.equals(this._yLineAd)){
                    direction = direction+0.2;//绕z轴逆时针
                }else if(this._normalize.equals(this._zLine)){
                    direction = direction+0.3;//绕y轴逆时针
                }else{
                    direction = direction+0.4;//绕y轴顺时针
                }
                break;
            case xAngleAd:
                direction = 1;//向x轴反方向旋转90度
                if(this._normalize.equals(this._yLine)){
                    direction = direction+0.1;//绕z轴逆时针
                }else if(this._normalize.equals(this._yLineAd)){
                    direction = direction+0.2;//绕z轴顺时针
                }else if(this._normalize.equals(this._zLine)){
                    direction = direction+0.3;//绕y轴顺时针
                }else{
                    direction = direction+0.4;//绕y轴逆时针
                }
                break;
            case yAngle:
                direction = 2;//向y轴正方向旋转90度
                if(this._normalize.equals(this._zLine)){
                    direction = direction+0.1;//绕x轴逆时针
                }else if(this._normalize.equals(this._zLineAd)){
                    direction = direction+0.2;//绕x轴顺时针
                }else if(this._normalize.equals(this._xLine)){
                    direction = direction+0.3;//绕z轴逆时针
                }else{
                    direction = direction+0.4;//绕z轴顺时针
                }
                break;
            case yAngleAd:
                direction = 3;//向y轴反方向旋转90度
                if(this._normalize.equals(this._zLine)){
                    direction = direction+0.1;//绕x轴顺时针
                }else if(this._normalize.equals(this._zLineAd)){
                    direction = direction+0.2;//绕x轴逆时针
                }else if(this._normalize.equals(this._xLine)){
                    direction = direction+0.3;//绕z轴顺时针
                }else{
                    direction = direction+0.4;//绕z轴逆时针
                }
                break;
            case zAngle:
                direction = 4;//向z轴正方向旋转90度
                if(this._normalize.equals(this._yLine)){
                    direction = direction+0.1;//绕x轴顺时针
                }else if(this._normalize.equals(this._yLineAd)){
                    direction = direction+0.2;//绕x轴逆时针
                }else if(this._normalize.equals(this._xLine)){
                    direction = direction+0.3;//绕y轴顺时针
                }else{
                    direction = direction+0.4;//绕y轴逆时针
                }
                break;
            case zAngleAd:
                direction = 5;//向z轴反方向旋转90度
                if(this._normalize.equals(this._yLine)){
                    direction = direction+0.1;//绕x轴逆时针
                }else if(this._normalize.equals(this._yLineAd)){
                    direction = direction+0.2;//绕x轴顺时针
                }else if(this._normalize.equals(this._xLine)){
                    direction = direction+0.3;//绕y轴逆时针
                }else{
                    direction = direction+0.4;//绕y轴顺时针
                }
                break;
            default:
                break;
        }
        return direction;
    }

    //获取数组中的最小值
    public min(arr:number[]){
        var min = arr[0];
        for(var i=1;i<arr.length;i++){
            if(arr[i]<min){
                min = arr[i];
            }
        }
        return min;
    }

    //根据方向获得运动元素
    public getBoxs(target,direction){
        let cubeIndex = this._intersectObjectIndex;
        var targetId = target.object.cubeIndex;
        var ids = [];    
        for(var i=0;i<this._cubes.length;i++){
            ids.push(this._cubes[i].cubeIndex);
        }
        var minId = this.min(ids);
        targetId = targetId-minId;
        var numI = parseInt((targetId/9).toString());
        var numJ = targetId%9;
        var boxs = [];
        //根据绘制时的规律判断 no = i*9+j
        switch(direction){
            //绕z轴
            case 0.1:
            case 0.2:
            case 1.1:
            case 1.2:
            case 2.3:
            case 2.4:
            case 3.3:
            case 3.4:
                for(var i=0;i<this._cubes.length;i++){
                    var tempId = this._cubes[i].cubeIndex-minId;
                    if(numI===parseInt((tempId/9).toString())){
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
                for(var i=0;i<this._cubes.length;i++){
                    var tempId = this._cubes[i].cubeIndex-minId;
                    if(parseInt((numJ/3).toString())===parseInt((tempId%9/3).toString())){
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
                for(var i=0;i<this._cubes.length;i++){
                    var tempId = this._cubes[i].cubeIndex-minId;
                    if(tempId%9%3===numJ%3){
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
    public updateCubeIndex(elements)
    {
        for(var i=0;i<elements.length;i++){
            var temp1 = elements[i];
            for(var j=0;j<this._initStatus.length;j++){
                var temp2 = this._initStatus[j];
                if( Math.abs(temp1.position.x - temp2.x)<=this._cubeParams.len/2 && 
                    Math.abs(temp1.position.y - temp2.y)<=this._cubeParams.len/2 && 
                    Math.abs(temp1.position.z - temp2.z)<=this._cubeParams.len/2 ){
                    temp1.cubeIndex = temp2.cubeIndex;
                    break;
                }
            }
        }
    }

    /**
         * 旋转动画
         */
    public rotateAnimation(elements,direction,currentstamp,startstamp,laststamp)
    {
        let totalTime = 500;//转动的总运动时间
        if(startstamp===0){
            startstamp = currentstamp;
            laststamp = currentstamp;
        }
        if(currentstamp-startstamp>=totalTime){
            currentstamp = startstamp+totalTime;
            this._isRotating = false;
            this._startPoint = null;
            this.updateCubeIndex(elements);
        }
        switch(direction){
            //绕z轴顺时针
            case 0.1:
            case 1.2:
            case 2.4:
            case 3.3:
                for(var i=0;i<elements.length;i++){
                    this.rotateAroundWorldZ(elements[i],-90*Math.PI/180*(currentstamp-laststamp)/totalTime);
                }
                break;
            //绕z轴逆时针
            case 0.2:
            case 1.1:
            case 2.3:
            case 3.4:
                for(var i=0;i<elements.length;i++){
                    this.rotateAroundWorldZ(elements[i],90*Math.PI/180*(currentstamp-laststamp)/totalTime);
                }
                break;
            //绕y轴顺时针
            case 0.4:
            case 1.3:
            case 4.3:
            case 5.4:
                for(var i=0;i<elements.length;i++){
                    this.rotateAroundWorldY(elements[i],-90*Math.PI/180*(currentstamp-laststamp)/totalTime);
                }
                break;
            //绕y轴逆时针
            case 1.4:
            case 0.3:
            case 4.4:
            case 5.3:
                for(var i=0;i<elements.length;i++){
                    this.rotateAroundWorldY(elements[i],90*Math.PI/180*(currentstamp-laststamp)/totalTime);
                }
                break;
            //绕x轴顺时针
            case 2.2:
            case 3.1:
            case 4.1:
            case 5.2:
                for(var i=0;i<elements.length;i++){
                    this.rotateAroundWorldX(elements[i],90*Math.PI/180*(currentstamp-laststamp)/totalTime);
                }
                break;
            //绕x轴逆时针
            case 2.1:
            case 3.2:
            case 4.2:
            case 5.1:
                for(var i=0;i<elements.length;i++){
                    this.rotateAroundWorldX(elements[i],-90*Math.PI/180*(currentstamp-laststamp)/totalTime);
                }
                break;
            default:
                break;
        }
        // if(currentstamp-startstamp<totalTime)
        // {
        //     window.requestAnimationFrame(this.rotateAnimation.bind(this));
        // }

        if(currentstamp-startstamp<totalTime){
            window.requestAnimationFrame(function(timestamp){
                this.rotateAnimation(elements,direction,timestamp,startstamp,currentstamp);
            }.bind(this));
        }
    }

    
    //绕着世界坐标系的某个轴旋转
    public rotateAroundWorldY(obj,rad)
    {
        var x0 = obj.position.x;
        var z0 = obj.position.z;
        /**
         * 因为物体本身的坐标系是随着物体的变化而变化的，
         * 所以如果使用rotateZ、rotateY、rotateX等方法，
         * 多次调用后就会出问题，先改为Quaternion实现。
         */
        var q = new THREE.Quaternion(); 
        q.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), rad );
        obj.quaternion.premultiply( q );
        //obj.rotateY(rad);
        obj.position.x = Math.cos(rad)*x0+Math.sin(rad)*z0;
        obj.position.z = Math.cos(rad)*z0-Math.sin(rad)*x0;
    }
    public rotateAroundWorldZ(obj,rad){
        var x0 = obj.position.x;
        var y0 = obj.position.y;
        var q = new THREE.Quaternion(); 
        q.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), rad );
        obj.quaternion.premultiply( q );
        //obj.rotateZ(rad);
        obj.position.x = Math.cos(rad)*x0-Math.sin(rad)*y0;
        obj.position.y = Math.cos(rad)*y0+Math.sin(rad)*x0;
    }
    public rotateAroundWorldX(obj,rad){
        var y0 = obj.position.y;
        var z0 = obj.position.z;
        var q = new THREE.Quaternion(); 
        q.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), rad );
        obj.quaternion.premultiply( q );
        //obj.rotateX(rad);
        obj.position.y = Math.cos(rad)*y0-Math.sin(rad)*z0;
        obj.position.z = Math.cos(rad)*z0+Math.sin(rad)*y0;
    }

    public resize()
    {
        this._camera.aspect = window.innerWidth / window.innerHeight;

        //更新矩阵
        this._camera.updateProjectionMatrix();
    
        //更新渲染器
        this._renderer.setSize(window.innerWidth,window.innerHeight);
    
        //设置渲染器的像素比
        this._renderer.setPixelRatio(window.devicePixelRatio);
    }

}