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
        this.rowCount               =   gConfig.rowCount;
        this.colCount               =   gConfig.colCount;
        var cellWidth               =   (g.gameCanvas.width / self.colCount);
        var cellHeight              =   (g.gameCanvas.height / self.rowCount);
        this.letterArray            =   new Array();

        for(var k = 0; k < 12; k++) {
            var i                   =   Math.floor(k / this.colCount);
            var j                   =   k % this.colCount;
            var x                   =   cellWidth * j + cellWidth / 2;
            var y                   =   cellHeight * i + cellHeight / 2;
            var ltr                 =   new NumberMaze.LetterSprite(k, x, y);
            this.letterArray.push(ltr);
        }

        this.resizeLayout           =   function(){
        };

        this.update                 =   function(dt) {
            for(var k = 0; k < 12; k++) {
                self.letterArray[k].update(dt);
            }
        };

        this.draw                   =   function(ctx) {
            ctx.beginPath();
            for(var i = 0; i < 12; i++) {
                self.letterArray[i].draw(ctx);
            }
            ctx.stroke();
        };
    };
})();
