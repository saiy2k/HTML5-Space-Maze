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
 * This class handles the line drawn by the user, rendering them,
 * checking for collision with itself, and other animations.
*/
(function(undefined) {
    NumberMaze.GameLine             =   function(g) {
        var self                    =   this; 
        var lastPoint               =   {x:0, y:0};
        var gConfig                 =   NumberMaze.GameConfig;
        var breakLines              =   false;
        var breakFactor             =   0;
        var lineSpeed               =   0;
        this.pointArray;

        /** reference to the object which subscribes for game line events
         *  any object that implements the following functions:
         *      lineTouched(),
         *      lineExploded()
         *  @type object
         *  @public */
        this.delegate;

        /** reference to score object
         *  @type NumberMaze.Score
         *  @public */
        this.scoreRef;

        this.resizeLayout           =   function(tWidth, tHeight) {
            //TODO:
            //scale all the points in pointArray to new dimensions
        };

        this.reset                  =   function() {
            breakLines              =   false;
            breakFactor             =   10;
            self.pointArray         =   new Array();
            lineSpeed               =   0.1;
            var pt                  =   {x:NumberMaze.State.gameWidth * 0.07, y:NumberMaze.State.gameHeight * 0.2};
            self.pointArray.push(pt);
        };

        this.addPoint               =   function(tx, ty) {
            if(breakLines)
                return;

            if(tx <= g.gameCanvas.width / 100.0 ||
                    ty <= g.gameCanvas.height / 100.0 ||
                    tx >= 99.0 * g.gameCanvas.width / 100.0 ||
                    ty >= 99.0 * g.gameCanvas.height / 100.0) {
                breakLines          =   true;
                self.delegate.lineTouched();
                return;
            }

            var pt                  =   {x:tx, y:ty};
            var dist                =   Math.sqrt((lastPoint.x - tx) * (lastPoint.x - tx) + (lastPoint.y - ty) * (lastPoint.y - ty));
            if (dist > gConfig.lineDelta) {
                if(self.pointArray.length > 3) {
                    var x1              =   tx;
                    var y1              =   ty;
                    var x2              =   self.pointArray[self.pointArray.length - 1].x;
                    var y2              =   self.pointArray[self.pointArray.length - 1].y;
                    for(var i = 0; i < self.pointArray.length - 2; i++) {
                        var x3          =   self.pointArray[i].x;
                        var y3          =   self.pointArray[i].y;
                        var x4          =   self.pointArray[i+1].x;
                        var y4          =   self.pointArray[i+1].y;
                        if(Math.twoLineIntersects(x1, y1, x2, y2, x3, y3, x4, y4)) {
                            breakLines  =   true;
                            self.delegate.lineTouched();
                            return          false;
                        }
                    }
                }
                self.pointArray.push(pt);
                lastPoint           =   pt;

                return                  true;
            }
            return                      false;
        };

        this.update                 =   function(dt) {
            if(breakLines) {
                for(var i = 0; i < self.pointArray.length; i++) {
                    self.pointArray[i].x -= (640/2 - self.pointArray[i].x)/(100 - breakFactor);
                    self.pointArray[i].y -= (480/2 - self.pointArray[i].y)/(100 - breakFactor);
                }
                breakFactor         *=  1.05;
                if(breakFactor > 100) {
                    self.delegate.lineExploded();
                    self.reset();
                }
            }
        };

        this.draw                   =   function(ctx) {
            var lastPoint           =   self.pointArray.length - 1;
            ctx.lineCap             =   'round';
            ctx.beginPath();
            if(breakLines) {
                ctx.strokeStyle     =   'rgba(100, 100, 140, ' + (0.8 - breakFactor/100.0) + ')';
                for(var i = 0; i < self.pointArray.length; i++) {
                    ctx.lineTo(self.pointArray[i].x + Math.random() * breakFactor / 4, self.pointArray[i].y + Math.random() * breakFactor / 4);
                }
            } else {
                ctx.strokeStyle     =   'rgba(100, 100, 140, 0.8)';
                for(var i = 0; i < self.pointArray.length; i++) {
                    ctx.lineTo(self.pointArray[i].x, self.pointArray[i].y);
                }
            }
            ctx.stroke();

            if (NumberMaze.State.inGameState == 'playing' && NumberMaze.State.gameMode != 'practise') {
                ctx.font                =   'bold 24px Iceberg';
                ctx.fillText(self.scoreRef.chkPointRemain.toFixed(2), self.pointArray[lastPoint].x + 20, self.pointArray[lastPoint].y + 30);
            }
        };

        this.reset();
    };
})(); 
