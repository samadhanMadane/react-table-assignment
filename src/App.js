import React from 'react';
import { Route, withRouter, Redirect, Switch } from 'react-router-dom';
import './App.css';
import UserPosts from './components/User/UserPosts';

class App extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/user/:userId/posts" exact component={UserPosts} />
          <Redirect to="/user/1/posts" />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
