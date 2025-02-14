import React, { Component } from "react";

import ConversionClass from "./helper/conversion";

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
// import { CurrentConfiguration } from "../model/text_configuration_model";

class TextEditor extends Component {
  private editorRef: React.RefObject<HTMLDivElement>;
  // private currentConfigurations: CurrentConfiguration;

  constructor(props: {}) {
    super(props);
    this.editorRef = React.createRef();
    // this.currentConfigurations = new CurrentConfiguration();
  }

  // Apply text alignment
  applyAlignment = (alignment: "left" | "center" | "right") => {
    const selection = window.getSelection();

    if (!selection || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.extractContents();
    const alignDiv = document.createElement("div");

    alignDiv.style.textAlign = alignment;
    alignDiv.appendChild(selectedText);
    range.insertNode(alignDiv);
  };

  // Apply text color
  applyColor = (color: string) => {
    const selection = window.getSelection();

    if (!selection || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.extractContents();
    const span = document.createElement("span");

    span.style.color = color;
    span.appendChild(selectedText);
    range.insertNode(span);
  };

  // Apply font size
  applyFontSize = (size: string) => {
    const selection = window.getSelection();

    if (!selection || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.extractContents();
    const span = document.createElement("span");

    span.style.fontSize = size;
    span.appendChild(selectedText);
    range.insertNode(span);
  };

  // Convert HTML content to JSON
  convertToJSON = () => {
    const content = this.editorRef.current?.innerHTML || "";

    console.log("HTML Content:", content);
    const tempDiv = document.createElement("div");

    tempDiv.innerHTML = content;
    const json = ConversionClass.htmlToJson(tempDiv);

    // Save 'json' to your storage (e.g., localStorage, database)
    console.log("Converted JSON:", JSON.stringify(json));
  };

  // Convert JSON back to HTML
  convertToHTML = (json: any) => {
    const html = ConversionClass.jsonToHtml(json);

    if (this.editorRef.current) {
      this.editorRef.current.innerHTML = html;
    }
  };

  componentDidMount() {
    // Load 'json' from your storage (e.g., localStorage, database)
    const json = ""; // Replace with actual loading logic

    if (json) {
      this.convertToHTML(json);
    }
  }

  renderColorPicker = () => (
    <input
      title="Choose text color"
      type="color"
      onChange={(e) => this.applyColor(e.target.value)}
    />
  );

  renderFontSizeSelector = () => (
    <select
      title="Choose font size"
      onChange={(e) => this.applyFontSize(e.target.value)}
    >
      <option value="12px">Small</option>
      <option value="16px">Medium</option>
      <option value="20px">Large</option>
    </select>
  );

  textModifierWidget = () => {
    return (
      <div className="flex items-center space-x-2">
        <button onClick={() => this.applyAlignment("left")}>Left</button>
        <button onClick={() => this.applyAlignment("center")}>Center</button>
        <button onClick={() => this.applyAlignment("right")}>Right</button>
        {this.renderColorPicker()}
        {this.renderFontSizeSelector()}
      </div>
    );
  };

  contextMenuActions = () => {
    return (
      <ContextMenuContent className="w-64">
        <ContextMenuItem inset>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled inset>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset>
          Font Size
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Align Content</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onClick={() => this.applyAlignment("left")}>
              Left
            </ContextMenuItem>
            <ContextMenuItem onClick={() => this.applyAlignment("center")}>
              Center
            </ContextMenuItem>
            <ContextMenuItem onClick={() => this.applyAlignment("right")}>
              Right
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
      </ContextMenuContent>
    );
  };

  render() {
    return (
      <div className="w-full max-w-full">
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              ref={this.editorRef}
              contentEditable
              style={{
                border: "1px solid #ccc",
                minHeight: "200px",
                padding: "10px",
              }}
            />
          </ContextMenuTrigger>
          {this.contextMenuActions()}
        </ContextMenu>
        {this.textModifierWidget()}
      </div>
    );
  }
}

export default TextEditor;
