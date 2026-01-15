import React, { useReducer, useEffect } from 'react';
import {AuthenticatorBuilder} from 'prove-mobile-auth';
import {startStep, finishStep} from './CustomSteps'
import { backendUrlGta, backendUrlCloud, FinishPhoneType, reducer, initialState } from './Base';
import { useLocation } from "react-router-dom";
import LoginForm from './LoginForm';

var backendUrl = ""

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

  // We have two different environments we can run this in
  const { search } = useLocation();
  if (search === "?env=cloud") {
    backendUrl = backendUrlCloud
  }
  else {
    backendUrl = backendUrlGta;
  }
  
 useEffect(() => {
    if (state.username.trim()) {
     dispatch({
       type: 'setIsButtonDisabled',
       payload: false
     });
    } else {
      dispatch({
        type: 'setIsButtonDisabled',
        payload: true
      });
    }
  }, [state.username, state.password]);

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

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.keyCode === 13 || event.which === 13) {
      state.isButtonDisabled || handleLogin();
    }
  };

  const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      console.log('handleUsernameChange');
      dispatch({
        type: 'setUsername',
        payload: event.target.value
      });
    };

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      dispatch({
        type: 'setPassword',
        payload: event.target.value
      });
    }
  return (
    <LoginForm
      state={state}
      onUsernameChange={handleUsernameChange}
      onPasswordChange={handlePasswordChange}
      onKeyPress={handleKeyPress}
      onLogin={handleLogin}
      title="Bank Login App - Fetch"
      buttonText="Login with Fetch"
    />
  );
}
console.log(module);
export default LoginFetch;