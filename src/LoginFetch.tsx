import React, { useReducer, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import {AuthenticatorBuilder} from 'prove-mobile-auth';
import {startStep, finishStep} from './CustomSteps'
import { backendUrlGta, backendUrlCloud, FinishPhoneType, useStyles, reducer, initialState } from './Base';
import { useLocation } from "react-router-dom";

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
  const classes = useStyles();
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
export default LoginFetch;