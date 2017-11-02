var app = angular.module('currApp', []);

app.controller('currCont', function($scope, $http){
    $scope.records
    $scope.refresh = refresh;
    $scope.add = add;
    $scope.update = update;
    $scope.del = del;

    refresh();
    function refresh(){
        $http.get("/getAll").then(res=>{
            var d = res.data;
            var records = []
            var record = {}
            for(i = 0; i < d.length; i++) {
                record.index = d[i].index;
                record.fromAmount = d[i].fromAmount;
                record.toCurrency = d[i].toCurrency;
                record.toAmount = d[i].toAmount;
                records.push(record);
                record = {};
            }
            $scope.records = records;
        })
    }

    function add(index){
        $http.get("/add?fromAmount="+$scope.addFromAmount+"&toCurrency="+$scope.addToCurrency).then(res=>{
            refresh();
        });
    };

    function update(){
        $http.get("/update?index="+$scope.upIndex+"&fromAmount="+$scope.upFromAmount+"&toCurrency="+$scope.upToCurrency).then(res=>{
            refresh();
        });
    };

    function del(){
        $http.get("/delete?index="+$scope.delIndex).then(res=>{
            refresh();
        });
    };
});