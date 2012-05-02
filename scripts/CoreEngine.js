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
        var gConfig                 =   NumberMaze.GameConfig;

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

        /** reset the current game */
        this.reset                  =   function() {
            state.inGameState       =   'waiting';
            state.gridStatus        =   []; 
            for (var i = 0; i < gConfig.rowCount; i++) {
                state.gridStatus[i] =   [];
                for (var j = 0; j < gConfig.colCount; j++) {
                    state.gridStatus[i][j]=   0;
                }
            }
            gLine.reset();
            grid.reset();
            self.hud.reset();
            score.reset();
            state.active            =   true;
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
        }

        this.update                 =   function(dt) {
            grid.update(dt);
            gLine.update(dt);
            if(state.active) {
                score.update(dt);
            }
            self.hud.update(dt, score.chkPointRemain, score.currentScore);
        };

        this.draw                   =   function(ctx) {
            ctx.clearRect(0, 0, 640, 480);
            gLine.draw(ctx);
            grid.draw(ctx);
            ctx.font                =   'bold 20px Iceberg';
            self.hud.draw(ctx);

            if(state.inGameState == 'won')
                ctx.fillText('GAME WON', 100, 100);
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
            score.targetTouched();
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
            state.inGameState       =   'won';
            window.setTimeout(self.delegate.gameWon, 2000);
        };

        /** callback to handle the events of score object */
        this.timeOut                =   function() {
            state.inGameState       =   'lose';
            state.active            =   false;
            window.setTimeout(self.delegate.gameOver, 1000);
        };

        /** callback to handle the events of score object */
        this.gameTimeOut            =   function() {
        };

        this.reset();
        gLine.scoreRef              =   score;
    };
})(); 
