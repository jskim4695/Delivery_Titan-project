import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { errorHandler } from '../middlewares/error-handling.middleware.js';
import { StoresRepository } from '../repositories/stores.repository.js';
import { StoresService } from '../services/stores.service.js';
import { StoresController } from '../controllers/stores.controller.js';
import { uploadStoreImg } from '../utils/multer/multer.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

// 의존성 주입
const storesRepository = new StoresRepository(prisma);
const storesService = new StoresService(storesRepository);
const storesController = new StoresController(storesService);

/**
 * 업장 등록
 */
router.post(
  '/store',
  authenticateUser,
  uploadStoreImg.single('storeImage'),
  storesController.createStore
);

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
router.patch(
  '/store/:storeId',
  authenticateUser,
  uploadStoreImg.single('storeImage'),
  storesController.updateStore
);

/**
 * 업장 삭제
 */
router.delete(
  '/store/:storeId',
  authenticateUser,
  storesController.deleteStore
);

router.use(errorHandler);

export default router;
