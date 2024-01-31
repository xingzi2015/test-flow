import React, {useState} from 'react';
import {Button, DatePicker, Form, Input, Modal, Radio, message} from 'antd';
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
//task_name,task_status,task_content,task_date,date_additional_text
const TaskTrackDialogue = ({refreshMethod, openStatus, form}) => {
    const [open, setOpen] = openStatus;
    const [confirmLoading, setConfirmLoading] = useState(false);
    const showModal = () => {
        form.setFieldsValue({
            task_id:null,
            task_name:"",
            task_status:null,
            task_content:"",
            task_date:null
        })
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);

        // 执行手动提交逻辑
        form
            .validateFields()
            .then((values) => {
                console.log(values)
                submitAsync(values,(response)=>{
                    console.log(response)
                    if(response.ok){
                        setConfirmLoading(false);
                        setOpen(false);
                        message.info("提交成功");
                        refreshMethod();
                    }else {
                        message.error(response.statusText);
                        setConfirmLoading(false);
                    }

                });

            })
            .catch((errorInfo) => {
                console.log('Validation failed:', errorInfo);
                setConfirmLoading(false);
            });
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    const submitAsync = async (values,call_back_method) => {
        try {
            // 发起 PUT 请求到后端
            const response = await fetch('http://localhost:8888/api/tasks_db', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            call_back_method(response)

            if (response.ok) {
                console.log('Data successfully submitted to the backend.');
                // 执行外部的 onSubmit 回调
            } else {
                console.error('Failed to submit data to the backend.');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                增加事项
            </Button>
            <Modal
                title="新增事项"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <Form
                    form={form}
                    name="create_task_track"
                    labelCol={{
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 600,
                        paddingTop: 20
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item name="task_id" hidden={true}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="事项名称"
                        name="task_name"
                        rules={[
                            {
                                required: true,
                                message: '写入事项名称',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item label="事项类型"
                               name="task_status"
                               rules={[
                                   {
                                       required: true,
                                       message: 'Please input your username!',
                                   },
                               ]}>
                        <Radio.Group name="task_status" rules={[
                            {
                                required: true
                            },
                        ]}>
                            <Radio value={1}>待办事项</Radio>
                            <Radio value={2}>进行中事项</Radio>
                            <Radio value={3}>完成事项</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="事项描述"
                        name="task_content"
                        rules={[
                            {
                                required: true,
                                message: '写入事项描述，每个换行视为一项',
                            },
                        ]}
                    >
                        <TextArea/>
                    </Form.Item>
                    <Form.Item label="截止日期" name="task_date" rules={[
                        {
                            required: true
                        },
                    ]}>
                        <DatePicker/>
                    </Form.Item>
                    <Form.Item
                        label="附加信息"
                        name="task_additional_text"
                        rules={[
                            {
                                required: false,
                                message: '写入附加信息，每个换行视为一项',
                            },
                        ]}
                    >
                        <TextArea/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default TaskTrackDialogue;