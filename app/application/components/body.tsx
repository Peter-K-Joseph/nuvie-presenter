import { useSelector } from "react-redux";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, Tab } from "@heroui/tabs";
import { Divider } from "@heroui/divider";

const SideBar = () => {
  const focusMode = useSelector((state: any) => {
    return state.store.focusMode;
  });
  const [state, setState] = React.useState("floors");

  const floors = () => {
    return (
      <div>
        <h1>Floors</h1>
      </div>
    );
  };

  const bom = () => {
    return (
      <div>
        <h1>BOM</h1>
      </div>
    );
  };

  const info = () => {
    return (
      <div>
        <h1>Info</h1>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {!focusMode && (
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="w-1/4 h-full border-r-medium min-w-[300px] p-2"
          exit={{ opacity: 0, x: "-100%" }}
          initial={{ opacity: 0, x: "-100%" }}
          transition={{ duration: 0.3, type: "tween" }}
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
              <Tab key="floors" title="Floors" />
              <Tab key="bom" title="BOM" />
              <Tab key="info" title="Info" />
            </Tabs>
            <Divider className="w-full" />
            {
              {
                floors: floors(),
                bom: bom(),
                info: info(),
              }[state]
            }
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
    </div>
  );
};

export default ContentEditorPage;
