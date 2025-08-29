import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const backendUrlGta = 'https://gta.dev.prove-auth.proveapis.com/mobile_auth/v1';
export const backendUrlCloud = 'https://us-central1-prove-testapp.cloudfunctions.net/api/mobile_auth/v1';

/**
 * Exports that are required by all of the flows
 */
export type FinishType = {
  requestId: string,
  phoneInfo: FinishPhoneType
};

export type FinishPhoneType = { 
  mobileNumber: string, 
  mobileOperatorName: string,
  mobileCountryCode: string,
  payfoneAlias: string 
};

export type State = {
  username: string
  password:  string
  isButtonDisabled: boolean
  helperText: string
  isError: boolean
};

export type Action = { type: 'setUsername', payload: string }
  | { type: 'setPassword', payload: string }
  | { type: 'setIsButtonDisabled', payload: boolean }
  | { type: 'loginSuccess', payload: string }
  | { type: 'loginFailed', payload: string }
  | { type: 'setIsError', payload: boolean }
  | { type: 'tryPasswordLogin', payload: boolean }


export const useStyles = makeStyles((theme: Theme) =>
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
      background: '#979797',
      color: '#fff'
    },
    card: {
      marginTop: theme.spacing(10)
    }
  })
);


export const initialState:State = {
  username: '',
  password: '',
  isButtonDisabled: true,
  helperText: '',
  isError: false,
};

export const reducer = (state: State, action: Action): State => {
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
