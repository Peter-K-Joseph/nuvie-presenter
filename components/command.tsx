"use client";
import { Edit, Focus, Info, LucideSearchX, Save, View } from "lucide-react";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useDispatch, useSelector } from "react-redux";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { CommanderModel, CommandGroupModel } from "@/src/models/commands-model";
import { ThemeController } from "@/src/controller/theme-provider";
import {
  closeCommander,
  toggleCommander,
  toggleFocus,
} from "@/app/application/redux/store";

const CommandNotFound = () => (
  <div>
    <motion.div
      animate="shake"
      className="flex flex-col items-center justify-center"
      initial="hidden"
      variants={{
        hidden: { x: 0 },
        shake: {
          x: [0, -5, 5, -5, 5, -5, 5, -5, 5, 0],
          transition: {
            duration: 0.5,
            ease: "easeInOut",
            repeat: 0,
          },
        },
      }}
    >
      <LucideSearchX size={60} />
    </motion.div>
    <h1 className="text-xl font-bold mt-2">Command not found</h1>
    <p>The requested command was not found</p>
  </div>
);

const Commander = () => {
  const commander = useSelector((state: any) => {
    return state.store.commanderOpen;
  });
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  const themeManager = new ThemeController(theme, setTheme);

  const commands = [
    new CommandGroupModel("Quick Access", [
      new CommanderModel(
        "Save",
        "Save the current file to draft",
        () => <Save />,
        false,
        () => console.log("Save"),
        { shortcut: "s", isCmd: true, keywords: ["save", "draft"] },
      ),
      new CommanderModel(
        "Focus Mode",
        "Toggle focus mode",
        () => <Focus />,
        false,
        () => dispatch(toggleFocus()),
        { shortcut: "f", isCmd: true, keywords: ["focus", "mode"] },
      ),
    ]),
    new CommandGroupModel("View Mode", [
      new CommanderModel(
        "Switch to editor mode",
        "Switched to editor mode",
        () => <Edit />,
        false,
        () => console.log("Editor"),
        { keywords: ["editor", "edit", "mode"] },
      ),
      new CommanderModel(
        "Switch to preview mode",
        "Switched to preview mode",
        () => <View />,
        false,
        () => console.log("Preview"),
        { keywords: ["preview", "view", "mode"] },
      ),
      new CommanderModel(
        "Article Information",
        "View and Edit article information",
        () => <Info />,
        false,
        () => console.log("Info"),
        { keywords: ["info", "mode", "seo", "article"] },
      ),
    ]),
    new CommandGroupModel("Settings", [
      new CommanderModel(
        `Switch to ${themeManager.isDark() ? "light" : "dark"} theme`,
        "Switched application theme between light and dark",
        () => themeManager.icon({}),
        false,
        () => themeManager.toggle(),
        { keywords: ["theme", "switch", "mode", "settings"] },
      ),
    ]),
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        dispatch(toggleCommander());
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <CommandDialog
      open={commander}
      onOpenChange={() => dispatch(closeCommander())}
    >
      <Command label="Commander">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>
            <CommandNotFound />
          </CommandEmpty>
          {commands.map((group, index) => (
            <React.Fragment key={`group-command-${index}`}>
              {group.toWidget(() => {
                dispatch(closeCommander());
              })}
            </React.Fragment>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  );
};

export default Commander;
