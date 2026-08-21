import React from 'react';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { State, useStyles } from './Base';

type UrlValidationStatus = 'empty' | 'valid' | 'invalid';

function getUrlValidationStatus(value: string): UrlValidationStatus {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'empty';
  }
  try {
    new URL(trimmed);
    return 'valid';
  } catch {
    return 'invalid';
  }
}

const URL_FIELD_COLORS: Record<UrlValidationStatus, string> = {
  empty: '#ed6c02',
  valid: '#2e7d32',
  invalid: '#d32f2f',
};

const URL_FIELD_HELPER: Record<UrlValidationStatus, string> = {
  empty: 'Paste callback URL',
  valid: 'Valid callback URL',
  invalid: 'Invalid callback URL',
};

const useConversionStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginTop: theme.spacing(2),
      width: '100%',
    },
    imageContainer: {
      marginTop: theme.spacing(2),
      padding: theme.spacing(1),
      border: '1px dashed #979797',
      borderRadius: 4,
      minHeight: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fafafa',
    },
    imagePlaceholder: {
      color: '#979797',
      fontSize: 12,
    },
    pixelImage: {
      maxWidth: '100%',
      imageRendering: 'pixelated',
    },
    urlEmpty: {
      '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
        borderColor: URL_FIELD_COLORS.empty,
      },
      '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: URL_FIELD_COLORS.empty,
      },
      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: URL_FIELD_COLORS.empty,
      },
      '& .MuiInputLabel-root': {
        color: URL_FIELD_COLORS.empty,
      },
      '& .MuiFormHelperText-root': {
        color: URL_FIELD_COLORS.empty,
      },
    },
    urlValid: {
      '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
        borderColor: URL_FIELD_COLORS.valid,
      },
      '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: URL_FIELD_COLORS.valid,
      },
      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: URL_FIELD_COLORS.valid,
      },
      '& .MuiInputLabel-root': {
        color: URL_FIELD_COLORS.valid,
      },
      '& .MuiFormHelperText-root': {
        color: URL_FIELD_COLORS.valid,
      },
    },
    urlInvalid: {
      '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
        borderColor: URL_FIELD_COLORS.invalid,
      },
      '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: URL_FIELD_COLORS.invalid,
      },
      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: URL_FIELD_COLORS.invalid,
      },
      '& .MuiInputLabel-root': {
        color: URL_FIELD_COLORS.invalid,
      },
      '& .MuiFormHelperText-root': {
        color: URL_FIELD_COLORS.invalid,
      },
    },
  })
);

interface LoginConversionFormProps {
  state: State;
  onUsernameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (event: React.KeyboardEvent) => void;
  onAuthenticate: () => void;
  phoneNumber?: string;
  onPhoneNumberChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  callbackUrl: string;
  onCallbackUrlChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onConvertAndLoadImage: () => void;
  onFetchResult?: () => void;
  pixelImageSrc?: string | null;
  isConvertDisabled?: boolean;
  isFetchResultDisabled?: boolean;
  showFetchResult?: boolean;
  convertButtonText?: string;
  title?: string;
}

const LoginConversionForm: React.FC<LoginConversionFormProps> = ({
  state,
  onUsernameChange,
  onPasswordChange,
  onKeyPress,
  onAuthenticate,
  phoneNumber = '',
  onPhoneNumberChange,
  callbackUrl,
  onCallbackUrlChange,
  onConvertAndLoadImage,
  onFetchResult,
  pixelImageSrc,
  isConvertDisabled = true,
  isFetchResultDisabled = true,
  showFetchResult = true,
  convertButtonText = "Convert and Load Image",
  title = "Bank Login App - Pixel Callback Injection",
}) => {
  const classes = useStyles();
  const conversionClasses = useConversionStyles();
  const urlStatus = getUrlValidationStatus(callbackUrl);
  const urlStatusClass = {
    empty: conversionClasses.urlEmpty,
    valid: conversionClasses.urlValid,
    invalid: conversionClasses.urlInvalid,
  }[urlStatus];

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
            <TextField
              fullWidth
              id="phoneNumber"
              type="tel"
              label="Phone Number (optional)"
              placeholder=""
              margin="normal"
              value={phoneNumber}
              onChange={onPhoneNumberChange}
              onKeyPress={onKeyPress}
            />
            <Button
              variant="contained"
              size="large"
              color="secondary"
              className={conversionClasses.button}
              onClick={onAuthenticate}
              disabled={state.isButtonDisabled}
            >
              Authenticate
            </Button>
            <TextField
              fullWidth
              id="callbackUrl"
              label="Callback URL"
              placeholder="Paste callback URL here"
              margin="normal"
              multiline
              rows={4}
              variant="outlined"
              value={callbackUrl}
              onChange={onCallbackUrlChange}
              helperText={URL_FIELD_HELPER[urlStatus]}
              className={urlStatusClass}
              error={urlStatus === 'invalid'}
            />
            <Button
              variant="contained"
              size="large"
              color="primary"
              className={conversionClasses.button}
              onClick={onConvertAndLoadImage}
              disabled={isConvertDisabled || urlStatus !== 'valid'}
            >
              {convertButtonText}
            </Button>
            <div className={conversionClasses.imageContainer}>
              {pixelImageSrc ? (
                <img
                  src={pixelImageSrc}
                  alt="Converted callback pixel"
                  className={conversionClasses.pixelImage}
                />
              ) : (
                <span className={conversionClasses.imagePlaceholder}>
                  Pixel image will appear here
                </span>
              )}
            </div>
            {showFetchResult && onFetchResult && (
              <Button
                variant="contained"
                size="large"
                color="primary"
                className={conversionClasses.button}
                onClick={onFetchResult}
                disabled={isFetchResultDisabled}
              >
                Fetch Result
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default LoginConversionForm;
