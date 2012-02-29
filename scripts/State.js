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
 * This JS Object holds all data that are relevant for current game state
 * like game width, game height, current screen, current level, etc.,
*/
(function(undefined) {
    NumberMaze.State                =   {
        gameWidth               :   640,
        gameHeight              :   480,
        currentScreen           :   'game',
        currentLevel            :   0,

        /** represents if the gameplay is started or the scene is just being rendered */
        active                  :   true,

        /** a 2d array of integers that represent the state of numbers.
         *  0 - open (yet to touch)
         *  1 - target (next letter to touch)
         *  2 - hit (the circle is touched and animating; ll change to closed once anim is over)
         *  3 - closed (already touched, game over if touched again)
         *  4 - explode (wrong circle is touched and so exploding) */
        gridStatus              :   [],

        /** elapsed time since the start of the level */
        elapsedtime             :   0
    };
})();
