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
 * and showing the circling animations around the letter
*/
(function(undefined) {
    NumberMaze.LetterSprite         =   function(ch, x, y) {
        var self                    =   this;
        var gConfig                 =   NumberMaze.GameConfig;
        this.character              =   ch;
        this.x                      =   x;
        this.y                      =   y;
        this.radius                 =   20;
        this.angle                  =   0;
        this.delAngle               =   0.1;
        this.circle                 =   true;

        this.resizeLayout           =   function(){
        };

        this.collided               =   function() {
            self.circle             =   false;;
        };

        this.update                 =   function(dt) {
            if(self.circle == true) {
                self.angle          +=  this.delAngle;
            } else {
                if(self.delAngle < 3.14) {
                    self.delAngle   +=  0.01;
                    self.angle      +=  this.delAngle;
                } else {
                }
            }
        };

        this.draw                   =   function(ctx) {
            ctx.fillText(self.character, self.x, self.y);
            ctx.moveTo(self.x + self.radius * Math.cos(self.angle), self.y + self.radius * Math.sin(self.angle));
            ctx.arc(self.x, self.y, self.radius, self.angle, self.angle - 0.85, true);
            ctx.moveTo(self.x + self.radius * Math.cos(self.angle + 3.14), self.y + self.radius * Math.sin(self.angle + 3.14));
            ctx.arc(self.x, self.y, self.radius, self.angle + 3.14, self.angle - 0.85 + 3.14, true);
        };
    };
})();
