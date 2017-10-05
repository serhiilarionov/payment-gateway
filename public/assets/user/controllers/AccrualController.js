'use strict';

/**
 * @todo: Описать контроллер accrualsCtrl
 * @param $scope
 * @param years
 * @param accrualsService
 * @param $localStorage
 */
function accrualsCtrl($scope, years, accrualsService, $localStorage, uiGridConstants) {
	var this_ = this;
	this.scope = $scope;
	$scope.dateInfo = {};
	$scope.years = years;
	this.localStorage = $localStorage;
	this.accrualsService = accrualsService;
	$scope.getAccruals = angular.bind(this, this.getAccruals);
	$scope.gridOptions = {
		showColumnFooter: true,
		enableColumnMenus: false,
		expandableRowTemplate: 'assets/user/views/accrualScript.html',
		expandableRowHeight: 50,
		expandableRowScope: {
			subGridVariable: ''
		},

		columnDefs: [
			{field: 'id', displayName: 'id', visible:false},
			{field: 'number', displayName: 'Особовий рахунок'},
			{field: 'companyName', displayName:'Підприємство'},
			{field: 'serviceName', displayName: 'Послуга', footerCellTemplate: '<div class="ui-grid-cell-contents">Разом</div>' },
			{field: 'debt', displayName: 'Борг' , aggregationType:  uiGridConstants.aggregationTypes.sum, aggregationLabel: ' ' },
			{field: 'accrual', displayName: 'Нараховано', aggregationType: uiGridConstants.aggregationTypes.sum, aggregationLabel: ' '},
			{field: 'forPayment', displayName: 'До оплати', aggregationType: uiGridConstants.aggregationTypes.sum, aggregationLabel: ' '},
			{field: 'paid', displayName: 'Сплачено', aggregationType: uiGridConstants.aggregationTypes.sum, aggregationLabel: ' '}
		]
	};
	$scope.gridOptions.onRegisterApi = function(gridApi) {
		$scope.gridApi = gridApi;
		gridApi.expandable.on.rowExpandedStateChanged($scope,function(row){
		});
	};

	$scope.selectedYear =  new Date().getFullYear();
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
	$scope.selectedYear =  new Date().getFullYear();
	$scope.selectedMonth = new Date().getMonth()+1;
	$scope.address = $localStorage.address;
	$scope.getAccruals();
}

accrualsCtrl.prototype = {
	getAccruals: function() {
		var this_ = this;
		this_.accrualsService.getAccruals(this_.localStorage.idHouse, this_.scope.selectedYear, this_.scope.selectedMonth)
			.then(function (accruals) {
				if(!accruals.accruals.length) {
					alertify.error('За даний період дані відсутні');
					this_.scope.dateInfo.err = 'За даний період дані відсутні';
					this_.scope.dateInfo.title = null;
					this_.scope.dateInfo.text = null;
				} else {
					var textDate = moment(accruals.date).format('DD.MM.YYYY');
					this_.scope.dateInfo.err = null;
					this_.scope.dateInfo.title = 'Інформація про нарахування за житлово-комунальні та інші послуги відображено станом на ';
					this_.scope.dateInfo.text = textDate;
				}
				this_.scope.gridOptions = {
					data: accruals.accruals
				};
			})
			.catch(function (err) {
				alertify.error("Пробачте, виникла непередбачена помилка");
				this_.scope.dateInfo = 'Пробачте, з’явилась непередбачена помилка.';
			});
	}
};
accrualsCtrl.resolve = {
	years: function (accrualsService, $localStorage) {
		return accrualsService.minYear($localStorage.idHouse);
	}
};

function config($stateProvider) {
	$stateProvider.state('subscriber./accrual/amounts', {
		url:'/accrual/amounts',
		templateUrl: '/assets/user/views/Accrual.html',
		controller: 'accrualsCtrl',
		ncyBreadcrumb: {
			parent: 'subscriber',
			label: 'Нараховані сумми'
		},
		resolve: accrualsCtrl.resolve
	});
}

angular.module('userApp')
	.controller('accrualsCtrl', accrualsCtrl)
	.config(config);