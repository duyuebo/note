import JwtService from "@/core/services/JwtService";

const judgeHasThisCodeRight = (code: string) => {
  const funcCodesStr = JwtService.getUserMenuFunc();
  if (funcCodesStr) {
    const funcCodes = funcCodesStr.split(",");
    return funcCodes.find((funcCode) => funcCode === code) === undefined
      ? false
      : true;
  }
  return false;
};


export { judgeHasThisCodeRight };