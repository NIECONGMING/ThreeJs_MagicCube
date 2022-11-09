import * as THREE from 'three'//'../lib/three/build/three.module.js';
export class CubeUntils {
    constructor() {
    }
    static createCanvasByColor(width, height, color) {
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        let context = canvas.getContext('2d');
        if (context) {
            context.fillStyle = 'rgba(0,0,0,1)';
            context.fillRect(0, 0, 256, 256);
            context.rect(16, 16, 224, 224);
            context.lineJoin = 'round';
            context.lineWidth = 16;
            context.fillStyle = color;
            context.strokeStyle = color;
            context.stroke();
            context.fill();
        }
        else {
            console.error('您的浏览器不支持Canvas无法预览');
        }
        return canvas;
    }
    //获取数组中的最小值
    static min(arr) {
        var min = arr[0];
        for (var i = 1; i < arr.length; i++) {
            if (arr[i] < min) {
                min = arr[i];
            }
        }
        return min;
    }
}
// //魔方转动的六个方向
CubeUntils.xLine = new THREE.Vector3(1, 0, 0); //X轴正方向
CubeUntils.xLineAd = new THREE.Vector3(-1, 0, 0); //X轴负方向
CubeUntils.yLine = new THREE.Vector3(0, 1, 0); //Y轴正方向
CubeUntils.yLineAd = new THREE.Vector3(0, -1, 0); //Y轴负方向
CubeUntils.zLine = new THREE.Vector3(0, 0, 1); //Z轴正方向
CubeUntils.zLineAd = new THREE.Vector3(0, 0, -1); //Z轴负方向
