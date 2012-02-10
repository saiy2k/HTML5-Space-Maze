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
 * This class handles the pause menu with buttons to restart the game, resume
 * the game, help and quit to main menu.
*/
(function(undefined) {
    NumberMaze.PauseScreen          =   function(g) {
        var self                    =   this; 
        var gConfig                 =   NumberMaze.GameConfig;

        /** reference to the object which subscribes to the screen event
         *  the subsribed object should implement the following functions:
         *      resume(),
         *      restart(),
         *      quit(),
         *      help()
         *  @type object
         *  @public */
        self.delegate;

        this.mousedown              =   function(tx, ty) {
            self.delegate.restart();
        };

        this.resizeLayout           =   function(tWidth, tHeight) {
        };

        this.update                 =   function(dt) {
        };

        this.draw                   =   function(ctx) {
            ctx.fillText('Paused', 20, 20);
        };
    };
})();  
