/* ways to inject JS Codes

lasso_editor.setupHookArray
lasso_editor.enterEditorHookArray
lasso_editor.enterEditorHookArray2
lasso_editor.exitEditorHookArray
lasso_editor.saveSuccessHookArray

*/




/*
 * Undo.js - A undo/redo framework for JavaScript
 * 
 * http://jzaefferer.github.com/undo
 *
 * Copyright (c) 2011 Jörn Zaefferer
 * MIT licensed.
 */
(function() {

// based on Backbone.js' inherits	
var ctor = function(){};
var inherits = function(parent, protoProps) {
	var child;

	if (protoProps && protoProps.hasOwnProperty('constructor')) {
		child = protoProps.constructor;
	} else {
		child = function(){ return parent.apply(this, arguments); };
	}

	ctor.prototype = parent.prototype;
	child.prototype = new ctor();
	
	if (protoProps) extend(child.prototype, protoProps);
	
	child.prototype.constructor = child;
	child.__super__ = parent.prototype;
	return child;
};

function extend(target, ref) {
	var name, value;
	for ( name in ref ) {
		value = ref[name];
		if (value !== undefined) {
			target[ name ] = value;
		}
	}
	return target;
};

var Undo;
if (typeof exports !== 'undefined') {
	Undo = exports;
} else {
	Undo = this.Undo = {};
}

Undo.Stack = function() {
	this.commands = [];
	this.stackPosition = -1;
	this.savePosition = -1;
};

extend(Undo.Stack.prototype, {
	execute: function(command) {
		this._clearRedo();
		command.execute();
		this.commands.push(command);
		if (this.commands.length>15) {
			this.commands.shift();
		} else {
			this.stackPosition++;
		}
		
		this.changed();
	},
	undo: function() {
		this.commands[this.stackPosition].undo();
		this.stackPosition--;
		//this.commands.pop();
		this.changed();
	},
	canUndo: function() {
		return this.stackPosition >= 0;
	},
	redo: function() {
		this.stackPosition++;
		this.commands[this.stackPosition].redo();
		this.changed();
	},
	canRedo: function() {
		return this.stackPosition < this.commands.length - 1;
	},
	save: function() {
		this.savePosition = this.stackPosition;
		this.changed();
	},
	dirty: function() {
		return (this.stackPosition != this.savePosition) || lasso_editor.dirtyByComponent;
	},
	_clearRedo: function() {
		// TODO there's probably a more efficient way for this
		this.commands = this.commands.slice(0, this.stackPosition + 1);
	},
	changed: function() {
		// do nothing, override
	}
});

Undo.Command = function(name) {
	this.name = name;
}

var up = new Error("override me!");

extend(Undo.Command.prototype, {
	execute: function() {
		throw up;
	},
	undo: function() {
		throw up;
	},
	redo: function() {
		this.execute();
	}
});

Undo.Command.extend = function(protoProps) {
	var child = inherits(this, protoProps);
	child.extend = Undo.Command.extend;
	return child;
};
	
}).call(this);
/**
 * Rangy, a cross-browser JavaScript range and selection library
 * http://code.google.com/p/rangy/
 *
 * Copyright 2014, Tim Down
 * Licensed under the MIT license.
 * Version: 1.3.0-alpha.20140827
 * Build date: 27 August 2014
 */

(function(factory, root) {
    if (typeof define == "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof module != "undefined" && typeof exports == "object") {
        // Node/CommonJS style
        module.exports = factory();
    } else {
        // No AMD or CommonJS support so we place Rangy in (probably) the global variable
        root.rangy = factory();
    }
})(function() {

    var OBJECT = "object", FUNCTION = "function", UNDEFINED = "undefined";

    // Minimal set of properties required for DOM Level 2 Range compliance. Comparison constants such as START_TO_START
    // are omitted because ranges in KHTML do not have them but otherwise work perfectly well. See issue 113.
    var domRangeProperties = ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed",
        "commonAncestorContainer"];

    // Minimal set of methods required for DOM Level 2 Range compliance
    var domRangeMethods = ["setStart", "setStartBefore", "setStartAfter", "setEnd", "setEndBefore",
        "setEndAfter", "collapse", "selectNode", "selectNodeContents", "compareBoundaryPoints", "deleteContents",
        "extractContents", "cloneContents", "insertNode", "surroundContents", "cloneRange", "toString", "detach"];

    var textRangeProperties = ["boundingHeight", "boundingLeft", "boundingTop", "boundingWidth", "htmlText", "text"];

    // Subset of TextRange's full set of methods that we're interested in
    var textRangeMethods = ["collapse", "compareEndPoints", "duplicate", "moveToElementText", "parentElement", "select",
        "setEndPoint", "getBoundingClientRect"];

    /*----------------------------------------------------------------------------------------------------------------*/

    // Trio of functions taken from Peter Michaux's article:
    // http://peter.michaux.ca/articles/feature-detection-state-of-the-art-browser-scripting
    function isHostMethod(o, p) {
        var t = typeof o[p];
        return t == FUNCTION || (!!(t == OBJECT && o[p])) || t == "unknown";
    }

    function isHostObject(o, p) {
        return !!(typeof o[p] == OBJECT && o[p]);
    }

    function isHostProperty(o, p) {
        return typeof o[p] != UNDEFINED;
    }

    // Creates a convenience function to save verbose repeated calls to tests functions
    function createMultiplePropertyTest(testFunc) {
        return function(o, props) {
            var i = props.length;
            while (i--) {
                if (!testFunc(o, props[i])) {
                    return false;
                }
            }
            return true;
        };
    }

    // Next trio of functions are a convenience to save verbose repeated calls to previous two functions
    var areHostMethods = createMultiplePropertyTest(isHostMethod);
    var areHostObjects = createMultiplePropertyTest(isHostObject);
    var areHostProperties = createMultiplePropertyTest(isHostProperty);

    function isTextRange(range) {
        return range && areHostMethods(range, textRangeMethods) && areHostProperties(range, textRangeProperties);
    }

    function getBody(doc) {
        return isHostObject(doc, "body") ? doc.body : doc.getElementsByTagName("body")[0];
    }

    var modules = {};

    var isBrowser = (typeof window != UNDEFINED && typeof document != UNDEFINED);

    var util = {
        isHostMethod: isHostMethod,
        isHostObject: isHostObject,
        isHostProperty: isHostProperty,
        areHostMethods: areHostMethods,
        areHostObjects: areHostObjects,
        areHostProperties: areHostProperties,
        isTextRange: isTextRange,
        getBody: getBody
    };

    var api = {
        version: "1.3.0-alpha.20140827",
        initialized: false,
        isBrowser: isBrowser,
        supported: true,
        util: util,
        features: {},
        modules: modules,
        config: {
            alertOnFail: true,
            alertOnWarn: false,
            preferTextRange: false,
            autoInitialize: (typeof rangyAutoInitialize == UNDEFINED) ? true : rangyAutoInitialize
        }
    };

    function consoleLog(msg) {
        if (typeof console != UNDEFINED && isHostMethod(console, "log")) {
            console.log(msg);
        }
    }

    function alertOrLog(msg, shouldAlert) {
        if (isBrowser && shouldAlert) {
            alert(msg);
        } else  {
            consoleLog(msg);
        }
    }

    function fail(reason) {
        api.initialized = true;
        api.supported = false;
        alertOrLog("Rangy is not supported in this environment. Reason: " + reason, api.config.alertOnFail);
    }

    api.fail = fail;

    function warn(msg) {
        alertOrLog("Rangy warning: " + msg, api.config.alertOnWarn);
    }

    api.warn = warn;

    // Add utility extend() method
    var extend;
    if ({}.hasOwnProperty) {
        util.extend = extend = function(obj, props, deep) {
            var o, p;
            for (var i in props) {
                if (props.hasOwnProperty(i)) {
                    o = obj[i];
                    p = props[i];
                    if (deep && o !== null && typeof o == "object" && p !== null && typeof p == "object") {
                        extend(o, p, true);
                    }
                    obj[i] = p;
                }
            }
            // Special case for toString, which does not show up in for...in loops in IE <= 8
            if (props.hasOwnProperty("toString")) {
                obj.toString = props.toString;
            }
            return obj;
        };

        util.createOptions = function(optionsParam, defaults) {
            var options = {};
            extend(options, defaults);
            if (optionsParam) {
                extend(options, optionsParam, true);
            }
            return options;
        };
    } else {
        fail("hasOwnProperty not supported");
    }
    
    // Test whether we're in a browser and bail out if not
    if (!isBrowser) {
        fail("Rangy can only run in a browser");
    }

    // Test whether Array.prototype.slice can be relied on for NodeLists and use an alternative toArray() if not
    (function() {
        var toArray;

        if (isBrowser) {
            var el = document.createElement("div");
            el.appendChild(document.createElement("span"));
            var slice = [].slice;
            try {
                if (slice.call(el.childNodes, 0)[0].nodeType == 1) {
                    toArray = function(arrayLike) {
                        return slice.call(arrayLike, 0);
                    };
                }
            } catch (e) {}
        }

        if (!toArray) {
            toArray = function(arrayLike) {
                var arr = [];
                for (var i = 0, len = arrayLike.length; i < len; ++i) {
                    arr[i] = arrayLike[i];
                }
                return arr;
            };
        }

        util.toArray = toArray;
    })();

    // Very simple event handler wrapper function that doesn't attempt to solve issues such as "this" handling or
    // normalization of event properties
    var addListener;
    if (isBrowser) {
        if (isHostMethod(document, "addEventListener")) {
            addListener = function(obj, eventType, listener) {
                obj.addEventListener(eventType, listener, false);
            };
        } else if (isHostMethod(document, "attachEvent")) {
            addListener = function(obj, eventType, listener) {
                obj.attachEvent("on" + eventType, listener);
            };
        } else {
            fail("Document does not have required addEventListener or attachEvent method");
        }

        util.addListener = addListener;
    }

    var initListeners = [];

    function getErrorDesc(ex) {
        return ex.message || ex.description || String(ex);
    }

    // Initialization
    function init() {
        if (!isBrowser || api.initialized) {
            return;
        }
        var testRange;
        var implementsDomRange = false, implementsTextRange = false;

        // First, perform basic feature tests

        if (isHostMethod(document, "createRange")) {
            testRange = document.createRange();
            if (areHostMethods(testRange, domRangeMethods) && areHostProperties(testRange, domRangeProperties)) {
                implementsDomRange = true;
            }
        }

        var body = getBody(document);
        if (!body || body.nodeName.toLowerCase() != "body") {
            fail("No body element found");
            return;
        }

        if (body && isHostMethod(body, "createTextRange")) {
            testRange = body.createTextRange();
            if (isTextRange(testRange)) {
                implementsTextRange = true;
            }
        }

        if (!implementsDomRange && !implementsTextRange) {
            fail("Neither Range nor TextRange are available");
            return;
        }

        api.initialized = true;
        api.features = {
            implementsDomRange: implementsDomRange,
            implementsTextRange: implementsTextRange
        };

        // Initialize modules
        var module, errorMessage;
        for (var moduleName in modules) {
            if ( (module = modules[moduleName]) instanceof Module ) {
                module.init(module, api);
            }
        }

        // Call init listeners
        for (var i = 0, len = initListeners.length; i < len; ++i) {
            try {
                initListeners[i](api);
            } catch (ex) {
                errorMessage = "Rangy init listener threw an exception. Continuing. Detail: " + getErrorDesc(ex);
                consoleLog(errorMessage);
            }
        }
    }

    // Allow external scripts to initialize this library in case it's loaded after the document has loaded
    api.init = init;

    // Execute listener immediately if already initialized
    api.addInitListener = function(listener) {
        if (api.initialized) {
            listener(api);
        } else {
            initListeners.push(listener);
        }
    };

    var shimListeners = [];

    api.addShimListener = function(listener) {
        shimListeners.push(listener);
    };

    function shim(win) {
        win = win || window;
        init();

        // Notify listeners
        for (var i = 0, len = shimListeners.length; i < len; ++i) {
            shimListeners[i](win);
        }
    }

    if (isBrowser) {
        api.shim = api.createMissingNativeApi = shim;
    }

    function Module(name, dependencies, initializer) {
        this.name = name;
        this.dependencies = dependencies;
        this.initialized = false;
        this.supported = false;
        this.initializer = initializer;
    }

    Module.prototype = {
        init: function() {
            var requiredModuleNames = this.dependencies || [];
            for (var i = 0, len = requiredModuleNames.length, requiredModule, moduleName; i < len; ++i) {
                moduleName = requiredModuleNames[i];

                requiredModule = modules[moduleName];
                if (!requiredModule || !(requiredModule instanceof Module)) {
                    throw new Error("required module '" + moduleName + "' not found");
                }

                requiredModule.init();

                if (!requiredModule.supported) {
                    throw new Error("required module '" + moduleName + "' not supported");
                }
            }
            
            // Now run initializer
            this.initializer(this);
        },
        
        fail: function(reason) {
            this.initialized = true;
            this.supported = false;
            throw new Error("Module '" + this.name + "' failed to load: " + reason);
        },

        warn: function(msg) {
            api.warn("Module " + this.name + ": " + msg);
        },

        deprecationNotice: function(deprecated, replacement) {
            api.warn("DEPRECATED: " + deprecated + " in module " + this.name + "is deprecated. Please use " +
                replacement + " instead");
        },

        createError: function(msg) {
            return new Error("Error in Rangy " + this.name + " module: " + msg);
        }
    };
    
    function createModule(name, dependencies, initFunc) {
        var newModule = new Module(name, dependencies, function(module) {
            if (!module.initialized) {
                module.initialized = true;
                try {
                    initFunc(api, module);
                    module.supported = true;
                } catch (ex) {
                    var errorMessage = "Module '" + name + "' failed to load: " + getErrorDesc(ex);
                    consoleLog(errorMessage);
                }
            }
        });
        modules[name] = newModule;
        return newModule;
    }

    api.createModule = function(name) {
        // Allow 2 or 3 arguments (second argument is an optional array of dependencies)
        var initFunc, dependencies;
        if (arguments.length == 2) {
            initFunc = arguments[1];
            dependencies = [];
        } else {
            initFunc = arguments[2];
            dependencies = arguments[1];
        }

        var module = createModule(name, dependencies, initFunc);

        // Initialize the module immediately if the core is already initialized
        if (api.initialized && api.supported) {
            module.init();
        }
    };

    api.createCoreModule = function(name, dependencies, initFunc) {
        createModule(name, dependencies, initFunc);
    };

    /*----------------------------------------------------------------------------------------------------------------*/

    // Ensure rangy.rangePrototype and rangy.selectionPrototype are available immediately

    function RangePrototype() {}
    api.RangePrototype = RangePrototype;
    api.rangePrototype = new RangePrototype();

    function SelectionPrototype() {}
    api.selectionPrototype = new SelectionPrototype();

    /*----------------------------------------------------------------------------------------------------------------*/

    // DOM utility methods used by Rangy
    api.createCoreModule("DomUtil", [], function(api, module) {
        var UNDEF = "undefined";
        var util = api.util;

        // Perform feature tests
        if (!util.areHostMethods(document, ["createDocumentFragment", "createElement", "createTextNode"])) {
            module.fail("document missing a Node creation method");
        }

        if (!util.isHostMethod(document, "getElementsByTagName")) {
            module.fail("document missing getElementsByTagName method");
        }

        var el = document.createElement("div");
        if (!util.areHostMethods(el, ["insertBefore", "appendChild", "cloneNode"] ||
                !util.areHostObjects(el, ["previousSibling", "nextSibling", "childNodes", "parentNode"]))) {
            module.fail("Incomplete Element implementation");
        }

        // innerHTML is required for Range's createContextualFragment method
        if (!util.isHostProperty(el, "innerHTML")) {
            module.fail("Element is missing innerHTML property");
        }

        var textNode = document.createTextNode("test");
        if (!util.areHostMethods(textNode, ["splitText", "deleteData", "insertData", "appendData", "cloneNode"] ||
                !util.areHostObjects(el, ["previousSibling", "nextSibling", "childNodes", "parentNode"]) ||
                !util.areHostProperties(textNode, ["data"]))) {
            module.fail("Incomplete Text Node implementation");
        }

        /*----------------------------------------------------------------------------------------------------------------*/

        // Removed use of indexOf because of a bizarre bug in Opera that is thrown in one of the Acid3 tests. I haven't been
        // able to replicate it outside of the test. The bug is that indexOf returns -1 when called on an Array that
        // contains just the document as a single element and the value searched for is the document.
        var arrayContains = /*Array.prototype.indexOf ?
            function(arr, val) {
                return arr.indexOf(val) > -1;
            }:*/

            function(arr, val) {
                var i = arr.length;
                while (i--) {
                    if (arr[i] === val) {
                        return true;
                    }
                }
                return false;
            };

        // Opera 11 puts HTML elements in the null namespace, it seems, and IE 7 has undefined namespaceURI
        function isHtmlNamespace(node) {
            var ns;
            return typeof node.namespaceURI == UNDEF || ((ns = node.namespaceURI) === null || ns == "http://www.w3.org/1999/xhtml");
        }

        function parentElement(node) {
            var parent = node.parentNode;
            return (parent.nodeType == 1) ? parent : null;
        }

        function getNodeIndex(node) {
            var i = 0;
            while( (node = node.previousSibling) ) {
                ++i;
            }
            return i;
        }

        function getNodeLength(node) {
            switch (node.nodeType) {
                case 7:
                case 10:
                    return 0;
                case 3:
                case 8:
                    return node.length;
                default:
                    return node.childNodes.length;
            }
        }

        function getCommonAncestor(node1, node2) {
            var ancestors = [], n;
            for (n = node1; n; n = n.parentNode) {
                ancestors.push(n);
            }

            for (n = node2; n; n = n.parentNode) {
                if (arrayContains(ancestors, n)) {
                    return n;
                }
            }

            return null;
        }

        function isAncestorOf(ancestor, descendant, selfIsAncestor) {
            var n = selfIsAncestor ? descendant : descendant.parentNode;
            while (n) {
                if (n === ancestor) {
                    return true;
                } else {
                    n = n.parentNode;
                }
            }
            return false;
        }

        function isOrIsAncestorOf(ancestor, descendant) {
            return isAncestorOf(ancestor, descendant, true);
        }

        function getClosestAncestorIn(node, ancestor, selfIsAncestor) {
            var p, n = selfIsAncestor ? node : node.parentNode;
            while (n) {
                p = n.parentNode;
                if (p === ancestor) {
                    return n;
                }
                n = p;
            }
            return null;
        }

        function isCharacterDataNode(node) {
            var t = node.nodeType;
            return t == 3 || t == 4 || t == 8 ; // Text, CDataSection or Comment
        }

        function isTextOrCommentNode(node) {
            if (!node) {
                return false;
            }
            var t = node.nodeType;
            return t == 3 || t == 8 ; // Text or Comment
        }

        function insertAfter(node, precedingNode) {
            var nextNode = precedingNode.nextSibling, parent = precedingNode.parentNode;
            if (nextNode) {
                parent.insertBefore(node, nextNode);
            } else {
                parent.appendChild(node);
            }
            return node;
        }

        // Note that we cannot use splitText() because it is bugridden in IE 9.
        function splitDataNode(node, index, positionsToPreserve) {
            var newNode = node.cloneNode(false);
            newNode.deleteData(0, index);
            node.deleteData(index, node.length - index);
            insertAfter(newNode, node);

            // Preserve positions
            if (positionsToPreserve) {
                for (var i = 0, position; position = positionsToPreserve[i++]; ) {
                    // Handle case where position was inside the portion of node after the split point
                    if (position.node == node && position.offset > index) {
                        position.node = newNode;
                        position.offset -= index;
                    }
                    // Handle the case where the position is a node offset within node's parent
                    else if (position.node == node.parentNode && position.offset > getNodeIndex(node)) {
                        ++position.offset;
                    }
                }
            }
            return newNode;
        }

        function getDocument(node) {
            if (node.nodeType == 9) {
                return node;
            } else if (typeof node.ownerDocument != UNDEF) {
                return node.ownerDocument;
            } else if (typeof node.document != UNDEF) {
                return node.document;
            } else if (node.parentNode) {
                return getDocument(node.parentNode);
            } else {
                throw module.createError("getDocument: no document found for node");
            }
        }

        function getWindow(node) {
            var doc = getDocument(node);
            if (typeof doc.defaultView != UNDEF) {
                return doc.defaultView;
            } else if (typeof doc.parentWindow != UNDEF) {
                return doc.parentWindow;
            } else {
                throw module.createError("Cannot get a window object for node");
            }
        }

        function getIframeDocument(iframeEl) {
            if (typeof iframeEl.contentDocument != UNDEF) {
                return iframeEl.contentDocument;
            } else if (typeof iframeEl.contentWindow != UNDEF) {
                return iframeEl.contentWindow.document;
            } else {
                throw module.createError("getIframeDocument: No Document object found for iframe element");
            }
        }

        function getIframeWindow(iframeEl) {
            if (typeof iframeEl.contentWindow != UNDEF) {
                return iframeEl.contentWindow;
            } else if (typeof iframeEl.contentDocument != UNDEF) {
                return iframeEl.contentDocument.defaultView;
            } else {
                throw module.createError("getIframeWindow: No Window object found for iframe element");
            }
        }

        // This looks bad. Is it worth it?
        function isWindow(obj) {
            return obj && util.isHostMethod(obj, "setTimeout") && util.isHostObject(obj, "document");
        }

        function getContentDocument(obj, module, methodName) {
            var doc;

            if (!obj) {
                doc = document;
            }

            // Test if a DOM node has been passed and obtain a document object for it if so
            else if (util.isHostProperty(obj, "nodeType")) {
                doc = (obj.nodeType == 1 && obj.tagName.toLowerCase() == "iframe") ?
                    getIframeDocument(obj) : getDocument(obj);
            }

            // Test if the doc parameter appears to be a Window object
            else if (isWindow(obj)) {
                doc = obj.document;
            }

            if (!doc) {
                throw module.createError(methodName + "(): Parameter must be a Window object or DOM node");
            }

            return doc;
        }

        function getRootContainer(node) {
            var parent;
            while ( (parent = node.parentNode) ) {
                node = parent;
            }
            return node;
        }

        function comparePoints(nodeA, offsetA, nodeB, offsetB) {
            // See http://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html#Level-2-Range-Comparing
            var nodeC, root, childA, childB, n;
            if (nodeA == nodeB) {
                // Case 1: nodes are the same
                return offsetA === offsetB ? 0 : (offsetA < offsetB) ? -1 : 1;
            } else if ( (nodeC = getClosestAncestorIn(nodeB, nodeA, true)) ) {
                // Case 2: node C (container B or an ancestor) is a child node of A
                return offsetA <= getNodeIndex(nodeC) ? -1 : 1;
            } else if ( (nodeC = getClosestAncestorIn(nodeA, nodeB, true)) ) {
                // Case 3: node C (container A or an ancestor) is a child node of B
                return getNodeIndex(nodeC) < offsetB  ? -1 : 1;
            } else {
                root = getCommonAncestor(nodeA, nodeB);
                if (!root) {
                    throw new Error("comparePoints error: nodes have no common ancestor");
                }

                // Case 4: containers are siblings or descendants of siblings
                childA = (nodeA === root) ? root : getClosestAncestorIn(nodeA, root, true);
                childB = (nodeB === root) ? root : getClosestAncestorIn(nodeB, root, true);

                if (childA === childB) {
                    // This shouldn't be possible
                    throw module.createError("comparePoints got to case 4 and childA and childB are the same!");
                } else {
                    n = root.firstChild;
                    while (n) {
                        if (n === childA) {
                            return -1;
                        } else if (n === childB) {
                            return 1;
                        }
                        n = n.nextSibling;
                    }
                }
            }
        }

        /*----------------------------------------------------------------------------------------------------------------*/

        // Test for IE's crash (IE 6/7) or exception (IE >= 8) when a reference to garbage-collected text node is queried
        var crashyTextNodes = false;

        function isBrokenNode(node) {
            var n;
            try {
                n = node.parentNode;
                return false;
            } catch (e) {
                return true;
            }
        }

        (function() {
            var el = document.createElement("b");
            el.innerHTML = "1";
            var textNode = el.firstChild;
            el.innerHTML = "<br>";
            crashyTextNodes = isBrokenNode(textNode);

            api.features.crashyTextNodes = crashyTextNodes;
        })();

        /*----------------------------------------------------------------------------------------------------------------*/

        function inspectNode(node) {
            if (!node) {
                return "[No node]";
            }
            if (crashyTextNodes && isBrokenNode(node)) {
                return "[Broken node]";
            }
            if (isCharacterDataNode(node)) {
                return '"' + node.data + '"';
            }
            if (node.nodeType == 1) {
                var idAttr = node.id ? ' id="' + node.id + '"' : "";
                return "<" + node.nodeName + idAttr + ">[index:" + getNodeIndex(node) + ",length:" + node.childNodes.length + "][" + (node.innerHTML || "[innerHTML not supported]").slice(0, 25) + "]";
            }
            return node.nodeName;
        }

        function fragmentFromNodeChildren(node) {
            var fragment = getDocument(node).createDocumentFragment(), child;
            while ( (child = node.firstChild) ) {
                fragment.appendChild(child);
            }
            return fragment;
        }

        var getComputedStyleProperty;
        if (typeof window.getComputedStyle != UNDEF) {
            getComputedStyleProperty = function(el, propName) {
                return getWindow(el).getComputedStyle(el, null)[propName];
            };
        } else if (typeof document.documentElement.currentStyle != UNDEF) {
            getComputedStyleProperty = function(el, propName) {
                return el.currentStyle[propName];
            };
        } else {
            module.fail("No means of obtaining computed style properties found");
        }

        function NodeIterator(root) {
            this.root = root;
            this._next = root;
        }

        NodeIterator.prototype = {
            _current: null,

            hasNext: function() {
                return !!this._next;
            },

            next: function() {
                var n = this._current = this._next;
                var child, next;
                if (this._current) {
                    child = n.firstChild;
                    if (child) {
                        this._next = child;
                    } else {
                        next = null;
                        while ((n !== this.root) && !(next = n.nextSibling)) {
                            n = n.parentNode;
                        }
                        this._next = next;
                    }
                }
                return this._current;
            },

            detach: function() {
                this._current = this._next = this.root = null;
            }
        };

        function createIterator(root) {
            return new NodeIterator(root);
        }

        function DomPosition(node, offset) {
            this.node = node;
            this.offset = offset;
        }

        DomPosition.prototype = {
            equals: function(pos) {
                return !!pos && this.node === pos.node && this.offset == pos.offset;
            },

            inspect: function() {
                return "[DomPosition(" + inspectNode(this.node) + ":" + this.offset + ")]";
            },

            toString: function() {
                return this.inspect();
            }
        };

        function DOMException(codeName) {
            this.code = this[codeName];
            this.codeName = codeName;
            this.message = "DOMException: " + this.codeName;
        }

        DOMException.prototype = {
            INDEX_SIZE_ERR: 1,
            HIERARCHY_REQUEST_ERR: 3,
            WRONG_DOCUMENT_ERR: 4,
            NO_MODIFICATION_ALLOWED_ERR: 7,
            NOT_FOUND_ERR: 8,
            NOT_SUPPORTED_ERR: 9,
            INVALID_STATE_ERR: 11,
            INVALID_NODE_TYPE_ERR: 24
        };

        DOMException.prototype.toString = function() {
            return this.message;
        };

        api.dom = {
            arrayContains: arrayContains,
            isHtmlNamespace: isHtmlNamespace,
            parentElement: parentElement,
            getNodeIndex: getNodeIndex,
            getNodeLength: getNodeLength,
            getCommonAncestor: getCommonAncestor,
            isAncestorOf: isAncestorOf,
            isOrIsAncestorOf: isOrIsAncestorOf,
            getClosestAncestorIn: getClosestAncestorIn,
            isCharacterDataNode: isCharacterDataNode,
            isTextOrCommentNode: isTextOrCommentNode,
            insertAfter: insertAfter,
            splitDataNode: splitDataNode,
            getDocument: getDocument,
            getWindow: getWindow,
            getIframeWindow: getIframeWindow,
            getIframeDocument: getIframeDocument,
            getBody: util.getBody,
            isWindow: isWindow,
            getContentDocument: getContentDocument,
            getRootContainer: getRootContainer,
            comparePoints: comparePoints,
            isBrokenNode: isBrokenNode,
            inspectNode: inspectNode,
            getComputedStyleProperty: getComputedStyleProperty,
            fragmentFromNodeChildren: fragmentFromNodeChildren,
            createIterator: createIterator,
            DomPosition: DomPosition
        };

        api.DOMException = DOMException;
    });

    /*----------------------------------------------------------------------------------------------------------------*/

    // Pure JavaScript implementation of DOM Range
    api.createCoreModule("DomRange", ["DomUtil"], function(api, module) {
        var dom = api.dom;
        var util = api.util;
        var DomPosition = dom.DomPosition;
        var DOMException = api.DOMException;

        var isCharacterDataNode = dom.isCharacterDataNode;
        var getNodeIndex = dom.getNodeIndex;
        var isOrIsAncestorOf = dom.isOrIsAncestorOf;
        var getDocument = dom.getDocument;
        var comparePoints = dom.comparePoints;
        var splitDataNode = dom.splitDataNode;
        var getClosestAncestorIn = dom.getClosestAncestorIn;
        var getNodeLength = dom.getNodeLength;
        var arrayContains = dom.arrayContains;
        var getRootContainer = dom.getRootContainer;
        var crashyTextNodes = api.features.crashyTextNodes;

        /*----------------------------------------------------------------------------------------------------------------*/

        // Utility functions

        function isNonTextPartiallySelected(node, range) {
            return (node.nodeType != 3) &&
                   (isOrIsAncestorOf(node, range.startContainer) || isOrIsAncestorOf(node, range.endContainer));
        }

        function getRangeDocument(range) {
            return range.document || getDocument(range.startContainer);
        }

        function getBoundaryBeforeNode(node) {
            return new DomPosition(node.parentNode, getNodeIndex(node));
        }

        function getBoundaryAfterNode(node) {
            return new DomPosition(node.parentNode, getNodeIndex(node) + 1);
        }

        function insertNodeAtPosition(node, n, o) {
            var firstNodeInserted = node.nodeType == 11 ? node.firstChild : node;
            if (isCharacterDataNode(n)) {
                if (o == n.length) {
                    dom.insertAfter(node, n);
                } else {
                    n.parentNode.insertBefore(node, o == 0 ? n : splitDataNode(n, o));
                }
            } else if (o >= n.childNodes.length) {
                n.appendChild(node);
            } else {
                n.insertBefore(node, n.childNodes[o]);
            }
            return firstNodeInserted;
        }

        function rangesIntersect(rangeA, rangeB, touchingIsIntersecting) {
            assertRangeValid(rangeA);
            assertRangeValid(rangeB);

            if (getRangeDocument(rangeB) != getRangeDocument(rangeA)) {
                throw new DOMException("WRONG_DOCUMENT_ERR");
            }

            var startComparison = comparePoints(rangeA.startContainer, rangeA.startOffset, rangeB.endContainer, rangeB.endOffset),
                endComparison = comparePoints(rangeA.endContainer, rangeA.endOffset, rangeB.startContainer, rangeB.startOffset);

            return touchingIsIntersecting ? startComparison <= 0 && endComparison >= 0 : startComparison < 0 && endComparison > 0;
        }

        function cloneSubtree(iterator) {
            var partiallySelected;
            for (var node, frag = getRangeDocument(iterator.range).createDocumentFragment(), subIterator; node = iterator.next(); ) {
                partiallySelected = iterator.isPartiallySelectedSubtree();
                node = node.cloneNode(!partiallySelected);
                if (partiallySelected) {
                    subIterator = iterator.getSubtreeIterator();
                    node.appendChild(cloneSubtree(subIterator));
                    subIterator.detach();
                }

                if (node.nodeType == 10) { // DocumentType
                    throw new DOMException("HIERARCHY_REQUEST_ERR");
                }
                frag.appendChild(node);
            }
            return frag;
        }

        function iterateSubtree(rangeIterator, func, iteratorState) {
            var it, n;
            iteratorState = iteratorState || { stop: false };
            for (var node, subRangeIterator; node = rangeIterator.next(); ) {
                if (rangeIterator.isPartiallySelectedSubtree()) {
                    if (func(node) === false) {
                        iteratorState.stop = true;
                        return;
                    } else {
                        // The node is partially selected by the Range, so we can use a new RangeIterator on the portion of
                        // the node selected by the Range.
                        subRangeIterator = rangeIterator.getSubtreeIterator();
                        iterateSubtree(subRangeIterator, func, iteratorState);
                        subRangeIterator.detach();
                        if (iteratorState.stop) {
                            return;
                        }
                    }
                } else {
                    // The whole node is selected, so we can use efficient DOM iteration to iterate over the node and its
                    // descendants
                    it = dom.createIterator(node);
                    while ( (n = it.next()) ) {
                        if (func(n) === false) {
                            iteratorState.stop = true;
                            return;
                        }
                    }
                }
            }
        }

        function deleteSubtree(iterator) {
            var subIterator;
            while (iterator.next()) {
                if (iterator.isPartiallySelectedSubtree()) {
                    subIterator = iterator.getSubtreeIterator();
                    deleteSubtree(subIterator);
                    subIterator.detach();
                } else {
                    iterator.remove();
                }
            }
        }

        function extractSubtree(iterator) {
            for (var node, frag = getRangeDocument(iterator.range).createDocumentFragment(), subIterator; node = iterator.next(); ) {

                if (iterator.isPartiallySelectedSubtree()) {
                    node = node.cloneNode(false);
                    subIterator = iterator.getSubtreeIterator();
                    node.appendChild(extractSubtree(subIterator));
                    subIterator.detach();
                } else {
                    iterator.remove();
                }
                if (node.nodeType == 10) { // DocumentType
                    throw new DOMException("HIERARCHY_REQUEST_ERR");
                }
                frag.appendChild(node);
            }
            return frag;
        }

        function getNodesInRange(range, nodeTypes, filter) {
            var filterNodeTypes = !!(nodeTypes && nodeTypes.length), regex;
            var filterExists = !!filter;
            if (filterNodeTypes) {
                regex = new RegExp("^(" + nodeTypes.join("|") + ")$");
            }

            var nodes = [];
            iterateSubtree(new RangeIterator(range, false), function(node) {
                if (filterNodeTypes && !regex.test(node.nodeType)) {
                    return;
                }
                if (filterExists && !filter(node)) {
                    return;
                }
                // Don't include a boundary container if it is a character data node and the range does not contain any
                // of its character data. See issue 190.
                var sc = range.startContainer;
                if (node == sc && isCharacterDataNode(sc) && range.startOffset == sc.length) {
                    return;
                }

                var ec = range.endContainer;
                if (node == ec && isCharacterDataNode(ec) && range.endOffset == 0) {
                    return;
                }

                nodes.push(node);
            });
            return nodes;
        }

        function inspect(range) {
            var name = (typeof range.getName == "undefined") ? "Range" : range.getName();
            return "[" + name + "(" + dom.inspectNode(range.startContainer) + ":" + range.startOffset + ", " +
                    dom.inspectNode(range.endContainer) + ":" + range.endOffset + ")]";
        }

        /*----------------------------------------------------------------------------------------------------------------*/

        // RangeIterator code partially borrows from IERange by Tim Ryan (http://github.com/timcameronryan/IERange)

        function RangeIterator(range, clonePartiallySelectedTextNodes) {
            this.range = range;
            this.clonePartiallySelectedTextNodes = clonePartiallySelectedTextNodes;


            if (!range.collapsed) {
                this.sc = range.startContainer;
                this.so = range.startOffset;
                this.ec = range.endContainer;
                this.eo = range.endOffset;
                var root = range.commonAncestorContainer;

                if (this.sc === this.ec && isCharacterDataNode(this.sc)) {
                    this.isSingleCharacterDataNode = true;
                    this._first = this._last = this._next = this.sc;
                } else {
                    this._first = this._next = (this.sc === root && !isCharacterDataNode(this.sc)) ?
                        this.sc.childNodes[this.so] : getClosestAncestorIn(this.sc, root, true);
                    this._last = (this.ec === root && !isCharacterDataNode(this.ec)) ?
                        this.ec.childNodes[this.eo - 1] : getClosestAncestorIn(this.ec, root, true);
                }
            }
        }

        RangeIterator.prototype = {
            _current: null,
            _next: null,
            _first: null,
            _last: null,
            isSingleCharacterDataNode: false,

            reset: function() {
                this._current = null;
                this._next = this._first;
            },

            hasNext: function() {
                return !!this._next;
            },

            next: function() {
                // Move to next node
                var current = this._current = this._next;
                if (current) {
                    this._next = (current !== this._last) ? current.nextSibling : null;

                    // Check for partially selected text nodes
                    if (isCharacterDataNode(current) && this.clonePartiallySelectedTextNodes) {
                        if (current === this.ec) {
                            (current = current.cloneNode(true)).deleteData(this.eo, current.length - this.eo);
                        }
                        if (this._current === this.sc) {
                            (current = current.cloneNode(true)).deleteData(0, this.so);
                        }
                    }
                }

                return current;
            },

            remove: function() {
                var current = this._current, start, end;

                if (isCharacterDataNode(current) && (current === this.sc || current === this.ec)) {
                    start = (current === this.sc) ? this.so : 0;
                    end = (current === this.ec) ? this.eo : current.length;
                    if (start != end) {
                        current.deleteData(start, end - start);
                    }
                } else {
                    if (current.parentNode) {
                        current.parentNode.removeChild(current);
                    } else {
                    }
                }
            },

            // Checks if the current node is partially selected
            isPartiallySelectedSubtree: function() {
                var current = this._current;
                return isNonTextPartiallySelected(current, this.range);
            },

            getSubtreeIterator: function() {
                var subRange;
                if (this.isSingleCharacterDataNode) {
                    subRange = this.range.cloneRange();
                    subRange.collapse(false);
                } else {
                    subRange = new Range(getRangeDocument(this.range));
                    var current = this._current;
                    var startContainer = current, startOffset = 0, endContainer = current, endOffset = getNodeLength(current);

                    if (isOrIsAncestorOf(current, this.sc)) {
                        startContainer = this.sc;
                        startOffset = this.so;
                    }
                    if (isOrIsAncestorOf(current, this.ec)) {
                        endContainer = this.ec;
                        endOffset = this.eo;
                    }

                    updateBoundaries(subRange, startContainer, startOffset, endContainer, endOffset);
                }
                return new RangeIterator(subRange, this.clonePartiallySelectedTextNodes);
            },

            detach: function() {
                this.range = this._current = this._next = this._first = this._last = this.sc = this.so = this.ec = this.eo = null;
            }
        };

        /*----------------------------------------------------------------------------------------------------------------*/

        var beforeAfterNodeTypes = [1, 3, 4, 5, 7, 8, 10];
        var rootContainerNodeTypes = [2, 9, 11];
        var readonlyNodeTypes = [5, 6, 10, 12];
        var insertableNodeTypes = [1, 3, 4, 5, 7, 8, 10, 11];
        var surroundNodeTypes = [1, 3, 4, 5, 7, 8];

        function createAncestorFinder(nodeTypes) {
            return function(node, selfIsAncestor) {
                var t, n = selfIsAncestor ? node : node.parentNode;
                while (n) {
                    t = n.nodeType;
                    if (arrayContains(nodeTypes, t)) {
                        return n;
                    }
                    n = n.parentNode;
                }
                return null;
            };
        }

        var getDocumentOrFragmentContainer = createAncestorFinder( [9, 11] );
        var getReadonlyAncestor = createAncestorFinder(readonlyNodeTypes);
        var getDocTypeNotationEntityAncestor = createAncestorFinder( [6, 10, 12] );

        function assertNoDocTypeNotationEntityAncestor(node, allowSelf) {
            if (getDocTypeNotationEntityAncestor(node, allowSelf)) {
                throw new DOMException("INVALID_NODE_TYPE_ERR");
            }
        }

        function assertValidNodeType(node, invalidTypes) {
            if (!arrayContains(invalidTypes, node.nodeType)) {
                throw new DOMException("INVALID_NODE_TYPE_ERR");
            }
        }

        function assertValidOffset(node, offset) {
            if (offset < 0 || offset > (isCharacterDataNode(node) ? node.length : node.childNodes.length)) {
                throw new DOMException("INDEX_SIZE_ERR");
            }
        }

        function assertSameDocumentOrFragment(node1, node2) {
            if (getDocumentOrFragmentContainer(node1, true) !== getDocumentOrFragmentContainer(node2, true)) {
                throw new DOMException("WRONG_DOCUMENT_ERR");
            }
        }

        function assertNodeNotReadOnly(node) {
            if (getReadonlyAncestor(node, true)) {
                throw new DOMException("NO_MODIFICATION_ALLOWED_ERR");
            }
        }

        function assertNode(node, codeName) {
            if (!node) {
                throw new DOMException(codeName);
            }
        }

        function isOrphan(node) {
            return (crashyTextNodes && dom.isBrokenNode(node)) ||
                !arrayContains(rootContainerNodeTypes, node.nodeType) && !getDocumentOrFragmentContainer(node, true);
        }

        function isValidOffset(node, offset) {
            return offset <= (isCharacterDataNode(node) ? node.length : node.childNodes.length);
        }

        function isRangeValid(range) {
            return (!!range.startContainer && !!range.endContainer &&
                    !isOrphan(range.startContainer) &&
                    !isOrphan(range.endContainer) &&
                    isValidOffset(range.startContainer, range.startOffset) &&
                    isValidOffset(range.endContainer, range.endOffset));
        }

        function assertRangeValid(range) {
            if (!isRangeValid(range)) {
                throw new Error("Range error: Range is no longer valid after DOM mutation (" + range.inspect() + ")");
            }
        }

        /*----------------------------------------------------------------------------------------------------------------*/

        // Test the browser's innerHTML support to decide how to implement createContextualFragment
        var styleEl = document.createElement("style");
        var htmlParsingConforms = false;
        try {
            styleEl.innerHTML = "<b>x</b>";
            htmlParsingConforms = (styleEl.firstChild.nodeType == 3); // Opera incorrectly creates an element node
        } catch (e) {
            // IE 6 and 7 throw
        }

        api.features.htmlParsingConforms = htmlParsingConforms;

        var createContextualFragment = htmlParsingConforms ?

            // Implementation as per HTML parsing spec, trusting in the browser's implementation of innerHTML. See
            // discussion and base code for this implementation at issue 67.
            // Spec: http://html5.org/specs/dom-parsing.html#extensions-to-the-range-interface
            // Thanks to Aleks Williams.
            function(fragmentStr) {
                // "Let node the context object's start's node."
                var node = this.startContainer;
                var doc = getDocument(node);

                // "If the context object's start's node is null, raise an INVALID_STATE_ERR
                // exception and abort these steps."
                if (!node) {
                    throw new DOMException("INVALID_STATE_ERR");
                }

                // "Let element be as follows, depending on node's interface:"
                // Document, Document Fragment: null
                var el = null;

                // "Element: node"
                if (node.nodeType == 1) {
                    el = node;

                // "Text, Comment: node's parentElement"
                } else if (isCharacterDataNode(node)) {
                    el = dom.parentElement(node);
                }

                // "If either element is null or element's ownerDocument is an HTML document
                // and element's local name is "html" and element's namespace is the HTML
                // namespace"
                if (el === null || (
                    el.nodeName == "HTML" &&
                    dom.isHtmlNamespace(getDocument(el).documentElement) &&
                    dom.isHtmlNamespace(el)
                )) {

                // "let element be a new Element with "body" as its local name and the HTML
                // namespace as its namespace.""
                    el = doc.createElement("body");
                } else {
                    el = el.cloneNode(false);
                }

                // "If the node's document is an HTML document: Invoke the HTML fragment parsing algorithm."
                // "If the node's document is an XML document: Invoke the XML fragment parsing algorithm."
                // "In either case, the algorithm must be invoked with fragment as the input
                // and element as the context element."
                el.innerHTML = fragmentStr;

                // "If this raises an exception, then abort these steps. Otherwise, let new
                // children be the nodes returned."

                // "Let fragment be a new DocumentFragment."
                // "Append all new children to fragment."
                // "Return fragment."
                return dom.fragmentFromNodeChildren(el);
            } :

            // In this case, innerHTML cannot be trusted, so fall back to a simpler, non-conformant implementation that
            // previous versions of Rangy used (with the exception of using a body element rather than a div)
            function(fragmentStr) {
                var doc = getRangeDocument(this);
                var el = doc.createElement("body");
                el.innerHTML = fragmentStr;

                return dom.fragmentFromNodeChildren(el);
            };

        function splitRangeBoundaries(range, positionsToPreserve) {
            assertRangeValid(range);

            var sc = range.startContainer, so = range.startOffset, ec = range.endContainer, eo = range.endOffset;
            var startEndSame = (sc === ec);

            if (isCharacterDataNode(ec) && eo > 0 && eo < ec.length) {
                splitDataNode(ec, eo, positionsToPreserve);
            }

            if (isCharacterDataNode(sc) && so > 0 && so < sc.length) {
                sc = splitDataNode(sc, so, positionsToPreserve);
                if (startEndSame) {
                    eo -= so;
                    ec = sc;
                } else if (ec == sc.parentNode && eo >= getNodeIndex(sc)) {
                    eo++;
                }
                so = 0;
            }
            range.setStartAndEnd(sc, so, ec, eo);
        }
        
        function rangeToHtml(range) {
            assertRangeValid(range);
            var container = range.commonAncestorContainer.parentNode.cloneNode(false);
            container.appendChild( range.cloneContents() );
            return container.innerHTML;
        }

        /*----------------------------------------------------------------------------------------------------------------*/

        var rangeProperties = ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed",
            "commonAncestorContainer"];

        var s2s = 0, s2e = 1, e2e = 2, e2s = 3;
        var n_b = 0, n_a = 1, n_b_a = 2, n_i = 3;

        util.extend(api.rangePrototype, {
            compareBoundaryPoints: function(how, range) {
                assertRangeValid(this);
                assertSameDocumentOrFragment(this.startContainer, range.startContainer);

                var nodeA, offsetA, nodeB, offsetB;
                var prefixA = (how == e2s || how == s2s) ? "start" : "end";
                var prefixB = (how == s2e || how == s2s) ? "start" : "end";
                nodeA = this[prefixA + "Container"];
                offsetA = this[prefixA + "Offset"];
                nodeB = range[prefixB + "Container"];
                offsetB = range[prefixB + "Offset"];
                return comparePoints(nodeA, offsetA, nodeB, offsetB);
            },

            insertNode: function(node) {
                assertRangeValid(this);
                assertValidNodeType(node, insertableNodeTypes);
                assertNodeNotReadOnly(this.startContainer);

                if (isOrIsAncestorOf(node, this.startContainer)) {
                    throw new DOMException("HIERARCHY_REQUEST_ERR");
                }

                // No check for whether the container of the start of the Range is of a type that does not allow
                // children of the type of node: the browser's DOM implementation should do this for us when we attempt
                // to add the node

                var firstNodeInserted = insertNodeAtPosition(node, this.startContainer, this.startOffset);
                this.setStartBefore(firstNodeInserted);
            },

            cloneContents: function() {
                assertRangeValid(this);

                var clone, frag;
                if (this.collapsed) {
                    return getRangeDocument(this).createDocumentFragment();
                } else {
                    if (this.startContainer === this.endContainer && isCharacterDataNode(this.startContainer)) {
                        clone = this.startContainer.cloneNode(true);
                        clone.data = clone.data.slice(this.startOffset, this.endOffset);
                        frag = getRangeDocument(this).createDocumentFragment();
                        frag.appendChild(clone);
                        return frag;
                    } else {
                        var iterator = new RangeIterator(this, true);
                        clone = cloneSubtree(iterator);
                        iterator.detach();
                    }
                    return clone;
                }
            },

            canSurroundContents: function() {
                assertRangeValid(this);
                assertNodeNotReadOnly(this.startContainer);
                assertNodeNotReadOnly(this.endContainer);

                // Check if the contents can be surrounded. Specifically, this means whether the range partially selects
                // no non-text nodes.
                var iterator = new RangeIterator(this, true);
                var boundariesInvalid = (iterator._first && (isNonTextPartiallySelected(iterator._first, this)) ||
                        (iterator._last && isNonTextPartiallySelected(iterator._last, this)));
                iterator.detach();
                return !boundariesInvalid;
            },

            surroundContents: function(node) {
                assertValidNodeType(node, surroundNodeTypes);

                if (!this.canSurroundContents()) {
                    throw new DOMException("INVALID_STATE_ERR");
                }

                // Extract the contents
                var content = this.extractContents();

                // Clear the children of the node
                if (node.hasChildNodes()) {
                    while (node.lastChild) {
                        node.removeChild(node.lastChild);
                    }
                }

                // Insert the new node and add the extracted contents
                insertNodeAtPosition(node, this.startContainer, this.startOffset);
                node.appendChild(content);

                this.selectNode(node);
            },

            cloneRange: function() {
                assertRangeValid(this);
                var range = new Range(getRangeDocument(this));
                var i = rangeProperties.length, prop;
                while (i--) {
                    prop = rangeProperties[i];
                    range[prop] = this[prop];
                }
                return range;
            },

            toString: function() {
                assertRangeValid(this);
                var sc = this.startContainer;
                if (sc === this.endContainer && isCharacterDataNode(sc)) {
                    return (sc.nodeType == 3 || sc.nodeType == 4) ? sc.data.slice(this.startOffset, this.endOffset) : "";
                } else {
                    var textParts = [], iterator = new RangeIterator(this, true);
                    iterateSubtree(iterator, function(node) {
                        // Accept only text or CDATA nodes, not comments
                        if (node.nodeType == 3 || node.nodeType == 4) {
                            textParts.push(node.data);
                        }
                    });
                    iterator.detach();
                    return textParts.join("");
                }
            },

            // The methods below are all non-standard. The following batch were introduced by Mozilla but have since
            // been removed from Mozilla.

            compareNode: function(node) {
                assertRangeValid(this);

                var parent = node.parentNode;
                var nodeIndex = getNodeIndex(node);

                if (!parent) {
                    throw new DOMException("NOT_FOUND_ERR");
                }

                var startComparison = this.comparePoint(parent, nodeIndex),
                    endComparison = this.comparePoint(parent, nodeIndex + 1);

                if (startComparison < 0) { // Node starts before
                    return (endComparison > 0) ? n_b_a : n_b;
                } else {
                    return (endComparison > 0) ? n_a : n_i;
                }
            },

            comparePoint: function(node, offset) {
                assertRangeValid(this);
                assertNode(node, "HIERARCHY_REQUEST_ERR");
                assertSameDocumentOrFragment(node, this.startContainer);

                if (comparePoints(node, offset, this.startContainer, this.startOffset) < 0) {
                    return -1;
                } else if (comparePoints(node, offset, this.endContainer, this.endOffset) > 0) {
                    return 1;
                }
                return 0;
            },

            createContextualFragment: createContextualFragment,

            toHtml: function() {
                return rangeToHtml(this);
            },

            // touchingIsIntersecting determines whether this method considers a node that borders a range intersects
            // with it (as in WebKit) or not (as in Gecko pre-1.9, and the default)
            intersectsNode: function(node, touchingIsIntersecting) {
                assertRangeValid(this);
                assertNode(node, "NOT_FOUND_ERR");
                if (getDocument(node) !== getRangeDocument(this)) {
                    return false;
                }

                var parent = node.parentNode, offset = getNodeIndex(node);
                assertNode(parent, "NOT_FOUND_ERR");

                var startComparison = comparePoints(parent, offset, this.endContainer, this.endOffset),
                    endComparison = comparePoints(parent, offset + 1, this.startContainer, this.startOffset);

                return touchingIsIntersecting ? startComparison <= 0 && endComparison >= 0 : startComparison < 0 && endComparison > 0;
            },

            isPointInRange: function(node, offset) {
                assertRangeValid(this);
                assertNode(node, "HIERARCHY_REQUEST_ERR");
                assertSameDocumentOrFragment(node, this.startContainer);

                return (comparePoints(node, offset, this.startContainer, this.startOffset) >= 0) &&
                       (comparePoints(node, offset, this.endContainer, this.endOffset) <= 0);
            },

            // The methods below are non-standard and invented by me.

            // Sharing a boundary start-to-end or end-to-start does not count as intersection.
            intersectsRange: function(range) {
                return rangesIntersect(this, range, false);
            },

            // Sharing a boundary start-to-end or end-to-start does count as intersection.
            intersectsOrTouchesRange: function(range) {
                return rangesIntersect(this, range, true);
            },

            intersection: function(range) {
                if (this.intersectsRange(range)) {
                    var startComparison = comparePoints(this.startContainer, this.startOffset, range.startContainer, range.startOffset),
                        endComparison = comparePoints(this.endContainer, this.endOffset, range.endContainer, range.endOffset);

                    var intersectionRange = this.cloneRange();
                    if (startComparison == -1) {
                        intersectionRange.setStart(range.startContainer, range.startOffset);
                    }
                    if (endComparison == 1) {
                        intersectionRange.setEnd(range.endContainer, range.endOffset);
                    }
                    return intersectionRange;
                }
                return null;
            },

            union: function(range) {
                if (this.intersectsOrTouchesRange(range)) {
                    var unionRange = this.cloneRange();
                    if (comparePoints(range.startContainer, range.startOffset, this.startContainer, this.startOffset) == -1) {
                        unionRange.setStart(range.startContainer, range.startOffset);
                    }
                    if (comparePoints(range.endContainer, range.endOffset, this.endContainer, this.endOffset) == 1) {
                        unionRange.setEnd(range.endContainer, range.endOffset);
                    }
                    return unionRange;
                } else {
                    throw new DOMException("Ranges do not intersect");
                }
            },

            containsNode: function(node, allowPartial) {
                if (allowPartial) {
                    return this.intersectsNode(node, false);
                } else {
                    return this.compareNode(node) == n_i;
                }
            },

            containsNodeContents: function(node) {
                return this.comparePoint(node, 0) >= 0 && this.comparePoint(node, getNodeLength(node)) <= 0;
            },

            containsRange: function(range) {
                var intersection = this.intersection(range);
                return intersection !== null && range.equals(intersection);
            },

            containsNodeText: function(node) {
                var nodeRange = this.cloneRange();
                nodeRange.selectNode(node);
                var textNodes = nodeRange.getNodes([3]);
                if (textNodes.length > 0) {
                    nodeRange.setStart(textNodes[0], 0);
                    var lastTextNode = textNodes.pop();
                    nodeRange.setEnd(lastTextNode, lastTextNode.length);
                    return this.containsRange(nodeRange);
                } else {
                    return this.containsNodeContents(node);
                }
            },

            getNodes: function(nodeTypes, filter) {
                assertRangeValid(this);
                return getNodesInRange(this, nodeTypes, filter);
            },

            getDocument: function() {
                return getRangeDocument(this);
            },

            collapseBefore: function(node) {
                this.setEndBefore(node);
                this.collapse(false);
            },

            collapseAfter: function(node) {
                this.setStartAfter(node);
                this.collapse(true);
            },
            
            getBookmark: function(containerNode) {
                var doc = getRangeDocument(this);
                var preSelectionRange = api.createRange(doc);
                containerNode = containerNode || dom.getBody(doc);
                preSelectionRange.selectNodeContents(containerNode);
                var range = this.intersection(preSelectionRange);
                var start = 0, end = 0;
                if (range) {
                    preSelectionRange.setEnd(range.startContainer, range.startOffset);
                    start = preSelectionRange.toString().length;
                    end = start + range.toString().length;
                }

                return {
                    start: start,
                    end: end,
                    containerNode: containerNode
                };
            },
            
            moveToBookmark: function(bookmark) {
                var containerNode = bookmark.containerNode;
                var charIndex = 0;
                this.setStart(containerNode, 0);
                this.collapse(true);
                var nodeStack = [containerNode], node, foundStart = false, stop = false;
                var nextCharIndex, i, childNodes;

                while (!stop && (node = nodeStack.pop())) {
                    if (node.nodeType == 3) {
                        nextCharIndex = charIndex + node.length;
                        if (!foundStart && bookmark.start >= charIndex && bookmark.start <= nextCharIndex) {
                            this.setStart(node, bookmark.start - charIndex);
                            foundStart = true;
                        }
                        if (foundStart && bookmark.end >= charIndex && bookmark.end <= nextCharIndex) {
                            this.setEnd(node, bookmark.end - charIndex);
                            stop = true;
                        }
                        charIndex = nextCharIndex;
                    } else {
                        childNodes = node.childNodes;
                        i = childNodes.length;
                        while (i--) {
                            nodeStack.push(childNodes[i]);
                        }
                    }
                }
            },

            getName: function() {
                return "DomRange";
            },

            equals: function(range) {
                return Range.rangesEqual(this, range);
            },

            isValid: function() {
                return isRangeValid(this);
            },
            
            inspect: function() {
                return inspect(this);
            },
            
            detach: function() {
                // In DOM4, detach() is now a no-op.
            }
        });

        function copyComparisonConstantsToObject(obj) {
            obj.START_TO_START = s2s;
            obj.START_TO_END = s2e;
            obj.END_TO_END = e2e;
            obj.END_TO_START = e2s;

            obj.NODE_BEFORE = n_b;
            obj.NODE_AFTER = n_a;
            obj.NODE_BEFORE_AND_AFTER = n_b_a;
            obj.NODE_INSIDE = n_i;
        }

        function copyComparisonConstants(constructor) {
            copyComparisonConstantsToObject(constructor);
            copyComparisonConstantsToObject(constructor.prototype);
        }

        function createRangeContentRemover(remover, boundaryUpdater) {
            return function() {
                assertRangeValid(this);

                var sc = this.startContainer, so = this.startOffset, root = this.commonAncestorContainer;

                var iterator = new RangeIterator(this, true);

                // Work out where to position the range after content removal
                var node, boundary;
                if (sc !== root) {
                    node = getClosestAncestorIn(sc, root, true);
                    boundary = getBoundaryAfterNode(node);
                    sc = boundary.node;
                    so = boundary.offset;
                }

                // Check none of the range is read-only
                iterateSubtree(iterator, assertNodeNotReadOnly);

                iterator.reset();

                // Remove the content
                var returnValue = remover(iterator);
                iterator.detach();

                // Move to the new position
                boundaryUpdater(this, sc, so, sc, so);

                return returnValue;
            };
        }

        function createPrototypeRange(constructor, boundaryUpdater) {
            function createBeforeAfterNodeSetter(isBefore, isStart) {
                return function(node) {
                    assertValidNodeType(node, beforeAfterNodeTypes);
                    assertValidNodeType(getRootContainer(node), rootContainerNodeTypes);

                    var boundary = (isBefore ? getBoundaryBeforeNode : getBoundaryAfterNode)(node);
                    (isStart ? setRangeStart : setRangeEnd)(this, boundary.node, boundary.offset);
                };
            }

            function setRangeStart(range, node, offset) {
                var ec = range.endContainer, eo = range.endOffset;
                if (node !== range.startContainer || offset !== range.startOffset) {
                    // Check the root containers of the range and the new boundary, and also check whether the new boundary
                    // is after the current end. In either case, collapse the range to the new position
                    if (getRootContainer(node) != getRootContainer(ec) || comparePoints(node, offset, ec, eo) == 1) {
                        ec = node;
                        eo = offset;
                    }
                    boundaryUpdater(range, node, offset, ec, eo);
                }
            }

            function setRangeEnd(range, node, offset) {
                var sc = range.startContainer, so = range.startOffset;
                if (node !== range.endContainer || offset !== range.endOffset) {
                    // Check the root containers of the range and the new boundary, and also check whether the new boundary
                    // is after the current end. In either case, collapse the range to the new position
                    if (getRootContainer(node) != getRootContainer(sc) || comparePoints(node, offset, sc, so) == -1) {
                        sc = node;
                        so = offset;
                    }
                    boundaryUpdater(range, sc, so, node, offset);
                }
            }

            // Set up inheritance
            var F = function() {};
            F.prototype = api.rangePrototype;
            constructor.prototype = new F();

            util.extend(constructor.prototype, {
                setStart: function(node, offset) {
                    assertNoDocTypeNotationEntityAncestor(node, true);
                    assertValidOffset(node, offset);

                    setRangeStart(this, node, offset);
                },

                setEnd: function(node, offset) {
                    assertNoDocTypeNotationEntityAncestor(node, true);
                    assertValidOffset(node, offset);

                    setRangeEnd(this, node, offset);
                },

                /**
                 * Convenience method to set a range's start and end boundaries. Overloaded as follows:
                 * - Two parameters (node, offset) creates a collapsed range at that position
                 * - Three parameters (node, startOffset, endOffset) creates a range contained with node starting at
                 *   startOffset and ending at endOffset
                 * - Four parameters (startNode, startOffset, endNode, endOffset) creates a range starting at startOffset in
                 *   startNode and ending at endOffset in endNode
                 */
                setStartAndEnd: function() {
                    var args = arguments;
                    var sc = args[0], so = args[1], ec = sc, eo = so;

                    switch (args.length) {
                        case 3:
                            eo = args[2];
                            break;
                        case 4:
                            ec = args[2];
                            eo = args[3];
                            break;
                    }

                    boundaryUpdater(this, sc, so, ec, eo);
                },
                
                setBoundary: function(node, offset, isStart) {
                    this["set" + (isStart ? "Start" : "End")](node, offset);
                },

                setStartBefore: createBeforeAfterNodeSetter(true, true),
                setStartAfter: createBeforeAfterNodeSetter(false, true),
                setEndBefore: createBeforeAfterNodeSetter(true, false),
                setEndAfter: createBeforeAfterNodeSetter(false, false),

                collapse: function(isStart) {
                    assertRangeValid(this);
                    if (isStart) {
                        boundaryUpdater(this, this.startContainer, this.startOffset, this.startContainer, this.startOffset);
                    } else {
                        boundaryUpdater(this, this.endContainer, this.endOffset, this.endContainer, this.endOffset);
                    }
                },

                selectNodeContents: function(node) {
                    assertNoDocTypeNotationEntityAncestor(node, true);

                    boundaryUpdater(this, node, 0, node, getNodeLength(node));
                },

                selectNode: function(node) {
                    assertNoDocTypeNotationEntityAncestor(node, false);
                    assertValidNodeType(node, beforeAfterNodeTypes);

                    var start = getBoundaryBeforeNode(node), end = getBoundaryAfterNode(node);
                    boundaryUpdater(this, start.node, start.offset, end.node, end.offset);
                },

                extractContents: createRangeContentRemover(extractSubtree, boundaryUpdater),

                deleteContents: createRangeContentRemover(deleteSubtree, boundaryUpdater),

                canSurroundContents: function() {
                    assertRangeValid(this);
                    assertNodeNotReadOnly(this.startContainer);
                    assertNodeNotReadOnly(this.endContainer);

                    // Check if the contents can be surrounded. Specifically, this means whether the range partially selects
                    // no non-text nodes.
                    var iterator = new RangeIterator(this, true);
                    var boundariesInvalid = (iterator._first && isNonTextPartiallySelected(iterator._first, this) ||
                            (iterator._last && isNonTextPartiallySelected(iterator._last, this)));
                    iterator.detach();
                    return !boundariesInvalid;
                },

                splitBoundaries: function() {
                    splitRangeBoundaries(this);
                },

                splitBoundariesPreservingPositions: function(positionsToPreserve) {
                    splitRangeBoundaries(this, positionsToPreserve);
                },

                normalizeBoundaries: function() {
                    assertRangeValid(this);

                    var sc = this.startContainer, so = this.startOffset, ec = this.endContainer, eo = this.endOffset;

                    var mergeForward = function(node) {
                        var sibling = node.nextSibling;
                        if (sibling && sibling.nodeType == node.nodeType) {
                            ec = node;
                            eo = node.length;
                            node.appendData(sibling.data);
                            sibling.parentNode.removeChild(sibling);
                        }
                    };

                    var mergeBackward = function(node) {
                        var sibling = node.previousSibling;
                        if (sibling && sibling.nodeType == node.nodeType) {
                            sc = node;
                            var nodeLength = node.length;
                            so = sibling.length;
                            node.insertData(0, sibling.data);
                            sibling.parentNode.removeChild(sibling);
                            if (sc == ec) {
                                eo += so;
                                ec = sc;
                            } else if (ec == node.parentNode) {
                                var nodeIndex = getNodeIndex(node);
                                if (eo == nodeIndex) {
                                    ec = node;
                                    eo = nodeLength;
                                } else if (eo > nodeIndex) {
                                    eo--;
                                }
                            }
                        }
                    };

                    var normalizeStart = true;

                    if (isCharacterDataNode(ec)) {
                        if (ec.length == eo) {
                            mergeForward(ec);
                        }
                    } else {
                        if (eo > 0) {
                            var endNode = ec.childNodes[eo - 1];
                            if (endNode && isCharacterDataNode(endNode)) {
                                mergeForward(endNode);
                            }
                        }
                        normalizeStart = !this.collapsed;
                    }

                    if (normalizeStart) {
                        if (isCharacterDataNode(sc)) {
                            if (so == 0) {
                                mergeBackward(sc);
                            }
                        } else {
                            if (so < sc.childNodes.length) {
                                var startNode = sc.childNodes[so];
                                if (startNode && isCharacterDataNode(startNode)) {
                                    mergeBackward(startNode);
                                }
                            }
                        }
                    } else {
                        sc = ec;
                        so = eo;
                    }

                    boundaryUpdater(this, sc, so, ec, eo);
                },

                collapseToPoint: function(node, offset) {
                    assertNoDocTypeNotationEntityAncestor(node, true);
                    assertValidOffset(node, offset);
                    this.setStartAndEnd(node, offset);
                }
            });

            copyComparisonConstants(constructor);
        }

        /*----------------------------------------------------------------------------------------------------------------*/

        // Updates commonAncestorContainer and collapsed after boundary change
        function updateCollapsedAndCommonAncestor(range) {
            range.collapsed = (range.startContainer === range.endContainer && range.startOffset === range.endOffset);
            range.commonAncestorContainer = range.collapsed ?
                range.startContainer : dom.getCommonAncestor(range.startContainer, range.endContainer);
        }

        function updateBoundaries(range, startContainer, startOffset, endContainer, endOffset) {
            range.startContainer = startContainer;
            range.startOffset = startOffset;
            range.endContainer = endContainer;
            range.endOffset = endOffset;
            range.document = dom.getDocument(startContainer);

            updateCollapsedAndCommonAncestor(range);
        }

        function Range(doc) {
            this.startContainer = doc;
            this.startOffset = 0;
            this.endContainer = doc;
            this.endOffset = 0;
            this.document = doc;
            updateCollapsedAndCommonAncestor(this);
        }

        createPrototypeRange(Range, updateBoundaries);

        util.extend(Range, {
            rangeProperties: rangeProperties,
            RangeIterator: RangeIterator,
            copyComparisonConstants: copyComparisonConstants,
            createPrototypeRange: createPrototypeRange,
            inspect: inspect,
            toHtml: rangeToHtml,
            getRangeDocument: getRangeDocument,
            rangesEqual: function(r1, r2) {
                return r1.startContainer === r2.startContainer &&
                    r1.startOffset === r2.startOffset &&
                    r1.endContainer === r2.endContainer &&
                    r1.endOffset === r2.endOffset;
            }
        });

        api.DomRange = Range;
    });

    /*----------------------------------------------------------------------------------------------------------------*/

    // Wrappers for the browser's native DOM Range and/or TextRange implementation 
    api.createCoreModule("WrappedRange", ["DomRange"], function(api, module) {
        var WrappedRange, WrappedTextRange;
        var dom = api.dom;
        var util = api.util;
        var DomPosition = dom.DomPosition;
        var DomRange = api.DomRange;
        var getBody = dom.getBody;
        var getContentDocument = dom.getContentDocument;
        var isCharacterDataNode = dom.isCharacterDataNode;


        /*----------------------------------------------------------------------------------------------------------------*/

        if (api.features.implementsDomRange) {
            // This is a wrapper around the browser's native DOM Range. It has two aims:
            // - Provide workarounds for specific browser bugs
            // - provide convenient extensions, which are inherited from Rangy's DomRange

            (function() {
                var rangeProto;
                var rangeProperties = DomRange.rangeProperties;

                function updateRangeProperties(range) {
                    var i = rangeProperties.length, prop;
                    while (i--) {
                        prop = rangeProperties[i];
                        range[prop] = range.nativeRange[prop];
                    }
                    // Fix for broken collapsed property in IE 9.
                    range.collapsed = (range.startContainer === range.endContainer && range.startOffset === range.endOffset);
                }

                function updateNativeRange(range, startContainer, startOffset, endContainer, endOffset) {
                    var startMoved = (range.startContainer !== startContainer || range.startOffset != startOffset);
                    var endMoved = (range.endContainer !== endContainer || range.endOffset != endOffset);
                    var nativeRangeDifferent = !range.equals(range.nativeRange);

                    // Always set both boundaries for the benefit of IE9 (see issue 35)
                    if (startMoved || endMoved || nativeRangeDifferent) {
                        range.setEnd(endContainer, endOffset);
                        range.setStart(startContainer, startOffset);
                    }
                }

                var createBeforeAfterNodeSetter;

                WrappedRange = function(range) {
                    if (!range) {
                        throw module.createError("WrappedRange: Range must be specified");
                    }
                    this.nativeRange = range;
                    updateRangeProperties(this);
                };

                DomRange.createPrototypeRange(WrappedRange, updateNativeRange);

                rangeProto = WrappedRange.prototype;

                rangeProto.selectNode = function(node) {
                    this.nativeRange.selectNode(node);
                    updateRangeProperties(this);
                };

                rangeProto.cloneContents = function() {
                    return this.nativeRange.cloneContents();
                };

                // Due to a long-standing Firefox bug that I have not been able to find a reliable way to detect,
                // insertNode() is never delegated to the native range.

                rangeProto.surroundContents = function(node) {
                    this.nativeRange.surroundContents(node);
                    updateRangeProperties(this);
                };

                rangeProto.collapse = function(isStart) {
                    this.nativeRange.collapse(isStart);
                    updateRangeProperties(this);
                };

                rangeProto.cloneRange = function() {
                    return new WrappedRange(this.nativeRange.cloneRange());
                };

                rangeProto.refresh = function() {
                    updateRangeProperties(this);
                };

                rangeProto.toString = function() {
                    return this.nativeRange.toString();
                };

                // Create test range and node for feature detection

                var testTextNode = document.createTextNode("test");
                getBody(document).appendChild(testTextNode);
                var range = document.createRange();

                /*--------------------------------------------------------------------------------------------------------*/

                // Test for Firefox 2 bug that prevents moving the start of a Range to a point after its current end and
                // correct for it

                range.setStart(testTextNode, 0);
                range.setEnd(testTextNode, 0);

                try {
                    range.setStart(testTextNode, 1);

                    rangeProto.setStart = function(node, offset) {
                        this.nativeRange.setStart(node, offset);
                        updateRangeProperties(this);
                    };

                    rangeProto.setEnd = function(node, offset) {
                        this.nativeRange.setEnd(node, offset);
                        updateRangeProperties(this);
                    };

                    createBeforeAfterNodeSetter = function(name) {
                        return function(node) {
                            this.nativeRange[name](node);
                            updateRangeProperties(this);
                        };
                    };

                } catch(ex) {

                    rangeProto.setStart = function(node, offset) {
                        try {
                            this.nativeRange.setStart(node, offset);
                        } catch (ex) {
                            this.nativeRange.setEnd(node, offset);
                            this.nativeRange.setStart(node, offset);
                        }
                        updateRangeProperties(this);
                    };

                    rangeProto.setEnd = function(node, offset) {
                        try {
                            this.nativeRange.setEnd(node, offset);
                        } catch (ex) {
                            this.nativeRange.setStart(node, offset);
                            this.nativeRange.setEnd(node, offset);
                        }
                        updateRangeProperties(this);
                    };

                    createBeforeAfterNodeSetter = function(name, oppositeName) {
                        return function(node) {
                            try {
                                this.nativeRange[name](node);
                            } catch (ex) {
                                this.nativeRange[oppositeName](node);
                                this.nativeRange[name](node);
                            }
                            updateRangeProperties(this);
                        };
                    };
                }

                rangeProto.setStartBefore = createBeforeAfterNodeSetter("setStartBefore", "setEndBefore");
                rangeProto.setStartAfter = createBeforeAfterNodeSetter("setStartAfter", "setEndAfter");
                rangeProto.setEndBefore = createBeforeAfterNodeSetter("setEndBefore", "setStartBefore");
                rangeProto.setEndAfter = createBeforeAfterNodeSetter("setEndAfter", "setStartAfter");

                /*--------------------------------------------------------------------------------------------------------*/

                // Always use DOM4-compliant selectNodeContents implementation: it's simpler and less code than testing
                // whether the native implementation can be trusted
                rangeProto.selectNodeContents = function(node) {
                    this.setStartAndEnd(node, 0, dom.getNodeLength(node));
                };

                /*--------------------------------------------------------------------------------------------------------*/

                // Test for and correct WebKit bug that has the behaviour of compareBoundaryPoints round the wrong way for
                // constants START_TO_END and END_TO_START: https://bugs.webkit.org/show_bug.cgi?id=20738

                range.selectNodeContents(testTextNode);
                range.setEnd(testTextNode, 3);

                var range2 = document.createRange();
                range2.selectNodeContents(testTextNode);
                range2.setEnd(testTextNode, 4);
                range2.setStart(testTextNode, 2);

                if (range.compareBoundaryPoints(range.START_TO_END, range2) == -1 &&
                        range.compareBoundaryPoints(range.END_TO_START, range2) == 1) {
                    // This is the wrong way round, so correct for it

                    rangeProto.compareBoundaryPoints = function(type, range) {
                        range = range.nativeRange || range;
                        if (type == range.START_TO_END) {
                            type = range.END_TO_START;
                        } else if (type == range.END_TO_START) {
                            type = range.START_TO_END;
                        }
                        return this.nativeRange.compareBoundaryPoints(type, range);
                    };
                } else {
                    rangeProto.compareBoundaryPoints = function(type, range) {
                        return this.nativeRange.compareBoundaryPoints(type, range.nativeRange || range);
                    };
                }

                /*--------------------------------------------------------------------------------------------------------*/

                // Test for IE deleteContents() and extractContents() bug and correct it. See issue 107.

                var el = document.createElement("div");
                el.innerHTML = "123";
                var textNode = el.firstChild;
                var body = getBody(document);
                body.appendChild(el);

                range.setStart(textNode, 1);
                range.setEnd(textNode, 2);
                range.deleteContents();

                if (textNode.data == "13") {
                    // Behaviour is correct per DOM4 Range so wrap the browser's implementation of deleteContents() and
                    // extractContents()
                    rangeProto.deleteContents = function() {
                        this.nativeRange.deleteContents();
                        updateRangeProperties(this);
                    };

                    rangeProto.extractContents = function() {
                        var frag = this.nativeRange.extractContents();
                        updateRangeProperties(this);
                        return frag;
                    };
                } else {
                }

                body.removeChild(el);
                body = null;

                /*--------------------------------------------------------------------------------------------------------*/

                // Test for existence of createContextualFragment and delegate to it if it exists
                if (util.isHostMethod(range, "createContextualFragment")) {
                    rangeProto.createContextualFragment = function(fragmentStr) {
                        return this.nativeRange.createContextualFragment(fragmentStr);
                    };
                }

                /*--------------------------------------------------------------------------------------------------------*/

                // Clean up
                getBody(document).removeChild(testTextNode);

                rangeProto.getName = function() {
                    return "WrappedRange";
                };

                api.WrappedRange = WrappedRange;

                api.createNativeRange = function(doc) {
                    doc = getContentDocument(doc, module, "createNativeRange");
                    return doc.createRange();
                };
            })();
        }
        
        if (api.features.implementsTextRange) {
            /*
            This is a workaround for a bug where IE returns the wrong container element from the TextRange's parentElement()
            method. For example, in the following (where pipes denote the selection boundaries):

            <ul id="ul"><li id="a">| a </li><li id="b"> b |</li></ul>

            var range = document.selection.createRange();
            alert(range.parentElement().id); // Should alert "ul" but alerts "b"

            This method returns the common ancestor node of the following:
            - the parentElement() of the textRange
            - the parentElement() of the textRange after calling collapse(true)
            - the parentElement() of the textRange after calling collapse(false)
            */
            var getTextRangeContainerElement = function(textRange) {
                var parentEl = textRange.parentElement();
                var range = textRange.duplicate();
                range.collapse(true);
                var startEl = range.parentElement();
                range = textRange.duplicate();
                range.collapse(false);
                var endEl = range.parentElement();
                var startEndContainer = (startEl == endEl) ? startEl : dom.getCommonAncestor(startEl, endEl);

                return startEndContainer == parentEl ? startEndContainer : dom.getCommonAncestor(parentEl, startEndContainer);
            };

            var textRangeIsCollapsed = function(textRange) {
                return textRange.compareEndPoints("StartToEnd", textRange) == 0;
            };

            // Gets the boundary of a TextRange expressed as a node and an offset within that node. This function started
            // out as an improved version of code found in Tim Cameron Ryan's IERange (http://code.google.com/p/ierange/)
            // but has grown, fixing problems with line breaks in preformatted text, adding workaround for IE TextRange
            // bugs, handling for inputs and images, plus optimizations.
            var getTextRangeBoundaryPosition = function(textRange, wholeRangeContainerElement, isStart, isCollapsed, startInfo) {
                var workingRange = textRange.duplicate();
                workingRange.collapse(isStart);
                var containerElement = workingRange.parentElement();

                // Sometimes collapsing a TextRange that's at the start of a text node can move it into the previous node, so
                // check for that
                if (!dom.isOrIsAncestorOf(wholeRangeContainerElement, containerElement)) {
                    containerElement = wholeRangeContainerElement;
                }


                // Deal with nodes that cannot "contain rich HTML markup". In practice, this means form inputs, images and
                // similar. See http://msdn.microsoft.com/en-us/library/aa703950%28VS.85%29.aspx
                if (!containerElement.canHaveHTML) {
                    var pos = new DomPosition(containerElement.parentNode, dom.getNodeIndex(containerElement));
                    return {
                        boundaryPosition: pos,
                        nodeInfo: {
                            nodeIndex: pos.offset,
                            containerElement: pos.node
                        }
                    };
                }

                var workingNode = dom.getDocument(containerElement).createElement("span");

                // Workaround for HTML5 Shiv's insane violation of document.createElement(). See Rangy issue 104 and HTML5
                // Shiv issue 64: https://github.com/aFarkas/html5shiv/issues/64
                if (workingNode.parentNode) {
                    workingNode.parentNode.removeChild(workingNode);
                }

                var comparison, workingComparisonType = isStart ? "StartToStart" : "StartToEnd";
                var previousNode, nextNode, boundaryPosition, boundaryNode;
                var start = (startInfo && startInfo.containerElement == containerElement) ? startInfo.nodeIndex : 0;
                var childNodeCount = containerElement.childNodes.length;
                var end = childNodeCount;

                // Check end first. Code within the loop assumes that the endth child node of the container is definitely
                // after the range boundary.
                var nodeIndex = end;

                while (true) {
                    if (nodeIndex == childNodeCount) {
                        containerElement.appendChild(workingNode);
                    } else {
                        containerElement.insertBefore(workingNode, containerElement.childNodes[nodeIndex]);
                    }
                    workingRange.moveToElementText(workingNode);
                    comparison = workingRange.compareEndPoints(workingComparisonType, textRange);
                    if (comparison == 0 || start == end) {
                        break;
                    } else if (comparison == -1) {
                        if (end == start + 1) {
                            // We know the endth child node is after the range boundary, so we must be done.
                            break;
                        } else {
                            start = nodeIndex;
                        }
                    } else {
                        end = (end == start + 1) ? start : nodeIndex;
                    }
                    nodeIndex = Math.floor((start + end) / 2);
                    containerElement.removeChild(workingNode);
                }


                // We've now reached or gone past the boundary of the text range we're interested in
                // so have identified the node we want
                boundaryNode = workingNode.nextSibling;

                if (comparison == -1 && boundaryNode && isCharacterDataNode(boundaryNode)) {
                    // This is a character data node (text, comment, cdata). The working range is collapsed at the start of
                    // the node containing the text range's boundary, so we move the end of the working range to the
                    // boundary point and measure the length of its text to get the boundary's offset within the node.
                    workingRange.setEndPoint(isStart ? "EndToStart" : "EndToEnd", textRange);

                    var offset;

                    if (/[\r\n]/.test(boundaryNode.data)) {
                        /*
                        For the particular case of a boundary within a text node containing rendered line breaks (within a
                        <pre> element, for example), we need a slightly complicated approach to get the boundary's offset in
                        IE. The facts:
                        
                        - Each line break is represented as \r in the text node's data/nodeValue properties
                        - Each line break is represented as \r\n in the TextRange's 'text' property
                        - The 'text' property of the TextRange does not contain trailing line breaks
                        
                        To get round the problem presented by the final fact above, we can use the fact that TextRange's
                        moveStart() and moveEnd() methods return the actual number of characters moved, which is not
                        necessarily the same as the number of characters it was instructed to move. The simplest approach is
                        to use this to store the characters moved when moving both the start and end of the range to the
                        start of the document body and subtracting the start offset from the end offset (the
                        "move-negative-gazillion" method). However, this is extremely slow when the document is large and
                        the range is near the end of it. Clearly doing the mirror image (i.e. moving the range boundaries to
                        the end of the document) has the same problem.
                        
                        Another approach that works is to use moveStart() to move the start boundary of the range up to the
                        end boundary one character at a time and incrementing a counter with the value returned by the
                        moveStart() call. However, the check for whether the start boundary has reached the end boundary is
                        expensive, so this method is slow (although unlike "move-negative-gazillion" is largely unaffected
                        by the location of the range within the document).
                        
                        The approach used below is a hybrid of the two methods above. It uses the fact that a string
                        containing the TextRange's 'text' property with each \r\n converted to a single \r character cannot
                        be longer than the text of the TextRange, so the start of the range is moved that length initially
                        and then a character at a time to make up for any trailing line breaks not contained in the 'text'
                        property. This has good performance in most situations compared to the previous two methods.
                        */
                        var tempRange = workingRange.duplicate();
                        var rangeLength = tempRange.text.replace(/\r\n/g, "\r").length;

                        offset = tempRange.moveStart("character", rangeLength);
                        while ( (comparison = tempRange.compareEndPoints("StartToEnd", tempRange)) == -1) {
                            offset++;
                            tempRange.moveStart("character", 1);
                        }
                    } else {
                        offset = workingRange.text.length;
                    }
                    boundaryPosition = new DomPosition(boundaryNode, offset);
                } else {

                    // If the boundary immediately follows a character data node and this is the end boundary, we should favour
                    // a position within that, and likewise for a start boundary preceding a character data node
                    previousNode = (isCollapsed || !isStart) && workingNode.previousSibling;
                    nextNode = (isCollapsed || isStart) && workingNode.nextSibling;
                    if (nextNode && isCharacterDataNode(nextNode)) {
                        boundaryPosition = new DomPosition(nextNode, 0);
                    } else if (previousNode && isCharacterDataNode(previousNode)) {
                        boundaryPosition = new DomPosition(previousNode, previousNode.data.length);
                    } else {
                        boundaryPosition = new DomPosition(containerElement, dom.getNodeIndex(workingNode));
                    }
                }

                // Clean up
                workingNode.parentNode.removeChild(workingNode);

                return {
                    boundaryPosition: boundaryPosition,
                    nodeInfo: {
                        nodeIndex: nodeIndex,
                        containerElement: containerElement
                    }
                };
            };

            // Returns a TextRange representing the boundary of a TextRange expressed as a node and an offset within that
            // node. This function started out as an optimized version of code found in Tim Cameron Ryan's IERange
            // (http://code.google.com/p/ierange/)
            var createBoundaryTextRange = function(boundaryPosition, isStart) {
                var boundaryNode, boundaryParent, boundaryOffset = boundaryPosition.offset;
                var doc = dom.getDocument(boundaryPosition.node);
                var workingNode, childNodes, workingRange = getBody(doc).createTextRange();
                var nodeIsDataNode = isCharacterDataNode(boundaryPosition.node);

                if (nodeIsDataNode) {
                    boundaryNode = boundaryPosition.node;
                    boundaryParent = boundaryNode.parentNode;
                } else {
                    childNodes = boundaryPosition.node.childNodes;
                    boundaryNode = (boundaryOffset < childNodes.length) ? childNodes[boundaryOffset] : null;
                    boundaryParent = boundaryPosition.node;
                }

                // Position the range immediately before the node containing the boundary
                workingNode = doc.createElement("span");

                // Making the working element non-empty element persuades IE to consider the TextRange boundary to be within
                // the element rather than immediately before or after it
                workingNode.innerHTML = "&#feff;";

                // insertBefore is supposed to work like appendChild if the second parameter is null. However, a bug report
                // for IERange suggests that it can crash the browser: http://code.google.com/p/ierange/issues/detail?id=12
                if (boundaryNode) {
                    boundaryParent.insertBefore(workingNode, boundaryNode);
                } else {
                    boundaryParent.appendChild(workingNode);
                }

                workingRange.moveToElementText(workingNode);
                workingRange.collapse(!isStart);

                // Clean up
                boundaryParent.removeChild(workingNode);

                // Move the working range to the text offset, if required
                if (nodeIsDataNode) {
                    workingRange[isStart ? "moveStart" : "moveEnd"]("character", boundaryOffset);
                }

                return workingRange;
            };

            /*------------------------------------------------------------------------------------------------------------*/

            // This is a wrapper around a TextRange, providing full DOM Range functionality using rangy's DomRange as a
            // prototype

            WrappedTextRange = function(textRange) {
                this.textRange = textRange;
                this.refresh();
            };

            WrappedTextRange.prototype = new DomRange(document);

            WrappedTextRange.prototype.refresh = function() {
                var start, end, startBoundary;

                // TextRange's parentElement() method cannot be trusted. getTextRangeContainerElement() works around that.
                var rangeContainerElement = getTextRangeContainerElement(this.textRange);

                if (textRangeIsCollapsed(this.textRange)) {
                    end = start = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, true,
                        true).boundaryPosition;
                } else {
                    startBoundary = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, true, false);
                    start = startBoundary.boundaryPosition;

                    // An optimization used here is that if the start and end boundaries have the same parent element, the
                    // search scope for the end boundary can be limited to exclude the portion of the element that precedes
                    // the start boundary
                    end = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, false, false,
                        startBoundary.nodeInfo).boundaryPosition;
                }

                this.setStart(start.node, start.offset);
                this.setEnd(end.node, end.offset);
            };

            WrappedTextRange.prototype.getName = function() {
                return "WrappedTextRange";
            };

            DomRange.copyComparisonConstants(WrappedTextRange);

            var rangeToTextRange = function(range) {
                if (range.collapsed) {
                    return createBoundaryTextRange(new DomPosition(range.startContainer, range.startOffset), true);
                } else {
                    var startRange = createBoundaryTextRange(new DomPosition(range.startContainer, range.startOffset), true);
                    var endRange = createBoundaryTextRange(new DomPosition(range.endContainer, range.endOffset), false);
                    var textRange = getBody( DomRange.getRangeDocument(range) ).createTextRange();
                    textRange.setEndPoint("StartToStart", startRange);
                    textRange.setEndPoint("EndToEnd", endRange);
                    return textRange;
                }
            };

            WrappedTextRange.rangeToTextRange = rangeToTextRange;

            WrappedTextRange.prototype.toTextRange = function() {
                return rangeToTextRange(this);
            };

            api.WrappedTextRange = WrappedTextRange;

            // IE 9 and above have both implementations and Rangy makes both available. The next few lines sets which
            // implementation to use by default.
            if (!api.features.implementsDomRange || api.config.preferTextRange) {
                // Add WrappedTextRange as the Range property of the global object to allow expression like Range.END_TO_END to work
                var globalObj = (function(f) { return f("return this;")(); })(Function);
                if (typeof globalObj.Range == "undefined") {
                    globalObj.Range = WrappedTextRange;
                }

                api.createNativeRange = function(doc) {
                    doc = getContentDocument(doc, module, "createNativeRange");
                    return getBody(doc).createTextRange();
                };

                api.WrappedRange = WrappedTextRange;
            }
        }

        api.createRange = function(doc) {
            doc = getContentDocument(doc, module, "createRange");
            return new api.WrappedRange(api.createNativeRange(doc));
        };

        api.createRangyRange = function(doc) {
            doc = getContentDocument(doc, module, "createRangyRange");
            return new DomRange(doc);
        };

        api.createIframeRange = function(iframeEl) {
            module.deprecationNotice("createIframeRange()", "createRange(iframeEl)");
            return api.createRange(iframeEl);
        };

        api.createIframeRangyRange = function(iframeEl) {
            module.deprecationNotice("createIframeRangyRange()", "createRangyRange(iframeEl)");
            return api.createRangyRange(iframeEl);
        };

        api.addShimListener(function(win) {
            var doc = win.document;
            if (typeof doc.createRange == "undefined") {
                doc.createRange = function() {
                    return api.createRange(doc);
                };
            }
            doc = win = null;
        });
    });

    /*----------------------------------------------------------------------------------------------------------------*/

    // This module creates a selection object wrapper that conforms as closely as possible to the Selection specification
    // in the HTML Editing spec (http://dvcs.w3.org/hg/editing/raw-file/tip/editing.html#selections)
    api.createCoreModule("WrappedSelection", ["DomRange", "WrappedRange"], function(api, module) {
        api.config.checkSelectionRanges = true;

        var BOOLEAN = "boolean";
        var NUMBER = "number";
        var dom = api.dom;
        var util = api.util;
        var isHostMethod = util.isHostMethod;
        var DomRange = api.DomRange;
        var WrappedRange = api.WrappedRange;
        var DOMException = api.DOMException;
        var DomPosition = dom.DomPosition;
        var getNativeSelection;
        var selectionIsCollapsed;
        var features = api.features;
        var CONTROL = "Control";
        var getDocument = dom.getDocument;
        var getBody = dom.getBody;
        var rangesEqual = DomRange.rangesEqual;


        // Utility function to support direction parameters in the API that may be a string ("backward" or "forward") or a
        // Boolean (true for backwards).
        function isDirectionBackward(dir) {
            return (typeof dir == "string") ? /^backward(s)?$/i.test(dir) : !!dir;
        }

        function getWindow(win, methodName) {
            if (!win) {
                return window;
            } else if (dom.isWindow(win)) {
                return win;
            } else if (win instanceof WrappedSelection) {
                return win.win;
            } else {
                var doc = dom.getContentDocument(win, module, methodName);
                return dom.getWindow(doc);
            }
        }

        function getWinSelection(winParam) {
            return getWindow(winParam, "getWinSelection").getSelection();
        }

        function getDocSelection(winParam) {
            return getWindow(winParam, "getDocSelection").document.selection;
        }
        
        function winSelectionIsBackward(sel) {
            var backward = false;
            if (sel.anchorNode) {
                backward = (dom.comparePoints(sel.anchorNode, sel.anchorOffset, sel.focusNode, sel.focusOffset) == 1);
            }
            return backward;
        }

        // Test for the Range/TextRange and Selection features required
        // Test for ability to retrieve selection
        var implementsWinGetSelection = isHostMethod(window, "getSelection"),
            implementsDocSelection = util.isHostObject(document, "selection");

        features.implementsWinGetSelection = implementsWinGetSelection;
        features.implementsDocSelection = implementsDocSelection;

        var useDocumentSelection = implementsDocSelection && (!implementsWinGetSelection || api.config.preferTextRange);

        if (useDocumentSelection) {
            getNativeSelection = getDocSelection;
            api.isSelectionValid = function(winParam) {
                var doc = getWindow(winParam, "isSelectionValid").document, nativeSel = doc.selection;

                // Check whether the selection TextRange is actually contained within the correct document
                return (nativeSel.type != "None" || getDocument(nativeSel.createRange().parentElement()) == doc);
            };
        } else if (implementsWinGetSelection) {
            getNativeSelection = getWinSelection;
            api.isSelectionValid = function() {
                return true;
            };
        } else {
            module.fail("Neither document.selection or window.getSelection() detected.");
        }

        api.getNativeSelection = getNativeSelection;

        var testSelection = getNativeSelection();
        var testRange = api.createNativeRange(document);
        var body = getBody(document);

        // Obtaining a range from a selection
        var selectionHasAnchorAndFocus = util.areHostProperties(testSelection,
            ["anchorNode", "focusNode", "anchorOffset", "focusOffset"]);

        features.selectionHasAnchorAndFocus = selectionHasAnchorAndFocus;

        // Test for existence of native selection extend() method
        var selectionHasExtend = isHostMethod(testSelection, "extend");
        features.selectionHasExtend = selectionHasExtend;
        
        // Test if rangeCount exists
        var selectionHasRangeCount = (typeof testSelection.rangeCount == NUMBER);
        features.selectionHasRangeCount = selectionHasRangeCount;

        var selectionSupportsMultipleRanges = false;
        var collapsedNonEditableSelectionsSupported = true;

        var addRangeBackwardToNative = selectionHasExtend ?
            function(nativeSelection, range) {
                var doc = DomRange.getRangeDocument(range);
                var endRange = api.createRange(doc);
                endRange.collapseToPoint(range.endContainer, range.endOffset);
                nativeSelection.addRange(getNativeRange(endRange));
                nativeSelection.extend(range.startContainer, range.startOffset);
            } : null;

        if (util.areHostMethods(testSelection, ["addRange", "getRangeAt", "removeAllRanges"]) &&
                typeof testSelection.rangeCount == NUMBER && features.implementsDomRange) {

            (function() {
                // Previously an iframe was used but this caused problems in some circumstances in IE, so tests are
                // performed on the current document's selection. See issue 109.

                // Note also that if a selection previously existed, it is wiped by these tests. This should usually be fine
                // because initialization usually happens when the document loads, but could be a problem for a script that
                // loads and initializes Rangy later. If anyone complains, code could be added to save and restore the
                // selection.
                var sel = window.getSelection();
                if (sel) {
                    // Store the current selection
                    var originalSelectionRangeCount = sel.rangeCount;
                    var selectionHasMultipleRanges = (originalSelectionRangeCount > 1);
                    var originalSelectionRanges = [];
                    var originalSelectionBackward = winSelectionIsBackward(sel); 
                    for (var i = 0; i < originalSelectionRangeCount; ++i) {
                        originalSelectionRanges[i] = sel.getRangeAt(i);
                    }
                    
                    // Create some test elements
                    var body = getBody(document);
                    var testEl = body.appendChild( document.createElement("div") );
                    testEl.contentEditable = "false";
                    var textNode = testEl.appendChild( document.createTextNode("\u00a0\u00a0\u00a0") );

                    // Test whether the native selection will allow a collapsed selection within a non-editable element
                    var r1 = document.createRange();

                    r1.setStart(textNode, 1);
                    r1.collapse(true);
                    sel.addRange(r1);
                    collapsedNonEditableSelectionsSupported = (sel.rangeCount == 1);
                    sel.removeAllRanges();

                    // Test whether the native selection is capable of supporting multiple ranges.
                    if (!selectionHasMultipleRanges) {
                        // Doing the original feature test here in Chrome 36 (and presumably later versions) prints a
                        // console error of "Discontiguous selection is not supported." that cannot be suppressed. There's
                        // nothing we can do about this while retaining the feature test so we have to resort to a browser
                        // sniff. I'm not happy about it. See
                        // https://code.google.com/p/chromium/issues/detail?id=399791
                        var chromeMatch = window.navigator.appVersion.match(/Chrome\/(.*?) /);
                        if (chromeMatch && parseInt(chromeMatch[1]) >= 36) {
                            selectionSupportsMultipleRanges = false;
                        } else {
                            var r2 = r1.cloneRange();
                            r1.setStart(textNode, 0);
                            r2.setEnd(textNode, 3);
                            r2.setStart(textNode, 2);
                            sel.addRange(r1);
                            sel.addRange(r2);
                            selectionSupportsMultipleRanges = (sel.rangeCount == 2);
                        }
                    }

                    // Clean up
                    body.removeChild(testEl);
                    sel.removeAllRanges();

                    for (i = 0; i < originalSelectionRangeCount; ++i) {
                        if (i == 0 && originalSelectionBackward) {
                            if (addRangeBackwardToNative) {
                                addRangeBackwardToNative(sel, originalSelectionRanges[i]);
                            } else {
                                api.warn("Rangy initialization: original selection was backwards but selection has been restored forwards because the browser does not support Selection.extend");
                                sel.addRange(originalSelectionRanges[i]);
                            }
                        } else {
                            sel.addRange(originalSelectionRanges[i]);
                        }
                    }
                }
            })();
        }

        features.selectionSupportsMultipleRanges = selectionSupportsMultipleRanges;
        features.collapsedNonEditableSelectionsSupported = collapsedNonEditableSelectionsSupported;

        // ControlRanges
        var implementsControlRange = false, testControlRange;

        if (body && isHostMethod(body, "createControlRange")) {
            testControlRange = body.createControlRange();
            if (util.areHostProperties(testControlRange, ["item", "add"])) {
                implementsControlRange = true;
            }
        }
        features.implementsControlRange = implementsControlRange;

        // Selection collapsedness
        if (selectionHasAnchorAndFocus) {
            selectionIsCollapsed = function(sel) {
                return sel.anchorNode === sel.focusNode && sel.anchorOffset === sel.focusOffset;
            };
        } else {
            selectionIsCollapsed = function(sel) {
                return sel.rangeCount ? sel.getRangeAt(sel.rangeCount - 1).collapsed : false;
            };
        }

        function updateAnchorAndFocusFromRange(sel, range, backward) {
            var anchorPrefix = backward ? "end" : "start", focusPrefix = backward ? "start" : "end";
            sel.anchorNode = range[anchorPrefix + "Container"];
            sel.anchorOffset = range[anchorPrefix + "Offset"];
            sel.focusNode = range[focusPrefix + "Container"];
            sel.focusOffset = range[focusPrefix + "Offset"];
        }

        function updateAnchorAndFocusFromNativeSelection(sel) {
            var nativeSel = sel.nativeSelection;
            sel.anchorNode = nativeSel.anchorNode;
            sel.anchorOffset = nativeSel.anchorOffset;
            sel.focusNode = nativeSel.focusNode;
            sel.focusOffset = nativeSel.focusOffset;
        }

        function updateEmptySelection(sel) {
            sel.anchorNode = sel.focusNode = null;
            sel.anchorOffset = sel.focusOffset = 0;
            sel.rangeCount = 0;
            sel.isCollapsed = true;
            sel._ranges.length = 0;
        }

        function getNativeRange(range) {
            var nativeRange;
            if (range instanceof DomRange) {
                nativeRange = api.createNativeRange(range.getDocument());
                nativeRange.setEnd(range.endContainer, range.endOffset);
                nativeRange.setStart(range.startContainer, range.startOffset);
            } else if (range instanceof WrappedRange) {
                nativeRange = range.nativeRange;
            } else if (features.implementsDomRange && (range instanceof dom.getWindow(range.startContainer).Range)) {
                nativeRange = range;
            }
            return nativeRange;
        }

        function rangeContainsSingleElement(rangeNodes) {
            if (!rangeNodes.length || rangeNodes[0].nodeType != 1) {
                return false;
            }
            for (var i = 1, len = rangeNodes.length; i < len; ++i) {
                if (!dom.isAncestorOf(rangeNodes[0], rangeNodes[i])) {
                    return false;
                }
            }
            return true;
        }

        function getSingleElementFromRange(range) {
            var nodes = range.getNodes();
            if (!rangeContainsSingleElement(nodes)) {
                throw module.createError("getSingleElementFromRange: range " + range.inspect() + " did not consist of a single element");
            }
            return nodes[0];
        }

        // Simple, quick test which only needs to distinguish between a TextRange and a ControlRange
        function isTextRange(range) {
            return !!range && typeof range.text != "undefined";
        }

        function updateFromTextRange(sel, range) {
            // Create a Range from the selected TextRange
            var wrappedRange = new WrappedRange(range);
            sel._ranges = [wrappedRange];

            updateAnchorAndFocusFromRange(sel, wrappedRange, false);
            sel.rangeCount = 1;
            sel.isCollapsed = wrappedRange.collapsed;
        }

        function updateControlSelection(sel) {
            // Update the wrapped selection based on what's now in the native selection
            sel._ranges.length = 0;
            if (sel.docSelection.type == "None") {
                updateEmptySelection(sel);
            } else {
                var controlRange = sel.docSelection.createRange();
                if (isTextRange(controlRange)) {
                    // This case (where the selection type is "Control" and calling createRange() on the selection returns
                    // a TextRange) can happen in IE 9. It happens, for example, when all elements in the selected
                    // ControlRange have been removed from the ControlRange and removed from the document.
                    updateFromTextRange(sel, controlRange);
                } else {
                    sel.rangeCount = controlRange.length;
                    var range, doc = getDocument(controlRange.item(0));
                    for (var i = 0; i < sel.rangeCount; ++i) {
                        range = api.createRange(doc);
                        range.selectNode(controlRange.item(i));
                        sel._ranges.push(range);
                    }
                    sel.isCollapsed = sel.rangeCount == 1 && sel._ranges[0].collapsed;
                    updateAnchorAndFocusFromRange(sel, sel._ranges[sel.rangeCount - 1], false);
                }
            }
        }

        function addRangeToControlSelection(sel, range) {
            var controlRange = sel.docSelection.createRange();
            var rangeElement = getSingleElementFromRange(range);

            // Create a new ControlRange containing all the elements in the selected ControlRange plus the element
            // contained by the supplied range
            var doc = getDocument(controlRange.item(0));
            var newControlRange = getBody(doc).createControlRange();
            for (var i = 0, len = controlRange.length; i < len; ++i) {
                newControlRange.add(controlRange.item(i));
            }
            try {
                newControlRange.add(rangeElement);
            } catch (ex) {
                throw module.createError("addRange(): Element within the specified Range could not be added to control selection (does it have layout?)");
            }
            newControlRange.select();

            // Update the wrapped selection based on what's now in the native selection
            updateControlSelection(sel);
        }

        var getSelectionRangeAt;

        if (isHostMethod(testSelection, "getRangeAt")) {
            // try/catch is present because getRangeAt() must have thrown an error in some browser and some situation.
            // Unfortunately, I didn't write a comment about the specifics and am now scared to take it out. Let that be a
            // lesson to us all, especially me.
            getSelectionRangeAt = function(sel, index) {
                try {
                    return sel.getRangeAt(index);
                } catch (ex) {
                    return null;
                }
            };
        } else if (selectionHasAnchorAndFocus) {
            getSelectionRangeAt = function(sel) {
                var doc = getDocument(sel.anchorNode);
                var range = api.createRange(doc);
                range.setStartAndEnd(sel.anchorNode, sel.anchorOffset, sel.focusNode, sel.focusOffset);

                // Handle the case when the selection was selected backwards (from the end to the start in the
                // document)
                if (range.collapsed !== this.isCollapsed) {
                    range.setStartAndEnd(sel.focusNode, sel.focusOffset, sel.anchorNode, sel.anchorOffset);
                }

                return range;
            };
        }

        function WrappedSelection(selection, docSelection, win) {
            this.nativeSelection = selection;
            this.docSelection = docSelection;
            this._ranges = [];
            this.win = win;
            this.refresh();
        }

        WrappedSelection.prototype = api.selectionPrototype;

        function deleteProperties(sel) {
            sel.win = sel.anchorNode = sel.focusNode = sel._ranges = null;
            sel.rangeCount = sel.anchorOffset = sel.focusOffset = 0;
            sel.detached = true;
        }

        var cachedRangySelections = [];

        function actOnCachedSelection(win, action) {
            var i = cachedRangySelections.length, cached, sel;
            while (i--) {
                cached = cachedRangySelections[i];
                sel = cached.selection;
                if (action == "deleteAll") {
                    deleteProperties(sel);
                } else if (cached.win == win) {
                    if (action == "delete") {
                        cachedRangySelections.splice(i, 1);
                        return true;
                    } else {
                        return sel;
                    }
                }
            }
            if (action == "deleteAll") {
                cachedRangySelections.length = 0;
            }
            return null;
        }

        var getSelection = function(win) {
            // Check if the parameter is a Rangy Selection object
            if (win && win instanceof WrappedSelection) {
                win.refresh();
                return win;
            }

            win = getWindow(win, "getNativeSelection");

            var sel = actOnCachedSelection(win);
            var nativeSel = getNativeSelection(win), docSel = implementsDocSelection ? getDocSelection(win) : null;
            if (sel) {
                sel.nativeSelection = nativeSel;
                sel.docSelection = docSel;
                sel.refresh();
            } else {
                sel = new WrappedSelection(nativeSel, docSel, win);
                cachedRangySelections.push( { win: win, selection: sel } );
            }
            return sel;
        };

        api.getSelection = getSelection;

        api.getIframeSelection = function(iframeEl) {
            module.deprecationNotice("getIframeSelection()", "getSelection(iframeEl)");
            return api.getSelection(dom.getIframeWindow(iframeEl));
        };

        var selProto = WrappedSelection.prototype;

        function createControlSelection(sel, ranges) {
            // Ensure that the selection becomes of type "Control"
            var doc = getDocument(ranges[0].startContainer);
            var controlRange = getBody(doc).createControlRange();
            for (var i = 0, el, len = ranges.length; i < len; ++i) {
                el = getSingleElementFromRange(ranges[i]);
                try {
                    controlRange.add(el);
                } catch (ex) {
                    throw module.createError("setRanges(): Element within one of the specified Ranges could not be added to control selection (does it have layout?)");
                }
            }
            controlRange.select();

            // Update the wrapped selection based on what's now in the native selection
            updateControlSelection(sel);
        }

        // Selecting a range
        if (!useDocumentSelection && selectionHasAnchorAndFocus && util.areHostMethods(testSelection, ["removeAllRanges", "addRange"])) {
            selProto.removeAllRanges = function() {
                this.nativeSelection.removeAllRanges();
                updateEmptySelection(this);
            };

            var addRangeBackward = function(sel, range) {
                addRangeBackwardToNative(sel.nativeSelection, range);
                sel.refresh();
            };

            if (selectionHasRangeCount) {
                selProto.addRange = function(range, direction) {
                    if (implementsControlRange && implementsDocSelection && this.docSelection.type == CONTROL) {
                        addRangeToControlSelection(this, range);
                    } else {
                        if (isDirectionBackward(direction) && selectionHasExtend) {
                            addRangeBackward(this, range);
                        } else {
                            var previousRangeCount;
                            if (selectionSupportsMultipleRanges) {
                                previousRangeCount = this.rangeCount;
                            } else {
                                this.removeAllRanges();
                                previousRangeCount = 0;
                            }
                            // Clone the native range so that changing the selected range does not affect the selection.
                            // This is contrary to the spec but is the only way to achieve consistency between browsers. See
                            // issue 80.
                            var clonedNativeRange = getNativeRange(range).cloneRange();
                            try {
                                this.nativeSelection.addRange(clonedNativeRange);
                            } catch (ex) {
                            }

                            // Check whether adding the range was successful
                            this.rangeCount = this.nativeSelection.rangeCount;

                            if (this.rangeCount == previousRangeCount + 1) {
                                // The range was added successfully

                                // Check whether the range that we added to the selection is reflected in the last range extracted from
                                // the selection
                                if (api.config.checkSelectionRanges) {
                                    var nativeRange = getSelectionRangeAt(this.nativeSelection, this.rangeCount - 1);
                                    if (nativeRange && !rangesEqual(nativeRange, range)) {
                                        // Happens in WebKit with, for example, a selection placed at the start of a text node
                                        range = new WrappedRange(nativeRange);
                                    }
                                }
                                this._ranges[this.rangeCount - 1] = range;
                                updateAnchorAndFocusFromRange(this, range, selectionIsBackward(this.nativeSelection));
                                this.isCollapsed = selectionIsCollapsed(this);
                            } else {
                                // The range was not added successfully. The simplest thing is to refresh
                                this.refresh();
                            }
                        }
                    }
                };
            } else {
                selProto.addRange = function(range, direction) {
                    if (isDirectionBackward(direction) && selectionHasExtend) {
                        addRangeBackward(this, range);
                    } else {
                        this.nativeSelection.addRange(getNativeRange(range));
                        this.refresh();
                    }
                };
            }

            selProto.setRanges = function(ranges) {
                if (implementsControlRange && implementsDocSelection && ranges.length > 1) {
                    createControlSelection(this, ranges);
                } else {
                    this.removeAllRanges();
                    for (var i = 0, len = ranges.length; i < len; ++i) {
                        this.addRange(ranges[i]);
                    }
                }
            };
        } else if (isHostMethod(testSelection, "empty") && isHostMethod(testRange, "select") &&
                   implementsControlRange && useDocumentSelection) {

            selProto.removeAllRanges = function() {
                // Added try/catch as fix for issue #21
                try {
                    this.docSelection.empty();

                    // Check for empty() not working (issue #24)
                    if (this.docSelection.type != "None") {
                        // Work around failure to empty a control selection by instead selecting a TextRange and then
                        // calling empty()
                        var doc;
                        if (this.anchorNode) {
                            doc = getDocument(this.anchorNode);
                        } else if (this.docSelection.type == CONTROL) {
                            var controlRange = this.docSelection.createRange();
                            if (controlRange.length) {
                                doc = getDocument( controlRange.item(0) );
                            }
                        }
                        if (doc) {
                            var textRange = getBody(doc).createTextRange();
                            textRange.select();
                            this.docSelection.empty();
                        }
                    }
                } catch(ex) {}
                updateEmptySelection(this);
            };

            selProto.addRange = function(range) {
                if (this.docSelection.type == CONTROL) {
                    addRangeToControlSelection(this, range);
                } else {
                    api.WrappedTextRange.rangeToTextRange(range).select();
                    this._ranges[0] = range;
                    this.rangeCount = 1;
                    this.isCollapsed = this._ranges[0].collapsed;
                    updateAnchorAndFocusFromRange(this, range, false);
                }
            };

            selProto.setRanges = function(ranges) {
                this.removeAllRanges();
                var rangeCount = ranges.length;
                if (rangeCount > 1) {
                    createControlSelection(this, ranges);
                } else if (rangeCount) {
                    this.addRange(ranges[0]);
                }
            };
        } else {
            module.fail("No means of selecting a Range or TextRange was found");
            return false;
        }

        selProto.getRangeAt = function(index) {
            if (index < 0 || index >= this.rangeCount) {
                throw new DOMException("INDEX_SIZE_ERR");
            } else {
                // Clone the range to preserve selection-range independence. See issue 80.
                return this._ranges[index].cloneRange();
            }
        };

        var refreshSelection;

        if (useDocumentSelection) {
            refreshSelection = function(sel) {
                var range;
                if (api.isSelectionValid(sel.win)) {
                    range = sel.docSelection.createRange();
                } else {
                    range = getBody(sel.win.document).createTextRange();
                    range.collapse(true);
                }

                if (sel.docSelection.type == CONTROL) {
                    updateControlSelection(sel);
                } else if (isTextRange(range)) {
                    updateFromTextRange(sel, range);
                } else {
                    updateEmptySelection(sel);
                }
            };
        } else if (isHostMethod(testSelection, "getRangeAt") && typeof testSelection.rangeCount == NUMBER) {
            refreshSelection = function(sel) {
                if (implementsControlRange && implementsDocSelection && sel.docSelection.type == CONTROL) {
                    updateControlSelection(sel);
                } else {
                    sel._ranges.length = sel.rangeCount = sel.nativeSelection.rangeCount;
                    if (sel.rangeCount) {
                        for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                            sel._ranges[i] = new api.WrappedRange(sel.nativeSelection.getRangeAt(i));
                        }
                        updateAnchorAndFocusFromRange(sel, sel._ranges[sel.rangeCount - 1], selectionIsBackward(sel.nativeSelection));
                        sel.isCollapsed = selectionIsCollapsed(sel);
                    } else {
                        updateEmptySelection(sel);
                    }
                }
            };
        } else if (selectionHasAnchorAndFocus && typeof testSelection.isCollapsed == BOOLEAN && typeof testRange.collapsed == BOOLEAN && features.implementsDomRange) {
            refreshSelection = function(sel) {
                var range, nativeSel = sel.nativeSelection;
                if (nativeSel.anchorNode) {
                    range = getSelectionRangeAt(nativeSel, 0);
                    sel._ranges = [range];
                    sel.rangeCount = 1;
                    updateAnchorAndFocusFromNativeSelection(sel);
                    sel.isCollapsed = selectionIsCollapsed(sel);
                } else {
                    updateEmptySelection(sel);
                }
            };
        } else {
            module.fail("No means of obtaining a Range or TextRange from the user's selection was found");
            return false;
        }

        selProto.refresh = function(checkForChanges) {
            var oldRanges = checkForChanges ? this._ranges.slice(0) : null;
            var oldAnchorNode = this.anchorNode, oldAnchorOffset = this.anchorOffset;

            refreshSelection(this);
            if (checkForChanges) {
                // Check the range count first
                var i = oldRanges.length;
                if (i != this._ranges.length) {
                    return true;
                }

                // Now check the direction. Checking the anchor position is the same is enough since we're checking all the
                // ranges after this
                if (this.anchorNode != oldAnchorNode || this.anchorOffset != oldAnchorOffset) {
                    return true;
                }

                // Finally, compare each range in turn
                while (i--) {
                    if (!rangesEqual(oldRanges[i], this._ranges[i])) {
                        return true;
                    }
                }
                return false;
            }
        };

        // Removal of a single range
        var removeRangeManually = function(sel, range) {
            var ranges = sel.getAllRanges();
            sel.removeAllRanges();
            for (var i = 0, len = ranges.length; i < len; ++i) {
                if (!rangesEqual(range, ranges[i])) {
                    sel.addRange(ranges[i]);
                }
            }
            if (!sel.rangeCount) {
                updateEmptySelection(sel);
            }
        };

        if (implementsControlRange && implementsDocSelection) {
            selProto.removeRange = function(range) {
                if (this.docSelection.type == CONTROL) {
                    var controlRange = this.docSelection.createRange();
                    var rangeElement = getSingleElementFromRange(range);

                    // Create a new ControlRange containing all the elements in the selected ControlRange minus the
                    // element contained by the supplied range
                    var doc = getDocument(controlRange.item(0));
                    var newControlRange = getBody(doc).createControlRange();
                    var el, removed = false;
                    for (var i = 0, len = controlRange.length; i < len; ++i) {
                        el = controlRange.item(i);
                        if (el !== rangeElement || removed) {
                            newControlRange.add(controlRange.item(i));
                        } else {
                            removed = true;
                        }
                    }
                    newControlRange.select();

                    // Update the wrapped selection based on what's now in the native selection
                    updateControlSelection(this);
                } else {
                    removeRangeManually(this, range);
                }
            };
        } else {
            selProto.removeRange = function(range) {
                removeRangeManually(this, range);
            };
        }

        // Detecting if a selection is backward
        var selectionIsBackward;
        if (!useDocumentSelection && selectionHasAnchorAndFocus && features.implementsDomRange) {
            selectionIsBackward = winSelectionIsBackward;

            selProto.isBackward = function() {
                return selectionIsBackward(this);
            };
        } else {
            selectionIsBackward = selProto.isBackward = function() {
                return false;
            };
        }

        // Create an alias for backwards compatibility. From 1.3, everything is "backward" rather than "backwards"
        selProto.isBackwards = selProto.isBackward;

        // Selection stringifier
        // This is conformant to the old HTML5 selections draft spec but differs from WebKit and Mozilla's implementation.
        // The current spec does not yet define this method.
        selProto.toString = function() {
            var rangeTexts = [];
            for (var i = 0, len = this.rangeCount; i < len; ++i) {
                rangeTexts[i] = "" + this._ranges[i];
            }
            return rangeTexts.join("");
        };

        function assertNodeInSameDocument(sel, node) {
            if (sel.win.document != getDocument(node)) {
                throw new DOMException("WRONG_DOCUMENT_ERR");
            }
        }

        // No current browser conforms fully to the spec for this method, so Rangy's own method is always used
        selProto.collapse = function(node, offset) {
            assertNodeInSameDocument(this, node);
            var range = api.createRange(node);
            range.collapseToPoint(node, offset);
            this.setSingleRange(range);
            this.isCollapsed = true;
        };

        selProto.collapseToStart = function() {
            if (this.rangeCount) {
                var range = this._ranges[0];
                this.collapse(range.startContainer, range.startOffset);
            } else {
                throw new DOMException("INVALID_STATE_ERR");
            }
        };

        selProto.collapseToEnd = function() {
            if (this.rangeCount) {
                var range = this._ranges[this.rangeCount - 1];
                this.collapse(range.endContainer, range.endOffset);
            } else {
                throw new DOMException("INVALID_STATE_ERR");
            }
        };

        // The spec is very specific on how selectAllChildren should be implemented so the native implementation is
        // never used by Rangy.
        selProto.selectAllChildren = function(node) {
            assertNodeInSameDocument(this, node);
            var range = api.createRange(node);
            range.selectNodeContents(node);
            this.setSingleRange(range);
        };

        selProto.deleteFromDocument = function() {
            // Sepcial behaviour required for IE's control selections
            if (implementsControlRange && implementsDocSelection && this.docSelection.type == CONTROL) {
                var controlRange = this.docSelection.createRange();
                var element;
                while (controlRange.length) {
                    element = controlRange.item(0);
                    controlRange.remove(element);
                    element.parentNode.removeChild(element);
                }
                this.refresh();
            } else if (this.rangeCount) {
                var ranges = this.getAllRanges();
                if (ranges.length) {
                    this.removeAllRanges();
                    for (var i = 0, len = ranges.length; i < len; ++i) {
                        ranges[i].deleteContents();
                    }
                    // The spec says nothing about what the selection should contain after calling deleteContents on each
                    // range. Firefox moves the selection to where the final selected range was, so we emulate that
                    this.addRange(ranges[len - 1]);
                }
            }
        };

        // The following are non-standard extensions
        selProto.eachRange = function(func, returnValue) {
            for (var i = 0, len = this._ranges.length; i < len; ++i) {
                if ( func( this.getRangeAt(i) ) ) {
                    return returnValue;
                }
            }
        };

        selProto.getAllRanges = function() {
            var ranges = [];
            this.eachRange(function(range) {
                ranges.push(range);
            });
            return ranges;
        };

        selProto.setSingleRange = function(range, direction) {
            this.removeAllRanges();
            this.addRange(range, direction);
        };

        selProto.callMethodOnEachRange = function(methodName, params) {
            var results = [];
            this.eachRange( function(range) {
                results.push( range[methodName].apply(range, params) );
            } );
            return results;
        };
        
        function createStartOrEndSetter(isStart) {
            return function(node, offset) {
                var range;
                if (this.rangeCount) {
                    range = this.getRangeAt(0);
                    range["set" + (isStart ? "Start" : "End")](node, offset);
                } else {
                    range = api.createRange(this.win.document);
                    range.setStartAndEnd(node, offset);
                }
                this.setSingleRange(range, this.isBackward());
            };
        }

        selProto.setStart = createStartOrEndSetter(true);
        selProto.setEnd = createStartOrEndSetter(false);
        
        // Add select() method to Range prototype. Any existing selection will be removed.
        api.rangePrototype.select = function(direction) {
            getSelection( this.getDocument() ).setSingleRange(this, direction);
        };

        selProto.changeEachRange = function(func) {
            var ranges = [];
            var backward = this.isBackward();

            this.eachRange(function(range) {
                func(range);
                ranges.push(range);
            });

            this.removeAllRanges();
            if (backward && ranges.length == 1) {
                this.addRange(ranges[0], "backward");
            } else {
                this.setRanges(ranges);
            }
        };

        selProto.containsNode = function(node, allowPartial) {
            return this.eachRange( function(range) {
                return range.containsNode(node, allowPartial);
            }, true ) || false;
        };

        selProto.getBookmark = function(containerNode) {
            return {
                backward: this.isBackward(),
                rangeBookmarks: this.callMethodOnEachRange("getBookmark", [containerNode])
            };
        };

        selProto.moveToBookmark = function(bookmark) {
            var selRanges = [];
            for (var i = 0, rangeBookmark, range; rangeBookmark = bookmark.rangeBookmarks[i++]; ) {
                range = api.createRange(this.win);
                range.moveToBookmark(rangeBookmark);
                selRanges.push(range);
            }
            if (bookmark.backward) {
                this.setSingleRange(selRanges[0], "backward");
            } else {
                this.setRanges(selRanges);
            }
        };

        selProto.toHtml = function() {
            var rangeHtmls = [];
            this.eachRange(function(range) {
                rangeHtmls.push( DomRange.toHtml(range) );
            });
            return rangeHtmls.join("");
        };

        if (features.implementsTextRange) {
            selProto.getNativeTextRange = function() {
                var sel, textRange;
                if ( (sel = this.docSelection) ) {
                    var range = sel.createRange();
                    if (isTextRange(range)) {
                        return range;
                    } else {
                        throw module.createError("getNativeTextRange: selection is a control selection"); 
                    }
                } else if (this.rangeCount > 0) {
                    return api.WrappedTextRange.rangeToTextRange( this.getRangeAt(0) );
                } else {
                    throw module.createError("getNativeTextRange: selection contains no range");
                }
            };
        }

        function inspect(sel) {
            var rangeInspects = [];
            var anchor = new DomPosition(sel.anchorNode, sel.anchorOffset);
            var focus = new DomPosition(sel.focusNode, sel.focusOffset);
            var name = (typeof sel.getName == "function") ? sel.getName() : "Selection";

            if (typeof sel.rangeCount != "undefined") {
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                    rangeInspects[i] = DomRange.inspect(sel.getRangeAt(i));
                }
            }
            return "[" + name + "(Ranges: " + rangeInspects.join(", ") +
                    ")(anchor: " + anchor.inspect() + ", focus: " + focus.inspect() + "]";
        }

        selProto.getName = function() {
            return "WrappedSelection";
        };

        selProto.inspect = function() {
            return inspect(this);
        };

        selProto.detach = function() {
            actOnCachedSelection(this.win, "delete");
            deleteProperties(this);
        };

        WrappedSelection.detachAll = function() {
            actOnCachedSelection(null, "deleteAll");
        };

        WrappedSelection.inspect = inspect;
        WrappedSelection.isDirectionBackward = isDirectionBackward;

        api.Selection = WrappedSelection;

        api.selectionPrototype = selProto;

        api.addShimListener(function(win) {
            if (typeof win.getSelection == "undefined") {
                win.getSelection = function() {
                    return getSelection(win);
                };
            }
            win = null;
        });
    });
    

    /*----------------------------------------------------------------------------------------------------------------*/

    // Wait for document to load before initializing
    var docReady = false;

    var loadHandler = function(e) {
        if (!docReady) {
            docReady = true;
            if (!api.initialized && api.config.autoInitialize) {
                init();
            }
        }
    };

    if (isBrowser) {
        // Test whether the document has already been loaded and initialize immediately if so
        if (/^(?:complete|interactive)$/.test(document.readyState)) {
            loadHandler();
        } else {
            if (isHostMethod(document, "addEventListener")) {
                document.addEventListener("DOMContentLoaded", loadHandler, false);
            }

            // Add a fallback in case the DOMContentLoaded event isn't supported
            addListener(window, "load", loadHandler);
        }
    }

    return api;
}, /* build:replaceWithGlobalObject */this/* build:replaceWithGlobalObjectEnd */);
/**
 * Class Applier module for Rangy.
 * Adds, removes and toggles classes on Ranges and Selections
 *
 * Part of Rangy, a cross-browser JavaScript range and selection library
 * http://code.google.com/p/rangy/
 *
 * Depends on Rangy core.
 *
 * Copyright 2014, Tim Down
 * Licensed under the MIT license.
 * Version: 1.3.0-alpha.20140827
 * Build date: 27 August 2014
 */
(function(factory, root) {
    if (typeof define == "function" && define.amd) {
        // AMD. Register as an anonymous module with a dependency on Rangy.
        define(["./rangy-core"], factory);
    } else if (typeof module != "undefined" && typeof exports == "object") {
        // Node/CommonJS style
        module.exports = factory( require("rangy") );
    } else {
        // No AMD or CommonJS support so we use the rangy property of root (probably the global variable)
        factory(root.rangy);
    }
})(function(rangy) {
    rangy.createModule("ClassApplier", ["WrappedSelection"], function(api, module) {
        var dom = api.dom;
        var DomPosition = dom.DomPosition;
        var contains = dom.arrayContains;
        var isHtmlNamespace = dom.isHtmlNamespace;


        var defaultTagName = "span";

        function each(obj, func) {
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    if (func(i, obj[i]) === false) {
                        return false;
                    }
                }
            }
            return true;
        }
        
        function trim(str) {
            return str.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
        }

        function hasClass(el, className) {
            return el.className && new RegExp("(?:^|\\s)" + className + "(?:\\s|$)").test(el.className);
        }

        function addClass(el, className) {
            if (el.className) {
                if (!hasClass(el, className)) {
                    el.className += " " + className;
                }
            } else {
                el.className = className;
            }
        }

        var removeClass = (function() {
            function replacer(matched, whiteSpaceBefore, whiteSpaceAfter) {
                return (whiteSpaceBefore && whiteSpaceAfter) ? " " : "";
            }

            return function(el, className) {
                if (el.className) {
                    el.className = el.className.replace(new RegExp("(^|\\s)" + className + "(\\s|$)"), replacer);
                }
            };
        })();

        function sortClassName(className) {
            return className && className.split(/\s+/).sort().join(" ");
        }

        function getSortedClassName(el) {
            return sortClassName(el.className);
        }

        function haveSameClasses(el1, el2) {
            return getSortedClassName(el1) == getSortedClassName(el2);
        }

        function movePosition(position, oldParent, oldIndex, newParent, newIndex) {
            var posNode = position.node, posOffset = position.offset;
            var newNode = posNode, newOffset = posOffset;

            if (posNode == newParent && posOffset > newIndex) {
                ++newOffset;
            }

            if (posNode == oldParent && (posOffset == oldIndex  || posOffset == oldIndex + 1)) {
                newNode = newParent;
                newOffset += newIndex - oldIndex;
            }

            if (posNode == oldParent && posOffset > oldIndex + 1) {
                --newOffset;
            }

            position.node = newNode;
            position.offset = newOffset;
        }
        
        function movePositionWhenRemovingNode(position, parentNode, index) {
            if (position.node == parentNode && position.offset > index) {
                --position.offset;
            }
        }

        function movePreservingPositions(node, newParent, newIndex, positionsToPreserve) {
            // For convenience, allow newIndex to be -1 to mean "insert at the end".
            if (newIndex == -1) {
                newIndex = newParent.childNodes.length;
            }

            var oldParent = node.parentNode;
            var oldIndex = dom.getNodeIndex(node);

            for (var i = 0, position; position = positionsToPreserve[i++]; ) {
                movePosition(position, oldParent, oldIndex, newParent, newIndex);
            }

            // Now actually move the node.
            if (newParent.childNodes.length == newIndex) {
                newParent.appendChild(node);
            } else {
                newParent.insertBefore(node, newParent.childNodes[newIndex]);
            }
        }
        
        function removePreservingPositions(node, positionsToPreserve) {

            var oldParent = node.parentNode;
            var oldIndex = dom.getNodeIndex(node);

            for (var i = 0, position; position = positionsToPreserve[i++]; ) {
                movePositionWhenRemovingNode(position, oldParent, oldIndex);
            }

            node.parentNode.removeChild(node);
        }

        function moveChildrenPreservingPositions(node, newParent, newIndex, removeNode, positionsToPreserve) {
            var child, children = [];
            while ( (child = node.firstChild) ) {
                movePreservingPositions(child, newParent, newIndex++, positionsToPreserve);
                children.push(child);
            }
            if (removeNode) {
                removePreservingPositions(node, positionsToPreserve);
            }
            return children;
        }

        function replaceWithOwnChildrenPreservingPositions(element, positionsToPreserve) {
            return moveChildrenPreservingPositions(element, element.parentNode, dom.getNodeIndex(element), true, positionsToPreserve);
        }

        function rangeSelectsAnyText(range, textNode) {
            var textNodeRange = range.cloneRange();
            textNodeRange.selectNodeContents(textNode);

            var intersectionRange = textNodeRange.intersection(range);
            var text = intersectionRange ? intersectionRange.toString() : "";

            return text != "";
        }

        function getEffectiveTextNodes(range) {
            var nodes = range.getNodes([3]);
            
            // Optimization as per issue 145
            
            // Remove non-intersecting text nodes from the start of the range
            var start = 0, node;
            while ( (node = nodes[start]) && !rangeSelectsAnyText(range, node) ) {
                ++start;
            }

            // Remove non-intersecting text nodes from the start of the range
            var end = nodes.length - 1;
            while ( (node = nodes[end]) && !rangeSelectsAnyText(range, node) ) {
                --end;
            }
            
            return nodes.slice(start, end + 1);
        }

        function elementsHaveSameNonClassAttributes(el1, el2) {
            if (el1.attributes.length != el2.attributes.length) return false;
            for (var i = 0, len = el1.attributes.length, attr1, attr2, name; i < len; ++i) {
                attr1 = el1.attributes[i];
                name = attr1.name;
                if (name != "class") {
                    attr2 = el2.attributes.getNamedItem(name);
                    if ( (attr1 === null) != (attr2 === null) ) return false;
                    if (attr1.specified != attr2.specified) return false;
                    if (attr1.specified && attr1.nodeValue !== attr2.nodeValue) return false;
                }
            }
            return true;
        }

        function elementHasNonClassAttributes(el, exceptions) {
            for (var i = 0, len = el.attributes.length, attrName; i < len; ++i) {
                attrName = el.attributes[i].name;
                if ( !(exceptions && contains(exceptions, attrName)) && el.attributes[i].specified && attrName != "class") {
                    return true;
                }
            }
            return false;
        }

        function elementHasProperties(el, props) {
            return each(props, function(p, propValue) {
                if (typeof propValue == "object") {
                    if (!elementHasProperties(el[p], propValue)) {
                        return false;
                    }
                } else if (el[p] !== propValue) {
                    return false;
                }
            });
        }

        var getComputedStyleProperty = dom.getComputedStyleProperty;
        var isEditableElement = (function() {
            var testEl = document.createElement("div");
            return typeof testEl.isContentEditable == "boolean" ?
                function (node) {
                    return node && node.nodeType == 1 && node.isContentEditable;
                } :
                function (node) {
                    if (!node || node.nodeType != 1 || node.contentEditable == "false") {
                        return false;
                    }
                    return node.contentEditable == "true" || isEditableElement(node.parentNode);
                };
        })();

        function isEditingHost(node) {
            var parent;
            return node && node.nodeType == 1 &&
                (( (parent = node.parentNode) && parent.nodeType == 9 && parent.designMode == "on") ||
                (isEditableElement(node) && !isEditableElement(node.parentNode)));
        }

        function isEditable(node) {
            return (isEditableElement(node) || (node.nodeType != 1 && isEditableElement(node.parentNode))) && !isEditingHost(node);
        }

        var inlineDisplayRegex = /^inline(-block|-table)?$/i;

        function isNonInlineElement(node) {
            return node && node.nodeType == 1 && !inlineDisplayRegex.test(getComputedStyleProperty(node, "display"));
        }

        // White space characters as defined by HTML 4 (http://www.w3.org/TR/html401/struct/text.html)
        var htmlNonWhiteSpaceRegex = /[^\r\n\t\f \u200B]/;

        function isUnrenderedWhiteSpaceNode(node) {
            if (node.data.length == 0) {
                return true;
            }
            if (htmlNonWhiteSpaceRegex.test(node.data)) {
                return false;
            }
            var cssWhiteSpace = getComputedStyleProperty(node.parentNode, "whiteSpace");
            switch (cssWhiteSpace) {
                case "pre":
                case "pre-wrap":
                case "-moz-pre-wrap":
                    return false;
                case "pre-line":
                    if (/[\r\n]/.test(node.data)) {
                        return false;
                    }
            }

            // We now have a whitespace-only text node that may be rendered depending on its context. If it is adjacent to a
            // non-inline element, it will not be rendered. This seems to be a good enough definition.
            return isNonInlineElement(node.previousSibling) || isNonInlineElement(node.nextSibling);
        }

        function getRangeBoundaries(ranges) {
            var positions = [], i, range;
            for (i = 0; range = ranges[i++]; ) {
                positions.push(
                    new DomPosition(range.startContainer, range.startOffset),
                    new DomPosition(range.endContainer, range.endOffset)
                );
            }
            return positions;
        }

        function updateRangesFromBoundaries(ranges, positions) {
            for (var i = 0, range, start, end, len = ranges.length; i < len; ++i) {
                range = ranges[i];
                start = positions[i * 2];
                end = positions[i * 2 + 1];
                range.setStartAndEnd(start.node, start.offset, end.node, end.offset);
            }
        }

        function isSplitPoint(node, offset) {
            if (dom.isCharacterDataNode(node)) {
                if (offset == 0) {
                    return !!node.previousSibling;
                } else if (offset == node.length) {
                    return !!node.nextSibling;
                } else {
                    return true;
                }
            }

            return offset > 0 && offset < node.childNodes.length;
        }

        function splitNodeAt(node, descendantNode, descendantOffset, positionsToPreserve) {
            var newNode, parentNode;
            var splitAtStart = (descendantOffset == 0);

            if (dom.isAncestorOf(descendantNode, node)) {
                return node;
            }

            if (dom.isCharacterDataNode(descendantNode)) {
                var descendantIndex = dom.getNodeIndex(descendantNode);
                if (descendantOffset == 0) {
                    descendantOffset = descendantIndex;
                } else if (descendantOffset == descendantNode.length) {
                    descendantOffset = descendantIndex + 1;
                } else {
                    throw module.createError("splitNodeAt() should not be called with offset in the middle of a data node (" +
                        descendantOffset + " in " + descendantNode.data);
                }
                descendantNode = descendantNode.parentNode;
            }

            if (isSplitPoint(descendantNode, descendantOffset)) {
                // descendantNode is now guaranteed not to be a text or other character node
                newNode = descendantNode.cloneNode(false);
                parentNode = descendantNode.parentNode;
                if (newNode.id) {
                    newNode.removeAttribute("id");
                }
                var child, newChildIndex = 0;

                while ( (child = descendantNode.childNodes[descendantOffset]) ) {
                    movePreservingPositions(child, newNode, newChildIndex++, positionsToPreserve);
                }
                movePreservingPositions(newNode, parentNode, dom.getNodeIndex(descendantNode) + 1, positionsToPreserve);
                return (descendantNode == node) ? newNode : splitNodeAt(node, parentNode, dom.getNodeIndex(newNode), positionsToPreserve);
            } else if (node != descendantNode) {
                newNode = descendantNode.parentNode;

                // Work out a new split point in the parent node
                var newNodeIndex = dom.getNodeIndex(descendantNode);

                if (!splitAtStart) {
                    newNodeIndex++;
                }
                return splitNodeAt(node, newNode, newNodeIndex, positionsToPreserve);
            }
            return node;
        }

        function areElementsMergeable(el1, el2) {
            return el1.namespaceURI == el2.namespaceURI &&
                el1.tagName.toLowerCase() == el2.tagName.toLowerCase() &&
                haveSameClasses(el1, el2) &&
                elementsHaveSameNonClassAttributes(el1, el2) &&
                getComputedStyleProperty(el1, "display") == "inline" &&
                getComputedStyleProperty(el2, "display") == "inline";
        }

        function createAdjacentMergeableTextNodeGetter(forward) {
            var siblingPropName = forward ? "nextSibling" : "previousSibling";

            return function(textNode, checkParentElement) {
                var el = textNode.parentNode;
                var adjacentNode = textNode[siblingPropName];
                if (adjacentNode) {
                    // Can merge if the node's previous/next sibling is a text node
                    if (adjacentNode && adjacentNode.nodeType == 3) {
                        return adjacentNode;
                    }
                } else if (checkParentElement) {
                    // Compare text node parent element with its sibling
                    adjacentNode = el[siblingPropName];
                    if (adjacentNode && adjacentNode.nodeType == 1 && areElementsMergeable(el, adjacentNode)) {
                        var adjacentNodeChild = adjacentNode[forward ? "firstChild" : "lastChild"];
                        if (adjacentNodeChild && adjacentNodeChild.nodeType == 3) {
                            return adjacentNodeChild;
                        }
                    }
                }
                return null;
            };
        }

        var getPreviousMergeableTextNode = createAdjacentMergeableTextNodeGetter(false),
            getNextMergeableTextNode = createAdjacentMergeableTextNodeGetter(true);

    
        function Merge(firstNode) {
            this.isElementMerge = (firstNode.nodeType == 1);
            this.textNodes = [];
            var firstTextNode = this.isElementMerge ? firstNode.lastChild : firstNode;
            if (firstTextNode) {
                this.textNodes[0] = firstTextNode;
            }
        }

        Merge.prototype = {
            doMerge: function(positionsToPreserve) {
                var textNodes = this.textNodes;
                var firstTextNode = textNodes[0];
                if (textNodes.length > 1) {
                    var firstTextNodeIndex = dom.getNodeIndex(firstTextNode);
                    var textParts = [], combinedTextLength = 0, textNode, parent;
                    for (var i = 0, len = textNodes.length, j, position; i < len; ++i) {
                        textNode = textNodes[i];
                        parent = textNode.parentNode;
                        if (i > 0) {
                            parent.removeChild(textNode);
                            if (!parent.hasChildNodes()) {
                                parent.parentNode.removeChild(parent);
                            }
                            if (positionsToPreserve) {
                                for (j = 0; position = positionsToPreserve[j++]; ) {
                                    // Handle case where position is inside the text node being merged into a preceding node
                                    if (position.node == textNode) {
                                        position.node = firstTextNode;
                                        position.offset += combinedTextLength;
                                    }
                                    // Handle case where both text nodes precede the position within the same parent node
                                    if (position.node == parent && position.offset > firstTextNodeIndex) {
                                        --position.offset;
                                        if (position.offset == firstTextNodeIndex + 1 && i < len - 1) {
                                            position.node = firstTextNode;
                                            position.offset = combinedTextLength;
                                        }
                                    }
                                }
                            }
                        }
                        textParts[i] = textNode.data;
                        combinedTextLength += textNode.data.length;
                    }
                    firstTextNode.data = textParts.join("");
                }
                return firstTextNode.data;
            },

            getLength: function() {
                var i = this.textNodes.length, len = 0;
                while (i--) {
                    len += this.textNodes[i].length;
                }
                return len;
            },

            toString: function() {
                var textParts = [];
                for (var i = 0, len = this.textNodes.length; i < len; ++i) {
                    textParts[i] = "'" + this.textNodes[i].data + "'";
                }
                return "[Merge(" + textParts.join(",") + ")]";
            }
        };

        var optionProperties = ["elementTagName", "ignoreWhiteSpace", "applyToEditableOnly", "useExistingElements",
            "removeEmptyElements", "onElementCreate"];

        // TODO: Populate this with every attribute name that corresponds to a property with a different name. Really??
        var attrNamesForProperties = {};

        function ClassApplier(className, options, tagNames) {
            var normalize, i, len, propName, applier = this;
            applier.cssClass = applier.className = className; // cssClass property is for backward compatibility

            var elementPropertiesFromOptions = null, elementAttributes = {};

            // Initialize from options object
            if (typeof options == "object" && options !== null) {
                tagNames = options.tagNames;
                elementPropertiesFromOptions = options.elementProperties;
                elementAttributes = options.elementAttributes;

                for (i = 0; propName = optionProperties[i++]; ) {
                    if (options.hasOwnProperty(propName)) {
                        applier[propName] = options[propName];
                    }
                }
                normalize = options.normalize;
            } else {
                normalize = options;
            }

            // Backward compatibility: the second parameter can also be a Boolean indicating to normalize after unapplying
            applier.normalize = (typeof normalize == "undefined") ? true : normalize;

            // Initialize element properties and attribute exceptions
            applier.attrExceptions = [];
            var el = document.createElement(applier.elementTagName);
            applier.elementProperties = applier.copyPropertiesToElement(elementPropertiesFromOptions, el, true);
            each(elementAttributes, function(attrName) {
                applier.attrExceptions.push(attrName);
            });
            applier.elementAttributes = elementAttributes;

            applier.elementSortedClassName = applier.elementProperties.hasOwnProperty("className") ?
                applier.elementProperties.className : className;

            // Initialize tag names
            applier.applyToAnyTagName = false;
            var type = typeof tagNames;
            if (type == "string") {
                if (tagNames == "*") {
                    applier.applyToAnyTagName = true;
                } else {
                    applier.tagNames = trim(tagNames.toLowerCase()).split(/\s*,\s*/);
                }
            } else if (type == "object" && typeof tagNames.length == "number") {
                applier.tagNames = [];
                for (i = 0, len = tagNames.length; i < len; ++i) {
                    if (tagNames[i] == "*") {
                        applier.applyToAnyTagName = true;
                    } else {
                        applier.tagNames.push(tagNames[i].toLowerCase());
                    }
                }
            } else {
                applier.tagNames = [applier.elementTagName];
            }
        }

        ClassApplier.prototype = {
            elementTagName: defaultTagName,
            elementProperties: {},
            elementAttributes: {},
            ignoreWhiteSpace: true,
            applyToEditableOnly: false,
            useExistingElements: true,
            removeEmptyElements: true,
            onElementCreate: null,

            copyPropertiesToElement: function(props, el, createCopy) {
                var s, elStyle, elProps = {}, elPropsStyle, propValue, elPropValue, attrName;

                for (var p in props) {
                    if (props.hasOwnProperty(p)) {
                        propValue = props[p];
                        elPropValue = el[p];

                        // Special case for class. The copied properties object has the applier's CSS class as well as its
                        // own to simplify checks when removing styling elements
                        if (p == "className") {
                            addClass(el, propValue);
                            addClass(el, this.className);
                            el[p] = sortClassName(el[p]);
                            if (createCopy) {
                                elProps[p] = el[p];
                            }
                        }

                        // Special case for style
                        else if (p == "style") {
                            elStyle = elPropValue;
                            if (createCopy) {
                                elProps[p] = elPropsStyle = {};
                            }
                            for (s in props[p]) {
                                elStyle[s] = propValue[s];
                                if (createCopy) {
                                    elPropsStyle[s] = elStyle[s];
                                }
                            }
                            this.attrExceptions.push(p);
                        } else {
                            el[p] = propValue;
                            // Copy the property back from the dummy element so that later comparisons to check whether
                            // elements may be removed are checking against the right value. For example, the href property
                            // of an element returns a fully qualified URL even if it was previously assigned a relative
                            // URL.
                            if (createCopy) {
                                elProps[p] = el[p];

                                // Not all properties map to identically-named attributes
                                attrName = attrNamesForProperties.hasOwnProperty(p) ? attrNamesForProperties[p] : p;
                                this.attrExceptions.push(attrName);
                            }
                        }
                    }
                }

                return createCopy ? elProps : "";
            },
            
            copyAttributesToElement: function(attrs, el) {
                for (var attrName in attrs) {
                    if (attrs.hasOwnProperty(attrName)) {
                        el.setAttribute(attrName, attrs[attrName]);
                    }
                }
            },

            hasClass: function(node) {
                return node.nodeType == 1 &&
                    contains(this.tagNames, node.tagName.toLowerCase()) &&
                    hasClass(node, this.className);
            },

            getSelfOrAncestorWithClass: function(node) {
                while (node) {
                    if (this.hasClass(node)) {
                        return node;
                    }
                    node = node.parentNode;
                }
                return null;
            },

            isModifiable: function(node) {
                return !this.applyToEditableOnly || isEditable(node);
            },

            // White space adjacent to an unwrappable node can be ignored for wrapping
            isIgnorableWhiteSpaceNode: function(node) {
                return this.ignoreWhiteSpace && node && node.nodeType == 3 && isUnrenderedWhiteSpaceNode(node);
            },

            // Normalizes nodes after applying a CSS class to a Range.
            postApply: function(textNodes, range, positionsToPreserve, isUndo) {
                var firstNode = textNodes[0], lastNode = textNodes[textNodes.length - 1];

                var merges = [], currentMerge;

                var rangeStartNode = firstNode, rangeEndNode = lastNode;
                var rangeStartOffset = 0, rangeEndOffset = lastNode.length;

                var textNode, precedingTextNode;

                // Check for every required merge and create a Merge object for each
                for (var i = 0, len = textNodes.length; i < len; ++i) {
                    textNode = textNodes[i];
                    precedingTextNode = getPreviousMergeableTextNode(textNode, !isUndo);
                    if (precedingTextNode) {
                        if (!currentMerge) {
                            currentMerge = new Merge(precedingTextNode);
                            merges.push(currentMerge);
                        }
                        currentMerge.textNodes.push(textNode);
                        if (textNode === firstNode) {
                            rangeStartNode = currentMerge.textNodes[0];
                            rangeStartOffset = rangeStartNode.length;
                        }
                        if (textNode === lastNode) {
                            rangeEndNode = currentMerge.textNodes[0];
                            rangeEndOffset = currentMerge.getLength();
                        }
                    } else {
                        currentMerge = null;
                    }
                }

                // Test whether the first node after the range needs merging
                var nextTextNode = getNextMergeableTextNode(lastNode, !isUndo);

                if (nextTextNode) {
                    if (!currentMerge) {
                        currentMerge = new Merge(lastNode);
                        merges.push(currentMerge);
                    }
                    currentMerge.textNodes.push(nextTextNode);
                }

                // Apply the merges
                if (merges.length) {
                    for (i = 0, len = merges.length; i < len; ++i) {
                        merges[i].doMerge(positionsToPreserve);
                    }

                    // Set the range boundaries
                    range.setStartAndEnd(rangeStartNode, rangeStartOffset, rangeEndNode, rangeEndOffset);
                }
            },

            createContainer: function(doc) {
                var el = doc.createElement(this.elementTagName);
                this.copyPropertiesToElement(this.elementProperties, el, false);
                this.copyAttributesToElement(this.elementAttributes, el);
                addClass(el, this.className);
                if (this.onElementCreate) {
                    this.onElementCreate(el, this);
                }
                return el;
            },

            applyToTextNode: function(textNode, positionsToPreserve) {
                var parent = textNode.parentNode;
                if (parent.childNodes.length == 1 &&
                        this.useExistingElements &&
                        isHtmlNamespace(parent) &&
                        contains(this.tagNames, parent.tagName.toLowerCase()) &&
                        elementHasProperties(parent, this.elementProperties)) {

                    addClass(parent, this.className);
                } else {
                    var el = this.createContainer(dom.getDocument(textNode));
                    textNode.parentNode.insertBefore(el, textNode);
                    el.appendChild(textNode);
                }
            },

            isRemovable: function(el) {
                return isHtmlNamespace(el) &&
                    el.tagName.toLowerCase() == this.elementTagName &&
                    getSortedClassName(el) == this.elementSortedClassName &&
                    elementHasProperties(el, this.elementProperties) &&
                    !elementHasNonClassAttributes(el, this.attrExceptions) &&
                    this.isModifiable(el);
            },

            isEmptyContainer: function(el) {
                var childNodeCount = el.childNodes.length;
                return el.nodeType == 1 &&
                    this.isRemovable(el) &&
                    (childNodeCount == 0 || (childNodeCount == 1 && this.isEmptyContainer(el.firstChild)));
            },
            
            removeEmptyContainers: function(range) {
                var applier = this;
                var nodesToRemove = range.getNodes([1], function(el) {
                    return applier.isEmptyContainer(el);
                });
                
                var rangesToPreserve = [range];
                var positionsToPreserve = getRangeBoundaries(rangesToPreserve);
                
                for (var i = 0, node; node = nodesToRemove[i++]; ) {
                    removePreservingPositions(node, positionsToPreserve);
                }

                // Update the range from the preserved boundary positions
                updateRangesFromBoundaries(rangesToPreserve, positionsToPreserve);
            },

            undoToTextNode: function(textNode, range, ancestorWithClass, positionsToPreserve) {
                if (!range.containsNode(ancestorWithClass)) {
                    // Split out the portion of the ancestor from which we can remove the CSS class
                    //var parent = ancestorWithClass.parentNode, index = dom.getNodeIndex(ancestorWithClass);
                    var ancestorRange = range.cloneRange();
                    ancestorRange.selectNode(ancestorWithClass);
                    if (ancestorRange.isPointInRange(range.endContainer, range.endOffset)) {
                        splitNodeAt(ancestorWithClass, range.endContainer, range.endOffset, positionsToPreserve);
                        range.setEndAfter(ancestorWithClass);
                    }
                    if (ancestorRange.isPointInRange(range.startContainer, range.startOffset)) {
                        ancestorWithClass = splitNodeAt(ancestorWithClass, range.startContainer, range.startOffset, positionsToPreserve);
                    }
                }
                if (this.isRemovable(ancestorWithClass)) {
                    replaceWithOwnChildrenPreservingPositions(ancestorWithClass, positionsToPreserve);
                } else {
                    removeClass(ancestorWithClass, this.className);
                }
            },

            applyToRange: function(range, rangesToPreserve) {
                rangesToPreserve = rangesToPreserve || [];

                // Create an array of range boundaries to preserve
                var positionsToPreserve = getRangeBoundaries(rangesToPreserve || []);
                
                range.splitBoundariesPreservingPositions(positionsToPreserve);

                // Tidy up the DOM by removing empty containers 
                if (this.removeEmptyElements) {
                    this.removeEmptyContainers(range);
                }

                var textNodes = getEffectiveTextNodes(range);

                if (textNodes.length) {
                    for (var i = 0, textNode; textNode = textNodes[i++]; ) {
                        if (!this.isIgnorableWhiteSpaceNode(textNode) && !this.getSelfOrAncestorWithClass(textNode) &&
                                this.isModifiable(textNode)) {
                            this.applyToTextNode(textNode, positionsToPreserve);
                        }
                    }
                    textNode = textNodes[textNodes.length - 1];
                    range.setStartAndEnd(textNodes[0], 0, textNode, textNode.length);
                    if (this.normalize) {
                        this.postApply(textNodes, range, positionsToPreserve, false);
                    }

                    // Update the ranges from the preserved boundary positions
                    updateRangesFromBoundaries(rangesToPreserve, positionsToPreserve);
                }
            },

            applyToRanges: function(ranges) {

                var i = ranges.length;
                while (i--) {
                    this.applyToRange(ranges[i], ranges);
                }


                return ranges;
            },

            applyToSelection: function(win) {
                var sel = api.getSelection(win);
                sel.setRanges( this.applyToRanges(sel.getAllRanges()) );
            },

            undoToRange: function(range, rangesToPreserve) {
                // Create an array of range boundaries to preserve
                rangesToPreserve = rangesToPreserve || [];
                var positionsToPreserve = getRangeBoundaries(rangesToPreserve);


                range.splitBoundariesPreservingPositions(positionsToPreserve);

                // Tidy up the DOM by removing empty containers 
                if (this.removeEmptyElements) {
                    this.removeEmptyContainers(range, positionsToPreserve);
                }

                var textNodes = getEffectiveTextNodes(range);
                var textNode, ancestorWithClass;
                var lastTextNode = textNodes[textNodes.length - 1];

                if (textNodes.length) {
                    for (var i = 0, len = textNodes.length; i < len; ++i) {
                        textNode = textNodes[i];
                        ancestorWithClass = this.getSelfOrAncestorWithClass(textNode);
                        if (ancestorWithClass && this.isModifiable(textNode)) {
                            this.undoToTextNode(textNode, range, ancestorWithClass, positionsToPreserve);
                        }

                        // Ensure the range is still valid
                        range.setStartAndEnd(textNodes[0], 0, lastTextNode, lastTextNode.length);
                    }


                    if (this.normalize) {
                        this.postApply(textNodes, range, positionsToPreserve, true);
                    }

                    // Update the ranges from the preserved boundary positions
                    updateRangesFromBoundaries(rangesToPreserve, positionsToPreserve);
                }
            },

            undoToRanges: function(ranges) {
                // Get ranges returned in document order
                var i = ranges.length;

                while (i--) {
                    this.undoToRange(ranges[i], ranges);
                }

                return ranges;
            },

            undoToSelection: function(win) {
                var sel = api.getSelection(win);
                var ranges = api.getSelection(win).getAllRanges();
                this.undoToRanges(ranges);
                sel.setRanges(ranges);
            },

    /*
            getTextSelectedByRange: function(textNode, range) {
                var textRange = range.cloneRange();
                textRange.selectNodeContents(textNode);

                var intersectionRange = textRange.intersection(range);
                var text = intersectionRange ? intersectionRange.toString() : "";
                textRange.detach();

                return text;
            },
    */

            isAppliedToRange: function(range) {
                if (range.collapsed || range.toString() == "") {
                    return !!this.getSelfOrAncestorWithClass(range.commonAncestorContainer);
                } else {
                    var textNodes = range.getNodes( [3] );
                    if (textNodes.length)
                    for (var i = 0, textNode; textNode = textNodes[i++]; ) {
                        if (!this.isIgnorableWhiteSpaceNode(textNode) && rangeSelectsAnyText(range, textNode) &&
                                this.isModifiable(textNode) && !this.getSelfOrAncestorWithClass(textNode)) {
                            return false;
                        }
                    }
                    return true;
                }
            },

            isAppliedToRanges: function(ranges) {
                var i = ranges.length;
                if (i == 0) {
                    return false;
                }
                while (i--) {
                    if (!this.isAppliedToRange(ranges[i])) {
                        return false;
                    }
                }
                return true;
            },

            isAppliedToSelection: function(win) {
                var sel = api.getSelection(win);
                return this.isAppliedToRanges(sel.getAllRanges());
            },

            toggleRange: function(range) {
                if (this.isAppliedToRange(range)) {
                    this.undoToRange(range);
                } else {
                    this.applyToRange(range);
                }
            },

    /*
            toggleRanges: function(ranges) {
                if (this.isAppliedToRanges(ranges)) {
                    this.undoToRanges(ranges);
                } else {
                    this.applyToRanges(ranges);
                }
            },
    */

            toggleSelection: function(win) {
                if (this.isAppliedToSelection(win)) {
                    this.undoToSelection(win);
                } else {
                    this.applyToSelection(win);
                }
            },
            
            getElementsWithClassIntersectingRange: function(range) {
                var elements = [];
                var applier = this;
                range.getNodes([3], function(textNode) {
                    var el = applier.getSelfOrAncestorWithClass(textNode);
                    if (el && !contains(elements, el)) {
                        elements.push(el);
                    }
                });
                return elements;
            },

    /*
            getElementsWithClassIntersectingSelection: function(win) {
                var sel = api.getSelection(win);
                var elements = [];
                var applier = this;
                sel.eachRange(function(range) {
                    var rangeElements = applier.getElementsWithClassIntersectingRange(range);
                    for (var i = 0, el; el = rangeElements[i++]; ) {
                        if (!contains(elements, el)) {
                            elements.push(el);
                        }
                    }
                });
                return elements;
            },
    */

            detach: function() {}
        };

        function createClassApplier(className, options, tagNames) {
            return new ClassApplier(className, options, tagNames);
        }

        ClassApplier.util = {
            hasClass: hasClass,
            addClass: addClass,
            removeClass: removeClass,
            hasSameClasses: haveSameClasses,
            replaceWithOwnChildren: replaceWithOwnChildrenPreservingPositions,
            elementsHaveSameNonClassAttributes: elementsHaveSameNonClassAttributes,
            elementHasNonClassAttributes: elementHasNonClassAttributes,
            splitNodeAt: splitNodeAt,
            isEditableElement: isEditableElement,
            isEditingHost: isEditingHost,
            isEditable: isEditable
        };

        api.CssClassApplier = api.ClassApplier = ClassApplier;
        api.createCssClassApplier = api.createClassApplier = createClassApplier;
    });
    
}, this);
/*
 * Medium.js
 *
 * Copyright 2013, Jacob Kelley - http://jakiestfu.com/
 * Released under the MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Github:  http://github.com/jakiestfu/Medium.js/
 * Version: 1.0
 */

(function (w, d) {
	'use strict';
	
	// check if the selection contains noneditable element
	function checkNonEditable(e, selRange) {
		var i =0;
		var nodes = selRange.cloneContents().querySelectorAll("[contenteditable='false']");
		for (i =0; i< nodes.length; i++) {
			if (nodes[i].tagName !="A") {
				e.preventDefault();
				return true;
			}
		}
		return false;
	}
	
	function checkBackspaceForNoEditable(elem)
	{
		var elem = elem.previousElementSibling;
		while (elem) {
		   if ((elem.contentEditable == "false" || elem.readonly == "true" || elem.classList.contains('lasso-undeletable')) && elem.tagName !="A") {
			   return true;
		   }
		   if (elem.innerHTML.includes("<!--") || jQuery.trim( elem.innerHTML)==""){
			   elem = elem.previousElementSibling;
		   } else {
			   return false;
		   }
		};
		return false;
	}
	
	function checkDeleteForNoEditable(elem)
	{
		var elem = elem.nextElementSibling;
		while (elem) {
		   if ((elem.contentEditable == "false" || elem.readonly == "true" || elem.classList.contains('lasso-undeletable')) && elem.tagName !="A"){
			   return true;
		   }
		   if (elem.innerHTML.includes("<!--") || jQuery.trim( elem.innerHTML)==""){
			   elem = elem.nextElementSibling;
		   } else {
			   return false;
		   }
		};
		return false;
	}
	
	var Medium = (function () {
		
		var trim = function (string) {
				return string.replace(/^\s+|\s+$/g, '');
			},
			arrayContains = function (array, variable) {
				var i = array.length;
				while (i--) {
					if (array[i] === variable) {
						return true;
					}
				}
				return false;
			},
		    //two modes, wild (native) or domesticated (rangy + undo.js)
			rangy = w['rangy'] || null,
			undo = w['Undo'] || null,
			wild = (!rangy || !undo),
			domesticated = (!wild),
			key = w.Key = {
				'backspace': 8,
				'tab': 9,
				'enter': 13,
				'shift': 16,
				'ctrl': 17,
				'alt': 18,
				'pause': 19,
				'capsLock': 20,
				'escape': 27,
				'pageUp': 33,
				'pageDown': 34,
				'end': 35,
				'home': 36,
				'leftArrow': 37,
				'upArrow': 38,
				'rightArrow': 39,
				'downArrow': 40,
				'insert': 45,
				'delete': 46,
				'0': 48,
				'1': 49,
				'2': 50,
				'3': 51,
				'4': 52,
				'5': 53,
				'6': 54,
				'7': 55,
				'8': 56,
				'9': 57,
				'a': 65,
				'b': 66,
				'c': 67,
				'd': 68,
				'e': 69,
				'f': 70,
				'g': 71,
				'h': 72,
				'i': 73,
				'j': 74,
				'k': 75,
				'l': 76,
				'm': 77,
				'n': 78,
				'o': 79,
				'p': 80,
				'q': 81,
				'r': 82,
				's': 83,
				't': 84,
				'u': 85,
				'v': 86,
				'w': 87,
				'x': 88,
				'y': 89,
				'z': 90,
				'leftWindow': 91,
				'rightWindowKey': 92,
				'select': 93,
				'numpad0': 96,
				'numpad1': 97,
				'numpad2': 98,
				'numpad3': 99,
				'numpad4': 100,
				'numpad5': 101,
				'numpad6': 102,
				'numpad7': 103,
				'numpad8': 104,
				'numpad9': 105,
				'multiply': 106,
				'add': 107,
				'subtract': 109,
				'decimalPoint': 110,
				'divide': 111,
				'f1': 112,
				'f2': 113,
				'f3': 114,
				'f4': 115,
				'f5': 116,
				'f6': 117,
				'f7': 118,
				'f8': 119,
				'f9': 120,
				'f10': 121,
				'f11': 122,
				'f12': 123,
				'numLock': 144,
				'scrollLock': 145,
				'semiColon': 186,
				'equalSign': 187,
				'comma': 188,
				'dash': 189,
				'period': 190,
				'forwardSlash': 191,
				'graveAccent': 192,
				'openBracket': 219,
				'backSlash': 220,
				'closeBraket': 221,
				'singleQuote': 222
			},

			/**
			 * Medium.js - Taking control of content editable
			 * @constructor
			 * @param {Object} [userSettings] user options
			 */
			Medium = function (userSettings) {
				var medium = this,
					action = new Medium.Action(),
					cache = new Medium.Cache(),
					cursor = new Medium.Cursor(),
					html = new Medium.HtmlAssistant(),
					utils = new Medium.Utilities(),
					selection = new Medium.Selection(),
					intercept = {
						focus: function (e) {
							e = e || w.event;
							Medium.activeElement = el;
						},
						blur: function (e) {
							e = e || w.event;
							if (Medium.activeElement === el) {
								Medium.activeElement = null;
							}

							html.placeholders();
						},
						down: function (e) {
							e = e || w.event;

							var keepEvent = true;

							//in Chrome it sends out this event before every regular event, not sure why
							if (e.keyCode === 229) return;

							utils.isCommand(e, function () {
								cache.cmd = true;
							}, function () {
								cache.cmd = false;
							});

							utils.isShift(e, function () {
								cache.shift = true;
							}, function () {
								cache.shift = false;
							});

							utils.isModifier(e, function (cmd) {
								if (cache.cmd) {

									if (( (settings.mode === Medium.inlineMode) || (settings.mode === Medium.partialMode) ) && cmd !== "paste") {
										utils.preventDefaultEvent(e);
										return;
									}

									var cmdType = typeof cmd,
										fn = null;

									if (cmdType === "function") {
										fn = cmd;
									} else {
										fn = intercept.command[cmd];
									}

									keepEvent = fn.call(medium, e);

									if (keepEvent === false) {
										utils.preventDefaultEvent(e);
										utils.stopPropagation(e);
									}
								}
							});

							if (settings.maxLength !== -1) {
								var len = html.text().length,
									hasSelection = false,
									selection = w.getSelection();

								if (selection) {
									hasSelection = !selection.isCollapsed;
								}

								if (len >= settings.maxLength && !utils.isSpecial(e) && !utils.isNavigational(e) && !hasSelection) {
									return utils.preventDefaultEvent(e);
								}
							}

							switch (e.keyCode) {
								case key['enter']:
                                    //disable enter inside FIGURE
                                    var sel = w.getSelection();
									if (sel.rangeCount) {
										var selRange = sel.getRangeAt(0);
                                        if (window.getSelection().isCollapsed) {
                                            var container = selRange.endContainer;
                                            if (container.nodeName=="FIGURE") {

                                                e.preventDefault();
                                                break;
                                            }
                                        }
                                    }
									intercept.enterKey(e);
									break;
								case key['backspace']:
								case key['delete']:
								    // we do this to prevent non editable elments being deleted
									if (lasso_editor.readOnlyExists) {
										var sel = w.getSelection();
										if (sel.rangeCount) {
											var selRange = sel.getRangeAt(0);
											if (window.getSelection().isCollapsed) {
												var container = selRange.endContainer;
												var container1 = container;
												while (container && container.parentNode !== articleMedium.element) {
													var nodes = container.parentNode.querySelectorAll("[contenteditable='false']");
													if (nodes.length >0) {
														break;
													}
													container = container.parentNode;
												} 	
												if (container.contentEditable == "false") {
													e.preventDefault();
												}											
												if (e.keyCode == key['backspace'] && checkBackspaceForNoEditable(container)){
													if (sel.focusOffset == 0 ) {
														e.preventDefault();
													} else if (container1.length == sel.focusOffset && container1.length == 1) {
														e.preventDefault();
														container1.data = "";
													}
												} else if (e.keyCode == key['delete'] &&  checkDeleteForNoEditable(container)) {
												    if (sel.focusOffset == sel.focusNode.length || sel.focusNode.length === undefined) {
														e.preventDefault();
													} else if (container1.length == 1 && sel.focusOffset == 0){
														e.preventDefault();
														container1.data = "";
													}
												}
											} else {
												// check if the selection contains noneditable element
												if (checkNonEditable(e,selRange)) {
													   break;
													}
												}
										}
									}
									// the undeletable elements can be edited unlike the readonly elements, but should not be deleted
									// they are marked with class lasso-undeletable
									if (lasso_editor.undeletableExists) {
										var sel = w.getSelection();
										if (sel.rangeCount) {
											var selRange = sel.getRangeAt(0);
											if (window.getSelection().isCollapsed) {
												var container1 = selRange.endContainer;
												var container = container1.parentNode;
												while (container !== articleMedium.element) {	
													if (container.classList.contains('lasso-undeletable')) {
														if (e.keyCode == key['backspace']) {
															if (sel.focusOffset == 0 ) {
																e.preventDefault();
															} else if (container1.length == sel.focusOffset && container1.length == 1) {
																e.preventDefault();
																container1.data = "";
															}
														} else if (e.keyCode == key['delete']) {
															if (sel.focusOffset == sel.focusNode.length || sel.focusNode.length === undefined) {
																e.preventDefault();
															} else if (container1.length == 1 && sel.focusOffset == 0){
																e.preventDefault();
																container1.data = "";
															}
														}
														break;
													}
													container = container.parentNode;
												} 	
												
											} else {
												// check if the selection contains non deletable element
												var nodes = selRange.cloneContents().querySelectorAll(".lasso-undeletable");
												if (nodes.length) {
													e.preventDefault();
												}
											}
										}
									}
									intercept.backspaceOrDeleteKey(e);
									break;
								default: 
									if (lasso_editor.readOnlyExists || lasso_editor.undeletableExists) {
										var sel = w.getSelection();
										if (sel.rangeCount) {
											var selRange = sel.getRangeAt(0);
											if (!window.getSelection().isCollapsed) {
												if (checkNonEditable(e, selRange)) {
													break;
												}	
												// check if the selection contains non deletable element
												var nodes = selRange.cloneContents().querySelectorAll(".lasso-undeletable");
												if (nodes.length) {
													e.preventDefault();
												}
											}
										}
									}
							}

							return keepEvent;
						},
						up: function (e) {
							e = e || w.event;
							utils.isCommand(e, function () {
								cache.cmd = false;
							}, function () {
								cache.cmd = true;
							});
							html.clean();
							html.placeholders();

							//here we have a key context, so if you need to create your own object within a specific context it is doable
							var keyContext;
							if (
								settings.keyContext !== null
								&& ( keyContext = settings.keyContext[e.keyCode] )
							) {
								var el = cursor.parent();

								if (el) {
									keyContext.call(medium, e, el);
								}
							}
                            
                            lasso_editor.checkForPopup();

							action.preserveElementFocus();
						},
						command: {
							bold: function (e) {
								utils.preventDefaultEvent(e);
								// IE uses strong instead of b
								(new Medium.Element(medium, 'bold'))
									.setClean(false)
									.invoke(settings.beforeInvokeElement);
							},
							underline: function (e) {
								utils.preventDefaultEvent(e);
								(new Medium.Element(medium, 'underline'))
									.setClean(false)
									.invoke(settings.beforeInvokeElement);
							},
							italicize: function (e) {
								utils.preventDefaultEvent(e);
								(new Medium.Element(medium, 'italic'))
									.setClean(false)
									.invoke(settings.beforeInvokeElement);
							},
							quote: function (e) {
							},
							paste: function (e) {
								medium.makeUndoable();
								/*if (settings.pasteAsText) {
									var sel = utils.selection.saveSelection();
									utils.pasteHook(function (text) {
										utils.selection.restoreSelection(sel);

										text = text.replace(/\n/g, '<br>');

										(new Medium.Html(medium, text))
											.setClean(false)
											.insert(settings.beforeInsertHtml, true);

										html.clean();
										html.placeholders();
									});
								} else {
									html.clean();
									html.placeholders();
								}*/
							}
						},
						enterKey: function (e) {
							if (settings.mode === Medium.inlineMode) {
								return utils.preventDefaultEvent(e);
							}

							if (!cache.shift) {

								var focusedElement = html.atCaret() || {},
									children = el.children,
									lastChild = focusedElement === el.lastChild ? el.lastChild : null,
									makeHR,
									secondToLast,
									paragraph;

								if (
									lastChild
									&& lastChild !== el.firstChild
									&& settings.autoHR
									&& settings.mode !== 'partial'
									&& settings.tags.horizontalRule
								) {

									utils.preventDefaultEvent(e);

									makeHR =
										html.text(lastChild) === ""
										&& lastChild.nodeName.toLowerCase() === settings.tags.paragraph;

									if (makeHR && children.length >= 2) {
										secondToLast = children[children.length - 2];

										if (secondToLast.nodeName.toLowerCase() === settings.tags.horizontalRule) {
											makeHR = false;
										}
									}

									if (makeHR) {
										html.addTag(settings.tags.horizontalRule, false, true, focusedElement);
										focusedElement = focusedElement.nextSibling;
									}

									if ((paragraph = html.addTag(settings.tags.paragraph, true, null, focusedElement)) !== null) {
										paragraph.innerHTML = '';
										cursor.set(0, paragraph);
									}
								}
							}

							return true;
						},
						backspaceOrDeleteKey: function (e) {
							if (el.lastChild === null) return;

							var lastChild = el.lastChild,
								beforeLastChild = lastChild.previousSibling;

							if (
								lastChild
								&& settings.tags.horizontalRule
								&& lastChild.nodeName.toLocaleLowerCase() === settings.tags.horizontalRule
							) {
								el.removeChild(lastChild);
							} else if (
								lastChild
								&& beforeLastChild
								&& utils.html.text(lastChild).length < 1

								&& beforeLastChild.nodeName.toLowerCase() === settings.tags.horizontalRule
								&& lastChild.nodeName.toLowerCase() === settings.tags.paragraph
							) {
								el.removeChild(lastChild);
								el.removeChild(beforeLastChild);
							}
						}
					},
					defaultSettings = {
						element: null,
						modifier: 'auto',
						placeholder: "",
						autofocus: false,
						autoHR: true,
						mode: Medium.richMode,
						maxLength: -1,
						modifiers: {
							'b': 'bold',
							'i': 'italicize',
							'u': 'underline',
							'v': 'paste'
						},
						tags: {
							'break': 'br',
							'horizontalRule': 'hr',
							'paragraph': 'p',
							'outerLevel': ['pre', 'blockquote', 'figure'],
							'innerLevel': ['a', 'b', 'u', 'i', 'img', 'strong']
						},
						cssClasses: {
							editor: 'Medium',
							pasteHook: 'Medium-paste-hook',
							placeholder: 'Medium-placeholder',
							clear: 'Medium-clear'
						},
						attributes: {
							remove: ['style', 'class']
						},
						pasteAsText: true,
						beforeInvokeElement: function () {
							//this = Medium.Element
						},
						beforeInsertHtml: function () {
							//this = Medium.Html
						},
						beforeAddTag: function (tag, shouldFocus, isEditable, afterElement) {
						},
						keyContext: null,
						pasteEventHandler: function (e) {
							e = e || w.event;
							medium.makeUndoable();
							var length = medium.value().length;

							if (settings.pasteAsText) {
								var t = e.clipboardData.getData('text/html');
								utils.preventDefaultEvent(e);
								if (t.length ==0 )
								{
									t = e.clipboardData.getData('text/plain');
									t = t.replace(/\n/g, '<br>');
								}
								var
									sel = utils.selection.saveSelection(),
									text = t;//prompt(Medium.Messages.pastHere) || '';

								el.focus();
								Medium.activeElement = el;
								utils.selection.restoreSelection(sel);
								if (text.match(/microsoft-com/)) {
									// if the source is ms word
									text = e.clipboardData.getData('text/plain');
									text = text.replace(/\n/g, '<br>');
								} else {
									//limit its length
									//totalLength = text.length + length;
									//if (settings.maxLength > 0 && totalLength > settings.maxLength) {
									//	text = text.substring(0, settings.maxLength - length);
									//}

									
									text = text.replace(/<\/p>/g, '<br>');
									var regex = /<(?=(?!\/a))(?=(?!a ))(?=(?!br))([^>]+)>/ig;
									text = text.replace(regex, "");
									regex = /style=\"[^\"]+\"/ig;
									text = text.replace(regex, "");
									
								} 
								(new Medium.Html(medium, text))
										.setClean(false)
										.insert(settings.beforeInsertHtml, true);

								html.clean();
								html.placeholders();

								return false;
							} else {
								setTimeout(function () {
									html.clean();
									html.placeholders();
								}, 20);
							}
						}
					},
					settings = utils.deepExtend(defaultSettings, userSettings),
					el,
					newVal,
					i,
					bridge = {};

				for (i in defaultSettings) {
					// Override defaults with data-attributes
					if (
						typeof defaultSettings[i] !== 'object'
						&& defaultSettings.hasOwnProperty(i)
						&& settings.element.getAttribute('data-medium-' + key)
					) {
						newVal = settings.element.getAttribute('data-medium-' + key);

						if (newVal.toLowerCase() === "false" || newVal.toLowerCase() === "true") {
							newVal = newVal.toLowerCase() === "true";
						}
						settings[i] = newVal;
					}
				}

				if (settings.modifiers) {
					for (i in settings.modifiers) {
						if (typeof(key[i]) !== 'undefined') {
							settings.modifiers[key[i]] = settings.modifiers[i];
						}
					}
				}

				if (settings.keyContext) {
					for (i in settings.keyContext) {
						if (typeof(key[i]) !== 'undefined') {
							settings.keyContext[key[i]] = settings.keyContext[i];
						}
					}
				}

				// Extend Settings
				el = settings.element;

				// Editable, 
				//set all editable elements to explicitly editable
				var y = el.children;
				var i;
				for (i = 0; i < y.length; i++) {
					if (y[i].contentEditable != false) {
					   y[i].contentEditable = true;
					} 
				}
				
				el.contentEditable = true;
				el.className
					+= (' ' + settings.cssClasses.editor)
				+ (' ' + settings.cssClasses.editor + '-' + settings.mode);

				settings.tags = (settings.tags || {});
				if (settings.tags.outerLevel) {
					settings.tags.outerLevel = settings.tags.outerLevel.concat([settings.tags.paragraph, settings.tags.horizontalRule]);
				}

				this.settings = settings;
				this.element = el;
				this.intercept = intercept;

				this.action = action;
				this.cache = cache;
				this.cursor = cursor;
				this.html = html;
				this.utils = utils;
				this.selection = selection;

				bridge.element = el;
				bridge.medium = this;
				bridge.settings = settings;

				bridge.action = action;
				bridge.cache = cache;
				bridge.cursor = cursor;
				bridge.html = html;
				bridge.intercept = intercept;
				bridge.utils = utils;
				bridge.selection = selection;

				action.setBridge(bridge);
				cache.setBridge(bridge);
				cursor.setBridge(bridge);
				html.setBridge(bridge);
				utils.setBridge(bridge);
				selection.setBridge(bridge);

				// Initialize editor
				html.clean();
				html.placeholders();
				action.preserveElementFocus();

				// Capture Events
				action.listen();

				if (wild) {
					this.makeUndoable = function () {
					};
				} else {
					this.dirty = false;
					this.undoable = new Medium.Undoable(this);
					this.undo = this.undoable.undo;
					this.redo = this.undoable.redo;
					this.makeUndoable = this.undoable.makeUndoable;
				}

				el.medium = this;

				// Set as initialized
				cache.initialized = true;
			};

		Medium.prototype = {
			/**
			 *
			 * @param {String|Object} html
			 * @param {Function} [callback]
			 * @returns {Medium}
			 */
			insertHtml: function (html, callback) {
				var result = (new Medium.Html(this, html))
					.insert(this.settings.beforeInsertHtml);

				this.utils.triggerEvent(this.element, "change");

				if (callback) {
					callback.apply(result);
				}

				return this;
			},

			/**
			 *
			 * @param {String} tagName
			 * @param {Object} [attributes]
			 * @returns {Medium}
			 */
			invokeElement: function (tagName, attributes) {
				var settings = this.settings,
					attributes = attributes || {},
					remove = attributes.remove || [];

				switch (settings.mode) {
					case Medium.inlineMode:
					case Medium.partialMode:
						return this;
					default:
				}

				//invoke works off class, so if it isn't there, we just add it
				if (remove.length > 0) {
					if (!arrayContains(settings, 'class')) {
						remove.push('class');
					}
				}

				(new Medium.Element(this, tagName, attributes))
					.invoke(this.settings.beforeInvokeElement);

				this.utils.triggerEvent(this.element, "change");

				return this;
			},

			/**
			 * @returns {string}
			 */
			behavior: function () {
				return (wild ? 'wild' : 'domesticated');
			},

			/**
			 *
			 * @param value
			 * @returns {Medium}
			 */
			value: function (value) {
				if (typeof value !== 'undefined') {
					this.element.innerHTML = value;

					this.html.clean();
					this.html.placeholders();
				} else {
					return this.element.innerHTML;
				}

				return this;
			},

			/**
			 * Focus on element
			 * @returns {Medium}
			 */
			focus: function () {
				var el = this.element;
				el.focus();
				return this;
			},

			/**
			 * Select all text
			 * @returns {Medium}
			 */
			select: function () {
				var el = this.element,
					range,
					selection;

				el.focus();

				if (d.body.createTextRange) {
					range = d.body.createTextRange();
					range.moveToElementText(el);
					range.select();
				} else if (w.getSelection) {
					selection = w.getSelection();
					range = d.createRange();
					range.selectNodeContents(el);
					selection.removeAllRanges();
					selection.addRange(range);
				}

				return this;
			},

			isActive: function () {
				return (Medium.activeElement === this.element);
			},

			destroy: function () {
				var el = this.element,
					intercept = this.intercept,
					settings = this.settings,
					placeholder = this.placeholder || null;

				if (placeholder !== null && placeholder.setup) {
					//remove placeholder
					placeholder.parentNode.removeChild(placeholder);
					delete el.placeHolderActive;
				}

				//remove contenteditable
				el.removeAttribute('contenteditable');

				//remove classes
				el.className = trim(el.className
					.replace(settings.cssClasses.editor, '')
					.replace(settings.cssClasses.clear, '')
					.replace(settings.cssClasses.editor + '-' + settings.mode, ''));

				//remove events
				this.utils
					.removeEvent(el, 'keyup', intercept.up)
					.removeEvent(el, 'keydown', intercept.down)
					.removeEvent(el, 'focus', intercept.focus)
					.removeEvent(el, 'blur', intercept.focus)
					.removeEvent(el, 'paste', settings.pasteEventHandler);
			},

			// Clears the element and restores the placeholder
			clear: function () {
				this.element.innerHTML = '';
				this.html.placeholders();
			}
		};

		/**
		 * @param {Medium} medium
		 * @param {String} tagName
		 * @param {Object} [attributes]
		 * @constructor
		 */
		Medium.Element = function (medium, tagName, attributes) {
			this.medium = medium;
			this.element = medium.settings.element;
			if (wild) {
				this.tagName = tagName;
			} else {
				switch (tagName.toLowerCase()) {
					case 'bold':
						this.tagName = 'b';
						break;
					case 'italic':
						this.tagName = 'i';
						break;
					case 'underline':
						this.tagName = 'u';
						break;
					default:
						this.tagName = tagName;
				}
			}
			this.attributes = attributes || {};
			this.clean = true;
		};


		/**
		 * @constructor
		 * @param {Medium} medium
		 * @param {String|HtmlElement} html
		 */
		Medium.Html = function (medium, html) {
			this.medium = medium;
			this.element = medium.settings.element;
			this.html = html;
			this.clean = true;
		};

		/**
		 *
		 * @constructor
		 */
		Medium.Injector = function () {
		};

		if (wild) {
			Medium.Element.prototype = {
				/**
				 * @methodOf Medium.Element
				 * @param {Function} [fn]
				 */
				invoke: function (fn) {
					if (Medium.activeElement === this.element) {
						if (fn) {
							fn.apply(this);
						}
						d.execCommand(this.tagName, false);
					}
				},
				setClean: function () {
					return this;
				}
			};

			Medium.Injector.prototype = {
				/**
				 * @methodOf Medium.Injector
				 * @param {String|HtmlElement} htmlRaw
				 * @param {Boolean} [selectInserted]
				 * @returns {null}
				 */
				inject: function (htmlRaw, selectInserted) {
					this.insertHTML(htmlRaw, selectInserted);
					return null;
				}
			};

			/**
			 *
			 * @constructor
			 */
			Medium.Undoable = function () {
			};
		}

		//if medium is domesticated (ie, not wild)
		else {
			rangy.rangePrototype.insertNodeAtEnd = function (node) {
				var range = this.cloneRange();
				range.collapse(false);
				range.insertNode(node);
				range.detach();
				this.setEndAfter(node);
			};

			Medium.Element.prototype = {
				/**
				 * @methodOf Medium.Element
				 * @param {Function} [fn]
				 */
				invoke: function (fn) {
					if (Medium.activeElement === this.element) {
						if (fn) {
							fn.apply(this);
						}

						var
							attr = this.attributes,
							tagName = this.tagName.toLowerCase(),
							applier,
							cl;

						if (attr.className !== undefined) {
							cl = (attr.className.split[' '] || [attr.className]).shift();
							delete attr.className;
						} else {
							cl = 'lasso-noclass';
						}

						applier = rangy.createClassApplier(cl, {
							elementTagName: tagName,
							elementAttributes: this.attributes
						});

						//this.medium.makeUndoable();

						applier.toggleSelection(w);

						if (this.clean) {
							//cleanup
							this.medium.html.clean();
							this.medium.html.placeholders();
						}


					}
				},

				/**
				 *
				 * @param {Boolean} clean
				 * @returns {Medium.Element}
				 */
				setClean: function (clean) {
					this.clean = clean;
					return this;
				}
			};

			Medium.Injector.prototype = {
				/**
				 * @methodOf Medium.Injector
				 * @param {String|HtmlElement} htmlRaw
				 * @returns {HtmlElement}
				 */
				inject: function (htmlRaw) {
					var html, isConverted = false;
					if (typeof htmlRaw === 'string') {
						var htmlConverter = d.createElement('div');
						htmlConverter.innerHTML = htmlRaw;
						html = htmlConverter.childNodes;
						isConverted = true;
					} else {
						html = htmlRaw;
					}

					this.insertHTML('<span id="wedge"></span>');

					var wedge = d.getElementById('wedge'),
						parent = wedge.parentNode,
						i = 0;
					wedge.removeAttribute('id');

					if (isConverted) {
						while (i < html.length) {
							parent.insertBefore(html[i], wedge);
						}
					} else {
						parent.insertBefore(html, wedge);
					}
					parent.removeChild(wedge);
					wedge = null;

					return html;
				}
			};

			/**
			 * @param {Medium} medium
			 * @constructor
			 */
			Medium.Undoable = function (medium) {
				var me = this,
					element = medium.settings.element,
					utils = medium.utils,
					addEvent = utils.addEvent,
					startValue = element.innerHTML,
					timer,
					stack = new Undo.Stack(),
					EditCommand = Undo.Command.extend({
						constructor: function (oldValue, newValue) {
							this.oldValue = oldValue;
							this.newValue = newValue;
						},
						execute: function () {
						},
						undo: function () {
							element.innerHTML = this.oldValue;
							startValue = this.oldValue;
							medium.canUndo = stack.canUndo();
							medium.canRedo = stack.canRedo();
							medium.dirty = stack.dirty();
						},
						redo: function () {
							element.innerHTML = this.newValue;
							medium.canUndo = stack.canUndo();
							medium.canRedo = stack.canRedo();
							medium.dirty = stack.dirty();
						}
					}),
					makeUndoable = function () {
						var newValue = element.innerHTML;
						// ignore meta key presses
						if (newValue != startValue) {

							if (!me.movingThroughStack) {
								// this could try and make a diff instead of storing snapshots
								stack.execute(new EditCommand(startValue, newValue));
								startValue = newValue;
								medium.dirty = stack.dirty();
							}

							utils.triggerEvent(medium.settings.element, "change");
						}
					};

				this.medium = medium;
				this.timer = timer;
				this.stack = stack;
				this.makeUndoable = makeUndoable;
				this.EditCommand = EditCommand;
				this.movingThroughStack = false;

				addEvent(element, 'keyup', function (e) {
					if (e.ctrlKey || e.keyCode === key.z) {
						utils.preventDefaultEvent(e);
						return;
					}

					// a way too simple algorithm in place of single-character undo
					clearTimeout(timer);
					timer = setTimeout(function () {
						makeUndoable();
						// check if we need to add the component button
						lasso_editor.addComponentButton();
					}, 250);
				});

				addEvent(element, 'keydown', function (e) {
					if (!e.ctrlKey || e.keyCode !== key.z) {
						me.movingThroughStack = false;
						return true;
					}

					utils.preventDefaultEvent(e);

					if (e.shiftKey) {
						me.movingThroughStack = true;
						stack.canRedo() && stack.redo()
					} else {
						me.movingThroughStack = true;
						stack.canUndo() && stack.undo();
					}
					me.movingThroughStack = false;
				});
			};
		}

		//Thank you Tim Down (super uber genius): http://stackoverflow.com/questions/6690752/insert-html-at-caret-in-a-contenteditable-div/6691294#6691294
		Medium.Injector.prototype.insertHTML = function (html, selectPastedContent) {
			var sel, range;
			if (window.getSelection) {
				// IE9 and non-IE
				sel = window.getSelection();
				if (sel.getRangeAt && sel.rangeCount) {
					range = sel.getRangeAt(0);
					range.deleteContents();

					// Range.createContextualFragment() would be useful here but is
					// only relatively recently standardized and is not supported in
					// some browsers (IE9, for one)
					var el = d.createElement("div");
					el.innerHTML = html;
					var frag = d.createDocumentFragment(), node, lastNode;
					while ((node = el.firstChild)) {
						lastNode = frag.appendChild(node);
					}
					var firstNode = frag.firstChild;
					range.insertNode(frag);

					// Preserve the selection
					if (lastNode) {
						range = range.cloneRange();
						range.setStartAfter(lastNode);
						if (selectPastedContent) {
							range.setStartBefore(firstNode);
						} else {
							range.collapse(true);
						}
						sel.removeAllRanges();
						sel.addRange(range);
					}
				}
			} else if ((sel = d.selection) && sel.type != "Control") {
				// IE < 9
				var originalRange = sel.createRange();
				originalRange.collapse(true);
				sel.createRange().pasteHTML(html);
				if (selectPastedContent) {
					range = sel.createRange();
					range.setEndPoint("StartToStart", originalRange);
					range.select();
				}
			}
		};

		Medium.Html.prototype = {
			setBridge: function (bridge) {
				for (var i in bridge) {
					this[i] = bridge[i];
				}
			},
			/**
			 * @methodOf Medium.Html
			 * @param {Function} [fn]
			 * @param {Boolean} [selectInserted]
			 * @returns {HtmlElement}
			 */
			insert: function (fn, selectInserted) {
				if (Medium.activeElement === this.element) {
					if (fn) {
						fn.apply(this);
					}

					var inserted = this.injector.inject(this.html, selectInserted);

					if (this.clean) {
						//cleanup
						this.medium.html.clean();
						this.medium.html.placeholders();
					}

					this.medium.makeUndoable();

					return inserted;
				} else {
					return null;
				}
			},

			/**
			 * @attributeOf {Medium.Injector} Medium.Html
			 */
			injector: new Medium.Injector(),

			/**
			 * @methodOf Medium.Html
			 * @param clean
			 * @returns {Medium.Html}
			 */
			setClean: function (clean) {
				this.clean = clean;
				return this;
			}
		};

		Medium.Utilities = function () {
		};
		Medium.Utilities.prototype = {
			setBridge: function (bridge) {
				for (var i in bridge) {
					this[i] = bridge[i];
				}
			},
			/*
			 * Keyboard Interface events
			 */
			isCommand: function (e, fnTrue, fnFalse) {
				var s = this.settings;
				if ((s.modifier === 'ctrl' && e.ctrlKey ) ||
					(s.modifier === 'cmd' && e.metaKey ) ||
					(s.modifier === 'auto' && (e.ctrlKey || e.metaKey) )
				) {
					return fnTrue.call();
				} else {
					return fnFalse.call();
				}
			},
			isShift: function (e, fnTrue, fnFalse) {
				if (e.shiftKey) {
					return fnTrue.call();
				} else {
					return fnFalse.call();
				}
			},
			isModifier: function (e, fn) {
				var cmd = this.settings.modifiers[e.keyCode];
				if (cmd) {
					return fn.call(null, cmd);
				}
				return false;
			},
			special: (function () {
				var special = {};

				special[key['backspace']] = true;
				special[key['shift']] = true;
				special[key['ctrl']] = true;
				special[key['alt']] = true;
				special[key['delete']] = true;
				special[key['cmd']] = true;

				return special;
			})(),
			isSpecial: function (e) {

				if (this.cache.cmd) {
					return true;
				}

				return typeof this.special[e.keyCode] !== 'undefined';
			},
			navigational: (function () {
				var navigational = {};

				navigational[key['upArrow']] = true;
				navigational[key['downArrow']] = true;
				navigational[key['leftArrow']] = true;
				navigational[key['rightArrow']] = true;

				return navigational;
			})(),
			isNavigational: function (e) {
				return typeof this.navigational[e.keyCode] !== 'undefined';
			},

			/*
			 * Handle Events
			 */
			addEvent: function addEvent(element, eventName, func) {
				if (element.addEventListener) {
					element.addEventListener(eventName, func, false);
				} else if (element.attachEvent) {
					element.attachEvent("on" + eventName, func);
				} else {
					element['on' + eventName] = func;
				}

				return this;
			},
			removeEvent: function removeEvent(element, eventName, func) {
				if (element.removeEventListener) {
					element.removeEventListener(eventName, func, false);
				} else if (element.detachEvent) {
					element.detachEvent("on" + eventName, func);
				} else {
					element['on' + eventName] = null;
				}

				return this;
			},
			preventDefaultEvent: function (e) {
				if (e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				}

				return this;
			},
			stopPropagation: function (e) {
				e = e || window.event;
				e.cancelBubble = true;

				if (e.stopPropagation !== undefined) {
					e.stopPropagation();
				}
			},
			triggerEvent: function (element, eventName) {
				var e;
				if (d.createEvent) {
					e = d.createEvent("HTMLEvents");
					e.initEvent(eventName, true, true);
					e.eventName = eventName;
					element.dispatchEvent(e);
				} else {
					e = d.createEventObject();
					element.fireEvent("on" + eventName, e);
				}

				return this;
			},

			deepExtend: function (destination, source) {
				for (var property in source) {
					if (
						source[property]
						&& source[property].constructor
						&& source[property].constructor === Object
					) {
						destination[property] = destination[property] || {};
						this.deepExtend(destination[property], source[property]);
					} else {
						destination[property] = source[property];
					}
				}
				return destination;
			},
			/*
			 * This is a Paste Hook. When the user pastes
			 * content, this ultimately converts it into
			 * plain text before inserting the data.
			 */
			pasteHook: function (fn) {
				/*var textarea = d.createElement('textarea'),
					el = this.element,
					existingValue,
					existingLength,
					overallLength,
					s = this.settings,
					medium = this.medium,
					html = this.html;

				textarea.className = s.cssClasses.pasteHook;

				el.parentNode.appendChild(textarea);

				//textarea.focus();

				if (!wild) {
					medium.makeUndoable();
				}
				setTimeout(function () {
					el.focus();
					if (s.maxLength > 0) {
						existingValue = html.text(el);
						existingLength = existingValue.length;
						overallLength = existingLength + textarea.value.length;
						if (overallLength > existingLength) {
							textarea.value = textarea.value.substring(0, s.maxLength - existingLength);
						}
					}
					fn(textarea.value);
					html.deleteNode(textarea);
				}, 2);*/
			},
			setupContents: function () {
				var el = this.element,
					children = el.children,
					childNodes = el.childNodes,
					initialParagraph;

				if (
					!this.settings.tags.paragraph
					|| children.length > 0
					|| this.settings.mode === Medium.inlineMode
				) {
					return;
				}

				//has content, but no children
				if (childNodes.length > 0) {
					initialParagraph = d.createElement(this.settings.tags.paragraph);
					if (el.innerHTML.match('^[&]nbsp[;]')) {
						el.innerHTML = el.innerHTML.substring(6, el.innerHTML.length - 1);
					}
					initialParagraph.innerHTML = el.innerHTML;
					el.innerHTML = '';
					el.appendChild(initialParagraph);
					this.cursor.set(initialParagraph.innerHTML.length, initialParagraph);
				} else {
					initialParagraph = d.createElement(this.settings.tags.paragraph);
					initialParagraph.innerHTML = '&nbsp;';
					el.appendChild(initialParagraph);
				}
			},
			traverseAll: function (element, options, depth) {
				var children = element.childNodes,
					length = children.length,
					i = 0,
					node,
					depth = depth || 1;

				options = options || {};

				if (length > 0) {
					for (; i < length; i++) {
						node = children[i];
						switch (node.nodeType) {
							case 1:
								this.traverseAll(node, options, depth + 1);
								if (options.element !== undefined) options.element(node, i, depth, element);
								break;
							case 3:
								if (options.fragment !== undefined) options.fragment(node, i, depth, element);
						}

						//length may change
						length = children.length;
						//if length did change, and we are at the last item, this causes infinite recursion, so if we are at the last item, then stop to prevent this
						if (node === element.lastChild) {
							i = length;
						}
					}
				}

			}
		};

		/*
		 * Handle Selection Logic
		 */
		Medium.Selection = function () {
		};
		Medium.Selection.prototype = {
			setBridge: function (bridge) {
				for (var i in bridge) {
					this[i] = bridge[i];
				}
			},
			saveSelection: function () {
				if (w.getSelection) {
					var sel = w.getSelection();
					if (sel.rangeCount > 0) {
						return sel.getRangeAt(0);
					}
				} else if (d.selection && d.selection.createRange) { // IE
					return d.selection.createRange();
				}
				return null;
			},

			restoreSelection: function (range) {
				if (range) {
					if (w.getSelection) {
						var sel = w.getSelection();
						sel.removeAllRanges();
						sel.addRange(range);
					} else if (d.selection && range.select) { // IE
						range.select();
					}
				}
			}
		};

		/*
		 * Handle Cursor Logic
		 */
		Medium.Cursor = function () {
		};
		Medium.Cursor.prototype = {
			setBridge: function (bridge) {
				for (var i in bridge) {
					this[i] = bridge[i];
				}
			},
			set: function (pos, el) {
				var range,
					html = this.html;

				if (d.createRange) {
					var selection = w.getSelection(),
						lastChild = html.lastChild(),
						length = html.text(lastChild).length - 1,
						toModify = el ? el : lastChild,
						theLength = ((typeof pos !== 'undefined') && (pos !== null) ? pos : length);

					range = d.createRange();
					range.setStart(toModify, theLength);
					range.collapse(true);
					selection.removeAllRanges();
					selection.addRange(range);
				} else {
					range = d.body.createTextRange();
					range.moveToElementText(el);
					range.collapse(false);
					range.select();
				}
			},
			parent: function () {
				var target = null, range;

				if (w.getSelection) {
					range = w.getSelection().getRangeAt(0);
					target = range.commonAncestorContainer;

					target = (target.nodeType === 1
						? target
						: target.parentNode
					);
				}

				else if (d.selection) {
					target = d.selection.createRange().parentElement();
				}

				if (target.tagName == 'SPAN') {
					target = target.parentNode;
				}

				return target;
			},
			caretToBeginning: function (el) {
				this.set(0, el);
			},
			caretToEnd: function (el) {
				this.set(this.html.text(el).length, el);
			}
		};

		/*
		 * HTML Abstractions
		 */
		Medium.HtmlAssistant = function () {
		};
		Medium.HtmlAssistant.prototype = {
			setBridge: function (bridge) {
				for (var i in bridge) {
					this[i] = bridge[i];
				}
			},
			encodeHtml: function (html) {
				return d.createElement('a').appendChild(
					d.createTextNode(html)).parentNode.innerHTML;
			},
			text: function (node, val) {
				node = node || this.settings.element;
				if (val) {
					if ((node.textContent) && (typeof (node.textContent) != "undefined")) {
						node.textContent = val;
					} else {
						node.innerText = val;
					}
				}

				else if (node.innerText) {
					return trim(node.innerText);
				}

				else if (node.textContent) {
					return trim(node.textContent);
				}
				//document fragment
				else if (node.data) {
					return trim(node.data);
				}

				//for good measure
				return '';
			},
			changeTag: function (oldNode, newTag) {
				var newNode = d.createElement(newTag),
					node,
					nextNode;

				node = oldNode.firstChild;
				while (node) {
					nextNode = node.nextSibling;
					newNode.appendChild(node);
					node = nextNode;
				}

				oldNode.parentNode.insertBefore(newNode, oldNode);
				oldNode.parentNode.removeChild(oldNode);

				return newNode;
			},
			deleteNode: function (el) {
				el.parentNode.removeChild(el);
			},
			placeholders: function () {
				//in IE8, just gracefully degrade to no placeholders
				if (!w.getComputedStyle) return;

				var that = this,
					s = this.settings,
					placeholder = this.medium.placeholder || (this.medium.placeholder = d.createElement('div')),
					el = s.element,
					style = placeholder.style,
					elStyle = w.getComputedStyle(el, null),
					qStyle = function (prop) {
						return elStyle.getPropertyValue(prop)
					},
					utils = this.utils,
					text = utils.html.text(el),
					cursor = this.cursor,
					childCount = el.children.length;

				el.placeholder = placeholder;

				// Empty Editor
				if (text.length < 1 && childCount < 2) {
                    //the behavior when the editable content becomes empty.
                    //simplified from the previous version
					el.innerHTML = '<p><br></p>';
                 
					/*if (el.placeHolderActive) return;

					if (!el.innerHTML.match('<' + s.tags.paragraph)) {
						el.innerHTML = '';
					}

					// We need to add placeholders
					if (s.placeholder.length > 0) {
						if (!placeholder.setup) {
							placeholder.setup = true;

							//background & background color
							style.background = qStyle('background');
							style.backgroundColor = qStyle('background-color');

							//text size & text color
							style.fontSize = qStyle('font-size');
							style.color = elStyle.color;

							//begin box-model
							//margin
							style.marginTop = qStyle('margin-top');
							style.marginBottom = qStyle('margin-bottom');
							style.marginLeft = qStyle('margin-left');
							style.marginRight = qStyle('margin-right');

							//padding
							style.paddingTop = qStyle('padding-top');
							style.paddingBottom = qStyle('padding-bottom');
							style.paddingLeft = qStyle('padding-left');
							style.paddingRight = qStyle('padding-right');

							//border
							style.borderTopWidth = qStyle('border-top-width');
							style.borderTopColor = qStyle('border-top-color');
							style.borderTopStyle = qStyle('border-top-style');
							style.borderBottomWidth = qStyle('border-bottom-width');
							style.borderBottomColor = qStyle('border-bottom-color');
							style.borderBottomStyle = qStyle('border-bottom-style');
							style.borderLeftWidth = qStyle('border-left-width');
							style.borderLeftColor = qStyle('border-left-color');
							style.borderLeftStyle = qStyle('border-left-style');
							style.borderRightWidth = qStyle('border-right-width');
							style.borderRightColor = qStyle('border-right-color');
							style.borderRightStyle = qStyle('border-right-style');
							//end box model

							//element setup
							placeholder.className = s.cssClasses.placeholder + ' ' + s.cssClasses.placeholder + '-' + s.mode;
							placeholder.innerHTML = '<div>' + s.placeholder + '</div>';
							el.parentNode.insertBefore(placeholder, el);
						}

						el.className += ' ' + s.cssClasses.clear;

						style.display = '';
						// Add base P tag and do auto focus, give it a min height if el has one
						style.minHeight = el.clientHeight + 'px';
						style.minWidth = el.clientWidth + 'px';

						if (s.mode !== Medium.inlineMode) {
							utils.setupContents();

							if (childCount === 0 && el.firstChild) {
								cursor.set(0, el.firstChild);
							}
						}
					}
					el.placeHolderActive = true;*/
				} else if (el.placeHolderActive) {
					el.placeHolderActive = false;
					style.display = 'none';
					el.className = trim(el.className.replace(s.cssClasses.clear, ''));
					utils.setupContents();
				}
			},

			/**
			 * Cleans element
			 * @param {HtmlElement} [el] default is settings.element
			 */
			clean: function (el) {

				/*
				 * Deletes invalid nodes
				 * Removes Attributes
				 */
				var s = this.settings,
					placeholderClass = s.cssClasses.placeholder,
					attributesToRemove = (s.attributes || {}).remove || [],
					tags = s.tags || {},
					onlyOuter = tags.outerLevel || null,
					onlyInner = tags.innerLevel || null,
					outerSwitch = {},
					innerSwitch = {},
					paragraphTag = (tags.paragraph || '').toUpperCase(),
					html = this.html,
					attr,
					text,
					j;

				el = el || s.element;

				if (onlyOuter !== null) {
					for (j = 0; j < onlyOuter.length; j++) {
						outerSwitch[onlyOuter[j].toUpperCase()] = true;
					}
				}

				if (onlyInner !== null) {
					for (j = 0; j < onlyInner.length; j++) {
						innerSwitch[onlyInner[j].toUpperCase()] = true;
					}
				}

				this.utils.traverseAll(el, {
					element: function (child, i, depth, parent) {
						var nodeName = child.nodeName,
							shouldDelete = true;

						// Remove attributes
						for (j = 0; j < attributesToRemove.length; j++) {
							attr = attributesToRemove[j];
							if (child.hasAttribute(attr)) {
								if (child.getAttribute(attr) !== placeholderClass) {
									child.removeAttribute(attr);
								}
							}
						}

						if (onlyOuter === null && onlyInner === null) {
							return;
						}

						if (depth === 1 && outerSwitch[nodeName] !== undefined) {
							shouldDelete = false;
						} else if (depth > 1 && innerSwitch[nodeName] !== undefined) {
							shouldDelete = false;
						}

						// Convert tags or delete
						if (shouldDelete) {
							if (w.getComputedStyle(child, null).getPropertyValue('display') === 'block') {
								if (paragraphTag.length > 0 && paragraphTag !== nodeName) {
									html.changeTag(child, paragraphTag);
								}

								if (depth > 1) {
									while (parent.childNodes.length > i) {
										parent.parentNode.insertBefore(parent.lastChild, parent.nextSibling);
									}
								}
							} else {
								switch (nodeName) {
									case 'BR':
										if (child === child.parentNode.lastChild) {
											if (child === child.parentNode.firstChild) {
												break;
											}
											text = document.createTextNode("");
											text.innerHTML = '&nbsp';
											parent.insertBefore(text, child);
											break;
										}
									default:
										while (child.firstChild !== null) {
											parent.insertBefore(child.firstChild, child);
										}
										html.deleteNode(child);
										break;
								}
							}
						}
					}
				});
			},
			lastChild: function () {
				return this.element.lastChild;
			},
			addTag: function (tag, shouldFocus, isEditable, afterElement) {
				if (!this.settings.beforeAddTag(tag, shouldFocus, isEditable, afterElement)) {
					var newEl = d.createElement(tag),
						toFocus;

					if (typeof isEditable !== "undefined" && isEditable === false) {
						newEl.contentEditable = false;
					}
					if (newEl.innerHTML.length == 0) {
						newEl.innerHTML = ' ';
					}
					if (afterElement && afterElement.nextSibling) {
						afterElement.parentNode.insertBefore(newEl, afterElement.nextSibling);
						toFocus = afterElement.nextSibling;

					} else {
						this.settings.element.appendChild(newEl);
						toFocus = this.html.lastChild();
					}

					if (shouldFocus) {
						this.cache.focusedElement = toFocus;
						this.cursor.set(0, toFocus);
					}
					return newEl;
				}
				return null;
			},
			baseAtCaret: function () {
				if (!this.medium.isActive()) return null;

				var sel = w.getSelection ? w.getSelection() : document.selection;

				if (sel.rangeCount) {
					var selRange = sel.getRangeAt(0),
						container = selRange.endContainer;

					switch (container.nodeType) {
						case 3:
							if (container.data && container.data.length != selRange.endOffset) return false;
							break;
					}

					return container;
				}

				return null;
			},
			getTopLevel: function (container) {
				while (container && container.parentNode !== this.element) {
					container = container.parentNode;
				}
				return container;
			},
			atCaret: function () {
				var container = this.baseAtCaret() || {},
					el = this.element;

				if (container === false) return null;

				container = this.getTopLevel(container);
				//while (container && container.parentNode !== el) {
				//	container = container.parentNode;
				//}

				if (container && container.nodeType == 1) {
					return container;
				}

				return null;
			},
			textElementsAtCaret: function () {
				if (!this.medium.isActive()) return null;

				var sel = w.getSelection ? w.getSelection() : document.selection;

				if (sel.rangeCount) {
					var selRange = sel.getRangeAt(0),
						//container = selRange.endContainer;
						containerStart = this.getTopLevel(selRange.startContainer),
						containerEnd = this.getTopLevel(selRange.endContainer);

					var arr = [];
					while (true) {
						if (containerStart.nodeType ==1) { 
						    arr.push(containerStart);
						}
						if (containerStart === containerEnd || !containerStart.nextElementSibling) break;
                        containerStart = containerStart.nextElementSibling;					
					};
					
					//while (containerStart && containerStart.parentNode !== this.element) {
					//	containerStart = containerStart.parentNode;
					//}
					

					return arr;
				}

				return null;
			}
		};

		Medium.Action = function () {
		};
		Medium.Action.prototype = {
			setBridge: function (bridge) {
				for (var i in bridge) {
					this[i] = bridge[i];
				}
			},
			listen: function () {
				var el = this.element,
					intercept = this.intercept;

				this.utils
					.addEvent(el, 'keyup', intercept.up)
					.addEvent(el, 'keydown', intercept.down)
					.addEvent(el, 'focus', intercept.focus)
					.addEvent(el, 'blur', intercept.blur)
					.addEvent(el, 'paste', this.settings.pasteEventHandler);
			},
			preserveElementFocus: function () {
				// Fetch node that has focus
				var anchorNode = w.getSelection ? w.getSelection().anchorNode : d.activeElement;
				if (anchorNode) {
					var cache = this.medium.cache,
						s = this.settings,
						cur = anchorNode.parentNode,
						children = s.element.children,
						diff = cur !== cache.focusedElement,
						elementIndex = 0,
						i;

					// anchorNode is our target if element is empty
					if (cur === s.element) {
						cur = anchorNode;
					}

					// Find our child index
					for (i = 0; i < children.length; i++) {
						if (cur === children[i]) {
							elementIndex = i;
							break;
						}
					}

					// Focused element is different
					if (diff) {
						cache.focusedElement = cur;
						cache.focusedElementIndex = elementIndex;
					}
				}
			}
		};

		Medium.Cache = function () {
			this.initialized = false;
			this.cmd = false;
			this.focusedElement = null
		};
		Medium.Cache.prototype = {
			setBridge: function (bridge) {
				for (var i in bridge) {
					this[i] = bridge[i];
				}
			}
		};

		//Modes;
		Medium.inlineMode = 'inline';
		Medium.partialMode = 'partial';
		Medium.richMode = 'rich';
		Medium.Messages = {
			pastHere: 'Paste Here'
		};

		return Medium;
	}());

	if (typeof define === 'function' && define['amd']) {
		define(function () { return Medium; });
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = Medium;
	} else if (typeof this !== 'undefined') {
		this.Medium = Medium;
	}

}).call(this, window, document);

/* Copyright (c) 2012, 2014 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
(function (factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
})(function ($) {
  'use strict';

  function getInt(x) {
    if (typeof x === 'string') {
      return parseInt(x, 10);
    } else {
      return ~~x;
    }
  }

  var defaultSettings = {
    wheelSpeed: 1,
    wheelPropagation: false,
    swipePropagation: true,
    minScrollbarLength: null,
    maxScrollbarLength: null,
    useBothWheelAxes: false,
    useKeyboard: true,
    suppressScrollX: false,
    suppressScrollY: false,
    scrollXMarginOffset: 0,
    scrollYMarginOffset: 0,
    includePadding: false
  };

  var incrementingId = 0;
  var eventClassFactory = function () {
    var id = incrementingId++;
    return function (eventName) {
      var className = '.perfect-scrollbar-' + id;
      if (typeof eventName === 'undefined') {
        return className;
      } else {
        return eventName + className;
      }
    };
  };

  var isWebkit = 'WebkitAppearance' in document.documentElement.style;

  $.fn.perfectScrollbar = function (suppliedSettings, option) {

    return this.each(function () {
      var settings = $.extend(true, {}, defaultSettings);
      var $this = $(this);
      var isPluginAlive = function () { return !!$this; };

      if (typeof suppliedSettings === "object") {
        // Override default settings with any supplied
        $.extend(true, settings, suppliedSettings);
      } else {
        // If no setting was supplied, then the first param must be the option
        option = suppliedSettings;
      }

      // Catch options
      if (option === 'update') {
        if ($this.data('perfect-scrollbar-update')) {
          $this.data('perfect-scrollbar-update')();
        }
        return $this;
      }
      else if (option === 'destroy') {
        if ($this.data('perfect-scrollbar-destroy')) {
          $this.data('perfect-scrollbar-destroy')();
        }
        return $this;
      }

      if ($this.data('perfect-scrollbar')) {
        // if there's already perfect-scrollbar
        return $this.data('perfect-scrollbar');
      }


      // Or generate new perfectScrollbar

      $this.addClass('ps-container');

      var containerWidth;
      var containerHeight;
      var contentWidth;
      var contentHeight;

      var isRtl = $this.css('direction') === "rtl";
      var eventClass = eventClassFactory();
      var ownerDocument = this.ownerDocument || document;

      var $scrollbarXRail = $("<div class='ps-scrollbar-x-rail'>").appendTo($this);
      var $scrollbarX = $("<div class='ps-scrollbar-x'>").appendTo($scrollbarXRail);
      var scrollbarXActive;
      var scrollbarXWidth;
      var scrollbarXLeft;
      var scrollbarXBottom = getInt($scrollbarXRail.css('bottom'));
      var isScrollbarXUsingBottom = scrollbarXBottom === scrollbarXBottom; // !isNaN
      var scrollbarXTop = isScrollbarXUsingBottom ? null : getInt($scrollbarXRail.css('top'));
      var railBorderXWidth = getInt($scrollbarXRail.css('borderLeftWidth')) + getInt($scrollbarXRail.css('borderRightWidth'));
      var railXMarginWidth = getInt($scrollbarXRail.css('marginLeft')) + getInt($scrollbarXRail.css('marginRight'));
      var railXWidth;

      var $scrollbarYRail = $("<div class='ps-scrollbar-y-rail'>").appendTo($this);
      var $scrollbarY = $("<div class='ps-scrollbar-y'>").appendTo($scrollbarYRail);
      var scrollbarYActive;
      var scrollbarYHeight;
      var scrollbarYTop;
      var scrollbarYRight = getInt($scrollbarYRail.css('right'));
      var isScrollbarYUsingRight = scrollbarYRight === scrollbarYRight; // !isNaN
      var scrollbarYLeft = isScrollbarYUsingRight ? null : getInt($scrollbarYRail.css('left'));
      var railBorderYWidth = getInt($scrollbarYRail.css('borderTopWidth')) + getInt($scrollbarYRail.css('borderBottomWidth'));
      var railYMarginHeight = getInt($scrollbarYRail.css('marginTop')) + getInt($scrollbarYRail.css('marginBottom'));
      var railYHeight;

      function updateScrollTop(currentTop, deltaY) {
        var newTop = currentTop + deltaY;
        var maxTop = containerHeight - scrollbarYHeight;

        if (newTop < 0) {
          scrollbarYTop = 0;
        } else if (newTop > maxTop) {
          scrollbarYTop = maxTop;
        } else {
          scrollbarYTop = newTop;
        }

        var scrollTop = getInt(scrollbarYTop * (contentHeight - containerHeight) / (containerHeight - scrollbarYHeight));
        $this.scrollTop(scrollTop);
      }

      function updateScrollLeft(currentLeft, deltaX) {
        var newLeft = currentLeft + deltaX;
        var maxLeft = containerWidth - scrollbarXWidth;

        if (newLeft < 0) {
          scrollbarXLeft = 0;
        } else if (newLeft > maxLeft) {
          scrollbarXLeft = maxLeft;
        } else {
          scrollbarXLeft = newLeft;
        }

        var scrollLeft = getInt(scrollbarXLeft * (contentWidth - containerWidth) / (containerWidth - scrollbarXWidth));
        $this.scrollLeft(scrollLeft);
      }

      function getThumbSize(thumbSize) {
        if (settings.minScrollbarLength) {
          thumbSize = Math.max(thumbSize, settings.minScrollbarLength);
        }
        if (settings.maxScrollbarLength) {
          thumbSize = Math.min(thumbSize, settings.maxScrollbarLength);
        }
        return thumbSize;
      }

      function updateCss() {
        var xRailOffset = {width: railXWidth};
        if (isRtl) {
          xRailOffset.left = $this.scrollLeft() + containerWidth - contentWidth;
        } else {
          xRailOffset.left = $this.scrollLeft();
        }
        if (isScrollbarXUsingBottom) {
          xRailOffset.bottom = scrollbarXBottom - $this.scrollTop();
        } else {
          xRailOffset.top = scrollbarXTop + $this.scrollTop();
        }
        $scrollbarXRail.css(xRailOffset);

        var railYOffset = {top: $this.scrollTop(), height: railYHeight};

        if (isScrollbarYUsingRight) {
          if (isRtl) {
            railYOffset.right = contentWidth - $this.scrollLeft() - scrollbarYRight - $scrollbarY.outerWidth();
          } else {
            railYOffset.right = scrollbarYRight - $this.scrollLeft();
          }
        } else {
          if (isRtl) {
            railYOffset.left = $this.scrollLeft() + containerWidth * 2 - contentWidth - scrollbarYLeft - $scrollbarY.outerWidth();
          } else {
            railYOffset.left = scrollbarYLeft + $this.scrollLeft();
          }
        }
        $scrollbarYRail.css(railYOffset);

        $scrollbarX.css({left: scrollbarXLeft, width: scrollbarXWidth - railBorderXWidth});
        $scrollbarY.css({top: scrollbarYTop, height: scrollbarYHeight - railBorderYWidth});
      }

      function updateGeometry() {
        // Hide scrollbars not to affect scrollWidth and scrollHeight
        $this.removeClass('ps-active-x');
        $this.removeClass('ps-active-y');

        containerWidth = settings.includePadding ? $this.innerWidth() : $this.width();
        containerHeight = settings.includePadding ? $this.innerHeight() : $this.height();
        contentWidth = $this.prop('scrollWidth');
        contentHeight = $this.prop('scrollHeight');

        if (!settings.suppressScrollX && containerWidth + settings.scrollXMarginOffset < contentWidth) {
          scrollbarXActive = true;
          railXWidth = containerWidth - railXMarginWidth;
          scrollbarXWidth = getThumbSize(getInt(railXWidth * containerWidth / contentWidth));
          scrollbarXLeft = getInt($this.scrollLeft() * (railXWidth - scrollbarXWidth) / (contentWidth - containerWidth));
        } else {
          scrollbarXActive = false;
          scrollbarXWidth = 0;
          scrollbarXLeft = 0;
          $this.scrollLeft(0);
        }

        if (!settings.suppressScrollY && containerHeight + settings.scrollYMarginOffset < contentHeight) {
          scrollbarYActive = true;
          railYHeight = containerHeight - railYMarginHeight;
          scrollbarYHeight = getThumbSize(getInt(railYHeight * containerHeight / contentHeight));
          scrollbarYTop = getInt($this.scrollTop() * (railYHeight - scrollbarYHeight) / (contentHeight - containerHeight));
        } else {
          scrollbarYActive = false;
          scrollbarYHeight = 0;
          scrollbarYTop = 0;
          $this.scrollTop(0);
        }

        if (scrollbarXLeft >= railXWidth - scrollbarXWidth) {
          scrollbarXLeft = railXWidth - scrollbarXWidth;
        }
        if (scrollbarYTop >= railYHeight - scrollbarYHeight) {
          scrollbarYTop = railYHeight - scrollbarYHeight;
        }

        updateCss();

        if (scrollbarXActive) {
          $this.addClass('ps-active-x');
        }
        if (scrollbarYActive) {
          $this.addClass('ps-active-y');
        }
      }

      function bindMouseScrollXHandler() {
        var currentLeft;
        var currentPageX;

        var mouseMoveHandler = function (e) {
          updateScrollLeft(currentLeft, e.pageX - currentPageX);
          updateGeometry();
          e.stopPropagation();
          e.preventDefault();
        };

        var mouseUpHandler = function (e) {
          $scrollbarXRail.removeClass('in-scrolling');
          $(ownerDocument).unbind(eventClass('mousemove'), mouseMoveHandler);
        };

        $scrollbarX.bind(eventClass('mousedown'), function (e) {
          currentPageX = e.pageX;
          currentLeft = $scrollbarX.position().left;
          $scrollbarXRail.addClass('in-scrolling');

          $(ownerDocument).bind(eventClass('mousemove'), mouseMoveHandler);
          $(ownerDocument).one(eventClass('mouseup'), mouseUpHandler);

          e.stopPropagation();
          e.preventDefault();
        });

        currentLeft =
        currentPageX = null;
      }

      function bindMouseScrollYHandler() {
        var currentTop;
        var currentPageY;

        var mouseMoveHandler = function (e) {
          updateScrollTop(currentTop, e.pageY - currentPageY);
          updateGeometry();
          e.stopPropagation();
          e.preventDefault();
        };

        var mouseUpHandler = function (e) {
          $scrollbarYRail.removeClass('in-scrolling');
          $(ownerDocument).unbind(eventClass('mousemove'), mouseMoveHandler);
        };

        $scrollbarY.bind(eventClass('mousedown'), function (e) {
          currentPageY = e.pageY;
          currentTop = $scrollbarY.position().top;
          $scrollbarYRail.addClass('in-scrolling');

          $(ownerDocument).bind(eventClass('mousemove'), mouseMoveHandler);
          $(ownerDocument).one(eventClass('mouseup'), mouseUpHandler);

          e.stopPropagation();
          e.preventDefault();
        });

        currentTop =
        currentPageY = null;
      }

      function shouldPreventWheel(deltaX, deltaY) {
        var scrollTop = $this.scrollTop();
        if (deltaX === 0) {
          if (!scrollbarYActive) {
            return false;
          }
          if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= contentHeight - containerHeight && deltaY < 0)) {
            return !settings.wheelPropagation;
          }
        }

        var scrollLeft = $this.scrollLeft();
        if (deltaY === 0) {
          if (!scrollbarXActive) {
            return false;
          }
          if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= contentWidth - containerWidth && deltaX > 0)) {
            return !settings.wheelPropagation;
          }
        }
        return true;
      }

      function shouldPreventSwipe(deltaX, deltaY) {
        var scrollTop = $this.scrollTop();
        var scrollLeft = $this.scrollLeft();
        var magnitudeX = Math.abs(deltaX);
        var magnitudeY = Math.abs(deltaY);

        if (magnitudeY > magnitudeX) {
          // user is perhaps trying to swipe up/down the page

          if (((deltaY < 0) && (scrollTop === contentHeight - containerHeight)) ||
              ((deltaY > 0) && (scrollTop === 0))) {
            return !settings.swipePropagation;
          }
        } else if (magnitudeX > magnitudeY) {
          // user is perhaps trying to swipe left/right across the page

          if (((deltaX < 0) && (scrollLeft === contentWidth - containerWidth)) ||
              ((deltaX > 0) && (scrollLeft === 0))) {
            return !settings.swipePropagation;
          }
        }

        return true;
      }

      function bindMouseWheelHandler() {
        var shouldPrevent = false;

        function getDeltaFromEvent(e) {
          var deltaX = e.originalEvent.deltaX;
          var deltaY = -1 * e.originalEvent.deltaY;

          if (typeof deltaX === "undefined" || typeof deltaY === "undefined") {
            // OS X Safari
            deltaX = -1 * e.originalEvent.wheelDeltaX / 6;
            deltaY = e.originalEvent.wheelDeltaY / 6;
          }

          if (e.originalEvent.deltaMode && e.originalEvent.deltaMode === 1) {
            // Firefox in deltaMode 1: Line scrolling
            deltaX *= 10;
            deltaY *= 10;
          }

          if (deltaX !== deltaX && deltaY !== deltaY/* NaN checks */) {
            // IE in some mouse drivers
            deltaX = 0;
            deltaY = e.originalEvent.wheelDelta;
          }

          return [deltaX, deltaY];
        }

        function mousewheelHandler(e) {
          // FIXME: this is a quick fix for the select problem in FF and IE.
          // If there comes an effective way to deal with the problem,
          // this lines should be removed.
          if (!isWebkit && $this.find('select:focus').length > 0) {
            return;
          }

          var delta = getDeltaFromEvent(e);

          var deltaX = delta[0];
          var deltaY = delta[1];

          shouldPrevent = false;
          if (!settings.useBothWheelAxes) {
            // deltaX will only be used for horizontal scrolling and deltaY will
            // only be used for vertical scrolling - this is the default
            $this.scrollTop($this.scrollTop() - (deltaY * settings.wheelSpeed));
            $this.scrollLeft($this.scrollLeft() + (deltaX * settings.wheelSpeed));
          } else if (scrollbarYActive && !scrollbarXActive) {
            // only vertical scrollbar is active and useBothWheelAxes option is
            // active, so let's scroll vertical bar using both mouse wheel axes
            if (deltaY) {
              $this.scrollTop($this.scrollTop() - (deltaY * settings.wheelSpeed));
            } else {
              $this.scrollTop($this.scrollTop() + (deltaX * settings.wheelSpeed));
            }
            shouldPrevent = true;
          } else if (scrollbarXActive && !scrollbarYActive) {
            // useBothWheelAxes and only horizontal bar is active, so use both
            // wheel axes for horizontal bar
            if (deltaX) {
              $this.scrollLeft($this.scrollLeft() + (deltaX * settings.wheelSpeed));
            } else {
              $this.scrollLeft($this.scrollLeft() - (deltaY * settings.wheelSpeed));
            }
            shouldPrevent = true;
          }

          updateGeometry();

          shouldPrevent = (shouldPrevent || shouldPreventWheel(deltaX, deltaY));
          if (shouldPrevent) {
            e.stopPropagation();
            e.preventDefault();
          }
        }

        if (typeof window.onwheel !== "undefined") {
          $this.bind(eventClass('wheel'), mousewheelHandler);
        } else if (typeof window.onmousewheel !== "undefined") {
          $this.bind(eventClass('mousewheel'), mousewheelHandler);
        }
      }

      function bindKeyboardHandler() {
        var hovered = false;
        $this.bind(eventClass('mouseenter'), function (e) {
          hovered = true;
        });
        $this.bind(eventClass('mouseleave'), function (e) {
          hovered = false;
        });

        var shouldPrevent = false;
        $(ownerDocument).bind(eventClass('keydown'), function (e) {
          if (e.isDefaultPrevented && e.isDefaultPrevented()) {
            return;
          }

          if (!hovered) {
            return;
          }

          var activeElement = document.activeElement ? document.activeElement : ownerDocument.activeElement;
          // go deeper if element is a webcomponent
          while (activeElement.shadowRoot) {
            activeElement = activeElement.shadowRoot.activeElement;
          }
          if ($(activeElement).is(":input,[contenteditable]")) {
            return;
          }

          var deltaX = 0;
          var deltaY = 0;

          switch (e.which) {
          case 37: // left
            deltaX = -30;
            break;
          case 38: // up
            deltaY = 30;
            break;
          case 39: // right
            deltaX = 30;
            break;
          case 40: // down
            deltaY = -30;
            break;
          case 33: // page up
            deltaY = 90;
            break;
          case 32: // space bar
          case 34: // page down
            deltaY = -90;
            break;
          case 35: // end
            if (e.ctrlKey) {
              deltaY = -contentHeight;
            } else {
              deltaY = -containerHeight;
            }
            break;
          case 36: // home
            if (e.ctrlKey) {
              deltaY = $this.scrollTop();
            } else {
              deltaY = containerHeight;
            }
            break;
          default:
            return;
          }

          $this.scrollTop($this.scrollTop() - deltaY);
          $this.scrollLeft($this.scrollLeft() + deltaX);

          shouldPrevent = shouldPreventWheel(deltaX, deltaY);
          if (shouldPrevent) {
            e.preventDefault();
          }
        });
      }

      function bindRailClickHandler() {
        function stopPropagation(e) { e.stopPropagation(); }

        $scrollbarY.bind(eventClass('click'), stopPropagation);
        $scrollbarYRail.bind(eventClass('click'), function (e) {
          var halfOfScrollbarLength = getInt(scrollbarYHeight / 2);
          var positionTop = e.pageY - $scrollbarYRail.offset().top - halfOfScrollbarLength;
          var maxPositionTop = containerHeight - scrollbarYHeight;
          var positionRatio = positionTop / maxPositionTop;

          if (positionRatio < 0) {
            positionRatio = 0;
          } else if (positionRatio > 1) {
            positionRatio = 1;
          }

          $this.scrollTop((contentHeight - containerHeight) * positionRatio);
        });

        $scrollbarX.bind(eventClass('click'), stopPropagation);
        $scrollbarXRail.bind(eventClass('click'), function (e) {
          var halfOfScrollbarLength = getInt(scrollbarXWidth / 2);
          var positionLeft = e.pageX - $scrollbarXRail.offset().left - halfOfScrollbarLength;
          var maxPositionLeft = containerWidth - scrollbarXWidth;
          var positionRatio = positionLeft / maxPositionLeft;

          if (positionRatio < 0) {
            positionRatio = 0;
          } else if (positionRatio > 1) {
            positionRatio = 1;
          }

          $this.scrollLeft((contentWidth - containerWidth) * positionRatio);
        });
      }

      function bindSelectionHandler() {
        function getRangeNode() {
          var selection = window.getSelection ? window.getSelection() :
                          document.getSlection ? document.getSlection() : {rangeCount: 0};
          if (selection.rangeCount === 0) {
            return null;
          } else {
            return selection.getRangeAt(0).commonAncestorContainer;
          }
        }

        var scrollingLoop = null;
        var scrollDiff = {top: 0, left: 0};
        function startScrolling() {
          if (!scrollingLoop) {
            scrollingLoop = setInterval(function () {
              if (!isPluginAlive()) {
                clearInterval(scrollingLoop);
                return;
              }

              $this.scrollTop($this.scrollTop() + scrollDiff.top);
              $this.scrollLeft($this.scrollLeft() + scrollDiff.left);
              updateGeometry();
            }, 50); // every .1 sec
          }
        }
        function stopScrolling() {
          if (scrollingLoop) {
            clearInterval(scrollingLoop);
            scrollingLoop = null;
          }
          $scrollbarXRail.removeClass('in-scrolling');
          $scrollbarYRail.removeClass('in-scrolling');
        }

        var isSelected = false;
        $(ownerDocument).bind(eventClass('selectionchange'), function (e) {
          if ($.contains($this[0], getRangeNode())) {
            isSelected = true;
          } else {
            isSelected = false;
            stopScrolling();
          }
        });
        $(window).bind(eventClass('mouseup'), function (e) {
          if (isSelected) {
            isSelected = false;
            stopScrolling();
          }
        });

        $(window).bind(eventClass('mousemove'), function (e) {
          if (isSelected) {
            var mousePosition = {x: e.pageX, y: e.pageY};
            var containerOffset = $this.offset();
            var containerGeometry = {
              left: containerOffset.left,
              right: containerOffset.left + $this.outerWidth(),
              top: containerOffset.top,
              bottom: containerOffset.top + $this.outerHeight()
            };

            if (mousePosition.x < containerGeometry.left + 3) {
              scrollDiff.left = -5;
              $scrollbarXRail.addClass('in-scrolling');
            } else if (mousePosition.x > containerGeometry.right - 3) {
              scrollDiff.left = 5;
              $scrollbarXRail.addClass('in-scrolling');
            } else {
              scrollDiff.left = 0;
            }

            if (mousePosition.y < containerGeometry.top + 3) {
              if (containerGeometry.top + 3 - mousePosition.y < 5) {
                scrollDiff.top = -5;
              } else {
                scrollDiff.top = -20;
              }
              $scrollbarYRail.addClass('in-scrolling');
            } else if (mousePosition.y > containerGeometry.bottom - 3) {
              if (mousePosition.y - containerGeometry.bottom + 3 < 5) {
                scrollDiff.top = 5;
              } else {
                scrollDiff.top = 20;
              }
              $scrollbarYRail.addClass('in-scrolling');
            } else {
              scrollDiff.top = 0;
            }

            if (scrollDiff.top === 0 && scrollDiff.left === 0) {
              stopScrolling();
            } else {
              startScrolling();
            }
          }
        });
      }

      function bindTouchHandler(supportsTouch, supportsIePointer) {
        function applyTouchMove(differenceX, differenceY) {
          $this.scrollTop($this.scrollTop() - differenceY);
          $this.scrollLeft($this.scrollLeft() - differenceX);

          updateGeometry();
        }

        var startOffset = {};
        var startTime = 0;
        var speed = {};
        var easingLoop = null;
        var inGlobalTouch = false;
        var inLocalTouch = false;

        function globalTouchStart(e) {
          inGlobalTouch = true;
        }
        function globalTouchEnd(e) {
          inGlobalTouch = false;
        }

        function getTouch(e) {
          if (e.originalEvent.targetTouches) {
            return e.originalEvent.targetTouches[0];
          } else {
            // Maybe IE pointer
            return e.originalEvent;
          }
        }
        function shouldHandle(e) {
          var event = e.originalEvent;
          if (event.targetTouches && event.targetTouches.length === 1) {
            return true;
          }
          if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== event.MSPOINTER_TYPE_MOUSE) {
            return true;
          }
          return false;
        }
        function touchStart(e) {
          if (shouldHandle(e)) {
            inLocalTouch = true;

            var touch = getTouch(e);

            startOffset.pageX = touch.pageX;
            startOffset.pageY = touch.pageY;

            startTime = (new Date()).getTime();

            if (easingLoop !== null) {
              clearInterval(easingLoop);
            }

            e.stopPropagation();
          }
        }
        function touchMove(e) {
          if (!inGlobalTouch && inLocalTouch && shouldHandle(e)) {
            var touch = getTouch(e);

            var currentOffset = {pageX: touch.pageX, pageY: touch.pageY};

            var differenceX = currentOffset.pageX - startOffset.pageX;
            var differenceY = currentOffset.pageY - startOffset.pageY;

            applyTouchMove(differenceX, differenceY);
            startOffset = currentOffset;

            var currentTime = (new Date()).getTime();

            var timeGap = currentTime - startTime;
            if (timeGap > 0) {
              speed.x = differenceX / timeGap;
              speed.y = differenceY / timeGap;
              startTime = currentTime;
            }

            if (shouldPreventSwipe(differenceX, differenceY)) {
              e.stopPropagation();
              e.preventDefault();
            }
          }
        }
        function touchEnd(e) {
          if (!inGlobalTouch && inLocalTouch) {
            inLocalTouch = false;

            clearInterval(easingLoop);
            easingLoop = setInterval(function () {
              if (!isPluginAlive()) {
                clearInterval(easingLoop);
                return;
              }

              if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
                clearInterval(easingLoop);
                return;
              }

              applyTouchMove(speed.x * 30, speed.y * 30);

              speed.x *= 0.8;
              speed.y *= 0.8;
            }, 10);
          }
        }

        if (supportsTouch) {
          $(window).bind(eventClass("touchstart"), globalTouchStart);
          $(window).bind(eventClass("touchend"), globalTouchEnd);
          $this.bind(eventClass("touchstart"), touchStart);
          $this.bind(eventClass("touchmove"), touchMove);
          $this.bind(eventClass("touchend"), touchEnd);
        }

        if (supportsIePointer) {
          if (window.PointerEvent) {
            $(window).bind(eventClass("pointerdown"), globalTouchStart);
            $(window).bind(eventClass("pointerup"), globalTouchEnd);
            $this.bind(eventClass("pointerdown"), touchStart);
            $this.bind(eventClass("pointermove"), touchMove);
            $this.bind(eventClass("pointerup"), touchEnd);
          } else if (window.MSPointerEvent) {
            $(window).bind(eventClass("MSPointerDown"), globalTouchStart);
            $(window).bind(eventClass("MSPointerUp"), globalTouchEnd);
            $this.bind(eventClass("MSPointerDown"), touchStart);
            $this.bind(eventClass("MSPointerMove"), touchMove);
            $this.bind(eventClass("MSPointerUp"), touchEnd);
          }
        }
      }

      function bindScrollHandler() {
        $this.bind(eventClass('scroll'), function (e) {
          updateGeometry();
        });
      }

      function destroy() {
        $this.unbind(eventClass());
        $(window).unbind(eventClass());
        $(ownerDocument).unbind(eventClass());
        $this.data('perfect-scrollbar', null);
        $this.data('perfect-scrollbar-update', null);
        $this.data('perfect-scrollbar-destroy', null);
        $scrollbarX.remove();
        $scrollbarY.remove();
        $scrollbarXRail.remove();
        $scrollbarYRail.remove();

        // clean all variables
        $this =
        $scrollbarXRail =
        $scrollbarYRail =
        $scrollbarX =
        $scrollbarY =
        scrollbarXActive =
        scrollbarYActive =
        containerWidth =
        containerHeight =
        contentWidth =
        contentHeight =
        scrollbarXWidth =
        scrollbarXLeft =
        scrollbarXBottom =
        isScrollbarXUsingBottom =
        scrollbarXTop =
        scrollbarYHeight =
        scrollbarYTop =
        scrollbarYRight =
        isScrollbarYUsingRight =
        scrollbarYLeft =
        isRtl =
        eventClass = null;
      }

      var supportsTouch = (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);
      var supportsIePointer = window.navigator.msMaxTouchPoints !== null;

      function initialize() {
        updateGeometry();
        bindScrollHandler();
        bindMouseScrollXHandler();
        bindMouseScrollYHandler();
        bindRailClickHandler();
        bindSelectionHandler();
        bindMouseWheelHandler();

        if (supportsTouch || supportsIePointer) {
          bindTouchHandler(supportsTouch, supportsIePointer);
        }
        if (settings.useKeyboard) {
          bindKeyboardHandler();
        }
        $this.data('perfect-scrollbar', $this);
        $this.data('perfect-scrollbar-update', updateGeometry);
        $this.data('perfect-scrollbar-destroy', destroy);
      }

      initialize();

      return $this;
    });
  };
});

// SweetAlert
// 2014 (c) - Tristan Edwards
// github.com/t4t5/sweetalert
;(function(window, document) {

  var modalClass   = '.sweet-alert',
      overlayClass = '.sweet-overlay',
      alertTypes   = ['error', 'warning', 'info', 'success'],
      defaultParams = {
        title: '',
        text: '',
        type: null,
        allowOutsideClick: false,
        showCancelButton: false,
        closeOnConfirm: true,
        closeOnCancel: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#AEDEF4',
        cancelButtonText: lasso_editor.strings.cancel,
        imageUrl: null,
        imageSize: null,
        timer: null
      };


  /*
   * Manipulate DOM
   */

  var getModal = function() {
      return document.querySelector(modalClass);
    },
    getOverlay = function() {
      return document.querySelector(overlayClass);
    },
    hasClass = function(elem, className) {
      return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
    },
    addClass = function(elem, className) {
      if (!hasClass(elem, className)) {
        elem.className += ' ' + className;
      }
    },
    removeClass = function(elem, className) {
      var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
      if (hasClass(elem, className)) {
        while (newClass.indexOf(' ' + className + ' ') >= 0) {
          newClass = newClass.replace(' ' + className + ' ', ' ');
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
      }
    },
    escapeHtml = function(str) {
      var div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    },
    _show = function(elem) {
      elem.style.opacity = '';
      elem.style.display = 'block';
    },
    show = function(elems) {
      if (elems && !elems.length) {
        return _show(elems);
      }
      for (var i = 0; i < elems.length; ++i) {
        _show(elems[i]);
      }
    },
    _hide = function(elem) {
      elem.style.opacity = '';
      elem.style.display = 'none';
    },
    hide = function(elems) {
      if (elems && !elems.length) {
        return _hide(elems);
      }
      for (var i = 0; i < elems.length; ++i) {
        _hide(elems[i]);
      }
    },
    isDescendant = function(parent, child) {
      var node = child.parentNode;
      while (node !== null) {
        if (node === parent) {
          return true;
        }
        node = node.parentNode;
      }
      return false;
    },
    getTopMargin = function(elem) {
      elem.style.left = '-9999px';
      elem.style.display = 'block';

      var height = elem.clientHeight,
          padding;
      if (typeof getComputedStyle !== "undefined") { /* IE 8 */
        padding = parseInt(getComputedStyle(elem).getPropertyValue('padding'), 10);
      } else{
        padding = parseInt(elem.currentStyle.padding);
      }

      elem.style.left = '';
      elem.style.display = 'none';
      return ('-' + parseInt(height / 2 + padding) + 'px');
    },
    fadeIn = function(elem, interval) {
      if (+elem.style.opacity < 1) {
        interval = interval || 16;
        elem.style.opacity = 0;
        elem.style.display = 'block';
        var last = +new Date();
        var tick = function() {
          elem.style.opacity = +elem.style.opacity + (new Date() - last) / 100;
          last = +new Date();

          if (+elem.style.opacity < 1) {
            setTimeout(tick, interval);
          }
        };
        tick();
      }
      elem.style.display = 'block'; //fallback IE8
    },
    fadeOut = function(elem, interval) {
      interval = interval || 16;
      elem.style.opacity = 1;
      var last = +new Date();
      var tick = function() {
        elem.style.opacity = +elem.style.opacity - (new Date() - last) / 100;
        last = +new Date();

        if (+elem.style.opacity > 0) {
          setTimeout(tick, interval);
        } else {
          elem.style.display = 'none';
        }
      };
      tick();
    },
    fireClick = function(node) {
      // Taken from http://www.nonobtrusive.com/2011/11/29/programatically-fire-crossbrowser-click-event-with-javascript/
      // Then fixed for today's Chrome browser.
      if (MouseEvent) {
        // Up-to-date approach
        var mevt = new MouseEvent('click', {
          view: window,
          bubbles: false,
          cancelable: true
        });
        node.dispatchEvent(mevt);
      } else if ( document.createEvent ) {
        // Fallback
        var evt = document.createEvent('MouseEvents');
        evt.initEvent('click', false, false);
        node.dispatchEvent(evt);
      } else if( document.createEventObject ) {
        node.fireEvent('onclick') ;
      } else if (typeof node.onclick === 'function' ) {
        node.onclick();
      }
    },
    stopEventPropagation = function(e) {
      // In particular, make sure the space bar doesn't scroll the main window.
      if (typeof e.stopPropagation === 'function') {
        e.stopPropagation();
        e.preventDefault();
      } else if (window.event && window.event.hasOwnProperty('cancelBubble')) {
        window.event.cancelBubble = true;
      }
    };

  // Remember state in cases where opening and handling a modal will fiddle with it.
  var previousActiveElement,
      previousDocumentClick,
      previousWindowKeyDown,
      lastFocusedButton;

  /*
   * Add modal + overlay to DOM
   */

  window.sweetAlertInitialize = function() {
    var sweetHTML = '<div class="sweet-overlay" tabIndex="-1"></div><div class="sweet-alert" tabIndex="-1"><div class="icon error"><span class="x-mark"><span class="line left"></span><span class="line right"></span></span></div><div class="icon warning"> <span class="body"></span> <span class="dot"></span> </div> <div class="icon info"></div> <div class="icon success"> <span class="line tip"></span> <span class="line long"></span> <div class="placeholder"></div> <div class="fix"></div> </div> <div class="icon custom"></div> <h2>Title</h2><p>Text</p><button class="cancel" tabIndex="2">'+lasso_editor.strings.cancel+'</button><button class="confirm" tabIndex="1">OK</button></div>',
        sweetWrap = document.createElement('div');

    sweetWrap.innerHTML = sweetHTML;

    // For readability: check sweet-alert.html
    document.body.appendChild(sweetWrap);
  };

  /*
   * Global sweetAlert function
   */

  window.sweetAlert = window.swal = function() {
    // Copy arguments to the local args variable
    var args = arguments;
    if (getModal() !== null) {
        // If getModal returns values then continue
        modalDependant.apply(this, args);
    } else {
        // If getModal returns null i.e. no matches, then set up a interval event to check the return value until it is not null	
        var modalCheckInterval = setInterval(function() {
          if (getModal() !== null) {
            clearInterval(modalCheckInterval);
            modalDependant.apply(this, args);
          }
      }, 100);
    }
  };
        
  function modalDependant() {

    if (arguments[0] === undefined) {
      window.console.error('sweetAlert expects at least 1 attribute!');
      return false;
    }

    var params = extend({}, defaultParams);

    switch (typeof arguments[0]) {

      case 'string':
        params.title = arguments[0];
        params.text  = arguments[1] || '';
        params.type  = arguments[2] || '';

        break;

      case 'object':
        if (arguments[0].title === undefined) {
          window.console.error('Missing "title" argument!');
          return false;
        }

        params.title              = arguments[0].title;
        params.text               = arguments[0].text || defaultParams.text;
        params.type               = arguments[0].type || defaultParams.type;
        params.customClass        = arguments[0].customClass || params.customClass;
        params.allowOutsideClick  = arguments[0].allowOutsideClick || defaultParams.allowOutsideClick;
        params.showCancelButton   = arguments[0].showCancelButton !== undefined ? arguments[0].showCancelButton : defaultParams.showCancelButton;
        params.closeOnConfirm     = arguments[0].closeOnConfirm !== undefined ? arguments[0].closeOnConfirm : defaultParams.closeOnConfirm;
        params.closeOnCancel      = arguments[0].closeOnCancel !== undefined ? arguments[0].closeOnCancel : defaultParams.closeOnCancel;
        params.timer              = arguments[0].timer || defaultParams.timer;

        // Show "Confirm" instead of "OK" if cancel button is visible
        params.confirmButtonText  = (defaultParams.showCancelButton) ? 'Confirm' : defaultParams.confirmButtonText;
        params.confirmButtonText  = arguments[0].confirmButtonText || defaultParams.confirmButtonText;
        params.confirmButtonColor = arguments[0].confirmButtonColor || defaultParams.confirmButtonColor;
        params.cancelButtonText   = arguments[0].cancelButtonText || defaultParams.cancelButtonText;
        params.imageUrl           = arguments[0].imageUrl || defaultParams.imageUrl;
        params.imageSize          = arguments[0].imageSize || defaultParams.imageSize;
        params.doneFunction       = arguments[1] || null;

        break;

      default:
        window.console.error('Unexpected type of argument! Expected "string" or "object", got ' + typeof arguments[0]);
        return false;

    }

    setParameters(params);
    fixVerticalPosition();
    openModal();


    // Modal interactions
    var modal = getModal();

    // Mouse interactions
    var onButtonEvent = function(event) {
      var e = event || window.event;
      var target = e.target || e.srcElement,
          targetedConfirm    = (target.className === 'confirm'),
          modalIsVisible     = hasClass(modal, 'visible'),
          doneFunctionExists = (params.doneFunction && modal.getAttribute('data-has-done-function') === 'true');

      switch (e.type) {
        case ("mouseover"):
          if (targetedConfirm) {
            target.style.backgroundColor = colorLuminance(params.confirmButtonColor, -0.04);
          }
          break;
        case ("mouseout"):
          if (targetedConfirm) {
            target.style.backgroundColor = params.confirmButtonColor;
          }
          break;
        case ("mousedown"):
          if (targetedConfirm) {
            target.style.backgroundColor = colorLuminance(params.confirmButtonColor, -0.14);
          }
          break;
        case ("mouseup"):
          if (targetedConfirm) {
            target.style.backgroundColor = colorLuminance(params.confirmButtonColor, -0.04);
          }
          break;
        case ("focus"):
          var $confirmButton = modal.querySelector('button.confirm'),
              $cancelButton  = modal.querySelector('button.cancel');

          if (targetedConfirm) {
            $cancelButton.style.boxShadow = 'none';
          } else {
            $confirmButton.style.boxShadow = 'none';
          }
          break;
        case ("click"):
          if (targetedConfirm && doneFunctionExists && modalIsVisible) { // Clicked "confirm"

            params.doneFunction(true);

            if (params.closeOnConfirm) {
              closeModal();
            }
          } else if (doneFunctionExists && modalIsVisible) { // Clicked "cancel"

            // Check if callback function expects a parameter (to track cancel actions)
            var functionAsStr          = String(params.doneFunction).replace(/\s/g, '');
            var functionHandlesCancel  = functionAsStr.substring(0, 9) === "function(" && functionAsStr.substring(9, 10) !== ")";

            if (functionHandlesCancel) {
              params.doneFunction(false);
            }

            if (params.closeOnCancel) {
              closeModal();
            }
          } else {
            closeModal();
          }

          break;
      }
    };

    var $buttons = modal.querySelectorAll('button');
    for (var i = 0; i < $buttons.length; i++) {
      $buttons[i].onclick     = onButtonEvent;
      $buttons[i].onmouseover = onButtonEvent;
      $buttons[i].onmouseout  = onButtonEvent;
      $buttons[i].onmousedown = onButtonEvent;
      //$buttons[i].onmouseup   = onButtonEvent;
      $buttons[i].onfocus     = onButtonEvent;
    }

    // Remember the current document.onclick event.
    previousDocumentClick = document.onclick;
    document.onclick = function(event) {
      var e = event || window.event;
      var target = e.target || e.srcElement;

      var clickedOnModal = (modal === target),
          clickedOnModalChild = isDescendant(modal, target),
          modalIsVisible = hasClass(modal, 'visible'),
          outsideClickIsAllowed = modal.getAttribute('data-allow-ouside-click') === 'true';

      if (!clickedOnModal && !clickedOnModalChild && modalIsVisible && outsideClickIsAllowed) {
        closeModal();
      }
    };


    // Keyboard interactions
    var $okButton = modal.querySelector('button.confirm'),
        $cancelButton = modal.querySelector('button.cancel'),
        $modalButtons = modal.querySelectorAll('button:not([type=hidden])');


    function handleKeyDown(event) {
      var e = event || window.event;
      var keyCode = e.keyCode || e.which;

      if ([9,13,32,27].indexOf(keyCode) === -1) {
        // Don't do work on keys we don't care about.
        return;
      }

      var $targetElement = e.target || e.srcElement;

      var btnIndex = -1; // Find the button - note, this is a nodelist, not an array.
      for (var i = 0; i < $modalButtons.length; i++) {
        if ($targetElement === $modalButtons[i]) {
          btnIndex = i;
          break;
        }
      }

      if (keyCode === 9) {
        // TAB
        if (btnIndex === -1) {
          // No button focused. Jump to the confirm button.
          $targetElement = $okButton;
        } else {
          // Cycle to the next button
          if (btnIndex === $modalButtons.length - 1) {
            $targetElement = $modalButtons[0];
          } else {
            $targetElement = $modalButtons[btnIndex + 1];
          }
        }

        stopEventPropagation(e);
        $targetElement.focus();
        setFocusStyle($targetElement, params.confirmButtonColor); // TODO

      } else {
        if (keyCode === 13 || keyCode === 32) {
            if (btnIndex === -1) {
              // ENTER/SPACE clicked outside of a button.
              $targetElement = $okButton;
            } else {
              // Do nothing - let the browser handle it.
              $targetElement = undefined;
            }
        } else if (keyCode === 27 && !($cancelButton.hidden || $cancelButton.style.display === 'none')) {
          // ESC to cancel only if there's a cancel button displayed (like the alert() window).
          $targetElement = $cancelButton;
        } else {
          // Fallback - let the browser handle it.
          $targetElement = undefined;
        }

        if ($targetElement !== undefined) {
          fireClick($targetElement, e);
        }
      }
    }

    previousWindowKeyDown = window.onkeydown;
    window.onkeydown = handleKeyDown;

    function handleOnBlur(event) {
      var e = event || window.event;
      var $targetElement = e.target || e.srcElement,
          $focusElement = e.relatedTarget,
          modalIsVisible = hasClass(modal, 'visible');

      if (modalIsVisible) {
        var btnIndex = -1; // Find the button - note, this is a nodelist, not an array.

        if ($focusElement !== null) {
          // If we picked something in the DOM to focus to, let's see if it was a button.
          for (var i = 0; i < $modalButtons.length; i++) {
            if ($focusElement === $modalButtons[i]) {
              btnIndex = i;
              break;
            }
          }

          if (btnIndex === -1) {
            // Something in the dom, but not a visible button. Focus back on the button.
            //$targetElement.focus();
          }
        } else {
          // Exiting the DOM (e.g. clicked in the URL bar);
          lastFocusedButton = $targetElement;
        }
      }
    }

    $okButton.onblur = handleOnBlur;
    $cancelButton.onblur = handleOnBlur;

    /*window.onfocus = function() {
      // When the user has focused away and focused back from the whole window.
      window.setTimeout(function() {
        // Put in a timeout to jump out of the event sequence. Calling focus() in the event
        // sequence confuses things.
        if (lastFocusedButton !== undefined) {
          lastFocusedButton.focus();
          lastFocusedButton = undefined;
        }
      }, 0);
    };*/
  }

  /**
   * Set default params for each popup
   * @param {Object} userParams
   */
  window.swal.setDefaults = function(userParams) {
    if (!userParams) {
      throw new Error('userParams is required');
    }
    if (typeof userParams !== 'object') {
      throw new Error('userParams has to be a object');
    }

    extend(defaultParams, userParams);
  };

  /*
   * Set type, text and actions on modal
   */

  function setParameters(params) {
    var modal = getModal();

    var $title = modal.querySelector('h2'),
        $text = modal.querySelector('p'),
        $cancelBtn = modal.querySelector('button.cancel'),
        $confirmBtn = modal.querySelector('button.confirm');

    // Title
    $title.innerHTML = escapeHtml(params.title).split("\n").join("<br>");

    // Text
    $text.innerHTML = params.text;////escapeHtml(params.text || '').split("\n").join("<br>");
    if (params.text) {
      show($text);
    }

    //Custom Class
    if (params.customClass) {
      addClass(modal, params.customClass);
    }

    // Icon
    hide(modal.querySelectorAll('.icon'));
    if (params.type) {
      var validType = false;
      for (var i = 0; i < alertTypes.length; i++) {
        if (params.type === alertTypes[i]) {
          validType = true;
          break;
        }
      }
      if (!validType) {
        window.console.error('Unknown alert type: ' + params.type);
        return false;
      }
      var $icon = modal.querySelector('.icon.' + params.type);
      show($icon);

      // Animate icon
      switch (params.type) {
        case "success":
          addClass($icon, 'animate');
          addClass($icon.querySelector('.tip'), 'animateSuccessTip');
          addClass($icon.querySelector('.long'), 'animateSuccessLong');
          break;
        case "error":
          addClass($icon, 'animateErrorIcon');
          addClass($icon.querySelector('.x-mark'), 'animateXMark');
          break;
        case "warning":
          addClass($icon, 'pulseWarning');
          addClass($icon.querySelector('.body'), 'pulseWarningIns');
          addClass($icon.querySelector('.dot'), 'pulseWarningIns');
          break;
      }

    }

    // Custom image
    if (params.imageUrl) {
      var $customIcon = modal.querySelector('.icon.custom');

      $customIcon.style.backgroundImage = 'url(' + params.imageUrl + ')';
      show($customIcon);

      var _imgWidth  = 80,
          _imgHeight = 80;

      if (params.imageSize) {
        var imgWidth  = params.imageSize.split('x')[0];
        var imgHeight = params.imageSize.split('x')[1];

        if (!imgWidth || !imgHeight) {
          window.console.error("Parameter imageSize expects value with format WIDTHxHEIGHT, got " + params.imageSize);
        } else {
          _imgWidth  = imgWidth;
          _imgHeight = imgHeight;

          $customIcon.css({
            'width': imgWidth + 'px',
            'height': imgHeight + 'px'
          });
        }
      }
      $customIcon.setAttribute('style', $customIcon.getAttribute('style') + 'width:' + _imgWidth + 'px; height:' + _imgHeight + 'px');
    }

    // Cancel button
    modal.setAttribute('data-has-cancel-button', params.showCancelButton);
    if (params.showCancelButton) {
      $cancelBtn.style.display = 'inline-block';
    } else {
      hide($cancelBtn);
    }

    // Edit text on cancel and confirm buttons
    if (params.cancelButtonText) {
      $cancelBtn.innerHTML = escapeHtml(params.cancelButtonText);
    }
    if (params.confirmButtonText) {
      $confirmBtn.innerHTML = escapeHtml(params.confirmButtonText);
    }

    // Set confirm button to selected background color
    $confirmBtn.style.backgroundColor = params.confirmButtonColor;

    // Set box-shadow to default focused button
    setFocusStyle($confirmBtn, params.confirmButtonColor);

    // Allow outside click?
    modal.setAttribute('data-allow-ouside-click', params.allowOutsideClick);

    // Done-function
    var hasDoneFunction = (params.doneFunction) ? true : false;
    modal.setAttribute('data-has-done-function', hasDoneFunction);

    // Close timer
    modal.setAttribute('data-timer', params.timer);
  }


  /*
   * Set hover, active and focus-states for buttons (source: http://www.sitepoint.com/javascript-generate-lighter-darker-color)
   */

  function colorLuminance(hex, lum) {
    // Validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum || 0;

    // Convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i*2,2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00"+c).substr(c.length);
    }

    return rgb;
  }

  function extend(a, b){
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }

    return a;
  }

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? parseInt(result[1], 16) + ', ' + parseInt(result[2], 16) + ', ' + parseInt(result[3], 16) : null;
  }

  // Add box-shadow style to button (depending on its chosen bg-color)
  function setFocusStyle($button, bgColor) {
    var rgbColor = hexToRgb(bgColor);
    $button.style.boxShadow = '0 0 2px rgba(' + rgbColor +', 0.8), inset 0 0 0 1px rgba(0, 0, 0, 0.05)';
  }



  /*
   * Animations
   */

  function openModal() {
    var modal = getModal();
    fadeIn(getOverlay(), 10);
    show(modal);
    addClass(modal, 'showSweetAlert');
    removeClass(modal, 'hideSweetAlert');

    previousActiveElement = document.activeElement;
    var $okButton = modal.querySelector('button.confirm');
    $okButton.focus();

    setTimeout(function() {
      addClass(modal, 'visible');
    }, 500);

    var timer = modal.getAttribute('data-timer');

    if (timer !== "null" && timer !== "") {
      modal.timeout = setTimeout(function() {
        closeModal();
      }, timer);
    }
  }

  function closeModal() {
    var modal = getModal();
    fadeOut(getOverlay(), 5);
    fadeOut(modal, 5);
    removeClass(modal, 'showSweetAlert');
    addClass(modal, 'hideSweetAlert');
    removeClass(modal, 'visible');


    // Reset icon animations

    var $successIcon = modal.querySelector('.icon.success');
    removeClass($successIcon, 'animate');
    removeClass($successIcon.querySelector('.tip'), 'animateSuccessTip');
    removeClass($successIcon.querySelector('.long'), 'animateSuccessLong');

    var $errorIcon = modal.querySelector('.icon.error');
    removeClass($errorIcon, 'animateErrorIcon');
    removeClass($errorIcon.querySelector('.x-mark'), 'animateXMark');

    var $warningIcon = modal.querySelector('.icon.warning');
    removeClass($warningIcon, 'pulseWarning');
    removeClass($warningIcon.querySelector('.body'), 'pulseWarningIns');
    removeClass($warningIcon.querySelector('.dot'), 'pulseWarningIns');


    // Reset the page to its previous state
    window.onkeydown = previousWindowKeyDown;
    document.onclick = previousDocumentClick;
    if (previousActiveElement) {
      previousActiveElement.focus();
    }
    lastFocusedButton = undefined;
    clearTimeout(modal.timeout);
  }


  /*
   * Set "margin-top"-property on modal based on its computed height
   */

  function fixVerticalPosition() {
    var modal = getModal();

    modal.style.marginTop = getTopMargin(getModal());
  }



  /*
   * If library is injected after page has loaded
   */

  (function () {
	  if (document.readyState === "complete" || document.readyState === "interactive" && document.body) {
		  window.sweetAlertInitialize();
	  } else {
		  if (document.addEventListener) {
			  document.addEventListener('DOMContentLoaded', function factorial() {
				  document.removeEventListener('DOMContentLoaded', arguments.callee, false);
				  window.sweetAlertInitialize();
			  }, false);
		  } else if (document.attachEvent) {
			  document.attachEvent('onreadystatechange', function() {
				  if (document.readyState === 'complete') {
					  document.detachEvent('onreadystatechange', arguments.callee);
					  window.sweetAlertInitialize();
				  }
			  });
		  }
	  }
  })();

})(window, document);

/**
 * jQuery Geocoding and Places Autocomplete Plugin - V 1.6.4
 *
 * @author Martin Kleppe <kleppe@ubilabs.net>, 2014
 * @author Ubilabs http://ubilabs.net, 2014
 * @license MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
(function($,window,document,undefined){var defaults={bounds:true,country:null,map:false,details:false,detailsAttribute:"name",autoselect:true,location:false,mapOptions:{zoom:14,scrollwheel:false,mapTypeId:"roadmap"},markerOptions:{draggable:false},maxZoom:16,types:["geocode"],blur:false};var componentTypes=("street_address route intersection political "+"country administrative_area_level_1 administrative_area_level_2 "+"administrative_area_level_3 colloquial_area locality sublocality "+"neighborhood premise subpremise postal_code natural_feature airport "+"park point_of_interest post_box street_number floor room "+"lat lng viewport location "+"formatted_address location_type bounds").split(" ");var placesDetails=("id place_id url website vicinity reference name rating "+"international_phone_number icon formatted_phone_number").split(" ");function GeoComplete(input,options){this.options=$.extend(true,{},defaults,options);this.input=input;this.$input=$(input);this._defaults=defaults;this._name="geocomplete";this.init()}$.extend(GeoComplete.prototype,{init:function(){this.initMap();this.initMarker();this.initGeocoder();this.initDetails();this.initLocation()},initMap:function(){if(!this.options.map){return}if(typeof this.options.map.setCenter=="function"){this.map=this.options.map;return}this.map=new google.maps.Map($(this.options.map)[0],this.options.mapOptions);google.maps.event.addListener(this.map,"click",$.proxy(this.mapClicked,this));google.maps.event.addListener(this.map,"zoom_changed",$.proxy(this.mapZoomed,this))},initMarker:function(){if(!this.map){return}var options=$.extend(this.options.markerOptions,{map:this.map});if(options.disabled){return}this.marker=new google.maps.Marker(options);google.maps.event.addListener(this.marker,"dragend",$.proxy(this.markerDragged,this))},initGeocoder:function(){var options={types:this.options.types,bounds:this.options.bounds===true?null:this.options.bounds,componentRestrictions:this.options.componentRestrictions};if(this.options.country){options.componentRestrictions={country:this.options.country}}this.autocomplete=new google.maps.places.Autocomplete(this.input,options);this.geocoder=new google.maps.Geocoder;if(this.map&&this.options.bounds===true){this.autocomplete.bindTo("bounds",this.map)}google.maps.event.addListener(this.autocomplete,"place_changed",$.proxy(this.placeChanged,this));this.$input.keypress(function(event){if(event.keyCode===13){return false}});this.$input.bind("geocode",$.proxy(function(){this.find()},this));if(this.options.blur===true){this.$input.blur($.proxy(function(){this.find()},this))}},initDetails:function(){if(!this.options.details){return}var $details=$(this.options.details),attribute=this.options.detailsAttribute,details={};function setDetail(value){details[value]=$details.find("["+attribute+"="+value+"]")}$.each(componentTypes,function(index,key){setDetail(key);setDetail(key+"_short")});$.each(placesDetails,function(index,key){setDetail(key)});this.$details=$details;this.details=details},initLocation:function(){var location=this.options.location,latLng;if(!location){return}if(typeof location=="string"){this.find(location);return}if(location instanceof Array){latLng=new google.maps.LatLng(location[0],location[1])}if(location instanceof google.maps.LatLng){latLng=location}if(latLng){if(this.map){this.map.setCenter(latLng)}if(this.marker){this.marker.setPosition(latLng)}}},find:function(address){this.geocode({address:address||this.$input.val()})},geocode:function(request){if(this.options.bounds&&!request.bounds){if(this.options.bounds===true){request.bounds=this.map&&this.map.getBounds()}else{request.bounds=this.options.bounds}}if(this.options.country){request.region=this.options.country}this.geocoder.geocode(request,$.proxy(this.handleGeocode,this))},selectFirstResult:function(){var selected="";if($(".pac-item-selected")[0]){selected="-selected"}var $span1=$(".pac-container .pac-item"+selected+":first span:nth-child(2)").text();var $span2=$(".pac-container .pac-item"+selected+":first span:nth-child(3)").text();var firstResult=$span1;if($span2){firstResult+=" - "+$span2}this.$input.val(firstResult);return firstResult},handleGeocode:function(results,status){if(status===google.maps.GeocoderStatus.OK){var result=results[0];this.$input.val(result.formatted_address);this.update(result);if(results.length>1){this.trigger("geocode:multiple",results)}}else{this.trigger("geocode:error",status)}},trigger:function(event,argument){this.$input.trigger(event,[argument])},center:function(geometry){if(geometry.viewport){this.map.fitBounds(geometry.viewport);if(this.map.getZoom()>this.options.maxZoom){this.map.setZoom(this.options.maxZoom)}}else{this.map.setZoom(this.options.maxZoom);this.map.setCenter(geometry.location)}if(this.marker){this.marker.setPosition(geometry.location);this.marker.setAnimation(this.options.markerOptions.animation)}},update:function(result){if(this.map){this.center(result.geometry)}if(this.$details){this.fillDetails(result)}this.trigger("geocode:result",result)},fillDetails:function(result){var data={},geometry=result.geometry,viewport=geometry.viewport,bounds=geometry.bounds;$.each(result.address_components,function(index,object){var name=object.types[0];$.each(object.types,function(index,name){data[name]=object.long_name;data[name+"_short"]=object.short_name})});$.each(placesDetails,function(index,key){data[key]=result[key]});$.extend(data,{formatted_address:result.formatted_address,location_type:geometry.location_type||"PLACES",viewport:viewport,bounds:bounds,location:geometry.location,lat:geometry.location.lat(),lng:geometry.location.lng()});$.each(this.details,$.proxy(function(key,$detail){var value=data[key];this.setDetail($detail,value)},this));this.data=data},setDetail:function($element,value){if(value===undefined){value=""}else if(typeof value.toUrlValue=="function"){value=value.toUrlValue()}if($element.is(":input")){$element.val(value)}else{$element.text(value)}},markerDragged:function(event){this.trigger("geocode:dragged",event.latLng)},mapClicked:function(event){this.trigger("geocode:click",event.latLng)},mapZoomed:function(event){this.trigger("geocode:zoom",this.map.getZoom())},resetMarker:function(){this.marker.setPosition(this.data.location);this.setDetail(this.details.lat,this.data.location.lat());this.setDetail(this.details.lng,this.data.location.lng())},placeChanged:function(){var place=this.autocomplete.getPlace();if(!place||!place.geometry){if(this.options.autoselect){var autoSelection=this.selectFirstResult();this.find(autoSelection)}}else{this.update(place)}}});$.fn.geocomplete=function(options){var attribute="plugin_geocomplete";if(typeof options=="string"){var instance=$(this).data(attribute)||$(this).geocomplete().data(attribute),prop=instance[options];if(typeof prop=="function"){prop.apply(instance,Array.prototype.slice.call(arguments,1));return $(this)}else{if(arguments.length==2){prop=arguments[1]}return prop}}else{return this.each(function(){var instance=$.data(this,attribute);if(!instance){instance=new GeoComplete(this,options);$.data(this,attribute,instance)}})}}})(jQuery,window,document);
// packaged - 3.1.8
(function () {

	/**
	 * Class for managing events.
	 * Can be extended to provide event functionality in other classes.
	 *
	 * @class EventEmitter Manages event registering and emitting.
	 */
	function EventEmitter() {}

	// Shortcuts to improve speed and size
	var proto = EventEmitter.prototype;
	var exports = this;
	var originalGlobalValue = exports.EventEmitter;

	/**
	 * Finds the index of the listener for the event in it's storage array.
	 *
	 * @param {Function[]} listeners Array of listeners to search through.
	 * @param {Function} listener Method to look for.
	 * @return {Number} Index of the specified listener, -1 if not found
	 * @api private
	 */
	function indexOfListener(listeners, listener) {
		var i = listeners.length;
		while (i--) {
			if (listeners[i].listener === listener) {
				return i;
			}
		}

		return -1;
	}

	/**
	 * Alias a method while keeping the context correct, to allow for overwriting of target method.
	 *
	 * @param {String} name The name of the target method.
	 * @return {Function} The aliased method
	 * @api private
	 */
	function alias(name) {
		return function aliasClosure() {
			return this[name].apply(this, arguments);
		};
	}

	/**
	 * Returns the listener array for the specified event.
	 * Will initialise the event object and listener arrays if required.
	 * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
	 * Each property in the object response is an array of listener functions.
	 *
	 * @param {String|RegExp} evt Name of the event to return the listeners from.
	 * @return {Function[]|Object} All listener functions for the event.
	 */
	proto.getListeners = function getListeners(evt) {
		var events = this._getEvents();
		var response;
		var key;

		// Return a concatenated array of all matching events if
		// the selector is a regular expression.
		if (typeof evt === 'object') {
			response = {};
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					response[key] = events[key];
				}
			}
		}
		else {
			response = events[evt] || (events[evt] = []);
		}

		return response;
	};

	/**
	 * Takes a list of listener objects and flattens it into a list of listener functions.
	 *
	 * @param {Object[]} listeners Raw listener objects.
	 * @return {Function[]} Just the listener functions.
	 */
	proto.flattenListeners = function flattenListeners(listeners) {
		var flatListeners = [];
		var i;

		for (i = 0; i < listeners.length; i += 1) {
			flatListeners.push(listeners[i].listener);
		}

		return flatListeners;
	};

	/**
	 * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
	 *
	 * @param {String|RegExp} evt Name of the event to return the listeners from.
	 * @return {Object} All listener functions for an event in an object.
	 */
	proto.getListenersAsObject = function getListenersAsObject(evt) {
		var listeners = this.getListeners(evt);
		var response;

		if (listeners instanceof Array) {
			response = {};
			response[evt] = listeners;
		}

		return response || listeners;
	};

	/**
	 * Adds a listener function to the specified event.
	 * The listener will not be added if it is a duplicate.
	 * If the listener returns true then it will be removed after it is called.
	 * If you pass a regular expression as the event name then the listener will be added to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to attach the listener to.
	 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addListener = function addListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var listenerIsWrapped = typeof listener === 'object';
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
				listeners[key].push(listenerIsWrapped ? listener : {
					listener: listener,
					once: false
				});
			}
		}

		return this;
	};

	/**
	 * Alias of addListener
	 */
	proto.on = alias('addListener');

	/**
	 * Semi-alias of addListener. It will add a listener that will be
	 * automatically removed after it's first execution.
	 *
	 * @param {String|RegExp} evt Name of the event to attach the listener to.
	 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addOnceListener = function addOnceListener(evt, listener) {
		return this.addListener(evt, {
			listener: listener,
			once: true
		});
	};

	/**
	 * Alias of addOnceListener.
	 */
	proto.once = alias('addOnceListener');

	/**
	 * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
	 * You need to tell it what event names should be matched by a regex.
	 *
	 * @param {String} evt Name of the event to create.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.defineEvent = function defineEvent(evt) {
		this.getListeners(evt);
		return this;
	};

	/**
	 * Uses defineEvent to define multiple events.
	 *
	 * @param {String[]} evts An array of event names to define.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.defineEvents = function defineEvents(evts) {
		for (var i = 0; i < evts.length; i += 1) {
			this.defineEvent(evts[i]);
		}
		return this;
	};

	/**
	 * Removes a listener function from the specified event.
	 * When passed a regular expression as the event name, it will remove the listener from all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to remove the listener from.
	 * @param {Function} listener Method to remove from the event.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeListener = function removeListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var index;
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				index = indexOfListener(listeners[key], listener);

				if (index !== -1) {
					listeners[key].splice(index, 1);
				}
			}
		}

		return this;
	};

	/**
	 * Alias of removeListener
	 */
	proto.off = alias('removeListener');

	/**
	 * Adds listeners in bulk using the manipulateListeners method.
	 * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
	 * You can also pass it a regular expression to add the array of listeners to all events that match it.
	 * Yeah, this function does quite a bit. That's probably a bad thing.
	 *
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to add.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addListeners = function addListeners(evt, listeners) {
		// Pass through to manipulateListeners
		return this.manipulateListeners(false, evt, listeners);
	};

	/**
	 * Removes listeners in bulk using the manipulateListeners method.
	 * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	 * You can also pass it an event name and an array of listeners to be removed.
	 * You can also pass it a regular expression to remove the listeners from all events that match it.
	 *
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to remove.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeListeners = function removeListeners(evt, listeners) {
		// Pass through to manipulateListeners
		return this.manipulateListeners(true, evt, listeners);
	};

	/**
	 * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
	 * The first argument will determine if the listeners are removed (true) or added (false).
	 * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	 * You can also pass it an event name and an array of listeners to be added/removed.
	 * You can also pass it a regular expression to manipulate the listeners of all events that match it.
	 *
	 * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
		var i;
		var value;
		var single = remove ? this.removeListener : this.addListener;
		var multiple = remove ? this.removeListeners : this.addListeners;

		// If evt is an object then pass each of it's properties to this method
		if (typeof evt === 'object' && !(evt instanceof RegExp)) {
			for (i in evt) {
				if (evt.hasOwnProperty(i) && (value = evt[i])) {
					// Pass the single listener straight through to the singular method
					if (typeof value === 'function') {
						single.call(this, i, value);
					}
					else {
						// Otherwise pass back to the multiple function
						multiple.call(this, i, value);
					}
				}
			}
		}
		else {
			// So evt must be a string
			// And listeners must be an array of listeners
			// Loop over it and pass each one to the multiple method
			i = listeners.length;
			while (i--) {
				single.call(this, evt, listeners[i]);
			}
		}

		return this;
	};

	/**
	 * Removes all listeners from a specified event.
	 * If you do not specify an event then all listeners will be removed.
	 * That means every event will be emptied.
	 * You can also pass a regex to remove all events that match it.
	 *
	 * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeEvent = function removeEvent(evt) {
		var type = typeof evt;
		var events = this._getEvents();
		var key;

		// Remove different things depending on the state of evt
		if (type === 'string') {
			// Remove all listeners for the specified event
			delete events[evt];
		}
		else if (type === 'object') {
			// Remove all events matching the regex.
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					delete events[key];
				}
			}
		}
		else {
			// Remove all listeners in all events
			delete this._events;
		}

		return this;
	};

	/**
	 * Alias of removeEvent.
	 *
	 * Added to mirror the node API.
	 */
	proto.removeAllListeners = alias('removeEvent');

	/**
	 * Emits an event of your choice.
	 * When emitted, every listener attached to that event will be executed.
	 * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
	 * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
	 * So they will not arrive within the array on the other side, they will be separate.
	 * You can also pass a regular expression to emit to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	 * @param {Array} [args] Optional array of arguments to be passed to each listener.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.emitEvent = function emitEvent(evt, args) {
		var listeners = this.getListenersAsObject(evt);
		var listener;
		var i;
		var key;
		var response;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				i = listeners[key].length;

				while (i--) {
					// If the listener returns true then it shall be removed from the event
					// The function is executed either with a basic call or an apply if there is an args array
					listener = listeners[key][i];

					if (listener.once === true) {
						this.removeListener(evt, listener.listener);
					}

					response = listener.listener.apply(this, args || []);

					if (response === this._getOnceReturnValue()) {
						this.removeListener(evt, listener.listener);
					}
				}
			}
		}

		return this;
	};

	/**
	 * Alias of emitEvent
	 */
	proto.trigger = alias('emitEvent');

	/**
	 * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
	 * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	 * @param {...*} Optional additional arguments to be passed to each listener.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.emit = function emit(evt) {
		var args = Array.prototype.slice.call(arguments, 1);
		return this.emitEvent(evt, args);
	};

	/**
	 * Sets the current value to check against when executing listeners. If a
	 * listeners return value matches the one set here then it will be removed
	 * after execution. This value defaults to true.
	 *
	 * @param {*} value The new value to check for when executing listeners.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.setOnceReturnValue = function setOnceReturnValue(value) {
		this._onceReturnValue = value;
		return this;
	};

	/**
	 * Fetches the current value to check against when executing listeners. If
	 * the listeners return value matches this one then it should be removed
	 * automatically. It will return true by default.
	 *
	 * @return {*|Boolean} The current value to check for or the default, true.
	 * @api private
	 */
	proto._getOnceReturnValue = function _getOnceReturnValue() {
		if (this.hasOwnProperty('_onceReturnValue')) {
			return this._onceReturnValue;
		}
		else {
			return true;
		}
	};

	/**
	 * Fetches the events object and creates one if required.
	 *
	 * @return {Object} The events storage object.
	 * @api private
	 */
	proto._getEvents = function _getEvents() {
		return this._events || (this._events = {});
	};

	/**
	 * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
	 *
	 * @return {Function} Non conflicting EventEmitter class.
	 */
	EventEmitter.noConflict = function noConflict() {
		exports.EventEmitter = originalGlobalValue;
		return EventEmitter;
	};

	// Expose the class either via AMD, CommonJS or the global object
	if (typeof define === 'function' && define.amd) {
		define('eventEmitter/EventEmitter',[],function () {
			return EventEmitter;
		});
	}
	else if (typeof module === 'object' && module.exports){
		module.exports = EventEmitter;
	}
	else {
		this.EventEmitter = EventEmitter;
	}
}.call(this));

/*!
 * eventie v1.0.4
 * event binding helper
 *   eventie.bind( elem, 'click', myFn )
 *   eventie.unbind( elem, 'click', myFn )
 */

/*jshint browser: true, undef: true, unused: true */
/*global define: false */

( function( window ) {



var docElem = document.documentElement;

var bind = function() {};

function getIEEvent( obj ) {
  var event = window.event;
  // add event.target
  event.target = event.target || event.srcElement || obj;
  return event;
}

if ( docElem.addEventListener ) {
  bind = function( obj, type, fn ) {
    obj.addEventListener( type, fn, false );
  };
} else if ( docElem.attachEvent ) {
  bind = function( obj, type, fn ) {
    obj[ type + fn ] = fn.handleEvent ?
      function() {
        var event = getIEEvent( obj );
        fn.handleEvent.call( fn, event );
      } :
      function() {
        var event = getIEEvent( obj );
        fn.call( obj, event );
      };
    obj.attachEvent( "on" + type, obj[ type + fn ] );
  };
}

var unbind = function() {};

if ( docElem.removeEventListener ) {
  unbind = function( obj, type, fn ) {
    obj.removeEventListener( type, fn, false );
  };
} else if ( docElem.detachEvent ) {
  unbind = function( obj, type, fn ) {
    obj.detachEvent( "on" + type, obj[ type + fn ] );
    try {
      delete obj[ type + fn ];
    } catch ( err ) {
      // can't delete window object properties
      obj[ type + fn ] = undefined;
    }
  };
}

var eventie = {
  bind: bind,
  unbind: unbind
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'eventie/eventie',eventie );
} else {
  // browser global
  window.eventie = eventie;
}

})( this );

/*!
 * imagesLoaded v3.1.8
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

( function( window, factory ) { 
  // universal module definition

  /*global define: false, module: false, require: false */

  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( [
      'eventEmitter/EventEmitter',
      'eventie/eventie'
    ], function( EventEmitter, eventie ) {
      return factory( window, EventEmitter, eventie );
    });
  } else if ( typeof exports === 'object' ) {
    // CommonJS
    module.exports = factory(
      window,
      require('wolfy87-eventemitter'),
      require('eventie')
    );
  } else {
    // browser global
    window.imagesLoaded = factory(
      window,
      window.EventEmitter,
      window.eventie
    );
  }

})( window,

// --------------------------  factory -------------------------- //

function factory( window, EventEmitter, eventie ) {



var $ = window.jQuery;
var console = window.console;
var hasConsole = typeof console !== 'undefined';

// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

var objToString = Object.prototype.toString;
function isArray( obj ) {
  return objToString.call( obj ) === '[object Array]';
}

// turn element or nodeList into an array
function makeArray( obj ) {
  var ary = [];
  if ( isArray( obj ) ) {
    // use object if already an array
    ary = obj;
  } else if ( typeof obj.length === 'number' ) {
    // convert nodeList to array
    for ( var i=0, len = obj.length; i < len; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
}

  // -------------------------- imagesLoaded -------------------------- //

  /**
   * @param {Array, Element, NodeList, String} elem
   * @param {Object or Function} options - if function, use as callback
   * @param {Function} onAlways - callback function
   */
  function ImagesLoaded( elem, options, onAlways ) {
    // coerce ImagesLoaded() without new, to be new ImagesLoaded()
    if ( !( this instanceof ImagesLoaded ) ) {
      return new ImagesLoaded( elem, options );
    }
    // use elem as selector string
    if ( typeof elem === 'string' ) {
      elem = document.querySelectorAll( elem );
    }

    this.elements = makeArray( elem );
    this.options = extend( {}, this.options );

    if ( typeof options === 'function' ) {
      onAlways = options;
    } else {
      extend( this.options, options );
    }

    if ( onAlways ) {
      this.on( 'always', onAlways );
    }

    this.getImages();

    if ( $ ) {
      // add jQuery Deferred object
      this.jqDeferred = new $.Deferred();
    }

    // HACK check async to allow time to bind listeners
    var _this = this;
    setTimeout( function() {
      _this.check();
    });
  }

  ImagesLoaded.prototype = new EventEmitter();

  ImagesLoaded.prototype.options = {};

  ImagesLoaded.prototype.getImages = function() {
    this.images = [];

    // filter & find items if we have an item selector
    for ( var i=0, len = this.elements.length; i < len; i++ ) {
      var elem = this.elements[i];
      // filter siblings
      if ( elem.nodeName === 'IMG' ) {
        this.addImage( elem );
      }
      // find children
      // no non-element nodes, #143
      var nodeType = elem.nodeType;
      if ( !nodeType || !( nodeType === 1 || nodeType === 9 || nodeType === 11 ) ) {
        continue;
      }
      var childElems = elem.querySelectorAll('img');
      // concat childElems to filterFound array
      for ( var j=0, jLen = childElems.length; j < jLen; j++ ) {
        var img = childElems[j];
        this.addImage( img );
      }
    }
  };

  /**
   * @param {Image} img
   */
  ImagesLoaded.prototype.addImage = function( img ) {
    var loadingImage = new LoadingImage( img );
    this.images.push( loadingImage );
  };

  ImagesLoaded.prototype.check = function() {
    var _this = this;
    var checkedCount = 0;
    var length = this.images.length;
    this.hasAnyBroken = false;
    // complete if no images
    if ( !length ) {
      this.complete();
      return;
    }

    function onConfirm( image, message ) {
      if ( _this.options.debug && hasConsole ) {
        console.log( 'confirm', image, message );
      }

      _this.progress( image );
      checkedCount++;
      if ( checkedCount === length ) {
        _this.complete();
      }
      return true; // bind once
    }

    for ( var i=0; i < length; i++ ) {
      var loadingImage = this.images[i];
      loadingImage.on( 'confirm', onConfirm );
      loadingImage.check();
    }
  };

  ImagesLoaded.prototype.progress = function( image ) {
    this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
    // HACK - Chrome triggers event before object properties have changed. #83
    var _this = this;
    setTimeout( function() {
      _this.emit( 'progress', _this, image );
      if ( _this.jqDeferred && _this.jqDeferred.notify ) {
        _this.jqDeferred.notify( _this, image );
      }
    });
  };

  ImagesLoaded.prototype.complete = function() {
    var eventName = this.hasAnyBroken ? 'fail' : 'done';
    this.isComplete = true;
    var _this = this;
    // HACK - another setTimeout so that confirm happens after progress
    setTimeout( function() {
      _this.emit( eventName, _this );
      _this.emit( 'always', _this );
      if ( _this.jqDeferred ) {
        var jqMethod = _this.hasAnyBroken ? 'reject' : 'resolve';
        _this.jqDeferred[ jqMethod ]( _this );
      }
    });
  };

  // -------------------------- jquery -------------------------- //

  if ( $ ) {
    $.fn.imagesLoaded = function( options, callback ) {
      var instance = new ImagesLoaded( this, options, callback );
      return instance.jqDeferred.promise( $(this) );
    };
  }


  // --------------------------  -------------------------- //

  function LoadingImage( img ) {
    this.img = img;
  }

  LoadingImage.prototype = new EventEmitter();

  LoadingImage.prototype.check = function() {
    // first check cached any previous images that have same src
    var resource = cache[ this.img.src ] || new Resource( this.img.src );
    if ( resource.isConfirmed ) {
      this.confirm( resource.isLoaded, 'cached was confirmed' );
      return;
    }

    // If complete is true and browser supports natural sizes,
    // try to check for image status manually.
    if ( this.img.complete && this.img.naturalWidth !== undefined ) {
      // report based on naturalWidth
      this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
      return;
    }

    // If none of the checks above matched, simulate loading on detached element.
    var _this = this;
    resource.on( 'confirm', function( resrc, message ) {
      _this.confirm( resrc.isLoaded, message );
      return true;
    });

    resource.check();
  };

  LoadingImage.prototype.confirm = function( isLoaded, message ) {
    this.isLoaded = isLoaded;
    this.emit( 'confirm', this, message );
  };

  // -------------------------- Resource -------------------------- //

  // Resource checks each src, only once
  // separate class from LoadingImage to prevent memory leaks. See #115

  var cache = {};

  function Resource( src ) {
    this.src = src;
    // add to cache
    cache[ src ] = this;
  }

  Resource.prototype = new EventEmitter();

  Resource.prototype.check = function() {
    // only trigger checking once
    if ( this.isChecked ) {
      return;
    }
    // simulate loading on detached element
    var proxyImage = new Image();
    eventie.bind( proxyImage, 'load', this );
    eventie.bind( proxyImage, 'error', this );
    proxyImage.src = this.src;
    // set flag
    this.isChecked = true;
  };

  // ----- events ----- //

  // trigger specified handler for event type
  Resource.prototype.handleEvent = function( event ) {
    var method = 'on' + event.type;
    if ( this[ method ] ) {
      this[ method ]( event );
    }
  };

  Resource.prototype.onload = function( event ) {
    this.confirm( true, 'onload' );
    this.unbindProxyEvents( event );
  };

  Resource.prototype.onerror = function( event ) {
    this.confirm( false, 'onerror' );
    this.unbindProxyEvents( event );
  };

  // ----- confirm ----- //

  Resource.prototype.confirm = function( isLoaded, message ) {
    this.isConfirmed = true;
    this.isLoaded = isLoaded;
    this.emit( 'confirm', this, message );
  };

  Resource.prototype.unbindProxyEvents = function( event ) {
    eventie.unbind( event.target, 'load', this );
    eventie.unbind( event.target, 'error', this );
  };

  // -----  ----- //

  return ImagesLoaded;

});
/**
 *   Unslider by @idiot
 */

(function($, f) {
	//  If there's no jQuery, Unslider can't work, so kill the operation.
	if(!$) return f;

	var Unslider = function() {
		//  Set up our elements
		this.el = f;
		this.items = f;

		//  Dimensions
		this.sizes = [];
		this.max = [0,0];

		//  Current inded
		this.current = 0;

		//  Start/stop timer
		this.interval = f;

		//  Set some options
		this.opts = {
			speed: 500,
			delay: 3000, // f for no autoplay
			complete: f, // when a slide's finished
			keys: !f, // keyboard shortcuts - disable if it breaks things
			dots: f, // display â€¢â€¢â€¢â€¢oâ€¢ pagination
			fluid: f // is it a percentage width?,
		};

		//  Create a deep clone for methods where context changes
		var _ = this;

		this.init = function(el, opts) {
			this.el = el;
			this.ul = el.children('ul');
			this.max = [el.outerWidth(), el.outerHeight()];
			this.items = this.ul.children('li').each(this.calculate);

			//  Check whether we're passing any options in to Unslider
			this.opts = $.extend(this.opts, opts);

			//  Set up the Unslider
			this.setup();

			return this;
		};

		//  Get the width for an element
		//  Pass a jQuery element as the context with .call(), and the index as a parameter: Unslider.calculate.call($('li:first'), 0)
		this.calculate = function(index) {
			var me = $(this),
				width = me.outerWidth(), height = me.outerHeight();

			//  Add it to the sizes list
			_.sizes[index] = [width, height];

			//  Set the max values
			if(width > _.max[0]) _.max[0] = width;
			if(height > _.max[1]) _.max[1] = height;
		};

		//  Work out what methods need calling
		this.setup = function() {
			//  Set the main element
			this.el.css({
				overflow: 'hidden',
				width: _.max[0],
				height: this.items.first().outerHeight()
			});

			//  Set the relative widths
			this.ul.css({width: (this.items.length * 100) + '%', position: 'relative'});
			this.items.css('width', (100 / this.items.length) + '%');

			if(this.opts.delay !== f) {
				this.start();
				this.el.hover(this.stop, this.start);
			}

			//  Custom keyboard support
			this.opts.keys && $(document).keydown(this.keys);

			//  Dot pagination
			this.opts.dots && this.dots();

			//  Little patch for fluid-width sliders. Screw those guys.
			if(this.opts.fluid) {
				var resize = function() {
					_.el.css('width', Math.min(Math.round((_.el.outerWidth() / _.el.parent().outerWidth()) * 100), 100) + '%');
				};

				resize();
				$(window).resize(resize);
			}

			if(this.opts.arrows) {
				this.el.parent().append('<p class="arrows"><span class="prev">â†</span><span class="next">â†’</span></p>')
					.find('.arrows span').click(function() {
						$.isFunction(_[this.className]) && _[this.className]();
					});
			};

			//  Swipe support
			if($.event.swipe) {
				this.el.on('swipeleft', _.prev).on('swiperight', _.next);
			}
		};

		//  Move Unslider to a slide index
		this.move = function(index, cb) {
			//  If it's out of bounds, go to the first slide
			if(!this.items.eq(index).length) index = 0;
			if(index < 0) index = (this.items.length - 1);

			var target = this.items.eq(index);
			var obj = {height: target.outerHeight()};
			var speed = cb ? 5 : this.opts.speed;

			if(!this.ul.is(':animated')) {
				//  Handle those pesky dots
				_.el.find('.dot:eq(' + index + ')').addClass('active').siblings().removeClass('active');

				this.el.animate(obj, speed) && this.ul.animate($.extend({left: '-' + index + '00%'}, obj), speed, function(data) {
					_.current = index;
					$.isFunction(_.opts.complete) && !cb && _.opts.complete(_.el);
				});
			}
		};

		//  Autoplay functionality
		this.start = function() {
			_.interval = setInterval(function() {
				_.move(_.current + 1);
			}, _.opts.delay);
		};

		//  Stop autoplay
		this.stop = function() {
			_.interval = clearInterval(_.interval);
			return _;
		};

		//  Keypresses
		this.keys = function(e) {
			var key = e.which;
			var map = {
				//  Prev/next
				37: _.prev,
				39: _.next,

				//  Esc
				27: _.stop
			};

			if($.isFunction(map[key])) {
				map[key]();
			}
		};

		//  Arrow navigation
		this.next = function() { return _.stop().move(_.current + 1) };
		this.prev = function() { return _.stop().move(_.current - 1) };

		this.dots = function() {
			//  Create the HTML
			var html = '<ol class="dots">';
				$.each(this.items, function(index) { html += '<li class="dot' + (index < 1 ? ' active' : '') + '">' + (index + 1) + '</li>'; });
				html += '</ol>';

			//  Add it to the Unslider
			this.el.addClass('has-dots').append(html).find('.dot').click(function() {
				_.move($(this).index());
			});
		};
	};

	//  Create a jQuery plugin
	$.fn.unslider = function(o) {
		var len = this.length;

		//  Enable multiple-slider support
		return this.each(function(index) {
			//  Cache a copy of $(this), so it
			var me = $(this);
			var instance = (new Unslider).init(me, o);

			//  Invoke an Unslider instance
			me.data('unslider' + (len > 1 ? '-' + (index + 1) : ''), instance);
		});
	};
})(window.jQuery, false);
/*!
 * jQuery UI Touch Punch 0.2.3
 *
 * Copyright 2011–2014, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function ($) {

  // Detect touch support
  $.support.touch = 'ontouchend' in document;

  // Ignore browsers without touch support
  if (!$.support.touch) {
    return;
  }

  var mouseProto = $.ui.mouse.prototype,
      _mouseInit = mouseProto._mouseInit,
      _mouseDestroy = mouseProto._mouseDestroy,
      touchHandled;

  /**
   * Simulate a mouse event based on a corresponding touch event
   * @param {Object} event A touch event
   * @param {String} simulatedType The corresponding mouse event
   */
  function simulateMouseEvent (event, simulatedType) {

    // Ignore multi-touch events
    if (event.originalEvent.touches.length > 1) {
      return;
    }

    event.preventDefault();

    var touch = event.originalEvent.changedTouches[0],
        simulatedEvent = document.createEvent('MouseEvents');
    
    // Initialize the simulated mouse event using the touch event's coordinates
    simulatedEvent.initMouseEvent(
      simulatedType,    // type
      true,             // bubbles                    
      true,             // cancelable                 
      window,           // view                       
      1,                // detail                     
      touch.screenX,    // screenX                    
      touch.screenY,    // screenY                    
      touch.clientX,    // clientX                    
      touch.clientY,    // clientY                    
      false,            // ctrlKey                    
      false,            // altKey                     
      false,            // shiftKey                   
      false,            // metaKey                    
      0,                // button                     
      null              // relatedTarget              
    );

    // Dispatch the simulated event to the target element
    event.target.dispatchEvent(simulatedEvent);
  }

  /**
   * Handle the jQuery UI widget's touchstart events
   * @param {Object} event The widget element's touchstart event
   */
  mouseProto._touchStart = function (event) {

    var self = this;

    // Ignore the event if another widget is already being handled
    if (touchHandled || !self._mouseCapture(event.originalEvent.changedTouches[0])) {
      return;
    }

    // Set the flag to prevent other widgets from inheriting the touch event
    touchHandled = true;

    // Track movement to determine if interaction was a click
    self._touchMoved = false;

    // Simulate the mouseover event
    simulateMouseEvent(event, 'mouseover');

    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');

    // Simulate the mousedown event
    simulateMouseEvent(event, 'mousedown');
  };

  /**
   * Handle the jQuery UI widget's touchmove events
   * @param {Object} event The document's touchmove event
   */
  mouseProto._touchMove = function (event) {

    // Ignore event if not handled
    if (!touchHandled) {
      return;
    }

    // Interaction was not a click
    this._touchMoved = true;

    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');
  };

  /**
   * Handle the jQuery UI widget's touchend events
   * @param {Object} event The document's touchend event
   */
  mouseProto._touchEnd = function (event) {

    // Ignore event if not handled
    if (!touchHandled) {
      return;
    }

    // Simulate the mouseup event
    simulateMouseEvent(event, 'mouseup');

    // Simulate the mouseout event
    simulateMouseEvent(event, 'mouseout');

    // If the touch interaction did not move, it should trigger a click
    if (!this._touchMoved) {

      // Simulate the click event
      simulateMouseEvent(event, 'click');
    }

    // Unset the flag to allow other widgets to inherit the touch event
    touchHandled = false;
  };

  /**
   * A duck punch of the $.ui.mouse _mouseInit method to support touch events.
   * This method extends the widget with bound touch event handlers that
   * translate touch events to mouse events and pass them to the widget's
   * original mouse event handling methods.
   */
  mouseProto._mouseInit = function () {
    
    var self = this;

    // Delegate the touch handlers to the widget's element
    self.element.bind({
      touchstart: $.proxy(self, '_touchStart'),
      touchmove: $.proxy(self, '_touchMove'),
      touchend: $.proxy(self, '_touchEnd')
    });

    // Call the original $.ui.mouse init method
    _mouseInit.call(self);
  };

  /**
   * Remove the touch event handlers
   */
  mouseProto._mouseDestroy = function () {
    
    var self = this;

    // Delegate the touch handlers to the widget's element
    self.element.unbind({
      touchstart: $.proxy(self, '_touchStart'),
      touchmove: $.proxy(self, '_touchMove'),
      touchend: $.proxy(self, '_touchEnd')
    });

    // Call the original $.ui.mouse destroy method
    _mouseDestroy.call(self);
  };

})(jQuery);
/*
* jQuery UI Tag-it!
*
* @version v2.0 (06/2011)
*
* Copyright 2011, Levy Carneiro Jr.
* Released under the MIT license.
* http://aehlke.github.com/tag-it/LICENSE
*
* Homepage:
*   http://aehlke.github.com/tag-it/
*
* Authors:
*   Levy Carneiro Jr.
*   Martin Rehfeld
*   Tobias Schmidt
*   Skylar Challand
*   Alex Ehlke
*
* Maintainer:
*   Alex Ehlke - Twitter: @aehlke
*
* Dependencies:
*   jQuery v1.4+
*   jQuery UI v1.8+
*/
(function($) {

    $.widget('ui.tagit', {
        options: {
            allowDuplicates   : false,
            caseSensitive     : true,
            fieldName         : 'tags',
            placeholderText   : null,   // Sets `placeholder` attr on input field.
            readOnly          : false,  // Disables editing.
            removeConfirmation: false,  // Require confirmation to remove tags.
            tagLimit          : null,   // Max number of tags allowed (null for unlimited).

            // Used for autocomplete, unless you override `autocomplete.source`.
            availableTags     : [],

            // Use to override or add any options to the autocomplete widget.
            //
            // By default, autocomplete.source will map to availableTags,
            // unless overridden.
            autocomplete: {},

            // Shows autocomplete before the user even types anything.
            showAutocompleteOnFocus: true,

            // When enabled, quotes are unneccesary for inputting multi-word tags.
            allowSpaces: false,

            // The below options are for using a single field instead of several
            // for our form values.
            //
            // When enabled, will use a single hidden field for the form,
            // rather than one per tag. It will delimit tags in the field
            // with singleFieldDelimiter.
            //
            // The easiest way to use singleField is to just instantiate tag-it
            // on an INPUT element, in which case singleField is automatically
            // set to true, and singleFieldNode is set to that element. This
            // way, you don't need to fiddle with these options.
            singleField: false,

            // This is just used when preloading data from the field, and for
            // populating the field with delimited tags as the user adds them.
            singleFieldDelimiter: ',',

            // Set this to an input DOM node to use an existing form field.
            // Any text in it will be erased on init. But it will be
            // populated with the text of tags as they are created,
            // delimited by singleFieldDelimiter.
            //
            // If this is not set, we create an input node for it,
            // with the name given in settings.fieldName.
            singleFieldNode: null,

            // Whether to animate tag removals or not.
            animate: true,

            // Optionally set a tabindex attribute on the input that gets
            // created for tag-it.
            tabIndex: null,

            // Event callbacks.
            beforeTagAdded      : null,
            afterTagAdded       : null,

            beforeTagRemoved    : null,
            afterTagRemoved     : null,

            onTagClicked        : null,
            onTagLimitExceeded  : null,


            // DEPRECATED:
            //
            // /!\ These event callbacks are deprecated and WILL BE REMOVED at some
            // point in the future. They're here for backwards-compatibility.
            // Use the above before/after event callbacks instead.
            onTagAdded  : null,
            onTagRemoved: null,
            // `autocomplete.source` is the replacement for tagSource.
            tagSource: null
            // Do not use the above deprecated options.
        },

        _create: function() {
            // for handling static scoping inside callbacks
            var that = this;

            // There are 2 kinds of DOM nodes this widget can be instantiated on:
            //     1. UL, OL, or some element containing either of these.
            //     2. INPUT, in which case 'singleField' is overridden to true,
            //        a UL is created and the INPUT is hidden.
            if (this.element.is('input')) {
                this.tagList = $('<ul></ul>').insertAfter(this.element);
                this.options.singleField = true;
                this.options.singleFieldNode = this.element;
                this.element.addClass('tagit-hidden-field');
            } else {
                this.tagList = this.element.find('ul, ol').andSelf().last();
            }

            this.tagInput = $('<input type="text" />').addClass('ui-widget-content');

            if (this.options.readOnly) this.tagInput.attr('disabled', 'disabled');

            if (this.options.tabIndex) {
                this.tagInput.attr('tabindex', this.options.tabIndex);
            }

            if (this.options.placeholderText) {
                this.tagInput.attr('placeholder', this.options.placeholderText);
            }

            if (!this.options.autocomplete.source) {
                this.options.autocomplete.source = function(search, showChoices) {
                    var filter = search.term.toLowerCase();
					if (this.options.availableTags) {
						var choices = $.grep(this.options.availableTags.split(","), function(element) {
							// Only match autocomplete options that begin with the search term.
							// (Case insensitive.)
							return (element.toLowerCase().indexOf(filter) === 0);
						});
						if (!this.options.allowDuplicates) {
							choices = this._subtractArray(choices, this.assignedTags());
						}
						showChoices(choices);
					}
                };
            }

            if (this.options.showAutocompleteOnFocus) {
                this.tagInput.focus(function(event, ui) {
                    that._showAutocomplete();
                });

                if (typeof this.options.autocomplete.minLength === 'undefined') {
                    this.options.autocomplete.minLength = 0;
                }
            }

            // Bind autocomplete.source callback functions to this context.
            if ($.isFunction(this.options.autocomplete.source)) {
                this.options.autocomplete.source = $.proxy(this.options.autocomplete.source, this);
            }

            // DEPRECATED.
            if ($.isFunction(this.options.tagSource)) {
                this.options.tagSource = $.proxy(this.options.tagSource, this);
            }

            this.tagList
                .addClass('tagit')
                .addClass('ui-widget ui-widget-content ui-corner-all')
                // Create the input field.
                .append($('<li class="tagit-new"></li>').append(this.tagInput))
                .click(function(e) {
                    var target = $(e.target);
                    if (target.hasClass('tagit-label')) {
                        var tag = target.closest('.tagit-choice');
                        if (!tag.hasClass('removed')) {
                            that._trigger('onTagClicked', e, {tag: tag, tagLabel: that.tagLabel(tag)});
                        }
                    } else {
                        // Sets the focus() to the input field, if the user
                        // clicks anywhere inside the UL. This is needed
                        // because the input field needs to be of a small size.
                        that.tagInput.focus();
                    }
                });

            // Single field support.
            var addedExistingFromSingleFieldNode = false;
            if (this.options.singleField) {
                if (this.options.singleFieldNode) {
                    // Add existing tags from the input field.
                    var node = $(this.options.singleFieldNode);
                    var tags = node.val().split(this.options.singleFieldDelimiter);
                    node.val('');
                    $.each(tags, function(index, tag) {
                        that.createTag(tag, null, true);
                        addedExistingFromSingleFieldNode = true;
                    });
                } else {
                    // Create our single field input after our list.
                    this.options.singleFieldNode = $('<input type="hidden" style="display:none;" value="" name="' + this.options.fieldName + '" />');
                    this.tagList.after(this.options.singleFieldNode);
                }
            }

            // Add existing tags from the list, if any.
            if (!addedExistingFromSingleFieldNode) {
                this.tagList.children('li').each(function() {
                    if (!$(this).hasClass('tagit-new')) {
                        that.createTag($(this).text(), $(this).attr('class'), true);
                        $(this).remove();
                    }
                });
            }

            // Events.
            this.tagInput
                .keydown(function(event) {
                    // Backspace is not detected within a keypress, so it must use keydown.
                    if (event.which == $.ui.keyCode.BACKSPACE && that.tagInput.val() === '') {
                        var tag = that._lastTag();
                        if (!that.options.removeConfirmation || tag.hasClass('remove')) {
                            // When backspace is pressed, the last tag is deleted.
                            that.removeTag(tag);
                        } else if (that.options.removeConfirmation) {
                            tag.addClass('remove ui-state-highlight');
                        }
                    } else if (that.options.removeConfirmation) {
                        that._lastTag().removeClass('remove ui-state-highlight');
                    }

                    // Comma/Space/Enter are all valid delimiters for new tags,
                    // except when there is an open quote or if setting allowSpaces = true.
                    // Tab will also create a tag, unless the tag input is empty,
                    // in which case it isn't caught.
                    if (
                        (event.which === $.ui.keyCode.COMMA && event.shiftKey === false) ||
                        event.which === $.ui.keyCode.ENTER ||
                        (
                            event.which == $.ui.keyCode.TAB &&
                            that.tagInput.val() !== ''
                        ) ||
                        (
                            event.which == $.ui.keyCode.SPACE &&
                            that.options.allowSpaces !== true &&
                            (
                                $.trim(that.tagInput.val()).replace( /^s*/, '' ).charAt(0) != '"' ||
                                (
                                    $.trim(that.tagInput.val()).charAt(0) == '"' &&
                                    $.trim(that.tagInput.val()).charAt($.trim(that.tagInput.val()).length - 1) == '"' &&
                                    $.trim(that.tagInput.val()).length - 1 !== 0
                                )
                            )
                        )
                    ) {
                        // Enter submits the form if there's no text in the input.
                        if (!(event.which === $.ui.keyCode.ENTER && that.tagInput.val() === '')) {
                            event.preventDefault();
                        }

                        // Autocomplete will create its own tag from a selection and close automatically.
                        if (!(that.options.autocomplete.autoFocus && that.tagInput.data('autocomplete-open'))) {
                            that.tagInput.autocomplete('close');
                            that.createTag(that._cleanedInput());
                        }
                    }
                }).blur(function(e){
                    // Create a tag when the element loses focus.
                    // If autocomplete is enabled and suggestion was clicked, don't add it.
                    if (!that.tagInput.data('autocomplete-open')) {
                        that.createTag(that._cleanedInput());
                    }
                });

            // Autocomplete.
            if (this.options.availableTags || this.options.tagSource || this.options.autocomplete.source) {
                var autocompleteOptions = {
                    select: function(event, ui) {
                        that.createTag(ui.item.value);
                        // Preventing the tag input to be updated with the chosen value.
                        return false;
                    }
                };
                $.extend(autocompleteOptions, this.options.autocomplete);

                // tagSource is deprecated, but takes precedence here since autocomplete.source is set by default,
                // while tagSource is left null by default.
                autocompleteOptions.source = this.options.tagSource || autocompleteOptions.source;

                this.tagInput.autocomplete(autocompleteOptions).bind('autocompleteopen.tagit', function(event, ui) {
                    that.tagInput.data('autocomplete-open', true);
                }).bind('autocompleteclose.tagit', function(event, ui) {
                    that.tagInput.data('autocomplete-open', false);
                });

                this.tagInput.autocomplete('widget').addClass('tagit-autocomplete');
            }
        },

        destroy: function() {
            $.Widget.prototype.destroy.call(this);

            this.element.unbind('.tagit');
            this.tagList.unbind('.tagit');

            this.tagInput.removeData('autocomplete-open');

            this.tagList.removeClass([
                'tagit',
                'ui-widget',
                'ui-widget-content',
                'ui-corner-all',
                'tagit-hidden-field'
            ].join(' '));

            if (this.element.is('input')) {
                this.element.removeClass('tagit-hidden-field');
                this.tagList.remove();
            } else {
                this.element.children('li').each(function() {
                    if ($(this).hasClass('tagit-new')) {
                        $(this).remove();
                    } else {
                        $(this).removeClass([
                            'tagit-choice',
                            'ui-widget-content',
                            'ui-state-default',
                            'ui-state-highlight',
                            'ui-corner-all',
                            'remove',
                            'tagit-choice-editable',
                            'tagit-choice-read-only'
                        ].join(' '));

                        $(this).text($(this).children('.tagit-label').text());
                    }
                });

                if (this.singleFieldNode) {
                    this.singleFieldNode.remove();
                }
            }

            return this;
        },

        _cleanedInput: function() {
            // Returns the contents of the tag input, cleaned and ready to be passed to createTag
            return $.trim(this.tagInput.val().replace(/^"(.*)"$/, '$1'));
        },

        _lastTag: function() {
            return this.tagList.find('.tagit-choice:last:not(.removed)');
        },

        _tags: function() {
            return this.tagList.find('.tagit-choice:not(.removed)');
        },

        assignedTags: function() {
            // Returns an array of tag string values
            var that = this;
            var tags = [];
            if (this.options.singleField) {
                tags = $(this.options.singleFieldNode).val().split(this.options.singleFieldDelimiter);
                if (tags[0] === '') {
                    tags = [];
                }
            } else {
                this._tags().each(function() {
                    tags.push(that.tagLabel(this));
                });
            }
            return tags;
        },

        _updateSingleTagsField: function(tags) {
            // Takes a list of tag string values, updates this.options.singleFieldNode.val to the tags delimited by this.options.singleFieldDelimiter
            $(this.options.singleFieldNode).val(tags.join(this.options.singleFieldDelimiter)).trigger('change');
        },

        _subtractArray: function(a1, a2) {
            var result = [];
            for (var i = 0; i < a1.length; i++) {
                if ($.inArray(a1[i], a2) == -1) {
                    result.push(a1[i]);
                }
            }
            return result;
        },

        tagLabel: function(tag) {
            // Returns the tag's string label.
            if (this.options.singleField) {
                return $(tag).find('.tagit-label:first').text();
            } else {
                return $(tag).find('input:first').val();
            }
        },

        _showAutocomplete: function() {
            this.tagInput.autocomplete('search', '');
        },

        _findTagByLabel: function(name) {
            var that = this;
            var tag = null;
            this._tags().each(function(i) {
                if (that._formatStr(name) == that._formatStr(that.tagLabel(this))) {
                    tag = $(this);
                    return false;
                }
            });
            return tag;
        },

        _isNew: function(name) {
            return !this._findTagByLabel(name);
        },

        _formatStr: function(str) {
            if (this.options.caseSensitive) {
                return str;
            }
            return $.trim(str.toLowerCase());
        },

        _effectExists: function(name) {
            return Boolean($.effects && ($.effects[name] || ($.effects.effect && $.effects.effect[name])));
        },

        createTag: function(value, additionalClass, duringInitialization) {
            var that = this;

            value = $.trim(value);

            if(this.options.preprocessTag) {
                value = this.options.preprocessTag(value);
            }

            if (value === '') {
                return false;
            }

            if (!this.options.allowDuplicates && !this._isNew(value)) {
                var existingTag = this._findTagByLabel(value);
                if (this._trigger('onTagExists', null, {
                    existingTag: existingTag,
                    duringInitialization: duringInitialization
                }) !== false) {
                    if (this._effectExists('highlight')) {
                        existingTag.effect('highlight');
                    }
                }
                return false;
            }

            if (this.options.tagLimit && this._tags().length >= this.options.tagLimit) {
                this._trigger('onTagLimitExceeded', null, {duringInitialization: duringInitialization});
                return false;
            }

            var label = $(this.options.onTagClicked ? '<a class="tagit-label"></a>' : '<span class="tagit-label"></span>').text(value);

            // Create tag.
            var tag = $('<li></li>')
                .addClass('tagit-choice ui-widget-content ui-state-default ui-corner-all')
                .addClass(additionalClass)
                .append(label);

            if (this.options.readOnly){
                tag.addClass('tagit-choice-read-only');
            } else {
                tag.addClass('tagit-choice-editable');
                // Button for removing the tag.
                var removeTagIcon = $('<span></span>')
                    .addClass('ui-icon ui-icon-close');
                var removeTag = $('<a><span class="text-icon">\xd7</span></a>') // \xd7 is an X
                    .addClass('tagit-close')
                    .append(removeTagIcon)
                    .click(function(e) {
                        // Removes a tag when the little 'x' is clicked.
                        that.removeTag(tag);
                    });
                tag.append(removeTag);
            }

            // Unless options.singleField is set, each tag has a hidden input field inline.
            if (!this.options.singleField) {
                var escapedValue = label.html();
                tag.append('<input type="hidden" value="' + escapedValue + '" name="' + this.options.fieldName + '" class="tagit-hidden-field" />');
            }

            if (this._trigger('beforeTagAdded', null, {
                tag: tag,
                tagLabel: this.tagLabel(tag),
                duringInitialization: duringInitialization
            }) === false) {
                return;
            }

            if (this.options.singleField) {
                var tags = this.assignedTags();
                tags.push(value);
                this._updateSingleTagsField(tags);
            }

            // DEPRECATED.
            this._trigger('onTagAdded', null, tag);

            this.tagInput.val('');

            // Insert tag.
            this.tagInput.parent().before(tag);

            this._trigger('afterTagAdded', null, {
                tag: tag,
                tagLabel: this.tagLabel(tag),
                duringInitialization: duringInitialization
            });

            if (this.options.showAutocompleteOnFocus && !duringInitialization) {
                setTimeout(function () { that._showAutocomplete(); }, 0);
            }
        },

        removeTag: function(tag, animate) {
            animate = typeof animate === 'undefined' ? this.options.animate : animate;

            tag = $(tag);

            // DEPRECATED.
            this._trigger('onTagRemoved', null, tag);

            if (this._trigger('beforeTagRemoved', null, {tag: tag, tagLabel: this.tagLabel(tag)}) === false) {
                return;
            }

            if (this.options.singleField) {
                var tags = this.assignedTags();
                var removedTagLabel = this.tagLabel(tag);
                tags = $.grep(tags, function(el){
                    return el != removedTagLabel;
                });
                this._updateSingleTagsField(tags);
            }

            if (animate) {
                tag.addClass('removed'); // Excludes this tag from _tags.
                var hide_args = this._effectExists('blind') ? ['blind', {direction: 'horizontal'}, 'fast'] : ['fast'];

                var thisTag = this;
                hide_args.push(function() {
                    tag.remove();
                    thisTag._trigger('afterTagRemoved', null, {tag: tag, tagLabel: thisTag.tagLabel(tag)});
                });

                tag.fadeOut('fast').hide.apply(tag, hide_args).dequeue();
            } else {
                tag.remove();
                this._trigger('afterTagRemoved', null, {tag: tag, tagLabel: this.tagLabel(tag)});
            }

        },

        removeTagByLabel: function(tagLabel, animate) {
            var toRemove = this._findTagByLabel(tagLabel);
            if (!toRemove) {
                throw "No such tag exists with the name '" + tagLabel + "'";
            }
            this.removeTag(toRemove, animate);
        },

        removeAll: function() {
            // Removes all tags.
            var that = this;
            this._tags().each(function(index, tag) {
                that.removeTag(tag, false);
            });
        }

    });
})(jQuery);
jQuery(document).ready(function($){

	var editor 			= lasso_editor.editor,
		strings 		= lasso_editor.strings,
		settingsLink	= lasso_editor.settingsLink,
		post_container  = lasso_editor.article_object,
		toolbar 		= lasso_editor.toolbar,
        toolbarPopup 		= lasso_editor.toolbarPopup,
		toolbarHeading 	= lasso_editor.toolbarHeadings,
		panel           = lasso_editor.component_sidebar,
		postid          = lasso_editor.postid,
		modal 			= lasso_editor.component_modal,
		components 		= lasso_editor.components,
		featImgClass   	= lasso_editor.featImgClass,
		featImgNonce    = lasso_editor.featImgNonce,
		titleClass      = lasso_editor.titleClass,
		uploadControls  = lasso_editor.featImgControls,
		wpImgEdit 		= lasso_editor.wpImgEdit,
		lassoDragHandle = lasso_editor.handle,
		lassoMapForm 	= lasso_editor.mapFormFooter,
		mapLocations    = lasso_editor.mapLocations,
		mapZoom    		= lasso_editor.mapZoom,
		mapStart        = lasso_editor.mapStart,
		objectsNoSave   = lasso_editor.objectsNoSave,
		objectsNonEditable = lasso_editor.objectsNonEditable,
		supportedNoSave = lasso_editor.supportedNoSave

	function restoreSelection(range) {
	    if (range) {
	        if (window.getSelection) {
	            var sel = window.getSelection();
	            sel.removeAllRanges();
	            sel.addRange(range);
	        } else if (document.selection && range.select) {
	            range.select();
	        }
	    }
	}
    
    function saveSelection() {
        if (window.getSelection) {
            article.highlight();
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                return sel.getRangeAt(0);
            }
        } else if (document.selection && document.selection.createRange) {
            return document.selection.createRange();
        }
        return null;
    }

	/*
	function to disable selection. Not used for now
	jQuery.fn.extend({
		disableSelection : function() {
			return this.each(function() {
				this.onselectstart = function() { return false; };
				this.unselectable = "on";
				jQuery(this).css('user-select', 'none');
				jQuery(this).css('-o-user-select', 'none');
				jQuery(this).css('-moz-user-select', 'none');
				jQuery(this).css('-khtml-user-select', 'none');
				jQuery(this).css('-webkit-user-select', 'none');
			});
		}
	});*/
	

	$('#lasso--edit').click(function(e){
	
		if ($(post_container).length ==0 ){
			// try one more time, support for shapely theme
			var contClasses = [".shapely-content",".entry-content",".aesop-entry-content",".novella-entry-content",".post-content", ".entry-content-wrapper",".post_content",".gp-entry-content"];
			for (var i = 0; i < contClasses.length; i++) {		
				if ($(contClasses[i]).length >0 ){
					post_container = contClasses[i];
					break;
				}
			}
			
			if ($(post_container).length ==0 ){
				// if we can't find the article class, warn them and exit
				swal({
					title: strings.warning,
					type: 'info',
					text: strings.missingClass,
					showCancelButton: true,
					cancelButtonText: strings.cancelText,
					confirmButtonColor: '#007aab',
					confirmButtonText: strings.missingConfirm,
					closeOnConfirm: false
				},
				function(){
					location.replace(settingsLink);
				});
				return;
			}
		}
		
		lasso_editor.article_object = post_container;
		
		// ways to inject codes into the enterEditor
		if (lasso_editor.enterEditorHookArray) {
			$(lasso_editor.enterEditorHookArray).each(function(key, val){
				val();
			});
		}
		
		// lock the post for editing
		var data = {
				action: 'editus_lock_post',
				postid: lasso_editor.postid
		};
		lasso_editor.dontlock = false;
		jQuery.post(lasso_editor.ajaxurl2, data, function(response) {
			if( response ){
				if (response.trim()=="true") {
					lasso_editor.dontlock = true;
				} else {
                    swal({
                            title:"Lock Post Fail",
                            text: response,
                            closeOnConfirm: true
                    });
                    exitEditor();
                }
				
			} else {
				alert("Error locking the post for editing");
				exitEditor();
			}
			
		});
		//keep locking periodically
		if (!lasso_editor.dontlock) {
			lasso_editor.lockIntervalID = window.setInterval(lockPost, 120000);
		}
		
		
		function lockPost() {
			var data = {
				action: 'editus_lock_post',
				postid: lasso_editor.postid
			};
			jQuery.post(lasso_editor.ajaxurl2, data, function(response) {
				/*if( response ){
					if (response!="true") {
						alert(response);
						exitEditor();
					}
					
				} else {
					alert("Error locking the post for edit");
					exitEditor();
				}*/
				
			});
		}
	
		e.preventDefault();

		// add body class editing
		$('body').toggleClass('lasso-editing');

		//append editor id to post container
		$(post_container).prop('id', editor);

		// append toolbar
		$(toolbar).hide().appendTo('body').fadeIn(300);

		// fade in controls if previous exacped
		$('.lasso--controls__right').css('opacity',1);

	    // set edtior to editable
	    $('#'+editor).attr('contenteditable',true);

	    // add settings panel
		$('body').append(panel);

		// append upload bar to featured image if present
		if ( $( featImgClass ).length > 0 ) {
			if ( $(lasso_editor.featImgClass).is( "img" ) ) {
				$(featImgClass).parent().append( uploadControls );
			} else {
				$(featImgClass).append( uploadControls );
			}
		}

		// append contenteditable to title if set
		if ( $(titleClass).length > 0 ) {
			$(titleClass).attr('contenteditable', true);
		} else {
			// try one more time with .entry-title
			var titleClasses = [".entry-title-primary",".entry-title",".novella-entry-title"];
			for (var i = 0; i < titleClasses.length; i++) {
				if ( $(titleClasses[i]).length > 0 ) {
					lasso_editor.titleClass = titleClass = titleClasses[i];
					$(titleClass).attr('contenteditable', true);
					break;
				};
			}
		}
		
		lasso_editor.subtitleClass="";
		var subtitleClasses = [".entry-subtitle",".novella-entry-subtitle"];
		for (var i = 0; i < subtitleClasses.length; i++) {
			if ( $(subtitleClasses[i]).length > 0 ) {
				lasso_editor.subtitleClass = subtitleClasses[i];
				$(subtitleClasses[i]).attr('contenteditable', true);
				break;
			};
		}

		// if tehre are any scrollnav sections we need to break them open so that we can drag compnents around in them
		$('.scroll-nav__section').each(function(){
			$(this).children().unwrap();
		})

		// add an exit editor button
		$('.lasso--controls__right ').prepend('<a title="'+lasso_editor.strings.exiteditor+'" id="lasso--exit" href="#"></a>');

		// append the toolbar to any components that dont have them
		// @todo - this likely needs to be changed to a lasso- namespaced item which then needs to be updated in Aesop Story Engine
		$('.aesop-component').each(function(){

			// if there's no toolbar present
			if ( !$('.lasso-component--toolbar').length > 0 ) {

				// if this is a map then we need to first wrap it so that we can drag the  map around
				if ( $(this).hasClass('aesop-map-component') ) {

					var $this = $(this)

					// so wrap it with a aesop-compoentn aesop-map-component div
					// @todo - note once a map is inserted it can't be edited after saving again. a user has to delete the existin map and add a new map
					// to
					//$this.wrap('<form id="lasso--map-form" class="aesop-component aesop-map-component lasso--map-drag-holder" data-component-type="map" >').before( lassoDragHandle ).after( lassoMapForm );
					$this.wrap('<div id="lasso--map-form" class="aesop-component aesop-map-component lasso--map-drag-holder" data-component-type="map" >').before( lassoDragHandle );

				} else {

					$(this).append( lassoDragHandle );
				}
			}
		});

        lasso_editor.wrapImg = function () {
            // find images inserted from within the wordpress backend post editor and
            // wrap them in a div, then append an edit button for editing the image
            /*$("[class*='wp-image-']").each(function(){
                var $this = $(this)
                if ( !$('.lasso--wpimg-edit').length > 0 ) {
                    if ( $this.parent().hasClass('wp-caption') ) {
                        $this.parent().addClass('lasso--wpimg__wrap')
                    } else {
                        $this.wrap('<figure data-component-type="wpimg" class="lasso--wpimg__wrap lasso-component">')
                    }
                    
                    
                    $this.parent().data( $this.data() );
                    var s =$this.attr('src');
                    if (s) {
                       $this.parent().data({componentType:"wpimg", img: $this.attr('src')});  
                    }
                }
            });*/
            
            //$('.lasso-component:not(.lasso--wpimg__wrap)').each(function(){
            $('.lasso-component').each(function(){

                var $this = $(this)
                if ( $(this).find('.lasso-component--controls').length == 0 ) {
                    if (!lasso_editor.oldWPimg) {
                        $(this).prepend( lassoDragHandle );
                        var img = $(this).find('img')[0];
                        var ctrl = $this.find('.lasso-component--controls')[0];
                        if ($(img).hasClass('alignnone') || $(img).hasClass('alignleft')) {
                            $(ctrl).removeClass('editus-center');
                        }
                        if ($(img).hasClass('alignright')) {
                            $(ctrl).removeClass('editus-center');
                            $(ctrl).addClass('editus-right');
                        }
                    } else { 
                        if ( $this.parent().hasClass('wp-caption') ) {
                            $this.parent().addClass('lasso--wpimg__wrap')
                        }/* else if ( !$this.parent().hasClass('lasso--wpimg__wrap') ) {
                            $this.wrap('<figure data-component-type="wpimg" class="lasso--wpimg__wrap lasso-component">')
                        }*/
                        $this.parent().prepend(lasso_editor.wpImgEdit);
                    }

                }

            })
            
            //wp image block
			$('.wp-block-image').each(function(){
                var $this = $(this)
                if ( $(this).find('.lasso-component--controls').length == 0 ) {
                    $this.prepend(lasso_editor.wpImgBlockEdit);
					$this.attr('data-component-type','wpimg-block');
                }

            })
            
            //wp cover block
            $('.wp-block-cover').each(function(){
                var $this = $(this)
                if ( $(this).find('.lasso-component--controls').length == 0 ) {
                    $this.prepend(lasso_editor.wpImgBlockEdit);
                    $this.find(".lasso-clone,.lasso-delete").remove();
                    $this.find(".lasso-component--controls").width('61px');
					$this.attr('data-component-type','wpcover-block');
                }

            })
        }
        
        lasso_editor.wrapImg();

		
		

		/////////////////
		///
		///   CONTENT EDITABLE / TOOLBAR
		///
		/// - attributes and tags are set to null to allow any markup and block level items to be passed through
		///   this means that medium.js is only providing us with a helper API to invoke certain markup and to 
		///   insert HTML. It's important to realize that the_content filter together with wpautop is responsible
		///   for automatically making new paragraph elements on enter
		///
		///////////////////
		article = document.getElementById(editor),
	    articleMedium = new Medium({
	        element: article,
	        mode: Medium.richMode,
	        attributes: null,
	        tags: null,
	        placeholder:lasso_editor.strings.justWrite,
		    pasteAsText: true,
	    	cssClasses: {
				editor: 'lasso-editor',
				pasteHook: 'lasso-editor-paste-hook',
				placeholder: 'lasso-editor-placeholder',
				clear: 'lasso-editor-clear'
			}
	    });
		
		$(objectsNonEditable).attr('contenteditable',false);
		$(objectsNonEditable).attr('readonly',true);
        
        // set some figures uneditable
        $("figure.wp-block-image, figure.lasso--wpimg__wrap").attr('contenteditable',false).attr('readonly',true);

		
		// remove any additional markup so we dont save it as HTML
		if (objectsNoSave.length) {
		    objectsNoSave = objectsNoSave+","+supportedNoSave;
		} else {
			objectsNoSave = supportedNoSave;
		}
		
		lasso_editor.objectsNoSave = objectsNoSave;
		
		if ($(objectsNonEditable).length || (lasso_editor.showIgnoredItems && ($(objectsNoSave).length)|| $(supportedNoSave).length )) {
			lasso_editor.readOnlyExists = true;
		} else {
			lasso_editor.readOnlyExists = false;
		}
		if (!lasso_editor.showIgnoredItems) {
		    $(objectsNoSave).remove();
		    $(supportedNoSave).remove();
		} else {
			$(objectsNoSave).attr('contenteditable',false);
		    $(objectsNoSave).attr('readonly',true);
		}
		
		// detect avia editor
		lasso_editor.aviaEditor = ($('.av_toggle_section,.av_textblock_section').length>0);
		
		// set links clickable
		if (!lasso_editor.linksEditable) {
			$("a").attr('contenteditable',false);
		}
		
		if (lasso_editor.disableEditPost) {
			//set everything uneditable
			$( "[contenteditable]" ).attr('contenteditable',false);
		}
		
		// custom fields
		if (lasso_editor.customFields) {
			var joined = [];
			for (var key in lasso_editor.customFields) {
				var imgControls = '<a title="Replace Image" href="" class="editus-custom-image-control" style="position:absolute;right:0px;"><i class="lasso-icon-image" style="color: black;font-size: 20px"></i></a>';
				if (typeof(lasso_editor.customFields[key]) == 'object') {
					var selector = lasso_editor.customFields[key]['selector'];
					joined.push(selector);
					if (lasso_editor.customFields[key]['imgurl']) {
						if ($(selector).find('.editus-custosm-image-control').length == 0) {
							$(selector).parent().parent().append( imgControls );
							$(selector).parent().parent().css("position", "relative");
							$(selector).parent().parent().find('.editus-custom-image-control').mousedown(imgDialog);
						}				
					}
				} else {
				   joined.push(lasso_editor.customFields[key]);
				}
			}
			lasso_editor.cfselector = joined.join(',');
			$(lasso_editor.cfselector).attr('contenteditable',true);
			if (lasso_editor.undeletableExists = ($(lasso_editor.cfselector).length>0)) {
				$(lasso_editor.cfselector).addClass('lasso-undeletable');
			}
		}
		
		//$(objectsNonEditable).disableSelection();

	    // this forces the default new element in content editable to be a paragraph element if
	    // it has no previous element to depart from 
	    // ref http://stackoverflow.com/a/15482748
	    document.execCommand('defaultParagraphSeparator', false, 'p');

		// cursor to the beginning
        if (articleMedium.element.firstChild == null) {
			var node = document.createElement("p");
			var textnode = document.createTextNode(" ");         // Create a text node
			node.appendChild(textnode);   
			articleMedium.element.appendChild(node);
		}
		articleMedium.cursor.caretToBeginning(articleMedium.element.firstChild);

		article.highlight = function() {
			if (document.activeElement !== article) {

				//articleMedium.select();
				article.focus();

			} else {

				return false;
			}
		};

		
		if (lasso_editor.toolbarPopup) {
            $(lasso_editor.toolbarPopup).hide().appendTo('body');
        }
		
		
		//color
		if (lasso_editor.showColor) {
            var cv = "#ff0000";
			// red is the default color
			$( '#lasso-toolbar--color-pick' ).iris();
			$( '#lasso-toolbar--color-pick' ).iris('color', '#f00');
            $('head').append('<style id="editus-colorpick">#lasso-toolbar--color-pick:before, #lasso-toolbar--color-set:before{color:#ff0000 !important;}</style>');
			
			$(window).mousedown(function() {
			    //Hide the color picker if visible
				$("#lasso-toolbar--color-pick").iris('hide');
			});
			
			function rgb2hex(rgb) {
				rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
				function hex(x) {
					return ("0" + parseInt(x).toString(16)).slice(-2);
				}
				return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
			}
			if (!lasso_editor.isMobile) {
			    $(".iris-picker").css({position:'absolute', top:-180});
			}
			$("#lasso-toolbar--color-pick").iris({
				palettes: true,
				change: function(event, ui) {
					// event = standard jQuery event, produced by whichever control was changed.
					// ui = standard jQuery UI object, with a color member containing a Color.js object

					// change the color
                    $('style#editus-colorpick').remove();
                    cv = ui.color.toString();
                    $('head').append('<style id="editus-colorpick">#lasso-toolbar--color-pick:before, #lasso-toolbar--color-set:before{color:'+cv+' !important;}</style>');

				}
			});
            
			$('#lasso-toolbar--color-pick').on('mousedown', function(event) {	
				if (event.target.id == 'lasso-toolbar--color-pick') {
				   $("#lasso-toolbar--color-pick").iris('toggle');
				}
                event.stopPropagation();				
			});
			
			$('#lasso-toolbar--color-set').on('mousedown', function() {
				$("#lasso-toolbar--color-pick").iris('hide');
				articleMedium.element.contentEditable = true;
				// exit if nothing is selected
				if (!lasso_editor.checkSelection(true)) return false;
				
				//var colorVar = rgb2hex($('#lasso-toolbar--color-pick').css("color"));
				articleMedium.invokeElement('span', { style: 'color:' + cv + ';'});
				//unselect
				if (window.getSelection) {
				  if (window.getSelection().empty) {  // Chrome
					window.getSelection().empty();
				  } else if (window.getSelection().removeAllRanges) {  // Firefox
					window.getSelection().removeAllRanges();
				  }
				} else if (document.selection) {  // IE?
				  document.selection.empty();
				}
                $(".lasso--text-popup").hide();
				articleMedium.makeUndoable();
				return false;
			});
		}

		
		
		// color end
		
		//alignement
		if (lasso_editor.showAlignment) {
			function alignHelper(align) {
				var focusedElements = articleMedium.html.textElementsAtCaret();
				if (focusedElements) {
					for (i = 0; i < focusedElements.length; i++) {
					  focusedElements[i].style.textAlign = align;
					}			
				}
				articleMedium.makeUndoable();
				return false;
			}
			$('#lasso-toolbar--right-align').mousedown(function() {
				return alignHelper("right");
			});
			
			$('#lasso-toolbar--left-align').mousedown(function() {
				return alignHelper("left");
			});
			
			$('#lasso-toolbar--center-align').mousedown(function() {
				return alignHelper("center");
			});
		}
		
		//end alignment
		
		$('#lasso-toolbar--ul').mousedown(function() {
				makeList("ul");
		});
		$('#lasso-toolbar--ol').mousedown(function() {
				makeList("ol");
		});
		
		function makeList(list_type) {
			var list = $("<"+list_type+"/>");
			var focusedElements = articleMedium.html.textElementsAtCaret();
			if (focusedElements) {
					for (i = 0; i < focusedElements.length; i++) {
					  list.append("<li>" + focusedElements[i].innerHTML + "</li>");
					  if (i>0) {
						  focusedElements[i].parentNode.removeChild(focusedElements[i]); 
					  }
					}	
					$(focusedElements[0]).replaceWith(list[0]);				
			}
				
			articleMedium.makeUndoable();
			article.highlight();
			//setCursor($(focusedElements[0]));
			//articleMedium.cursor.caretToBeginning(articleMedium.element.firstChild);
		}
		
				if (!lasso_editor.disableEditSC) {
			processShortcodes();
		}
		
		function processShortcodes()
		{
			$(article).children().filter(function(){
				return this.innerHTML.includes("EDITUS_OTHER_SHORTCODE_START");
			}).each(function(i, e){
				var re = /<!--EDITUS_OTHER_SHORTCODE_START\|\[(.*)\]-->/g ;
			    var cont = re.exec(this.innerHTML);
							
				$(this).next().append( '<div class="editus_shortcode" contenteditable="false">'+lasso_editor.strings.editShortcode+'</div>' );
				
				$(this).next().addClass("editus_shortcode_p");
				
				if (cont) $(this).next().find('.editus_shortcode')[0].dataset.shortcode = cont[1];
			});
		}
		
		$(document).on('click','.editus_shortcode', function(e){
			var $this = $(this);
		
			var s = $(window).scrollTop();
			swal({
				title: lasso_editor.strings.editShortcode,
				text: "<textarea id='shortcode_edit' name='shortcode'>"+ this.dataset.shortcode +"</textarea>",
				showCancelButton: true,
				confirmButtonColor: "#d9534f",
				confirmButtonText: "Modify",
				closeOnConfirm: true,
				obj: this
			},
			function(){
				var val = $('textarea#shortcode_edit').val();
				var data = {
					action: 'editus_do_shortcode',
					code: val,
					ID: lasso_editor.postid
				};
				
								
				jQuery.post(lasso_editor.ajaxurl2, data, function(response) {
						restoreSelection(window.selRange);
						if( response && response.includes("EDITUS_OTHER_SHORTCODE_END")){
							$this.parent().prev().remove();
							//$this.next().remove();
							$this.parent().replaceWith( response.replace("<!--EDITUS_OTHER_SHORTCODE_END-->","") );
							processShortcodes();
						} else {
							alert("Shortcode processing failed");
						}
						$(window).scrollTop(s);
				});				
			});
		})
		
		function taghelper(tag) {
			articleMedium.element.contentEditable = true;
			article.highlight();
		    articleMedium.invokeElement(tag);
			articleMedium.makeUndoable();
			return false;
		}
		
		$('[id="lasso-toolbar--bold"]').on('mousedown', function(e) {
			return taghelper(lasso_editor.boldTag);
		});
		
        $('[id="lasso-toolbar--underline"]').on('mousedown', function(e) {
			return taghelper('u');
		});

        $('[id="lasso-toolbar--italic"]').on('mousedown', function(e) {
			return taghelper(lasso_editor.iTag);
		});
        $('[id="lasso-toolbar--strike"]').on('mousedown', function(e) {
			return taghelper('strike');
		});
        
        $(document).on('keydown', function ( e ) {
            // remove formatting when the use pushes ctrl+space
            if ((e.metaKey || e.ctrlKey) && ( e.which == 32) ) {
                document.execCommand('removeFormat');
                document.execCommand('formatBlock', false, 'p')
            }
        });

		function heading_helper(heading) {
			articleMedium.element.contentEditable = true;
			article.highlight();

			articleMedium.invokeElement(heading);
			//reg = '/<h2 class="lasso-h2">([^<>]*)<\/h2>/i';
			reg = new RegExp('<'+heading+' class="lasso-'+heading+'">([^<>]*)<\\/'+heading+'>', 'i');;
				// the following code breaks the paragraphs before and after heading
			$(articleMedium.element).html(function(index,html){
				//return html.replace(/<h2 class="lasso-h2">([^<>]*)<\/h2>/i,'</p><'+heading+'>$1</'+heading+'><p>');
				return html.replace(reg,'</p><'+heading+'>$1</'+heading+'><p>');
			});

			articleMedium.makeUndoable();
			return false;
		}

		
		document.getElementById('lasso-toolbar--link').onmousedown = function() {
				 var article = document.getElementById(lasso_editor.editor);
    			article.highlight();
    			window.selRange = saveSelection();
			};
		document.getElementById('lasso-toolbar--html').onmousedown = function() {
				 var article = document.getElementById(lasso_editor.editor);
    			article.highlight();
    			window.selRange = saveSelection();
    			if( typeof window.selRange === 'undefined' || null == window.selRange ) {
    				window.selRange = saveSelection();
    			}
			};

		if ( toolbarHeading ) {
			document.getElementById('lasso-toolbar--h2').onmousedown = function() {
				return heading_helper('h2');
			};

			document.getElementById('lasso-toolbar--h3').onmousedown = function() {
				return heading_helper('h3');
			};
		}
		if ( lasso_editor.toolbarHeadingsH4 ) {
			document.getElementById('lasso-toolbar--h4').onmousedown = function() {
				return heading_helper('h4');
			};
			document.getElementById('lasso-toolbar--h5').onmousedown = function() {
				return heading_helper('h5');
			};
			document.getElementById('lasso-toolbar--h6').onmousedown = function() {
				return heading_helper('h6');
			};
		}

		
		document.getElementById('lasso-toolbar--link__create').onmousedown = function() {
			articleMedium.element.contentEditable = true;
		    article.highlight();
		    restoreSelection(window.selRange);
			var html = '<a class="lasso-link" contenteditable="false" ';
			
			if (!lasso_editor.linkEditable) { 
				html = '<a class="lasso-link" ';
			}

			var target = $('#lasso-toolbar--link__inner').text();
            
            if (target=="") {
                html = window.selRange.toString();
            } else {
                if (lasso_editor.prefixHTTP && !target.match(/http/i)){
                    target = 'http://'+target;
                }
                if ($('#aesop-toolbar--link_newtab').is(':checked')) {
                    html = html+' target="_blank" href="'+ target +'">'+window.selRange+'</a>';
                } else {
                    html = html+' href="'+ target +'">'+window.selRange+'</a>';
                }
            }
            articleMedium.insertHtml(html);
            var container = window.selRange.startContainer.parentNode,
                containerTag = container.localName;

            if ( containerTag == 'a' ) {
                var containerObject = $(window.selRange.startContainer.parentNode);
                containerObject.replaceWith(containerObject[0].innerHTML);
            }
            
		    window.selRange = null;

		    // close modal drag
        	$('#lasso-toolbar--link').removeClass('link--drop-up link--drop-down');
			
			articleMedium.makeUndoable();

		    return false;
		};
		
		// process shortcode using AJAX service and insert the result
		function do_shortcode_ajax(content)
		{
			var data = {
					action: 'editus_do_shortcode',
					code: content,
					ID: lasso_editor.postid
			};
			
							
			jQuery.post(lasso_editor.ajaxurl2, data, function(response) {
                    restoreSelection(window.selRange);
					if( response ){
						return insert_html(response);
					} else {
						return insert_html(content);
				}
			});
		}
		
		
		function insert_html(htmlContent, contentishtml) {		
			var html = contentishtml; 
			if (contentishtml == undefined) {
				html = true;
			}
			try  {
				var container = window.selRange.startContainer;
				var containerTag = container.localName;
				var containerObject = $(container);
				var htmlCopy = htmlContent;
				if (html) {
                    //htmlContent is html, not an object
					htmlContent = $(htmlContent);
					htmlContent.attr('contenteditable','true');
				} else {
					htmlCopy = htmlContent[0].outerHTML;
				}
				
				// handle 3 specific scenarios dealing with <p>'s
				// note: might need climb up dom tree depending on nesting use case
				if (containerTag == 'p') {
					var innerText = container.innerText.replace(/(\r\n|\n|\r)/gm,"");
					if (!html) {	
						// currently we come here only if when inserting components
                        					
						/*htmlContent.insertAfter( containerObject );
						if (innerText =="") {
							// empty p tag
							containerObject.remove();
						}*/
						// decided to change the behavior Now the component is inserted before the empty paragraph	
						htmlContent.insertBefore( containerObject );
						if (innerText =="") {
							articleMedium.cursor.caretToBeginning(container);
						}
					} else {
						articleMedium.insertHtml( htmlCopy );
					}
					

				} else {
					// within a p tag
					container = container.parentNode;
					containerTag = container.localName;

					if( containerTag == 'p') {
						//if (string.indexOf(<) !== -1;
						//htmlContent.insertAfter( containerObject );
						articleMedium.insertHtml( htmlCopy );
					} else {
						// let's just go ahead and paste it on location
						articleMedium.insertHtml( '<p>'+htmlCopy+'</p>' );
					}
				}

				//window.selRange = null;

				// close modal drag
				$('#lasso-toolbar--html').removeClass('html--drop-up');
				
				articleMedium.makeUndoable();
				lasso_editor.addComponentButton();

				return htmlContent;
			} catch (e) {
				alert(e.message);
				
			}
		}
		
		function isURL(str) {
			var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
			  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name and extension
			  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
			  '(\\:\\d+)?'+ // port
			  '(\\/[-a-z\\d%@_.~+&:]*)*'+ // path
			  '(\\?[;&a-z\\d%@_.,~+&:=-]*)?'+ // query string
			  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
			  return pattern.test(str);
		}
		
		document.getElementById('lasso-toolbar--html__insert').onmousedown = function() {
		    articleMedium.element.contentEditable = true;
		    restoreSelection(window.selRange);


			var htmlContent = $('#lasso-toolbar--html__inner').text();
			if (htmlContent.indexOf("]") != -1) {
				do_shortcode_ajax(htmlContent);
				return false;
			} else if (isURL(htmlContent)) {
				do_shortcode_ajax("[embed]"+htmlContent+"[/embed]");
				return false;
			} else {
				return insert_html(htmlContent);
			}
		};

		if (lasso_editor.enableAutoSave) {
			lasso_editor.intervalID = window.setInterval(autoSave, 60000);
		}
		
		function autoSave() {
			if (localStorage.getItem( 'lasso_backup_'+postid ) || lasso_editor.dirtyByComponent) 
			{
				$('.lasso--controls__right #lasso--save').trigger('click');
			}
		}
		
		function clearTimer()
		{
			if (lasso_editor.intervalID) {
			     window.clearInterval(lasso_editor.intervalID);
				 lasso_editor.intervalID = 0;
			}
			if (lasso_editor.lockIntervalID) {
			     window.clearInterval(lasso_editor.lockIntervalID);
				 lasso_editor.lockIntervalID = 0;
				 //unlock post
				 var data = {
					action: 'editus_unlock_post',
					postid: lasso_editor.postid
				};
				jQuery.post(lasso_editor.ajaxurl2, data, function(response) {					
				});			 
			}
		}
		
		/////////////////
		/// EXIT EDITOR
		///////////////////
		function exitEditor(){
			clearTimer();

			if ($('body').hasClass('lasso-sidebar-open')) {
				//e.preventDefault();
				$('body').removeClass('lasso-sidebar-open');
				$('#lasso--component__settings').perfectScrollbar('destroy');
				return;
			}

			$('body').removeClass('lasso-sidebar-open lasso-editing');

			$('.lasso--toolbar_wrap,#lasso--sidebar,#lasso--featImgControls,.lasso-component--controls,#lasso--exit,#lasso-side-comp-button,.lasso--text-popup,.editus_shortcode').fadeOut().remove();


			$('#lasso--edit').css('opacity',1);
			$('.lasso--controls__right').css('opacity',0);
			$(post_container).attr('id','');

			// unwrap wp images
			/*$('.lasso--wpimg__wrap').each(function(){
				$(this).children().unwrap()
			});*/

			// unwrap map from hits drag holder
			$('#lasso--map-form').each(function(){

				var $this = $(this)

				$this.find('.lasso-component--controls, .lasso--map-form__footer ').remove()

				$this.children().unwrap()
			});

			$(titleClass).attr('contenteditable', false);

			$(articleMedium.element).find("*").removeAttr('contenteditable');
			articleMedium.destroy();
			
			// ways to inject codes into the exitEditor
			if (lasso_editor.exitEditorHookArray) {
				$(lasso_editor.exitEditorHookArray).each(function(key, val){
					val();
				});
			}
		}
		lasso_editor.exitEditor = exitEditor;
		
		// on escape key exit
		$(document).keyup(function(e) {

			if ( 27 == e.keyCode ) {
				if ($('#lasso-toolbar--link').hasClass('link--drop-up')) {
					$('#lasso-toolbar--link').removeClass('link--drop-up');
                } else if ($('#lasso-toolbar--html').hasClass('html--drop-up')) {
					$('#lasso-toolbar--html').removeClass('html--drop-up');
				} else {
				   exitEditor()
				}
			}

		});
		// on utility class exit
		//$('#lasso--exit').live('click',function(e){
		jQuery(document).on('click','#lasso--exit', function(e){
			e.preventDefault();
			//previously we just called exitEditor(), now the following reloads the page if there is an unsaved change
			if (articleMedium.dirty) {
				clearTimer();
			   location.reload();
			} else {
			  exitEditor();
			}
		})

		// on control s save
		$(document).keydown(function(e) {
		    if ((e.which == '115' || e.which == '83' ) && (e.ctrlKey || e.metaKey)){
		        e.preventDefault();
		        	
		        $('.lasso-editing #lasso--save').trigger('click')

		        return false;
		    }
		    return true;
		});

		///////////
		// INITIALIZE TIMELINE
		//////////
        lasso_editor.timelineGoTime = function(){
			// if there's no toolbar present
			if ( !$('.aesop-timeline').length > 0 ) {
				$('body').append('<div class="aesop-timeline"></div>').addClass('has-timeline');
			}


			if ( !$('.aesop-timeline .scroll-nav').length > 0 ) {

				$('.aesop-entry-content').scrollNav({
				    sections: '.aesop-timeline-stop',
				    arrowKeys: true,
				    insertTarget: '.aesop-timeline',
				    insertLocation: 'appendTo',
				    showTopLink: false,
				    showHeadline: false,
				    scrollOffset: 0,
				});

				$('.aesop-timeline-stop').each(function(){
					$(this).append( lassoDragHandle );
				});

			}

			$('.aesop-timeline-stop').each(function(){
					var label = $(this).attr('data-title');
					$(this).text(label);
                if ( $(this).find('.lasso-component--controls').length == 0 ) {
                    $(this).append( lassoDragHandle );
                }

			});
		}

		///////////
		// INITIALIZE VIDEO
		///////////
		var videoGoTime = function(){
			$('.aesop-video-component').fitVids()
		}

		var start_point 	= mapStart ? mapStart : [29.76, -95.38]
		, 	start_zoom 		= mapZoom ? mapZoom : 12
		, 	mapTileProvider = lasso_editor.mapTileProvider;

		///////////
		// INITIALIZE MAPS
		///////////
		var mapsGoTime = function(){

			var lat = start_point.lat ? start_point.lat : 29.76
			,	lng = start_point.lng ? start_point.lng : -95.38;

			var map = L.map('aesop-map-component',{
				scrollWheelZoom: false,
				zoom: start_zoom,
				center: [lat, lng]
			});

			setMapCenter(start_point[0],start_point[1]);

			jQuery('#lasso-map-address').geocomplete().bind('geocode:result', function(event, result){
				var lat = result.geometry.location.k;
				var lng = result.geometry.location.B;
				map.panTo(new L.LatLng(lat,lng));
				setMapCenter(lat,lng);
			});

			L.tileLayer(mapTileProvider, {
				maxZoom: 20//start_zoom
			}).addTo(map);

			mapLocations.forEach(function(location) {
				createMapMarker([location['lat'],location['lng']],location['title']).addTo(map);
				createMarkerField( marker._leaflet_id, encodeMarkerData(location['lat'], location['lng'], location['title']) );
			});

			// adding a new marker
			map.on('click', onMapClick);
			map.on('dragend', onMapDrag);
			map.on('zoomend', onMapZoom);

			function setMapCenter(k, B) {
				var ldata = encodeLocationData(k,B);
				jQuery('input[name="ase-map-component-start-point"]').remove();
				jQuery('.lasso--map-form__footer').append('<input type="hidden" name="ase-map-component-start-point" data-ase="map" value="' + ldata + '">');
				jQuery('#lasso-map-address').val(k + ', ' + B);
			}

			function setMapZoom(z) {
				jQuery('input[name="ase-map-component-zoom"]').remove();
				jQuery('.lasso--map-form__footer').append('<input type="hidden" name="ase-map-component-zoom" data-ase="map" value="' + z + '">');
			}

			function onMarkerDrag(e) {
				updateMarkerField(e.target);
			}

			function onMapDrag(e) {
				var mapCenter = e.target.getCenter()
				setMapCenter(rnd(mapCenter.lat),rnd(mapCenter.lng));
			}

			function onMapZoom(e) {
				setMapZoom(e.target.getZoom());
			}

			function rnd(n) {
				return Math.round(n * 100) / 100
			}

			function onMapClick(e) {

			    var geojsonFeature = {

			        "type": "Feature",
			        "properties": {},
			        "geometry": {
			                "type": "Point",
			                "coordinates": [e.latlng.lat, e.latlng.lng]
			        }
			    }

			    var marker;

			    L.geoJson(geojsonFeature, {

			        pointToLayer: function(feature, latlng){

			            marker = L.marker(e.latlng, {

			                title: 'Resource Location',
			                alt: 'Resource Location',
			                riseOnHover: true,
			                draggable: true,

			            }).bindPopup("\
			            	<input type='text' name='ase_marker_text[]' value='Location Title'>\
			            	<a class='marker-update-button dashicons dashicons-yes'/></a>\
			            	<a class='marker-delete-button dashicons dashicons-trash'/></a>\
			            	");

			            marker.on('popupopen', onPopupOpen);
			            marker.on('dragend', onMarkerDrag);

			            return marker;
			        }
			    }).addTo(map);

			   	createMarkerField( marker._leaflet_id, encodeMarkerData(e.latlng.lat, e.latlng.lng, 'Location Title') );

			}

			// open popup
			function onPopupOpen() {

			    var tempMarker = this;

			    // To remove marker on click of delete button in the popup of marker
			    jQuery('.marker-delete-button:visible').click(function () {
			    	jQuery('input[data-marker="' + tempMarker._leaflet_id + '"]').remove();
			      	map.removeLayer(tempMarker);
			    });

			    // Update the title of the location
			    jQuery('.marker-update-button:visible').click(function (t) {
			    	var title = t.target.previousElementSibling.value;
			    	var tdata = encodeMarkerData(tempMarker._latlng.lat, tempMarker._latlng.lng, title);
			    	jQuery('input[data-marker="' + tempMarker._leaflet_id + '"]').val(tdata);
			    	tempMarker.options.title = title;
			    	tempMarker.closePopup();
			    	tempMarker.bindPopup("\
				            	<input type='text' name='ase_marker_text[]' value='" + title + "'>\
				            	<a class='marker-update-button dashicons dashicons-yes'/></a>\
				            	<a class='marker-delete-button dashicons dashicons-trash'/></a>\
				            	");
			    });
			}

			// create map marker
			function createMapMarker(latlng, title) {
	            marker = L.marker(latlng, {
	              	title: title,
	              	alt: title,
	              	riseOnHover: true,
	              	draggable: true,
	            }).bindPopup("\
	            	<input type='text' name='ase_marker_text[]' value='" + title + "'>\
	            	<a class='marker-update-button dashicons dashicons-yes'/></a>\
	            	<a class='marker-delete-button dashicons dashicons-trash'/></a>\
	            	");
	            marker.on('popupopen', onPopupOpen);
	            marker.on('dragend', onMarkerDrag);
	            return marker;
			}

			function getAllMarkers() {
			    var allMarkersObjArray = []; // for marker objects
			    var allMarkersGeoJsonArray = []; // for readable geoJson markers
			    jQuery.each(map._layers, function (ml) {
			        if (map._layers[ml].feature) {
			          	allMarkersObjArray.push(this)
			          	allMarkersGeoJsonArray.push(JSON.stringify(this.toGeoJSON()))
			        }
			    })
			}

			// let's create a hidden form element for the marker
			function createMarkerField(mid, mdata) {
			  	jQuery('.lasso--map-form__footer').append('<input type="hidden" name="ase-map-component-locations[]" data-ase="map" data-marker="' + mid + '" value="' + mdata + '">');
			}

			function updateMarkerField(m) {
				var tdata = encodeMarkerData(m._latlng.lat, m._latlng.lng, m.options.title);
				jQuery('input[data-marker="' + m._leaflet_id + '"]').val(tdata);
			}

			// encode the information into a string
			function encodeMarkerData(mlat, mlng, mtitle) {
				return encodeURIComponent(JSON.stringify({lat: mlat, lng: mlng, title: mtitle}));
			}

			// encode location into a string
			function encodeLocationData(mlat, mlng) {
				return encodeURIComponent(JSON.stringify({lat: mlat, lng: mlng}));
			}

			// decode the information
			function decodeMarkerData(mdata) {
				return decodeURIComponent(JSON.parse(mdata));
			}
		}
        
        // the code to enable map editing after reload.
        if ($( ".aesop-map-component" ).length) {
            $( ".aesop-map-component" ).replaceWith(setComponent("map"));
            mapsGoTime();
        }

		function setComponent(type) {
			// if an image is dragged in
			var comp ="";
            if (!components[type] || !components[type]['content']) return null;

			if ( 'wpimg' == type && lasso_editor.oldWPimg) {
				comp = $(components[type]['content']).prepend( wpImgEdit );
			// else it's likely an aesop component
			} else if ( 'htmlparagraph' != type && 'htmltable' != type) {
				comp = $(components[type]['content'])
							.prepend( lassoDragHandle )
							.attr({
								'data-component-type': type
							});
			} else {
                comp = $(components[type]['content']);
            }
			return comp;
		}
		
		function postComponent(comp,type) {
            // set some figures to uneditable
            $("figure.wp-block-image, figure.lasso--wpimg__wrap").attr('contenteditable',false).attr('readonly',true);
			// TODO: if a stock wordpress image is dragged in			

			if ('timeline_stop' == type ) { lasso_editor.timelineGoTime() }

			if ('video' == type ) { videoGoTime() }
			$('#lasso-side-comp-button').remove();
            if ( 'map' == type ) { 
                mapsGoTime(); 
            } else {
                $(comp).find('.lasso-settings').trigger('click');
            }
		}
		
				
		function  imgDialog( ){
			var that = this;
		    // Create the media frame.
		    var lasso_file_frame = wp.media.frames.file_frame = wp.media({
		      	title: 'Select Image',
		      	button: {
		        	text: 'Insert Image',
		      	},
		      	multiple: false  // Set to true to allow multiple files to be selected
		    });

		    // When an image is selected, run a callback.
		    lasso_file_frame.on( 'select', function() {
		      	var attachment = lasso_file_frame.state().get('selection').first().toJSON();
				$(that).parent().data('imgid',''+attachment.id);
				if ($(that).parent().find('img').length > 0) {
					$(that).parent().find('img').attr('src', attachment.url );
				} else {i
					$(that).parent().css({
				  		'background-image': 'url('+ attachment.url +')'
				  	});
				}
                // set some figures to uneditable
                $("figure.wp-block-image, figure.lasso--wpimg__wrap").attr('contenteditable',false).attr('readonly',true);

		    });

		    // Finally, open the modal
			lasso_file_frame.open();
		};

		/////////////////
		/// DRAG DROP
		///////////////////
		// recent change: when a new component is dropped, the setting window is opened automatically
		$('#'+editor).sortable({
			opacity: 0.65,
			placeholder:'lasso-drop-zone',
			handle: '.lasso-drag',
            cursor:'move',
            tolerance:'pointer',
            refreshPositions: true,
            helper: function( e, ui ) {

		    	// get the curent target and add the type class to the drag event
				var item = ui['context'],
					type = $(item).attr('data-component-type');

            	return $('<div class="lasso-drag-holder lasso-toolbar--component__'+type+'"></div>');
            },
        	beforeStop: function (event, ui) { draggedItem = ui.item },
            receive: function (event,ui) {

            	// close modal drag
            	$('#lasso-toolbar--components').removeClass('toolbar--drop-up');

				articleMedium.makeUndoable();
            	// get the item and type
				var item = draggedItem['context'];
                if (!item) item = draggedItem;
				var type = $(item).attr('data-type');
				// item2 will be the content tthat gets inserted. It also has edit controls
                

				// if coming from draggable replace with our content and prepend toolbar
				if ( origin == 'draggable' ) {
					// check if it's inserted at the end
					var newIndex = $(this).data("ui-sortable").currentItem.index();
				    var sortable_len = $(this).data("ui-sortable").items.length;
					var last = false;
					if (newIndex>= (sortable_len-1)) {
						last = true;
						
					}

					
					var item2 = setComponent(type);
					
					if (last) {
						item2.append('<p><br></p>');
					}
					$(item).replaceWith( item2);
					

					postComponent(item2,type);
					
				}

		    }
		});
        
        
        lasso_editor.addComponentButton = function()
        {
			// this function checks the current selected element and adds the component button if appropriate
			if (!lasso_editor.buttonOnEmptyP) {
				// if this feature is not turned on, return
				return;
			}
			window.selRange = saveSelection();
            if (!window.selRange) return;
			var container = window.selRange.startContainer,
			containerTag;
            if ($(container).attr('id') == "lasso--content") {
                container = $(container).children()[0];
            }
			$('#lasso-side-comp-button').remove();
			containerTag = container.localName;
			parentTag = $(container).parent().prop("tagName");
            
            if ($(container).parent().attr('id') != "lasso--content") {
				if (parentTag == 'figure' || parentTag == 'div' || $(container).parent().parent().attr('id') != "lasso--content") {
					return;
				}
			}			
            
			if ( containerTag == 'p' || ((containerTag=='b' || containerTag=='em' || containerTag=='i' || containerTag=='strike' || containerTag=='span') && $(container).parent().text() == "")) 
			{	
				var innerText = container.innerText.replace(/(\r\n|\n|\r)/gm,"");
				if (innerText != "") {
					//this paragraph is not empty, return
					return;
				}
				
				var top_ = container.offsetTop-10;
				var left_ = container.offsetLeft-30;
				
				if ($(container).parent().attr('id') != "lasso--content") {
					$(container).parent().empty();
				}
				
				var button = $('<div id="lasso-side-comp-button" style="width:30px;height:30px;position:absolute;" contenteditable="false"></div>');
				button.css({top:top_,left:left_});
    
				$("#lasso--content").append(button);
				if (button.offset().left<0) {
					button.offset({left:0});
				}
			}
        }


        // the following codes decide which UI triggers drag-drop and which UI triggers click-insert
        // If we are only using drag-drop then clickToInsertElement would be empty
		var clickToInsertElement = '#lasso-side-comp-button #lasso-toolbar--components__list li';
		if (lasso_editor.clickToInsert) {
			clickToInsertElement = '#lasso-toolbar--components__list li'
		} 		
			
		else 
		{
			$('#lasso-toolbar--components #lasso-toolbar--components__list li').draggable({
				axis:'y',
				helper:'clone',
				cursor: 'move',
				connectToSortable: '#'+editor,
				start: function(ui) {

					// add an origin so sortable can detect where comign from
					origin = 'draggable';

					// get the curent target and add the type class to the drag event
					var item = ui.currentTarget,
						type = $(item).attr('data-type');

					$(this).addClass(type);
				}
			});
		}
		jQuery(document).on('mousedown', clickToInsertElement, function(){
				var type = $(this).attr('data-type');
				var item = setComponent(type);
				restoreSelection(window.selRange);
                $('#lasso-side-comp-button').remove();
                if ($('#'+editor).children().length==1 && $('#'+editor).find('.editus-firstp').length ==1) {
                    $('.editus-firstp').replaceWith(item);
                } else {
                    var t = insert_html(item, false);
                }
				
				postComponent(item,type);
				lasso_editor.addComponentButton();
		});
            
                    
        // replace the content if the content is empty
        if ( $('#'+editor).children().length && $('#'+editor).children().prop("tagName") == "P" && $('#'+editor).children().text() == "") {
            $('#'+editor).html(lasso_editor.newObjectContent);
            $('#'+editor).children().focus();
            lasso_editor.addComponentButton();
        }
        
        lasso_editor.hidePopup = function(){
            $(".lasso--text-popup").hide();
		}
        
        lasso_editor.checkForPopup = function()
        {
            if (!lasso_editor.toolbarPopup) return;
            
            s = window.getSelection();
            oRange = s.getRangeAt(0); //get the text range
            if (!oRange.collapsed ) {
                oRect = oRange.getBoundingClientRect();
                ;
                oRect2 = document.getElementById(editor).getBoundingClientRect();
                oRect3 = document.body.getBoundingClientRect();
                var t2 = $('body').offset().top;
                //var t2 = document.body.offsetTop.getBoundingClientRect().top;
                var left = ((oRect.right+oRect.left) - $(".lasso--text-popup").width())/2;
                if (left <= 0) left = 0;
                var t = oRect.bottom-document.body.getBoundingClientRect().top;
                $(".lasso--text-popup").css("left",left);
                $(".lasso--text-popup").css("top",t+t2);
                $(".lasso--text-popup").css("display","table");
                $(".lasso--text-popup").css("position","absolute");
            } else {
                lasso_editor.hidePopup();
            }
        };
		
		$('#'+editor).on('mouseup',function() {
            lasso_editor.checkForPopup();
        });
        
        $('#'+editor).focusout(function() {
            lasso_editor.hidePopup();
        });
		
            
        // ways to inject codes into the enterEditor
		if (lasso_editor.enterEditorHookArray2) {
			$(lasso_editor.enterEditorHookArray2).each(function(key, val){
				val();
			});
		}   

	});
	if (lasso_editor.skipToEdit)
	{
		$('#lasso--edit').trigger('click');
		lasso_editor.skipToEdit = false;
	}
	
	if (lasso_editor.setupHookArray) {
		$(lasso_editor.setupHookArray).each(function(key, val){
			val();
		});
	}
});






(function( $ ) {

	$(document).ready(function(){

		/////////////////
		/// MODAL LOGIC
		///////////////////

		// method to destroy the modal
		var destroyModal = function(){
			$('body').removeClass('lasso-modal-open');
			$('#lasso--post-settings__modal, #lasso--modal__overlay').remove();
		}
		
		jQuery(document).on('click', '.lasso--postsettings__option', function(e){
			if ($(e.target).hasClass('tagit')) {
				// close the modal window if the user clicks on empty spaces
				// destroy posts modal
				
				destroyModal();
			}			
		});

		// modal click
		//$('#lasso--post-settings').live('click',function(e){
		jQuery(document).on('click','#lasso--post-settings, #lasso--post-settings2',function(e){

			e.preventDefault();

			// add a body class
			$('body').toggleClass('lasso-modal-open');

			// append teh modal markup ( lasso_editor_component_modal() )
			$('body').append(lasso_editor.component_modal);

			/////////////////
			/// UI SLIDER INIT AND METHODS
			///////////////////

			var statusReturn = function( value ) {

				var out;
				if ( 100 == value ) {
					out = 'draft';
				} else if ( 150 == value ) {
					out = 'pending';
				} else if ( 200 == value ) {
					out = 'publish';
				} else if ( 'draft' == value ) {
					out = 100;
				} else if ( 'pending' == value ) {
					out = 150;
				} else if ( 'publish' == value ) {
					out = 200;
				}
				return out;
			}

			// init slider
		    $('#lasso--slider').slider({
		      	value:statusReturn(lasso_editor.post_status),
		      	min: 100,
		      	max: 200,
		      	step: lasso_editor.supportPendingStatus ? 50 : 100,
		      	animate:'fast',
		      	slide: function( event, ui ) {
		        	$('input[name="status"]').val( statusReturn(ui.value) );

		        	$('.lasso--postsettings__footer').slideDown()

		        	if ( 100 == ui.value ) {
		        		$('.story-status').removeClass('story-status-publish').addClass('story-status-draft')
		        	} else if ( 200 == ui.value ) {
		        		$('.story-status').removeClass('story-status-draft').addClass('story-status-publish')
		        	}
		      	}
		    });
		    $('input[name="status"]').val( statusReturn( $( "#lasso--slider" ).slider('value') ) );

		    /*// if any changes happen then show the footer
		    $('.lasso--modal__trigger-footer').on('keyup',function(){
			  	$('.lasso--postsettings__footer').slideDown()
			});*/

		    // categories
		    var cats = $('#lasso--cat-select')
		    ,	tags = $('#lasso--tag-select')
            ,   custom = $('#lasso--custom-taxo-input')

			cats.tagit({
				//fieldName:'itemName[fieldName][]',
				placeholderText: lasso_editor.strings.catsPlaceholder, //'add categories...',
				availableTags: lasso_editor.postCategories,
                allowSpaces: true
			});

			cats.on('change',function(event){
				$('.lasso--postsettings__footer').slideDown()
			})

			tags.tagit({
				//fieldName:'itemName[fieldName][]',
				placeholderText: lasso_editor.strings.tagsPlaceholder,//'add tags...',
				availableTags: lasso_editor.postTags,
                allowSpaces: true
			});

			tags.on('change',function(event){
				$('.lasso--postsettings__footer').slideDown()
			})
			
			if( $('.editus_custom_date').length ) {
				$('.editus_custom_date').datepicker({});
			}
            
            if (lasso_editor.supCustTaxo) {           
                var selTaxo = $('#lasso--custom-taxo-select').val();
                custom.val(lasso_editor.postCusTaxonomies[selTaxo]);
                custom.tagit({
                    placeholderText: lasso_editor.strings.catsPlaceholder,//'add tags...',
                    availableTags: lasso_editor.extCusTaxonomies[selTaxo],
                    allowSpaces: true
                });
                              
                $('#lasso--custom-taxo-select').on('change', function() {
                    lasso_editor.postCusTaxonomies[selTaxo] = custom.val();
                    
                    custom.tagit("destroy");
                    custom.val(lasso_editor.postCusTaxonomies[$(this).val()]);
                    custom.tagit({
                        placeholderText: lasso_editor.strings.taxoPlaceholder, //'add categories...',
                        availableTags: lasso_editor.extCusTaxonomies[$(this).val()],
                        allowSpaces: true
                    });
                                   
                    selTaxo = $(this).val();
                });
            }

			modalResizer()

		});

		// destroy modal if clicking close or overlay
		//$('#lasso--modal__close, #lasso--modal__overlay, .lasso--postsettings-cancel').live('click',function(e){
		jQuery(document).on('click', '#lasso--modal__close, #lasso--modal__overlay, .lasso--postsettings-cancel', function(e){
			e.preventDefault();
			destroyModal();
		});

		/////////////////
		/// EXIT SETTINGS
		///////////////////
		$(document).keyup(function(e) {

			if ( 27 == e.keyCode ) {

				destroyModal();
			}

		});

		/////////////
		// SAVE SETTINGS
		//////////////
		var form;

		//$('#lasso--postsettings__form').live('submit', function(e) {
				//$('#lasso--postsettings__form').live('submit', function(e) {
		jQuery(document).on('submit','#lasso--postsettings__form',function(e) {

			e.preventDefault();
			if ($('#lasso--custom-field-form').length ==0 || $('#lasso--custom-field-form').children().length == 0 ) {
                $('#lasso--save').removeClass('lasso-publish-post');
				$('#lasso--save').trigger('click');
			}

			var $this = $(this);
			
			/*
			//alternate way of setting categories, disabled for now
			var cats = [];
			
			$('input[name="categories"]').each(function () {
				if (this.checked) { cats.push(this.id);}
			});
			if (cats.length>0) {
				$('input[name="story_cats"]').val(cats.join(','));
			}*/
            
            if (lasso_editor.supCustTaxo) {          
                var selTaxo = $('#lasso--custom-taxo-select').val();
                lasso_editor.postCusTaxonomies[selTaxo] = $('#lasso--custom-taxo-input').val();
                $(this).find("input[name=story_custom_taxonomies]" ).val(JSON.stringify(lasso_editor.postCusTaxonomies));
            }

			$(this).find('input[type="submit"]').val(lasso_editor.strings.saving);

			
			var data2 = $this.serialize();

			/////////////
			//	DO THE SAVE
			/////////////
				
			var data = {
				action: 'editus_set_post_setting',
			    postid: lasso_editor.postid,
				data: data2
			};
				
			$.post( lasso_editor.ajaxurl2, data, function(response) {

				if( true == response.success ) {
					$('input[type="submit"]').addClass('saved');
					$('input[type="submit"]').val(lasso_editor.strings.saved);
                    window.onbeforeunload = null;
					
					if ($('#lasso--custom-field-form').length && $('#lasso--custom-field-form').children().length) {
						$('#lasso--custom-field-form').trigger('submit');
						setTimeout(function() {
						  window.location.replace(response.data['link']);
						}, 1000);
					} else {
                        // changing the setting can potentially change the URL of the post. In that case we need to
                         // reload the post
					    window.location.replace(response.data['link']);
					}

				} else {
					alert('error:'+response);
					console.log(response)

				}


			}).fail(function(xhr, err) { 
				var responseTitle= $(xhr.responseText).filter('title').get(0);
				alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
			});

		});

		/////////////
		// ADDON TABS
		//////////////
		$(document).on('click', '.lasso--modal__tabs li', function(e){

			e.preventDefault()

			var $this	= $(this)
			,	name  	= $this.data('addon-name')
			,	rem 	= 'not-visible'
			,	add    	= 'visible'

			$('.lasso--modal__tabs li').removeClass('active-tab')

			$this.addClass('active-tab')

			$('.lasso--modal__content').removeClass( add ).addClass( rem )

			$this.closest('.lasso--modal__inner').find('div[data-addon-content="'+name+'"]').removeClass( rem ).addClass( add )

			modalResizer()
		})

	});

})( jQuery );
(function( $ ) {

	$(document).ready(function(){

		// helper to dstry the sidebar
		var destroySidebar = function(){
			$('body').removeClass('lasso-sidebar-open');
		}

		// close the sidebar when clicking outside of it
		$('body').on('click', '#'+lasso_editor.editor, function(){
             //lets not for now
			//destroySidebar()
		});

		// helper to set the height of the settings panel
		var settingsHeight = function(){

			var settings = $('#lasso--component__settings');

			settings.height( $(window).height() );

			$(window).resize(function(){
				settings.height( $(window).height() );
				//$('#lasso--component__settings').perfectScrollbar('update');
			});
		}

		var component, data;

		/////////////
		// OPEN COMPONENT SETTINGS
		////////////
		$(document).on('click','.lasso-component--settings__trigger',function(){

			var settings 	= $('#lasso--component__settings')
			var click       = $(this)

			// let's set our globals
			if ( $(this).parent().parent().hasClass('aesop-map-component') ) {
				component = $(this).parent().parent().find('.aesop-component');
			} else {
				component = $(this).closest('.aesop-component,.lasso-component,.wp-block-image,.wp-block-cover');
			}
            
            data = component.data();
            if (!data) { return;}

			// let's force globalize this until we refactor the js
			window.component = component;
			window.componentClone = component.clone();
			
            if (data['componentType'] == 'wpimg') {
                if ($(component).find('figure.lasso-component').length) {
                    data = $(component).find('figure.lasso-component').data();//'.wp-image.lasso-component').data();
                } else if ($(component).find('img').length) {
                    data['img'] =$(component).find('img').attr('src');
                }
            }
            
            if (data['componentType'] == 'wpimg-block') {
				if ($(component).find('img').length) {
					var $img = $(component).find('img');
                    data['img'] =$img.attr('src');
					data['alt'] =$img.attr('alt');
					var c = $img.attr('class');
                    
                    var $fig = $(component).find('figure');
                    if ($fig.hasClass('alignright')) {
                        data['align']='right';
                    } else if ($fig.hasClass('aligncenter')) {
                        data['align']='center';
                    } else if ($fig.hasClass('alignleft')) {
                        data['align']='left';
                    }
				
					if (c && c.indexOf('wp-image-') == 0) {
						data['id'] = c.substr(9);
					}
                    if ($(component).find('figcaption').length) {
                        data['caption'] = $(component).find('figcaption').text();
                    }
                    if ($(component).find('a').length) {
                        data['link'] = $(component).find('a').attr("href");
                    }
                }
			}
            
            if (data['componentType'] == 'wpcover-block') {
				if ($(component).find('img').length) {
					var $img = $(component).find('img');
                    data['img'] =$img.attr('src');
                }
			}
            
            if (data['componentType'] =='wpquote') { return;}
            
            if (!lasso_editor.component_options) return;
			// special case for hero gallery
			if ( $(this).parent().parent().hasClass('aesop-hero-gallery-wrapper') ) {
			    jQuery.extend(data, $(component).find(".fotorama").data());
			}

			// add a body class
			$('body').toggleClass('lasso-sidebar-open');

			settings.find('input[name="unique"]').val( data['unique'] );

			// set up settings panel
			settingsHeight();
			settings.html( lasso_editor.component_options[data.componentType] );

			// add the type as a value in a hidden field in settings
			settings.find('.component_type').val( data.componentType );

			// fade in save controls
			$('.lasso-buttoninsert-wrap').fadeIn(600);

			// initialize scrolbar
			settings.perfectScrollbar('destroy');
			settings.perfectScrollbar();

			// map the settings from the data attributes on components into appropriate settings in settings panel
			settings.find('.lasso-option').each(function(){

				var option = $(this).data('option');
				var field = $(this).find('.lasso-generator-attr');

				// if it's a gallery data attribute map the cehcekd attribute to the right place
				// @todo - account for map stuff
				if ( 'gallery-type' == option ) {

					// this function is repeated on process-gallery-opts line 4
					var value_check = function( value ){

						if ( 'grid' == value ) {
							$('.ase-gallery-opts--thumb').fadeOut();
							$('.ase-gallery-opts--photoset').fadeOut();
							$('.ase-gallery-opts--hero').fadeOut();
							$('.ase-gallery-opts--grid').fadeIn();
						} else {
							$('.ase-gallery-opts--grid').fadeOut();
						}

						if ( 'thumbnail' == value ) {
							$('.ase-gallery-opts--grid').fadeOut();
							$('.ase-gallery-opts--photoset').fadeOut();
							$('.ase-gallery-opts--hero').fadeOut();
							$('.ase-gallery-opts--thumb').fadeIn();
						} else {
							$('.ase-gallery-opts--thumb').fadeOut();
						}

						if ( 'photoset' == value ) {
							$('.ase-gallery-opts--grid').fadeOut();
							$('.ase-gallery-opts--thumb').fadeOut();
							$('.ase-gallery-opts--hero').fadeOut();
							$('.ase-gallery-opts--photoset').fadeIn();
						} else {
							$('.ase-gallery-opts--photoset').fadeOut();
						}
						
						if ( 'hero' == value ) {
							$('.ase-gallery-opts--grid').fadeOut();
							$('.ase-gallery-opts--thumb').fadeOut();
							$('.ase-gallery-opts--photoset').fadeOut();
							$('.ase-gallery-opts--hero').fadeIn();
						} else {
							$('.ase-gallery-opts--hero').fadeOut();
						}
					}

					$(field).each(function(){

						if ( $(this).val() == data.galleryType ) {

							$(this).parent().addClass('selected')
							$(this).prop('checked',true);

							value_check( $(this).val() );

							// add the type to a hidden field
							$('#ase_gallery_type').val( $(this).val() )

						}

					});

				} else {

					$( field[0] ).val(data[option]);

				}

			});

			////////////
			// SMOOTH SLIDE TO COMPONENT - @since 0.9.5
			///////////

			// if its a content component
			if ( component.hasClass('aesop-content-component') ) {

				var target = component.find('.aesop-content-comp-wrap').attr('id')
				, 	item = $('#'+target)

			} else {

				var item = $('#'+component.attr('id') )
			}

            if (item.length) {
                //$('html, body').animate({ scrollTop: item.offset().top - 50  }, 400);
            }

			/////////////
			// GET GALLERY IMAGES IF ITS A GALLERY
			/////////////

			//if ( $(this).parent().parent().hasClass('empty-gallery') ) {
				//settings.addClass('gallery-no-images')
			//}

			if ( $(this).parent().parent().hasClass('aesop-gallery-component') ) {

				var $this 		= $(this)
				,	ajaxurl 	= lasso_editor.ajaxurl
				,	form 		= $('#lasso--component-settings-form.gallery')
				,	nonce 		= lasso_editor.getGallImgNonce
				,	gall_id 	= data['id']

				var data      = {
					action:    	'process_gallery_get-images',
					post_id:   	gall_id,
					nonce: 		nonce
				};

				// post ajax response with data
				$.post( ajaxurl, data, function(response) {

					$('#lasso--gallery__images').html( response.data.html );

					/////////////
					// CALL SORTABLE ON RECIEVED IMAGES
					/////////////
					var	gallery = $('#ase-gallery-images');

					gallery.ready(function(){

						gallery.sortable({
							containment: 'parent',
							cursor: 'move',
							opacity: 0.8,
							placeholder: 'ase-gallery-drop-zone',
							forcePlaceholderSize:true,
							update: function(){
								var imageArray = $(this).sortable('toArray');
						  		$('#ase_gallery_ids').val( imageArray );
							},
							create: function(){
								var imageArray = $(this).sortable('toArray');
						  		$('#ase_gallery_ids').val( imageArray );
							}
						});
					});
				}).fail(function(xhr, err) { 
					var responseTitle= $(xhr.responseText).filter('title').get(0);
					alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
				});;

			}

		}).on('click', '#lasso-upload-img', function( e ){

		    e.preventDefault();

		    className = e.currentTarget.parentElement.className;

		    var type   = $('input[name="component_type"]').val()

		    // If the media frame already exists, reopen it.
			if ( typeof lasso_file_frame != 'undefined' ) {
				lasso_file_frame.close();
			}

		    // Create the media frame.
		    lasso_file_frame = wp.media.frames.file_frame = wp.media({
		      	title: 'Select Image',
		      	button: {
		        	text: 'Insert Image',
		      	},
		      	multiple: false  // Set to true to allow multiple files to be selected
		    });

		    // When an image is selected, run a callback.
		    lasso_file_frame.on( 'select', function() {

		      	var attachment = lasso_file_frame.state().get('selection').first().toJSON();

		      	$('.aesop-generator-attr-media_upload').prop('value',attachment.url);

				/////////////
				// START LIVE IMAGE EDITING COMPONENTS
				// @todo - this was going to be taken care of in above but it seems we have to bind this to the file upload here?
				////////////
		      	if ( 'parallax' == type ) {

				  	component.find('.aesop-parallax-sc-img').prop('src', attachment.url )

		      	} else if ( 'quote' == type ) {

				  	component.css({
				  		'background-image': 'url('+ attachment.url +')'
				  	});

		      	} else if ( 'image' == type ) {
                    $("#aesop-generator-attr-img").val(attachment.url);
				  	component.find('.aesop-image-component-image > img').prop('src', attachment.url);
					// new addition for panorama images
					component.find('.paver__pano').css({'background-image': 'url('+ attachment.url +')'});

		      	} else if ( 'character' == type ) {

				  	component.find('.aesop-character-avatar').prop('src', attachment.url)

		      	} else if ( 'chapter' == type ) {

		      		component.find('.aesop-article-chapter').css({
				  		'background-image': 'url('+ attachment.url +')'
				  	});

		      	}else if ( 'wpimg' == type ) {
                    var img = window.component.find('img');
                    if (img.length>0) {
		      		   img.prop('src', attachment.url );
                       img.prop("srcset","");
                    }
		      	}
                else if ( 'wpimg-block' == type ) {
                    var img = window.component.find('img');
                    if (img.length >0) {
		      		   img.prop('src', attachment.url );
                       img.prop("srcset","");
					   if (attachment.id) {
                           img.removeClass();
						   img.addClass("wp-image-"+attachment.id);
                           window.component.data( 'id', ""+attachment.id);
					   }
                    }
		      	}
                else if ( 'wpcover-block' == type ) {
                    var img = window.component.find('img');
                    if (img.length >0) {
		      		   img.prop('src', attachment.url );
                       img.prop("srcset","");
                       img.removeClass();
                       img.addClass("wp-block-cover__image-background");
					   if (attachment.id) {
						   img.addClass("wp-image-"+attachment.id);
					   }
                    } else {
                       window.component.css('background-image', "url("+attachment.url+")");
                    }

		      	}
				/////////////
				// EDN LIVE IMAGE EDITING COMPONENTS
				////////////

		    });

		    // Finally, open the modal
			lasso_file_frame.open();
		});

		// destroy panel if clicking close or overlay
		//$('#lasso--sidebar__close').live('click',function(e){
		// cancel 
		jQuery(document).on('click','#lasso--sidebar__close',function(e){
			e.preventDefault();
			window.component.replaceWith(window.componentClone); //restore the state before editing
			destroySidebar();
			$('#lasso--component__settings').perfectScrollbar('destroy');
		});

});

})( jQuery );

(function( $ ) {

	$(document).ready(function(){

		/////////////
		// LIVE EDITING COMPONENTS
		// @todo - this is hella dirty and needs to be cleaned up
		// @todo - move this mess to it's own file
		////////////

		$(document).on('click', '.lasso-component--settings__trigger', function(){

			var settings 	= $('#lasso--component__settings')

			// QUOTE LIVE EDIT ///////////////////
			//settings.find('#aesop-generator-attr-background').live('change',function(){
			settings.find('#aesop-generator-attr-background').on('change',function(){
			  	component.css({'background-color': $(this).val()});
			});
			//settings.find('#aesop-generator-attr-text').live('change',function(){
			settings.find('#aesop-generator-attr-text').on('change',function(){
			  	component.css({'color': $(this).val()});
			});
			settings.find('#aesop-generator-attr-quote').on('keyup',function(){
			  	component.find('blockquote span').text( $(this).val() );
			});
			settings.find('#aesop-generator-attr-cite').on('keyup',function(){

				var t = component.find('blockquote cite');

				if ( 0 == t.length ) {

					component.find('blockquote').append( '<cite class="aesop-quote-component-cite">'+$(this).val()+'</cite>' );

				} else {
			  		component.find('blockquote cite').text( $(this).val() );
				}
			});
			settings.find('.aesop-quote-width > #aesop-generator-attr-width').on('keyup',function(){
				component.css('width', $(this).val() );
			});
			settings.find('.aesop-quote-type #aesop-generator-attr-type').on('change',function(){

				var value = $(this).val()

				if ( 'pull' == value ) {
					component.css('background-color','transparent')
				}

				component.removeClass('aesop-quote-type-block aesop-quote-type-pull')

				component.addClass('aesop-quote-type-'+$(this).val()+' ')
			});

			settings.find('.aesop-quote-align #aesop-generator-attr-align').on('change',function(){

				var value = $(this).val()

				if ( 'left' == value ) {

					component.removeClass('aesop-component-align-right aesop-component-align-center')
					component.find('blockquote').removeClass('aesop-component-align-right aesop-component-align-center')

				} else if ( 'right' == value ) {

					component.removeClass('aesop-component-align-left aesop-component-align-center')
					component.find('blockquote').removeClass('aesop-component-align-left aesop-component-align-center')

				} else if ( 'center' == value ) {

					component.removeClass('aesop-component-align-left aesop-component-align-right')
					component.find('blockquote').removeClass('aesop-component-align-left aesop-component-align-right')

				}
				component.addClass('aesop-component-align-'+$(this).val()+' ')
				component.find('blockquote').addClass('aesop-component-align-'+$(this).val()+' ')
			});

			// PARALLAX LIVE EDIT ///////////////////
			settings.find('.aesop-parallax-caption > #aesop-generator-attr-caption').on('keyup',function(){


				var t = component.find('.aesop-parallax-sc-caption-wrap')

				if ( 0 == t.length ) {

					component.find('img').after( '<figcaption class="aesop-parallax-sc-caption-wrap bottom-left">'+$(this).val()+'</figcaption>' );

				} else {
			  		component.find('.aesop-parallax-sc-caption-wrap').text( $(this).val() );
				}
			})
			settings.find('.aesop-parallax-captionposition > #aesop-generator-attr-captionposition').on('change',function(){

				var value = $(this).val()

				if ( 'bottom-left' == value ) {

					component.find('.aesop-parallax-sc-caption-wrap').removeClass('bottom-right top-left top-right')

				} else if ( 'bottom-right' == value ) {

					component.find('.aesop-parallax-sc-caption-wrap').removeClass('bottom-left top-left top-right')

				} else if ( 'top-left' == value ) {

					component.find('.aesop-parallax-sc-caption-wrap').removeClass('bottom-right top-right bottom-left')

				} else if ( 'top-right' == value ) {

					component.find('.aesop-parallax-sc-caption-wrap').removeClass('bottom-right bottom-left top-left')

				}

				component.find('.aesop-parallax-sc-caption-wrap').addClass( value );

			})

			// IMAGE LIVE EDIT ///////////////////
			settings.find('.aesop-image-caption > #aesop-generator-attr-caption').on('keyup',function(){

				var t = component.find('.aesop-image-component-caption');

				if ( 0 == t.length ) {

					component.find('img').after( '<p class="aesop-image-component-caption">'+$(this).val()+'</p>' );

				} else {
					component.find('.aesop-image-component-caption').text( $(this).val() );
				}

			})
			settings.find('.aesop-image-imgwidth > #aesop-generator-attr-imgwidth').on('keyup',function(){
				component.find('.aesop-image-component-image').css('max-width', $(this).val() );
			})
			settings.find('.aesop-image-align > #aesop-generator-attr-align').on('change',function(){

				var value = $(this).val()

				if ( 'left' == value ) {

					component.find('.aesop-image-component-image').removeClass('aesop-component-align-right aesop-component-align-center')

				} else if ( 'right' == value ) {

					component.find('.aesop-image-component-image').removeClass('aesop-component-align-left aesop-component-align-center')

				} else if ( 'center' == value ) {

					component.find('.aesop-image-component-image').removeClass('aesop-component-align-left aesop-component-align-right')

				}

				component.find('.aesop-image-component-image').addClass('aesop-component-align-'+$(this).val()+' ')

			})
				settings.find('.aesop-image-captionposition > #aesop-generator-attr-captionposition').on('change',function(){

					var value = $(this).val();

					if ( 'left' == value ) {

						component.find('.aesop-image-component-image').removeClass('aesop-image-component-caption-right aesop-image-component-caption-center')

					} else if ( 'right' == value ) {

						component.find('.aesop-image-component-image').removeClass('aesop-image-component-caption-left aesop-image-component-caption-center')

					} else if ( 'center' == value ) {

						component.find('.aesop-image-component-image').removeClass('aesop-image-component-caption-left aesop-image-component-caption-right')

					}

					component.find('.lasso-image-component-image').addClass('lasso-image-component-caption-'+value+' ');
				});
				settings.find('.aesop-image-offset > #aesop-generator-attr-offset').on('keyup',function(){

					var value = $(this).val();

					if ( component.find('.aesop-image-component-image').hasClass('aesop-component-align-left') ) {

						component.find('.aesop-image-component-image').css('margin-left', $(this).val() );

					} else {

						component.find('.aesop-image-component-image').css('margin-right', $(this).val() );
					}

				});


			// CHARACTER LIVE EDIT ///////////////////
			settings.find('.aesop-character-name > #aesop-generator-attr-name').on('keyup',function(){
				component.find('.aesop-character-title').text( $(this).val() );
			})
			settings.find('.aesop-character-caption > #aesop-generator-attr-caption').on('keyup',function(){
				component.find('.aesop-character-cap').text( $(this).val() );
			})
			settings.find('.aesop-character-align > #aesop-generator-attr-align').on('change',function(){

				var value = $(this).val()

				if ( 'left' == value ) {

					component.removeClass('aesop-component-align-right aesop-component-align-center');

				} else if ( 'center' == value ) {

					component.removeClass('aesop-component-align-left aesop-component-align-right');

				}

				component.addClass('aesop-component-align-'+$(this).val()+' ');

			});

			// CHAPTER LIVE EDIT ///////////////////
			settings.find('.aesop-chapter-title > #aesop-generator-attr-title').on('keyup',function(){
				component.find('.aesop-cover-title span').text( $(this).val() );
			})
			settings.find('.aesop-chapter-subtitle > #aesop-generator-attr-subtitle').on('keyup',function(){
				component.find('.aesop-cover-title small').text( $(this).val() );
			})

			// VIDEO LIVE EDITOR /////////////////////
			//settings.find('.lasso-video-src > #aesop-generator-attr-src').live('change blur',function(){
			settings.find('.aesop-video-src > #aesop-generator-attr-src').on('change blur',function(){

				val = $(this).val()

				if ( 'vimeo' == val ) {

					component.find('iframe').attr('src', '//player.vimeo.com/video/'+val+' ')

					initVideoProvider( settings, component, 'vimeo' );

				} else if ( 'youtube' == val ) {

					component.find('iframe').attr('src', '//www.youtube.com/embed/'+val+'?rel=0&wmode=transparent')

					initVideoProvider( settings, component, 'youtube' );
				}

			});
			settings.find('.aesop-video-id > #aesop-generator-attr-id').on('keyup',function(){
				t = $('.aesop-video-src > #aesop-generator-attr-src').val();
				val = $(this).val();
				if ( 'vimeo' == t ) {
					component.find('iframe').attr('src', '//player.vimeo.com/video/'+val+' ')
				} else if ( 'youtube' == t ) {
					component.find('iframe').attr('src', '//www.youtube.com/embed/'+val+'?rel=0&wmode=transparent')
				}
			});
			settings.find('.aesop-video-width > #aesop-generator-attr-width').on('keyup',function(){
				component.find('.aesop-video-container').css('max-width', $(this).val() );
			});

			// CONTENT COMPONENT LIVE EDIT /////
			//settings.find('.lasso-content-background > #aesop-generator-attr-background').live('change',function(){
			settings.find('.lasso-content-background > #aesop-generator-attr-background').on('change',function(){
			  	component.find('.aesop-content-comp-wrap').css({'background-color': $(this).val()});
			});
				//settings.find('.lasso-content-color > #aesop-generator-attr-color').live('change',function(){
				settings.find('.aesop-content-color > #aesop-generator-attr-color').on('change',function(){
				  	component.find('.aesop-content-comp-wrap').css({'color': $(this).val()});
				});
				//settings.find('.lasso-content-height > #aesop-generator-attr-height').live('keyup',function(){
				settings.find('.aesop-content-height > #aesop-generator-attr-height').on('keyup',function(){

					val = $(this).val()

					component.find('.aesop-content-comp-wrap').css({'min-height': $(this).val()});

				});
				//settings.find('.lasso-content-columns > #aesop-generator-attr-columns').live('change',function(){
				settings.find('.aesop-content-columns > #aesop-generator-attr-columns').on('change',function(){

					val = $(this).val()

					if ( '1' == val ) {
						component.find('.aesop-content-comp-wrap').removeClass('aesop-content-comp-columns-2 aesop-content-comp-columns-3 aesop-content-comp-columns-4').addClass('aesop-content-comp-columns-1')
					} else if ( '2' == val ) {
						component.find('.aesop-content-comp-wrap').removeClass('aesop-content-comp-columns-1 aesop-content-comp-columns-3 aesop-content-comp-columns-4').addClass('aesop-content-comp-columns-2')
					} else if ( '3' == val ) {
						component.find('.aesop-content-comp-wrap').removeClass('aesop-content-comp-columns-1 aesop-content-comp-columns-2 aesop-content-comp-columns-4').addClass('aesop-content-comp-columns-3')
					} else if ( '4' == val ) {
						component.find('.aesop-content-comp-wrap').removeClass('aesop-content-comp-columns-1 aesop-content-comp-columns-2 aesop-content-comp-columns-3').addClass('aesop-content-comp-columns-4')
					}


				});
		});

		/**
		*
		*	Swap the video player with the correct id
		*	@param object the global settings for this component
		*	@param object the component we're editing
		*	@param type string the type of video (vimeo, youtube)
		*	@since 0.9.7
		*/
		function initVideoProvider( settings, component, type ){

			//settings.find('.lasso-video-id > #aesop-generator-attr-id').live('change',function(){
			settings.find('.lasso-video-id > #aesop-generator-attr-id').on('change',function(){

				video_id = $(this).val()

				if ( 'vimeo' == type ) {
					component.find('iframe').attr('src', '//player.vimeo.com/video/'+video_id+' ')
				} else if ( 'youtube' == type ) {
					component.find('iframe').attr('src', '//www.youtube.com/embed/'+video_id+'?rel=0&wmode=transparent')
				}

			})
		}


	});

})( jQuery );

jQuery(function( $ ) {

	function saveSelection() {
	    if (window.getSelection) {
	        sel = window.getSelection();
	        if (sel.getRangeAt && sel.rangeCount) {
	            return sel.getRangeAt(0);
	        }
	    } else if (document.selection && document.selection.createRange) {
	        return document.selection.createRange();
	    }
	    return null;
	}

	function restoreSelection(range) {
	    if (range) {
	        if (window.getSelection) {
	            sel = window.getSelection();
	            sel.removeAllRanges();
	            sel.addRange(range);
	        } else if (document.selection && range.select) {
	            range.select();
	        }
	    } else {
            if (window.getSelection) {
    	        sel = window.getSelection();
    	        if (sel.getRangeAt && sel.rangeCount) {
    	            window.selRange =  sel.getRangeAt(0);
    	        }
            }
	    }
	}
	
	
	
	lasso_editor.checkSelection = function (saveSel) {
		/*var saveSel = saveSelection;
		if (saveSel == undefined) { 
			saveSel =  false;
		} */
		if (saveSel == true) {
			window.selRange = saveSelection();
		}

		if (!window.selRange || window.selRange.collapsed) {
			swal({
				    title:"",
					text: lasso_editor.strings.selectText,
					closeOnConfirm: true
			});
			return false;
		}
		return true;
	}

	var ifSmallWidth = function(){

		return 600 <= $(window).width() ? true : false;
	}

	var dropClass = function() {

		return "up";//ifSmallWidth() ? 'up' : 'down';

	}
	
	

	/////////////
	/// DROP UP
	/////////////
	$(document).on('click', '#lasso-toolbar--components', function(e){

		$(this).toggleClass('toolbar--drop-'+dropClass() );
        // show and hide the component list 
		var dropUp 			= $(this).find('ul');
		if ($(this).hasClass( 'toolbar--drop-'+dropClass() )) {
			$(dropUp).show();
		} else {
			$(dropUp).hide();
		}
        var components = $(dropUp).find("li").length;
        if (components<7) {
            $(dropUp).css('width',''+(components*42+8)+'px');
            $(dropUp).css('left','-'+((components*42+8)/2-20)+'px');
        }   
		restoreSelection(window.selRange);
		$('#lasso-toolbar--html').removeClass('html--drop-'+dropClass() );
		$('#lasso-toolbar--link').removeClass('link--drop-'+dropClass() );
		if( !lasso_editor.isMobile) {
			// get the height of the list of components
			
			var	dropUpHeight 	= $(dropUp).height(),
				caretSpacing  	= 15; // this is the height of the caret

			// and adjust the drop up position as necessary
			if ( true == ifSmallWidth() ) {

				$(dropUp).css({
					dropUp: dropUpHeight,
					top: -(dropUpHeight + caretSpacing)
				});

			}
		} else {
			/*$(dropUp).css({
					dropUp: dropUpHeight,
					top: 40
				});*/
		}


	});
	
	
	
	// if we the side component button feature is on
	if (lasso_editor.buttonOnEmptyP) {
		jQuery(document).on('click', '#lasso--content p', function(e){
			//if the user click on a paragraph
			if ($(this).find("#lasso-side-comp-button").length == 0) {
				lasso_editor.addComponentButton();
			}
		});
	}
	
	
	
	jQuery(document).on('mousedown', '#lasso-side-comp-button', function(){	
		// side component button handler
		window.selRange = saveSelection();
		$(this).toggleClass('toolbar--side' );
        // show and hide the component list 
		var drop			= $('#lasso-side-comp-button #lasso-toolbar--components__list');
		if (drop.length ==0) {
			drop 			= $('#lasso-toolbar--components__list').clone();
			$(this).append(drop);
			
		}
		
		if ($(this).hasClass( 'toolbar--side')) {
			$(drop).show();
		} else {
			$(drop).hide();
		}
		$('#lasso-toolbar--html').removeClass('html--drop-'+dropClass() );
		$('#lasso-toolbar--link').removeClass('link--drop-'+dropClass() );
		
		$(drop).css({
				left: '30px',
				top:'0px'
			});
            
        if ($(this).find("li").length<7) {
            $(this).find("ul").css('column-count',''+$(this).find("ul li").length);
            $(this).find("ul").css('width','auto');
        }       
	
	});

	/////////////
	/// HTML DROP UP
	/////////////

	//$('#lasso-toolbar--html').live('mousedown',function(){
	/*jQuery(document).on('mousedown', '#lasso-toolbar--html,#lasso-toolbar--components,#lasso-toolbar--link', function(){
		if( ! $(this).hasClass('html--drop-'+dropClass() ) ) {
			var article = document.getElementById(lasso_editor.editor);
			article.highlight();
			window.selRange = saveSelection();
			if( typeof window.selRange === 'undefined' || null == window.selRange ) {
				window.selRange = saveSelection();
			}
		}
	});*/

	//$('#lasso-toolbar--html__inner').live('focusout',function(){
	jQuery(document).on('focusout', '#lasso-toolbar--html__inner', function(){
		restoreSelection(window.selRange);
	});

	//$('#lasso-toolbar--html__inner').live('focus',function(){
	jQuery(document).on('focus', '#lasso-toolbar--html__inner', function(){
		var savedSelect = saveSelection();
		if ( savedSelect && $(savedSelect.commonAncestorContainer).parents('#lasso--content').length != 0 ) {
			window.selRange = saveSelection();
		}
	});

	$(document).on('click', '#lasso-toolbar--html', function(e){

		$(this).toggleClass('html--drop-'+dropClass() );
		$('#lasso-toolbar--components').removeClass('toolbar--drop-'+dropClass() );
		$('#lasso-toolbar--link').removeClass('link--drop-'+dropClass() );

		// prevent dropup from closing
		//$('#lasso-toolbar--html__wrap').live('click',function(){
		jQuery(document).on('click', '#lasso-toolbar--html__wrap', function(){
			return false;
		});

		$(this).find('#lasso-toolbar--html__inner').focus();

	});

	//$('.lasso-toolbar--html__cancel').live('click',function(){
	jQuery(document).on('click', '.lasso-toolbar--html__cancel', function(){

		$(this).closest('li').removeClass('html--drop-'+dropClass() );

	});

	//////////////////
	// HTML FORMATTING IN HTML DROP UP MENU
	//////////////////
	var htmlItemInsert = function(markup){

		return $('#lasso-toolbar--html__inner').text(markup);

	}
	//$('#lasso-html--h2').live('click',function(e){
	jQuery(document).on('click', '#lasso-html--h2', function(e){
		e.preventDefault();
		htmlItemInsert('<h2>H2 Heading</h2>');
	});
	//$('#lasso-html--h3').live('click',function(e){
	jQuery(document).on('click', '#lasso-html--h3', function(e){
		e.preventDefault();
		htmlItemInsert('<h3>H3 Heading</h3>');
	});
	//$('#lasso-html--ul').live('click',function(e){
	jQuery(document).on('click', '#lasso-html--ul', function(e){
		e.preventDefault();
		htmlItemInsert('<ul><li>Item</li></ul>');
	});
	//$('#lasso-html--ol').live('click',function(e){
	jQuery(document).on('click', '#lasso-html--ol', function(e){
		e.preventDefault();
		htmlItemInsert('<ol><li>Item</li></ol>');
	});
	jQuery(document).on('click', '#lasso-html--table', function(e){
		e.preventDefault();
		htmlItemInsert(lasso_editor.tableCode);//'<table><tr><th>Cell 1</th><th>Cell 2</th></tr><tr><td>Cell 3</td><td>Cell 4</td></tr></table>');
	});

	////////////
	/// LINK DROP UIP
	////////////
	//$('#lasso-toolbar--link').live('mousedown',function(){
	jQuery(document).on('mousedown', '#lasso-toolbar--link', function(){
		$('#lasso-toolbar--components').removeClass('toolbar--drop-'+dropClass() );
		$('#lasso-toolbar--html').removeClass('html--drop-'+dropClass() );
	});

	//$('#lasso-toolbar--link__inner').live('focusout',function(){
	jQuery(document).on('focusout', '#lasso-toolbar--link__inner', function(){
		restoreSelection(window.selRange);
	});

	//$('#lasso-toolbar--link__inner').live('focus',function(){
	jQuery(document).on('focus', '#lasso-toolbar--link__inner', function(){
		var savedSelect = saveSelection();
		if ( savedSelect && $(savedSelect.commonAncestorContainer).parents('#lasso--content').length != 0 ) {
			window.selRange = saveSelection();
		}
	});

	$(document).on('click', '#lasso-toolbar--link', function(e){

		 // exit if nothing is selected
		if (!lasso_editor.checkSelection()) return false;

		$(this).toggleClass('link--drop-'+dropClass());
		

		$('#aesop-toolbar--link_newtab').unbind('mousedown').mousedown(function() {
			$(this).prop("checked", !$(this).prop("checked"));
			return;
		});

		// prevent dropup from closing
		jQuery(document).on('click', '#lasso-toolbar--link__wrap', function(){
			return false;
		});

		$(this).find('#lasso-toolbar--link__inner').focus();
        if (window.selRange.startContainer.parentNode.tagName == 'A') {
            $('#lasso-toolbar--link__inner').text(window.selRange.startContainer.parentNode.href);
        }
	});

	// RESTORING LINK SELECTION
	//$('.lasso-editing .lasso-link').live('click',function(e){
	jQuery(document).on('click', '.lasso-editing .lasso-link', function(e){

		e.preventDefault();

		// prevent dropup from closing
		//$('#lasso-toolbar--link__wrap').live('click',function(){
		jQuery(document).on('click', '#lasso-toolbar--link__wrap', function(){
			return false;
		});

		var link = $(this).attr('href');

		$('#lasso-toolbar--link').addClass('link--drop-'+dropClass());
		$('#lasso-toolbar--link__inner').text(link);
	});

	/////////////
	/// DELETING
	/////////////
	//$('.lasso-delete').live('click',function(e) {
	jQuery(document).on('click', '.lasso-delete', function(e){

		e.preventDefault();

		var $this = $(this);

		swal({
			title: "Delete this component?",
			type: "warning",
			text: false,
			showCancelButton: true,
			confirmButtonColor: "#d9534f",
			confirmButtonText: "Yes, delete it!",
			closeOnConfirm: true
		},
		function(){

			// remove component
			$this.closest('.aesop-component').remove();

			// remove wp image if its a wp image
			$this.closest('.lasso-component').remove();
            
            if ($this.parent().parent().hasClass('wp-block-image')) {
                //$this.closest('.wp-block-image').remove();
                $this.parent().parent().remove();
            }

		});

	});

	/////////////
	/// CLONING
	/////////////
	//$('.lasso-clone').live('click',function(e) {
	jQuery(document).on('click', '.lasso-clone', function(e){

		// sore reference to this
		var $this = $(this);

		e.preventDefault();

		$this.closest('.aesop-component').clone().insertAfter( $(this).parent().parent() ).hide().fadeIn()
		$this.closest('.lasso-component').clone().insertAfter( $(this).parent().parent() ).hide().fadeIn()

	});

});
jQuery(document).ready(function($){

	var ajaxurl 	=  lasso_editor.ajaxurl,
		save    	=  $('.lasso--controls__right a'),
		editor 		=  lasso_editor.editor,
		postid 		=  lasso_editor.postid,
		oldHtml 	=  $('#'+editor).html(),
		warnNoSave 	=  'You have unsaved changes!';
		
	// Set to true when we want to reload the current page without a warning message
	noWarningReload = false;

	///////////////////////
	// 1. IF UNSAVED CHANGES STORE IN LOCAL STORAGE
	// @todo - need to account for component on the page this only accounts for text
	///////////////////////
	//$('#'+editor).live('change',function(){
	jQuery(document).on('change', '#'+editor, function(){

		var $this = $(this),
			newHtml = $this.html();

		if ( oldHtml !== newHtml ) {

			localStorage.setItem( 'lasso_backup_'+postid , newHtml );
		}

	});

	///////////////////////
	// 2. WARN THE USER IF THEY TRY TO NAVIGATE AWAY WITH UNSAVED CHANGES
	///////////////////////
	window.onbeforeunload = function () {

		if ( localStorage.getItem( 'lasso_backup_'+postid ) && lasso_editor.userCanEdit ) {
        	return warnNoSave;
        	$('#lasso--save').css('opacity',1);
        }
    }
	
	// but also clear the unsaved changes if the user does navigate away
	window.onunload = function () {
		if ( localStorage.getItem( 'lasso_backup_'+postid ) && lasso_editor.userCanEdit ) {
        	localStorage.clear();
        }
    }
    
    /*function process_html(html, do_shortcodify) {
        	
		// take care of twitter widget
		html = process_twitter(html);
			
	    // remove objects to ignore if they are not removed already
		if (lasso_editor.showIgnoredItems ) {
			var $temp = $('<div></div>').html( html );
			$temp.find(lasso_editor.objectsNoSave).remove();
			$temp.find(lasso_editor.supportedNoSave).remove();
			html = $temp.html();
		}	
		
		// remove extra classes
		{
			var $temp = $('<div></div>').html( html );
			$temp.find("a").removeClass("lasso-link");
			$temp.find("span").removeClass("lasso-span");
			$temp.find("h2").removeClass("lasso-h2");
			$temp.find("h3").removeClass("lasso-h3");
			$temp.find(".lasso-noclass").removeClass("lasso-noclass");
			$temp.find(".lasso-undeletable").removeClass("lasso-undeletable");
			$temp.find(".lasso-component--controls, .aesop-events-edit").remove();
			
			$temp.find('*[class=""]').removeAttr('class');
			
			html = $temp.html();
		}
		
		// remove all contenteditable attr
		html = removeEditable(html);
		
		// if custom fields
		if (lasso_editor.customFields) {
			saveCustomFields(html);
		}
		
		// shortcode ultimate
		html = shortcodify_su(html);
		
		// shortcode aesop
		html = do_shortcodify ? shortcodify(html) : html;
		
		
		
		// restore other shortcodes to the original shortcodes
		html = replace_rendered_shortcodes( html );

		// avia editor
		if (lasso_editor.aviaEditor) {
			html = shortcodify_avia(html);
		}
        
        // WordPress Block
        if (lasso_editor.hasGutenberg) {
            html = process_gutenberg(html);
        }
        
        // if multi page
        if (lasso_editor.multipages != "-1") {
            var res = lasso_editor.post_content.split("<!--nextpage-->");
            var html2 = "";
            res[parseInt(lasso_editor.multipages)] = html;
            html = res.join("<!--nextpage-->");
        }
        
        // any user supplied filters
	
		if (lasso_editor.filterArray) {
			$(lasso_editor.filterArray).each(function(key, val){
				html = val(html );
			});
		}
        
        return html
    }*/

	///////////////////////
	// 3. SAVE OR PUBLISH OBJECT
	///////////////////////
	//$('.lasso--controls__right a:not(#lasso--exit)').live('click',function(e) {
	//jQuery(document).on('click', '.lasso--controls__right a:not(#lasso--exit)', function(e){
	//jQuery('.lasso--controls__right a:not(#lasso--exit)').on('click', function(e){
	jQuery(document).on('click','#lasso--save, #lasso--publish', function(e){

		var warnNoSave = null;

		e.preventDefault();

		// sore reference to this
		var $this = $(this);

		// unwrap wp images
		/*$(".lasso--wpimg__wrap").each(function(){

			//if ( !$(this).hasClass('wp-caption') ) {
			//	$(this).children().unwrap()
			//}

			$('.lasso-component--controls').remove();
		});

		// unwrap custom components
		$('.lasso-component').each(function(){
			$('.lasso-component--controls').remove();
		});*/

		// unwrap map from hits drag holder
		$('#lasso--map-form').each(function(){

			var $this = $(this)

			$this.find('.lasso-component--controls, .lasso--map-form__footer ').remove()

			$this.children().unwrap()
		});

		// if tehre are any scrollnav sections we need to break them open so the editor doesnt save the html
		$('.scroll-nav__section').each(function(){
			$(this).children().unwrap();
		})

		// remove any notices
		$('#lasso--notice').remove();
        
        //remove any comp buttons
        $('#lasso-side-comp-button').remove();
		
		$('.lasso--text-popup').remove();
        
        
        		// let user know someting is happening on click
		$(this).addClass('being-saved');

		// get the html from our div
		var html = $('#'+editor).html(),
			postid = lasso_editor.postid;
		if (!html) return;
        
        html =  process_html(html, $this.hasClass('shortcodify-enabled'));
		
		
		
		
		
		// gather the data
		var data      = {
			action:    	($this.hasClass('lasso-publish-post') && lasso_editor.can_publish) ? 'process_save_publish-content' : 'process_save_content',
			author:  	lasso_editor.author,
			content: 	html,
			post_id:   	postid,
			nonce:     	lasso_editor.nonce
		};
		
		

		// intercept if publish to confirm
		if ( $this.hasClass('lasso-publish-post') ) {	
			if (lasso_editor.publishHandler) {
				// custom publish handler
				lasso_editor.publishHandler(data);
			} else {
				swal({
					title: lasso_editor.strings.publishPost,
					type: "info",
					text: false,
					showCancelButton: true,
					confirmButtonColor: "#5bc0de",
					confirmButtonText: lasso_editor.strings.publishYes,
					closeOnConfirm: true
				},
				function(){
					runSavePublish(true)

				});
				
			}

		} else {

			runSavePublish(false)

		}
        
        function process_html(html, do_shortcodify) {
        	
            // take care of twitter widget
            html = process_twitter(html);
                
            // remove objects to ignore if they are not removed already
            if (lasso_editor.showIgnoredItems ) {
                var $temp = $('<div></div>').html( html );
                $temp.find(lasso_editor.objectsNoSave).remove();
                $temp.find(lasso_editor.supportedNoSave).remove();
                html = $temp.html();
            }	
            
            // remove extra classes
            {
                var $temp = $('<div></div>').html( html );
                $temp.find("a").removeClass("lasso-link");
                $temp.find("span").removeClass("lasso-span");
                $temp.find("h2").removeClass("lasso-h2");
                $temp.find("h3").removeClass("lasso-h3");
                $temp.find(".lasso-noclass").removeClass("lasso-noclass");
                $temp.find(".editus-firstp").removeClass("editus-firstp");
                $temp.find(".lasso-undeletable").removeClass("lasso-undeletable");
                $temp.find(".lasso-component--controls, .aesop-events-edit").remove();
                
                $temp.find('*[class=""]').removeAttr('class');
                //process <!--more-->
                $temp.find("span#more-"+lasso_editor.postid).replaceWith( "<!--more-->" );
                
                html = $temp.html();
            }
            
            // remove all contenteditable attr
            html = removeEditable(html);
            
            // if custom fields
            if (lasso_editor.customFields) {
                saveCustomFields(html);
            }
            
            // WordPress Block
            if (lasso_editor.hasGutenberg) {
				const reg = /<p[^>]*><!--/;
				html = html.replace(reg,"<!--").replace("--></p>","-->");
                html = process_gutenberg(html);
            }
			
			//shortcodes
			{
                // shortcode ultimate
                //html = shortcodify_su(html);
                
                // restore other shortcodes to the original shortcodes
                html = replace_rendered_shortcodes( html );
                
                // shortcode aesop
                html = do_shortcodify ? shortcodify(html) : html;	

                // avia editor
                if (lasso_editor.aviaEditor) {
                    html = shortcodify_avia(html);
                }
            }
            
            // if multi page
            if (lasso_editor.multipages != "-1") {
                var res = lasso_editor.post_content.split("<!--nextpage-->");
                var html2 = "";
                res[parseInt(lasso_editor.multipages)] = html;
                html = res.join("<!--nextpage-->");
            }
            
            // any user supplied filters
        
            if (lasso_editor.filterArray) {
                $(lasso_editor.filterArray).each(function(key, val){
                    html = val(html );
                });
            }
            
            return html
        }

		
		function removeComment(content) {
			return content.replace(/<!--[\s\S]*?-->/g, "");
		}
		
		function removeEditable(content) 
		{	
			return content.replace(/contenteditable="(false|true)"/g, "");
		}
		
		// gather the custom field data and save to lasso_editor.cftosave

		function saveCustomFields(content) {
			var data ={};
			var customFields = lasso_editor.customFields;
			for (var key in customFields) {
				var selector ='';
				var html = false;
				var isimgurl = false;
				if (typeof(lasso_editor.customFields[key]) == 'object') {
					selector = customFields[key]['selector'];
					html = customFields[key]['html'];
					isimgurl = customFields[key]['imgurl'];
				} else {
					selector =customFields[key];
				}
				var arr = $(document).find(selector);
				if (arr.length) {
					if (html) {
						data[key] = arr[0].innerHTML.replace(/[\n\r]/g, '');;
					} else if (isimgurl) {
						data[key] = $(arr[0]).attr('src');
					} else {
						data[key] = arr[0].innerText;//.replace(/[\n\r]/g, '');
					}
				}
			}
			lasso_editor.cftosave = data;
		}

		/**
		 	* Turn content html into shortcodes
		 	* @param  {[type]} content  [description]
		 	* @param  {[type]} selector [description]
		 	* @return {[type]}          [description]
		*/
		function shortcodify(content,selector){

			// Convert the html into a series of jQuery objects
			var j = $.parseHTML(content);
			var processed = '';
			if (j == null) {
				return content;
			}

			// Iterate through the array of dom objects
			for (var i = 0; i < j.length; i++) {

	    		var component = $(j[i]);

	    		// If it's not a component, move along
	    		if ( !component.hasClass('aesop-component') ) {
					
					if(component.find('.aesop-component').length !== 0) {
						// if there is an aesop component in a child, recursively process it
						var comp_content = component.html();
						comp_content = shortcodify(comp_content);
						component.html(comp_content);
						processed += component.clone().wrap('<p>').parent().html();;
					} else   			// Let's test what kind of object it is
                    if ( component.context && component.context.nodeType == 3 ) {
	    				// Text only object without dom
	    				processed += j[i].data;
	    			} else if ( (component.context && component.context.nodeType == 8)  || j[i].nodeType==8) {
	    				processed += '<!--' + j[i].data + '-->';
	    			} else {
	    				// DOM object
                        if (j[i].outerHTML) {
                            processed += j[i].outerHTML;
                        } else if (j[i].data){
                            processed += j[i].data;
                        }
	    			}
	    			continue;
	    		}

	    		var data = component.data();
	    		var params = '';

	    		// It's a component, let's check to make sure it's defined properly
				if ( data.hasOwnProperty('componentType') ) {
                    if (data.componentType =="wpimg") 
                        continue;

					for ( var index in data ) {

						// Don't accept componentType as a param
						if ( !data.hasOwnProperty(index) || index == 'componentType' ) {
							continue;
						}

						// Build the params string out of the data attributes
						params += " " + index + '="' + data[index] + '"';

					}

					var sc = '[aesop_' + data.componentType + params + ']';

					// Let's check to see if it's a "full" shortcode
					var inner = component.find('.aesop-component-content-data');

					if ( inner.length != 0 ) {
						sc += inner[0].innerHTML + "[/aesop_" + data.componentType + "]";
					}

					processed += sc;

				}

			}

			return processed;

		}
		
		function process_twitter(html)
		{
			// if twitter widget doesn't exist return
			if (!html) return null;
			if (html.indexOf("twitterwidget") ==-1) return html;
			var t = $('#'+editor).clone();
			var t1 = t.find('twitterwidget');
			var t2 = $('#'+editor).find('twitterwidget');
			var i;
			for (i = 0; i<t1.length; i++) {
				var t5 = $('<div></div>').html(t2[i].shadowRoot.innerHTML).find('.EmbeddedTweet').data('click-to-open-target');
				$(t1[i]).replaceWith(t5);
			}
			
			var html2 = t.html();
			return html2;
		}
		
		//shortcode ultimates
		function shortcodify_su(content,selector){

			// Convert the html into a series of jQuery objects
			var j = $.parseHTML(content);
			var processed = '';

			// Iterate through the array of dom objects
			for (var i = 0; i < j.length; i++) {

	    		var component = $(j[i]);

	    		// If it's not a component, move along
	    		if ( !component.hasClass('su-box') &&  !component.hasClass('su-note') && !component.hasClass('su-document') && !component.hasClass('su-spoiler')) {

	    			// Let's test what kind of object it is
	    			if ( component.context.nodeType == 3 ) {
	    				// Text only object without dom
	    				processed += j[i].data;
	    			} else if ( component.context.nodeType == 8 ) {
	    				processed += '<!--' + j[i].data + '-->';
	    			} else {
	    				// DOM object
	    				processed += j[i].outerHTML;
	    			}
	    			continue;
	    		}
				
				
				if ( component.hasClass('su-box')) {
					var box_title = component.find('.su-box-title')[0].innerHTML;
					var box_content = component.find('.su-box-content')[0].innerHTML;
					var box_color = component.find('.su-box-title')[0].style.backgroundColor;
					var sc = '[su_box title="'+box_title+'"'+' box_color="' +box_color+'"]' + box_content+'[/su_box]';
					processed += sc;
					
				} else if ( component.hasClass('su-note')) {
					var note_content = component.find('.su-note-inner')[0].innerHTML;
					note_content = shortcodify_su(note_content);
					var note_color = component.find('.su-note-inner')[0].style.backgroundColor;
					var text_color = component.find('.su-note-inner')[0].style.color;
					var sc = '[su_note note_color="'+ note_color + '" text_color="'+text_color +'"]' + note_content+'[/su_note]';
					processed += sc;
					
				} else if ( component.hasClass('su-document')) {
					
					var ifr = component.find('iframe.su-document')[0];
					var url = getParameterByName("url",ifr.src);
					var width = ifr.width;
					var height = ifr.height;
					var sc = '[su_document url="'+ url + '" width="'+ width +'" height="' + height+'"]';
					processed += sc;
					
				} else if ( component.hasClass('su-spoiler')) {
					var spoiler_content = component.find('.su-spoiler-content')[0].innerHTML;
					spoiler_content = shortcodify_su(spoiler_content);
					var title = component.find('.su-spoiler-title')[0].textContent;
					
					var sc = '[su_spoiler title="'+ title + '" style="fancy" open="no"]' + spoiler_content+'[/su_spoiler]';
					processed += sc;
					
				}		

			}

			return processed;
		}
        
        function process_gutenberg(content){
			// Convert the html into a series of jQuery objects
			var k = $.parseHTML(content);
			var processed = '';
			if (k == null) {
				return content;
			}
            
            j =  $('<div>').append($(k).clone());
            //ul
            $(j).find("ul").before('<!-- wp:list -->' ).after('<!-- /wp:list -->');
            $(j).find("ol").before('<!-- wp:list {"ordered":true} -->' ).after('<!-- /wp:list -->');
            
            
            // columns
            $(j).find(".wp-block-column").each( function(index ) {
                var data = {};
                if ($(this).hasClass('is-vertically-aligned-center')) {
                    data["verticalAlignment"]= "center";
                }
                if ($(this).css("flex-basis")!= "") {
                    data["width"] = $(this).css("flex-basis");
                }
                blockCode = "<!-- wp:column " + JSON.stringify(data) + " -->";
    
                $(this).before(blockCode);
                $(this).after("<!-- /wp:column -->" );
            });

            $(j).find(".wp-block-columns").each( function(index ) {
                var data = {};
                if ($(this).hasClass('are-vertically-aligned-center')) {
                    data["verticalAlignment"]= "center";
                }
                blockCode = "<!-- wp:columns " + JSON.stringify(data) + " -->";
    
                $(this).before(blockCode);
                $(this).after("<!-- /wp:columns -->" );
            });
            
            //paragraph
            $(j).find("p").each( function(index ) {
                var data = {};
                 if ($(this).hasClass('has-text-align-center')) {
                    data["align"]= "center";
                }
                
                blockCode = "<!-- wp:paragraph " + JSON.stringify(data) + " -->";
    
                $(this).before(blockCode).after("<!-- /wp:paragraph -->" );
            });
            
            //gallery
            $(j).find(".wp-block-gallery").each( function(index ) {
                debugger;
                var data = {};
                 if ($(this).hasClass('aligncenter')) {
                    data["align"]= "center";
                }
                var classes = $(this).attr('class').split(" ");
                for (i = 0; i < classes.length; ++i) {
                    if (classes[i].indexOf('columns-') == 0) {
                        data["columns"] = parseInt(classes[i].substr(8));
                    }
                } 
                var ids = [];
                $(this).find("img").each( function(index ) {
                    ids[index] = $(this).data('id');
                });
                data["ids"]= ids;
                if ($(this).find("a").length ==0) {
                    data["linkTo"] = "none";
                } else {
                    data["linkTo"] = "file";
                }
                blockCode = "<!-- wp:gallery " + JSON.stringify(data) + " -->";
    
                $(this).before(blockCode);
                $(this).after("<!-- /wp:gallery -->" );
            });
            
            //heading
            $(j).find("h1").before('<!-- wp:heading {"level":1} -->' );
            $(j).find("h2").before('<!-- wp:heading {"level":2} -->' );
            $(j).find("h3").before('<!-- wp:heading {"level":3} -->' );
            $(j).find("h4").before('<!-- wp:heading {"level":4} -->' );
            $(j).find("h5").before('<!-- wp:heading {"level":5} -->' );
            $(j).find("h1,h2,h3,h4,h5").after("<!-- /wp:heading -->" );
            
            //table
            $(j).find(".wp-block-table").before("<!-- wp:table -->" ).after("<!-- /wp:table -->" );
            
            //button
            $(j).find(".wp-block-button").before("<!-- wp:button -->" );
            $(j).find(".wp-block-button").after("<!-- /wp:button -->" );
            $(j).find(".wp-block-buttons").each( function(index ) {
                var blockCode = "<!-- wp:buttons ";
                var data = {};
                if ($(this).hasClass('is-content-justification-center')) {
                    data["contentJustification"]= "center";
                }
                blockCode = blockCode + JSON.stringify(data) + " -->";
                $(this).before(blockCode);
                $(this).after("<!-- /wp:buttons -->" );
            });
              
            //group
            $(j).find(".wp-block-group").each( function(index ) {
                var data = {};
                if ($(this).hasClass('alignfull')) {
                    data["align"]= "full";
                }
                var blockCode = "<!-- wp:group " + JSON.stringify(data) + " -->";
                $(this).before(blockCode);
                $(this).after("<!-- /wp:group -->" );
            });
            
            // spacer
            $(j).find(".wp-block-spacer").before("<!-- wp:spacer -->" ).after("<!-- /wp:spacer -->" );
            
            // separator
            $(j).find(".wp-block-separator").before("<!-- wp:separator  -->" ).after("<!-- /wp:separator  -->" );
            
            // image
			$(j).find(".wp-block-image").each( function(index ) {
                $(this).removeAttr('data-component-type');
                var data = {};
                if ($(this).find("img").length == 0) {
                    return;
                }
                
				var blockCode = "<!-- wp:image ";
				
				var classes = $(this).find("img").attr('class').split(" ");
				
				$(this).removeAttr('width').removeAttr('height').removeAttr('readonly');
				$(this).find("img").removeAttr('width').removeAttr('height').removeAttr('srcset').removeAttr('sizes').removeAttr('loading');
				var i;
                for (i = 0; i < classes.length; ++i) {
                    if (classes[i].indexOf('wp-image-') == 0) {
                        data["id"] = parseInt(classes[i].substr(9));
                    }
                } 
				if ($(this).hasClass("size-large") || $(this).find('figure').hasClass("size-large")) {
					data["sizeSlug"] = "large";
				}
                if ($(this).hasClass("size-full") || $(this).find('figure').hasClass("size-full")) {
					data["sizeSlug"] = "full";
				}
                 if ($(this).find(".aligncenter").length>0) {
                    data["align"]="center";
                }
                if ($(this).hasClass("is-style-default")) {
					data["className"] = "is-style-default";
				}
                if ($(this).hasClass("is-style-rounded")) {
					data["className"] = "is-style-rounded";
				}
                if ($(this).find(".alignright").length>0) {
                    data["align"] = "right";
                }
                if ($(this).find(".alignleft").length>0) {
                    data["align"] = "left";
                }
         
                blockCode = blockCode + JSON.stringify(data) + " -->";
                $(this).before(blockCode);
                $(this).after("<!-- /wp:image -->" );
            });
            
            // cover
			$(j).find(".wp-block-cover").each( function(index ) {
                $(this).removeAttr('data-component-type');
				var blockCode = "<!-- wp:cover ";
                var data = {};
                
                if ($(this).find("img").length > 0) {
				    data['url'] = $(this).find("img").attr('src');
                    var classes = $(this).find("img").attr('class').split(" ");
                    $(this).removeAttr('width').removeAttr('height');
                    if ($(this).css("min-height") == "100vh") {
                        data["minHeight"] =100;
                        data["minHeightUnit"] = "vh";
                    }
                    $(this).find("img").removeAttr('width').removeAttr('height').removeAttr('srcset').removeAttr('sizes').removeAttr('loading');
                    var i;
                    for (i = 0; i < classes.length; ++i) {
                        if (classes[i] == 'alignfull') {
                            data['align'] = "full";
                        }
                        if (classes[i].indexOf('wp-image-') == 0) {
                            data["id"] = parseInt(classes[i].substr(9));
                        }
                        
                    } 
                } else {
                    var bg = $(this).css('background-image');
                    bg = bg.replace('url(','').replace(')','').replace(/\"/gi, "");
                    data['url'] = bg;
                    var classes = $(this).attr('class').split(" ");
                    var i;
                    for (i = 0; i < classes.length; ++i) {
                        if (classes[i]=='has-parallax') {
                             data["hasParallax"] = true;
                        }
                        else if (classes[i]=='is-repeated') {
                             data["className"] = "is-repeated";
                        }
                    } 
                }
			
                blockCode = blockCode + JSON.stringify(data) + " -->";
                $(this).before(blockCode);
                $(this).after("<!-- /wp:cover -->" );
            });
            
            //aesop components
            $(j).find(".aesop-component").each( function(index ) {
                var d = $(this).data();
				if (d['componentType'] == 'timeline_stop') d['componentType'] = 'timeline';

                var blockCode = "<!-- wp:ase/"+d['componentType']+" {";
                var index = 0;
                $.each(d,function(key, value){
                    if (key=='componentType') return;
                    if (index>0) blockCode += ",";
                    blockCode+= '"'+key+'":"'+value+'" ';
                    index++;
                });
                blockCode+="} /-->";
                $(this).before(blockCode);
                $(this).remove();
            });
            
            var html = $(j).html(); 
            html = html.replace(" {} -->"," -->");
            return html;
        }
		
		//shortcode avia layout editor
		function shortcodify_avia(content,selector){
			// Convert the html into a series of jQuery objects
			var j = $.parseHTML(content);
			var processed = '';

			// Iterate through the array of dom objects
			for (var i = 0; i < j.length; i++) {

	    		var component = $(j[i]);

	    		// If it's not a component, move along
	    		if ( !component.hasClass('av_textblock_section') && !component.hasClass('av_toggle_section') && !component.hasClass('togglecontainer')) {

	    			// Let's test what kind of object it is
	    			if ( component.context.nodeType == 3 ) {
	    				// Text only object without dom
	    				processed += j[i].data;
	    			} else if ( component.context.nodeType == 8 ) {
	    				processed += '<!--' + j[i].data + '-->';
	    			} else {
	    				// DOM object
	    				processed += j[i].outerHTML;
	    			}
	    			continue;
	    		}
				
				
				if ( component.hasClass('av_textblock_section')) {
					var box_text = component.find('.avia_textblock')[0].innerHTML;
					var sc = '[av_textblock]' + box_text+'[/av_textblock]';
					processed += sc;
					
				} else if ( component.hasClass('togglecontainer')) {
					
					var content = component[0].innerHTML;
					var mode ="accordion";
					content = shortcodify_avia(content);
					if (component[0].hasClass('enable_toggles')) {
						mode = "toggle";
					}
					var sc = "[av_toggle_container mode='"+mode+"']" + content+'[/av_toggle_container]';
					processed += sc;
					
				} else if ( component.hasClass('av_toggle_section')) {
					var toggle_title = component.find('.toggler')[0].innerText;
					var toggle_content = component.find('.toggle_content')[0].innerHTML;
					var sc = '[av_toggle title="'+toggle_title+'"]' + toggle_content+'[/av_toggle]';
					processed += sc;
					
				}

			}

			return processed;
		}
		
		function replace_rendered_shortcodes( content ) {
			// also remove scripts
			content = content.replace(/<script.*>.*<\/script>/g, " ");
			
			if ( content.indexOf('--EDITUS_OTHER_SHORTCODE_START|' ) == -1) {
				return content;
			}
			
			/*var k = $.parseHTML(content);
			if (k != null) {
				j =  $('<div>').append($(k).clone());
				
				$(j).find('.editus_shortcode').each(function(){
				    var oldComment = this.previousElementSibling.innerHTML;
					var re = /<!--EDITUS_OTHER_SHORTCODE_START\|\[(.*)\]-->/g.exec(oldComment) ;
					var cont = this.dataset.shortcode;
					if (cont && re && re.size>1) {
						this.previousElementSibling.innerHTML = oldComment.replace(re[1], cont);
					};
				});
				
				content = $(j).html(); 
			}*/

			var re = /<!--EDITUS_OTHER_SHORTCODE_START\|\[([\s\S]*?)\]-->([\s\S]*?)<!--EDITUS_OTHER_SHORTCODE_END-->/g ;
			if (lasso_editor.hasGutenberg) {
				content = content.replace(re,'<!-- wp:shortcode -->$1<!-- /wp:shortcode -->');
			} else {
				content = content.replace(re,'$1');
			}
			
			return content;
		}
		
		// Save post using REST API V2
		function savePublishREST(postid, title, subtitle, content_, type_,status_,forcePublish){
			
			var data      = {
				content: 	content_,
				status: status_
			};
			if (lasso_editor.aviaEditor) {
				data['content'] ="";
				data['metadata'] = { '_aviaLayoutBuilderCleanData': content_};
			}
			
			//custom fields to save
			if (lasso_editor.cftosave) {
				if (!data['metadata']) {
					data['metadata']=  lasso_editor.cftosave;
				} else {
					Object.assign(data['metadata'], lasso_editor.cftosave);
				}
			}
			
			var type;
			if (type_=="post") {
				type = "posts";
			} else if (type_=="page"){
				type = "pages";
			} else {
				type = type_;
			}
			if (title.length>0) {
				data['title'] = title;
			}
			if (subtitle.length>0) {
				data['metadata'] = { '_subtitle': subtitle};
			}
			
			if (lasso_editor.disableSavePost == 'on') {
				delete data['content'];
			}
			
			$.ajax({
				method: "POST",
				url: lasso_editor.rest_root + 'wp/v2/'+type+'/'+postid,
				data: data,
				beforeSend: function ( xhr ) {
					xhr.setRequestHeader( 'X-WP-Nonce', lasso_editor.rest_nonce );
				},
				success : function( response ) {
					saveSuccess();
                    if (forcePublish) {
                        var data = {
                            action: 		'editus_publish_post',
                            postid: 		lasso_editor.postid
                        }

                        $.post( lasso_editor.ajaxurl2, data);
                    }
				},
				error : function (xhr, exception) {
					console.log( xhr );
					alert("AJAX Error: "+xhr.responseText );
					$('#lasso--save').removeClass('being-saved').addClass('lasso--error');	
				}
			});
		}
		
		// code to run when post saving is successful
		function saveSuccess() {
			// change button class to saved
			$('#lasso--save').removeClass('being-saved').addClass('lasso--saved');

			// if this is being published then remove the publish button afterwards
			if ( $this.hasClass('lasso-publish-post') ) {
				$this.remove();
			}

			// wait a bit then remvoe the button class so they can save again
			setTimeout(function(){
				$('#lasso--save').removeClass('lasso--saved');

				if ( $this.hasClass('lasso-publish-post') ) {
					location.reload()
				}

			},1200);

			// then remove this copy from local stoarge
			localStorage.removeItem( 'lasso_backup_'+postid );
			lasso_editor.dirtyByComponent = false;
			articleMedium.dirty = false;
			if (lasso_editor.saveSuccessHookArray) {
				$(lasso_editor.saveSuccessHookArray).each(function(key, val){
					val();
				});
			}
		}
		

		// make the actual ajax call to save or publish
		function runSavePublish(forcePublish){
			if (lasso_editor.saveusingrest) {
				// get the status of the post (published/draft)
				var status_ = $('.lasso--controls__right').data( "status" );
				var title="";
				if ($(lasso_editor.titleClass).length>0) {
					title = $(lasso_editor.titleClass)[0].innerText;
				}
				var subtitle="";
				if ($(lasso_editor.subtitleClass).length>0) {
					subtitle = $(lasso_editor.subtitleClass)[0].innerText;
				}
				if (forcePublish) {
					status_ = "publish";				
					if (!lasso_editor.can_publish) {
						status_ = "pending";
					}
				}
				savePublishREST(lasso_editor.postid, title, subtitle, data.content, $('.lasso--controls__right').data( "posttype" ), status_, forcePublish);
				return;
			}
			
			$.post( ajaxurl, data, function(response) {

				if( true == response.success ) {
					saveSuccess();
				} else {
					$('#lasso--save').removeClass('being-saved').addClass('lasso--error');
				}

			}).fail(function(xhr, err) { 
				var responseTitle= $(xhr.responseText).filter('title').get(0);
				alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
				$('#lasso--save').removeClass('being-saved').addClass('lasso--error');				
			});
		}

	});
	
	
	jQuery(document).on('click','#lasso--post-delete', function(e){
		e.preventDefault();
		var $this = $(this);
		swal({
			title: lasso_editor.strings.deletePost,
			type: "error",
			text: false,
			showCancelButton: true,
			confirmButtonColor: "#d9534f",
			confirmButtonText: lasso_editor.strings.deleteYes,
			closeOnConfirm: true
		},
		function(){

			var data = {
				action: 		'editus_delete_post',
				postid: 		lasso_editor.postid,
				nonce: 			lasso_editor.deletePost
			}

			$.post( lasso_editor.ajaxurl2, data, function(response) {
				//load home page after deleting the post
				window.location.assign(lasso_editor.siteUrl);
			}).fail(function(xhr, err) { 
				var responseTitle= $(xhr.responseText).filter('title').get(0);
				alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
			});


		});
	});
});

function EditusFormatAJAXErrorMessage(jqXHR, exception) {
	if (jqXHR.status === 0) {
		return ('AJAX Error: Not connected.\nPlease verify your network connection.');
	} else if (jqXHR.status == 404) {
		return ('AJAX Error: The requested page not found. [404]');
	} else if (jqXHR.status == 500) {
		return ('AJAX Error: Internal Server Error [500].');
	} else if (exception === 'parsererror') {
		return ('AJAX Error: Requested JSON parse failed.');
	} else if (exception === 'timeout') {
		return ('AJAX Error: Time out error.');
	} else if (exception === 'abort') {
		return ('AJAX Error: Ajax request aborted.');
	} else {
		return ('AJAX Error: Uncaught Error.\n' + jqXHR.responseText);
	}
}

(function( $ ) {
	'use strict';

	/////////////
	// NEW GALLERY CREATE
	////////////
	//$('#lasso--gallery__create').live('click',function(e){
	jQuery(document).on('click','#lasso--gallery__create',function(e){

		e.preventDefault();

		$(this).closest('form').addClass('creating-gallery');

		$('.ase-gallery-opts--create-gallery2').fadeIn();
		$('.ase-gallery-opts--edit-gallery').fadeOut(1);

		$('#ase-gallery-images li').remove();
		$('#lasso--gallery__create').remove();

		$('.ase-gallery-opts--edit-gallery').text(lasso_editor.strings.addNewGallery);
		$('.ase-gallery-opts--edit-gallery .lasso-option-desc').text('Select new images to create a gallery with.');


	});

	/////////////
	// NEW GALLERY UPLOAD
	////////////

	var file_frame;
	var	gallery = $('#ase-gallery-images');

	//$(document).on('click', '#lasso--gallery__selectImages', function( e ){
	jQuery(document).on('click','#lasso--gallery__selectImages',function( e ){

	    e.preventDefault();

	    // If the media frame already exists, reopen it.
	    if ( file_frame ) {
	      	file_frame.open();
	      	return;
	    }

	    // Create the media frame.
	    file_frame = wp.media.frames.file_frame = wp.media({
	      	title: lasso_editor.strings.chooseImages,
	      	button: {
	        	text: lasso_editor.strings.addImages,
	      	},
	      	multiple: true  // Set to true to allow multiple files to be selected
	    });

	    // When an image is selected, run a callback.
	    file_frame.on( 'select', function() {

	      	var attachments = file_frame.state().get('selection');

		    if (!attachments) {
		        return;
		    }

		    // loop through and insert the new items
		    attachments.each( function( attachment ) {
		    	var id = attachment.id;
		    	var url = attachment.attributes.sizes.thumbnail.url;
		    	ase_insert_gallery_item(id, url);
		    });

		    // insert the new ids from new gallery
		    var ids = attachments.map( function( attachment ) {

		    	var attachment = attachment.toJSON();
		    	return attachment.id;

		    }).join(',');

		    // populate gallery input with ids
		    $('#ase_gallery_ids').val( ids );

		    // show the save button
	      	$('.has-galleries > #lasso--gallery__save').fadeIn();

	      	// remove the select images button
	      	$('#lasso--gallery__selectImages').remove();

	    });

	    // Finally, open the modal
	    file_frame.open();
	});

	//////////
	// NEW GALLERY SWAP
	//////////
	//$('.lasso-gallery-id #aesop-generator-attr-id').live('change',function(){
	jQuery(document).on('change','.aesop-gallery-id #aesop-generator-attr-id',function(){

		editus_gallery_swap($(this).val());
		
		var data2      = {
			action:    	'process_gallery_get-images',
			post_id:   	$(this).val(),
			nonce: 		lasso_editor.getGallImgNonce
		};

		// post ajax response with data
		$.post( lasso_editor.ajaxurl, data2, function(response) {
			$('#lasso--gallery__images').html( response.data.html );

			/////////////
			// CALL SORTABLE ON RECIEVED IMAGES
			/////////////
			var	gallery = $('#ase-gallery-images');

			gallery.ready(function(){

				gallery.sortable({
					containment: 'parent',
					cursor: 'move',
					opacity: 0.8,
					placeholder: 'ase-gallery-drop-zone',
					forcePlaceholderSize:true,
					update: function(){
						var imageArray = $(this).sortable('toArray');
						$('#ase_gallery_ids').val( imageArray );
					},
					create: function(){
						var imageArray = $(this).sortable('toArray');
						$('#ase_gallery_ids').val( imageArray );
					}
				});
                window.component.find('.lasso-component--settings__trigger').trigger('click');
			});
		}).fail(function(xhr, err) { 
			var responseTitle= $(xhr.responseText).filter('title').get(0);
			alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
		});
	});
	
	function editus_gallery_swap(galleryID){
		var data      = {
			componentType: 'gallery',
			id:   	galleryID
		};
		window.get_aesop_component_ajax(data);
	}

	///////////
	// EDIT GALLERY
	// the sortsble instat is in settingspanel.js
	///////////

	// deleting gallery items
	$(document).on('click', '.ase-gallery-image > i.dashicons-no-alt', function(){
		$(this).parent().remove();
		gallery.sortable('refresh');
		ase_encode_gallery_items();
	});

	function ase_string_encode(gData){
		return encodeURIComponent(JSON.stringify(gData));
	}

	function ase_string_decode(gData){
		return JSON.parse(decodeURIComponent(gData));
	}

	function ase_encode_gallery_items(){
		gallery = $('#lasso--gallery__images #ase-gallery-images');
		if (gallery.length) {
		   var imageArray = gallery.sortable('toArray');
	  	   $('#ase_gallery_ids').val( imageArray );
		}
	}

	// inserting gallery items
	function ase_insert_gallery_item(id, url){

		var item_html = "<li id='" + id + "' class='ase-gallery-image'><i class='dashicons dashicons-no-alt'></i><i title='Edit Image Caption' class='dashicons dashicons-edit'></i><img src='" + url + "'></li>";
		$('#ase-gallery-images').append( item_html );
		gallery.sortable('refresh');
		ase_encode_gallery_items();
	}

	// adding additiona images to existing gallery

	var clicked_button = false;

	$(document).on('click', '#ase-gallery-add-image', function (event) {
    	event.preventDefault();
    	var selected_img;
    	clicked_button = $(this);

    	if(wp.media.frames.ase_frame) {
			wp.media.frames.ase_frame.open();
			return;
		}

    	wp.media.frames.ase_frame = wp.media({
			title: lasso_editor.strings.selectGallery,
			multiple: true,
			library: {
			    type: 'image'
			},
			button: {
			    text: lasso_editor.strings.useSelectedImages
			}
		});

    	var ase_media_set_image = function() {
			var selection = wp.media.frames.ase_frame.state().get('selection');

			if (!selection) {
				return;
			}

			selection.each(function(attachment) {
				var id = attachment.id;
				var url = attachment.attributes.sizes.thumbnail.url;
				ase_insert_gallery_item(id, url);
			});

		};

    	wp.media.frames.ase_frame.on('select', ase_media_set_image);
		wp.media.frames.ase_frame.open();
	});


	// editing a single image
	function ase_edit_gallery_item(id, url, editable){
		var item_html = "<li id='" + id + "' class='ase-gallery-image'><i class='dashicons dashicons-no-alt'></i><i title='Edit Image Caption' class='dashicons dashicons-edit'></i><img src='" + url + "'></li>";
		$(editable).replaceWith( item_html );
		gallery.sortable('refresh');
		ase_encode_gallery_items();
	}

	// edit single image
	var ase_media_edit_init = function()  {

	    var clicked_button;

	    $(document).on('click', '.ase-gallery-image > i.dashicons-edit', function(event){
			event.preventDefault();
			var selected_img;
			clicked_button = $(this);

			if(wp.media.frames.ase_edit_frame) {
				wp.media.frames.ase_edit_frame.open();
				return;
			}

            wp.revisions

			wp.media.frames.ase_edit_frame = wp.media({
				title: lasso_editor.strings.editImage,
				multiple: false,
				library: {
				  	type: 'image'
				},
				button: {
				  	text: lasso_editor.strings.updateSelectedImg
				}
			});

			var ase_media_edit_image = function() {
			    var selection = wp.media.frames.ase_edit_frame.state().get('selection');

			    if (!selection) {
		        	return;
			    }

			    // iterate through selected elements
			    selection.each(function(attachment) {
			    	var id = attachment.id;
			    	var url = attachment.attributes.sizes.thumbnail.url;
			    	ase_edit_gallery_item(id, url, clicked_button.parent());
			    });

			};

			// image selection event
			wp.media.frames.ase_edit_frame.on('select', ase_media_edit_image);
			wp.media.frames.ase_edit_frame.on('open',function(){
				 var selection = wp.media.frames.ase_edit_frame.state().get('selection');
				var attachment = wp.media.attachment( clicked_button.parent().attr('id') );
				attachment.fetch();
				selection.add( attachment ? [ attachment ] : [] );
			});
			wp.media.frames.ase_edit_frame.open();
	    });

	};

	//ase_media_init('#ase-gallery-add-image', 'i');
	ase_media_edit_init();
	ase_encode_gallery_items();

})( jQuery );

(function( $ ) {

	$(document).ready(function($){

		// this function is repeated on settings-panel.js
		var value_check = function( value ){

			if ( 'grid' == value ) {
							$('.ase-gallery-opts--thumb').fadeOut();
							$('.ase-gallery-opts--photoset').fadeOut();
							$('.ase-gallery-opts--hero').fadeOut();
							$('.ase-gallery-opts--grid').fadeIn();
			} else {
							$('.ase-gallery-opts--grid').fadeOut();
			}

			if ( 'thumbnail' == value ) {
							$('.ase-gallery-opts--grid').fadeOut();
							$('.ase-gallery-opts--photoset').fadeOut();
							$('.ase-gallery-opts--hero').fadeOut();
							$('.ase-gallery-opts--thumb').fadeIn();
			} else {
							$('.ase-gallery-opts--thumb').fadeOut();
			}

			if ( 'photoset' == value ) {
							$('.ase-gallery-opts--grid').fadeOut();
							$('.ase-gallery-opts--thumb').fadeOut();
							$('.ase-gallery-opts--hero').fadeOut();
							$('.ase-gallery-opts--photoset').fadeIn();
			} else {
							$('.ase-gallery-opts--photoset').fadeOut();
			}
						
			if ( 'hero' == value ) {
							$('.ase-gallery-opts--grid').fadeOut();
							$('.ase-gallery-opts--thumb').fadeOut();
							$('.ase-gallery-opts--photoset').fadeOut();
							$('.ase-gallery-opts--hero').fadeIn();
			} else {
							$('.ase-gallery-opts--hero').fadeOut();
			}
		}

		$('.ase-gallery-type-radio').each(function(){

			if ( $(this).is(':checked') ) {
				$(this).parent().addClass('selected');
				var value = $(this).val();
	  			value_check(value);

			}

		});

		//$('.ase-gallery-layout-label').live('click',function(){
		jQuery(document).on('click','.ase-gallery-layout-label', function(){
			$('.ase-gallery-layout-label').removeClass('selected');
			$(this).addClass('selected');
			var value = $(this).find('input').val();
			value_check(value);

			// add the type to a hidden field
			$('#ase_gallery_type').val( value )
		});
	})

})( jQuery );
(function( $ ) {

	var form;

	//$('#lasso--map-form').live('submit', function(e) {
	jQuery(document).on('submit','#lasso--map-form',function(e) {

		e.preventDefault();

		var $this = $(this);

		$(this).find('input[type="submit"]').val('Saving...').addClass('being-saved');

		var data = $this.serialize();

		/////////////
		//	DO TEH SAVE
		/////////////
		$.post( lasso_editor.ajaxurl, data, function(response) {

			if ( true == response.success ) {

				$this.find('input[type="submit"]').val('Saved');
				$this.removeClass('being-saved').addClass('lasso--saved');

				setTimeout(function(){
					$this.find('input[type="submit"]').val('Save Locations').removeClass('lasso-saved');
				},1200);

			} else {
				$this.removeClass('being-saved').addClass('lasso--error');
			}


		});

	});

})( jQuery );
(function( $ ) {
	'use strict';

	//$( '#lasso--featImgSave a' ).live('click', function(e) {
	jQuery(document).on('click', '#lasso--featImgSave a', function(e){
		e.preventDefault();

		var $this 		= $(this)
		,	saveStatus = $('#lasso--save-status')

		var data = {
			action: 'editus_featured_img',
			postid: lasso_editor.postid,
			image_id: $this.data('featimg-id'),
			nonce: 	lasso_editor.featImgNonce
		}

		saveStatus.removeClass('not-visible').addClass('visible lasso--animate__spin');

		$.post( lasso_editor.ajaxurl2, data, function(response) {

			if ( response ) {
				console.log('response')
				$('#lasso--featImgSave').css('opacity',0);
				//setTimeout(function(){
				//	saveStatus.removeClass('lasso--animate__spin lasso-icon-check').addClass('lasso-icon-spinner6 not-visible')
				//},500);
			}
			saveStatus.removeClass('lasso--animate__spin lasso-icon-spinner6').addClass('lasso-icon-check');

		}).fail(function(xhr, err) { 
			var responseTitle= $(xhr.responseText).filter('title').get(0);
			saveStatus.removeClass('lasso--animate__spin lasso-icon-spinner6').addClass('lasso-icon-check');
			alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
		});

	});

	/////////////
	// FILE UPLOAD
	////////////
	var file_frame;
	var className;

	$(document).on('click', '#lasso--featImgUpload > a', function( e ){

	    e.preventDefault();

	    className = e.currentTarget.parentElement.className;

	  	var save  = $('#lasso--featImgSave a')

	    // If the media frame already exists, reopen it.
	    if ( file_frame ) {
	      	file_frame.open();
	      	return;
	    }

	    // Create the media frame.
	    file_frame = wp.media.frames.file_frame = wp.media({
	      	title: lasso_editor.strings.chooseImage,
	      	button: {
	        	text: lasso_editor.strings.updateImage,
	      	},
	      	multiple: false  // Set to true to allow multiple files to be selected
	    });

	    // When an image is selected, run a callback.
	    file_frame.on( 'select', function() {

	      	var attachment = file_frame.state().get('selection').first().toJSON();

	      	$('body').addClass('lasso--post-thumb-applied');

	      	$('article').removeClass('no-post-thumbnail').addClass('has-post-thumbnail');

	      	if ( $(lasso_editor.featImgClass).is( "img" ) ) {
				$(lasso_editor.featImgClass).prop("src",attachment.url);
				$(lasso_editor.featImgClass).prop("srcset","");
			} else {
				$(lasso_editor.featImgClass).css({
					'background-image': 'url('+attachment.url+')'
				});
			}

	      	save.attr('data-featimg-id',attachment.id).trigger('click');

	      	$('.no-post-cover-note').remove();

	    });

	    // Finally, open the modal
	    file_frame.open();
	});

	////////////
	// FEAT IMAGE DELETE
	////////////
	$(document).on('click', '#lasso--featImgDelete > a', function( e ){

		e.preventDefault();

		var $this = $(this);

		var data = {
			action: 'editus_del_featured_img',
			postid: lasso_editor.postid,
			nonce: 	lasso_editor.featImgNonce
		}

		swal({
			title: lasso_editor.strings.removeFeatImg,
			type: "warning",
			text: false,
			showCancelButton: true,
			confirmButtonColor: "#d9534f",
			confirmButtonText: lasso_editor.strings.deleteYes,
			closeOnConfirm: true
		},
		function(){

			$.post( lasso_editor.ajaxurl2, data, function(response) {

				if ( "" == response ) {

					// add a body class so we can do whatever with
					$('body').addClass('lasso--post-thumb-removed');

					$('article').removeClass('has-post-thumbnail').addClass('no-post-thumbnail');

					// add the hidden class to control shell to allow for delete button
					$('#lasso--featImgDelete').addClass('lasso--featImg--controlHidden');
					$this.closest('ul').removeClass('lasso--featImg--has-thumb');

					// remove the attr src - just a real-time update
			      	if ( $(lasso_editor.featImgClass).is( "img" ) ) {
						$(lasso_editor.featImgClass).attr("src","");
					} else {
						$(lasso_editor.featImgClass).css({
							'background-image': 'url()'
						});
					}


				}

			});

		});



	});

	////////////
	// FEAT IMAGE FROM SETTINGS - @since 0.9.4
	////////////
	var featimg_frame;
	$(document).on('click', '#lasso--post-thumb__add', function( e ){

	    e.preventDefault();

	    var $this = $(this)
	    ,	save  = $('#lasso--featImgSave a')

	    // If the media frame already exists, reopen it.
	    if ( featimg_frame ) {
	      	featimg_frame.open();
	      	return;
	    }

	    // Create the media frame.
	    featimg_frame = wp.media.frames.featimg_frame = wp.media({
	      	title: lasso_editor.strings.chooseImage,
	      	button: {
	        	text: lasso_editor.strings.updateImage,
	      	},
	      	multiple: false  // Set to true to allow multiple files to be selected
	    });

	    // When an image is selected, run a callback.
	    featimg_frame.on( 'select', function() {
	      	var attachment = featimg_frame.state().get('selection').first().toJSON();
			
			var pic = $this.closest('.lasso--post-thumb').find('img');
			pic.attr('src', attachment.url );
			
	      	save.attr('data-featimg-id',attachment.id).trigger('click');
	      	$('#lasso--postsettings__form').removeClass('no-thumbnail').addClass('has-thumbnail');
			pic.removeAttr("srcset");
			noWarningReload = true;
	    });

	    // Finally, open the modal
	    featimg_frame.open();


	}).on('click', '#lasso--post-thumb__delete', function( e ){

		e.preventDefault();

		var $this = $(this);

		var data = {
			action: 'editus_del_featured_img',
			postid: lasso_editor.postid,
			nonce: 	lasso_editor.featImgNonce
		}

		swal({
			title: lasso_editor.strings.removeFeatImg,
			type: "warning",
			text: false,
			showCancelButton: true,
			confirmButtonColor: "#d9534f",
			confirmButtonText: lasso_editor.strings.deleteYes,
			closeOnConfirm: true
		},
		function(){

			$.post( lasso_editor.ajaxurl2, data, function(response) {
                

				if ( "" == response ) {
					var defaultImg = $this.closest('.lasso--post-thumb').data('default-thumb');
			      	$this.closest('.lasso--postsettings__left').find('img').attr('src', defaultImg );
					$this.closest('.lasso--postsettings__left').find('img').removeAttr("srcset");

			      	$('#lasso--postsettings__form').removeClass('has-thumbnail').addClass('no-thumbnail')
					noWarningReload = true;

				}

			});

		});

	});

})( jQuery );

(function( $ ) {

	var form;
    // get updated aesop componets through ajax calls (global function)
	window.get_aesop_component_ajax = function(cdata)
	{
		var data = {
				action: 'get_aesop_component',
				code: 'aesop_'+cdata['componentType']
		};
		for ( var index in cdata ) {
				// Don't accept componentType as a param
				if ( !cdata.hasOwnProperty(index) || index == 'componentType'  || index =='sortableItem') {
					continue;
				}
				data[index] = cdata[index];
		}
						
		jQuery.post(lasso_editor.ajaxurl2, data, function(response) {
				if( response ){
					response = response.replace(/\\'/g, "'");
					var $a = $(response);
					window.component.replaceWith($a);
					window.component = $a;
					if ($('.fotorama').length){
						$('.fotorama').fotorama();
					}
					if ($('.aesop-gallery-photoset').length){
						$(window).trigger( 'load' );
                    }
                    
                    lasso_editor.wrapImg();
                    
					$('.aesop-component').each(function(){
						if ($(this).css("height")=="0px") {
							$(this).css("height","auto");
						}

						// if there's no toolbar present
						if ( !$(this).find('.lasso-component--toolbar').length > 0 ) {
							// if this is a map then we need to first wrap it so that we can drag the  map around
							if ( $(this).hasClass('aesop-map-component') ) {

								var $this = $(this)

								// so wrap it with a aesop-compoentn aesop-map-component div
								// @todo - note once a map is inserted it can't be edited after saving again. a user has to delete the existin map and add a new map
								// to
								//$this.wrap('<form id="lasso--map-form" class="aesop-component aesop-map-component lasso--map-drag-holder" data-component-type="map" >').before( lassoDragHandle ).after( lassoMapForm );
								$this.wrap('<div id="lasso--map-form" class="aesop-component aesop-map-component lasso--map-drag-holder" data-component-type="map" >').before( lassoDragHandle );

							} else {

								$(this).append( lasso_editor.handle );
							}
						}
					});
					if ('video' == cdata['componentType']) {
						$('.aesop-video-component').fitVids();			
					}
					if ('gallery' == cdata['componentType']) {
						get_aesop_options('gallery');
					}
					if ('gallery_pop' == cdata['componentType']) {
						get_aesop_options('gallery_pop');
					}
                    if ('timeline_stop' == cdata['componentType']) {
						lasso_editor.timelineGoTime();
					}
                                        
                    // set some figures to uneditable
                    $("figure.wp-block-image, figure.lasso--wpimg__wrap").attr('contenteditable',false).attr('readonly',true);

					lasso_editor.dirtyByComponent = true;
				} else {
					alert("error");
			}
		});
	}
	
	//reload aesop component options
	function get_aesop_options(comp)
	{
		var data = {
				action: 'editus_get_ase_options',
				component: comp
		};
						
		jQuery.post(lasso_editor.ajaxurl2, data, function(response) {
				if( response ){				
					lasso_editor.component_options[comp] = response;
				} else {
					alert("error");
			}
		});
	}

	//$('#lasso--component-settings-form').live('submit', function(e) {
	//jQuery(document).on('submit', '#lasso--component-settings-form', function(e){
    jQuery(document).on('submit', '#aesop-generator-settings', function(e){

		e.preventDefault();
        e.stopImmediatePropagation();

		// store some atts
		var $component 	= window.component
		,	cdata 		= $component.data()
		,	saveInsert 	= $('#lasso-generator-insert')
		,	form 		= $('#lasso--component-settings-form')
		,	$this 		= $(this);

		// let people know something is happening
		saveInsert.val(lasso_editor.strings.saving);

		// send the new settings to the component and update it's data attributes
	    $this.find('.lasso-generator-attr').each(function(){

	      	var optionName = $(this).closest('.lasso-option').data('option');

	      	// save even if the entry is blank
	      	//if ( '' !== $(this).val() ) {
	      	//$component.attr( 'data-' + optionName, $(this).val() );
            $component.prop( 'data-' + optionName, $(this).val() );
	      	$component.data(optionName, $(this).val() );
			//}

	    });

	    // return the data attributes as field for the sortable item
	    var cleanFields = function( cdata ){
	    	delete cdata['sortableItem'];
	    	return cdata;
	    }
		

	    /**
	    *
	    *	Build a sequence that saves, adds a class, and removs the sidebar
	    *	@param stall bool should we stall on save? typically used for all but the gallery component which runs an ajax call
	    *	@param timeout int how long should we timeout before removing the settings sidebar
	    *	@param gallery bool is this a gallery creation? otherwise let's mod the label
	    */
	    var saveSequence = function( stall, timeout, gallery ){

	    	// add a saved class then change the save label to saved
	    	var saveActions = function(gallery){

	    		saveInsert.addClass('saved');

	    		if ( true == gallery ) {

					saveInsert.val(lasso_editor.strings.galleryCreated);

	    		} else {

					saveInsert.val(lasso_editor.strings.saved);
				}
	    	}

	    	if ( true == stall ) {

				setTimeout( function(){ saveActions(); }, 500 );

			} else if ( true == gallery ) {

				//form.addClass('hide-all-fields').prepend('<div id="lasso--pagerefresh">Gallery Created! Save your post and refresh the page to access this new gallery.</div>')

				setTimeout( function(){ saveActions(true); }, 500 );

	    	} else {

		    	saveActions();

	    	}

			setTimeout( function(){ $('body').removeClass('lasso-sidebar-open'); }, timeout );
			articleMedium.makeUndoable();
			lasso_editor.dirtyByComponent = true;

	    }

		// make an ajax call to deal with gallery saving or creating only if it's a gallery
		if ( 'gallery' == cdata['componentType'] ) {


			var data = {
				action: 		$('.ase-gallery-opts--create-gallery2').is(":visible") ? 'editus_create_gallery' : 'editus_update_gallery',
				postid: 		cdata['id'],
				unique: 		cdata['unique'],
				fields: 		cleanFields(cdata),
				gallery_type:   $('#ase_gallery_type').val(),
				gallery_ids: 	$('#ase_gallery_ids').val(),
				nonce: 			$('#lasso-generator-nonce').val()
			}
			if ($('.ase-gallery-opts--create-gallery2').is(":visible")) {
				data['edgallerytitle'] = document.getElementById("lasso--gallery__galleryname").value;
			}

			$.post( lasso_editor.ajaxurl2, data, function(response) {

                retData = JSON.parse(response);
				if ( 'gallery-created' == retData["message"] ) {
					saveSequence( false, 1000, true );
					// load the new gallery
					cdata['id'] = retData["id"];
				} else if ( 'gallery-updated' == retData["message"] ) {
					saveSequence( false, 1000 );
					form.before(lasso_editor.refreshRequired);
				} else {

					alert( 'error' );

				}
				window.get_aesop_component_ajax(cdata);

			}).fail(function(xhr, err) { 
				var responseTitle= $(xhr.responseText).filter('title').get(0);
				alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
			});

		} else {

			saveSequence( true, 1200 );

		}
		
		if ( 'image' == cdata['componentType'] || 'quote' == cdata['componentType'] || 'parallax' == cdata['componentType'] || 'chapter' == cdata['componentType'] || 'video' == cdata['componentType'] ||
		      'character' == cdata['componentType'] || 'collection' == cdata['componentType'] || 'audio' == cdata['componentType']) {
			window.get_aesop_component_ajax(cdata);
		} else if ('content' == cdata['componentType']) {
			var inner = component.find('.aesop-component-content-data');

			if ( inner.length != 0 ) {
				cdata['content_data'] = inner[0].innerHTML;
			}
			window.get_aesop_component_ajax(cdata);
		} /*else if ('events' == cdata['componentType']) {
			//aesop events
			alert("Save and Reload the page to see the update.");
		}*/
        else {
            window.get_aesop_component_ajax(cdata);
        }
	});

})( jQuery );

(function( $ ) {

	$(document).ready(function(){

		// method to destroy the modal
		var destroyModal = function(){
			$('body').removeClass('lasso-modal-open' );
			$('.lasso--modal, #lasso--modal__overlay').remove();
			if (noWarningReload) {
				location.reload();
			}
		}

		// modal click
		//$('#lasso--post-new').live('click',function(e){
		jQuery(document).on('click','#lasso--post-new',function(e){

			e.preventDefault();

			// add a body class
			$('body').toggleClass('lasso-modal-open');

			// append teh modal markup ( lasso_editor_component_modal() )
			$('body').append(lasso_editor.newPostModal);

		    // if any changes happen then show the footer
		    $('.lasso--modal__trigger-footer').on('keyup',function(){
			  	$('.lasso--postsettings__footer #lasso--postsettings-create').slideDown()
			});

			modalResizer()

		});

		// destroy modal if clicking close or overlay
		//$('#lasso--modal__close, #lasso--modal__overlay, .lasso--postsettings-cancel').live('click',function(e){
		jQuery(document).on('click','#lasso--modal__close, #lasso--modal__overlay, .lasso--postsettings-cancel',function(e){
			e.preventDefault();
			destroyModal();
		});
		
		jQuery(document).on('click', '#lasso--postsettings-setnow', function(e){
			$('.editus_custom_date').datepicker( "setDate", new Date().setTime(Date.now()) );
		});

		/////////////////
		/// EXIT SETTINGS
		///////////////////
		$(document).keyup(function(e) {

			if ( 27 == e.keyCode ) {

				destroyModal();
			}

		});

		/////////////
		// MAKE NEW POST OBJECT
		//////////////
		var form;

		//$('#lasso--postnew__form').live('submit', function(e) {
		jQuery(document).on('submit', '#lasso--postnew__form', function(e){

			e.preventDefault();

			var $this = $(this);

			$(this).find('input[type="submit"]').val(lasso_editor.strings.adding);

			
			if (lasso_editor.saveusingrest) {
                // Use REST API 
				var data2 = $this.serializeArray().reduce(function(obj, item) {
					obj[item.name] = item.value;
					return obj;
				}, {});
				newPostREST(data2.story_title, data2.object,lasso_editor.newObjectContent);
			} else {
				var data = $this.serialize();
				/////////////
				//	DO TEH SAVE
				/////////////
				$.post( lasso_editor.ajaxurl, data, function(response) {
					if ( true == response.success ) {
						$('input[type="submit"]').addClass('saved');
						$('input[type="submit"]').val(lasso_editor.strings.added);
						window.location.replace(response.link+'&preview=true');
					} else {
						alert('error');
					}
				});
			}

		});

	});
	
	function newPostREST(title_, type_,content_){
		var data      = {
			title: title_,
			content: 	content_, 
			status: "draft"
		};
		
		if (lasso_editor.currCat !== null) {
			data.categories = $.map( lasso_editor.currCat, function( a ) {
			  return a.term_id;
			});
		}
		
		var type;
		if (type_=="post") {
			type = "posts";
		} else if (type_=="page"){
			type = "pages";
		} else {
			type = type_;
		}
			
		$.ajax({
			method: "POST",
			url: lasso_editor.rest_root + 'wp/v2/'+type,
			data: data,
			beforeSend: function ( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', lasso_editor.rest_nonce );
			},
			success : function( response ) {
				$('input[type="submit"]').addClass('saved');
				$('input[type="submit"]').val(lasso_editor.strings.added);

				window.location.replace(response.link+'&preview=true');
			},
			error : function (xhr, exception) {
				alert("AJAX Error: "+xhr.responseText );		
			}
		});
	}

	/////////////
	// POST OBJECT CHANGE - since 0.9.5
	/////////////
	//$('#lasso--select-type').live('change',function() {
	jQuery(document).on('change', '#lasso--select-type', function(){

		var val = $(this).val()

		$('input[name="object"]').val( val )

		$(this).closest('.story-slug-option').find('label span:not(.lasso-util--help)').text( val )
	});

})( jQuery );

(function( $ ) {

	$(document).ready(function(){

		/////////////
		// SAVE TITLE
		/////////////

		$(lasso_editor.titleClass).on('blur', function() {

			var target = $(this);

			var data = {
				action: 		'process_title-update_post',
				postid: 		lasso_editor.postid,
				title:          $.trim( target.text() ),
				nonce: 			lasso_editor.titleNonce
			}

			/////////////
			//	UPDATE THE TITLE
			/////////////
			$.post( lasso_editor.ajaxurl, data, function(response) {

				if ( true == response.success ) {

					var saveClass = 'lasso-title-saved';

					target.addClass(saveClass);

					setTimeout(function(){
						target.removeClass(saveClass);
					},500);
				}

			}).fail(function(xhr, err) { 
				var responseTitle= $(xhr.responseText).filter('title').get(0);
				alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
			});

		});

	});

})( jQuery );

(function( $ ) {

	$(document).ready(function(){

		// get the attachment id from teh class wp-image-XXX, where XXX is the id of the attached iamge
		// this oly works if the image was inserted from within the wordpress post editor
		var ase_edit_frame;
		var className;

		$(document).on('click', '.lasso--wpimg-edit',function(e){

			e.preventDefault();
            
            if ($(this).parent().parent().find('img').length==0) {
                return;
            }
            var id ='';
			var selected_img
			, 	clicked = $(this)
			, 	cls 		= $(this).parent().next('img').attr('class');
            if (cls) {
                id = cls.match(/\d+/);
            }

		    className = e.currentTarget.parentElement.className;

		    // create frame
		    ase_edit_frame = wp.media.frames.ase_edit_frame = wp.media({
		      	title: lasso_editor.strings.selectImage,
		      	button: {
		        	text: lasso_editor.strings.insertImage,
		      	},
		      	multiple: false  // Set to true to allow multiple files to be selected
		    });

		    // open frame
			ase_edit_frame.on('open',function(){
				var selection = ase_edit_frame.state().get('selection');
                if (id) {
					var attachment = wp.media.attachment( id );
					attachment.fetch();
					selection.add( attachment ? [ attachment ] : [] );
                }
			});

		    // update image on select
		    ase_edit_frame.on( 'select', function() {
                // here after simple wpimg image select

		      	var attachment = ase_edit_frame.state().get('selection').first().toJSON()
		      	,	imageURL   = undefined === attachment.sizes.large ? attachment.sizes.full.url : attachment.sizes.large.url

		      	$(clicked).parent().parent().find('img').prop({
		      		'src': imageURL,
                    'srcset' :"",
		      		'alt': attachment.alt,
		      		'class': 'aligncenter size-large wp-image-'+attachment.id+''
		      	});
				//$("html").scrollTop(lasso_editor.scrollTop);
                $('#lasso-side-comp-button,.lasso--text-popup').remove();
                // set some figures to uneditable
                $("figure.wp-block-image, figure.lasso--wpimg__wrap").attr('contenteditable',false).attr('readonly',true);

		    });

			lasso_editor.scrollTop = $(window).scrollTop();
		    // Finally, open the modal
		    ase_edit_frame.open();

		})
	});

})( jQuery );
(function( $ ) {

	$(document).on('submit', '#lasso--custom-field-form', function(e) {

		e.preventDefault();
		$('#lasso--save').trigger('click');

		var $this 	= $(this)
		,	submit 	= $this.find('input[type="submit"]')
		,	strings = lasso_editor.strings
		,	data	= $this.serialize();

		submit.val( strings.saving );

		$.post( lasso_editor.ajaxurl, data, function(response) {

			if( true == response.success ) {

				submit.val( strings.saved ).addClass('saved');

				/*console.log(response)

				setTimeout(function(){

					submit.removeClass('saved');
					submit.val( strings.save );

				},1000);*/
				location.reload();

			}

		}).fail(function(xhr, err) { 
			var responseTitle= $(xhr.responseText).filter('title').get(0);
			alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
		});

	});


})( jQuery );

(function( $ ) {

	// dyanmically center modals vertically based on size of modal
	jQuery(document).ready(function($){

		modalResizer = function(){

			var modal = $('.lasso--modal')
			,   mHeight = modal.height()
			,	wHeight  = $(window).height()
			,	eHeight  = $('.lasso--modal').hasClass('lasso--tour__modal') ? 0 : 30 // this is the height of the submit button that is hidden utnil the user changes a setting

			modal.css({
				'top' : (wHeight - mHeight - eHeight) / 2
			})

		}
		$('.lasso--modal').imagesLoaded( function() {
			modalResizer();
		})

		jQuery(window).resize(function(){ modalResizer(); });

	});

})( jQuery );
(function( $, Backbone, _, WP_API_Settings, undefined ) {

	var contentTemplate = $('#lasso-tmpl--post' )
	, 	postTemplate 	= _.template( contentTemplate.html() )
	//, 	posts 			= new wp.api.collections.Posts()
	//,	pages 			= new wp.api.collections.Pages()
	,	postAll         = $('#lasso--post-all')
	,	postList        = '#lasso--post-list'
	,	loadingText     = lasso_editor.strings.loading
	,	loadMoreText    = lasso_editor.strings.loadMore
	,	noPostsText     = lasso_editor.strings.noPostsFound
	,   fetchFailText   = lasso_editor.strings.fetchFail
	,	body 			= $('body')
	,	noPostsMessage  = '<li id="lasso--end-posts">'+noPostsText+'</li>'
	,	fetchFailMessage  = '<li id="lasso--end-posts">'+fetchFailText+'</li>'
	,	noResultsDiv  	= lasso_editor.noResultsDiv
	, 	loader			= '<div id="lasso--loading" class="lasso--loading"><div class="lasso--loader"></div></div>'
	,	moreButton      = '<a href="#" id="lasso--load-more">'+loadMoreText+'</a>'
	,	closeButton      = '<a href="#" id="lasso--close-modal-posts">'+lasso_editor.strings.close+'</a>'
	,	clear     		= '<i id="lasso--clear-search" class="dashicons dashicons-dismiss"></i>'
	,	clearItem   	= '#lasso--clear-search'
	,	hideClass       = 'lasso--hide'
	,	showClass       = 'lasso--show'
	,	helper      	= '#lasso--helper'
	,	page 			= 1
    ,   lastType        = 'posts'
    ,   collection      = false
    ,   initial         = true
    ,   totalPages      = null
    ,	api             = WP_API_Settings.root
    ,	timer
	// infinite load options
	var options = {
		data: {
			page: page,
			filter: {
				post_status: ['publish','draft','pending'] 
			}
		}
	}

	//////////////////
	// DESTROY LOADER
	/////////////////
	function destroyLoader(){
		$('#lasso--loading').remove()
	}

	/////////////////
	// INITIALIZE SCROLL
	/////////////////
	function initScroll() {

        $(postList).perfectScrollbar({
			suppressScrollX: true
		});
    }

	// set links clickable
	//$("a").attr('contenteditable',false);
	
	function fetchError(xhr){
		$( '#lasso--loading' ).remove();
		
		try {
			var data = JSON.parse(xhr.responseText);
			if (data['code'] == 'rest_post_invalid_page_number' ) {
				$( '#lasso--load-more' ).remove();
				$( postList ).append( noPostsMessage );
			} else {
				// show some info
				$( postList ).append( fetchFailMessage + '<div style="overflow-y: scroll; height:400px;"><code style="font-size:8px;">'+JSON.stringify(xhr).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</code></div>' );	
			}
		}
		catch (e){
			$( postList ).append( fetchFailMessage);
		}
	}
		
	//////////////////
	// FETCH POSTS HELPER FUNCTION
	/////////////////
	function fetchPosts( type ){	
		var capable = lasso_editor.edit_others_posts;
		lastType = type;
		if ( 'pages' == type ) {
			capable = lasso_editor.edit_others_pages;
		} /*else if ( 'posts' == type ) {
            //collection = new wp.api.collections.Posts( options );
        } else {
			// this is a working, alternate way to get collection of custom post type
			/*var customPost = wp.api.models.Post.extend({
				urlRoot: WP_API_Settings.root + 'wp/v2/'+type,
				defaults: {
					type: type
				}
			});
			var customCollection = wp.api.collections.Posts.extend({
				url: WP_API_Settings.root + 'wp/v2/'+type,
				model: customPost
			});
			collection = new customCollection;*
		}*/
		
		if (type=='posts') {
			options = capable ? setOptionsPost( type, page ) : setOptionsPost( type, page, lasso_editor.author );
			collection = new wp.api.collections.Posts( );
			collection.fetch(  options ).done( function() {
				//remove more button
				$( '#lasso--load-more,#lasso--close-modal-posts' ).remove();
				// if we have more posts then load them
				if ( collection.length > 0 ) {
					var setContainer = $( '<div data-page-num="' + collection.state.currentPage + '" class="lasso--object-batch" id="lasso--object-batch-' + page + '"></div>' );

					if (lasso_editor.restapi2) {
						collection.each( function ( model ) {
							//post.link title status id
						   setContainer.append( postTemplate( { post: model.attributes, link_: model.attributes._links.self[0].href, settings: WP_API_Settings } ) );
						} );
					} else {
						collection.each( function ( model ) {
						   setContainer.append( postTemplate( { post: model.attributes, settings: WP_API_Settings } ) );
						} );
					}

					// append to the post container
					$(postList).append( setContainer );

					//put back more button
					$(postList).append( moreButton );
					$(postList).append( closeButton );

					// show search filtering
					$('.lasso--post-filtering').removeClass('not-visible').addClass('visible')

					$( '#lasso--load-more' ).attr( 'data-post-type', type ).removeClass('lasso--btn-loading');
					// re-init scroll
					initScroll()
				}else{
					$( postList ).append( noPostsMessage );
					setTimeout(function(){
						$('#lasso--end-posts').fadeOut('slow')
					}, 1000)
				}
				// destroy the spinny loader
				destroyLoader();
			}).fail(function(xhr, err) {
				fetchError(xhr);
			});
		} else {
			/*var author = capable ? lasso_editor.author : -1;
			var parms = getParams( true, page, author );
			jQuery.ajax({
				method: "GET",
				url: WP_API_Settings.root+'wp/v2/'+type+parms,//'?status[]=draft&author[]='+lasso_editor.author,
				//dataType: "json",
				beforeSend: function(xhr){
					xhr.setRequestHeader( 'X-WP-Nonce', lasso_editor.rest_nonce );
				},
				success : function( data ) {
					dispPosts(data, type);
					parms = getParams( false, page, author );
					jQuery.ajax({
						method: "GET",
						url: WP_API_Settings.root+'wp/v2/'+type+parms,
						//dataType: "json",
						beforeSend: function(xhr){
							xhr.setRequestHeader( 'X-WP-Nonce', lasso_editor.rest_nonce );
						},
						success : function( data ) {
							dispPosts(data, type);
						},
						done: function(data)  {						
						},
						error: function(xhr, err)  {
						    $( '#lasso--loading' ).remove();
							//alert(xhr.responseText);
							//fetchError(xhr);
						}
					});
				},
				done: function(data)  {
					
				},
				error: function(xhr, err)  {
				    $( '#lasso--loading' ).remove();
					//alert(xhr.responseText);
					//fetchError(xhr);
					parms = getParams( false, page, lasso_editor.author );
					jQuery.ajax({
						method: "GET",
						url: WP_API_Settings.root+'wp/v2/'+type+parms,
						//dataType: "json",
						beforeSend: function(xhr){
							xhr.setRequestHeader( 'X-WP-Nonce', lasso_editor.rest_nonce );
						},
						success : function( data ) {
							dispPosts(data, type);
						},
						done: function(data)  {						
						},
						error: function(xhr, err)  {
						    $( '#lasso--loading' ).remove();
							//alert(xhr.responseText);
							//fetchError(xhr);
						}
					});
				}
			});*/

			
			
			options = capable ? setOptions( type, page ) : setOptions( type, page, lasso_editor.author );
			jQuery.getJSON(WP_API_Settings.root+'wp/v2/'+type,options, function(data) {
				$( '#lasso--load-more' ).remove();
				if ( data.length > 0 ) {
					var setContainer = $( '<div data-page-num="' + page + '" class="lasso--object-batch" id="lasso--object-batch-' + page + '"></div>' );

					jQuery.each( data, function( i, val ) {
					   setContainer.append( postTemplate( { post: val, link_: val.link, settings: WP_API_Settings } ) );
					});
					// append to the post container
					$(postList).append( setContainer );

					//put back more button
					if (data.length>=7 ) {
						$(postList).append( moreButton );
						$( '#lasso--load-more' ).attr( 'data-post-type', type ).removeClass('lasso--btn-loading');
					}

					// show search filtering
					$('.lasso--post-filtering').removeClass('not-visible').addClass('visible');
					// re-init scroll
					initScroll()
				} else {
					$( postList ).append( noPostsMessage );
					setTimeout(function(){
						$('#lasso--end-posts').fadeOut('slow')
					}, 1000)
				}
				destroyLoader();
					
			})
			.fail(function(xhr, err)  {
				fetchError(xhr);
			});
		}
	}
	
	function dispPosts(data, type) {
		$( '#lasso--load-more' ).remove();
		if ( data.length > 0 ) {
						var setContainer = $( '<div data-page-num="' + page + '" class="lasso--object-batch" id="lasso--object-batch-' + page + '"></div>' );

						jQuery.each( data, function( i, val ) {
						   setContainer.append( postTemplate( { post: val, link_: val.link, settings: WP_API_Settings } ) );
						});
						// append to the post container
						$(postList).append( setContainer );

						//put back more button
						if (data.length>=7 ) {
							$(postList).append( moreButton );
							$( '#lasso--load-more' ).attr( 'data-post-type', type ).removeClass('lasso--btn-loading');
						}

						// show search filtering
						$('.lasso--post-filtering').removeClass('not-visible').addClass('visible');
						// re-init scroll
						initScroll()
		} else {
						//$( postList ).append( noPostsMessage );
						setTimeout(function(){
							$('#lafesso--end-posts').fadeOut('slow')
						}, 1000)
		}
		destroyLoader();
	}
	
	function getParams( draft, page, author ) {
		var params = '?page='+page;
	   if (author != -1) {
		   params += '&author[]='+author;
	   }
	   if (draft) {
		   params += '&status[]=draft';
	   }
	   return params;
    }

    /**
     * Helper function to reset options
     *
     * @param type post type
     * @param page page
     *
     * @returns {{data: {page: *, filter: {post_type: *, post_status: string[]}}}}
     */
    function setOptions( type, page, author ) {
	   if (!author) {
		   return {
                page: page,
                type: type,
				//status: 'draft',
				per_page: 7,
				//filter: {
					//post_status: ['publish','draft','pending'],
				//	posts_per_page: 7,
					//author: author
				//}
		   };
	   }
       return {
            page: page,
            type: type,
			author: author,
			//status: ['publish','draft','pending'],
			per_page: 7,
            /*filter: {
                post_status: ['publish','draft','pending'],
                posts_per_page: 7,
                author: author
            }*/
        }
    }
	
	function setOptionsPost( type, page, author ) {

       return options = {
            data: {
                page: page,
                type: type,
				author: author,
				status:['publish','draft','pending'],
				per_page: 7,
                filter: {
                    post_status: ['publish','draft','pending'],
                    posts_per_page: 7,
                    author: author
                }
            }
        }
    }

	//////////////////
	// OPEN INITIAL POSTS
	/////////////////
	$( postAll ).on('click',function(e){

		e.preventDefault();

		// add a body class
		body.toggleClass('lasso-modal-open');

		// append teh modal markup ( lasso_editor_component_modal() )
		body.append( lasso_editor.allPostModal );

		// get the intial posts
		fetchPosts('posts');

		modalResizer();

	});

    /**
     * Load more click event
     */
    $( body ).on('click', '#lasso--load-more', function(e){
        e.preventDefault();

        type = $( this ).attr( 'data-post-type' );

        $(this).addClass('lasso--btn-loading').text( loadingText );

        if (lastType == type) {
			page++;
		} else {
			page = 1;
		}

        lastType = type;

        fetchPosts( type );

    }).on('click','#lasso--close-modal-posts',function(e){
			e.preventDefault();
			destroyModal();

	}).on('click', '.lasso--show-objects', function(e){

		e.preventDefault();

		$('.lasso--show-objects').removeClass('active');
		$(this).addClass('active');

		$('#lasso--post-list').empty();
        type = $(this).data('post-type');
        page = 1;
        totalPages = null;
        $( '#lasso--load-more' ).attr( 'data-post-type', type);

		$(postList).prepend( loader );

		fetchPosts( type );

	}).on('click', '#lasso--post__delete', function(e){

		e.preventDefault();

		var $this = $(this);

		swal({
			title: lasso_editor.strings.deletePost,
			type: "error",
			text: false,
			showCancelButton: true,
			confirmButtonColor: "#d9534f",
			confirmButtonText: lasso_editor.strings.deleteYes,
			closeOnConfirm: true
		},
		function(){

			var data = {
				action: 		'editus_delete_post',
				postid: 		$this.closest('a').data('postid'),
				nonce: 			lasso_editor.deletePost
			}

			$.post( lasso_editor.ajaxurl2, data, function(response) {

				if ( "" == response ) {

					$this.closest('li').fadeOut().remove()

				}

			}).fail(function(xhr, err) { 
				var responseTitle= $(xhr.responseText).filter('title').get(0);
				alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
			});

		});

	}).on('keyup','#lasso--search-field',function( e ){ // live search - @since 0.9.5

		// clear the previous timer
		clearTimeout(timer)

		var key 		= e.which
		,	that        = this
		,	val 		= $.trim( $(this).val() )
		,	valEqual    = val == $(that).val()
		,	notEmpty    = '' !== val
		,	type        = $('.active.lasso--show-objects').data('post-type')
		,	url 		= api+'/'+type+'s?filter[s]='+val+'&filter[posts_per_page]=50'
		,	input       = '#lasso--search-field'
		,	results     = $('#lasso--results-found')
		,	helperText  = lasso_editor.strings.helperText
		,	helperSpan  = '<span id="lasso--helper">'+helperText+'</span>'

		// 800ms delay so we dont exectute excessively
		timer = setTimeout(function() {

			// don't proceed if the value is empty or not equal to itself
			if ( !valEqual && !notEmpty )
				return false;

			// what if the user only types two characters?
			if ( val.length == 2 && !$(helper).length ) {

				destroyClose()
				$(input).after( helperSpan )

			}

			// if we have more than 3 characters and if value is teh same
			if ( val.length >= 3 || val.length >= 3 && 13 == key ) {

				// append loading indicator
				$(postList).prepend( loader );

				// remove any helpers
				$( helper ).fadeOut().remove();

				// remove the cose
				destroyClose();
				
				
				//http://localhost/wordpress/wp-json/wp/v2/posts?search=test%205
				
				var page = 1;
				var capable = lasso_editor.edit_others_posts;
				
				
				if (type=='posts') {
					options = capable ? setOptionsPost( type, page ) : setOptionsPost( type, page, lasso_editor.author );
					options.data['search']=val;
					collection = new wp.api.collections.Posts( );
					collection.fetch(  options ).done( function() {
						
						$(postList).children().remove();
						//remove more button
						$( '#lasso--load-more,#lasso--close-modal-posts' ).remove();
						// if we have more posts then load them
						if ( collection.length > 0 ) {
							var setContainer = $( '<div data-page-num="' + collection.state.currentPage + '" class="lasso--object-batch" id="lasso--object-batch-' + page + '"></div>' );

							if (lasso_editor.restapi2) {
								collection.each( function ( model ) {
									//post.link title status id
								   setContainer.append( postTemplate( { post: model.attributes, link_: model.attributes._links.self[0].href, settings: WP_API_Settings } ) );
								} );
							} else {
								collection.each( function ( model ) {
								   setContainer.append( postTemplate( { post: model.attributes, settings: WP_API_Settings } ) );
								} );
							}

							// append to the post container
							$(postList).append( setContainer );

							//put back more button
							$(postList).append( moreButton );
							$(postList).append( closeButton );

							// show search filtering
							$('.lasso--post-filtering').removeClass('not-visible').addClass('visible')

							$( '#lasso--load-more' ).attr( 'data-post-type', type ).removeClass('lasso--btn-loading');
							// re-init scroll
							initScroll()
						}else{
							$( postList ).append( noPostsMessage );
							setTimeout(function(){
								$('#lasso--end-posts').fadeOut('slow')
							}, 1000)
						}
						// destroy the spinny loader
						destroyLoader();
					}).fail(function(xhr, err) {
						fetchError(xhr);
					});
				} else {
					options = capable ? setOptions( type, page ) : setOptions( type, page, lasso_editor.author );
					options['search']=val;
					jQuery.getJSON(WP_API_Settings.root+'wp/v2/'+type,options, function(data) {
						$( '#lasso--load-more' ).remove();
						$(postList).children().remove();
						if ( data.length > 0 ) {
							var setContainer = $( '<div data-page-num="' + page + '" class="lasso--object-batch" id="lasso--object-batch-' + page + '"></div>' );

							jQuery.each( data, function( i, val ) {
							   setContainer.append( postTemplate( { post: val, link_: val.link, settings: WP_API_Settings } ) );
							});
							// append to the post container
							$(postList).append( setContainer );

							//put back more button
							if (data.length>=7 ) {
								$(postList).append( moreButton );
								$( '#lasso--load-more' ).attr( 'data-post-type', type ).removeClass('lasso--btn-loading');
							}

							// show search filtering
							$('.lasso--post-filtering').removeClass('not-visible').addClass('visible');
							// re-init scroll
							initScroll()
						} else {
							$( postList ).append( noPostsMessage );
							setTimeout(function(){
								$('#lasso--end-posts').fadeOut('slow')
							}, 1000)
						}
						destroyLoader();
							
					})
					.fail(function(xhr, err)  {
						fetchError(xhr);
					});
				}
			}

		}, 600);

	}).on('click','#lasso--search__toggle', function( e ) { // open close search

		e.preventDefault()

		var input = $('#lasso--search-field')


		// toggle visible class
		$('.lasso--search').toggleClass( 'lasso--search__visible' )

		// focus on input
		input.focus()

		// if the search isnt visible and not empty then destroy the search
		if ( !$(this).parent().hasClass('lasso--search__visible') && input.val() !== '' ) {
			destroySearch('post')
		}

	}).on('click', clearItem, function(e){

		e.preventDefault();
		destroySearch('post');

	});

	/**
	* 	Utility function destroy search close
	*/
	function destroyClose(){

		$( clearItem ).remove();

	}

	/**
	*	Helper fucntion to destroy the search
	*	@param type string the type of post to fetch (post or page)
	*	@since 0.9.5
	*/
	function destroySearch( type ){

		// remove teh children
		$(postList).children().remove()

		// fetch initial posts
		fetchPosts( type )

		// clear previous seach term
		$( '#lasso--search-field' ).val('').focusout() // weird bug with focusout not wokring

		// hide searh results
		$('#lasso--results-found').parent().css('opacity',0)

		// remove helper if any
		$( helper ).remove();

		// remove close
		destroyClose()
	}
	
	jQuery(document).on('click', '#lasso--post-list', function(e){
			if (e.target.id === 'lasso--post-list') {
				// close modal if the user clicks on empty spaces
				// destroy posts modal
				$('#lasso--all-posts__modal').remove();
				$( '#lasso--modal__overlay' ).remove();
				$('body').remove('#lasso--modal__overlay');
			}
	});

})( jQuery, Backbone, _, WP_API_Settings );
(function( $ ) {

	$(document).ready(function(){

		destroyModal = function(){
			$('body').removeClass('lasso-modal-open');
			$('#lasso--tour__modal,#lasso--all-posts__modal,#lasso--modal__overlay').remove();
		}

		//$('#lasso--tour__modal input[type="submit"]').live('click', function(e) {
		jQuery(document).on('click', '#lasso--tour__modal input[type="submit"]', function(e){

			e.preventDefault();

			var target = $(this);

			if ( !$('#hide_tour').is(':checked') ) {

				destroyModal()

			} else {
				if (lasso_editor.saveusingrest) {
					var data = {
						action: 		'process_tour_hide',
						nonce: 			$(this).data('nonce')
					}

					$.post( lasso_editor.ajaxurl, data, function(response) {

						if ( true == response.success ) {

							destroyModal();

						}

					}).fail(function(xhr, err) { 
						var responseTitle= $(xhr.responseText).filter('title').get(0);
						alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
					});
				} else {
					var data = {
						action: 		'process_tour_hide',
						nonce: 			$(this).data('nonce')
					}

					$.post( lasso_editor.ajaxurl, data, function(response) {

						if ( true == response.success ) {

							destroyModal();

						}

					}).fail(function(xhr, err) { 
						var responseTitle= $(xhr.responseText).filter('title').get(0);
						alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
					});				
				}
			}

		});

	});

})( jQuery );

(function( $ ) {
	jQuery(document).ready(function($){
		if ( $( "#lasso--tour__slides" ).length ) {

			$('body').addClass('lasso-modal-open');

			$('.lasso--loading').remove();
			$('#lasso--tour__slides').hide().fadeIn()

			$('#lasso--tour__slides').unslider({
				dots: true,
				delay:7000
			});
		}
	});
})( jQuery );

(function( $ ) {

    $(document).ready(function(){

        var vars 		= lasso_editor
        ,	revisions
        , 	revision_id = 0
        , 	next
        , 	previous
       	, 	total

       	revisionList = $('#lasso--revision-list');

        // method to destroy the modal
        var destroyModal = function(){
            $('body').removeClass('lasso-modal-open');
            $('#lasso--revision__modal').remove();
            $('#lasso--post-revisions').show();
        };

        // destroy loader
		function destroyLoader(){
			$('#lasso--loading').remove();
		}

        //Update title/post content for a revision
        var restoreRevision = function( revision_id ) {

            if( revision_id in revisions ){
                revision = revisions[ revision_id ];
                $( vars.titleClass ).html( revision.post_title );
                $( vars.article_object ).html( revision.post_content );
                $('body').attr('data-revision', revision_id );

            }
        };
		

        // modal click
        $('#lasso--post-revisions').on('click',function(e){

            e.preventDefault();

            // preent double clicking and opening
            $(this).hide();

            // append revision modal
            $('body').append(vars.revisionModal);

            innerModal = $('#lasso--revision__modal .lasso--modal__inner');

            // make the modal draggable
            innerModal.draggable({ cursor:'move', opacity:0.8 });

            data = {
                action : 'process_revision_get',
                postid : vars.postid,
                nonce : vars.nonce
            };

            $.post( vars.ajaxurl, data, function(response) {

            	// do we have a response
                if ( true == response.success ) {

                	revisionList = $('#lasso--revision-list');
                	slider       = $('#lasso--slider');
                	lassoHide    = $('#lasso--hide');

                	// remove any count classes
                	removeRevisionCount();

                	// desroy the loader
                	destroyLoader();

                	// show the button and slider
                	lassoHide.show();

                	// if we have revisions
                    if ( 'object' == typeof response.data && response.data.length ) {

                        revisions = response.data;

                        var total = revisions.length == 1 ? 1 : revisions.length -1;

                        if ( revisions.length !== 1 ) {

	                        $.each( revisions, function( i, post )  {

	                            revisionList.append( '<li class="lasso--jump-revision" data-revision="'+i+'"><span class="lasso-util--help lasso-util--help-top" data-tooltip="'+post.modified_date+'">' + post.modified_time + '</span></li>' )

	                        });

							// init slider and restore on slide
						    slider.slider({
						      	min: 0,
						      	max: total,
						      	animate:'fast',
						      	value: 0,
						      	zindex:999,
							    slide: function( event, ui ) {
							        restoreRevision( ui.value )
							    }

						    });

						    // restore revision and sync slider on click
						    $('.lasso--jump-revision').on('click',function(e){

						    	e.preventDefault();

						    	var val = $(this).data('revision');

						    	slider.slider( 'value', val );

						    	restoreRevision( val );
						    })

						    revisionList.attr('data-count', total + 1 ) // because we start at 0

						} else {

                        	lassoHide.hide();
                        	innerModal.append( vars.noRevisionsDiv );
						}

					    $('body').addClass('lasso--revision-count-'+revisions.length );

					    maybeRestoreCurrent();

                        modalResizer();

                    }else{
                    	$('#lasso--hide').hide()
                       	innerModal.append( vars.noRevisionsDiv );
                       	modalResizer();
                    }

                } else {

                    alert('error');

                }


            }).fail(function(xhr, err) { 
				var responseTitle= $(xhr.responseText).filter('title').get(0);
				alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
			});

            modalResizer();

        });

		// select a revision and start editing
		$(document).on('click', '#lasso--select-revision', function(e){

			e.preventDefault();

			destroyModal();

			$('#lasso--edit').trigger('click');

			addBackupNotice();

		}).on('click','#lasso--close-modal',function(e){

			e.preventDefault();
			destroyModal();

		});

        /////////////////
        /// EXIT SETTINGS
        ///////////////////
        $(document).keyup(function(e) {

            if ( 27 == e.keyCode ) {

                destroyModal();
            }

        });

        // restore teh current revision but only if a user is editing one
        function maybeRestoreCurrent(){

        	if( $('body').data('revision') ) {

        		slider.slider('value', $('body').data('revision') )

        	}
        }

        // add a backup notice if we're editing a backukp
        function addBackupNotice(){

        	if ( !$('#lasso--notice').length ) {

				$(vars.article_object).before('<div id="lasso--notice" class="lasso--notice lasso--notice-warning">'+vars.strings.editingBackup+'</div>');
			}
        }

        // remove/reset revisino count
        function removeRevisionCount(){

	        $('body').removeClass (function (index, css) {
			    return (css.match (/(^|\s)lasso--revision-count-\S+/g) || []).join(' ');
			});
        }

    });

})( jQuery );
