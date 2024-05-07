import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { Avatar, Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Tooltip, useDisclosure, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import { InputRightElement, InputLeftElement, InputGroup } from "@chakra-ui/react"

import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import { IoSendOutline } from "react-icons/io5";
import { FaRegSmile } from "react-icons/fa";
const ENDPOINT = "https://mern-chat-2-ewhs.onrender.com"; 
// const ENDPOINT = "http://localhost:3000"; 
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();


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

      data.forEach((message) => {
        if (!message.read) {
          console.log("Emitting 'message-read'", message._id)
          const messageId = message._id;
          const userId = user._id;
          const senderId = message.sender._id;
          socket.emit("message-read", { messageId, userId, senderId }); // 
        }
      });

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

  const sendMessageBtn = async (event) => {
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


  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("connected", () => console.log("Client connected to Socket.io"));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));


    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);


  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message-read-update", (updatedMessage) => {
      console.log("Received 'message-read-update'", updatedMessage); // Confirm event received
      setMessages((prevMessages) =>
        prevMessages.map((m) =>
          m._id === updatedMessage._id ? updatedMessage : m
        )
      );
    });
  }, [socket]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(fetchAgain);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
      }
    });

    return () => {
      socket.off("message recieved");
    };
  }, []);



  // useEffect(() => {
  //   const lastMessageIsFromOtherUser = messages.length && messages[messages.length - 1].sender !== user._id
  //   if (lastMessageIsFromOtherUser) {
  //     socket.emit('markMessageAsSeen', {
  //       conversationId: selectedChat._id,
  //       userId: selectedChat.userId,
  //     })
  //   }
  //   socket.on("messageSeen", ({ conversationId }) => {
  //     if (selectedChat._id === conversationId) {
  //       setMessages(prev => {
  //         const updatedMessage = prev.map(message => {
  //           if (!message.read) {
  //             return {
  //               ...message,
  //               read: true
  //             }
  //           }
  //           return message
  //         })
  //         return updatedMessage
  //       })
  //     }
  //   })
  // } , [socket , user._id , messages ,selectedChat ])

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

  // const userDetails = getSender(user, selectedChat.users); // Get full user info
  // const userName = getSender(user, selectedChat.user); // Get user name
  // const userFullName = userDetails.name; // Full name to derive initials
  // const userProfilePic = userDetails.profilePic; // Get profile picture URL

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
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  <div style={{ marginRight: 'auto', marginLeft: 15 }}>
                    <Tooltip label={getSender(user, selectedChat.users)} placement="bottom-start" hasArrow>
                      <Avatar
                        border='1px solid black'
                        mt="6px"
                        mr={2}
                        size="sm"
                        cursor="pointer"
                        src={getSenderFull(user, selectedChat.users).pic}
                        onClick={onOpen}
                      // name={messages.sender.name}
                      />
                    </Tooltip>
                    {getSender(user, selectedChat.users)}
                  </div>
                  <ProfileModal
                    size={'lg'}
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  <div style={{ marginRight: 'auto', marginLeft: 15 }}>
                    <Avatar
                      border='1px solid black'
                      mt="6px"
                      mr={2}
                      size="sm"
                      cursor="pointer"
                      src={'https://t4.ftcdn.net/jpg/03/78/40/51/360_F_378405187_PyVLw51NVo3KltNlhUOpKfULdkUOUn7j.jpg'}
                      onClick={onOpen}
                    // name={messages.sender.name}
                    />
                    {selectedChat.chatName.toUpperCase()}
                  </div>
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

              {/* //? input field */}

              <InputGroup display='flex'>
                <InputLeftElement>
                  <Button _focus='none' borderRadius='50%' h="2rem" p={1} size="sm" bg='black' color='white' _hover='none'>
                    <FaRegSmile />
                  </Button>
                </InputLeftElement>
                <Input
                  borderRadius='20'
                  borderColor='black'
                  variant="filled"
                  bg="#E0E0E0"
                  px={3}
                  height={10}
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                />
                <InputRightElement>
                  <Button _focus='none' borderRadius='50%' p={1} onClick={sendMessageBtn} size="sm" bg='black' color='white' _hover='none'>
                    <IoSendOutline style={{ margin: 5 }} />
                  </Button>
                </InputRightElement>
              </InputGroup>
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
      )
      }

      <Modal isOpen={isOpen} onClose={onClose} size='sm' isCentered>
        <ModalOverlay bg='blackAlpha.800'
          backdropFilter='blur(10px) hue-rotate(0deg)' />
        <ModalContent bg='transperant' boxShadow='none'>
          {/* {selectedChat ? (
            <ModalHeader >
              <Text ml='auto' textAlign='center' fontSize='24'>{selectedChat.isGroupChat ? selectedChat.chatName.toUpperCase() : getSender(user, selectedChat.users)}</Text>
            </ModalHeader>
          ) : (
            <ModalHeader>Error: Chat not found</ModalHeader>
          )} */}
          {/* <ModalCloseButton color='white'/> */}
          {selectedChat ?
            (<ModalBody display='flex'>
              {!selectedChat.isGroupChat ?
                (<Avatar
                  border='1px solid black'
                  borderRadius='50%'
                  mt="6px"
                  m='auto'
                  // size="3xl"
                  height={350}
                  width={350}
                  cursor="pointer"
                  src={getSenderFull(user, selectedChat.users).pic}
                  onClick={onOpen}
                // name={messages.sender.name}
                />) :
                (
                  <Avatar
                    border='1px solid black'
                    mt="6px"
                    m='auto'
                    // size="3xl"
                    height={350}
                    width={350}
                    cursor="pointer"
                    src={'https://t4.ftcdn.net/jpg/03/78/40/51/360_F_378405187_PyVLw51NVo3KltNlhUOpKfULdkUOUn7j.jpg'}
                    onClick={onOpen}
                  // name={messages.sender.name}
                  />
                )}
            </ModalBody>) : (<ModalBody>Error : chat not found </ModalBody>)
          }
          {/* <ModalFooter >
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>

  );


};

export default SingleChat;
