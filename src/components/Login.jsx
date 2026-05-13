import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("virat@example.com");
  const [password, setPassword] = useState("Password@123");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { email, password },
        { withCredentials: true },
      );
      dispatch(addUser(res.data.data));
      navigate("/");
    } catch (error) {
      setError(error?.response?.data);
      console.log(error);
    }
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, email, password },
        { withCredentials: true },
      );
      dispatch(addUser(res.data.data));
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">
          {isSignup ? "Sign up" : "Login"}
        </legend>

        {isSignup && (
          <>
            <label className="label">First Name</label>
            <input
              type="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input"
              placeholder="Enter First Name"
            />

            <label className="label">Last Name</label>
            <input
              type="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="input"
              placeholder="Enter Last Name"
            />
          </>
        )}
        <label className="label">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          placeholder="Email"
        />

        <label className="label">Password</label>
        <input
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <p className="text-red-500">{error}</p>
        <button
          className="btn btn-neutral mt-4"
          onClick={isSignup ? handleSignup : handleLogin}
        >
          {isSignup ? "Sign up" : "Login"}
        </button>

        <a
          className="m-auto cursor-pointer mt-3"
          onClick={() => setIsSignup((prev) => !prev)}
        >
          {isSignup ? "Existing User? Login Here" : "New User? Sign up here"}
        </a>
      </div>
    </div>
  );
};

export default Login;
