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
 * This class renders tutorial instructions and manages them
 */
(function(undefined) {
    NumberMaze.PracticeGame         =   function(g) {
        var self                    =   this;
        var state                   =   NumberMaze.State;
        var width                   =   0;
        var height                  =   0;
		var currentInstruction		= 	"";
		var currentTarget		=   undefined;
        var currentState                =   undefined;

        /** reference to the object which subscribes to events in this layer
         *  any object that implements the following functions:
         *      pauseButtonPrssed()
         *  @type object
         *  @public */
        this.delegate               =   null;
		
		this.OnGameStart			= 	function(target){
			currentTarget = target;
                        currentState  = "GameStart";
			currentInstruction = "Click on the ship/n to start the game.";
		};
		
		this.OnFirstClick			=	function(target){
			currentTarget = target;
                        currentState  = "FirstClick";
			currentInstruction = "Touch this asteroid/nDon't collide with/nyour own line!";
		};
		
		this.OnLineCrossed			=	function(target){
                    if(currentState != "LineCrossed"){
			currentTarget = target;
                        currentState  = "LineCrossed";
			currentInstruction = "Now cross all /nasteroids one by one";
                    }
		};
		
		this.OnAllCrossed			=	function(target){
			currentTarget = target;
                        currentState  = "AllCrossed";
			currentInstruction = "Finish by reaching/nyour planet!";
		};

        this.resizeLayout           =   function(tWidth, tHeight) {
            width                   =   tWidth;
            height                  =   tHeight;
        };
		
        this.update                 =   function(dt) {

        };

        this.draw                   =   function(ctx) {
			if(currentTarget != undefined){
				var targetX = currentTarget.x;
				var targetY = currentTarget.y;

				//Make sure that the tooltip is always visible
				if(g.assetManager.Get('tooltip').width + currentTarget.x > g.gameCanvas.width)
					targetX = g.gameCanvas.width - g.assetManager.Get('tooltip').width;
				if(currentTarget.x < 0)
					targetX = 0;
				if(g.assetManager.Get('tooltip').height + currentTarget.y > g.gameCanvas.height)
					targetY = g.gameCanvas.height - g.assetManager.Get('tooltip').height;
				if(currentTarget.y < 0)
					targetY = 0;
					
				ctx.drawImage(g.assetManager.Get('tooltip'), targetX, targetY, 164 * width / 640, 82 * height / 480);
				
				var strings = currentInstruction.split("/n");
				
				for(var i = 0; i < strings.length; i++)
					ctx.fillText(strings[i], targetX + width/28, targetY + (i+1)*height/24 + 6);
			}
        };
    };
})();
