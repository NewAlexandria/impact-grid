var impactGridModule = angular.module('impact.directives.grid');
/**
 * @param $scope
 * @constructor
 */
function ImpactGridBodyController($scope, $element, $window, $document, $timeout, domUtils) {
  this.scope_ = $scope;
  this.element_ = $element;
  this.window_ = $window;
  this.document_ = $document;
  this.timeout_ = $timeout;
  this.domUtils_ = domUtils;

  $scope.$watch('BodyCtrl.getAutoResize()', angular.bind(
      this,
      function (oldAutoResize, newAutoResize) {
        if (newAutoResize) {
          if (this.getTableConfig().autoHeightResizeWithoutWindowScroll) {
            this.bindWindowResizeForAutoHeight_(true);
          } else if (this.getTableConfig().autoHeightResize) {
            this.bindWindowResizeForAutoHeight_();
          }
        }
      }));
}
ImpactGridBodyController.$inject = ['$scope', '$element', '$window', '$document', '$timeout', 'domUtils'];

/**
 * @returns {Object} Table section of the grid config.
 */
ImpactGridBodyController.prototype.getTableConfig = function() {
  return this.scope_.GridCtrl.getConfig().table;
};

/**
 * @returns {boolean} Whether this grid body can scroll on the X axis.
 */
ImpactGridBodyController.prototype.canScrollX = function() {
  return this.getTableConfig() && this.getTableConfig().canScrollX;
};

/**
 * @returns {boolean} Whether this grid body can scroll on the Y axis.
 */
ImpactGridBodyController.prototype.canScrollY = function() {
  return this.getTableConfig() && this.getTableConfig().canScrollY;
};

ImpactGridBodyController.prototype.getHeight = function() {
  return this.getTableConfig() && this.getTableConfig().bodyHeight;
};

ImpactGridBodyController.prototype.getAutoResize = function() {
  return this.getTableConfig() && (this.getTableConfig().autoHeightResize ||
      this.getTableConfig().autoHeightResizeWithoutWindowScroll);
};

/**
 * @param isBodyScrollOff - Whether we should forcibly remove
 *     scrolling from the BODY.
 * @private
 */
ImpactGridBodyController.prototype.bindWindowResizeForAutoHeight_ =
    function(isBodyScrollOff) {
  // Remove the vertical scrollbar from this window
  if (isBodyScrollOff) {
    angular.element(this.document_).find('body').css('overflow-y', 'hidden');
  }

  var tableBodyContainer = angular.element(this.element_),
      footerContainer = tableBodyContainer.next();

  angular.element(this.window_).bind('resize', angular.bind(
      this,
      function() {
        var windowScrollTop = window.pageYOffset ? window.pageYOffset : document.body.scrollTop;

        var positionRelativeToWindow = this.domUtils_.getOffsetFor(tableBodyContainer) - windowScrollTop,
            newBodyHeight = this.window_.innerHeight - positionRelativeToWindow,
            footerHeight = footerContainer.length ? footerContainer[0].offsetHeight : 0;
        tableBodyContainer.css('height', newBodyHeight - footerHeight + 'px');
      }));

  // Some edge cases load this table via ajax and makes
  // the initial firing of resize unpredicable. Wrap in a timeout
  // to guarantee this will resize after all other dom events.
  this.timeout_(angular.bind(this, function() {
    angular.element(this.window_).triggerHandler('resize');
  }));
};

impactGridModule.controller('ImpactGridBodyController', ImpactGridBodyController);

impactGridModule.directive('impactGridBody', function() {
  return {
    restrict: 'A',
    replace: true,
    controller: 'ImpactGridBodyController',
    controllerAs: 'BodyCtrl',
    templateUrl: 'templates/impact-grid/impact-grid-body.html'
  }
});
