import React from "react";
import { Kbd, KbdKey } from "@heroui/kbd";

import {
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";

export class CommanderModel {
  name: string;
  action: string;
  icon: React.ElementType;
  shortcut: string;
  disabled: boolean;
  isShift: boolean;
  isCtrl: boolean;
  isCmd: boolean;
  keywords: string[];
  call: () => void;

  constructor(
    name: string,
    action: string,
    icon: React.ElementType,
    disabled: boolean,
    call: () => void,
    {
      shortcut,
      isShift,
      isCtrl,
      isCmd,
      keywords,
    }: {
      shortcut?: string;
      isShift?: boolean;
      isCtrl?: boolean;
      isCmd?: boolean;
      keywords?: string[];
    }
  ) {
    this.name = name;
    this.shortcut = shortcut || "";
    this.isShift = isShift || false;
    this.isCtrl = isCtrl || false;
    this.isCmd = isCmd || false;
    this.action = action;
    this.icon = icon;
    this.shortcut = shortcut || "";
    this.disabled = disabled;
    this.isShift = isShift || false;
    this.isCtrl = isCtrl || false;
    this.isCmd = isCmd || false;
    this.keywords = keywords || [];
    this.call = call;
  }

  _generateShortcut(): JSX.Element {
    let keys: KbdKey[] = [];

    if (this.isShift) keys.push("shift");
    if (this.isCtrl) keys.push("ctrl");
    if (this.isCmd) keys.push("command");

    return <Kbd keys={keys}>{this.shortcut.toUpperCase()}</Kbd>;
  }

  callback(closeFunction: () => void): void {
    if (!this.disabled) {
      this.call();
      closeFunction();
    }
  }

  toWidget(closeFunction: () => void): JSX.Element {
    return (
      <CommandItem
        disabled={this.disabled}
        keywords={this.keywords}
        onSelect={() => this.callback(closeFunction)}
      >
        {React.createElement(this.icon)}
        <span>{this.name}</span>
        {this.shortcut && (
          <CommandShortcut>{this._generateShortcut()}</CommandShortcut>
        )}
      </CommandItem>
    );
  }
}

export class CommandGroupModel {
  heading: string;
  commands: CommanderModel[];

  constructor(heading: string, commands: CommanderModel[]) {
    this.heading = heading;
    this.commands = commands;
  }

  toWidget(closeFunction: () => void): JSX.Element {
    return (
      <CommandGroup heading={this.heading}>
        {this.commands.map((command, index) => (
          <React.Fragment key={index}>
            {command.toWidget(closeFunction)}
          </React.Fragment>
        ))}
      </CommandGroup>
    );
  }
}
