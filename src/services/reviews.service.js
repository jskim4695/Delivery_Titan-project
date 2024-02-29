import {
  NotFoundError,
  BadRequestError,
} from '../middlewares/error-handling.middleware.js';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { bucketName, s3 } from '../utils/multer/multer.js';

export class ReviewService {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }
  // 리뷰작성
  createReview = async (userId, orderId, contents, stars, reviewImage) => {
    const createReview = await this.reviewRepository.createReview(
      userId,
      orderId,
      contents,
      parseInt(stars),
      // stars,
      reviewImage
    );
    if (stars < 1 || stars > 5)
      throw new BadRequestError('평점은 1~5점을 입력해주세요.');
    if (!contents) throw new BadRequestError('리뷰를 작성해주세요.');

    return {
      userId: createReview.userId,
      storeId: createReview.storeId,
      orderId: createReview.orderId,
      contents: createReview.contents,
      stars: createReview.stars,
      reviewImage: createReview.reviewImage,
    };
  };

  //리뷰 수정
  updateReview = async (reviewId, userId, contents, stars, reviewImage) => {
    const review = await this.reviewRepository.getReviewByReviewId(reviewId);
    if (!review) throw new NotFoundError('리뷰가 없습니다.');
    if (!stars || !contents || !stars)
      throw new BadRequestError('수정할 내용을 입력해주세요.');
    if (stars < 1 || stars > 5)
      throw new BadRequestError('평점은 1~5점을 입력해주세요.');
    if (review.reviewImage != null || review.reviewImage != undefined) {
      const imageName = review.reviewImage.split('com/')[1];
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: imageName,
      });
      try {
        await s3.send(deleteCommand);
      } catch (err) {
        console.log(err.message);
      }
    }

    await this.reviewRepository.updateReview(
      reviewId,
      userId,
      contents,
      parseInt(stars),
      // stars,
      reviewImage
    );
    const updateReview = await this.reviewRepository.getReview(reviewId);
    return updateReview;
  };

  //리뷰 삭제
  deleteReview = async (userId, reviewId) => {
    const review = await this.reviewRepository.getReviewByReviewId(reviewId);
    if (!review) throw new NotFoundError('리뷰가 없습니다.');
    if (review.reviewImage != null || review.reviewImage != undefined) {
      const imageName = review.reviewImage.split('com/')[1];
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: imageName,
      });
      try {
        await s3.send(deleteCommand);
      } catch (err) {
        next(err);
      }
    }

    const deleteReview = await this.reviewRepository.deleteReview(
      userId,
      reviewId
    );
    return deleteReview;
  };

  //리뷰 조회 개인
  getReview = async (userId) => {
    const getReview = await this.reviewRepository.getReview(userId);
    if (!getReview || getReview.length === 0) {
      throw new NotFoundError(`리뷰가 없습니다.`);
    }
    return getReview;
  };
  //리뷰 조회 업자
  getReviewByStoreId = async (storeId) => {
    const getReview = await this.reviewRepository.getReviewByStoreId(storeId);
    if (!getReview) {
      throw new NotFoundError('리뷰가 없습니다.');
    }
    return getReview;
  };
}
