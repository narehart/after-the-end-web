import { WebPlatform } from "./game-engine/platforms/web";
import { GameEngine } from "./game-engine";
import { WorldMap } from "./scenes/world-map";

const platform = new WebPlatform();
platform.renderer.addFonts([
  { name: "PixelFont", src: "./src/fonts/04b_03/04b_03__.TTF" },
]);

const gameEngine = new GameEngine(platform);
const startingScene = new WorldMap();

gameEngine.setScene(startingScene);
gameEngine.start();
