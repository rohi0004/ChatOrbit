import { Avatar } from "@chakra-ui/avatar";
import { Box, Link, Text } from "@chakra-ui/layout";
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
                bg={m.sender._id === user._id ? "blue.100" : "green.100"}
                marginLeft={isSameSenderMargin(messages, m, i, user._id)}
                marginTop={isSameUser(messages, m, i, user._id) ? 3 : 10}
                borderRadius="16px"
                px={4}
                py={3}
                maxWidth="75%"
                boxShadow="sm"
              >
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
                <Text fontWeight="semibold" mb={1}>
                  {filePayload.name}
                </Text>
                <Text fontSize="sm" color="gray.700" mb={2}>
                  {filePayload.prettySize}
                </Text>
                <Link
                  href={filePayload.url}
                  isExternal
                  color="blue.600"
                  fontWeight="semibold"
                >
                  Download
                </Link>
              </Box>
            ) : (
              <span
                style={{
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
