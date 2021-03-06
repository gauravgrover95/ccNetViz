/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/layout/force.worker.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/layout/force.worker.js":
/*!************************************!*\
  !*** ./src/layout/force.worker.js ***!
  \************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _quadTree__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../quadTree */ "./src/quadTree.js");
/* harmony import */ var _quadTree__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_quadTree__WEBPACK_IMPORTED_MODULE_0__);

/**
 *  Copyright (c) 2016, Helikar Lab.
 *  All rights reserved.
 *
 *  This source code is licensed under the GPLv3 License.
 *  Author: David Tichy
 */
 
function Force(nodes, edges, options = {}) {
    const edgeDistance = 15,
        edgeStrength = 1,
        friction = 0.9,
        charge = -30,
        gravity = 0.4,
        theta2 = .64,
        size = [1,1],
        chargeDistance2 = Infinity;

    let   alpha,
          distances = [],
          strengths = [],
          charges = [];


    function accumulate(quad, alpha, charges) {
        let cx = 0, cy = 0;
        quad.charge = 0;
        if (!quad.leaf) {
            let nodes = quad.nodes;
            let c, n = nodes.length;

            for (let i = 0; i < n; i++) {
                c = nodes[i];
                if (c == null) continue;
                accumulate(c, alpha, charges);
                quad.charge += c.charge;
                cx += c.charge * c.cx;
                cy += c.charge * c.cy;
            }
        }
        if (quad.point) {
            if (!quad.leaf) {
                quad.point.x += Math.random() - 0.5;
                quad.point.y += Math.random() - 0.5;
            }
            let k = alpha * charges[quad.point.index];
            quad.charge += quad.pointCharge = k;
            cx += k * quad.point.x;
            cy += k * quad.point.y;
        }
        quad.cx = cx / quad.charge;
        quad.cy = cy / quad.charge;
    }

    function repulse(node) {
        return function(quad, x1, _, x2) {
            if (quad.point !== node) {
                let dx = quad.cx - node.x;
                let dy = quad.cy - node.y;
                let dw = x2 - x1;
                let dn = dx * dx + dy * dy;

                if (dw * dw / theta2 < dn) {
                    if (dn < chargeDistance2) {
                        let k = quad.charge / dn;
                        node.px -= dx * k;
                        node.py -= dy * k;
                    }
                    return true;
                }

                if (quad.point && dn && dn < chargeDistance2) {
                    let k = quad.pointCharge / dn;
                    node.px -= dx * k;
                    node.py -= dy * k;
                }
            }
            return !quad.charge;
        };
    }

    function step() {
        if ((alpha *= .99) < .05) {
            alpha = 0;
            return true;
        }

        let q, o, s, t, l, k, x, y;
        let n = nodes.length;
        let m = edges.length;

        for (let i = 0; i < m; i++) {
            o = edges[i];
            s = o.source;
            t = o.target;
            x = t.x - s.x;
            y = t.y - s.y;
            if (l = (x * x + y * y)) {
                l = alpha * strengths[i] * ((l = Math.sqrt(l)) - distances[i]) / l;
                x *= l;
                y *= l;
                t.x -= x * (k = s.weight / (t.weight + s.weight));
                t.y -= y * k;
                s.x += x * (k = 1 - k);
                s.y += y * k;
            }
        }

        if (k = alpha * gravity) {
            x = size[0] / 2;
            y = size[1] / 2;

            for (let i = 0; i < n; i++) {
                o = nodes[i];
                o.x += (x - o.x) * k;
                o.y += (y - o.y) * k;
            }
        }

        if (charge) {
            accumulate(q = _quadTree__WEBPACK_IMPORTED_MODULE_0___default()(nodes), alpha, charges);

            for (let i = 0; i < n; i++) {
                let o = nodes[i];
                !o.fixed && q.visit(repulse(o));
            }
        }

        const rnd = (min,max) => Math.random() * (max-min) + min;
        for (let i = 0; i < n; i++) {
            o = nodes[i];
            if (o.fixed || o.fixed2) {
                o.x = o.px;
                o.y = o.py;
            }
            else {
                o.x -= (o.px - (o.px = o.x)) * friction;
                o.y -= (o.py - (o.py = o.y)) * friction;

                if(options && options.minX !== undefined){
                    if(o.x < options.minX || o.x > options.maxX){
                        o.x = rnd(options.minX, options.maxX);
                    }
                    if(o.y < options.minY || o.y > options.maxY){
                        o.y = rnd(options.minY, options.maxY);
                    }
                }
            }
        }
    };

    this.apply = function() {
        let n = nodes.length;
        let d = Math.sqrt(n);
        let s = 0.3 / d;

        for (let i = 0; i < n; i++) {
            let o = nodes[i];
            o.weight = 0;
            o.x = o.x !== undefined ? o.x : s + (i % d) / d;
            o.y = o.y !== undefined ? o.y : s + Math.floor(i / d) / d;
            o.px = o.x;
            o.py = o.y;
            charges[i] = charge;
        }

        for (let i = 0; i < edges.length; i++) {
            let o = edges[i];
            o.source.weight++;
            o.target.weight++;
            distances[i] = edgeDistance;
            strengths[i] = edgeStrength;
        }

        alpha = 0.1;
        while (!step());

        return true;
    };
};

self.addEventListener('message', function (e) {
    var nodes = e.data.nodes;
    var edges = e.data.edges;
    var layout_options = e.data.layout_options;
    new Force(nodes, edges, layout_options).apply();
    self.postMessage({nodes, edges});
}, false);

/***/ }),

/***/ "./src/quadTree.js":
/*!*************************!*\
  !*** ./src/quadTree.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (points) {
    var d = void 0,
        xs = void 0,
        ys = void 0,
        i = void 0,
        n = void 0,
        x1_ = void 0,
        y1_ = void 0,
        x2_ = void 0,
        y2_ = void 0;

    x2_ = y2_ = -(x1_ = y1_ = Infinity);
    xs = [], ys = [];
    n = points.length;

    for (i = 0; i < n; ++i) {
        d = points[i];
        if (d.x < x1_) x1_ = d.x;
        if (d.y < y1_) y1_ = d.y;
        if (d.x > x2_) x2_ = d.x;
        if (d.y > y2_) y2_ = d.y;
        xs.push(d.x);
        ys.push(d.y);
    }

    var dx = x2_ - x1_;
    var dy = y2_ - y1_;
    dx > dy ? y2_ = y1_ + dx : x2_ = x1_ + dy;

    function create() {
        return {
            leaf: true,
            nodes: [],
            point: null,
            x: null,
            y: null
        };
    }

    function visit(f, node, x1, y1, x2, y2) {
        if (!f(node, x1, y1, x2, y2)) {
            var sx = (x1 + x2) * 0.5;
            var sy = (y1 + y2) * 0.5;
            var children = node.nodes;

            if (children[0]) visit(f, children[0], x1, y1, sx, sy);
            if (children[1]) visit(f, children[1], sx, y1, x2, sy);
            if (children[2]) visit(f, children[2], x1, sy, sx, y2);
            if (children[3]) visit(f, children[3], sx, sy, x2, y2);
        }
    }

    function insert(n, d, x, y, x1, y1, x2, y2) {
        if (n.leaf) {
            var nx = n.x;
            var ny = n.y;

            if (nx !== null) {
                if (nx === x && ny === y) {
                    insertChild(n, d, x, y, x1, y1, x2, y2);
                } else {
                    var nPoint = n.point;
                    n.x = n.y = n.point = null;
                    insertChild(n, nPoint, nx, ny, x1, y1, x2, y2);
                    insertChild(n, d, x, y, x1, y1, x2, y2);
                }
            } else {
                n.x = x, n.y = y, n.point = d;
            }
        } else {
            insertChild(n, d, x, y, x1, y1, x2, y2);
        }
    }

    function insertChild(n, d, x, y, x1, y1, x2, y2) {
        var xm = (x1 + x2) * 0.5;
        var ym = (y1 + y2) * 0.5;
        var right = x >= xm;
        var below = y >= ym;
        var i = below << 1 | right;

        n.leaf = false;
        n = n.nodes[i] || (n.nodes[i] = create());

        right ? x1 = xm : x2 = xm;
        below ? y1 = ym : y2 = ym;
        insert(n, d, x, y, x1, y1, x2, y2);
    }

    function findNode(root, x, y, x0, y0, x3, y3) {
        var minDistance2 = Infinity;
        var closestPoint = void 0;

        (function find(node, x1, y1, x2, y2) {
            if (x1 > x3 || y1 > y3 || x2 < x0 || y2 < y0) return;

            if (point = node.point) {
                var _point = void 0;
                var _dx = x - node.x;
                var _dy = y - node.y;
                var distance2 = _dx * _dx + _dy * _dy;

                if (distance2 < minDistance2) {
                    var distance = Math.sqrt(minDistance2 = distance2);
                    x0 = x - distance, y0 = y - distance;
                    x3 = x + distance, y3 = y + distance;
                    closestPoint = _point;
                }
            }

            var children = node.nodes;
            var xm = (x1 + x2) * .5;
            var ym = (y1 + y2) * .5;
            var right = x >= xm;
            var below = y >= ym;

            for (var _i = below << 1 | right, j = _i + 4; _i < j; ++_i) {
                if (node = children[_i & 3]) switch (_i & 3) {
                    case 0:
                        find(node, x1, y1, xm, ym);break;
                    case 1:
                        find(node, xm, y1, x2, ym);break;
                    case 2:
                        find(node, x1, ym, xm, y2);break;
                    case 3:
                        find(node, xm, ym, x2, y2);break;
                }
            }
        })(root, x0, y0, x3, y3);

        return closestPoint;
    }

    var root = create();
    root.visit = function (f) {
        return visit(f, root, x1_, y1_, x2_, y2_);
    };
    root.find = function (x, y) {
        return findNode(root, x, y, x1_, y1_, x2_, y2_);
    };

    for (i = 0; i < n; i++) {
        insert(root, points[i], xs[i], ys[i], x1_, y1_, x2_, y2_);
    }--i;

    xs = ys = points = d = null;

    return root;
};

; /**
   *  Copyright (c) 2016, Helikar Lab.
   *  All rights reserved.
   *
   *  This source code is licensed under the GPLv3 License.
   *  Author: David Tichy
   */

/***/ })

/******/ });
//# sourceMappingURL=b2e2651ee4edcc7894c2.worker.js.map