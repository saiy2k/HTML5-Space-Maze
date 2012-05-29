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

        /** reference to the object which subscribes the game events
         *  the subsribed object should implement the following functions:
         *      gameOver(),
         *      gameWon()
         *  @type object
         *  @public */
        self.delegate;

        /** reference to game state object
         * @type NumberMaze.State */
        var state       =   NumberMaze.State;

        /** Grid object that manages the numbers and their states
         *  @type NumberMaze.GridLayer
         *  @private */
        var grid                    =   new NumberMaze.GridLayer(g);
        grid.delegate               =   self;

        /** line object that draws and manages the game line
         *  @type NumberMaze.GameLine
         *  @private */
        var gLine                   =   new NumberMaze.GameLine(g);
        gLine.delegate              =   self;

        /** hud that displays in-game menu
         *  @type NumberMaze.HUDLayer
         *  @public */
        this.hud                    =   new NumberMaze.HUDLayer(g);
        this.hud.delegate           =   g.uiManager;

        /** component that takes care of scoring and timing logics
         *  @type NumberMaze.Score
         *  @public */
        var score                   =   new NumberMaze.Score(g);
        score.delegate              =   self;

        /** boolean that determines whether the score pop up animation
         *  is being rendred
         *  @type bool
         *  @private */
        var showBonusPop            =   false;

        /** number of seconds awarded as time bonus
         *  @type float
         *  @private */
        var timeBonus               =   0.0;

        /** time pop anim tween value
         *  @type float
         *  @private */
        var timeAnimDelta           =   1.0;

        /** angle of the space craft to draw with
         *  @type float
         *  @private */
        var angle                   =   0;

        /** space craft sprite
         *  @type Image
         *  @private */
        //this.craftSprite            =   g.assetManager.Get('asteroidSprite');
        this.craftSprite            =   g.assetManager.Get('craft');
        this.craftSpriteFrame       =   g.assetManager.Get('spriteData').frames[53].frame;
        var w                       =   self.craftSprite.width * 0.8;
        var h                       =   self.craftSprite.height * 0.8;

        this.getStartLocation       =   function() {
            return                      grid.getStartLocation();
        };

        function animateScorePopup() {
            showBonusPop            =   true;
            timeAnimDelta           =   1.0;
        }

        this.getScore               =   function() {
            return score.totalScore;
        }

        this.getLevelScore          =   function() {
            return score.chkPointRemain;
        }

        this.getBonusScore          =   function() {
            return score.getLevelBonus(state.currentLevel);
        }

        /** reset the current game */
        this.reset                  =   function() {
            state.inGameState       =   'waiting';
            state.currentLevel      =   0;
            state.gridStatus        =   []; 
            w                       =   self.craftSprite.width * 0.6;
            h                       =   self.craftSprite.height * 0.6;

            if(state.gameMode       ==  'hard')
                state.colCount    =   4;
            else
                state.colCount    =   3;

            if(state.gameMode       ==  'practise')
                score.delegate      =   null;
            else
                score.delegate      =   self;

            for (var i = 0; i < state.rowCount; i++) {
                state.gridStatus[i] =   [];
                for (var j = 0; j < state.colCount; j++) {
                    state.gridStatus[i][j]=   0;
                }
            }
            gLine.reset();
            grid.reset();
            self.hud.reset();
            score.reset();
            state.active            =   true;

            self.resizeLayout(g.gameCanvas.width, g.gameCanvas.height);
        };

        this.mousemove              =   function(tx, ty) {
            grid.mousemove(tx, ty);
        };

        this.getGrid                =   function() {
            return                      grid;
        };

        /** procecd to next level */
        this.nextLevel              =   function() {
            state.inGameState       =   'waiting';
            state.gridStatus        =   []; 
            for (var i = 0; i < state.rowCount; i++) {
                state.gridStatus[i] =   [];
                for (var j = 0; j < state.colCount; j++) {
                    state.gridStatus[i][j]=   0;
                }
            }
            gLine.reset();
            grid.reset();
            self.hud.reset();
            score.chkPointRemain    =   20.0 - state.currentLevel * 2;
            state.active            =   true;
            self.resizeLayout(state.gameWidth, state.gameHeight);
        };

        this.resizeLayout           =   function(tWidth, tHeight) {
            grid.resizeLayout(tWidth, tHeight);
            gLine.resizeLayout(tWidth, tHeight);
            self.hud.resizeLayout(tWidth, tHeight);
        };

        this.addPoint               =   function(tx, ty) {
            if(state.active) {
                var pt                  =   {x:tx, y:ty};
                if(gLine.addPoint(tx, ty))
                    if(grid.collidesWith(pt))
                        console.log('collision detected');
                self.hud.mousedown(tx, ty);
            }
        };

        this.update                 =   function(dt) {
            grid.update(dt);
            gLine.update(dt);
            if((state.inGameState == 'playing') && state.gameMode != 'practise') {
                score.update(dt);
                self.hud.update(dt, score.chkPointRemain, 0);
            }
            var lastPoint       =   gLine.pointArray.length - 1;
            if (lastPoint > 3) {
                var dx              =   gLine.pointArray[lastPoint].x - gLine.pointArray[lastPoint - 1].x;
                var dy              =   gLine.pointArray[lastPoint].y - gLine.pointArray[lastPoint - 1].y;
                var angleTarget     =   Math.atan2(dy, dx);
                if (angleTarget - angle > 22/7)
                    angleTarget     -=  (22/7) * 2;
                if (angleTarget - angle < -22/7)
                    angleTarget     +=  (22/7) * 2;
                angle               +=  (angleTarget - angle) / 2.0;
                console.log(angleTarget * 180 / 3.14);
            }
        };

        this.draw                   =   function(ctx) {
            var lastPoint           =   gLine.pointArray.length - 1;
            grid.draw(ctx);
            gLine.draw(ctx);
            ctx.font                =   'bold ' + Math.round(state.gameWidth/32.0) + 'px Iceberg';
            self.hud.draw(ctx);

            ctx.save();
            ctx.translate(gLine.pointArray[lastPoint].x, gLine.pointArray[lastPoint].y);
            ctx.rotate(angle + 3.14 / 2);
            if (state.inGameState == 'exploding') {
                w *= 0.9;
                h *= 0.9;
                angle               +=  Math.round(Math.random() / 6.0);
            }
            ctx.drawImage(self.craftSprite, -w*0.5, -h*0.5, w, h);
            ctx.restore();

            if(showBonusPop) {
                var                     lastIndex;
                lastIndex           =   gLine.pointArray.length - 1;
                ctx.fillStyle       =   'rgba(200, 150, 150, 0.8)';
                ctx.fillText(timeBonus.toFixed(2), gLine.pointArray[lastIndex].x, gLine.pointArray[lastIndex].y - (80 * (1 - timeAnimDelta)));

                timeAnimDelta       -=  0.02;

                if (timeAnimDelta <= 0)
                    showBonusPop    =   false;
            }
        };

        /** callback methods to handle the events of GameLine object */
        this.lineTouched            =   function() {
            state.inGameState       =   'exploding';
            state.active            =   false;
        };

        this.lineExploded           =   function() {
            state.inGameState       =   'lose';
            self.delegate.gameOver();
        };

        /** callback methods to handle the events of GridLayer object */
        this.touchedTargetPoint     =   function() {
            timeBonus               =   score.targetTouched();
            animateScorePopup();
        };

        this.touchedWrongPoint      =   function() {
            state.inGameState       =   'exploding';
            state.active            =   false; 
        };

        this.wrongPointExploded     =   function() {
            state.inGameState       -   'lose';
            self.delegate.gameOver();
        };

        this.touchedAllPoints       =   function() {
            state.currentLevel++;
            state.inGameState       =   'won';
            window.setTimeout(self.delegate.gameWon, 2000);
            window.setTimeout(self.updateScore, 2100);
        };

        /** callback to handle the events of score object */
        this.timeOut                =   function() {
            state.inGameState       =   'lose';
            state.active            =   false;
            window.setTimeout(self.delegate.gameOver, 1000);
            submitScore();
        };

        /** callback to handle the events of score object */
        this.gameTimeOut            =   function() {
        };

        this.updateScore            =   function() {
            score.totalScore        +=  score.chkPointRemain + score.getLevelBonus(state.currentLevel);
        };

        this.reset();
        gLine.scoreRef              =   score;
    };
})(); 
