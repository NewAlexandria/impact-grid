var impactGridModule = angular.module('impact.directives.grid');

/**
 * @param $scope
 * @constructor
 */
function ImpactGridPaginationController($scope) {
  this.scope_ = $scope;

  var deregisterStateWatch = this.scope_.$watch(
      'PaginationCtrl.getState()',
      angular.bind(this, function() {
        this.updatePagingationState_();
        deregisterStateWatch();
      }));

  // Todo clean this up.
  function isNormalInteger(str) {
    return /^\+?(0|[1-9]\d*)$/.test(str);
  }

  this.scope_.$watch(
      'PaginationCtrl.getState().page',
      angular.bind(this, function(newVal, oldVal) {
        if (!isNormalInteger(newVal)) {
          $scope.PaginationCtrl.getState().page =
              isNormalInteger(oldVal) ? oldVal : 1;
        }

        $scope.PaginationCtrl.getState().page =
            Math.min($scope.PaginationCtrl.getState().page, this.getTotalPages());
        $scope.PaginationCtrl.getState().page =
            Math.max($scope.PaginationCtrl.getState().page, 1);
      }));
}
ImpactGridPaginationController.$inject = ['$scope'];

/**
 * @returns {$scope.gridConfig.pagination} the pagination
 * configuration settings for the global grid config.
 */
ImpactGridPaginationController.prototype.getState = function() {
  return this.scope_.GridCtrl.getConfig().pagination;
};

ImpactGridPaginationController.prototype.getTotalCount = function() {
  // Remote Pagination.
  if (this.getState().getPage) {
    return this.getState().totalCount;
  }

  return this.getState().totalCount = this.scope_.GridCtrl.getAllRows().length;
};

ImpactGridPaginationController.prototype.getPerPage = function() {
  var config = this.getState();
  var DEFAULT_PER_PAGE = 10;

  // Take the per page if it is passed in. Else take the
  // first per page size if supplied. Default to 10 if
  // nothing is provided.
  config.perPage = config.perPage ? config.perPage :
      config.perPageSizes && config.perPageSizes.length ? config.perPageSizes[0] : DEFAULT_PER_PAGE;

  return config.perPage;
};

ImpactGridPaginationController.prototype.getPerPageSizes = function() {
  return this.getState().perPageSizes;
};

ImpactGridPaginationController.prototype.setPageSize = function(pageLength) {
  this.getState().perPage = pageLength;
  this.getState().totalPages =
      Math.ceil(this.getTotalCount() / this.getState().perPage);

  // Send user back to page 1
  this.getState().page = 1;

  this.gotoPage(this.getState().page);
};

ImpactGridPaginationController.prototype.getTotalPages = function() {
  var config = this.getState();
  config.totalPages = Math.ceil(this.getTotalCount() / this.getPerPage());

  return this.getState().totalPages;
};

ImpactGridPaginationController.prototype.gotoPage = function(targetPage) {
  this.updatePagingationState_(targetPage);

  if (this.getState().getPage) {
    this.getState().getPage(this.getState());
  }

};

ImpactGridPaginationController.prototype.updatePagingationState_ = function(targetPage) {
  var config = this.getState();

  config.page = targetPage || config.page || 1;

  config.firstPage = 1;
  config.lastPage = this.getTotalPages();

  var newPrev = config.page - 1,
      newNext = config.page + 1;

  config.prevPage = Math.max(newPrev, 1);
  config.nextPage = Math.min(newNext, config.totalPages);
};

ImpactGridPaginationController.prototype.isPageSelected = function(pageLength) {
  return this.getState().perPage === pageLength;
};

ImpactGridPaginationController.prototype.gotoFirstPage = function() {
  this.gotoPage(this.getState().firstPage);
};

ImpactGridPaginationController.prototype.gotoLastPage = function() {
  this.gotoPage(this.getState().lastPage);
};

ImpactGridPaginationController.prototype.gotoPrevPage = function() {
  this.gotoPage(this.getState().prevPage);
};

ImpactGridPaginationController.prototype.gotoNextPage = function() {
  this.gotoPage(this.getState().nextPage);
};

ImpactGridPaginationController.prototype.isFirstPageEnabled = function() {
  return this.getState().page !== this.getState().firstPage;
};

ImpactGridPaginationController.prototype.isPrevPageEnabled = function() {
  return this.getState().page !== this.getState().prevPage;
};

ImpactGridPaginationController.prototype.isNextPageEnabled = function() {
  return this.getState().page !== this.getState().nextPage;
};

ImpactGridPaginationController.prototype.isLastPageEnabled = function() {
  return this.getState().page !== this.getState().lastPage;
};

// Export pagination controller for re-use.
impactGridModule.controller('ImpactGridPaginationController', ImpactGridPaginationController);

impactGridModule.directive('impactGridFooter', function() {
  return {
    restrict: 'A',
    replace: true,
    controller: 'ImpactGridPaginationController',
    controllerAs: 'PaginationCtrl',
    templateUrl: 'templates/impact-grid/impact-grid-pagination.html'
  }
});
