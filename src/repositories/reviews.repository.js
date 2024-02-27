export class ReviewRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createReview = async (
    userId,
    storeId,
    orderId,
    contents,
    stars,
    reviewImage
  ) => {
    const createReview = await this.prisma.reviews.create({
      data: {
        userId,
        storeId: +storeId,
        orderId: +orderId,
        contents,
        stars,
        reviewImage,
      },
    });
    return createReview;
  };

  updateReview = async (
    reviewId,
    userId,
    // storeId, orderId,
    contents,
    stars,
    reviewImage
  ) => {
    const updateReview = await this.prisma.reviews.update({
      where: {
        reviewId: +reviewId,
        user: +userId,
        //  storeId, orderId
      },
      data: {
        contents,
        stars,
        reviewImage,
      },
    });
    return updateReview;
  };

  deleteReview = async (userId, reviewId) => {
    const deleteReview = await this.prisma.reviews.delete({
      where: { reviewId: +reviewId, userId: +userId },
    });
    return deleteReview;
  };
  //개인 리뷰 조회
  getReview = async (userId) => {
    const getReview = await this.prisma.reviews.findMany({
      where: { userId: +userId },
      select: {
        reviewId,
        contents,
        stars,
        reviewImage,
        createdAt,
        updatedAt,
      },
    });
    return getReview;
  };

  //가게 리뷰 조회
  getReviewByStoreId = async (storeId) => {
    const getReview = await this.prisma.reviewId.findMany({
      where: { storeId: +storeId },
      select: {
        reviewId,
        contents,
        stars,
        reviewImage,
        createdAt,
        updatedAt,
      },
    });
    return getReview;
  };
}
