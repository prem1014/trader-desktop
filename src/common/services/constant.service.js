(function () {
    'use strict';
    angular.module('app.constant',[])
        .factory('ConstantService',constantService)

     function constantService() {
        var service={
            eventType:{
                orderCreated:'orderCreatedEvent',
                orderPlaced:'placementCreatedEvent',
                orderExecuted:'executionCreatedEvent',
                orderDeleted:'allOrdersDeletedEvent'
            }
        }

         return service;
    }
})();
