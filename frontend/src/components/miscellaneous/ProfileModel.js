import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { FaEye } from 'react-icons/fa';

const ProfileModel = ({ user, children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			{children ? (
				<span onClick={onOpen}>
					{children}
				</span>
			) : (<IconButton
				display={{ base: 'flex' }}
				icon={<FaEye />}
				onClick={onOpen}
			/>)}

			<Modal size={{base : 'sm' , md : 'lg'}} isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize={{base : '24px' , md : '40px'}}
						fontFamily={'Work sans'}
						display={'flex'}
						justifyContent={'center'}
					>{user.name}</ModalHeader>
					<ModalCloseButton />
					<ModalBody
					display={'flex'}
					flexDir={'column'}
					alignItems={'center'}
					justifyContent={'space-between'}
					gap={8}
					>
						<Image
						backgroundSize={'covercl'}
						borderRadius={'full'}
						boxSize={'120px'}
						src={user.pic}
						alt={user.name}
						/>
						<Text
						fontSize={{base:"20px" , md : "30px"}}
						fontFamily={"Work sans"}
						>
							Email : {user.email}
						</Text>
					</ModalBody>
					<ModalFooter>
						<Button colorScheme='red' mr={3} p={'4px 16px'} w={'100%'} onClick={onClose}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ProfileModel;
