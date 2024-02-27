export class ReviewRepository {
  constructor(prisma, orderRepository) {
    this.prisma = prisma;
    this.orderRepository = orderRepository;
  }

  createReview = async (userId, orderId, contents, stars, reviewImage) => {
    const order = await this.orderRepository.getOrderById(orderId);
    if (!order) {
      throw new Error('주문을 찾을수 없습니다.');
    }
    const storeId = order.storeId;

    const createReview = await this.prisma.reviews.create({
      data: {
        userId,
        storeId,
        orderId,
        contents,
        stars,
        reviewImage,
      },
    });
    return createReview;
  };

  updateReview = async (reviewId, userId, contents, stars, reviewImage) => {
    const updateReview = await this.prisma.reviews.update({
      where: {
        reviewId: +reviewId,
      },
      data: {
        userId,
        storeId,
        orderId,
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
        storeId,
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
        userId,
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
