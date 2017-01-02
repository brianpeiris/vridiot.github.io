! function(e) {
    function t(i) {
        if (n[i]) return n[i].exports;
        var a = n[i] = {
            exports: {},
            id: i,
            loaded: !1
        };
        return e[i].call(a.exports, a, a.exports, t), a.loaded = !0, a.exports
    }
    var n = {};
    return t.m = e, t.c = n, t.p = "", t(0)
}([function(e, t, n) {
    if ("undefined" == typeof AFRAME) throw new Error("Component attempted to register before AFRAME was available.");
    n(3), n(1), n(2), n(4), n(5), n(10), n(8), n(9), n(6), n(7), n(11)
}, function(e, t) {
    ! function() {
        function e(e, t) {
            e.userData.altspace = {
                collider: {
                    enabled: t
                }
            }, e.traverse(function(e) {
                e instanceof THREE.Mesh && (e.userData.altspace = {
                    collider: {
                        enabled: t
                    }
                })
            })
        }
        AFRAME.registerComponent("altspace-cursor-collider", {
            schema: {
                enabled: {
                    "default": !0
                }
            },
            init: function() {
                e(this.el.object3D, this.data.enabled), this.el.addEventListener("model-loaded", function() {
                    e(this.el.object3D, this.data.enabled)
                }.bind(this))
            },
            update: function() {
                e(this.el.object3D, this.data.enabled)
            }
        })
    }()
}, function(e, t) {
    AFRAME.registerComponent("altspace-tracked-controls", {
        init: function() {
            this.gamepadIndex = null, this.trackedControlsSystem = document.querySelector("a-scene").systems["tracked-controls"], this.systemGamepads = 0, altspace.getGamepads()
        },
        tick: function() {
            if (this.trackedControlsSystem && this.systemGamepads !== this.trackedControlsSystem.controllers.length && window.altspace && altspace.getGamepads && altspace.getGamepads().length) {
                var e = this.el.components;
                e["paint-controls"] && (this.gamepadIndex = "left" === e["paint-controls"].data.hand ? 2 : 1), null === this.gamepadIndex && e["hand-controls"] && (this.gamepadIndex = "left" === e["hand-controls"].data ? 2 : 1), null === this.gamepadIndex && e["vive-controls"] && (this.gamepadIndex = "left" === e["vive-controls"].data.hand ? 2 : 1), null === this.gamepadIndex && e["tracked-controls"] && (this.gamepadIndex = e["tracked-controls"].data.controller), this.el.setAttribute("tracked-controls", "id", altspace.getGamepads()[this.gamepadIndex].id), this.el.setAttribute("tracked-controls", "controller", 0), this.systemGamepads = this.trackedControlsSystem.controllers.length
            }
        }
    })
}, function(e, t) {
    AFRAME.registerComponent("altspace", {
        version: "1.3.0",
        schema: {
            usePixelScale: {
                type: "boolean",
                "default": "false"
            },
            verticalAlign: {
                type: "string",
                "default": "middle"
            },
            enclosuresOnly: {
                type: "boolean",
                "default": "true"
            },
            fullspace: {
                type: "boolean",
                "default": "false"
            }
        },
        init: function() {
            return this.el.object3D instanceof THREE.Scene ? void(window.altspace && window.altspace.inClient ? (this.el.setAttribute("vr-mode-ui", {
                enabled: !1
            }), this.initRenderer(), this.initCursorEvents(), this.initCollisionEvents()) : console.warn("aframe-altspace-component only works inside of AltspaceVR")) : void console.warn("aframe-altspace-component can only be attached to a-scene")
        },
        tick: function(e, t) {
            this.el.object3D.updateAllBehaviors && this.el.object3D.updateAllBehaviors()
        },
        remove: function() {},
        pause: function() {},
        play: function() {},
        initRenderer: function() {
            var e = this.el.object3D;
            altspace.getEnclosure().then(function(n) {
                switch (this.data.fullspace && (n.requestFullspace(), n.addEventListener("fullspacechange", function() {
                    e.scale.setScalar(n.pixelsPerMeter)
                })), this.data.usePixelScale && !this.data.fullspace || e.scale.setScalar(n.pixelsPerMeter), this.data.verticalAlign) {
                    case "bottom":
                        e.position.y -= n.innerHeight / 2;
                        break;
                    case "top":
                        e.position.y += n.innerHeight / 2;
                        break;
                    case "middle":
                        break;
                    default:
                        console.warn("Unexpected value for verticalAlign: ", this.data.verticalAlign)
                }
                this.data.enclosuresOnly && 1 === n.innerDepth && (this.el.renderer.render(new THREE.Scene), this.el.renderer = this.el.effect = t)
            }.bind(this));
            var t = this.el.renderer,
                n = this.el.renderer = this.el.effect = altspace.getThreeJSRenderer({
                    aframeComponentVersion: this.version
                }),
                i = function() {};
            n.setSize = i, n.setPixelRatio = i, n.setClearColor = i, n.clear = i, n.enableScissorTest = i, n.setScissor = i, n.setViewport = i, n.getPixelRatio = i, n.getMaxAnisotropy = i, n.setFaceCulling = i, n.context = {
                canvas: {}
            }, n.shadowMap = {}
        },
        initCursorEvents: function() {
            var e = this.el.object3D,
                t = document.querySelector("a-cursor") || document.querySelector("a-entity[cursor]");
            t && (t.setAttribute("material", "transparent", !0), t.setAttribute("material", "opacity", 0));
            var n = function(e, n) {
                    var i = n.target.el;
                    t && t.emit(e, {
                        target: i,
                        ray: n.ray,
                        point: n.point
                    }), i && i.emit(e, {
                        target: i,
                        ray: n.ray,
                        point: n.point
                    })
                },
                i = null;
            e.addEventListener("cursordown", function(e) {
                i = e.target, n("mousedown", e)
            }), e.addEventListener("cursorup", function(e) {
                n("mouseup", e), e.target.uuid === i.uuid && n("click", e), i = null
            }), e.addEventListener("cursorenter", function(e) {
                e.target.el && (e.target.el.addState("hovered"), t && t.addState("hovering"), n("mouseenter", e))
            }), e.addEventListener("cursorleave", function(e) {
                e.target.el && (e.target.el.removeState("hovered"), t && t.removeState("hovering"), n("mouseleave", e))
            })
        },
        initCollisionEvents: function() {
            var e = this.el.object3D,
                t = function(e, t) {
                    var n = t.target.el;
                    n && (t.target = n, t.other && t.other.el && (t.other = t.other.el), n.emit(e, t))
                };
            e.addEventListener("collisionenter", function(e) {
                t("collisionenter", e)
            }), e.addEventListener("collisionexit", function(e) {
                t("collisionexit", e)
            }), e.addEventListener("triggerenter", function(e) {
                t("triggerenter", e)
            }), e.addEventListener("triggerexit", function(e) {
                t("triggerexit", e)
            })
        }
    })
}, function(e, t) {
    ! function() {
        function e(e) {
            e.userData.altspace = e.userData.altspace || {}, e.userData.altspace.collider = e.userData.altspace.collider || {}, e.userData.altspace.collider.enabled = !1, altspace.addNativeComponent(e, this.name)
        }

        function t() {
            var t = this.el.getOrCreateObject3D("mesh", r);
            e.call(this, t), this.update(this.data)
        }

        function n() {
            var e = this.el.getObject3D("mesh");
            altspace.removeNativeComponent(e, this.name)
        }

        function i(e) {
            altspace.updateNativeComponent(this.el.object3DMap.mesh, this.name, this.data)
        }

        function a(e, t) {
            altspace.callNativeComponent(this.el.object3DMap.mesh, this.name, e, t)
        }
        var s = new THREE.BoxGeometry(.001, .001, .001),
            o = new THREE.MeshBasicMaterial({
                color: 0
            });
        o.visible = !1;
        var r = function() {
            THREE.Mesh.call(this, s, o)
        };
        r.prototype = Object.create(THREE.Mesh.prototype), r.prototype.constructor = THREE.PlaceholderMesh, AFRAME.registerComponent("n-object", {
            schema: {
                res: {
                    type: "string"
                }
            },
            init: t,
            update: i,
            remove: n
        }), AFRAME.registerComponent("n-spawner", {
            schema: {
                res: {
                    type: "string"
                }
            },
            init: t,
            update: i,
            remove: n
        }), AFRAME.registerComponent("n-text", {
            init: t,
            update: i,
            remove: n,
            schema: {
                text: {
                    "default": "",
                    type: "string"
                },
                fontSize: {
                    "default": "10",
                    type: "int"
                },
                width: {
                    "default": "10",
                    type: "number"
                },
                height: {
                    "default": "1",
                    type: "number"
                },
                horizontalAlign: {
                    "default": "middle"
                },
                verticalAlign: {
                    "default": "middle"
                }
            }
        }), AFRAME.registerComponent("n-sphere-collider", {
            init: t,
            remove: n,
            update: i,
            schema: {
                isTrigger: {
                    "default": !1,
                    type: "boolean"
                },
                center: {
                    type: "vec3"
                },
                radius: {
                    "default": "0",
                    type: "number"
                },
                type: {
                    "default": "object"
                }
            }
        }), AFRAME.registerComponent("n-box-collider", {
            init: t,
            remove: n,
            update: i,
            schema: {
                isTrigger: {
                    "default": !1,
                    type: "boolean"
                },
                center: {
                    type: "vec3"
                },
                size: {
                    type: "vec3"
                },
                type: {
                    "default": "object"
                }
            }
        }), AFRAME.registerComponent("n-capsule-collider", {
            init: t,
            remove: n,
            update: i,
            schema: {
                isTrigger: {
                    "default": !1,
                    type: "boolean"
                },
                center: {
                    type: "vec3"
                },
                radius: {
                    "default": "0",
                    type: "number"
                },
                height: {
                    "default": "0",
                    type: "number"
                },
                direction: {
                    "default": "y"
                },
                type: {
                    "default": "object"
                }
            }
        }), AFRAME.registerComponent("n-mesh-collider", {
            _forEachMesh: function(e) {
                var t = this.el.object3DMap.mesh;
                t && (t instanceof THREE.Mesh ? e(t) : t.traverse(function(t) {
                    t instanceof THREE.Mesh && e(t)
                    console.log(t);
                }.bind(this)))
            },
            _initObj: function() {
                this._forEachMesh(function(t) {
                    e.call(this, t), altspace.updateNativeComponent(t, this.name, this.data)
                }.bind(this))
            },
            init: function() {
                this.el.getOrCreateObject3D("mesh", r), this._initObj(), this.el.addEventListener("model-loaded", function() {
                    this._initObj()
                }.bind(this))
            },
            remove: function() {
                this._forEachMesh(function(e) {
                    altspace.removeNativeComponent(e, this.name)
                }.bind(this))
            },
            update: function(e) {
                this._forEachMesh(function(e) {
                    altspace.updateNativeComponent(e, this.name, this.data)
                }.bind(this))
            },
            schema: {
                isTrigger: {
                    "default": !1,
                    type: "boolean"
                },
                convex: {
                    "default": !0,
                    type: "boolean"
                },
                type: {
                    "default": "object"
                }
            }
        }), AFRAME.registerComponent("n-billboard", {
            init: t,
            remove: n
        }), AFRAME.registerComponent("n-container", {
            init: function() {
                t.call(this);
                var e = this.el,
                    n = this;
                e.addEventListener("stateadded", function(t) {
                    "container-full" === t.detail.state && e.emit("container-full"), "container-empty" === t.detail.state && e.emit("container-empty")
                }), e.addEventListener("container-count-changed", function(e) {
                    n.count = e.detail.count
                })
            },
            remove: n,
            update: i,
            schema: {
                capacity: {
                    "default": 4,
                    type: "number"
                }
            }
        }), AFRAME.registerComponent("n-sound", {
            init: function() {
                var e = this.data.src;
                if (e && !e.startsWith("http"))
                    if (e.startsWith("/")) this.data.src = location.origin + e;
                    else {
                        var n = location.pathname;
                        n.endsWith("/") || (n = location.pathname.split("/").slice(0, -1).join("/") + "/"), this.data.src = location.origin + n + e
                    }
                t.call(this)
            },
            pauseSound: function() {
                a.call(this, "pause"), this.el.emit("sound-paused")
            },
            playSound: function() {
                a.call(this, "play"), this.el.emit("sound-played")
            },
            seek: function(e) {
                a.call(this, "seek", {
                    time: e
                })
            },
            remove: function() {
                n.call(this), this.playHandler && this.el.removeEventListener(oldData.on, this.playHandler)
            },
            update: function(e) {
                i.call(this, e), this.playHandler && this.el.removeEventListener(e.on, this.playHandler), this.data.on && (this.playHandler = this.playSound.bind(this), this.el.addEventListener(this.data.on, this.playHandler))
            },
            schema: {
                on: {
                    type: "string"
                },
                res: {
                    type: "string"
                },
                src: {
                    type: "string"
                },
                loop: {
                    type: "boolean"
                },
                volume: {
                    type: "number",
                    "default": 1
                },
                autoplay: {
                    type: "boolean"
                },
                oneshot: {
                    type: "boolean"
                },
                spatialBlend: {
                    type: "float",
                    "default": 1
                },
                pitch: {
                    type: "float",
                    "default": 1
                },
                minDistance: {
                    type: "float",
                    "default": 1
                },
                maxDistance: {
                    type: "float",
                    "default": 12
                },
                rolloff: {
                    type: "string",
                    "default": "logarithmic"
                }
            }
        })
    }()
}, function(e, t) {}, function(e, t) {
    AFRAME.registerComponent("sync-color", {
        dependencies: ["sync"],
        schema: {},
        init: function() {
            function e() {
                var e = n.dataRef.child("material/color"),
                    i = !1,
                    a = !0;
                t.el.addEventListener("componentchanged", function(t) {
                    var a = t.detail.name,
                        s = t.detail.oldData,
                        o = t.detail.newData;
                    "material" === a && (i || s.color !== o.color && n.isMine && setTimeout(function() {
                        e.set(o.color)
                    }, 0))
                }), e.on("value", function(e) {
                    if (!n.isMine || a) {
                        var s = e.val();
                        i = !0, t.el.setAttribute("material", "color", s), i = !1, a = !1
                    }
                })
            }
            var t = this,
                n = t.el.components.sync;
            n.isConnected ? e() : t.el.addEventListener("connected", e)
        }
    })
}, function(e, t) {
    AFRAME.registerComponent("sync-n-sound", {
        dependencies: ["sync"],
        schema: {},
        init: function() {
            function e() {
                function e(e) {
                    if (n.isMine) {
                        var e = {
                            type: e.type,
                            sender: a.clientId,
                            el: t.el.id,
                            time: Date.now()
                        };
                        t.soundEventRef.set(e)
                    }
                }
                t.soundStateRef = n.dataRef.child("sound/state"), t.soundEventRef = n.dataRef.child("sound/event"), t.el.addEventListener("sound-played", e), t.el.addEventListener("sound-paused", e), t.soundEventRef.on("value", function(e) {
                    if (!n.isMine) {
                        var i = e.val();
                        if (i && i.el === t.el.id) {
                            var a = t.el.components["n-sound"];
                            "sound-played" === i.type ? a.playSound() : a.pauseSound()
                        }
                    }
                }), t.el.addEventListener("componentchanged", function(e) {
                    if (n.isMine) {
                        var i = e.detail.name;
                        "n-sound" === i && t.soundStateRef.set(e.detail.newData)
                    }
                }), t.soundStateRef.on("value", function(e) {
                    if (!n.isMine) {
                        var i = e.val();
                        i && t.el.setAttribute("n-sound", i)
                    }
                })
            }
            var t = this,
                n = t.el.components.sync,
                i = document.querySelector("a-scene"),
                a = i.systems["sync-system"];
            n.isConnected ? e() : t.el.addEventListener("connected", e)
        },
        remove: function() {
            this.soundStateRef.off("value"), this.soundEventRef.off("value")
        }
    })
}, function(e, t) {
    AFRAME.registerSystem("sync-system", {
        schema: {
            author: {
                type: "string",
                "default": null
            },
            app: {
                type: "string",
                "default": null
            },
            instance: {
                type: "string",
                "default": null
            },
            refUrl: {
                type: "string",
                "default": null
            }
        },
        init: function() {
            var e = this;
            return this.data && this.data.app ? (e.isConnected = !1, console.log(this.data), void altspace.utilities.sync.connect({
                authorId: this.data.author,
                appId: this.data.app,
                instanceId: this.data.instance,
                baseRefUrl: this.data.refUrl
            }).then(function(t) {
                this.connection = t, this.sceneRef = this.connection.instance.child("scene"), this.clientsRef = this.connection.instance.child("clients"), this.clientId = this.sceneEl.object3D.uuid;
                var n;
                this.clientsRef.on("value", function(e) {
                    var t = e.val(),
                        i = Object.keys(t)[0];
                    n = t[i]
                }), this.clientsRef.on("child_added", function(t) {
                    var n = t.val();
                    setTimeout(function() {
                        e.sceneEl.emit("clientjoined", {
                            id: n
                        }, !1)
                    }, 0)
                }), this.clientsRef.on("child_removed", function(t) {
                    var n = t.val();
                    setTimeout(function() {
                        e.sceneEl.emit("clientleft", {
                            id: n
                        }, !1)
                    }, 0)
                }), this.clientsRef.push(this.clientId).onDisconnect().remove(), this.connection.instance.child("initialized").once("value", function(t) {
                    var n = !t.val();
                    t.ref().set(!0), e.sceneEl.emit("connected", {
                        shouldInitialize: n
                    }, !1), e.isConnected = !0
                }.bind(this)), Object.defineProperty(this, "isMasterClient", {
                    get: function() {
                        return n === this.clientId
                    }.bind(this)
                })
            }.bind(this))) : void console.warn("The sync-system must be present on the scene and configured with required data.")
        }
    })
}, function(e, t) {
    AFRAME.registerComponent("sync-transform", {
        dependencies: ["sync"],
        schema: {},
        init: function() {
            function e() {
                function e(e, i) {
                    if (!n.isMine) {
                        var a = e.val();
                        a && t.el.setAttribute(i, a)
                    }
                }

                function i(e) {
                    if (n.isMine) {
                        var t = e.detail.name,
                            i = e.detail.newData;
                        if ("position" === t) c(i);
                        else if ("rotation" === t) d(i);
                        else {
                            if ("scale" !== t) return;
                            u(i)
                        }
                    }
                }

                function a(e, t, n) {
                    var i, a, s, o, r = 0;
                    n || (n = {});
                    var l = function() {
                            r = n.leading === !1 ? 0 : Date.now(), i = null, o = e.apply(a, s), i || (a = s = null)
                        },
                        c = function() {
                            var c = Date.now();
                            r || n.leading !== !1 || (r = c);
                            var d = t - (c - r);
                            return a = this, s = arguments, d <= 0 || d > t ? (i && (clearTimeout(i), i = null), r = c, o = e.apply(a, s), i || (a = s = null)) : i || n.trailing === !1 || (i = setTimeout(l, d)), o
                        };
                    return c.cancel = function() {
                        clearTimeout(i), r = 0, i = a = s = null
                    }, c
                }
                var s = n.dataRef.child("position"),
                    o = n.dataRef.child("rotation"),
                    r = n.dataRef.child("scale");
                t.updateRate = 100;
                var l = [];
                t.el.addEventListener("ownershiplost", function() {
                    for (var e = t.el.children, n = 0; n < e.length; n++) {
                        var i = e[n].tagName.toLowerCase();
                        "a-animation" === i && (l.push(e[n]), e[n].stop())
                    }
                }), t.el.addEventListener("ownershipgained", function() {
                    for (var e = 0; e < l.length; e++) {
                        var t = l[e];
                        t.start()
                    }
                    l = []
                }), s.on("value", function(t) {
                    e(t, "position")
                }), o.on("value", function(t) {
                    e(t, "rotation")
                }), r.on("value", function(t) {
                    e(t, "scale")
                });
                var c = a(function(e) {
                        s.set(e)
                    }, t.updateRate),
                    d = a(function(e) {
                        o.set(e)
                    }, t.updateRate),
                    u = a(function(e) {
                        r.set(e)
                    }, t.updateRate);
                t.el.addEventListener("componentchanged", i)
            }
            var t = this,
                n = t.el.components.sync;
            n.isConnected ? e() : t.el.addEventListener("connected", e)
        }
    })
}, function(e, t) {
    AFRAME.registerComponent("sync", {
        schema: {
            mode: {
                "default": "link"
            },
            ownOn: {
                type: "string"
            }
        },
        init: function() {
            function e() {
                if (l.addEventListener("clientleft", function(e) {
                        var t = (!r || r === e.detail.id) && c.isMasterClient;
                        t && u.takeOwnership()
                    }), "link" !== u.data.mode) return void console.error("Unsupported sync mode: " + u.data.mode);
                var e = u.el.id;
                return e ? (console.log("syncSys: " + c), console.log("syncSys.sceneRef: " + c.sceneRef), t(c.sceneRef.child(e)), n(), u.isConnected = !0, void u.el.emit("connected", null, !1)) : void console.error("Entities cannot be synced using link mode without an id.")
            }

            function t(e) {
                i = e, a = i.key(), s = i.child("data"), u.dataRef = s, o = i.child("owner")
            }

            function n() {
                o.transaction(function(e) {
                    if (!e) return o.onDisconnect().set(null), c.clientId
                }), o.on("value", function(e) {
                    var t = e.val(),
                        n = t === c.clientId && !d;
                    n && u.el.emit("ownershipgained", null, !1);
                    var i = t !== c.clientId && d;
                    i && (u.el.emit("ownershiplost", null, !1), o.onDisconnect().cancel()), r = t, d = t === c.clientId
                })
            }
            var i, a, s, o, r, l = document.querySelector("a-scene"),
                c = l.systems["sync-system"],
                d = !1,
                u = this;
            if (u.isConnected = !1, c.isConnected ? e() : l.addEventListener("connected", e), u.data.ownOn)
                for (var h = u.data.ownOn.split(/[ ,]+/), p = 0, f = h.length; p < f; p++) u.el.addEventListener(h[p], function() {
                    u.isConnected && u.takeOwnership()
                });
            u.takeOwnership = function() {
                o.set(c.clientId), o.onDisconnect().set(null)
            }, Object.defineProperty(u, "isMine", {
                get: function() {
                    return d
                }
            })
        }
    })
}, function(e, t) {
    AFRAME.registerComponent("wire", {
        multiple: !0,
        schema: {
            on: {
                type: "string"
            },
            emit: {
                type: "string"
            },
            gained: {
                type: "string"
            },
            lost: {
                type: "string"
            },
            gain: {
                type: "string"
            },
            lose: {
                type: "string"
            },
            targets: {
                type: "selectorAll"
            },
            target: {
                type: "selector"
            }
        },
        update: function(e) {
            e.on && this.el.removeEventListener(e.on, this.actOnTargets), e.gained && this.el.removeEventListener("stateadded", this.actOnTargetsIfStateMatches), e.lost && this.el.removeEventListener("stateremoved", this.actOnTargetsIfStateMatches), this.actOnTargets = function() {
                function e(e) {
                    this.data.emit && e.emit(this.data.emit), this.data.gain && e.addState(this.data.gain), this.data.lose && e.removeState(this.data.lose)
                }
                this.data.targets.forEach(e.bind(this)), this.data.target && e.call(this, this.data.target)
            }.bind(this), this.actOnTargetsIfStateMatches = function(e) {
                var t = e.detail.state;
                t !== this.data.gained && t !== this.data.lost || this.actOnTargets()
            }.bind(this), this.data.on && this.el.addEventListener(this.data.on, this.actOnTargets), this.data.gained && this.el.addEventListener("stateadded", this.actOnTargetsIfStateMatches), this.data.lost && this.el.addEventListener("stateremoved", this.actOnTargetsIfStateMatches)
        },
        remove: function() {
            this.el.removeEventListener(this.data.on, this.actOnTargets), this.el.removeEventListener("stateadded", this.actOnTargetsIfStateMatches), this.el.removeEventListener("stateremoved", this.actOnTargetsIfStateMatches)
        }
    })
}]);