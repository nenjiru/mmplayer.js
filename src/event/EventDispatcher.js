/*
 * Event Dispatcher
 */
;(function (global)
{
    "use strict";

    // namespace
    global.cmn = global.cmn || {};
    global.cmn.event = global.cmn.event || {};

    //--------------------------------------------------------------------------
    //  Import
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    //  Static variables
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    //  Class definition
    //--------------------------------------------------------------------------
    /**
     * Event object
     * @param {Object} target
     * @param {String} type
     * @param {Object} data
     * @constructor
     */
    var Event = function(target, type, data)
    {
        this.target = target;
        this.type = type;
        this.data = data;
    };

    /**
     * @class EventDispatcher
     * @constructor
     **/
    var EventDispatcher = function ()
    {
        /*** @type {Object} */
        var listeners = {};

        /**
         * Add listener
         * @param {String} type Event type
         * @param {Function} listener Callback function
         */
        this.addEventListener = function(type, listener)
        {
            (listeners[type] || (listeners[type] = [])).push(listener);
        };

        /**
         * Has listener
         * @param {String} type Event type
         * @return {Boolean}
         */
        this.hasEventListener = function(type)
        {
            return !!listeners[type];
        };

        /**
         * Remove listener
         * @param {String} type Event type
         * @param {Function} listener Callback function
         */
        this.removeEventListener = function(type, listener)
        {
            var fncs = listeners[type];

            if(fncs)
            {
                for (var i = fncs.length-1; i >= 0; i--)
                {
                    if (fncs[i] === listener)
                    {
                        fncs.splice(i, 1);
                    }
                }
            }
        };

        /**
         * One event listener
         * @param {String} type Event type
         * @param {Function} listener Callback function
         */
        this.onesEventListener = function(type, listener)
        {
            var self = this,
                callback = function (event)
                {
                    self.removeEventListener(type, callback);
                    listener.apply(self, [event]);
                    callback = null;
                };

            this.addEventListener(type, callback);
        };

        /**
         * Dispatch event message
         * @param {String} type Event type
         * @param {Object} data Attach data
         */
        this.dispatchEvent = function(type, data)
        {
            var fncs = listeners[type],
                event = new Event(this, type, data);

            if(fncs)
            {
                fncs = fncs.concat();
                for (var i = 0, n = fncs.length; i < n; i++)
                {
                    fncs[i].apply(this, [event]);
                }
            }
        }
    };

    //--------------------------------------------------------------------------
    //  Class member
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    //  Private methods
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    //  Export
    //--------------------------------------------------------------------------
    global.cmn.event.EventDispatcher = EventDispatcher;

}(this));