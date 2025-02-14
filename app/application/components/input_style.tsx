import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Spacer } from "@heroui/spacer";
import { FaAlignLeft, FaAlignCenter, FaAlignRight } from "react-icons/fa";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@heroui/input";
import { Tab, Tabs } from "@heroui/tabs";
import { Bold, Italic, StrikethroughIcon, Underline } from "lucide-react";
import { SketchPicker } from "react-color";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Divider } from "@heroui/divider";
import { LiaFillDripSolid } from "react-icons/lia";
import { Select, SelectItem } from "@heroui/select";
import { MdOutlineFormatColorText } from "react-icons/md";

import {
  AlignmentOptions,
  CurrentConfiguration,
  CurrentConfigurationOptions,
  FontFamilyOptions,
} from "../model/text_configuration_model";
import { updateTextConfiguration } from "../redux/store";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const InputStyle = () => {
  const currentConfigurations: CurrentConfiguration = useSelector(
    (state: any) => {
      return state.store.currentConfigurations;
    },
  );
  const fontFamilies = Object.keys(FontFamilyOptions);
  const dispatch = useDispatch();

  const alignmentWidget = (value: keyof typeof AlignmentOptions) => {
    switch (AlignmentOptions[value]) {
      case AlignmentOptions.LEFT:
        return <FaAlignLeft />;
      case AlignmentOptions.CENTER:
        return <FaAlignCenter />;
      case AlignmentOptions.RIGHT:
        return <FaAlignRight />;
      default:
        return null;
    }
  };

  const constructBIUSValue = () => {
    const value = [];

    if (currentConfigurations.fontWeight >= 700) {
      value.push("bold");
    }
    if (currentConfigurations.italic) {
      value.push("italic");
    }
    if (currentConfigurations.underline) {
      value.push("underline");
    }
    if (currentConfigurations.strikethrough) {
      value.push("strikethrough");
    }

    return value;
  };

  function ahslToRgba(value: { a: number; h: number; s: number; l: number }) {
    let { h, s, l, a } = value;

    h = h % 360;
    let alpha = a;
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    let m = l - c / 2;
    let r, g, b;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return (
    <div>
      <div className="flex items-center">
        <ToggleGroup
          className="flex-1"
          type="multiple"
          value={constructBIUSValue()}
          variant="outline"
          onValueChange={(value) => {
            dispatch(
              updateTextConfiguration({
                key: CurrentConfigurationOptions.TEXT_STYLE,
                value: value,
              }),
            );
          }}
        >
          <ToggleGroupItem
            aria-label="Toggle bold"
            className="flex-1"
            value="bold"
          >
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            aria-label="Toggle italic"
            className="flex-1"
            value="italic"
          >
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            aria-label="Toggle underline"
            className="flex-1"
            value="underline"
          >
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            aria-label="Toggle strikethrough"
            className="flex-1"
            value="strikethrough"
          >
            <StrikethroughIcon className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Spacer y={2} />
      <div className="flex items-center">
        <Dropdown>
          <DropdownTrigger>
            <Button className="flex-grow truncate" variant="bordered">
              {
                FontFamilyOptions[
                  currentConfigurations.fontFamily as keyof typeof FontFamilyOptions
                ]
              }
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Static Actions"
            onAction={(e) => {
              dispatch(
                updateTextConfiguration({
                  key: CurrentConfigurationOptions.FONT_FAMILY,
                  value: e,
                }),
              );
            }}
          >
            {fontFamilies.map((fontFamily) => {
              return (
                <DropdownItem
                  key={fontFamily}
                  className={
                    currentConfigurations.fontFamily === fontFamily
                      ? "bg-primary-500 text-white"
                      : ""
                  }
                  value={fontFamily as string}
                >
                  {
                    FontFamilyOptions[
                      fontFamily as keyof typeof FontFamilyOptions
                    ]
                  }
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </Dropdown>
        <Spacer x={2} />
        <Input
          className="flex-1 min-w-28"
          endContent="px"
          max={128}
          min={8}
          type="number"
          value={currentConfigurations.fontSize.toString()}
          onChange={(e) => {
            dispatch(
              updateTextConfiguration({
                key: CurrentConfigurationOptions.FONT_SIZE,
                value: e.target.value,
              }),
            );
          }}
        />
      </div>
      <Spacer y={2} />
      <div className="flex items-center">
        <Tabs
          fullWidth
          aria-label="Options"
          className="w-full mb-2"
          color="primary"
          radius="full"
          onSelectionChange={(key) => {
            updateTextConfiguration({
              key: CurrentConfigurationOptions.ALIGNMENT,
              value: key,
            });
          }}
        >
          {Object.keys(AlignmentOptions).map((key) => {
            return (
              <Tab
                key={key}
                title={
                  <div className="flex items-center">
                    {alignmentWidget(key as keyof typeof AlignmentOptions)}
                    <Spacer x={1} />
                    <p className="text-xs">
                      {AlignmentOptions[key as keyof typeof AlignmentOptions]}
                    </p>
                  </div>
                }
              />
            );
          })}
        </Tabs>
      </div>
      <Spacer y={1} />
      <div className="flex items-center">
        <Popover>
          <PopoverTrigger>
            <Button
              className="flex-grow truncate m-0"
              variant="bordered"
              onPress={() => {
                if (currentConfigurations.color?.a === 0) {
                  dispatch(
                    updateTextConfiguration({
                      key: CurrentConfigurationOptions.COLOR,
                      value: {
                        h: 0,
                        s: 0,
                        l: 0,
                        a: 1,
                      },
                    }),
                  );
                }
              }}
            >
              <p
                className="text-xl"
                style={
                  currentConfigurations.color
                    ? { color: ahslToRgba(currentConfigurations.color) }
                    : undefined
                }
              >
                <MdOutlineFormatColorText />
              </p>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <SketchPicker
              className="p-0 rounded-bl-none rounded-br-none"
              color={currentConfigurations.color || { h: 0, s: 0, l: 0, a: 0 }}
              onChange={(color) => {
                dispatch(
                  updateTextConfiguration({
                    key: CurrentConfigurationOptions.COLOR,
                    value: color.hsl,
                  }),
                );
              }}
            />
            <Button
              className="w-full rounded-tl-none rounded-tr-none"
              onPress={() => {
                dispatch(
                  updateTextConfiguration({
                    key: CurrentConfigurationOptions.COLOR,
                    value: null,
                  }),
                );
              }}
            >
              <p className="text-small">Clear</p>
            </Button>
          </PopoverContent>
        </Popover>
        <Spacer x={1} />
        <Popover>
          <PopoverTrigger>
            <Button
              className="flex-grow truncate m-0"
              style={
                currentConfigurations.backgroundColor
                  ? {
                      backgroundColor: ahslToRgba(
                        currentConfigurations.backgroundColor,
                      ),
                    }
                  : undefined
              }
              variant="bordered"
              onPress={() => {
                if (currentConfigurations.backgroundColor?.a === 0) {
                  dispatch(
                    updateTextConfiguration({
                      key: CurrentConfigurationOptions.BACKGROUND_COLOR,
                      value: {
                        h: 0,
                        s: 0,
                        l: 0,
                        a: 1,
                      },
                    }),
                  );
                }
              }}
            >
              <p
                className="text-xl"
                style={
                  currentConfigurations.color
                    ? { color: ahslToRgba(currentConfigurations.color) }
                    : undefined
                }
              >
                <LiaFillDripSolid />
              </p>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <SketchPicker
              className="p-0 rounded-bl-none rounded-br-none"
              color={
                currentConfigurations.backgroundColor || {
                  h: 0,
                  s: 0,
                  l: 0,
                  a: 0,
                }
              }
              onChange={(color) => {
                dispatch(
                  updateTextConfiguration({
                    key: CurrentConfigurationOptions.BACKGROUND_COLOR,
                    value: color.hsl,
                  }),
                );
              }}
            />
            <Button
              className="w-full rounded-tl-none rounded-tr-none"
              onPress={() => {
                dispatch(
                  updateTextConfiguration({
                    key: CurrentConfigurationOptions.BACKGROUND_COLOR,
                    value: null,
                  }),
                );
              }}
            >
              <p className="text-small">Clear</p>
            </Button>
          </PopoverContent>
        </Popover>
        <Spacer x={1} />
        <Select
          className="max-w-xs"
          value={currentConfigurations.fontWeight.toString()}
          onChange={(e) => {
            dispatch(
              updateTextConfiguration({
                key: CurrentConfigurationOptions.FONT_WEIGHT,
                value: parseInt(e.target.value),
              }),
            );
          }}
        >
          {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((weight) => {
            console.log(currentConfigurations.fontWeight.toString(), weight);
            return (
              <SelectItem key={weight} value={weight.toString()}>
                {weight}
              </SelectItem>
            );
          })}
        </Select>
      </div>
      <Divider className="my-2" content="Border" />
    </div>
  );
};

export default InputStyle;
