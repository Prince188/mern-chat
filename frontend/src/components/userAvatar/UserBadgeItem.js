import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/react";

const UserBadgeItem = ({ user, handleFunction, admin }) => {

  const isAdmin = String(admin._id) === String(user._id);
  
  


  return (
    <Badge
      px={2}
      py={1}
      h={8}
      display='flex'
      alignItems='center'
      borderRadius="lg"
      m={1}
      g={3}
      mb={2}
      variant="solid"
      fontSize={12}
      bg='black'
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      {isAdmin &&  <span style={{fontSize : 8}}> &nbsp; (Admin)</span>}
      <CloseIcon pl={1} />
    </Badge>
  );
};

export default UserBadgeItem;
