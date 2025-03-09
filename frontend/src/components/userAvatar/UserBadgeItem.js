import { CloseIcon } from "@chakra-ui/icons";
import { Badge, Box, Text } from "@chakra-ui/layout";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Badge
      px={3}
      py={1.5}
      borderRadius="full"
      m={1}
      mb={2}
      variant="solid"
      fontSize="sm"
      fontWeight="medium"
      bgGradient="linear(to-r, teal.400, blue.500)" // Gradient background
      color="white"
      cursor="pointer"
      onClick={handleFunction}
      display="flex"
      alignItems="center"
      _hover={{
        bgGradient: "linear(to-r, teal.500, blue.600)", // Darker gradient on hover
        transform: "scale(1.05)", // Slight scale effect on hover
      }}
      transition="all 0.2s ease-in-out"
    >
      <Text as="span" mr={1}>
        {user.name}
      </Text>
      {admin === user._id && (
        <Text as="span" fontSize="xs" opacity={0.8}>
          (Admin)
        </Text>
      )}
      <CloseIcon w={3} h={3} ml={1} />
    </Badge>
  );
};

export default UserBadgeItem;