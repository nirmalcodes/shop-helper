import React from "react";
import SHNavbar from "../SHNavbar/SHNavbar";

const Layout = (props) => {
  return (
    <>
      <SHNavbar />
      <div>{props.children}</div>
    </>
  );
};

export default Layout;
