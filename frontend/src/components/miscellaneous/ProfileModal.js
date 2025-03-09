import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
  VStack,
  Box,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          d={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
          aria-label="View Profile"
          colorScheme="blue"
          variant="ghost"
        />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent
          h="450px"
          bg="linear-gradient(135deg, #87CEEB, #00008B)" // Gradient background
          color="white"
          borderRadius="lg"
          boxShadow="xl"
        >
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            textAlign="center"
            py={6}
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <VStack spacing={6}>
              <Image
                borderRadius="full"
                boxSize="150px"
                src={user.pic}
                alt={user.name}
                border="4px solid white"
                boxShadow="lg"
              />
              <Box textAlign="center">
                <Text
                  fontSize={{ base: "28px", md: "30px" }}
                  fontFamily="Work sans"
                  fontWeight="bold"
                >
                  Email
                </Text>
                <Text
                  fontSize={{ base: "20px", md: "22px" }}
                  fontFamily="Work sans"
                  color="gray.200"
                >
                  {user.email}
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={onClose}
              colorScheme="blue"
              bg="skyblue.200"
              _hover={{ bg: "skyblue.400" }}
              color="black"
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;