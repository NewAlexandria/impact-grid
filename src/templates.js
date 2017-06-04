(function(module) {
try {
  module = angular.module('impact.directives.templates');
} catch (e) {
  module = angular.module('impact.directives.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/impact-grid/impact-grid-body.html',
    '<div class="impact-grid-body-container" ng-style="{\'height\': BodyCtrl.getHeight()}" ng-class="{\'can-scroll-x\': BodyCtrl.canScrollX(), \'can-scroll-y\': BodyCtrl.canScrollY()}">\n' +
    '  <table>\n' +
    '    <tbody>\n' +
    '      <tr ng-repeat="row in GridCtrl.getViewPortRows()">\n' +
    '        <td class="impact-grid-td" ng-repeat="cell in row.getCells()"></td>\n' +
    '      </tr>\n' +
    '    </tbody>\n' +
    '  </table>\n' +
    '</div>');
}]);
})();
