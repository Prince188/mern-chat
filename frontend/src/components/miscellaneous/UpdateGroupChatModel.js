import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import UserBedgeItem from '../userAvatar/UserBedgeItem'
import axios from 'axios'
import UserListItem from '../userAvatar/UserListItem'

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain , fetchMessage }) => {

	const { isOpen, onOpen, onClose } = useDisclosure()
	const [groupChatName, setGroupChatName] = useState()
	const [search, setSearch] = useState()
	const [searchResult, setSearchResult] = useState()
	const [load, setLoad] = useState(false)
	const [renameLoad, setRenameLoad] = useState(false)

	const toast = useToast()

	const { selectedChat, setSelectedChat, user } = ChatState()

	const handleRemove = async (user1) => {
		// console.log(selectedChat.groupAdmin._id)
		// console.log(user1._id)
		// console.log(user._id)

		try {
			// const isAdmin = selectedChat.groupAdmin === user1._id;
			// console.log(isAdmin)
			// if (!isAdmin) {
			if (selectedChat.groupAdmin !== user._id && user1._id !== user._id) {
				toast({
					title: "Only admin can remove someone",
					status: "error",
					isClosable: true,
					duration: 3000,
					position: 'bottom'
				})
				return
			}

			// try {
			setLoad(true)
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			}

			const { data } = await axios.put(
				`/api/chat/groupremove`,
				{
					chatId: selectedChat._id,
					userId: user1._id
				},
				config
			)

			console.log('loading')

			user1._id === user._id ? setSelectedChat() : setSelectedChat(data)
			setFetchAgain(!fetchAgain)
			fetchMessage()
			setLoad(false)
		} catch (error) {
			toast({
				title: "Error occured",
				description: error.response.data.message,
				status: "error",
				isClosable: true,
				duration: 3000,
				position: 'bottom'
			})
			setLoad(false)
		}
	}

	const handleRename = async () => {
		if (!groupChatName) return

		try {
			setRenameLoad(true)

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			}

			const { data } = await axios.put('/api/chat/rename',
				{ chatId: selectedChat._id, chatName: groupChatName }, config
			)

			setSelectedChat(data)
			setFetchAgain(!fetchAgain)
			setRenameLoad(false)
		} catch (error) {
			console.log(error)
			toast({
				title: 'Error occured',
				description: error.response.data.message,
				status: "error",
				isClosable: true,
				duration: 3000,
				position: 'bottom'
			})
			setRenameLoad(false)
		}

		setGroupChatName("")
	}

	const handleAddUser = async (user1) => {
		if (selectedChat.users.find((u) => u._id === user1._id)) {
			toast({
				title: "User already in group chat",
				status: "error",
				isClosable: true,
				duration: 3000,
				position: 'bottom'
			})
			return
		}

		// Enable when we want to add functionality : "only admin can add someone"

		// if (selectedChat.groupAdmin._id !== user._id) {
		// 	toast({
		// 		title: "only admin can add some one",
		// 		status: "error",
		// 		isClosable: true,
		// 		duration: 3000,
		// 		position: 'bottom'
		// 	})
		// 	return
		// }

		try {
			setLoad(true)
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			}
			const { data } = await axios.put('/api/chat/groupadd',
				{
					chatId: selectedChat._id,
					userId: user1._id
				}, config
			)
			setSelectedChat(data)
			setFetchAgain(!fetchAgain)
			setLoad(false)
		} catch (error) {
			toast({
				title: "Error occured",
				description: error.response.data.message,
				status: "error",
				isClosable: true,
				duration: 3000,
				position: 'bottom'
			})
		}
	}

	const handleSearch = async (query) => {
		setSearch(query)
		if (!query) {
			return
		}

		try {
			setLoad(true)

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			}

			const { data } = await axios.get(`/api/user?search${search}`, config)
			console.log(data)
			setLoad(false)
			setSearchResult(data)
		} catch (error) {
			toast({
				title: 'Error occured',
				description: 'Failed to load the search results',
				status: 'error',
				isClosable: true,
				duration: 3000,
				position: 'bottom-left'
			})
		}
	}

	return (
		<>
			<IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />

			<Modal isOpen={isOpen} onClose={onClose} isCentered size={{ base: 'sm', md: 'lg' }}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize={{ base: 30, md: 35 }}
						display={'flex'}
						fontFamily={'work sans'}
						justifyContent={'center'}
					>{selectedChat.chatName}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Box display={'flex'} flexWrap={'wrap'} pb={3} w={'100%'}>
							{selectedChat.users.map((u) => (
								<UserBedgeItem
									key={user._id}
									user={u}
									handleFunction={() => handleRemove(u)}
								/>
							))}
						</Box>
						<FormControl display={'flex'}>
							<Input
								placeholder='Chat Name'
								mb={3}
								value={groupChatName}
								onChange={(e) => setGroupChatName(e.target.value)}
							/>
							<Button
								varient='solid'
								colorScheme='teal'
								marginLeft={1}
								isLoading={renameLoad}
								onClick={handleRename}
							>
								Update
							</Button>
						</FormControl>
						<FormControl>
							<Input
								placeholder='Add users to group'
								mb={1}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</FormControl>
						{load ? (<Spinner size={'lg'} />) : (
							searchResult
								?.filter(user => user.name.toLowerCase().includes((search).toLowerCase()))
								.slice(0, 4).map(user => (
									<UserListItem
										key={user._id}
										user={user}
										handleFunction={() => handleAddUser(user)}
									/>
								))
						)}
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='red' w={'50%'} mr={3} onClick={() => handleRemove(user)}>
							Leave Group
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)

}

export default UpdateGroupChatModel
