import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { MainRepository } from '../repositories/main.repository.js';
import { MainService } from '../services/main.service.js';
import { MainController } from '../controllers/main.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

const mainRepository = new MainRepository(prisma);
const mainService = new MainService(mainRepository);
const mainController = new MainController(mainService);

/** 메인 페이지에서 메뉴 검색 */
router.get('/main', mainController.searchMenu);

/** 메인 페이지에서 업장 목록 정렬하기  */
router.get('/main/store/sort', mainController.sortStores);

/** 메인 페이지에서 업장 목록 조회 */
router.get('/main/store', mainController.getAllStores);

/** 메인 페이지에서 매출액 랭킹 보기 */
router.get(
  '/main/store/ranking',
  authenticateUser,
  mainController.getStoreRanking
);

export default router;
