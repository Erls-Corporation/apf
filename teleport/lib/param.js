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

/**
 * element specifying an argument of a method in an rpc element.
 * @attribute {String}  name             the argument name.
 * @attribute {String}  [value]          the value of the argument.
 * @attribute {String}  [default]        the default value of the argument. If
 *                                       no value is specified when this function
 *                                       is called, the default value is used.
 */
var Param = function(struct, tagName){
    DOMElement.call(this, tagName || "param", this.NODE_HIDDEN, struct);
};

oop.inherits(Param, DOMElement);

Param.prototype.$parsePrio = "002";

aml && aml.setElement("param", Param);

module.exports = Param;

});