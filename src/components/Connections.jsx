import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
const Connections = () => {
  const connections = useSelector((store) => store.connection);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (error) {
      console.error(error?.response?.data || error.message || error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;
  if (connections.length === 0) return <h1>No connections found</h1>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {connections.map((connection, idx) => {
        const {
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
          skills,
        } = connection || {};

        return (
          <div
            key={
              connection?._id ||
              connection?.email ||
              connection?.firstName ||
              `conn-${idx}`
            }
            className="card bg-base-100 w-96 shadow-xl"
          >
            <figure>
              <img
                src={
                  photoUrl ||
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
                alt={`${firstName || "User"} profile`}
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{`${firstName || ""} ${lastName || ""}`.trim()}</h2>
              {age && gender && <p>{`${age}, ${gender}`}</p>}
              <p>{about}</p>
              <p>{Array.isArray(skills) ? skills.join(", ") : skills}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
