import {
  Box,
  Container,
  Text,
  Flex,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

function Homepage() {
  const history = useHistory();
  const [showLogin, setShowLogin] = useState(true); // State to toggle between Login and Signup

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);

  return (
    <Container maxW="full" centerContent p={0} m={0}>
      <Flex
        minH="100vh"
        w="100%"
        align="center"
        justify="space-between"
        bg="linear-gradient(135deg, #87CEEB, #00008B)" // Gradient background
        p={8}
        position="relative"
        overflow="hidden"
      >
        {/* Chat Icons */}
        <div className="chat-icon"></div>
        <div className="chat-icon speech-bubble"></div>
        <div className="chat-icon message"></div>
        <div className="chat-icon typing"></div>
        <div className="chat-icon robot"></div>
        <div className="chat-icon heart"></div>
        <div className="chat-icon mobile"></div>
        <div className="chat-icon group"></div>
        <div className="chat-icon globe"></div>
        <div className="chat-icon notification"></div>

        {/* Sparkles */}
        <div className="sparkle sparkle1"></div>
        <div className="sparkle sparkle2"></div>
        <div className="sparkle sparkle3"></div>
        <div className="sparkle sparkle4"></div>
        <div className="sparkle sparkle5"></div>

        {/* Left Side: Text and Quote */}
        <VStack
          align="flex-start"
          spacing={6}
          w="50%"
          pl={10}
          color="white"
          zIndex={2} // Ensure text is above icons and sparkles
        >
          <Heading fontSize="5xl" fontWeight="bold">
            Welcome to ChatOrbit
          </Heading>
          <Text fontSize="2xl" fontStyle="italic">
            "Where Connections Come to Life"
          </Text>
          <Text fontSize="xl">
            ChatOrbit is your gateway to seamless communication. Connect with
            friends, family, and colleagues in real-time. Share moments, exchange
            ideas, and stay connected like never before.
          </Text>
          <Text fontSize="xl" fontWeight="bold">
            Join the Orbit Today!
          </Text>
        </VStack>

        {/* Right Side: Toggle between Login and Signup */}
        <Box
          w="50%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex={2} // Ensure form is above icons and sparkles
        >
          <Box
            p={8}
            mt={-16}
            boxShadow="lg"
            w="100%"
          >
            {showLogin ? (
              <Login onSignupClick={() => setShowLogin(false)} />
            ) : (
              <Signup onLoginClick={() => setShowLogin(true)} />
            )}
          </Box>
        </Box>
      </Flex>
    </Container>
  );
}

export default Homepage;