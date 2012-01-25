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
(function(undefined) {
    UIManager           =   function(g) {
        this.resize = function() {
            console.log('resize');
            var gConfig             =   NumberMaze.GameConfig;
            var widthToHeight       =   4 / 3;
            var newWidth            =   window.innerWidth;
            var newHeight           =   window.innerHeight;
            var newWidthToHeight    =   newWidth / newHeight;

            if (newWidthToHeight > widthToHeight) {
                newHeight           =   (newHeight < gConfig.minCanvasHeight) ? gConfig.minCanvasHeight : newHeight;
                newHeight           =   (newHeight > gConfig.maxCanvasHeight) ? gConfig.maxCanvasHeight : newHeight;
                newWidth            =   newHeight * widthToHeight;
            } else {
                newWidth            =   (newWidth < gConfig.minCanvasWidth) ? gConfig.minCanvasWidth : newWidth;
                newWidth            =   (newWidth > gConfig.maxCanvasWidth) ? gConfig.maxCanvasWidth : newWidth;
                newHeight           =   newWidth / widthToHeight;
            }

            g.gameArea.style.width  =   newWidth + 'px';
            g.gameArea.style.height =   newHeight + 'px';
            g.gameArea.style.marginTop= (-newHeight / 2) + 'px';
            g.gameArea.style.marginLeft=(-newWidth / 2) + 'px';
            g.gameArea.style.fontSize=  (newWidth / 400) + 'em';

            g.gameCanvas.width      =   newWidth;
            g.gameCanvas.height     =   newHeight;
        };
    };
})();  
