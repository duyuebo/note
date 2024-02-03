import { ElMessage } from "element-plus";
import Swal from "sweetalert2/dist/sweetalert2.js";

const errorAlert = (msg: string) => {
  ElMessage({
    showClose: true,
    message: msg,
    type: "error",
  });
};

const successAlert = (msg: string) => {
  ElMessage.success(msg);
};
// const confirmResult = await
const confirmAlert = (msg: string, confirmBtnMsg: string = "删除！") => {
  return Swal.fire({
    title: msg,
    text: "",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "取消",
    confirmButtonText: confirmBtnMsg,
    reverseButtons: true,
  });
};

export { errorAlert, successAlert, confirmAlert };
