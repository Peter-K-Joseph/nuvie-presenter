import { Button } from "@heroui/button";
import { User } from "@heroui/user";
import { Divider } from "@heroui/divider";
import { Skeleton } from "@heroui/skeleton";
import { ArrowLeft, File, Search } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";

import { openCommander } from "../redux/store";

class UserModel {
  name: string;
  permission: string;
  url: string;

  constructor(name: string, permission: string, url: string) {
    this.name = name;
    this.permission = permission;
    this.url = url;
  }
}

class NavInfoModel {
  title: string;
  created_by: UserModel;
  date: Date;
  current_user: UserModel;

  constructor(
    title: string,
    created_by: UserModel,
    date: Date,
    current_user: UserModel,
  ) {
    this.title = title;
    this.created_by = created_by;
    this.date = date;
    this.current_user = current_user;
  }
}

const Navbar = () => {
  const [info, setInfo] = React.useState<NavInfoModel | undefined>(undefined);
  const focusMode = useSelector((state: any) => {
    return state.store.focusMode;
  });
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      setInfo(
        new NavInfoModel(
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates reprehenderit eius obcaecati, ad ratione magni quaerat ut recusandae veritatis sunt odio amet tenetur. Quas est omnis obcaecati nulla aspernatur sit.",
          new UserModel(
            "Peter K Joseph",
            "Software Engineer",
            "https://avatars.githubusercontent.com/u/30373425?v=4",
          ),
          new Date(),
          new UserModel(
            "Peter K Joseph",
            "Software Engineer",
            "https://avatars.githubusercontent.com/u/30373425?v=4",
          ),
        ),
      );
    }, 1000);
  }, []);

  return (
    <>
      <AnimatePresence>
        {!focusMode && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, overflow: "hidden", height: 0 }}
            initial={{ opacity: 0, y: -10 }}
          >
            <div className="border-b-medium">
              <div className="flex items-center justify-between space-x-7 p-3">
                <div className="flex items-center space-x-2 w-1/2">
                  <Button isIconOnly color="primary">
                    <ArrowLeft />
                  </Button>
                  <Divider className="h-10" orientation="vertical" />
                  <File size={40} />
                  <div className="flex-1 min-w-0">
                    <AnimatePresence>
                      {info == undefined && (
                        <motion.div
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          initial={{ opacity: 0, x: -10 }}
                        >
                          <Skeleton className="h-3 w-2/4 rounded-lg mt-1" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {info != undefined && (
                        <motion.div
                          animate={{
                            opacity: 1,
                            x: 0,
                            display: "block",
                          }}
                          className="flex items-center space-x-2"
                          exit={{ opacity: 0.8, x: 10, display: "none" }}
                          initial={{ display: "none", opacity: 0.8, x: -10 }}
                          transition={{ delay: 0.3 }}
                        >
                          <h1 className="text-lg font-bold select-none truncate follow-brand">
                            {info.title}
                          </h1>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {info == undefined && (
                        <motion.div
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          initial={{ opacity: 0, x: -10 }}
                        >
                          <Skeleton className="h-3 w-1/4 rounded-lg mt-1" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {info != undefined && (
                        <motion.div
                          animate={{
                            opacity: 1,
                            x: 0,
                            display: "block",
                          }}
                          className="flex items-center space-x-2"
                          exit={{ opacity: 0, x: 10, display: "none" }}
                          initial={{ display: "none", opacity: 0, x: -10 }}
                          transition={{ delay: 0.3 }}
                        >
                          <p className="text-xs font-normal text-gray-400 follow-brand">
                            Created by <b>{info.created_by.name}</b> on
                            <i> {info.date.toDateString()}</i>
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="w-1/2 flex items-center justify-end space-x-2 -translate-y-[0.15rem]">
                  <Button
                    isIconOnly
                    aria-label="search"
                    color="primary"
                    onPress={() => dispatch(openCommander())}
                  >
                    <Search />
                  </Button>
                  <Divider className="h-10" orientation="vertical" />
                  <div>
                    {info == undefined ? (
                      <div>
                        <Skeleton className="flex rounded-full w-12 h-12" />
                      </div>
                    ) : (
                      <motion.div
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center space-x-2"
                        initial={{ opacity: 0, x: 10 }}
                      >
                        <User
                          avatarProps={{
                            src: info.current_user.url,
                          }}
                          description={
                            <p className="text-xs text-gray-400">
                              {info.current_user.permission}
                            </p>
                          }
                          name={info.current_user.name}
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {focusMode && (
          <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <Button
              isIconOnly
              aria-label="search"
              className="fixed bottom-5 right-5"
              color="primary"
              onPress={() => dispatch(openCommander())}
            >
              <Search />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
