import "./TaskTrackCard.css"
import {CalendarOutlined} from "@ant-design/icons";
import dayjs from 'dayjs';

const TaskTrackerCard = ({ form, title, content, date,id,status, customClassNames, openMethod}) => {
    // 固定的类名
    const fixedClassNames = ['task_tracker_card','pointer'];
    const showModal = () => {
        openMethod(true);
        form.setFieldsValue({
            task_id:id,
            task_name:title,
            task_status:status,
            task_content:content,
            task_date:dayjs(date, 'YYYY-MM-DD')
        })
        console.log(id)

    };

    // 合并传入的类名和固定的类名
    const classNames = [...fixedClassNames, customClassNames || []];

    return (
        <div className={classNames.join(' ')} onClick={showModal}>
            <h4>{title}</h4>
            <div className="content">{content}</div>
            <div className="date">
                <CalendarOutlined />&nbsp;
                {date}</div>
        </div>
    );
};

export default TaskTrackerCard;
