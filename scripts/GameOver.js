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
 * This class handles the game over menu with buttons to restart the game
 * quit to main menu.
*/
(function(undefined) {
    NumberMaze.GameOver             =   function(g) {
        var self                    =   this; 
        var gConfig                 =   NumberMaze.GameConfig;

        /** reference to the object which subscribes to the screen event
         *  the subsribed object should implement the following functions:
         *      gOverScreenRestart(),
         *      pauseScreenQuit(),
         *  @type object
         *  @public */
        self.delegate;

        /** game score */
        this.score                  =   0;

        /** dimensions of the pause screen */
        var x                       =   0;  
        var y                       =   0;
        var width                   =   0;
        var height                  =   0;

        var restartButton           =   new NumberMaze.MenuButton("restart", 0.3, 0.8, 0.2, 0.1);
        restartButton.delegate      =   self;
        var quitButton              =   new NumberMaze.MenuButton("quit", 0.7, 0.8, 0.2, 0.1);
        quitButton.delegate         =   self;
        var lBoardButton            =   new NumberMaze.MenuButton("scoreboard", 0.5, 0.92, 0.2, 0.1);
        lBoardButton.delegate       =   self;

        this.mouseup                =   function(tx, ty) {
            restartButton.mouseup(tx, ty);
            quitButton.mouseup(tx, ty);
        };

        this.click                  =   function(btn) {
            if (btn          ==  restartButton) {
                self.delegate.pauseScreenRestart();
            } else if (btn          ==  quitButton) {
                self.delegate.pauseScreenQuit();
            }
        };

        this.resizeLayout           =   function(tWidth, tHeight) {
            x                       =   tWidth * 0.02;
            y                       =   tHeight * 0.02;
            width                   =   tWidth * 0.96;
            height                  =   tHeight * 0.96;

            restartButton.resizeLayout(tWidth, tHeight);
            quitButton.resizeLayout(tWidth, tHeight);
            lBoardButton.resizeLayout(tWidth, tHeight);
        };

        this.update                 =   function(dt) {
            restartButton.update(dt);
            quitButton.update(dt);
            lBoardButton.update(dt);
        };

        this.draw                   =   function(ctx) {
            ctx.textAlign           =   'center';
            ctx.fillStyle           =   'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(x, y, width, height);
            ctx.strokeRect(x, y, width, height);

            ctx.fillStyle           =   'rgba(255, 255, 255, 0.8)';
            ctx.font                =   'bold ' + width/20 + 'px Iceberg';
            ctx.fillText('Game Over', width * 0.5, height * 0.15);

            ctx.fillText('Your score is ', width * 0.5, height * 0.3);
            ctx.fillText(Math.round(self.score), width * 0.5, height * 0.4);

            restartButton.draw(ctx);
            quitButton.draw(ctx);
            lBoardButton.draw(ctx);
        };

        this.resizeLayout(g.menuCanvas.width, g.menuCanvas.height)
    };
})();
