import React from 'react';
import { Button, Col, Form, Input, Row, Table, Select } from 'antd';
import { useAntdTable } from 'ahooks';
// import { PaginatedParams } from 'ahooks/lib/useAntdTable';

const { Option } = Select;

interface Item {
  name: {
    last: string;
  };
  email: string;
  phone: string;
  gender: 'male' | 'female';
}

interface Result {
  total: number;
  list: Item[];
}

const getTableData = (
  { current, pageSize }: any,
  formData: any,
): Promise<Result> => {
  let query = `page=${current}&size=${pageSize}`;
  Object.entries(formData).forEach(([key, value]) => {
    if (value) {
      query += `&${key}=${value}`;
    }
  });

  return fetch(`https://randomuser.me/api?results=55&${query}`)
    .then((res) => res.json())
    .then((res) => ({
      total: res.info.results,
      list: res.results,
    }));
};

export default () => {
  const [form] = Form.useForm();

  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize: 5,
    form,
  });
  tableProps.pagination.showTotal = (total: number, range: number[]) =>
    `第${range[0]}-${range[1]}条 / 总共 ${total} 条`;
  // console.log('tableProps, search', tableProps, search);

  const { type, submit, reset } = search;

  const columns = [
    {
      title: 'name',
      dataIndex: ['name', 'last'],
    },
    {
      title: 'email',
      dataIndex: 'email',
    },
    {
      title: 'phone',
      dataIndex: 'phone',
    },
    {
      title: 'gender',
      dataIndex: 'gender',
    },
  ];

  const advanceSearchForm = (
    <div>
      <Form form={form}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="name" name="name">
              <Input placeholder="name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="email" name="email">
              <Input placeholder="email" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="phone" name="phone">
              <Input placeholder="phone" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" onClick={submit}>
              Search
            </Button>
            <Button onClick={reset} style={{ marginLeft: 16 }}>
              Reset
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </div>
  );

  const searchForm = (
    <div style={{ marginBottom: 16 }}>
      <Form
        form={form}
        style={{ display: 'flex', justifyContent: 'flex-start' }}
      >
        <Form.Item name="gender">
          <Select style={{ width: 120, marginRight: 16 }} onChange={submit}>
            <Option value="">all</Option>
            <Option value="male">male</Option>
            <Option value="female">female</Option>
          </Select>
        </Form.Item>
        <Form.Item name="name">
          <Input.Search
            placeholder="enter name"
            style={{ width: 240 }}
            onSearch={submit}
          />
        </Form.Item>
      </Form>
    </div>
  );

  return (
    <div>
      {type === 'simple' ? searchForm : advanceSearchForm}
      <Table
        columns={columns}
        rowKey="email"
        {...tableProps}
        tableLayout="auto"
        showSorterTooltip={true}
        bordered
        scroll={{ y: 550 }}
      />
    </div>
  );
};
