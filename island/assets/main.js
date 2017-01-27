document.addEventListener('DOMContentLoaded', function() {
     //var socket = io.connect('http://hah.jacobralph.org:25543/');
     //Pretty text from HaH (https://github.com/AltspaceVR/HaH)
     var fontScale;
     if (mobile) {
         fontScale = 0.85;
     } else {
         fontScale = 1.0;
     }

     function makeSafeFont(g, text, maxWidth) {
         // get pixel width of longest line
         var textWidth = Math.max.apply(null, text.map(function(s) {
             return g.measureText(s).width;
         }));
         // if longest line is longer than specified max width
         if (textWidth > maxWidth) {
             // scale down font to bring width down to maxWidth
             var font = g.font;
             var fontSize = /[0-9.]+px/.exec(font)[0];
             var fontSizeValue = parseFloat(fontSize);
             fontSizeValue = (maxWidth / textWidth) * fontSizeValue;
             font = font.replace(fontSize, fontSizeValue + 'px');

             g.font = font;
         }
     }

     function generateTextMaterial(text, options) {
         var texWidth = options.width || 256;
         var fontStack = '"Palatino Linotype", "Book Antiqua", Palatino, serif';

         // set up canvas
         var bmp = document.createElement('canvas');
         var ctx = bmp.getContext('2d');
         bmp.width = texWidth;
         bmp.height = options.height || texWidth;

         ctx.fillStyle = options.backgroundColor;
         ctx.fillRect(0, 0, texWidth, options.height || texWidth);

         // TODO: We can simplify this code if the nameplates had a sane UV mapping
         ctx.font = '' + ((options.fontScale || 0.1) * bmp.height * fontScale) + 'px ' + fontStack;
         makeSafeFont(ctx, [text], 0.9 * texWidth * fontScale);
         ctx.textAlign = 'center';
         if (options.textBaseline) {
             ctx.textBaseline = options.textBaseline;
         }
         if (options.fillStyle) {
             ctx.fillStyle = options.fillStyle;
         } else {
             ctx.fillStyle = 'black';
         }
         if (options.single) {
             ctx.lineWidth = 5;
             ctx.strokeText(text, texWidth / 2, bmp.height / 2);
             ctx.fillText(text, texWidth / 2, bmp.height / 2);
         } else {
             ctx.fillText(text, texWidth / 2, 35);
             ctx.fillText(text, texWidth / 2, 86);
         }

         return new THREE.MeshBasicMaterial({
             map: new THREE.CanvasTexture(bmp)
         });
     }

     function generateColorTextMaterial(text, w, h) {
         var statusMat = generateTextMaterial(text, {
             backgroundColor: 'transparent',
             height: 50 * h,
             width: 256 * w,
             single: true,
             fontScale: fontScale,
             textBaseline: 'middle',
             fillStyle: 'white'
         });
         statusMat.transparent = true;
         statusMat.side = THREE.DoubleSide;
         return statusMat;
     }

     var sim = altspace.utilities.Simulation();
     var geometry = new THREE.SphereGeometry(1.6, 32, 32);
     var material = new THREE.MeshBasicMaterial({
         color: 0x0077be
     });
     material.side = THREE.DoubleSide;
     var sphere = new THREE.Mesh(geometry, material);
     sphere.position.y = 2.7;
     sim.scene.add(sphere);
     var material1 = generateColorTextMaterial("Hey there! Loading: 0%", 4, 4);
     var plane = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.3), material1);
     plane.overdraw = true;
     plane.material.side = THREE.DoubleSide;
     plane.position.y = 2.7;
     plane.position.z = -0.7;
     sim.scene.add(plane);

     THREE.DefaultLoadingManager.onProgress = function(item, loaded, total) {
         if (total > 15) {
             var percent = loaded / total;
             if (percent == 1) {
                 var material_new = generateColorTextMaterial("Hey there! Loading: 60%", 4, 4);
                 plane.material = material_new;
                 plane.needsUpdate = true;
                 setTimeout(function(e) {
                     var material_new = generateColorTextMaterial("Hey there! Loading: 80%", 4, 4);
                     plane.material = material_new;
                     plane.needsUpdate = true;
                 }, 4000);
                 setTimeout(function(e) {
                     sim.scene.remove(sphere);
                     sim.scene.remove(plane);
                 }, 8000);
             } else {
                 var material_new = generateColorTextMaterial("Hey there! Loading: " + Math.round(percent * 0.5) + "%", 4, 4);
                 plane.material = material_new;
                 plane.needsUpdate = true;
             }
         }
     };

     setTimeout(function(e) {
         sim.scene.remove(sphere);
         sim.scene.remove(plane);
     }, 60000);

     /*var loader = new THREE.GLTFLoader;
     var url = './assets/' + agent + '/' + timeOfDay + '/island.gltf';
     loader.load( url, function(data) {
         var island = data.scene.children[0];
         sim.scene.add(island);
         console.log(island);
     });*/

     var mesh = document.querySelector('#cl-a');

     mesh.addEventListener('model-loaded', function() {
         setTimeout(function(e) {
             var meshy = document.querySelector('#cl-a');
             var object = meshy.object3D;
             var collider_mesh = object.children[0].children[0].children[0];
             collider_mesh.material.visible = false;
             collider_mesh.material.needsUpdate = true;
         }, 500);
     });

     var island = document.querySelector('#sco-a');

     island.addEventListener('model-loaded', function() {
         for (var i = 0; i < this.object3D.children[0].children.length; i++) {
             var meshy = this.object3D.children[0].children[i];
             if (meshy.name.indexOf("TSO_Circle") !== -1) {
                 var top = meshy.children[0];
                 top.material.transparent = true;
                 top.material.side = THREE.DoubleSide;
             } else if (meshy.name.indexOf("TSO_") !== -1) {
                 meshy.children[0].material.transparent = true;
                 meshy.children[0].material.side = THREE.DoubleSide;
             }
         }
     });

     var paused = false;
     document.querySelector('#radio-a').addEventListener('click', function() {
         var playing = document.querySelector('#song');
         if (paused) {
             var sync = document.querySelector('#songSync');
             var songLength = getTimeForColor(sync.getAttribute('material').color);
             var currentTimeFromEnd = (sync.getAttribute('scale').x * 1000000000) - (Date.now() / 1000);
             var difference = songLength - currentTimeFromEnd;
             playing.components['n-sound'].playSound();
             playing.components['n-sound'].seek(difference);
             paused = false;
         } else {
             playing.components['n-sound'].pauseSound();
             paused = true;
         }
     });

     function shuffle(array) {
         var currentIndex = array.length,
             temporaryValue, randomIndex;

         // While there remain elements to shuffle...
         while (0 !== currentIndex) {

             // Pick a remaining element...
             randomIndex = Math.floor(Math.random() * currentIndex);
             currentIndex -= 1;

             // And swap it with the current element.
             temporaryValue = array[currentIndex];
             array[currentIndex] = array[randomIndex];
             array[randomIndex] = temporaryValue;
         }

         return array;
     }

     var songs = [{
             color: "#4e8c23",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/coconut",
             length: 230
         },
         {
             color: "#420666",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/nobody",
             length: 222
         },
         {
             color: "#e29d9d",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/pina",
             length: 276
         },
         {
             color: "#c3f4e5",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/pocket",
             length: 232
         },
         {
             color: "#998b7d",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/riptide",
             length: 203
         },
         {
             color: "#439639",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/river",
             length: 228
         },
         {
             color: "#ff6f1d",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/stolen",
             length: 313
         },
         {
             color: "#ff6f12",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/youth",
             length: 211
         },
         {
             color: "#ff6f13",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/wicked",
             length: 197
         },
         {
             color: "#ff6f14",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/rub",
             length: 195
         },
         {
             color: "#ff6f15",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/love",
             length: 230
         },
         {
             color: "#ff6f16",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/crazy",
             length: 197
         },
         {
             color: "#ff6f17",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/clearly",
             length: 197
         },
         {
             color: "#ff6f18",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/herbs",
             length: 198
         },
         {
             color: "#ff6f19",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/warriors",
             length: 247
         },
         {
             color: "#ff6f20",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/upsetters",
             length: 198
         },
         {
             color: "#ff6f21",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/johnny",
             length: 224
         },
         {
             color: "#ff6f23",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/bad",
             length: 249
         },
         {
             color: "#ff6f24",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/island",
             length: 223
         },
         {
             color: "#ff6f26",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/boys",
             length: 216
         },
         {
             color: "#ff6f27",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/tropical",
             length: 138
         },
         {
             color: "#ff6f32",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/96",
             length: 255
         },
         {
             color: "#ff6f33",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/you",
             length: 242
         },
         {
             color: "#ff6f34",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/funky",
             length: 207
         },
         {
             color: "#ff6f35",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/better",
             length: 260
         },
         {
             color: "#ff6f36",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/bubble",
             length: 275
         },
         {
             color: "#ff6f38",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/beach",
             length: 197
         },
         {
             color: "#ff6f40",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/santeria",
             length: 183
         },
         {
             color: "#ff6f41",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/got",
             length: 172
         },
         {
             color: "#ff6f42",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/wrong",
             length: 136
         },
         {
             color: "#df6f11",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/s1",
             length: 299
         },
         {
             color: "#df6f12",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/s2",
             length: 287
         },
         {
             color: "#df6f13",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/s3",
             length: 258
         },
         {
             color: "#df6f14",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/like",
             length: 274
         },
         {
             color: "#df6f15",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/custom",
             length: 273
         },
         {
             color: "#df6f16",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/dramamine",
             length: 353
         },
         {
             color: "#df6f17",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/hear",
             length: 283
         },
         {
             color: "#df6f18",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/tetons",
             length: 320
         },
         {
             color: "#df6f19",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/new",
             length: 236
         },
         {
             color: "#df6f20",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/vampire",
             length: 140
         },
         {
             color: "#df6f21",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/weezer",
             length: 258
         },
         {
             color: "#df6f21",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/weezer",
             length: 258
         },
         {
             color: "#df6f22",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/311",
             length: 177
         },
         {
             color: "#df6f23",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/cage",
             length: 209
         },
         {
             color: "#df6f24",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/left",
             length: 169
         },
         {
             color: "#df6f25",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/aria",
             length: 208
         },
         {
             color: "#df6f26",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/moog",
             length: 159
         },
         {
             color: "#df6f27",
             url: "http://island.jacobralph.org/assets/playlist/afternoon/living",
             length: 177
         }
     ];
     if (timeOfDay == "night") {
         songs = [{
                 color: "#004010",
                 url: "http://island.jacobralph.org/assets/playlist/evening/waves",
                 length: 232
             },
             {
                 color: "#005e00",
                 url: "http://island.jacobralph.org/assets/playlist/evening/black",
                 length: 216
             },
             {
                 color: "#005e02",
                 url: "http://island.jacobralph.org/assets/playlist/evening/wise",
                 length: 253
             },
             {
                 color: "#ff6f11",
                 url: "http://island.jacobralph.org/assets/playlist/evening/salm-a",
                 length: 304
             },
             {
                 color: "#ff6f28",
                 url: "http://island.jacobralph.org/assets/playlist/evening/crystal",
                 length: 258
             },
             {
                 color: "#ff6f29",
                 url: "http://island.jacobralph.org/assets/playlist/evening/dr",
                 length: 161
             },
             {
                 color: "#ff6f30",
                 url: "http://island.jacobralph.org/assets/playlist/evening/gin",
                 length: 211
             },
             {
                 color: "#ff6f31",
                 url: "http://island.jacobralph.org/assets/playlist/evening/jammin",
                 length: 199
             },
             {
                 color: "#ff6f39",
                 url: "http://island.jacobralph.org/assets/playlist/evening/loverman",
                 length: 202
             },
             {
                 color: "#ff6f43",
                 url: "http://island.jacobralph.org/assets/playlist/evening/gstring",
                 length: 265
             },
             {
                 color: "#ff6f44",
                 url: "http://island.jacobralph.org/assets/playlist/evening/bad",
                 length: 249
             },
             {
                 color: "#ff6f45",
                 url: "http://island.jacobralph.org/assets/playlist/afternoon/santeria",
                 length: 183
             },
             {
                 color: "#ff6f46",
                 url: "http://island.jacobralph.org/assets/playlist/evening/saturday",
                 length: 180
             },
             {
                 color: "#ff6f47",
                 url: "http://island.jacobralph.org/assets/playlist/evening/blackmill",
                 length: 227
             },
             {
                 color: "#ff6f48",
                 url: "http://island.jacobralph.org/assets/playlist/evening/drive",
                 length: 351
             },
             {
                 color: "#ff6f49",
                 url: "http://island.jacobralph.org/assets/playlist/evening/around",
                 length: 429
             },
             {
                 color: "#ff6f50",
                 url: "http://island.jacobralph.org/assets/playlist/evening/dollaz",
                 length: 352
             },
             {
                 color: "#ff6f51",
                 url: "http://island.jacobralph.org/assets/playlist/evening/lucky",
                 length: 247
             },
             {
                 color: "#ff6f52",
                 url: "http://island.jacobralph.org/assets/playlist/evening/ghosts",
                 length: 370
             },
             {
                 color: "#ff6f53",
                 url: "http://island.jacobralph.org/assets/playlist/evening/some",
                 length: 255
             },
             {
                 color: "#ff6f54",
                 url: "http://island.jacobralph.org/assets/playlist/evening/flux",
                 length: 205
             },
             {
                 color: "#ff6f55",
                 url: "http://island.jacobralph.org/assets/playlist/evening/some",
                 length: 255
             },
             {
                 color: "#ff6f56",
                 url: "http://island.jacobralph.org/assets/playlist/evening/adhd",
                 length: 225
             },
             {
                 color: "#ff6f57",
                 url: "http://island.jacobralph.org/assets/playlist/evening/kongos",
                 length: 237
             },
             {
                 color: "#ff6f58",
                 url: "http://island.jacobralph.org/assets/playlist/evening/m83",
                 length: 240
             },
             {
                 color: "#ff6f59",
                 url: "http://island.jacobralph.org/assets/playlist/evening/floaton",
                 length: 213
             },
             {
                 color: "#ff6f60",
                 url: "http://island.jacobralph.org/assets/playlist/evening/lampshades",
                 length: 193
             },
             {
                 color: "#ff6f61",
                 url: "http://island.jacobralph.org/assets/playlist/evening/missed",
                 length: 266
             },
             {
                 color: "#ff6f62",
                 url: "http://island.jacobralph.org/assets/playlist/evening/ground",
                 length: 241
             },
             {
                 color: "#ff6f63",
                 url: "http://island.jacobralph.org/assets/playlist/evening/tourist",
                 length: 215
             },
             {
                 color: "#ff6f64",
                 url: "http://island.jacobralph.org/assets/playlist/evening/suburbs",
                 length: 311
             },
             {
                 color: "#ff6f65",
                 url: "http://island.jacobralph.org/assets/playlist/evening/dreams",
                 length: 395
             },
             {
                 color: "#ff6f66",
                 url: "http://island.jacobralph.org/assets/playlist/evening/rata",
                 length: 228
             },
             {
                 color: "#ff6f56",
                 url: "http://island.jacobralph.org/assets/playlist/evening/stop",
                 length: 324
             },
             {
                 color: "#ff6f68",
                 url: "http://island.jacobralph.org/assets/playlist/evening/trist",
                 length: 319
             },
             {
                 color: "#ff6f69",
                 url: "http://island.jacobralph.org/assets/playlist/evening/tupac",
                 length: 278
             }
         ];
     }
     var song = document.querySelector('#song');

     var firstLoad = false;
     song.addEventListener("n-sound-loaded", function(e) {
         if (firstLoad) {
             var playing = document.querySelector('#songSync');
             var currentSong = document.querySelector('#song');
             var songLength = getTimeForColor(playing.getAttribute('material').color);
             var currentTimeFromEnd = (playing.getAttribute('scale').x * 1000000000) - (Date.now() / 1000);
             var difference = songLength - currentTimeFromEnd;
             song.setAttribute('n-sound', 'volume', 0.6);
             paused = false;
             song.components['n-sound'].playSound();
             song.components['n-sound'].seek(difference);
         }
         if (!firstLoad) {
             var playing = document.querySelector('#songSync');
             if (playing.getAttribute('material').color != getColorForURL(song.getAttribute('n-sound').src)) {
                 song.setAttribute('n-sound', 'src', getURLForColor(playing.getAttribute('material').color) + '.' + audio);
                 paused = false;
                 var songLength = getTimeForColor(playing.getAttribute('material').color);
                 var currentTimeFromEnd = (playing.getAttribute('scale').x * 1000000000) - (Date.now() / 1000);
                 var difference = songLength - currentTimeFromEnd;
                 //song.components['n-sound'].playSound();
                 song.components['n-sound'].seek(difference);
             }
             firstLoad = true;
             setInterval(switchSong, 1000);
         }
     });

     function getColorForURL(URL) {
         for (i = 0; i < songs.length; i++) {
             var object = songs[i];
             if (URL.indexOf(object.url) !== -1) {
                 return object.color;
             }
         }
         return false;
     }

     function getURLForColor(color) {
         for (i = 0; i < songs.length; i++) {
             var object = songs[i];
             if (object.color === color) {
                 return object.url;
             }
         }
         return false;
     }

     var songLength = 15;
     function getTimeForColor(color) {
         for (i = 0; i < songs.length; i++) {
             var object = songs[i];
             if (object.color === color) {
                 return object.length;
             }
         }
         return 0;
     }

     songs = shuffle(songs);

     var currentIndex = 0;
     var switching = false;

     function switchSong() {
         if (!switching) {
             switching = true;
             var currentlyPlaying = document.querySelector('#songSync');
             var currentSong = document.querySelector('#song');
             if (currentSong.getAttribute('n-sound').src == getURLForColor(currentlyPlaying.getAttribute('material').color) + "." + audio && currentlyPlaying.getAttribute('scale').x < (Date.now() / 1000000000000) && currentlyPlaying.components['sync'].isMine) {
                 if (currentIndex < (songs.length - 1)) {
                     songs = shuffle(songs);
                     currentIndex = 0;
                 }
                 var newSong = songs[currentIndex];
                 currentIndex++
                 currentSong.setAttribute('n-sound', 'src', newSong.url + "." + audio);
                 currentlyPlaying.setAttribute('material', 'color', newSong.color);
                 currentlyPlaying.setAttribute('scale', (((Date.now() / 1000) + newSong.length) / 1000000000) + " 0 0");
             } else if (currentSong.getAttribute('n-sound').src != getURLForColor(currentlyPlaying.getAttribute('material').color) + "." + audio) {
                 currentSong.setAttribute('n-sound', 'src', getURLForColor(currentlyPlaying.getAttribute('material').color) + "." + audio);
             }
             switching = false;
         }
     }

     var loader = new THREE.TextureLoader();
     loader.crossOrigin = '';
     var box = "skydome.jpg";
     if (timeOfDay == "night") {
         box = "NightSky.jpg";
     }
     var texture = THREE.ImageUtils.loadTexture("./assets/" + agent + "/" + timeOfDay + "/" + box);
     var skyGeo = new THREE.SphereGeometry(400, 100, 100);
     var material = new THREE.MeshPhongMaterial({
         map: texture
     });

     var sky = new THREE.Mesh(skyGeo, material);
     sky.position.x = 37.56583;
     sky.material.side = THREE.BackSide;
     sim.scene.add(sky);

     var lastupdate = "";

     var geometry = new THREE.SphereGeometry(0.01, 12, 12);
     var material = new THREE.MeshBasicMaterial({
         color: 0xffff00
     });

     //material.transparent = true;
     //material.opacity = 0;
     /*var bitch_slap = new THREE.Mesh(geometry, material);
     bitch_slap.position.z = 1;
     bitch_slap.position.y = 2;
     var skeleton;
     var hand;
     var should_send = false;

     //Gotta give her what she wants. Bwahahaha!
     var promises = [altspace.getThreeJSTrackingSkeleton(), altspace.getEnclosure()];
     Promise.all(promises).then(function(array) {

         skeleton = array[0];
         sim.scene.add(skeleton);
         altspace.getUser().then(function(userInfo) {
             if (userInfo && userInfo.displayName && (userInfo.displayName == "Jacob" || userInfo.displayName == "jacob" || userInfo.displayName == "enderthexenocide")) {
                 hand = skeleton.getJoint('Middle', "Right", 2);
                 if (hand != undefined) {
                     bitch_slap.position.y = 0;
                     bitch_slap.position.z = 0;
                     hand.add(bitch_slap);
                     should_send = true;
                 }
             } else {
                 var colliderBox = new NativeComponent('n-mesh-collider', {
                     type: "environment",
                     convex: true
                 }, bitch_slap);
                 sim.scene.add(bitch_slap);
             }
         });

     }).catch(function(err) {
         console.log('Well Jacob, you fucked something up: ', err);
     });

     setInterval(function(e) {
         if (should_send) {
             if (hand != undefined) {
                 socket.emit('update_position', {
                     position: {
                         x: hand.position.x,
                         y: hand.position.y,
                         z: hand.position.z
                     }
                 });
             }
         }
     }, 150);

     socket.on('position', function(data) {
         if (data && !should_send) {
             bitch_slap.position.y = data.y;
             bitch_slap.position.x = data.x;
             bitch_slap.position.z = data.z;
         }
     });*/

    if (autoupdate) {
     setInterval(function(e) {
         $.ajax({
             type: "GET",
             url: "http://island.jacobralph.org/lastupdate.txt",
             async: true,
             success: function(text) {
                 if (lastupdate == "") {
                     lastupdate = text;
                 } else {
                     if (lastupdate != text) {
                         location.reload(true);
                     }
                 }
             }
         });
     }, 5000);
    }

    if (!timeOverride) {
     setInterval(function(e) {
         var d = new Date();
         var n = d.getUTCHours();
         if ((n < 12 && timeOfDay != "night") || n > 12 && timeOfDay != "day") {
             window.location.reload();
         }
     }, 15000);
    }

     if (!mobile) {
     var loader = new THREE.TextureLoader();
     var assetsLoadedCount = 0;
     var texts = [{
             tex: loader.load('./assets/seagull-1.png', loadedTexture)
         },
         {
             tex: loader.load('./assets/seagull-2.png', loadedTexture)
         },
         {
             tex: loader.load('./assets/seagull-3.png', loadedTexture)
         },
         {
             tex: loader.load('./assets/seagull-4.png', loadedTexture)
         },
         {
             tex: loader.load('./assets/seagull-5.png', loadedTexture)
         },
         {
             tex: loader.load('./assets/seagull-6.png', loadedTexture)
         },
         {
             tex: loader.load('./assets/seagull-7.png', loadedTexture)
         }
     ];

     function loadedTexture() {
         assetsLoadedCount++;
         if (assetsLoadedCount == 7) {
             runAnimation();
         }
     }

     function runAnimation() {

         var current = 0;
         var current2 = 1;
         var current3 = 2;
         var seagull_mat = new THREE.MeshBasicMaterial({
             map: texts[0].tex,
             transparent: true
         });
         var seagull_1 = new THREE.Mesh(new THREE.PlaneGeometry(0.7503, 0.625), seagull_mat);
         seagull_1.material.side = THREE.DoubleSide;
         if(timeOfDay == "night"){
            seagull_1.material.opacity = 0.5;
         }
         seagull_1.material.transparent = true;
         var diff = ((Date.now() - 1485117109000) / 500000) % 1;
         console.log(diff);
         var correct_pos = 1037 - (2000 * diff);
         seagull_1.position.x = correct_pos;
         seagull_1.position.y = 12;
         seagull_1.position.z = -30;

         sim.scene.add(seagull_1);

         var seagull_2 = seagull_1.clone();
         seagull_2.position.x = seagull_2.position.x + 1.5;
         seagull_2.position.z = seagull_2.position.z - 1;
         sim.scene.add(seagull_2);

         var seagull_3 = seagull_1.clone();
         seagull_3.position.x = seagull_3.position.x + 1;
         seagull_3.position.z = seagull_3.position.z + 1;
         sim.scene.add(seagull_3);

         function animation() {
             current++;
             if (current > 6) {
                 current = 0;
             }
             var seagull_tex = texts[current].tex;
             current2++;
             if (current2 > 6) {
                 current2 = 0;
             }
             var seagull_tex2 = texts[current2].tex;
             current3++;
             if (current3 > 6) {
                 current3 = 0;
             }
             var seagull_tex3 = texts[current3].tex;

             seagull_tex.needsUpdate = true;
             var seagull_mat2 = new THREE.MeshBasicMaterial({
                 map: seagull_tex,
                 transparent: true
             });

             seagull_1.material = seagull_mat2;
             seagull_1.material.transparent = true;
             seagull_1.material.needsUpdate = true;
             seagull_1.needsUpdate = true;

             var seagull_mat3 = new THREE.MeshBasicMaterial({
                 map: seagull_tex2,
                 transparent: true
             });
             seagull_2.material = seagull_mat3;
             seagull_2.material.transparent = true;
             seagull_2.material.needsUpdate = true;
             seagull_2.needsUpdate = true;

             var seagull_mat2 = new THREE.MeshBasicMaterial({
                 map: seagull_tex3,
                 transparent: true
             });
             seagull_3.material = seagull_mat2;
             seagull_3.material.transparent = true;
             seagull_3.material.needsUpdate = true;
             seagull_3.needsUpdate = true;

             setTimeout(function() {

                 requestAnimationFrame(animation);

             }, 1000 / 14);
         }
         requestAnimationFrame(animation);

         function animation_fly() {

             var diff = ((Date.now() - 1485117109000) / 500000) % 1;
             var correct_pos = 1037 - (2000 * diff);
             seagull_1.position.x = correct_pos;

             var birdSound = document.querySelector('#birds');
             birdSound.setAttribute('position', correct_pos + ' ' + birdSound.getAttribute('position').y + ' ' + birdSound.getAttribute('position').z);
             seagull_2.position.x = correct_pos + 1;
             seagull_3.position.x = correct_pos + 1.5;
             setTimeout(function() {

                 requestAnimationFrame(animation_fly);

             }, 1000 / 45);
         }
         requestAnimationFrame(animation_fly);
     }
     }

 });
