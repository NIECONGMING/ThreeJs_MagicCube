一、框架搭建流程

安装node.js
```step
安装地址：https://nodejs.org/en/
```

配置npm
```step
配置学习路径：https://www.php.cn/js-tutorial-414607.html
```

安装ts 
```step
npm install -g typescript
```

初始化npm
```step
npm init
```

安装Three.js依赖库
```step

执行命令：
cnpm install @types/three --save-dev // 具有类型生命的three版本
cnpm install three
```

执行编译脚本
```step
tsc -p .\src\client\
tsc -p ./src/server
```

执行脚本，启动服务器：
```step
node .\dist\server\server.js 
```

开发环境运行,package.json文件夹已经配置
```step
    npm run dev
```

```step
想要直接看运行效果，运行在output文件夹中的index.html
```

二、问题记录

1.报错内容：Failed to resolve module specifier "three". Relative references must start with either "/", "./", or "../".

    解决方法：Three.js 和OrbitControls.js加载线上的文件如：https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js
    答案参考：https://discourse.threejs.org/t/error-relative-references-must-start-with-either-or/13573/9

