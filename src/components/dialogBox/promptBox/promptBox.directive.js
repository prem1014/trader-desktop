(function () {
    'use strict';
    angular.module('app.promptBox')
        .directive('promptBox', promptBox);

    function promptBox() {
        var directive = {
            restrict: 'E',
            templateUrl:'components/dialogBox/promptBox/promptBox.html',
            controller:'PromptController',
            controllerAs:'promptCtrl'
        };
        return directive;
    }
})();
