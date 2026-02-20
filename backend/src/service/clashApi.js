// src/services/clash.service.js
import axios from "axios";

export const clashClient = axios.create({
  baseURL: "https://api.clashroyale.com/v1",
  headers: {
    Authorization: `Bearer ${process.env.CLASH_API_KEY}`
  }
});

export const getPlayer = (tag) =>
    clashClient.get(`/players/${tag}`);

export const getBattleLog = (tag) =>
    clashClient.get(`/players/${tag}/battlelog`);

export const getCards = () =>
    clashClient.get("/cards");

export const getClan = (tag) =>
    clashClient.get(`/clans/${tag}`);

export const getClanMembers = (tag) =>
    clashClient.get(`/clans/${tag}/members`);
