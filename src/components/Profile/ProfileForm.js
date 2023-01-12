import { useContext, useRef } from 'react';
import AuthContext from '../../store/Auth-Context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext)
  const token = authCtx.token;
const submitHandler = (event) => {
event.preventDefault()
const newPassword = newPasswordInputRef.current.value

fetch("https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCAhP3m8MiYwshfK94-z8ReWmNgVBvXJoA", {
  method: "POST",
  body: JSON.stringify({
    idToken: token,
    password: newPassword,
    secureToken: false
  }),
  headers: {
    'Content-Type': "application/json"
  }
}).then(resp => {
  // assumption: we get success data always
})
}
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' ref={newPasswordInputRef}/>
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
