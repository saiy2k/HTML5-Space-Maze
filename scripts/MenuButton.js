/*
Copyright 2011 Saiyasodharan (http://saiy2k.blogspot.com/)

This file is part of the open source game, Number Maze

Number Maze is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Number Maze is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Number Maze.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * This class renders a small button on the screen with the given text.
 * The appearance of the button can be customized to certain extent
 * by manipulating the appropriate properties.
 * It also handles the click event of self and invokes the subscribed delegate.
*/
(function(undefined) {
    NumberMaze.MenuButton           =   function(str, x, y, width, height) {
        var self                    =   this;

        /** delegate
         *  @type object
         *  @public */
        this.delegate;

        /** Text of this button
         *  @type char
         *  @public */
        this.text                   =   str;

        /** x position of the object to render at
         *  @type int
         *  @public */
        this.x                      =   x;

        /** y position of the object to render at
         *  @type int
         *  @public */
        this.y                      =   y;

        /** width of the object to render at
         *  @type int
         *  @public */
        this.width                  =   width;

        /** height of the object to render at
         *  @type int
         *  @public */
        this.height                 =   height;

        /** current revolving angle
         *  @type int
         *  @private */
        var angle                   =   0;

        /** revolving speed of the arc
         *  @type double
         *  @private */
        var delAngle                =   Math.PI;

        /** x displacement for shaking effect
         *  @type int
         *  @private */
        var dx                      =   0;

        /** y displacement for shaking effect
         *  @type int
         *  @private */
        var dy                      =   0;

        /** line Oscillation height
         *  @type int
         *  @private */
        var lineOsc                 =   0;
        var dLineOsc                =   1.0;
        var over                    =   false;

        this.resizeLayout           =   function(tWidth, tHeight) {
        };

        this.reset                  =   function() {
            dx                      =   0;
            dy                      =   self.height / 2;
            arcLength               =   Math.PI / 4.0;
            delAngle                =   Math.PI;
            lineOsc                 =   self.height / 2;
        };

        this.mousedown              =   function(tx, ty) {
            if(tx > self.x && tx < self.x + self.width && ty > self.y && ty < self.y + self.height) {
                self.delegate.click(self);
            }
        };

        this.mousemove              =   function(tx, ty) {
            if(tx > self.x && tx < self.x + self.width && ty > self.y && ty < self.y + self.height) {
                over                =   true;
            } else {
                over                =   false;
                lineOsc             =   self.height / 2;
            }
        };

        this.update                 =   function(dt) {
            if(over) {
                lineOsc                 +=  dLineOsc;
                if (lineOsc > self.height || lineOsc < 0)
                    dLineOsc            *=  -1;
            }
        };

        /** renders the text and the arc around it
         * @public */
        this.draw                   =   function(ctx) {
            ctx.beginPath();
            ctx.quadraticCurveTo(self.x, self.y + self.height / 2, self.x, self.y + self.height / 2);
            ctx.quadraticCurveTo(self.x + self.width / 2, self.y + self.height / 2 + lineOsc, self.x + self.width, self.y + self.height / 2);
            ctx.stroke();
            ctx.closePath();
            ctx.fillText(self.text, self.x + self.width / 2 + dx, self.y + dy);
        };

        this.reset();
    };
})();
