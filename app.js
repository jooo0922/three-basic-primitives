'use strict';

import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';

function main() {
  // assign canvas element
  const canvas = document.querySelector('#canvas');
  const renderer = new THREE.WebGLRenderer({
    canvas
  });

  // camera
  const fov = 40;
  const aspect = 2;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  camera.position.z = 120;

  // assign color to scene's background
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xAAAAAA);

  // lights
  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(1, -2, -4);
    scene.add(light);
  }

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  // set mesh's position and add mesh to scene and push mesh to array
  const objects = [];
  const spread = 15;

  function addObject(x, y, obj) {
    obj.position.x = x * spread;
    obj.position.y = y * spread;

    scene.add(obj);
    objects.push(obj);
  }

  // create random color material
  function createMaterial() {
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
    });

    const hue = Math.random();
    const saturation = 1;
    const luminance = 0.5;
    material.color.setHSL(hue, saturation, luminance);

    return material;
  }

  // create solid mesh using solid geometry and random colored material
  function addSolidGeometry(x, y, geometry) {
    const mesh = new THREE.Mesh(geometry, createMaterial());
    addObject(x, y, mesh);
  }

  // create LineSegments using (Edges, Wireframe)Geometry and line basic material
  function addLineGeometry(x, y, geometry) {
    const material = new THREE.LineBasicMaterial({
      color: 0x000000
    });
    const mesh = new THREE.LineSegments(geometry, material)
    addObject(x, y, mesh);
  }

  // box geometry
  {
    const width = 8;
    const height = 8;
    const depth = 8;
    addSolidGeometry(-2, 2, new THREE.BoxGeometry(width, height, depth));
  }

  // circle geometry
  {
    const radius = 7;
    const segments = 24;
    addSolidGeometry(-1, 2, new THREE.CircleGeometry(radius, segments));
  }

  // cone geometry
  {
    const radius = 6;
    const height = 8;
    const segments = 16;
    addSolidGeometry(0, 2, new THREE.ConeGeometry(radius, height, segments));
  }

  // cylinder geometry
  {
    const radiusTop = 4;
    const radiusBottom = 4;
    const height = 8;
    const radialSegments = 12;
    addSolidGeometry(1, 2, new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments));
  }

  // dodecahedron geometry(십이면체)
  {
    const radius = 7;
    addSolidGeometry(2, 2, new THREE.DodecahedronGeometry(radius));
  }

  // extrude geometry(평면 shape을 그리고, 그거를 extrude하고, 모서리를 bevel함)
  {
    const shape = new THREE.Shape();
    const x = -2.5;
    const y = -5;
    shape.moveTo(x + 2.5, y + 2.5);
    shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

    const extrudeSetting = {
      steps: 2,
      depth: 2,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 1,
      bevelSegments: 2,
    };

    addSolidGeometry(-2, 1, new THREE.ExtrudeGeometry(shape, extrudeSetting));
  }

  // icosahedron geometry(이십면체)
  {
    const radius = 7;
    addSolidGeometry(-1, 1, new THREE.IcosahedronGeometry(radius));
  }

  // lathe geography
  {
    const points = [];

    /**
     * Vector2(x, y) 클래스는 x, y 한쌍의 값을 파라미터로 받은 뒤, 
     * 
     * 1. 2D 평면상의 점. 또는,
     * 2. 2D 평면상에서 (0, 0) -> (x, y)으로 이어지는 방향, 길이를 가지는 벡터 선분. 또는,
     * 3. 어떤 임의로 정렬된 숫자쌍을 나타냄.
     * 
     * * 참고로 x, y를 지정하지 않으면 기본값인 (0, 0)이 적용됨. 
     * 
     * 여기서는 1번, 즉 평면상의 점을 10개 그린 뒤 Vector2 배열을 전달하고, 
     * 걔내를 연결한 선을 기준축을 중심으로 회전시켜서 지오메트리를 만드는 latheGeometry에 사용하려는 것.
     * 이거는 물레로 도자기를 만드는 것처럼 Vector2 배열에 담긴 point들을 연결시킨 선(line)을 회전시켜 모양을 만듦.
     * 
     * 그래서 여러가지 파라미터들을 받지만, line을 생성에 꼭 필요한 Vector2 Array는 반드시 전달해줘야 함.
     */
    for (let i = 0; i < 10; i++) {
      points.push(new THREE.Vector2(Math.sin(i * 0.2) * 3 + 3, (i - 5) * 0.8));
    }

    addSolidGeometry(0, 1, new THREE.LatheGeometry(points));
  }

  // octahedron geometry(팔면체)
  {
    const radius = 7;
    addSolidGeometry(1, 1, new THREE.OctahedronGeometry(radius));
  }

  // parametric geometry
  {
    /**
     * 파라메트릭 디자인
     * 
     * 일정한 알고리즘을 제시하여 그 안의 변수와 규칙성에 따라서 컴퓨터가 디자인을 자동으로 그려나가는 과정.
     * 즉, 프로그래밍을 통해 나오는 디자인 결과물로 볼 수 있음.
     * 
     * 파라메트릭 지오메트리는 이러한 parametric surface를 생성하는 클래스로 보면 됨.
     * 그러니 기반으로 할만한 알고리즘, 즉 파라메트릭 디자인을 생성하는 함수를 전달해줘야 함.
     * 
     * klein이 그 함수인데, 0 ~ 1사이의 u, v값을(2D 격자값)을 받아서 3D 값(Vector3)로 반환하는 함수임.
     * 얘를 인자로 전달해서 파라메트릭 서피스를 만드는데, 
     * 이 함수는 튜토리얼에서도 three.js github에서 가져왔다고 명시해놓음.
     * 
     * 아무래도 좀 어려운 함수인 듯 하니 대충 저 함수를 인수로 전달해서 파라메트릭 서피스를 만들어내는 클래스라고 생각하면 될 듯
     */
    function klein(v, u, target) {
      u *= Math.PI;
      v *= 2 * Math.PI;
      u = u * 2;

      let x;
      let z;

      if (u < Math.PI) {
        x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
        z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
      } else {
        x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
        z = -8 * Math.sin(u);
      }

      const y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);

      target.set(x, y, z).multiplyScalar(0.75);
    }

    // slices, stacks는 파라메트릭 디자인 결과물을 각자 가로, 세로 방향으로 얼마나 쪼개줄 것인지에 관한 값. segments로 보면 됨. 
    const slices = 25;
    const stacks = 25;
    addSolidGeometry(2, 1, new THREE.ParametricGeometry(klein, slices, stacks));
  }

  // plane geometry
  {
    const width = 9;
    const height = 9;
    const widthSegments = 2;
    const heightSegments = 2;
    addSolidGeometry(-2, 0, new THREE.PlaneGeometry(width, height, widthSegments, heightSegments));
  }

  // polyhedron geometry
  {
    /**
     * 다면체를 그리는 클래스
     * 
     * 3D공간 상의 점들의 좌표값을 모아놓은 배열(verticesOfCube)과
     * 삼각형들의 버텍스 좌표값을 모아놓은 배열(indicesOfFaces)을 파라미터로 전달해서
     * 다면체를 만들어 냄.
     * 
     * 이 다면체는 3D 점들을 중심으로 전달한 삼각형을 구 형태로 이어서 만든다고 함.
     */
    const verticesOfCube = [
      -1, -1, -1,
      1, -1, -1,
      1, 1, -1,
      -1, 1, -1,
      -1, -1, 1,
      1, -1, 1,
      1, 1, 1,
      -1, 1, 1,
    ];
    const indicesOfFaces = [
      2, 1, 0,
      0, 3, 2,
      0, 4, 7,
      7, 3, 0,
      0, 1, 5,
      5, 4, 0,
      1, 2, 6,
      6, 5, 1,
      2, 3, 7,
      7, 6, 2,
      4, 5, 6,
      6, 7, 4,
    ];

    const radius = 7;
    const detail = 2;
    addSolidGeometry(-1, 0, new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces, radius, detail));
  }

  // ring geometry
  {
    const innerRadius = 2;
    const outerRadius = 7;
    const segments = 18;
    addSolidGeometry(0, 0, new THREE.RingGeometry(innerRadius, outerRadius, segments));
  }

  // shape geometry
  {
    const shape = new THREE.Shape();
    const x = -2.5;
    const y = -5;
    shape.moveTo(x + 2.5, y + 2.5);
    shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);
    addSolidGeometry(1, 0, new THREE.ShapeGeometry(shape));
  }

  // sphere geometry
  {
    const radius = 7;
    const widthSegments = 12;
    const heightSegments = 8;
    addSolidGeometry(2, 0, new THREE.SphereGeometry(radius, widthSegments, heightSegments));
  }

  // tetrahedron geometry(사면체)
  {
    const radius = 7;
    addSolidGeometry(-2, -1, new THREE.TetrahedronGeometry(radius));
  }

  // text geometry
  {
    const loader = new THREE.FontLoader();
    // 3D 폰트 데이터를 로드하는 작업은 시간이 걸리므로 비동기로 처리해줘야 함. 
    // 그래서 프라미스를 사용한 것이고, doit()을 비동기 함수로 만든 뒤, 
    // 그 안에서 promise인 loadFont() 함수, 즉 폰트를 로드하는 작업을 await로 기다리게 한 것.
    function loadFont(url) {
      return new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
      });
    }

    // doit() 함수에 대한 자세한 설명은 공식 튜토리얼을 참고할 것.
    async function doit() {
      const font = await loadFont('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json');
      const geometry = new THREE.TextGeometry('three.js', {
        font: font,
        size: 3.0,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.15,
        bevelSize: 0.3,
        bevelSegments: 5,
      });

      const mesh = new THREE.Mesh(geometry, createMaterial());
      geometry.computeBoundingBox();
      geometry.boundingBox.getCenter(mesh.position).multiplyScalar(-1);

      const parent = new THREE.Object3D();
      parent.add(mesh);

      addObject(-1, -1, parent);
    }

    doit();
  }

  // torus geometry(원환체, 도넛)
  {
    const radius = 5;
    const tubeRadius = 2;
    const radialSegments = 8;
    const tubularSegments = 24;
    addSolidGeometry(0, -1, new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments));
  }

  // torus knut geometry(원환체 매듭)
  {
    const radius = 3.5;
    const tubeRadius = 1.5;
    const radialSegments = 8;
    const tubularSegments = 64;
    const p = 2;
    const q = 3; // p, q는 둘 다 torus knot의 모양(?)을 결정하는 파라미터값인 듯 함...
    addSolidGeometry(1, -1, new THREE.TorusKnotGeometry(radius, tubeRadius, tubularSegments, radialSegments, p, q));
  }

  // tube geometry(패스를 따라 이어진 원)
  {
    /**
     * path를 따라 tube를 생성하기 때문에 3D 공간상의 path가 일단 필요하겠지?
     * 그래서 CustomSinCurve라는 Vector3를 이용해서 3차원 공간상에 3D path를 그려내는 클래스의
     * 새로운 인스턴스를 생성함으로써 3D path를 리턴받아서 const path에 저장해두는 것임.
     * 
     * CustomSinCurve 클래스를 만들 때, THREE.Curve라는 클래스를 상속해서 만든거임.
     * 근데 Curve 생성자에 있는 field들은 그대로 쓰고 싶은데, 거기다가 this.scale이라는 field만 좀 추가하고 싶은거지.
     * 그래서 super()라는 메소드를 사용하면 Curve안의 생성자가 가지고있는 field들을 전부 가져옴과 동시에
     * this.scale만 추가해줘서 CustomSinCurve만의 생성자를 만들어낸 것이라고 보면 됨.
     * 
     * 만약에 이거를 생성자 내의 field만이 아니라, 부모 클래스의 메소드를 고대로 가져와서 거기에 뭔가를 추가하고 싶다?
     * 그러면 super.method()해주면 됨.
     * 
     * 이거는 자바스크립트 클래스 개념에 나오는 기본적인 내용이니까
     * 자바스크립트 튜토리얼이나 엘리 js 개념 정리한 내용을 참고할 것.
     */
    class CustomSinCurve extends THREE.Curve {
      constructor(scale) {
        super();
        this.scale = scale;
      }

      getPoint(t) {
        const tx = t * 3 - 1.5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = 0;

        return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
      }
    }

    const path = new CustomSinCurve(4);
    const tubularSegments = 20;
    const radius = 1; // 3D path를 따라 이어지는 원의 반지름값
    const radialSegments = 8;
    const closed = false;
    addSolidGeometry(2, -1, new THREE.TubeGeometry(path, tubularSegments, radius, radialSegments, closed));
  }

  // edge geometry
  {
    const width = 8;
    const height = 8;
    const depth = 8;
    const thresholdAngle = 15;
    addLineGeometry(-2, -2, new THREE.EdgesGeometry(
      new THREE.BoxGeometry(width, height, depth),
      thresholdAngle
    ));
  }

  // wireframe geometry
  {
    const width = 8;
    const height = 8;
    const depth = 8;
    addLineGeometry(-1, -2, new THREE.WireframeGeometry(new THREE.BoxGeometry(width, height, depth)));
  }

  // create points mesh using sphere geometry and points material
  {
    const radius = 7;
    const widthSegments = 12;
    const heightSegments = 8;
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const material = new THREE.PointsMaterial({
      color: 'red',
      size: 2
    });

    // Mesh의 한 종류인 것 같은데 위에서 사용한 LineSegments랑 비슷하다고 보면 됨.
    const points = new THREE.Points(geometry, material);
    addObject(0, -2, points);
  }

  // 원근을 반영하지 않고 Points를 렌더링할 때 PointsMaterial에서 sizeAttenuation값을 false로 지정해줘야 함.
  // Attenuation: 감쇠, 가늘게 됨, 희석. 즉, 멀어진 point를 가늘게 렌더링할 것이냐? 를 물어보는 것.
  {
    const radius = 7;
    const widthSegments = 12;
    const heightSegments = 8;
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const material = new THREE.PointsMaterial({
      color: 'red',
      sizeAttenuation: false,
      size: 5
    });

    const points = new THREE.Points(geometry, material);
    addObject(1, -2, points);
  }

  // resize
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = canvas.clientWidth * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;

    const needResize = canvas.width !== width || canvas.height !== height;

    if (needResize) {
      renderer.setSize(width, height, false);
    }

    return needResize;
  }

  // animate
  function animate(t) {
    t *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    objects.forEach((obj, index) => {
      const speed = 0.1 + index * 0.05;
      const rotate = t * speed;
      obj.rotation.x = rotate;
      obj.rotation.y = rotate;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

main();