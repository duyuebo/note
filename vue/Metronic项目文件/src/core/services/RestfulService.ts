import type { AxiosResponse } from "axios";
import ApiService from "@/core/services/ApiService";
import type { IQueryCondition } from "@/core/services/SystemType";

export default class RestfulService {
  moduleUrl: string;

  constructor(moduleUrl: string) {
    this.moduleUrl = moduleUrl;
  }

  get(id: string): Promise<AxiosResponse> {
    return ApiService.get(this.moduleUrl, id);
  }

  delete(id: number): Promise<AxiosResponse> {
    return ApiService.delete(`${this.moduleUrl}/${id}`);
  }

  save(data): Promise<AxiosResponse> {
    const params = {
      ...data,
    };
    return ApiService.post(this.moduleUrl, params);
  }

  update(data): Promise<AxiosResponse> {
    const params = {
      ...data,
    };
    return ApiService.put(this.moduleUrl, params);
  }

  list(): Promise<AxiosResponse> {
    return ApiService.query(this.moduleUrl, {});
  }

  pageQuery(data: IQueryCondition): Promise<AxiosResponse> {
    const params = {
      ...data,
    };
    // return ApiService.post(`receipt-self/query`, params);
    return ApiService.post(`${this.moduleUrl}/query`, params);
  }
}
