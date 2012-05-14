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
 * This class renders credits, developer details, licensing,
 * source code and other such details
*/
(function(undefined) {
    NumberMaze.Credits              =   function(g) {
        var self                    =   this; 

        /** reference to the object which subscribes to the screen event
         *  the subsribed object should implement the following functions:
         *      creditsBack(),
         *  @type object
         *  @public */
        self.delegate;

        /** dimensions of the pause screen */
        var x                       =   0;  
        var y                       =   0;
        var width                   =   0;
        var height                  =   0;

        var backButton              =   new NumberMaze.MenuButton("back", 0.1, 0.1, 0.2, 0.1);
        backButton.delegate         =   self;

        this.mouseup                =   function(tx, ty) {
            backButton.mouseup(tx, ty);
        };

        this.click                  =   function(btn) {
            if(btn                  ==  backButton) {
                self.delegate.creditsBack();
            }
        };

        this.reset                  =   function() {
        };

        this.resizeLayout           =   function(tWidth, tHeight) {
            width                   =   tWidth;
            height                  =   tHeight;
            backButton.resizeLayout(tWidth, tHeight);
        };

        this.update                 =   function(dt) {
        };

        this.draw                   =   function(ctx) {
            ctx.textAlign           =   'center';
            ctx.fillText('credits', width * 0.5, height * 0.1);

            ctx.font                =   width/30 + 'px Homemade Apple';
            backButton.draw(ctx);
        };

        this.resizeLayout(g.menuCanvas.width, g.menuCanvas.height);
    };
})();
