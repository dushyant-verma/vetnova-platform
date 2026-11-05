import { IEnquiry } from '../models/Enquiry';
export declare const isEmailConfigured: () => boolean;
export declare const sendLeadNotifications: (lead: IEnquiry) => Promise<{
    adminSent: boolean;
    applicantSent: boolean;
}>;
//# sourceMappingURL=emailService.d.ts.map