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


//#ifdef __WITH_ASYNC

/**
 * @author      Fabian Jakobs
 * @version     %I%, %G%
 * @since       1.0
 *
 * @namespace apf
 *
 */

/**
 * Perform an async function in serial on each of the list items
 * 
 * @param {Array} list
 * @param {Function} async async function of the form function(item, callback)
 * @param {Function} callback function of the form function(error), which is
 *      called after all items have been processed
 */
apf.asyncForEach = function(list, async, callback) {
    if (!list.length) return callback(null, []);
    var copy = list.concat();

    async(copy.shift(), function handler(err) {
        if (err) return callback(err);

        if (copy.length) {
            async(copy.shift(), handler);
        } else {
            callback(null);
        }
    });
};


/**
 * Map each element from the list to the result returned by the async mapper
 * function. The mapper takes an element from the list and a callback as arguments.
 * After completion the mapper has to call the callback with an (optional) error
 * object as first and the result of the map as second argument. After all
 * list elements have been processed the last callback is called with the mapped
 * array as second argument.
 * 
 * @param {Array} list
 * @param {Function} mapper function of the form function(item, next)
 * @param {Function} callback function of the form function(error, result)
 */
apf.asyncMap = function(list, mapper, callback) {
    if (!list.length) return callback(null, []);

    var copy = list.concat();
    var map = [];

    mapper(copy.shift(), function handler(err, value) {
        map.push(value);
        if (copy.length) {
            mapper(copy.shift(), handler);
        } else {
            callback(null, map);
        }
    });
};


/**
 * Chains an array of functions. Each of the functions except the last one must
 * have excatly one 'callback' argument, which has to be called after the functions has
 * finished. If the callback fails if has to pass a non null error object as
 * first argument to the callback.
 * 
 * @param {Array} funcs
 */
apf.asyncChain = function(funcs) {
    var copy = funcs.concat();
    function next() {
        var f = copy.shift();
        if (f)
            f(next)
    }
    
    next();
}
//#endif __WITH_ASYNC