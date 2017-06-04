'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider ) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope', 'impactDialog', function($scope, ImpactDialog) {
      $scope.dialog1 = new ImpactDialog({
        domId: 'testId',
        title: 'Title for this dialog',
        showBackdrop: true,
        template: 'Template is compiled to app scope<br>' +
        '<input type="text" ng-model="testValue">',
        buttons: [
          {
            title: 'Cancel'
          },
          {
            title: 'Ok',
            classes: ['btn-success'],
            clickHandler: function() {
              console.log('clicking on success')
              $scope.dialog1.hide();
            }
          }
        ]}, $scope);
}]);