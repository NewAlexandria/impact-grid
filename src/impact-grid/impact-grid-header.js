var impactGridModule = angular.module('impact.directives.grid');

function ImpactGridHeaderController($scope, $element, $window, domUtils) {
  this.scope_ = $scope;
  this.element_ = $element;
  this.window_ = $window;
  this.domUtils_ = domUtils;

  this.firstHeaderRow = [];
  this.secondHeaderRow = [];
  this.hasGroupedColumns = false;

  $scope.$watch(
      'GridCtrl.getConfig().columns',
      angular.bind(this, function (oldDefs, newDefs) {
        if (newDefs && newDefs.length) {
          this.buildHeader_(newDefs);
        }}));


  /**
   * TODO: Inject sticky header service
   * If isSticky window.onscroll service handler.
   */
  $scope.$watch(
      'GridCtrl.getConfig().header.isSticky',
      angular.bind(this, function (oldIsSticky, newIsSticky) {
        if (newIsSticky) {
          this.bindWindowScrollForStickyHeaders_(this.element_)
        }}));
}
ImpactGridHeaderController.$inject = ['$scope', '$element', '$window', 'domUtils'];

/**
 * Builds the column header out. Inspects the columnDefs to check
 * if we have column groups that need to be separated out between
 * the first or second rows.
 *
 * @param newDefs
 * @private
 */
ImpactGridHeaderController.prototype.buildHeader_ = function (columnDefs) {
  this.hasGroupedColumns = this.scanForGroupedColumns_(columnDefs);
  if (this.hasGroupedColumns) {
    this.setFirstTrRowSpans_(this.firstHeaderRow);
  }
};

/**
 * * Does a pass on all the column defs to see if we have grouped columns.
 * If we do then we call a method to set the correct rowspans.
 * @param columnDefs
 * @returns {boolean} Whether this header has grouped columns
 * @private
 */
ImpactGridHeaderController.prototype.scanForGroupedColumns_ = function (columnDefs) {
  var columnIndex = 0;

  for (var i = 0, length = columnDefs.length; i < length; i++) {
    var columnDef = columnDefs[i],
        isColumnGroup = columnDef.columns && columnDef.columns.length;

    if (!isColumnGroup) {
      // Set column index for first cell
      columnDefs[i].columnIndex = columnIndex;
      columnIndex++;
    }

    // Push this column header into the first row.
    this.firstHeaderRow.push(columnDefs[i]);

    if (isColumnGroup) {
      columnDef.colSpan = columnDef.columns.length;
      for (var j = 0, gLength = columnDef.columns.length; j < gLength; j++) {
        // Set column index
        columnDef.columns[j].columnIndex = columnIndex;
        columnIndex++;

        this.secondHeaderRow.push(columnDef.columns[j]);
      }
    }
  }

  return this.secondHeaderRow.length;
};

/**
 * Sets row spans for the first row fo the table headers.
 * @param firstHeaderRows - First row of cells for table header.
 * @private
 */
ImpactGridHeaderController.prototype.setFirstTrRowSpans_ = function (firstHeaderRows) {
  var HEADER_ROW_SPAN = 2;

  for (var i = 0, length = firstHeaderRows.length; i < length; i++) {
    if (!firstHeaderRows[i].columns) {
      firstHeaderRows[i].rowSpan = HEADER_ROW_SPAN;
    }
  }
};

/**
 * @returns {boolean} Whether the header is sticky.
 */
ImpactGridHeaderController.prototype.isSticky = function() {
  return this.scope_.GridCtrl.getConfig().header.isSticky;
};

/**
 * @private
 */
ImpactGridHeaderController.prototype.bindWindowScrollForStickyHeaders_ = function () {
  angular.element(this.window_).bind('scroll',
      angular.bind(this, this.handleWindowScrollForStickyHeaders_));
};

ImpactGridHeaderController.prototype.handleWindowScrollForStickyHeaders_ = function () {
  var header = angular.element(this.element_),
      tableBody,
      gridContainer = header.parent(),
      headerScrollTop = this.element_[0].getBoundingClientRect().top;

  var isWindowPastHeader = this.domUtils_.scrollTop() > headerScrollTop;

  if (!tableBody) {
    tableBody = header.next().find('table');
  }

  var tableBodyRows = tableBody.find('tr'),
      lastRow = tableBodyRows[tableBodyRows.length - 1],
      lastRowOffsetTop = this.domUtils_.getOffsetFor(lastRow);

  if (isWindowPastHeader) {
    gridContainer.css('padding-top', header[0].offsetHeight + 'px');
    header.css({
      'position': 'fixed',
      'top': 0,
      'width': tableBody[0].offsetWidth
    });

    if (this.domUtils_.scrollTop() > lastRowOffsetTop - header[0].offsetHeight) {
      header.css('display', 'none');
    } else {
      header.css('display', '');
    }
  } else {
    header.css({
      'display': '',
      'position': '',
      'top': '',
      'width': ''
    });
    header.css('width', '');
    gridContainer.css('padding-top', '');
  }
};

// Export header controller for reuse.
impactGridModule.controller('ImpactGridHeaderController', ImpactGridHeaderController);

impactGridModule.directive('impactGridHeader', function () {
  return {
    restrict: 'C',
    templateUrl: 'templates/impact-grid/impact-grid-header.html',
    controller: ImpactGridHeaderController,
    controllerAs: 'HeaderCtrl'
  }
});