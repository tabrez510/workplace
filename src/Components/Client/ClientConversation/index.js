import React, { useState } from "react";
import Sidebar from "./Sidebar";
import MessageArea from "../../common/MessageArea";
import { Button, Grid } from "@mui/material";
import {
  collection,
  query,
  where,
  onSnapshot,
  setDoc,
  orderBy,
  doc,
} from "firebase/firestore";
import { db } from "../../../config/firebaseInitisize";
import uuid from "uuidv4";
function ClientConversation() {
  const [conversationMobileSidebar, setConversationMobileSidebar] =
    useState(true);
  const [allConversations, setAllConversations] = React.useState(null);
  const [allMessages, setAllMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = React.useState(null);

  const getAllConversation = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const clientId = loggedInUser.uid;
    const q = await query(
      collection(db, "conversations"),
      where("client_id", "==", clientId)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const conversation = [];
      querySnapshot.forEach((doc) => {
        conversation.push(doc.data());
      });
      setAllConversations(conversation);
  
    });
    return unsubscribe;
  };
  const fetchAllOneToOneMessages = async () => {
    const q = await query(
      collection(db, "one-to-one"),
      where("one_to_one_id", "==", selectedConversation.one_to_one_id)
      // orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const conversation = [];
      querySnapshot.forEach((doc) => {
        conversation.push(doc.data());
      });
      setAllMessages(conversation);
    });
    return unsubscribe;
  };

  const onSendMessage = async (messagetext) => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const clientId = loggedInUser.uid;
    const message_id = uuid();
    const message = {
      message: messagetext,
      one_to_one_id: selectedConversation.one_to_one_id,
      sender_id: clientId,
      message_id,
      createdAt: new Date().getTime(),
    };
    await setDoc(doc(db, "one-to-one", message_id), message);
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            display: {
              xs: conversationMobileSidebar ? "block" : "none",
              md: "block",
            },
          }}
        >
          <Sidebar
          setConversationMobileSidebar={setConversationMobileSidebar}
            setSelectedConversation={setSelectedConversation}
            allConversations={allConversations}
            getAllConversation={getAllConversation}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={9}
          sx={{
            display: {
              xs: conversationMobileSidebar ? "none" : "block",
              md: "block",
            },
          }}
        >
          <Grid
            onClick={() => setConversationMobileSidebar((p) => !p)}
            sx={{
              display: {
                xs: "block",
                md: "none",
              },
            }}
          >
            <Button
              sx={{
                position: "fixed",
                top: 0,
                backgroundColor: "#fff",
              }}
            >
              Back
            </Button>
          </Grid>
          <MessageArea
            onSendMessage={onSendMessage}
            allMessages={allMessages}
            fetchAllOneToOneMessages={fetchAllOneToOneMessages}
            selectedConversation={selectedConversation}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default ClientConversation;
