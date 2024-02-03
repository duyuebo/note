import {
    type IArticle, type IKTIcon, type Btn,
    Article,
} from "@/components/article/Article";
import type { ISysNotification } from "@/core/services/system/SysNotificationService";
import type { ISysFeedback } from "@/core/services/system/SysFeedbackService";

class ArticleUtils {
    static notification2Article = (notificationList: ISysNotification[], btns: Btn[] = []): IArticle[] => {
        return notificationList.map((item) => {
            let extraSvg = "";
            if (item.isRead === 0) {
                extraSvg = "media/svg/custom/unread.svg";
            } else {
                extraSvg = "media/svg/custom/readed.svg";
            }
            const tags = [item.dictModuleName];
            return new Article(item.id!, item.title, [], tags, extraSvg, item.content, item.contentSummary!, item.creatorName, item.creatorAvatar!, item.dtCreate!, btns);
        });
    }

    static feedback2Article = (feedbackList: ISysFeedback[]): IArticle[] => {
        return feedbackList.map((item) => {
            let extraSvg = "";
            let icons: IKTIcon[] = [];
            if (item.isReply === 0) {
                icons = [{
                    tooltip: "未回复",
                    name: "information-5",
                    class: "text-primary"
                }];
            } else {
                icons = [{
                    tooltip: "已回复",
                    name: "check-circle",
                    class: "text-success"
                }];
            }
            const tags = [item.moduleName];
            return new Article(item.id!, item.title, icons, tags, extraSvg, item.content, item.contentSummary!, item.creatorName, item.creatorAvatar!, item.dtCreate!);
        });
    }
}

export default ArticleUtils;