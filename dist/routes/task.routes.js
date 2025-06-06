"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const validateRequest_1 = require("../middleware/validateRequest");
const taskController = __importStar(require("../controllers/task.controller"));
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/project/:projectId', taskController.getTasksByProject);
router.post('/', (0, express_validator_1.body)('title').notEmpty().trim(), (0, express_validator_1.body)('projectId').isUUID(), (0, express_validator_1.body)('description').optional().trim(), (0, express_validator_1.body)('startDate').optional().isISO8601(), (0, express_validator_1.body)('endDate').optional().isISO8601(), (0, express_validator_1.body)('assignedToId').optional().isUUID(), (0, express_validator_1.body)('status').optional().isIn(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']), (0, express_validator_1.body)('progress').optional().isInt({ min: 0, max: 100 }), validateRequest_1.validateRequest, taskController.createTask);
router.put('/:id', taskController.updateTask);
router.patch('/:id/status', (0, express_validator_1.body)('status').isIn(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']), validateRequest_1.validateRequest, taskController.updateTaskStatus);
router.delete('/:id', taskController.deleteTask);
exports.default = router;
