// https://github.com/angular-ui/ui-router/wiki/Quick-Reference

module.exports = function(state){

    state('home', {
        url         : '/home'
      , templateUrl : 'views/home.html'
    });

    state('speakers', {
        url         : '/speakers'
      , templateUrl : 'views/speakers.html'
      , controller  : 'SpeakersCtrl'
    });

    state('speakers.speaker', {
        url         : '/:speaker'
      , templateUrl : 'views/speaker.html'
      , controller  : function($scope, $stateParams) {
        $scope.speaker = $stateParams.speaker;
      }
    });

};

