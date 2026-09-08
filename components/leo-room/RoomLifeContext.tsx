"use client";
import { createContext, useContext } from "react";
import type { RoomInteractionController } from "./useRoomInteractionController";
export const RoomLifeContext = createContext<RoomInteractionController | null>(null);
export const useRoomLife = () => useContext(RoomLifeContext);
