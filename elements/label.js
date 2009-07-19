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
// #ifdef __JLABEL || __INC_ALL
// #define __JBASESIMPLE 1

/**
 * Element displaying a text in the user interface, usually specifying
 * a description of another element. When the user clicks on the label it 
 * can set the focus to the connected aml element.
 * Example:
 * The aml label element is used in the same way as the html label element. This
 * example shows the label as a child of a form element. It is rendered outside
 * to the element.
 * <code>
 *  <a:textbox ref="address">
 *      <a:label>Address</a:label>
 *  </a:textbox>
 * </code>
 * Example:
 * This example uses the for attribute to connect the label to the form element.
 * <code>
 *  <a:label for="txtAddress">Address</a:label>
 *  <a:textbox id="txtAddress" ref="address" />
 * </code>
 *
 * @constructor
 * @allowchild {smartbinding}
 * @addnode elements
 *
 * @inherits apf.BaseSimple
 *
 * @author      Ruben Daniels (ruben AT javeline DOT com)
 * @version     %I%, %G%
 * @since       0.4
 *
 * @binding value  Determines the way the value for the element is retrieved 
 * from the bound data.
 * Example:
 * Sets the label text based on data loaded into this component.
 * <code>
 *  <a:label>
 *      <a:bindings>
 *          <a:value select="@text" />
 *      </a:bindings>
 *  </a:label>
 * </code>
 * Example:
 * A shorter way to write this is:
 * <code>
 *  <a:label ref="@text" />
 * </code>
 */

apf.label = apf.component(apf.NODE_VISIBLE, function(){
    var _self = this;
    
    this.$focussable = false;
    var forElement;
    
    // #ifdef __WITH_EDITMODE
    this.editableParts = {
        "main": [["caption", "text()"]]
    };
    // #endif
    
    /**
     * Sets the value of this element. This should be one of the values
     * specified in the values attribute.
     * @param {String} value the new value of this element
     */
    this.setValue = function(value){
        this.setProperty("value", value);
    };
    
    /**
     * Returns the current value of this element.
     * @return {String}
     */
    this.getValue = function(){
        return this.value;
    }
    
    /** 
     * @attribute {String} value the text displayed in the area defined by this 
     * element. Using the value attribute provides an alternative to using
     * the text using a text node.
     *
     * @attribute {String} for the id of the element that receives the focus 
     * when the label is clicked on.
     */
    this.$supportedProperties.push("caption", "value", "for");
    this.$propHandlers["caption"] = 
    this.$propHandlers["value"]   = function(value){
        this.oInt.innerHTML = value;
    };
    this.$propHandlers["for"] = function(value){
        forElement = typeof value == "string" ? self[value] : value;
    };

    this.$draw = function(){
        //Build Main Skin
        this.oExt = this.$getExternal();
        this.oInt = this.$getLayoutNode("main", "caption", this.oExt);
        if (this.oInt.nodeType != 1) 
            this.oInt = this.oInt.parentNode;
        
        this.oExt.onmousedown = function(){
            if (forElement && forElement.$focussable && forElement.focussable)
                forElement.focus();
        }
    };
    
    this.$loadAml = function(x){
        if (apf.isOnlyChild(x.firstChild, [3,4]))
            this.setProperty("value", x.firstChild.nodeValue.trim());
        else
            apf.AmlParser.parseChildren(this.$aml, this.oInt, this);
    };
}).implement(
    //#ifdef __WITH_DATABINDING
    apf.DataBinding,
    //#endif
    apf.BaseSimple
)

//#endif
