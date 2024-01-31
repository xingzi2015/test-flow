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

    function searchTask(status,editMethod) {
        fetch('http://localhost:8888/api/tasks_db', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sql: 'SELECT id, task_name, task_content,  strftime(\'%Y-%m-%d\', task_date) as task_date,task_status FROM task_tracker WHERE task_status = ?',
                params: [status],
            }),
        })
            .then(response => response.json())
            .then(editMethod)
            .catch(error => console.error('Error fetching tasks:', error));
    }

    function refresh(){
        searchTask(1,data=>setTodoTasks(data))
        searchTask(2,data=>setDoingTasks(data))
        searchTask(3,data=>setFinishTasks(data))
    }

    useEffect(() => {
        // 使用 fetch 发起 POST 请求
        refresh()
    }, []);

    return (
        <div className='main_bar'>
            <h2>测试任务跟踪</h2>
            <div className="main_button">
                <div className="search_bar"><Search  placeholder="input search text" onSearch="" enterButton /></div>
                <TaskTrackDialogue form={form} refreshMethod={refresh} openStatus={[open, setOpen]} ></TaskTrackDialogue>
                {/*<Button type="primary">增加事项</Button>*/}
            </div>

            <div>
                <Row>
                    <Col span={8}>
                        <h3 className="sub_title">待办事项</h3>
                        {todoTasks.map(task => (
                            <TaskTrackerCard form={form} title={task.task_name} content={task.task_content} date={task.task_date} id={task.id} status={task.task_status} openMethod={setOpen} customClassNames="crimson"/>
                        ))}
                    </Col>

                    <Col span={8}>
                        <h3 className="sub_title">进行中</h3>
                        {doingTasks.map(task => (
                            <TaskTrackerCard form={form} title={task.task_name} content={task.task_content} date={task.task_date} id={task.id} status={task.task_status} openMethod={setOpen} customClassNames="orange"/>
                        ))}
                    </Col>

                    <Col span={8}>
                        <h3 className="sub_title">完成</h3>
                        {finishTasks.map(task => (
                            <TaskTrackerCard form={form}  title={task.task_name} content={task.task_content} date={task.task_date} id={task.id} status={task.task_status} openMethod={setOpen} customClassNames="darkgreen"/>
                        ))}
                    </Col>

                </Row>
            </div>
        </div>
    );
};

export default TaskTracker;
