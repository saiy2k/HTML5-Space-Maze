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
 * Full credits for the Star Field goes to Christophe Résigné.
 * Code copied from http://www.chiptune.com/starfield/starfield.html
 *
 * This class renders the awesome star field as the background of the canvas.
*/
(function(undefined) {
    NumberMaze.StarField            =   function(g) {

        var flag=true;
        var test=true;
        var n=200;
        var w=0;
        var h=0;
        var x=0;
        var y=0;
        var z=0;
        var star_color_ratio=0;
        var star_x_save,star_y_save;
        var star_ratio=256;
        var star_speed=1;
        var star_speed_save=0;
        var star=new Array(n);
        var color;
        var opacity=0.1;

        var cursor_x=0;
        var cursor_y=0;
        var mouse_x=0;
        var mouse_y=0;

        var canvas_x=0;
        var canvas_y=0;
        var canvas_w=0;
        var canvas_h=0;
        var context;

        var key;
        var ctrl;

        var timeout;
        var fps=0;

        var bgSprite                =   g.assetManager.Get('spaceBackground');

        var self                    =   this; 

        this.mouseup                =   function(tx, ty) {
        };

        this.mousemove              =   function(tx, ty) {
            cursor_x                =   tx;
            cursor_y                =   ty;
        };

        this.reset                  =   function() {
        };

        this.resizeLayout           =   function(tWidth, tHeight) {
            var                         size;

            width                   =   tWidth;
            height                  =   tHeight;

        };

        this.update                 =   function(dt) {
        };

        this.draw                   =   function(context) {
            context.lineCap='round';
            context.fillStyle='rgb(0,0,0)';
            context.strokeStyle='rgb(100, 100, 100)';
            mouse_x=(cursor_x-x)/8;
            mouse_y=(cursor_y-y)/8;
            context.clearRect(0,0,w,h);
            context.drawImage(bgSprite, 0, 0);
            for(var i=0;i<n;i++)
            {
                test=true;
                star_x_save=star[i][3];
                star_y_save=star[i][4];
                star[i][0]+=mouse_x>>4; if(star[i][0]>x<<1) { star[i][0]-=w<<1; test=false; } if(star[i][0]<-x<<1) { star[i][0]+=w<<1; test=false; }
                star[i][1]+=mouse_y>>4; if(star[i][1]>y<<1) { star[i][1]-=h<<1; test=false; } if(star[i][1]<-y<<1) { star[i][1]+=h<<1; test=false; }
                star[i][2]-=star_speed; if(star[i][2]>z) { star[i][2]-=z; test=false; } if(star[i][2]<0) { star[i][2]+=z; test=false; }
                star[i][3]=x+(star[i][0]/star[i][2])*star_ratio;
                star[i][4]=y+(star[i][1]/star[i][2])*star_ratio;
                if(star_x_save>0&&star_x_save<w&&star_y_save>0&&star_y_save<h&&test)
                {
                    context.lineWidth=(2-star_color_ratio*star[i][2])*2;
                    context.beginPath();
                    context.moveTo(star_x_save,star_y_save);
                    context.lineTo(star[i][3],star[i][4]);
                    context.stroke();
                    context.closePath();
                }
            }
        };

        self.reset();
        this.resizeLayout(g.menuCanvas.width, g.menuCanvas.height)
        var a=0;
        w = 640;
        h = 480;
        x=Math.round(w/2);
        y=Math.round(h/2);
        z=(w+h)/2;
        star_color_ratio=1/z;
        cursor_x=x;
        cursor_y=y;
        for(var i=0;i<n;i++)
        {
            star[i]=new Array(5);
            star[i][0]=Math.random()*w*2-x*2;
            star[i][1]=Math.random()*h*2-y*2;
            star[i][2]=Math.round(Math.random()*z);
            star[i][3]=0;
            star[i][4]=0;
        }
    };
})();
