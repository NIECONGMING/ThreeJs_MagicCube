// import * as THREE from '../../lib/three/build/three.module.js';
import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
export class WebGLRenderer {
    constructor(parameters) {
        this._WebGLRenderer = new THREE.WebGLRenderer(parameters);
    }
    render(scene, camera) {
        this._WebGLRenderer.clear();
        this._WebGLRenderer.render(scene, camera);
    }
    setSize(width, height) {
        this._WebGLRenderer.setSize(width, height);
    }
    setClearColor(color, alpha) {
        this._WebGLRenderer.setClearColor(color, alpha);
    }
    get domElement() {
        return this._WebGLRenderer.domElement;
    }
}
