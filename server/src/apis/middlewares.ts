import { NextFunction, Request, Response } from "express"


export const checkValidParams = (Entity: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        let { type } = req.params;

        if (Entity.includes(type)) {
            req.entity = type;
            next();
        } else return res.status(200).send({ message: Entity.join(',') + ' are not found in params' });
    }
}