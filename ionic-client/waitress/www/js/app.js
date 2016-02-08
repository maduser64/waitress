angular.module('waitress', [
  'ionic',
  'ngCordova',
  'ionic-datepicker'
])
.run(function($ionicPlatform, $rootScope, nfcService) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    // Commented out because this doesn't seems to be working when the apk is rendered
    // on a real divice.
    // $rootScope.$on('$stateChangeStart', function(ev, to, toParam, from) {
    //   if (from.name === 'dashboard.tap') {
    //     alert(" we got here too");
    //     nfcService.remove();
    //   }
    // });
  });
})
.config(function($stateProvider, $urlRouterProvider, $logProvider, $ionicConfigProvider) {
  $urlRouterProvider.otherwise('/');
  $ionicConfigProvider.tabs.position('bottom');
  $logProvider.debugEnabled(true);
  $stateProvider
    .state('index', {
      url: '/',
      resolve: {
        midday: ['MealSession', function(MealSession) {
          return MealSession.getMidday().then(function(result) {
            return result;
          });
        }]
      },
      controller: 'sessionController',
      templateUrl: 'partials/session.html'
    })
    .state('dashboard', {
      abstract: true,
      url: '/dashboard',
      templateUrl: 'partials/dashboard.html',
      controller: 'dashboardController'
    })
    .state('dashboard.tap', {
      url: '/dashboard/home',
      views: {
        'home-tab': {
          templateUrl: 'partials/tap.html',
          controller: 'TapController'
        }
      }
    })
    .state('dashboard.report', {
      url: 'dashboard/report',
      views: {
        'report-tab': {
          templateUrl: 'partials/report.html'
        }
      }
    })
    .state('dashboard.history', {
      url: 'dashboard/history',
      views: {
        'history-tab': {
          templateUrl: 'partials/history.html'
        }
      }
    })
    .state('dashboard.report-custom', {
      url: 'dashboard/report/weekly',
      views: {
        'report-tab': {
          controller: 'CustomReportController',
          templateUrl: 'partials/custom-report.html'
        }
      }

    })
    .state('dashboard.report-daily', {
      url: 'dashboard/report/daily',
      resolve: {
        dailyReports: ['MealSession', function(MealSession) {
          return MealSession.report().then(function(result) {
            return result;
          });
        }]
      },
      views: {
        'report-tab': {
          templateUrl: 'partials/daily-report.html',
          controller: 'dailyReportController'
        }
      }

    });
});

