import React from 'react'
import { ChatState } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from './SingleChat';

const ChatBox = ({fetchAgain , setFetchAgain}) => {

	const { selectedChat } = ChatState()

	return (
		<Box className='chatbox'
		display={{base: selectedChat ? 'flex' : 'none' , md:'flex'}}
		alignItems={'center'}
		flexDir={'column'}
		bg={'white'}
		p={3}
		w={{base:'100%' , md : '68%'}}
		h={{base : '90vh' , md : '100%'}}
		borderRadius={'lg'}
		// borderWidth={'1px'}
		>
			<SingleChat fetchAgain = {fetchAgain} setFetchAgain={setFetchAgain} /> 	
		</Box>
	)
}

export default ChatBox
