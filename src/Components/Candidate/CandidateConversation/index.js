import React, { useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../config/firebaseInitisize";
import uuid from "uuidv4";
import MessageArea from "../../common/MessageArea";
import CandidateConversationSideBar from "./CandidateConversationSideBar";
import { Button, Grid } from "@mui/material";
function CandidateConversation() {
  const [conversationMobileSidebar, setConversationMobileSidebar] =
    useState(true);
  const [selectedConversation, setSelectedConversation] = React.useState(null);
  const [allConversations, setAllConversations] = React.useState(null);
  const [allMessages, setAllMessages] = useState([]);

  function candidateConversation() {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const candidateId = loggedInUser.uid;
    try {
      const q = query(
        collection(db, "conversations"),
        where("candidate_id", "==", candidateId)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const conversation = [];
        querySnapshot.forEach((doc) => {
          conversation.push(doc.data());
        });
        setAllConversations(conversation);
      });
      return unsubscribe;
    } catch (e) {
      console.log(e);
    }
  }

  const fetchAllOneToOneMessages = async () => {
    const q = query(
      collection(db, "one-to-one"),
      where("one_to_one_id", "==", selectedConversation.one_to_one_id),
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
    const candidateId = loggedInUser.uid;
    const message_id = uuid();
    const message = {
      message_id: message_id,
      message: messagetext,
      one_to_one_id: selectedConversation.one_to_one_id,
      sender_id: candidateId,
      sender_role: "candidate",
      timestamp: new Date(),
    };
    await setDoc(doc(db, "one-to-one", message_id), message);
  }
  return (
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
        <CandidateConversationSideBar
        setConversationMobileSidebar={setConversationMobileSidebar}
          candidateConversation={candidateConversation}
          allConversations={allConversations}
          setSelectedConversation={setSelectedConversation}
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
          sx={{
            display: {
              xs: "block",
              md: "none",
              backgroundColor: "#fff",
            },
          }}
        >
          <Button
          sx={{
            position:'fixed',
            top:0,
            backgroundColor: "#fff",
          }}
          onClick={() => setConversationMobileSidebar(true)}>
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
  );
}

export default CandidateConversation;
