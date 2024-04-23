import React, { useEffect, useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { FaCross, FaPlus, FaTrash } from 'react-icons/fa';
import ChatLoading from "./chatLoading";
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = ({ fetchAgain }) => {
	const [loggedUser, setLoggedUser] = useState();
	const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
	const toast = useToast();

	const fetchChats = async () => {
		// console.log(user._id);
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.get("/api/chat", config);
			// console.log(data);
			setChats(data);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: "Failed to Load the chats",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
		}
	};

	useEffect(() => {
		setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
		fetchChats();
	}, [fetchAgain]);

	return (
		<Box
			display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
			flexDir="column"
			alignItems="center"
			p={3}
			bg="white"
			overflow={'hidden'}
			// h={{base : '84.5vh' , md : '100%'}}
			w={{ base: "100%", md: "31%" }}
			borderRadius="lg"
			borderWidth="1px">
			<Box
				pb={3}
				px={3}
				fontSize={{ base: "28px", md: "30px" }}
				fontFamily="Work sans"
				display="flex"
				w="100%"
				justifyContent="space-between"
				alignItems="center"
			>
				<Text fontSize={{ md: '20px' }}>My Chats</Text>
				<GroupChatModal>
					<Button
						display="flex"
						alignItems={'center'}
						justifyContent={'center'}
						width={'fit-content'}
						p={'5px 15px'}
						// backgroundColor={'red'}
						fontSize={{ base: "10px", md: "12px", lg: '18px' }}
						// rightIcon={<FaPlus style={{padding : 0 , margin : 'auto' , display : 'flex' , alignItems : 'center' , justifyContent:'center'}} />}
						borderRadius={{ base: '10px', md: '8px' }}
						gap={'10px'}
					>
						<Text display={{ base: 'none', md: 'none', lg: 'flex' }}>New Group Chat</Text>
						<FaPlus />
					</Button>
				</GroupChatModal>
			</Box>
			<Box
				display="flex"
				flexDir="column"
				p={3}
				bg="#F8F8F8"
				w="100%"
				h='100%'
				borderRadius="lg"
			>
				{chats ? (
					<Stack overflowY="scroll">
						{chats.map((chat) => (
							<Box
								onClick={() => setSelectedChat(chat)}
								cursor="pointer"
								fontSize={'lg'}
								bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
								color={selectedChat === chat ? "white" : "black"}
								px={3}
								py={2}
								justifyContent={'space-between'}
								alignItems={'center'}
								display={'flex'}
								borderRadius="lg"
								key={chat._id}
							>
								<Text>
									<Text>
										{!chat.isGroupChat
											? getSender(loggedUser, chat.users)
											: chat.chatName}
									</Text>
									{chat.latestMessage && (
										<Text fontSize="xs">
											<b>{chat.latestMessage.sender.name} : </b>
											{chat.latestMessage.content.length > 50
												? chat.latestMessage.content.substring(0, 51) + "..."
												: chat.latestMessage.content}
										</Text>
									)}
								</Text>
							</Box>
						))}
					</Stack>
				) : (
					<ChatLoading />
				)}
			</Box>
		</Box>
	);
};

export default MyChats;
