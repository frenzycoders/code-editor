"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkValidParams = void 0;
const checkValidParams = (Entity) => {
    return (req, res, next) => {
        let { type } = req.params;
        if (Entity.includes(type)) {
            req.entity = type;
            next();
        }
        else
            return res.status(200).send({ message: Entity.join(',') + ' are not found in params' });
    };
};
exports.checkValidParams = checkValidParams;
//# sourceMappingURL=middlewares.js.map