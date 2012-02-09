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
        var cellWidth               =   0;
        var cellHeight              =   0;
        this.letterArray            =   new Array();

        this.reset                  =   function() {
            for(var i = 0; i < 12; i++)
                self.letterArray[i].reset();
        };

        this.resizeLayout           =   function(tWidth, tHeight){
            cellWidth               =   (tWidth / self.colCount);
            cellHeight              =   (tHeight / self.rowCount);
            for(var k = 0; k < 12; k++) {
                var i                   =   Math.floor(k / self.colCount);
                var j                   =   k % self.colCount;
                self.letterArray[k].x   =   cellWidth * j + cellWidth / 2;
                self.letterArray[k].y   =   cellHeight * i + cellHeight / 2;
                self.letterArray[k].resizeLayout(tWidth, tHeight);
            }
       };

        this.collidesWith           =   function(pt) {
            for(var k = 0; k < 12; k++) {
                if(self.letterArray[k].circling && Math.dist({x:self.letterArray[k].x, y:self.letterArray[k].y}, pt) < self.letterArray[k].radius) {
                    self.letterArray[k].collided();
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
