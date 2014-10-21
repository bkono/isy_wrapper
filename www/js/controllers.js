angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $cordovaTouchID, $cordovaKeychain, $localStorage) {
  $scope.tryOpenIsy = function() {
    console.log($localStorage.settings);
    if (!$localStorage.settings && !$localStorage.settings.isyAddr) {
      alert("Please configure an ISY address under settings.");
    } else {
      $cordovaTouchID.authenticate("Authorize access to the ISY page").then(function() {
        $cordovaKeychain.getForKey('isyCredentials', 'me.konowitz.isywrapper')
        .then(function(result) {
          window.open('http://' + result + '@' + $localStorage.settings.isyAddr, '_blank',
            'location=no,closebuttoncaption=Done,toolbar=yes');
        }, function(err) {
          alert("Valid credentials are required. Please configure them under settings.");
        })
      }, function(err) {
        alert("TouchID support required for this feature.");
      })
    }
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('SettingsCtrl', function($scope, $cordovaTouchID, $cordovaKeychain,
                                     $localStorage, $ionicModal) {
  $scope.storage = $localStorage;
  $scope.settings = $localStorage.settings || {};
  $scope.loginData = {};

  $scope.isTouchidAvail = function() {
    console.log("checking");
    $cordovaTouchID.checkSupport().then(function(value) {
      console.log("avail");
      $scope.settings.touchidText = "Avail";
    }, function(err) {
      console.log("not avail");
      console.log(err);
      $scope.settings.touchidText = "not avail because of " + err;
    });
  };

  $scope.auth = function() {
    $cordovaTouchID.authenticate("Because I need to man.").then(function(success) {
      console.log("successage");
      console.log(success);
      alert("woot, success" + success);
    }, function(err) {
      console.log("error, dagnabit");
      console.log(err);
      alert("no go, " + err);
    })
  };


  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/isy-login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.saveLogin = function() {
    console.log("saving login");
    $cordovaKeychain.setForKey('isyCredentials', 'me.konowitz.isywrapper',
        $scope.loginData.username + ":" + $scope.loginData.password)
      .then(function() {
          console.log("success on keychain save");
          $scope.closeLogin();
        }, function(err) {
          console.error("failure on keychain error");
          console.error(err);
          alert("Failed while saving to the keychain. Error: " + err);
        });
  };
})
