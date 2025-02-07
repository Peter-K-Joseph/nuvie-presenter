"use client";
"use strict";
import React, { Component, createRef } from "react";
import {
  MdClose,
  MdOutlineFullscreen,
  MdUndo,
  MdZoomIn,
  MdZoomOut,
} from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast, Slide } from "react-toastify";

import Area from "../../interface/draw_layer/widgets/area_logic";

import FloorWidgets from "./floor_widgets";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { DrawLayerState } from "@/interface/draw_layer/draw_layer_interface";
import { ImageComponentLayerInterface } from "@/interface/draw_layer/components/ImageComponentLayerInterface";
import { ComponentBaseLayerType } from "@/enums/ComponentLayerEnums";
import { PageLayerState } from "@/interface/draw_layer/pages_layer_interface";
import {
  ExtendedCanvasRenderingContext2D,
  extendedCanvasRenderingContext2D,
} from "@/interface/draw_layer/extended_canvas_render";
import { WidgetsEnums } from "@/enums/WidgetsEnums";
import {
  BaseLogicInterface,
  Position,
} from "@/interface/draw_layer/widgets/base_logic";

class DrawLayer extends Component<{}, DrawLayerState> {
  images: { [key: string]: HTMLImageElement } = {};
  isShiftKeyPressed = false;
  canvasRef!: React.RefObject<HTMLCanvasElement>;
  ctx!: ExtendedCanvasRenderingContext2D;

  constructor(props: {}) {
    super(props);
    this.canvasRef = createRef();

    this.state = {
      isDrawing: false,
      isPanning: false,
      showContenxtMenu: {
        show: false,
        x: 0,
        y: 0,
      },
      params: {
        hoveredOn: [],
        selected: [],
        zoom: 0,
        window: { width: window.innerWidth, height: window.innerHeight },
        pan: { x: 0, y: 0 },
        center: { x: 0, y: 0 },
        dragged: false,
        dragStart: { x: 0, y: 0 },
        isPanning: false,
      },
      mousePos: { x: 0, y: 0 },
      isActiveDrawing: null,
      action: null,
      pages: {
        id: "1",
        name: "Page 1",
        size: { width: 1360, height: 768 },
        color: "#4a494e",
        scale: 155.35,
        widgets: [],
        components: {
          "2a592f22-312c-4d4f-8256-c5ee30872658": {
            type: ComponentBaseLayerType.IMAGE,
            src: "https://images.unsplash.com/photo-1735627062325-c978986b1871?q=80&w=3212&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            size: { width: 1360, height: 768 },
            pos: { x: 0, y: 0 },
            rotate: 0,
          } as unknown as ImageComponentLayerInterface,
        },
      },
    };
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;

    window.addEventListener("resize", this.handleResize);

    if (canvas == null) return;
    canvas.addEventListener("mousedown", this.handleMouseDown);
    canvas.addEventListener("mousemove", this.handleMouseMove);
    canvas.addEventListener("mouseup", this.handleMouseUp);
    canvas.addEventListener("wheel", this.handleWheelZoom);
    window.document.addEventListener("keydown", this.keyBoardShortcuts, true);
    window.document.addEventListener(
      "keyup",
      (e) => this.keyBoardShortcuts(e, false),
      true,
    );

    this.setState({
      params: {
        ...this.state.params,
        pan: { x: canvas.width / 2, y: canvas.height / 2 },
        center: { x: canvas.width / 2, y: canvas.height / 2 },
      },
    });

    for (const [key, value] of Object.entries(this.state.pages.components)) {
      switch (value.type) {
        case ComponentBaseLayerType.IMAGE:
          this.images[key] = new Image();
          this.images[key].src = (value as ImageComponentLayerInterface).src;
          this.images[key].onload = () => {
            this.reRenderCanvas();
          };
          break;
        default:
          break;
      }
    }

    const ctx = canvas.getContext("2d");

    this.ctx = extendedCanvasRenderingContext2D(
      ctx as ExtendedCanvasRenderingContext2D,
    );
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    if (this.canvasRef.current == null) return;
    this.canvasRef.current.removeEventListener(
      "mousedown",
      this.handleMouseDown,
    );
    this.canvasRef.current.removeEventListener(
      "mousemove",
      this.handleMouseMove,
    );
    this.canvasRef.current.removeEventListener("mouseup", this.handleMouseUp);
    this.canvasRef.current.removeEventListener("wheel", this.handleWheelZoom);
  }

  componentDidUpdate(_prevProps: any, prevState: DrawLayerState) {
    if (
      prevState.isDrawing !== this.state.isDrawing ||
      prevState.pages !== this.state.pages ||
      prevState.mousePos !== this.state.mousePos ||
      prevState.params.zoom !== this.state.params.zoom ||
      prevState.params.pan !== this.state.params.pan
    ) {
      requestAnimationFrame(this.reRenderCanvas);
    }
  }

  handleWheelZoom = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY ? -e.deltaY / 40 : e.detail ? -e.detail : 0;

    this.changeZoom(delta);
  };

  changeZoom = (clicks: number, isCenter = false) => {
    if (this.canvasRef.current == null) return;
    const pt = this.ctx.transformedPoint(
      !isCenter ? this.state.params.pan.x : this.canvasRef.current.width / 2,
      !isCenter ? this.state.params.pan.y : this.canvasRef.current.height / 2,
    );
    const scaleFactor = Math.pow(1.1, clicks);

    this.ctx.translate(pt.x, pt.y);
    this.ctx.scale(scaleFactor, scaleFactor);
    this.ctx.translate(-pt.x, -pt.y);
    this.setState((prevState) => ({
      params: {
        ...prevState.params,
        zoom: prevState.params.zoom + (scaleFactor - 1),
      },
    }));
  };

  getCenterOffsetFromScreen = () => {
    const { pages } = this.state;

    const { width, height } = pages.size;
    const { width: screen_width, height: screen_height } =
      this.state.params.window;
    const x = (screen_width - width) / 2;
    const y = (screen_height - height) / 2;

    return { x, y };
  };

  reRenderCanvas = () => {
    const { pages } = this.state;

    const { width, height } = pages.size;

    const drawPage = (pages: PageLayerState) => {
      this.ctx.beginPath();
      this.ctx.rect(0, 0, width, height);
      this.ctx.fillStyle = pages.color;
      this.ctx.fill();
    };

    const componentIsLoading = (component: ImageComponentLayerInterface) => {
      this.ctx.strokeStyle = "red";
      this.ctx.lineWidth = 2;

      // Draw the first diagonal
      this.ctx.beginPath();
      this.ctx.moveTo(component.pos.x, component.pos.y);
      this.ctx.lineTo(
        component.pos.x + component.size.width,
        component.pos.y + component.size.height,
      );
      this.ctx.stroke();

      // Draw the second diagonal
      this.ctx.beginPath();
      this.ctx.moveTo(component.pos.x, component.pos.y + component.size.height);
      this.ctx.lineTo(component.pos.x + component.size.width, component.pos.y);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(component.pos.x, component.pos.y);
      this.ctx.lineTo(component.pos.x + component.size.width, component.pos.y);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(component.pos.x, component.pos.y);
      this.ctx.lineTo(component.pos.x, component.pos.y + component.size.height);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(component.pos.x + component.size.width, component.pos.y);
      this.ctx.lineTo(
        component.pos.x + component.size.width,
        component.pos.y + component.size.height,
      );
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(component.pos.x, component.pos.y + component.size.height);
      this.ctx.lineTo(
        component.pos.x + component.size.width,
        component.pos.y + component.size.height,
      );
      this.ctx.stroke();
    };

    const canvas = this.canvasRef.current;

    var p1 = this.ctx.transformedPoint(0, 0);

    if (canvas == null) return;
    var p2 = this.ctx.transformedPoint(canvas.width, canvas.height);

    this.ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
    this.ctx.save();
    this.ctx.scale(1, 1);

    drawPage(pages);

    for (const [key, value] of Object.entries(pages.components)) {
      switch (value.type) {
        case ComponentBaseLayerType.IMAGE:
          if (!this.images[key].complete) {
            componentIsLoading(value as ImageComponentLayerInterface);
          }
          this.ctx.rotate((value.rotate * Math.PI) / 180);
          this.ctx.drawImage(
            this.images[key],
            value.pos.x,
            value.pos.y,
            value.size.width,
            value.size.height,
          );
          this.ctx.rotate((-value.rotate * Math.PI) / 180);
          this.ctx.save();
          this.ctx.scale(1, 1);
          break;

        default:
          break;
      }
    }

    console.log(this.state.params.hoveredOn);
    pages.widgets.forEach((widget) => {
      (widget as Area).draw(this.ctx, {
        lineWidth: this.state.params.hoveredOn.at(-1) === widget ? 2 : 1,
        scale: pages.size.width / pages.scale,
      });
    });

    this.drawLineFromLastAreaPoint(this.ctx);
    this.ctx.restore();
  };

  resetZoom = () => {
    this.ctx.reset();
    this.reRenderCanvas();
    this.setState({ params: { ...this.state.params, zoom: 0 } });
  };

  calculateAdjustedPoint(lastPoint: { y: number; x: number }) {
    const { params } = this.state;
    const pan = this.ctx.getXYinCTXPosition(params.pan.x, params.pan.y);
    const angle = Math.atan2(pan.y - lastPoint.y, pan.x - lastPoint.x);
    const roundedAngle = Math.round(angle / (Math.PI / 18)) * (Math.PI / 18);
    const distance = Math.sqrt(
      Math.pow(pan.x - lastPoint.x, 2) + Math.pow(pan.y - lastPoint.y, 2),
    );
    const x = lastPoint.x + distance * Math.cos(roundedAngle);
    const y = lastPoint.y + distance * Math.sin(roundedAngle);

    return { x, y };
  }

  clickDetector = (e: {
    stopPropagation: () => void;
    clientX: any;
    clientY: any;
  }) => {
    e.stopPropagation();
    const x = e.clientX;
    const y = e.clientY;
    const position = this.ctx.getXYinCTXPosition(x, y);
    const canvas = this.canvasRef.current;

    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    let xClick = position.x - rect.left;
    let yClick = position.y - rect.top;

    const { isActiveDrawing, pages, action } = this.state;
    let config = {};

    if (isActiveDrawing == null) {
      switch (action) {
        case WidgetsEnums.AREA:
          const uuid = uuidv4();
          const newArea = new Area(uuid);

          newArea.addPoint(new Position(xClick, yClick));

          config = {
            isDrawing: true,
            isActiveDrawing: uuid,
            pages: {
              ...pages,
              widgets: [...pages.widgets, newArea],
            },
          };
        default:
          break;
      }
    } else {
      let exitFromDrawMode = false;
      const updatedWidgets = pages.widgets.map((widget) => {
        if (widget.id === isActiveDrawing) {
          if (this.isShiftKeyPressed) {
            const lastPoint = widget.points.slice(-1)[0];
            const { x, y } = this.calculateAdjustedPoint(lastPoint);

            xClick = x;
            yClick = y;
          }
          exitFromDrawMode = widget.addPoint(new Position(xClick, yClick));

          return widget;
        }

        return widget;
      });

      config = {
        isDrawing: exitFromDrawMode ? false : this.state.isDrawing,
        isActiveDrawing: exitFromDrawMode ? null : isActiveDrawing,
        pages: { ...pages, widgets: updatedWidgets },
      };
    }

    this.setState(config);
  };

  drawLineFromLastAreaPoint = (ctx: ExtendedCanvasRenderingContext2D) => {
    const { isDrawing, pages, isActiveDrawing, params } = this.state;

    if (isDrawing) {
      const activeWidget = pages.widgets.find(
        (widget) => widget.id === isActiveDrawing,
      );

      if (!activeWidget || activeWidget.points.length === 0) return;
      switch (activeWidget.type) {
        case WidgetsEnums.AREA:
          const lastPoint = activeWidget.points.slice(-1)[0];

          let { x, y } = this.ctx.getXYinCTXPosition(
            params.pan.x,
            params.pan.y,
          );

          const scale = pages.size.width / pages.scale;

          if (this.isShiftKeyPressed) {
            ({ x, y } = this.calculateAdjustedPoint(lastPoint));

            activeWidget.drawFromLastPoint(this.ctx, new Position(x, y), scale);
          } else {
            activeWidget.drawFromLastPoint(this.ctx, new Position(x, y), scale);
          }

          ctx.strokeStyle = "red";
          ctx.stroke();
          break;

        default:
          break;
      }
    }
  };

  deletePreviousPoint = () => {
    const restoreWidget = (widget: any) => {
      const { pages } = this.state;
      const updatedWidgets = pages.widgets;

      updatedWidgets.push(widget);

      this.setState({
        pages: { ...pages, widgets: updatedWidgets },
      });
    };

    if (this.state.isActiveDrawing == null) {
      const { pages } = this.state;
      const popedWidget = pages.widgets.pop();
      const updatedWidgets = pages.widgets;

      toast.info("Your last widget has been deleted", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
        closeButton(props) {
          return (
            <>
              <button
                className="p-2"
                onClick={() => {
                  props.closeToast();
                  restoreWidget(popedWidget);
                }}
              >
                <MdUndo />
              </button>
              <button className="p-2" onClick={props.closeToast}>
                <MdClose />
              </button>
            </>
          );
        },
      });
      this.setState({
        pages: { ...pages, widgets: updatedWidgets },
      });
    }

    if (this.state.isDrawing) {
      const { pages, isActiveDrawing } = this.state;

      const updatedWidgets = pages.widgets.map((widget) => {
        if (widget.id === isActiveDrawing) {
          widget.points.pop();
        }

        return widget;
      });

      this.setState({
        pages: { ...pages, widgets: updatedWidgets },
      });
    }
  };

  deleteDrawing = (removeWidget: BaseLogicInterface | null = null) => {
    const { isActiveDrawing, action, pages } = this.state;

    if (isActiveDrawing == null && action != null) {
      toast.info(`Drawing ${action} is disabled`, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
    }

    if (isActiveDrawing == null) {
      if (action == null) return;

      this.setState({
        action: null,
      });

      return;
    }

    const updatedWidgets = pages.widgets.filter((widget) => {
      if (removeWidget == null) return widget.id !== isActiveDrawing;

      return widget !== removeWidget;
    });

    this.setState({
      pages: {
        ...pages,
        widgets: updatedWidgets,
      },
      isActiveDrawing: null,
    });
  };

  handleResize = (_: UIEvent) => {
    const pan = this.state.params.pan;

    const point = this.ctx.transformedPoint(pan.x, pan.y);

    this.ctx.translate(point.x, point.y);

    const scaleFactor = Math.pow(1.1, 1); // Adjust the scale factor as needed

    this.ctx.scale(1.1, scaleFactor);
    this.ctx.translate(-point.x, -point.y);
  };

  handleMouseDown = (e: {
    preventDefault: () => void;
    offsetX: number;
    pageX: number;
    offsetY: number;
    pageY: number;
  }) => {
    e.preventDefault();
    const canvas = this.canvasRef.current;

    if (!canvas) return;
    const offsetX = e.offsetX || e.pageX - canvas.offsetLeft;
    const offsetY = e.offsetY || e.pageY - canvas.offsetTop;
    const dragStart = this.ctx.transformedPoint(offsetX, offsetY);

    this.setState((prevState) => ({
      ...prevState,
      params: {
        ...prevState.params,
        isPanning: true,
        dragged: false,
        dragStart: dragStart,
      },
    }));
  };

  handleMouseMove = (e: {
    offsetX: any;
    layerX: any;
    pageX: number;
    offsetY: any;
    layerY: any;
    pageY: number;
    clientX: number;
    clientY: number;
  }) => {
    if (!this.canvasRef.current) return;
    const offsetX =
      e.offsetX || e.layerX || e.pageX - this.canvasRef.current.offsetLeft;
    const offsetY =
      e.offsetY || e.layerY || e.pageY - this.canvasRef.current.offsetTop;
    const position = this.ctx.getXYinCTXPosition(e.clientX, e.clientY);

    const hovered = this.getHoverdWidget(position.x, position.y);

    if (hovered) {
      this.setState({
        params: { ...this.state.params, hoveredOn: hovered },
      });
    } else {
      if (this.state.params.hoveredOn) {
        this.setState({
          params: { ...this.state.params, hoveredOn: [] },
        });
      }
    }

    if (!this.state.params.isPanning) return;

    const { dragStart } = this.state.params;

    if (dragStart)
      this.ctx.translate(position.x - dragStart.x, position.y - dragStart.y);

    this.setState((prevState) => ({
      ...prevState,
      params: {
        ...prevState.params,
        dragged: !dragStart ? true : this.state.params.dragged,
        pan: { x: offsetX, y: offsetY },
      },
    }));
  };

  handleMouseUp = (_: any) => {
    this.setState({ params: { ...this.state.params, dragStart: null } });
  };

  keyBoardShortcuts = (e: KeyboardEvent, isKeyDown = true) => {
    e.preventDefault();
    if (e.key === "Escape") {
      this.deleteDrawing();
    }
    if (e.key === "Shift") {
      this.isShiftKeyPressed = isKeyDown;
    }
    if (e.metaKey && e.key === "a") {
      this.setRenderedAction(WidgetsEnums.AREA);
    }
    if (e.metaKey && e.key === "z") {
      this.deletePreviousPoint();
    }
  };

  setRenderedAction = (action: WidgetsEnums) => {
    toast.success(`Drawing ${action} is enabled`, {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Slide,
    });
    this.setState({
      action,
      isDrawing: true,
      params: { ...this.state.params, isPanning: false, dragged: false },
    });
  };

  getHoverdWidget = (x: number, y: number) => {
    const { pages } = this.state;

    const widgets = pages.widgets;
    const onPosition = [];

    for (const widget of widgets) {
      switch (true) {
        case widget instanceof Area && widget.isInside(new Position(x, y)):
          onPosition.push(widget);
        default:
      }
    }

    return onPosition;
  };

  _isHoveredOnItems = () => {
    return this.state.params.hoveredOn.length > 0;
  };

  render() {
    return (
      <div className="w-screen h-screen">
        <ToastContainer />
        <ContextMenu>
          <ContextMenuTrigger>
            <canvas
              ref={this.canvasRef}
              height={this.state.params.window.height}
              id="draw-layer"
              width={this.state.params.window.width}
              onClick={this.clickDetector}
            />
            <CanvasControls
              changeZoom={this.changeZoom}
              resetZoom={this.resetZoom}
            />
            <FloorWidgets />
          </ContextMenuTrigger>
          <ContextMenuContent className="w-64 bg-white dark:bg-gray-900">
            <ContextMenuSub>
              <ContextMenuSubTrigger>Insert Widget</ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-32 bg-white dark:bg-gray-900">
                <ContextMenuItem
                  className="hover:bg-gray-100 dark:hover:bg-grey-500"
                  onClick={() => this.setRenderedAction(WidgetsEnums.AREA)}
                >
                  Area
                  <ContextMenuShortcut>⌘ A</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem className="hover:bg-gray-100 dark:hover:bg-grey-500">
                  Text
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            {this._isHoveredOnItems() && (
              <ContextMenuItem
                onClick={() =>
                  this.deleteDrawing(this.state.params.hoveredOn.splice(-1)[0])
                }
              >
                Delete
                <ContextMenuShortcut>⌘⇧DEL</ContextMenuShortcut>
              </ContextMenuItem>
            )}
          </ContextMenuContent>
        </ContextMenu>
      </div>
    );
  }
}

interface CanvasControlsProps {
  changeZoom: (clicks: number, isCenter?: boolean) => void;
  resetZoom: () => void;
}

class CanvasControls extends Component<CanvasControlsProps> {
  render() {
    return (
      <div className="fixed p-2 bottom-2 right-4">
        <button
          className="p-2 hover:bg-gray-400 dark:hover:bg-gray-700 rounded-md text-xl"
          onClick={() => this.props.changeZoom(1.1, true)}
        >
          <MdZoomIn />
        </button>
        <button
          className="p-2 hover:bg-gray-400 dark:hover:bg-gray-700 rounded-md text-xl"
          onClick={() => this.props.changeZoom(-1.1, true)}
        >
          <MdZoomOut />
        </button>
        <button
          className="p-2 hover:bg-gray-400 dark:hover:bg-gray-700 rounded-md text-xl"
          onClick={() => this.props.resetZoom()}
        >
          <MdOutlineFullscreen />
        </button>
        {/* add a rotate button which also has the angle in it */}
        <button className="p-2 hover:bg-gray-400 dark:hover:bg-gray-700 rounded-md">
          <span>0°</span>
        </button>
      </div>
    );
  }
}

export default DrawLayer;
