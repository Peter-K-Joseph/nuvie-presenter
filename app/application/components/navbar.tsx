import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import {
  Save,
  FolderOpen,
  Undo,
  Redo,
  Scissors,
  Copy,
  Clipboard,
  ZoomIn,
  ZoomOut,
  Ruler,
  Grid,
  Maximize,
  BoxSelect,
} from "lucide-react";

const navItems = [
  {
    label: "File",
    options: [
      {
        label: "Save",
        action: "Save the current file to draft",
        icon: Save,
        disabled: false,
        call: () => console.log("Save"),
        shortcut: "s",
        isCmd: true,
        keywords: ["save", "draft"],
      },
      {
        label: "Open",
        action: "Open a file",
        icon: FolderOpen,
        disabled: false,
        call: () => console.log("Open"),
        shortcut: "o",
        isCmd: true,
        keywords: ["open", "file"],
      },
    ],
  },
  {
    label: "Edit",
    options: [
      {
        label: "Undo",
        action: "Undo the last action",
        icon: Undo,
        disabled: false,
        call: () => console.log("Undo"),
        shortcut: "z",
        isCmd: true,
        keywords: ["undo"],
      },
      {
        label: "Redo",
        action: "Redo the last undone action",
        icon: Redo,
        disabled: false,
        call: () => console.log("Redo"),
        shortcut: "y",
        isCmd: true,
        keywords: ["redo"],
      },
      {
        label: "Cut",
        action: "Cut the selected content",
        icon: Scissors,
        disabled: false,
        call: () => console.log("Cut"),
        shortcut: "x",
        isCmd: true,
        keywords: ["cut"],
      },
      {
        label: "Copy",
        action: "Copy the selected content",
        icon: Copy,
        disabled: false,
        call: () => console.log("Copy"),
        shortcut: "c",
        isCmd: true,
        keywords: ["copy"],
      },
      {
        label: "Paste",
        action: "Paste the copied content",
        icon: Clipboard,
        disabled: false,
        call: () => console.log("Paste"),
        shortcut: "v",
        isCmd: true,
        keywords: ["paste"],
      },
      {
        label: "Select All",
        action: "Select all content",
        icon: BoxSelect,
        disabled: false,
        call: () => console.log("Select All"),
        shortcut: "a",
        isCmd: true,
        keywords: ["select all"],
      },
    ],
  },
  {
    label: "View",
    options: [
      {
        label: "Zoom In",
        action: "Increase the zoom level",
        icon: ZoomIn,
        disabled: false,
        call: () => console.log("Zoom In"),
        shortcut: "+",
        isCmd: true,
        keywords: ["zoom in"],
      },
      {
        label: "Zoom Out",
        action: "Decrease the zoom level",
        icon: ZoomOut,
        disabled: false,
        call: () => console.log("Zoom Out"),
        shortcut: "-",
        isCmd: true,
        keywords: ["zoom out"],
      },
      {
        label: "Ruler",
        action: "Toggle the ruler display",
        icon: Ruler,
        disabled: false,
        call: () => console.log("Ruler"),
        shortcut: "r",
        isCmd: true,
        keywords: ["ruler"],
      },
      {
        label: "Gridlines",
        action: "Toggle the gridlines display",
        icon: Grid,
        disabled: false,
        call: () => console.log("Gridlines"),
        shortcut: "g",
        isCmd: true,
        keywords: ["gridlines"],
      },
      {
        label: "Full Screen",
        action: "Toggle full screen mode",
        icon: Maximize,
        disabled: false,
        call: () => console.log("Full Screen"),
        shortcut: "f",
        isCmd: true,
        keywords: ["full screen"],
      },
    ],
  },
];

const Navbar = () => {
  const [active, setActive] = React.useState(null);

  return (
    <div className="border-b shadow-md">
      <div className="flex items-center space-x-6 p-3">
        <div className="space-x-2 -translate-y-[0.15rem]">
          <h1 className="text-3xl font-bold select-none">nuvie</h1>
        </div>
        {navItems.map((item, index) => (
          <Dropdown key={index}>
            <DropdownTrigger className="focus:outline-none ml-2 mr-2 flex items-center space-x-2">
              <button className="focus:outline-none">{item.label}</button>
            </DropdownTrigger>
            <DropdownMenu>
              {item.options.map((option, i) => (
                <DropdownItem key={i} textValue="true" onPress={option.call}>
                  <div className="flex items-center space-x-2">
                    <option.icon className="mr-2" size={16} />
                    <p>{option.label}</p>
                  </div>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
