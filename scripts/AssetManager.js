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
 * This class helps keeping track of and loading assets.
 */
(function(undefined) {
	NumberMaze.AssetManager = function(g){

		/* Private */
		var pCache = {};

        var dummy = {};
        dummy.play = function() {};
		
		/* Public */
		return{
			Add : function(id, obj){
                pCache[id] = obj;
			},
			
			Get : function(id){
                if (typeof (pCache[id]) == 'undefined')
		            return dummy;
                else
		            return pCache[id];
			}
		}
    };
})();
