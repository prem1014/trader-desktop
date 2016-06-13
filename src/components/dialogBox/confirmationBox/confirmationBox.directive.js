(function () {
    'use strict';
    angular.module('app.confirmationBox',[])
        .directive('confirmBox',confirmBox);

    function confirmBox() {
        var directive={
            restrict:'E',
            templateUrl:'components/dialogBox/confirmationBox/confirmationBox.html',
            controller:'ConfirmController',
            controllerAs:'cnfController'
        };
        return directive;
    }
})();
