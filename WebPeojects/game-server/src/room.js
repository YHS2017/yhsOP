class Room {
  constructor(roomId) {
    this.id = roomId;
    this.size = 30;
    this.players = [];
  }

  createPlayer (playerId) {
    if (this.players.length < this.size) {
      let player = new Player(this.id, playerId);
      this.players.push(player);
      return player
    }
    return null
  }

  removePlayer (playerId) {
    this.players = this.players.filter(player => player.id !== playerId);
  }

  updatePlayer (player) {
    this.players = this.players.map(p => {
      if (p.id === player.id) {
        return { ...p, ...player };
      }
      return p;
    });
  }
}