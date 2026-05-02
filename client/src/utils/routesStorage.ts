import type { Path } from "../types/types";

export interface SavedRoute {
  id: string;
  ts: number;
  fromId: string;
  fromDesc: string;
  toId: string;
  toDesc: string;
  depth: number;
  path: Path;
}

const KEY = "uust:navigator:routes";
const MAX = 50;

export function loadRoutes(): SavedRoute[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedRoute[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to load saved routes", e);
    return [];
  }
}

export function saveRoute(entry: SavedRoute) {
  try {
    const routes = loadRoutes();
    const filtered = routes.filter(r => !(r.fromId === entry.fromId && r.toId === entry.toId && r.depth === entry.depth));
    filtered.unshift(entry);
    const final = filtered.slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(final));
  } catch (e) {
    console.error("Failed to save route", e);
  }
}

export function removeRoute(id: string) {
  try {
    const routes = loadRoutes().filter(r => r.id !== id);
    localStorage.setItem(KEY, JSON.stringify(routes));
  } catch (e) {
    console.error("Failed to remove route", e);
  }
}

export function clearRoutes() {
  try {
    localStorage.removeItem(KEY);
  } catch (e) {
    console.error("Failed to clear routes", e);
  }
}
