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
 * This class renders the main of the game with the following:
 * game title, new game, leaderboard, credits, music, fb, twitter,
 * google+
*/
(function(undefined) {
    NumberMaze.MainMenu             =   function(g) {
        var self                    =   this; 

        /** reference to the object which subscribes to the screen event
         *  the subsribed object should implement the following functions:
         *      mainMenuNewGameEasy(),
         *      mainMenuNewGameHard(),
         *      mainMenuNewGamePractice(),
         *      mainMenuLeaderboard(),
         *      mainMenuCredits(),
         *  @type object
         *  @public */
        self.delegate;

        /** array of points to show mouse move animation
         *  @type array(point)
         *  @type public */
        this.pointArray;

        /** array of points to show mouse move animation
         *  @type array(point)
         *  @type public */
        this.pointArray1;

        /** array of points to show mouse move animation
         *  @type array(point)
         *  @type public */
        this.pointArray2;

        /** flag that determines if the difficulty pop up should be shown
         *  @type bool
         *  @private */
        var showDiff;

        /** time since last point removal
         *  @type int
         *  @private */
        var elapsed;

        /** dimensions of the pause screen */
        var x                       =   0;  
        var y                       =   0;
        var width                   =   0;
        var height                  =   0;

        var newGameButton           =   new NumberMaze.MenuButton("new game", 0.5, 0.3, 0.25, 0.1);
        newGameButton.delegate      =   self;
        var easyButton              =   new NumberMaze.MenuButton("easy", 0.8, 0.3, 0.25, 0.1);
        easyButton.delegate         =   self;
        var hardButton              =   new NumberMaze.MenuButton("hard", 0.8, 0.4, 0.25, 0.1);
        hardButton.delegate         =   self;
        var lboardButton            =   new NumberMaze.MenuButton("score board", 0.5, 0.6, 0.25, 0.1);
        lboardButton.delegate       =   self;
        var practiceButton          =   new NumberMaze.MenuButton("tutorial", 0.5, 0.45, 0.25, 0.1);
        practiceButton.delegate     =   self;
        var creditsButton           =   new NumberMaze.MenuButton("credits", 0.5, 0.75, 0.25, 0.1);
        creditsButton.delegate      =   self;

        this.addPoint               =   function(tx, ty) {
            var pt                  =   {x:tx, y:ty};   

            if(self.pointArray.length > 1) {
                if(Math.dist(pt, self.pointArray[self.pointArray.length - 1]) > 3) {
                    self.pointArray.push(pt);
                    self.pointArray1.push({x: tx + Math.random() * 5 - 2.5, y: ty + Math.random() * 5 - 2.5});
                    self.pointArray2.push({x: tx + Math.random() * 5 - 2.5, y: ty + Math.random() * 5 - 2.5});
                }
            } else {
                self.pointArray.push(pt);
                self.pointArray1.push(pt);
                self.pointArray2.push(pt);
            }
        };

        this.mouseup                =   function(tx, ty) {
            newGameButton.mouseup(tx, ty);
            lboardButton.mouseup(tx, ty);
            creditsButton.mouseup(tx, ty);
            practiceButton.mouseup(tx, ty);

            if(showDiff) {
                easyButton.mouseup(tx, ty);
                hardButton.mouseup(tx, ty);
            }
        };

        this.mousemove              =   function(tx, ty) {
            self.addPoint(tx, ty);
            newGameButton.mousemove(tx, ty);
            lboardButton.mousemove(tx, ty);
            creditsButton.mousemove(tx, ty);
            practiceButton.mousemove(tx, ty);

            if(showDiff) {
                easyButton.mousemove(tx, ty);
                hardButton.mousemove(tx, ty);
            }
        };

        this.click                  =   function(btn) {
            if(btn                  ==  newGameButton) {
                showDiff            =   !showDiff;
            } else if (btn          ==  easyButton) {
                self.delegate.mainMenuNewGameEasy();
            } else if (btn          ==  hardButton) {
                self.delegate.mainMenuNewGameHard();
            } else if (btn          ==  practiceButton) {
                self.delegate.mainMenuNewGamePractice();
            } else if (btn          ==  lboardButton) {
                self.delegate.mainMenuLeaderboard();
            } else if (btn          ==  creditsButton) {
                self.delegate.mainMenuCredits();
            }
        };

        this.reset                  =   function() {
            elapsed                 =   0;
            showDiff                =   false;
            self.pointArray         =   [];
            self.pointArray1        =   [];
            self.pointArray2        =   [];
        };

        this.resizeLayout           =   function(tWidth, tHeight) {
            var                         size;

            width                   =   tWidth;
            height                  =   tHeight;

            newGameButton.resizeLayout(tWidth, tHeight);
            lboardButton.resizeLayout(tWidth, tHeight);
            creditsButton.resizeLayout(tWidth, tHeight);
            practiceButton.resizeLayout(tWidth, tHeight);
            easyButton.resizeLayout(tWidth, tHeight);
            hardButton.resizeLayout(tWidth, tHeight);
        };

        this.update                 =   function(dt) {
            elapsed                 +=  dt;
            if (elapsed > 0.4 - self.pointArray.length / 20) {
                self.pointArray.shift();
                self.pointArray1.shift();
                self.pointArray2.shift();
                elapsed             =   0;
            }
            newGameButton.update(dt);
            lboardButton.update(dt);
            creditsButton.update(dt);
        };

        this.draw                   =   function(ctx) {
            ctx.textBaseLine        =   'middle';
            ctx.textAlign           =   'center';
            ctx.fillStyle           =   'rgba(220, 220, 220, 0.8)';
            ctx.font                =   'bold ' + width/16 + 'px Geostar Fill';
            var shadowColor         =   ctx.shadowColor;
            ctx.shadowColor         =   '#d88';
            ctx.shadowOffsetX       =   0;
            ctx.shadowOffsetY       =   0;
            ctx.shadowBlur          =   30;
            ctx.fillText('HTML5 Space Maze', width / 2, height * 0.12);
            ctx.fillText('(ALPHA)', width / 2, height * 0.2);
            ctx.shadowColor         =   shadowColor;

            ctx.lineWidth       =   width / 100;
            ctx.lineCap         =   'round';
            ctx.fillStyle           =   'rgbaw210, 200, 200, 0.8)';
            var oper                =   ctx.globalCompositeOperation;
            ctx.globalCompositeOperation = 'lighter';

            if(self.pointArray.length > 0) {
                ctx.strokeStyle     =   'rgba(255, 55, 55, 0.4)';
                ctx.beginPath();
                ctx.moveTo(self.pointArray[0].x, self.pointArray[0].y);
                for(var i = 1; i < self.pointArray.length; i++) {
                    ctx.lineTo(self.pointArray[i].x, self.pointArray[i].y);
                }
                ctx.stroke();
                ctx.closePath();

                ctx.strokeStyle     =   'rgba(55, 255, 55, 0.4)';
                ctx.beginPath();
                ctx.moveTo(self.pointArray1[0].x, self.pointArray1[0].y);
                for(var i = 1; i < self.pointArray.length; i++) {
                    ctx.lineTo(self.pointArray1[i].x, self.pointArray1[i].y);
                }
                ctx.stroke();
                ctx.closePath();

                ctx.strokeStyle     =   'rgba(255, 55, 55, 0.4)';
                ctx.beginPath();
                ctx.moveTo(self.pointArray2[0].x, self.pointArray2[0].y);
                for(var i = 1; i < self.pointArray.length; i++) {
                    ctx.lineTo(self.pointArray2[i].x, self.pointArray2[i].y);
                }
                ctx.stroke();
                ctx.closePath();
            }
            ctx.globalCompositeOperation = oper;

            ctx.strokeStyle         =   'rgba(255, 255, 255, 0.2)';
            ctx.font                =   width/26 + 'px Iceberg';
            newGameButton.draw(ctx);
            lboardButton.draw(ctx);
            creditsButton.draw(ctx);
            practiceButton.draw(ctx);

            if(showDiff) {
                easyButton.draw(ctx);
                hardButton.draw(ctx);
            }
        };

        self.reset();
        this.resizeLayout(g.menuCanvas.width, g.menuCanvas.height)
    };
})();
