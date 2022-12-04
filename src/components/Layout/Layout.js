import React from "react";
import SHNavbar from "../SHNavbar/SHNavbar";

const Layout = (props) => {
  return (
    <>
      <SHNavbar />
      <div className="ptop_navplus">{props.children}</div>
    </>
  );
};

export default Layout;
