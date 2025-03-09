import React from "react";
import "./App.css";
import Homepage from "./Pages/Homepage";
import { Route, Switch } from "react-router-dom";
import Chatpage from "./Pages/Chatpage";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";

function App() {
  return (
    <div className="App">
     

      {/* Routes */}
      <Switch>
        <Route path="/" component={Homepage} exact />
        <Route path="/chats" component={Chatpage} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
      </Switch>
    </div>
  );
}

export default App;