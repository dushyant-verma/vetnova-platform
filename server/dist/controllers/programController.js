"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProgram = exports.updateProgram = exports.createProgram = exports.getProgramById = exports.getPrograms = void 0;
const Program_1 = require("../models/Program");
const getPrograms = async (req, res) => {
    try {
        const { search } = req.query;
        const query = search ? { title: { $regex: search, $options: 'i' } } : {};
        const programs = await Program_1.Program.find(query).populate('faculty', 'name specialization image');
        res.json(programs);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getPrograms = getPrograms;
const getProgramById = async (req, res) => {
    try {
        const program = await Program_1.Program.findById(req.params.id).populate('faculty');
        if (program) {
            res.json(program);
        }
        else {
            res.status(404).json({ message: 'Program not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProgramById = getProgramById;
const createProgram = async (req, res) => {
    try {
        const program = new Program_1.Program(req.body);
        const createdProgram = await program.save();
        res.status(201).json(createdProgram);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createProgram = createProgram;
const updateProgram = async (req, res) => {
    try {
        const program = await Program_1.Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(program);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateProgram = updateProgram;
const deleteProgram = async (req, res) => {
    try {
        await Program_1.Program.findByIdAndDelete(req.params.id);
        res.json({ message: 'Program removed' });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.deleteProgram = deleteProgram;
//# sourceMappingURL=programController.js.map