"use client";
import React from "react";
import { Toaster } from "sonner";
import { Provider } from "react-redux";

import NavBar from "./components/navbar";
import ContentEditorPage from "./components/body";
import store from "./redux/store";

import Commander from "@/components/command";

class PresentationView extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div className="w-screen h-screen max-h-screen flex flex-col">
          <Commander />
          <NavBar />
          <Toaster />
          <ContentEditorPage />
        </div>
      </Provider>
    );
  }
}

export default PresentationView;
