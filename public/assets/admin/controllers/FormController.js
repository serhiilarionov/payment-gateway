function FormController($scope, allcities, CityManagementService, UserManagementService, CliManagementService, EmailManagementService) {
  $scope.cities = allcities;
  $scope.companies = [];
  $scope.companiesVisible = false;
  $scope.submitted = false;
  $scope.submittedSuccessfully = false;
  $scope.userExists = false;
  $scope.formInfo = {
    userCertTerm: 30
  };
  $scope.email = {
    passwordSent: false,
    certificateSent: false,
    errPasswordStatus: false,
    errCertificateStatus: false,
    errVerificationSentCode: 5011
  };
  var form = null;

  $scope.submit = function () {
    if ($scope.userReg.$valid && !$scope.userExists) {
      form = $scope.formInfo;
      UserManagementService.addNewEmployee(form)
        .then(function(data) {
          if (data.status_code === 2002) {
            $scope.formInfo = {userCertTerm: 30};
            $scope.userReg.$setPristine();
            $scope.submitted = false;
            $scope.submittedSuccessfully = true;
          }
        });
    } else {
      $scope.submitted = true;
    }
  };

  $scope.getCompanies = function () {
    var selectedCity = $scope.formInfo.userCity;
    CityManagementService.getCompanies(selectedCity).then(function (data) {
      if (data.length !== 0) {
        $scope.companiesVisible = true;
        $scope.companies = data;
      } else {
        alertify.alert("Не знайдено жодної компанії");
        $scope.companiesVisible = false;
      }
    });
  };

  $scope.checkIfLoginExists = function () {
    if ($scope.formInfo !== undefined && $scope.formInfo.userLogin !== undefined && $scope.formInfo.userLogin.length >= 3) {
      var login = $scope.formInfo.userLogin;
      UserManagementService.checkIfLoginExists(login).then(function (data) {
        data.length !== 0 ? $scope.userExists = true : $scope.userExists = false;
      });
    }
  };

  $scope.sendPassInEmail = function () {
    EmailManagementService.sendPass(form).then(function (data) {
      if (data == 'Відправлено') {
        alertify.success("Email успішно відправлено");
        $scope.email.passwordSent = true;
        $scope.email.errPasswordStatus = false;
      } else {
        alertify.error("Помилка при відправленні email");
        $scope.email.errPasswordStatus = true;
      }
    })
      .catch(function (err) {
        $scope.email.errPasswordStatus = true;
      })
  };

  $scope.sendCertificateInEmail = function () {
    EmailManagementService.sendCertificate(form).then(function (data) {
      if (data == 'Відправлено') {
        alertify.success("Email успішно відправлено");
        $scope.email.certificateSent = true;
        $scope.email.errCertificateStatus = false;
      } else {
        alertify.error("Помилка при відправленні email");
        $scope.email.errCertificateStatus = true;
      }
    })
      .catch(function (err) {
        alertify.error("Помилка при відправленні email");
        $scope.email.errCertificateStatus = true;
      })
  };

  $scope.createNewUser = function () {
    $scope.submittedSuccessfully = false;
    $scope.email.certificateSent = false;
    $scope.email.passwordSent = false;
    $scope.email.errPasswordStatus = false;
    $scope.email.errCertificateStatus = false;
    $scope.companiesVisible = false;
  }

}

FormController.resolve = {
  allcities: function (CityManagementService) {
    return CityManagementService.getCities();
  }
};

function config($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '/assets/admin/views/form.html',
    controller: 'FormController',
    resolve: FormController.resolve
  })
    .otherwise({
      redirectTo: '/'
    });
}

angular.module('adminApp')
  .controller('FormController', FormController)
  .config(config);
