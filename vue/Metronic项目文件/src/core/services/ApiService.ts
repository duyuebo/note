import type { App } from "vue";
import type { AxiosResponse } from "axios";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/core/services/JwtService";
import router from "@/router";
import { ElLoading, ElMessage } from "element-plus";
import JSONbig from "json-bigint";

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description property to share vue instance
   */
  public static vueInstance: App;

  public static loadingInstance;

  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    const JSONbigToString = JSONbig({ storeAsString: true });
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    ApiService.vueInstance.axios.defaults.baseURL =
      import.meta.env.VITE_APP_API_URL;
    ApiService.vueInstance.axios.defaults.transformResponse = [
      function (data) {
        return JSONbigToString.parse(data);
      },
    ];
    ApiService.vueInstance.axios.interceptors.request.use((config) => {
      if (JwtService.getToken() != null) {
        config.headers["Authorization"] = `Bearer ${JwtService.getToken()}`;
      }
      ApiService.loadingInstance = ElLoading.service({ fullscreen: true });
      return config;
    });
    ApiService.vueInstance.axios.interceptors.response.use(
      (response) => {
        setTimeout(() => {
          ApiService.loadingInstance.close();
        }, 500);
        //不拦截blob类型数据
        if (response.config.responseType == "blob") {
          return response;
        }
        // dataAxios 是 axios 返回数据中的 data
        const dataAxios = response.data;
        // 这个状态码是和后端约定的
        const status = dataAxios.status;
        // 根据 code 进行判断
        if (status === 1) {
          // return Promise.resolve(dataAxios.obj);
          return response;
        } else if (status === -1) {
          //token校验失败，转到登录页
          ElMessage.error(dataAxios.message);
          router.replace({ name: "sign-in" });
          // 抛出错误，在 axios.().catch(err) 中可以获取回调数据
          // return Promise.reject(dataAxios);
        } else {
          ElMessage.error(dataAxios.message);
          // router.replace({ name: "sign-in" });
          // 抛出错误，在 axios.().catch(err) 中可以获取回调数据
          return Promise.reject(dataAxios);
        }
      },
      (error) => {
        setTimeout(() => {
          ApiService.loadingInstance.close();
        }, 500);
        ElMessage.error(error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * @description set the default HTTP request headers
   */
  public static setHeader(): void {
    ApiService.vueInstance.axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${JwtService.getToken()}`;
    ApiService.vueInstance.axios.defaults.headers.common["Accept"] =
      "application/json";
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static query(resource: string, params: any): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(resource, params);
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param slug: string
   * @returns Promise<AxiosResponse>
   */
  public static get(
    resource: string,
    slug = "" as string
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(`${resource}/${slug}`);
  }

  /**
   * @description set the POST HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static post(resource: string, params: any): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.post(`${resource}`, params);
  }

  /**
   * @description send the UPDATE HTTP request
   * @param resource: string
   * @param slug: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static update(
    resource: string,
    slug: string,
    params: any
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}/${slug}`, params);
  }

  /**
   * @description Send the PUT HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static put(resource: string, params: any): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}`, params);
  }

  /**
   * @description Send the DELETE HTTP request
   * @param resource: string
   * @returns Promise<AxiosResponse>
   */
  public static delete(resource: string): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.delete(resource);
  }

  // public static uploadImg(file: Blob): Promise<AxiosResponse> {
  //   const data = new FormData();
  //   data.append('file', file);
  //   return ApiService.vueInstance.axios.post("/file/ckeditor5/img/upload", data,{
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     }
  //   });
  // }
}

export default ApiService;
