import { createElement, PureComponent } from "react";
import { cancelTimeout, requestTimeout } from "./timer";

// ALMOST COPIED FROM REACT-WINDOW,
// but just for vertical list

//  DIDN'T WORK (:^:)

const IS_SCROLLING_DEBOUNCE_INTERVAL = 150;

const defaultItemKey = index => index;

export class List extends PureComponent {
  _resetIsScrollingTimeoutId = null;

  static defaultProps = {
    itemData: undefined,
    layout: "vertical",
    overscanCount: 1
  };

  state = {
    isScrolling: false,
    scrollDirection: "forward",
    scrollOffset: 0
  };

  componentWillUnmount() {
    if (this._resetIsScrollingTimeoutId !== null) {
      cancelTimeout(this._resetIsScrollingTimeoutId);
    }
  }

  getStopIndexForStartIndex = (
    { height, itemCount, itemSize },
    startIndex,
    scrollOffset
  ) => {
    const offset = startIndex * itemSize;
    const numVisibleItems = Math.ceil(
      (height + scrollOffset - offset) / itemSize
    );
    return Math.max(
      0,
      Math.min(
        itemCount - 1,
        startIndex + numVisibleItems - 1 // -1 is because stop index is inclusive
      )
    );
  };

  getStartIndexForOffset = ({ itemCount, itemSize }, offset) =>
    Math.max(0, Math.min(itemCount - 1, Math.floor(offset / itemSize)));

  getEstimatedTotalSize = ({ itemCount, itemSize }) => itemSize * itemCount;

  getItemOffset = ({ itemSize }, index) => index * itemSize;

  getItemSize = ({ itemSize }) => itemSize;

  render() {
    const {
      children,
      className,
      height,
      itemCount,
      itemData,
      itemKey = defaultItemKey,
      style,
      width,
      useIsScrolling
    } = this.props;

    const { isScrolling } = this.state;

    const onScroll = this._onScrollVertical;

    const [startIndex, stopIndex] = this._getRangeToRender();

    const items = [];
    if (itemCount > 0) {
      for (let index = startIndex; index <= stopIndex; index++) {
        items.push(
          createElement(children, {
            data: itemData,
            key: itemKey(index, itemData),
            index,
            style: this._getItemStyle(index),
            isScrolling: useIsScrolling ? isScrolling : undefined
          })
        );
      }
    }

    const estimatedTotalSize = this.getEstimatedTotalSize(this.props);

    return createElement(
      "div",
      {
        className,
        onScroll,
        style: {
          position: "relative",
          height,
          width,
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          willChange: "transform",
          ...style
        }
      },
      createElement("div", {
        children: items,
        style: {
          height: estimatedTotalSize,
          pointerEvents: isScrolling ? "none" : undefined,
          width: "100%"
        }
      })
    );
  }

  _getItemStyle = index => {
    const itemStyleCache = this._getItemStyleCache;

    let style;
    if (itemStyleCache.hasOwnProperty(index)) {
      style = itemStyleCache[index];
    } else {
      const offset = this.getItemOffset(this.props, index);
      const size = this.getItemSize(this.props, index);

      itemStyleCache[index] = style = {
        position: "absolute",
        top: offset,
        height: size,
        width: "100%"
      };
    }

    return style;
  };

  _getItemStyleCache = {};

  _getRangeToRender() {
    const { itemCount, overscanCount = 2 } = this.props;
    const { isScrolling, scrollDirection, scrollOffset } = this.state;

    if (itemCount === 0) {
      return [0, 0, 0, 0];
    }

    const startIndex = this.getStartIndexForOffset(this.props, scrollOffset);
    const stopIndex = this.getStopIndexForStartIndex(
      this.props,
      startIndex,
      scrollOffset
    );

    const overscanBackward =
      !isScrolling || scrollDirection === "backward"
        ? Math.max(1, overscanCount)
        : 1;
    const overscanForward =
      !isScrolling || scrollDirection === "forward"
        ? Math.max(1, overscanCount)
        : 1;

    return [
      Math.max(0, startIndex - overscanBackward),
      Math.max(0, Math.min(itemCount - 1, stopIndex + overscanForward)),
      startIndex,
      stopIndex
    ];
  }

  _onScrollVertical = event => {
    const { scrollTop } = event.currentTarget;
    this.setState(prevState => {
      return {
        isScrolling: true,
        scrollDirection:
          prevState.scrollOffset < scrollTop ? "forward" : "backward",
        scrollOffset: scrollTop,
        scrollUpdateWasRequested: false
      };
    }, this._resetIsScrollingDebounced);
  };

  _resetIsScrollingDebounced = () => {
    if (this._resetIsScrollingTimeoutId !== null) {
      cancelTimeout(this._resetIsScrollingTimeoutId);
    }

    this._resetIsScrollingTimeoutId = requestTimeout(
      this._resetIsScrolling,
      IS_SCROLLING_DEBOUNCE_INTERVAL
    );
  };

  _resetIsScrolling = () => {
    this._resetIsScrollingTimeoutId = null;

    this.setState({ isScrolling: false });
  };
}
