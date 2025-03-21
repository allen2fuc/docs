import {defineConfig} from 'vitepress'

export default defineConfig({
    lang: 'en-US',
  
  	/* 头部名称 */
    title: "浪哩格朗",
  
  	/* 暂不知道在哪有显示TODO */
    description: "学海无涯苦作舟",

    /* 显示头部分的内容 */
    head: [
        ['link', {rel: 'icon', href: 'https://mardown-1257386302.cos.ap-guangzhou.myqcloud.com/20250321144848336.png'}]
    ],

    /* 显示最后更新时间,是否使用 Git 获取每个页面的最后更新时间戳 */
    lastUpdated: true,

		/* 头部标题 */
    titleTemplate: ':title - 的笔记',

    /* 主题配置 */
    // https://vitejs.cn/vitepress/reference/default-theme-config
    themeConfig: {

        /* 顶部左边头像 */
        logo: 'https://mardown-1257386302.cos.ap-guangzhou.myqcloud.com/20250321144848336.png',

        siteTitle: "浪哩格朗",

        /* 顶部搜索框 */
        search: {
            provider: 'local'
        },

        /* 文章显示更新时间 */
        lastUpdated: {
            text: '上次更新',
            formatOptions: {
                dateStyle: 'full',
                timeStyle: 'medium'
            }
        },

        /* 翻页 */
        docFooter: {
            prev: '上一页',
            next: '下一页'
        },

        /* 文章界面右边部分 */
        outline: {level: [2, 6], label: '目录'},

        /* 页脚部分 */
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2019-present Evan You'
        },

        /* 顶部导航栏 */
        // https://vitejs.cn/vitepress/reference/default-theme-nav
        nav: [
            {text: 'Home', link: '/', target: '_self', rel: 'sponsored'},
            {text: 'Examples', link: '/markdown-examples'}
        ],

        /* 左边导航栏 */
        sidebar: [
            {
                text: 'Examples',
                items: [
                    {text: 'Markdown Examples', link: '/markdown-examples', collapsed: false},
                    {text: 'Runtime API Examples', link: '/api-examples'}
                ]
            }
        ],

        /* 顶部右侧链接至第三方 */
        socialLinks: [
            {icon: 'github', link: 'https://github.com/vuejs/vitepress'}
        ]
    }
})

