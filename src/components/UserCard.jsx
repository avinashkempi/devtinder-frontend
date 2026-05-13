import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { removeFeed } from "../utils/feedSlice";
import { useDispatch } from "react-redux";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  console.log(user);
  if (!user) return null;
  const { _id, firstName, lastName, photoUrl, age, gender, about, skills } =
    user;

  const handleSendRequest = async (status, id) => {
    try {
      await axios.post(
        BASE_URL + `/request/send/${status}/${id}`,
        {},
        { withCredentials: true },
      );
      dispatch(removeFeed(id));
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="card bg-base-100 w-96 shadow-xl">
      <figure>
        <img src={photoUrl} alt={`${firstName || "User"} profile`} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {`${firstName || ""} ${lastName || ""}`.trim()}
        </h2>
        {age && gender && <p>{`${age}, ${gender}`}</p>}
        <p>{about}</p>
        <p>{skills}</p>
        <div className="card-actions justify-end">
          <button
            onClick={() => handleSendRequest("ignore", _id)}
            className="btn btn-primary"
          >
            Ignore
          </button>
          <button
            onClick={() => handleSendRequest("interested", _id)}
            className="btn btn-secondary"
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
