import { World, Model, ThirdPersonCamera, Skybox, useKeyboard, Editor, Toolbar, SceneGraph } from "lingo3d-react"
import { createRef, useState } from "react"
import socket from "./msgCenter/msgServer";

const App = () => {
  // useKeyboard用于监控当前按键
  const key = useKeyboard()

  // 所有玩家
  const [Users, setUsers] = useState<any>([]);

  // 当前玩家ID
  const [UserId, setUserId] = useState<any>({});

  socket.on("added", (player) => {
    setUsers(users.map((user: any) => { return { ...user, ref: createRef() } }));
  })

  socket.on("removed", (users) => {
    setUsers(users.map((user: any) => { return { ...user, ref: createRef() } }));
  })

  // 前
  if (key.indexOf("w") !== -1) {
    socket.emit("message", { action: 'forward' });
  }

  return (
    <World>
      <Skybox texture="sky2.jpeg" />
      <ThirdPersonCamera active>
        {Users.map((c: any) => <Model
          ref={c.ref}
          key={c.id}
          src="hql.fbx"
          physics="character"
          animations={{ idle: "Standing.fbx", forward: "Running.fbx", jump: "Jumping.fbx" }}
          animation={c.motion}
          x={c.x}
          y={c.y}
          z={c.z}
        />)}
      </ThirdPersonCamera>
      <Model
        src="city.fbx"
        physics="map"
        scale={50}
      >
      </Model>
      <Toolbar />
      <SceneGraph />
      <Editor />
    </World>
  )
}

export default App