import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack, Box, Heading, Text } from "@chakra-ui/layout";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Login = ({ onSignupClick }) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const { setUser } = ChatState();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <Box
      bgGradient="linear(to-r, blue.500, skyblue.300)"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      d="flex"
      p={2}
      w="100%"
      mt={-19}
    >
      <Box
        bg="blackAlpha.800"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        width={{ base: "90%", md: "400px" }}
        color="white"
      >
        <Heading mb={6} textAlign="center" color="skyblue.200">
          Login
        </Heading>
        <VStack spacing="15px">
          <FormControl id="email" isRequired>
            <FormLabel color="skyblue.200">Email Address</FormLabel>
            <Input
              value={email}
              type="email"
              placeholder="Enter Your Email Address"
              onChange={(e) => setEmail(e.target.value)}
              bg="blackAlpha.700"
              borderColor="skyblue.200"
              _hover={{ borderColor: "skyblue.400" }}
              _focus={{ borderColor: "skyblue.400", boxShadow: "none" }}
              color="white"
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel color="skyblue.200">Password</FormLabel>
            <InputGroup size="md">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={show ? "text" : "password"}
                placeholder="Enter password"
                bg="blackAlpha.700"
                borderColor="skyblue.200"
                _hover={{ borderColor: "skyblue.400" }}
                _focus={{ borderColor: "skyblue.400", boxShadow: "none" }}
                color="white"
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={handleClick}
                  bg="skyblue.200"
                  _hover={{ bg: "skyblue.400" }}
                >
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={loading}
            _hover={{ bg: "skyblue.400" }}
          >
            Login
          </Button>
          <Text color="skyblue.200" mt={2}>
            New user? Create an account
          </Text>
          <Button
            width="100%"
            onClick={onSignupClick} // Toggle to Signup
            bg="blue.500"
            _hover={{ bg: "blue.600" }}
          >
            Sign Up
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;