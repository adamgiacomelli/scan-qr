(function() {
    'use strict';

    angular.module('scanQr', ["ng"]).directive('scanQr', ['$interval', '$window', function($interval, $window) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ngSuccess: '&ngSuccess',
                ngError: '&',
                ngVideoError: '&ngVideoError',
                devicesFound: '&devicesFound',
                videoDevice: '=',
                availableDevices: '=',
                scanning: '='
            },
            link: function(scope, element, attrs) {
                window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

                var height = attrs.height || 300;
                var width = attrs.width || 250;

                var video = $window.document.createElement('video');
                video.setAttribute('width', width);
                video.setAttribute('height', height);
                video.setAttribute('style', '-moz-transform:rotateY(-180deg);-webkit-transform:rotateY(-180deg);transform:rotateY(-180deg);');
                var canvas = $window.document.createElement('canvas');
                canvas.setAttribute('id', 'qr-canvas');
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                canvas.setAttribute('style', 'display:none;');

                angular.element(element).append(video);
                angular.element(element).append(canvas);
                var context = canvas.getContext('2d');
                var stopScan;

                scope.$watch('videoDevice', function(newValue, oldValue) {
                    if (newValue) {
                        setupStream(newValue);
                    }
                }, true);

                scope.$watch('scanning', function(newValue, oldValue) {
                    if (newValue) {
                        if (newValue == true) {
                            scan();
                        }
                    }
                }, true);

                var qr = new QCodeDecoder();

                var successCallback = function(stream) {
                    video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
                    $window.localMediaStream = stream;

                    scope.video = video;
                    video.play();
                }

                var scan = function() {
                    qr.decodeFromVideo(video, function(er, res) {
                        if (er) {
                            scope.ngError({
                                err: er
                            });
                        } else {
                            scope.ngSuccess({
                                data: res
                            });
                        }
                    }, true);
                }

                // List cameras and microphones.
                if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                    console.log("enumerateDevices() not supported.");
                    return;
                } else {

                    var devices_found = [];
                    navigator.mediaDevices.enumerateDevices()
                        .then(function(devices) {
                            var unknown_device_cnt = 0;
                            devices.forEach(function(device) {
                                if (device.kind == "videoinput") {
                                    devices_found.push(device.deviceId);
                                    var label = "";
                                    if (device.label == "") {
                                        label = "Device " + unknown_device_cnt;
                                        unknown_device_cnt++;
                                        scope.availableDevices.push({
                                            label: label,
                                            id: device.deviceId
                                        });
                                    } else {
                                        scope.availableDevices.push({
                                            label: device.label,
                                            id: device.deviceId
                                        });
                                    }

                                }
                            });
                            setupStream(scope.videodevice);
                        })
                }

                var setupStream = function(device_selected_id) {
                    // Call the getUserMedia method with our callback functions
                    if (navigator.getUserMedia) {
                        navigator.getUserMedia({
                            video: {
                                optional: [{
                                    sourceId: device_selected_id
                                }]
                            }
                        }, successCallback, function(e) {
                            scope.ngVideoError({
                                error: e
                            });
                        });
                    } else {
                        scope.ngVideoError({
                            error: 'Native web camera streaming (getUserMedia) not supported in this browser.'
                        });
                    }
                }

                element.bind('$destroy', function() {
                    if ($window.localMediaStream) {
                        $window.localMediaStream.stop();
                    }
                    if (stopScan) {
                        $interval.cancel(stopScan);
                    }
                });
            }
        }
    }]);
})();
