angular
  .module('angularChat', [])
  .controller('ChatController', ['$scope', function($scope) {

    var socket = io('http://localhost:3000');

    $scope.message = "";
    $scope.messages = [];

    $scope.channel = "";
    $scope.channels = {};

    $scope.currentChannel = null;

    $scope.chat = function() {
      socket.emit("message", { channel: $scope.currentChannel, message: $scope.message });
      $scope.message = "";
    }

    $scope.createChannel = function() {
      if(!$scope.channels[$scope.channel]) {
        socket.emit("createChannel", $scope.channel);
        $scope.currentChannel = $scope.channel;
        $scope.channels[$scope.currentChannel] = [];
        $scope.messages = $scope.channels[$scope.currentChannel];
        $scope.channel = "";
      }
    }

    $scope.showChannel = function(channel) {
      socket.emit('joinChannel', channel);
      $scope.currentChannel = channel;
      $scope.messages = $scope.channels[channel];
    }

    socket.on('allChannels', function(channels) {
      $scope.$evalAsync(function() {
        console.log($scope.channels);
        $scope.channels = channels;
      });
    });

    socket.on('message', function(data) {
      $scope.$evalAsync(function() {
        $scope.channels[data.channel].push(data.message);
      });
    });

    socket.on('newChannel', function(name) {
      if(!$scope.channels[name]) {
        $scope.$evalAsync(function() {
          $scope.channels[name] = [];
        });
      }
    });

  }]);