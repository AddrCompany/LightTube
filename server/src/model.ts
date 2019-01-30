import * as sequelize from 'sequelize';

const videoDataTypes = {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: sequelize.STRING, allowNull: false },
    user: { type: sequelize.STRING, defaultValue: "Anonymous", allowNull: false },
    description: { type: sequelize.TEXT, defaultValue: "No description", allowNull: false },
    likes: { type: sequelize.INTEGER, defaultValue: 0, allowNull: false },
    dislikes: { type: sequelize.INTEGER, defaultValue: 0, allowNull: false },
    views: { type: sequelize.INTEGER, defaultValue: 0, allowNull: false },
    ready: { type: sequelize.BOOLEAN,  defaultValue: false },
    tippinUser: { type: sequelize.STRING },
    priceUSD: { type: sequelize.FLOAT },
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
    transcoderGuid: { type: sequelize.UUID }, // also means S3 upload done/local file cleaned up
    imgUrl: { type: sequelize.STRING },
    cloudfrontDashUrl: { type: sequelize.STRING },
    createdAt: { type: sequelize.DATE },
    updatedAt: { type: sequelize.DATE },
}

const payInDataTypes = {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    videoId: { type: sequelize.INTEGER, allowNull: false },
    amountSatoshi: { type: sequelize.INTEGER, allowNull: false },
    invoice: { type: sequelize.STRING, allowNull: false },
    settled_at: { type: sequelize.DATE },
    createdAt: { type: sequelize.DATE },
    updatedAt: { type: sequelize.DATE },
}

const payOutDataTypes = {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    videoId: { type: sequelize.INTEGER, allowNull: false },
    amountSatoshi: { type: sequelize.INTEGER, allowNull: false },
    invoice: { type: sequelize.STRING, allowNull: false },
    settled_at: { type: sequelize.DATE },
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
    tippinUser?: string,
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
    transcoderGuid?: string,
    imgUrl?: string,
    cloudfrontDashUrl?: string,
    video?: VideoAttrs,
    createdAt?: Date,
    updatedAt?: Date,
}

export interface PayInAttrs {
    id?: number,
    videoId?: number,
    amountSatoshi?: number,
    invoice?: string,
    settled_at?: Date,
    createdAt?: Date,
    updatedAt?: Date,
}

export interface PayOutAttrs {
    id?: number,
    videoId?: number,
    amountSatoshi?: number,
    invoice?: string,
    settled_at?: Date,
    createdAt?: Date,
    updatedAt?: Date,
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