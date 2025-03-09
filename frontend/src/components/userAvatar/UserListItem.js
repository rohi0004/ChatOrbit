import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { ChatState } from "../../Context/ChatProvider";

const UserListItem = ({ handleFunction }) => {
  const { user } = ChatState();

  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="gray.700" // Dark background
      _hover={{
        background: "linear-gradient(135deg, #3182CE, #805AD5)", // Gradient on hover
        color: "white",
        transform: "scale(1.02)", // Slight scale effect on hover
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="white"
      px={4}
      py={3}
      mb={2}
      borderRadius="lg"
      transition="all 0.2s ease-in-out" // Smooth transition
      boxShadow="md" // Subtle shadow
    >
      <Avatar
        mr={3}
        size="md"
        cursor="pointer"
        name={user.name}
        src={user.pic}
        border="2px solid teal.300" // Add a border to the avatar
      />
      <Box>
        <Text fontWeight="semibold" fontSize="lg">
          {user.name}
        </Text>
        <Text fontSize="sm" color="gray.300">
          <b>Email:</b> {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;