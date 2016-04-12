var mp4Controllers = angular.module('mp4Controllers', ['720kb.datepicker']);

mp4Controllers.controller('UsersController', ['$scope', 'Users', function ($scope, Users) {
    $scope.userlist = {};
    $scope.userlist.data = [];

    $scope.userlist.delete = function (id) {
        Users.delete(id)
            .success(function () {
                for (var i = 0; i < $scope.userlist.data.length; i++) {
                    if ($scope.userlist.data[i]._id == id) {
                        $scope.userlist.data.splice(i, 1);
                        break;
                    }
                }
            })
            .error(function (data) {
                alert(data.message);
            });
    };

    Users.list()
        .success(function (data) {
            $scope.userlist.data = data.data;
        })
        .error(function (data) {
            alert(data.message);
        });
}]);

mp4Controllers.controller('AddUserController', ['$scope', 'Users', function ($scope, Users) {
    $scope.displayText = '';

    $scope.user = {};
    $scope.user.formData = {};
    $scope.user.hasAdded = false;

    $scope.user.submit = function (form) {
        $scope.displayText = '';
        $scope.user.hasAdded = false;
        if (form.$valid) {
            Users.add($scope.user.formData)
                .success(function () {
                    $scope.user.hasAdded = true;
                    $scope.displayText = "User " + $scope.user.formData.name + " has been added successfully";
                    $scope.user.reset(form);
                })
                .error(function (data) {
                    $scope.displayText = data.message;
                    $scope.user.reset(form);
                });
        }
    };
    $scope.user.reset = function (form) {
        if (form) {
            $scope.user.formData = {};
            form.$setPristine();
            form.$setUntouched();
        }
    };
}]);

mp4Controllers.controller('UserDetailsController', ['$scope', '$routeParams', 'Users', 'Tasks', function ($scope, $routeParams, Users, Tasks) {
    $scope.showCompletedTask = false;
    $scope.toggleCompletedTask = function () {
        $scope.showCompletedTask = !$scope.showCompletedTask;

        if ($scope.showCompletedTask) {
            var where = {
                assignedUser: $scope.user._id,
                completed: true
            };
            Tasks.list(where, {deadline: 1}, 0, 0)
                .success(function (data) {
                    $scope.user.completedTask = data.data;
                })
                .error(function (data) {
                    alert(data.message);
                    window.location.href = '#/users';
                });
        }
    };

    $scope.user = {};
    $scope.user._id = $routeParams.userId;
    $scope.user.pendingTask = [];
    $scope.user.completedTask = [];

    $scope.user.completeTask = function (id) {
        Tasks.get(id)
            .success(function (data) {
                var task = data.data;
                task.completed = true;

                Tasks.update(task)
                    .success(function () {
                        for (var i = 0; i < $scope.user.pendingTask.length; i++) {
                            if ($scope.user.pendingTask[i]._id == task._id) {
                                $scope.user.pendingTask.splice(i, 1);
                                break;
                            }
                        }

                        if ($scope.showCompletedTask) {
                            $scope.showCompletedTask = false;
                            $scope.toggleCompletedTask();
                        }
                    })
                    .error(function (data) {
                        alert(data.message);
                    });
            })
            .error(function (data) {
                alert(data.message);
            });
    };

    Users.get($scope.user._id)
        .success(function (data) {
            $scope.user.name = data.data.name;
            $scope.user.email = data.data.email;
        })
        .error(function (data) {
            alert(data.message);
            window.location.href = '#/users';
        });

    var where = {
        assignedUser: $scope.user._id,
        completed: false
    };
    Tasks.list(where, {deadline: 1}, 0, 0)
        .success(function (data) {
            $scope.user.pendingTask = data.data;
        })
        .error(function (data) {
            alert(data.message);
            window.location.href = '#/users';
        });
}]);

mp4Controllers.controller('TasksController', ['$scope', 'Tasks', function ($scope, Tasks) {
    $scope.tasklist = {};
    $scope.tasklist.data = [];
    $scope.tasklist.total = 0;

    $scope.tasklist.show = 'pending';
    $scope.tasklist.predicate = 'deadline';
    $scope.tasklist.order = 'asc';

    $scope.tasklist.currentPage = 0;
    $scope.tasklist.pageSize = 10;

    $scope.tasklist.numberOfPages = function () {
        if ($scope.tasklist.total == 0) return 1;
        else return Math.ceil($scope.tasklist.total / $scope.tasklist.pageSize);
    };
    $scope.tasklist.previousPage = function () {
        if ($scope.tasklist.currentPage == 0) return;
        $scope.tasklist.currentPage--;
        $scope.tasklist.update();
    };
    $scope.tasklist.nextPage = function () {
        if ($scope.tasklist.currentPage >= $scope.tasklist.numberOfPages() - 1) return;
        $scope.tasklist.currentPage++;
        $scope.tasklist.update();
    };

    $scope.tasklist.delete = function (id) {
        Tasks.delete(id)
            .success(function () {
                for (var i = 0; i < $scope.tasklist.data.length; i++) {
                    if ($scope.tasklist.data[i]._id == id) {
                        $scope.tasklist.data.splice(i, 1);
                        break;
                    }
                }

                if ($scope.tasklist.currentPage != 0 && $scope.tasklist.data.length == 0) {
                    $scope.tasklist.previousPage();
                }
            })
            .error(function (data) {
                alert(data.message);
            });
    };
    $scope.tasklist.update = function () {
        var where = $scope.tasklist.show == 'all' ? {} : {completed: $scope.tasklist.show == 'completed'};
        var sort = {};
        sort[$scope.tasklist.predicate] = $scope.tasklist.order == 'asc' ? 1 : -1;

        Tasks.count(where)
            .success(function (data) {
                $scope.tasklist.total = data.data;

                Tasks.list(where, sort, $scope.tasklist.currentPage, $scope.tasklist.pageSize)
                    .success(function (data) {
                        $scope.tasklist.data = data.data;
                    })
                    .error(function (data) {
                        alert(data.message);
                    });
            })
            .error(function (data) {
                alert(data.message);
            });
    };

    $scope.tasklist.update();
}]);

mp4Controllers.controller('AddTaskController', ['$scope', '$routeParams', 'Users', 'Tasks', function ($scope, $routeParams, Users, Tasks) {
    $scope.isEdit = $routeParams.taskId != undefined;
    $scope.today = (new Date()).toJSON();
    $scope.users = [];
    $scope.displayText = '';

    $scope.task = {};
    $scope.task.formData = {};
    $scope.task.hasAdded = false;

    $scope.task.submit = function (form) {
        $scope.displayText = '';
        $scope.task.hasAdded = false;

        $scope.task.formData.assignedUserName = $('#assignedUser').find('option:selected').text();

        if (form.$valid) {
            if ($scope.isEdit) {
                Tasks.update($scope.task.formData)
                    .success(function () {
                        window.history.back();
                    })
                    .error(function (data) {
                        $scope.displayText = data.message;
                        $scope.task.reset(form);
                    });
            }
            else {
                Tasks.add($scope.task.formData)
                    .success(function () {
                        $scope.task.hasAdded = true;
                        $scope.displayText = "Task has been added successfully";
                        $scope.task.reset(form);
                    })
                    .error(function (data) {
                        $scope.displayText = data.message;
                        $scope.task.reset(form);
                    });
            }
        }
    };
    $scope.task.reset = function (form) {
        if (form) {
            $scope.task.formData = {};
            form.$setPristine();
            form.$setUntouched();
        }
    };

    Users.list()
        .success(function (data) {
            $scope.users = data.data;
            $scope.users.unshift({
                _id: "",
                name: "unassigned"
            });
        })
        .error(function (data) {
            alert(data.message);
        });

    if ($scope.isEdit) {
        Tasks.get($routeParams.taskId)
            .success(function (data) {
                $scope.task.formData = data.data;
            })
            .error(function (data) {
                alert(data.message);
            });
    }
}]);

mp4Controllers.controller('TaskDetailsController', ['$scope', '$routeParams', 'Tasks', function ($scope, $routeParams, Tasks) {
    $scope.task = {};
    $scope.task._id = $routeParams.taskId;

    Tasks.get($scope.task._id)
        .success(function (data) {
            $scope.task = data.data;
        })
        .error(function (data) {
            alert(data.message);
            window.location.href = '#/tasks';
        });
}]);

mp4Controllers.controller('SettingsController', ['$scope', '$window', function ($scope, $window) {
    $scope.url = $window.sessionStorage.baseurl;

    $scope.setUrl = function () {
        $window.sessionStorage.baseurl = $scope.url;
        $scope.displayText = "URL set successfully.";
    };
}]);
