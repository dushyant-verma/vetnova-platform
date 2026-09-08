import { Request, Response } from 'express';
/**
 * @desc    Create a new Enquiry (Public submission)
 * @route   POST /api/enquiries
 * @access  Public
 */
export declare const createEnquiry: (req: Request, res: Response) => Promise<void>;
/**
 * @desc    Get all Enquiries with search, filter, and pagination
 * @route   GET /api/enquiries
 * @access  Private/Admin
 */
export declare const getEnquiries: (req: Request, res: Response) => Promise<void>;
/**
 * @desc    Get single Enquiry by ID
 * @route   GET /api/enquiries/:id
 * @access  Private/Admin
 */
export declare const getEnquiryById: (req: Request, res: Response) => Promise<void>;
/**
 * @desc    Update Enquiry (e.g., status, notes)
 * @route   PATCH /api/enquiries/:id or PUT /api/enquiries/:id
 * @access  Private/Admin
 */
export declare const updateEnquiry: (req: Request, res: Response) => Promise<void>;
/**
 * @desc    Delete Enquiry
 * @route   DELETE /api/enquiries/:id
 * @access  Private/Admin
 */
export declare const deleteEnquiry: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=enquiryController.d.ts.map