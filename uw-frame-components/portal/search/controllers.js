'use strict';

define(['angular'], function(angular) {
  return angular.module('portal.search.controllers', [])
  .controller('PortalSearchController', [
    'miscService',
    'PortalSearchService',
    '$location',
    '$rootScope',
    '$scope',
    '$localStorage',
    '$routeParams',
    '$window',
    'SEARCH',
    'APP_FLAGS',
    function(miscService,
             PortalSearchService,
             $location,
             $rootScope,
             $scope,
             $localStorage,
             $routeParams,
             $window,
             SEARCH,
             APP_FLAGS) {
      // scope functions
      $scope.onSelect = function(portlet) {
          if (APP_FLAGS.isWeb) {
              $location.path('apps/search/'+ portlet.name);
              $scope.showSearch = false;
              $scope.showSearchFocus = false;
          } else {
              // frame app redirect
              $window.location = SEARCH.searchURL + portlet.name;
          }
      };

      $scope.submit = function() {
        if ($scope.initialFilter != '') {
          if (APP_FLAGS.isWeb) {
              $location.path('apps/search/'+ $scope.initialFilter);
              $scope.showSearch = false;
              $scope.showSearchFocus = false;
          } else {
              // frame app redirect
              $window.location = SEARCH.searchURL + $scope.initialFilter;
          }
        }
      };

      $scope.toggleSearch = function() {
        $scope.searchExpanded = $scope.searchExpanded ? false : true;
      };

      $scope.$on('$locationChangeStart', function(event) {
        if ($location.url().indexOf('search') == -1) {
          $scope.initialFilter = '';
        }
      });

      // init function
      var init = function() {
        $scope.initialFilter = '';
        $scope.filterMatches = [];
        $scope.searchExpanded = false;
        $scope.showSearchFocus = false;
        $scope.portletListLoading = true;
        if ($localStorage && $localStorage.typeaheadSearch) {
            // TODO : Add in search for somewhere for frame
            $scope.$watch('initialFilter', function(newVal, oldVal) {
                if (!newVal || !$scope.portlets) {
                    $scope.filterMatches = [];
                    return;
                }
                // this is where you would run your filter function
                $scope.filterMatches = [];
            });
        }

        $scope.searchService = PortalSearchService;
        $scope.$watch('searchService.getQuery()', function(newVal, oldVal) {
          if (!newVal) {
            return;
          }
          $scope.initialFilter = newVal;
          PortalSearchService.resetQuery();
        });
      };
      init();
    }]);
});
