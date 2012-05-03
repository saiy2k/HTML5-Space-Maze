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
 * Manages all the UI related features from dynamic scaling of game
 * as per the window size, gets input either through mouse or touch,
 * handlers for various UI controls, screen transitions, etc.,
*/
(function(undefined) {
    NumberMaze.UIManager            =   function(g) {
        /** just a self reference
         *  @type NumberMaze.UIManager
         *  @private */
        var self                    =   this;

        /** reference to the object which subscribes for the mouse/touch events
         *  any object that implements the following functions:
         *      mouseup(x, y),
         *      mousemove(x, y),
         *      mousedown(x, y),
         *      resizeLayout(tx, ty)
         *  @type object
         *  @public */
        this.delegate               =   null;

        /** reference to game state object
         * @type NumberMaze.State */
        var state       =   NumberMaze.State;

        /** y-position of the game area in the document
         *  @type Number
         *  @public */
        this.top                    =   0;

        /** x-position of the game area in the document
         *  @type Number
         *  @public */
        this.left                   =   0;

        /** mousedown event, filters inside the game area */
        $(gameArea).mousedown(function(e) {
            var x                   =   e.pageX - self.left;
            var y                   =   e.pageY - self.top;
            if(self.delegate)
                self.delegate.mousedown(x, y);
        });

        /** mousemove event, filters inside the game area */
        $(gameArea).mousemove(function(e) {
            var x                   =   e.pageX - self.left;
            var y                   =   e.pageY - self.top;
            if(self.delegate)
                self.delegate.mousemove(x, y);
        });

        /** mouseup event, filters inside the game area */
        $(gameArea).mouseup(function(e) {
            var x                   =   e.pageX - self.left;
            var y                   =   e.pageY - self.top;
            if(self.delegate)
                self.delegate.mouseup(x, y);
        });

        /** handler for window resize / orientation change events
         *  resizes the gamearea and all the canvases within the
         *  allowed range, maintaining the aspect ratio.
         *  Big thanks to tutorials in html5rocks.com for this logic */
        this.resize                 =   function() {
            var gConfig             =   NumberMaze.GameConfig;
            var widthToHeight       =   4 / 3;
            var newWidth            =   window.innerWidth * .8;
            var newHeight           =   window.innerHeight * .8;
            var newWidthToHeight    =   newWidth / newHeight;

            if (newWidthToHeight > widthToHeight) {
                newHeight           =   (newHeight < gConfig.minCanvasHeight) ? gConfig.minCanvasHeight : newHeight;
                newHeight           =   (newHeight > gConfig.maxCanvasHeight) ? gConfig.maxCanvasHeight : newHeight;
                newWidth            =   newHeight * widthToHeight;
            } else {
                newWidth            =   (newWidth < gConfig.minCanvasWidth) ? gConfig.minCanvasWidth : newWidth;
                newWidth            =   (newWidth > gConfig.maxCanvasWidth) ? gConfig.maxCanvasWidth : newWidth;
                newHeight           =   newWidth / widthToHeight;
            }

            g.gameArea.style.width  =   newWidth + 'px';
            g.gameArea.style.height =   newHeight + 'px';
            g.gameArea.style.marginTop= (-newHeight / 2) + 'px';
            g.gameArea.style.marginLeft=(-newWidth / 2) + 'px';
            g.gameArea.style.fontSize=  (newWidth / 400) + 'em';

            g.gameCanvas.width      =   newWidth;
            g.gameCanvas.height     =   newHeight;
            g.menuCanvas.width      =   newWidth;
            g.menuCanvas.height     =   newHeight;

            self.left               =   $(gameArea).offset().left;
            self.top                =   $(gameArea).offset().top;

            NumberMaze.MenuButton.prototype.screenWidth  =   newWidth;
            NumberMaze.MenuButton.prototype.screenHeight =   newHeight;

            if(self.delegate)
                self.delegate.resizeLayout(newWidth, newHeight);
        };

        //handlers for in-game events
        this.gameOver               =   function() {
            console.log('gameover');
            state.currentScreen     =   'gameover';
            $(g.menuCanvas).show();
        };

        this.gameWon                =   function() {
            state.currentLevel++;
            g.engine.reset();
        };

        /** callback methods to handle HUD events */
        this.pauseButtonPressed     =   function() {
            state.currentScreen     =   'paused';
            $(g.menuCanvas).show();
        };

        /** callback methods to handle pause screen events */
        this.pauseScreenResume      =   function() {
            state.currentScreen     =   'game';
            $(g.menuCanvas).hide();
        };
        this.pauseScreenRestart     =   function() {
            state.currentScreen     =   'game';
            g.engine.reset();
            $(g.menuCanvas).hide();
        };
        this.pauseScreenQuit        =   function() {
            state.currentScreen     =   'menu';
            g.mainMenu.reset();
            $(g.menuCanvas).show();
        };
        this.pauseScreenHelp        =   function() {
        };

        /** callback methods to handle main menu events */
        this.mainMenuNewGameEasy    =   function() {
            state.currentScreen     =   'game';
            g.engine.reset();
            $(g.menuCanvas).hide();
        };
        this.mainMenuNewGameHard    =   function() {
            state.currentScreen     =   'game';
            g.engine.reset();
            $(g.menuCanvas).hide();
        };
        this.mainMenuNewGamePractice=   function() {
            state.currentScreen     =   'game';
            g.engine.reset();
            $(g.menuCanvas).hide();
        };
        this.mainMenuLeaderboard    =   function() {
            self.delegate.LBoard.reset();
            state.currentScreen     =   'lboard';
            
        };
        this.mainMenuCredits        =   function() {
            state.currentScreen     =   'credits';
        };

        /** callback methods to handle leader board events */
        this.LBoardBack             =   function() {
            state.currentScreen     =   'menu';
        };

        /** callback methods to handle credits screen events */
        this.creditsBack            =   function() {
            state.currentScreen     =   'menu';
        };

        this.resize();
    };
})();  
