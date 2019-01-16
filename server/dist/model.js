"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize = require("sequelize");
var videoDataTypes = {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: sequelize.STRING, allowNull: false },
    user: { type: sequelize.STRING, defaultValue: "Anonymous" },
    description: { type: sequelize.TEXT, defaultValue: "No description" },
    uploaded_at: { type: sequelize.TIME },
    likes: { type: sequelize.INTEGER, defaultValue: 0 },
    dislikes: { type: sequelize.INTEGER, defaultValue: 0 },
    views: { type: sequelize.INTEGER, defaultValue: 0 },
    transcoder_guid: { type: sequelize.UUID }
};
var commentDataTypes = {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    video_id: { type: sequelize.INTEGER },
    comment: { type: sequelize.TEXT, allowNull: false },
    user: { type: sequelize.STRING, defaultValue: "Anonymous" }
};
function instantiateModels(sequelizeInstance) {
    var videos = sequelizeInstance.define('videos', videoDataTypes);
    var comments = sequelizeInstance.define('comments', commentDataTypes);
    // videos.hasMany(comments, { foreignKey: 'video_id' })
    comments.belongsTo(videos, { foreignKey: 'video_id', as: 'video' });
    return {
        videos: videos,
        comments: comments
    };
}
exports.instantiateModels = instantiateModels;
