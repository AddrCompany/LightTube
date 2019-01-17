import * as sequelize from 'sequelize';

const videoDataTypes = {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: sequelize.STRING, allowNull: false },
    user: { type: sequelize.STRING, defaultValue: "Anonymous" },
    description: { type: sequelize.TEXT, defaultValue: "No description" },
    likes: { type: sequelize.INTEGER, defaultValue: 0 },
    dislikes: { type: sequelize.INTEGER, defaultValue: 0 },
    views: { type: sequelize.INTEGER, defaultValue: 0 },
    ready: { type: sequelize.BOOLEAN,  defaultValue: false },
};

const commentDataTypes = {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    video_id: { type: sequelize.INTEGER, allowNull: false },
    comment: { type: sequelize.TEXT, allowNull: false },
    user: { type: sequelize.STRING, defaultValue: "Anonymous" }
}

const videoMetadataDataTypes = {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    video_id: { type: sequelize.INTEGER, allowNull: false },
    local_file_name: { type: sequelize.STRING, allowNull: false },
    transcoder_guid: { type: sequelize.UUID }, // also means S3 upload done/local file cleaned up
    img_url: { type: sequelize.STRING },
    cloudfront_dash_url: { type: sequelize.STRING },
    source_bucket_url: { type: sequelize.STRING }
}

export interface VideoAttrs {
    id?: number,
    title: string,
    user?: string,
    description?: string,
    likes?: number,
    dislikes?: number,
    views?: number,
    ready?: boolean,
    comments?: CommentAttrs[]
}

export interface CommentAttrs {
    id?: number,
    video_id: number,
    comment: string,
    user?: string,
    video?: VideoAttrs
}

export interface VideoMetadataAttrs {
    id?: number,
    video_id: number,
    local_file_name: string,
    transcoder_guid?: string,
    img_url?: string,
    source_bucket_url?: string,
    cloudfront_dash_url?: string,
    video?: VideoAttrs
}

export interface Video extends sequelize.Instance<VideoAttrs> {}
export interface Videos extends sequelize.Model<Video, VideoAttrs> {}
export interface Comment extends sequelize.Instance<CommentAttrs> {}
export interface Comments extends sequelize.Model<Comment, CommentAttrs> {}
export interface VideoMetadata extends sequelize.Instance<VideoMetadataAttrs> {}
export interface VideosMetadata extends sequelize.Model<VideoMetadata, VideoMetadataAttrs> {}

export interface Models extends sequelize.Models {
    videos: Videos,
    comments: Comments,
    videosMetadata: VideosMetadata
}

export function instantiateModels(sequelizeInstance: sequelize.Sequelize): Models {
    const videos = sequelizeInstance.define<Video, VideoAttrs>('videos', videoDataTypes);
    const comments = sequelizeInstance.define<Comment, CommentAttrs>('comments', commentDataTypes);
    const videosMetadata = sequelizeInstance.define<VideoMetadata, VideoMetadataAttrs>('metadata', videoMetadataDataTypes);
    videosMetadata.hasOne(videos, { foreignKey: 'video_id', as: 'video' });
    videos.hasMany(comments, { foreignKey: 'video_id', as: 'comments' });
    comments.belongsTo(videos, { foreignKey: 'video_id', as: 'video'} );
    return {
        videos: videos,
        comments: comments,
        videosMetadata: videosMetadata
    };
}