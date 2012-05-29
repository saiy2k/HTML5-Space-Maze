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
 * Also it holds all game configuration data from play area, time settings,
 * grid sizes, etc.,
*/
(function(undefined) {
    NumberMaze.State                =   {
        minCanvasWidth          :   320,
        minCanvasHeight         :   240,
        maxCanvasWidth          :   640,
        maxCanvasHeight         :   480,
        lineDelta               :   3,
        rowCount                :   3,
        colCount                :   4,
        gameWidth               :   640,
        gameHeight              :   480,

        /** boolean that tells if the game if net connection is available 
         *  @type bool
         *  @public */
        online                  :   true,

        /** determines if the game is being played in mobile
         *  @type bool
         *  @public */
        isMobile                :   false,

        /** holds a unique ID that represents the screen that is 
         *  currently being rendered.
         *  Possible values: game, menu, lboard, credits, paused, gameover, gamewon
         *  @type String
         *  @public */
        currentScreen           :   'menu',

        /** represents the current in-game state.
         *  Possible values being waiting, playing, ending, exploding, won, lose
         *  @type String
         *  @public */
        inGameState             :   'waiting',

        /** represents the game mode either practise / easy / hard
         *  @type String
         *  @public */
        gameMode                :   'practise',

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
        elapsedtime             :   0,

        /** boolean that indicates whether our app is connected to FB */
        fbLoggedin              :   false,

        /** Authentication provider. Can have values:
         *  google, facebook, twitter */
        authProvider            :   '',

        /** name of the user, which is retrieved through OAuth provider */
        playerName              :   '',
    };
})();
