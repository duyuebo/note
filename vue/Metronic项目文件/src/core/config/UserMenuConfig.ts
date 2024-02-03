import MenuService from "@/core/services/sso/SysMenuService";
import JwtService from "@/core/services/JwtService";
import type { IMenuItem } from "@/core/config/SystemType";
let userMenus: IMenuItem[] | null;

const getUserMenu = async () => {
  if (!JwtService.getUserMenu()) {
    const response = await MenuService.currentSystemMenu();
    userMenus = JSON.parse(response.data.obj.metronicMenuJson);
    JwtService.saveUserMenu(response.data.obj.metronicMenuJson);
    JwtService.saveUserMenuFunc(response.data.obj.funcCodeList);
  } else {
    userMenus = JSON.parse(JwtService.getUserMenu()!);
  }
  return userMenus;
};

export default getUserMenu;
