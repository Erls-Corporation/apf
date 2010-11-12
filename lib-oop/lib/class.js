/*
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 *
 */

module.declare(function(require, exports, module){

var classCount = 0;

/**
 * All elements that implemented this {@link term.baseclass baseclass} have
 * {@link term.propertybinding property binding},
 * event handling and constructor & destructor hooks. The event system is 
 * implemented following the W3C specification, similar to the 
 * {@link http://en.wikipedia.org/wiki/DOM_Events event system of the HTML DOM}.
 *
 * @constructor
 * @baseclass
 *
 * @author      Ruben Daniels (ruben AT ajax DOT org)
 * @version     %I%, %G%
 * @since       0.8
 *
 * @event propertychange Fires when a property changes.
 *   object:
 *     {String} name          the name of the changed property
 *     {Mixed}  originalvalue the value it had before the change
 *     {Mixed}  value         the value it has after the change
 *
 */
var Class = function(){
    this.$captureStack = {};
    this.$eventsStack  = {};
    this.$funcHandlers = {};
    
    //Temporary hack until refactor
    this.$uniqueId = Class.all.push(this) - 1;//++classCount;
    
    if (this.$bufferEvents) {
        for (var i = 0, l = this.$bufferEvents.length; i < l; i++) {
            this.addEventListener.apply(this, this.$bufferEvents[i]);
        }
        delete this.$bufferEvents;
    }
};

Class.lookup = function(id){return this.all[id]}; //Temporary hack until refactor
Class.all = []; //Temporary hack until refactor

//Big hack to get lookup to work until refactor is complete.
apf = {
    /**
     * Finds a aml element based on it's uniqueId
     */
    lookup : function(uniqueId){
        return Class.all[uniqueId];
    },

    /**
     * Searches in the html tree from a certain point to find the
     * aml element that is responsible for rendering the specified html
     * element.
     * @param {HTMLElement} oHtml the html context to start the search from.
     */
    findHost : function(o){
        while (o && o.parentNode) { //!o.host && 
            try {
                if ((o.host || o.host === false) && typeof o.host != "string")
                    return o.host;
            }
            catch(e){}
            
            o = o.parentNode;
        }
        
        return null;
    }
};

Class.prototype  = new (function(){
    this.$regbase = 0;
    
    /**
     * Tests whether this object has implemented a {@link term.baseclass baseclass}.
     * @param {Number} test the unique number of the {@link term.baseclass baseclass}.
     */
    this.hasFeature = function(test){
        return this.$regbase & test;
    };
    
    /**** Events ****/
    
    /**
     * Calls all functions that are registered as listeners for an event.
     *
     * @param  {String}  eventName  the name of the event to dispatch.
     * @param  {Object}  e          the event object passed through.
     * @return {mixed} return value of the event
     */
    this.dispatchEvent = function(eventName, e) {
        if (!this.$eventsStack)
            return;
        
        var listeners = this.$eventsStack[eventName];
        if (!listeners || !listeners.length) 
            return;

        (e || (e = {})).type = eventName;

        for (var i = 0; i < listeners.length; i++)
            listeners[i](e);
    };

    /**
     * Add a function to be called when a event is called.
     *
     * @param  {String}   eventName the name of the event for which to register
     *                              a function.
     * @param  {function} callback  the code to be called when event is dispatched.
     */
    this.addEventListener = function(eventName, callback, useCapture) {
        if (!this.$eventsStack) {
            //Pre constructor event setting. We'll buffer
            (this.$bufferEvents || (this.$bufferEvents = []))
                .push([eventName, callback, useCapture]);
            return;
        }

        var listeners = this.$eventsStack[eventName] 
            || (this.$eventsStack[eventName] = []);

        if (listeners.indexOf(callback) == -1)
            listeners.push(callback);
    };

    /**
     * Remove a function registered for an event.
     *
     * @param  {String}   eventName the name of the event for which to unregister
     *                              a function.
     * @param  {function} callback  the function to be removed from the event stack.
     */
    this.removeEventListener = function(eventName, callback, useCapture) {
        if (!this.$eventsStack)
            return;

        var listeners = this.$eventsStack[eventName];
        if (!listeners)
            return;
        
        var index = listeners.indexOf(callback);
        if (index !== -1)
            listeners.splice(index, 1);
    };
    
    /**
     * Checks if there is an event listener specified for the event.
     *
     * @param  {String}  eventName  the name of the event to check.
     * @return {Boolean} whether the event has listeners
     */
    this.hasEventListener = function(eventName){
        return (this.$eventsStack[eventName] && this.$eventsStack[eventName].length > 0);
    };
    
    /**** Properties ****/
    
    this.setProperty = function(prop, value){
        if (this[prop] == value)
            return;
        
        this[prop] = value;
        
        if (this.$propHandlers)
            this.$propHandlers[prop].call(this, value, prop);
        else if (this.$propertyHandler)
            this.$propertyHandler(prop, value);
    }
    
    this.getProperty = function(prop){
        return this[prop];
    };
})();

module.exports = Class;

    }
);