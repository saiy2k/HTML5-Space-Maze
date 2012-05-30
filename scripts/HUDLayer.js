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
 * This class renders in game HUD menu which displays the score,
 * time, pause button and other HUD elements
*/
(function(undefined) {
    NumberMaze.HUDLayer             =   function(g) {
        var self                    =   this;
        var state                   =   NumberMaze.State;
        var x                       =   2;
        var y                       =   2;
        var width                   =   0;
        var height                  =   0;
        var chkTime                 =   0;
        var score                   =   0;
        var fontSize                =   15;
        var delFontSize             =   0.5;

        /** sprite for menu button
         *  @type Image
         *  @private */
        var menuSprite              =   g.assetManager.Get('asteroidSprite');
        var menuSpriteFrame         =   g.assetManager.Get('spriteData').frames[51].frame;

        /** reference to the object which subscribes to events in this layer
         *  any object that implements the following functions:
         *      pauseButtonPrssed()
         *  @type object
         *  @public */
        this.delegate               =   null;

        /** resets the state for a fresh new game */
        this.reset                  =   function() {
        };

        /** handler for mousedown event */
        this.mousedown              =   function(tx, ty) {
            if (Math.dist({x: tx, y: ty}, {x: width * 0.96, y: height * 0.5}) < menuSpriteFrame.w / 2)
                self.delegate.pauseButtonPressed();
        };

        /** updates the cellWidth and cellHeight as per new game area.
         *  also updates the position of the numbers  */
        this.resizeLayout           =   function(tWidth, tHeight){
            width                   =   tWidth - 4;
            height                  =   tHeight * 0.1;
        };

        this.update                 =   function(dt, time, tScore) {
            //fontSize                +=  delFontSize;
            //console.log(fontSize);
            if (fontSize > 24 || fontSize < 12) {
                if (fontSize > 24)
                    fontSize        =   24;
                else
                    fontSize        =   12;
                if (delFontSize < 0)
                    delFontSize     =   4 - (time / 10.0);
                else
                    delFontSize     =   -4 + (time / 10.0);
            }
            chkTime                 =   time;
            score                   =   tScore;
        };

        this.draw                   =   function(ctx) {
            //ctx.drawImage(menuSprite, menuSpriteFrame.x, menuSpriteFrame.y, menuSpriteFrame.w, menuSpriteFrame.h, width * 0.96 - menuSpriteFrame.w / 2, height * 0.5 - menuSpriteFrame.h/ 2, menuSpriteFrame.w, menuSpriteFrame.h);
        };
        
        this.resizeLayout(g.gameCanvas.width, g.gameCanvas.height);
    };
})();
