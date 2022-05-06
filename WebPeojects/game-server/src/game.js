const Room = require('./room');

class Game {
  constructor() {
    this.rooms = [];
    this.roomCountMax = 30;
  }

  createRoom () {
    let roomCount = this.rooms.length;
    if (roomCount < this.roomCountMax) {
      let room = new Room(roomCount);
      this.rooms.push(room);
      return room
    }
    return null
  }

  // 删除房间
  removeRoom (roomId) {
    this.rooms = this.rooms.filter(room => room.id !== roomId);
  }

  // 删除玩家，并删除空房间
  removePlayer (player) {
    let room = this.getRoom(player.roomId);
    room.removePlayer(player.id);
    if (room.players.length === 0) {
      this.removeRoom(room.id);
    }
  }

  // 根据玩家ID获取玩家信息
  getPlayer (playerId) {
    let room = this.rooms.find(room => room.players.find(p => p.id === playerId));
    if (room) {
      return room.players.find(p => p.id === playerId)
    }
    return null
  }

  // 更新玩家信息
  updatePlayer (player) {
    let room = this.rooms.find(room => room.players.find(p => p.id === player.id));
    if (room) {
      room.updatePlayer(player);
    }
  }

  // 添加玩家到未满员的房间，若没有，则创建新的房间并加入
  addPlayer (playerId) {
    let room = this.rooms.find(room => room.players.length < room.size);
    let player = null;
    if (room) {
      player = room.createPlayer(playerId);
    } else {
      room = this.createRoom();
      player = room.createPlayer(playerId);
    }
    return player
  }

}