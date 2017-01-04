<!DOCTYPE html>
<html lang='en'>
<head>
	<title>Island</title>
	<meta http-equiv="cache-control" content="no-cache, must-revalidate, post-check=0, pre-check=0">
	<meta http-equiv="expires" content="Sat, 31 Oct 2014 00:00:00 GMT">
	<meta http-equiv="pragma" content="no-cache">
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
	<script src="https://aframe.io/releases/0.3.0/aframe.min.js"></script>
	<script src="./assets/aframe-component-beta.js"></script>
	<script src="./assets/altspace.js"></script>
	<script src="https://cdn.rawgit.com/mrdoob/three.js/r74/examples/js/loaders/MTLLoader.js"></script>
	<script src="https://cdn.rawgit.com/mrdoob/three.js/r74/examples/js/loaders/OBJLoader.js"></script>
</head>

<body>
<?php
$type = "ogg";
if (strpos($_SERVER['HTTP_USER_AGENT'], 'Mobile') !== false) {
    $type = "ogg";
} ?>
	<a-scene altspace ='fullspace: true' debug sync-system="author: john-and-jacob; app: island">
		<a-assets timeout="10000">
			<a-asset-item id="sco" src="./assets/night/island.dae"></a-asset-item>
			<a-asset-item id="sign" src="./assets/sign.dae"></a-asset-item>
			<a-asset-item id="cl" src="./assets/collider.dae"></a-asset-item>
		</a-assets>

		<a-entity position="0 0 0" collada-model="#sco" id="sco-a" altspace-cursor-collider="enabled: false"></a-entity>

		<a-plane transparent=true material="src: url(./assets/water10.jpg); repeat: 150 150;" height="1001" width="1001" rotation="-90 0 0" position="0.0 0.40 0.0" opacity="0.2" transparent=true altspace-cursor-collider="enabled: false">
			<a-animation attribute="position" dur="4000" direction="alternate" easing="ease-in-out-sine" to="0.0 0.35 0.0" repeat="indefinite"></a-animation>
		</a-plane>

		 <a-entity position="26.81583 2.7 -3.7" width="0.2" height="0.2" depth="0.2" n-object='res: effects/fire'></a-entity>
		<a-entity position="33.16583 2.7 -8.8" width="0.2" height="0.2" depth="0.2" n-object='res: effects/fire'></a-entity>
		<a-entity position="19.06583 2.7 -4.3" width="0.2" height="0.2" depth="0.2" n-object='res: effects/fire'></a-entity>
		<a-entity position="20.46583 2.7 -10.2" width="0.2" height="0.2" depth="0.2" n-object='res: effects/fire'></a-entity>
		<a-entity position="8.01583 2.7 -5.18" width="0.2" height="0.2" depth="0.2" n-object='res: effects/fire'></a-entity>
		<a-entity position="9.61583 3.15 -0.51" width="0.2" height="0.2" depth="0.2" n-object='res: effects/fire'></a-entity>

		<a-entity position="26.81583 2.7 -3.7" n-sound="src: http://island.jacobralph.org/assets/fire.<?php echo $type; ?>; autoplay: true; volume: 3; loop: true; minDistance: 0.1; maxDistance: 4; rolloff: cosine"
		altspace-cursor-collider="enabled: true" id="fire1" sync-n-sound></a-entity>
		<<a-entity position="33.16583 2.7 -8.8" n-sound="src: http://island.jacobralph.org/assets/fire.<?php echo $type; ?>; autoplay: true; volume: 3; loop: true; minDistance: 0.1; maxDistance: 4; rolloff: cosine"
		altspace-cursor-collider="enabled: true" id="fire2" sync-n-sound></a-entity>
		<a-entity position="19.06583 2.7 -4.3"  n-sound="src: http://island.jacobralph.org/assets/fire.<?php echo $type; ?>; autoplay: true; volume: 3; loop: true; minDistance: 0.1; maxDistance: 4; rolloff: cosine"
		altspace-cursor-collider="enabled: true" id="fire3" sync-n-sound></a-entity>
		<a-entity position="20.46583 2.7 -10.2"  n-sound="src: http://island.jacobralph.org/assets/fire.<?php echo $type; ?>; autoplay: true; volume: 3; loop: true; minDistance: 0.1; maxDistance: 4; rolloff: cosine"
		altspace-cursor-collider="enabled: true" id="fire4" sync-n-sound></a-entity>
		<a-entity position="8.01583 2.7 -5.18"  n-sound="src: http://island.jacobralph.org/assets/fire.<?php echo $type; ?>; autoplay: true; volume: 3; loop: true; minDistance: 0.1; maxDistance: 4; rolloff: cosine"
		altspace-cursor-collider="enabled: true" id="fire5" sync-n-sound></a-entity>
		<a-entity position="9.61583 3.15 -0.51"  n-sound="src: http://island.jacobralph.org/assets/fire.<?php echo $type; ?>; autoplay: true; volume: 3; loop: true; minDistance: 0.1; maxDistance: 4; rolloff: cosine"
		altspace-cursor-collider="enabled: true" id="fire6" sync-n-sound></a-entity>

		<a-entity position="42.5 2.5 -2.9" opacity="0" n-sound="src: http://island.jacobralph.org/assets/playlist/evening/waves.<?php echo $type; ?>; autoplay: true; volume: 0.05; loop: true; minDistance: 0.1; maxDistance:20; rolloff: cosine"
		altspace-cursor-collider="enabled: true" id="song" sync-n-sound></a-entity>

		<!--<a-entity position="11 -199.4 -2" n-sphere-collider="type: environment; radius:200" radius="200"></a-entity>
		<a-entity position="22 -199.4 -12" n-sphere-collider="type: environment; radius:200" radius="200"></a-entity>
		<a-entity position="34.56583 -199.4 -9" n-sphere-collider="type: environment; radius:200" radius="200"></a-entity>
		<a-entity position="41 -199.4 3" n-sphere-collider="type: environment; radius:200" radius="200"></a-entity>
		<a-entity position="43 -199.4 17" n-sphere-collider="type: environment; radius:200" radius="200"></a-entity>
		<a-entity position="0.26583 1.0 0.1" depth="2.7" height="0.2" width="7.9" n-box-collider="type: environment; size: 7.9, 0.2, 3" ></a-entity>
		<a-entity position="4.66583 0.79 0.1" depth="2.7" height="0.2" width="1" n-box-collider="type: environment; size: 1, 0.2, 3" rotation="0 0 -25"></a-entity>-->

		<a-entity id="loop"
		opacity="0" position="26.6 1 10"
		n-sound="src: http://island.jacobralph.org/assets/ocean.<?php echo $type; ?>; autoplay: true; volume: 1; loop: true; minDistance: 0.1; maxDistance: 15; rolloff: cosine"
		altspace-cursor-collider="enabled: true" sync-n-sound>
		</a-entity>
		<a-entity id="loop"
		opacity="0" position="15 1 12"
		n-sound="src: http://island.jacobralph.org/assets/ocean.<?php echo $type; ?>; autoplay: true; volume: 1; loop: true; minDistance: 0.1; maxDistance: 15; rolloff: cosine"
		altspace-cursor-collider="enabled: true" sync-n-sound>
		</a-entity>
		<a-entity id="loop"
		opacity="0" position="5 1 14"
		n-sound="src: http://island.jacobralph.org/assets/ocean.<?php echo $type; ?>; autoplay: true; volume: 1; loop: true; minDistance: 0.1; maxDistance: 15; rolloff: cosine"
		altspace-cursor-collider="enabled: true" sync-n-sound>
		</a-entity>
		<a-entity id="loop"
		opacity="0" position="-5 1 5"
		n-sound="src: http://island.jacobralph.org/assets/ocean.<?php echo $type; ?>; autoplay: true; volume: 0.2; loop: true; minDistance: 0.1; maxDistance: 15; rolloff: cosine"
		altspace-cursor-collider="enabled: true" sync-n-sound>
		</a-entity>
		<a-entity id="loop"
		opacity="0" position="-2 1 -5"
		n-sound="src: http://island.jacobralph.org/assets/ocean.<?php echo $type; ?>; autoplay: true; volume: 0.2; loop: true; minDistance: 0.1; maxDistance: 15; rolloff: cosine"
		altspace-cursor-collider="enabled: true" sync-n-sound>
		</a-entity>
		<a-entity id="loop"
		opacity="0" position="8 1 -18"
		n-sound="src: http://island.jacobralph.org/assets/ocean.<?php echo $type; ?>; autoplay: true; volume: 1; loop: true; minDistance: 0.1; maxDistance: 15; rolloff: cosine"
		altspace-cursor-collider="enabled: true" sync-n-sound>
		</a-entity>
		<a-entity id="loop"
		opacity="0" position="20 1 -25"
		n-sound="src: http://island.jacobralph.org/assets/ocean.<?php echo $type; ?>; autoplay: true; volume: 1; loop: true; minDistance: 0.2; maxDistance: 15; rolloff: cosine"
		altspace-cursor-collider="enabled: true" sync-n-sound>
		</a-entity>
		<a-entity id="loop"
		opacity="0" position="39 1 -29"
		n-sound="src: http://island.jacobralph.org/assets/ocean.<?php echo $type; ?>; autoplay: true; volume: 1; loop: true; minDistance: 0.2; maxDistance: 15; rolloff: cosine"
		altspace-cursor-collider="enabled: true" sync-n-sound>
		</a-entity>
		<a-entity id="loop"
		opacity="0" position="52 1 -22"
		n-sound="src: http://island.jacobralph.org/assets/ocean.<?php echo $type; ?>; autoplay: true; volume: 1; loop: true; minDistance: 0.1; maxDistance: 15; rolloff: cosine"
		altspace-cursor-collider="enabled: true" sync-n-sound>
		</a-entity>
		<a-entity id="loop"
		opacity="0" position="60 1 -12"
		n-sound="src: http://island.jacobralph.org/assets/ocean.<?php echo $type; ?>; autoplay: true; volume: 1; loop: true; minDistance: 0.1; maxDistance: 15; rolloff: cosine"
		altspace-cursor-collider="enabled: true" sync-n-sound>
		</a-entity>
		<a-entity id="loop"
		opacity="0" position="60 1 9"
		n-sound="src: http://island.jacobralph.org/assets/ocean.<?php echo $type; ?>; autoplay: true; volume: 1; loop: true; minDistance: 0.1; maxDistance: 15; rolloff: cosine"
		altspace-cursor-collider="enabled: true" sync-n-sound>
		</a-entity>
		<a-entity id="loop"
		opacity="0" position="55 1 22"
		n-sound="src: http://island.jacobralph.org/assets/ocean.<?php echo $type; ?>; autoplay: true; volume: 1; loop: true; minDistance: 0.1; maxDistance: 15; rolloff: cosine"
		altspace-cursor-collider="enabled: true" sync-n-sound>
		</a-entity>
		<a-entity id="loop"
		opacity="0" position="50 1 30"
		n-sound="src: http://island.jacobralph.org/assets/ocean.<?php echo $type; ?>; autoplay: true; volume: 1; loop: true; minDistance: 0.1; maxDistance: 15; rolloff: cosine"
		altspace-cursor-collider="enabled: true" sync-n-sound>
		</a-entity>
		<a-entity id="loop"
		opacity="0" position="40 1 32"
		n-sound="src: http://island.jacobralph.org/assets/ocean.<?php echo $type; ?>; autoplay: true; volume: 1; loop: true; minDistance: 0.1; maxDistance: 15; rolloff: cosine"
		altspace-cursor-collider="enabled: true" sync-n-sound>
		</a-entity>
		<a-entity id="loop"
		opacity="0" position="30 1 30"
		n-sound="src: http://island.jacobralph.org/assets/ocean.<?php echo $type; ?>; autoplay: true; volume: 1; loop: true; minDistance: 0.1; maxDistance: 15; rolloff: cosine"
		altspace-cursor-collider="enabled: true" sync-n-sound>
		</a-entity>
		<a-entity id="loop"
		opacity="0" position="26 1 19"
		n-sound="src: http://island.jacobralph.org/assets/ocean.<?php echo $type; ?>; autoplay: true; volume: 1; loop: true; minDistance: 0.1; maxDistance: 15; rolloff: cosine"
		altspace-cursor-collider="enabled: true" sync-n-sound>
		</a-entity>
		<a-entity position="0 -0.05 0" collada-model="#cl" id="cl-a" altspace-cursor-collider="enabled: false" n-mesh-collider="type: environment; convex: false"></a-entity>

	</a-scene>
	
	<script>
		var sim = altspace.utilities.Simulation();

		sim.scene.addEventListener('cursordown', function (data) {
			console.log('Touched Point: X: ' + data.point.x + " Z: " + data.point.z);
		});
		var mesh = document.querySelector('#cl-a');

		mesh.addEventListener('model-loaded', function () {
					console.log(this.object3D);
					var object = this.object3D;
					var mesh = object.children[0].children[0].children[0];
					mesh.material.visible = false;
					//mesh.needsUpdate = true;
					//mesh.material.needsUpdate = true;

				});

		var loader = new THREE.TextureLoader();
		loader.crossOrigin = '';

		var texture = THREE.ImageUtils.loadTexture( "./assets/night/NightSky.jpg" );
		var skyGeo = new THREE.SphereGeometry(500, 100, 100);
		var material = new THREE.MeshPhongMaterial({
			map: texture,
		});

		var sky = new THREE.Mesh(skyGeo, material);
		sky.position.y = -80;
		sky.rotation.y = -137.5 * (Math.PI / 180);
		sky.material.side = THREE.BackSide;
		sim.scene.add(sky);

		var lastupdate = "";

		document.addEventListener('DOMContentLoaded', function(){

			setInterval(function(e){
				$.ajax({ type: "GET",
					url: "http://island.jacobralph.org/lastupdate.txt",
					async: true,
					success : function(text)
					{
								if(lastupdate == ""){
									lastupdate = text;
								} else {
									if(lastupdate != text){
										location.reload(true);
									}
								}
							}
						});
			}, 5000);
		});

		/*var loader = new THREE.OBJLoader();
		loader.load( './assets/PalmLeaf.obj', function ( object ) {
			var material = new THREE.MeshBasicMaterial({
				map:THREE.ImageUtils.loadTexture('./assets/leaf.png'), transparent: true
			});
	material.map.needsUpdate = true; //ADDED
	material.side = THREE.DoubleSide;
	var plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 1), material);
	plane.overdraw = true;
	plane.position.y =  2;
	plane.position.y =  -4;
	sim.scene.add(plane);
} );*/

</script>
</body>
</html>
