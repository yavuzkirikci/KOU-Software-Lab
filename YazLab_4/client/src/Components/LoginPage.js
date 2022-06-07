import React, { useState, useEffect } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import CustomModal from './CustomModal.js'

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  let wrong_attempt = {}

  const onValueChange = (event, func) => {
    func(event.target.value);
  };

  const onLoginButtonClicked = async (e) => {
    e.preventDefault();
    const rawResponse = await fetch("/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    const content = await rawResponse.json();
    console.log(content);

    if (content.error) {
      console.log("login failed");
      
      if(!(email in wrong_attempt))
      {
        wrong_attempt[email] = 1
      }
      else{
        wrong_attempt[email] += 1

        if(wrong_attempt[email] === 3){
          setOpen(true);
        }

      }

      console.log(wrong_attempt)

    } else {
      console.log("login successful");
      navigate("/map", {state: {email_id : content.email_id}});
    }
  };

  return (
    <div id="login_section">
      <CustomModal keyElement={open}></CustomModal>
      <form className="login-form" id="form_submit">
        <p className="login-text">
          <span className="fa-stack fa-lg">
            <i className="fa fa-circle fa-stack-2x"></i>
            <i className="fa fa-lock fa-stack-1x"></i>
          </span>
        </p>
        <input
          type="email"
          className="login-username"
          autofocus="true"
          required="true"
          placeholder="Email"
          id="email_text"
          value={email}
          onChange={(event) => {
            onValueChange(event, setEmail);
          }}
        />
        <input
          type="password"
          className="login-password"
          required="true"
          placeholder="Password"
          id="password_text"
          value={password}
          onChange={(event) => {
            onValueChange(event, setPassword);
          }}
        />
        <input
          type="submit"
          name="Login"
          value="Login"
          className="login-submit"
          onClick={onLoginButtonClicked}
        />
      </form>
      <div className="underlay-photo"></div>
      <div className="underlay-black"></div>
    </div>
  );
}

export default LoginPage;
