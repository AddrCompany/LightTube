import * as sequelize from 'sequelize';

const videoDataTypes = {
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

const commentDataTypes = {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    video_id: { type: sequelize.INTEGER },
    comment: { type: sequelize.TEXT, allowNull: false},
    user: { type: sequelize.STRING, defaultValue: "Anonymous"}
}

export interface VideoAttrs {
    id: number,
    title: string,
    user: string,
    description: string,
    uploaded_at: Date,
    likes: number,
    dislikes: number,
    views: number,
    transcoder_guid: string
}

export interface CommentAttrs {
    id: number,
    video_id: number,
    comment: string,
    user: string
}

export interface Video extends sequelize.Instance<VideoAttrs> {}
export interface Videos extends sequelize.Model<Video, VideoAttrs> {}
export interface Comment extends sequelize.Instance<CommentAttrs> {}
export interface Comments extends sequelize.Model<Comment, CommentAttrs> {}

export interface Models extends sequelize.Models {
    videos: Videos,
    comments: Comments
}

export function instantiateModels(sequelizeInstance: sequelize.Sequelize): Models {
    const videos = sequelizeInstance.define<Video, VideoAttrs>('videos', videoDataTypes);
    const comments = sequelizeInstance.define<Comment, CommentAttrs>('comments', commentDataTypes);
    // videos.hasMany(comments, { foreignKey: 'video_id' })
    comments.belongsTo(videos, { foreignKey: 'video_id', as: 'video'} );
    return {
        videos: videos,
        comments: comments
    };
}