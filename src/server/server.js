"use strict";
exports.__esModule = true;
var express_1 = require("express");
var path_1 = require("path");
var http_1 = require("http");
var port = 3000;
var App = /** @class */ (function () {
    function App(port) {
        this.port = port;
        var app = express_1["default"]();
        app.use(express_1["default"].static(path_1["default"].join(__dirname, '../client')));
        app.use('/build/three.module.js', express_1["default"].static(path_1["default"].join(__dirname, '../../node_modules/three/build/three.module.js')));
        app.use('/jsm/controls/OrbitControls', express_1["default"].static(path_1["default"].join(__dirname, '../../node_modules/three/examples/jsm/controls/OrbitControls.js')));
        app.use('/magic/camera', express_1["default"].static(path_1["default"].join(__dirname, '../client/magic/camera.js')));
        app.use('/magic/magicBase', express_1["default"].static(path_1["default"].join(__dirname, '../client/magic/magicBase.js')));
        app.use('/magic/scene', express_1["default"].static(path_1["default"].join(__dirname, '../client/magic/scene.js')));
        app.use('/magic/light', express_1["default"].static(path_1["default"].join(__dirname, '../client/magic/light.js')));
        app.use('/magic/Texture', express_1["default"].static(path_1["default"].join(__dirname, '../client/magic/Texture.js')));
        app.use('/magic/webGLRender', express_1["default"].static(path_1["default"].join(__dirname, '../client/magic/webGLRender.js')));
        app.use('/UnicodeText', express_1["default"].static(path_1["default"].join(__dirname, '../client/UnicodeText.js')));
        app.use('/magicClient', express_1["default"].static(path_1["default"].join(__dirname, '../client/magicClient.js')));
        this.server = new http_1["default"].Server(app);
    }
    App.prototype.Start = function () {
        var _this = this;
        this.server.listen(this.port, function () {
            console.log("Server listening on port " + _this.port + ".");
        });
    };
    return App;
}());
new App(port).Start();
