import { useReducer } from 'react';
import {AuthenticatorBuilder, DeviceDescriptor} from 'prove-mobile-auth';
import { FinishType, useStyles, reducer, initialState } from './Base';
import  {startStep, finishStep } from './CustomSteps'
import { useLoginFormHandlers } from './useLoginFormHandlers';
import LoginForm from './LoginForm';
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


const LoginPixelModular = () => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);

  const params = new URLSearchParams(window.location.search)
  const env = params.get('env')
  backendUrl = getBackendUrl(env)
  flowPath = getFlowPath(env)
   
  /**
   * A modular login. The steps must be executed in the defined sequence but the caller could include additional logic
   * or otherwise manage this flow explicitly.
   */
  const modularAuthenticate = async () => {
    console.log("A")
    var ip = await authenticator.findMyIp()
    console.log("B: " + ip)
    var deviceDescriptor = new DeviceDescriptor(ip)
    console.log("C")
    var authUrl = await authenticator.startStep(deviceDescriptor)
    console.log("D")
    var vfp = await authenticator.authenticateWithRedirect(deviceDescriptor, authUrl)
    console.log("E")
    await authenticator.finishStep(deviceDescriptor, vfp)
    console.log("F")
  }

  const handleLogin = async () => {
    console.log('Modular Single Pixel Flow','');


    //set the config to the user name
    globalThis.config = state.username;

    await modularAuthenticate().catch(
      function error(e){
        console.log('Mobile Auth Failure', e);
      });

    // "pixel" implementation does not return result to the client.
    // We need to fetch it from the server and server must expose it.
    // Our demo server stores the result in a database under requestId key.        
    const finishFullRsp = await fetch(backendUrl + '/result_with_pixel?requestId='+ globalThis.startRequestId);
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
    if(finish !== undefined){
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
    useLoginFormHandlers(dispatch, state, handleLogin);

  return (
    <LoginForm
      state={state}
      onUsernameChange={handleUsernameChange}
      onPasswordChange={handlePasswordChange}
      onKeyPress={handleKeyPress}
      onLogin={handleLogin}
      title="Bank Login App - Pixel"
      buttonText="Login with Pixel"
    />
  );
}
console.log(module);
export default LoginPixelModular;
