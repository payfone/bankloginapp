import { useReducer, useState } from 'react';
import {AuthenticatorBuilder} from 'prove-mobile-auth';
import {startStep, finishStep} from './CustomSteps'
import LoginForm from './LoginForm';
import { useLoginFormHandlers } from './useLoginFormHandlers';
import { getBackendUrl } from './backendUtils'
import { reducer, initialState, FinishPhoneType } from './Base';

var backendUrl: string = "";

const authenticator = new AuthenticatorBuilder()
    .withFetchImplementation()
    .withDeviceIpDetection()
    .withStartStep({
      execute : async (input: any)=>{
        return { authUrl : await startStep(input, 'fetch', backendUrl)}
      }
    })
    .withFinishStep({
      execute : async (input: any)=>{
        return await finishStep(input, backendUrl);
      }
    })
    .build();


const LoginFetch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [phoneNumber, setPhoneNumber] = useState('');

  const params = new URLSearchParams(window.location.search)
  const env = params.get('env')
  backendUrl = getBackendUrl(env)

  const handleLogin = async () => {
    console.log("Ajax/Fetch Flow");

    //set the config to the user name
    globalThis.config = state.username;
    globalThis.bearerToken = state.password.trim() || undefined;
    globalThis.phoneNumber = phoneNumber.trim() || undefined;

    //start the authentication
    var finishRsp = await authenticator.authenticate().catch(
          function error(e){
            console.log('Mobile Auth Failure', e);
          });

    //process the response
    let finish = finishRsp as unknown as FinishPhoneType;
    if(finish !== undefined){
      const mobileNumber = finish.mobileNumber;
      const authenticated = finish.authenticated;
      let payloadString = '';

      if (mobileNumber) { // US successful login
        console.log('Mobile Auth Success, returned phone number: ' + mobileNumber);
        payloadString = 'Successful Login with Mobile Number ' + mobileNumber;
      } else if (authenticated !== undefined) { // International successful login
        console.log('Authentication Result: ' + authenticated);
        payloadString = authenticated ? 'Successful Authentication' : 'Flow completed with authentication false';
      } else {
        console.log('Authentication Failed, missing phone number or authenticated result');
        payloadString = 'Missing phone number or authenticated result';
      }

      state.isError = false;

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
    useLoginFormHandlers(dispatch, state, handleLogin);

  return (
    <LoginForm
      state={state}
      onUsernameChange={handleUsernameChange}
      onPasswordChange={handlePasswordChange}
      onKeyPress={handleKeyPress}
      onLogin={handleLogin}
      title="Bank Login App - Fetch"
      buttonText="Login with Fetch"
      enablePhoneNumber={true}
      phoneNumber={phoneNumber}
      onPhoneNumberChange={(event) => setPhoneNumber(event.target.value)}
    />
  );
}
console.log(module);
export default LoginFetch;