export class ReviewController {
  constructor(reviewService) {
    this.reviewService = reviewService;
  }
  //리뷰작성
  createReview = async (req, res, next) => {
    try {
      const { contents, stars, reviewImage } = req.body;
      const { userId } = req.user;
      const { orderId } = req.params;
      if (!orderId) {
        throw new Error('orderId를 입력해주세요.');
      }
      if (stars < 1 || stars > 5) {
        throw new Error(400, '평점은 1~5점 입니다.');
      }

      const createReview = await this.reviewService.createReview(
        userId,
        orderId,
        contents,
        stars,
        reviewImage
      );

      return res
        .status(201)
        .json({ data: createReview, message: '리뷰가 작성되었습니다.' });
    } catch (err) {
      next(err);
    }
  };

  //리뷰수정
  updateReview = async (req, res, next) => {
    try {
      const { contents, stars, reviewImage } = req.body;
      const { userId } = req.user;
      const { reviewId } = req.params;
      if ((!contents, !stars, !reviewImage, !reviewId)) {
        return res.status(400).json({
          message: '수정 데이터를 확인해주세요.',
        });
      }
      if (stars < 1 || stars > 5) {
        throw new Error(400, '평점은 1~5점 입니다.');
      }
      const updateReview = await this.reviewService.updateReview(
        reviewId,
        userId,
        contents,
        stars,
        reviewImage
      );

      return res
        .status(200)
        .json({ data: updateReview, message: '리뷰 수정이 완료되었습니다.' });
    } catch (err) {
      next(err);
    }
  };

  //리뷰삭제
  deleteReview = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { reviewId } = req.params;
      const deleteReview = await this.reviewService.deleteReview(
        userId,
        reviewId
      );
      return res
        .status(200)
        .json({ data: deleteReview, message: '리뷰가 삭제되었습니다.' });
    } catch (err) {
      next(err);
    }
  };

  //내 리뷰 조회
  getReview = async (req, res, next) => {
    try {
      const { userId } = req.user;
      if (!userId) {
        throw new Error('id값이 존재하지 않습니다.');
      }
      const reviews = await this.reviewService.getReview(userId);
      if (!reviews) {
        throw new Error('리뷰 조회에 실패했습니다.');
      }
      return res.status(200).json({ data: reviews });
    } catch (err) {
      next(err);
    }
  };

  //업장 리뷰 조회
  getReviewByStoreId = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      if (!storeId) {
        throw new Error('id값이 존재하지 않습니다.');
      }
      const reviewsByStoreId =
        await this.reviewService.getReviewByStoreId(storeId);
      if (!reviewsByStoreId) {
        throw new Error('리뷰 조회에 실패했습니다.');
      }
      return res.status(200).json({ data: reviewsByStoreId });
    } catch (err) {
      next(err);
    }
  };
}
