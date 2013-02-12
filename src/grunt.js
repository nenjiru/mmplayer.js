module.exports = function(grunt)
{

    var DEST = '../mmplayer.js';

    grunt.initConfig({

        //META data
        meta: {
            banner: '/*!\n' +
                ' * mmplayer.js - version 0.0.1\n' +
                ' * is Middle Media Player.\n' +
                ' * http://github.com/nenjiru/mmplayer.js\n' +
                ' * \n' +
                ' * Build on <%= grunt.template.today("yyyy-mm-dd HH:MM") %>\n' +
                ' * Copyright (C) 2013, Minoru Nakanou\n' +
                ' * Licensed under the MIT License.\n' +
                ' */'
        },

        //JS Concat
        concat : {
            dist : {
                src : ['<banner:meta.banner>'].concat(['./event/EventDispatcher.js', './display/MiddleMediaPlayer.js']),
                dest : DEST 
            }
        },

        //JS Minify
        min : {
            dist : {
                src : ['<banner:meta.banner>', DEST],
                dest : DEST
            }
        }
    });

    grunt.registerTask('default', 'concat min');
};

