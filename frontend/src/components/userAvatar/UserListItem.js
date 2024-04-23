import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";

const UserListItem = ({user, handleFunction }) => {

	return (
		<Box
			onClick={handleFunction}
			cursor="pointer"
			bg="#E8E8E8"
			transition={'0.2s'}
			_hover={{
				background: "#38B2AC",
				color: "white",
			}}
			w="100%"
			display="flex"
			alignItems="center"
			color="black"
			px={3}
			py={2}
			mb={2}
			borderRadius="lg"
		>
			<Avatar
				mr={2}
				size="sm"
				cursor="pointer"
				name={user.name}
				src={user.pic}
			/>
			<Box>
				<Text fontSize={'lg'} fontWeight={'bolder'}>{user.name}</Text>
				<Text fontSize={{base: 'sm' , md: 'lg'}}>
					<>Email : </>
					{user.email}
				</Text>
			</Box>
		</Box>
	);
};

export default UserListItem;