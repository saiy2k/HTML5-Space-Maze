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
 * This class renders the main of the game with the following:
 * game title, new game, leaderboard, credits, music, fb, twitter,
 * google+
*/
(function(undefined) {
    NumberMaze.MainMenu             =   function(g) {
        var self                    =   this; 
        var gConfig                 =   NumberMaze.GameConfig;

        /** reference to the object which subscribes to the screen event
         *  the subsribed object should implement the following functions:
         *      mainMenuNewGameEasy(),
         *      mainMenuNewGameHard(),
         *      mainMenuNewGamePractice(),
         *      mainMenuLeaderboard(),
         *      mainMenuCredits(),
         *  @type object
         *  @public */
        self.delegate;

        /** flag that determines if the difficulty pop up should be shown
         *  @type bool
         *  @private */
        var showDiff;

        /** dimensions of the pause screen */
        var x                       =   0;  
        var y                       =   0;
        var width                   =   0;
        var height                  =   0;

        var newGameButton           =   new NumberMaze.MenuButton("new game", 140, 80, 160, 30);
        newGameButton.delegate      =   self;
        var practiceButton          =   new NumberMaze.MenuButton("practice", 320, 60, 160, 30);
        practiceButton.delegate     =   self;
        var easyButton              =   new NumberMaze.MenuButton("easy", 320, 100, 160, 30);
        easyButton.delegate         =   self;
        var hardButton              =   new NumberMaze.MenuButton("hard", 320, 140, 160, 30);
        hardButton.delegate         =   self;
        var lboardButton            =   new NumberMaze.MenuButton("score board", 140, 120, 160, 30);
        lboardButton.delegate       =   self;
        var musicButton             =   new NumberMaze.MenuButton("music on", 140, 160, 160, 30);
        musicButton.delegate        =   self;
        var creditsButton           =   new NumberMaze.MenuButton("credits", 140, 200, 160, 30);
        creditsButton.delegate      =   self;

        this.mousedown              =   function(tx, ty) {
            newGameButton.mousedown(tx, ty);
            lboardButton.mousedown(tx, ty);
            musicButton.mousedown(tx, ty);
            creditsButton.mousedown(tx, ty);

            if(showDiff) {
                easyButton.mousedown(tx, ty);
                hardButton.mousedown(tx, ty);
                practiceButton.mousedown(tx, ty);
            }
                
        };

        this.click                  =   function(btn) {
            if(btn                  ==  newGameButton) {
                showDiff            =   !showDiff;
            } else if (btn          ==  easyButton) {
                self.delegate.mainMenuNewGameEasy();
            } else if (btn          ==  hardButton) {
                self.delegate.mainMenuNewGameHard();
            } else if (btn          ==  practiceButton) {
                self.delegate.mainMenuNewGamePractice();
            } else if (btn          ==  lboardButton) {
                self.delegate.mainMenuLeaderboard();
            } else if (btn          ==  musicButton) {
                if (musicButton.text == "music on")
                    musicButton.text = "music off";
                else
                    musicButton.text = "music on";
            } else if (btn          ==  creditsButton) {
                self.delegate.mainMenuCredits();
            }
        };

        this.reset                  =   function() {
            showDiff                =   false;
        };

        this.resizeLayout           =   function(tWidth, tHeight) {
            width                   =   tWidth;
            height                  =   tHeight;
        };

        this.update                 =   function(dt) {
        };

        this.draw                   =   function(ctx) {
            ctx.fillStyle           =   'rgba(55, 55, 55, 0.8)';
            ctx.font                =   'bold ' + width/20 + 'px Iceberg';
            ctx.fillText('Main Menu', width * 0.1, height * 0.1);

            newGameButton.draw(ctx);
            lboardButton.draw(ctx);
            musicButton.draw(ctx);
            creditsButton.draw(ctx);

            if(showDiff) {
                practiceButton.draw(ctx);
                easyButton.draw(ctx);
                hardButton.draw(ctx);
            }
        };

        this.resizeLayout(g.menuCanvas.width, g.menuCanvas.height)
    };
})();
