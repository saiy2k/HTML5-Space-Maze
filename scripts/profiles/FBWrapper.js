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
 * This component is responsible for connecting to Facebook through OAuth
 * and getting basic user information like user name, profile picture, etc.,
*/
(function(undefined) {
    NumberMaze.FBWrapper            =   function() {
        return {

            login                       :   function() {
                FB.login(function(response) {
                    if (response.authResponse) {
                        console.log('Welcome!  Fetching your information.... ');
                        FB.api('/me', function(response) {
                            NumberMaze.State.authProvider = 'facebook';
                            NumberMaze.State.userInfo = response;
                            $('#notloggedin').hide();
                            $('#loggedin').show();
                            $('#loggedin').html('Welcome, <br/>' + response.name);
                            console.log(response);
                            console.log('Good to see you, ' + response.name + '.');
                        });
                    } else {
                        console.log('User cancelled login or did not fully authorize.');
                        console.log(response);
                    }
                });
            }

        };
    };
})();
