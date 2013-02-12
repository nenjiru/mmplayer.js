/*
 * Middle Media Player
 */
;(function (global)
{
    "use strict";

    // namespace
    global.cmn = global.cmn || {};
    global.cmn.display = global.cmn.display || {};

    //--------------------------------------------------------------------------
    //  Import
    //--------------------------------------------------------------------------
    var EventDispatcher = global.cmn.event.EventDispatcher;

    //--------------------------------------------------------------------------
    //  Static variables
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    //  Class definition
    //--------------------------------------------------------------------------
    /**
     * @class MiddleMediaPlayer
     * @param canvas {Object} HTML Element
     * @param audio {Object} HTML Element
     * @param duration {Number} Play time (sec)
     * @param src {String} Image file name
     * @param total {Number} Frame number
     * @constructor
     * @extends EventDispatcher
     **/
    var MiddleMediaPlayer = function (canvas, audio, duration, src, total)
    {
        //extend EventDispatcher
        EventDispatcher.apply(this);

        var _enterframe = null,
            _prevFrameTime = 0;

        /**
         * Frame images.
         * @type {Array.<Image>}
         * @public
         */
        this.frame = [];

        /**
         * Play start.
         * @public
         */
        this.play = function ()
        {
            //skip if already being played
            if (_enterframe === null && this.frame.length > 100)
            {
                var self = this,
                    frame = self.frame,
                    movie = canvas.getContext('2d'),
                    width = canvas.width,
                    height = canvas.height,
                    currentTime,
                    image,
                    num;

                //start playing
                self.dispatchEvent(MiddleMediaPlayer.START);

                //start drawing
                _enterframe = setInterval(function ()
                {
                    currentTime = audio.currentTime;

                    //comparing last frame number with current frame number
                    if (_prevFrameTime === currentTime)
                    {
                        //stop when there's no change
                        self.stop();
                        self.dispatchEvent(MiddleMediaPlayer.PAUSE);
                    }
                    else
                    {
                        //update canvas image
                        num = ~~(currentTime / duration * total);
                        image = frame[num];
                        if (image.width && image.height)
                        {
                            movie.drawImage(image, 0, 0, width, height);
                        }

                        //update current frame
                        self.currentFrame = num;
                        self.dispatchEvent(MiddleMediaPlayer.UPDATE, num);
                    }

                    //store played time
                    _prevFrameTime = currentTime;

                }, 1000/MiddleMediaPlayer.FPS);
            }
        };

        /**
         * Play stop.
         * @public
         */
        this.stop = function ()
        {
            clearInterval(_enterframe);
            _enterframe = null;
        };

        /**
         *
         * Start load.
         * @public
         */
        this.load = function ()
        {
            var self = this,
                loader,
                frame = self.frame,
                files = _fileList(src, total);

            //start loading
            loader = setInterval(function ()
            {
                //load images
                var image = new Image();
                image.src = files.shift();
                frame.push(image);

                //bind onload handle
                image.onload = function (event)
                {
                    image.onload = null;
                    self.dispatchEvent(MiddleMediaPlayer.PROGRESS, frame.length);

                    if (frame.length >= total)
                    {
                        self.dispatchEvent(MiddleMediaPlayer.COMPLETE, frame);
                    }
                };

                if (files.length === 0)
                {
                    clearInterval(loader);
                }
            }, 25);
        };

        /**
         * Audio ended handler
         * @private
         */
        function _onEnded()
        {
            this.stop();
            this.dispatchEvent(MiddleMediaPlayer.ENDED);
        }

        //bind audio event handlers
        audio.addEventListener('ended', _proxy(_onEnded, this));
        audio.addEventListener('timeupdate', _proxy(this.play, this));
    };

    //--------------------------------------------------------------------------
    //  Class member
    //--------------------------------------------------------------------------
    /**
     * Video update fps.
     * @type {String}
     * @static
     **/
    MiddleMediaPlayer.FPS = 30;

    /**
     * Frame image loading event.
     * @type {String}
     * @static
     **/
    MiddleMediaPlayer.PROGRESS = 'mmplayer_progress';

    /**
     * Frame image loaded event.
     * @type {String}
     * @static
     **/
    MiddleMediaPlayer.COMPLETE = 'mmplayer_complete';

    /**
     * Video playing.
     * @type {String}
     * @static
     **/
    MiddleMediaPlayer.UPDATE = 'mmplayer_update';

    /**
     * Video start.
     * @type {String}
     * @static
     **/
    MiddleMediaPlayer.START = 'mmplayer_start';

    /**
     * Video pause.
     * @type {String}
     * @static
     **/
    MiddleMediaPlayer.PAUSE = 'mmplayer_pause';

    /**
     * Video ended.
     * @type {String}
     * @static
     **/
    MiddleMediaPlayer.ENDED = 'mmplayer_ended';

    //--------------------------------------------------------------------------
    //  Private methods
    //--------------------------------------------------------------------------
    /**
     * Image path format
     * @private
     */
    function _fileList(src, total)
    {
        var file = [],
            path = src.split('/'),
            filename = path[path.length - 1],
            extension = filename.split('.')[1],
            zeroPadding = filename.match(/\d+/)[0],
            zeroTrimming = -zeroPadding.length;

        path.pop();
        path = path.join('/');

        for (var i = 1, n = total + 1, num; i < n; i++)
        {
            if (zeroPadding.length > 1)
            {
                //zero padding
                num = (zeroPadding + i).slice(zeroTrimming);
            }
            else
            {
                //increment
                num = String(i);
            }

            file.push(path +'/'+ num +'.'+ extension);
        }

        return file;
    }

    /**
     * Scope bind.
     * @param {Function} func
     * @param {Object} context
     * @return {Function}
     * @static
     */
    function _proxy(func, context)
    {
        return function ()
        {
            return func.apply(context, arguments);
        }
    }

    //--------------------------------------------------------------------------
    //  Export
    //--------------------------------------------------------------------------
    global.cmn.display.MiddleMediaPlayer = MiddleMediaPlayer;
    global.mmplayer = MiddleMediaPlayer;

}(this));