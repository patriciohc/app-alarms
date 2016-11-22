angular.module('app.controllers', [])

.controller('homeCtrl', function ($scope, $stateParams, $timeout, $ionicScrollDelegate, sharedConn, ChatDetails) {
    var XMPP_DOMAIN  = 'suchat.org'; // Domain we are going to be connected to.
    $scope.alarmas = JSON.parse(localStorage.getItem("alarmas"));;
    var config = JSON.parse(localStorage.getItem("config"));

    var setStyleStatus = function(status){
        if (status == Strophe.Status.CONNECTING) {
            $scope.msgStatus = "Conectando..";
            $scope.classBarrFotter = "bar-energized";
        } else if (status == Strophe.Status.CONNFAIL) {
            $scope.classBarrFotter = "bar-assertive";
            $scope.msgStatus = "Sin conexion";
        } else if (status == Strophe.Status.DISCONNECTING) {
            $scope.classBarrFotter = "bar-assertive";
            $scope.msgStatus = "Sin conexion";
        } else if (status == Strophe.Status.DISCONNECTED) {
            $scope.classBarrFotter = "bar-assertive";
            $scope.msgStatus = "Sin conexion";
        } else if (status == Strophe.Status.CONNECTED) {
            $scope.classBarrFotter = "bar-energized";
            $scope.msgStatus = "Esperando respuesda del emisor";
            var msg = {type: 1}; // enviamos mensaje de que nos hemos conectado
            $scope.sendMsg(config.emisorJid+'@'+XMPP_DOMAIN, JSON.stringify(msg));
        }
    }

    setStyleStatus(Strophe.Status.DISCONNECTING);

    $scope.showEditAlarma = function(){
      // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="alarmas.name">',
            title: 'Introduzca el nombre de la alarma',
            //subTitle: 'Please use normal things',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.data.wifi) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            return $scope.data.nameAlarma;
                        }
                    }
                }
            ]
        });

        myPopup.then(function(res) {

            console.log('Tapped!', res);
        });
    }

    $scope.activar = function() {
        sharedConn.login(config.user.jid, XMPP_DOMAIN, config.user.pass);
    }

    $scope.sendMsg=function(to,body){
        var to_jid  = Strophe.getBareJidFromJid(to);
        var timestamp = new Date().getTime();
        var reqChannelsItems = $msg({id:timestamp, to:to_jid , type: 'chat' })
                                   .c("body").t(body);
        sharedConn.getConnectObj().send(reqChannelsItems.tree());
    };

    $scope.messageRecieve=function(msg){
    //  var to = msg.getAttribute('to');
        var from = msg.getAttribute('from');
        var type = msg.getAttribute('type');
        var elems = msg.getElementsByTagName('body');

        //var d = new Date();
        //d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

        if (type == "chat" && elems.length > 0) {

            var body = elems[0];
            //var textMsg = Strophe.getText(body);
            var textMsg = body.innerHTML;
            var data = JSON.parse(textMsg);
            if (data.type == 1) { // alarmas activas
                //$scope.alarmas = data.data;
                $scope.classBarrFotter = "bar-balanced";
                $scope.msgStatus = "Monitoreando alarmas";
                if (!$scope.alarmas) {
                    $scope.alarmas = new Array(data.data.length);
                }
                for (var i = 0; i < data.data.length; i++) {
                    var item = data.data[i];
                    var alarma = $scope.alarmas.find(function (alarma){
                        if (!alarma) return false;
                        return alarma.id == item;
                    });
                    if (!alarma) {
                        $scope.alarmas[i] = {
                            id: item,
                            name: item
                        }
                    }
                }
                //$scope.alarmasActivas = data.data;
            } else if (data.type == 2) { // alarma acticvada

            }
            //$ionicScrollDelegate.scrollBottom(true);
            $scope.$apply();

            console.log($scope.messages);
            console.log('Message recieved from ' + from + ': ' + textMsg);
        }
    }


   $scope.$on('msgRecievedBroadcast', function(event, data) {
        $scope.messageRecieve(data);
    });

    $scope.$on('statusConnection', function(event, status) {
        setStyleStatus(status);
        $scope.$apply();
    });

    //$scope.sensores = [1,2,3,4,5,6,7,8,9,10,11,12];

})

.controller('configuracionesCtrl',  function ($scope, $stateParams, sharedConn) {
    $scope.user = {};
    $scope.emisor = {};
    var config = JSON.parse(localStorage.getItem("config"));

    if (config){
        $scope.emisorJid = config.emisorJid;
        $scope.user.jid = config.user.jid;
        $scope.user.pass = config.user.pass;
    }

    $scope.guardarConfig = function(){
        var config = {
            emisorJid: $scope.emisor.jid,
            user: {
                jid: $scope.user.jid,
                pass: $scope.user.pass
            }
        }
        localStorage.setItem("config", JSON.stringify(config));
    }

})

.controller('cloudCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
