export class ReviewController {
  constructor(reviewService) {
    this.reviewService = reviewService;
  }
  //리뷰작성
  createReview = async (req, res, next) => {
    try {
      const { contents, stars, reviewImage } = req.body;
      const userId = req.userId;
      const orderId = parseInt(req.params.orderId);

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
      const userId = req.userId;
      const { reviewId } = req.params;

      const updateReview = await this.reviewService.updateReview(
        reviewId,
        userId,
        contents,
        stars,
        reviewImage
      );

      return res
        .status(201)
        .json({ data: updateReview, message: '리뷰 수정이 완료되었습니다.' });
    } catch (err) {
      next(err);
    }
  };

  //리뷰삭제
  deleteReview = async (req, res, next) => {
    try {
      const userId = req.userId;
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
      const userId = req.userId;

      const reviews = await this.reviewService.getReview(userId);

      return res.status(200).json({ data: reviews });
    } catch (err) {
      next(err);
    }
  };

  //업장 리뷰 조회
  getReviewByStoreId = async (req, res, next) => {
    try {
      const { storeId } = req.params;

      const reviewsByStoreId =
        await this.reviewService.getReviewByStoreId(storeId);

      return res.status(200).json({ data: reviewsByStoreId });
    } catch (err) {
      next(err);
    }
  };
}
