import { VStack } from '@chakra-ui/layout'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import React, { useState } from 'react'
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input'
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { Button, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const Login = () => {
	// const [name, setName] = useState()
	const [email, setEmail] = useState()
	const [password, setPassword] = useState()
	const [show, setShow] = useState(false)
	const [load, setLoad] = useState(false)


	const toast = useToast()
	const history = useNavigate()
	const hadleShowHide = () => setShow(!show)

	const submitHandler = async () => {
		setLoad(true)
		if (!email || !password) {
			toast({
				title: 'Please Fill All Your Fields',
				description: "It's look like that you have not filled all your fields",
				status: 'warning',
				duration: 5000,
				isClosable: false,
			})
			setLoad(false)
			return
		}

		try {
			const config = {
				headers: {
					"Content-type": "application/json"
				}
			}

			const { data } = await axios.post("/api/user/login", { email, password }, config)
			toast({
				title: 'Login successful',
				status: 'success',
				duration: 5000,
				isClosable: false,
			});

			localStorage.setItem('userInfo', JSON.stringify(data));

			setLoad(false);
			history('/chats')

		} catch (error) {
			toast({
				title: 'Error occured',
				description: error.response.data.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			})
			setLoad(false)
		}
	}
	return (
		<VStack spacing={'5px'} color={'black'}>
			{/* <FormControl id='firtsName' isRequired>
				<FormLabel>
					Name
				</FormLabel>
				<Input
					placeholder='Enter your Name'
					onChange={(e) => setName(e.target.value)}
				/>
			</FormControl> */}
			<FormControl id='email' isRequired>
				<FormLabel>
					Email
				</FormLabel>
				<Input
					placeholder='Enter your Email'
					onChange={(e) => setEmail(e.target.value)}
				/>
			</FormControl>
			<FormControl id='password' isRequired>
				<FormLabel>
					Password
				</FormLabel>
				<InputGroup>
					<Input
						type={show ? "text" : "password"}
						placeholder='Enter your Password'
						onChange={(e) => setPassword(e.target.value)}
					/>
					<InputRightElement w={'4.5rem'}>
						<Button h={'1.75rem'} size={'sm'} onClick={hadleShowHide}>
							{show ? <VscEye /> : <VscEyeClosed />}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<Button
				colorScheme='blue'
				width={'100%'}
				style={{ marginTop: 15 }}
				onClick={submitHandler}
				isLoading={load}
			>Login
			</Button>
			{/* <Button
				variant={'solid'}
				colorScheme='red'
				width={'100%'}
				style={{ marginTop: 15 }}
				onClick={() => {
					setEmail('guest@example.com');
					setPassword('123456');
				}}>
				Get Guesr User Credentials
			</Button> */}
		</VStack>
	)

}
export default Login
