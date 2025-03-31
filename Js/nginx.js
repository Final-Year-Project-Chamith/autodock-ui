document.getElementById('nginxForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const serverName = document.getElementById('serverName').value.trim();
    const port = document.getElementById('port').value.trim();
    const message = document.getElementById('nginxMessage');
  
    if (!serverName || !port) {
      message.textContent = "❌ Please fill out all fields.";
      return;
    }
  
    message.textContent = "⏳ Sending config to backend...";
  
    const payload = {
      serverName,
      port
    };
  
    try {
      const res = await fetch('https://be.autodock.me/autodock-be/api/generate/nginx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      if (!res.ok) throw new Error("Failed to generate NGINX config");
  
      message.textContent = "✅ NGINX config sent successfully!";
    } catch (err) {
      message.textContent = "❌ " + err.message;
    }
  });
  