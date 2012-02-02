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
 * This class is reponsible for rendering a single letter of the grid
 * adding various effects/animations as per the state of the letter
*/
(function(undefined) {
    NumberMaze.LetterSprite         =   function(ch, x, y) {
        var self                    =   this;

        /** ASCII char rendered by this object
         *  @type char
         *  @public */
        this.character              =   ch;

        /** x position of the object to render at
         *  @type int
         *  @public */
        this.x                      =   x;

        /** y position of the object to render at
         *  @type int
         *  @public */
        this.y                      =   y;

        /** radius of the revolving arc
         *  @type int
         *  @public */
        this.radius                 =   20;

        /** flag that represents if the arc is revolving now
         *  @type bool
         *  @public */
        this.circling               =   true;

        /** current revolving angle
         *  @type int
         *  @private */
        var angle                   =   0;

        /** revolving speed of the arc
         *  @type double
         *  @private */
        var delAngle                =   Math.PI;

        /** length of the are to draw on screen
         *  @type double
         *  @private */
        var arcLength               =   Math.PI / 4.0;

        /** x displacement for shaking effect
         *  @type int
         *  @private */
        var dx                      =   0;

        /** y displacement for shaking effect
         *  @type int
         *  @private */
        var dy                      =   0;

        /** maximum vibration displacement
         *  @type int
         *  @private */
        var delVibrate              =   6.0;

        this.resizeLayout           =   function(tWidth, tHeight) {
            self.radius             =   tWidth / 32;
        };

        this.collided               =   function() {
            self.circling           =   false;
        };

        this.update                 =   function(dt) {
            if(self.circling == true) {
                angle               +=  delAngle * dt;
            } else {
                if(arcLength < 3.14) {
                    arcLength       *=  1.02;
                    delAngle        *=  1.005;
                    dx              =   Math.random() * delVibrate - delVibrate / 2;
                    dy              =   Math.random() * delVibrate - delVibrate / 2;
                    angle           +=  delAngle * dt;
                } else {
                    dx              =   0;
                    dy              =   0;
                }
            }
        };

        /** renders the character and the arc around it
         * @public */
        this.draw                   =   function(ctx) {
            ctx.fillText(self.character, self.x + dx - self.radius/4, self.y + dy + self.radius/4);
            ctx.moveTo(self.x + dx + self.radius * Math.cos(angle), self.y + dy + self.radius * Math.sin(angle));
            ctx.arc(self.x + dx, self.y + dy, self.radius, angle, angle - arcLength, true);
            ctx.moveTo(self.x + dx + self.radius * Math.cos(angle + 3.14), self.y + dy + self.radius * Math.sin(angle + 3.14));
            ctx.arc(self.x + dx, self.y + dy, self.radius, angle + 3.14, angle - arcLength + 3.14, true);
        };
    };
})();
