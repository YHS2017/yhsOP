import { World, Model, ThirdPersonCamera, Skybox, Keyboard, usePreload, Editor, Toolbar, SceneGraph, useLoop } from "lingo3d-react"
import { createRef, useEffect, useState } from "react"
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000/');

const App = () => {
  const progress = usePreload([
    "hql.fbx",
    "Standing.fbx",
    "Running.fbx",
    "Jumping.fbx",
    "city.fbx",
    "sky2.jpeg"
  ], "65.7mb")

  // 其他玩家
  const [Players, setPlayers] = useState<any[]>([]);

  // 当前玩家
  const [Me, setMe] = useState<any>({});

  const update = (player: any) => {
    if (Me.id === player.id) {
      setMe({ ...Me, ...player });
    } else {
      console.log(Me, player);
      let players = Players;
      if (players.find((p: any) => p.id === player.id) !== undefined) {
        players = players.map((p: any) => {
          if (p.id === player.id) {
            return { ...p, ...player };
          }
          return p;
        });
      } else {
        players.push({ ...player, ref: createRef() });
      }
      setPlayers(players);
    }
  }

  useEffect(() => {

    socket.on("added", (player) => {
      setMe({ ...player, ref: createRef() });
    })

    socket.on("leaved", (playerid) => {
      setPlayers(Players.filter((player: any) => player.id !== playerid));
    })

    socket.on("update", (player) => {
      update(player);
    })
  }, [Players, Me, update]);

  const onkeydown = (key: any) => {
    if (key === "w") {
      socket.emit("update", { id: Me.id, roomId: Me.roomId, motion: "run" });
    }
  }

  const onkeyup = (key: any) => {
    if (key === "w") {
      socket.emit("update", { id: Me.id, roomId: Me.roomId, motion: "idle" });
    }
  }

  useLoop(() => {
    if (Me.ref) {
      if (Me.motion === "run") {
        Me.ref.current.moveForward(-2);
      }
    }
    Players.forEach((player: any) => {
      if (player.motion === "run" && player.ref.current) {
        player.ref.current.moveForward(-2);
      }
    })
  })

  if (progress < 100)
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        left: 0,
        top: 0,
        backgroundColor: "black",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        loading {Math.round(progress)}%
      </div>
    )

  return (
    <>
      <World>
        <Skybox texture="sky2.jpeg" />
        <ThirdPersonCamera active mouseControl>
          <Model
            ref={Me.ref}
            src="hql.fbx"
            physics="character"
            animations={{ idle: "Standing.fbx", run: "Running.fbx", jump: "Jumping.fbx" }}
            animation={Me.motion}
            x={Me.x}
            y={Me.y}
            z={Me.z}
          />
        </ThirdPersonCamera>
        {Players.map((player: any) => <Model
          ref={player.ref}
          key={player.id}
          src="hql.fbx"
          physics="character"
          animations={{ idle: "Standing.fbx", run: "Running.fbx", jump: "Jumping.fbx" }}
          animation={player.motion}
          x={player.x}
          y={player.y}
          z={player.z}
        />)}
        <Model src="city.fbx" physics="map" scale={50} />
        {/* <Toolbar />
      <SceneGraph />
      <Editor /> */}
      </World>
      <Keyboard onKeyDown={onkeydown} onKeyUp={onkeyup} />
    </>
  )
}

export default App