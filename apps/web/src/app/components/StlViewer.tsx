import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

type StlModel = {
  title: string;
  description: string;
  file: string;
};

type StlViewerLabels = {
  title: string;
  description: string;
  loading: string;
  error: string;
  reset: string;
  instructions: string;
};

type StlViewerProps = {
  assetBaseUrl: string;
  labels: StlViewerLabels;
  models: readonly StlModel[];
};

type ViewerStatus = "loading" | "ready" | "error";

export function StlViewer({ assetBaseUrl, labels, models }: StlViewerProps) {
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);
  const [status, setStatus] = useState<ViewerStatus>("loading");
  const viewportRef = useRef<HTMLDivElement>(null);
  const resetViewRef = useRef<() => void>(() => undefined);
  const selectedModel = models[selectedModelIndex];

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !selectedModel) {
      return;
    }

    let disposed = false;
    let animationFrame = 0;
    let geometry: THREE.BufferGeometry | null = null;
    let material: THREE.MeshStandardMaterial | null = null;
    setStatus("loading");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 3000);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      setStatus("error");
      return;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute("aria-label", `${labels.title}: ${selectedModel.title}`);
    renderer.domElement.setAttribute("role", "img");
    renderer.domElement.style.touchAction = "none";
    viewport.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enablePan = false;
    controls.minDistance = 12;
    controls.maxDistance = 520;

    scene.add(new THREE.HemisphereLight(0xffffff, 0x50615b, 2.2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(90, 140, 100);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x9ee7dd, 1.25);
    fillLight.position.set(-100, 55, -70);
    scene.add(fillLight);

    const grid = new THREE.GridHelper(190, 19, 0x4da69b, 0x53716c);
    const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material];
    for (const gridMaterial of gridMaterials) {
      gridMaterial.transparent = true;
      gridMaterial.opacity = 0.26;
    }
    scene.add(grid);

    const resize = () => {
      const width = Math.max(viewport.clientWidth, 1);
      const height = Math.max(viewport.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(viewport);
    resize();

    const renderFrame = () => {
      if (disposed) {
        return;
      }
      controls.update();
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(renderFrame);
    };
    renderFrame();

    const loader = new STLLoader();
    loader.load(
      `${assetBaseUrl}${selectedModel.file}`,
      (loadedGeometry) => {
        if (disposed) {
          loadedGeometry.dispose();
          return;
        }

        geometry = loadedGeometry;
        geometry.computeVertexNormals();
        geometry.computeBoundingBox();
        const initialBox = geometry.boundingBox;
        if (!initialBox) {
          setStatus("error");
          return;
        }

        const center = initialBox.getCenter(new THREE.Vector3());
        geometry.translate(-center.x, -initialBox.min.y, -center.z);
        geometry.computeBoundingBox();
        const size = geometry.boundingBox?.getSize(new THREE.Vector3());
        if (!size) {
          setStatus("error");
          return;
        }

        const translucentMiddle =
          selectedModel.file === "octgear-case-middle.stl";
        material = new THREE.MeshStandardMaterial({
          color: translucentMiddle ? 0x9ce4dc : 0xded2bf,
          metalness: 0.08,
          roughness: translucentMiddle ? 0.32 : 0.58,
          side: THREE.DoubleSide,
          transparent: translucentMiddle,
          opacity: translucentMiddle ? 0.46 : 1,
          depthWrite: !translucentMiddle,
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const radius = Math.max(size.length() * 0.5, 8);
        const targetHeight = Math.max(size.y * 0.3, radius * 0.05);
        const resetView = () => {
          camera.near = Math.max(radius / 100, 0.05);
          camera.far = radius * 30;
          camera.position.set(radius * 1.35, radius * 1.05, radius * 1.4);
          camera.updateProjectionMatrix();
          controls.target.set(0, targetHeight, 0);
          controls.minDistance = Math.max(radius * 0.45, 8);
          controls.maxDistance = radius * 7;
          controls.update();
          controls.saveState();
        };
        resetViewRef.current = resetView;
        resetView();
        setStatus("ready");
      },
      undefined,
      () => {
        if (!disposed) {
          setStatus("error");
        }
      },
    );

    return () => {
      disposed = true;
      resetViewRef.current = () => undefined;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      controls.dispose();
      geometry?.dispose();
      material?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [assetBaseUrl, labels.title, selectedModel]);

  if (!selectedModel) {
    return null;
  }

  return (
    <section className="guide-stl-viewer" aria-labelledby="stl-viewer-title">
      <div className="guide-stl-viewer-heading">
        <div>
          <span className="panel-kicker">STL Viewer</span>
          <h3 id="stl-viewer-title">{labels.title}</h3>
          <p>{labels.description}</p>
        </div>
        <button
          type="button"
          className="ghost-button"
          disabled={status !== "ready"}
          onClick={() => resetViewRef.current()}
        >
          {labels.reset}
        </button>
      </div>

      <div className="guide-stl-model-tabs" role="tablist" aria-label={labels.title}>
        {models.map((model, modelIndex) => (
          <button
            type="button"
            role="tab"
            aria-selected={modelIndex === selectedModelIndex}
            className={modelIndex === selectedModelIndex ? "active" : ""}
            key={model.file}
            onClick={() => setSelectedModelIndex(modelIndex)}
          >
            {model.title}
          </button>
        ))}
      </div>

      <div className="guide-stl-viewport-shell">
        <div className="guide-stl-viewport" ref={viewportRef} />
        {status !== "ready" ? (
          <div className={`guide-stl-status ${status}`} role="status">
            {status === "loading" ? labels.loading : labels.error}
          </div>
        ) : null}
      </div>

      <div className="guide-stl-viewer-footer">
        <span>{labels.instructions}</span>
        <a href={`${assetBaseUrl}${selectedModel.file}`} download>
          {selectedModel.title} STL
        </a>
      </div>
    </section>
  );
}
