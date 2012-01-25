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
 * This is the core Game Engine. The class is responsible for the following functions:
 *  1. connecting DOM with the rest of the engine
 *  2. initialzing all other game components
 *  3. updating and co-ordinating between all the game components
 *  4. running the game loop
*/
(function($, undefined) {
    NumberMaze          =   function() {
        //inits variables for all canvas
        this.gameArea   =   document.getElementById('gameArea');
        this.gameCanvas =   document.getElementById('gameCanvas');
        this.menuCanvas =   document.getElementById('menuCanvas');
        this.scoreCanvas=   document.getElementById('scoreCanvas');
        this.gOverCanvas=   document.getElementById('gameOverCanvas');

        //init the game components
        var self        =   this;
        var uiManager   =   new UIManager(this);
        
        //handles the window events
        window.addEventListener('resize', uiManager.resize, false);
        window.addEventListener('orientationchange', uiManager.resize, false);

        //sets up the initial UI and game loop
        uiManager.resize();
        $(this.menuCanvas).hide();
        $(this.scoreCanvas).hide();
        $(this.gOverCanvas).hide();

        window.requestAnimFrame = (function(){
            return  window.requestAnimationFrame   || 
                window.webkitRequestAnimationFrame || 
                window.mozRequestAnimationFrame    || 
                window.oRequestAnimationFrame      || 
                window.msRequestAnimationFrame     || 
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
        })();
 
        (function gameLoop() {
            window.requestAnimFrame(gameLoop);
            console.log('in loop');
        })();
    };
})(jQuery);

