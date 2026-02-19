import { useEffect } from 'react';
import type { State, Action } from './Base';

export function useLoginFormHandlers(
  dispatch: React.Dispatch<Action>,
  state: State,
  handleLogin: () => void | Promise<void>
) {
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
  }, [state.username, state.password, dispatch]);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.keyCode === 13 || event.which === 13) {
      state.isButtonDisabled || handleLogin();
    }
  };

  const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    console.log('handleUsernameChange');
    dispatch({
      type: 'setUsername',
      payload: event.target.value
    });
  };

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    dispatch({
      type: 'setPassword',
      payload: event.target.value
    });
  };

  return { handleKeyPress, handleUsernameChange, handlePasswordChange };
}
