import "./TaskTrackCard.css"
import {CalendarOutlined} from "@ant-design/icons";
import dayjs from 'dayjs';

const TaskTrackerCard = ({ form, task, customClassNames, openMethod}) => {
    // 固定的类名
    const fixedClassNames = ['task_tracker_card','pointer'];
    const showModal = () => {
        openMethod(true);
        form.setFieldsValue({
            task_id:task.id,
            task_name:task.task_name,
            task_status:task.task_status,
            task_content:task.task_content,
            task_date:dayjs(task.task_date, 'YYYY-MM-DD'),
            task_additional_text: task.task_additional_text
        })
    };

    // 合并传入的类名和固定的类名
    const classNames = [...fixedClassNames, customClassNames || []];

    return (
        <div className={classNames.join(' ')} onClick={showModal}>
            <h4 dangerouslySetInnerHTML={{ __html: task.task_name_html?task.task_name_html:task.task_name}}></h4>
            <div className="content" dangerouslySetInnerHTML={{ __html: task.task_content_html?task.task_content_html:task.task_content}}></div>
            <div className="date">
                <CalendarOutlined />&nbsp;
                {task.task_date}</div>
        </div>
    );
};

export default TaskTrackerCard;
