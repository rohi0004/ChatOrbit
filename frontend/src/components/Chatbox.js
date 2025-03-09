import { Box } from "@chakra-ui/layout";
import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={4}
      bg="white" // Light background for contrast with black text
      w={{ base: "100%", md: "68%" }}
      borderRadius="xl" // Rounded corners
      borderWidth="1px"
      borderColor="gray.200" // Light border for subtle definition
      boxShadow="lg" // Add a shadow for depth
      color="black" // Black text color
      transition="all 0.3s ease-in-out" // Smooth transition
      _hover={{
        boxShadow: "xl", // Enhanced shadow on hover
        transform: "translateY(-2px)", // Slight lift on hover
      }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;