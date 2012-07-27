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

        /** current x position (for accelerometer input)
         *  @type int
         *  @private */
        var xx                      =   200;

        /** current y position (for accelerometer input)
         *  @type int
         *  @private */
        var yy                      =   120;

        /** mousedown event, filters inside the game area */
        $(g.gameArea).mousedown(function(e) {
            var x                   =   e.pageX - self.left;
            var y                   =   e.pageY - self.top;
            if(self.delegate)
                self.delegate.mousedown(x, y);
        });

        /** mousemove event, filters inside the game area */
        $(g.gameArea).mousemove(function(e) {
            var x                   =   e.pageX - self.left;
            var y                   =   e.pageY - self.top;
            if(self.delegate)
                self.delegate.mousemove(x, y);
        });

        /** mouseup event, filters inside the game area */
        $(g.gameArea).mouseup(function(e) {
            var x                   =   e.pageX - self.left;
            var y                   =   e.pageY - self.top;
            if(self.delegate)
                self.delegate.mouseup(x, y);
        });

        /** handler for googlePlus login button */
        $('#gPlusLoginButton').click(function() {
            NumberMaze.GPlusWrapper().login();
        });

        /** handler for facebook login button */
        $('#fbLoginButton').click(function() {
            NumberMaze.FBWrapper.share();
        });

        /** handler for mute button */
        $('#muteButton').click(function() {
            state.soundOn           =   !state.soundOn;
            if (state.soundOn)
            {
                g.assetManager.Get('bgm').resume();
                $('#muteButton').attr('src', 'images/musicButtonOn.png');
            } else {
                g.assetManager.Get('bgm').pause();
                $('#muteButton').attr('src', 'images/musicButtonOff.png');
            }
        });

        /** handler for window resize / orientation change events
         *  resizes the gamearea and all the canvases within the
         *  allowed range, maintaining the aspect ratio.
         *  Big thanks to tutorials in html5rocks.com for this logic */
        this.resize                 =   function() {
            console.log("UIManager : resize");
            var widthToHeight       =   4 / 3;
            var newWidth            =   window.innerWidth;
            var newHeight           =   window.innerHeight;
            var newWidthToHeight    =   newWidth / newHeight;

            if (newWidthToHeight > widthToHeight) {
                newHeight           =   (newHeight < state.minCanvasHeight) ? state.minCanvasHeight : newHeight;
                newHeight           =   (newHeight > state.maxCanvasHeight) ? state.maxCanvasHeight : newHeight;
                newWidth            =   newHeight * widthToHeight;
            } else {
                newWidth            =   (newWidth < state.minCanvasWidth) ? state.minCanvasWidth : newWidth;
                newWidth            =   (newWidth > state.maxCanvasWidth) ? state.maxCanvasWidth : newWidth;
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

            state.gameWidth         =   newWidth;
            state.gameHeight        =   newHeight;

            self.left               =   $(g.gameArea).offset().left;
            self.top                =   $(g.gameArea).offset().top;

            NumberMaze.MenuButton.prototype.screenWidth  =   newWidth;
            NumberMaze.MenuButton.prototype.screenHeight =   newHeight;
            console.log(newWidth);

            if(self.delegate)
                self.delegate.resizeLayout(newWidth, newHeight);
        };

        //handlers for in-game events
        this.gameOver               =   function() {
            console.log('gameover');
            _gaq.push(['_setCustomVar',
                    2,
                    'level',
                    '' + state.currentLevel
                    ]);
            if(state.gameMode == 'practise') {
                state.currentScreen     =   'practisefail';
                $(g.menuCanvas).show();
            } else {
                state.currentScreen     =   'gameover';
                g.gameOver.score        =   g.engine.getScore();
                g.gameOver.lvlScore     =   g.engine.getLevelScore();
                $('#profileDiv').show();
                $(g.menuCanvas).show();
                self.submitScore();
            }
        };

        this.gameWon                =   function() {
            console.log('game won');
            if(state.gameMode == 'practise') {
                self.gWonScreenQuit();
            } else {
                state.currentScreen     =   'gamewon';
                g.gameWin.score         =   g.engine.getScore();
                g.gameWin.lvlScore      =   g.engine.getLevelScore();
                g.gameWin.bonus         =   g.engine.getBonusScore();
                $('#profileDiv').show();
                $(g.menuCanvas).show();
            }
        };

        /** callback methods to handle HUD events */
        this.pauseButtonPressed     =   function() {
            state.currentScreen     =   'paused';
            $(g.menuCanvas).show();
        };
        
        /** callback methods to handle game win screen events */
        this.gWonScreenNext         =   function() {
            state.currentScreen     =   'game';
            g.engine.nextLevel();
            self.resize();
            $(g.menuCanvas).hide();
            $('#profileDiv').hide();
        };
        this.gWonScreenQuit         =   function() {
            state.currentScreen     =   'menu';
            g.mainMenu.reset();
            $(g.menuCanvas).show();
            $('#profileDiv').hide();
        };

        /** callback methods to handle pause screen events */
        this.pauseScreenResume      =   function() {
            state.currentScreen     =   'game';
            $(g.menuCanvas).hide();
        };
        this.pauseScreenRestart     =   function() {
            console.log('uimanager : restart');
            state.currentScreen     =   'game';
            g.engine.reset();
            $(g.menuCanvas).hide();
            $('#profileDiv').hide();
        };
        this.pauseScreenQuit        =   function() {
            state.currentScreen     =   'menu';
            g.mainMenu.reset();
            $(g.menuCanvas).show();
            $('#socialDiv').show();
            $('#profileDiv').hide();
        };
        this.pauseScreenHelp        =   function() {
        };

        /** callback methods to handle main menu events */
        this.mainMenuNewGameEasy    =   function() {
            _gaq.push(['_setCustomVar',
                    1,
                    'difficulty',
                    'easy'
                    ]);
            state.currentScreen     =   'game';
            state.gameMode          =   'easy';
            g.engine.reset();
            $(g.menuCanvas).hide();
            $('#socialDiv').hide();
        };
        this.mainMenuNewGameHard    =   function() {
            _gaq.push(['_setCustomVar',
                    1,
                    'difficulty',
                    'hard'
                    ]);
            state.currentScreen     =   'game';
            state.gameMode          =   'hard';
            g.engine.reset();
            $(g.menuCanvas).hide();
            $('#socialDiv').hide();
        };
        this.mainMenuNewGamePractice=   function() {
            console.log('New Game : Practise');
            _gaq.push(['_setCustomVar',
                    1,
                    'difficulty',
                    'practice'
                    ]);
            state.currentScreen     =   'game';
            state.gameMode          =   'practise';
            g.engine.reset();
            $(g.menuCanvas).hide();
            $('#socialDiv').hide();
        };
        this.mainMenuLeaderboard    =   function() {
            self.delegate.LBoard.reset();
            state.currentScreen     =   'lboard';
            
        };
        this.mainMenuCredits        =   function() {
            state.currentScreen     =   'credits';
            $('#socialDiv').hide();
            $('#creditsBox').show();
        };

        /** callback methods to handle leader board events */
        this.LBoardBack             =   function() {
            state.currentScreen     =   'menu';
        };

        /** callback methods to handle credits screen events */
        this.creditsBack            =   function() {
            state.currentScreen     =   'menu';
            $('#creditsBox').hide();
            $('#socialDiv').show();
        };

        // score submission to playtomic
        this.submitScore            =   function() {
            console.log('UIManager : submit score');
            console.log(state.online);
            console.log(state.authProvider);
            console.log(g.engine.getScore());
            if(state.online && state.authProvider != '' && g.engine.getScore() > 1) {
                console.log('submitting to playtomic');
                var simple_score        =   {};
                var boardName           =   '';
                simple_score.Name       =   state.playerName;
                simple_score.Points     =   Math.round(g.engine.getScore());
                boardName               =   state.gameMode + '-' + (state.isMobile ? 'mobile' : 'normal');
                console.log(boardName);
                console.log(simple_score);
                if(state.online) {
                    if(typeof(Playtomic) != 'undefined') {
                        if (state.playtomicInit == false) {
                            console.log('playtomic initing');
                            Playtomic.Log.View('7158', "b34119c5c7074dd4", "883aa0c303e544fe9900683df59b0f", document.location);
                            state.playtomicInit = true;
                            console.log('playtomic init done');
                        }
                        console.log('playtomic saving');
                        Playtomic.Leaderboards.Save(simple_score, boardName); 
                        console.log('playtomic save done');
                    }
                }
            }
        };

        self.resize();
    };
})();  
