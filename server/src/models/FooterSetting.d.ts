import mongoose, { Document } from 'mongoose';
export interface IFooterSetting extends Document {
    description: string;
    logo: string;
    socialLinks: {
        platform: string;
        url: string;
    }[];
    menus: {
        title: string;
        links: {
            label: string;
            url: string;
        }[];
    }[];
    copyright: string;
    address: string;
    legalLinks: {
        label: string;
        url: string;
    }[];
}
export declare const FooterSetting: mongoose.Model<IFooterSetting, {}, {}, {}, Document<unknown, {}, IFooterSetting, {}, mongoose.DefaultSchemaOptions> & IFooterSetting & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IFooterSetting>;
//# sourceMappingURL=FooterSetting.d.ts.map