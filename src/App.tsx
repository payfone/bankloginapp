import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginFetch from './LoginFetch';
import LoginPixel from './LoginPixel';
import LoginPixelModular from './LoginPixelModular';

function App() {
  return (
    <Router>
      <Switch>
          /*
            The fetch and ajax endpoints are identical. It uses AJAX and is the closest approach to the mobile 
            SDK.
          */
          <Route path="/fetch">
            <LoginFetch/>
          </Route> 
          <Route path="/ajax">
            <LoginFetch/>
          </Route>
          
          /*
            The pixel implementation of the web SDK. This method bypasses the CORS restriction by rendering
            the passive resource of a pixel image. This method can be used by all three supported MNO's:
            VZN, TMO and ATT. It is also an example of an orchstrated flow in that the only call
            necessary for authentication is "authenticate"
          */
          <Route path="/pixel">
            <LoginPixel/>
          </Route>

          /**
            The pixel-modular path uses the Non-Orchestrated / Modular Authentication Method where
            the underlying steps are called individually. This approach does require a little more work
            to implement, but it provides the calling project/app with a more granular control of the
            mobile auth process
           */
          <Route path="/pixel-modular">
            <LoginPixelModular/>
          </Route>       

          /*
            Default to the fetch implementation
          */   
          <Route exact path="/">
            <LoginFetch/>
          </Route> 
      </Switch>
    </Router>

  );
}

export default App;
