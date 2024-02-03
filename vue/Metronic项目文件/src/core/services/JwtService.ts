const ID_TOKEN_KEY = "id_token" as string;
const ID_MENU_KEY = "menu" as string;
const ID_FUNC_KEY = "func" as string;

/**
 * @description get token form localStorage
 */
export const getToken = (): string | null => {
  return window.sessionStorage.getItem(ID_TOKEN_KEY);
};

/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveToken = (token: string): void => {
  window.sessionStorage.setItem(ID_TOKEN_KEY, token);
};

/**
 * @description remove token form localStorage
 */
export const destroyToken = (): void => {
  window.sessionStorage.removeItem(ID_TOKEN_KEY);
};

export const saveUserMenu = (menu: string): void => {
  window.sessionStorage.setItem(ID_MENU_KEY, menu);
};

export const getUserMenu = (): string | null => {
  return window.sessionStorage.getItem(ID_MENU_KEY);
};

export const destroyUserMenu = (): void => {
  window.sessionStorage.removeItem(ID_MENU_KEY);
  destroyMenuFunc();
};

export const saveUserMenuFunc = (func: string): void => {
  window.sessionStorage.setItem(ID_FUNC_KEY, func);
};

export const getUserMenuFunc = (): string | null => {
  return window.sessionStorage.getItem(ID_FUNC_KEY);
};

export const destroyMenuFunc = (): void => {
  window.sessionStorage.removeItem(ID_FUNC_KEY);
};

export default {
  getToken,
  saveToken,
  destroyToken,
  saveUserMenu,
  getUserMenu,
  destroyUserMenu,
  saveUserMenuFunc,
  getUserMenuFunc,
  destroyMenuFunc,
};
