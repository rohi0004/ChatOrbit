import { Avatar } from "@chakra-ui/avatar";
import { Box, Link, Text } from "@chakra-ui/layout";
import { Image, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { Image, Tooltip } from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const filePrefix = "FILE::";
  const outgoingBubble = useColorModeValue("#E3F2FD", "#1E3A5F");
  const incomingBubble = useColorModeValue("#E8FFF1", "#1F3B2C");
  const fileCardOutgoing = useColorModeValue("blue.100", "blue.900");
  const fileCardIncoming = useColorModeValue("green.100", "green.900");
  const fileText = useColorModeValue("gray.700", "gray.200");
  const fileMeta = useColorModeValue("gray.600", "gray.400");
  const fileLink = useColorModeValue("blue.600", "cyan.300");

  const getFilePayload = (content = "") => {
    if (!content.startsWith(filePrefix)) return null;
    try {
      const rawPayload = content.replace(filePrefix, "");
      return JSON.parse(rawPayload);
    } catch (error) {
      return null;
    }
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          const filePayload = getFilePayload(m.content);

          return (
            <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            {filePayload ? (
              <Box
                bg={m.sender._id === user._id ? fileCardOutgoing : fileCardIncoming}
                bg={m.sender._id === user._id ? "blue.100" : "green.100"}
                marginLeft={isSameSenderMargin(messages, m, i, user._id)}
                marginTop={isSameUser(messages, m, i, user._id) ? 3 : 10}
                borderRadius="16px"
                px={4}
                py={3}
                maxWidth="75%"
                boxShadow="sm"
              >
                <Text fontSize="xs" color={fileMeta} mb={1}>
                <Text fontSize="xs" color="gray.600" mb={1}>
                  Shared file
                </Text>
                {filePayload.type?.startsWith("image/") && (
                  <Image
                    src={filePayload.url}
                    alt={filePayload.name}
                    borderRadius="12px"
                    maxH="200px"
                    objectFit="cover"
                    mb={2}
                  />
                )}
                <Text fontWeight="semibold" mb={1} color={fileText}>
                  {filePayload.name}
                </Text>
                <Text fontSize="sm" color={fileText} mb={2}>
                <Text fontWeight="semibold" mb={1}>
                  {filePayload.name}
                </Text>
                <Text fontSize="sm" color="gray.700" mb={2}>
                  {filePayload.prettySize}
                </Text>
                <Link
                  href={filePayload.url}
                  isExternal
                  color={fileLink}
                  color="blue.600"
                  fontWeight="semibold"
                >
                  Download
                </Link>
              </Box>
            ) : (
              <span
                style={{
                  backgroundColor: m.sender._id === user._id ? outgoingBubble : incomingBubble,
                  backgroundColor: `${
                    m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                }}
              >
                {m.content}
              </span>
            )}
          </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
