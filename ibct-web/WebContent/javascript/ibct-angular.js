var app = angular.module('ibct-web', [ 'ngRoute', 'ui.bootstrap',
		'angularUtils.directives.dirPagination' ]);

app.config(function($routeProvider, $locationProvider) {
	$routeProvider.when("/", {
		templateUrl : "authentication.html",
		controller : "loginController"
	}).when("/welcome", {
		templateUrl : "welcome.html",
		controller : "welcomeController"
	}).when("/AddBulletin", {
		templateUrl : "add.html",
		controller : "addController"
	}).when("/UpdateBulletin", {
		templateUrl : "update.html",
		controller : "updateController"
	})/*
		 * .when("/Home", { templateUrl : "Index.html", controller :
		 * "mainController" })
		 */.when("/Cancel", {
		templateUrl : "cancel.html",
		controller : "cancelController"
	}).when("/Number", {
		templateUrl : "number.html",
		controller : "numberController"
	}).when("/viewConfig", {
		templateUrl : "viewConfiguration.html",
		controller : "viewConfigController"

	}).when("/Fleet", {
		templateUrl : "fleet.html",
		controller : "fleetController"
	}).when("/Engine", {
		templateUrl : "engineReport.html",
		controller : "enginePackageController"
	}).when("/Package", {
		templateUrl : "package.html",
		controller : "enginePackageController"
	}).when("/addSerial", {
		templateUrl : "addSerial.html",
		controller : "addSerialController"
	}).when("/updateCompliance", {
		templateUrl : "engine.html",
		controller : "enginePackageController"
	}).when("/userProfile", {
		templateUrl : "userProfile.html",
		controller : "userController"
	}).when("/adminPage", {
		templateUrl : "administrator.html",
		controller : "AdministratorController"
	});
});

/*******************************************************************************
 * ******************MAIN CONTROLLER *******************************
 * 
 * @author: jeevan-475852,@author: dilip 10-FEB-2017
 ******************************************************************************/

/*
 * app.controller('loginController',function($scope, $http, $filter, $location){
 * 
 * $scope.webUrl = $location.url();
 * 
 * });
 */

/*******************************************************************************
 * ******************ADD CONTROLLER *******************************
 * 
 * @author: jeevan-475852,@author: Arka-460545 29-NOV-2016
 ******************************************************************************/
app
		.controller(
				'addController',
				function($scope, $http, $filter, $window, $timeout) {

					$scope.opened = {
						start : false,
						end : false
					};
					$http.get('http://localhost:8080//ibct/Product').then(
							function(response) {

								$scope.productLines = response.data.data;
							});

					$scope.myname = "jai";
					$scope.IssueDate = $filter('date')
							(Date.now(), 'yyyy-MM-dd');
					$scope.RevisionDate = $filter('date')(Date.now(),
							'yyyy-MM-dd');

					$http
							.get(
									'http://localhost:8080//ibct/Bulletin/CodesOptions/BULLETIN_CATEGORY')
							.then(function(response) {

								$scope.bulletinCategory = response.data.data;

							});

					$scope.complianceLevel = [ {
						"codeID" : "D",
						"compLevel" : "DEPOT"
					}, {
						"codeID" : "F",
						"compLevel" : "FIELD"
					}, {
						"codeID" : "F/D",
						"compLevel" : "FIELD REPORT"
					}, {
						"codeID" : "SPS",
						"compLevel" : "SPS CONVERSION"
					} ];
					$scope.formLink = true;
					$scope.editableMultipleTiming = true;
					$http
							.get(
									'http://localhost:8080//ibct/Bulletin/CodesOptions/TIMING_CODE')
							.then(function(response) {

								$scope.timing = response.data.data;

							});
					function getBulletinTypeCode(bulletintype) {
						if (bulletintype == "PRODUCT BULLETIN") {
							return 20000043;
						} else if (bulletintype == "SERVICE BULLETIN") {
							return 20000042;
						} else if (bulletintype == "SYSTEM BULLETIN") {
							return 2726;
						} else {
							return 0;
						}
					}
					$scope.fromSN = [];
					$scope.enableForm = function() {
						$scope.successMsg = "";
						$scope.editableMultipleTiming = false;
						if ((this.addController.productType == false || angular
								.isUndefined(this.addController.productType))
								&& this.addController.productLines.productLine == "LMS100") {

							alert("Please Select either engine or Package")
						} else {
							$scope.formLink = false;
							$scope.serialuri = 'http://localhost:8080//ibct/Bulletin/Serials/'
									+ this.addController.productLines.productLine
									+ '/';

							if (this.addController.bulletinTypes == "PRODUCT BULLETIN") {
								$scope.serialuri = $scope.serialuri
										+ '20000043';
								$scope.typecode = 20000043
							} else if (this.addController.bulletinTypes == "SERVICE BULLETIN") {
								$scope.serialuri = $scope.serialuri
										+ '20000042';
								$scope.typecode = 20000042
							} else if (this.addController.bulletinTypes == "SYSTEM BULLETIN") {
								$scope.serialuri = $scope.serialuri + '2726';
								$scope.typecode = 2726
							} else {
								return 0;
							}

							$scope.superceedUri = $scope.superceedUri
									+ this.addController.productLines.productLine;

							$http
									.get($scope.serialuri)
									.then(
											function(response) {

												$scope.fromSN = response.data.data;
												if ($scope.fromSN.length == 0) {
													alert("There are no Serial numbers exist against this combination. Please select different combination.");
													$scope.formLink = true;
												}

												$scope.toSN = response.data.data;
											});
							$scope.supercedes = [];
							$scope.superdata = {
								"productLine" : this.addController.productLines.productLine,
								"bulletinTypeCode" : $scope.typecode,
								"bulletinStatus" : 'EFFECTIVE'
							};
							$http(
									{
										method : 'POST',
										url : 'http://localhost:8080//ibct/Bulletin/Superced',
										dataType : 'json',
										data : JSON.stringify($scope.superdata),
										headers : {
											'Content-Type' : 'application/json'
										}
									}).success(
									function(data, status, headers, config) {
										$scope.supercedes = data.data;

									}).error(
									function(data, status, headers, config) {

									});
							this.addController.supercedes = $scope.supercedes;
						}

					}
					$scope.multiFromSerial = false;
					$scope.serialAddButtonLink = true;
					$scope.serialClearButtonLink = true;
					$scope.disableTo = function(fromSerN) {

						if (fromSerN.length > 1) {

							$scope.multiFromSerial = true;
						} else
							$scope.multiFromSerial = false;

						$scope.serialClearButtonLink = false;
						$scope.serialAddButtonLink = false;

						if (reg2.test(fromSerN) == true
								|| reg3.test(fromSerN) == true) {

							$scope.multiFromSerial = true;
							var dropdowns = document.getElementsByName("num");

							for (i = 0; i < dropdowns.length; i++) {
								if (dropdowns[i].type == "select-one") {
									dropdowns[i].value = "?";
									this.addController.toSN = undefined;
								}
							}
						}
					}

					$scope.serialNumber = [];
					$scope.clearSerialNo = function() {

						var dropdowns = document.getElementsByName("num");

						for (i = 0; i < dropdowns.length; i++) {
							if (dropdowns[i].type == "select-one") {
								dropdowns[i].value = "?";
							}
							if (dropdowns[i].type == "select-multiple") {
								dropdowns[i].value = [];
							}

						}
						this.addController.fromSN = [];
						this.addController.toSN = undefined;
						$scope.serialAddButtonLink = true;
						$scope.serialClearButtonLink = true;
					}

					var reg = new RegExp('^[0-9]*$');
					var reg1 = new RegExp('^[A-Z]+[0-9]*');
					var reg2 = new RegExp('^[0-9]*-[0-9]*$');
					var reg3 = new RegExp('^[0-9]+[A-Z]+');
					var reg4= /[A-Z]+/;
					/*
					 * $scope.validateOverlap = function(fromSerN, toSNum) {
					 * 
					 * if ($scope.serialNumber.length != 0) { for (var i = 0; i <
					 * $scope.serialNumber.length; i++) { if
					 * ($scope.serialNumber[i].fromSNum <= fromSerN ||
					 * $scope.serialNumber[i].toSNum <= toSNum) { return true; } } }
					 * else { return false; } }
					 */

					$scope.flag = true;
					$scope.mismatchFlag=true;
					/*
					 * Finding Duplicates Shridhar Sangamkar 460711
					 */
					$scope.checkMe = function(fromSerN, toSerN) {
						// console.log(toSerN);

						if (!angular.isUndefined(toSerN)) {

							if (reg.test(fromSerN[0]) == true
									&& reg.test(toSerN) == true) {
								for (i = 0; i < $scope.serialNumber.length; i++) {
									// if($scope.fromLength==$scope.serialNumber[i].fromSNum.length&&$scope.toLength==$scope.serialNumber[i].fromSNum.length
									// ){*/
									if ((parseInt(fromSerN) >= parseInt($scope.serialNumber[i].fromSNum) && parseInt(fromSerN) <= parseInt($scope.serialNumber[i].toSNum))
											|| ((parseInt(fromSerN) <= parseInt($scope.serialNumber[i].fromSNum)) && ((parseInt(toSerN) >= parseInt($scope.serialNumber[i].fromSNum))))) {
										// console.log("1");
										$scope.flag = false;

									} else if ((parseInt(toSerN) <= parseInt($scope.serialNumber[i].toSNum) && parseInt(toSerN) >= parseInt($scope.serialNumber[i].fromSNum))
									/*
									 * || (parseInt(toSerN) <=
									 * parseInt($scope.serialNumber[i].fromSNum))
									 */) {
										// console.log("2");
										$scope.flag = false;
									} else {

									}
									/*
									 * } else{ $scope.flag=false; alert("Type
									 * Mismatch") console.log("6"); }
									 */
								}
							} else if (reg1.test(fromSerN[0]) == true
									&& reg1.test(toSerN) == true) {
								var str1=fromSerN[0].match(reg4);
								var str2=toSerN.match(reg4);
								//console.log(fromSerN[0].match(reg4)+","+toSerN.match(reg4))
								//console.log(str1.localeCompare(str2))
								//console.log(str1[0]==str2[0])
								if(str1[0]==str2[0]){
									//console.log("matched");
								for (i = 0; i < $scope.serialNumber.length; i++) {
									if(reg1.test($scope.serialNumber[i].fromSNum) == true){
									if($scope.serialNumber[i].fromSNum.match(reg4)[0]==fromSerN[0].match(reg4)[0]){

									if ((fromSerN[0] >= $scope.serialNumber[i].fromSNum && fromSerN <= $scope.serialNumber[i].toSNum)
											|| (fromSerN[0] <= $scope.serialNumber[i].fromSNum)) {
										// console.log("3");
										$scope.flag = false;
									} else if ((toSerN <= $scope.serialNumber[i].toSNum && toSerN <= $scope.serialNumber[i].fromSNum)
											|| (toSerN <= $scope.serialNumber[i].toSNum)) {
										// console.log("4");
										$scope.flag = false;
									} else {

									}
								}
								}
								}
								}
								else{
									
									$scope.mismatchFlag=false;
									alert("Type Mismatch")
								}

							}

						} else if (angular.isUndefined(toSerN)) {
							// console.log("8"+reg1.test(fromSerN[0])+reg.test(fromSerN[0]));
							
							//var str2=toSerN.match(reg4);
							for (j = 0; j < fromSerN.length; j++) {
								
								if ((reg1.test(fromSerN[j]) == true)) {
									var str1=fromSerN[j].match(reg4);
									
									for (i = 0; i < $scope.serialNumber.length; i++) {
										if ((reg1
												.test($scope.serialNumber[i].fromSNum) == true)
												) {
											if(str1[0]==$scope.serialNumber[i].fromSNum.match(reg4)[0]){

											if (fromSerN[j] >= $scope.serialNumber[i].fromSNum
													&& fromSerN[j] <= $scope.serialNumber[i].toSNum) {
												$scope.flag = false;
												// console.log("5");
											} else if ($scope.serialNumber[i].toSNum == "") {
												/*console
														.log((fromSerN[j])
																+ ","
																+ ($scope.serialNumber[i].fromSNum))*/
												if ((fromSerN[j]) == ($scope.serialNumber[i].fromSNum)) {

													$scope.flag = false;
													// console.log("13");
												}
											}

										}
										}
									}
								} else if ((reg.test(fromSerN[j]) == true)) {
									//console.log("12: "+ $scope.serialNumber.length);
									for (i = 0; i < $scope.serialNumber.length; i++) {
										// console.log($scope.serialNumber[i].toSNum)
										// console.log($scope.serialNumber[i].toSNum=="");
										if (parseInt(fromSerN[j]) >= parseInt($scope.serialNumber[i].fromSNum)
												&& parseInt(fromSerN[j]) <= parseInt($scope.serialNumber[i].toSNum)) {
											$scope.flag = false;
											// console.log("6");
										} else if ($scope.serialNumber[i].toSNum == "") {
											/*console
													.log(parseInt(fromSerN[j])
															+ ","
															+ parseInt($scope.serialNumber[i].fromSNum))*/
											if (parseInt(fromSerN[j]) == parseInt($scope.serialNumber[i].fromSNum)) {

												$scope.flag = false;
												// console.log("7");
											}
										}
									}
								} else if ((reg2.test(fromSerN[j]) == true)) {
									for (i = 0; i < $scope.serialNumber.length; i++) {
										if (reg2
												.test($scope.serialNumber[i].fromSNum)) {

											if (fromSerN[j] == $scope.serialNumber[i].fromSNum) {
												$scope.flag = false;
												// console.log("15");
											}
											/*
											 * else
											 * if($scope.serialNumber[i].toSNum==""){
											 * console.log((fromSerN[j])+","+($scope.serialNumber[i].fromSNum))
											 * if((fromSerN[j])==($scope.serialNumber[i].fromSNum)){
											 * 
											 * $scope.flag = false;
											 * console.log("16"); } }
											 */

										}
									}
								} else if ((reg3.test(fromSerN[j]) == true)) {
									for (i = 0; i < $scope.serialNumber.length; i++) {
										if (reg3
												.test($scope.serialNumber[i].fromSNum)) {

											if (fromSerN[j] == $scope.serialNumber[i].fromSNum) {
												$scope.flag = false;
												// console.log("17");
											}
											/*
											 * else
											 * if($scope.serialNumber[i].toSNum==""){
											 * console.log((fromSerN[j])+","+($scope.serialNumber[i].fromSNum))
											 * if((fromSerN[j])==($scope.serialNumber[i].fromSNum)){
											 * 
											 * $scope.flag = false;
											 * console.log("16"); } }
											 */

										}
									}
								}

							}
						}
					}

					/*
					 * Finding Duplicates Shridhar Sangamkar 460711
					 */

					$scope.addSN = function(fromSerN, toSerN) {
						/* *******Overlapping Serial Number Validation****** */
						$scope.checkMe(fromSerN, toSerN);

						if ($scope.timingSelected.length > 0) {

							if ($scope.flag == true) {
								// console.log("10");
								if ((fromSerN.length == 1)
										&& angular.isUndefined(toSerN)) {
									// console.log("11"+reg.test(fromSerN[0]));
									if (reg1.test(fromSerN[0]) == true
											|| reg.test(fromSerN[0]) == true
											|| reg2.test(fromSerN[0]) == true
											|| reg3.test(fromSerN[0]) == true) {
										// console.log("9");
										for (i = 0; i < $scope.timingSelected.length; i++) {
											$scope.serialNumber
													.push({
														timing : $scope.timingSelected[i],
														timingcodeID : $scope.timingSelectedcodeId[i],
														fromSNum : fromSerN[0],
														toSNum : "",
														isClicked : false
													});
										}
									}
								}

								if ((fromSerN.length == 1) && toSerN) {

									if (reg.test(fromSerN[0]) == true
											&& reg.test(toSerN) == true) {

										if (parseInt(fromSerN[0]) >= parseInt(toSerN)) {

											alert("From Serial Number should not be greater than To Serial Number")
										} else {
											for (i = 0; i < $scope.timingSelected.length; i++) {
												$scope.serialNumber
														.push({
															timing : $scope.timingSelected[i],
															timingcodeID : $scope.timingSelectedcodeId[i],
															fromSNum : fromSerN[0],
															toSNum : toSerN,
															isClicked : false
														});

											}
										}

									} else if ((reg.test(fromSerN[0]) == false && reg
											.test(toSerN) == true)) {
										alert("Type Mismatch")
									} else if (reg.test(fromSerN[0]) == true
											&& reg.test(toSerN) == false) {
										alert("Type Mismatch")
									} else if ((reg1.test(fromSerN[0]) == false && reg1
											.test(toSerN) == true)) {
										alert("Type Mismatch")
									} else if (reg1.test(fromSerN[0]) == true
											&& reg1.test(toSerN) == false) {
										alert("Type Mismatch")
									} else if ((reg2.test(fromSerN[0]) == false && reg2
											.test(toSerN) == true)) {
										alert("Type Mismatch")
									} else if (reg2.test(fromSerN[0]) == true
											&& reg2.test(toSerN) == false) {
										alert("Type Mismatch")
									} else if (reg.test(fromSerN[0]) == false
											&& reg.test(toSerN) == false) {
										
										if (fromSerN[0] >= (toSerN)&& $scope.mismatchFlag==true) {
											
											alert("From Serial Number should not be greater than To Serial Number")
										} 
										else {
										//	 console.log("14:"+$scope.mismatchFlag);
											 
											 if($scope.mismatchFlag==true){
											//	 console.log("mismatchFlagTrue")
											for (i = 0; i < $scope.timingSelected.length; i++) {
											//	console.log("push alphanum")
												$scope.serialNumber
														.push({
															timing : $scope.timingSelected[i],
															timingcodeID : $scope.timingSelectedcodeId[i],
															fromSNum : fromSerN[0],
															toSNum : toSerN,
															isClicked : false
														});

											}
											 }
											 else {$scope.mismatchFlag=true;}
										}
									}

								} else if (fromSerN.length > 1) {

									for (i = 0; i < fromSerN.length; i++) {
										for (j = 0; j < $scope.timingSelected.length; j++) {
											$scope.serialNumber
													.push({
														timing : $scope.timingSelected[j],
														timingcodeID : $scope.timingSelectedcodeId[j],
														fromSNum : fromSerN[i],
														toSNum : "",
														isClicked : false
													});
										}
									}

								}

							} else {
								alert("The Selected range is overlapping the existing serial numbers range.");

								$scope.flag = true;
								$scope.mismatchFlag=true;
							}
							$scope.clearSerialNo();
						} else {
							alert("Please select timing code");
						}

						if ($scope.serialNumber.length > 0) {
							$scope.editableMultipleTiming = true;
						}

					}


					$scope.buttonLink = true;
					$scope.radioProductLink = true;
					$scope.bulletinTypes = [];
					$scope.serialDeleteButtonLink = true;
					$scope.bulletinTypes_available = [];
					$scope.enableButton = function() {
						$scope.clearFormControlFields();
						$scope.formLink = true;
						$http
								.get(
										'http://localhost:8080//ibct/Bulletin/BulletinTypes')
								.then(
										function(response) {

											$scope.bulletinTypes_available = response.data.data;
											if ($scope.addController.productLines != null) {
												if ($scope.addController.productLines.productLine == "LMS100") {

													$scope.radioProductLink = false;
													$scope.buttonLink = false;
													$scope.formLink = true;
													$scope.serialNumber = [];
													$scope.multiFromSerial = true;
													$scope.fromSN = [];
													$scope.toSN = [];
													$scope.addController.bulletinTypes = 'SYSTEM BULLETIN';
													$scope.bulletinTypes = [ 'SYSTEM BULLETIN' ];
												} else {
													$scope.radioProductLink = true;
													$scope.addController.productType = false;
													for (i = 0; i < $scope.bulletinTypes_available.length; i++) {

														if ($scope.bulletinTypes_available[i] != "SYSTEM BULLETIN") {

															$scope.bulletinTypes[i] = $scope.bulletinTypes_available[i];

														}

													}
													$scope.serialNumber = [];
													$scope.multiFromSerial = true;
													$scope.fromSN = [];
													$scope.toSN = [];
													$scope.clearSerialNo();
												}
											} else {
												$scope.radioProductLink = true;
												$scope.bulletinTypes = [];

											}

										});

						if (!(this.addController.productLines && this.addController.bulletinTypes)) {
							$scope.buttonLink = true;
							$scope.formLink = true;
							$scope.fromSN = [];
							$scope.toSN = [];
							$scope.clearFormControlFields();
							$scope.serialAddButtonLink = true;
							$scope.serialClearButtonLink = true;
							$scope.clearSerialNo();
						} else
							$scope.buttonLink = false;
					}

					$scope.clearFormControlFields = function() {
						var elements = document.getElementsByTagName("input");
						var dropdowns = document.getElementsByTagName("select");
						var textboxes = document
								.getElementsByTagName("textarea");
						var i = 0
						for (i = 0; i < elements.length; i++) {
							if (elements[i].type == "text") {
								elements[i].value = "";
							}
							if (elements[i].type == "checkbox") {
								elements[i].checked = elements[i].defaultChecked;
							}
							if (elements[i].type == "date") {
								elements[i].value = "";
							}

						}
						for (i = 0; i < dropdowns.length; i++) {
							if (dropdowns[i].type == "select-one") {
								if (dropdowns[i].id != "disabledSelect")
									dropdowns[i].value = "";
							}
							if (dropdowns[i].type == "select-multiple") {
								dropdowns[i].value = [];
							}

						}
						for (i = 0; i < textboxes.length; i++) {
							if (textboxes[i].type == "textarea") {
								textboxes[i].value = "";
							}
						}
						$scope.serialNumber = [];
						$scope.formLink = true;

					}

					$scope.save = function() {
						$http(
								{
									method : 'POST',
									url : 'http://localhost:8080//ibct/Bulletin/CancelBulletin',
									dataType : 'json',
									data : JSON.stringify({
										"bulletinNum" : "LM6000-IND-163"
									}),
									headers : {
										'Content-Type' : 'application/json'
									}
								}).success(
								function(data, status, headers, config) {
									// this callback will be called
									// asynchronously
									// when the response is available

								}).error(
								function(data, status, headers, config) {
									// called asynchronously if an error occurs
									// or server returns response with an error
									// status.

								});

					}
					$scope.bulletinValues = [];
					function getFields(input, field) {
						return input.map(function(o) {
							return o[field];
						});
					}
					$scope.timingSelected = [];

					$scope.selectionSwitch = false;
					$scope.switchSelectionType = function() {

						if (this.addController.multipleTimingcodes == "Y") {

							this.addController.timing = [];
							if ($scope.timingSelected.length != 0) {
								$scope.timingSelected.splice(0,
										$scope.timingSelected.length)

							}
							$scope.selectionSwitch = true;

						} else {
							this.addController.timing = [];
							if ($scope.timingSelected.length != 0) {
								$scope.timingSelected.splice(0,
										$scope.timingSelected.length)

							}
							$scope.selectionSwitch = false;

						}

					}
					$scope.successMsg = "";
					$scope.failureMsg = "";
					/*
					 * $scope.getMsg = function() {
					 * 
					 * console.log("hi") return $scope.successMsg }
					 */

					$scope.saveFormControlFields = function() {
						if ($scope.serialNumber.length != 0) {
							$scope.bulletinValues.Bulletin = this.addController.bulletin;
							$scope.bulletinValues.BulletinTypeCode = getBulletinTypeCode(this.addController.bulletinTypes); // this.addController.bulletinTypes;
							$scope.bulletinValues.Revision = this.addController.revision;
							$scope.bulletinValues.Description = this.addController.description;
							if (this.addController.supercedes == "") {

								$scope.bulletinValues.Supercedes = " ";
							} else {

								$scope.bulletinValues.Supercedes = this.addController.supercedes;
							}

							$scope.bulletinValues.Category = this.addController.category;
							$scope.bulletinValues.ComplianceLevel = this.addController.complianceLevel;

							/*
							 * $scope.bulletinValues.Timing = getFields(
							 * this.addController.timing, 'codeID');
							 */

							$scope.bulletinValues.RevDate = $filter('date')(
									this.addController.revDate, 'MM/dd/yyyy');

							if ($scope.bulletinValues.RevDate == null) {

								$scope.bulletinValues.RevDate = $filter('date')
										(new Date(), 'MM/dd/yyyy');
							}
							/*
							 * if (this.addController.trackImplementationPlan) {
							 * $scope.bulletinValues.TrackImplementationPlan =
							 * 'Y'; } else {
							 * $scope.bulletinValues.TrackImplementationPlan =
							 * 'N'; } if (this.addController.significant) {
							 * $scope.bulletinValues.Significant = 'N'; } else {
							 * $scope.bulletinValues.Significant = 'Y'; }
							 */
							$scope.bulletinValues.IssueDate = $filter('date')(
									this.addController.issueDate, 'MM/dd/yyyy');
							/*
							 * if (this.addController.voucherProgram) {
							 * $scope.bulletinValues.VoucherProgram = 'Y'; }
							 * else { $scope.bulletinValues.VoucherProgram =
							 * 'N'; } if
							 * (this.addController.fieldImplementationMetric) {
							 * $scope.bulletinValues.fieldImplementationMetric =
							 * 'Y'; } else {
							 * $scope.bulletinValues.fieldImplementationMetric =
							 * 'N'; }
							 */
							if ($scope.bulletinValues.IssueDate == null) {

								$scope.bulletinValues.IssueDate = $filter(
										'date')(new Date(), 'MM/dd/yyyy');
							}

							$scope.bulletinValues.serialNumbers = $scope.serialNumber;
							$scope.bulletinValues.Remarks = this.addController.remarks;
							$scope.bulletinValues.serialNumbers = $scope.serialNumber;

							$scope.bulletinValues.ProductLine = this.addController.productLines.productLine;
							$scope.bulletinValues.fromSerials = getFields(
									$scope.bulletinValues.serialNumbers,
									'fromSNum');
							$scope.bulletinValues.toSerials = getFields(
									$scope.bulletinValues.serialNumbers,
									'toSNum');

							if (confirm("Are you sure to save this bulletin?")) {
								$http(
										{
											method : 'POST',
											url : 'http://localhost:8080//ibct/Bulletin/Insert',
											dataType : 'json',
											data : JSON
													.stringify({
														"category" : $scope.bulletinValues.Category,
														"bulletinNum" : $scope.bulletinValues.Bulletin,
														"complianceLevel" : $scope.bulletinValues.ComplianceLevel,
														// "trackImplimentationPlan"
														// :
														// $scope.bulletinValues.TrackImplementationPlan,
														// "significant" :
														// $scope.bulletinValues.Significant,
														// "voucherProgram" :
														// $scope.bulletinValues.VoucherProgram,
														"remarks" : $scope.bulletinValues.Remarks,
														"bulletinTypeCode" : getBulletinTypeCode(this.addController.bulletinTypes),
														"latestRevId" : $scope.bulletinValues.Revision,
														// "createdBy" :
														// "502353971",
														"productLine" : $scope.bulletinValues.ProductLine,
														"description" : $scope.bulletinValues.Description,
														"revision" : $scope.bulletinValues.Revision,
														"createdBy" : "jai",
														"timings" : $scope.bulletinValues.Timing,
														"fromserials" : $scope.bulletinValues.fromSerials,
														"toserials" : $scope.bulletinValues.toSerials,
														// "fieldImplementationMetric"
														// :
														// $scope.bulletinValues.fieldImplementationMetric,
														"issueDate" : $scope.bulletinValues.IssueDate,
														"revisionDate" : $scope.bulletinValues.RevDate,
														"supercededBulletinNum" : $scope.bulletinValues.Supercedes,
														"serialNumber" : $scope.bulletinValues.serialNumbers
													}),
											headers : {
												'Content-Type' : 'application/json'
											}
										})
										.success(
												function(data, status, headers,
														config) {
													// this callback will be
													// called
													// asynchronously
													// when the response is
													// available

													if (data.statusMessage == "error") {
														alert('Bulletin already exists, please contact your administrator');
													} else if (data.statusMessage == "fail") {

														alert('There was an error while adding the new bulletin. Please contact your administrator');
													} else {

														// alert("The bulletin
														// has been added
														// successfully");
														$(document)
																.scrollTop(0);
														/*
														 * $(document) .ready(
														 * function() { $( this)
														 * .scrollTop( 0);
														 * localStorage
														 * .setItem(
														 * 'successMsg',
														 * "successsss"); //
														 * $scope.successMsg="Heelo"; //
														 * $scope.successMsg // = //
														 * localStorage.getItem('successMsg'); //
														 * console.log($scope.successMsg);
														 * });
														 */
														// $window.location.href
														// = '#AddBulletin'
														$scope.successMsg = "The bulletin has been added successfully";
														$scope
																.clearFormControlFields();

													}

												})
										.error(
												function(data, status, headers,
														config) {
													// called asynchronously if
													// an
													// error
													// occurs
													// or server returns
													// response
													// with
													// an error
													// status.
													$scope.failureMsg = "There was an error while adding the new bulletin. Please contact your administrator";
													/*
													 * $scope
													 * .getSuccessMessage(false)
													 */
													// alert('There was an error
													// while adding the new
													// bulletin. Please contact
													// your administrator');
												});

							}
						} else {
							alert("Please add the serial range before adding")
						}
					}
					/*
					 * $scope.getSuccessMessage = function(msg) { return msg; }
					 */
					var today = new Date();
					$scope.today = new Date();
					$scope.dateCheck = function(otherDate) {

						if ((today < $scope.addController.revDate)) {
							alert("Date cannot be future date")
							$scope.addController.revDate = new Date(
									$scope.RevisionDate);
						}
						if ((today < $scope.addController.issueDate)) {
							alert("Date cannot be future date")
							$scope.addController.issueDate = new Date(
									$scope.IssueDate);

						}
					}
					$scope.chckedIndexs = [];

					$scope.checkedIndex = function(item) {
						if (($scope.chckedIndexs.indexOf(item)) === -1) {
							$scope.chckedIndexs.push(item);
						} else {
							$scope.chckedIndexs.splice($scope.chckedIndexs
									.indexOf(item), 1);
						}
						if ($scope.chckedIndexs.length > 0) {
							$scope.serialDeleteButtonLink = false;
						} else
							$scope.serialDeleteButtonLink = true;
					}
					$scope.removeItem = function(index) {
						if ($scope.chckedIndexs.length > 0) {
							angular.forEach($scope.chckedIndexs, function(
									value, index) {
								var index = $scope.serialNumber.indexOf(value);
								$scope.serialNumber.splice($scope.serialNumber
										.indexOf(value), 1);
							})
							$scope.chckedIndexs = [];
						}
						$scope.serialDeleteButtonLink = true;

					};
					$scope.timingSelectedcodeId = [];
					$scope.timingFlag = 0;
					$scope.loadTimingCodeName = function() {

						$scope.timingSelected = [];
						$scope.timingSelectedcodeId = [];
						if (!angular
								.isUndefined($scope.addController.timing.length)) {

							for (i = 0; i < $scope.addController.timing.length; i++) {
								$scope.timingFlag = 1;
								$scope.timingSelected[i] = angular
										.copy(parseInt($scope.addController.timing[i].codeName));
								$scope.timingSelectedcodeId[i] = angular
										.copy($scope.addController.timing[i].codeID);
							}
						} else {

							$scope.timingSelected
									.push($scope.addController.timing.codeName);
							$scope.timingSelectedcodeId
									.push($scope.addController.timing.codeID);
							if ($scope.timingSelected.length > 0) {
								$scope.timingFlag = 1;
							}
						}

					}

				});

/*******************************************************************************
 * ******************UPDATE CONTROLLER *******************************
 * 
 * @author: jeevan-475852,@author: Arka-460545 06-DEC-2016
 ******************************************************************************/
app
		.controller(
				'updateController',
				function($scope, $http, $filter, $window) {

					$http.get('http://localhost:8080//ibct/Product').then(
							function(response) {

								$scope.productLines = response.data.data;

							});

					$http
							.get(
									'http://localhost:8080//ibct/Bulletin/CodesOptions/TIMING_CODE')
							.then(function(response) {

								$scope.timing = response.data.data;
							});
					$http
							.get(
									'http://localhost:8080//ibct/Bulletin/CodesOptions/BULLETIN_CATEGORY')
							.then(function(response) {

								$scope.bulletinCategory = response.data.data;
							});

					$scope.multiFromSerial = false;
					$scope.serialAddButtonLink = true;
					$scope.serialClearButtonLink = true;
					$scope.serialNumbers = [];
					$scope.disableTo = function(fromSerN) {

						if (fromSerN.length > 1) {

							$scope.multiFromSerial = true;
						} else
							$scope.multiFromSerial = false;

						$scope.serialClearButtonLink = false;
						$scope.serialAddButtonLink = false;

						if (reg2.test(fromSerN) == true
								|| reg3.test(fromSerN) == true) {

							$scope.multiFromSerial = true;
							var dropdowns = document.getElementsByName("num");

							for (i = 0; i < dropdowns.length; i++) {
								if (dropdowns[i].type == "select-one") {
									dropdowns[i].value = "?";
									this.addController.toSN = undefined;
								}
							}
						}
					}

					$scope.complianceLevel = [ {
						"codeID" : "D",
						"compLevel" : "DEPOT"
					}, {
						"codeID" : "F",
						"compLevel" : "FIELD"
					}, {
						"codeID" : "F/D",
						"compLevel" : "FIELD REPORT"
					}, {
						"codeID" : "SPS",
						"compLevel" : "SPS CONVERSION"
					} ];

					$scope.bulletinTiming = [];
					$scope.saveDisabled = true;
					$scope.formlink = true;
					$scope.fromSN = [];
					$scope.toSN = [];
					$scope.revisions = [];
					$scope.uniqueTimingCode = [];
					$scope.uniqueRevisions = [];
					$scope.existingTimingcodeNames = [];
					$scope.timingCodesprevious = [];
					$scope.changeBulletinRevisions = function(bulletinnumber) {
						if (this.updateController.productLines != null
								&& this.updateController.bulletinTypes != null
								&& this.updateController.bulletinNumbers != null) {
							$scope.saveDisabled = false;
							$scope.checkFirstRevision = false;
							$scope.formlink = false;
							$scope.serialuri = 'http://localhost:8080//ibct/Bulletin/Serials/'
									+ this.updateController.productLines.productLine
									+ '/';
							$scope.serialuri = $scope.serialuri
									+ this.updateController.bulletinTypes.codeID
							$scope.completeSerData = [];

							$http
									.get($scope.serialuri)
									.then(
											function(response) {
												$scope.fromSN = response.data.data;
												$scope.toSN = response.data.data;

												if (bulletinnumber) {

													$http(
															{
																method : 'POST',
																url : 'http://localhost:8080//ibct/Bulletin/BulletinDetails',
																dataType : 'json',
																data : JSON
																		.stringify({
																			"bulletinNum" : bulletinnumber
																		}),
																headers : {
																	'Content-Type' : 'application/json'
																}
															})
															.success(
																	function(
																			data,
																			status,
																			headers,
																			config) {
																		$scope.revisions = data.data.revisions;
																		// console.log($scope.revisions);
																		$scope
																				.extractTimingCodes(data.data.revisions);
																		$scope
																				.makeUniqueRevisions($scope.revisions);

																		$scope
																				.disableTimingcodes($scope.revisions);

																		if ($scope.uniqueRevisions.length == 0)
																			$scope.formLink = true;
																		$scope.serialNumber = [];

																		$scope.completeSerData = data.dataMap;

																		if ($scope.uniqueRevisions.length > 1) {

																			for (i = 0; i < data.dataMap.serial.length; i++) {

																				if (data.dataMap.serial[i].toSerialNum == null) {
																					data.dataMap.serial[i].toSerialNum = "";
																				}

																				for (j = 0; j < $scope.timing.length; j++) {
																					if (data.dataMap.serial[i].timingCode == $scope.timing[j].codeID) {

																						if (($scope.uniqueRevisions[$scope.uniqueRevisions.length - 1].revisionId == data.dataMap.serial[i].revId)
																								&& data.dataMap.serial[i].revId != 0) {

																							$scope.serialNumber
																									.push({
																										fromSNum : data.dataMap.serial[i].fromSerialNum,
																										toSNum : data.dataMap.serial[i].toSerialNum,
																										timingCode : parseInt($scope.timing[j].codeName),
																										timingCodeID : data.dataMap.serial[i].timingCode,
																										complianceEndDate : new Date(
																												data.dataMap.serial[i].cmplEndDate),
																										isDisabled : false,
																										isClicked : false,
																										revisionId : data.dataMap.serial[i].revId
																									});

																						} else {
																							$scope.serialNumber
																									.push({
																										fromSNum : data.dataMap.serial[i].fromSerialNum,
																										toSNum : data.dataMap.serial[i].toSerialNum,
																										timingCode : parseInt($scope.timing[j].codeName),
																										timingCodeID : data.dataMap.serial[i].timingCode,
																										complianceEndDate : new Date(
																												data.dataMap.serial[i].cmplEndDate),
																										isDisabled : true,
																										isClicked : false,
																										revisionId : data.dataMap.serial[i].revId
																									});

																						}

																					}

																				}

																			}
																		} else {
																			console
																					.log("length1")
																			for (i = 0; i < data.dataMap.serial.length; i++) {
																				if (data.dataMap.serial[i].toSerialNum == null) {
																					data.dataMap.serial[i].toSerialNum = "";
																				}

																				for (j = 0; j < $scope.timing.length; j++) {
																					if (data.dataMap.serial[i].timingCode == $scope.timing[j].codeID) {
																						$scope.serialNumber
																								.push({
																									fromSNum : data.dataMap.serial[i].fromSerialNum,
																									toSNum : data.dataMap.serial[i].toSerialNum,
																									timingCode : parseInt($scope.timing[j].codeName),
																									timingCodeID : data.dataMap.serial[i].timingCode,
																									complianceEndDate : new Date(
																											data.dataMap.serial[i].cmplEndDate),
																									isDisabled : false,
																									isClicked : false,
																									revisionId : data.dataMap.serial[i].revId
																								});
																					}
																				}
																			}
																		}
																		for (i = 0; i < $scope.serialNumber.length; i++) {
																			// var
																			// fromSerial
																			// =
																			// $scope.serialNumber[i].fromSNum
																			for (j = i + 1; j < $scope.serialNumber.length; j++) {
																				if ($scope.serialNumber[i].revisionId == ($scope.serialNumber[j].revisionId) - 1) {
																					if ($scope.serialNumber[i].fromSNum == $scope.serialNumber[j].fromSNum) {
																						$scope.serialNumber[j].isDisabled = true;
																					}
																				}
																			}
																		}
																		// console.log($scope.serialNumber);
																		$scope.newRevLink = false;
																		$scope.updateController.newRevision = false;
																		$scope.editableRev = true;
																		$scope
																				.displayTimingCodes($scope.previoustimingCodeName);

																		if ($scope.uniqueRevisions.length == 1) {

																			$scope.checkFirstRevision = true;
																			$scope
																					.changeRevision($scope.uniqueRevisions[0])
																		}

																		else if ($scope.uniqueRevisions.length == 0) {

																			alert("There are no revisions associated with "
																					+ $scope.updateController.bulletinNumbers.bulletinNum
																					+ ",Please add new revision")

																			$scope.updateController.newRevision = true;

																		} else {
																			if ($scope.uniqueRevisions[$scope.uniqueRevisions.length - 1].revision == $scope.uniqueRevisions.length - 1) {

																				$scope.checkFirstRevision = true;
																				$scope
																						.changeRevision($scope.uniqueRevisions[$scope.uniqueRevisions.length - 1])
																			}
																		}

																	})
															.error(
																	function(
																			data,
																			status,
																			headers,
																			config) {

																	});
												}
											});

						} else {
							for (i = 0; i < $scope.timing.length; i++)
								$scope.timing[i].isdisabled = false;
							$scope.uniqueRevisions = [];
							$scope.uniqueTimingCode = [];
							$scope.formlink = true;
							$scope.saveDisabled = true;
							$scope.serialNumber = [];
							$scope.multiFromSerial = true;
							$scope.clearFormControlFields();
							$scope.fromSN = [];
							$scope.toSN = [];
							$scope.serialAddButtonLink = true;
							$scope.serialClearButtonLink = true;
							$scope.serialDeleteButtonLink = true;
							/**/
						}
						$scope.timingFlag = 0;
					}
					$scope.filterSerial = function(selectedRev) {

						return function(item) {
							if (!angular.isUndefined(item.revisionId)) {

								return item.revisionId == selectedRev
							} else {
								return true;
							}

						}

					}

					$scope.uniqueRevisions = [];
					$scope.makeUniqueRevisions = function(revisions) {
						$scope.uniqueRevisions = [];
						$scope.uniqueRevisions[0] = angular.copy(revisions[0]);
						$scope.f = 0;
						for (i = 1; i < revisions.length; i++) {
							$scope.f = 0;

							for (j = 0; j < $scope.uniqueRevisions.length; j++) {

								if ($scope.uniqueRevisions[j].revision == revisions[i].revision) {

									$scope.f = 1;
								}
							}
							if ($scope.f == 0) {

								$scope.uniqueRevisions.push(revisions[i]);
							}

						}
						$scope.uniqueRevisions.sort(dynamicSort("revision"));

					}

					$scope.disableTimingcodes = function(revisions) {
						for (i = 0; i < $scope.timing.length; i++) {
							$scope.timing[i].isdisabled = false;
						}
						$scope.bulletinTiming = [];

						for (i = 0; i < revisions.length; i++) {
							$scope.bulletinTiming.push({
								"timingCode" : revisions[i].timingCode
							});
						}

						for (i = $scope.bulletinTiming.length; i < $scope.timing.length; i++)
							$scope.bulletinTiming.push({
								"timingCode" : ""
							});

						for (i = 0; i < $scope.bulletinTiming.length; i++) {
							for (j = 0; j < $scope.timing.length; j++) {

								if ($scope.bulletinTiming[i].timingCode == $scope.timing[j].codeID) {

									$scope.timing[j].isdisabled = true;

								}

							}
						}
					}
					$scope.makeSerialUniqueByRevision = function(serialNumbers) {

					}
					$scope.displayTimingCodes = function(previoustimingCodeName) {

						$scope.uniqueTimingCode = [];
						for (i = 0; i < previoustimingCodeName.length; i++) {
							$scope.uniqueTimingCode.push({
								"timingCode" : previoustimingCodeName[i],

							});
						}

					}

					$scope.previoustimingCodeId = [];
					$scope.extractTimingCodes = function(revisions) {
						$scope.previoustimingCodeId = [];
						$scope.uniqueprevioustimingCodeId = [];

						for (i = 0; i < revisions.length; i++) {
							$scope.previoustimingCodeId
									.push(revisions[i].timingCode);
						}

						$scope.makeUnique($scope.previoustimingCodeId);
						$scope
								.gettimingCodeName($scope.uniqueprevioustimingCodeId);

					}
					$scope.uniqueprevioustimingCodeId = [];
					$scope.makeUnique = function(previoustimingCodeId) {
						$scope.uniqueprevioustimingCodeId = [];
						$scope.uniqueprevioustimingCodeId[0] = previoustimingCodeId[0];
						$scope.flag = 0;
						for (i = 1; i < previoustimingCodeId.length; i++) {
							$scope.flag = 0

							for (j = 0; j < $scope.uniqueprevioustimingCodeId.length; j++) {

								if ($scope.uniqueprevioustimingCodeId[j] == previoustimingCodeId[i]) {

									$scope.flag = 1;
								}

							}
							if ($scope.flag == 0) {
								$scope.uniqueprevioustimingCodeId
										.push(previoustimingCodeId[i])

							}
						}

					}
					$scope.previoustimingCodeName = [];
					$scope.gettimingCodeName = function(previoustimingCodeId) {
						$scope.previoustimingCodeName = [];
						for (i = 0; i < previoustimingCodeId.length; i++) {
							for (j = 0; j < $scope.timing.length; j++) {
								if (previoustimingCodeId[i] == $scope.timing[j].codeID) {
									$scope.previoustimingCodeName
											.push($scope.timing[j].codeName);
								}
							}
						}

					}
					$scope.clearSerialNo = function() {

						var dropdowns = document.getElementsByName("num");

						for (i = 0; i < dropdowns.length; i++) {
							if (dropdowns[i].type == "select-one") {
								dropdowns[i].value = "?";
							}
							if (dropdowns[i].type == "select-multiple") {
								dropdowns[i].value = [];
							}

						}
						this.updateController.fromSN = [];
						this.updateController.toSN = undefined;
						$scope.serialAddButtonLink = true;
						$scope.serialClearButtonLink = true;

					}
					$scope.bulletinTypes_availabl = [];
					$scope.bulletinTypes_available = [];
					$scope.bulletinTypes = [];
					$scope.serialDeleteButtonLink = true;
					$scope.fillBulletins = function() {

						$http
								.get(
										'http://localhost:8080//ibct/Bulletin/CodesOptions/BULLETIN_TYPE')
								.then(
										function(response) {
											$scope.bulletinTypes_availabl = response.data.data;
											$scope.bulletinTypes_available = angular
													.copy($scope.bulletinTypes_availabl);
											if ($scope.updateController.productLines != null) {
												if ($scope.updateController.productLines.productLine == "LMS100") {

													for (i = 0; i < $scope.bulletinTypes_available.length; i++) {
														if ($scope.bulletinTypes_available[i].codeName != "SYSTEM BULLETIN") {
															$scope.bulletinTypes_available
																	.splice(i,
																			2);
														}
													}
													$scope.bulletinTypes = $scope.bulletinTypes_available;

												} else {
													for (i = 0; i < $scope.bulletinTypes_available.length; i++) {
														if ($scope.bulletinTypes_available[i].codeName == "SYSTEM BULLETIN")
															$scope.bulletinTypes_available
																	.splice(i,
																			1);
													}
													$scope.bulletinTypes = $scope.bulletinTypes_available;

												}
											} else
												$scope.bulletinTypes = [];

										});

						if (this.updateController.bulletinTypes != null
								&& this.updateController.productLines != null) {

							$http(
									{
										method : 'POST',
										url : 'http://localhost:8080//ibct/Bulletin/Bulletins',
										dataType : 'json',
										data : JSON
												.stringify({
													"bulletinTypeCode" : this.updateController.bulletinTypes.codeID,
													"productLine" : this.updateController.productLines.productLine
												}),
										headers : {
											'Content-Type' : 'application/json'
										}
									})
									.success(
											function(data, status, headers,
													config) {
												$scope.bulletinNumbers = data.data;
												$scope.bulletins = data.data;
											})
									.error(
											function(data, status, headers,
													config) {
												alert('An error occurred. Please raise a request in GE ServiceNow. Please find the link at the top right corner of the page');

											});

						} else
							$scope.bulletinNumbers = [];
					}
					$scope.editableRev = true;
					$scope.makeRevEditable = function() {
						if (this.updateController.newRevision == true) {
							$scope.newRevLink = true;
							$scope.changedRevision.revision = parseInt($scope.changedRevision.revision) + 1;
							$scope.editableRev = true;
						} else {
							$scope.editableRev = true;
						}
					}
					function dynamicSort(property) {
						var sortOrder = 1;
						if (property[0] === "-") {
							sortOrder = -1;
							property = property.substr(1);
						}
						return function(a, b) {
							var result = (a[property] < b[property]) ? -1
									: (a[property] > b[property]) ? 1 : 0;
							return result * sortOrder;
						}
					}

					$scope.selectedTiming = "";
					$scope.selectedComplianceDate = $filter('date')(new Date(),
							'dd-MM-yyyy');

					$scope.timingFlag = 0;
					$scope.selectedTimingCode = function(timing) {
						$scope.timingFlag = 1;
						if (angular
								.isUndefined($scope.changedRevision.complianceEndDate)) {
							$scope.selectedComplianceDate = $filter('date')(
									new Date(), 'dd-MM-yyyy');
						} else {
							$scope.selectedComplianceDate = $filter('date')(
									$scope.changedRevision.complianceEndDate,
									'dd-MM-yyyy');
						}

						$scope.selectedTiming = timing.timingCode;
						$scope.getSelectedTimingCodeID($scope.selectedTiming);

					}
					$scope.RevisionDate = $filter('date')(Date.now(),
							'yyyy-MM-dd');
					var today = new Date();
					$scope.today = new Date();
					$scope.dateCheck = function(otherDate) {

						if (today < otherDate) {
							alert("Date cannot be more than present date")
							$scope.changedRevision.revisionDate = new Date(
									$scope.RevisionDate);

						}
					}
					$scope.SelectedTimingCodeID = "";
					$scope.getSelectedTimingCodeID = function(
							selectedTimingCodeName) {
						for (i = 0; i < $scope.timing.length; i++) {
							if (selectedTimingCodeName == $scope.timing[i].codeName) {
								$scope.SelectedTimingCodeID = $scope.timing[i].codeID;
							}
						}

					}
					$scope.successMsg;
					$scope.updateExistingBulletin = function(status) {
						$scope.bulletinValues = [];

						if (status == 'EFFECTIVE') {
							if (confirm("Are you sure you want to update the bulletin details")) {
								$scope.bulletinValues.Bulletin = this.updateController.bulletinNumbers.bulletinNum;
								$scope.bulletinValues.BulletinTypeCode = this.updateController.bulletinNumbers.bulletinTypeCode; // this.addController.bulletinTypes;
								$scope.bulletinValues.Revision = $scope.changedRevision.revision;
								$scope.bulletinValues.LatestRevision = $scope.changedRevision.revisionId;
								$scope.bulletinValues.Description = $scope.changedRevision.revisionDescription;
								$scope.bulletinValues.Category = $scope.changedRevision.category;
								$scope.bulletinValues.ComplianceLevel = $scope.changedRevision.complianceLevel;
								// $scope.bulletinValues.timing =
								// this.updateController.timingSelected;
								$scope.bulletinValues.timing = [];
								for (i = 0; i < $scope.revisions.length; i++) {
									$scope.bulletinValues.timing
											.push($scope.revisions[i].timingCode);
								}

								$scope.bulletinValues.RevDate = $filter('date')
										($scope.changedRevision.revisionDate,
												'MM/dd/yyyy'); // $scope.changedRevision.revisionDate.getDate();

								$scope.bulletinValues.status = status;

								$scope.bulletinValues.serialNumbers = $scope.serialNumber;
								$scope.bulletinValues.Deleted = $scope.deleteSerial;
								$scope.bulletinValues.Remarks = $scope.changedRevision.remarks;
								$scope.bulletinValues.ProductLine = this.updateController.productLines.productLine;

								if (angular
										.isUndefined(this.updateController.newRevision)) {
									$scope.bulletinValues.newRevision = false;
								} else {

									$scope.bulletinValues.newRevision = this.updateController.newRevision;

								}

								$http(
										{
											method : 'POST',
											url : 'http://localhost:8080//ibct/Bulletin/Update',
											dataType : 'json',
											data : JSON
													.stringify({
														"category" : $scope.bulletinValues.Category,
														"bulletinNum" : $scope.bulletinValues.Bulletin,
														"complianceLevel" : $scope.bulletinValues.ComplianceLevel,
														// "trackImplimentationPlan"
														// :
														// $scope.bulletinValues.TrackImplementationPlan,
														// "significant" :
														// $scope.bulletinValues.Significant,
														// "voucherProgram" :
														// $scope.bulletinValues.VoucherProgram,
														"remarks" : $scope.bulletinValues.Remarks,
														"bulletinTypeCode" : $scope.bulletinValues.BulletinTypeCode,
														"latestRevId" : $scope.bulletinValues.Revision,
														"productLine" : $scope.bulletinValues.ProductLine,
														"description" : $scope.bulletinValues.Description,
														"revision" : $scope.bulletinValues.Revision,
														"createdBy" : "jai",
														// "fromserials" :
														// $scope.bulletinValues.fromSerials,
														// "toserials" :
														// $scope.bulletinValues.toSerials,
														// "fieldImplementationMetric"
														// :
														// $scope.bulletinValues.fieldImplementationMetric,
														"revisionDate" : $scope.bulletinValues.RevDate,
														// "timings" :
														// $scope.bulletinValues.timing,
														"newRevision" : $scope.bulletinValues.newRevision,
														// "latestRevId" :
														// $scope.bulletinValues.LatestRevision,
														"bulletinStatus" : $scope.bulletinValues.status,
														"deletedSerial" : $scope.bulletinValues.Deleted,
														"serialNumber" : $scope.bulletinValues.serialNumbers,
														"lastUpdatedBy" : "jai"
													}),
											headers : {
												'Content-Type' : 'application/json'
											}
										})
										.success(
												function(data, status, headers,
														config) {

													if (data.statusMessage == "error") {
														alert("Duplicate Bulletin number")
													} else if (data.statusMessage == "fail") {
														alert("Failed to update");
														// console.log(data.errorMsg);

													} else if (data.statusMessage == "otherError") {
														alert('There is an error,Please contact your administrator');
													}

													else {

														// alert('Selected
														// bulletin with new
														// details updated
														// successfully');
														// $window.location.href
														// = '#UpdateBulletin'
														$scope.successMsg = "Selected bulletin with new details updated successfully";
														$(document)
																.scrollTop(0);
														/* $scope.clearFormControlFields(); */

													}

												}).error(
												function(data, status, headers,
														config) {

												});

							}
						} else {
							alert("The selected bulletin is in INEFFECTIVE state, it cannot be updated");
							/* $window.location.href = '#UpdateBulletin' */
						}
					}
					$scope.newRevLink = false;
					$scope.serialNumber = [];
					$scope.timingBasedSN = [];
					var reg = new RegExp('^[0-9]*$');
					var reg1 = new RegExp('^[A-Z]+[0-9]*');
					var reg2 = new RegExp('^[0-9]*-[0-9]*$');
					var reg3 = new RegExp('^[0-9]+[A-Z]+');
					var reg4= /[A-Z]+/;
					/*
					 * $scope.validateOverlap = function(fromSerN, toSNum) {
					 * 
					 * if ($scope.serialNumber.length != 0) { for (var i = 0; i <
					 * $scope.serialNumber.length; i++) { if
					 * ($scope.serialNumber[i].fromSNum <= fromSerN ||
					 * $scope.serialNumber[i].toSNum <= toSNum) { return true; } } }
					 * else { return false; } }
					 */

					$scope.serialFlagToEnter = true;
					$scope.mismatchFlag=true;
					/*
					 * Finding Duplicates Shridhar Sangamkar 460711
					 */
					$scope.timingSelected = [];
					$scope.checkMe = function(fromSerN, toSerN,selectedTiming) {
						//console.log(toSerN);

						j = 0;
						for (i = 0; i < $scope.serialNumber.length; i++) {
							if ($scope.serialNumber[i].timingCode == selectedTiming) {
								$scope.timingBasedSN[j] = angular
										.copy($scope.serialNumber[i]);
								// console.log($scope.serialNumber[i].timingCode);
								j++;
							}

						}

						if ($scope.timingBasedSN.length != 0) {
							if (!angular.isUndefined(toSerN)) {

								if (reg.test(fromSerN[0]) == true
										&& reg.test(toSerN) == true) {
									for (i = 0; i < $scope.timingBasedSN.length; i++) {
										// if($scope.fromLength==$scope.timingBasedSN[i].fromSNum.length&&$scope.toLength==$scope.timingBasedSN[i].fromSNum.length
										// ){*/
										if ((parseInt(fromSerN) >= parseInt($scope.timingBasedSN[i].fromSNum) && parseInt(fromSerN) <= parseInt($scope.timingBasedSN[i].toSNum))
												|| ((parseInt(fromSerN) <= parseInt($scope.timingBasedSN[i].fromSNum)) && ((parseInt(toSerN) >= parseInt($scope.timingBasedSN[i].fromSNum))))) {
											//console.log("1");
											$scope.serialFlagToEnter = false;

										} else if ((parseInt(toSerN) <= parseInt($scope.timingBasedSN[i].toSNum) && parseInt(toSerN) >= parseInt($scope.timingBasedSN[i].fromSNum))
										/*
										 * || (parseInt(toSerN) <=
										 * parseInt($scope.timingBasedSN[i].fromSNum))
										 */) {
										//	console.log("2");
											$scope.serialFlagToEnter = false;
										} else {

										}
										/*
										 * } else{ $scope.flag=false;
										 * alert("Type Mismatch")
										 * console.log("6"); }
										 */
									}
								} else if (reg1.test(fromSerN[0]) == true
										&& reg1.test(toSerN) == true) {
									var str1=fromSerN[0].match(reg4);
									var str2=toSerN.match(reg4);
									if(str1[0]==str2[0]){
										//console.log("matched");
									for (i = 0; i < $scope.timingBasedSN.length; i++) {
										if(reg1.test($scope.serialNumber[i].fromSNum) == true){
											if($scope.serialNumber[i].fromSNum.match(reg4)[0]==fromSerN[0].match(reg4)[0]){
										if ((fromSerN[0] >= $scope.timingBasedSN[i].fromSNum && fromSerN <= $scope.timingBasedSN[i].toSNum)
												|| (fromSerN[0] <= $scope.timingBasedSN[i].fromSNum)) {
											//console.log("3");
											$scope.serialFlagToEnter= false;
										} else if ((toSerN <= $scope.timingBasedSN[i].toSNum && toSerN <= $scope.timingBasedSN[i].fromSNum)
												|| (toSerN <= $scope.timingBasedSN[i].toSNum)) {
											//console.log("4");
											$scope.serialFlagToEnter = false;
										} else {

										}
										}
									}
									}
								}
									else{
										
										$scope.mismatchFlag=false;
										alert("Type Mismatch")
									}

								}

							} else if (angular.isUndefined(toSerN)) {
							//	console.log($scope.serialFlagToEnter);
								//console.log("8" + reg1.test(fromSerN[0])+ reg.test(fromSerN[0]));
								for (j = 0; j < fromSerN.length; j++) {
									if ((reg1.test(fromSerN[j]) == true)) {
										var str1=fromSerN[j].match(reg4);
										for (i = 0; i < $scope.timingBasedSN.length; i++) {
											if ((reg1.test($scope.timingBasedSN[i].fromSNum) == true)) {
												if(str1[0]==$scope.serialNumber[i].fromSNum.match(reg4)[0]){
												if (fromSerN[j] >= $scope.timingBasedSN[i].fromSNum
														&& fromSerN[j] <= $scope.timingBasedSN[i].toSNum) {
													$scope.serialFlagToEnter = false;
												//	console.log("5");
												} else if ($scope.timingBasedSN[i].toSNum == "") {
													/*console
															.log((fromSerN[j])
																	+ ","
																	+ ($scope.timingBasedSN[i].fromSNum))*/
													if ((fromSerN[j]) == ($scope.timingBasedSN[i].fromSNum)) {

														$scope.serialFlagToEnter = false;
													//	console.log("13");
													}
												}
											}
											}
										}
									} else if ((reg.test(fromSerN[j]) == true)) {
									//	console.log($scope.serialFlagToEnter);
										//console.log("12: "+ $scope.timingBasedSN.length);
										for (i = 0; i < $scope.timingBasedSN.length; i++) {
											//console.log($scope.timingBasedSN[i].toSNum)
										//	console.log($scope.timingBasedSN[i].toSNum == "");
											if (parseInt(fromSerN[j]) >= parseInt($scope.timingBasedSN[i].fromSNum)
													&& parseInt(fromSerN[j]) <= parseInt($scope.timingBasedSN[i].toSNum)) {
												$scope.serialFlagToEnter = false;
												//console.log("6");
											} else if ($scope.timingBasedSN[i].toSNum == "") {
												
											/*	console
														.log(parseInt(fromSerN[j])
																+ ","
																+ parseInt($scope.timingBasedSN[i].fromSNum))
																		console.log($scope.serialFlagToEnter);*/
												if (parseInt(fromSerN[j]) == parseInt($scope.timingBasedSN[i].fromSNum)) {

													$scope.serialFlagToEnter = false;
													//console.log("7");
												}
											}
										}
									} else if ((reg2.test(fromSerN[j]) == true)) {
										for (i = 0; i < $scope.timingBasedSN.length; i++) {
											if (reg2
													.test($scope.timingBasedSN[i].fromSNum)) {

												if (fromSerN[j] == $scope.timingBasedSN[i].fromSNum) {
													$scope.serialFlagToEnter = false;
												//	console.log("15");
												}
												/*
												 * else
												 * if($scope.serialNumber[i].toSNum==""){
												 * console.log((fromSerN[j])+","+($scope.serialNumber[i].fromSNum))
												 * if((fromSerN[j])==($scope.serialNumber[i].fromSNum)){
												 * 
												 * $scope.flag = false;
												 * console.log("16"); } }
												 */

											}
										}
									} else if ((reg3.test(fromSerN[j]) == true)) {
										for (i = 0; i < $scope.timingBasedSN.length; i++) {
											if (reg3
													.test($scope.timingBasedSN[i].fromSNum)) {

												if (fromSerN[j] == $scope.timingBasedSN[i].fromSNum) {
													$scope.serialFlagToEnter = false;
												//	console.log("17");
												}
												/*
												 * else
												 * if($scope.serialNumber[i].toSNum==""){
												 * console.log((fromSerN[j])+","+($scope.serialNumber[i].fromSNum))
												 * if((fromSerN[j])==($scope.serialNumber[i].fromSNum)){
												 * 
												 * $scope.flag = false;
												 * console.log("16"); } }
												 */

											}
										}
									}

								}
							}
						}
						$scope.timingBasedSN=[];
					}

					/*
					 * Finding Duplicates Shridhar Sangamkar 460711
					 */

					$scope.addSN = function(fromSerN, toSerN) {
						/* *******Overlapping Serial Number Validation****** */
						$scope.checkMe(fromSerN, toSerN,$scope.selectedTiming);

					
					//	console.log($scope.timingFlag == 1);
					//	console.log($scope.serialFlagToEnter == true);
							if ($scope.serialFlagToEnter == true && $scope.timingFlag == 1) {
								//console.log("10");
								if ((fromSerN.length == 1)
										&& angular.isUndefined(toSerN)) {
									//console.log("11" + reg.test(fromSerN[0]));
									if (reg1.test(fromSerN[0]) == true
											|| reg.test(fromSerN[0]) == true
											|| reg2.test(fromSerN[0]) == true
											|| reg3.test(fromSerN[0]) == true) {
										//console.log("9");
										/*for (i = 0; i < $scope.timingSelected.length; i++) {
											$scope.serialNumber
													.push({
														timing : $scope.timingSelected[i],
														timingcodeID : $scope.timingSelectedcodeId[i],
														fromSNum : fromSerN[0],
														toSNum : "",
														isClicked : false
													});
										}*/
										$scope.serialNumber
										.push({
											timingCode : $scope.selectedTiming,
											timingCodeID : $scope.SelectedTimingCodeID,
											complianceEndDate : $scope.selectedComplianceDate,
											fromSNum : fromSerN[0],
											toSNum : "",
											isClicked : false
										});
									}
								}

								if ((fromSerN.length == 1) && toSerN) {

									if (reg.test(fromSerN[0]) == true
											&& reg.test(toSerN) == true) {

										if (parseInt(fromSerN[0]) >= parseInt(toSerN)) {

											alert("From Serial Number should not be greater than To Serial Number")
										} else {
/*											for (i = 0; i < $scope.timingSelected.length; i++) {
												$scope.serialNumber
														.push({
															timing : $scope.timingSelected[i],
															timingcodeID : $scope.timingSelectedcodeId[i],
															fromSNum : fromSerN[0],
															toSNum : toSerN,
															isClicked : false
														});

											}*/
											$scope.serialNumber
											.push({
												timingCode : $scope.selectedTiming,
												timingCodeID : $scope.SelectedTimingCodeID,
												complianceEndDate : $scope.selectedComplianceDate,
												fromSNum : fromSerN[0],
												toSNum : toSerN,
												isClicked : false
											});
										}

									} else if ((reg.test(fromSerN[0]) == false && reg
											.test(toSerN) == true)) {
										alert("Type Mismatch")
									} else if (reg.test(fromSerN[0]) == true
											&& reg.test(toSerN) == false) {
										alert("Type Mismatch")
									} else if ((reg1.test(fromSerN[0]) == false && reg1
											.test(toSerN) == true)) {
										alert("Type Mismatch")
									} else if (reg1.test(fromSerN[0]) == true
											&& reg1.test(toSerN) == false) {
										alert("Type Mismatch")
									} else if ((reg2.test(fromSerN[0]) == false && reg2
											.test(toSerN) == true)) {
										alert("Type Mismatch")
									} else if (reg2.test(fromSerN[0]) == true
											&& reg2.test(toSerN) == false) {
										alert("Type Mismatch")
									} else if (reg.test(fromSerN[0]) == false
											&& reg.test(toSerN) == false) {
										if(fromSerN[0].match(reg4)[0]==toSerN[0].match(reg4)[0]){
										if (fromSerN[0] >= (toSerN)&& $scope.mismatchFlag==true) {
											alert("From Serial Number should not be greater than To Serial Number")
										} }else {
									//		console.log("14");
											if($scope.mismatchFlag==true){
												$scope.serialNumber
														.push({
															timingCode : $scope.selectedTiming,
															timingCodeID : $scope.SelectedTimingCodeID,
															complianceEndDate : $scope.selectedComplianceDate,
															fromSNum : fromSerN[0],
															toSNum : toSerN,
															isClicked : false
														});

											}
											else {$scope.mismatchFlag=true;}
										}
									}

								} else if (fromSerN.length > 1) {

									for (i = 0; i < fromSerN.length; i++) {
									
											$scope.serialNumber
													.push({
														timingCode : $scope.selectedTiming,
														timingCodeID : $scope.SelectedTimingCodeID,
														complianceEndDate : $scope.selectedComplianceDate,
														fromSNum : fromSerN[i],
														toSNum : "",
														isClicked : false
													});
										
									}

								}

							} 
							else {
								if ($scope.timingFlag == 0) {
									alert("Please select timing code")
								} 
								else {
									alert("The Selected range is overlapping the existing serial numbers range.");

								}
							}
							$scope.clearSerialNo();
						 

						if ($scope.serialNumber.length > 0) {
							$scope.editableMultipleTiming = true;
						}
						$scope.serialFlagToEnter = true;
						$scope.mismatchFlag=true;

					}
					$scope.temp = [];
					$scope.deleteSerial = [];
					/*
					 * $scope.removeItem = function(index) {
					 * $scope.serialNumber.splice(index, 1); }
					 */
					$scope.chckedIndexs = [];

					$scope.checkedIndex = function(item) {
						if (($scope.chckedIndexs.indexOf(item)) === -1) {
							$scope.chckedIndexs.push(item);
						} else {
							$scope.chckedIndexs.splice($scope.chckedIndexs
									.indexOf(item), 1);

						}
						if ($scope.chckedIndexs.length > 0) {
							$scope.serialDeleteButtonLink = false;
						} else {
							$scope.serialDeleteButtonLink = true;
						}
					}

					/* Adding deleted Items to object $scope.deleteSerial */
					$scope.trackDeletion = function(temp) {

						for (j = 0; j < temp.length; j++) {
							for (i = 0; i < $scope.completeSerData.serial.length; i++) {
								if ($scope.completeSerData.serial[i].fromSerialNum == temp[j].fromSNum) {
									if ($scope.completeSerData.serial[i].revId == temp[j].revisionId) {
										$scope.deleteSerial
												.push({
													fromSerialNum : $scope.completeSerData.serial[i].fromSerialNum,
													revId : $scope.completeSerData.serial[i].revId,
													timingCode : $scope.completeSerData.serial[i].timingCode,
													bulletinNum : $scope.completeSerData.serial[i].bulletinNum
												});
									}
								} else {

								}
							}
						}

					}
					/* Adding deleted Items to object $scope.deleteSerial */

					$scope.removeItem = function(index) {
						if ($scope.chckedIndexs.length > 0) {
							angular.forEach($scope.chckedIndexs, function(
									value, index) {

								index = $scope.serialNumber.indexOf(value);
								$scope.serialNumber.splice($scope.serialNumber
										.indexOf(value), 1);
								$scope.temp = $scope.chckedIndexs;
							})
							$scope.chckedIndexs = [];
						}
						$scope.serialDeleteButtonLink = true;
						$scope.trackDeletion($scope.temp);
					};
					function getBulletinTypeCode(bulletintype) {
						if (bulletintype == "PRODUCT BULLETIN") {
							return 20000043;
						} else if (bulletintype == "SERVICE BULLETIN") {
							return 20000042;
						} else if (bulletintype == "SYSTEM BULLETIN") {
							return 2726;
						} else {
							return 0;
						}
					}

					function getDescriptionFromCode(revision) {
						$scope.local = '';
						$http
								.get(
										'http://localhost:8080//ibct/Bulletin/Codes/'
												+ revision.categoryCode)
								.then(
										function(response) {

											$scope.local = response.data.data.codeDescription;
										});
						return $scope.local;
					}
					function getFields(input, field) {
						return input.map(function(o) {
							return o[field];
						});
					}
					$scope.selectedRev;
					$scope.changeRevision = function(changedRevision) {

						$scope.selectedRev = changedRevision.revision;
						if ($scope.uniqueRevisions.length > 1) {
							if (changedRevision.revision < $scope.uniqueRevisions[$scope.uniqueRevisions.length - 1].revision) {
								$scope.newRevLink = true;
								$scope.formlink = true;
							} else {
								$scope.formlink = false;
								$scope.newRevLink = false;
							}
						}
						$scope.changedRevision = changedRevision;

						$scope.changedRevision.revision = $scope.changedRevision.revision;
						if ($scope.changedRevision.remarks != null) {
							$scope.changedRevision.remarks.remarks = $scope.changedRevision.remarks;
						}

						$scope.changedRevision.revisionDate = new Date(
								$scope.changedRevision.revisionDate);

					}

					$scope.clearFormControlFields = function() {
						var elements = document.getElementsByTagName("input");
						var dropdowns = document.getElementsByTagName("select");
						var textboxes = document
								.getElementsByTagName("textarea");
						var i = 0
						for (i = 0; i < elements.length; i++) {
							if (elements[i].type == "text") {
								elements[i].value = "";
							}
							if (elements[i].type == "checkbox") {
								elements[i].checked = elements[i].defaultChecked;
							}
							if (elements[i].type == "date") {
								elements[i].value = "";
							}

						}
						for (i = 0; i < dropdowns.length; i++) {
							if (dropdowns[i].type == "select-one") {
								if (dropdowns[i].id != "disabledSelect")
									dropdowns[i].value = "";
							}
							if (dropdowns[i].type == "select-multiple") {
								dropdowns[i].value = [];
							}

						}
						for (i = 0; i < textboxes.length; i++) {
							if (textboxes[i].type == "textarea") {
								textboxes[i].value = "";
							}
						}
						/*
						 * $scope.uniqueRevisions = []; $scope.uniqueTimingCode =
						 * []; $scope.formlink = true; $scope.saveDisabled =
						 * true; $scope.serialNumber = [];
						 * $scope.multiFromSerial = true;
						 * $scope.clearFormControlFields(); $scope.fromSN = [];
						 * $scope.toSN = []; $scope.newRevLink=true;
						 * $scope.serialAddButtonLink = true;
						 * $scope.serialClearButtonLink = true;
						 * $scope.serialDeleteButtonLink = true; for (i = 0; i <
						 * $scope.timing.length; i++)
						 * $scope.timing[i].isdisabled = false
						 */;
					}

				});
/*******************************************************************************
 * ******************CANCEL CONTROLLER *******************************
 * 
 * @author: jeevan-475852,@author: Arka-460545 20-DEC-2016
 ******************************************************************************/

app
		.controller(
				'cancelController',
				function($scope, $http, $window) {
					// $scope.productLine = [];
					$scope.productLines = [];
					$scope.bulletinTypes = [];

					$http.get('http://localhost:8080//ibct/Product').then(
							function(response) {

								$scope.productLines = response.data.data;

							});

					$scope.cancelButtonLink = true;
					$scope.enableButtonLink = function() {
						if (this.cancelController.bulletinNumbers != null) {
							if (this.cancelController.bulletinNumbers.bulletinStatus == 'EFFECTIVE') {
								$scope.cancelButtonLink = false;
							} else
								$scope.cancelButtonLink = true;
						} else
							$scope.cancelButtonLink = true;
					}

					$scope.bulletinTypes_available = [];
					$scope.fillBulletins = function() {

						$http
								.get(
										'http://localhost:8080//ibct/Bulletin/BulletinTypes')
								.then(
										function(response) {

											$scope.bulletinTypes_available = response.data.data;
											if ($scope.cancelController.productLines != null) {
												if ($scope.cancelController.productLines.productLine == "LMS100") {
													$scope.bulletinTypes = [ 'SYSTEM BULLETIN' ];
												} else {

													for (i = 0; i < $scope.bulletinTypes_available.length; i++) {

														if ($scope.bulletinTypes_available[i] != "SYSTEM BULLETIN") {

															$scope.bulletinTypes[i] = $scope.bulletinTypes_available[i];

														}

													}

												}

											} else {
												$scope.bulletinNumbers = [];
											}
										});

						if (this.cancelController.bulletinTypes != null
								&& this.cancelController.productLines != null) {

							$http(
									{
										method : 'POST',
										url : 'http://localhost:8080//ibct/Bulletin/Bulletins',
										dataType : 'json',
										data : JSON
												.stringify({
													"bulletinTypeCode" : getBulletinTypeCode(this.cancelController.bulletinTypes),
													"productLine" : this.cancelController.productLines.productLine
												}),
										headers : {
											'Content-Type' : 'application/json'
										}
									})
									.success(
											function(data, status, headers,
													config) {
												// this callback will be called
												// asynchronously
												// when the response is
												// available
												$scope.bulletinNumbers = data.data;
												$scope.bulletins = data.data;
											})
									.error(
											function(data, status, headers,
													config) {
												// called asynchronously if an
												// error
												// occurs
												// or server returns response
												// with an
												// error
												// status.
												alert('An error has occurred while Cancelling the selected bulletin. Please try again later');

											});
						} else
							$scope.bulletinNumbers = [];

					}
					$scope.cancelBulletin = function(status) {
						if (confirm("Are you sure you want to Cancel the selected Bulletin")) {
							if (this.cancelController.bulletinNumbers.bulletinStatus == 'EFFECTIVE') {

								$http(
										{
											method : 'POST',
											url : 'http://localhost:8080//ibct/Bulletin/CancelBulletin',
											dataType : 'json',
											data : JSON
													.stringify({
														"bulletinNum" : this.cancelController.bulletinNumbers.bulletinNum
													}),
											headers : {
												'Content-Type' : 'application/json'
											}
										})
										.success(
												function(data, status, headers,
														config) {
													// this callback will be
													// called
													// asynchronously
													// when the response is
													// available
													$scope.fillBulletins();
													alert("The Selected Bulletin has been Cancelled and the status changed to INEFFECTIVE")
													$window.location.href = '#welcome'
												})
										.error(
												function(data, status, headers,
														config) {
													// called asynchronously if
													// an error
													// occurs
													// or server returns
													// response with an
													// error
													// status.

													alert("An error has occurred while Cancelling the selected bulletin, Please try after some time")
												});
							}
						}
					}

					function getBulletinTypeCode(bulletintype) {
						if (bulletintype == "PRODUCT BULLETIN") {
							return 20000043;
						} else if (bulletintype == "SERVICE BULLETIN") {
							return 20000042;
						} else if (bulletintype == "SYSTEM BULLETIN") {
							return 2726;
						} else {
							return 0;
						}
					}

				});
/*******************************************************************************
 * ******************NUMBER CONTROLLER *******************************
 * 
 * @author: jeevan-475852,@author: Arka-460545 20--2017
 ******************************************************************************/
app
		.controller(
				'numberController',
				function($scope, $http, $window, exportToCSV) {
					$http.get('http://localhost:8080//ibct/Product').then(
							function(response) {

								$scope.productLines = response.data.data;

							});
					$scope.timing = [];
					$http
							.get(
									'http://localhost:8080//ibct/Bulletin/CodesOptions/TIMING_CODE')
							.then(function(response) {

								$scope.timing = response.data.data;
							});
					$http
							.get(
									'http://localhost:8080//ibct/Bulletin/CodesOptions/BULLETIN_CATEGORY')
							.then(function(response) {

								$scope.bulletinCategory = response.data.data;

							});
					$scope.bulletinCategory = [];
					$scope.currentPage = 1;
					$scope.pageSize = 10;
					$scope.disableExport = true;
					$scope.fillBulletins = function() {

						$http
								.get(
										'http://localhost:8080//ibct/Bulletin/CodesOptions/BULLETIN_TYPE')
								.then(
										function(response) {
											$scope.bulletinTypes_availabl = response.data.data;
											$scope.bulletinTypes_available = angular
													.copy($scope.bulletinTypes_availabl);
											if ($scope.numberController.productLines != null) {
												if ($scope.numberController.productLines.productLine == "LMS100") {

													for (i = 0; i < $scope.bulletinTypes_available.length; i++) {
														if ($scope.bulletinTypes_available[i].codeName != "SYSTEM BULLETIN") {
															$scope.bulletinTypes_available
																	.splice(i,
																			2);
														}
													}
													$scope.bulletinTypes = $scope.bulletinTypes_available;

												} else {
													for (i = 0; i < $scope.bulletinTypes_available.length; i++) {
														if ($scope.bulletinTypes_available[i].codeName == "SYSTEM BULLETIN")
															$scope.bulletinTypes_available
																	.splice(i,
																			1);
													}
													$scope.bulletinTypes = $scope.bulletinTypes_available;

												}
											} else
												$scope.bulletinTypes = [];

										});

						if (this.numberController.bulletinTypes != null
								&& this.numberController.productLines != null) {

							$http(
									{
										method : 'POST',
										url : 'http://localhost:8080//ibct/Bulletin/Bulletins',
										dataType : 'json',
										data : JSON
												.stringify({
													"bulletinTypeCode" : this.numberController.bulletinTypes.codeID,
													"productLine" : this.numberController.productLines.productLine
												}),
										headers : {
											'Content-Type' : 'application/json'
										}
									})
									.success(
											function(data, status, headers,
													config) {
												$scope.bulletinNumbers = data.data;
												$scope.bulletins = data.data;
											})
									.error(
											function(data, status, headers,
													config) {
												alert('An error occurred. Please raise a request in GE ServiceNow. Please find the link at the top right corner of the page');

											});

						} else
							$scope.bulletinNumbers = [];
					}
					$scope.complianceLevel = [ {
						"codeID" : "D",
						"compLevel" : "DEPOT"
					}, {
						"codeID" : "F",
						"compLevel" : "FIELD"
					}, {
						"codeID" : "F/D",
						"compLevel" : "FIELD REPORT"
					}, {
						"codeID" : "SPS",
						"compLevel" : "SPS CONVERSION"
					} ];
					$scope.complainceNumber = [];
					$scope.complianceToPrint = [];
					$scope.complainceNumberDetails = [];
					$scope.changeBulletinRevisions = function(bulletinnumber) {
						if (this.numberController.productLines != null
								&& this.numberController.bulletinTypes != null
								&& this.numberController.bulletinNumbers != null) {
							$http(
									{
										method : 'POST',
										url : 'http://localhost:8080//ibct/ComplianceByNumberDetails',
										dataType : 'json',
										data : JSON.stringify({

											"bulletinNum" : bulletinnumber
										}),
										headers : {
											'Content-Type' : 'application/json'
										}
									})
									.success(
											function(data, status, headers,
													config) {
												$scope.complainceNumberDetails = data.data;

												for (i = 0; i < $scope.complainceNumberDetails.length; i++) {
													for (j = 0; j < $scope.bulletinCategory.length; j++) {
														if ($scope.complainceNumberDetails[i].categoryCode == $scope.bulletinCategory[j].codeID)
															$scope.complainceNumberDetails[i].categoryCode = $scope.bulletinCategory[j].codeName;
													}
												}
												for (i = 0; i < $scope.complainceNumberDetails.length; i++) {
													for (j = 0; j < $scope.timing.length; j++) {
														if ($scope.complainceNumberDetails[i].timingCode == $scope.timing[j].codeID)
															$scope.complainceNumberDetails[i].timingCode = $scope.timing[j].codeName;
													}
												}
												for (i = 0; i < $scope.complainceNumberDetails.length; i++) {
													for (j = 0; j < $scope.complianceLevel.length; j++) {
														if ($scope.complainceNumberDetails[i].complianceLevel == $scope.complianceLevel[j].codeID) {
															$scope.complainceNumberDetails[i].complianceLevel = $scope.complianceLevel[j].compLevel;
														}
													}
												}
											}).error(
											function(data, status, headers,
													config) {
												// console.log("failed")

											});

							$http(
									{
										method : 'POST',
										url : 'http://localhost:8080//ibct/ComplianceByNumber',
										dataType : 'json',
										data : JSON
												.stringify({
													"productLine" : this.numberController.productLines.productLine,
													"bulletinTypeCode" : this.numberController.bulletinTypes.codeID,
													"bulletinNum" : bulletinnumber
												}),
										headers : {
											'Content-Type' : 'application/json'
										}
									})
									.success(
											function(data, status, headers,
													config) {
												$scope.complainceNumber = data.data;
												for (var i = 0; i < $scope.complainceNumber.length; i++) {
													$scope.complianceToPrint
															.push({
																"Product Serial#" : $scope.complainceNumber[i].productSerialNum,
																"Compliance Date" : $scope.complainceNumber[i].compliedDate,
																"Target Compliance Date" : $scope.complainceNumber[i].targetComplianceDate
															})
												}
												if ($scope.complainceNumber.length > 0)
													$scope.disableExport = false;
												else
													$scope.disableExport = true;

											}).error(
											function(data, status, headers,
													config) {
												// console.log("failed")

											});
						} else {
							$scope.complainceNumber = [];
							$scope.disableExport = true;
							$scope.complainceNumberDetails = []
						}
					}
					$scope.export = function() {
						$scope.productData = [];
						$scope.filename = "BulletinComplianceByNumber";
						if ($scope.complainceNumberDetails.length > 0) {
							$scope.productData
									.push({
										"Bulletin#" : this.numberController.bulletinNumbers.bulletinNum,
										"Product Line" : this.numberController.productLines.productLine,
										"Title" : $scope.complainceNumberDetails[0].bulletinDesc,
										"Category" : $scope.complainceNumberDetails[0].categoryCode,
										"Significant" : $scope.complainceNumberDetails[0].significantInd,
										"Timing" : $scope.complainceNumberDetails[0].timingCode,
										"Voucher Program" : $scope.complainceNumberDetails[0].voucherProgramInd,
										"Compliance Level" : $scope.complainceNumberDetails[0].complianceLevel,
										"Field Implementation Metric" : $scope.complainceNumberDetails[0].fieldImplMetricInd
									})
						} else {
							$scope.productData
									.push({
										"Bulletin#" : this.numberController.bulletinNumbers.bulletinNum,
										"Product Line" : this.numberController.productLines.productLine,
										"Title" : "",
										"Category" : "",
										"Significant" : "",
										"Timing" : "",
										"Voucher Program" : "",
										"Compliance Level" : "",
										"Field Implementation Metric" : ""
									})
						}
						exportToCSV.JSONToCSV(angular
								.toJson($scope.complianceToPrint), true,
								$scope.filename, $scope.productData);
					}
					$scope.closeNumberController = function() {
						$window.location.href = "#welcome";
					}

				});
/*******************************************************************************
 * ******************ADD SERIAL CONTROLLER *******************************
 * 
 * @author: jeevan-475852,@author: Arka-460545 05-FEB-2017
 ******************************************************************************/
app
		.controller(
				'addSerialController',
				function($scope, $http, $filter) {

					$http.get('http://localhost:8080//ibct/Product').then(
							function(response) {
								$scope.productLines = response.data.data;

							});

					$http
							.get(
									'http://localhost:8080//ibct/Bulletin/CodesOptions/BULLETIN_TYPE')
							.then(function(response) {
								$scope.bulletinTypes = response.data.data;
							});
					$scope.timing = [];
					$http
							.get(
									'http://localhost:8080//ibct/Bulletin/CodesOptions/TIMING_CODE')
							.then(function(response) {

								$scope.timing = response.data.data;
								// console.log($scope.timing)

							});
					$scope.IssueDate = $filter('date')
							(Date.now(), 'yyyy-MM-dd');
					$scope.previoustimingCodeName = [];
					$scope.gettimingCodeName = function(previoustimingCodeId) {
						$scope.previoustimingCodeName = [];
						for (i = 0; i < previoustimingCodeId.length; i++) {
							for (j = 0; j < $scope.timing.length; j++) {
								if (previoustimingCodeId[i] == $scope.timing[j].codeID) {
									$scope.previoustimingCodeName
											.push({
												"timingCodeName" : $scope.timing[j].codeName,
												"timingCodeDesc" : $scope.timing[j].codeDescription
											});
								}
							}
						}

					}
					$scope.previoustimingCodeId = [];
					$scope.extractTimingCodes = function(revisions) {
						$scope.previoustimingCodeId = [];
						$scope.uniqueprevioustimingCodeId = [];

						for (i = 0; i < revisions.length; i++) {
							$scope.previoustimingCodeId
									.push(revisions[i].timingCode);
						}

						$scope.makeUnique($scope.previoustimingCodeId);
						$scope
								.gettimingCodeName($scope.uniqueprevioustimingCodeId);

					}
					$scope.changeBulletinSerials = function() {
						if (this.addSerialController.productLines != null
								&& this.addSerialController.bulletinTypes != null
								&& this.addSerialController.bulletinNumbers != null) {

							$scope.serialuri = 'http://localhost:8080//ibct/Bulletin/Serials/'
									+ this.addSerialController.productLines.productLine
									+ '/';
							$scope.serialuri = $scope.serialuri
									+ this.addSerialController.bulletinTypes.codeID;

							if (this.addSerialController.bulletinNumbers.bulletinNum) {

								$http(
										{
											method : 'POST',
											url : 'http://localhost:8080//ibct/Bulletin/BulletinDetails',
											dataType : 'json',
											data : JSON
													.stringify({
														"bulletinNum" : this.addSerialController.bulletinNumbers.bulletinNum
													}),
											headers : {
												'Content-Type' : 'application/json'
											}
										})
										.success(
												function(data, status, headers,
														config) {
													$scope.revisions = data.data.revisions;
													$scope
															.makeUniqueRevisions($scope.revisions);
													$scope
															.extractTimingCodes(data.data.revisions);
													$scope.completeSerData = data.dataMap;
													for (i = 0; i < data.dataMap.serial.length; i++) {

														if (data.dataMap.serial[i].toSerialNum == null) {
															data.dataMap.serial[i].toSerialNum = "";
														}

														for (j = 0; j < $scope.timing.length; j++) {
															if (data.dataMap.serial[i].timingCode == $scope.timing[j].codeID) {

																if (($scope.uniqueRevisions[$scope.uniqueRevisions.length - 1].revisionId == data.dataMap.serial[i].revId)
																		&& data.dataMap.serial[i].revId != 0) {
																	$scope.serialNumber
																			.push({
																				fromSNum : data.dataMap.serial[i].fromSerialNum,
																				toSNum : data.dataMap.serial[i].toSerialNum,
																				timingCode : parseInt($scope.timing[j].codeName),
																				timingCodeID : data.dataMap.serial[i].timingCode,
																				complianceEndDate : new Date(
																						data.dataMap.serial[i].cmplEndDate),
																				isDisabled : false,
																				isClicked : false,
																				revisionId : data.dataMap.serial[i].revId
																			});

																} else {
																	$scope.serialNumber
																			.push({
																				fromSNum : data.dataMap.serial[i].fromSerialNum,
																				toSNum : data.dataMap.serial[i].toSerialNum,
																				timingCode : parseInt($scope.timing[j].codeName),
																				timingCodeID : data.dataMap.serial[i].timingCode,
																				complianceEndDate : new Date(
																						data.dataMap.serial[i].cmplEndDate),
																				isDisabled : true,
																				isClicked : false,
																				revisionId : data.dataMap.serial[i].revId
																			});

																}

															}

														}

													}
													$scope
															.displayTimingCodes($scope.previoustimingCodeName);

												});
							}
						}

					}
					function dynamicSort(property) {
						var sortOrder = 1;
						if (property[0] === "-") {
							sortOrder = -1;
							property = property.substr(1);
						}
						return function(a, b) {
							var result = (a[property] < b[property]) ? -1
									: (a[property] > b[property]) ? 1 : 0;
							return result * sortOrder;
						}
					}
					$scope.makeUnique = function(previoustimingCodeId) {
						$scope.uniqueprevioustimingCodeId = [];
						$scope.uniqueprevioustimingCodeId[0] = previoustimingCodeId[0];
						$scope.flag = 0;
						for (i = 1; i < previoustimingCodeId.length; i++) {
							$scope.flag = 0

							for (j = 0; j < $scope.uniqueprevioustimingCodeId.length; j++) {

								if ($scope.uniqueprevioustimingCodeId[j] == previoustimingCodeId[i]) {

									$scope.flag = 1;
								}

							}
							if ($scope.flag == 0) {
								$scope.uniqueprevioustimingCodeId
										.push(previoustimingCodeId[i])

							}
						}

					}
					$scope.uniqueRevisions = [];
					$scope.makeUniqueRevisions = function(revisions) {
						$scope.revisionList = [];
						$scope.uniqueRevisions = [];
						$scope.uniqueRevisions[0] = angular.copy(revisions[0]);
						$scope.f = 0;
						for (i = 1; i < revisions.length; i++) {
							$scope.f = 0;

							for (j = 0; j < $scope.uniqueRevisions.length; j++) {

								if ($scope.uniqueRevisions[j].revision == revisions[i].revision) {

									$scope.f = 1;
								}
							}
							if ($scope.f == 0) {

								$scope.uniqueRevisions.push(revisions[i]);
							}

						}
						$scope.uniqueRevisions.sort(dynamicSort("revision"));

						for (i = 0; i < $scope.uniqueRevisions.length; i++) {
							$scope.revisionList
									.push($scope.uniqueRevisions[i].revision)
						}
						$scope.latestRevision = parseInt($scope.revisionList[$scope.revisionList.length - 1]) + 1;

					}
					$scope.latestRevision = "";
					$scope.fillBulletins = function() {

						if (this.addSerialController.productLines != null
								&& this.addSerialController.bulletinTypes != null) {

							$http(
									{
										method : 'POST',
										url : 'http://localhost:8080//ibct/Bulletin/Bulletins',
										dataType : 'json',
										data : JSON
												.stringify({
													"bulletinTypeCode" : this.addSerialController.bulletinTypes.codeID,
													"productLine" : this.addSerialController.productLines.productLine
												}),
										headers : {
											'Content-Type' : 'application/json'
										}
									})
									.success(
											function(data, status, headers,
													config) {
												$scope.bulletinNumbers = data.data;
												$scope.bulletins = data.data;
											})
									.error(
											function(data, status, headers,
													config) {
												alert('An error occurred. Please raise a request in GE ServiceNow. Please find the link at the top right corner of the page');

											});

						} else
							$scope.bulletinNumbers = [];

					}
					$scope.uniqueTimingCode = [];
					$scope.uniqueTimings = "";
					$scope.displayTimingCodes = function(previoustimingCodeName) {

						$scope.uniqueTimingCode = [];
						for (i = 0; i < previoustimingCodeName.length; i++) {
							$scope.uniqueTimingCode
									.push({
										"timingCode" : previoustimingCodeName[i].timingCodeName,
										"timingCodeDesc" : previoustimingCodeName[i].timingCodeDesc
									});
						}
						/*
						 * console.log(angular.toJson($scope.uniqueTimingCode));
						 * $scope.uniqueTimings="";
						 * 
						 * for(i=0;i<$scope.uniqueTimingCode.length;i++){
						 * if(i!=$scope.uniqueTimingCode.length-1)
						 * $scope.uniqueTimings=$scope.uniqueTimings+parseInt($scope.uniqueTimingCode[i].timingCode)+"-"+$scope.uniqueTimingCode[i].timingCodeDesc+"\n"
						 * else
						 * $scope.uniqueTimings=$scope.uniqueTimings+parseInt($scope.uniqueTimingCode[i].timingCode+"-"+$scope.uniqueTimingCode[i].timingCodeDesc);
						 * console.log($scope.uniqueTimingCode[i].timingCodeDesc);
						 * console.log($scope.uniqueTimings); }
						 */

					}
					$scope.uniqueTimingCodes = [];

					$scope.serialNumber = [];
					$scope.loadSerials = function() {
						if (this.addSerialController.revisionIsNull == "Y") {
							this.addSerialController.revsion = 0;
						}

						$http(
								{
									method : 'POST',
									url : 'http://localhost:8080//ibct/Bulletin/AddSerial',
									dataType : 'json',
									data : JSON
											.stringify({
												"bulletinTypeCode" : this.addSerialController.bulletinTypes.codeID,
												"productLine" : this.addSerialController.productLines.productLine,
												"bulletinNum" : this.addSerialController.bulletinNumbers.bulletinNum,
												"revision" : this.addSerialController.revsion,
												"issueDate" : $filter('date')
														(
																this.addSerialController.issueDate,
																'MM/dd/yyyy'),
												"rawSerial" : this.addSerialController.individualSerial
											}),
									headers : {
										'Content-Type' : 'application/json'
									}
								})
								.success(
										function(data, status, headers, config) {

											$scope.loadedSerials = data.data;

											$scope.serialNumber = [];

											for (i = 0; i < $scope.loadedSerials.length; i++) {

												if ($scope.loadedSerials[i].filteredTo == null) {
													$scope.loadedSerials[i].filteredTo = "";
												}

												$scope.serialNumber
														.push({
															fromSNum : $scope.loadedSerials[i].filteredFrom,
															toSNum : $scope.loadedSerials[i].filteredTo,
															isDisabled : false,
															isClicked : false,

														});

											}

										})
								.error(
										function(data, status, headers, config) {

											alert("An error has occurred while add serials, Please contact administrator")
										});
					}
				});
/*******************************************************************************
 * ******************VIEW CONFIGURATION *******************************
 * 
 * @author: jeevan-475852 05-FEB-2017
 ******************************************************************************/
app
		.controller(
				'viewConfigController',
				function($scope, $http, exportToCSV, $window) {
					$http.get('http://localhost:8080//ibct/Product').then(
							function(response) {

								$scope.productLines = response.data.data;
							});
					$http
							.get(
									'http://localhost:8080//ibct/ViewConfiguration/ProductType')
							.then(function(response) {
								$scope.productTypes = response.data.data;

							});
					$scope.fillSerials = function() {
						if (this.viewConfigController.productLines != null
								&& this.viewConfigController.productTypes != null) {

							$http(
									{
										method : 'POST',
										url : 'http://localhost:8080//ibct/ViewConfiguration/ProductSerials',
										dataType : 'json',
										data : JSON
												.stringify({
													"productLine" : this.viewConfigController.productLines.productLine,
													"productType" : this.viewConfigController.productTypes.productType

												}),
										headers : {
											'Content-Type' : 'application/json'
										}
									})
									.success(
											function(data, status, headers,
													config) {

												$scope.productSerials = data.data;
												if ($scope.productSerials.length == 0) {
													alert("There are no serials for this combination");
												}

											})
									.error(
											function(data, status, headers,
													config) {

												alert("An error has occurred while loading serials, Please contact administrator")
											});
						} else {
							$scope.productSerials = [];
							$scope.allDetails = [];
							$scope.productModelId = "";
							$scope.disableLink = true;
							$scope.viewConfigReport = [];
							$scope.disableLink = true;
						}
					}
					$scope.allDetails = [];
					$scope.disableLink = true;
					$scope.productModelId;
					$scope.asBuiltConfig = function() {

						if (this.viewConfigController.productLines != null
								&& this.viewConfigController.productTypes != null
								&& this.viewConfigController.serialNumber != null) {

							$http(
									{
										method : 'POST',
										url : 'https://ibct-sprint2-service.run.aws-usw02-pr.ice.predix.io/ibct/AsBuiltConfiguration/ProductModelId',
										dataType : 'json',
										data : JSON
												.stringify({
													"productLine" : this.viewConfigController.productLines.productLine,
													"productSerialNum" : this.viewConfigController.serialNumber.productSerialNum

												}),
										headers : {
											'Content-Type' : 'application/json'
										}
									})
									.success(
											function(data, status, headers,
													config) {

												$scope.productModelId = data.data[0].productModelId;
												console.log
												$http(
														{
															method : 'POST',
															url : 'https://ibct-sprint2-service.run.aws-usw02-pr.ice.predix.io/ibct/AsBuiltConfiguration/AllDetails',
															dataType : 'json',
															data : JSON
																	.stringify({
																		"productLine" : $scope.viewConfigController.productLines.productLine,
																		"productSerialNum" : $scope.viewConfigController.serialNumber.productSerialNum

																	}),
															headers : {
																'Content-Type' : 'application/json'
															}
														})
														.success(
																function(
																		data,
																		status,
																		headers,
																		config) {
																	$scope.viewConfigReport = data.data;

																	for ( var product in $scope.viewConfigReport) {
																		// console.log(product);
																		// console.log($scope.viewConfigReport[product][0]);
																		$scope.allDetails
																				.push({
																					"interfaceIin" : $scope.viewConfigReport[product][0],
																					"partNum" : $scope.viewConfigReport[product][1],
																					"partSerialNum" : $scope.viewConfigReport[product][2],
																					"qtyPerIin" : $scope.viewConfigReport[product][3],
																					"nomenclature" : $scope.viewConfigReport[product][4]
																				})
																	}

																	// console.log($scope.allDetails);
																	if ($scope.allDetails.length > 0) {
																		$scope.disableLink = false;
																	} else {
																		alert("No Data Found for the selected combination")
																	}

																})
														.error(
																function(
																		data,
																		status,
																		headers,
																		config) {

																	alert("An error has occurred while loading Report, Please contact administrator")
																});

											})
									.error(
											function(data, status, headers,
													config) {

												alert("An error has occurred, Please contact administrator")

											});

						} else {
							$scope.allDetails = [];
							$scope.productModelId = "";
							$scope.disableLink = true;
							$scope.viewConfigReport = [];
						}
					}

					$scope.export = function() {
						$scope.productData = [];
						$scope.filename = "AsBuiltConfiguration";
						$scope.productData
								.push({
									"ProductLine" : this.viewConfigController.productLines.productLine,
									"ProductType" : this.viewConfigController.productTypes.productType,
									"ProductSerial#" : this.viewConfigController.serialNumber.productSerialNum,
									"ProductModel" : $scope.productModelId

								})
						exportToCSV.JSONToCSV(
								angular.toJson($scope.allDetails), true,
								$scope.filename, $scope.productData);
					}
					/* pagination */
					$scope.currentPage = 1;
					$scope.pageSize = 10;
					// $scope.meals = [];
					$scope.pageChangeHandler = function(num) {
						// console.log('meals page changed to ' + num);
					};

					$scope.print = function() {

						var myWindow = $window.open("", "_blank",
								"menubar=1,resizable=1,width=1000,height=800");
						myWindow.document
								.write("<center><b>As Built Configuration</b></center>");
						myWindow.document.write("<br><br>")
						myWindow.document.write("<table>");
						myWindow.document.write("<tr>")
						myWindow.document
								.write("<td>"
										+ "ProductLine:  "
										+ "</td>"
										+ "<td>"
										+ this.viewConfigController.productLines.productLine
										+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
										+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
										+ "</td>");
						myWindow.document
								.write("<td>"
										+ "ProductType:  "
										+ "</td>"
										+ "<td>"
										+ this.viewConfigController.productTypes.productType
										+ "</td>");
						myWindow.document.write("</tr>")
						myWindow.document.write("<tr>")
						myWindow.document
								.write("<td>"
										+ "ProductSerial:  "
										+ "</td>"
										+ "<td>"
										+ this.viewConfigController.serialNumber.productSerialNum
										+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
										+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
										+ "</td>");
						myWindow.document.write("<td>" + "ProductModel:  "
								+ "</td>" + "<td>" + $scope.productModelId
								+ "</td>");
						myWindow.document.write("</tr>")
						myWindow.document.write("</table>")
						myWindow.document.write("<br>")
						myWindow.document.write("<table>")
						$scope.headers = [];
						for (product in $scope.allDetails[0]) {

							if (product != "$$hashKey") {
								$scope.headers.push(product);

								myWindow.document
										.write("<th >"
												+ product.charAt(0)
														.toUpperCase()
												+ product.substr(1)
												+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
												+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
												+ "</th>");
							}
						}

						for (products = 0; products < $scope.allDetails.length; products++) {
							// console.log($scope.allDetails);
							// console.log($scope.allDetails[products].interfaceIin);
							i = 0;
							myWindow.document.write("<tr>")

							if ($scope.allDetails[products] != null) {
								myWindow.document
										.write("<td>"
												+ $scope.allDetails[products].interfaceIin
												+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
												+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
												+ "</td>");
								myWindow.document
										.write("<td>"
												+ $scope.allDetails[products].partNum
												+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
												+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
												+ "</td>");
								myWindow.document
										.write("<td>"
												+ $scope.allDetails[products].partSerialNum
												+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
												+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
												+ "</td>");
								myWindow.document
										.write("<td>"
												+ $scope.allDetails[products].qtyPerIin
												+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
												+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
												+ "</td>");
								myWindow.document
										.write("<td>"
												+ $scope.allDetails[products].nomenclature
												+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
												+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
												+ "</td>");
							}

							myWindow.document.write("</tr>");
						}
						myWindow.document.write("</table>")
					}
					$scope.close = function() {
						$window.location.href = '#welcome';
					}

				});
/*
 * exportToCSV service @author: arka-460545 @author: jeevan-475852 (03-Feb-2017)
 */
app.service('exportToCSV', function() {
	this.JSONToCSV = function(JSONData, ShowLabel, fileName, productData) {
		var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData)
				: JSONData;
		var prodData = typeof productData != 'object' ? JSON.parse(productData)
				: productData;
		var CSV = '';
		/* product Data */
		var row = "";
		for ( var index in prodData[0]) {
			row += index + ',';
		}
		row = row.slice(0, -1);
		CSV += row + '\r\n';
		for (var i = 0; i < prodData.length; i++) {
			var row = "";
			for ( var index in prodData[i]) {
				var arrValue = prodData[i][index] == null ? "" : '="'
						+ prodData[i][index] + '"';
				row += arrValue + ',';
			}
			row.slice(0, row.length - 1);
			CSV += row + '\r\n';
		}
		CSV = CSV + '\r\n';
		/* product Data end */

		if (ShowLabel) {
			var row = "";
			for ( var index in arrData[0]) {
				row += index.charAt(0).toUpperCase() + index.substr(1) + ',';
			}
			row = row.slice(0, -1);
			CSV += row + '\r\n';
		}
		for (var i = 0; i < arrData.length; i++) {
			var row = "";
			for ( var index in arrData[i]) {
				var arrValue = arrData[i][index] == null ? "" : '="'
						+ arrData[i][index] + '"';
				row += arrValue + ',';
			}
			row.slice(0, row.length - 1);
			CSV += row + '\r\n';
		}
		if (CSV == '') {
			growl.error("Invalid data");
			return;
		}

		if (msieversion()) {
			var IEwindow = window.open();
			IEwindow.document.write('sep=,\r\n' + CSV);
			IEwindow.document.close();
			IEwindow.document.execCommand('SaveAs', true, fileName + ".csv");
			IEwindow.close();
		} else {
			var uri = 'data:application/csv;charset=utf-8,' + escape(CSV);
			var link = document.createElement("a");
			link.href = uri;
			link.style = "visibility:hidden";
			link.download = fileName + ".csv";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
		function msieversion() {
			var ua = window.navigator.userAgent;
			var msie = ua.indexOf("MSIE ");
			if (msie != -1 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If
			// Internet
			// Explorer,
			// return
			// version
			// number
			{
				return true;
			} else { // If another browser,
				return false;
			}
			return false;
		}
	}
});

app.controller('OtherController', function($scope) {
	$scope.pageChangeHandler = function(num) {

	}
});
/*******************************************************************************
 * ******************FLEET SUMMARY BULLETIN COMPLIANCE
 * *******************************
 * 
 * @author: jeevan-475852 05-FEB-2017
 ******************************************************************************/
app
		.controller(
				'fleetController',
				function($scope, $http, $window, exportToCSV) {
					$http.get('http://localhost:8080//ibct/Product').then(
							function(response) {

								$scope.productLines = response.data.data;
							});
					$scope.timing = [];
					$http
							.get(
									'http://localhost:8080//ibct/Bulletin/CodesOptions/TIMING_CODE')
							.then(function(response) {

								$scope.timing = response.data.data;
							});
					$http
							.get(
									'http://localhost:8080//ibct/Bulletin/CodesOptions/BULLETIN_CATEGORY')
							.then(function(response) {

								$scope.bulletinCategory = response.data.data;
								// console.log($scope.bulletinCategory);
							});
					$scope.bulletinCategory = [];

					$scope.currentPage = 1;
					$scope.pageSize = 10;
					$scope.disableExportButton = true;
					$scope.fleetReportData = [];
					$scope.getFleetReport = function() {

						$http
								.get(
										'http://localhost:8080//ibct/Bulletin/CodesOptions/BULLETIN_TYPE')
								.then(
										function(response) {
											$scope.bulletinTypes_availabl = response.data.data;
											$scope.bulletinTypes_available = angular
													.copy($scope.bulletinTypes_availabl);
											if ($scope.fleetController.productLines != null) {
												if ($scope.fleetController.productLines.productLine == "LMS100") {

													for (i = 0; i < $scope.bulletinTypes_available.length; i++) {
														if ($scope.bulletinTypes_available[i].codeName != "SYSTEM BULLETIN") {
															$scope.bulletinTypes_available
																	.splice(i,
																			2);
														}
													}
													$scope.bulletinTypes = $scope.bulletinTypes_available;

												} else {
													for (i = 0; i < $scope.bulletinTypes_available.length; i++) {
														if ($scope.bulletinTypes_available[i].codeName == "SYSTEM BULLETIN")
															$scope.bulletinTypes_available
																	.splice(i,
																			1);
													}
													$scope.bulletinTypes = $scope.bulletinTypes_available;

												}
											} else
												$scope.bulletinTypes = [];

										});

						if (this.fleetController.bulletinTypes != null
								&& this.fleetController.productLines != null) {
							// console.log(this.fleetController.productLines.productLine+","+this.fleetController.bulletinTypes.codeID)
							$http(
									{
										method : 'POST',
										url : 'http://localhost:8080//ibct/ComplianceFleetSummary',
										dataType : 'json',
										data : JSON
												.stringify({
													"productLine" : this.fleetController.productLines.productLine,
													"bulletinTypeCode" : this.fleetController.bulletinTypes.codeID

												}),
										headers : {
											'Content-Type' : 'application/json'
										}
									})
									.success(
											function(data, status, headers,
													config) {

												$scope.fleetReportData = data.data;
												// console.log($scope.fleetReportData);
												if ($scope.fleetReportData.length > 0) {
													$scope.disableExportButton = false;
												} else
													$scope.disableExportButton = true;

											})
									.error(
											function(data, status, headers,
													config) {

												alert("An error has occurred , Please contact administrator")
											});
						} else {
							$scope.disableExportButton = true;
							$scope.fleetReportData = [];

						}
					}
					$scope.complianceLevel = [ {
						"codeID" : "D",
						"compLevel" : "DEPOT"
					}, {
						"codeID" : "F",
						"compLevel" : "FIELD"
					}, {
						"codeID" : "F/D",
						"compLevel" : "FIELD REPORT"
					}, {
						"codeID" : "SPS",
						"compLevel" : "SPS CONVERSION"
					} ];
					$scope.fleetReportData = [];
					$scope.getCategory = function() {

					}
					$scope.export = function() {
						$scope.productData = [];
						$scope.filename = "fleet summary bulletin compliance";
						$scope.productData = [];
						$scope.productData
								.push({
									"productLine" : $scope.fleetController.productLines.productLine,
									"BulletinType" : $scope.fleetController.bulletinTypes.codeName
								})
						exportToCSV.JSONToCSV(angular
								.toJson($scope.fleetReportData), true,
								$scope.filename, $scope.productData);
					}
					$scope.closeFleetReport = function() {
						$window.location.href = "#welcome"
					}

				});

/*******************************************************************************
 * ******************BULLETIN COMPLIANCE BY
 * ENGINE******************************** *
 * 
 * @author:jeevan-475852 05-FEB-2017
 ******************************************************************************/

app
		.controller(
				'enginePackageController',
				function($scope, $http, exportToCSV, $window, $filter) {
					$http.get('http://localhost:8080//ibct/Product').then(
							function(response) {

								$scope.productLines = response.data.data;
							});
					/*
					 * $http .get(
					 * 'http://localhost:8080//ibct/Bulletin/CodesOptions/BULLETIN_TYPE')
					 * .then(function(response) { $scope.bulletinTypes =
					 * response.data.data;
					 * if(this.enginePackageController.productLines!=null) {
					 * if(this.enginePackageController.productLines=="LMS100") {
					 * this.enginePackageController.bulletinTypes="SYSTEM
					 * BULLETIN"; } } // $scope.bulletinTypes.splice(1,1); //
					 * $scope.packageBulletinTypes =
					 * response.data.data.splice(0,1); });
					 */
					$scope.timing = [];
					$http
							.get(
									'http://localhost:8080//ibct/Bulletin/CodesOptions/TIMING_CODE')
							.then(function(response) {

								$scope.timing = response.data.data;
							});
					$scope.complianceDateDisable = true;
					$scope.selectTCDLink = true;
					$scope.selectTCNLink = true;
					$scope.targetObtainedDateDisable = true;
					$scope.buttonLink = true;
					$scope.currentPage = 1;
					$scope.pageSize = 10;
					$scope.meals = [];
					$scope.productSerials = [];
					$scope.bulletinTypes = [];
					$scope.fillSerials = function() {
						$http
								.get(
										'http://localhost:8080//ibct/Bulletin/CodesOptions/BULLETIN_TYPE')
								.then(
										function(response) {
											$scope.bulletinTypes_availabl = response.data.data;
											$scope.bulletinTypes_available = angular
													.copy($scope.bulletinTypes_availabl);
											if ($scope.enginePackageController.productLines != null) {
												if ($scope.enginePackageController.productLines.productLine == "LMS100") {

													for (i = 0; i < $scope.bulletinTypes_available.length; i++) {
														if ($scope.bulletinTypes_available[i].codeName != "SYSTEM BULLETIN") {
															$scope.bulletinTypes_available
																	.splice(i,
																			2);
														}
													}
													$scope.bulletinTypes = $scope.bulletinTypes_available;

												} else {
													for (i = 0; i < $scope.bulletinTypes_available.length; i++) {
														if ($scope.bulletinTypes_available[i].codeName == "SYSTEM BULLETIN")
															$scope.bulletinTypes_available
																	.splice(i,
																			1);
													}
													$scope.bulletinTypes = $scope.bulletinTypes_available;

												}
											} else
												$scope.bulletinTypes = [];

										});
						if (this.enginePackageController.productLines != null
								&& this.enginePackageController.bulletinTypes != null) {

							$http(
									{
										method : 'POST',
										url : 'http://localhost:8080//ibct/Bulletin/ProductSerial',
										dataType : 'json',
										data : JSON
												.stringify({
													"productLine" : this.enginePackageController.productLines.productLine,
													"bulletinTypeCode" : this.enginePackageController.bulletinTypes.codeID

												}),
										headers : {
											'Content-Type' : 'application/json'
										}
									})
									.success(
											function(data, status, headers,
													config) {

												$scope.productSerials = data.data;
												if ($scope.productSerials.length == 0) {
													alert("No serials found for this combination")
												}

											})
									.error(
											function(data, status, headers,
													config) {

												alert("An error has occurred while loading serials, Please contact administrator")
											});

						} else {
							$scope.productSerials = [];
						}

					}
					var today = new Date();
					$scope.today = new Date();
					$scope.dateCheck = function(otherDate) {

						if ((today <= otherDate)) {
							alert("Date cannot be future date")
							$scope.disableUpdateButton = true;
						} else
							$scope.disableUpdateButton = false;

					}
					$scope.engineDetails = [];
					$scope.engineReport = [];
					$scope.engineReportToPrint = [];
					$scope.timingCodesNine = [];
					$scope.getEngineReport = function() {
						$http
								.get(
										'http://localhost:8080//ibct/Bulletin/CodesOptions/TIMING_CODE_NINE')
								.then(
										function(response) {

											$scope.timingCodesNine = response.data.data;

										});
						if (this.enginePackageController.productLines != null
								&& this.enginePackageController.bulletinTypes != null
								&& this.enginePackageController.productSerial != null) {
							$http(
									{
										method : 'POST',
										url : 'http://localhost:8080//ibct/ComplianceEngineDetails',
										dataType : 'json',
										data : JSON
												.stringify({
													"productLine" : this.enginePackageController.productLines.productLine,
													"productSerialNum" : this.enginePackageController.productSerial.productSerialNum

												}),
										headers : {
											'Content-Type' : 'application/json'
										}
									})
									.success(
											function(data, status, headers,
													config) {

												$scope.engineDetails = data.data;

												if ($scope.engineDetails == 0) {
													$scope.engineDetails
															.push({
																"productModelId" : null,
																"parentSerialNum" : null,
																"customerName" : null,
																"firstFireDate" : null,
																"cod" : null,
																"operatingStatus" : null,
																"siteName" : null
															})
												}

											})
									.error(
											function(data, status, headers,
													config) {

												alert("An error has occurred while loading Details, Please contact administrator")
											});
							// console.log(this.enginePackageController.bulletinTypes.codeID);
							$http(
									{
										method : 'POST',
										url : 'http://localhost:8080//ibct/ComplianceEnginePackage',
										dataType : 'json',
										data : JSON
												.stringify({
													"productLine" : this.enginePackageController.productLines.productLine,
													"bulletinTypeCode" : this.enginePackageController.bulletinTypes.codeID,
													"productSerialNum" : this.enginePackageController.productSerial.productSerialNum
												}),
										headers : {
											'Content-Type' : 'application/json'
										}
									})
									.success(
											function(data, status, headers,
													config) {

												$scope.engineReport = data.data;
												// console.log($scope.engineReport);

												if ($scope.engineReport.length > 0) {
													$scope.disabledButtons = false;
												} else {
													$scope.disabledButtons = true;
												}

												for (i = 0; i < $scope.engineReport.length; i++) {
													for (j = 0; j < $scope.bulletinCategory.length; j++) {
														if ($scope.engineReport[i].categoryCode == $scope.bulletinCategory[j].codeID)
															$scope.engineReport[i].categoryCode = $scope.bulletinCategory[j].codeName;
													}
												}
												for (i = 0; i < $scope.engineReport.length; i++) {
													for (j = 0; j < $scope.timing.length; j++) {
														if ($scope.engineReport[i].timingCode == $scope.timing[j].codeID)
															$scope.engineReport[i].timingCode = $scope.timing[j].codeName;
													}
												}
												for (var i = 0; i < $scope.engineReport.length; i++) {
													$scope.engineReportToPrint
															.push({
																"bulletinNum" : $scope.engineReport[i].bulletinNum,
																"revId" : $scope.engineReport[i].revId,
																"title" : $scope.engineReport[i].bulletinDesc,
																"Category" : $scope.engineReport[i].categoryCode,
																"Level" : $scope.engineReport[i].complianceLevel,
																"Timing" : $scope.engineReport[i].timingCode,
																"Significant" : $scope.engineReport[i].significantInd,
																"Voucher" : $scope.engineReport[i].voucherProgramInd,
																"Compliance Date" : $scope.engineReport[i].compliedDate,
																"Target Compliance Date" : $scope.engineReport[i].targetComplianceDate,
																"Target Obtained Date" : $scope.engineReport[i].dateTargetObtained
															})
												}

											})
									.error(
											function(data, status, headers,
													config) {

												alert("An error has occurred while loading Report, Please contact administrator")
											});

						} else {
							$scope.engineDetails = [];
							$scope.engineReport = [];
						}
					}
					$scope.export = function() {
						$scope.productData = [];
						$scope.filename = "BulletinComplianceByEngine/package";
						if ($scope.engineDetails.length > 0) {
							$scope.productData
									.push({
										"ProductLine" : this.enginePackageController.productLines.productLine,
										"BulletinType" : this.enginePackageController.bulletinTypes.codeDescription,
										"ProductSerial#" : this.enginePackageController.productSerial.productSerialNum,
										"ProductModel" : $scope.engineDetails[0].productModelId

									})
						} else {
							$scope.productData
									.push({
										"ProductLine" : this.enginePackageController.productLines.productLine,
										"BulletinType" : this.enginePackageController.bulletinTypes.codeDescription,
										"ProductSerial#" : this.enginePackageController.productSerial.productSerialNum,
										"ProductModel" : ""

									})
						}
						exportToCSV.JSONToCSV(angular
								.toJson($scope.engineReportToPrint), true,
								$scope.filename, $scope.productData);
					}
					$scope.close = function() {
						$window.location.href = "#welcome";
					}
					$scope.disableOtherOption = function(otherDate) {
						if (this.enginePackageController.engineTargetComplainceDate != null) {
							$scope.selectTCNLink = true;
						} else
							$scope.selectTCNLink = false;
						if (this.enginePackageController.TargetTimingCodeNine != null) {
							$scope.selectTCDLink = true;
						} else
							$scope.selectTCDLink = false;
						$scope.today = new Date();
						if ((today > otherDate)) {
							alert("Target Compliance Date must be a future date")

							$scope.disableUpdateButton = true;
						} else
							$scope.disableUpdateButton = false;
					}
					$scope.selectedIndex = [];
					$scope.selectedIndexes = [];
					$scope.engineReportIndex;
					$scope.displayComplianceDetails = function(index) {

						$scope.complianceDateDisable = false;
						$scope.selectTCDLink = false;
						$scope.selectTCNLink = false;
						$scope.targetObtainedDateDisable = false;
						$scope.disableUpdateButton = false;

						$scope.engineReportIndex = (($scope.currentPage - 1) * 10)
								+ index;
						// console.log($scope.engineReport[$scope.engineReportIndex].compliedDate);
						$scope.ComplainceDate = $filter('date')
								(
										$scope.engineReport[$scope.engineReportIndex].compliedDate,
										'yyyy-MM-dd');
						// console.log($scope.engineReport[$scope.engineReportIndex].targetComplianceDate);
						var reg = new RegExp('^[9].$');
						if (reg
								.test($scope.engineReport[$scope.engineReportIndex].targetComplianceDate)) {
							// console.log("matched");
							$scope.selectTCNLink = true;
							$scope.selectTCDLink = true;
						} else {
							$scope.targetComplainceDate = $filter('date')
									(
											$scope.engineReport[$scope.engineReportIndex].targetComplianceDate,
											'yyyy-MM-dd');
						}
						if ($scope.engineReport[$scope.engineReportIndex].targetComplianceDate != null)
							$scope.selectTCNLink = true;

						$scope.targetObatinedDate = $filter('date')
								(
										$scope.engineReport[$scope.engineReportIndex].dateTargetObtained,
										'yyyy-MM-dd');
						$scope.selectedIndex = $scope.engineReportIndex;

					}
					$scope.disableUpdateButton = true;
					$scope.engineDetails = [];
					$scope.clearUpdate = function() {
						var elements = document.getElementsByTagName("input");
						var dropdowns = document.getElementsByTagName("select");
						// console.log(elements.length + "," +
						// dropdowns.length);
						var i = 0
						for (i = 0; i < elements.length; i++) {

							if (elements[i].type == "date") {
								if (elements[i].id == "updateCompliance")
									elements[i].value = "";
							}

						}
						for (i = 0; i < dropdowns.length; i++) {
							if (dropdowns[i].type == "select-one") {
								if (dropdowns[i].id == "updateCompliance") {
									dropdowns[i].value = "";
									$scope.selectTCDLink = false;
								}
							}
						}
						$scope.selectTCDLink = false;
						$scope.selectTCNLink = false;

					}
					// $scope.enginePackageController.bulletinRadioSelected =
					// false;
					$scope.disabledButtons = true;
					$scope.bulletinCategory = [];
					$http
							.get(
									'http://localhost:8080//ibct/Bulletin/CodesOptions/BULLETIN_CATEGORY')
							.then(function(response) {

								$scope.bulletinCategory = response.data.data;

							});
					$scope.printEngineReport = function() {
						var myWindow = $window.open("", "_blank",
								"menubar=1,resizable=1,width=1000,height=800");
						myWindow.document
								.write("<center><b>Bulletin Compliance By Engine</b></center>");
						myWindow.document.write("<br><br>")
						myWindow.document.write("<table border=1>");
						myWindow.document.write("<tr>")
						myWindow.document
								.write("<td>"
										+ "ProductLine:  "
										+ "</td>"
										+ "<td>"
										+ this.enginePackageController.productLines.productLine
										+ "</td>");
						myWindow.document.write("<td>" + "ProductModel:  "
								+ "</td>" + "<td>"
								+ $scope.engineDetails[0].productModelId
								+ "</td>");
						myWindow.document.write("</tr>")
						myWindow.document.write("<tr>")
						myWindow.document
								.write("<td>"
										+ "ProductSerial#:  "
										+ "</td>"
										+ "<td>"
										+ this.enginePackageController.productSerial.productSerialNum
										+ "</td>");
						myWindow.document.write("<td>" + "PackageSerial#:  "
								+ "</td>" + "<td>"
								+ $scope.engineDetails[0].parentSerialNum
								+ "</td>");
						myWindow.document.write("</tr>")
						myWindow.document.write("<tr>")
						myWindow.document.write("<td>" + "Customer:  "
								+ "</td>" + "<td>"
								+ $scope.engineDetails[0].customerName
								+ "</td>");
						myWindow.document.write("</tr>")
						myWindow.document.write("<tr>")
						myWindow.document.write("<td>" + "Site Name:  "
								+ "</td>" + "<td>"
								+ $scope.engineDetails[0].siteName + "</td>");
						myWindow.document.write("</tr>")
						myWindow.document.write("<tr>")
						myWindow.document.write("<td>" + "First Fire Date:  "
								+ "</td>" + "<td>"
								+ $scope.engineDetails[0].firstFireDate
								+ "</td>");
						myWindow.document.write("<td>" + "Operating Status:  "
								+ "</td>" + "<td>"
								+ $scope.engineDetails[0].operatingStatus
								+ "</td>");
						myWindow.document.write("</tr>")
						myWindow.document.write("<tr>")
						myWindow.document.write("<td>" + "COD:  " + "</td>"
								+ "<td>" + $scope.engineDetails[0].cod
								+ "</td>");
						myWindow.document.write("</tr>")
						myWindow.document.write("<tr>")
						myWindow.document.write("</table>")
						myWindow.document.write("<br>")
						myWindow.document.write("<table border=2>")

						myWindow.document
								.write("<th >" + "Bulletin#" + "</th>");
						myWindow.document.write("<th >" + "Revision" + "</th>");
						myWindow.document.write("<th >" + "Title" + "</th>");
						myWindow.document.write("<th >" + "Category" + "</th>");
						myWindow.document.write("<th >" + "Level" + "</th>");
						myWindow.document.write("<th >" + "Timing" + "</th>");
						myWindow.document.write("<th >" + "Significant"
								+ "</th>");
						myWindow.document.write("<th >" + "Voucher" + "</th>");
						myWindow.document.write("<th >" + "Compliance Date"
								+ "</th>");
						myWindow.document.write("<th >"
								+ "Target Compliance Date" + "</th>");

						for (products = 0; products < $scope.engineReport.length; products++) {

							i = 0;
							myWindow.document.write("<tr>")

							if ($scope.engineReport[products] != null) {
								myWindow.document
										.write("<td>"
												+ $scope.engineReport[products].bulletinNum
												+ "</td>");
								myWindow.document.write("<td>"
										+ $scope.engineReport[products].revId
										+ "</td>");
								myWindow.document
										.write("<td>"
												+ $scope.engineReport[products].bulletinDesc
												+ "</td>");
								myWindow.document
										.write("<td>"
												+ $scope.engineReport[products].categoryCode
												+ "</td>");
								myWindow.document
										.write("<td>"
												+ $scope.engineReport[products].complianceLevel
												+ "</td>");
								myWindow.document
										.write("<td>"
												+ $scope.engineReport[products].timingCode
												+ "</td>");
								myWindow.document
										.write("<td>"
												+ $scope.engineReport[products].significantInd
												+ "</td>");
								myWindow.document
										.write("<td>"
												+ $scope.engineReport[products].voucherProgramInd
												+ "</td>");
								myWindow.document
										.write("<td>"
												+ $scope.engineReport[products].compliedDate
												+ "</td>");
								myWindow.document
										.write("<td>"
												+ $scope.engineReport[products].targetComplianceDate
												+ "</td>");
							}

							myWindow.document.write("</tr>");
						}
						myWindow.document.write("</table>")
						myWindow.document.write("<br>");
						myWindow.document.write("<br>");
						myWindow.document.write("<b>LEGEND</b>");
						myWindow.document.write("<table border=2>")
						myWindow.document
								.write("<th>Implementation Timing</th><th>Timing Code</th>")
						for (i = 0; i < $scope.timing.length; i++) {
							myWindow.document.write("<tr>")
							myWindow.document.write("<td>"
									+ $scope.timing[i].codeName + "</td>")
							myWindow.document.write("<td>"
									+ $scope.timing[i].codeDescription
									+ "</td>")
							myWindow.document.write("</tr>")
						}
						myWindow.document.write("</table>")
					}
					$scope.bulletinRadioSelected = false;
					$scope.updateDateInTable = function() {
						// console.log(this.enginePackageController.engineTargetComplainceDate+
						// ","+
						// this.enginePackageController.TargetTimingCodeNine);
						$scope.selectedIndexes.push($scope.selectedIndex);
						if ($scope.selectedIndexes.length > 0) {
							$scope.disabledButtons = false;
						}
						if (this.enginePackageController.engineComplainceDate != null) {
							$scope.engineReport[$scope.selectedIndex].compliedDate = $filter(
									'date')
									(
											this.enginePackageController.engineComplainceDate,
											'yyyy-MM-dd');
						}
						if (this.enginePackageController.engineTargetComplainceDate != null
								&& this.enginePackageController.TargetTimingCodeNine == null) {
							// console.log("targetComplianceDate")
							$scope.engineReport[$scope.selectedIndex].targetComplianceDate = $filter(
									'date')
									(
											this.enginePackageController.engineTargetComplainceDate,
											'yyyy-MM-dd');
							/*
							 * this.enginePackageController.engineTargetComplainceDate
							 * ="";
							 * this.enginePackageController.TargetTimingCodeNine="";
							 * this.enginePackageController.engineTargetObtainedDate="";
							 * this.enginePackageController.engineComplainceDate="";
							 */
							$scope.ComplainceDate = "";
							$scope.targetComplainceDate = "";
							$scope.targetObatinedDate = "";
							// $scope.clearUpdate();
						}

						if (this.enginePackageController.TargetTimingCodeNine != null
								&& this.enginePackageController.engineTargetComplainceDate == null) {
							// console.log("targetComplianceNINE")
							$scope.engineReport[$scope.selectedIndex].targetComplianceDate = this.enginePackageController.TargetTimingCodeNine.codeDescription
									.substr(0, 2);
							this.enginePackageController.TargetTimingCodeNine = null;
							this.enginePackageController.engineTargetComplainceDate = null;
						}
						if (this.enginePackageController.engineTargetObtainedDate != null) {
							$scope.engineReport[$scope.selectedIndex].dateTargetObtained = $filter(
									'date')
									(
											this.enginePackageController.engineTargetObtainedDate,
											'yyyy-MM-dd');
						}
						// $scope.disabledButtons = false;
						// $scope.clearUpdate();
						$scope.bulletinRadioSelected = false;
					}
					$scope.extractYear = function(bulletin) {

						if (bulletin != null) {
							$scope.year = bulletin.substr(0, 4);
							return $scope.year;
						}
					}
					$scope.timingCodesNine = [];
					$scope.getTimingCodeNineDate = function(codeDesc) {

						for (var i = 0; i < $scope.timingCodesNine.length; i++) {
							// console.log($scope.timingCodesNine[i].codeDescription.substr(0,
							// 2)+","+codeDesc)
							// console.log($scope.timingCodesNine[i].codeDescription.substr(0,
							// 2)==codeDesc)
							if ($scope.timingCodesNine[i].codeDescription
									.substr(0, 2) == codeDesc) {

								return $scope.timingCodesNine[i].codeName;
							}
						}
					}

					$scope.updateCompliance = function() {
						/*
						 * String bulletinNum = "LM5000-IND-011"; Integer
						 * revisionId = 0; String significant = "N"; Date
						 * complianceDate = new Date(); Integer productId =
						 * 3895; Date targetComplianceDate = new Date(); Date
						 * targetObtainedDate = new Date(); Date
						 * timingCodeNineDate = new Date(); String createdBy =
						 * "Jai"; Date createdDate = new Date(); String
						 * lastUpdatedBy = "jai"; Date lastUpdatedDate = new
						 * Date(); $scope.timingCodesNine
						 */
						$scope.flag = 0;
						$scope.error = 0;
						$scope.count = 0;
						// console.log($scope.selectedIndexes)
						for (var i = 0; i < $scope.selectedIndexes.length; i++) {
							$scope.flag = 0;
							// console.log($scope.engineReport[$scope.selectedIndexes[i]].targetComplianceDate+
							// ", " + i);
							$scope.dBAction = "DB_ACTION_NEW";
							if ($scope.engineReport[$scope.selectedIndexes[i]].targetComplianceDate != null) {
								// console.log("entered");
								if ($scope
										.getTimingCodeNineDate($scope.engineReport[$scope.selectedIndexes[i]].targetComplianceDate) == 1) {
									$scope.timingCodeNine = $filter('date')(
											new Date("09/01/2034"),
											'yyyy-MM-dd');
									$scope.flag = 1;
								}
								if ($scope
										.getTimingCodeNineDate($scope.engineReport[$scope.selectedIndexes[i]].targetComplianceDate) == 2) {
									$scope.timingCodeNine = $filter('date')(
											new Date("09/02/2034"),
											'yyyy-MM-dd');
									$scope.flag = 1;
								}
								if ($scope
										.getTimingCodeNineDate($scope.engineReport[$scope.selectedIndexes[i]].targetComplianceDate) == 3) {
									// console.log("3 returned");
									$scope.timingCodeNine = $filter('date')(
											new Date("09/03/2034"),
											'yyyy-MM-dd');
									// console.log($scope.timingCodeNine);
									$scope.flag = 1;
								}
								if ($scope
										.getTimingCodeNineDate($scope.engineReport[$scope.selectedIndexes[i]].targetComplianceDate) == 4) {
									$scope.timingCodeNine = $filter('date')(
											new Date("09/04/2034"),
											'yyyy-MM-dd');
									$scope.flag = 1;
								}
								if ($scope
										.getTimingCodeNineDate($scope.engineReport[$scope.selectedIndexes[i]].targetComplianceDate) == 5) {
									$scope.timingCodeNine = $filter('date')(
											new Date("09/05/2034"),
											'yyyy-MM-dd');
									$scope.flag = 1;
								}
								if ($scope
										.getTimingCodeNineDate($scope.engineReport[$scope.selectedIndexes[i]].targetComplianceDate) == 6) {
									$scope.timingCodeNine = $filter('date')(
											new Date("09/06/2034"),
											'yyyy-MM-dd');
									$scope.flag = 1;
								}
								if ($scope
										.getTimingCodeNineDate($scope.engineReport[$scope.selectedIndexes[i]].targetComplianceDate) == 7) {
									$scope.timingCodeNine = $filter('date')(
											new Date("09/07/2034"),
											'yyyy-MM-dd');
									$scope.flag = 1;
								}
								if ($scope
										.getTimingCodeNineDate($scope.engineReport[$scope.selectedIndexes[i]].targetComplianceDate) == 8) {
									$scope.timingCodeNine = $filter('date')(
											new Date("09/08/2034"),
											'yyyy-MM-dd');
									$scope.flag = 1;
								}
								if ($scope
										.getTimingCodeNineDate($scope.engineReport[$scope.selectedIndexes[i]].targetComplianceDate) == 9) {
									$scope.timingCodeNine = $filter('date')(
											new Date("09/09/2034"),
											'yyyy-MM-dd');
									$scope.flag = 1;
								}
								if ($scope
										.getTimingCodeNineDate($scope.engineReport[$scope.selectedIndexes[i]].targetComplianceDate) == 91) {
									$scope.timingCodeNine = $filter('date')(
											new Date("09/10/2034"),
											'yyyy-MM-dd');
									$scope.flag = 1;
								}
								if ($scope
										.getTimingCodeNineDate($scope.engineReport[$scope.selectedIndexes[i]].targetComplianceDate) == 92) {
									$scope.timingCodeNine = $filter('date')(
											new Date("09/11/2034"),
											'yyyy-MM-dd');
									$scope.flag = 1;
								}
								if ($scope
										.getTimingCodeNineDate($scope.engineReport[$scope.selectedIndexes[i]].targetComplianceDate) == 93) {
									$scope.timingCodeNine = $filter('date')(
											new Date("09/12/2034"),
											'yyyy-MM-dd');
									$scope.flag = 1;
								}
								if ($scope.flag == 0) {
									// console.log("else1")
									$scope.timingCodeNine = $filter('date')
											(
													new Date(
															$scope.engineReport[$scope.selectedIndexes[i]].targetComplianceDate),
													'yyyy-MM-dd');
								}
							} else {

								$scope.timingCodeNine = "";
							}
							if ($scope.engineReport[$scope.selectedIndexes[i]].targetComplianceDate == null) {
								$scope.engineReport[$scope.selectedIndexes[i]].targetComplianceDate = "";
							}
							// "DB_ACTION_NEW"
							// DB_ACTION_DELETED
							// DB_ACTION_UPDATED
							// console.log($scope.engineReport[$scope.selectedIndexes[i]].dateTargetObtained);
							// console.log($scope.timingCodeNine + "," + i);

							$http(
									{
										method : 'POST',
										url : 'http://localhost:8080//ibct/ComplianceUpdate',
										dataType : 'json',
										data : JSON
												.stringify({
													"bulletinNum" : $scope.engineReport[$scope.selectedIndexes[i]].bulletinNum,
													"revisionId" : $scope.engineReport[$scope.selectedIndexes[i]].revId,
													"significants" : $scope.engineReport[$scope.selectedIndexes[i]].significantInd,
													"complianceDate" : $filter(
															'date')
															(
																	new Date(
																			$scope.engineReport[$scope.selectedIndexes[i]].compliedDate),
																	'yyyy-MM-dd'),
													"productId" : $scope.engineDetails[0].productId,
													"targetComplianceDate" : $filter(
															'date')
															(
																	new Date(
																			$scope.timingCodeNine),
																	'yyyy-MM-dd'),
													"targetObtainedDate" : $filter(
															'date')
															(
																	new Date(
																			$scope.engineReport[$scope.selectedIndexes[i]].dateTargetObtained),
																	'yyyy-MM-dd'),
													"timingCodeNine" : $filter(
															'date')
															(
																	$scope.timingCodeNine,
																	'yyyy-MM-dd'),
													"createdBy" : "jai",
													"createdDate" : new Date(),
													"lastUpdatedBy" : "jai",
													"lastUpdatedDate" : new Date(),
													"dBAction" : $scope.dBAction,
													"compliedByGepsId" : 1234,// loggedInUser.getGepsId()
													"assignedByGepsId" : 1234,// loggedInUser.getGepsId()
													"verifiedByGepsId" : 1234
												}),
										headers : {
											'Content-Type' : 'application/json'
										}
									})
									.success(
											function(data, status, headers,
													config) {
												// console.log(data);
												$scope.count = $scope.count + 1;
												console.log($scope.count);

											})
									.error(
											function(data, status, headers,
													config) {
												$scope.error = 1;
												alert("There is an error while updating updating,Please contact your administrator");
											});
						}
						// console.log($scope.count + ","+
						// $scope.selectedIndexes.length + ","+ $scope.error)
						if ($scope.error == 0) {
							alert("Updated Successfully");
						} else {
							alert("failed");
						}
					}

				});
/*******************************************************************************
 * ******************PACKAGE CONTROLLER *******************************
 * 
 * @author: jeevan-475852 05-FEB-2017
 ******************************************************************************/
/*
 * app .controller( 'packageController', function($scope, $http, exportToCSV,
 * $window, $filter) { $http.get('http://localhost:8080//ibct/Product').then(
 * function(response) {
 * 
 * $scope.productLines = response.data.data; }); $http .get(
 * 'http://localhost:8080//ibct/Bulletin/CodesOptions/BULLETIN_TYPE')
 * .then(function(response) { $scope.bulletinTypes = response.data.data;
 * $scope.bulletinTypes.splice(0, 1); }); $scope.timing = []; $http .get(
 * 'http://localhost:8080//ibct/Bulletin/CodesOptions/TIMING_CODE')
 * .then(function(response) {
 * 
 * $scope.timing = response.data.data; });
 * 
 * $scope.buttonLink = true; $scope.currentPage = 1; $scope.pageSize = 10;
 * 
 * $scope.productSerials = [];
 * 
 * $scope.fillSerials = function() { if (this.packageController.productLines !=
 * null && this.packageController.bulletinTypes != null) {
 * 
 * $http( { method : 'POST', url :
 * 'http://localhost:8080//ibct/Bulletin/ProductSerial', dataType : 'json', data :
 * JSON .stringify({ "productLine" :
 * this.packageController.productLines.productLine, "bulletinTypeCode" :
 * this.packageController.bulletinTypes.codeID
 * 
 * }), headers : { 'Content-Type' : 'application/json' } }) .success(
 * function(data, status, headers, config) {
 * 
 * $scope.productSerials = data.data; if ($scope.productSerials.length == 0) {
 * alert("No serials found for this combination") } console
 * .log($scope.productSerials); }) .error( function(data, status, headers,
 * config) {
 * 
 * alert("An error has occurred while loading serials, Please contact
 * administrator") }); } else { $scope.productSerials = []; } }
 * $scope.engineDetails = []; $scope.selectTCDLink = false; $scope.selectTCNLink =
 * false; $scope.engineReport = []; $scope.getEngineReport = function() { $http
 * .get( 'http://localhost:8080//ibct/Bulletin/CodesOptions/TIMING_CODE_NINE')
 * .then( function(response) {
 * 
 * $scope.timingCodesNine = response.data.data;
 * 
 * }); if (this.packageController.productLines != null &&
 * this.packageController.bulletinTypes != null &&
 * this.packageController.productSerial != null) { $http( { method : 'POST', url :
 * 'http://localhost:8080//ibct/ComplianceEngineDetails', dataType : 'json',
 * data : JSON .stringify({ "productLine" :
 * this.packageController.productLines.productLine, "productSerialNum" :
 * this.packageController.productSerial.productSerialNum
 * 
 * }), headers : { 'Content-Type' : 'application/json' } }) .success(
 * function(data, status, headers, config) {
 * 
 * $scope.engineDetails = data.data; console .log($scope.engineDetails); })
 * .error( function(data, status, headers, config) {
 * 
 * alert("An error has occurred while loading serials, Please contact
 * administrator") }); $http( { method : 'POST', url :
 * 'http://localhost:8080//ibct/ComplianceEnginePackage', dataType : 'json',
 * data : JSON .stringify({ "productLine" :
 * this.packageController.productLines.productLine, "bulletinTypeCode" :
 * this.packageController.bulletinTypes.codeID, "productSerialNum" :
 * this.packageController.productSerial.productSerialNum }), headers : {
 * 'Content-Type' : 'application/json' } }) .success( function(data, status,
 * headers, config) {
 * 
 * $scope.engineReport = data.data; if ($scope.engineReport.length > 0) { }
 * console .log($scope.engineReport) for (i = 0; i < $scope.engineReport.length;
 * i++) { for (j = 0; j < $scope.bulletinCategory.length; j++) { if
 * ($scope.engineReport[i].categoryCode == $scope.bulletinCategory[j].codeID)
 * $scope.engineReport[i].categoryCode = $scope.bulletinCategory[j].codeName; } }
 * for (i = 0; i < $scope.engineReport.length; i++) { for (j = 0; j <
 * $scope.timing.length; j++) { if ($scope.engineReport[i].timingCode ==
 * $scope.timing[j].codeID) $scope.engineReport[i].timingCode =
 * $scope.timing[j].codeName; } } }) .error( function(data, status, headers,
 * config) {
 * 
 * alert("An error has occurred while loading serials, Please contact
 * administrator") }); } else { $scope.engineDetails = []; $scope.engineReport =
 * []; } } $scope.export = function() { $scope.productData = []; $scope.filename =
 * "BulletinComplianceByEngine"; $scope.productData .push({ "ProductLine" :
 * this.packageController.productLines.productLine, "BulletinType" :
 * this.packageController.bulletinTypes.codeDescription, "ProductSerial#" :
 * this.packageController.productSerial.productSerialNum, "ProductModel" :
 * $scope.engineDetails[0].productModelId }) exportToCSV.JSONToCSV(angular
 * .toJson($scope.engineReport), true, $scope.filename, $scope.productData); }
 * $scope.close = function() { $window.location.href = "\#"; }
 * $scope.disableOtherOption = function() { if
 * (this.packageController.engineTargetComplainceDate != null) {
 * $scope.selectTCNLink = true; } else $scope.selectTCNLink = false; if
 * (this.packageController.TargetTimingCodeNine != null) { $scope.selectTCDLink =
 * true; } else $scope.selectTCDLink = false; } $scope.selectedIndex = [];
 * $scope.selectedIndexes = []; $scope.engineReportIndex;
 * $scope.displayComplianceDetails = function(index) {
 * console.log($scope.currentPage); $scope.engineReportIndex =
 * (($scope.currentPage - 1) * 10) + index; $scope.ComplainceDate =
 * $filter('date') ( $scope.engineReport[$scope.engineReportIndex].compliedDate,
 * 'yyyy-MM-dd'); $scope.targetComplainceDate = $filter('date') (
 * $scope.engineReport[$scope.engineReportIndex].targetComplianceDate,
 * 'yyyy-MM-dd'); if
 * ($scope.engineReport[$scope.engineReportIndex].targetComplianceDate != null)
 * $scope.selectTCNLink = true; $scope.targetObtainedDate = $filter('date') (
 * $scope.engineReport[$scope.engineReportIndex].dateTargetObtained,
 * 'yyyy-MM-dd'); $scope.selectedIndex = $scope.engineReportIndex;
 * $scope.selectedIndexes.push($scope.selectedIndex);
 * console.log($scope.selectedIndexes); }
 * 
 * $scope.clearUpdate = function() { var elements =
 * document.getElementsByTagName("input"); var dropdowns =
 * document.getElementsByTagName("select"); console.log(elements.length + "," +
 * dropdowns.length); var i = 0 for (i = 0; i < elements.length; i++) {
 * 
 * if (elements[i].type == "date") { if (elements[i].id == "updateCompliance")
 * elements[i].value = ""; } } for (i = 0; i < dropdowns.length; i++) { if
 * (dropdowns[i].type == "select-one") { if (dropdowns[i].id ==
 * "updateCompliance") { dropdowns[i].value = ""; $scope.selectTCDLink = false; } } }
 * $scope.enginePackageController.bulletinRadioSelected = false; }
 * $scope.bulletinCategory = []; $http .get(
 * 'http://localhost:8080//ibct/Bulletin/CodesOptions/BULLETIN_CATEGORY')
 * .then(function(response) {
 * 
 * $scope.bulletinCategory = response.data.data;
 * 
 * }); $scope.updateDateInTable = function() {
 * 
 * if (this.packageController.engineComplainceDate != null) {
 * $scope.engineReport[$scope.selectedIndex].compliedDate = $filter( 'date') (
 * this.packageController.engineComplainceDate, 'yyyy-MM-dd'); } if
 * (this.packageController.engineTargetComplainceDate != null) {
 * $scope.engineReport[$scope.selectedIndex].targetComplianceDate = $filter(
 * 'date') ( this.packageController.engineTargetComplainceDate, 'yyyy-MM-dd'); }
 * if (this.packageController.TargetTimingCodeNine != null) {
 * $scope.engineReport[$scope.selectedIndex].targetComplianceDate =
 * this.packageController.TargetTimingCodeNine.codeDescription .substr(0, 2); }
 * if (this.packageController.engineTargetObtainedDate != null) {
 * $scope.engineReport[$scope.selectedIndex].dateTargetObtained = $filter(
 * 'date') ( this.packageController.engineTargetObtainedDate, 'yyyy-MM-dd'); } }
 * $scope.updateCompliance = function() {
 * 
 * String bulletinNum = "LM5000-IND-011"; Integer revisionId = 0; String
 * significant = "N"; Date complianceDate = new Date(); Integer productId =
 * 3895; Date targetComplianceDate = new Date(); Date targetObtainedDate = new
 * Date(); Date timingCodeNineDate = new Date(); String createdBy = "Jai"; Date
 * createdDate = new Date(); String lastUpdatedBy = "jai"; Date lastUpdatedDate =
 * new Date();
 * 
 * $scope.dBAction = "DB_ACTION_NEW"; if (angular
 * .isUndefined($scope.engineReport[$scope.selectedIndex].targetComplianceDate)) {
 * $scope.engineReport[$scope.selectedIndex].targetComplianceDate = ""; } //
 * "DB_ACTION_NEW" // DB_ACTION_DELETED // DB_ACTION_UPDATED $http( { method :
 * 'POST', url : 'http://localhost:8080//ibct/ComplianceUpdate', dataType :
 * 'json', data : JSON .stringify({ "bulletinNum" :
 * $scope.engineReport[$scope.selectedIndex].bulletinNum, "revisionId" :
 * $scope.engineReport[$scope.selectedIndex].revId, "significants" :
 * $scope.engineReport[$scope.selectedIndex].significantInd, "complianceDate" :
 * $filter( 'date') ( new Date(
 * $scope.engineReport[$scope.selectedIndex].compliedDate), 'yyyy-MM-dd'),
 * "productId" : 3878, "targetComplianceDate" : $filter( 'date') ( new Date(
 * $scope.engineReport[$scope.selectedIndex].dateTargetObtained), 'yyyy-MM-dd'),
 * "targetObtainedDate" : $filter( 'date') ( new Date(
 * $scope.engineReport[$scope.selectedIndex].targetComplianceDate),
 * 'yyyy-MM-dd'), "timingCodeNine" : $filter( 'date')(new Date(), 'yyyy-MM-dd'),
 * 
 * "createdBy" : "jai", "createdDate" : new Date(), "lastUpdatedBy" : "jai",
 * "lastUpdatedDate" : new Date(), "dBAction" : $scope.dBAction,
 * "compliedByGepsId" : 1234,// loggedInUser.getGepsId() "assignedByGepsId" :
 * 1234,// loggedInUser.getGepsId() "verifiedByGepsId" : 1234 }), headers : {
 * 'Content-Type' : 'application/json' } }).success( function(data, status,
 * headers, config) { console.log(data); alert("success");
 * 
 * }).error( function(data, status, headers, config) { console.log(data);
 * alert("failure"); }); } })
 */

app.controller('welcomeController', function($scope, $location, $window,
		$timeout, $rootScope) {
	// alert("welcomeController");
	$scope.webUrl = $location.url();
	angular.element(document.querySelector('nav')).removeClass("ng-hide");
	angular.element(document.querySelector('body')).removeClass("ng-hide");
	angular.element(document.querySelector('.ng-hide')).removeClass("ng-hide");
	angular.element(document.querySelector('.ng-hide')).removeClass("ng-hide");
	angular.element(document.querySelector('#secondNav'))
			.removeClass("ng-hide");
	angular.element(document.querySelector('#footer')).removeClass("ng-hide");

});
app
		.controller(
				'loginController',
				function($scope, $location, $window, $http) {

					$scope.webUrl = $location.url();
					$scope.userData = [];

					$scope.validate = function() {

						if (this.loginController.username != null
								&& this.loginController.pwd != null) {
							$http(
									{
										method : 'POST',
										url : 'http://localhost:8080//ibct/UserManagement/Authentication',
										dataType : 'json',
										data : JSON
												.stringify({
													"userId" : this.loginController.username,
													"password" : this.loginController.pwd
												}),
										headers : {
											'Content-Type' : 'application/json'
										}
									})
									.success(
											function(data, status, headers,
													config) {

												if (data.statusMessage == "error") {
													alert("Login Failed, please check your credentials");
												} else {
													$scope.userData = data.data;
													// console.log($scope.userData);
													if ($scope.userData != null) {
														// console.log($scope.userData);
														// console.log($scope.userData.roleId);
														localStorage
																.setItem(
																		'roleId',
																		$scope.userData.roleId);
														localStorage
																.setItem(
																		'userName',
																		$scope.userData.userName);
														localStorage
																.setItem(
																		'city',
																		$scope.userData.city);
														localStorage
																.setItem(
																		'location',
																		$scope.userData.location);
														localStorage
																.setItem(
																		'emailId',
																		$scope.userData.emailId);

														$scope.userName = localStorage
																.getItem('userName');
														$scope.city = localStorage
																.getItem('city');
														$scope.location = localStorage
																.getItem('location');
														$scope.emailId = localStorage
																.getItem('emailId');

														$window.location.href = "#welcome";
													} else
														alert("Login Failed, please check your credentials");
												}
											})
									.error(
											function(data, status, headers,
													config) {

												alert("An Error has occured,please contact administrator")
											});
						}

					}
					$scope.getUserName = function() {
						$scope.userName = localStorage.getItem('userName');
						return $scope.userName;
					}
					$scope.validateAdminRole = function() {

						$scope.roleId = localStorage.getItem('roleId');
						if ($scope.roleId == 1 || $scope.roleId == 3) {
							return true;
						} else
							return false;
					}

					$scope.validateReportRole = function() {
						return true;
					}
					$scope.validateITAdminRole = function() {
						$scope.roleId = localStorage.getItem('roleId');
						if ($scope.roleId == 3) {
							return true;
						} else
							return false;

					}

				});
app.controller('AdministratorController', function($scope) {

})
app.controller('userController', function($scope) {

	$scope.userData.roleId = localStorage.getItem('roleId');
	$scope.userData.userName = localStorage.getItem('userName');
	$scope.userData.city = localStorage.getItem('city');
	$scope.userData.location = localStorage.getItem('location');
	$scope.userData.emailId = localStorage.getItem('emailId');
	// console.log($scope.details);
	// console.log($scope.details.userId);
})