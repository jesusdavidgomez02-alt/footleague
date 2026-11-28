// Contrato asumido: GET /equipos, /jugadores, /partidos, /posiciones y /goleadores.
// Claves: equipos(id,nombre,ciudad,estadio); jugadores(id,nombre,posicion,numero,equipo_id,goles);
// partidos(id,fecha,equipo_local_id,equipo_visitante_id,goles_local,goles_visitante,estado).
// Posiciones: {equipo_id,nombre,jugados,diferencia_goles,puntos}; goleadores: {jugador_id,nombre,equipo_id,equipo,goles}.
const API_BASE = '/api';
const state = { teams: [], players: [], matches: [], standings: [], scorers: [] };
const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const listFrom = (data) => Array.isArray(data) ? data : (data?.data ?? data?.resultados ?? []);
const teamById = (id) => state.teams.find((team) => String(team.id) === String(id));
const teamName = (id, fallback = 'Equipo') => teamById(id)?.nombre ?? fallback;
const initials = (name = '') => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase();
const dateLabel = (value) => { if (!value) return 'Por definir'; const date = new Date(`${value}`.length === 10 ? `${value}T12:00:00` : value); return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).format(date); };

async function getEndpoint(path) {
  const response = await fetch(`${API_BASE}/${path}`);
  if (!response.ok) throw new Error(`${path}: ${response.status}`);
  return listFrom(await response.json());
}

function showApiError(errors) {
  const notice = $('api-error');
  if (!errors.length) { notice.hidden = true; return; }
  notice.hidden = false;
  notice.textContent = `No se pudieron cargar algunos datos (${errors.join(', ')}). Revisa que la API esté activa en ${API_BASE}.`;
}

function renderTeams() {
  const query = $('team-filter').value.trim().toLocaleLowerCase('es');
  const filtered = state.teams.filter((team) => `${team.nombre} ${team.ciudad ?? ''} ${team.estadio ?? ''}`.toLocaleLowerCase('es').includes(query));
  $('teams-body').innerHTML = filtered.length ? filtered.map((team) => {
    const count = state.players.filter((player) => String(player.equipo_id) === String(team.id)).length;
    return `<tr><td><span class="team-cell"><span class="team-badge">${esc(initials(team.nombre))}</span>${esc(team.nombre)}</span></td><td>${esc(team.ciudad || '—')}</td><td>${esc(team.estadio || '—')}</td><td class="numeric">${count || '—'}</td></tr>`;
  }).join('') : '<tr><td colspan="4" class="empty">No hay equipos que coincidan.</td></tr>';
}

function renderPlayers() {
  const query = $('player-filter').value.trim().toLocaleLowerCase('es');
  const selectedTeam = $('player-team-filter').value;
  const filtered = state.players.filter((player) => `${player.nombre} ${player.posicion ?? ''} ${teamName(player.equipo_id)}`.toLocaleLowerCase('es').includes(query) && (!selectedTeam || String(player.equipo_id) === selectedTeam));
  $('players-body').innerHTML = filtered.length ? filtered.map((player) => `<tr><td>${esc(player.nombre)}</td><td><span class="team-pill">${esc(teamName(player.equipo_id))}</span></td><td>${esc(player.posicion || '—')}</td><td class="numeric">${esc(player.numero ?? '—')}</td><td class="numeric">${Number(player.goles) || 0}</td></tr>`).join('') : '<tr><td colspan="5" class="empty">No hay jugadores que coincidan.</td></tr>';
}

function renderMatches() {
  const query = $('match-filter').value.trim().toLocaleLowerCase('es');
  const filtered = state.matches.filter((match) => `${teamName(match.equipo_local_id)} ${teamName(match.equipo_visitante_id)} ${match.fecha ?? ''}`.toLocaleLowerCase('es').includes(query));
  $('matches-body').innerHTML = filtered.length ? filtered.map((match) => {
    const home = teamName(match.equipo_local_id, match.equipo_local || 'Local');
    const away = teamName(match.equipo_visitante_id, match.equipo_visitante || 'Visitante');
    const played = match.goles_local != null && match.goles_visitante != null;
    return `<tr><td>${esc(dateLabel(match.fecha))}</td><td>${esc(home)}</td><td class="numeric score">${played ? `${esc(match.goles_local)} – ${esc(match.goles_visitante)}` : 'vs.'}</td><td>${esc(away)}</td><td><span class="status ${played ? 'status-done' : 'status-next'}">${esc(match.estado || (played ? 'Finalizado' : 'Programado'))}</span></td></tr>`;
  }).join('') : '<tr><td colspan="5" class="empty">No hay partidos que coincidan.</td></tr>';
}

function renderStandings() {
  const sorted = [...state.standings].sort((a, b) => Number(b.puntos) - Number(a.puntos) || Number(b.diferencia_goles) - Number(a.diferencia_goles));
  $('standings-body').innerHTML = sorted.length ? sorted.map((row, index) => `<tr><td><span class="rank ${index < 3 ? 'top' : ''}">${index + 1}</span></td><td><span class="team-cell"><span class="team-badge">${esc(initials(row.nombre || teamName(row.equipo_id)))}</span>${esc(row.nombre || teamName(row.equipo_id))}</span></td><td class="numeric">${esc(row.jugados ?? row.partidos_jugados ?? 0)}</td><td class="numeric">${Number(row.diferencia_goles ?? row.dg) > 0 ? '+' : ''}${esc(row.diferencia_goles ?? row.dg ?? 0)}</td><td class="numeric points">${esc(row.puntos ?? 0)}</td></tr>`).join('') : '<tr><td colspan="5" class="empty">Sin posiciones disponibles.</td></tr>';
}

function renderScorers() {
  const top = [...state.scorers].sort((a, b) => Number(b.goles) - Number(a.goles)).slice(0, 5);
  $('scorers-list').innerHTML = top.length ? top.map((player, index) => `<article class="scorer"><span class="scorer-rank">${index + 1}</span><div class="scorer-info"><div class="scorer-name">${esc(player.nombre)}</div><div class="scorer-team">${esc(player.equipo || teamName(player.equipo_id))}</div></div><div class="scorer-goals">${Number(player.goles) || 0} <small>GOLES</small></div></article>`).join('') : '<p class="empty">Sin goleadores disponibles.</p>';
  const leader = top[0];
  $('stat-scorer').textContent = leader?.nombre || '—';
  $('stat-scorer-goals').textContent = leader ? `${Number(leader.goles) || 0} goles · ${leader.equipo || teamName(leader.equipo_id)}` : 'Sin datos de goleadores';
}

function renderAll() {
  renderTeams(); renderPlayers(); renderMatches(); renderStandings(); renderScorers();
  $('stat-teams').textContent = state.teams.length || '—';
  $('stat-players').textContent = state.players.length || '—';
  $('stat-matches').textContent = state.matches.length || '—';
  const teamSelect = $('player-team-filter');
  const selected = teamSelect.value;
  teamSelect.innerHTML = '<option value="">Todos los equipos</option>' + state.teams.map((team) => `<option value="${esc(team.id)}">${esc(team.nombre)}</option>`).join('');
  teamSelect.value = selected;
}

async function loadData() {
  const endpoints = ['equipos', 'jugadores', 'partidos', 'posiciones', 'goleadores'];
  const responses = await Promise.all(endpoints.map(async (endpoint) => {
    try { return { endpoint, data: await getEndpoint(endpoint) }; }
    catch (error) { return { endpoint, error }; }
  }));
  const errors = [];
  for (const result of responses) {
    if (result.error) { errors.push(result.endpoint); continue; }
    if (result.endpoint === 'equipos') state.teams = result.data;
    if (result.endpoint === 'jugadores') state.players = result.data;
    if (result.endpoint === 'partidos') state.matches = result.data;
    if (result.endpoint === 'posiciones') state.standings = result.data;
    if (result.endpoint === 'goleadores') state.scorers = result.data;
  }
  renderAll(); showApiError(errors);
  $('last-updated').textContent = errors.length ? 'Conexión parcial' : `Actualizado ${new Intl.DateTimeFormat('es-CO', { hour: '2-digit', minute: '2-digit' }).format(new Date())}`;
}

[['team-filter', renderTeams], ['player-filter', renderPlayers], ['player-team-filter', renderPlayers], ['match-filter', renderMatches]].forEach(([id, render]) => $(id).addEventListener('input', render));
$('player-team-filter').addEventListener('change', renderPlayers);
loadData();
