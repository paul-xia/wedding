module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //清除build     
        // clean: {
        //   build: ['build/', 'build_php/']
        // },
        time: Date.now(),
        static_host: '',
        root_host: '',
        //清除build
        clean: {
            build: ['dest/']
        },
        //编译less文件
        less: {
            options: {
                cleancss: true,
                Choices: 'gzip',
                ieCompat: true,
                banner: '/*\n@ project:<%=pkg.name%>\n@ date:<%=grunt.template.today("yyyy-mm-dd")%>\n*/'
            },
            build: {
                files: {
                    'dest/style/css/common.css': 'style/less/common.less',
                    'dest/style/css/index.css': 'style/less/index.less',
                    'dest/style/css/hotel.css': 'style/less/hotel.less',
                    'dest/style/css/hr.css': 'style/less/hr.less',
                    'dest/style/css/wedding_dress.css': 'style/less/wedding_dress.less',
                    'dest/style/css/passport.css': 'style/less/passport.less',
                }
            },
            watch: {
                files: {
                    '<%=paramOut%>': '<%=paramIn%>'
                }
            }
        },
        copy: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: '**',
                    dest: 'dest/images/'
                }, {
                    expand: true,
                    src: 'script/**',
                    dest: 'dest/'
                }, {
                    expand: true,
                    src: 'style/css/images/**',
                    dest: 'dest/'
                }]
            },
            watch: {
                files: [{
                    expand: true,
                    src: '<%=paramIn%>',
                    dest: 'dest/'
                }]
            }
        },
        uglify: {
            build: {
                options: {
                    expand: true,
                    banner: '/*\n@ project:<%=pkg.name%>\n@ date:<%=grunt.template.today("yyyy-mm-dd")%>\n@ author:<%=pkg.author%>\n*/\n'
                },
                files: {
                    
                }
            },
            controlMin: {
                options: {
                    expand: true,
                    banner: '/*\n@ project:<%=pkg.name%>\n@ date:<%=grunt.template.today("yyyy-mm-dd")%>\n@ author:<%=pkg.author%>\n*/\n'
                },
                files: [{
                    expand: true,
                    cwd: 'dest/script/modules',
                    src: '*.js',
                    dest: 'dest/script/dest'
                }]
            }
        },
        ejs: {
            build: {
                options: {
                    title: '麦哈哈',
                    version: '<%=time%>',
                    user: false,
                    settings: {
                        host_setting:'<%=static_host%>'
                    },
                    url: function(url) {
                        return 'http://example.com/formatted/url/' + url;
                    }
                },
                src: ['html/*.html'],
                dest: 'dest/',
                expand: true
            },
            buildLess: {
                options: {
                    root_host: '<%=root_host%>',
                    time: '<%=time%>'
                },
                src: ['style/less/lib.ejs'],
                dest: '',
                expand: true,
                ext: '.less'
            },
            watch: {
                options: {
                    title: '麦哈哈',
                    version: '<%=time%>',
                    user:{
                        avatar:'<%=static_host%>/images/uh_1.png'
                    },
                    settings: {
                        host_setting:'<%=static_host%>'
                    },
                    url: function(url) {
                        return 'http://example.com/formatted/url/' + url;
                    }
                },
                src: ['<%=paramIn%>'],
                dest: 'dest/',
                expand: true,
                ext: '.html'
            }
        },

        //监听端口
        connect: {
            options: {
                expand: true,
                port: 9010,
                hostname: '0.0.0.0', //默认就是这个值，可配置为本机某个 IP，localhost 或域名
                livereload: 35500 //声明给 watch 监听的端口
            },
            server: {
                options: {                    
                    open: false, //自动打开网页 http://
                    base: [
                        'dest/'  //主目录                  
                    ]                
                }
            }
        },

        //监听变化
        watch: {
            livereload: {
                options: {
                    expand: true,
                    spawn: false,
                    open: true,
                    livereload: '<%=connect.options.livereload%>' //监听前面声明的端口  35729
                },
                files: [ //下面文件的改变就会实时刷新网页
                    'html/*.html',
                    'html/common/*.ejs',
                    'style/{,*/}*.{png,jpg,gif,css,less}',
                    'script/{,*/}*.js'
                ]
            },
            less: {
                files: '*.less',
                tasks: ['less:build'],
                options: {
                    cwd: 'style/less/',
                    spawn: false
                }
            },
            ejs: {
                files: 'html/*.html',
                tasks: ['ejs:watch'],
                options: {
                    cwd: '',
                    spawn: false
                }
            },
            ejsTemp: {
                files: '*.ejs',
                tasks: ['ejs:build'],
                options: {
                    cwd: 'html/common/',
                    spawn: false
                }
            },
            copy:{
                files: '{,*/}*.js',
                tasks: ['copy:watch'],
                options: {
                    cwd: 'script/',
                    spawn: false
                }
            }
        }
    }); 

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-ejs');


    grunt.event.on('watch', function(action, filepath, target) {
       console.log('action is:' + action + ', filepath is:' + filepath + ', target is:' + target);
        if (action === 'changed') {
            if (target === 'less') {
                var filtOut = 'dest\\' + filepath.replace('\\less\\', '\\css\\').replace('.less', '.css');
                grunt.config.set('paramIn', filepath);
                grunt.config.set('paramOut', filtOut);
            } else if (target === 'ejs') {
                var filtOut = 'dest\\' + filepath;
                //grunt.config.set('action', 'watch');
                grunt.config.set('paramIn', filepath);
                grunt.config.set('paramOut', filtOut);
            } else if (target === 'copy') {
                grunt.config.set('paramIn', filepath);
                //console.log(filepath.replace(/\//g, '/'))
            }
            //console.log(filepath.lastIndexOf("/"));
            //grunt.config.set('paramOutForReplace', filepath.substring(0, filepath.lastIndexOf("/")));
        }
    });

    grunt.registerTask('default', ['clean:build', 'copy:build', 'uglify', 'ejs:buildLess', 'less:build', 'ejs:build', 'connect:server', 'watch']);
    grunt.registerTask('server', ['clean:build', 'copy:build', 'uglify', 'ejs:buildLess', 'less:build', 'ejs:build']);
};