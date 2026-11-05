import { Request, Response } from "express";
import mongoose from "mongoose";
import { Program } from "../models/Program";
import { Batch } from "../models/Batch";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const getPrograms = async (req: Request, res: Response) => {
  try {
    const { search, category, status, syllabusStatus, all } = req.query;
    const filter: any = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search as string, $options: "i" } },
        { description: { $regex: search as string, $options: "i" } }
      ];
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    if (syllabusStatus && syllabusStatus !== "all") {
      filter.syllabusStatus = syllabusStatus;
    }

    // If "all" is requested (e.g. from admin), allow drafts; otherwise default to Published
    if (status) {
      if (status !== "all") filter.status = status;
    } else if (all !== "true" && !(req as any).user) {
      filter.status = "Published";
    }

    const programs = await Program.find(filter)
      .sort({ order: 1, title: 1 })
      .populate("faculty", "name specialization department image experience status programs");

    res.json(programs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProgramById = async (req: Request, res: Response): Promise<void> => {
  try {
    const param = req.params.id;
    let query: any;

    if (mongoose.isValidObjectId(String(param))) {
      query = { $or: [{ _id: param }, { slug: param }] };
    } else {
      query = { slug: String(param).toLowerCase() };
    }

    const program = await Program.findOne(query).populate("faculty");
    if (program) {
      res.json(program);
    } else {
      res.status(404).json({ message: "Program not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createProgram = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };
    delete data._id;
    delete data.__v;
    delete data.createdAt;
    delete data.updatedAt;

    if (!data.title || !String(data.title).trim()) {
      return res.status(400).json({ message: "Program title is required" });
    }

    if (!data.slug || !String(data.slug).trim()) {
      data.slug = slugify(data.title);
    } else {
      data.slug = slugify(data.slug);
    }

    // Check for duplicate slug
    const existingSlug = await Program.findOne({ slug: data.slug });
    if (existingSlug) {
      data.slug = `${data.slug}-${Date.now().toString().slice(-4)}`;
    }

    if (!data.description && data.shortDescription) {
      data.description = data.shortDescription;
    }
    if (!data.shortDescription && data.description) {
      data.shortDescription = data.description;
    }
    if (!data.description) {
      data.description = data.title;
      data.shortDescription = data.title;
    }
    if (!data.duration) {
      data.duration = "3 Days";
    }
    if (!data.availability) {
      data.availability = "24 Hours";
    }
    if (data.status === "Draft") {
      data.isActive = false;
    } else {
      data.isActive = true;
    }

    if (Array.isArray(data.faculty)) {
      data.faculty = data.faculty.filter((f: any) => f && mongoose.isValidObjectId(String(f)));
    }

    const program = new Program(data);
    const createdProgram = await program.save();
    res.status(201).json(createdProgram);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProgram = async (req: Request, res: Response) => {
  try {
    const param = req.params.id;
    const data = { ...req.body };
    delete data._id;
    delete data.__v;
    delete data.createdAt;
    delete data.updatedAt;

    if (data.slug) {
      data.slug = slugify(data.slug);
      const queryParam = mongoose.isValidObjectId(param) ? { _id: { $ne: param } } : { slug: { $ne: String(param) } };
      const conflict = await Program.findOne({ slug: data.slug, ...queryParam });
      if (conflict) {
        return res.status(400).json({ message: `A program with the slug "${data.slug}" already exists` });
      }
    }

    if (!data.description && data.shortDescription) {
      data.description = data.shortDescription;
    }
    if (!data.shortDescription && data.description) {
      data.shortDescription = data.description;
    }

    if (data.status === "Draft") {
      data.isActive = false;
    } else if (data.status === "Published") {
      data.isActive = true;
    }

    if (Array.isArray(data.faculty)) {
      data.faculty = data.faculty.filter((f: any) => f && mongoose.isValidObjectId(String(f)));
    }

    let program;
    if (mongoose.isValidObjectId(param)) {
      program = await Program.findByIdAndUpdate(param, data, { new: true, runValidators: true });
    } else {
      program = await Program.findOneAndUpdate({ slug: String(param) }, data, { new: true, runValidators: true });
    }

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    res.json(program);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProgram = async (req: Request, res: Response) => {
  try {
    const param = req.params.id;
    let deleted;
    if (mongoose.isValidObjectId(param)) {
      deleted = await Program.findByIdAndDelete(param);
      if (deleted) {
        await Batch.updateMany({ programId: param }, { $unset: { programId: 1 } });
      }
    } else {
      deleted = await Program.findOneAndDelete({ slug: String(param) });
      if (deleted) {
        await Batch.updateMany({ programId: deleted._id }, { $unset: { programId: 1 } });
      }
    }

    if (!deleted) {
      return res.status(404).json({ message: "Program not found" });
    }

    res.json({ message: "Program removed successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
