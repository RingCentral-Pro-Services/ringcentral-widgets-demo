# RingCentral Widgets Demo

A new RingCentral Widgets Based demo app. Get online tutorial about how to build this app in [here](https://embbnux.github.io/ringcentral-widgets-demo/).

# From John

This was based off the hard work of Embbnux at RingCentral. He helped quite a bit in getting this to a state where I could develop for it, but he's not familiar with the actual FreshDesk code. Just keep that in mind if you reach out to him. 

## Prerequisites

* Install Node.js with version >= 8
* Install NPM or Yarn
* Create a [RingCentral developer free account](https://developer.ringcentral.com) to create a new app with platform type - "Browser Based"
* Install [Ringcentral Widgets CLI](https://github.com/ringcentral/ringcentral-js-widgets/tree/master/packages/ringcentral-widgets-cli)

```bash
$ npm install -g ringcentral-widgets-cli
```

## Start

### Initialize Widgets App by `Ringcentral Widgets CLI`

```bash
$ rc-widgets new ringcentral-widgets-demo
$ cd ringcentral-widgets-demo
$ yarn
```

### Update config file `.env`

```
RINGCENTRAL_CLIENT_ID=your ringcentral app client id
RINGCENTRAL_CLIENT_SECRET=your ringcentral app client secret
RINGCENTRAL_SERVER_URL=ringcentral api server, eg: https://platform.devtest.ringcentral.com
REDIRECT_URI=your redirect uri, eg: https://localhost:8080/redirect.html
```

To test using the Denver Lab account...

```
RINGCENTRAL_CLIENT_ID=jFDh7cPXS_61tjxY-_pVpw
RINGCENTRAL_CLIENT_SECRET=6sD36jjcTNaBqHn6y-yp4AdMn4FPMHRqatWQF-VCUnSQ
RINGCENTRAL_SERVER_URL=https://platform.ringcentral.com
REDIRECT_URI=https://localhost:8080/redirect.html
```

Login: 
13213042353 - RingCentral1 - - UID: 305655028

### Start Development Server

```bash
$ yarn start
```

### Load extension in Chrome

There's two ways to load an extension, one is through the Chrome Web Store (production) the other is through local host and developer mode in Chrome.

What the extension does, is just points chrome to a web address. The web address holds *all* the code that actually runs and does work. 

In the ```extension``` folder, that's where the code from Chrome goes. There's two things that are important in there, at the moment. 

```extension/manifest.json```
and
```extension/standalong.html```

In those two files are the address that the extension will use to point to the right stuff. Right now the AWS S3 bucket address is ```https://s3.amazonaws.com/freshdesk-test-webphone/``` and there's no need to change that. In one of the files, there's a trailing index.html and that's supposed to be there. 

So, if you need to run in local mode, this changes to ```https://localhost:8080```. 

Then you add the local version of the extension to your chrome window. Go to the three dots at the top right of chrome. More tools. Extensions. There's a button at the top right of that window to user developer move. You then can load an unpacked extension. This is the ```extension``` folder. 

IF you need to change the code, and upload that code to AWS S3 bucket, you first run a ```yarn build``` to create a production version of your code, then go to the bucket above, and delete everything in it. Upload the files that are in the ```release``` folder, and make them all public. Since the chrome extension that NAMB is using already points there, they'll get the changes automagically. 

### Making changes 

The only files you might need to change are ```src/modules/FreshDeskAdapter/index.js``` and ```src/modules/FreshDeskAdapter/freshDeskClient.js```. The first file watches for new calls in the app, and pulls functions from the second file to handle stuff. 

In short order, when a call is "Ringing", then we pull information about the currernt FreshDesk user (used for ticket creation). When call changes to "CallConnected", we create a new ticket with information about the caller and user. When call goes to "NoCall" we then update that ticket ID with the length of the call. 

There's comments out the wazu in those two files, so I won't repeat to much here. 

### Build for production

Update `REDIRECT_URI` and `RINGCENTRAL_SERVER_URL` with config in production

```
RINGCENTRAL_SERVER_URL=https://platform.ringcentral.com
REDIRECT_URI=your_host_address/redirect.html
```

```bash
$ HOSTING_URL=your_web_host_uri yarn build
```

Upload files in release folder to your web host.