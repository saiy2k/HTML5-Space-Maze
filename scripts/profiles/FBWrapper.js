/* Copyright 2011 Saiyasodharan (http://saiy2k.blogspot.com/) 
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
    NumberMaze.FBWrapper            =   {
        share                       :   function() {
                                            console.log('FBWraper : share');
                                            console.log(NumberMaze.State.fbLoggedin);
                                            if( NumberMaze.State.fbLoggedin == true ) {
                                                console.log('logged in');
                                                NumberMaze.State.fbSetForShare = false;
                                                ///*
                                                FB.api('/me/spacemaze:fly_through?level=http://www.gethugames.in/html5spacemaze&lid=5&access_token=AAAFBk8hj32QBAOSuVTbrhJD724HMBy3kz6sbV6II17UEBRROOlJU8X8H7ATHiWJZAIOiuu53DZCXogvpO34x51qbRZCf2l52gYrQNOnZBsRtrkF6phSo',
                                                    'post',
                                                    function(resp) {
                                                        if(!resp || resp.error) {
                                                            console.log('err occured');
                                                            console.log(resp.error);
                                                        } else {
                                                            console.log('successfull action');
                                                            console.log(resp);
                                                        }
                                                    });
                                                //*/
                                                /*
                                                FB.ui({
                                                    method: 'feed',
                                                    name: 'Astro Space Raid',
                                                    link: 'http://www.gethugames.in/numbermaze/',
                                                    picture: 'http://aux.iconpedia.net/uploads/251662856.png', 
                                                    caption: 'astro space raid',
                                                    description: 'addictive html5 space game'
                                                },
                                                function(response) {
                                                    NumberMaze.FBWrapper.getStatus();
                                                });
                                                */
                                            } else {
                                                console.log('yet to log in');
                                                NumberMaze.State.fbSetForShare  =   true;
                                                FB.login(function(response) {
                                                    if (response.authResponse) {
                                                        NumberMaze.FBWrapper.getUserData();
                                                    } else {
                                                        console.log('User cancelled login or did not fully authorize.');
                                                        console.log(response);
                                                    }
                                                });
                                            }
                                                                                    },

        getStatus                   :   function() {
                                            console.log('FBWrapper : getStatus');
                                            FB.getLoginStatus(function(response) {
                                                if (response.status == 'connected') {
                                                    NumberMaze.FBWrapper.getUserData();
                                                }
                                            });
                                        },

        getUserData                 :   function() {
                                            console.log('FBWraper : get user data');
                                            FB.api('/me', function(response) {
                                                NumberMaze.State.fbLoggedin = true;
                                                console.log(NumberMaze.State.fbLoggedin);
                                                NumberMaze.State.authProvider = 'facebook';
                                                NumberMaze.State.userInfo = response;
                                                $('#fbLoginButton').attr('src', 'images/fbIcon.png');
                                                console.log('Good to see you, ' + response.name + '.');
                                                NumberMaze.State.playerName = response.name;
                                                if(NumberMaze.State.fbSetForShare) {
                                                    NumberMaze.FBWrapper.share();
                                                }
                                            });
                                        }
    };
})();
