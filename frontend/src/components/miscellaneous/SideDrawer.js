import { Avatar, Box, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, useToast, Tooltip, useDisclosure, Spinner, Modal } from '@chakra-ui/react'
import { Button } from '@chakra-ui/button'
import React, { useState } from 'react'


//ICONS
import { FaBell, FaChevronDown, FaSearch } from "react-icons/fa";
import { ChatState } from '../../context/ChatProvider';
import ProfileModel from './ProfileModel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserListItem from '../userAvatar/UserListItem';
import ChatLoading from '../chatLoading';
import { getSender } from '../../config/ChatLogics';

const SideDrawer = () => {

	const uniqueChatIDs = new Set();
	const uniqueSmallChatIDs = new Set();
	const [search, setSearch] = useState("")
	const [searchResult, setSearchResult] = useState([])
	const [load, setLoad] = useState(false)
	const [loadChat, setLoadChat] = useState(false)
	const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState()
	const navigate = useNavigate() //Use to send user to other page according to condition

	const { isOpen, onOpen, onClose } = useDisclosure()


	// Function to handle logout functionality 
	const logoutHandler = () => {
		localStorage.removeItem('userInfo')
		navigate('/')
	}

	const toast = useToast()  //Use Toast with importing from 'react' 

	const handleSearch = async () => {
		if (!search) {
			toast({
				title: "Please enter something in search",
				status: "warning",
				duration: 3000,
				isClosable: true,
				position: 'top-left'
			})
			return
		}

		try {
			setLoad(true)
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			}
			const { data } = await axios.get(`/api/user?search=${search}`, config)
			setLoad(false)
			setSearchResult(data)
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: 'Failed to load search results',
				status: "error",
				duration: 3000,
				isClosable: true,
				position: 'bottom-left'
			})
			setLoad(false)
		}

	}

	const accessChat = async (userId) => {
		// console.log(userId);

		try {
			setLoadChat(true);
			const config = {
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.post(`/api/chat`, { userId }, config);

			if (!chats.find((c) => c._id === data._id)) {
				setChats([data, ...chats]);
			}

			setSelectedChat(data);
			setLoadChat(false);
			onClose();
		} catch (error) {
			setLoadChat(false)
			toast({
				title: "Error fetching the chat",
				description: error.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
		}
	};

	const notiNum = {
		backgroundColor: 'red', display: 'flex', borderRadius: '50%', transform: 'translateX(-15px) translateY(-3px)', color: 'white', fontSize: 12
	}
	const notiNumSmall = {
		backgroundColor: 'red', display: 'flex', borderRadius: '50%', color: 'white', fontSize: 12, transform: 'translateX(-15px) translateY(-3px)'
	}
	const spanStyleNoti = {
		display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 3, borderRadius: '50px', height: '15px', width: '15px'
	}

	return (
		<>
			<Box
				display={'flex'}
				justifyContent={'space-between'}
				alignItems={'center'}
				bg={'white'}
				w={'100%'}
				p={'5px 10px 5px 10px'}
			// borderWidth={'5px'}
			>
				<Tooltip label="Search user to chat" hasArrow placement='bottom-end'>
					<Button variant={'ghost'} onClick={onOpen}>
						<FaSearch />
						<Text display={{ base: "none", md: "flex" }} px={4}>
							Search User
						</Text>
					</Button>
				</Tooltip>
				<Text className='heading' fontSize={'2xl'} style={{ fontFamily: "lobster" }} >
					Text-o-gram
				</Text>
				<div className="" style={{ display: 'flex', alignItems: 'center' }}>

					{/* Notification section for except mobile */}
					<Menu>
						<MenuButton p={1} display={{ base: 'none', md: 'flex' }}>
							{/*  */}
							<FaBell style={{ margin: 1, fontSize: '18px' }} />
						</MenuButton>
						<MenuButton display={{ base: 'none', md: 'flex' }}>
							<sup className='noti_num' style={notiNum}>
								<span style={spanStyleNoti}>{notification.length}</span></sup>
						</MenuButton>
						<MenuList px={2}>
							{notification.length === 0 && "No new messages"}
							{notification
								.filter((notif) => {
									// Keep only unique notifications based on chat ID
									if (uniqueChatIDs.has(notif.chat._id)) {
										return false; // Duplicate chat ID, ignore this notification
									}
									uniqueChatIDs.add(notif.chat._id); // Add to unique set
									return true; // Include this notification
								})
								.map((notif) => (
									<MenuItem
										key={notif._id}
										onClick={() => {
											setSelectedChat(notif.chat); // Set the selected chat
											// Remove all notifications for this chat
											setNotification(notification.filter((n) => n.chat._id !== notif.chat._id));
										}}
									>
										{notif.chat.isGroupChat
											? `New message in ${notif.chat.chatName}`
											: `New message from ${getSender(user, notif.chat.users)}`}
									</MenuItem>
								))}
						</MenuList>
					</Menu>


					{/* Profile section */}
					<Menu >

						<MenuButton as={Button} size={'sm'} rightIcon={<FaChevronDown />}>
							<Avatar size={'xs'} cursor={'pointer'} name={user.name} src={user.pic} />
						</MenuButton>

						{/* notification count span for mobile */}
						<MenuButton opacity={{ md: 0 }}>
							<sup className='noti_num' style={notiNumSmall}>
								<span style={spanStyleNoti}>{notification.length}</span>
							</sup>
						</MenuButton>

						{/* Notification section but only for mobile device */}

						<MenuList>
							<ProfileModel user={user}>
								<MenuItem>My Profile</MenuItem>
							</ProfileModel>
							<MenuDivider />
							<MenuItem onClick={logoutHandler}>Logout</MenuItem>
							<MenuDivider display={{ md: 'none' }} />

							{/* <MenuDivider/> */}
							{/* <MenuItem> */}
							<Menu>
								<MenuButton p={1} ml={2} display={{ md: 'none' }} >
									<div style={{ display: 'flex', height: 15 }}>
										{/*  */}
										Notification
										<sup className='noti_num' style={notiNumSmall}>
											<span style={spanStyleNoti}>{notification.length}</span></sup>
									</div>
								</MenuButton>
								<MenuList px={2}>
									{notification.length === 0 && "No new messages"}
									{notification
										.filter((notif) => {
											// Keep only unique notifications based on chat ID
											if (uniqueSmallChatIDs.has(notif.chat._id)) {
												return false; // Duplicate chat ID, ignore this notification
											}
											uniqueSmallChatIDs.add(notif.chat._id); // Add to unique set
											return true; // Include this notification
										})
										.map((notif) => (
											<MenuItem
												key={notif._id}
												onClick={() => {
													setSelectedChat(notif.chat); // Set the selected chat
													// Remove all notifications for this chat
													setNotification(notification.filter((n) => n.chat._id !== notif.chat._id));
												}}
											>
												{notif.chat.isGroupChat
													? `New message in ${notif.chat.chatName}`
													: `New message from ${getSender(user, notif.chat.users)}`}
											</MenuItem>
										))}
								</MenuList>
							</Menu>
							{/* </MenuItem> */}
						</MenuList>
					</Menu>
				</div>
			</Box>
			<Drawer placement='left' onClose={onClose} isOpen={isOpen} size={{ base: 'xs', md: 'lg' }}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader borderBottomWidth={'1px'}>Search User</DrawerHeader>
					<DrawerBody>
						<Box display={'flex'} p={2}>
							<Input
								placeholder='Search by name or email'
								mr={2}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
							<Button onClick={handleSearch}>
								Go
							</Button>
						</Box>
						{load ? (<ChatLoading />)
							: (
								searchResult?.map((user) => (
									<UserListItem
										key={user._id}
										user={user}
										handleFunction={() => accessChat(user._id)}
									/>
								))
							)}
						{loadChat && <Spinner ml='auto' />}
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	)
}

export default SideDrawer
