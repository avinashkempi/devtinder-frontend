import Body from "./components/Body";
import Login from "./components/Login";
import { Routes, Route } from "react-router";
import Profile from "./components/Profile";
import Feed from "./components/Feed";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Body />}>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
