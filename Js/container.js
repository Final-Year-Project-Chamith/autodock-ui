const output = document.getElementById("logOutput");
const params = new URLSearchParams(window.location.search);
const containerId = params.get("id");

if (!containerId) {
  output.textContent = "❌ No containerId provided in the URL.";
} else {
  const ws = new WebSocket(`wss://be.autodock.me/autodock-be/api/get/container/logs/?containerId=${containerId}`);

  ws.onopen = () => {
    output.textContent = `🔌 Connected to container: ${containerId}\n\n`;
  };

  ws.onmessage = (event) => {
    output.textContent += event.data;
    output.scrollTop = output.scrollHeight;
  };

  ws.onerror = (err) => {
    output.textContent += "\n❌ WebSocket error occurred.";
    console.error("WebSocket error:", err);
  };

  ws.onclose = () => {
    output.textContent += "\n🔌 Connection closed.";
  };
}
