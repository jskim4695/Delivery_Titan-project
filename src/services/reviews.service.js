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
      stars,
      reviewImage
    );

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
    const review = await this.reviewRepository.getReview(reviewId);
    if (!review) {
      throw new Error('리뷰가 없습니다.');
    }
    await this.reviewRepository.updateReview(
      reviewId,
      userId,
      contents,
      stars,
      reviewImage
    );
    const updateReview = await this.reviewRepository.getReview(reviewId);
    return {
      userId: updateReview.userId,
      storeId: updateReview.storeId,
      orderId: updateReview.orderId,
      contents: updateReview.contents,
      stars: updateReview.stars,
      reviewImage: updateReview.reviewImage,
    };
  };

  //리뷰 삭제
  deleteReview = async (userId, reviewId) => {
    if (!userId || !reviewId) {
      throw new Error('id값이 존재하지 않습니다.');
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
    if (!getReview) {
      throw new Error('리뷰가 없습니다.');
    }
    return getReview;
  };
  //리뷰 조회 업자
  getReviewByStoreId = async (storeId) => {
    const getReview = await this.reviewRepository.getReviewByStoreId(storeId);
    if (!getReview) {
      throw new Error('리뷰가 없습니다.');
    }
    return getReview;
  };
}
