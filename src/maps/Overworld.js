import Map from "./Map";

class Overworld extends Map {
  constructor() {
    super('scene-overworld', {
      tilemapKey: 'map-overworld',
      tilesetKey: 'postapo',
      tilesetName: 'DEMO',
      musicKey: 'music-flaremain'
    });
  }
}

export default Overworld;