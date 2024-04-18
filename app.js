const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
app.use(express.json());

const PORT = 8000;
let target = "http://localhost:3000";
let proxyMiddleware = createProxyMiddleware({
  target: target,
  changeOrigin: true,
});

app.put("/proxy-target", (req, res) => {
  const { target: newTarget } = req.body;
  if (newTarget) {
    target = newTarget;
    proxyMiddleware = createProxyMiddleware({
      target: target,
      changeOrigin: true,
    });
    res.json({ message: "Proxy target updated" });
  } else {
    res.status(400).json({ message: "Invalid target" });
  }
});

app.use((req, res, next) => {
  proxyMiddleware(req, res, next);
});

app.listen(PORT, () => {
  console.log(`Proxy server started on port ${PORT}`);
});
