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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const usuario_entity_1 = require("../entities/usuario.entity");
const jwt_1 = require("@nestjs/jwt");
const rol_entity_1 = require("../entities/rol.entity");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    constructor(usuarioRepo, jwtService) {
        this.usuarioRepo = usuarioRepo;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger('AuthService');
    }
    validateUser(loginDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = loginDto;
            const usuario = yield this.usuarioRepo.findOne({
                where: { username, esta_activo: true },
                relations: ['rol', 'laboratoriosAsignados', 'laboratoriosAsignados.laboratorio'],
            });
            if (!usuario) {
                this.logger.warn(`Usuario no encontrado: ${username}`);
                throw new common_1.UnauthorizedException('Credenciales inválidas.');
            }
            const ok = yield usuario.validatePassword(password);
            if (!ok) {
                this.logger.warn(`Contraseña incorrecta para: ${username}`);
                throw new common_1.UnauthorizedException('Credenciales inválidas.');
            }
            // ocultar hash en la respuesta
            usuario.password = undefined;
            return usuario;
        });
    }
    login(loginDto) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const u = yield this.validateUser(loginDto);
            const payload = {
                sub: u.id,
                username: u.username,
                rol: (_a = u.rol) === null || _a === void 0 ? void 0 : _a.nombre,
                lab_ids: (((_b = u.rol) === null || _b === void 0 ? void 0 : _b.nombre) === rol_entity_1.Role.INVITADO ? (u.laboratoriosAsignados || []).map((ul) => ul.laboratorio.id) : []),
            };
            const accessToken = yield this.jwtService.signAsync(payload);
            return { accessToken, user: u };
        });
    }
    /**
     * Endpoint/uso interno para convertir contraseñas en texto plano a hash bcrypt
     * para el usuario dado (por username). Útil para el seed inicial.
     */
    bootstrapHash(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = yield this.usuarioRepo.findOne({ where: { username } });
            if (!usuario)
                return { updated: false };
            if (usuario.password && !usuario.password.startsWith('$2')) {
                const saltRounds = 10;
                const hashed = yield bcrypt.hash(usuario.password, saltRounds);
                usuario.password = hashed;
                yield this.usuarioRepo.save(usuario);
                return { updated: true };
            }
            return { updated: false };
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
