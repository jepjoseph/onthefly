import React from "react";
import "./Avatar.css";

const Avatar = (props) => {
  return (
    <div className="Avatar">
      <img
        className="user-img"
        src={props.user.avatarurl}
        alt={`${props.user.username}'s GitHub avatar`}
      />
    </div>
  );
};

export default Avatar;
