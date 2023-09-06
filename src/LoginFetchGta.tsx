import React, { useReducer, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import {AuthenticatorBuilder} from 'prove-mobile-auth';

//const backendUrl = 'https://us-central1-prove-testapp.cloudfunctions.net/api/mobile_auth/v1';
const backendUrl = 'https://gta.dev.prove-auth.proveapis.com/mobile_auth/v1';

var config = '';

const authenticator = new AuthenticatorBuilder()
    .withFetchImplementation()
    .withDeviceIpDetection()
    .withStartStep({
      execute : async (input: any)=>{
        console.log(input);
        const response = await fetch(backendUrl+'/start?deviceIp='+input.deviceDescriptor.ip
        +'&configurationName='+config);
        var json;
        
        try {
          json = await response.json();
        } catch (e) {
          console.log(e)
        }

        if (response.status !== 200) {
          throw new Error(json && json.error ? json.error : 'invalid response status code '+response.status);
        }
        return { authUrl : json.redirectTargetUrl }
      }
    })
    .withFinishStep({
      execute : async (input: any)=>{
        console.log(input);
        const response = await fetch(backendUrl+'/finish?vfp='+input.vfp+'&configurationName='+config);
        var json;
        
        try {
          json = await response.json();
          var jsonFinishRsp = JSON.stringify(json.phoneInfo);
          console.log('finish phone number ?' + jsonFinishRsp)
        } catch (e) {
          console.log(e)
        }

        if (response.status !== 200) {
          throw new Error(json && json.error ? json.error : 'invalid response status code '+response.status);
        }
        return json.phoneInfo
      }
    })
    .build();


type FinishRspType = { 
  mobileNumber: string, 
  mobileOperatorName: string,
  mobileCountryCode: string,
  payfoneAlias: string 
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      width: 400,
      margin: `${theme.spacing(0)} auto`
    },
    loginBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1
    },
    header: {
      textAlign: 'center',
      background: '#212121',
      color: '#fff'
    },
    card: {
      marginTop: theme.spacing(10)
    }
  })
);

//state type
type State = {
  username: string
  password:  string
  isButtonDisabled: boolean
  helperText: string
  isError: boolean
};

const initialState:State = {
  username: '',
  password: '',
  isButtonDisabled: true,
  helperText: '',
  isError: false,
};

type Action = { type: 'setUsername', payload: string }
  | { type: 'setPassword', payload: string }
  | { type: 'setIsButtonDisabled', payload: boolean }
  | { type: 'loginSuccess', payload: string }
  | { type: 'loginFailed', payload: string }
  | { type: 'setIsError', payload: boolean }
  | { type: 'tryPasswordLogin', payload: boolean }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setUsername': 
      return {
        ...state,
        username: action.payload
      };
    case 'setPassword': 
      return {
        ...state,
        password: action.payload
      };
    case 'setIsButtonDisabled': 
      return {
        ...state,
        isButtonDisabled: action.payload
      };
    case 'loginSuccess': 
      return {
        ...state,
        helperText: action.payload,
        isError: false
      };
    case 'loginFailed': 
      return {
        ...state,
        helperText: action.payload,
        isError: true
      };
    case 'setIsError': 
      return {
        ...state,
        isError: action.payload
      };
    case 'tryPasswordLogin':
      return{
      ...state
    };
  }
}

const LoginFetchGta = () => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.username.trim() /*&& state.password.trim()*/) {
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
    config = state.username;

    //start the authentication
    var finishRsp = await authenticator.authenticate().catch(
          function error(e){
            console.log('Mobile Auth Failure', e);
          });

    //process the response
    let finish = finishRsp as unknown as FinishRspType;
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
export default LoginFetchGta;