var mp4Services = angular.module('mp4Services', []);

mp4Services.factory('Users', function ($http, $window) {
    var baseUrl = $window.sessionStorage.baseurl;
    return {
        list: function () {
            var select = {
                _id: 1,
                name: 1,
                email: 1
            };
            var sort = {
                name: 1
            };
            return $http.get(baseUrl + '/api/users?select=' + JSON.stringify(select)
                + '&sort=' + JSON.stringify(sort));
        },
        add: function (user) {
            return $http.post(baseUrl + '/api/users', user);
        },
        get: function (id) {
            return $http.get(baseUrl + '/api/users/' + id);
        },
        delete: function (id) {
            return $http.delete(baseUrl + '/api/users/' + id);
        }
    }
});

mp4Services.factory('Tasks', function ($http, $window) {
    var baseUrl = $window.sessionStorage.baseurl;
    return {
        list: function (where, sort, page, pageSize) {
            var select = {
                _id: 1,
                name: 1,
                assignedUserName: 1,
                deadline: 1
            };
            return $http.get(baseUrl + '/api/tasks?select=' + JSON.stringify(select)
                + '&where=' + JSON.stringify(where)
                + '&sort=' + JSON.stringify(sort)
                + '&skip=' + page * pageSize + '&limit=' + pageSize);
        },
        count: function (where) {
            return $http.get(baseUrl + '/api/tasks?count=true&where=' + JSON.stringify(where));
        },
        add: function (task) {
            return $http.post(baseUrl + '/api/tasks', task);
        },
        get: function (id) {
            return $http.get(baseUrl + '/api/tasks/' + id);
        },
        update: function (task) {
            return $http.put(baseUrl + '/api/tasks/' + task._id, task);
        },
        delete: function (id) {
            return $http.delete(baseUrl + '/api/tasks/' + id);
        }
    }
});
