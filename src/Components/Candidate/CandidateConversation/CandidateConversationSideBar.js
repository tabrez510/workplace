import React, { useEffect } from "react";

function CandidateConversationSideBar({
  candidateConversation,
  setConversationMobileSidebar,
  allConversations,
  setSelectedConversation,
}) {
  useEffect(() => {
    candidateConversation();
  }, []);

  return (
    <div>
      {!allConversations ? (
        <div>laoding</div>
      ) : allConversations && allConversations.length === 0 ? (
        <div>nodata</div>
      ) : allConversations && allConversations.length > 0 ? (
        <div>
          {allConversations.map((conversation) => {
            return (
              <div
              onClick={() => {setSelectedConversation(conversation);setConversationMobileSidebar(false)}}
              style={{border:"1px solid black",margin:"10px",padding:"5px"}}
              >
                <div>{conversation.client_name}</div>
                <div>{conversation.last_message}</div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default CandidateConversationSideBar;
