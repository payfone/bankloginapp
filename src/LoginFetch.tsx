import { useReducer, useMemo } from 'react';
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

  const params = new URLSearchParams(window.location.search)
  const env = params.get('env')
  backendUrl = getBackendUrl(env)

  const handleLogin = async () => {
    console.log("Ajax/Fetch Flow");

    //set the config to the user name
    globalThis.config = state.username;

    //start the authentication
    var finishRsp = await authenticator.authenticate().catch(
          function error(e){
            console.log('Mobile Auth Failure', e);
          });

    //process the response
    let finish = finishRsp as unknown as FinishPhoneType;
    if(finish != undefined){
      var mobileNumber = finish.mobileNumber;
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
      enablePhoneNumber={false}
    />
  );
}
console.log(module);
export default LoginFetch;