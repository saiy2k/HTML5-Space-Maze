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

        /** order of target numbers
         *  @type int[]
         *  @public */
        this.targetArray            =   [12];

        /** index of the current target
         *  @type int
         *  @public */
        this.targetIndex            =   0;

        /** starting point sptire
         *  @type LetterSprite
         *  @private */
        var startSprite;

        /** ending point sptire
         *  @type LetterSprite
         *  @private */
        var endSprite;

        /** index of the current target number
         *  @type int
         *  @private */
        var currentTarget;

        /** index of the previous target number
         *  @type int
         *  @private */
        var prevTarget;

        /** number of letters
         *  @type int
         *  @private */
        var tCount;

        /** x mouse position
         *  @type int
         *  @private */
        var mousex;

        /** y mouse position
         *  @type int
         *  @private */
        var mousey;

        /** sprite sheet image of the asteroid
         *  @type Image
         *  @private */
        var spriteSheet             =   g.assetManager.Get('asteroidSprite');

        /** json that represents individual frames inside the asteroid sprite sheet
         *  @type json
         *  @private */
        this.spriteData             =   g.assetManager.Get('spriteData');;
        var homeSprite              =   g.assetManager.Get('asteroidSprite');
        var homeSpriteFrame         =   this.spriteData.frames[50].frame;

        /** delta value to give bubbling effect to home planet
         *  @type float
         *  @private */
        var delBubble               =   0;
        var delBubbleVar            =   1.5;

        this.getNextLetter          =   function() {
            targetIndex++;
            return self.targetArray[targetIndex];
        };

        this.mousemove              =   function(tx, ty) {
            mousex                  =   tx;
            mousey                  =   ty;
        };

        /** resets the state for a fresh new game */
        this.reset                  =   function() {
            tCount                  =   state.rowCount * state.colCount;
            targetIndex             =   0;
            prevTarget              =   0;
            currentTarget           =   0;
            currentTarget           =   0;
            delBubble               =   0;
        
            self.letterArray        =   [];
            for(var k = 0; k < tCount; k++) {
                i                       =   Math.floor(k / state.colCount);
                j                       =   Math.floor(k % state.colCount);
                var ltr                 =   new NumberMaze.LetterSprite(k, 0, 0, i, j);
                this.letterArray.push(ltr);
            }

            for(var i = 0; i < tCount; i++) {
                self.targetArray[i] =   i;
                self.letterArray[i].reset();
            }

            for(var i = 0; i < tCount; i++) {
                var rnd             =   Math.round(Math.random() * (tCount - 1));
                var tmp;
                tmp                 =   self.targetArray[i];
                self.targetArray[i] =   self.targetArray[rnd];
                self.targetArray[rnd]=  tmp;
            }

            /*
            for(var i = 0; i < tCount; i++) {
                console.log(self.targetArray[i]);
            }
            */

            self.letterArray[self.targetArray[targetIndex]].open();

            prevTarget              =   self.targetArray[targetIndex];
            currentTarget           =   self.targetArray[targetIndex];
            startSprite.arcLength   =   Math.PI;
            endSprite.arcLength     =   Math.PI;
        };

        /** updates the cellWidth and cellHeight as per new game area.
         *  also updates the position of the numbers  */
        this.resizeLayout           =   function(tWidth, tHeight){
            cellWidth               =   (tWidth / (state.colCount + 1));
            cellHeight              =   (tHeight / (state.rowCount + 2));
            for(var k = 0; k < tCount; k++) {
                var i                   =   Math.floor(k / state.colCount);
                var j                   =   k % state.colCount;
                self.letterArray[k].x   =   cellWidth * j + cellWidth;
                self.letterArray[k].y   =   cellHeight * i + cellHeight + tHeight * 0.15;
                self.letterArray[k].resizeLayout(tWidth, tHeight);
            }
            startSprite.x           =   state.gameWidth * 0.07;
            startSprite.y           =   state.gameHeight * 0.2;
            endSprite.x             =   state.gameWidth * 0.94;
            endSprite.y             =   state.gameHeight * 0.94;
        };

        /** function to check if the given point collides with any of the
         *  numbers. If collision is detected then based on the number's state
         *  corresponding action is taken */
        this.collidesWith           =   function(pt) {

            if (state.inGameState == 'ending') {
                if (Math.dist({x:endSprite.x, y:endSprite.y}, pt) < endSprite.radius) {
                    for(var k = 0; k < tCount; k++) {
                        self.letterArray[k].open();
                    }
                    self.delegate.touchedAllPoints();
                }
                return;
            }

            for(var k = 0; k < tCount; k++) {
                var i, j;
                i                   =   Math.floor(k / state.colCount);
                j                   =   Math.floor(k % state.colCount);
                if(Math.dist({x:self.letterArray[k].x, y:self.letterArray[k].y}, pt) < self.letterArray[k].radius) {
                    /*
                    console.log('grid' + k);
                    for (ii = 0; ii < state.rowCount; ii++) {
                        var str = '';
                        for (jj = 0; jj < state.colCount; jj++) {
                            str += state.gridStatus[ii][jj] + ', ';
                        }
                        console.log(str);
                    }
                    */
                    if (state.gridStatus[i][j] == 1) {
                        self.letterArray[k].jingle();
                        if(self.delegate)
                            self.delegate.touchedTargetPoint();
                        if(targetIndex == tCount - 1) {
                            targetIndex++;
                            console.log('changed to ending');
                            state.inGameState = 'ending';
                            endSprite.open();
                        } else {
                            console.log('gettin next letter');
                            prevTarget      =   currentTarget;
                            currentTarget   =   self.getNextLetter();
                            self.letterArray[currentTarget].open();
                        }
                    } else if (state.gridStatus[i][j] == 0) {
                        self.letterArray[k].explode();
                        if(self.delegate) {
                            self.delegate.touchedWrongPoint();
                            window.setTimeout(self.delegate.wrongPointExploded, 1400);
                        }
                    } else if (k != prevTarget) {
                        console.log('outta');
                        console.log(k);
                        console.log(prevTarget);
                        self.letterArray[k].explode();
                        if(self.delegate) {
                            self.delegate.touchedWrongPoint();
                            window.setTimeout(self.delegate.wrongPointExploded, 1400);
                        }
                    }
                    break;
                }
            }
        };

        var sl = 0;

        this.update                 =   function(dt) {
            if (state.inGameState == 'ending')
                endSprite.update(dt*3);
            else
                for(var k = 0; k < tCount; k++) {
                    self.letterArray[k].update(dt);
                }
            if (state.inGameState == 'ending') {
                delBubble           +=  delBubbleVar ;
                if (Math.abs(delBubble) > 8) {
                    delBubbleVar    *=  -1;
                }
            }
        };

        this.draw                   =   function(ctx) {
            ctx.fillStyle           =   'rgba(50, 50, 90, 0.2)';
            ctx.strokeStyle         =   'rgba(50, 50, 020, 0.8)';
            ctx.lineWidth           =   cellWidth / 70;
            index                   =   self.targetArray[targetIndex];

            for (var i = 0; i < tCount; i++) {
                if(i != index) {
                    var cFrame      =   self.spriteData.frames[self.letterArray[i].frame].frame;
                    if (self.letterArray[i].frame < 33) {
                        ctx.drawImage(spriteSheet, cFrame.x, cFrame.y, cFrame.w, cFrame.h, self.letterArray[i].x - 25, self.letterArray[i].y - 25, cFrame.w * 0.5, cFrame.h * 0.5);
                    } else {
                        ctx.drawImage(spriteSheet, cFrame.x, cFrame.y, cFrame.w, cFrame.h, self.letterArray[i].x - 25, self.letterArray[i].y - 25, cFrame.w, cFrame.h);
                    }
                }
            }

            if (targetIndex != tCount) {
                var cFrame              =   self.spriteData.frames[self.letterArray[index].frame].frame;
                ctx.drawImage(spriteSheet, cFrame.x, cFrame.y, cFrame.w, cFrame.h, self.letterArray[index].x - 25, self.letterArray[index].y- 25, cFrame.w * 0.5, cFrame.h * 0.5);
                ctx.globalCompositeOperation = 'lighter';
                ctx.drawImage(spriteSheet, cFrame.x, cFrame.y, cFrame.w, cFrame.h, self.letterArray[index].x - 25, self.letterArray[index].y- 25, cFrame.w * 0.5, cFrame.h * 0.5);
                ctx.drawImage(spriteSheet, cFrame.x, cFrame.y, cFrame.w, cFrame.h, self.letterArray[index].x - 25, self.letterArray[index].y- 25, cFrame.w * 0.5, cFrame.h * 0.5);
                ctx.drawImage(spriteSheet, cFrame.x, cFrame.y, cFrame.w, cFrame.h, self.letterArray[index].x - 25, self.letterArray[index].y- 25, cFrame.w * 0.5, cFrame.h * 0.5);
                ctx.globalCompositeOperation = 'source-over';
            }

            ctx.drawImage(homeSprite, homeSpriteFrame.x, homeSpriteFrame.y, homeSpriteFrame.w, homeSpriteFrame.h, endSprite.x - homeSpriteFrame.w / 2, endSprite.y - homeSpriteFrame.h / 2, homeSpriteFrame.w + delBubble, homeSpriteFrame.h + delBubble);
        };

        this.getStartLocation       =   function() {
            return                      { x: startSprite.x, y: startSprite.y };
        };

        startSprite                 =   new NumberMaze.LetterSprite('.', state.gameWidth * 0.07, state.gameHeight * 0.2, 0, 0);
        startSprite.radius          =   8;

        endSprite                   =   new NumberMaze.LetterSprite('.', state.gameWidth * 0.94, state.gameHeight * 0.94, 0, 0);
        endSprite.radius            =   8;

        this.resizeLayout(g.gameCanvas.width, g.gameCanvas.height);
    };
})();
