import React from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import sideImage from "./images/sideImage.png";
import Authentication from "./images/authentication.png";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Google } from "./Google.svg";
import { auth } from "../../config/firebaseInitisize";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebaseInitisize";
function Signup({ type }) {
  let navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  console.log(type);
  async function getProfile({ userId, token, user, type }) {
    try {
      const docRef = doc(db, "usersData", userId);
      const docData = await getDoc(docRef);
      if (docData.exists()) {
        console.log("Document data:", docData.data());
        const constDocData = docData.data();
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, userInfo: { ...constDocData } })
        ); //store in Local storage

        if (constDocData.step === 2) {
          if (type === "client") {
            if (constDocData.user_type === "candidate") {
              alert("You are not allowed to login as client");
              return;
            } else {
              setTimeout(() => {
                navigate("/client/profile");
              }, 2000);
             
            }
          } else {
            if (constDocData.user_type === "client") {
              alert("You are not allowed to login as candidate");
              return;
            } else {
            setTimeout(() => {
              navigate("/candidate/profile");
            }, 2000);
            }
          }
        } else {
          if (type === "client") {
            navigate("/onboarding/client");
          } else {
            navigate("/onboarding/candidate");
          }
        }
      } else {
        if (type === "client") {
          navigate("/onboarding/client");
        } else {
          navigate("/onboarding/candidate");
        }
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result, "result");
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user, "token", token);
        localStorage.setItem("user", JSON.stringify(user)); //store in Local storage
        localStorage.setItem("token", token); //store in Local storage
        const userInfo = getProfile({ userId: user.uid, token, user, type });

        // ...
      })
      .catch((error) => {
        alert("error");
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  return (
    <div className="wrapper-container">
      <div className="side-image-container">
        <img src={sideImage} alt="Girl"></img>
      </div>
      <div className="signin-container">
        <h2>
          Welcome <span>{type}</span>
        </h2>
        <img src={Authentication} alt="auth"></img>
        <h1>Sign IN</h1>
        <button onClick={signIn}>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="48px"
              height="48px"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
          </span>
          Signup with Google
        </button>
      </div>
    </div>
  );
}

export default Signup;
