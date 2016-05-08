'use strict';
(function () {
    angular.module('app.login',['ngCookies','app.api'])
    .controller('LoginController', loginController);

    loginController.$inject = ['$scope','$location', 'loginService'];

    function loginController($scope,$location, loginService) {
        var vm=this;
        
        loginService.getUsers()
            .then(function (users) {
                vm.users = users;
                vm.selectedName = vm.users[0].id;
            })
            .catch(function (error) {
                console.log('Server encountered error: ' + error);
            })
        //validate user credentiials
        vm.login = function () {
            var user = _.find(vm.users, {'id': vm.selectedName});

            loginService.setCredentials(user.name,user.id);

            $location.path('dashboard');
        };

    };

})();
