'use client'

import { io } from "socket.io-client";

export const socket = (url: any) => io(url);
