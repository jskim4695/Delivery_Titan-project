import { NotFoundError } from '../middlewares/error-handling.middleware.js';

export class ReviewRepository {
  constructor(prisma, orderRepository) {
    this.prisma = prisma;
    this.orderRepository = orderRepository;
  }

  createReview = async (userId, orderId, contents, stars, reviewImage) => {
    const order = await this.orderRepository.getOrderById(orderId);
    if (!order) throw new NotFoundError('orderId을 찾을수 없습니다.');

    const storeId = order.storeId;

    const createReview = await this.prisma.reviews.create({
      data: {
        userId,
        storeId,
        orderId,
        stars,
        reviewImage,
        contents,
      },
    });
    return createReview;
  };

  updateReview = async (reviewId, userId, contents, stars, reviewImage) => {
    const existingReview = await this.prisma.reviews.findUnique({
      where: {
        id: +reviewId,
      },
    });
    if (!existingReview) {
      throw new NotFoundError('reviewId를 찾을 수 없습니다.');
    }

    const updateReview = await this.prisma.reviews.update({
      where: {
        id: +reviewId,
      },
      data: {
        userId,
        contents,
        stars,
        reviewImage,
      },
    });
    return updateReview;
  };

  deleteReview = async (userId, reviewId) => {
    const existingReview = await this.prisma.reviews.findUnique({
      where: {
        id: +reviewId,
      },
    });
    if (!existingReview)
      throw new NotFoundError('reviewId를 찾을 수 없습니다.');

    const deleteReview = await this.prisma.reviews.delete({
      where: { id: +reviewId, userId: +userId },
    });
    return deleteReview;
  };
  //개인 리뷰 조회
  getReview = async (userId) => {
    const getReview = await this.prisma.reviews.findMany({
      where: { userId: +userId },
      select: {
        id: true,
        storeId: true,
        contents: true,
        stars: true,
        reviewImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return getReview;
  };

  //가게 리뷰 조회
  getReviewByStoreId = async (storeId) => {
    if (!storeId) throw new NotFoundError('storeId를 찾을 수 없습니다.');

    const getReview = await this.prisma.reviews.findMany({
      where: { storeId: +storeId },
      select: {
        id: true,
        userId: true,
        contents: true,
        stars: true,
        reviewImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return getReview;
  };
}
