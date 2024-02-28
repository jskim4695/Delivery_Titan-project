import { jest, expect } from '@jest/globals';
import { ReviewService } from '../../src/services/reviews.service.js';
import {
  NotFoundError,
  BadRequestError,
  ApiError,
} from '../../src/middlewares/error-handling.middleware';

let mockReviewRepository = {
  createReview: jest.fn(),
  updateReview: jest.fn(),
  deleteReview: jest.fn(),
  getReview: jest.fn(),
  getReviewByStoreId: jest.fn(),
};

let mockOrderRepository = {
  getOrderById: jest.fn(),
};

let reviewService = new ReviewService(
  mockReviewRepository,
  mockOrderRepository
);

describe('ReviewService Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  const sampleReview = {
    userId: 2,
    storeId: 1,
    orderId: 1,
    contents: 'test review contents',
    stars: 5,
    reviewImage: 'test review img',
  };
  test('createReview 테스트 (정상)', async () => {
    const userId = 1;
    const orderId = 1;
    const contents = 'test review contents';
    const stars = 5;
    const reviewImage = 'test review img';

    mockReviewRepository.createReview.mockResolvedValue(sampleReview);
    mockOrderRepository.getOrderById.mockResolvedValueOnce({ storeId: 1 });

    const result = await reviewService.createReview(
      userId,
      orderId,
      contents,
      stars,
      reviewImage
    );
    expect(result).toEqual({ ...sampleReview, storeId: 1 });
    expect(mockReviewRepository.createReview).toHaveBeenCalledWith(
      userId,
      orderId,
      contents,
      stars,
      reviewImage
    );
  });

  test('createReview 테스트 by NotFoundError', async () => {
    const userId = 1;
    const orderId = 1;
    const contents = 'test review contents';
    const stars = 5;
    const reviewImage = 'test review img';

    mockReviewRepository.createReview.mockResolvedValue(null);
    await expect(
      reviewService.createReview(userId, orderId, contents, stars, reviewImage)
    ).rejects.toThrow(new NotFoundError('주문을 찾을수 없습니다.'));
  });

  test('createReview 테스트 by ApiError', async () => {});

  test('createReview 테스트 by BadRequestError', async () => {});
});
