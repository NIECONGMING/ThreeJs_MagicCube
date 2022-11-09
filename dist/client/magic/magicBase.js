import { OrbitControls } from '/jsm/controls/OrbitControls';
import * as THREE from '/build/three.module.js';
export class Vector3 extends THREE.Vector3 {
    constructor(x, y, z) {
        super(x, y, z);
    }
}
export class Vector2 extends THREE.Vector2 {
    constructor(x, y) {
        super(x, y);
    }
}
export class Raycaster extends THREE.Raycaster {
    constructor() {
        super();
    }
}
export class LineBasicMaterial extends THREE.LineBasicMaterial {
    constructor(param) {
        super(param);
    }
}
export class MeshLambertMaterial extends THREE.MeshLambertMaterial {
}
export class BoxGeometry extends THREE.BoxGeometry {
}
export class Mesh extends THREE.Mesh {
}
export class MagicOrbitControls extends OrbitControls {
}
export class MeshBasicMaterial extends THREE.MeshBasicMaterial {
}
