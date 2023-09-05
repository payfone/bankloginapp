import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginFetch from './LoginFetch';
import LoginFetchGta from './LoginFetchGta';
import LoginPixel from './LoginPixel';
import LoginPixelGta from './LoginPixelGta';

function App() {
  return (
    <Router>
      <Switch>
          <Route path="/fetch">
            <LoginFetch/>
          </Route> 
          <Route path="/ajax">
            <LoginFetch/>
          </Route> 
          <Route path="/pixel">
            <LoginPixel/>
          </Route>
          <Route exact path="/pixel-gta">
            <LoginPixelGta/>
          </Route>
          <Route exact path="/fetch-gta">
            <LoginFetchGta/>
          </Route>
          <Route exact path="/">
            <LoginFetch/>
          </Route>  
      </Switch>
    </Router>

  );
}

export default App;
