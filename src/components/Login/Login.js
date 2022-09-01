import React, { useState, useEffect, useReducer, useContext, useRef } from "react";
import Input from "../UI/Input/Input";
import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";
// reducer function uses only data which is not created in the component
const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    console.log(state.value);
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    console.log(state.isValid);
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    console.log(state.value);
    return { value: action.val, isValid: action.val.length > 6 };
  }
  if (action.type === "USER_BLUR") {
    console.log(state.isValid);

    return { value: state.value, isValid: state.value.length > 6 };
  }
  return { value: "", isValid: false };
};

const Login = (props) => {
  // useReducer - first value is the state and the dispatch function
  // reducer function created outside of the component function
  // reducer function is first value passed
  // second value in use reducer is the initial state
  // we need to use the dispatch to update a value or update validity
  const ctx = useContext(AuthContext);
  const [emailState, dispatechEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  const [formIsValid, setFormIsValid] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();

  useEffect(() => {
    console.log("effect running");

    // cleanup function below runs every time, without a dependancy it will still run
    return () => {
      console.log("effect cleanup");
    };
  }, []);
  // object destructuring to pull out properties of those objects
  const { isValid: passwordIsValid } = passwordState;
  const { isValid: emailIsValid } = emailState;
  // useEffect runs after each rendering of the component. if we add empty array
  // it doesnt run after the initial mounting
  useEffect(() => {
    // storing the main function and the timeout as a variable to use later down as the cleanup
    const identifier = setTimeout(() => {
      console.log("checking form validity");
      setFormIsValid(emailIsValid && passwordIsValid);
      // timer below after the function
    }, 500);
    // cleanup for useEffect before it executes the next time
    return () => {
      // inbuilt function to clear the timeout so the timer resets each time the timer is cleared
      clearTimeout(identifier);
    };
    // arguments passed are the states that may changed
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    // when dispatch email is called it usually an object used as an identifier
    // second argument is that we want to sve what user entered, so we add val which holds the target value
    dispatechEmail({ type: "USER_INPUT", val: event.target.value });
    setFormIsValid(event.target.value.includes("@") && passwordState.isValid);
  };

  const passwordChangeHandler = (event) => {
    console.log(event.target.value);
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });
    setFormIsValid(emailState.isValid && passwordState.isValid);
  };

  const validateEmailHandler = () => {
    dispatechEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "INPUT_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if(formIsValid) {
      ctx.onLogin(emailState.value, passwordState.value);
    } else if(!emailIsValid) {
      emailRef.current.activate();
    } else { 
      passwordRef.current.activate();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailRef}
          id="email"
          type="email"
          label="E-Mail"
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          ref={passwordRef}
          id="password"
          type="password"
          label="Password"
          isValid={passwordIsValid}
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />

        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} >
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
