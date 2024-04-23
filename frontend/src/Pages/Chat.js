// import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import SideDrawer from '../components/miscellaneous/SideDrawer'
import MyChats from '../components/MyChats'
import ChatBox from '../components/ChatBox'
import { Box } from '@chakra-ui/react'
import { useState } from 'react'

const Chat = () => {

	const { user } = ChatState()
	const [fetchAgain , setFetchAgain] = useState()

	return (
		<div style={{ width: '100%'}} className='chatscreen'>
			{user && <SideDrawer />}
			<Box
			display={'flex'}
			justifyContent={'space-between'}
			w={'100%'}
			// bg={'red'}
			h={'91.5vh'}
			p={'10px'}
			>
				{user && <MyChats fetchAgain={fetchAgain} />}
				{user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
			</Box>			
		</div>
	)
}

export default Chat
