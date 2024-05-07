import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";
import { CgProfile } from "react-icons/cg";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} bg='black' color='white' icon={<CgProfile />} _hover='none' _focus='none' onClick={onOpen} />
      )}
      <Modal size="sm" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d="flex"
            flexDir="row"
            alignItems="center"
            // justifyContent="space-between"
            // gap={5}
          >
            <Image
              borderRadius="full"
              boxSize="280px"
              margin='auto'
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: "26px", md: "26px" }}
              fontFamily="Work sans"
            >
              {/* Name: {user.name} */}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button bg='black' color='white' w={'98%'} mx={'auto'} _hover='none' onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
