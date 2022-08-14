import { GameEngine } from "./game-engine";
import { WebPlatform } from "./game-engine/platforms/web";
import { WorldMap } from "./scenes/world-map";

const platform = new WebPlatform();
const gameEngine = new GameEngine(platform);
const startingScene = new WorldMap();

gameEngine.setScene(startingScene);
gameEngine.start();
