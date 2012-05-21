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
    NumberMaze.LetterSprite         =   function(ch, x, y, gx, gy) {
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

        /** x position of the object in the grid
         *  @type int
         *  @public */
        this.gridX                  =   gx;

        /** y position of the object in the grid
         *  @type int
         *  @public */
        this.gridY                  =   gy;

        /** radius of the revolving arc
         *  @type int
         *  @public */
        this.radius                 =   20;

        /** delta radius of the revolving arc
         *  @type int
         *  @public */
        this.dRadius                =   5;

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
        this.arcLength               =   Math.PI / 4.0;

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

        /** state of the game
         *  @type int
         *  @private */
        var state                   =   NumberMaze.State;

        this.resizeLayout           =   function(tWidth, tHeight) {
            self.radius             =   tWidth / 32;
        };

        /** this method changes the state to 'hit', thus showing
         *  the hit animation */
        this.jingle                 =   function() {
            state.gridStatus[self.gridX][self.gridY] = 2;
        };

        /** this method changes the state to 'explode', thus showing
         *  the explosion animation */
        this.explode                =   function() {
            state.gridStatus[self.gridX][self.gridY] = 4;
        };

        this.open                   =   function() {
            self.reset();
            state.gridStatus[self.gridX][self.gridY] = 1;
        };

        this.reset                  =   function() {
            dx                      =   0;
            dy                      =   0;
            state.gridStatus[self.gridX][self.gridY] = 0;
            self.arcLength               =   Math.PI / 4.0;
            delAngle                =   Math.PI;
            self.radius             =   state.gameWidth / 32;
        };

        this.update                 =   function(dt) {
            var st                  =   state.gridStatus[self.gridX][self.gridY];
            if(st == 0) {
                angle               +=  delAngle * dt;
            } else if(st == 1) {
                angle               +=  delAngle * dt * -2;
                self.radius         +=  self.dRadius / 5.0;
                if (self.radius > state.gameWidth / 32 || self.radius < state.gameWidth / 64)
                    self.dRadius    *=  -1;
            } else if(st == 2) {
                if(self.arcLength < 3.14) {
                    self.arcLength  *=  1.02;
                    delAngle        *=  1.005;
                    dx              =   Math.random() * delVibrate - delVibrate / 2;
                    dy              =   Math.random() * delVibrate - delVibrate / 2;
                    angle           +=  delAngle * dt;
                } else {
                    self.radius     =   state.gameWidth / 64;
                    state.gridStatus[self.gridX][self.gridY] = 3;
                    dx              =   0;
                    dy              =   0;
                }
            } else if (st == 4) {
                self.arcLength      *=  0.95;
                delAngle            *=  1.01;
                dx                  =   Math.random() * delVibrate * 2 - delVibrate;
                dy                  =   Math.random() * delVibrate * 2 - delVibrate;
                angle               +=  delAngle * dt;
                self.radius         *=  1.01;
                if (self.radius > state.gameWidth / 16) {
                    state.gridStatus[self.gridX][self.gridY] = 3;
                }
            }
        };

        /** renders the character and the arc around it
         * @public */
        this.draw                   =   function(ctx) {
            ctx.moveTo(self.x + dx + self.radius * Math.cos(angle), self.y + dy + self.radius * Math.sin(angle));
            ctx.arc(self.x + dx, self.y + dy, self.radius, angle, angle - self.arcLength, true);
            ctx.moveTo(self.x + dx + self.radius * Math.cos(angle + 3.14), self.y + dy + self.radius * Math.sin(angle + 3.14));
            ctx.arc(self.x + dx, self.y + dy, self.radius, angle + 3.14, angle - self.arcLength + 3.14, true);
        };
        var frame = 0;
    };
})();
