import React, {useState, useEffect} from 'react';
import {Button, Col, Form, Row} from 'antd';
import TaskTrackerCard from './widgets/TaskTrackCard';
import "./css/TaskTracker.css"
import Search from "antd/es/input/Search";
import TaskTrackDialogue from "./widgets/TaskTrackDialogue";

const TaskTracker = () => {
    const [todoTasks, setTodoTasks] = useState([]);
    const [doingTasks, setDoingTasks] = useState([]);
    const [finishTasks, setFinishTasks] = useState([]);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    let searchKeyword=''

    function searchTask(status,editMethod) {
        fetch('http://localhost:8888/api/tasks_db', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sql: 'SELECT id, task_name, task_content,  strftime(\'%Y-%m-%d\', task_date) as task_date,task_status,task_additional_text FROM task_tracker WHERE task_status = ?',
                params: [status],
            }),
        })
            .then(response => response.json())
            .then(editMethod)
            .catch(error => console.error('Error fetching tasks:', error));
    }

    function refresh(){
        searchTask(1,data=>setTodoTasks(data));
        searchTask(2,data=>setDoingTasks(data));
        searchTask(3,data=>setFinishTasks(data));


    }
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        searchKeyword=value
        searchTask(1,data=> processTasks(data,setTodoTasks));
        searchTask(2,data=>processTasks(data,setDoingTasks));
        searchTask(3,data=> processTasks(data,setFinishTasks));
    }

    // 更新和删除任务的通用函数
    const processTasks = (tasks, setTasks) => {
        if (searchKeyword === '' || !searchKeyword) {
            // 如果搜索关键字为空，不执行后续操作
            setTasks(tasks);
        }

        const updatedTasks = tasks.map(task => {
            // eslint-disable-next-line no-mixed-operators
            if (task.task_name && task.task_name.includes(searchKeyword) || task.task_content && task.task_content.includes(searchKeyword)) {
                // 如果title或content包含搜索关键字，更新字段为高亮
                return { ...task, task_name:task.task_name, task_content:task.task_content, task_name_html: highlightKeyword(task.task_name), task_content_html: highlightKeyword(task.task_content) };
            } else {
                // 否则删除该数组
                return null;
            }
        }).filter(Boolean); // 过滤掉为null的数组，即删除不匹配项
        setTasks(updatedTasks);
    };

    // 辅助函数，用于在字符串中高亮匹配的关键字
    const highlightKeyword = (text) => {
        const regex = new RegExp(searchKeyword, 'gi');
        return text.replace(regex, match => `<span class="highlight">${match}</span>`);
    };

    useEffect(() => {
        // 使用 fetch 发起 POST 请求
        refresh()
    }, []);

    return (
        <div className='main_bar'>
            <h2>测试任务跟踪</h2>
            <div className="main_button">
                <div className="search_bar"><Search  placeholder="input search text" onSearch={onSearch} enterButton /></div>
                <TaskTrackDialogue form={form} refreshMethod={refresh} openStatus={[open, setOpen]} ></TaskTrackDialogue>
                {/*<Button type="primary">增加事项</Button>*/}
            </div>
            <div>
                <Row>
                    <Col span={8}>
                        <h3 className="sub_title">待办事项</h3>
                        {todoTasks.map(task => (
                            <TaskTrackerCard form={form} task={task} openMethod={setOpen} customClassNames="crimson"/>
                        ))}
                    </Col>

                    <Col span={8}>
                        <h3 className="sub_title">进行中</h3>
                        {doingTasks.map(task => (
                            <TaskTrackerCard form={form} task={task}  openMethod={setOpen} customClassNames="orange"/>
                        ))}
                    </Col>

                    <Col span={8}>
                        <h3 className="sub_title">完成</h3>
                        {finishTasks.map(task => (
                            <TaskTrackerCard form={form}  task={task}  openMethod={setOpen} customClassNames="darkgreen"/>
                        ))}
                    </Col>

                </Row>
            </div>
        </div>
    );
};

export default TaskTracker;
