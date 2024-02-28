export class MainController {
  constructor(mainService) {
    this.mainService = mainService;
  }

  /** 메인 페이지에서 메뉴 검색 */
  searchMenu = async (req, res, next) => {
    try {
      const { searchWord } = req.query;
      const searchedStores = await this.mainService.searchMenu(searchWord);
      return res.status(200).json({ searchedStores });
    } catch (err) {
      next(err);
    }
  };

  /** 메인 페이지에서 업장 목록 조회 */
  getAllStores = async (req, res, next) => {
    try {
      const stores = await this.mainService.getAllStores();
      return res.status(200).json({ stores });
    } catch (err) {
      next(err);
    }
  };

  /** 메인 페이지에서 업장 목록 정렬 */
  sortStores = async (req, res, next) => {
    try {
      const { orderKey, orderValue } = req.query;
      const sortedStores = await this.mainService.sortStores(
        orderKey,
        orderValue
      );
      return res.status(200).json({ sortedStores });
    } catch (err) {
      next(err);
    }
  };
}
