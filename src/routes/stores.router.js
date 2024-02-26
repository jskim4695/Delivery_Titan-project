import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { errorHandler } from '../middlewares/error-handling.middleware.js';
import { StoresRepository } from '../repositories/stores.repository.js';
import { StoresService } from '../services/stores.service.js';
import { StoresController } from '../controllers/stores.controller.js';
const router = express.Router();

// 의존성 주입
const storesRepository = new StoresRepository(prisma);
const storesService = new StoresService(storesRepository);
const storesController = new StoresController(storesService);

/**
 * 업장 등록
 */
router.post('/store', storesController.createStore);

/**
 * 업장 전체 조회
 */
router.get('/store', storesController.getStores);

/**
 * 업장 하나 조회
 */
router.get('/store/:storeId', storesController.getStoreById);
/**
 * 업장 수정
 */
router.patch('/store/:storeId', storesController.updateStore);

/**
 * 업장 삭제
 */
router.delete('/store/:storeId', storesController.deleteStore);

router.use(errorHandler);

export default router;
