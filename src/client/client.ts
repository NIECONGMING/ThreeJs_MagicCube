import * as THREE from '/build/three.module.js'
import { OrbitControls } from '/jsm/controls/OrbitControls'
import { MagicSquare } from './magicClient';


// const magiicSquare = new MagicSquare();



export class clientMain
{
    private static _instance:clientMain;
    private _magiicSquare:MagicSquare;

    public static get instance():clientMain
    {
        if(!this._instance)
        {   
            this._instance = new clientMain();
        }
        return this._instance; 
    }


    constructor()
    {
        
        this._magiicSquare = new MagicSquare();
    }

    public start()
    {
        console.log('start');
        window['ClientMain'] = clientMain.instance;
    }

}


var start = function () {
    console.log('启动魔方')
    clientMain.instance.start();
};

start();