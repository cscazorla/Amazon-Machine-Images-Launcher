# AMI Launcher
Proof of concept of [AWS SDK for JavaScript in the Browser](https://aws.amazon.com/es/sdk-for-browser/)  and [AngularJS](https://angularjs.org/).

## Installation
There are no dependencies in the project. Both AngularJS and Bootstrap are loaded via CDN.

Just download files an locate them in your web server.

## How to use it
First of all fill your AWS Credentials in and press "Connect" (credentials are not persistently stored). The system will automatically connect to AWS and browse current deployed instances. You can delete any of them or go to its Public URL.

In order to deploy a new Amazon Machine Image (AMI) just press the "Deploy" button from Available Amazon Machine Images list. New AMIs may be added via the form.

## Important
This proof of concept doesn't store your credentials. It reads Access Key ID and Secret Access Key from the form every time a new request is made.
