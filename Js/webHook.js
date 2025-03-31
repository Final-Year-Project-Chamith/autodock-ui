document.getElementById('webhookForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const formData = {
      owner: document.getElementById('owner').value,
      repo: document.getElementById('repo').value,
      token: document.getElementById('token').value,
      webhookUrl: document.getElementById('webhookUrl').value,
      secret: document.getElementById('secret').value,
    };
  
    const status = document.getElementById('statusMessage');
    status.textContent = '⏳ Creating webhook...';
  
    try {
      const res = await fetch('https://be.autodock.me/autodock-be/api/CreateWebHook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
  
      if (!res.ok) throw new Error('Failed to create webhook');
      status.textContent = '✅ Webhook created successfully!';
    } catch (err) {
      status.textContent = '❌ ' + err.message;
    }
  });
  