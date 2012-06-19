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
		var pDownloadQueue = [];
		var pSuccessCount = 0;
		var pErrorCount = 0;
		var pCache = {};
		
		var pEssentials = {};
		
		/* Public */
		return{
			Reset : function(){
				pCache.length = 0;
				pDownloadQueue.length = 0;
				pSuccessCount = 0;
				pErrorCount = 0;
			},
			
			Add : function(id, src, type){
				pDownloadQueue.push({"id" : id, "src" : src, "type" : type});
			},
			
			Get : function(id){
				if(pCache[id])
					return pCache[id];
				else
					return pEssentials[id];
			},
			
			Done : function(){
				return (pDownloadQueue.length == pSuccessCount+pErrorCount);
			},
			
			Status : function(){
				return ((pSuccessCount+pErrorCount * 100)/ pDownloadQueue.length);
			},
			
			DownloadAll : function(callback){
				var pMe = this;
				
				console.log('Loading assets...', true);
				if(pDownloadQueue.length === 0){
					callback();
					console.log('All assets loaded', true);
				}
				
				for(var i = 0; i < pDownloadQueue.length; i++){
					var asset = pDownloadQueue[i];
                    if(asset.type == 'json') {
                        $.getJSON(asset.src, function (j) {
                            console.log('New json loaded: ');
                            pSuccessCount++;
                            pCache[asset.id] = j;
                            if(pMe.Done()){
                                if(callback != undefined)
                                    callback();
                            }
                        })
                        .success()
                        .error(function() {
                            console.log('Error while loading this json: ' + asset.src, true);
                            pErrorCount++;
                            pCache[asset.id] = null;
                            if(pMe.Done()){
                                if(callback != undefined)
                                    callback();
                            }
                        })
                        .complete();
                    } else {
                        var img = new Image();
                        img.id = asset.id;
                        img.addEventListener('load', function(){
                            console.log('New image loaded: ' + this.src + " [" + this.id + "]", true);
                            pSuccessCount++;
                            if(pMe.Done()){
                                if(callback != undefined)
                                    callback();
                            }
                        }, false);
                        
                        img.addEventListener('error', function(e){
                            console.log('Error while loading this image: ' + asset.src, true);
                            pErrorCount++;
                            if(pMe.Done()){
                                if(callback != undefined)
                                    callback();
                            }
                        }, false);
                        
                        img.src = asset.src;
                        pCache[asset.id] = img;
                    }
				}
			}
		}
    };
})();
