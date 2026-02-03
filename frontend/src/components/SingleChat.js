import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, HStack, Text } from "@chakra-ui/layout";
import "./styles.css";
import {
  FormHelperText,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Spinner,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ArrowBackIcon, AttachmentIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
const ENDPOINT = "http://localhost:5000"; 
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();
  const emojis = [
    "😀",
    "😁",
    "😂",
    "🤣",
    "😊",
    "😍",
    "😘",
    "😎",
    "🤩",
    "😇",
    "😅",
    "😜",
    "🤔",
    "😴",
    "😢",
    "🙏",
    "👍",
    "👏",
    "🔥",
    "🎉",
  ];

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const sendMessageClick = async () => {
    if (!newMessage) return;
    socket.emit("stop typing", selectedChat._id);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setNewMessage("");
      const { data } = await axios.post(
        "/api/message",
        {
          content: newMessage,
          chatId: selectedChat,
        },
        config
      );
      socket.emit("new message", data);
      setMessages([...messages, data]);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to send the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const formatBytes = (bytes = 0) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const sendFileMessage = async (filePayload) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/message",
        {
          content: `FILE::${JSON.stringify(filePayload)}`,
          chatId: selectedChat,
        },
        config
      );
      socket.emit("new message", data);
      setMessages([...messages, data]);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to send the file",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file under 20MB.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      event.target.value = "";
      return;
    }

    setUploadingFile(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const response = await fetch("/api/upload", {
        method: "post",
        body: data,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const fileData = await response.json();

      await sendFileMessage({
        name: fileData.name,
        size: fileData.size,
        type: fileData.type || "file",
        url: fileData.url,
        prettySize: formatBytes(fileData.size),
      });
      toast({
        title: "File shared",
        description: `${file.name} has been sent.`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Unable to upload this file. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setUploadingFile(false);
      event.target.value = "";
    }
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prevMessage) => `${prevMessage}${emoji}`);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <HStack spacing={2} alignItems="center">
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip"
                  onChange={handleFileChange}
                />
                <Tooltip label="Attach a file (max 20MB)">
                  <IconButton
                    icon={<AttachmentIcon />}
                    aria-label="Attach file"
                    variant="solid"
                    colorScheme="teal"
                    isLoading={uploadingFile}
                    onClick={() => fileInputRef.current?.click()}
                  />
                </Tooltip>
                <Popover placement="top-start">
                  <PopoverTrigger>
                    <IconButton
                      icon={<Text fontSize="18px">😊</Text>}
                      aria-label="Add emoji"
                      variant="outline"
                      colorScheme="yellow"
                    />
                  </PopoverTrigger>
                  <PopoverContent width="220px">
                    <PopoverArrow />
                    <PopoverBody>
                      <SimpleGrid columns={5} spacing={2}>
                        {emojis.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => handleEmojiSelect(emoji)}
                            style={{
                              fontSize: "18px",
                              padding: "4px",
                              borderRadius: "6px",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            {emoji}
                          </button>
                        ))}
                      </SimpleGrid>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message or drop a file to share.."
                  value={newMessage}
                  onChange={typingHandler}
                />
                <Tooltip label="Send message">
                  <IconButton
                    icon={<ArrowForwardIcon />}
                    aria-label="Send message"
                    colorScheme="blue"
                    onClick={sendMessageClick}
                    isDisabled={!newMessage}
                  />
                </Tooltip>
              </HStack>
              <FormHelperText color="gray.600">
                Share files or add emojis for a smooth, WhatsApp-style chat
                experience.
              </FormHelperText>
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
