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
                                            var state = NumberMaze.State;
                                            console.log('FBWraper : share');
                                            console.log(NumberMaze.State.fbLoggedin);
                                            if( NumberMaze.State.fbLoggedin == true ) {
                                                console.log('logged in');
                                                NumberMaze.State.fbSetForShare = false;
                                                state.fbShareStatus = 'posting action...';
                                                var url = '/me/spacemaze:fly_through?maze=http://www.gethugames.in/html5spacemaze' + 
                                                    '&lid=' + state.currentLevel + 
                                                    '&score=' + game.engine.getScore() + 
                                                    '&access_token=' + NumberMaze.State.fbAccessToken;
                                                    console.log(url);
                                                    console.log('aa');
                                                    console.log(url);
                                                    /*
                                                FB.api(url,//'/me/spacemaze:fly_through',
                                                    'post',
                                                    //{maze: 'http://www.gethugames.in/html5spacemaze/', lid: state.currentLevel, score: 1001},
                                                    function(resp) {
                                                        if(!resp || resp.error) {
                                                            console.log('err occured');
                                                            console.log(resp.error);
                                                            state.fbShareStatus = 'error in posting action...';
                                                        } else {
                                                            console.log('successfull action');
                                                            console.log(resp);
                                                            state.fbShareStatus = 'successfully posted the action';
                                                        }
                                                    });
                                                    */

                                                FB.ui({
                                                    method: 'feed',
                                                    name: 'HTML5 Space Maze',
                                                    link: 'http://www.gethugames.in/html5spazemaze/',
                                                    picture: 'http://www.gethugames.in/html5spacemaze/images/icon256.png', 
                                                    caption: 'Cleared ' + (state.currentLevel-1) + ' mazes',
                                                    description: 'successfully cleared ' + (state.currentLevel-1) + ' mazes and won the game, scoring ' + Math.round(game.engine.getScore()) + ' points'
                                                },
                                                function(response) {
                                                    //NumberMaze.FBWrapper.getStatus();
                                                });

                                            } else {
                                                console.log('yet to log in');
                                                NumberMaze.State.fbSetForShare  =   true;
                                                state.fbShareStatus = 'logging in...';
                                                FB.login(function(response) {
                                                    if (response.authResponse) {
                                                        NumberMaze.FBWrapper.getUserData();
                                                    } else {
                                                        console.log('User cancelled login or did not fully authorize.');
                                                        console.log(response);
                                                    }
                                                }, {scope: 'publish_actions,publish_stream,read_stream'});
                                            }
                                                                                    },

        getStatus                   :   function() {
                                            var state = NumberMaze.State;
                                            console.log('FBWrapper : getStatus');
                                            state.fbShareStatus = 'getting user data...';
                                            FB.getLoginStatus(function(response) {
                                                if (response.status == 'connected') {
                                                    console.log('fb connected');
                                                    NumberMaze.State.fbAccessToken = response.authResponse.accessToken;
                                                    NumberMaze.FBWrapper.getUserData();
                                                } else {
                                                    console.log('fb not connected');
                                                    console.log(response);
                                                }
                                            });
                                        },

        getUserData                 :   function() {
                                            console.log('FBWraper : get user data');
                                            var state = NumberMaze.State;
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
