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
const clientController = __importStar(require("../controllers/client.controller"));
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', clientController.getAllClients);
router.get('/:id', clientController.getClientById);
router.post('/', (0, auth_1.authorize)('ADMIN', 'PROJECT_MANAGER'), (0, express_validator_1.body)('name').notEmpty().trim(), (0, express_validator_1.body)('email').isEmail(), (0, express_validator_1.body)('phone').optional().trim(), (0, express_validator_1.body)('address').optional().trim(), (0, express_validator_1.body)('website').optional().isURL(), validateRequest_1.validateRequest, clientController.createClient);
router.put('/:id', (0, auth_1.authorize)('ADMIN', 'PROJECT_MANAGER'), (0, express_validator_1.body)('name').optional().trim(), (0, express_validator_1.body)('email').optional().isEmail(), (0, express_validator_1.body)('phone').optional().trim(), (0, express_validator_1.body)('address').optional().trim(), (0, express_validator_1.body)('website').optional().isURL(), validateRequest_1.validateRequest, clientController.updateClient);
router.delete('/:id', (0, auth_1.authorize)('ADMIN'), clientController.deleteClient);
exports.default = router;
