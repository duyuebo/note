import moment from "moment";
const formatDate = (date: Date) => {
  if (date) return moment(date).format("YYYY-MM-DD");
  else {
    return "";
  }
};

const formatDateTime = (date: Date) => {
  if (date) return moment(date).format("YYYY-MM-DD HH:mm");
  else {
    return "";
  }
};

const formatMoney = (money: number) => {
  if (money) return Number(money).toFixed(2);
  else {
    return "";
  }
};

const calculateAge = (date: Date) => {
  if (date) return moment().diff(moment(date), "years") + 1;
  else {
    return "";
  }
};

const formatArticleShowTime = (articleTime: Date | undefined): string => {
  if (!articleTime) {
    return "";
  }
  articleTime = new Date(articleTime);
  const now = new Date();
  const timeDiff = Math.abs(now.getTime() - articleTime.getTime());
  const minutes = Math.floor((timeDiff / (1000 * 60)));

  const articleYear = moment(articleTime).format("YYYY");
  const nowYear = moment(now).format("YYYY");
  if (minutes < 60) {//1小时内
    return minutes + "分钟前";
  } else if (minutes >= 60 && minutes < 60 * 24) {//大于1小时小于24小时
    const hour = Math.floor(minutes / 60);
    return hour + "小时前";
  } else if (minutes >= 60 * 24 && articleYear === nowYear) {
    return moment(articleTime).format("MM-DD");
  } else {
    return moment(articleTime).format("YYYY-MM-DD");
  }
}


/**
 * 根据参数name获取地址栏的参数
 * @param name 地址栏参数的key
 * @returns key对用的值
 */
export function getQueryString(name: string) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')

  const search = window.location.hash.split("?")[1];
  const r = search.match(reg)

  if (r != null) {
    return decodeURIComponent(r[2])
  }

  return null
}



export { formatDate, formatDateTime, calculateAge, formatMoney, formatArticleShowTime };
