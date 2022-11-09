import * as THREE from '/build/three.module.js'
import { OrbitControls } from '/jsm/controls/OrbitControls'
import { Scene } from './scene';
import { Camera } from './camera';
export class WebGLRenderer
{
    private _WebGLRenderer : THREE.WebGLRenderer;
    constructor(parameters?: any)
    {
        this._WebGLRenderer = new THREE.WebGLRenderer(parameters);
    }

    public render(scene:Scene,camera:Camera)
    {   
        this._WebGLRenderer.clear();
        this._WebGLRenderer.render(scene,camera);
    }


    public setSize(width:number,height:number)
    {
        this._WebGLRenderer.setSize(width,height);
    }

    public setClearColor(color:number,alpha:number)
    {
        this._WebGLRenderer.setClearColor(color,alpha);
    }
    public get domElement()
    {
        return this._WebGLRenderer.domElement;
    }

}