import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { ReviewController } from '../controllers/reviews.controller.js';
import { ReviewService } from '../services/reviews.service.js';
import { ReviewRepository } from '../repositories/reviews.repository.js';

const router = express.Router();

const reviewRepository = new ReviewRepository(prisma);
const reviewService = new ReviewService(reviewRepository);
const reviewController = new ReviewController(reviewService);

//리뷰작성
router.post('/user/review', authenticateUser, reviewController.createReview);
//리뷰수정
router.patch(
  '/user/review/:reviewId',
  authenticateUser,
  reviewController.updateReview
);
//리뷰삭제
router.delete(
  '/user/review/:reviewId',
  authenticateUser,
  reviewController.deleteReview
);
//내 리뷰 조회
router.get('/user/review', authenticateUser, reviewController.getReview);
//업장 리뷰 조회
router.get(
  '/user/review/:storeId',
  authenticateUser,
  reviewController.getReviewByStoreId
);

export default router;
