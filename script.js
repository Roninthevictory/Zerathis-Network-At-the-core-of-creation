const displayHost = "ZerathisNetwork.enderman.cloud";
const serverIpEl = document.getElementById('serverIp');
const playersEl = document.getElementById('players');
const maxPlayersEl = document.getElementById('maxPlayers');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const serverVersionEl = document.getElementById('serverVersion');
const copyBtn = document.getElementById('copyIp');

if (serverIpEl) serverIpEl.textContent = displayHost;

async function fetchStatus(host) {
  try {
    const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://mcapi.us/server/status?ip=${host}`)}`;
    const resp = await fetch(proxy);
    if (!resp.ok) return null;
    const textData = await resp.json();
    return JSON.parse(textData.contents);
  } catch (e) {
    return null;
  }
}

async function updateStatus() {
  statusDot.classList.remove('online'); statusDot.classList.add('off');
  statusText.textContent = "Checking...";
  playersEl.textContent = "--"; maxPlayersEl.textContent = "--";
  serverVersionEl.textContent = "--";

  const data = await fetchStatus(displayHost);

  if (!data || !data.online) {
    statusDot.classList.remove('online'); statusDot.classList.add('off');
    statusText.textContent = "Offline";
    return;
  }

  statusDot.classList.remove('off'); statusDot.classList.add('online');
  statusText.textContent = "Online";
  playersEl.textContent = data.players.now || "--";
  maxPlayersEl.textContent = data.players.max || "--";
  serverVersionEl.textContent = data.server.name || "--";
}

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(displayHost);
    copyBtn.textContent = "Copied!";
    setTimeout(() => copyBtn.textContent = "Copy", 1500);
  } catch(e) {
    alert('Copy failed: ' + displayHost);
  }
});

// First load + refresh every 15s
updateStatus();
setInterval(updateStatus, 15000);
