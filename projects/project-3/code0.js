gdjs.Game_32SceneCode = {};
gdjs.Game_32SceneCode.localVariables = [];
gdjs.Game_32SceneCode.idToCallbackMap = new Map();
gdjs.Game_32SceneCode.GDBoundaryObjects1_1final = [];

gdjs.Game_32SceneCode.GDEnemyObjects1_1final = [];

gdjs.Game_32SceneCode.GDPlayerObjects1_1final = [];

gdjs.Game_32SceneCode.GDPlayerObjects1= [];
gdjs.Game_32SceneCode.GDPlayerObjects2= [];
gdjs.Game_32SceneCode.GDPlatform_9595BridgeObjects1= [];
gdjs.Game_32SceneCode.GDPlatform_9595BridgeObjects2= [];
gdjs.Game_32SceneCode.GDPlatform_9595MovingObjects1= [];
gdjs.Game_32SceneCode.GDPlatform_9595MovingObjects2= [];
gdjs.Game_32SceneCode.GDCoinObjects1= [];
gdjs.Game_32SceneCode.GDCoinObjects2= [];
gdjs.Game_32SceneCode.GDEnemyObjects1= [];
gdjs.Game_32SceneCode.GDEnemyObjects2= [];
gdjs.Game_32SceneCode.GDBoundaryObjects1= [];
gdjs.Game_32SceneCode.GDBoundaryObjects2= [];
gdjs.Game_32SceneCode.GDTutorialObjects1= [];
gdjs.Game_32SceneCode.GDTutorialObjects2= [];
gdjs.Game_32SceneCode.GDUI_9595ScoreObjects1= [];
gdjs.Game_32SceneCode.GDUI_9595ScoreObjects2= [];
gdjs.Game_32SceneCode.GDLeftArrowRoundButtonObjects1= [];
gdjs.Game_32SceneCode.GDLeftArrowRoundButtonObjects2= [];
gdjs.Game_32SceneCode.GDRightArrowRoundButtonObjects1= [];
gdjs.Game_32SceneCode.GDRightArrowRoundButtonObjects2= [];
gdjs.Game_32SceneCode.GDTopArrowRoundButtonObjects1= [];
gdjs.Game_32SceneCode.GDTopArrowRoundButtonObjects2= [];
gdjs.Game_32SceneCode.GDTilemap_9595LevelObjects1= [];
gdjs.Game_32SceneCode.GDTilemap_9595LevelObjects2= [];
gdjs.Game_32SceneCode.GDBackgroundObjects1= [];
gdjs.Game_32SceneCode.GDBackgroundObjects2= [];


gdjs.Game_32SceneCode.mapOfGDgdjs_9546Game_959532SceneCode_9546GDPlayerObjects1Objects = Hashtable.newFrom({"Player": gdjs.Game_32SceneCode.GDPlayerObjects1});
gdjs.Game_32SceneCode.mapOfGDgdjs_9546Game_959532SceneCode_9546GDCoinObjects1Objects = Hashtable.newFrom({"Coin": gdjs.Game_32SceneCode.GDCoinObjects1});
gdjs.Game_32SceneCode.eventsList0 = function(runtimeScene) {

{

/* Reuse gdjs.Game_32SceneCode.GDEnemyObjects1 */
gdjs.copyArray(runtimeScene.getObjects("Tilemap_Level"), gdjs.Game_32SceneCode.GDTilemap_9595LevelObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.Game_32SceneCode.GDTilemap_9595LevelObjects1.length;i<l;++i) {
    if ( gdjs.Game_32SceneCode.GDTilemap_9595LevelObjects1[i].isCollidingWithPoint((( gdjs.Game_32SceneCode.GDEnemyObjects1.length === 0 ) ? 0 :gdjs.Game_32SceneCode.GDEnemyObjects1[0].getPointX("Checker")), (( gdjs.Game_32SceneCode.GDEnemyObjects1.length === 0 ) ? 0 :gdjs.Game_32SceneCode.GDEnemyObjects1[0].getPointY("Checker"))) ) {
        isConditionTrue_0 = true;
        gdjs.Game_32SceneCode.GDTilemap_9595LevelObjects1[k] = gdjs.Game_32SceneCode.GDTilemap_9595LevelObjects1[i];
        ++k;
    }
}
gdjs.Game_32SceneCode.GDTilemap_9595LevelObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.Game_32SceneCode.GDEnemyObjects1 */
{for(var i = 0, len = gdjs.Game_32SceneCode.GDEnemyObjects1.length ;i < len;++i) {
    gdjs.Game_32SceneCode.GDEnemyObjects1[i].getBehavior("Flippable").flipX(false);
}
}
}

}


};gdjs.Game_32SceneCode.eventsList1 = function(runtimeScene) {

{

/* Reuse gdjs.Game_32SceneCode.GDEnemyObjects1 */
gdjs.copyArray(runtimeScene.getObjects("Tilemap_Level"), gdjs.Game_32SceneCode.GDTilemap_9595LevelObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.Game_32SceneCode.GDTilemap_9595LevelObjects1.length;i<l;++i) {
    if ( gdjs.Game_32SceneCode.GDTilemap_9595LevelObjects1[i].isCollidingWithPoint((( gdjs.Game_32SceneCode.GDEnemyObjects1.length === 0 ) ? 0 :gdjs.Game_32SceneCode.GDEnemyObjects1[0].getPointX("Checker")), (( gdjs.Game_32SceneCode.GDEnemyObjects1.length === 0 ) ? 0 :gdjs.Game_32SceneCode.GDEnemyObjects1[0].getPointY("Checker"))) ) {
        isConditionTrue_0 = true;
        gdjs.Game_32SceneCode.GDTilemap_9595LevelObjects1[k] = gdjs.Game_32SceneCode.GDTilemap_9595LevelObjects1[i];
        ++k;
    }
}
gdjs.Game_32SceneCode.GDTilemap_9595LevelObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.Game_32SceneCode.GDEnemyObjects1 */
{for(var i = 0, len = gdjs.Game_32SceneCode.GDEnemyObjects1.length ;i < len;++i) {
    gdjs.Game_32SceneCode.GDEnemyObjects1[i].getBehavior("Flippable").flipX(true);
}
}
}

}


};gdjs.Game_32SceneCode.mapOfGDgdjs_9546Game_959532SceneCode_9546GDPlayerObjects2Objects = Hashtable.newFrom({"Player": gdjs.Game_32SceneCode.GDPlayerObjects2});
gdjs.Game_32SceneCode.mapOfGDgdjs_9546Game_959532SceneCode_9546GDEnemyObjects2Objects = Hashtable.newFrom({"Enemy": gdjs.Game_32SceneCode.GDEnemyObjects2});
gdjs.Game_32SceneCode.asyncCallback12989884 = function (runtimeScene, asyncObjectsList) {
asyncObjectsList.restoreLocalVariablesContainers(gdjs.Game_32SceneCode.localVariables);
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "Game Scene", false);
}
gdjs.Game_32SceneCode.localVariables.length = 0;
}
gdjs.Game_32SceneCode.idToCallbackMap.set(12989884, gdjs.Game_32SceneCode.asyncCallback12989884);
gdjs.Game_32SceneCode.eventsList2 = function(runtimeScene) {

{


{
{
const asyncObjectsList = new gdjs.LongLivedObjectsList();
asyncObjectsList.backupLocalVariablesContainers(gdjs.Game_32SceneCode.localVariables);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(2), (runtimeScene) => (gdjs.Game_32SceneCode.asyncCallback12989884(runtimeScene, asyncObjectsList)), 12989884, asyncObjectsList);
}
}

}


};gdjs.Game_32SceneCode.eventsList3 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("Player"), gdjs.Game_32SceneCode.GDPlayerObjects1);
{gdjs.evtTools.camera.setCameraZoom(runtimeScene, 4, "", 0);
}
{gdjs.evtTools.camera.centerCamera(runtimeScene, (gdjs.Game_32SceneCode.GDPlayerObjects1.length !== 0 ? gdjs.Game_32SceneCode.GDPlayerObjects1[0] : null), true, "", 0);
}
{gdjs.evtTools.sound.playMusicOnChannel(runtimeScene, "time_for_adventure.mp3", 0, true, 40, 1);
}
}

}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(runtimeScene.getObjects("Boundary"), gdjs.Game_32SceneCode.GDBoundaryObjects1);
gdjs.copyArray(runtimeScene.getObjects("Player"), gdjs.Game_32SceneCode.GDPlayerObjects1);
{gdjs.evtTools.camera.clampCamera(runtimeScene, (( gdjs.Game_32SceneCode.GDPlayerObjects1.length === 0 ) ? 0 :gdjs.Game_32SceneCode.GDPlayerObjects1[0].getPointX("")) - 1000, (( gdjs.Game_32SceneCode.GDPlayerObjects1.length === 0 ) ? 0 :gdjs.Game_32SceneCode.GDPlayerObjects1[0].getPointY("")) - 1000, (( gdjs.Game_32SceneCode.GDPlayerObjects1.length === 0 ) ? 0 :gdjs.Game_32SceneCode.GDPlayerObjects1[0].getPointX("")) + 1000, (( gdjs.Game_32SceneCode.GDBoundaryObjects1.length === 0 ) ? 0 :gdjs.Game_32SceneCode.GDBoundaryObjects1[0].getPointY("")), "", 0);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("Coin"), gdjs.Game_32SceneCode.GDCoinObjects1);
gdjs.copyArray(runtimeScene.getObjects("Player"), gdjs.Game_32SceneCode.GDPlayerObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.object.hitBoxesCollisionTest(gdjs.Game_32SceneCode.mapOfGDgdjs_9546Game_959532SceneCode_9546GDPlayerObjects1Objects, gdjs.Game_32SceneCode.mapOfGDgdjs_9546Game_959532SceneCode_9546GDCoinObjects1Objects, false, runtimeScene, false);
if (isConditionTrue_0) {
/* Reuse gdjs.Game_32SceneCode.GDCoinObjects1 */
gdjs.copyArray(runtimeScene.getObjects("UI_Score"), gdjs.Game_32SceneCode.GDUI_9595ScoreObjects1);
{for(var i = 0, len = gdjs.Game_32SceneCode.GDCoinObjects1.length ;i < len;++i) {
    gdjs.Game_32SceneCode.GDCoinObjects1[i].deleteFromScene(runtimeScene);
}
}
{runtimeScene.getScene().getVariables().getFromIndex(0).add(1);
}
{for(var i = 0, len = gdjs.Game_32SceneCode.GDUI_9595ScoreObjects1.length ;i < len;++i) {
    gdjs.Game_32SceneCode.GDUI_9595ScoreObjects1[i].getBehavior("Text").setText("Score: " + runtimeScene.getScene().getVariables().getFromIndex(0).getAsString());
}
}
{gdjs.evtTools.sound.playSound(runtimeScene, "coin.wav", false, 50, 1);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("Enemy"), gdjs.Game_32SceneCode.GDEnemyObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.Game_32SceneCode.GDEnemyObjects1.length;i<l;++i) {
    if ( gdjs.Game_32SceneCode.GDEnemyObjects1[i].getBehavior("Flippable").isFlippedX() ) {
        isConditionTrue_0 = true;
        gdjs.Game_32SceneCode.GDEnemyObjects1[k] = gdjs.Game_32SceneCode.GDEnemyObjects1[i];
        ++k;
    }
}
gdjs.Game_32SceneCode.GDEnemyObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.Game_32SceneCode.GDEnemyObjects1 */
{for(var i = 0, len = gdjs.Game_32SceneCode.GDEnemyObjects1.length ;i < len;++i) {
    gdjs.Game_32SceneCode.GDEnemyObjects1[i].getBehavior("PlatformerObject").simulateLeftKey();
}
}

{ //Subevents
gdjs.Game_32SceneCode.eventsList0(runtimeScene);} //End of subevents
}

}


{

gdjs.copyArray(runtimeScene.getObjects("Enemy"), gdjs.Game_32SceneCode.GDEnemyObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.Game_32SceneCode.GDEnemyObjects1.length;i<l;++i) {
    if ( !(gdjs.Game_32SceneCode.GDEnemyObjects1[i].getBehavior("Flippable").isFlippedX()) ) {
        isConditionTrue_0 = true;
        gdjs.Game_32SceneCode.GDEnemyObjects1[k] = gdjs.Game_32SceneCode.GDEnemyObjects1[i];
        ++k;
    }
}
gdjs.Game_32SceneCode.GDEnemyObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.Game_32SceneCode.GDEnemyObjects1 */
{for(var i = 0, len = gdjs.Game_32SceneCode.GDEnemyObjects1.length ;i < len;++i) {
    gdjs.Game_32SceneCode.GDEnemyObjects1[i].getBehavior("PlatformerObject").simulateRightKey();
}
}

{ //Subevents
gdjs.Game_32SceneCode.eventsList1(runtimeScene);} //End of subevents
}

}


{

gdjs.Game_32SceneCode.GDBoundaryObjects1.length = 0;

gdjs.Game_32SceneCode.GDEnemyObjects1.length = 0;

gdjs.Game_32SceneCode.GDPlayerObjects1.length = 0;


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{gdjs.Game_32SceneCode.GDBoundaryObjects1_1final.length = 0;
gdjs.Game_32SceneCode.GDEnemyObjects1_1final.length = 0;
gdjs.Game_32SceneCode.GDPlayerObjects1_1final.length = 0;
let isConditionTrue_1 = false;
isConditionTrue_0 = false;
{
gdjs.copyArray(runtimeScene.getObjects("Enemy"), gdjs.Game_32SceneCode.GDEnemyObjects2);
gdjs.copyArray(runtimeScene.getObjects("Player"), gdjs.Game_32SceneCode.GDPlayerObjects2);
isConditionTrue_1 = gdjs.evtTools.object.hitBoxesCollisionTest(gdjs.Game_32SceneCode.mapOfGDgdjs_9546Game_959532SceneCode_9546GDPlayerObjects2Objects, gdjs.Game_32SceneCode.mapOfGDgdjs_9546Game_959532SceneCode_9546GDEnemyObjects2Objects, false, runtimeScene, false);
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
    for (let j = 0, jLen = gdjs.Game_32SceneCode.GDEnemyObjects2.length; j < jLen ; ++j) {
        if ( gdjs.Game_32SceneCode.GDEnemyObjects1_1final.indexOf(gdjs.Game_32SceneCode.GDEnemyObjects2[j]) === -1 )
            gdjs.Game_32SceneCode.GDEnemyObjects1_1final.push(gdjs.Game_32SceneCode.GDEnemyObjects2[j]);
    }
    for (let j = 0, jLen = gdjs.Game_32SceneCode.GDPlayerObjects2.length; j < jLen ; ++j) {
        if ( gdjs.Game_32SceneCode.GDPlayerObjects1_1final.indexOf(gdjs.Game_32SceneCode.GDPlayerObjects2[j]) === -1 )
            gdjs.Game_32SceneCode.GDPlayerObjects1_1final.push(gdjs.Game_32SceneCode.GDPlayerObjects2[j]);
    }
}
}
{
gdjs.copyArray(runtimeScene.getObjects("Boundary"), gdjs.Game_32SceneCode.GDBoundaryObjects2);
gdjs.copyArray(runtimeScene.getObjects("Player"), gdjs.Game_32SceneCode.GDPlayerObjects2);
for (var i = 0, k = 0, l = gdjs.Game_32SceneCode.GDPlayerObjects2.length;i<l;++i) {
    if ( gdjs.Game_32SceneCode.GDPlayerObjects2[i].getY() > (( gdjs.Game_32SceneCode.GDBoundaryObjects2.length === 0 ) ? 0 :gdjs.Game_32SceneCode.GDBoundaryObjects2[0].getPointY("")) ) {
        isConditionTrue_1 = true;
        gdjs.Game_32SceneCode.GDPlayerObjects2[k] = gdjs.Game_32SceneCode.GDPlayerObjects2[i];
        ++k;
    }
}
gdjs.Game_32SceneCode.GDPlayerObjects2.length = k;
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
    for (let j = 0, jLen = gdjs.Game_32SceneCode.GDBoundaryObjects2.length; j < jLen ; ++j) {
        if ( gdjs.Game_32SceneCode.GDBoundaryObjects1_1final.indexOf(gdjs.Game_32SceneCode.GDBoundaryObjects2[j]) === -1 )
            gdjs.Game_32SceneCode.GDBoundaryObjects1_1final.push(gdjs.Game_32SceneCode.GDBoundaryObjects2[j]);
    }
    for (let j = 0, jLen = gdjs.Game_32SceneCode.GDPlayerObjects2.length; j < jLen ; ++j) {
        if ( gdjs.Game_32SceneCode.GDPlayerObjects1_1final.indexOf(gdjs.Game_32SceneCode.GDPlayerObjects2[j]) === -1 )
            gdjs.Game_32SceneCode.GDPlayerObjects1_1final.push(gdjs.Game_32SceneCode.GDPlayerObjects2[j]);
    }
}
}
{
gdjs.copyArray(gdjs.Game_32SceneCode.GDBoundaryObjects1_1final, gdjs.Game_32SceneCode.GDBoundaryObjects1);
gdjs.copyArray(gdjs.Game_32SceneCode.GDEnemyObjects1_1final, gdjs.Game_32SceneCode.GDEnemyObjects1);
gdjs.copyArray(gdjs.Game_32SceneCode.GDPlayerObjects1_1final, gdjs.Game_32SceneCode.GDPlayerObjects1);
}
}
if (isConditionTrue_0) {
/* Reuse gdjs.Game_32SceneCode.GDPlayerObjects1 */
{for(var i = 0, len = gdjs.Game_32SceneCode.GDPlayerObjects1.length ;i < len;++i) {
    gdjs.Game_32SceneCode.GDPlayerObjects1[i].getBehavior("Animation").setAnimationName("Death");
}
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("Player"), gdjs.Game_32SceneCode.GDPlayerObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.Game_32SceneCode.GDPlayerObjects1.length;i<l;++i) {
    if ( gdjs.Game_32SceneCode.GDPlayerObjects1[i].getBehavior("Animation").getAnimationName() == "Death" ) {
        isConditionTrue_0 = true;
        gdjs.Game_32SceneCode.GDPlayerObjects1[k] = gdjs.Game_32SceneCode.GDPlayerObjects1[i];
        ++k;
    }
}
gdjs.Game_32SceneCode.GDPlayerObjects1.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(12990324);
}
}
if (isConditionTrue_0) {
/* Reuse gdjs.Game_32SceneCode.GDPlayerObjects1 */
{gdjs.evtTools.sound.playSound(runtimeScene, "hurt.wav", false, 50, 1);
}
{for(var i = 0, len = gdjs.Game_32SceneCode.GDPlayerObjects1.length ;i < len;++i) {
    gdjs.Game_32SceneCode.GDPlayerObjects1[i].activateBehavior("PlatformerObject", false);
}
}

{ //Subevents
gdjs.Game_32SceneCode.eventsList2(runtimeScene);} //End of subevents
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = !(gdjs.evtTools.systemInfo.hasTouchScreen(runtimeScene));
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("LeftArrowRoundButton"), gdjs.Game_32SceneCode.GDLeftArrowRoundButtonObjects1);
gdjs.copyArray(runtimeScene.getObjects("RightArrowRoundButton"), gdjs.Game_32SceneCode.GDRightArrowRoundButtonObjects1);
gdjs.copyArray(runtimeScene.getObjects("TopArrowRoundButton"), gdjs.Game_32SceneCode.GDTopArrowRoundButtonObjects1);
{for(var i = 0, len = gdjs.Game_32SceneCode.GDLeftArrowRoundButtonObjects1.length ;i < len;++i) {
    gdjs.Game_32SceneCode.GDLeftArrowRoundButtonObjects1[i].deleteFromScene(runtimeScene);
}
for(var i = 0, len = gdjs.Game_32SceneCode.GDRightArrowRoundButtonObjects1.length ;i < len;++i) {
    gdjs.Game_32SceneCode.GDRightArrowRoundButtonObjects1[i].deleteFromScene(runtimeScene);
}
for(var i = 0, len = gdjs.Game_32SceneCode.GDTopArrowRoundButtonObjects1.length ;i < len;++i) {
    gdjs.Game_32SceneCode.GDTopArrowRoundButtonObjects1[i].deleteFromScene(runtimeScene);
}
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("LeftArrowRoundButton"), gdjs.Game_32SceneCode.GDLeftArrowRoundButtonObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.Game_32SceneCode.GDLeftArrowRoundButtonObjects1.length;i<l;++i) {
    if ( gdjs.Game_32SceneCode.GDLeftArrowRoundButtonObjects1[i].getBehavior("ButtonFSM").IsPressed(null) ) {
        isConditionTrue_0 = true;
        gdjs.Game_32SceneCode.GDLeftArrowRoundButtonObjects1[k] = gdjs.Game_32SceneCode.GDLeftArrowRoundButtonObjects1[i];
        ++k;
    }
}
gdjs.Game_32SceneCode.GDLeftArrowRoundButtonObjects1.length = k;
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("Player"), gdjs.Game_32SceneCode.GDPlayerObjects1);
{for(var i = 0, len = gdjs.Game_32SceneCode.GDPlayerObjects1.length ;i < len;++i) {
    gdjs.Game_32SceneCode.GDPlayerObjects1[i].getBehavior("PlatformerObject").simulateControl("Left");
}
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("RightArrowRoundButton"), gdjs.Game_32SceneCode.GDRightArrowRoundButtonObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.Game_32SceneCode.GDRightArrowRoundButtonObjects1.length;i<l;++i) {
    if ( gdjs.Game_32SceneCode.GDRightArrowRoundButtonObjects1[i].getBehavior("ButtonFSM").IsPressed(null) ) {
        isConditionTrue_0 = true;
        gdjs.Game_32SceneCode.GDRightArrowRoundButtonObjects1[k] = gdjs.Game_32SceneCode.GDRightArrowRoundButtonObjects1[i];
        ++k;
    }
}
gdjs.Game_32SceneCode.GDRightArrowRoundButtonObjects1.length = k;
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("Player"), gdjs.Game_32SceneCode.GDPlayerObjects1);
{for(var i = 0, len = gdjs.Game_32SceneCode.GDPlayerObjects1.length ;i < len;++i) {
    gdjs.Game_32SceneCode.GDPlayerObjects1[i].getBehavior("PlatformerObject").simulateControl("Right");
}
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("TopArrowRoundButton"), gdjs.Game_32SceneCode.GDTopArrowRoundButtonObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.Game_32SceneCode.GDTopArrowRoundButtonObjects1.length;i<l;++i) {
    if ( gdjs.Game_32SceneCode.GDTopArrowRoundButtonObjects1[i].getBehavior("ButtonFSM").IsPressed(null) ) {
        isConditionTrue_0 = true;
        gdjs.Game_32SceneCode.GDTopArrowRoundButtonObjects1[k] = gdjs.Game_32SceneCode.GDTopArrowRoundButtonObjects1[i];
        ++k;
    }
}
gdjs.Game_32SceneCode.GDTopArrowRoundButtonObjects1.length = k;
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("Player"), gdjs.Game_32SceneCode.GDPlayerObjects1);
{for(var i = 0, len = gdjs.Game_32SceneCode.GDPlayerObjects1.length ;i < len;++i) {
    gdjs.Game_32SceneCode.GDPlayerObjects1[i].getBehavior("PlatformerObject").simulateControl("Jump");
}
}
}

}


};

gdjs.Game_32SceneCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.Game_32SceneCode.GDPlayerObjects1.length = 0;
gdjs.Game_32SceneCode.GDPlayerObjects2.length = 0;
gdjs.Game_32SceneCode.GDPlatform_9595BridgeObjects1.length = 0;
gdjs.Game_32SceneCode.GDPlatform_9595BridgeObjects2.length = 0;
gdjs.Game_32SceneCode.GDPlatform_9595MovingObjects1.length = 0;
gdjs.Game_32SceneCode.GDPlatform_9595MovingObjects2.length = 0;
gdjs.Game_32SceneCode.GDCoinObjects1.length = 0;
gdjs.Game_32SceneCode.GDCoinObjects2.length = 0;
gdjs.Game_32SceneCode.GDEnemyObjects1.length = 0;
gdjs.Game_32SceneCode.GDEnemyObjects2.length = 0;
gdjs.Game_32SceneCode.GDBoundaryObjects1.length = 0;
gdjs.Game_32SceneCode.GDBoundaryObjects2.length = 0;
gdjs.Game_32SceneCode.GDTutorialObjects1.length = 0;
gdjs.Game_32SceneCode.GDTutorialObjects2.length = 0;
gdjs.Game_32SceneCode.GDUI_9595ScoreObjects1.length = 0;
gdjs.Game_32SceneCode.GDUI_9595ScoreObjects2.length = 0;
gdjs.Game_32SceneCode.GDLeftArrowRoundButtonObjects1.length = 0;
gdjs.Game_32SceneCode.GDLeftArrowRoundButtonObjects2.length = 0;
gdjs.Game_32SceneCode.GDRightArrowRoundButtonObjects1.length = 0;
gdjs.Game_32SceneCode.GDRightArrowRoundButtonObjects2.length = 0;
gdjs.Game_32SceneCode.GDTopArrowRoundButtonObjects1.length = 0;
gdjs.Game_32SceneCode.GDTopArrowRoundButtonObjects2.length = 0;
gdjs.Game_32SceneCode.GDTilemap_9595LevelObjects1.length = 0;
gdjs.Game_32SceneCode.GDTilemap_9595LevelObjects2.length = 0;
gdjs.Game_32SceneCode.GDBackgroundObjects1.length = 0;
gdjs.Game_32SceneCode.GDBackgroundObjects2.length = 0;

gdjs.Game_32SceneCode.eventsList3(runtimeScene);
gdjs.Game_32SceneCode.GDPlayerObjects1.length = 0;
gdjs.Game_32SceneCode.GDPlayerObjects2.length = 0;
gdjs.Game_32SceneCode.GDPlatform_9595BridgeObjects1.length = 0;
gdjs.Game_32SceneCode.GDPlatform_9595BridgeObjects2.length = 0;
gdjs.Game_32SceneCode.GDPlatform_9595MovingObjects1.length = 0;
gdjs.Game_32SceneCode.GDPlatform_9595MovingObjects2.length = 0;
gdjs.Game_32SceneCode.GDCoinObjects1.length = 0;
gdjs.Game_32SceneCode.GDCoinObjects2.length = 0;
gdjs.Game_32SceneCode.GDEnemyObjects1.length = 0;
gdjs.Game_32SceneCode.GDEnemyObjects2.length = 0;
gdjs.Game_32SceneCode.GDBoundaryObjects1.length = 0;
gdjs.Game_32SceneCode.GDBoundaryObjects2.length = 0;
gdjs.Game_32SceneCode.GDTutorialObjects1.length = 0;
gdjs.Game_32SceneCode.GDTutorialObjects2.length = 0;
gdjs.Game_32SceneCode.GDUI_9595ScoreObjects1.length = 0;
gdjs.Game_32SceneCode.GDUI_9595ScoreObjects2.length = 0;
gdjs.Game_32SceneCode.GDLeftArrowRoundButtonObjects1.length = 0;
gdjs.Game_32SceneCode.GDLeftArrowRoundButtonObjects2.length = 0;
gdjs.Game_32SceneCode.GDRightArrowRoundButtonObjects1.length = 0;
gdjs.Game_32SceneCode.GDRightArrowRoundButtonObjects2.length = 0;
gdjs.Game_32SceneCode.GDTopArrowRoundButtonObjects1.length = 0;
gdjs.Game_32SceneCode.GDTopArrowRoundButtonObjects2.length = 0;
gdjs.Game_32SceneCode.GDTilemap_9595LevelObjects1.length = 0;
gdjs.Game_32SceneCode.GDTilemap_9595LevelObjects2.length = 0;
gdjs.Game_32SceneCode.GDBackgroundObjects1.length = 0;
gdjs.Game_32SceneCode.GDBackgroundObjects2.length = 0;


return;

}

gdjs['Game_32SceneCode'] = gdjs.Game_32SceneCode;
