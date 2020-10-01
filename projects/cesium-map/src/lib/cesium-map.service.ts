import { ElementRef, Injectable, NgZone } from '@angular/core';
import {
  degreesToRadians,
  Location,
  MapFeature,
  MapService,
} from '@general-utils';
import {
  AnimationViewModel,
  ArcGisMapServerImageryProvider,
  Camera,
  ClockViewModel,
  CzmlDataSource,
  ImageryLayer,
  OpenStreetMapImageryProvider,
  Rectangle,
  SceneMode,
  Viewer,
} from 'cesium';

@Injectable()
export class CesiumMapService extends MapService {
  private cesiumViewer: Viewer;
  private _czmlDataSource = new CzmlDataSource();
  private _clockViewModel: ClockViewModel;
  private _animationViewModel: AnimationViewModel;

  private imageryLayers = new Map<string, ImageryLayer>();

  constructor(private zone: NgZone) {
    super();
  }

  get viewer(): Viewer {
    return this.cesiumViewer;
  }

  get czmlDataSource() {
    return this._czmlDataSource;
  }

  get clockViewModel() {
    return this._clockViewModel;
  }

  get animationViewModel() {
    return this._animationViewModel;
  }

  get currentZoom(): number {
    return this.cesiumViewer.camera.positionCartographic.height;
  }

  initMap(elementRef: ElementRef, initialLocation: Location): void {
    this.zone.runOutsideAngular(() => {
      if (initialLocation) {
        this.setDefaultView(initialLocation);
      }

      this.cesiumViewer = new Viewer(elementRef.nativeElement, {
        sceneMode: SceneMode.SCENE2D,
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        geocoder: false,
        timeline: false,
        selectionIndicator: false,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        imageryProvider: new OpenStreetMapImageryProvider({
          url: 'https://a.tile.openstreetmap.org/',
        }),
      });
    });

    this._clockViewModel = this.cesiumViewer.clockViewModel;
    this._animationViewModel = new AnimationViewModel(this._clockViewModel);
    this.viewer.dataSources.add(this._czmlDataSource);

    this.mapReady$.next();
    this.mapReady$.complete();

    this.maxZoomIn$.subscribe(
      (val) =>
        (this.cesiumViewer.scene.screenSpaceCameraController.minimumZoomDistance = val)
    );

    this.maxZoomOut$.subscribe(
      (val) =>
        (this.cesiumViewer.scene.screenSpaceCameraController.maximumZoomDistance = val)
    );
  }

  zoomIn(amount: number): void {
    if (this.currentZoom + amount <= this.maxZoomIn) {
      this.cesiumViewer.camera.zoomIn(this.maxZoomIn + amount);
      return;
    }

    this.cesiumViewer.camera.zoomIn(amount);
  }

  zoomOut(amount: number): void {
    if (this.currentZoom + amount >= this.maxZoomOut) {
      this.cesiumViewer.camera.zoomOut(this.maxZoomOut - amount);
      return;
    }

    this.cesiumViewer.camera.zoomOut(amount);
  }

  rotate(degrees: number): void {
    this.cesiumViewer.camera.twistLeft(degreesToRadians(degrees));
    this.currentRotation += degrees;
  }

  addArcGisImageryLayer(name: string, mapFeature: MapFeature): void {
    if (this.imageryLayers.has(name)) {
      return;
    }

    const imageryLayer = this.cesiumViewer.imageryLayers.addImageryProvider(
      new ArcGisMapServerImageryProvider({
        url: mapFeature.url,
        layers: mapFeature.layer.toString(),
      })
    );
    this.imageryLayers.set(name, imageryLayer);
  }

  removeArcGisImageryLayer(name: string): void {
    if (!this.imageryLayers.has(name)) {
      return;
    }

    const imageryLayer = this.imageryLayers.get(name);
    this.cesiumViewer.imageryLayers.remove(imageryLayer);
    this.imageryLayers.delete(name);
  }

  removeAllArcGisLayers(destroy: boolean = false): void {
    this.imageryLayers.clear();
    this.cesiumViewer.imageryLayers.removeAll(destroy);
  }

  private setDefaultView(location: Location): void {
    Camera.DEFAULT_VIEW_FACTOR = 0;
    Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
      location.west,
      location.south,
      location.east,
      location.north
    );
  }
}
