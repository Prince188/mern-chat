import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import axios from 'axios'
import UserListItem from '../userAvatar/UserListItem'
import UserBedgeItem from '../userAvatar/UserBedgeItem'

const GroupChatModal = ({ children }) => {

	const { isOpen, onOpen, onClose } = useDisclosure()
	const [groupChatName, setGroupChatName] = useState()
	const [selectedUsers, setSelectedUsers] = useState([])
	const [search, setSearch] = useState("")
	const [searchResult, setSearchResult] = useState([])
	const [load, setLoad] = useState(false)

	const toast = useToast()

	const { user, chats, setChats } = ChatState()

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

	const handleSubmit = async () => {
		if (!groupChatName || !selectedUsers) {
			toast({
				title: "Please fill all the feilds",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
			return;
		}

		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.post(
				`/api/chat/group`,
				{
					name: groupChatName,
					users: JSON.stringify(selectedUsers.map((u) => u._id)),
				},
				config
			);
			setChats([data, ...chats]);
			onClose();
			toast({
				title: "New Group Chat Created!",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
		} catch (error) {
			toast({
				title: "Failed to Create the Chat!",
				description: error.response.data,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
		}
	};

	const handleDelete = (dlUser) => {
		setSelectedUsers(selectedUsers.filter((sel) => sel._id !== dlUser._id))
	}

	const handleGroup = (userToAdd) => {
		if (selectedUsers.includes(userToAdd)) {
			toast({
				title: "User already added",
				status: "warning",
				duration: 3000,
				isClosable: true,
				position: "top"
			})
		} else {
			setSelectedUsers([...selectedUsers, userToAdd])
		}

	}

	return (
		<>
			<span onClick={onOpen}>{children}</span>
			<Modal isOpen={isOpen} onClose={onClose} size={{ base: 'sm', md: 'lg' }}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize={{ base: '26px', md: '35px' }}
						display={'flex'}
						justifyContent={'center'}
					>Create Group Chat</ModalHeader>
					<ModalCloseButton />
					<ModalBody
						display={'flex'}
						flexDir={'column'}
						alignItems={'center'}
					>
						<FormControl>
							<Input placeholder='Group name' mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
						</FormControl>
						<FormControl>
							<Input placeholder='Add users...' mb={1} onChange={(e) => handleSearch(e.target.value)} />
						</FormControl>

						{/* selected users */}

						<Box display={'flex'} w={'100%'} flexWrap={'wrap'}>
							{selectedUsers.map((u) => (
								<UserBedgeItem
									key={user._id}
									user={u}
									handleFunction={() => handleDelete(u)}
								/>
							))}
						</Box>

						{load ? <div>Loading</div> : (
							searchResult
								?.filter(user => user.name.toLowerCase().includes((search).toLowerCase()))
								.slice(0, 4).map(user => (
									<UserListItem
										key={user._id}
										user={user}
										handleFunction={() => handleGroup(user)}
									/>
								))
						)}

						{/* render search users */}


					</ModalBody>
					<ModalFooter>
						<Button w={'50%'} colorScheme='red' mr={3} onClick={handleSubmit}>
							Create chat
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}

export default GroupChatModal
