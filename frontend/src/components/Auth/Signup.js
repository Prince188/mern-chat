import { VStack } from '@chakra-ui/layout'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import React, { useState } from 'react'
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input'
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { Button, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";


const Signup = () => {
	const [name, setName] = useState()
	const [email, setEmail] = useState()
	const [password, setPassword] = useState()
	const [confirmpassword, setConfirmpassword] = useState()
	const [pic, setPic] = useState()
	const [show, setShow] = useState(false)
	const [load, setLoad] = useState(false)
	const toast = useToast()
	const hadleShowHide = () => setShow(!show)
	const history = useNavigate();

	const postDetails = (pics) => {
		setLoad(true)
		if (pics === undefined) {
			toast({
				title: 'Please select Image',
				description: "warning ",
				status: 'success',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			})
			setLoad(false)
			return;
		}

		if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
			const data = new FormData();
			data.append("file", pics);
			data.append("upload_preset", "chat-app");
			data.append("cloud_name", "duylzavfc");
			fetch("https://api.cloudinary.com/v1_1/duylzavfc/image/upload", {
				method: "post",
				body: data,
			})
				.then((res) => res.json())
				.then(data => {
					console.log(data);
					setPic(data.url.toString());
					setLoad(false);
				})
				.catch((err) => {
					console.log(err);
					setLoad(false);
				});
		}
		else {
			toast({
				title: 'Please select Image typed : JPEG or PNG',
				description: "warning ",
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			})
			setLoad(false);
			return
		}
	}

	const submitHandler = async () => {
		setLoad(true)
		if (!name || !email || !password || !confirmpassword) {
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
		if (password !== confirmpassword) {
			toast({
				title: 'Password doesn\'t match',
				description: "Your Password and Confirm Password doesn't match",
				status: 'warning',
				duration: 3000,
				isClosable: false,
				position: 'bottom'
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

			const { data } = await axios.post("/api/user", { name, email, password, pic }, config)
			toast({
				title: 'Registration successful',
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
			<FormControl id='firtsName' isRequired>
				<FormLabel>
					Name
				</FormLabel>
				<Input
					placeholder='Enter your Name'
					onChange={(e) => setName(e.target.value)}
				/>
			</FormControl>
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
			<FormControl id='conpassword' isRequired>
				<FormLabel>
					Confirm Password
				</FormLabel>
				<InputGroup>
					<Input
						type={show ? "text" : "password"}
						placeholder='Enter your Password'
						onChange={(e) => setConfirmpassword(e.target.value)}
					/>
					<InputRightElement w={'4.5rem'}>
						<Button h={'1.75rem'} size={'sm'} onClick={hadleShowHide}>
							{show ? <VscEye /> : <VscEyeClosed />}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<FormControl id='pic'>
				<FormLabel>
					Profile Picture
				</FormLabel>
				<Input
					type='file'
					p={1.5}
					accept='image/*'
					placeholder='Upload your Profile Picture'
					onChange={(e) => postDetails(e.target.files[0])}
				/>
			</FormControl>

			<Button
				colorScheme='blue'
				width={'100%'}
				style={{ marginTop: 15 }}
				onClick={submitHandler}
				isLoading={load}
			>
				Sign Up
			</Button>
		</VStack>
	)
}

export default Signup
