import ApiService from "@/core/services/ApiService";
import RestfulService from "@/core/services/RestfulService";

class SysEmployeeService extends RestfulService {
  constructor() {
    super("/sso/employee");
  }

  getCurrent() {
    return ApiService.get(`${this.moduleUrl}`, "current");
  }
}

const SysEmployeeServiceImpl = new SysEmployeeService();

interface SysEmployee {
  id?: number;
  name: string;
  phone: string;
  password?: string;
  avatar?: string;
  status: number;
  departmentId?: number;
  departmentName?: string;
  ddBirthday?: string;
  dtLastLogin?: Date;
  lastLoginIp?: string;
}

function initSysEmployeeVal(): SysEmployee {
  return {
    name: "",
    phone: "",
    status: 1,
  };
}

const SysEmployeeValidRules = {
  departmentId: [
    {
      required: true,
      message: "请选择部门",
      trigger: "change",
    },
  ],
  name: [
    {
      required: true,
      message: "员工名称必填",
      trigger: "blur",
    },
  ],
  phone: [
    {
      required: true,
      message: "11位手机号码必填",
      trigger: "blur",
    },
    {
      min: 11,
      max: 11,
      message: "手机号码为11位",
      trigger: "blur",
    },
  ],
};
export default SysEmployeeServiceImpl;
export { type SysEmployee, initSysEmployeeVal, SysEmployeeValidRules };
