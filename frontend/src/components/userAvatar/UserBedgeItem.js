import { Box } from '@chakra-ui/react'
import React from 'react'
import { FaCross } from 'react-icons/fa'
import { IoClose } from "react-icons/io5";

const UserBedgeItem = ({user , handleFunction}) => {
	return (
		<Box
			display={'flex'}
			alignItems={'center'}
			px={2}
			py={1}
			borderRadius={'lg'}
			m={1}
			mb={2}
			variant='solid'
			fontSize={14}
			color={'white'}
			backgroundColor= 'purple'
			cursor={'pointer'}
			onClick={handleFunction}
		>
			{user.name}
			<IoClose style={{paddingLeft : 1 , fontSize : 14}}/>
		</Box>
	)
}

export default UserBedgeItem
