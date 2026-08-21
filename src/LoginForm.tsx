import React from 'react';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import { State, useStyles } from './Base';

// Props interface for the LoginForm component
interface LoginFormProps {
  state: State;
  onUsernameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (event: React.KeyboardEvent) => void;
  onLogin: () => void;
  title?: string;
  buttonText?: string;
  enablePhoneNumber?: boolean;
  phoneNumber?: string;
  onPhoneNumberChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Reusable LoginForm component that can be used across different authentication flows
 * This component handles the UI rendering and delegates business logic to parent components
 */
const LoginForm: React.FC<LoginFormProps> = ({
  state,
  onUsernameChange,
  onPasswordChange,
  onKeyPress,
  onLogin,
  title = "Bank Login App",
  buttonText = "Login",
  enablePhoneNumber = false,
  phoneNumber = '',
  onPhoneNumberChange,
}) => {
  const classes = useStyles();

  return (
    <form className={classes.container} noValidate autoComplete="off">
      <Card className={classes.card}>
        <CardHeader className={classes.header} title={title} />
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
              onChange={onUsernameChange}
              onKeyPress={onKeyPress}
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
              onChange={onPasswordChange}
              onKeyPress={onKeyPress}
            />
            {enablePhoneNumber && (
              <TextField
                fullWidth
                id="phoneNumber"
                type="tel"
                label="Phone Number (international only)"
                placeholder=""
                margin="normal"
                value={phoneNumber}
                onChange={onPhoneNumberChange}
                onKeyPress={onKeyPress}
              />
            )}
          </div>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            className={classes.loginBtn}
            onClick={onLogin}
            disabled={state.isButtonDisabled}
          >
            {buttonText}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export default LoginForm;

