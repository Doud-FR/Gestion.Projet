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
const userController = __importStar(require("../controllers/user.controller"));
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', (0, auth_1.authorize)('ADMIN'), userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', (0, express_validator_1.body)('firstName').optional().trim(), (0, express_validator_1.body)('lastName').optional().trim(), (0, express_validator_1.body)('email').optional().isEmail(), validateRequest_1.validateRequest, userController.updateUser);
router.patch('/:id/role', (0, auth_1.authorize)('ADMIN'), (0, express_validator_1.body)('role').isIn(['ADMIN', 'PROJECT_MANAGER', 'TECHNICIAN', 'USER']), validateRequest_1.validateRequest, userController.updateUserRole);
router.delete('/:id', (0, auth_1.authorize)('ADMIN'), userController.deleteUser);
router.post('/', (0, auth_1.authorize)('ADMIN'), (0, express_validator_1.body)('email').isEmail(), (0, express_validator_1.body)('password').isLength({ min: 8 }), (0, express_validator_1.body)('firstName').notEmpty().trim(), (0, express_validator_1.body)('lastName').notEmpty().trim(), (0, express_validator_1.body)('role').isIn(['ADMIN', 'PROJECT_MANAGER', 'TECHNICIAN', 'USER']), validateRequest_1.validateRequest, userController.createUser);
exports.default = router;
