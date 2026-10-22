# Building and Testing the BankLoginApp

## Overview

- This app is hosted on Firebase: bankloginapp.web.app

- Points to the Prove mock customer server (GTA dev server)

- For US tests, enter the username and password of the test config

- For International tests, a phone number is also required

- Pixel flow supports: US, UK, EU, and APAC

  - bankloginapp.web.app/pixel

- Fetch flow supports: US (T-Mobile and Verizon) and UK

  - bankloginapp.web.app/fetch



## Building

#### Option 1: Using tgz SDK File (default)

1. The package.json points to `"prove-mobile-auth": "file:prove-identity-mobile-auth-{version}.tgz`

2. Start the app with `npm start` which by default runs on `localhost:3000`

#### Option 2: Using NPMJS

1. Update package.json to point to NPMJS instead of a local file stored in this repo:
   `"@prove-identity/mobile-auth": "3.3.2"` instead of `"prove-mobile-auth": "file:file_name.tgz`

2. Update callsites to use `@prove-identity/mobile-auth`:

```typescript
//import {AuthenticatorBuilder, DeviceDescriptor} from 'prove-mobile-auth';
import {AuthenticatorBuilder, DeviceDescriptor} from '@prove-identity/mobile-auth';
```

3. Start the app with `npm start` which by default runs on `localhost:3000`

#### Option 3: Using the SDK source code (Prove internal only)

1. In the local web SDK directory (`/js/sdk`), install and build the SDK:

```bash
npm install
npm run build
```

2. Start a watcher on the web SDK: `npm run watch-compile`

3. Update package.json to point top the local web SDK directory:
   `"prove-mobile-auth": "file:{directory path}/js/sdk"`

4. Start the app with `npm start` which by default runs on `localhost:3000`

5. SDK changes and BankLoginApp changes should both hot reload

## Testing

Since a cellular connection is required to run a successful authentication flow, there are a few options to test the BankLoginApp:

#### Option 1: Production testing

1. Navigate to bankloginapp.web.app in the desktop browser

2. Connect the computer to a cellular hotspot

3. Test fetch/pixel flows

###### Alternatively to run on a mobile device:

1. Navigate to bankloginapp.web.app on a mobile device

2. Disable WiFi on the device to force the connection to be over cellular

###### To view console logs and network requests from a mobile device:

**iOS**:

- Connect the iOS device to a computer via USB

- Enable developer mode in Safari

- Under the Develop tab in Safari, select the iPhone and BankLoginApp website

**Android**:

- Connect the Android device to a computer via USB

- Ensure adb is running using `adb devices`

- Open Chrome and navigate to `chrome://inspect/#devices`

- Select the device and the BankLoginApp

#### Option 2: Local testing

1. Download a service like Ngrok or Cloudflare tunnel to create a temporary publically available endpoint

2. Start the BankLoginApp using the steps above

3. Start the tunnel service to access the local app from a mobile device for easy cellular testing
   **Ngrok**: `ngrok http 3000` 

   **Cloudflare**: `cloudflared tunnel --url http://localhost:3000`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.