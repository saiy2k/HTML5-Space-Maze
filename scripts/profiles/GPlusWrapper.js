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
 * This component is responsible for connecting to Google through OAuth
 * and getting basic user information like user name, profile picture, etc.,
*/
(function(undefined) {
    NumberMaze.GPlusWrapper         =   function() {
        var OAUTHURL                =   'https://accounts.google.com/o/oauth2/auth?';
        var VALIDURL                =   'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
        var SCOPE                   =   'https://www.googleapis.com/auth/userinfo.profile';
        var CLIENTID                =   '716569014051.apps.googleusercontent.com';
        var REDIRECT                =   'http://localhost:8888/MAMP/html5/oauth'
        var TYPE                    =   'token';
        var _url                    =   OAUTHURL + 'scope=' + SCOPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT + '&response_type=' + TYPE;

        function validateToken(token) {
            $.ajax({
                url: VALIDURL + token,
                data: null,
                success: function(responseText){  
                    getUserInfo();
                },  
                dataType: "jsonp"  
            });
        }

        function getUserInfo() {
            $.ajax({
                url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + acToken,
                data: null,
                success: function(resp) {
                    NumberMaze.State.authProvider = 'google';
                    NumberMaze.State.userInfo = resp;
                    $('#notloggedin').hide();
                    $('#loggedin').show();
                    $('#loggedin').html('Welcome, <br/>' + resp.name);
                    console.log(resp);
                },
                dataType: "jsonp"
            });
        }

        //credits: http://www.netlobo.com/url_query_string_javascript.html
        function gup(url, name) {
            name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
            var regexS = "[\\#&]"+name+"=([^&#]*)";
            var regex = new RegExp( regexS );
            var results = regex.exec( url );
            if( results == null )
                return "";
            else
                return results[1];
        }

        return {
            /** access token obtained through OAuth */
            acToken                     :   '',

            /** expiry time of the token */
            expiresIn                   :   0,

            login                       :   function() {
                var win                 =   window.open(_url, "windowname1", 'width=640, height=480'); 

                var pollTimer           =   window.setInterval(function() { 
                    if (win.document.URL.indexOf(REDIRECT) != -1) {
                        window.clearInterval(pollTimer);
                        var url         =   win.document.URL;
                        acToken         =   gup(url, 'access_token');
                        tokenType       = gup(url, 'token_type');
                        expiresIn       = gup(url, 'expires_in');
                        win.close();

                        validateToken(acToken);
                    }
                }, 100);
            }
        };
    };
})();
