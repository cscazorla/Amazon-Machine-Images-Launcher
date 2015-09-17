angular.module('amilauncherApp', [])
.controller('amilauncherController', ['$scope', function($scope) {

    // AWS Configuration
    $scope.config = {
      accessKeyId:'',
      secretAccessKey:'',
      region: 'us-east-1'
    };

    // List of available AMIs
    $scope.amis = [
      {name:'WordPress 4.3.1-0 (64-bit)', ebs:'ami-b73d4bd2'},
      {name:'WordPress 4.3.1-0 (32-bit)', ebs:'ami-bf3d4bda'},
      {name:'WordPress Multisite 4.3.1-0 (64-bit)', ebs:'ami-db3e48be'},
      {name:'WordPress Multisite 4.3.1-0 (32-bit)', ebs:'ami-df3e48ba'}
    ];

    // Array with current deployed instances
    $scope.instances = [];

    // Alert messages
    $scope.textAlert = "";
    $scope.alertVisible = false;

    // Show a new alert to the user
    $scope.newAlert = function(text) {
      $scope.textAlert = text;
      $scope.alertVisible = true;
    };

    // Generic function to switch flag
    $scope.switchBool = function(value) {
       $scope[value] = !$scope[value];
    };

    // Helper to print the state of an instance
    $scope.getInstanceStateClass = function(instance){
      var stateName = instance.State.Name;
     if(stateName=="running")
        return "text-succes";
     else if(stateName=="terminated")
         return "text-danger";
     else
         return "text-warning";
    }

    // To check if an instance is Running
    $scope.isInstanceRunning = function(instance){
     if(instance.State.Name=="running")
        return true;
     else
         return false;
    }

    // To check if an instance is Terminated
    $scope.isInstanceTerminated = function(instance){
     if(instance.State.Name=="terminated")
        return true;
     else
         return false;
    }

    // Add a new AMI to the catalogue
    $scope.addAMI = function() {
      $scope.amis.push({name:$scope.aminame, ebs:$scope.amiebs});
      $scope.aminame = '';
      $scope.amiebs = '';
    };

    // Deploy an instance from an AMI
    $scope.deployAMI = function(imageId) {
      var params = {
        ImageId: imageId,
        InstanceType: 't1.micro',
        SecurityGroupIds:['sg-5cf9c23b'],
        MinCount: 1, MaxCount: 1
      };
      var ec2 = new AWS.EC2();
      $scope.newAlert("Deploying instance... ");
      ec2.runInstances(params, function(err, data) {
        if (err) { $scope.newAlert("Could not create instance. " + err); return; }

        var instanceId = data.Instances[0].InstanceId;
        ec2.waitFor('instanceRunning', {InstanceIds: [instanceId]}, function(err, data) {
          if (err) $scope.newAlert("Error: "+error);
          else
          {
            $scope.instancesReload();
          }
        });
        $scope.instancesReload();

      });
    };

    // Delete a deployed instance
    $scope.deleteInstance = function(instanceId) {
      var params = {
        InstanceIds: [
          instanceId,
        ],
        DryRun: false
      };
      $scope.newAlert("Terminating instance ...");
      new AWS.EC2().terminateInstances(params, function(err, data) {
        if (err)
        $scope.newAlert("Could not terminate instance: "+err);
        else
        {

          new AWS.EC2().waitFor('instanceTerminated', params, function(err, data) {
            if (err) $scope.newAlert("Could not terminate instance: "+err);
            else     $scope.instancesReload();
          });
        }
        $scope.instancesReload();
      });
    };


    // Main function to reload UI
    $scope.instancesReload = function(){
      $scope.alertVisible = false;
      AWS.config = $scope.config;
      var ec2 = new AWS.EC2();
      ec2.describeInstances(function(error, data) {
        if (error) {
          // an error occurred
          $scope.newAlert("Error connecting with AWS. Please check credentials");
        } else {
          // request succeeded
          var instances_temp = [];
          data.Reservations.forEach(function(instance,i){
            instance=instance.Instances[0];
            instances_temp.push(instance);
          });
          //console.log(instances_temp);
          $scope.$apply(function(){
            $scope.instances = instances_temp;
          });
        }

      });
    }
    $scope.instancesReload();
}]);
