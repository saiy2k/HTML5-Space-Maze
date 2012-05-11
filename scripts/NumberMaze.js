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
 * This component is the entry point of control into the game and it manages
 * other components of the game. The class is responsible for the following functions:
 *  1. connecting DOM with the rest of the engine
 *  2. initialzing all other game components
 *  3. updating and co-ordinating between all the game components
 *  4. running the game loop
*/
(function($, undefined) {
    NumberMaze          =   function() {
        var self        =   this;

        /** flag that determines if the mouse is touched down or not
         *  @type Boolean */
        var touched     =   false;

        /** previous frame's render time
         *  @type double */
        var prevFTime   =   0;

        /** reference to game state object
         * @type NumberMaze.State */
        var state       =   NumberMaze.State;
        state.gridStatus=   [];
        for (var i = 0; i < NumberMaze.GameConfig.rowCount; i++) {
            state.gridStatus[i]       =   [];
            for (var j = 0; j < NumberMaze.GameConfig.colCount; j++) {
                state.gridStatus[i][j]=   0;
            }
        }

        //inits variables for all canvas and DOM Objects
        this.gameArea   =   document.getElementById('gameArea');
        this.gameCanvas =   document.getElementById('gameCanvas');
        this.menuCanvas =   document.getElementById('menuCanvas');
        this.context    =   this.gameCanvas.getContext('2d');
        this.screenCtx  =   this.menuCanvas.getContext('2d');

        /** self.uiManager handles the screen and the user interactions
         *  @type NumberMaze.UIManager
         *  @private */
        self.uiManager   =   new NumberMaze.UIManager(this);
        self.uiManager.delegate = self;

        /** Core game engine which handles all game mechanics 
         *  @type NumberMaze.CoreEngine
         *  @private */
        self.engine      =   new NumberMaze.CoreEngine(this);
        self.engine.delegate =   self.uiManager;

        /** Object that handles the main menu screen
         *  @type NumberMaze.MainMenu
         *  @private */
        self.mainMenu    =   new NumberMaze.MainMenu(this);
        self.mainMenu.delegate =   self.uiManager;

        /** Object that handles the credits screen
         *  @type NumberMaze.CreditsScreen
         *  @private */
        self.creditsScreen=   new NumberMaze.Credits(this);
        self.creditsScreen.delegate =   self.uiManager;

        /** Object that handles the leaderboard screen
         *  @type NumberMaze.LBoard
         *  @private */
        self.LBoard      =   new NumberMaze.LBoard(this);
        self.LBoard.delegate =   self.uiManager;

        /** Object that handles the pause screen
         *  @type NumberMaze.PauseScreen
         *  @private */
        self.pauseScreen =   new NumberMaze.PauseScreen(this);
        self.pauseScreen.delegate =   self.uiManager;

        /** Object that handles the game over screen
         *  @type NumberMaze.GameOver
         *  @private */
        self.gameOver    =   new NumberMaze.GameOver(this);
        self.gameOver.delegate =   self.uiManager;

        /** Object that handles the game win screen
         *  @type NumberMaze.WonScreen
         *  @private */
        self.gameWin     =   new NumberMaze.WonScreen(this);
        self.gameWin.delegate =   self.uiManager;

        /** Object that handles the game over screen
         *  @type NumberMaze.GameOver
         *  @private */
        var gOverScreen =   new NumberMaze.GameOver(this);
        gOverScreen.delegate =   self.uiManager;

        //this.context.fillStyle = 'black';

        //handlers for the window events
        window.addEventListener('resize', self.uiManager.resize, false);
        window.addEventListener('orientationchange', self.uiManager.resize, false);

        self.mousedown  =   function(tx, ty) {
            if (state.currentScreen == 'game') {
                if (state.inGameState == 'waiting') {
                    state.inGameState = 'playing';
                }
                self.engine.hud.mousedown(tx, ty);
            }
        };

        self.mousemove  =   function(tx, ty) {
            if(state.currentScreen == 'menu')
                self.mainMenu.mousemove(tx, ty);
            if(state.inGameState == 'playing' || state.inGameState == 'ending') {
                if(state.currentScreen == 'game')
                    self.engine.addPoint(tx, ty);
            }
        };

        self.mouseup    =   function(tx, ty) {
            if(state.currentScreen == 'game' && self.engine.won == false) {
                window.setTimeout(self.uiManager.gameOver());
            } else if (state.currentScreen == 'paused') {
                self.pauseScreen.mouseup(tx, ty);
            } else if (state.currentScreen == 'menu') {
                self.mainMenu.mouseup(tx, ty);
            } else if (state.currentScreen == 'gameover') {
                self.gameOver.mouseup(tx, ty);
            } else if (state.currentScreen == 'gamewon') {
                self.gameWin.mouseup(tx, ty);
            } else if (state.currentScreen == 'lboard') {
                self.LBoard.mouseup(tx, ty);
            } else if (state.currentScreen == 'credits') {
                self.creditsScreen.mouseup(tx, ty);
            }
        };

        self.resizeLayout           =   function(tWidth, tHeight) {
            self.engine.resizeLayout(tWidth, tHeight);
            self.mainMenu.resizeLayout(tWidth, tHeight);
            self.pauseScreen.resizeLayout(tWidth, tHeight);
            self.gameOver.resizeLayout(tWidth, tHeight);
            self.gameWin.resizeLayout(tWidth, tHeight);
            self.creditsScreen.resizeLayout(tWidth, tHeight);
            self.LBoard.resizeLayout(tWidth, tHeight);
        };

        //sets up the game loop
        window.requestAnimFrame = (function(){
            return  window.requestAnimationFrame   || 
                window.webkitRequestAnimationFrame || 
                window.mozRequestAnimationFrame    || 
                window.oRequestAnimationFrame      || 
                window.msRequestAnimationFrame     || 
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
        })();

        prevFTime                   =   new Date().getTime();
 
        //actual game loop
        (function gameLoop() {
            var time                =   new Date().getTime();
            var dt                  =   (time - prevFTime) / 1000.0;
            prevFTime               =   time;

            if(state.currentScreen == 'game') {
                self.engine.update(dt);
                self.engine.draw(self.context);
            } else if (state.currentScreen == 'paused') {
                self.engine.draw(self.context);

                self.screenCtx.clearRect(0, 0, self.menuCanvas.width, self.menuCanvas.height);
                self.pauseScreen.update(dt);
                self.pauseScreen.draw(self.screenCtx);
            } else if (state.currentScreen == 'gameover') {
                self.engine.update(dt);
                self.engine.draw(self.context);

                self.screenCtx.clearRect(0, 0, self.menuCanvas.width, self.menuCanvas.height);
                self.gameOver.update(dt);
                self.gameOver.draw(self.screenCtx);
            } else if (state.currentScreen == 'gamewon') {
                self.engine.update(dt);
                self.engine.draw(self.context);

                self.screenCtx.clearRect(0, 0, self.menuCanvas.width, self.menuCanvas.height);
                self.gameWin.update(dt);
                self.gameWin.draw(self.screenCtx);
            } else if (state.currentScreen == 'menu') {
                self.context.clearRect(0, 0, self.menuCanvas.width, self.menuCanvas.height);
                self.screenCtx.clearRect(0, 0, self.menuCanvas.width, self.menuCanvas.height);
                self.mainMenu.update(dt);
                self.mainMenu.draw(self.screenCtx);
            } else if (state.currentScreen == 'lboard') {
                self.context.clearRect(0, 0, self.menuCanvas.width, self.menuCanvas.height);
                self.screenCtx.clearRect(0, 0, self.menuCanvas.width, self.menuCanvas.height);
                self.LBoard.update(dt);
                self.LBoard.draw(self.screenCtx);
            } else if (state.currentScreen == 'credits') {
                self.context.clearRect(0, 0, self.menuCanvas.width, self.menuCanvas.height);
                self.screenCtx.clearRect(0, 0, self.menuCanvas.width, self.menuCanvas.height);
                self.creditsScreen.update(dt);
                self.creditsScreen.draw(self.screenCtx);
            }
            window.requestAnimFrame(gameLoop);
        })();
 
        Playtomic.Log.View('7158', "b34119c5c7074dd4", "883aa0c303e544fe9900683df59b0f", document.location);

        var simple_score = {};
        simple_score.Name = 'player 1';
        simple_score.Points = 200;
        Playtomic.Leaderboards.Save(simple_score, "easy"); 

   };
})(jQuery);
