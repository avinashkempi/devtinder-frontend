import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect } from "react";
const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequest = async (status, id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + id,
        null,
        { withCredentials: true },
      );

      dispatch(removeRequest(id));

      fetchRequests();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRequests = async () => {
    const res = await axios.get(BASE_URL + "/user/requests/received", {
      withCredentials: true,
    });
    dispatch(addRequests(res.data.data));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return null;
  if (requests.length === 0) return <h1>No requests found</h1>;
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {requests.map((request) => {
        const user = request?.fromUserId || request?.user || request;
        const { firstName, lastName, photoUrl, age, gender, about, skills } =
          user || {};

        return (
          <div
            key={
              user?._id ||
              request?._id ||
              user?.email ||
              request?.fromUserId ||
              request?.toUserId
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
              <h2 className="card-title">
                {`${firstName || ""} ${lastName || ""}`.trim()}
              </h2>
              {age && gender && <p>{`${age}, ${gender}`}</p>}
              <p>{about}</p>
              <p>{Array.isArray(skills) ? skills.join(", ") : skills}</p>
              <div className="card-actions justify-end">
                <button onClick={()=> reviewRequest("accepted", request._id)} className="btn btn-primary">
                  Accept
                </button>
                <button onClick={()=> reviewRequest("rejected", request._id)} className="btn btn-secondary">
                  Reject
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
