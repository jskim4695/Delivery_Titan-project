import { jest, expect } from '@jest/globals';
import { ReviewController } from '../../../src/controllers/reviews.controller.js';
//yarn test __tests__/unit/controllers/reviews.controller.unit.spec.js

let mockReviewService = {
  createReview: jest.fn(),
  getReview: jest.fn(),
  updateReview: jest.fn(),
  deleteReview: jest.fn(),
  getReviewByStoreId: jest.fn(),
};

const mockRequest = {
  body: jest.fn(),
  params: jest.fn(),
  user: jest.fn(),
};

const mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
};

const mockNext = jest.fn();

let reviewController = new ReviewController(mockReviewService);

describe('ReviewController Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockResponse.status.mockReturnValue(mockResponse);
  });

  test('createReview 테스트 (정상)', async () => {
    const requestBody = {
      contents: 'test content review',
      stars: 5,
      reviewImage: 'test review img1',
    };
    const orderId = 1;
    const userId = 1;

    mockRequest.body = requestBody;
    mockRequest.params = { orderId };
    mockRequest.user = { userId };

    const responseBody = {
      userId: 1,
      storeId: 1,
      orderId: 1,
      stars: 5,
      contents: 'test content review',
      reviewImage: 'test review img',
      createdAt: '2024-02-02T10:59:39.199Z',
      updatedAt: '2024-02-02T11:50:34.797Z',
    };

    mockReviewService.createReview.mockReturnValue(responseBody);
    await reviewController.createReview(mockRequest, mockResponse, mockNext);
    expect(mockReviewService.createReview).toHaveBeenCalledWith(
      userId,
      orderId,
      requestBody.contents,
      requestBody.stars,
      requestBody.reviewImage
    );
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: responseBody,
      message: '리뷰가 작성되었습니다.',
    });
  });
  test('updateReview 테스트 (정상)', async () => {
    const requestBody = {
      contents: 'test content review',
      stars: 5,
      reviewImage: 'test review img1',
    };
    const reviewId = 1;
    const userId = 1;

    mockRequest.body = requestBody;
    mockRequest.params = { reviewId };
    mockRequest.user = { userId };

    const responseBody = {
      userId: 1,
      storeId: 1,
      orderId: 1,
      stars: 3,
      contents: 'test content updateReview',
      reviewImage: 'test review updateImg',
      createdAt: '2024-02-02T10:59:39.199Z',
      updatedAt: '2024-02-02T11:50:34.797Z',
    };

    mockReviewService.updateReview.mockReturnValue(responseBody);
    await reviewController.updateReview(mockRequest, mockResponse, mockNext);
    expect(mockReviewService.updateReview).toHaveBeenCalledWith(
      userId,
      reviewId,
      requestBody.contents,
      requestBody.stars,
      requestBody.reviewImage
    );
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: responseBody,
      message: '리뷰 수정이 완료되었습니다.',
    });
  });

  test('deleteReview 테스트 (정상)', async () => {
    const reviewId = 1;
    const userId = 1;

    mockRequest.params = { reviewId };
    mockRequest.user = { userId };

    await reviewController.deleteReview(mockRequest, mockResponse, mockNext);
    expect(mockReviewService.deleteReview).toHaveBeenCalledWith(
      userId,
      reviewId
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: '리뷰가 삭제되었습니다.',
    });
  });

  it('getReview 테스트 (정상)', async () => {
    // Setup
    const userId = 1;
    //mockRequest.query = { userId };
    mockRequest.user = userId;

    const responseBody = [
      {
        reviewId: 1,
        storeId: 1,
        reviewContent: 'reviewContent',
        rating: 4,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      },
      {
        reviewId: 2,
        storeId: 1,
        reviewContent: 'reviewContent',
        rating: 5,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      },
    ];

    mockReviewService.getReview.mockReturnValue(responseBody);

    // Execute
    await reviewController.getReview(mockRequest, mockResponse, mockNext);

    // Verify
    expect(mockReviewService.getReview).toHaveBeenCalledWith(
      mockRequest.user.userId
    );
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({ data: responseBody });
  });

  // it('getReviewByStoreId', async () => {
  //   // Setup
  //   const storeId = 1;
  //   const responseBody = [
  //     {
  //       reviewId: 1,
  //       storeId: 1,
  //       reviewContent: 'reviewContent',
  //       rating: 4,
  //       createdAt: new Date().toString(),
  //       updatedAt: new Date().toString(),
  //     },
  //     {
  //       reviewId: 2,
  //       storeId: 1,
  //       reviewContent: 'reviewContent',
  //       rating: 5,
  //       createdAt: new Date().toString(),
  //       updatedAt: new Date().toString(),
  //     },
  //   ];

  //   mockRequest.query = { storeId };

  //   mockReviewService.getReviewByStoreId.mockReturnValue(responseBody);

  //   // Execute
  //   await reviewController.getReviewByStoreId(
  //     mockRequest,
  //     mockResponse,
  //     mockNext
  //   );

  //   // Verify
  //   expect(mockReviewService.getReviewByStoreId).toHaveBeenCalledWith(storeId);
  //   expect(mockResponse.status).toHaveBeenCalledWith(201);
  //   expect(mockResponse.json).toHaveBeenCalledWith({ data: responseBody });
  // });
});
