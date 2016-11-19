angular.module('app.controllers', [])

.controller('homeCtrl', function ($scope, $stateParams, $timeout, $ionicScrollDelegate, sharedConn, ChatDetails) {

    $scope.messages = [];

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
            $scope.classBarrFotter = "bar-balanced";
            $scope.msgStatus = "Conectado";
            var msg = {type: 1};
            $scope.sendMsg($scope.emisor.jid, JSON.stringify(d));
        }
    }

    setStyleStatus(sharedConn.statusConnection);

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

        var d = new Date();
        d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

        if (type == "chat" && elems.length > 0) {

            var body = elems[0];
            var textMsg = Strophe.getText(body);
            var data = JSON.parse(textMsg);
            if (data.type == 1) { // alarmas activas
                $scope.alarmas = data.data;
            }
            // $scope.messages.push({
            //     userId: from,
            //     text: textMsg,
            //     time: d
            // });

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

.controller('configuracionesCtrl', ['$scope', '$stateParams', 'sharedConn',

function ($scope, $stateParams, sharedConn) {

    var XMPP_DOMAIN  = 'suchat.org'; // Domain we are going to be connected to.
    $scope.user = {};

    $scope.acceso = function() {
        sharedConn.login($scope.user.jid, XMPP_DOMAIN, $scope.user.pass);
    }

}])

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
