class Player {
  constructor(roomId, playerId) {
    this.roomId = roomId;
    this.id = playerId;
    this.x = 50 * Math.random() + 295.02;
    this.y = -2328;
    this.z = 50 * Math.random() + 33.78;
    this.rx = 0;
    this.ry = 0;
    this.rz = 0;
    this.motion = 'idle';
    this.action = '';
  }
}