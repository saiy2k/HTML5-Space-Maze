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

        /** reference to game state object
         * @type NumberMaze.State */
        var state       =   NumberMaze.State;

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

        /** Object that handles the pause screen
         *  @type NumberMaze.PauseScreen
         *  @private */
        var pauseScreen =   new NumberMaze.PauseScreen(this);
        pauseScreen.delegate =   self.uiManager;

        /** Object that handles the game over screen
         *  @type NumberMaze.GameOver
         *  @private */
        var gameOver    =   new NumberMaze.GameOver(this);
        gameOver.delegate =   self.uiManager;

        //this.context.fillStyle = 'black';

        //handlers for the window events
        window.addEventListener('resize', self.uiManager.resize, false);
        window.addEventListener('orientationchange', self.uiManager.resize, false);

        self.mousedown  =   function(tx, ty) {
            touched     =   true;
            if (state.currentScreen == 'game') {
                self.engine.hud.mousedown(tx, ty);
            } else if (state.currentScreen == 'paused') {
                pauseScreen.mousedown(tx, ty);
            } else if (state.currentScreen == 'gameover') {
                gameOver.mousedown(tx, ty);
            }
        };

        self.mousemove  =   function(tx, ty) {
            if(touched) {
                if(state.currentScreen == 'game')
                    self.engine.addPoint(tx, ty);
            }
        };

        self.mouseup    =   function(tx, ty) {
            touched     =   false;
        };

        this.resizeLayout           =   function(tWidth, tHeight) {
            self.engine.resizeLayout(tWidth, tHeight);
        };

        //sets up the initial UI
        $(this.menuCanvas).hide();

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
 
        //actual game loop
        (function gameLoop() {
            if(state.currentScreen == 'game') {
                self.engine.update(1/30.0);
                self.engine.draw(self.context);
            } else if (state.currentScreen == 'paused') {
                self.engine.draw(self.context);

                self.screenCtx.clearRect(0, 0, self.menuCanvas.width, self.menuCanvas.height);
                pauseScreen.update(1/30.0);
                pauseScreen.draw(self.screenCtx);
            } else if (state.currentScreen == 'gameover') {
                self.engine.update(1/30.0);
                self.engine.draw(self.context);
                gameOver.update(1/30.0);
                gameOver.draw(self.screenCtx);
            }
            window.requestAnimFrame(gameLoop);
        })();
    };
})(jQuery);
