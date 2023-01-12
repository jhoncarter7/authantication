import { useContext, useRef, useState } from "react";
import AuthContext from "../../store/Auth-Context";
import { useNavigate } from "react-router-dom";
import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const AuthCtx = useContext(AuthContext)
  const navigate = useNavigate()
  // 
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    //  let errorMess;
    setIsLoading(true);
    let url;
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCAhP3m8MiYwshfK94-z8ReWmNgVBvXJoA";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCAhP3m8MiYwshfK94-z8ReWmNgVBvXJoA";
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": " application/json",
      },
    })
      .then((resp) => {
        setIsLoading(false);
        if (resp.ok) {
          return resp.json();
        } else {
          return resp.json().then((data) => {
            let errorMessage = "authentication failed";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }

            // alert(errorMessage);
            // errorMess = errorMessage
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        const expirationTime = new Date(new Date().getTime() + (data.expiresIn * 1000))
        console.log(expirationTime)
        console.log(data.expiresIn * 1000)
        const some = new Date()
        console.log(typeof some)
        AuthCtx.login(data.idToken, expirationTime.toISOString())
        navigate("/")
      })
      .catch((err) => {
        console.log(err.message);
       
      });
  };


  // 
  return (
    <section className={classes.auth}>
      
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Processing....</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
