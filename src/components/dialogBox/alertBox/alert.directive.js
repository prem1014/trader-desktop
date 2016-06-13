(function () {
    'use strict';
    angular.module('app.alertBox',[])
        .directive('alertBox',alertBox);

    function alertBox() {
        var directive={
            restrict:'E',
            templateUrl:'components/dialogBox/alertBox/alertBox.html',
            controller:'AlertController',
            controllerAs:'alertCtrl',
            scope:{
                alertMessage:'=message'
            }
        };

        return directive;
    }
})();
