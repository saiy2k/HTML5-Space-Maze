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
 * This class renders the number grid and provides helper methods
 * to detect collision between the grid and the given points/lines.
*/
(function(undefined) {
    NumberMaze.GridLayer            =   function(g) {
        var self                    =   this;
        var gConfig                 =   NumberMaze.GameConfig;
        var state                   =   NumberMaze.State;

        /** reference to the object which subscribes to events in the GridLayer
         *  any object that implements the following functions:
         *      touchedTargetPoint()
         *      touchedWrongPoint()
         *      touchedAllPoints()
         *  @type object
         *  @public */
        this.delegate               =   null;

        /** width of the single cell that holds a number
         *  @type int
         *  @private */
        var cellWidth               =   0;

        /** height of the single cell that holds a number
         *  @type int
         *  @private */
        var cellHeight              =   0;

        /** array of letter objects that handles the animations of
         *  individual letters
         *  @type LetterSprite
         *  @private */
        this.letterArray            =   new Array();

        /** resets the state for a fresh new game */
        this.reset                  =   function() {
            for(var i = 0; i < 12; i++)
                self.letterArray[i].reset();
        };

        /** updates the cellWidth and cellHeight as per new game area.
         *  also updates the position of the numbers  */
        this.resizeLayout           =   function(tWidth, tHeight){
            cellWidth               =   (tWidth / gConfig.colCount);
            cellHeight              =   (tHeight / (gConfig.rowCount + 1));
            for(var k = 0; k < 12; k++) {
                var i                   =   Math.floor(k / gConfig.colCount);
                var j                   =   k % gConfig.colCount;
                self.letterArray[k].x   =   cellWidth * j + cellWidth / 2;
                self.letterArray[k].y   =   cellHeight * i + cellHeight / 2 + tHeight * 0.2;
                self.letterArray[k].resizeLayout(tWidth, tHeight);
            }
        };

        /** function to check if the given point collides with any of the
         *  numbers. If collision is detected then based on the number's state
         *  corresponding action is taken */
        this.collidesWith           =   function(pt) {
            for(var k = 0; k < 12; k++) {
                if(self.letterArray[k].circling && Math.dist({x:self.letterArray[k].x, y:self.letterArray[k].y}, pt) < self.letterArray[k].radius) {
                    var i, j;
                    i               =   Math.floor(k / gConfig.colCount);
                    j               =   Math.floor(k % gConfig.colCount);
                    if (state.grid[i][j] == 0) {
                        self.letterArray[k].collided();
                        if(self.delegate)
                            self.delegate.touchedTargetPoint();
                    } else {
                        if(self.delegate)
                            self.delegate.touchedWrongPoint();
                    }
                }
            }
        };

        this.update                 =   function(dt) {
            for(var k = 0; k < 12; k++) {
                self.letterArray[k].update(dt);
            }
        };

        this.draw                   =   function(ctx) {
            ctx.fillStyle           =   'rgba(50, 50, 90, 0.2)';
            ctx.strokeStyle         =   'rgba(50, 50, 020, 0.8)';
            ctx.lineWidth           =   cellWidth/70;
            for(var i = 0; i < 12; i++) {
                ctx.beginPath();
                ctx.arc(self.letterArray[i].x, self.letterArray[i].y, self.letterArray[i].radius, 0, Math.PI*2, false);
                ctx.fill();
            }
            ctx.beginPath();
            ctx.fillStyle           =   '#444';
            ctx.font                =   'bold ' + cellWidth/14 + 'px Iceberg';
            for(var i = 0; i < 12; i++) {
                self.letterArray[i].draw(ctx);
            }
            ctx.stroke();
        };
        
        for(var k = 0; k < 12; k++) {
            var ltr                 =   new NumberMaze.LetterSprite(k, 0, 0);
            this.letterArray.push(ltr);
        }
        this.resizeLayout(g.gameCanvas.width, g.gameCanvas.height);

    };
})();
