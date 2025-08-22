 import React, { useReducer, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';

import {AuthenticatorBuilder, DeviceDescriptor} from 'prove-mobile-auth';
import { FinishType, useStyles, reducer, initialState } from './Base';
import {startStep, finishStep} from './CustomSteps'

const backendUrl = 'https://gta.dev.prove-auth.proveapis.com/mobile_auth/v1';

const authenticator = new AuthenticatorBuilder()
    .withPixelImplementation()
    .withDeviceIpDetection()
    .withStartStep({
      execute : async (input: any)=>{
        return { authUrl : await startStep(input, 'pixel-gta')}
      }
    })
    .withFinishStep({
      execute : async (input: any)=>{
        return await finishStep(input);
      }
    })
    .build();


const LoginPixelModular = () => {

  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * A modular login. The steps must be executed in the defined sequence but the caller could include additional logic
   * or otherwise manage this flow explicitly.
   */
  const authenticate = async () => {
    var ip = await authenticator.findMyIp()
    var deviceDescriptor = new DeviceDescriptor(ip = ip)
    var authUrl = await authenticator.startStep(deviceDescriptor)
    var vfp = await authenticator.authenticateWithRedirect(deviceDescriptor, authUrl)
    await authenticator.finishStep(deviceDescriptor, vfp)
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
    console.log('Single Pixel Flow','');

    //set the config to the user name
    globalThis.config = state.username;

    await authenticate().catch(
      function error(e){
        console.log('Mobile Auth Failure', e);
      });

    // "pixel" implementation does not return result to the client.
    // We need to fetch it from the server and server must expose it.
    // Our demo server stores the result in a database under requestId key.        
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
    <form className={classes.container} noValidate autoComplete="off">
      <Card className={classes.card}>
        <CardHeader className={classes.header} title="Bank Login App" />
        <CardContent>
          <div>
            <TextField
              error={state.isError}
              fullWidth
              id="username"
              type="email"
              label="Username"
              placeholder="Username"
              margin="normal"
              onChange={handleUsernameChange}
              onKeyPress={handleKeyPress}
            />
            <TextField
              error={state.isError}
              fullWidth
              id="password"
              type="password"
              label="Password"
              placeholder="Password"
              margin="normal"
              helperText={state.helperText}
              onChange={handlePasswordChange}
              onKeyPress={handleKeyPress}
            />
          </div>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            className={classes.loginBtn}
            onClick={handleLogin}
            disabled={state.isButtonDisabled}>
            Login
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
console.log(module);
export default LoginPixelModular;
