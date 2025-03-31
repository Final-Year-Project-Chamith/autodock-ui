async function submitCompose() {
    const repo = document.getElementById('repo').value.trim();
    const name = document.getElementById('service').value.trim();
    const container = document.getElementById('container').value.trim();
    const image = document.getElementById('image').value.trim();
    const ports = document.getElementById('ports').value.trim().split(',').map(p => p.trim());
  
    const status = document.getElementById('composeMessage');
    status.textContent = '⏳ Sending to backend...';
  
    if (!repo || !name || !container || !image || ports.length === 0) {
      status.textContent = '❌ Please fill out all fields';
      return;
    }
  
    const payload = {
      repo,
      services: [
        {
          name,
          container,
          image,
          ports,
          volumes: [],
          env_vars: {}
        }
      ]
    };
  
    try {
      const res = await fetch('https://be.autodock.me/autodock-be/api/generate/file/docker-compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      if (!res.ok) throw new Error('Backend error while generating compose file');
      status.textContent = '✅ Compose file generated successfully!';
    } catch (err) {
      status.textContent = '❌ ' + err.message;
    }
  }
  