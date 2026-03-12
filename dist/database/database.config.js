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
exports.typeOrmAsyncConfig = void 0;
const config_1 = require("@nestjs/config");
// Carga síncrona de variables de entorno para la CLI
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
// Solo carga .env si el entorno no es Docker
if (process.env.DOCKERIZED !== 'true') {
    try {
        const envConfig = dotenv.parse(fs.readFileSync('.env'));
        for (const k in envConfig) {
            process.env[k] = envConfig[k];
        }
    }
    catch (e) {
        console.warn('.env file not found, skipping...');
    }
}
const config = {
    type: 'mysql',
    host: process.env.DB_HOST || 'mysql',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USER || 'myuser',
    password: process.env.DB_PASSWORD || 'mypassword',
    database: process.env.DB_NAME || 'nest_db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: false, // No usar en producción
    migrationsRun: true,
};
exports.typeOrmAsyncConfig = {
    imports: [config_1.ConfigModule],
    inject: [config_1.ConfigService],
    useFactory: () => __awaiter(void 0, void 0, void 0, function* () {
        return config;
    }),
};
exports.default = config;
