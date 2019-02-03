import * as sequelize from 'sequelize';

const videoDataTypes = {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: sequelize.STRING, allowNull: false },
    user: { type: sequelize.STRING, defaultValue: "Anonymous", allowNull: false }, // tippin.me User
    description: { type: sequelize.TEXT, defaultValue: "No description", allowNull: false },
    likes: { type: sequelize.INTEGER, defaultValue: 0, allowNull: false },
    dislikes: { type: sequelize.INTEGER, defaultValue: 0, allowNull: false },
    views: { type: sequelize.INTEGER, defaultValue: 0, allowNull: false },
    priceUSD: { type: sequelize.FLOAT, defaultValue: 0.01 },
    unlockCode: { type: sequelize.STRING }, // validation missing here
    createdAt: sequelize.DATE,
    updatedAt: sequelize.DATE,
};

const commentDataTypes = {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    videoId: { type: sequelize.INTEGER, allowNull: false },
    comment: { type: sequelize.TEXT, allowNull: false },
    user: { type: sequelize.STRING, defaultValue: "Anonymous" },
    createdAt: sequelize.DATE,
    updatedAt: sequelize.DATE,
}

const videoMetadataDataTypes = {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    videoId: { type: sequelize.INTEGER, allowNull: false },
    localFileName: { type: sequelize.STRING, allowNull: false },
    sourceVideoUrl: { type: sequelize.STRING },
    muxAssetId: { type: sequelize.STRING },
    muxPlaybackId: { type: sequelize.STRING },
    duration: { type: sequelize.FLOAT },
    thumbnailUrl: { type: sequelize.STRING },
    gifUrl: { type: sequelize.STRING },
    hlsUrl: { type: sequelize.STRING },
    latestStatus: { type: sequelize.STRING },
    createdAt: { type: sequelize.DATE },
    updatedAt: { type: sequelize.DATE },
}

const payInDataTypes = {
    chargeId: { type: sequelize.STRING, primaryKey: true },
    videoId: { type: sequelize.INTEGER, allowNull: false },
    amountSatoshi: { type: sequelize.INTEGER, allowNull: false },
    payreq: { type: sequelize.STRING(1000), allowNull: false },
    paid: { type: sequelize.BOOLEAN, defaultValue: false },
    createdAt: { type: sequelize.DATE },
    updatedAt: { type: sequelize.DATE },
}

const payOutDataTypes = {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    videoId: { type: sequelize.INTEGER, allowNull: false },
    amountSatoshi: { type: sequelize.INTEGER, allowNull: false },
    payreq: { type: sequelize.STRING(1000), allowNull: false },
    paid: { type: sequelize.BOOLEAN, defaultValue: false },
    createdAt: { type: sequelize.DATE },
    updatedAt: { type: sequelize.DATE },
}

export interface VideoAttrs {
    id?: number,
    title?: string,
    user?: string,
    description?: string,
    likes?: number,
    dislikes?: number,
    views?: number,
    ready?: boolean,
    comments?: CommentAttrs[],
    payIns?: PayInAttrs[],
    payOuts?: PayOutAttrs[],
    videoMetadata?: VideoMetadataAttrs,
    priceUSD?: number,
    unlockCode?: any,
    createdAt?: Date,
    updatedAt?: Date,
}

export interface CommentAttrs {
    id?: number,
    videoId?: number,
    comment?: string,
    user?: string,
    video?: VideoAttrs,
    createdAt?: Date,
    updatedAt?: Date,
}

export interface VideoMetadataAttrs {
    id?: number,
    videoId?: number,
    localFileName?: string,
    sourceVideoUrl?: string,
    muxPlaybackId?: string,
    muxAssetId?: string,
    duration?: number,
    thumbnailUrl?: string,
    gifUrl?: string,
    hlsUrl?: string,
    latestStatus?: "local" | "s3" | "muxIngest" | "ready",
    video?: VideoAttrs,
    createdAt?: Date,
    updatedAt?: Date,
}

export interface PayInAttrs {
    chargeId?: string,
    videoId?: number,
    amountSatoshi?: number,
    payreq?: string,
    paid?: boolean,
    createdAt?: Date,
    updatedAt?: Date,
    total?: number; // in satoshis; used for aggregates
}

export interface PayOutAttrs {
    id?: number,
    videoId?: number,
    amountSatoshi?: number,
    payreq?: string,
    paid?: boolean,
    createdAt?: Date,
    updatedAt?: Date,
    total?: number; // in satoshis; used for aggregates
}

export interface Video extends sequelize.Instance<VideoAttrs> {}
export interface Videos extends sequelize.Model<Video, VideoAttrs> {}

export interface Comment extends sequelize.Instance<CommentAttrs> {}
export interface Comments extends sequelize.Model<Comment, CommentAttrs> {}

export interface VideoMetadata extends sequelize.Instance<VideoMetadataAttrs> {}
export interface VideosMetadata extends sequelize.Model<VideoMetadata, VideoMetadataAttrs> {}

export interface PayIn extends sequelize.Instance<PayInAttrs> {}
export interface PayIns extends sequelize.Model<PayIn, PayInAttrs> {}

export interface PayOut extends sequelize.Instance<PayOutAttrs> {}
export interface PayOuts extends sequelize.Model<PayOut, PayOutAttrs> {}

export interface Models extends sequelize.Models {
    videos: Videos,
    comments: Comments,
    videosMetadata: VideosMetadata,
    payIns: PayIns,
    payOuts: PayOuts,
}

export function instantiateModels(sequelizeInstance: sequelize.Sequelize): Models {
    const videos = sequelizeInstance.define<Video, VideoAttrs>('videos', videoDataTypes);
    const comments = sequelizeInstance.define<Comment, CommentAttrs>('comments', commentDataTypes);
    const videosMetadata = sequelizeInstance.define<VideoMetadata, VideoMetadataAttrs>('metadata', videoMetadataDataTypes);
    const payIns = sequelizeInstance.define<PayIn, PayInAttrs>('payIn', payInDataTypes);
    const payOuts = sequelizeInstance.define<PayOut, PayOutAttrs>('payOut', payOutDataTypes);
    // comments-videos association
    videos.hasMany(comments, { foreignKey: 'videoId', as: 'comments' });
    comments.belongsTo(videos, { foreignKey: 'videoId', as: 'video'} );
    // videos-metadata association
    videos.hasOne(videosMetadata, { foreignKey: 'videoId', as: 'videoMetadata' });
    videosMetadata.belongsTo(videos, { foreignKey: 'videoId', as: 'video'} );
    // videos-payIns/payOuts association
    videos.hasMany(payIns, { foreignKey: 'videoId', as: 'payIns' });
    payIns.belongsTo(videos, { foreignKey: 'videoId', as: 'video' });
    videos.hasMany(payOuts, { foreignKey: 'videoId', as: 'payOuts' });
    payOuts.belongsTo(videos, { foreignKey: 'videoId', as: 'video' });
    return {
        videos: videos,
        comments: comments,
        videosMetadata: videosMetadata,
        payIns: payIns,
        payOuts: payOuts
    };
}