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

        /** reference to game state object
         *  @type NumberMaze.State */
        var state       =   NumberMaze.State;

        /** either easy or hard
         *  @type string
         *  @private */
        var mode        =   'easy';

        /** dimensions of the pause screen */
        var x                       =   0;  
        var y                       =   0;
        var width                   =   0;
        var height                  =   0;

        var backButton              =   new NumberMaze.MenuButton("back", 0.1, 0.1, 0.2, 0.1);
        backButton.delegate         =   self;
        var easyButton              =   new NumberMaze.MenuButton("easy", 0, 0, 100, 30);
        easyButton.delegate         =   self;
        var hardButton              =   new NumberMaze.MenuButton("hard", 0, 0, 100, 30);
        hardButton.delegate         =   self;

        this.mousedown              =   function(tx, ty) {
            backButton.mousedown(tx, ty);
            easyButton.mousedown(tx, ty);
            hardButton.mousedown(tx, ty);
        }

        this.click                  =   function(btn) {
            if(btn                  ==  backButton) {
                self.delegate.LBoardBack();
            } else if (btn          ==  easyButton) {
                mode                =   'easy';
                self.reset();
            } else if (btn          ==  hardButton) {
                mode                =   'hard';
                self.reset();
            }
        };

        this.reset                  =   function() {
            var                         boardName;
            boardName               =   mode + '-' + (state.isMobile ? 'mobile' : 'normal');
            console.log(boardName);
            Playtomic.Leaderboards.List(boardName, scoreListingComplete);
        };

        this.resizeLayout           =   function(tWidth, tHeight) {
            width                   =   tWidth;
            height                  =   tHeight;

            backButton.x            =   (tWidth - backButton.width) * 0.1;
            backButton.y            =   height * 0.1;
            easyButton.x            =   (tWidth - easyButton.width) * 0.9;
            easyButton.y            =   height * 0.1;
            hardButton.x            =   (tWidth - hardButton.width) * 0.9;
            hardButton.y            =   height * 0.2;
        };

        this.update                 =   function(dt) {
        };

        this.draw                   =   function(ctx) {
            ctx.textAlign           =   'center';
            ctx.fillStyle           =   'rgba(55, 55, 55, 0.8)';
            ctx.font                =   'bold ' + width/20 + 'px Iceberg';
            ctx.fillText('leader boards', width * 0.5, height * 0.1);

            for (var i = 0; i < self.scoreList.length; i++) {
                var score           =   self.scoreList[i];
                ctx.fillText(" - " + score.Name + " got " + score.Points + " on " + score.SDate, 200, 100 + i * 30);
            }

            backButton.draw(ctx);
            easyButton.draw(ctx);
            hardButton.draw(ctx);
        };

        this.resizeLayout(g.menuCanvas.width, g.menuCanvas.height);

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
