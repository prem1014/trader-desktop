(function () {
    'use strict';
    angular.module('app.login')
        .controller('LoginController', loginController);

    loginController.$inject = ['$scope', '$location', 'loginService','logger'];

    function loginController($scope, $location, loginService,logger) {
        /* jshint validthis: true */

        var vm = this;

        vm.users=[];
        vm.login=login;

        loginService.getUsers()
            .then(function (users) {
                vm.users = users;
                vm.selectedName = vm.users[0].id;
                if (vm.users.length <= 0){
                    vm.isUsrsNotAvailable=true;
                }
                else{
                    vm.isUsrsNotAvailable=false;
                }
            })
            .catch(function (error) {
                    vm.isUsrsNotAvailable=true;
                logger.log('Server encountered error: ' + error);
            });

        //validate user credentiials
        function login() {
            var user = _.find(vm.users, {'id': vm.selectedName});

            loginService.setCredentials(user.name, user.id);

            $location.path('dashboard');
        }

    }

})();
