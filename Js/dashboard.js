// WebSocket for real-time metrics
const ws = new WebSocket("wss://be.autodock.me/autodock-be/api/get/metrices");

ws.onopen = () => {
  console.log("🔌 Connected to metrics WebSocket");
};

ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    if (data.cpuUsage !== undefined) {
      document.getElementById("cpu").textContent = data.cpuUsage.toFixed(1) + " %";
    }
    if (data.memoryUsage !== undefined) {
      document.getElementById("memory").textContent = data.memoryUsage.toFixed(1) + " %";
    }
    if (data.diskUsage !== undefined) {
      document.getElementById("disk").textContent = data.diskUsage.toFixed(1) + " %";
    }
  } catch (err) {
    console.error("❌ Failed to parse metrics:", err);
  }
};

ws.onerror = (err) => {
  console.error("WebSocket error:", err);
};

ws.onclose = () => {
  console.warn("WebSocket connection closed");
};

// Fetch Docker container list and populate table
async function loadContainers() {
  const tbody = document.getElementById('containersBody');

  try {
    const res = await fetch('https://be.autodock.me/autodock-be/api/GetAllDockerContainers');
    let containers = await res.json();

    if (typeof containers === 'string') {
      containers = JSON.parse(containers);
    }

    if (!Array.isArray(containers) || containers.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No containers found</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    containers.forEach(container => {
        const name = container.Names?.[0]?.replace('/', '') || 'Unnamed';
        const image = container.Image || 'N/A';
        const status = container.Status || 'Unknown';
        const ip = Object.values(container.NetworkSettings?.Networks || {})[0]?.IPAddress || '-';
        const ports = container.Ports?.map(p => {
          return p.PublicPort ? `${p.PublicPort}:${p.PrivatePort}` : `${p.PrivatePort}`;
        }).join(', ') || '-';
      
        const row = document.createElement('tr');
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => {
          window.location.href = `pages/container.html?id=${container.Id}`;
        });
      
        row.innerHTML = `
          <td>${name}</td>
          <td>${image}</td>
          <td>${status}</td>
          <td>${ip}</td>
          <td>${ports}</td>
        `;
        tbody.appendChild(row);
      });
      

  } catch (err) {
    console.error("❌ Failed to load containers:", err);
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Error loading containers</td></tr>`;
  }
}

// Load containers when page loads
window.addEventListener('DOMContentLoaded', loadContainers);
