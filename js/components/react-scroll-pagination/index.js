"use strict";

import React, {} from 'react';
import ReactDOM from 'react-dom';

var findScrollParent = function (el) {
  var ref = el;
  while (ref) {
    switch (window.getComputedStyle(ref).overflowY) {
      case "auto":
        return ref;
      case "scroll":
        return ref;
    }
    ref = ref.parentElement;
  }
  return window;
};

var ScrollPagination = React.createClass({
  displayName: "ScrollPagination",

  getDefaultProps: function () {
    return {
      hasPrevPage: false,
      hasNextPage: false,
      loadPrevPage: function () {},
      loadNextPage: function () {}
    };
  },

  componentWillMount: function () {
    this.__pages = {};
    this.__pageIds = [];
    this.props.manager.registerPageEventHandler(this.handlePageEvent);
  },

  componentDidMount: function () {
    var scrollParent = this.__scrollParent = findScrollParent(this.refs.wrapper);
    scrollParent.addEventListener("wheel", this.__handleScroll, {passive: true});
    scrollParent.addEventListener("resize", this.__handleResize, false);

    this.__updatePageIds();
    this.__updateDimensions();
  },

  componentDidUpdate: function () {
    this.__updatePageIds();
    this.__updateDimensions();

    this.__loadingNextPage = false;
    this.__loadingPrevPage = false;
    this.__unloadingPage = false;

    this.__evaluatePagesMutation();
  },

  componentWillUnmount: function () {
    var scrollParent = this.__scrollParent;
    scrollParent.removeEventListener("wheel", this.__handleScroll, {passive: true});
    scrollParent.removeEventListener("resize", this.__handleResize, false);
  },

  render: function () {
    var style = { ...this.props.style };
    if (this.__paddingTop) {
      style.paddingTop = this.__paddingTop + "px";
    }
    return React.createElement('div', {
      ...this.props,
      style: style,
      ref: "wrapper"
    }, this.props.children);
  },

  // called from Page component via parent component
  handlePageEvent: function (pageId, event) {
    var pages = this.__pages;
    switch (event.name) {
      case "mount":
        pages[pageId] = {
          id: pageId,
          height: event.height
        };
      break;
    }
    this.__pages = pages;
  },

  __unloadPage: function (pageId) {
    if (this.__unloadingPage) {
      return;
    }
    this.__unloadingPage = true;
    this.props.unloadPage(pageId);
  },

  __loadPrevPage: function () {
    if (this.__loadingPrevPage || !this.props.hasPrevPage) {
      return;
    }
    this.__loadingPrevPage = true;
    this.props.loadPrevPage();
  },

  __loadNextPage: function () {
    if (this.__loadingNextPage || !this.props.hasNextPage) {
      return;
    }
    this.__loadingNextPage = true;
    this.props.loadNextPage();
  },

  __getScrollY: function () {
    var scrollParent = this.__scrollParent;
    if (scrollParent === window) {
      return window.scrollY;
    } else {
      return scrollParent.scrollTop;
    }
  },

  __setScrollY: function (scrollY) {
    // var scrollParent = this.__scrollParent;
    // if (scrollParent === window) {
    //  return window.scrollTo(window.scrollX, scrollY);
    // } else {
    //  return scrollParent.scrollTop = scrollY;
    // }
  },

  __updatePageIds: function () {
    var oldPageIds = this.__pageIds;
    var unloadedPageIdsTop = [];
    var newPageIdsTop = [];
    var pageIds = [];
    var findPages = function (children) {
      React.Children.forEach(children, function (child) {
        if (child === null) {
          return;
        }
        // if (child.type.displayName === "ScrollPagination.Page") {
          pageIds.push(child.props.id);
        // } else if (child.type === "ul") {
        //  findPages(child.props.children);
        // }
      });
    };
    findPages(this.props.children);
    var i, len;
    if (oldPageIds.length > 0) {
      for (i = 0, len = oldPageIds.length; i < len; i++) {
        if (pageIds.indexOf(oldPageIds[i]) === -1) {
          unloadedPageIdsTop.push(oldPageIds[i]);
        } else {
          break;
        }
      }
      for (i = 0, len = pageIds.length; i < len; i++) {
        if (oldPageIds.indexOf(pageIds[i]) === -1) {
          newPageIdsTop.push(pageIds[i]);
        } else {
          break;
        }
      }
    }
    this.__adjustScrollPosition(unloadedPageIdsTop, newPageIdsTop);
    this.__pageIds = pageIds;
  },

  __adjustScrollPosition: function (unloadedPageIdsTop, newPageIdsTop) {
    var offset = 0;
    var pages = this.__pages;
    unloadedPageIdsTop.forEach(function (pageId) {
      var height = pages[pageId].height;
      offset += height;
      delete pages[pageId];
    });
    newPageIdsTop.forEach(function (pageId) {
      var height = pages[pageId].height;
      offset += height;
    });
    this.__setScrollY(this.__getScrollY() + offset);
  },

  __updateDimensions: function () {
    var el = this.refs.wrapper;
    var scrollParent = this.__scrollParent;
    var viewportHeight = 0;
    if (scrollParent === window) {
      viewportHeight = window.innerHeight;
    } else {
      viewportHeight = parseInt(window.getComputedStyle(scrollParent).height, 10);
    }
    var contentHeight = el.offsetHeight;

    var offsetTop = 0;
    var ref = el;
    while (ref) {
      offsetTop += ref.offsetTop || 0;
      ref = ref.offsetParent;
      if (ref === scrollParent) {
        break;
      }
    }

    this.__dimentions = {
      viewportHeight: viewportHeight,
      contentHeight: contentHeight,
      offsetTop: offsetTop
    };
  },

  __evaluatePagesMutation: function (e) {
    if (this.__dimentions.contentHeight === 0) {
      return;
    }
    if (this.__loadingNextPage || this.__loadingPrevPage || this.__unloadingPage || !(this.props.hasNextPage || this.props.hasPrevPage)) {
      if (e) {
        // e.preventDefault();
        e.stopPropagation();
      }
      return;
    }

    var pages = this.__pages;
    var pageIds = this.__pageIds;
    var firstPage = pages[pageIds[0]];
    var secondPage = pages[pageIds[1]];
    var lastPage = pages[pageIds[pageIds.length-1]];
    var secondLastPage = pages[pageIds[pageIds.length-2]];

    if (pages.length < 4) {
      secondPage = null;
      secondLastPage = null;
    }

    var viewportHeight = this.__dimentions.viewportHeight;
    var contentHeight = this.__dimentions.contentHeight;
    var offsetTop = this.__dimentions.offsetTop;
    var scrollY = this.__getScrollY();

    // var remainingScrollBottom = contentHeight - scrollY - viewportHeight + offsetTop;
    // var remainingScrollTop = contentHeight - remainingScrollBottom - viewportHeight;
    //
    // if (lastPage && remainingScrollBottom < (lastPage.height / 6)) {
    //  if (secondPage && remainingScrollTop > (firstPage.height + secondPage.height)) {
    //    this.__unloadPage(firstPage.id);
    //  } else {
    //    this.__loadNextPage();
    //  }
    // } else if (firstPage && remainingScrollTop < (firstPage.height / 3)) {
    //  if (secondLastPage && remainingScrollBottom > (lastPage.height + secondLastPage.height)) {
    //    this.__unloadPage(lastPage.id);
    //  } else {
    //    this.__loadPrevPage();
    //  }
    // }

    var scrollBottom = scrollY + viewportHeight;
    var totalHeight = Object.keys(pages).reduce(function (totalHeight, pageId){ return totalHeight + pages[pageId].height; }, 0);

    if (scrollBottom + 120 >= totalHeight) {
      this.__loadNextPage();
    }
  },

  __handleScroll: function (e) {
    requestAnimationFrame(() => {
      this.__evaluatePagesMutation(e);
    });
  },

  __handleResize: function () {
    this.__updateDimensions();
    this.__evaluatePagesMutation();
  }
});

ScrollPagination.Page = React.createClass({
  displayName: "ScrollPagination.Page",

  getDefaultProps: function () {
    return {
      component: 'div'
    };
  },

  componentDidMount: function () {
    this.__determineHeight();
  },

  componentDidUpdate: function () {
    if (this.__height === 0) {
      this.__determineHeight();
    }
  },

  render: function () {
    var props = {};
    for (var k in this.props) {
      if (k !== "component" && k !== "onPageEvent" /*&& k !== "id"*/ && this.props.hasOwnProperty(k)) {
        props[k] = this.props[k];
      }
    }
    return React.createElement(this.props.component, props, this.props.children);
  },

  __determineHeight: function () {
    var height = this.__height = ReactDOM.findDOMNode(this).offsetHeight;
    this.props.manager.dispatchPageEvent(this.props.id, {
      name: "mount",
      height: height
    });
  }
});

var Manager = function () {
  this.pendingEvents = [];
  this.pageEventHandler = null;
};
Manager.prototype.registerPageEventHandler = function (callback) {
  this.pageEventHandler = callback;
  this.pendingEvents.forEach(function (args) {
    this.dispatchPageEvent.apply(this, args);
  }.bind(this));
  this.pendingEvents = [];
};
Manager.prototype.dispatchPageEvent = function (pageId, event) {
  if (this.pageEventHandler === null) {
    this.pendingEvents.push([pageId, event]);
    return;
  }
  this.pageEventHandler(pageId, event);
};
ScrollPagination.Manager = Manager;

module.exports = { ScrollPagination };

