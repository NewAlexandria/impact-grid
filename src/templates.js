(function(module) {
try {
  module = angular.module('mcc.directives.templates');
} catch (e) {
  module = angular.module('mcc.directives.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/mcc-grid/mcc-grid-body.html',
    '<div class="mcc-grid-body-container" ng-style="{\'height\': BodyCtrl.getHeight()}" ng-class="{\'can-scroll-x\': BodyCtrl.canScrollX(), \'can-scroll-y\': BodyCtrl.canScrollY()}">\n' +
    '  <table>\n' +
    '    <tbody>\n' +
    '      <tr ng-repeat="row in GridCtrl.getViewPortRows()">\n' +
    '        <td class="mcc-grid-td" ng-repeat="cell in row.getCells()"></td>\n' +
    '      </tr>\n' +
    '    </tbody>\n' +
    '  </table>\n' +
    '</div>');
}]);
})();
