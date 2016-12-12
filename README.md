angular-scan-qr
==================

Angular directive for a QR Scanner using [qcode-decoder](https://github.com/cirocosta/qcode-decoder).
It gets its inspiration from [angular-qr-scanner](https://github.com/sembrestels/angular-qr-scanner), but it's not based on [https://github.com/LazarSoft/jsqrcode](https://github.com/LazarSoft/jsqrcode) which was not responsive enough when I was testing it.

### Usage

```html
<scan-qr ng-success="onSuccess(data)" width="400" height="300"></scan-qr>
```

### Install

- Via bower:
```sh
$ bower install angular-scan-qr
```

- Add 'scanQr' module to your project.
- Include:

```html
<script src="bower_components/qcode-decoder/dist/qcode-decoder.min.js"></script>
<script src="bower_components/angular-scan-qr/scan-qr.js"></script>
```

### Parameters
- scanning: Set it to true to start a single scan
- videoDevice: an id of the current camera
- availableDevices: an array of all available cameras

### Example

```html
<html ng-app="App">
<body ng-controller="scannerController">
<button ng-click="startScanning()"></button>
<scan-qr scanning="scanning"
         video-device="selectedDevice"
         available-devices="availableDevices"
         ng-error="onError(Error)"
         ng-success="onSuccess(data)"
         width="300px"
         height="300px">
      <select ng-model="selectedDevice">
        <option ng-repeat="device in availableDevices" value="{{ device.id }}">{{device.label}}</option>
      </select>
</scan-qr>

<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular.js"></script>
<script src="bower_components/qcode-decoder/dist/qcode-decoder.min.js"></script>
<script src="bower_components/angular-scan-qr/qr-scanner.js"></script>
<script>

var App = angular.module('App', ['scanQr']);

App.controller('scannerController', ['$scope', function($scope) {
    $scope.selectedDevice = 0;
    $scope.availableDevices = [];
    $scope.scanning = true;

    $scope.onSuccess = function(data) {
        console.log(data);
    };
    $scope.onError = function(error) {
        console.log(error);
    };
    $scope.onVideoError = function(error) {
        console.log(error);
    };
    $scope.startScanning = function() {
      $scope.scanning = true;
    }
}]);

</script>
</body>
</html>
```

### License
The MIT License

Copyright (c) 2016 Adam Giacomelli
