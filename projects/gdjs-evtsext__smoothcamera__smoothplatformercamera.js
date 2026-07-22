
gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera = gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera || {};

/**
 * Behavior generated from Smooth platformer camera
 */
gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera = class SmoothPlatformerCamera extends gdjs.RuntimeBehavior {
  constructor(instanceContainer, behaviorData, owner) {
    super(instanceContainer, behaviorData, owner);
    this._runtimeScene = instanceContainer;

    this._onceTriggers = new gdjs.OnceTriggers();
    this._behaviorData = {};
    this._sharedData = gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.getSharedData(
      instanceContainer,
      behaviorData.name
    );
    
    this._behaviorData.PlatformerCharacter = behaviorData.PlatformerCharacter !== undefined ? behaviorData.PlatformerCharacter : "";
    this._behaviorData.SmoothCamera = behaviorData.SmoothCamera !== undefined ? behaviorData.SmoothCamera : "";
    this._behaviorData.JumpOriginY = Number("") || 0;
    this._behaviorData.AirFollowFreeAreaTop = behaviorData.AirFollowFreeAreaTop !== undefined ? behaviorData.AirFollowFreeAreaTop : Number("0") || 0;
    this._behaviorData.AirFollowFreeAreaBottom = behaviorData.AirFollowFreeAreaBottom !== undefined ? behaviorData.AirFollowFreeAreaBottom : Number("0") || 0;
    this._behaviorData.FloorFollowFreeAreaTop = behaviorData.FloorFollowFreeAreaTop !== undefined ? behaviorData.FloorFollowFreeAreaTop : Number("0") || 0;
    this._behaviorData.FloorFollowFreeAreaBottom = behaviorData.FloorFollowFreeAreaBottom !== undefined ? behaviorData.FloorFollowFreeAreaBottom : Number("0") || 0;
    this._behaviorData.AirUpwardSpeed = behaviorData.AirUpwardSpeed !== undefined ? behaviorData.AirUpwardSpeed : Number("0.95") || 0;
    this._behaviorData.AirDownwardSpeed = behaviorData.AirDownwardSpeed !== undefined ? behaviorData.AirDownwardSpeed : Number("0.95") || 0;
    this._behaviorData.FloorUpwardSpeed = behaviorData.FloorUpwardSpeed !== undefined ? behaviorData.FloorUpwardSpeed : Number("0.9") || 0;
    this._behaviorData.FloorDownwardSpeed = behaviorData.FloorDownwardSpeed !== undefined ? behaviorData.FloorDownwardSpeed : Number("0.9") || 0;
    this._behaviorData.AirUpwardSpeedMax = behaviorData.AirUpwardSpeedMax !== undefined ? behaviorData.AirUpwardSpeedMax : Number("9000") || 0;
    this._behaviorData.AirDownwardSpeedMax = behaviorData.AirDownwardSpeedMax !== undefined ? behaviorData.AirDownwardSpeedMax : Number("9000") || 0;
    this._behaviorData.FloorUpwardSpeedMax = behaviorData.FloorUpwardSpeedMax !== undefined ? behaviorData.FloorUpwardSpeedMax : Number("9000") || 0;
    this._behaviorData.FloorDownwardSpeedMax = behaviorData.FloorDownwardSpeedMax !== undefined ? behaviorData.FloorDownwardSpeedMax : Number("9000") || 0;
  }

  // Hot-reload:
  applyBehaviorOverriding(behaviorOverriding) {
    
    if (behaviorOverriding.PlatformerCharacter !== undefined)
      this._behaviorData.PlatformerCharacter = behaviorOverriding.PlatformerCharacter;
    if (behaviorOverriding.SmoothCamera !== undefined)
      this._behaviorData.SmoothCamera = behaviorOverriding.SmoothCamera;
    if (behaviorOverriding.JumpOriginY !== undefined)
      this._behaviorData.JumpOriginY = behaviorOverriding.JumpOriginY;
    if (behaviorOverriding.AirFollowFreeAreaTop !== undefined)
      this._behaviorData.AirFollowFreeAreaTop = behaviorOverriding.AirFollowFreeAreaTop;
    if (behaviorOverriding.AirFollowFreeAreaBottom !== undefined)
      this._behaviorData.AirFollowFreeAreaBottom = behaviorOverriding.AirFollowFreeAreaBottom;
    if (behaviorOverriding.FloorFollowFreeAreaTop !== undefined)
      this._behaviorData.FloorFollowFreeAreaTop = behaviorOverriding.FloorFollowFreeAreaTop;
    if (behaviorOverriding.FloorFollowFreeAreaBottom !== undefined)
      this._behaviorData.FloorFollowFreeAreaBottom = behaviorOverriding.FloorFollowFreeAreaBottom;
    if (behaviorOverriding.AirUpwardSpeed !== undefined)
      this._behaviorData.AirUpwardSpeed = behaviorOverriding.AirUpwardSpeed;
    if (behaviorOverriding.AirDownwardSpeed !== undefined)
      this._behaviorData.AirDownwardSpeed = behaviorOverriding.AirDownwardSpeed;
    if (behaviorOverriding.FloorUpwardSpeed !== undefined)
      this._behaviorData.FloorUpwardSpeed = behaviorOverriding.FloorUpwardSpeed;
    if (behaviorOverriding.FloorDownwardSpeed !== undefined)
      this._behaviorData.FloorDownwardSpeed = behaviorOverriding.FloorDownwardSpeed;
    if (behaviorOverriding.AirUpwardSpeedMax !== undefined)
      this._behaviorData.AirUpwardSpeedMax = behaviorOverriding.AirUpwardSpeedMax;
    if (behaviorOverriding.AirDownwardSpeedMax !== undefined)
      this._behaviorData.AirDownwardSpeedMax = behaviorOverriding.AirDownwardSpeedMax;
    if (behaviorOverriding.FloorUpwardSpeedMax !== undefined)
      this._behaviorData.FloorUpwardSpeedMax = behaviorOverriding.FloorUpwardSpeedMax;
    if (behaviorOverriding.FloorDownwardSpeedMax !== undefined)
      this._behaviorData.FloorDownwardSpeedMax = behaviorOverriding.FloorDownwardSpeedMax;

    return true;
  }

  // Network sync:
  getNetworkSyncData(syncOptions) {
    return {
      ...super.getNetworkSyncData(syncOptions),
      props: {
        
    PlatformerCharacter: this._behaviorData.PlatformerCharacter,
    SmoothCamera: this._behaviorData.SmoothCamera,
    JumpOriginY: this._behaviorData.JumpOriginY,
    AirFollowFreeAreaTop: this._behaviorData.AirFollowFreeAreaTop,
    AirFollowFreeAreaBottom: this._behaviorData.AirFollowFreeAreaBottom,
    FloorFollowFreeAreaTop: this._behaviorData.FloorFollowFreeAreaTop,
    FloorFollowFreeAreaBottom: this._behaviorData.FloorFollowFreeAreaBottom,
    AirUpwardSpeed: this._behaviorData.AirUpwardSpeed,
    AirDownwardSpeed: this._behaviorData.AirDownwardSpeed,
    FloorUpwardSpeed: this._behaviorData.FloorUpwardSpeed,
    FloorDownwardSpeed: this._behaviorData.FloorDownwardSpeed,
    AirUpwardSpeedMax: this._behaviorData.AirUpwardSpeedMax,
    AirDownwardSpeedMax: this._behaviorData.AirDownwardSpeedMax,
    FloorUpwardSpeedMax: this._behaviorData.FloorUpwardSpeedMax,
    FloorDownwardSpeedMax: this._behaviorData.FloorDownwardSpeedMax,
      }
    };
  }
  updateFromNetworkSyncData(networkSyncData, options) {
    super.updateFromNetworkSyncData(networkSyncData, options);
    
    if (networkSyncData.props.PlatformerCharacter !== undefined)
      this._behaviorData.PlatformerCharacter = networkSyncData.props.PlatformerCharacter;
    if (networkSyncData.props.SmoothCamera !== undefined)
      this._behaviorData.SmoothCamera = networkSyncData.props.SmoothCamera;
    if (networkSyncData.props.JumpOriginY !== undefined)
      this._behaviorData.JumpOriginY = networkSyncData.props.JumpOriginY;
    if (networkSyncData.props.AirFollowFreeAreaTop !== undefined)
      this._behaviorData.AirFollowFreeAreaTop = networkSyncData.props.AirFollowFreeAreaTop;
    if (networkSyncData.props.AirFollowFreeAreaBottom !== undefined)
      this._behaviorData.AirFollowFreeAreaBottom = networkSyncData.props.AirFollowFreeAreaBottom;
    if (networkSyncData.props.FloorFollowFreeAreaTop !== undefined)
      this._behaviorData.FloorFollowFreeAreaTop = networkSyncData.props.FloorFollowFreeAreaTop;
    if (networkSyncData.props.FloorFollowFreeAreaBottom !== undefined)
      this._behaviorData.FloorFollowFreeAreaBottom = networkSyncData.props.FloorFollowFreeAreaBottom;
    if (networkSyncData.props.AirUpwardSpeed !== undefined)
      this._behaviorData.AirUpwardSpeed = networkSyncData.props.AirUpwardSpeed;
    if (networkSyncData.props.AirDownwardSpeed !== undefined)
      this._behaviorData.AirDownwardSpeed = networkSyncData.props.AirDownwardSpeed;
    if (networkSyncData.props.FloorUpwardSpeed !== undefined)
      this._behaviorData.FloorUpwardSpeed = networkSyncData.props.FloorUpwardSpeed;
    if (networkSyncData.props.FloorDownwardSpeed !== undefined)
      this._behaviorData.FloorDownwardSpeed = networkSyncData.props.FloorDownwardSpeed;
    if (networkSyncData.props.AirUpwardSpeedMax !== undefined)
      this._behaviorData.AirUpwardSpeedMax = networkSyncData.props.AirUpwardSpeedMax;
    if (networkSyncData.props.AirDownwardSpeedMax !== undefined)
      this._behaviorData.AirDownwardSpeedMax = networkSyncData.props.AirDownwardSpeedMax;
    if (networkSyncData.props.FloorUpwardSpeedMax !== undefined)
      this._behaviorData.FloorUpwardSpeedMax = networkSyncData.props.FloorUpwardSpeedMax;
    if (networkSyncData.props.FloorDownwardSpeedMax !== undefined)
      this._behaviorData.FloorDownwardSpeedMax = networkSyncData.props.FloorDownwardSpeedMax;
  }

  // Properties:
  
  _getPlatformerCharacter() {
    return this._behaviorData.PlatformerCharacter !== undefined ? this._behaviorData.PlatformerCharacter : "";
  }
  _setPlatformerCharacter(newValue) {
    this._behaviorData.PlatformerCharacter = newValue;
  }
  _getSmoothCamera() {
    return this._behaviorData.SmoothCamera !== undefined ? this._behaviorData.SmoothCamera : "";
  }
  _setSmoothCamera(newValue) {
    this._behaviorData.SmoothCamera = newValue;
  }
  _getJumpOriginY() {
    return this._behaviorData.JumpOriginY !== undefined ? this._behaviorData.JumpOriginY : Number("") || 0;
  }
  _setJumpOriginY(newValue) {
    this._behaviorData.JumpOriginY = newValue;
  }
  _getAirFollowFreeAreaTop() {
    return this._behaviorData.AirFollowFreeAreaTop !== undefined ? this._behaviorData.AirFollowFreeAreaTop : Number("0") || 0;
  }
  _setAirFollowFreeAreaTop(newValue) {
    this._behaviorData.AirFollowFreeAreaTop = newValue;
  }
  _getAirFollowFreeAreaBottom() {
    return this._behaviorData.AirFollowFreeAreaBottom !== undefined ? this._behaviorData.AirFollowFreeAreaBottom : Number("0") || 0;
  }
  _setAirFollowFreeAreaBottom(newValue) {
    this._behaviorData.AirFollowFreeAreaBottom = newValue;
  }
  _getFloorFollowFreeAreaTop() {
    return this._behaviorData.FloorFollowFreeAreaTop !== undefined ? this._behaviorData.FloorFollowFreeAreaTop : Number("0") || 0;
  }
  _setFloorFollowFreeAreaTop(newValue) {
    this._behaviorData.FloorFollowFreeAreaTop = newValue;
  }
  _getFloorFollowFreeAreaBottom() {
    return this._behaviorData.FloorFollowFreeAreaBottom !== undefined ? this._behaviorData.FloorFollowFreeAreaBottom : Number("0") || 0;
  }
  _setFloorFollowFreeAreaBottom(newValue) {
    this._behaviorData.FloorFollowFreeAreaBottom = newValue;
  }
  _getAirUpwardSpeed() {
    return this._behaviorData.AirUpwardSpeed !== undefined ? this._behaviorData.AirUpwardSpeed : Number("0.95") || 0;
  }
  _setAirUpwardSpeed(newValue) {
    this._behaviorData.AirUpwardSpeed = newValue;
  }
  _getAirDownwardSpeed() {
    return this._behaviorData.AirDownwardSpeed !== undefined ? this._behaviorData.AirDownwardSpeed : Number("0.95") || 0;
  }
  _setAirDownwardSpeed(newValue) {
    this._behaviorData.AirDownwardSpeed = newValue;
  }
  _getFloorUpwardSpeed() {
    return this._behaviorData.FloorUpwardSpeed !== undefined ? this._behaviorData.FloorUpwardSpeed : Number("0.9") || 0;
  }
  _setFloorUpwardSpeed(newValue) {
    this._behaviorData.FloorUpwardSpeed = newValue;
  }
  _getFloorDownwardSpeed() {
    return this._behaviorData.FloorDownwardSpeed !== undefined ? this._behaviorData.FloorDownwardSpeed : Number("0.9") || 0;
  }
  _setFloorDownwardSpeed(newValue) {
    this._behaviorData.FloorDownwardSpeed = newValue;
  }
  _getAirUpwardSpeedMax() {
    return this._behaviorData.AirUpwardSpeedMax !== undefined ? this._behaviorData.AirUpwardSpeedMax : Number("9000") || 0;
  }
  _setAirUpwardSpeedMax(newValue) {
    this._behaviorData.AirUpwardSpeedMax = newValue;
  }
  _getAirDownwardSpeedMax() {
    return this._behaviorData.AirDownwardSpeedMax !== undefined ? this._behaviorData.AirDownwardSpeedMax : Number("9000") || 0;
  }
  _setAirDownwardSpeedMax(newValue) {
    this._behaviorData.AirDownwardSpeedMax = newValue;
  }
  _getFloorUpwardSpeedMax() {
    return this._behaviorData.FloorUpwardSpeedMax !== undefined ? this._behaviorData.FloorUpwardSpeedMax : Number("9000") || 0;
  }
  _setFloorUpwardSpeedMax(newValue) {
    this._behaviorData.FloorUpwardSpeedMax = newValue;
  }
  _getFloorDownwardSpeedMax() {
    return this._behaviorData.FloorDownwardSpeedMax !== undefined ? this._behaviorData.FloorDownwardSpeedMax : Number("9000") || 0;
  }
  _setFloorDownwardSpeedMax(newValue) {
    this._behaviorData.FloorDownwardSpeedMax = newValue;
  }
}

/**
 * Shared data generated from Smooth platformer camera
 */
gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.SharedData = class SmoothPlatformerCameraSharedData {
  constructor(sharedData) {
    
  }
  
  // Shared properties:
  
}

gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.getSharedData = function(instanceContainer, behaviorName) {
  if (!instanceContainer._SmoothCamera_SmoothPlatformerCameraSharedData) {
    const initialData = instanceContainer.getInitialSharedDataForBehavior(
      behaviorName
    );
    instanceContainer._SmoothCamera_SmoothPlatformerCameraSharedData = new gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.SharedData(
      initialData
    );
  }
  return instanceContainer._SmoothCamera_SmoothPlatformerCameraSharedData;
}

// Methods:
gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext = {};
gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.idToCallbackMap = new Map();
gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1_1final = [];

gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1= [];
gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects2= [];


gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1.length;i<l;++i) {
    if ( !(gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("PlatformerCharacter")).isJumping()) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[k] = gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1.length;i<l;++i) {
    if ( !(gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("PlatformerCharacter")).isFalling()) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[k] = gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1.length = k;
}
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("SmoothCamera")).SetFollowFreeAreaBottom((gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getFloorFollowFreeAreaTop()), eventsFunctionContext);
}
}
{for(var i = 0, len = gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("SmoothCamera")).SetFollowFreeAreaTop((gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getFloorFollowFreeAreaBottom()), eventsFunctionContext);
}
}
{for(var i = 0, len = gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("SmoothCamera")).SetUpwardSpeed((gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getFloorUpwardSpeed()), eventsFunctionContext);
}
}
{for(var i = 0, len = gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("SmoothCamera")).SetDownwardSpeed((gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getFloorDownwardSpeed()), eventsFunctionContext);
}
}
{for(var i = 0, len = gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("SmoothCamera")).SetUpwardSpeedMax((gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getFloorUpwardSpeedMax()), eventsFunctionContext);
}
}
{for(var i = 0, len = gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("SmoothCamera")).SetDownwardSpeedMax((gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getFloorDownwardSpeedMax()), eventsFunctionContext);
}
}
}

}


{

gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1.length = 0;


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1_1final.length = 0;
let isConditionTrue_1 = false;
isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects2);
for (var i = 0, k = 0, l = gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("PlatformerCharacter")).isJumping() ) {
        isConditionTrue_1 = true;
        gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects2[k] = gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects2.length = k;
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
    for (let j = 0, jLen = gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects2.length; j < jLen ; ++j) {
        if ( gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1_1final.indexOf(gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects2[j]) === -1 )
            gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1_1final.push(gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects2[j]);
    }
}
}
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects2);
for (var i = 0, k = 0, l = gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("PlatformerCharacter")).isFalling() ) {
        isConditionTrue_1 = true;
        gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects2[k] = gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects2.length = k;
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
    for (let j = 0, jLen = gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects2.length; j < jLen ; ++j) {
        if ( gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1_1final.indexOf(gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects2[j]) === -1 )
            gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1_1final.push(gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects2[j]);
    }
}
}
{
gdjs.copyArray(gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1_1final, gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1);
}
}
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("SmoothCamera")).SetFollowFreeAreaBottom((gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getAirFollowFreeAreaTop()), eventsFunctionContext);
}
}
{for(var i = 0, len = gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("SmoothCamera")).SetFollowFreeAreaTop((gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getAirFollowFreeAreaBottom()), eventsFunctionContext);
}
}
{for(var i = 0, len = gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("SmoothCamera")).SetUpwardSpeed((gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getAirUpwardSpeed()), eventsFunctionContext);
}
}
{for(var i = 0, len = gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("SmoothCamera")).SetDownwardSpeed((gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getAirDownwardSpeed()), eventsFunctionContext);
}
}
{for(var i = 0, len = gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("SmoothCamera")).SetUpwardSpeedMax((gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getAirUpwardSpeedMax()), eventsFunctionContext);
}
}
{for(var i = 0, len = gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("SmoothCamera")).SetDownwardSpeedMax((gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getAirDownwardSpeedMax()), eventsFunctionContext);
}
}
}

}


};

gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEvents = function(parentEventsFunctionContext) {
this._onceTriggers.startNewFrame();
var that = this;
var runtimeScene = this._runtimeScene;
let scopeInstanceContainer = null;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
, "PlatformerCharacter": this._getPlatformerCharacter()
, "SmoothCamera": this._getSmoothCamera()
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("SmoothCamera"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("SmoothCamera"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        if (!(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName))) {
          eventsFunctionContext._objectArraysMap[objectName].push(object);
        }
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera.prototype.doStepPreEventsContext.GDObjectObjects2.length = 0;


return;
}


gdjs.registerBehavior("SmoothCamera::SmoothPlatformerCamera", gdjs.evtsExt__SmoothCamera__SmoothPlatformerCamera.SmoothPlatformerCamera);
