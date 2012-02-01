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
        //inits variables for all canvas
        this.gameArea   =   document.getElementById('gameArea');
        this.gameCanvas =   document.getElementById('gameCanvas');
        this.menuCanvas =   document.getElementById('menuCanvas');
        this.scoreCanvas=   document.getElementById('scoreCanvas');
        this.gOverCanvas=   document.getElementById('gameOverCanvas');
        var touched     =   false;

        //init the game components
        var self        =   this;
        var uiManager   =   new NumberMaze.UIManager(this);
        var engine      =   new NumberMaze.CoreEngine(this);
        var context     =   this.gameCanvas.getContext('2d');
        uiManager.delegate = self;
        context.fillStyle = 'black';

        //handles the window events
        window.addEventListener('resize', uiManager.resize, false);
        window.addEventListener('orientationchange', uiManager.resize, false);
        self.mousedown  =   function(tx, ty) {
            touched     =   true;
        };

        self.mousemove  =   function(tx, ty) {
            if(touched)
                engine.addPoint(tx, ty);
        };

        self.mouseup    =   function(tx, ty) {
            touched     =   false;
        };

        //sets up the initial UI and game loop
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
            engine.update(1/30.0);
            engine.draw(context);
            window.requestAnimFrame(gameLoop);
        })();
    };
})(jQuery);

