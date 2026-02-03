import React from "react";
import "./App.css";
import Homepage from "./Pages/Homepage";
import { Route, Switch } from "react-router-dom";
import Chatpage from "./Pages/Chatpage";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import { Box, useColorModeValue } from "@chakra-ui/react";

function App() {
  const appBackground = useColorModeValue(
    "linear-gradient(135deg, #F7FAFF, #D6E4FF)",
    "linear-gradient(135deg, #0F172A, #111827)"
  );

  return (
    <Box className="App" style={{ background: appBackground }}>

      {/* Routes */}
      <Switch>
        <Route path="/" component={Homepage} exact />
        <Route path="/chats" component={Chatpage} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
      </Switch>
    </Box>
  );
}

export default App;
