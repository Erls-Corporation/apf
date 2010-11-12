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
 * Specifies the upper bounds for numeric values (the value must be less than this value)
 */
var XsdMaxExclusive = function(struct, tagName){
    XsdElement.call(this, tagName || "maxexclusive", this.NODE_HIDDEN, struct);
};

oop.inherit(XsdMaxExclusive, XsdElement);


(function(){
    this.$propHandlers["value"] = function(){
        this.parentNode.$recompile();
    };
    
    this.$compile = function(stack){
        stack.push("if (parseFloat(value) =< " + this.value + ") return false;");
    };
}).call(XsdMaxExclusive.prototype);

apf.xsd.setElement("maxexclusive", apf.XsdMaxExclusive);

module.exports = XsdMaxExclusive;

});