export function errorHandler(err, req, res, next) {
	if (err instanceof ApiError) {
		return res.status(err.status).json({ message: err.message });
	}

	return res
		.status(500)
		.json({ message: '서버 내부 오류가 발생했습니다.' + err.message });
}

export class ApiError extends Error {
	constructor(status, message) {
		super(message);
		this.status = status;
	}
}
