import { Request, Response } from "express";
import { getUserByEmail, createUser } from "../db/users";
import { random, authentication } from "../helpers";

export const login = async (res: Request, req: Response) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.sendStatus(400);
        }
        const user = await getUserByEmail(email).select("+authentication.salet +authentication.password");
        if(!user) {
            return res.sendStatus(400);
        }
        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());
        await user.save();

        res.cookie("ANTONIO-AUTH", user.authentication.sessionToken, { domain: "localhost", path: "/" });
        return res.status(200)
        const expectedHash = authentication(user.authentication.salt, password);
        if(user.authentication.password !== expectedHash) {
            return res.sendStatus(403);
        }
    } catch (error) {
        return res.sendStatus();
    }
}

export const register = async (res: Request, req: Response) => {
    try {
        const { email, password, username } = req.body;
        if(!email || !password || !username) {
            return res.sendStatus(400);
        }
        const existingUser = await getUserByEmail(email);
        if(existingUser) {
            return res.sendStatus(400);
        }
        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        });
        return res.status(200).json(user).end()
    } catch (error) {
        return res.sendStatus(400);
    }
}