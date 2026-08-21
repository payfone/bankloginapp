import { useReducer, useState } from 'react';
import {startStep, finishStep} from "./CustomSteps"
import { FinishType, reducer, initialState } from './Base';
import { AuthenticatorBuilder } from 'prove-mobile-auth';
import LoginConversionForm from './LoginConversionForm';
import { useLoginFormHandlers } from './useLoginFormHandlers';
import { getBackendUrl, getFlowPath } from './backendUtils'

var backendUrl = ""
var flowPath = ""

const authenticator = new AuthenticatorBuilder()
    .withPixelImplementation()
    .withDeviceIpDetection()
    .withStartStep({
      execute : async (input: any)=>{
        return { authUrl : await startStep(input, flowPath, backendUrl)}
      }
    })
    .withFinishStep({
      execute : async (input: any)=>{
        return await finishStep(input, backendUrl);
      }
    })
    .build();

const LoginPixelCallbackConversion = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [authComplete, setAuthComplete] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pixelImageSrc, setPixelImageSrc] = useState<string | null>(null);

  const params = new URLSearchParams(window.location.search)
  const env = params.get('env')
  backendUrl = getBackendUrl(env)
  flowPath = getFlowPath(env)

  const handleAuthenticate = async () => {
    console.log('Pixel Callback Conversion - Authenticate','');

    //set the config to the user name
    globalThis.config = state.username;
    globalThis.phoneNumber = phoneNumber.trim() || undefined;

    //start the authentication
    await authenticator.authenticate().catch(
      function error(e: any) {
        console.log('Mobile Auth Failure', e);
      }
    );

    setAuthComplete(true);
  };

  const handleConvertAndLoadImage = () => {
    console.log('Pixel Callback Conversion - Convert and Load Image', callbackUrl);

    const parsed = new URL(callbackUrl.trim());
    const query = new URLSearchParams(parsed.search);
    if (!query.has('configurationName') && globalThis.config) {
      query.set('configurationName', globalThis.config);
    }

    // Prevent caching of the pixel image by adding a timestamp
    query.set('_ts', String(Date.now()));

    const convertUrl = `${backendUrl}/convert_callback_pixel?${query.toString()}`;
    console.log('Loading convert_callback_pixel as image', convertUrl);
    setPixelImageSrc(convertUrl);
  };

  const handleFetchResult = async () => {
    console.log('Pixel Callback Injection - Fetch Result','');

    // "pixel" implementation does not return result to the client.
    // we need to fetch it from the server, and server must expose it somehow  
    // our demo server stores the result in a database under requestId key.    
    const finishFullRsp = await fetch(backendUrl+'/result_with_pixel?requestId='+ globalThis.startRequestId);
    var result = '';
    if (finishFullRsp.status !== 200) {
        throw new Error('Cannot get results for pixel auth ('+finishFullRsp.status+')');
    } else {
      result = await finishFullRsp.json();
      console.log('Result: ', result);
    }

    //process the response
    let finish = result as unknown as FinishType;
    console.log('Finish', finish);
    if(finish != undefined){
      var mobileNumber = finish.phoneInfo.mobileNumber;
      console.log('Mobile Auth Success ' + mobileNumber);
      state.isError = false;
      let payloadString =  'Successful Login with Mobile Number ' + mobileNumber;

      dispatch({
        type: 'loginSuccess',
        payload: payloadString
        });
    }
    else{
      console.log('Mobile Auth Failed ');
      state.isError = true;
      dispatch({
            type: 'loginFailed',
            payload: 'Failed Login with Mobile Auth'
      });
    }

  };

  const { handleKeyPress, handleUsernameChange, handlePasswordChange } =
    useLoginFormHandlers(dispatch, state, handleAuthenticate);

  return (
    <LoginConversionForm
      state={state}
      onUsernameChange={handleUsernameChange}
      onPasswordChange={handlePasswordChange}
      onKeyPress={handleKeyPress}
      onAuthenticate={handleAuthenticate}
      phoneNumber={phoneNumber}
      onPhoneNumberChange={(event) => setPhoneNumber(event.target.value)}
      callbackUrl={callbackUrl}
      onCallbackUrlChange={(event) => setCallbackUrl(event.target.value)}
      onConvertAndLoadImage={handleConvertAndLoadImage}
      onFetchResult={handleFetchResult}
      pixelImageSrc={pixelImageSrc}
      isConvertDisabled={!authComplete}
      isFetchResultDisabled={!authComplete}
    />
  );
}
console.log(module);
export default LoginPixelCallbackConversion;
