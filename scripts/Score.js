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
 * This class is responsible for the timing and scoring calculations
 * of the game. This class generates the checkpoint timing, award score
 * on reaching targets, takes care of combo, etc.,
 * This class has no visual component
*/
(function(undefined) {
    NumberMaze.Score                =   function(g) {
        var self                    =   this; 

        /** reference to the object which subscribes the to the events
         *  the subsribed object should implement the following functions:
         *      gameTimeOut(),
         *  @type object
         *  @public */
        self.delegate;

        /** reference to game state object
         *  @type NumberMaze.State */
        var state                   =   NumberMaze.State;

        /** total score from level 1 to current level
         *  @type int
         *  @public */
        this.totalScore             =   0;

        /** time remaining to reach the next target
         *  @type double
         *  @public */
        this.chkPointRemain         =   0;

        /** reset the current game */
        this.reset                  =   function() {
            self.chkPointRemain     =   20.0;
            self.totalScore         =   0;
        };

        /** this method is invoked if a target is touched */
        this.targetTouched          =   function() {
            var timeAwarded         =   Math.random() * 2.0 + 1.0;
            self.chkPointRemain     +=  timeAwarded;
            return                      timeAwarded;
        };

        /** returns level completion bonus for the given level */
        this.getLevelBonus          =   function(lvl) {
            return                      5 + lvl * 2;
        };

        this.update                 =   function(dt) {
            state.elapsedTime       +=  dt;
            self.chkPointRemain     -=  dt;

            if (self.chkPointRemain <=  0 && self.delegate) {
                self.delegate.timeOut();
            }
        };

        this.reset();
    };
})();  
