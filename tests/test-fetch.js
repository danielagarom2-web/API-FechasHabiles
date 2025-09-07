"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = require("../src/config/config");
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield (0, node_fetch_1.default)(config_1.HOLIDAYS_URL);
            const data = yield res.json();
            console.log(data);
        }
        catch (err) {
            console.error("Error fetching holidays:", err);
        }
    });
}
test();
//# sourceMappingURL=test-fetch.js.map