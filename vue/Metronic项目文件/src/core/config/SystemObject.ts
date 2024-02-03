export interface User {
  username: string;
  phone: string;
  token: string;
  avatar: string;
  isChangePwd: number;
  roleIds: Array<number>;
}
