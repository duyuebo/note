import ApiService from "@/core/services/ApiService";
import RestfulService from "@/core/services/RestfulService";

class SysMenuService extends RestfulService {
  constructor() {
    super("/sso/menu");
  }
  currentMenu() {
    return ApiService.get(this.moduleUrl, "current");
  }
  listInUse() {
    return ApiService.get(this.moduleUrl, "in-use");
  }
}

const SysMenuServiceImpl = new SysMenuService();

export default SysMenuServiceImpl;
