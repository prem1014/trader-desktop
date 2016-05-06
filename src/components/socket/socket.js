(function(){
	'use strict';
    angular.module('app.socket',[])
    .factory('socket',socket);

  //  socket.$inject=['socketFactory'];
    
    function socket(){
    	 var socket = io.connect('http://localhost:8080');
    	 return {
            on: function(eventName, callback){
                 socket.on(eventName, callback);
            },
            emit: function(eventName, data) {
                 socket.emit(eventName, data);
            }
        }
    }
})();