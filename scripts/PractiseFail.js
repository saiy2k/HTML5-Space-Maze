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
 * This class shows the failure state of practise session and show options
 * to restart practise session and to quit to main menu
*/
(function(undefined) {
    NumberMaze.PractiseFail         =   function(g) {
        var self                    =   this; 

        /** reference to the object which subscribes to the screen event
         *  the subsribed object should implement the following functions:
         *      pauseScreenRestart(),
         *      pauseScreenQuit(),
         *  @type object
         *  @public */
        self.delegate;

        /** dimensions of the pause screen */
        var x                       =   0;  
        var y                       =   0;
        var width                   =   0;
        var height                  =   0;

        var restartButton           =   new NumberMaze.MenuButton("restart", 0.25, 0.9, 0.2, 0.1);
        restartButton.delegate      =   self;
        var quitButton              =   new NumberMaze.MenuButton("quit", 0.75, 0.9, 0.2, 0.1);
        quitButton.delegate         =   self;

        this.mouseup                =   function(tx, ty) {
            restartButton.mouseup(tx, ty);
            quitButton.mouseup(tx, ty);
        };

        this.mousemove              =   function(tx, ty) {
            restartButton.mousemove(tx, ty);
            quitButton.mousemove(tx, ty);
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
        };

        this.update                 =   function(dt) {
            restartButton.update(dt);
            quitButton.update(dt);
        };

        this.draw                   =   function(ctx) {
            ctx.fillStyle           =   'rgba(100, 100, 100, 0.3)';
            ctx.fillRect(width * 0.02, height * 0.02, width, height * 0.8);
            ctx.textBaseLine        =   'middle';
            ctx.textAlign           =   'center';
            ctx.fillStyle           =   'rgba(220, 220, 220, 0.8)';
            ctx.font                =   'bold ' + width/20 + 'px Geostar Fill';
            var shadowColor         =   ctx.shadowColor;
            ctx.shadowColor         =   '#d88';
            ctx.shadowOffsetX       =   0;
            ctx.shadowOffsetY       =   0;
            ctx.shadowBlur          =   30;
            ctx.fillText('PRACTISE FAILURE', width / 2, height * 0.1);
            ctx.shadowColor         =   shadowColor;

            ctx.font                =   width/30 + 'px Iceberg';
            restartButton.draw(ctx);
            quitButton.draw(ctx);
        };

        this.resizeLayout(g.menuCanvas.width, g.menuCanvas.height)
    };
})();
