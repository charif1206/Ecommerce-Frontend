import React from "react";
import { Link } from "react-router-dom";
export default function HeaderLeft() {
  return (
    <Link to="/">
      <div className="   ">
        <span className=" font-black  text-3xl ">das</span>
        <span className=" font-thin text-3xl   ">tech</span>
        <span className=" text-yellow-500 text-5xl font-black  ">.</span>
      </div>
    </Link>
  );
}
