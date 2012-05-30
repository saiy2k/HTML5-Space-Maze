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

        var backButton              =   new NumberMaze.MenuButton("back", 0.1, 0.06, 0.2, 0.1);
        backButton.delegate         =   self;
        var easyButton              =   new NumberMaze.MenuButton("easy", 0.35, 0.9, 0.2, 0.1);
        easyButton.delegate         =   self;
        var hardButton              =   new NumberMaze.MenuButton("hard", 0.65, 0.9, 0.2, 0.1);
        hardButton.delegate         =   self;

        this.mouseup              =   function(tx, ty) {
            backButton.mouseup(tx, ty);
            easyButton.mouseup(tx, ty);
            hardButton.mouseup(tx, ty);
        }

        this.mousemove             =   function(tx, ty) {
            backButton.mousemove(tx, ty);
            easyButton.mousemove(tx, ty);
            hardButton.mousemove(tx, ty);
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
            backButton.resizeLayout(tWidth, tHeight);
            easyButton.resizeLayout(tWidth, tHeight);
            hardButton.resizeLayout(tWidth, tHeight);
        };

        this.update                 =   function(dt) {
            backButton.update(dt);
            easyButton.update(dt);
            hardButton.update(dt);
        };

        this.draw                   =   function(ctx) {
            ctx.textBaseLine        =   'middle';
            ctx.textAlign           =   'center';
            ctx.fillStyle           =   'rgba(220, 220, 220, 0.8)';
            ctx.font                =   'bold ' + width/20 + 'px Geostar Fill';
            var shadowColor         =   ctx.shadowColor;
            ctx.shadowColor         =   '#d88';
            ctx.shadowOffsetX       =   0;
            ctx.shadowOffsetY       =   0;
            ctx.shadowBlur          =   30;
            ctx.fillText('Leader Boards', width / 2, height * 0.1);
            ctx.shadowColor         =   shadowColor;

            ctx.font                =   width/32 + 'px Icerberg';
            ctx.textAlign           =   'left';
            for (var i = 0; i < Math.min(self.scoreList.length, 10); i++) {
                var score           =   self.scoreList[i];
                ctx.fillText(i + 1, width * 0.1, 100 + i * 30);
                ctx.fillText(score.Name, width * 0.2, 100 + i * 30);
                ctx.fillText(score.Points, width * 0.8, 100 + i * 30);
            }

            ctx.font                =   width/30 + 'px Iceberg';
            ctx.textAlign           =   'center';
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
