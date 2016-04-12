var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/users', {
            templateUrl: 'partials/users.html',
            controller: 'UsersController'
        })
        .when('/users/add', {
            templateUrl: 'partials/users_add.html',
            controller: 'AddUserController'
        })
        .when('/users/:userId', {
            templateUrl: 'partials/users_details.html',
            controller: 'UserDetailsController'
        })
        .when('/tasks', {
            templateUrl: 'partials/tasks.html',
            controller: 'TasksController'
        })
        .when('/tasks/add', {
            templateUrl: 'partials/tasks_add.html',
            controller: 'AddTaskController'
        })
        .when('/tasks/:taskId', {
            templateUrl: 'partials/tasks_details.html',
            controller: 'TaskDetailsController'
        })
        .when('/tasks/:taskId/edit', {
            templateUrl: 'partials/tasks_add.html',
            controller: 'AddTaskController'
        })
        .when('/settings', {
            templateUrl: 'partials/settings.html',
            controller: 'SettingsController'
        })
        .otherwise({
            redirectTo: '/settings'
        });
}]);

app.filter('startFrom', function () {
    return function (input, start) {
        start = +start; // parse to int
        return input.slice(start);
    }
});
