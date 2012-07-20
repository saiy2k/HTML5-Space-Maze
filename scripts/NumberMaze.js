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

        var loadComponents;

        var preloading = true;

        //inits variables for all canvas and DOM Objects
        this.gameArea   =   document.getElementById('gameArea');
        this.gameCanvas =   document.getElementById('gameCanvas');
        this.menuCanvas =   document.getElementById('menuCanvas');
        this.context    =   this.gameCanvas.getContext('2d');
        this.screenCtx  =   this.menuCanvas.getContext('2d');

        /** Object that handles resources like music and image files and preloads them
         *  *  @type PxLoader
         *  *  @private */
        soundManager.setup({
            url: 'audio/soundmanager2.swf',
            onready: function() {
                console.log('sm2 ready');
                self.assetManager.Add('tooltip', self.loader.addImage('images/toolTip.png'));
                self.assetManager.Add('asteroidSprite', self.loader.addImage('images/asteroidSprite.png'));
                self.assetManager.Add('craft', self.loader.addImage('images/craft.png'));
                self.assetManager.Add('explosionA', self.loader.addSound('explosion', 'audio/explosion.wav'));
                self.assetManager.Add('levelWinA', self.loader.addSound('levelWin', 'audio/levelWin.wav'));
                self.assetManager.Add('targetTouchA', self.loader.addSound('targetTouchA', 'audio/targetTouch.wav'));
                self.assetManager.Add('touchLineA', self.loader.addSound('touchLineA', 'audio/lineTouch.wav'));
                self.assetManager.Add('clickA', self.loader.addSound('clickA', 'audio/click.wav'));
                self.assetManager.Add('spriteData', self.loader.addJson('images/asteroidSprite.json'));
                self.loader.start();
            },
            ontimeout: function(e) {
                console.log('timed out');
                console.log(e);
                self.assetManager.Add('tooltip', self.loader.addImage('images/toolTip.png'));
                self.assetManager.Add('asteroidSprite', self.loader.addImage('images/asteroidSprite.png'));
                self.assetManager.Add('craft', self.loader.addImage('images/craft.png'));
                self.assetManager.Add('spriteData', self.loader.addJson('images/asteroidSprite.json'));
                self.loader.start();
            },
            useHTML5Audio: true,
            preferFlash: false,
            debugMode: false
        });
        console.log('sm2 setup');
        self.loader = new PxLoader();
        self.assetManager = new NumberMaze.AssetManager(this);
        self.loader.addCompletionListener(function() {
                console.log('sprites loaded');
                var bgloader = new PxLoader();
                self.assetManager.Add('bgm', bgloader.addSound('bgm', 'audio/bgm.ogg'));
                bgloader.addCompletionListener(function() {
                    console.log('bgm loaded');
                    (function loopBG(s) {
                        s.play({
                            volume: 10,
                            onfinish: function() {
                                loopBG(s);
                            }
                        })
                    })(self.assetManager.Get('bgm'));
                });
                preloading = false;
                $('#preLoader').hide();
                loadComponents();
        });

        /** self.uiManager handles the screen and the user interactions
         *  @type NumberMaze.UIManager
         *  @private */
        self.uiManager;

        /** Core game engine which handles all game mechanics 
         *  @type NumberMaze.CoreEngine
         *  @private */
        self.engine;

        /** Object that handles the main menu screen
         *  @type NumberMaze.MainMenu
         *  @private */
        self.mainMenu;

        /** Object that handles the credits screen
         *  @type NumberMaze.CreditsScreen
         *  @private */
        self.creditsScreen;

        /** Object that handles the leaderboard screen
         *  @type NumberMaze.LBoard
         *  @private */
        self.LBoard;

        /** Object that handles the pause screen
         *  @type NumberMaze.PauseScreen
         *  @private */
        self.pauseScreen;

        /** Object that handles the game over screen
         *  @type NumberMaze.GameOver
         *  @private */
        self.gameOver;

        /** Object that handles the game win screen
         *  @type NumberMaze.WonScreen
         *  @private */
        self.gameWin;

        /** Object that handles the game over screen
         *  @type NumberMaze.GameOver
         *  @private */
        var gOverScreen;

        /** Object that handles the pracise failing screen
         *  @type NumberMaze.PractiseFail
         *  @private */
        self.practiseFail;

        /** Component that renders the star field animation
         *  @type NumberMaze.Starfield
         *  @private */
        var starField;

        //sets up the game loop
        window.requestAnimFrame = (function(){
            return  window.requestAnimationFrame   || 
                window.webkitRequestAnimationFrame || 
                window.mozRequestAnimationFrame    || 
                window.oRequestAnimationFrame      || 
                window.msRequestAnimationFrame     || 
                function( callback ){
                    window.setTimeout(callback, 1000 / 30);
                };
        })();
        loadComponents                  =   function() {
            console.log("NumberMaze : loadComponents");
            state.gridStatus            =   [];
            for (var i = 0; i < NumberMaze.State.rowCount; i++) {
                state.gridStatus[i]     =   [];
                for (var j = 0; j < NumberMaze.State.colCount; j++) {
                    state.gridStatus[i][j]=   0;
                }
            }

            if(state.online)
                if (typeof(Playtomic) != 'undefined')
                    Playtomic.Log.View('7158', "b34119c5c7074dd4", "883aa0c303e544fe9900683df59b0f", document.location);

            self.uiManager   =   new NumberMaze.UIManager(self);
            self.uiManager.delegate = self;
            self.engine      =   new NumberMaze.CoreEngine(self);
            self.engine.delegate =   self.uiManager;
            self.mainMenu    =   new NumberMaze.MainMenu(self);
            self.mainMenu.delegate =   self.uiManager;
            self.creditsScreen=   new NumberMaze.Credits(self);
            self.creditsScreen.delegate =   self.uiManager;
            self.LBoard      =   new NumberMaze.LBoard(self);
            self.LBoard.delegate =   self.uiManager;
            self.pauseScreen =   new NumberMaze.PauseScreen(self);
            self.pauseScreen.delegate =   self.uiManager;
            self.gameOver    =   new NumberMaze.GameOver(self);
            self.gameOver.delegate =   self.uiManager;
            self.gameWin     =   new NumberMaze.WonScreen(self);
            self.gameWin.delegate =   self.uiManager;
            gOverScreen =   new NumberMaze.GameOver(self);
            gOverScreen.delegate =   self.uiManager;
            self.practiseFail =   new NumberMaze.PractiseFail(self);
            self.practiseFail.delegate =   self.uiManager;
            starField       =   new NumberMaze.StarField(self);

            //handlers for the window events
            window.addEventListener('resize', self.uiManager.resize, false);
            window.addEventListener('orientationchange', self.uiManager.resize, false);

            self.mousedown  =   function(tx, ty) {
                if (state.currentScreen == 'game') {
                    console.log(Math.dist(self.engine.getStartLocation(), {x: tx, y: ty}) < 20);
                    //if (state.inGameState == 'waiting' && Math.dist(self.engine.getStartLocation(), {x: tx, y: ty}) < 20) {
                    if (state.inGameState == 'waiting') {
                        state.inGameState = 'playing';
                    }
                    self.engine.hud.mousedown(tx, ty);
                }
            };

            self.mousemove  =   function(tx, ty) {
                starField.mousemove(tx, ty);
                if(state.currentScreen == 'game') {
                    if(state.inGameState == 'playing' || state.inGameState == 'ending')
                        self.engine.addPoint(tx, ty);
                    else if(state.inGameState == 'waiting')
                        self.engine.mousemove(tx, ty);
                }
                else if(state.currentScreen == 'menu')
                    self.mainMenu.mousemove(tx, ty);
                else if(state.currentScreen == 'credits')
                    self.creditsScreen.mousemove(tx, ty);
                else if(state.currentScreen == 'lboard')
                    self.LBoard.mousemove(tx, ty);
                else if(state.currentScreen == 'paused')
                    self.pauseScreen.mousemove(tx, ty);
                else if(state.currentScreen == 'gameover')
                    self.gameOver.mousemove(tx, ty);
                else if(state.currentScreen == 'gamewon')
                    self.gameWin.mousemove(tx, ty);
                else if(state.currentScreen == 'practisefail')
                    self.practiseFail.mousemove(tx, ty);
            };

            self.mouseup    =   function(tx, ty) {
                if (state.currentScreen == 'paused') {
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
                } else if (state.currentScreen == 'practisefail') {
                    self.practiseFail.mouseup(tx, ty);
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
                self.practiseFail.resizeLayout(tWidth, tHeight);
                starField.resizeLayout(tWidth, tHeight);
            };

            prevFTime                   =   new Date().getTime();
            
            //actual game loop
            (function gameLoop() {
                var time                =   new Date().getTime();
                var dt                  =   (time - prevFTime) / 1000.0;
                prevFTime               =   time;

                state.effectsOn         =   dt > 1 / 60.0 ? true : false;
                state.effectsOn         =   false;
            
                starField.draw(self.context);
                if(preloading == true) {
                } else if(state.currentScreen == 'game') {
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
                    self.screenCtx.clearRect(0, 0, self.menuCanvas.width, self.menuCanvas.height);
                    self.mainMenu.update(dt);
                    self.mainMenu.draw(self.screenCtx);
                } else if (state.currentScreen == 'lboard') {
                    console.log('sdfsd');
                    self.screenCtx.clearRect(0, 0, self.menuCanvas.width, self.menuCanvas.height);
                    self.LBoard.update(dt);
                    self.LBoard.draw(self.screenCtx);
                } else if (state.currentScreen == 'credits') {
                    self.screenCtx.clearRect(0, 0, self.menuCanvas.width, self.menuCanvas.height);
                    self.creditsScreen.update(dt);
                    self.creditsScreen.draw(self.screenCtx);
                } else if (state.currentScreen == 'practisefail') {
                    self.screenCtx.clearRect(0, 0, self.menuCanvas.width, self.menuCanvas.height);
                    self.practiseFail.update(dt);
                    self.practiseFail.draw(self.screenCtx);
                }
                window.requestAnimFrame(gameLoop);
            })();
        };
 
        $('#profileDiv').hide();
   };
})(jQuery);
