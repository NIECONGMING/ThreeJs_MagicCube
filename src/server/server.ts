import express from "express"
import path from "path"
import http from "http"
import e from "express"

const port: number = 3000

class App {
    private server: http.Server
    private port: number;
    private env:string = "dev";

    constructor(port: number) {
        // this.port = port
        // const app = express()
        // app.use(express.static(path.join(__dirname, '../client')))
        // app.use('/build/three.module.js', express.static(path.join(__dirname, '../../node_modules/three/build/three.module.js')))
        // app.use('/jsm/controls/OrbitControls', express.static(path.join(__dirname, '../../node_modules/three/examples/jsm/controls/OrbitControls.js')))
        // app.use('/dat.gui', express.static(path.join(__dirname, '../../node_modules/dat.gui/build/dat.gui.module.js')))
        // app.use('/magic/Texture', express.static(path.join(__dirname, '../client/magic/Texture.js')))
        // app.use('/magic/webGLRender', express.static(path.join(__dirname, '../client/magic/webGLRender.js')))
        // app.use('/CubeUntils', express.static(path.join(__dirname, '../client/CubeUntils.js')))
        // app.use('/magic/MagicBoxGeometry', express.static(path.join(__dirname, '../client/magic/MagicBoxGeometry.js')))
        // app.use('/MagicClient', express.static(path.join(__dirname, '../client/MagicClient.js')))
        // this.server = new http.Server(app);

        // // const path = require(‘path’);
        // // app.use(express.static(path.join(__dirname, ‘绝对定位下静态资源的位置’)))
        // console.log('8900------')

        this.init(this.env);
    }

    public init(env:string )
    {
        console.log(env)
        if(env === 'dev')
        {
            this.port = port
            const app = express()
            app.use(express.static(path.join(__dirname, '../client')))
            app.use('/build/three.module.js', express.static(path.join(__dirname, '../../node_modules/three/build/three.module.js')))
            app.use('/jsm/controls/OrbitControls', express.static(path.join(__dirname, '../../node_modules/three/examples/jsm/controls/OrbitControls.js')))
            app.use('/dat.gui', express.static(path.join(__dirname, '../../node_modules/dat.gui/build/dat.gui.module.js')))
            app.use('/magic/Texture', express.static(path.join(__dirname, '../client/magic/Texture.js')))
            app.use('/magic/webGLRender', express.static(path.join(__dirname, '../client/magic/webGLRender.js')))
            app.use('/CubeUntils', express.static(path.join(__dirname, '../client/CubeUntils.js')))
            app.use('/magic/MagicBoxGeometry', express.static(path.join(__dirname, '../client/magic/MagicBoxGeometry.js')))
            app.use('/MagicClient', express.static(path.join(__dirname, '../client/MagicClient.js')))
            this.server = new http.Server(app);
    
            // const path = require(‘path’);
            // app.use(express.static(path.join(__dirname, ‘绝对定位下静态资源的位置’)))
            console.log('8900------')
        }
        else
        {
            this.port = port
            const app = express()
            app.use(express.static(path.join(__dirname, '../client')))
            app.use('/build/three.module.js', express.static(path.join(__dirname, '../@type/three/build/three.module.js')))
            app.use('/jsm/controls/OrbitControls', express.static(path.join(__dirname, '../@type/three/examples/jsm/controls/OrbitControls.j')))
            app.use('/dat.gui', express.static(path.join(__dirname, '../dat.gui/build/dat.gui.module.js')))
            app.use('/magic/Texture', express.static(path.join(__dirname, '../client/magic/Texture.js')))
            app.use('/magic/webGLRender', express.static(path.join(__dirname, '../client/magic/webGLRender.js')))
            app.use('/CubeUntils', express.static(path.join(__dirname, '../client/CubeUntils.js')))
            app.use('/magic/MagicBoxGeometry', express.static(path.join(__dirname, '../client/magic/MagicBoxGeometry.js')))
            app.use('/MagicClient', express.static(path.join(__dirname, '../client/MagicClient.js')))
            this.server = new http.Server(app);
        }
    }


    public Start() {
        this.server.listen(this.port, () => {
            console.log( `Server listening on port ${this.port}.` )
        })
    }
}

new App(port).Start()