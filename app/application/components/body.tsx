import { useSelector } from "react-redux";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, Tab } from "@heroui/tabs";

import TextEditor from "./editor";
import InputStyle from "./input_style";

const SideBar = () => {
  const focusMode = useSelector((state: any) => {
    return state.store.focusMode;
  });
  const [state, setState] = React.useState("floors");

  const components = () => {
    return (
      <div>
        <h1>BOM</h1>
      </div>
    );
  };

  const overview = () => {
    return (
      <div className="info-panel mt-2 flex-grow mb-10 overflow-hidden w-full">
        <InputStyle />
      </div>
    );
  };

  const animateSidebar = (child: React.JSX.Element) => {
    return (
      <motion.div
        animate={{ opacity: 1, y: 0, display: "block" }}
        className="w-full relative"
        exit={{ opacity: 0, y: "100%" }}
        initial={{
          opacity: 0,
          y: "100%",
          display: "none",
        }}
        transition={{ duration: 0.1, type: "curve", delay: 0.2 }}
      >
        {child}
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {!focusMode && (
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="w-1/5 h-full border-r-medium min-w-[300px] p-2 max-w-1/5"
          exit={{ opacity: 0, x: "-100%" }}
          initial={{ opacity: 0, x: "-100%" }}
          transition={{ duration: 0.3, type: "easeInOut" }}
        >
          <div className="flex w-full flex-col items-center">
            <Tabs
              fullWidth
              aria-label="Options"
              className="w-full mb-2"
              color="primary"
              radius="full"
              onSelectionChange={(key) => {
                setState(key as string);
              }}
            >
              <Tab key="overview" title="Overview" />
              <Tab key="components" title="Component" />
            </Tabs>
            <AnimatePresence>
              {state === "overview" && animateSidebar(overview())}
            </AnimatePresence>
            <AnimatePresence>
              {state === "components" && animateSidebar(components())}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ContentEditorPage = () => {
  return (
    <div className="flex h-full">
      <SideBar />
      <TextEditor />
    </div>
  );
};

export default ContentEditorPage;
