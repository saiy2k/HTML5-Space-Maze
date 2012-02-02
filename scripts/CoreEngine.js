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
 * This is the core game engine which manages several sub components to
 * handle leveling, scoring, grid setup, free hand drawing, collision detection,
 * game mechanics, etc.,
*/
(function(undefined) {
    NumberMaze.CoreEngine           =   function(g) {
        var self                    =   this; 
        var lastPoint               =   {x:0, y:0};
        var gConfig                 =   NumberMaze.GameConfig;
        var grid                    =   new NumberMaze.GridLayer(g);
        this.pointArray             =   new Array();

        this.addPoint               =   function(tx, ty) {
            var pt                  =   {x:tx, y:ty};
            var dist                =   Math.sqrt((lastPoint.x - tx) * (lastPoint.x - tx) + (lastPoint.y - ty) * (lastPoint.y - ty));
            if (dist > gConfig.lineDelta) {
                self.pointArray.push(pt);
                lastPoint           =   pt;

                if(grid.collidesWith(pt))
                    console.log('collision detected');
            }
        };

        this.resizeLayout           =   function(tWidth, tHeight) {
            grid.resizeLayout(tWidth, tHeight);
            //TODO:
            //scale all the points in pointArray to new dimensions
        };

        this.update                 =   function(dt) {
            grid.update(dt);
        };

        this.draw                   =   function(ctx) {
            ctx.clearRect(0, 0, 640, 480);

            ctx.beginPath();
            for(var i = 0; i < self.pointArray.length; i++) {
                ctx.lineTo(self.pointArray[i].x, self.pointArray[i].y);
            }
            ctx.stroke();

            grid.draw(ctx);
        };
    };
})();  
