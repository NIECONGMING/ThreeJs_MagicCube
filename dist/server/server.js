"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const port = 3000;
class App {
    constructor(port) {
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
        this.env = "dev";
        // // const path = require(‘path’);
        // // app.use(express.static(path.join(__dirname, ‘绝对定位下静态资源的位置’)))
        // console.log('8900------')
        this.init(this.env);
    }
    init(env) {
        console.log(env);
        if (env === 'dev') {
            this.port = port;
            const app = (0, express_1.default)();
            app.use(express_1.default.static(path_1.default.join(__dirname, '../client')));
            app.use('/build/three.module.js', express_1.default.static(path_1.default.join(__dirname, '../../node_modules/three/build/three.module.js')));
            app.use('/jsm/controls/OrbitControls', express_1.default.static(path_1.default.join(__dirname, '../../node_modules/three/examples/jsm/controls/OrbitControls.js')));
            app.use('/dat.gui', express_1.default.static(path_1.default.join(__dirname, '../../node_modules/dat.gui/build/dat.gui.module.js')));
            app.use('/magic/Texture', express_1.default.static(path_1.default.join(__dirname, '../client/magic/Texture.js')));
            app.use('/magic/webGLRender', express_1.default.static(path_1.default.join(__dirname, '../client/magic/webGLRender.js')));
            app.use('/CubeUntils', express_1.default.static(path_1.default.join(__dirname, '../client/CubeUntils.js')));
            app.use('/magic/MagicBoxGeometry', express_1.default.static(path_1.default.join(__dirname, '../client/magic/MagicBoxGeometry.js')));
            app.use('/MagicClient', express_1.default.static(path_1.default.join(__dirname, '../client/MagicClient.js')));
            this.server = new http_1.default.Server(app);
            // const path = require(‘path’);
            // app.use(express.static(path.join(__dirname, ‘绝对定位下静态资源的位置’)))
            console.log('8900------');
        }
        else {
            this.port = port;
            const app = (0, express_1.default)();
            app.use(express_1.default.static(path_1.default.join(__dirname, '../client')));
            app.use('/build/three.module.js', express_1.default.static(path_1.default.join(__dirname, '../@type/three/build/three.module.js')));
            app.use('/jsm/controls/OrbitControls', express_1.default.static(path_1.default.join(__dirname, '../@type/three/examples/jsm/controls/OrbitControls.j')));
            app.use('/dat.gui', express_1.default.static(path_1.default.join(__dirname, '../dat.gui/build/dat.gui.module.js')));
            app.use('/magic/Texture', express_1.default.static(path_1.default.join(__dirname, '../client/magic/Texture.js')));
            app.use('/magic/webGLRender', express_1.default.static(path_1.default.join(__dirname, '../client/magic/webGLRender.js')));
            app.use('/CubeUntils', express_1.default.static(path_1.default.join(__dirname, '../client/CubeUntils.js')));
            app.use('/magic/MagicBoxGeometry', express_1.default.static(path_1.default.join(__dirname, '../client/magic/MagicBoxGeometry.js')));
            app.use('/MagicClient', express_1.default.static(path_1.default.join(__dirname, '../client/MagicClient.js')));
            this.server = new http_1.default.Server(app);
        }
    }
    Start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}.`);
        });
    }
}
new App(port).Start();
//# sourceMappingURL=server.js.map