import React, { useEffect, useState } from 'react'
import { Container, Box, Text, Tab, Tabs, TabList, TabPanels, TabPanel } from '@chakra-ui/react'
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';
import { useNavigate } from 'react-router-dom';


const Home = () => {

	const navigate = useNavigate();

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem('userInfo'))
		if (user) {
			navigate('/chats')
		}
	}, [navigate])

	return (
		<Container maxW='xl' centerContent>
			<Box
				d='flex'
				justifyContent='center'
				p={3}
				bgColor='white'
				w="100%"
				m={'40px 0 15px 0'}
				borderRadius={'lg'}
				textAlign={'center'}
				borderWidth={'1px'}
			>
				<Text style={{fontFamily : "lobster !important" }} fontSize={'4xl'} color={'black'} >
					Text-o-gram
				</Text>
			</Box>
			<Box
				color={'black'}
				bg='white'
				w='100%'
				borderRadius={'lg'}
				p={4}
				borderWidth={'1px'}
			>
				<Tabs variant='soft-rounded'>
					<TabList mb={'1em'}>
						<Tab w={'50%'}>Login</Tab>
						<Tab w={'50%'}>Sign up</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<Login></Login>
						</TabPanel>
						<TabPanel>
							<Signup></Signup>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Container>
	)
}

export default Home
