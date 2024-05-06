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
  const { user, selectedChat } = ChatState();


  return (
    <ScrollableFeed forceScroll={true}>
      {messages &&
        messages.map((m, i) => {
          // const isLastMsg = i === messages.length - 1;
          // const lastReadMessage = messages.slice().reverse().find((m) => m.read);
          // ? Enable above both if we want to add seen indicator at the last msg

          return (
            <div style={{ display: "flex", alignItems: "center" }} key={m._id}>
              {/* {console.log(`Message ${m._id} read status: ${m.read}`)} */}

              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                  <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                    <Avatar
                      border='1px solid black'
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
                  marginBottom: 1,
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                  border: '1px solid lightgray',
                  borderRadius: "10px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  // position: "relative", // This allows for positioning the read receipt
                  display: 'flex',
                  flexDirection: "column",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                  whiteSpace: 'normal',
                  flexWrap: "wrap",
                  // marginBottom: lastReadMessage ? '12px' : "0px"
                }}
              >
                <div style={{ fontSize: '0.8rem', marginRight: 'auto', fontWeight: 'bold', color: 'blue' }}>
                  {selectedChat.isGroupChat ? (m.sender._id === user._id ? "" : m.sender.name) : ""}
                </div>
                <div style={{ marginRight: m.sender._id === user._id ? 15 : 0 }}>
                  {m.content}
                </div>
                {/* //* lastReadMessage && m._id === lastReadMessage._id // ? will do if want indicator only for last and disable below one line */}
                {m.read && m.sender._id === user._id && (
                  <div
                    style={{
                      // height : 'fit-content' ,
                      marginLeft: 'auto',
                      marginBottom: "-12px",
                      transform: 'translate(8px , -8px)',
                      // display : 'flex',
                      alignItems: 'center',
                      // backgroundColor: 'red',
                      fontSize: "10px",
                      // position: "absolute",
                      color: "#000",
                      fontWeight: 'bold'
                    }}
                  >
                    ✓
                  </div>
                )}
              </div>
            </div>
          )
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;

