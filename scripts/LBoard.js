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
 * This class is responsible for showing the scores of the user.
 * Most probably this class will use DOM objects to display data
 * rather than drawing to the canvas
*/
(function(undefined) {
    NumberMaze.LBoard               =   function(g) {
        var self                    =   this; 
        var gConfig                 =   NumberMaze.GameConfig;

        /** reference to the object which subscribes to the screen event
         *  the subsribed object should implement the following functions:
         *      LBoardBack(),
         *  @type object
         *  @public */
        self.delegate;


        /** array of score PlayTomic score object
         *  @type array (PlayTomic.Score)
         *  @public */
        self.scoreList = [];

        /** dimensions of the pause screen */
        var x                       =   0;  
        var y                       =   0;
        var width                   =   0;
        var height                  =   0;

        var backButton              =   new NumberMaze.MenuButton("back", 40, 40, 100, 30);
        backButton.delegate         =   self;

        this.mousedown              =   function(tx, ty) {
            backButton.mousedown(tx, ty);
        }

        this.click                  =   function(btn) {
            if(btn                  ==  backButton) {
                self.delegate.LBoardBack();
            }
        };

        this.reset                  =   function() {
            Playtomic.Leaderboards.List('hard', scoreListingComplete);
        };

        this.resizeLayout           =   function(tWidth, tHeight) {
            width                   =   tWidth;
            height                  =   tHeight;
        };

        this.update                 =   function(dt) {
        };

        this.draw                   =   function(ctx) {
            ctx.fillStyle           =   'rgba(55, 55, 55, 0.8)';
            ctx.font                =   'bold ' + width/20 + 'px Iceberg';
            ctx.fillText('leader boards', width * 0.1, height * 0.1);

            for (var i = 0; i < self.scoreList.length; i++) {
                var score           =   self.scoreList[i];
                ctx.fillText(" - " + score.Name + " got " + score.Points + " on " + score.SDate, 200, 100 + i * 30);
            }

            backButton.draw(ctx);
        };

        this.resizeLayout(g.menuCanvas.width, g.menuCanvas.height)

        function scoreListingComplete(scores, numscores, response) {
            console.log('score listing complete');
            if (response.Success) {
                self.scoreList      =   scores;
            } else {
                console.log(response);
            }
        }
    };
})();
