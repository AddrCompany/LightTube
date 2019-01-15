"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize = require("sequelize");
exports.impressionsDatatypes = {
    impression_token: { type: sequelize.UUID, primaryKey: true },
    session_token: { type: sequelize.UUID, allowNull: false },
    visitor_token: { type: sequelize.UUID, allowNull: false },
    url: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            isUrl: true
        }
    },
    elapsed_time: { type: sequelize.INTEGER, allowNull: false },
    converted: { type: sequelize.BOOLEAN, defaultValue: false, allowNull: false }
};
