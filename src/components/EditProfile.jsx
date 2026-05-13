import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../utils/constants";

const EditProfile = ({ user = {} }) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [skills, setSkills] = useState((user.skills || []).join(", "));
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSave = async (event) => {
    event.preventDefault();

    setError("");
    const payload = {
      firstName,
      lastName,
      age: Number(age),
      gender,
      about,
      photoUrl,
      skills: skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      await axios.patch(BASE_URL + "/profile/edit", payload, {
        withCredentials: true,
      });
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      setError(error?.response?.data);
    }

    console.log("Profile saved", payload);
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-base-100 px-4">
        <div className="fieldset bg-base-200 border-base-300 rounded-box w-full max-w-md border p-6 shadow-sm">
          <legend className="fieldset-legend text-xl font-semibold">
            Edit Profile
          </legend>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="label">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input w-full"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label className="label">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input w-full"
                placeholder="Enter your last name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="input w-full"
                  placeholder="Age"
                  min="18"
                />
              </div>
              <div>
                <label className="label">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="select w-full"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">About You</label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="textarea w-full"
                placeholder="Tell others a little about yourself"
                rows={4}
              />
            </div>

            <div>
              <label className="label">Skills</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="input w-full"
                placeholder="Enter skills separated by commas"
              />
            </div>

            <div>
              <label className="label">Photo URL</label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="input w-full"
                placeholder="Paste a profile photo URL"
              />
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <button type="submit" className="btn btn-neutral w-full">
              Save Changes
            </button>
          </form>
        </div>
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
            <div className="card-actions justify-end"></div>
          </div>
        </div>
      </div>
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Changes sent successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
