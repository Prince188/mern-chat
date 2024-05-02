import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();


  return (
    <ScrollableFeed forceScroll={true}>
      {messages &&
        messages.map((m, i) => {
          const isLastMsg = i === messages.length - 1;
          const lastReadMessage = messages.slice().reverse().find((m) => m.read);
          return (
            <div style={{ display: "flex", alignItems: "center" }} key={m._id}>
              {/* {console.log(`Message ${m._id} read status: ${m.read}`)} */}

              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                  <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                    <Avatar
                    border = '1px solid black'
                      mt="13px"
                      mr={2}
                      size="xs"
                      cursor="pointer"
                      name={m.sender.name}
                      src={m.sender.pic}
                    />
                  </Tooltip>
                )}
              <div
                style={{
                  backgroundColor: `${m.sender._id === user._id ? "#e7ffdb" : "#fff"
                    }`,
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  position: "relative", // This allows for positioning the read receipt
                  // display : 'flex'
                  // whiteSpace : 'nowrap'
                  marginBottom: m._id === lastReadMessage._id ? '15px' : "0px"
                }}
              >
                {m.content}
                {lastReadMessage && m._id === lastReadMessage._id && (
                  <span
                    style={{
                      fontSize: "10px",
                      position: "absolute",
                      bottom: "-15px", // Adjust as needed
                      right: "3px",
                      color: "#000",
                      fontWeight : 'bold'
                    }}
                  >
                    ✓ Read
                  </span>
                )}


              </div>
            </div>
          )
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;

