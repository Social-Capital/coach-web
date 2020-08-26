module.exports = {
    outputDir: 'dist',   //build输出目录
    assetsDir: 'assets', //静态资源目录（js, css, img）
    lintOnSave: false, //是否开启eslint
    // publicPath: '././', 
    publicPath: './', 
    devServer: {
        open: true, //是否自动弹出浏览器页面
        host: "192.168.31.149",
        port: '8080',
        https: true,   //是否使用https协议
        hotOnly: true, //是否开启热更新
        // proxy: {
        //     // '/codes': {
        //     //     target: 'https://api.sms.jpush.cn', //API服务器的地址
        //     //     changeOrigin: true,
        //     //     pathRewrite: {
        //     //         '^/ipa': ''
        //     //     }
        //     // },
        //     // '/ipa': {
        //     //     target: 'https://api.tigercoach.cn', //API服务器的地址
        //     //     changeOrigin: true,
        //     //     pathRewrite: {
        //     //         '^/ipa': ''
        //     //     }
        //     // },
            
        // },
    }
}