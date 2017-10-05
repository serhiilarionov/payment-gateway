function AccrualCtrl($scope, years, accrualService, $localStorage, uiGridConstants) {
  var this_ = this;

    this.scope = $scope;
    $scope.dateInfo = '';
    $scope.accruals = [];
    $scope.years = years;
    this.localStorage = $localStorage;
    this.accrualService = accrualService;
    $scope.getAccruals = angular.bind(this, this.getAccruals);
    $scope.drawGraph = angular.bind(this, this.drawGraph);
    $scope.gridOptions = {
      enableSorting: true,
      enableColumnMenus: false,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: false,
      showColumnFooter: true,
    expandableRowTemplate: 'assets/employee/views/accrualScript.html',
    expandableRowHeight: 50,
    expandableRowScope: {
      subGridVariable: ''
    },
      columnDefs: [
        {field: 'number', displayName: 'Особовий рахунок'},
        {field: 'companyName', displayName: 'Підприємство'},
        {
          field: 'serviceName',
          displayName: 'Послуга',
          footerCellTemplate: '<div class="ui-grid-cell-contents">Разом</div>'
        },
        {
          field: 'debt',
          displayName: 'Борг',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          aggregationLabel: ' '
        },
        {
          field: 'accrual',
          displayName: 'Нараховано',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          aggregationLabel: ' '
        },
        {
          field: 'forPayment',
          displayName: 'До оплати',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          aggregationLabel: ' '
        },
        {
          field: 'paid',
          displayName: 'Сплачено',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          aggregationLabel: ' '
        }
      ]
    };
    $scope.gridOptions.onRegisterApi = function (gridApi) {
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        $scope.currentSelection = row.entity;
        $scope.isRowSelected = row.isSelected;
      });
    };
  if ($localStorage.idHouse) {
    $scope.selectedYear = new Date().getFullYear();
    $scope.monthStatic = [{name: 'Січень', number: 1},
      {name: 'Лютий', number: 2},
      {name: 'Березень', number: 3},
      {name: 'Квітень', number: 4},
      {name: 'Травень', number: 5},
      {name: 'Червень', number: 6},
      {name: 'Липень', number: 7},
      {name: 'Серпень', number: 8},
      {name: 'Вересень', number: 9},
      {name: 'Жовтень', number: 10},
      {name: 'Листопад', number: 11},
      {name: 'Грудень', number: 12}];
    $scope.selectedMonth = new Date().getMonth() + 1;
    $scope.address = 'Адреса: місто ' + $localStorage.addressObj.city + ', ' + $localStorage.addressObj.streetTypesUk + ' ' + $localStorage.addressObj.street + ' буд.'
      + $localStorage.addressObj.buildingNumber + ' кв.' + $localStorage.addressObj.numberFlat;
    $scope.getAccruals();
    $scope.clickHandlers = {
      onClick: $scope.drawGraph()
    };
  } else {
    window.location.href = '#address'
  };

}

AccrualCtrl.prototype = {
  getAccruals: function () {
    var this_ = this;
    this.accrualService.getAccruals(this_.localStorage.idHouse, this_.scope.selectedYear, this_.scope.selectedMonth)
      .then(function (response) {
        if (!response.accruals.length) {
          this_.scope.accruals = [];
          alertify.error('За даний період дані відсутні');
          this_.scope.dateInfoErr = 'За даний період дані відсутні';

        } else {
          this_.scope.accruals = response.accruals;
          this_.scope.dateInfo = 'Інформація про нарахування за ' +
          'житлово-комунальні та інші послуги відображено станом на ' + moment(response.date).format('DD.MM.YYYY');
        }
          this_.scope.gridOptions = {
          enableSorting: true,
          enableColumnMenus: false,
          enableRowSelection: true,
          enableRowHeaderSelection: false,
          multiSelect: false,
          data: response.accruals
        };
      })
      .catch(function (err) {
        alertify.error("Пробачте, з’явилась непередбачена помилка");
        this_.scope.dateInfoErr = 'Пробачте, з’явилась непередбачена помилка.';
      });
  },
  drawGraph: function () {
    var this_ = this;
    var dataset = [];
    this_.scope.dataset = [];
    if (this_.scope.accruals.length) {
      var accrual = this_.scope.currentSelection;
      if(accrual) {
        this.accrualService.getAccruals(this_.localStorage.idHouse, this_.scope.selectedYear, "",
          accrual.companyId, accrual.serviceId)
          .then(function (response) {
            this_.scope.options = {
              chart: {
                type: 'multiBarChart',
                height: 400,
                width: 1000,
                text: 'Нарахування',
                xScale: d3.time.scale(),
                x: function (d) {
                  return d.label;
                },
                y: function (d) {
                  return d.value;
                },
                stacked: false,
                showControls: false,
                transitionDuration: 100,
                useInteractiveGuideline: true,
                tooltips: true,
                tooltip: function (key, y, e, graph) {
                  return '<h3>' + key + '</h3>' +
                    '<p>' + e + " грн за " + y + '</p>'
                },
                showXAxis: true,
                xAxis: {
                  rotateLabels: -20,
                  axisLabel: 'Місяць'
                }
              }

            };

            this_.scope.data = [
              {
                "values": [
                  {
                    label: "Січень"
                  },
                  {
                    label: "Лютий"
                  },
                  {
                    label: "Березень"
                  },
                  {
                    label: "Квітень"
                  },
                  {
                    label: "Травень"
                  },
                  {
                    label: "Червень"
                  },
                  {
                    label: "Липень"
                  },
                  {
                    label: "Серпень"
                  },
                  {
                    label: "Вересень"
                  },
                  {
                    label: "Жовтень"
                  },
                  {
                    label: "Листопад"
                  },
                  {
                    label: "Грудень"
                  }
                ],
                "bar": true,
                "color": "red",
                "key": "Борг"
              },
              {
                "values": [
                  {
                    label: "Січень"
                  },
                  {
                    label: "Лютий"
                  },
                  {
                    label: "Березень"
                  },
                  {
                    label: "Квітень"
                  },
                  {
                    label: "Травень"
                  },
                  {
                    label: "Червень"
                  },
                  {
                    label: "Липень"
                  },
                  {
                    label: "Серпень"
                  },
                  {
                    label: "Вересень"
                  },
                  {
                    label: "Жовтень"
                  },
                  {
                    label: "Листопад"
                  },
                  {
                    label: "Грудень"
                  }
                ],
                "bar": true,
                "color": "green",
                "key": "Переплата"
              },
              {
                "values": [
                  {
                    label: "Січень"
                  },
                  {
                    label: "Лютий"
                  },
                  {
                    label: "Березень"
                  },
                  {
                    label: "Квітень"
                  },
                  {
                    label: "Травень"
                  },
                  {
                    label: "Червень"
                  },
                  {
                    label: "Липень"
                  },
                  {
                    label: "Серпень"
                  },
                  {
                    label: "Вересень"
                  },
                  {
                    label: "Жовтень"
                  },
                  {
                    label: "Листопад"
                  },
                  {
                    label: "Грудень"
                  }
                ],
                "bar": true,
                "color": "yellow",
                "key": "Нарахування"

              },
              {
                "values": [
                  {
                    label: "Січень"
                  },
                  {
                    label: "Лютий"
                  },
                  {
                    label: "Березень"
                  },
                  {
                    label: "Квітень"
                  },
                  {
                    label: "Травень"
                  },
                  {
                    label: "Червень"
                  },
                  {
                    label: "Липень"
                  },
                  {
                    label: "Серпень"
                  },
                  {
                    label: "Вересень"
                  },
                  {
                    label: "Жовтень"
                  },
                  {
                    label: "Листопад"
                  },
                  {
                    label: "Грудень"
                  }
                ],
                "bar": true,
                "color": "blue",
                "key": "Сплачено"
              }
            ];
            response.accruals.forEach(function (accrual) {
              var date = new Date(accrual.dateOfAccrued);
              var month = date.getMonth();
              if (accrual.debt > 0)
                this_.scope.data[0].values[month].value = Math.abs(accrual.debt);
              else
                this_.scope.data[1].values[month].value = Math.abs(accrual.debt);
              this_.scope.data[2].values[month].value = accrual.accrual;
              this_.scope.data[3].values[month].value = accrual.paid;
            });
            this_.scope.graph_show = true;
          })
          .catch(function (err) {
            alertify.error("Пробачте, з’явилась непередбачена помилка");
            this_.scope.dateInfo = 'Пробачте, з’явилась непередбачена помилка.';
          });
      }
    }
  }
};
AccrualCtrl.resolve = {
  years: function (accrualService, $localStorage) {
    return accrualService.minYear($localStorage.idHouse);
  }
};

function config($routeProvider){
  $routeProvider.when('/accruals',{
    templateUrl: '/assets/employee/views/Accrual.html',
    controller: 'AccrualCtrl',
    resolve: AccrualCtrl.resolve
  })
}

angular.module('employeeApp')
  .controller('AccrualCtrl', AccrualCtrl)
  .config(config);