import express from "express"
import path from "path"
import http from "http"

const port: number = 3000

class App {
    private server: http.Server
    private port: number

    constructor(port: number) {
        this.port = port
        const app = express()
        app.use(express.static(path.join(__dirname, '../client')))
        app.use('/build/three.module.js', express.static(path.join(__dirname, '../../node_modules/three/build/three.module.js')))
        app.use('/jsm/controls/OrbitControls', express.static(path.join(__dirname, '../../node_modules/three/examples/jsm/controls/OrbitControls.js')))
        
        app.use('/magic/Texture', express.static(path.join(__dirname, '../client/magic/Texture.js')))
        app.use('/magic/webGLRender', express.static(path.join(__dirname, '../client/magic/webGLRender.js')))
        app.use('/magic/MagicBoxGeometry', express.static(path.join(__dirname, '../client/magic/MagicBoxGeometry.js')))
        app.use('/magicClient', express.static(path.join(__dirname, '../client/magicClient.js')))
        this.server = new http.Server(app);

        // const path = require(‘path’);
        // app.use(express.static(path.join(__dirname, ‘绝对定位下静态资源的位置’)))
        console.log('8900------')
    }

    public Start() {
        this.server.listen(this.port, () => {
            console.log( `Server listening on port ${this.port}.` )
        })
    }
}

new App(port).Start()