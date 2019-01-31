// 配置按需编译：设置编译范围为 html 文件，不过 html 文件中使用到的资源也会参与编译。
// fis.set('project.files', '*.html');

// npm install [-g] fis3-hook-module
// 引入模块化开发插件，设置规范为 commonJs 规范。
// fis.hook('module', {
//     mode: 'amd',

//     // 把 factory 中的依赖，前置到 define 的第二个参数中来。
//     forwardDeclaration: true
// });


fis.hook('amd',{
    baseUrl: './',
    paths: {
      jquery: 'components/jquery/jquery.js'
    },
    // shim 可以达到不改目标文件，指定其依赖和暴露内容的效果。注意只对不满足amd的js有
    // shim: {
        // laydate: {
        //     exports: 'laydate'
        // }
    // },

    // globalAsyncAsSync 是否将全局下面的异步用法，当同步处理。
    globalAsyncAsSync: true

})


// 设置组件库里面的 js 都是模块化 js.
fis.match('/components/**.js', {
    isMod: true
});

fis.match('*.{js,css,png,jpg,gif,jpeg,scss,es6}', {
    useHash: true
});


//scss-》css
fis.match('*.scss', {
    rExt: '.css',
    parser: fis.plugin('node-sass')
});

// 内置压缩png图片
fis.match('*.png', {
    optimizer: fis.plugin('png-compressor')
});

// 页面js
fis.match('/page/**.js', {
    parser: fis.plugin('translate-es6', {
        presets: ['es2015']
    }),
    optimizer: fis.plugin('uglify-js')
});


// 因为是纯前段项目，依赖不能自断被加载进来，所以这里需要借助一个 loader 来完成，
// 注意：与后端结合的项目不需要此插件!!!
fis.match('::package', {
    // npm install [-g] fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
        resourceType: 'amd',
        useInlineMap: true // 资源映射表内嵌
    })
});

//不启用压缩
fis.media('debug').match('*.{js,css,png,scss}', {
    useHash: false,
    useSprite: false,
    optimizer: null
});

// extends GLOBAL config
fis.media('production');

fis.match('/src/**/*', {
    release: '$0'
});


// fis3 release prod 产品发布，进行合并
fis.media('prod')
    // .match('/static/**.js', {
        // 将所有用到的 js all in one 打包
        // packTo: '/static/aio.js',

        // 通过 uglify 压缩 js
        // optimizer: fis.plugin('uglify-js')
    // })
    .match('/static/**.css', {

        // 将用到的 css all in one 打包。
        packTo: '/static/aio.css',
            // 给匹配到的文件分配属性 `useSprite`
        useSprite: true
    })


// fis3 release  发布
// fis3 release -w  文件监听
// fis3 release --wL  浏览器自动刷新
// fis3 release -d /Users/my-name/work/htdocs  替代内置server 
// fis3 release prod -d ./dist  发布版本