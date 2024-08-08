import { useState } from 'react';
import { Row, Col } from 'antd';
import FilterForm from '../Filter/FilterForm';
import PromptPanel from '../PromptPanel/PromptPanel';

const Home = () => {
  const [savedFilters, setSavedFilters] = useState(null);

  const handleSaveFilters = (filters) => {
    setSavedFilters(filters);
  };

  const handleSubmit = (data) => {
    console.log('Submitted data:', data);
  };

  return (
    <Row gutter={16}>
      <Col span={12}>
        <FilterForm onSave={handleSaveFilters} />
      </Col>
      <Col span={12}>
        <PromptPanel filters={savedFilters} onSubmit={handleSubmit} />
      </Col>
    </Row>
  );
};

export default Home;