import express, { Request, Response } from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const isAuthenticated = async (req: Request, res: Response) => {
    try {
        const sessionToken = req.cookies['ANTONIO-AUTH'];
        
    }
}