import { Op } from "sequelize";
import ActivityLog from "../models/activity_log.js"
import moment from "moment";

export default {
    createActivity: async (activity_obj) => {
        if (!activity_obj.data || !activity_obj.message || !activity_obj.user_id || !activity_obj.url) {
            return false;
        }
        await ActivityLog.create(activity_obj);
        return true;
    },
    deleteActivity: async () => {
        // Calculate the date 90 days ago
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        await ActivityLog.destroy({
            where: {
                createdAt: {
                    [Op.lte]: ninetyDaysAgo
                }
            }
        });
    },
    getDateTime: (datetime, time=false)=> {
        let utc_datetime = moment(datetime).utcOffset(0);
        const utc_offset = moment().format('Z');
        let offset_datetime = utc_datetime.utcOffset(utc_offset);
        if(time){
            return offset_datetime.format('DD/MM/YY HH:mm');
        }
        return offset_datetime.format('DD/MM/YY');

    }
}