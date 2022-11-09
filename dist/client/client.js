import { MagicSquare } from './magicClient';
// const magiicSquare = new MagicSquare();
export class clientMain {
    constructor() {
        this._magiicSquare = new MagicSquare();
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new clientMain();
        }
        return this._instance;
    }
    start() {
        console.log('start');
        window['ClientMain'] = clientMain.instance;
    }
}
var start = function () {
    console.log('启动魔方');
    clientMain.instance.start();
};
start();
