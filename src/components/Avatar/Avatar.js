import React from "react";
import "./style.css";

const Avatar = (props) => {
  return (
    <div className="nf_avatar">
      {props.src && (
        <img
          src="https://api.lorem.space/image/face?w=300&h=300"
          alt={props.alt ? props.alt : "avatar"}
        />
      )}
      {props.children}
    </div>
  );
};

export default Avatar;
