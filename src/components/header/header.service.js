(function(){
	angular.module('app.header')
	.factory('ToolsService',toolsService);

	function toolsService(){
		var service={
			toolsObj:{
				showChart:false,
				showTable:true
			},
			showChart:showChart,
			showTabular:showTabular
		}

		return service;

		function showChart(){
			service.toolsObj.showChart=true;
			service.toolsObj.showTable=false;
		}

		function showTabular(){
			service.toolsObj.showTable=true;
			service.toolsObj.showChart=false;
		}
	}
})();