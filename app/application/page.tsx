"use client";
import Commander from "@/components/command";
import React from "react";
import NavBar from "./components/navbar";


class PresentationView extends React.Component {
  render() {
    return (
      <div className="w-screen h-screen">
        <Commander />
        <NavBar />
      </div>
    );
  }
}

export default PresentationView;
