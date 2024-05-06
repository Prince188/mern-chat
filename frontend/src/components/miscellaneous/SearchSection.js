import { Box, Input } from '@chakra-ui/react'
import React from 'react'

const SearchSection = () => {
	return (
		<>
			<Box>
				<Input 
				placeholder = 'searh chat'
				borderColor = 'black'
				w={'100%'}
				mr={0}
				/>
			</Box>
		</>
	)
}

export default SearchSection
