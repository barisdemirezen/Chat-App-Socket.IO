const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

let connected = [];

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

io.on("connection", (socket) => {
  socket.on("userJoined", (user) => {
    let newUser = { id: socket.id, name: user };
    connected.push(newUser);
    io.emit("joined", user);
  });
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    let leavedIndex = connected.findIndex((e) => e.id == socket.id);
    if (leavedIndex != null) {
      io.emit("leaved", connected[leavedIndex].name);
      connected.splice(leavedIndex, 1);
      io.emit("userList", connected);
    }
  });
});

io.on("connection", (socket) => {
  socket.on("updateUsers", () => {
    io.emit("userList", connected);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
