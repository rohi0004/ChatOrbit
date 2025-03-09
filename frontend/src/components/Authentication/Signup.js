import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack, Box, Heading, Text, Flex } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";

const Signup = ({ onLoginClick }) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const history = useHistory();

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(name, email, password, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
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
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "xbzctgeb");
      data.append("cloud_name", "rohi0004");
      fetch("https://api.cloudinary.com/v1_1/rohi0004/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

  return (
    <Flex
      bgGradient="linear(to-r, blue.500, skyblue.300)"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      d="flex"
      p={2}
      w="100%"
      mt={5}
    >
      <Box
        bg="blackAlpha.800"
        p={8}
        // borderRadius="lg"
        // boxShadow="lg"
        width={{ base: "100%", md: "400px" }}
        color="white"
      >
        <Heading mb={6} textAlign="center" color="skyblue.200">
          Sign Up
        </Heading>
        <VStack spacing="15px">
          <FormControl id="first-name" isRequired>
            <FormLabel color="skyblue.200">Name</FormLabel>
            <Input
              placeholder="Enter Your Name"
              onChange={(e) => setName(e.target.value)}
              bg="blackAlpha.700"
              borderColor="skyblue.200"
              _hover={{ borderColor: "skyblue.400" }}
              _focus={{ borderColor: "skyblue.400", boxShadow: "none" }}
              color="white"
            />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel color="skyblue.200">Email Address</FormLabel>
            <Input
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
                type={show ? "text" : "password"}
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
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
          <FormControl id="confirm-password" isRequired>
            <FormLabel color="skyblue.200">Confirm Password</FormLabel>
            <InputGroup size="md">
              <Input
                type={show ? "text" : "password"}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmpassword(e.target.value)}
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
          <FormControl id="pic">
            <FormLabel color="skyblue.200">Upload your Picture</FormLabel>
            <Input
              type="file"
              p={1.5}
              accept="image/*"
              onChange={(e) => postDetails(e.target.files[0])}
              bg="blackAlpha.700"
              borderColor="skyblue.200"
              _hover={{ borderColor: "skyblue.400" }}
              _focus={{ borderColor: "skyblue.400", boxShadow: "none" }}
              color="white"
            />
          </FormControl>
          <Button
            isLoading={picLoading}
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            _hover={{ bg: "skyblue.400" }}
          >
            Sign Up
          </Button>
          <Text color="skyblue.200" mt={2}>
            Already have an account?
          </Text>
          <Button
            width="100%"
            onClick={onLoginClick} // Toggle to Login
            bg="blue.500"
            _hover={{ bg: "blue.600" }}
          >
            Login
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Signup;