import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { FaArrowLeft } from 'react-icons/fa'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/ChatLogics'
import Lottie from 'react-lottie'
import animationData from '../animation/typing.json'
import ProfileModel from "./miscellaneous/ProfileModel";
import UpdateGroupChatModel from './miscellaneous/UpdateGroupChatModel'
import axios from 'axios'
import ScrollableChat from './ScrollableChat'
import './style.css'
import io from 'socket.io-client'


const ENDPOINT = 'http://localhost:5000'
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

	const [message, setMessage] = useState([])
	// const [notification, setNotification] = useState([])
	const [load, setLoad] = useState(false)
	const [socketConn, setSocketConn] = useState(false)
	const [typing, setTyping] = useState(false)
	const [isTyping, setIsTyping] = useState(false)
	const [newMessage, setNewMessage] = useState()

	const defaultOption = {
		loop: true,
		autoplay: true,
		animationData: animationData,
		rendererSettings: {
			preserveAspectRatio: "xMidYMid slice"
		}
	}

	const toast = useToast()

	const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState()

	const fetchMessage = async () => {
		if (!selectedChat) return

		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			}

			setLoad(true)

			const { data } = await axios.get(`/api/message/${selectedChat._id}`, config)

			// console.log(message)
			setMessage(data)
			setLoad(false)

			socket.emit('join chat', selectedChat._id)
		} catch (error) {
			toast({
				title: "Error occured",
				description: "Failed to load the message",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom"
			})
		}
	}

	useEffect(() => {
		socket = io(ENDPOINT);
		socket.emit('setup', user)
		socket.on("connected", () => setSocketConn(true))
		socket.on("typing", () => setIsTyping(true))
		socket.on("stop typing", () => setIsTyping(false))
	}, [])

	useEffect(() => {
		fetchMessage()

		selectedChatCompare = selectedChat
	}, [selectedChat])

	// socket.on('typing' , (room) => )
	// console.log(notification, "===========")
	useEffect(() => {
		socket.on("Message rec", (newMessageRecieved) => {
			if (!selectedChatCompare
				|| selectedChatCompare._id !== newMessageRecieved.chat._id) {
				//notification
				if (!notification.includes(newMessageRecieved)) {
					setNotification([newMessageRecieved, ...notification])
					setFetchAgain(!fetchAgain)
				}
			}
			else {
				setMessage([...message, newMessageRecieved])
			}
		})
	})


	const sendMessage = async (event) => {
		if (event.key === "Enter" && newMessage) {
			socket.emit('stop typing', selectedChat._id)
			try {
				const config = {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.token}`
					}
				}
				setNewMessage("")


				const { data } = await axios.post('/api/message', {
					content: newMessage,
					chatId: selectedChat._id
				}, config)

				// console.log(data)

				socket.emit('new message', data)

				setMessage([...message, data])
			} catch (error) {
				toast({
					title: "Error occured",
					description: "Failed to send the message",
					status: "error",
					duration: 3000,
					isClosable: true,
					position: "bottom"
				})
			}
		}
	}



	const typingHandler = ((e) => {
		console.log("Typing handler called");
		setNewMessage(e.target.value)

		// Typing Indicator
		if (!socketConn) return

		if (!typing) {
			setTyping(true)
			socket.emit("typing", selectedChat._id)
		}

		let lastTypingTime = new Date().getTime()
		var timerLength = 3000
		setTimeout(() => {
			var timeNow = new Date().getTime()
			var timeDiff = timeNow - lastTypingTime

			if (timeDiff >= timerLength) {
				socket.emit("stop typing", selectedChat._id)
				setTyping(false)
			}
		}, timerLength)

	})


	return (
		<>
			{
				selectedChat ? (<>
					<Text
						fontSize={{ base: 28, md: 30 }}
						pb={3}
						px={2}
						w={'100%'}
						// bg={'red'}
						display={'flex'}
						justifyContent={{ base: 'space-between' }}
						alignItems={'center'}
					>
						<IconButton
							display={{ bae: 'flex', md: 'none' }}
							icon={<ArrowBackIcon />}
							onClick={() => setSelectedChat("")}
						/>
						{!selectedChat.isGroupChat ? (
							<>
								{getSender(user, selectedChat.users)}
								<ProfileModel user={getSenderFull(user, selectedChat.users)} />
							</>) : (<>
								{
									selectedChat.chatName.toUpperCase()
								}
								<UpdateGroupChatModel
									fetchAgain={fetchAgain}
									setFetchAgain={setFetchAgain}
									fetchMessage={fetchMessage}
								/>
							</>)}
					</Text>
					<Box
						display={'flex'}
						flexDir={'column'}
						justifyContent={'flex-end'}
						p={3}
						bg={'#e8e8e8'}
						w={'100%'}
						h={'100%'}
						borderRadius={'lg'}
						overflowY={'hidden'}
					>
						{/* Messages here */}
						{load ? (
							<Spinner
								size={'xl'}
								w={20}
								h={20}
								alignSelf={'center'}
								margin={'auto'}
							/>
						) : (
							<div className="messages">
								<ScrollableChat message={message} />
							</div>
						)}
						<FormControl onKeyDown={sendMessage} isRequired mt={3}>
							{isTyping ? <div>
								<Lottie
									options={defaultOption}
									width={70}
									style={{ marginLeft: 0, marginBottom: 15 }}
								/>
							</div> : <></>}
							{console.log("true", isTyping)}
							<Input
								variant={'filled'}
								bg={'#e0e0e0'}
								placeholder={'Type your message here'}
								borderColor={'grey'}
								onChange={typingHandler}
								value={newMessage}
							/>
						</FormControl>

					</Box>
				</>) : (
					<Box display={'flex'} alignItems={'center'} justifyContent={'center'}
						h={'100%'}>
						<Text fontSize={'3xl'} pb={3}>
							Click on user to start chating
						</Text>
					</Box>
				)
			}
		</>
	)
}

export default SingleChat
