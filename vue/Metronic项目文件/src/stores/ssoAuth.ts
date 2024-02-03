import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";
import type { User } from "@/core/config/SystemObject";
import SysEmployeeService from "@/core/services/sso/SysEmployeeService";

export const ssoAuthStore = defineStore(
  "ssoAuth",
  () => {
    const errors = ref({});
    const user = ref<User>({} as User);
    const isAuthenticated = ref(!!JwtService.getToken());

    function login(token: string) {
      JwtService.saveToken(token);
      ApiService.setHeader();
      return SysEmployeeService.getCurrent()
        .then(({ data }) => {
          setAuth(data.obj);
        })
        .catch(({ response }) => {
          setError(["登录异常"]);
        });
    }

    function setAuth(authUser: User) {
      isAuthenticated.value = true;
      user.value = authUser;

      errors.value = {};
    }

    function setError(error: any) {
      errors.value = { ...error };
    }

    function purgeAuth() {
      isAuthenticated.value = false;
      user.value = {} as User;
      errors.value = [];
      JwtService.destroyToken();
      JwtService.destroyUserMenu();
    }

    // function login(
    //   username: string,
    //   password: string,
    //   captchaVerification: string
    // ) {
    //   return ApiService.post("login", {
    //     username,
    //     password,
    //     captchaVerification,
    //   })
    //     .then(({ data }) => {
    //       setAuth(data.obj);
    //     })
    //     .catch(({ response }) => {
    //       setError(["登录异常"]);
    //     });
    // }

    function logout() {
      purgeAuth();
    }

    function register(credentials: User) {
      return ApiService.post("register", credentials)
        .then(({ data }) => {
          setAuth(data);
        })
        .catch(({ response }) => {
          setError(response.data.errors);
        });
    }

    function getForgotPwdCaptcha(data) {
      return ApiService.post("login/getChangePwdSmsCaptcha", data)
        .then(() => {
          setError({});
        })
        .catch(({ response }) => {
          setError(response.data.errors);
        });
    }

    function forgotPassword(data) {
      return ApiService.post("login/changePwd", data)
        .then(() => {
          setError({});
        })
        .catch(({ response }) => {
          setError(response.data.errors);
        });
    }

    function verifyAuth() {
      if (JwtService.getToken()) {
        ApiService.setHeader();
        ApiService.post("verify_token", { api_token: JwtService.getToken() })
          .then(({ data }) => {
            setAuth(data);
          })
          .catch(({ response }) => {
            setError(response.data.errors);
            purgeAuth();
          });
      } else {
        purgeAuth();
      }
    }

    return {
      errors,
      user,
      isAuthenticated,
      login,
      logout,
      register,
      getForgotPwdCaptcha,
      forgotPassword,
      verifyAuth,
    };
  },
  { persist: { storage: sessionStorage } }
);
