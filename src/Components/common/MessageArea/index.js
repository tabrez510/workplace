import React, { useEffect } from "react";
import { Grid, TextField, Button } from "@mui/material";
function MessageArea({
  onSendMessage,
  selectedConversation,
  fetchAllOneToOneMessages,
  allMessages,
}) {
  const [messagetext, setMessage] = React.useState("");
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const loggedId = loggedInUser.uid;
  useEffect(() => {
    if (selectedConversation) {
      fetchAllOneToOneMessages();
    }
  }, [selectedConversation]);

  const checkType = (message) => {
    if (message.sender_id === loggedId) {
      if (message.sender_role === "candidate") {
        return "#26D7AB";
      } else {
        return "#7F31D2";
      }
    } else {
      return "#F2F2F2";
    }
  };
  return (
    <div>
      {selectedConversation && allMessages ? (
        <div>
          <div>
            {allMessages.map((message) => {
              return (
                <div
                  style={{
                    borderRadius: " 0px 16px 16px 16px",
                    width: "fit-content",
                    padding: "10px",
                    margin: "5px 10px",
                    marginLeft:
                      message.sender_id === loggedId ? "auto" : "10px",
                    background: checkType(message),
                    color: message.sender_id === loggedId && "white",
                  }}
                  key={message.message_id}
                >
                  {message.message}
                </div>
              );
            })}
          </div>
          <form
            style={{
              position: "sticky",
              bottom: "50px",
              width: "100%",
              background: "white",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              onSendMessage(messagetext);
            }}
          >
            <Grid
            sx={{paddingBottom: "10px",
          alignItems: "center",
          }}
            container spacing={2}>
              <Grid item xs={9}>
                <TextField
                  onChange={(e) => setMessage(e.target.value)}
                  value={messagetext}
                  fullWidth
                  id="outlined-basic"
                  label="Outlined"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={3}>
                <Button variant="contained" type="submit">
                  Send
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      ) : (
        <div>select a conversation</div>
      )}
    </div>
  );
}

export default MessageArea;
